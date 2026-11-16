// Fortschritt sichtbar machen: Stufen, Stoffkarte, Wochenziel, Tagesziel, Kalender, Meilensteine und Stempel.
// Grundsätze (Recherche): Stufen statt Punkte, kein Vergleich mit anderen, 1 freier Tag pro Woche,
// Feiern nur bei echten Fortschritten, nächstes Ziel immer sichtbar, Bewegung abschaltbar.
import { h, icon, toast, bar } from './ui.js';
import { state, save } from './store.js';
import { SKILLS, SKILL, RULES } from './skills.js';
import { STAGES, SURE, courseProgress, weekGoal, dailyGoal, minutesInfo, officialGate, allStats, skillStats } from './stats.js';
import { dayKey, addDays, parseDay, fmtDate, fmtMin } from './util.js';

const WD = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const svgEl = (tag, attrs) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const [k, v] of Object.entries(attrs || {})) e.setAttribute(k, v); return e; };

// ---------- Stufe: 4 Kästchen, gefüllt bis zur erreichten Stufe ----------
export function stagePips(stage, opts = {}) {
  const box = h('span', { class: 'pips' + (stage >= 4 ? ' top' : ''), role: 'img', 'aria-label': 'Stufe ' + STAGES[stage].name });
  for (let i = 1; i <= 4; i++) box.append(h('i', { class: i <= stage ? 'on' : '' }));
  if (opts.label === false) return box;
  return h('span', { class: 'stage' }, box, h('span', { class: 'stage-name' + (stage >= 4 ? ' top' : '') + (stage === 0 ? ' muted' : '') }, STAGES[stage].name));
}

// ---------- Tagesziel als Ring ----------
export function ring(done, goal, opts = {}) {
  const size = opts.size || 64, r = size / 2 - 6, c = 2 * Math.PI * r; const f = goal > 0 ? Math.min(1, done / goal) : 0;
  const s = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, width: size, height: size, class: 'ring' + (goal > 0 && done >= goal ? ' met' : ''), role: 'img', 'aria-label': opts.aria || (Math.round(done) + ' von ' + goal + ' Minuten') });
  s.append(svgEl('circle', { cx: size / 2, cy: size / 2, r, class: 'ring-bg' }));
  s.append(svgEl('circle', { cx: size / 2, cy: size / 2, r, class: 'ring-fg', 'stroke-dasharray': `${(c * f).toFixed(1)} ${c.toFixed(1)}`, transform: `rotate(-90 ${size / 2} ${size / 2})` }));
  const t = svgEl('text', { x: size / 2, y: size / 2 + 5, 'text-anchor': 'middle', class: 'ring-txt' }); t.textContent = goal > 0 && done >= goal ? '✓' : Math.round(done); s.append(t);
  return s;
}

// ---------- Woche: 7 Kästchen, 1 freier Tag eingeplant ----------
export function weekStrip(p, opts = {}) {
  const wg = weekGoal(p);
  const row = h('div', { class: 'week', role: 'list', 'aria-label': 'Lerntage diese Woche' });
  wg.days.forEach((d, i) => {
    const cell = h('span', { class: 'wd' + (d.done ? ' done' : '') + (d.today ? ' today' : '') + (d.future ? ' future' : ''), role: 'listitem', title: fmtDate(d.k, true) + (d.done ? ': ' + fmtMin(d.min) + ' gelernt' : '') }, h('small', null, WD[i]), h('span', { class: 'box' }, d.done ? icon('check', 16) : null));
    row.append(cell);
  });
  const txt = wg.met ? 'Wochenziel erreicht: ' + wg.count + ' Lerntage.' : wg.count + ' von ' + wg.goal + ' Lerntagen. ' + (wg.planned >= 4 ? '1 freier Tag ist eingeplant.' : '');
  return h('div', { class: 'week-box' }, h('div', { class: 'row between', style: { alignItems: 'flex-end' } }, row,
    wg.streak > 0 ? h('div', { class: 'streak', title: 'Wochen in Folge mit erreichtem Wochenziel' }, h('b', null, String(wg.streak)), h('span', null, wg.streak === 1 ? 'Woche im Ziel' : 'Wochen in Folge im Ziel')) : null),
  opts.text === false ? null : h('div', { class: 'small muted', style: { marginTop: '0.35rem' } }, txt, ' Ein Tag zählt ab 10 Minuten.'));
}

// ---------- Stoffkarte: alle Themen als Karos ----------
export function topicMap(p, opts = {}) {
  const cp = courseProgress(p); const byId = Object.fromEntries(cp.st.map((x) => [x.id, x]));
  const wrap = h('div', { class: 'tmap' });
  [['sprache', 'Deutsch'], ['mathe', 'Mathematik']].forEach(([part, label]) => {
    const ids = SKILLS.filter((s) => (part === 'mathe' ? s.part === 'mathe' : s.part !== 'mathe')).map((s) => s.id);
    const sure = ids.filter((id) => byId[id].stage >= SURE).length;
    const grid = h('div', { class: 'tmap-grid' });
    ids.forEach((id) => { const st = byId[id]; grid.append(h('a', { class: 'tm s' + st.stage, href: '#/lernen/' + id, title: id + ' ' + SKILL[id].name + ': ' + STAGES[st.stage].name, 'aria-label': id + ' ' + SKILL[id].name + ', Stufe ' + STAGES[st.stage].name }, id)); });
    wrap.append(h('div', { class: 'tmap-part' }, h('div', { class: 'row between small' }, h('b', null, label), h('span', { class: 'muted' }, sure + ' von ' + ids.length + ' sicher')), grid));
  });
  if (opts.legend !== false) wrap.append(h('div', { class: 'tmap-legend small muted' }, STAGES.map((s, i) => h('span', null, h('i', { class: 'tm s' + i, 'aria-hidden': 'true' }), s.name))));
  return wrap;
}

// ---------- Kalender: jeder Tag ein Karo, vom Start bis zur Prüfung ----------
export function studyCalendar(p) {
  const exam = parseDay(p.setup.examDate || RULES.examDate); const today = dayKey();
  const start0 = new Date(Math.min(p.created || Date.now(), Date.now())); start0.setHours(0, 0, 0, 0);
  const start = addDays(start0, -((start0.getDay() + 6) % 7));
  const weeks = Math.ceil((exam - start) / (7 * 86400000)) + 1;
  const grid = h('div', { class: 'cal', style: { gridTemplateColumns: `1.8rem repeat(${weeks}, 1fr)` }, role: 'img', 'aria-label': 'Lernkalender bis zur Prüfung' });
  grid.append(h('span'));
  let lastMon = -1;
  for (let w = 0; w < weeks; w++) { const d = addDays(start, 7 * w); const m = d.getMonth(); grid.append(h('span', { class: 'cal-m' }, m !== lastMon ? ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'][m] : '')); lastMon = m; }
  for (let r = 0; r < 7; r++) {
    grid.append(h('span', { class: 'cal-d' }, r % 2 === 0 ? WD[r] : ''));
    for (let w = 0; w < weeks; w++) {
      const d = addDays(start, 7 * w + r); const k = dayKey(d); const min = p.days[k] || 0;
      const lvl = min <= 0 ? 0 : min < 10 ? 1 : min < 30 ? 2 : min < 60 ? 3 : 4;
      const isExam = k === dayKey(exam); const fut = k > today; const before = d < start0;
      grid.append(h('span', { class: 'cal-c c' + lvl + (fut ? ' fut' : '') + (k === today ? ' now' : '') + (isExam ? ' exam' : '') + (before ? ' pre' : ''), title: fmtDate(k, true) + (isExam ? ': Prüfung' : min ? ': ' + fmtMin(min) : '') }, isExam ? 'P' : ''));
    }
  }
  const mi = minutesInfo(p); const days = Object.values(p.days).filter((v) => v >= 10).length;
  const left = Math.max(0, Math.round((exam - parseDay(today)) / 86400000));
  return h('div', null, h('div', { class: 'cal-scroll' }, grid),
    h('div', { class: 'row between small', style: { marginTop: '0.5rem' } }, h('span', null, h('b', null, String(days)), ' Lerntage, ', h('b', null, fmtMin(mi.total)), ' gelernt. Noch ', h('b', null, String(left)), ' Tage bis zur Prüfung.'),
      h('span', { class: 'cal-legend muted' }, 'weniger', [1, 2, 3, 4].map((l) => h('i', { class: 'cal-c c' + l })), 'mehr')));
}

// ---------- Runde: ein Karo pro Aufgabe ----------
export function roundCells(n, results, cur) {
  const row = h('div', { class: 'round', role: 'img', 'aria-label': 'Aufgabe ' + Math.min(n, cur + 1) + ' von ' + n });
  for (let i = 0; i < n; i++) { const r = results[i]; row.append(h('i', { class: r == null ? (i === cur ? 'cur' : '') : r === -1 ? 'skip' : r === -2 ? 'part' : r >= 1 ? 'ok' : r > 0 ? 'part' : 'miss' })); }
  return row;
}

// ---------- Meilensteine: an Lernen gebunden, nicht an Klicks ----------
export const MILESTONES = [
  { id: 'einstufung', title: 'Standort bestimmt', text: 'Einstufungstest abgeschlossen.', test: (c) => c.p.setup.assessed },
  { id: 'woche', title: 'Erstes Wochenziel', text: 'Eine Woche lang regelmässig gelernt.', test: (c) => c.wg.streak >= 1 },
  { id: 'sicher1', title: 'Erstes sicheres Thema', text: 'Ein Thema hat die Stufe «Sicher» erreicht.', test: (c) => c.cp.sure >= 1, prog: (c) => [c.cp.sure, 1], unit: ['Thema', 'Themen'] },
  { id: 'sim1', title: 'Erste Simulation', text: 'Eine Prüfung unter echten Bedingungen geschrieben.', test: (c) => c.p.mocks.length >= 1 },
  { id: 'aufsatz1', title: 'Erster Aufsatz', text: 'Einen Aufsatz fertig geschrieben.', test: (c) => c.p.essays.some((e) => e.done) },
  { id: 'tempo', title: 'Im Prüfungstempo', text: 'Ein Thema so schnell gelöst wie an der Prüfung verlangt.', test: (c) => c.cp.st.some((x) => x.n >= 6 && x.ratio != null && x.ratio <= 1) },
  { id: 'stunden10', title: '10 Stunden gelernt', text: 'Zusammen 10 Stunden geübt.', test: (c) => c.mi.total >= 600, prog: (c) => [Math.floor(c.mi.total / 60), 10], unit: ['Stunde', 'Stunden'] },
  { id: 'sicher10', title: '10 Themen sicher', text: '10 Themen auf «Sicher» oder höher.', test: (c) => c.cp.sure >= 10, prog: (c) => [c.cp.sure, 10], unit: ['Thema', 'Themen'] },
  { id: 'fehler10', title: '10 Fehler ausgebügelt', text: '10 Aufgaben aus dem Fehlerheft 3-mal richtig gelöst.', test: (c) => (c.p.errorsClosed || 0) >= 10, prog: (c) => [c.p.errorsClosed || 0, 10], unit: ['Fehler', 'Fehler'] },
  { id: 'meister1', title: 'Erstes Thema gemeistert', text: 'Zuverlässig richtig und im Prüfungstempo.', test: (c) => c.cp.counts[4] >= 1, big: true },
  { id: 'serie4', title: '4 Wochen dran geblieben', text: '4 Wochen in Folge das Wochenziel erreicht.', test: (c) => c.wg.streak >= 4, prog: (c) => [c.wg.streak, 4], unit: ['Woche', 'Wochen'] },
  { id: 'sicher28', title: 'Die Hälfte geschafft', text: '28 Themen auf «Sicher» oder höher.', test: (c) => c.cp.sure >= 28, prog: (c) => [c.cp.sure, 28], unit: ['Thema', 'Themen'], big: true },
  { id: 'offiziell', title: 'Bereit für die Originale', text: 'Die offiziellen Prüfungen sind freigeschaltet.', test: (c) => c.gate.open, big: true },
  { id: 'serie8', title: '8 Wochen dran geblieben', text: '8 Wochen in Folge das Wochenziel erreicht.', test: (c) => c.wg.streak >= 8, prog: (c) => [c.wg.streak, 8], unit: ['Woche', 'Wochen'], big: true },
  { id: 'alle', title: 'Alle Themen sicher', text: 'Jedes Thema auf «Sicher» oder höher.', test: (c) => c.cp.sure >= c.cp.total, prog: (c) => [c.cp.sure, c.cp.total], unit: ['Thema', 'Themen'], big: true }
];
const ctxOf = (p) => ({ p, cp: courseProgress(p), wg: weekGoal(p), mi: minutesInfo(p), gate: officialGate(p) });

// Beim ersten Mal (oder nach einem Update) alles Erreichte still eintragen, damit nicht 10 Stempel auf einmal kommen.
export function initRewards(p) {
  let changed = false;
  if (!p.stageSeen) { p.stageSeen = {}; allStats(p).forEach((st) => { p.stageSeen[st.id] = st.stage; }); changed = true; }
  if (!p.milestones) { p.milestones = {}; const c = ctxOf(p); const pre = p.milestonesPreset || {}; MILESTONES.forEach((m) => { if (m.test(c)) p.milestones[m.id] = pre[m.id] || 'früher'; }); delete p.milestonesPreset; changed = true; } // Datum unbekannt
  if (!p.goalsSeen) { p.goalsSeen = {}; changed = true; }
  return changed;
}

// Nächstes Ziel: der Meilenstein mit Zahlen, dem man am nächsten ist
export function nextMilestone(p) {
  initRewards(p); const c = ctxOf(p);
  const open = MILESTONES.filter((m) => !p.milestones[m.id] && m.prog).map((m) => { const [cur, tgt] = m.prog(c); return { m, cur: Math.min(cur, tgt), tgt, f: tgt ? cur / tgt : 0 }; }).filter((x) => x.f < 1);
  open.sort((a, b) => b.f - a.f); return open[0] || null;
}

// Fortschritt nach einer Runde, Simulation oder einem Aufsatz einsammeln
export function collectEvents(p) {
  initRewards(p); const ev = [];
  allStats(p).forEach((st) => { const seen = p.stageSeen[st.id] || 0; if (st.stage > seen) { p.stageSeen[st.id] = st.stage; if (st.stage >= 2) ev.push({ kind: 'stage', sid: st.id, to: st.stage, big: st.stage >= 4 }); } });
  const dg = dailyGoal(p); const dk = 'd' + dayKey();
  if (dg.met && !p.goalsSeen[dk]) { p.goalsSeen[dk] = 1; ev.push({ kind: 'day', done: dg.done, goal: dg.goal }); }
  const wg = weekGoal(p); const wk = 'w' + wg.days[0].k;
  if (wg.met && !p.goalsSeen[wk]) { p.goalsSeen[wk] = 1; ev.push({ kind: 'week', count: wg.count, streak: wg.streak }); }
  const c = ctxOf(p);
  MILESTONES.forEach((m) => { if (!p.milestones[m.id] && m.test(c)) { p.milestones[m.id] = dayKey(); ev.push({ kind: 'milestone', m, big: !!m.big }); } });
  // alte Einträge aufräumen
  const old = dayKey(addDays(new Date(), -60)); for (const k of Object.keys(p.goalsSeen)) if (k.slice(1) < old) delete p.goalsSeen[k];
  return ev;
}

const reduced = () => (document.documentElement.dataset.motion === 'aus') || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
export function eventText(e) {
  if (e.kind === 'stage') return { stamp: STAGES[e.to].name, sub: e.sid + ' ' + SKILL[e.sid].name, text: e.to >= 4 ? 'Zuverlässig richtig und im Prüfungstempo.' : e.to === 3 ? 'Zuverlässig richtig. Das Thema zählt jetzt als gelernt.' : 'Meistens richtig. Weiter so.' };
  if (e.kind === 'day') return { stamp: 'Tagesziel', sub: Math.round(e.done) + ' von ' + e.goal + ' Minuten', text: 'Für heute ist dein Plan erfüllt.' };
  if (e.kind === 'week') return { stamp: 'Wochenziel', sub: e.count + ' Lerntage', text: e.streak > 1 ? e.streak + ' Wochen in Folge im Ziel.' : 'Regelmässig lernen wirkt mehr als viel auf einmal.' };
  return { stamp: 'Meilenstein', sub: e.m.title, text: e.m.text };
}

// Stempel: landet wie der Stempel einer Lehrperson auf dem Heft. Ohne Bewegung, wenn gewünscht.
let shown = null;
export function celebrate(events) {
  const p = state.profile; if (!events.length || !p || p.settings.celebrate === false) return;
  const rank = (e) => (e.big ? 3 : 0) + (e.kind === 'milestone' ? 2 : e.kind === 'stage' && e.to >= 3 ? 2 : e.kind === 'week' ? 1.5 : 1);
  const sorted = events.slice().sort((a, b) => rank(b) - rank(a)); const main = sorted[0]; const t = eventText(main);
  if (main.kind === 'day' || (main.kind === 'stage' && main.to === 2)) { // klein: nur eine Meldung
    sorted.forEach((e) => { const x = eventText(e); toast(x.stamp + ': ' + x.sub + '. ' + x.text, 'ok', 5200); }); return;
  }
  if (shown) shown.remove();
  const close = () => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); document.removeEventListener('keydown', onKey, true); if (shown === wrap) shown = null; };
  const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
  const kind = main.kind === 'stage' ? 'st' + main.to : main.kind;
  const wrap = h('div', { class: 'stamp-wrap' + (reduced() ? ' still' : '') + (main.big ? ' big' : ''), role: 'status', 'aria-live': 'polite', onclick: close },
    h('div', { class: 'stamp-card' },
      h('div', { class: 'stamp ' + kind }, h('span', { class: 'stamp-title' }, t.stamp)),
      h('div', { class: 'stamp-sub' }, h('span', null, t.sub)),
      h('p', { class: 'stamp-text' }, t.text),
      sorted.length > 1 ? h('ul', { class: 'stamp-more small' }, sorted.slice(1, 4).map((e) => { const x = eventText(e); return h('li', null, h('b', null, x.stamp + ': '), x.sub); })) : null,
      h('div', { class: 'small muted' }, 'Klicken oder Esc zum Schliessen')));
  if (main.big && !reduced()) { const burst = h('div', { class: 'burst', 'aria-hidden': 'true' }); for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; burst.append(h('i', { style: { '--dx': Math.round(Math.cos(a) * (90 + (i % 3) * 30)) + 'px', '--dy': Math.round(Math.sin(a) * (70 + (i % 4) * 22)) + 'px', '--r': (i * 37 % 90) + 'deg' }, class: i % 3 ? '' : 'y' })); } wrap.firstChild.prepend(burst); }
  document.body.append(wrap); shown = wrap; document.addEventListener('keydown', onKey, true);
  setTimeout(() => { if (wrap.isConnected) close(); }, main.big ? 7000 : 4800);
}
export function afterProgress() { const p = state.profile; if (!p) return []; const ev = collectEvents(p); save(); celebrate(ev); return ev; }

// Fortschritt einer Runde für die Auswertung: Stufe vorher → nachher
export function stageChanges(before, skills) {
  const p = state.profile; return skills.map((sid) => { const a = before[sid] ? before[sid].stage : 0; const b = skillStats(p, sid).stage; return { sid, from: a, to: b }; });
}

export function nextGoalLine(p) {
  const nm = nextMilestone(p); if (!nm) return null; const left = nm.tgt - nm.cur; const u = nm.m.unit || ['', ''];
  return h('div', { class: 'next-goal' }, icon('flag', 20), h('div', { class: 'grow' }, h('div', { class: 'small' }, h('b', null, 'Nächster Meilenstein: ' + nm.m.title + '. '), 'Noch ' + left + ' ' + (left === 1 ? u[0] : u[1]) + '.'), bar(nm.cur, nm.tgt, 'thin', nm.m.title)));
}
export function milestoneGrid(p) {
  initRewards(p); const c = ctxOf(p);
  return h('div', { class: 'milestones' }, MILESTONES.map((m) => { const got = p.milestones[m.id]; const pr = !got && m.prog ? m.prog(c) : null;
    return h('div', { class: 'ms' + (got ? ' got' : ''), title: m.text }, h('b', null, m.title), h('span', { class: 'muted' }, got ? (/^\d{4}-/.test(got) ? 'erreicht am ' + fmtDate(got) : 'erreicht') : m.text),
      pr ? h('div', { class: 'msbar' }, h('span', { style: { width: Math.min(100, Math.round(pr[0] / pr[1] * 100)) + '%' } })) : null); }));
}
