// Offizielle Prüfungen: PDF von zh.ch laden, unter Zeit lösen, mit dem offiziellen Lösungsheft selbst korrigieren.
import { h, btn, toast, confirmBox, icon, tabs } from '../ui.js';
import { afterProgress } from '../progress.js';
import { state, save, addAttempt } from '../store.js';
import { officialGate } from '../stats.js';
import { EXAMS, examOf, fileUrl, localName, ARCHIV_URL, OLD_NOTE } from '../../content/pruefungen.js';
import { PARTS, SKILL } from '../skills.js';
import { fmtDur, gradeFromPoints, quarter, fmtGrade, fmtDate, dayKey, uid } from '../util.js';
import { setLeave, setGuard, refresh } from '../main.js';

const api = window.gymi || null;
const PART = { M: { name: 'Mathematik', key: 'mathe', minutes: 90, files: ['mathe'], sol: 'matheL' }, D: { name: 'Sprachprüfung', key: 'sprache', minutes: 45, files: ['sprache', 'textblatt'], sol: 'spracheL' } };
const LABEL = { mathe: 'Aufgaben', matheL: 'Lösungen', sprache: 'Sprachprüfung', textblatt: 'Textblatt', spracheL: 'Lösungen', aufsatz: 'Aufsatzthemen' };

async function ensure(path) { // lädt eine Datei, falls sie lokal fehlt
  const name = localName(path);
  if (!api) return { ok: false, web: true };
  const st = await api.examStatus([name]); if (st[name]) return { ok: true, name };
  const r = await api.examDownload({ url: fileUrl(path), file: name });
  return r.ok ? { ok: true, name } : { ok: false, error: r.error, name };
}
function pdfFrame(name) { return h('iframe', { class: 'pdfview', src: 'app://pruefung/' + encodeURIComponent(name), title: 'Prüfungsdokument ' + name }); }

function overview(page) {
  const p = state.profile; const gate = officialGate(p);
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Offizielle Prüfungen'), h('p', null, 'Die echten Prüfungen aus dem Archiv des Kantons Zürich. Sie sind das zuverlässigste Mass für deinen Stand.')));
  if (!gate.open && !p.setup.officialOverride) {
    page.append(h('div', { class: 'note warn' }, h('p', null, h('b', null, 'Noch nicht. '), gate.why), h('p', null, 'Übe zuerst mit «Lernen», «Endlos-Training» und den Simulationen der App. Davon gibt es unendlich viele.'),
      h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/training' }, 'Zum Endlos-Training'), btn('Trotzdem öffnen', async () => { const ok = await confirmBox('Wirklich jetzt öffnen?', 'Jede offizielle Prüfung kannst du nur 1-mal unvorbereitet lösen. Wenn du sie zu früh verbrauchst, fehlt dir später die echte Standortbestimmung.', 'Ja, öffnen', 'Lieber noch warten', true); if (ok) { p.setup.officialOverride = true; save(); refresh(); } }, { kind: 'quiet' }))));
    return;
  }
  page.append(h('div', { class: 'note', style: { marginBottom: '1rem' } }, h('b', null, 'Empfohlene Reihenfolge: '), '2021, 2022, 2023, 2024, 2025 und als letzte Standortbestimmung 2026. Löse jede Prüfung an einem Stück, mit Uhr und ohne Hilfe. Korrigiere erst danach mit dem Lösungsheft.'));
  if (!api) page.append(h('p', { class: 'note warn' }, 'Im Browser-Test werden die PDFs nicht lokal gespeichert. In der installierten App lädt sie der Gymi-Trainer von zh.ch herunter.'));
  else {
    const prog = h('span', { class: 'muted small', 'aria-live': 'polite' });
    const all = btn('Alle Prüfungen jetzt herunterladen', async () => {
      all.disabled = true; const files = EXAMS.flatMap((e) => Object.values(e.files)); let ok = 0, fail = 0;
      const st = await api.examStatus(files.map(localName));
      for (const f of files) { const n = localName(f); if (st[n]) { ok++; } else { const r = await api.examDownload({ url: fileUrl(f), file: n }); if (r.ok) ok++; else fail++; } prog.textContent = ok + fail + ' von ' + files.length + ' Dateien'; }
      all.disabled = false; prog.textContent = ok + ' von ' + files.length + ' Dateien gespeichert' + (fail ? ', ' + fail + ' fehlgeschlagen (später noch einmal versuchen).' : '. Ab jetzt geht alles ohne Internet.');
    }, { kind: 'small', icon: 'down' });
    page.append(h('div', { class: 'row', style: { marginBottom: '1rem' } }, all, prog));
  }
  const table = h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Jahr'), h('th', null, 'Sprachprüfung'), h('th', null, 'Mathematik'), h('th', null, 'Aufsatz'))));
  const tb = h('tbody');
  EXAMS.forEach((e) => {
    const cell = (pk) => { const done = p.officials.filter((o) => o.y === e.y && o.part === pk).slice(-1)[0]; return h('td', null, h('a', { class: 'btn small' + (done ? '' : ' primary'), href: '#/offiziell/' + e.y + '/' + pk }, done ? 'Note ' + fmtGrade(done.grade) + ' ansehen' : 'Öffnen')); };
    tb.append(h('tr', null, h('td', null, h('b', null, String(e.y)), e.aktuell ? h('span', { class: 'tag ink', style: { marginLeft: '0.5rem' } }, 'aktuelle Anforderungen') : h('span', { class: 'tag', style: { marginLeft: '0.5rem' } }, 'Themen-Training')), cell('D'), cell('M'), h('td', null, h('a', { class: 'btn small', href: '#/offiziell/' + e.y + '/A' }, 'Themen'))));
  });
  table.append(tb); page.append(h('div', { class: 'card' }, table, h('p', { class: 'hint', style: { marginTop: '0.8rem' } }, OLD_NOTE), h('p', { class: 'hint' }, 'Quelle: ', h('a', { href: ARCHIV_URL, target: '_blank', rel: 'noopener' }, 'Prüfungsarchiv des Kantons Zürich (zh.ch)'), '. 2022 gibt es zusätzlich eine Nachprüfung (Korrekturanweisungen auf kuezh.ch).')));
}

async function fileRow(e, kind, host, onReady) {
  const path = e.files[kind]; const name = localName(path); const row = h('div', { class: 'row', style: { marginBottom: '0.4rem' } }, h('b', { style: { minWidth: '8rem' } }, LABEL[kind]));
  host.append(row);
  if (!api) { row.append(h('a', { class: 'btn small', href: fileUrl(path), target: '_blank', rel: 'noopener' }, 'Auf zh.ch öffnen')); return false; }
  const st = await api.examStatus([name]); const status = h('span', { class: 'tag ' + (st[name] ? 'ok' : '') }, st[name] ? 'gespeichert' : 'noch nicht geladen'); row.append(status);
  const load = btn(st[name] ? 'Neu laden' : 'Herunterladen', async () => { load.disabled = true; status.textContent = 'lädt …'; const r = await api.examDownload({ url: fileUrl(path), file: name }); load.disabled = false; if (r.ok) { status.textContent = 'gespeichert'; status.className = 'tag ok'; if (onReady) onReady(); } else { status.textContent = 'Fehler'; status.className = 'tag bad'; toast('Download fehlgeschlagen: ' + (r.error || 'unbekannt') + ' Du kannst die Datei auch von Hand wählen.', 'bad', 7000); } }, { kind: 'small' });
  row.append(load, btn('Eigene PDF-Datei wählen', async () => { const r = await api.examImport({ file: name }); if (r.ok) { status.textContent = 'gespeichert'; status.className = 'tag ok'; if (onReady) onReady(); } }, { kind: 'small quiet' }), btn('Extern öffnen', () => api.examOpen(name), { kind: 'small quiet' }));
  return !!st[name];
}

function sheet(e, pk, prev) {
  const P = PART[pk]; const rows = (e[P.key] || []).map((r) => ({ t: r.t, p: r.p, s: r.s, got: '' }));
  if (prev && prev.rows) prev.rows.forEach((r, i) => { if (rows[i]) { rows[i].got = r.got; rows[i].p = r.p; } else rows.push({ t: r.t, p: r.p, s: [], got: r.got }); });
  if (!rows.length) for (let i = 1; i <= 10; i++) rows.push({ t: 'Aufgabe ' + i, p: '', s: [], got: '' });
  const box = h('div', { class: 'sheet' }); const out = h('p', { 'aria-live': 'polite' });
  const tb = h('tbody');
  const calc = () => { let got = 0, max = 0; rows.forEach((r) => { const g = parseFloat(r.got), m = parseFloat(r.p); if (isFinite(m)) max += m; if (isFinite(g)) got += Math.min(g, isFinite(m) ? m : g); }); out.innerHTML = ''; if (max > 0) out.append(h('b', null, got + ' von ' + max + ' Punkten, Note ' + fmtGrade(quarter(gradeFromPoints(got, max)))), ' (lineare Skala, nicht offiziell)'); return { got, max }; };
  const draw = () => { tb.innerHTML = ''; rows.forEach((r, i) => { const g = h('input', { type: 'number', min: '0', step: '0.5', value: r.got, 'aria-label': 'Erreichte Punkte Aufgabe ' + (i + 1), oninput: () => { r.got = g.value; calc(); } }); const m = h('input', { type: 'number', min: '0', step: '1', value: r.p, 'aria-label': 'Maximale Punkte Aufgabe ' + (i + 1), oninput: () => { r.p = m.value; calc(); } });
    tb.append(h('tr', null, h('td', null, (i + 1) + '. ' + r.t, r.s && r.s.length ? h('div', { class: 'muted small' }, r.s.map((s) => s + ' ' + SKILL[s].name).join(', ')) : null), h('td', null, g), h('td', null, m))); }); calc(); };
  box.append(h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Aufgabe'), h('th', null, 'erreicht'), h('th', null, 'maximal'))), tb), btn('Zeile hinzufügen', () => { rows.push({ t: 'Aufgabe ' + (rows.length + 1), p: '', s: [], got: '' }); draw(); }, { kind: 'small quiet', icon: 'plus' }), out);
  draw();
  return { box, rows, calc };
}

async function examPage(page, y, pk) {
  const p = state.profile; const e = examOf(y); if (!e) return overview(page);
  page.classList.add('wide');
  page.append(h('a', { class: 'back', href: '#/offiziell' }, '‹ Alle Prüfungen'));
  if (pk === 'A') {
    page.append(h('div', { class: 'page-head' }, h('h1', null, 'Aufsatzthemen ' + y), h('p', null, 'Wähle 1 der 4 Themen und schreibe 90 Minuten. In der Aufsatz-Werkstatt gibst du den Titel ein und bekommst danach die Korrekturhilfe.')));
    const host = h('div', { class: 'card' }); page.append(host); const view = h('div', { style: { marginTop: '1rem' } }); page.append(view);
    const show = () => { view.innerHTML = ''; view.append(pdfFrame(localName(e.files.aufsatz))); };
    if (await fileRow(e, 'aufsatz', host, show)) show();
    host.append(h('div', { class: 'row', style: { marginTop: '0.6rem' } }, h('a', { class: 'btn primary', href: '#/aufsatz/neu/frei' }, icon('pen', 18), 'In der Werkstatt schreiben')));
    return;
  }
  const P = PART[pk]; const prev = p.officials.filter((o) => o.y === e.y && o.part === pk).slice(-1)[0];
  page.append(h('div', { class: 'page-head' }, h('h1', null, P.name + ' ' + y), h('p', null, P.minutes + ' Minuten. ' + (pk === 'M' ? 'Erlaubt: Taschenrechner, Zirkel, Geodreieck. Löse im ausgedruckten Heft oder auf Papier.' : 'Kein Wörterbuch. Lies zuerst das Textblatt.'))));
  if (!e.aktuell) page.append(h('p', { class: 'note warn' }, OLD_NOTE));
  const files = h('div', { class: 'card' }, h('h3', null, 'Dokumente'));
  page.append(files);
  let ready = true; for (const k of P.files) ready = (await fileRow(e, k, files)) && ready;
  await fileRow(e, P.sol, files);
  files.append(h('p', { class: 'hint' }, 'Tipp: Drucke Aufgaben und Textblatt aus (über «Extern öffnen») und löse sie von Hand, wie an der Prüfung.'));
  const work = h('div', { style: { marginTop: '1rem' } }); page.append(work);
  let timer = null, t0 = 0, seconds = prev ? prev.seconds : 0, running = false;
  setLeave(() => clearInterval(timer));

  function correction() {
    work.innerHTML = ''; running = false; setGuard(null);
    const sh = sheet(e, pk, prev);
    const left = h('div'); if (api) left.append(pdfFrame(localName(e.files[P.sol]))); else left.append(h('p', null, h('a', { href: fileUrl(e.files[P.sol]), target: '_blank', rel: 'noopener' }, 'Lösungsheft auf zh.ch öffnen')));
    const right = h('div', { class: 'card' }, h('h3', null, 'Auswertungsbogen'), h('p', { class: 'muted' }, 'Korrigiere streng nach dem Lösungsheft und trage pro Aufgabe die erreichten Punkte ein. Die maximalen Punkte stammen aus dem Lösungsheft. Vergleiche sie und passe sie an, falls nötig.'), sh.box,
      h('div', { class: 'row', style: { marginTop: '0.8rem' } }, btn('Resultat speichern', () => {
        const { got, max } = sh.calc(); if (!(max > 0)) { toast('Trage zuerst die Punkte ein.', 'bad'); return; }
        const grade = quarter(gradeFromPoints(got, max));
        p.officials.push({ id: uid(), y: e.y, part: pk, date: dayKey(), points: got, max, grade, seconds, rows: sh.rows.map((r) => ({ t: r.t, p: r.p, got: r.got })) }); setTimeout(afterProgress, 400);
        sh.rows.forEach((r) => { const g = parseFloat(r.got), m = parseFloat(r.p); if (!isFinite(g) || !isFinite(m) || m <= 0 || !r.s || !r.s.length) return; r.s.forEach((sid) => addAttempt({ key: 'offiziell.' + e.y + pk, skill: sid, points: Math.min(g, m) / r.s.length, max: m / r.s.length, sec: 0, mode: 'offiziell', src: 'offiziell', seed: 0 })); });
        save(); toast('Gespeichert: Note ' + fmtGrade(grade) + '. Die Punkte zählen jetzt in deiner Auswertung.', 'ok', 6000); location.hash = '#/offiziell';
      }, { kind: 'primary' }), seconds ? h('span', { class: 'muted small' }, 'Gebrauchte Zeit: ' + fmtDur(seconds)) : null));
    work.append(h('div', { class: 'split' }, left, right));
  }
  function start() {
    work.innerHTML = ''; running = true; t0 = Date.now();
    const clock = h('div', { class: 'timer' }, fmtDur(P.minutes * 60));
    let tab = P.files[0]; const view = h('div');
    const drawView = () => { view.innerHTML = ''; if (P.files.length > 1) view.append(tabs(P.files.map((k) => ({ id: k, label: LABEL[k] })), tab, (id) => { tab = id; drawView(); })); view.append(api ? pdfFrame(localName(e.files[tab])) : h('p', null, h('a', { href: fileUrl(e.files[tab]), target: '_blank', rel: 'noopener' }, LABEL[tab] + ' auf zh.ch öffnen'))); };
    work.append(h('div', { class: 'card row between', style: { marginBottom: '0.8rem' } }, h('div', null, h('b', null, 'Die Prüfung läuft.'), h('div', { class: 'muted small' }, 'Arbeite ohne Hilfe. Das Lösungsheft öffnet sich erst nach dem Abgeben.')), h('div', { class: 'row' }, clock, btn('Abgeben und korrigieren', async () => { if (await confirmBox('Abgeben?', 'Danach korrigierst du mit dem Lösungsheft.', 'Abgeben', 'Weiterarbeiten')) { clearInterval(timer); seconds = Math.round((Date.now() - t0) / 1000); correction(); } }, { kind: 'primary' }))), view);
    drawView();
    timer = setInterval(() => { const left = P.minutes * 60 - Math.round((Date.now() - t0) / 1000); clock.textContent = left >= 0 ? fmtDur(left) : '+' + fmtDur(-left); clock.classList.toggle('low', left < 300 && left >= 0); clock.classList.toggle('over', left < 0); }, 500);
    setGuard(() => (running ? confirmBox('Prüfung abbrechen?', 'Die Uhr läuft noch.', 'Abbrechen und verlassen', 'Weiterarbeiten', true) : Promise.resolve(true)), 'Eine offizielle Prüfung läuft noch.');
  }
  const intro = h('div', { class: 'card' });
  if (prev) intro.append(h('p', { class: 'note ok' }, h('b', null, 'Schon gelöst am ' + fmtDate(prev.date) + ': '), prev.points + ' von ' + prev.max + ' Punkten, Note ' + fmtGrade(prev.grade) + '.'));
  intro.append(h('div', { class: 'row' }, btn(prev ? 'Noch einmal unter Zeit lösen' : 'Prüfung unter Zeit starten', async () => {
    if (api) { for (const k of P.files) { const r = await ensure(e.files[k]); if (!r.ok) { toast('«' + LABEL[k] + '» fehlt: ' + (r.error || 'Download nicht möglich') + ' Lade die Datei oben herunter oder wähle sie von Hand.', 'bad', 8000); return; } } ensure(e.files[P.sol]); }
    intro.hidden = true; files.hidden = true; start();
  }, { kind: 'primary big', icon: 'play' }), btn(prev ? 'Auswertungsbogen ansehen' : 'Auf Papier gelöst: direkt korrigieren', async () => { if (api) await ensure(e.files[P.sol]); intro.hidden = true; correction(); }, {})));
  work.append(intro);
}

export function render(page, args) {
  if (args[0] && args[1]) return examPage(page, args[0], args[1]);
  return overview(page);
}
