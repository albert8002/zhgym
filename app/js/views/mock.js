// Prüfungssimulation: erzeugt eine ganze Sprachprüfung oder Mathematikprüfung nach dem Bauplan der ZAP und bewertet sie.
import { h, btn, mathify, toast, confirmBox, lineChart } from '../ui.js';
import { afterProgress } from '../progress.js';
import { state, save, addAttempt, addError } from '../store.js';
import { makeTask, DB } from '../engine/sources.js';
import { allItems } from '../engine/db.js';
import { mountTask, gradeTask, taskMax } from '../engine/task.js';
import { aussagenTask, figurTask, zuordnenTask, frageTask, deutenTask } from '../engine/de-gen.js';
import { textPanel } from '../runner.js';
import { PARTS, SKILL, RULES } from '../skills.js';
import { RNG, newSeed, fmtDur, gradeFromPoints, quarter, fmtGrade, fmtDate, dayKey, uid } from '../util.js';
import { setLeave, setGuard, go } from '../main.js';

const ui = { h, mathify };
const T = (key) => makeTask(key, newSeed());
const many = (key, n) => Array.from({ length: n }, () => T(key));
const fin = (t, skill, title) => { t.skill = skill; t.title = title; t.key = t.key || skill + '.text'; t.src = 'db'; t.seed = 0; t.fields.forEach((f, i) => { if (!f.id) f.id = 'f' + i; }); t.points = taskMax(t); return t; };

// Bauplan Sprachprüfung (wie 2024–2026): 14 Aufgaben, 75 Punkte, 45 Minuten
function buildSprache() {
  const r = new RNG(newSeed()); const fit = (t) => t.figur && t.zuordnen && t.zuordnen.length >= 5 && t.aussagen.length >= 7 && t.fragen && t.mc;
  let texts = DB.text.filter(fit); if (!texts.length) texts = allItems('text').filter(fit); // kein passender Text in den verwendeten Paketen
  const last = (state.profile.mocks.filter((m) => m.type === 'sprache').slice(-2).map((m) => m.textId));
  const pool = texts.filter((t) => !last.includes(t._id)); const text = r.pick(pool.length ? pool : texts);
  const d18 = text.fragen.filter((f) => (f.skill || 'D18') === 'D18').slice(0, 2), d19 = text.mc.slice(0, 3);
  const A = [
    { title: 'Figur charakterisieren', tasks: [fin(figurTask(text, r), 'D17', 'Figur')] },
    { title: 'Wort aus dem Text zuordnen', tasks: [fin(zuordnenTask(text, r, 5), 'D13', 'Wort zuordnen')] },
    { title: 'Aussagen prüfen', tasks: [fin(aussagenTask(text, r, 7), 'D16', 'Aussagen')] },
    { title: 'Fragen zum Text', tasks: [...d18.map((f) => fin(frageTask(text, f), 'D18', 'Offene Frage')), ...d19.map((f) => fin(deutenTask(text, f, r), 'D19', 'Deuten'))] },
    { title: 'Sätze verbinden', tasks: many('D8.verbinden', 6) },
    { title: 'Modus', tasks: [...many('D4.funktion', 3), ...many('D4.bestimmen', 3)] },
    { title: 'Fall', tasks: many('D6.setzen', 6) },
    { title: 'Zeitformen', tasks: many('D3.umformen', 4) },
    { title: 'Wortarten', tasks: many('D1.wort', 6) },
    { title: 'Objekte', tasks: many('D7.objekt', 5) },
    { title: 'Wortfamilie', tasks: many('D10.familie', 3) },
    { title: 'Antonyme', tasks: many('D11.antonym', 4) },
    { title: 'Sätze umformen', tasks: [...many('D9.umformen', 2), ...many('D9.relativ', 2)] },
    { title: 'Fehler korrigieren', tasks: [T('D15.fehlertext')] }
  ];
  return { type: 'sprache', minutes: 45, textId: text._id, aufgaben: A };
}
// Bauplan Mathematik (wie 2024–2026): 10 Aufgaben, 37 Punkte, 90 Minuten
function buildMathe() {
  const r = new RNG(newSeed()); const pick = (...ks) => T(r.pick(ks));
  const A = [
    { title: 'Kurzaufgaben (nur Resultat)', tasks: [T('M4.vereinfachen'), T('M2.potenzwert'), T('M4.termT'), T('M7.formel'), T('M3.sach'), T('M10.einheit'), pick('M16.dreieck', 'M18.pythagoras', 'M17.formel', 'M16.parallelen'), pick('M22.pyramidenhoehe', 'M22.grund'), pick('M19.viereck', 'M19.dreieck')] },
    { title: 'Gleichungen', tasks: [T('M6.klammer'), T('M6.bruch')] },
    { title: 'Terme mit Brüchen und Wurzeln', tasks: [pick('M5.summe', 'M5.muldiv'), T('M5.wurzelterm')] },
    { title: 'Gleichungen aufstellen', tasks: many('M8.aufstellen', 3) },
    { title: 'Prozent', tasks: [T('M11.zweistufig'), T('M11.vergleich')] },
    { title: r.bool() ? 'Füllgraphen' : 'Spiegelung', tasks: [] },
    { title: 'Wahrscheinlichkeit', tasks: [pick('M15.mindestens', 'M15.zweistufig'), T('M15.rueckwaerts')] },
    { title: 'Fläche und Gleichung', tasks: [T('M17.gleichung')] },
    { title: 'Körper', tasks: [pick('M22.zelt', 'M22.pyramide')] },
    { title: 'Folgen und Körper', tasks: [T('M9.folge')] }
  ];
  A[5].tasks = A[5].title === 'Füllgraphen' ? [T('M14.fuellgraph')] : [T('M20.spiegeln'), T('M20.zentrum')];
  return { type: 'mathe', minutes: 90, aufgaben: A };
}

function history(type) {
  const p = state.profile; const list = p.mocks.filter((m) => m.type === type);
  if (!list.length) return h('p', { class: 'muted' }, 'Noch keine Simulation.');
  const box = h('div');
  if (list.length > 1) box.append(lineChart(list.map((m, i) => ({ x: String(i + 1), y: Math.round(m.grade * 100) / 100 })), { min: 1, max: 6, ticks: [1, 2, 3, 4, 5, 6], goal: RULES.neededPN(p.setup.vn), goalLabel: 'nötig', label: 'Noten der Simulationen' }));
  box.append(h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Datum'), h('th', { class: 'num' }, 'Punkte'), h('th', { class: 'num' }, 'Note'), h('th', { class: 'num' }, 'Zeit'))), h('tbody', null, list.slice().reverse().map((m) => h('tr', null, h('td', null, fmtDate(m.date)), h('td', { class: 'num' }, m.points + ' / ' + m.max), h('td', { class: 'num' }, fmtGrade(m.grade)), h('td', { class: 'num' }, fmtDur(m.seconds)))))));
  return box;
}

function overview(page) {
  const p = state.profile;
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Prüfungssimulation'), h('p', null, 'Die App stellt eine neue Prüfung nach dem Bauplan der ZAP zusammen. Du löst sie unter Prüfungsbedingungen und siehst danach Punkte, Note und Lösungen.')));
  const cols = h('div', { class: 'cols' });
  [['sprache', 'Sprachprüfung', '45 Minuten, 14 Aufgaben, rund 75 Punkte. Keine Hilfsmittel.'], ['mathe', 'Mathematik', '90 Minuten, 10 Aufgaben, rund 37 Punkte. Rechner, Geodreieck, Zirkel.'], ['aufsatz', 'Aufsatz', '90 Minuten, 4 Themen zur Wahl. Erlaubt: das Wörterbuch aus der Sek oder der Duden Band 1.']].forEach(([k, name, text]) => {
    cols.append(h('div', { class: 'card' }, h('h2', null, name), h('p', null, text), h('a', { class: 'btn primary', href: k === 'aufsatz' ? '#/aufsatz/sim' : '#/simulation/' + k }, 'Simulation starten'), h('h3', { style: { marginTop: '1.2rem' } }, 'Bisher'), k === 'aufsatz' ? (p.essays.filter((e) => e.sim && e.grade).length ? h('p', null, p.essays.filter((e) => e.sim && e.grade).length + ' Aufsätze unter Prüfungsbedingungen. Details in der Aufsatz-Werkstatt.') : h('p', { class: 'muted' }, 'Noch keine Simulation.')) : history(k)));
  });
  page.append(cols);
  page.append(h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h3', null, 'Ganzer Prüfungstag'), h('p', null, 'So läuft der Prüfungstag ab (Montag, 8. März 2027): 9.00–9.45 Sprachprüfung, 10.15–11.45 Mathematik, 13.15–14.45 Aufsatz. Übe das mindestens 1-mal an einem freien Tag in genau dieser Reihenfolge und mit diesen Pausen.'),
    h('p', { class: 'note' }, h('b', null, 'Note in der Simulation: '), 'Die offizielle Notenskala wird nicht veröffentlicht. Die App rechnet linear: Note = 1 + 5 · erreichte Punkte / maximale Punkte, gerundet auf Viertelnoten. Die echte Skala kann davon abweichen.')));
}

function runExam(page, exam) {
  const p = state.profile; page.classList.add('wide'); page.innerHTML = '';
  const total = exam.aufgaben.reduce((a, A) => a + A.tasks.reduce((b, t) => b + t.points, 0), 0);
  let left = exam.minutes * 60, timer = null, done = false; const t0 = Date.now(); const ctls = [];
  const clock = h('div', { class: 'timer', role: 'timer', 'aria-label': 'Restzeit' }, fmtDur(left));
  const top = h('div', { class: 'card row between', style: { position: 'sticky', top: '0.5rem', zIndex: 5, marginBottom: '1rem' } }, h('div', null, h('b', null, PARTS[exam.type].name + ' (Simulation)'), h('div', { class: 'muted small' }, exam.aufgaben.length + ' Aufgaben, ' + total + ' Punkte, ' + exam.minutes + ' Minuten. Die Reihenfolge ist frei.')), h('div', { class: 'row' }, clock, btn('Abgeben', () => submit(false), { kind: 'primary' })));
  const tasksCol = h('div');
  exam.aufgaben.forEach((A, ai) => {
    const pts = A.tasks.reduce((b, t) => b + t.points, 0);
    const card = h('div', { class: 'card exam-card', id: 'aufg-' + (ai + 1) }, h('div', { class: 'row between' }, h('h3', null, 'Aufgabe ' + (ai + 1) + ': ' + A.title), h('span', { class: 'tag ink' }, pts + ' P')));
    A.tasks.forEach((t, ti) => { const el = h('div', { style: { borderTop: ti ? '1px dashed var(--line)' : '0', paddingTop: ti ? '0.6rem' : '0', marginTop: ti ? '0.6rem' : '0' } }); card.append(el); const c = mountTask(t, el, ui, {}); const sol = h('div'); el.append(sol); ctls.push({ t, c, el, sol, ai }); });
    tasksCol.append(card);
  });
  // Übersicht: welche Aufgaben haben schon eine Antwort?
  const filled = (v) => { if (v == null || v === '') return false; if (Array.isArray(v)) return v.some((x) => filled(x)); if (typeof v === 'object') return Object.values(v).some((x) => filled(x)); return true; };
  const navBox = h('div', { class: 'exam-nav', role: 'navigation', 'aria-label': 'Aufgaben' }, exam.aufgaben.map((A, ai) => h('button', { type: 'button', class: 'chip', title: A.title, onclick: () => document.getElementById('aufg-' + (ai + 1)).scrollIntoView({ behavior: 'smooth', block: 'start' }) }, String(ai + 1))));
  const updNav = () => exam.aufgaben.forEach((A, ai) => { const xs = ctls.filter((x) => x.ai === ai); const n = xs.filter((x) => Object.values(x.c.values()).some(filled)).length; const b = navBox.children[ai]; b.classList.toggle('done', n === xs.length); b.classList.toggle('part', n > 0 && n < xs.length); b.setAttribute('aria-label', 'Aufgabe ' + (ai + 1) + (n === xs.length ? ', beantwortet' : n ? ', teilweise beantwortet' : ', offen')); });
  ['input', 'change'].forEach((ev) => tasksCol.addEventListener(ev, updNav)); tasksCol.addEventListener('click', () => setTimeout(updNav, 0)); updNav();
  // Tempo-Richtwert: Punkte gleichmässig über die Zeit verteilt. Vergleicht mit den Punkten, die schon eine Antwort haben (Reihenfolge egal).
  const showPace = !(p.settings && p.settings.pace === false);
  const paceEl = h('div', { class: 'pace-line small', 'aria-live': 'off' });
  const cum = []; exam.aufgaben.reduce((a, A) => { const v = a + A.tasks.reduce((b, t) => b + t.points, 0); cum.push(v); return v; }, 0);
  const updPace = () => {
    if (!showPace || done) return;
    const el = (Date.now() - t0) / 1000; const target = Math.min(total, Math.round(total * el / (exam.minutes * 60)));
    const have = ctls.reduce((a, x) => a + (Object.values(x.c.values()).some(filled) ? x.t.points : 0), 0);
    const k = Math.min(exam.aufgaben.length - 1, cum.findIndex((v) => v >= Math.max(1, target)));
    [...navBox.children].forEach((b, i) => b.classList.toggle('pace', i === k));
    if (el < 120) { paceEl.textContent = 'Tempo-Richtwert erscheint nach 2 Minuten.'; paceEl.className = 'pace-line small muted'; return; }
    const behind = target - have > Math.max(3, total * 0.1);
    paceEl.className = 'pace-line small ' + (behind ? 'behind' : 'ok');
    paceEl.textContent = 'Richtwert: jetzt etwa ' + target + ' von ' + total + ' P bearbeitet (Aufgabe ' + (k + 1) + '). Du: ' + have + ' P. ' + (behind ? 'Hänge nicht fest: Aufgabe überspringen, später zurückkommen.' : 'Gutes Tempo.');
  };
  top.append(navBox); if (showPace) top.append(paceEl); top.style.flexWrap = 'wrap'; page.classList.add('exam-run');
  if (window.ResizeObserver) new ResizeObserver(() => page.style.setProperty('--bar-h', top.offsetHeight + 'px')).observe(top);
  const tp = exam.textId ? textPanel(exam.textId) : null;
  page.append(top, tp ? h('div', { class: 'split' }, tp, tasksCol) : tasksCol);
  timer = setInterval(() => { left = exam.minutes * 60 - Math.floor((Date.now() - t0) / 1000); clock.textContent = fmtDur(Math.max(0, left)); clock.classList.toggle('low', left < 300); if (left <= 0) submit(true); else if ((left % 5) === 0) updPace(); }, 500);
  updPace();
  setLeave(() => clearInterval(timer));
  setGuard(() => (done ? Promise.resolve(true) : confirmBox('Simulation abbrechen?', 'Die Prüfung läuft noch. Wenn du die Seite verlässt, geht sie verloren.', 'Abbrechen und verlassen', 'Weiterarbeiten', true)), 'Eine Prüfungssimulation läuft noch.');

  async function submit(timeout) {
    if (done) return;
    if (!timeout) { const open = [...navBox.children].filter((b) => !b.classList.contains('done')).map((b) => b.textContent); const ok = await confirmBox('Prüfung abgeben?', 'Du hast noch ' + fmtDur(Math.max(0, left)) + ' Zeit.' + (open.length ? ' Noch nicht vollständig beantwortet: Aufgabe ' + open.join(', ') + '.' : '') + ' Nach dem Abgeben kannst du nichts mehr ändern.', 'Abgeben', 'Weiterarbeiten'); if (!ok) return; }
    done = true; setGuard(null); clearInterval(timer); const seconds = Math.min(exam.minutes * 60, Math.floor((Date.now() - t0) / 1000));
    if (timeout) toast('Die Zeit ist um. Die Prüfung wurde abgegeben.', 'info', 6000);
    const selfs = ctls.filter((x) => x.c.hasSelf());
    ctls.forEach((x) => { x.c.lock(); if (x.c.hasSelf()) x.c.revealSelf(); else { x.res = gradeTask(x.t, x.c.values(), {}); x.c.show(x.res); } x.sol.append(h('div', { class: 'solution' }, h('h4', null, 'Lösungsweg'), h('div', { html: mathify(x.t.solution || '') }))); });
    top.innerHTML = '';
    const finish = () => {
      ctls.forEach((x) => { x.res = gradeTask(x.t, x.c.values(), x.c.overrides()); x.c.show(x.res); });
      const pts = ctls.reduce((a, x) => a + x.res.points, 0); const grade = quarter(gradeFromPoints(pts, total));
      ctls.forEach((x) => { addAttempt({ key: x.t.key, skill: x.t.skill, points: x.res.points, max: x.res.max, sec: seconds * x.res.max / total, mode: 'sim', src: x.t.src, seed: x.t.seed }); if (x.res.points < x.res.max && x.t.seed) addError(x.t, ''); });
      const per = exam.aufgaben.map((A, ai) => { const xs = ctls.filter((x) => x.ai === ai); return { title: A.title, p: xs.reduce((a, x) => a + x.res.points, 0), m: xs.reduce((a, x) => a + x.res.max, 0) }; });
      p.mocks.push({ id: uid(), type: exam.type, date: dayKey(), points: pts, max: total, grade, seconds, textId: exam.textId || null, per }); save(); setTimeout(afterProgress, 400);
      top.innerHTML = ''; top.style.position = 'static';
      top.append(h('div', { class: 'grow' }, h('h2', null, 'Resultat: ' + pts + ' von ' + total + ' Punkten, Note ' + fmtGrade(grade)), h('p', { class: 'muted' }, 'Zeit: ' + fmtDur(seconds) + ' von ' + exam.minutes + ':00. Note nach linearer Skala (nicht offiziell). Falsche Aufgaben stehen jetzt im Fehlerheft.'),
        h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Aufgabe'), h('th', { class: 'num' }, 'Punkte'))), h('tbody', null, per.map((x, i) => h('tr', null, h('td', null, h('a', { href: '#/simulation', onclick: (e) => { e.preventDefault(); document.getElementById('aufg-' + (i + 1)).scrollIntoView({ behavior: 'smooth' }); } }, (i + 1) + '. ' + x.title)), h('td', { class: 'num' }, x.p + ' / ' + x.m))))),
        h('div', { class: 'row', style: { marginTop: '0.8rem' } }, h('a', { class: 'btn primary', href: '#/simulation' }, 'Zur Übersicht'), h('a', { class: 'btn', href: '#/fehlerheft' }, 'Zum Fehlerheft'))));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    if (selfs.length) { top.append(h('div', { class: 'grow' }, h('b', null, 'Fast fertig: ' + selfs.length + (selfs.length === 1 ? ' Aufgabe bewertest' : ' Aufgaben bewertest') + ' du selbst.'), h('div', { class: 'muted small' }, 'Vergleiche bei diesen Aufgaben deine Antwort mit der Musterlösung und kreuze an, was stimmt. Bei getippten Sätzen kannst du «gleichwertig» ankreuzen.')), btn('Bewertung abschliessen', finish, { kind: 'primary' })); selfs[0].el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    else { top.append(h('div', { class: 'grow' }, h('b', null, 'Abgegeben. '), 'Prüfe bei getippten Sätzen, ob deine Antwort gleichwertig ist, und schliesse dann ab.'), btn('Bewertung abschliessen', finish, { kind: 'primary' })); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }
}

export function render(page, args) {
  const type = args[0];
  if (type !== 'sprache' && type !== 'mathe') return overview(page);
  page.append(h('a', { class: 'back', href: '#/simulation' }, '‹ Übersicht'));
  const rules = type === 'sprache' ? ['45 Minuten, 14 Aufgaben, 75 Punkte: rund 36 Sekunden pro Punkt.', 'Keine Hilfsmittel, auch kein Wörterbuch.', 'Lies zuerst den Text (höchstens 10 Minuten), dann die Aufgaben.', 'Nie mehr ankreuzen als verlangt. Wo 1 Wort verlangt ist, nur 1 Wort schreiben.'] : ['90 Minuten, 10 Aufgaben, 37 Punkte: rund 2.4 Minuten pro Punkt.', 'Lege bereit: deinen Rechner (1 der 4 erlaubten Modelle), Geodreieck, Zirkel, Bleistift, Radiergummi und leere Blätter (an der Prüfung schreibst du alles ins Prüfungsheft).', 'Löse auf Papier mit vollständigem Weg. In die App tippst du das Resultat.', 'Aufgabe 1 in höchstens 24 Minuten.'];
  page.append(h('div', { class: 'card' }, h('h1', null, PARTS[type].name + ': Simulation'), h('ul', { style: { paddingLeft: '1.2rem' } }, rules.map((r) => h('li', null, r))), h('p', { class: 'muted' }, 'Sorge dafür, dass dich in dieser Zeit niemand stört. Die Uhr lässt sich nicht anhalten.'),
    h('label', { class: 'row', style: { gap: '0.5rem', margin: '0.2rem 0 1rem' } }, h('input', { type: 'checkbox', checked: !(state.profile.settings && state.profile.settings.pace === false), onchange: (e) => { state.profile.settings = state.profile.settings || {}; state.profile.settings.pace = e.target.checked; save(); } }), h('span', null, 'Tempo-Richtwert anzeigen (zeigt, wie viele Punkte du jetzt etwa bearbeitet haben solltest)')),
    btn('Prüfung jetzt starten', () => { try { runExam(page, type === 'sprache' ? buildSprache() : buildMathe()); } catch (e) { console.error(e); toast('Die Prüfung konnte nicht erstellt werden: ' + e.message, 'bad'); } }, { kind: 'primary big', icon: 'play' })));
}
