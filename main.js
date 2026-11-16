// Gymi-Trainer ZH – Electron-Hauptprozess
// Aufgaben: Fenster, lokales Speichern, PDF-Download der offiziellen Prüfungen,
// Rechtschreibprüfung (Hunspell, offline), optionale Web-Abfragen (nur Positivliste).
const { app, BrowserWindow, ipcMain, protocol, net, shell, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const { pathToFileURL } = require('url');

const APP_DIR = path.join(__dirname, 'app');
let win = null;

// Linux: Vorlesen über speech-dispatcher erlauben (Chromium schaltet es sonst ab)
if (process.platform === 'linux') app.commandLine.appendSwitch('enable-speech-dispatcher');

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }
]);

const dataDir = () => path.join(app.getPath('userData'), 'daten');
const examDir = () => path.join(app.getPath('userData'), 'pruefungen');
const safeName = (s) => String(s).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);

// Nur diese Hosts dürfen aus der App heraus abgefragt werden.
const WEB_HOSTS = new Set(['de.wikipedia.org', 'query.wikidata.org', 'www.wikidata.org', 'tatoeba.org', 'api.languagetool.org']);
const EXAM_HOSTS = new Set(['www.zh.ch', 'zh.ch']);

async function ensureDirs() {
  await fsp.mkdir(dataDir(), { recursive: true });
  await fsp.mkdir(examDir(), { recursive: true });
}

function inside(base, target) {
  const rel = path.relative(base, target);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function registerProtocol() {
  protocol.handle('app', async (request) => {
    try {
      const url = new URL(request.url);
      let base = APP_DIR;
      let rel = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      if (url.hostname === 'pruefung') base = examDir();
      if (!rel) rel = 'index.html';
      const file = path.join(base, rel);
      if (!inside(base, file)) return new Response('Nicht erlaubt', { status: 403 });
      return net.fetch(pathToFileURL(file).toString());
    } catch (e) {
      return new Response('Nicht gefunden', { status: 404 });
    }
  });
}

// ---------- Fensterzustand merken ----------
const winFile = () => path.join(app.getPath('userData'), 'fenster.json');
function loadWinState() {
  try { const st = JSON.parse(fs.readFileSync(winFile(), 'utf8')); if (st && st.width >= 600 && st.height >= 450) return st; } catch (e) { /* erster Start */ }
  return { width: 1320, height: 880 };
}
function onScreen(st) {
  if (st.x == null || st.y == null) return false;
  const { screen } = require('electron');
  return screen.getAllDisplays().some((d) => { const a = d.workArea; return st.x >= a.x - 50 && st.y >= a.y - 50 && st.x + 200 <= a.x + a.width && st.y + 100 <= a.y + a.height; });
}
let saveWinT = null;
function saveWinState() {
  if (!win || win.isDestroyed()) return;
  const b = win.getNormalBounds();
  try { fs.writeFileSync(winFile(), JSON.stringify({ x: b.x, y: b.y, width: b.width, height: b.height, maximized: win.isMaximized() })); } catch (e) { /* egal */ }
}
let busy = null; // Text der Warnung, wenn gerade eine Prüfung läuft

function createWindow() {
  const st = loadWinState();
  win = new BrowserWindow({
    width: st.width, height: st.height, x: onScreen(st) ? st.x : undefined, y: onScreen(st) ? st.y : undefined, minWidth: 900, minHeight: 600,
    backgroundColor: '#fbfcfe', show: false, title: 'Gymi-Trainer ZH', icon: path.join(APP_DIR, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false, sandbox: true, plugins: true, spellcheck: false
    }
  });
  win.once('ready-to-show', () => { if (st.maximized) win.maximize(); win.show(); });
  for (const ev of ['resize', 'move', 'maximize', 'unmaximize']) win.on(ev, () => { clearTimeout(saveWinT); saveWinT = setTimeout(saveWinState, 600); });
  win.on('close', (e) => {
    saveWinState();
    if (busy) {
      const r = dialog.showMessageBoxSync(win, { type: 'warning', buttons: ['Weiterarbeiten', 'Trotzdem beenden'], defaultId: 0, cancelId: 0, title: 'Gymi-Trainer ZH', message: busy, detail: 'Wenn du jetzt beendest, geht die laufende Prüfung verloren.' });
      if (r === 0) { e.preventDefault(); return; }
      busy = null;
    }
  });
  win.loadURL('app://lokal/index.html');
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('app://')) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); }
  });
  win.on('closed', () => { win = null; });
}

function buildMenu() {
  const mac = process.platform === 'darwin';
  const tpl = [
    // macOS: erstes Menü ist das App-Menü (Über, Ausblenden, Beenden mit ⌘Q)
    ...(mac ? [{ label: app.name, submenu: [
      { label: 'Über ' + app.name, role: 'about' }, { type: 'separator' },
      { label: app.name + ' ausblenden', role: 'hide' }, { label: 'Andere ausblenden', role: 'hideOthers' }, { label: 'Alle einblenden', role: 'unhide' },
      { type: 'separator' }, { label: app.name + ' beenden', role: 'quit' } ] }] : []),
    { label: 'Datei', submenu: [
      { label: 'Datenordner öffnen', click: () => shell.openPath(app.getPath('userData')) },
      ...(mac ? [{ type: 'separator' }, { label: 'Fenster schliessen', role: 'close' }] : [{ type: 'separator' }, { label: 'Beenden', role: 'quit' }]) ] },
    { label: 'Bearbeiten', submenu: [
      { label: 'Rückgängig', role: 'undo' }, { label: 'Wiederholen', role: 'redo' }, { type: 'separator' },
      { label: 'Ausschneiden', role: 'cut' }, { label: 'Kopieren', role: 'copy' }, { label: 'Einfügen', role: 'paste' },
      { label: 'Alles auswählen', role: 'selectAll' } ] },
    { label: 'Ansicht', submenu: [
      { label: 'Grösser', role: 'zoomIn', accelerator: 'CmdOrCtrl+=' }, { label: 'Kleiner', role: 'zoomOut' },
      { label: 'Normale Grösse', role: 'resetZoom' }, { type: 'separator' },
      { label: 'Vollbild', role: 'togglefullscreen' }, { label: 'Neu laden', role: 'reload' },
      { label: 'Entwicklerwerkzeuge', role: 'toggleDevTools' } ] },
    { label: 'Hilfe', submenu: [
      { label: 'Hilfe und Prüfungstag', accelerator: process.platform === 'darwin' ? 'Cmd+Shift+/' : 'F1', click: () => { if (win) win.webContents.executeJavaScript("location.hash='#/hilfe'"); } },
      { label: 'Schnellsuche', accelerator: 'CmdOrCtrl+K', click: () => { if (win) win.webContents.executeJavaScript("window.dispatchEvent(new CustomEvent('gymi-suche'))"); } },
      { label: 'Prüfungsarchiv auf zh.ch', click: () => shell.openExternal('https://www.zh.ch/de/bildung/schulen/maturitaetsschule/zentrale-aufnahmepruefung/pruefung-fuer-das-kurzgymnasium.html') } ] }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(tpl));
}

// ---------- Lokaler Speicher (JSON-Dateien) ----------
async function readJson(name) {
  try { return JSON.parse(await fsp.readFile(path.join(dataDir(), safeName(name) + '.json'), 'utf8')); }
  catch (e) { return null; }
}
async function writeJson(name, data) {
  await ensureDirs();
  const file = path.join(dataDir(), safeName(name) + '.json');
  const tmp = file + '.tmp';
  await fsp.writeFile(tmp, JSON.stringify(data), 'utf8');
  await fsp.rename(tmp, file);
  if (/^profil-/.test(name)) backup(safeName(name), file).catch(() => {});
  return true;
}

// ---------- Automatische Sicherung: 1 Kopie pro Profil und Tag, die letzten 14 bleiben ----------
const backupDir = () => path.join(app.getPath('userData'), 'sicherungen');
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
async function backup(name, file) {
  await fsp.mkdir(backupDir(), { recursive: true });
  const target = path.join(backupDir(), name + '_' + today() + '.json');
  try { await fsp.access(target); return; } catch (e) { /* noch keine Sicherung heute */ }
  await fsp.copyFile(file, target);
  const mine = (await fsp.readdir(backupDir())).filter((f) => f.startsWith(name + '_') && f.endsWith('.json')).sort();
  for (const f of mine.slice(0, Math.max(0, mine.length - 14))) await fsp.unlink(path.join(backupDir(), f)).catch(() => {});
}

// ---------- Rechtschreibung (Hunspell, Schweizer Schreibung über ss/ß-Abgleich) ----------
let hun = null, hunFail = false;
async function getHunspell() {
  if (hun || hunFail) return hun;
  try {
    const { loadModule } = require('hunspell-asm');
    const dir = path.join(__dirname, 'node_modules', 'dictionary-de-ch');
    const factory = await loadModule();
    const aff = factory.mountBuffer(fs.readFileSync(path.join(dir, 'index.aff')), 'de.aff');
    const dic = factory.mountBuffer(fs.readFileSync(path.join(dir, 'index.dic')), 'de.dic');
    hun = factory.create(aff, dic);
  } catch (e) { hunFail = true; console.error('Hunspell nicht verfügbar:', e.message); }
  return hun;
}
// Schweizer Schreibung: jedes «ss» könnte im Wörterbuch als «ß» stehen.
function eszettVariants(w) {
  const idx = []; let i = -1;
  while ((i = w.indexOf('ss', i + 1)) >= 0 && idx.length < 3) idx.push(i);
  const out = [];
  for (let mask = 1; mask < (1 << idx.length); mask++) {
    let s = w;
    for (let k = idx.length - 1; k >= 0; k--) if (mask & (1 << k)) s = s.slice(0, idx[k]) + 'ß' + s.slice(idx[k] + 2);
    out.push(s);
  }
  return out;
}
function spellOk(h, w) {
  if (h.spell(w)) return true;
  if (w.includes('ss')) for (const v of eszettVariants(w)) if (h.spell(v)) return true;
  return false;
}
async function spellCheck(words) {
  const h = await getHunspell();
  if (!h) return { available: false, result: {} };
  const result = {};
  for (const w of words.slice(0, 5000)) {
    if (result[w]) continue;
    const ok = spellOk(h, w);
    const lowerOk = ok ? false : spellOk(h, w.toLowerCase());
    const capOk = ok ? false : spellOk(h, w.charAt(0).toUpperCase() + w.slice(1));
    let sugg = [];
    if (!ok) { try { sugg = h.suggest(w).slice(0, 5).map((s) => s.replace(/ß/g, 'ss')); } catch (e) { sugg = []; } }
    result[w] = { ok, lowerOk, capOk, sugg };
  }
  return { available: true, result };
}

// ---------- Netz ----------
async function fetchText(url, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeout || 15000);
  try {
    const res = await net.fetch(url, {
      method: opts.method || 'GET', body: opts.body, signal: ctrl.signal,
      headers: Object.assign({ 'User-Agent': 'GymiTrainerZH/1.0 (Lern-App, lokal)', 'Accept': 'application/json, text/plain, */*' }, opts.headers || {})
    });
    if (!res.ok) return { ok: false, status: res.status, text: '' };
    return { ok: true, status: res.status, text: await res.text() };
  } catch (e) { return { ok: false, status: 0, text: '', error: String(e.message || e) }; }
  finally { clearTimeout(timer); }
}

function registerIpc() {
  ipcMain.handle('store:read', (e, name) => readJson(name));
  ipcMain.handle('store:write', (e, name, data) => writeJson(name, data));
  ipcMain.handle('store:delete', async (e, name) => { try { await fsp.unlink(path.join(dataDir(), safeName(name) + '.json')); } catch (x) {} return true; });
  ipcMain.handle('store:list', async () => { await ensureDirs(); return (await fsp.readdir(dataDir())).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)); });

  ipcMain.handle('file:save', async (e, { defaultName, content, filters }) => {
    const r = await dialog.showSaveDialog(win, { defaultPath: defaultName, filters: filters || [{ name: 'Alle Dateien', extensions: ['*'] }] });
    if (r.canceled || !r.filePath) return { ok: false };
    await fsp.writeFile(r.filePath, content, 'utf8');
    return { ok: true, path: r.filePath };
  });
  ipcMain.handle('file:open', async (e, { filters }) => {
    const r = await dialog.showOpenDialog(win, { properties: ['openFile'], filters: filters || [{ name: 'JSON', extensions: ['json'] }] });
    if (r.canceled || !r.filePaths.length) return { ok: false };
    const stat = await fsp.stat(r.filePaths[0]);
    if (stat.size > 20 * 1024 * 1024) return { ok: false, error: 'Datei ist grösser als 20 MB.' };
    return { ok: true, name: path.basename(r.filePaths[0]), content: await fsp.readFile(r.filePaths[0], 'utf8') };
  });

  ipcMain.handle('exam:status', async (e, files) => {
    await ensureDirs(); const out = {};
    for (const f of files) { try { const s = await fsp.stat(path.join(examDir(), safeName(f))); out[f] = s.size > 1000; } catch (x) { out[f] = false; } }
    return out;
  });
  ipcMain.handle('exam:download', async (e, { url, file }) => {
    try {
      const u = new URL(url);
      if (u.protocol !== 'https:' || !EXAM_HOSTS.has(u.hostname)) return { ok: false, error: 'Nur Downloads von zh.ch sind erlaubt.' };
      await ensureDirs();
      const res = await net.fetch(u.toString(), { headers: { 'User-Agent': 'GymiTrainerZH/1.0' } });
      if (!res.ok) return { ok: false, error: 'Server antwortet mit ' + res.status };
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000 || buf.slice(0, 5).toString('latin1') !== '%PDF-') return { ok: false, error: 'Antwort ist kein PDF.' };
      await fsp.writeFile(path.join(examDir(), safeName(file)), buf);
      return { ok: true, size: buf.length };
    } catch (x) { return { ok: false, error: 'Kein Netz oder Seite nicht erreichbar.' }; }
  });
  ipcMain.handle('exam:import', async (e, { file }) => {
    const r = await dialog.showOpenDialog(win, { properties: ['openFile'], filters: [{ name: 'PDF', extensions: ['pdf'] }] });
    if (r.canceled || !r.filePaths.length) return { ok: false };
    await ensureDirs();
    await fsp.copyFile(r.filePaths[0], path.join(examDir(), safeName(file)));
    return { ok: true };
  });
  ipcMain.handle('exam:open', (e, file) => shell.openPath(path.join(examDir(), safeName(file))));
  ipcMain.handle('open:external', (e, url) => { if (/^https:\/\//i.test(url)) shell.openExternal(url); return true; });
  ipcMain.handle('open:datafolder', () => shell.openPath(app.getPath('userData')));

  ipcMain.handle('web:fetch', async (e, { url }) => {
    try {
      const u = new URL(url);
      if (u.protocol !== 'https:' || !WEB_HOSTS.has(u.hostname)) return { ok: false, error: 'Host nicht erlaubt.' };
      return await fetchText(u.toString());
    } catch (x) { return { ok: false, error: 'Ungültige Adresse.' }; }
  });
  ipcMain.handle('lt:check', async (e, { text }) => {
    const body = new URLSearchParams({ text: String(text).slice(0, 18000), language: 'de-CH', enabledOnly: 'false' }).toString();
    return fetchText('https://api.languagetool.org/v2/check', { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 25000 });
  });
  ipcMain.handle('spell:check', (e, words) => spellCheck(Array.isArray(words) ? words : []));
  ipcMain.handle('app:info', () => ({ version: app.getVersion(), dataPath: app.getPath('userData'), electron: process.versions.electron, platform: process.platform }));
  ipcMain.handle('app:busy', (e, text) => { busy = text ? String(text).slice(0, 200) : null; return true; });
  ipcMain.handle('backup:list', async () => {
    try { await fsp.mkdir(backupDir(), { recursive: true }); const out = [];
      for (const f of (await fsp.readdir(backupDir())).filter((x) => /^profil-.+_\d{4}-\d{2}-\d{2}\.json$/.test(x))) { const st = await fsp.stat(path.join(backupDir(), f)); const m = f.match(/^profil-(.+)_(\d{4}-\d{2}-\d{2})\.json$/); out.push({ file: f, id: m[1], date: m[2], size: st.size }); }
      return out.sort((a, b) => (a.date < b.date ? 1 : -1));
    } catch (x) { return []; }
  });
  ipcMain.handle('backup:read', async (e, file) => {
    const f = path.join(backupDir(), safeName(file));
    if (!inside(backupDir(), f)) return null;
    try { return JSON.parse(await fsp.readFile(f, 'utf8')); } catch (x) { return null; }
  });
  ipcMain.handle('print:pdf', async (e, { defaultName }) => {
    const r = await dialog.showSaveDialog(win, { defaultPath: defaultName || 'Gymi-Trainer.pdf', filters: [{ name: 'PDF', extensions: ['pdf'] }] });
    if (r.canceled || !r.filePath) return { ok: false };
    const data = await win.webContents.printToPDF({ printBackground: true, pageSize: 'A4', margins: { marginType: 'custom', top: 0.6, bottom: 0.6, left: 0.6, right: 0.6 } });
    await fsp.writeFile(r.filePath, data);
    shell.openPath(r.filePath);
    return { ok: true, path: r.filePath };
  });
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(async () => {
    await ensureDirs(); registerProtocol(); registerIpc(); buildMenu(); createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on('window-all-closed', () => app.quit());
}
