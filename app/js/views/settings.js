// Einstellungen: Darstellung, Barrierefreiheit, Web-Modus, LanguageTool, Profil und Daten.
import { h, btn, field, toast, confirmBox, saveText } from '../ui.js';
import { state, save, renameProfile, deleteProfile, importProfile, restoreProfile, flush } from '../store.js';
import { makeDemoProfile } from '../demo.js';
import { segmented } from './onboarding.js';
import { applySettings, refresh } from '../main.js';
import { fmtDate, MOD } from '../util.js';

const api = window.gymi || null;

export async function render(page) {
  const p = state.profile; const s = p.settings;
  const set = (k, v) => { s[k] = v; save(); applySettings(); };
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Einstellungen')));

  // Darstellung
  const size = h('input', { type: 'range', min: '85', max: '150', step: '5', value: String(s.size), 'aria-label': 'Schriftgrösse', oninput: () => { set('size', Number(size.value)); sizeOut.textContent = size.value + ' %'; } });
  const sizeOut = h('span', { class: 'muted' }, s.size + ' %');
  const cb = (k, label, hint) => { const el = h('input', { type: 'checkbox', checked: s[k] || null, onchange: () => set(k, el.checked) }); return h('label', { class: 'choice' }, el, h('span', null, label, hint ? h('span', { class: 'muted small', style: { display: 'block' } }, hint) : null)); };
  page.append(h('div', { class: 'card' }, h('h3', null, 'Darstellung und Barrierefreiheit'),
    field('Farben', segmented([['system', 'Wie das System'], ['hell', 'Hell'], ['dunkel', 'Dunkel (Wandtafel)'], ['kontrast', 'Hoher Kontrast']], s.theme, (v) => set('theme', v), 'Farben')),
    field('Schrift', segmented([['standard', 'Standard'], ['legasthenie', 'Leseschrift (OpenDyslexic)']], s.font, (v) => set('font', v), 'Schrift')),
    h('div', { class: 'form-row' }, h('label', null, 'Schriftgrösse'), h('div', { class: 'row' }, size, sizeOut)),
    h('div', { class: 'stack' }, cb('motion', 'Bewegungen und Übergänge anzeigen', 'Ausschalten, wenn Animationen stören.'), (() => { const el = h('input', { type: 'checkbox', checked: s.celebrate !== false || null, onchange: () => set('celebrate', el.checked) }); return h('label', { class: 'choice' }, el, h('span', null, 'Erfolge mit einem Stempel feiern', h('span', { class: 'muted small', style: { display: 'block' } }, 'Bei neuen Stufen, Wochenzielen und Meilensteinen. Ausgeschaltet bleibt der Fortschritt sichtbar, nur ohne Stempel.'))); })(), cb('tts', 'Vorlesen anbieten', 'Lesetexte mit der Windows-Stimme vorlesen (offline).')),
    h('p', { class: 'hint' }, 'Tastatur: Tab zum Wechseln, Enter zum Prüfen und Weiterfahren. Zoom mit ' + MOD + ' + und ' + MOD + ' −.')));

  // Quellen
  const web = h('input', { type: 'checkbox', checked: s.web || null, onchange: async () => { if (web.checked) { const ok = await confirmBox('Web-Modus einschalten?', 'Im Web-Modus holt die App Sätze aus der Wikipedia und Zahlen aus Wikidata und baut daraus Aufgaben. Das ist experimentell: Sätze können freiwillige Kommas, Fehler oder schwierige Wörter enthalten, Zahlen können veraltet sein. Die Lösung stammt aus der Quelle und wird nicht von Menschen geprüft. Es braucht Internet.', 'Einschalten', 'Abbrechen'); if (!ok) { web.checked = false; return; } } set('web', web.checked); if (!web.checked && s.mode === 'web') set('mode', 'mix'); } });
  const lt = h('input', { type: 'checkbox', checked: s.lt || null, onchange: async () => { if (lt.checked) { const ok = await confirmBox('LanguageTool einschalten?', 'Für die zusätzliche Prüfung wird der Aufsatztext an den Dienst languagetool.org gesendet. Ohne diese Option bleibt alles auf deinem Computer.', 'Einschalten', 'Abbrechen'); if (!ok) { lt.checked = false; return; } } set('lt', lt.checked); } });
  page.append(h('div', { class: 'card' }, h('h3', null, 'Internet (freiwillig)'), h('p', { class: 'muted' }, 'Die App funktioniert ohne Internet. Diese Optionen brauchen eine Verbindung.'),
    h('div', { class: 'stack' }, h('label', { class: 'choice' }, web, h('span', null, 'Web-Modus (experimentell)', h('span', { class: 'muted small', style: { display: 'block' } }, 'Aufgaben aus Wikipedia-Sätzen (Komma, das/dass) und Wikidata-Zahlen (Prozent, Dichte, Diagramm). Kann unzuverlässig sein.'))),
      h('label', { class: 'choice' }, lt, h('span', null, 'Aufsatz zusätzlich mit LanguageTool prüfen', h('span', { class: 'muted small', style: { display: 'block' } }, 'Sendet den Aufsatz an languagetool.org.')))),
    h('p', { class: 'hint' }, 'Offizielle Prüfungen werden nur von zh.ch geladen, wenn du sie öffnest.')));

  // Profil
  const nm = h('input', { type: 'text', value: p.name });
  const fileIn = h('input', { type: 'file', accept: '.json', hidden: true, onchange: async () => { const f = fileIn.files[0]; if (!f) return; try { await importProfile(JSON.parse(await f.text())); toast('Profil importiert.', 'ok'); applySettings(); location.hash = '#/start'; refresh(); } catch (e) { toast(e.message, 'bad'); } } });
  page.append(h('div', { class: 'card' }, h('h3', null, 'Profil'), field('Name', nm), btn('Name speichern', () => { if (!nm.value.trim()) return; renameProfile(nm.value.trim()); toast('Gespeichert.', 'ok'); refresh(); }, { kind: 'small' }),
    h('p', { class: 'small', style: { marginTop: '0.8rem' } }, 'Angelegt am ' + fmtDate(new Date(p.created)) + '. ' + p.attempts.length + ' Aufgaben, ' + p.essays.length + ' Aufsätze, ' + p.mocks.length + ' Simulationen gespeichert.'),
    h('div', { class: 'row' },
      btn('Profil exportieren (Sicherung)', async () => { await flush(); saveText('gymi-trainer-profil-' + p.name.replace(/[^\wäöüÄÖÜ-]/g, '') + '.json', JSON.stringify(p), 'application/json'); }, { icon: 'down' }),
      btn('Profil importieren', async () => { if (api && api.fileOpen) { const r = await api.fileOpen({ filters: [{ name: 'JSON', extensions: ['json'] }] }); if (!r || !r.ok) return; try { await importProfile(JSON.parse(r.content)); toast('Profil importiert.', 'ok'); applySettings(); location.hash = '#/start'; refresh(); } catch (e) { toast(e.message, 'bad'); } } else fileIn.click(); }, { icon: 'up' }), fileIn,
      btn('Einrichtung wiederholen', () => { location.hash = '#/willkommen'; }, { kind: 'quiet' }),
      btn('Beispielprofil anlegen', async () => { await importProfile(makeDemoProfile()); toast('Beispielprofil «Mia (Beispiel)» angelegt. Wechseln geht unten links im Profil-Menü.', 'ok'); applySettings(); location.hash = '#/start'; refresh(); }, { kind: 'quiet' }),
      btn('Profil löschen', async () => { if (await confirmBox('Profil löschen?', 'Alle Daten von «' + p.name + '» werden gelöscht. Das lässt sich nicht rückgängig machen. Exportiere vorher eine Sicherung.', 'Endgültig löschen', 'Abbrechen', true)) { await deleteProfile(p.id); location.hash = state.profile ? '#/start' : '#/willkommen'; refresh(); } }, { kind: 'danger' }))));

  // Sicherungen
  if (api && api.backupList) {
    const bk = h('div', { class: 'card' }, h('h3', null, 'Automatische Sicherungen'), h('p', { class: 'muted' }, 'Jeden Tag, an dem du lernst, speichert die App eine Kopie deines Profils. Die letzten 14 bleiben erhalten.'));
    const mine = (await api.backupList()).filter((b) => b.id === p.id);
    if (!mine.length) bk.append(h('p', { class: 'muted' }, 'Noch keine Sicherung. Sie entsteht beim nächsten Speichern.'));
    else bk.append(h('table', { class: 'list' }, h('tbody', null, mine.map((b) => h('tr', null, h('td', null, fmtDate(b.date)), h('td', { class: 'num' }, Math.max(1, Math.round(b.size / 1024)) + ' KB'),
      h('td', null, btn('Zurückholen', async () => { if (!(await confirmBox('Sicherung vom ' + fmtDate(b.date) + ' zurückholen?', 'Dein Profil wird auf diesen Stand zurückgesetzt. Was du seither gelernt hast, geht verloren. Die heutige Sicherung bleibt im Ordner.', 'Zurückholen', 'Abbrechen', true))) return; const data = await api.backupRead(b.file); try { await restoreProfile(data); toast('Sicherung zurückgeholt.', 'ok'); applySettings(); refresh(); } catch (e) { toast(e.message, 'bad'); } }, { kind: 'small' })))))));
    page.append(bk);
  }

  // Daten und Info
  const info = h('div', { class: 'card' }, h('h3', null, 'Daten und Programm'));
  if (api && api.appInfo) { try { const i = await api.appInfo(); info.append(h('p', null, 'Gymi-Trainer ZH, Version ' + i.version + '. Alle Daten liegen auf diesem Computer: '), h('p', { class: 'mono small' }, i.dataPath), btn('Datenordner öffnen', () => api.openDataFolder(), { kind: 'small' })); } catch (e) { /* ohne Info */ } }
  else info.append(h('p', null, 'Browser-Version: Die Daten liegen im Speicher dieses Browsers.'));
  info.append(h('p', { class: 'hint' }, 'Prüfungsinformationen nach den Vorgaben des Kantons Zürich (Prüfungsanforderungen ZAP2, Prüfungsarchiv zh.ch). Die offiziellen Prüfungen gehören dem Kanton Zürich und werden nicht mit der App verteilt.'));
  page.append(info);
}
