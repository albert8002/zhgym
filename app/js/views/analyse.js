// Auswertung (Stärken, Schwächen, Fehlerquote, Tempo) und Fehlerheft (Wiederholung nach 1, 7 und 21 Tagen).
import { h, btn, bar, ruler, lineChart, barsChart, tabs, toast, confirmBox, saveText, icon } from '../ui.js';
import { state, save, dueErrors, reviewError } from '../store.js';
import { allStats, readiness, strengths, speedGains, minutesInfo, STAGES, courseProgress } from '../stats.js';
import { stagePips, studyCalendar, milestoneGrid, topicMap } from '../progress.js';
import { SKILL, PARTS, AREAS, RULES } from '../skills.js';
import { makeTask, GEN } from '../engine/sources.js';
import { runSession, summaryCard } from '../runner.js';
import { setLeave, refresh } from '../main.js';
import { fmtDur, fmtMin, fmtGrade, fmtDate, fmtDateShort, dayKey, addDays } from '../util.js';

const pct = (v) => (v == null ? '–' : Math.round(v * 100) + ' %');
const LEVEL = { neu: ['neu', ''], schwach: ['schwach', 'bad'], mittel: ['mittel', 'warn'], stark: ['stark', 'ok'] };

function speedText(st) {
  if (st.ratio == null) return h('span', { class: 'muted' }, '–');
  const r = st.ratio; const cls = r <= 1 ? 'ok' : r <= 1.5 ? 'warn' : 'bad';
  return h('span', { class: 'tag ' + cls, title: 'Deine Zeit pro Punkt geteilt durch die Zeit an der Prüfung' }, r <= 1 ? 'im Prüfungstempo' : Math.round((r - 1) * 100) + ' % zu langsam');
}

export function render(page, args) {
  const p = state.profile; const r = readiness(p); const mi = minutesInfo(p); const st = allStats(p);
  page.append(h('div', { class: 'page-head' }, h('div', { class: 'row between' }, h('h1', null, 'Auswertung'), h('a', { class: 'btn', href: '#/bericht' }, icon('print'), 'Wochenbericht')), h('p', null, 'Stärken und Schwächen, Fehlerquote und Tempo pro Thema. Das Prüfungstempo ist die Zeit, die du an der Prüfung pro Punkt hast.')));
  const done = p.attempts.filter((a) => a.m > 0).length;
  page.append(h('div', { class: 'kpi' },
    h('div', null, h('b', null, pct(r.total)), h('span', null, 'Bereitschaft')), h('div', null, h('b', null, pct(r.coverage)), h('span', null, 'Stoff geübt')),
    h('div', null, h('b', null, String(done)), h('span', null, 'gelöste Aufgaben')), h('div', null, h('b', null, fmtMin(mi.total)), h('span', null, 'Lernzeit gesamt')),
    h('div', null, h('b', null, r.pn != null ? fmtGrade(r.pn) : '–'), h('span', null, 'geschätzte Prüfungsnote')), h('div', null, h('b', null, fmtGrade(RULES.neededPN(p.setup.vn))), h('span', null, 'nötige Prüfungsnote'))));

  // Prüfungsteile
  const parts = h('div', { class: 'cols three', style: { marginTop: '1rem' } });
  ['sprache', 'aufsatz', 'mathe'].forEach((k) => { const ps = r.parts[k];
    parts.append(h('div', { class: 'card' }, h('h3', null, PARTS[k].name + ' (' + Math.round(PARTS[k].weight * 100) + ' %)'), ruler(ps.ready, { mini: true, label: PARTS[k].name }),
      h('p', { class: 'small' }, 'Bereitschaft ' + pct(ps.ready) + ', geübt ' + pct(ps.coverage) + (ps.est ? ', Note ca. ' + fmtGrade(ps.est) : '') + (ps.mocks ? ' (aus ' + ps.mocks + ' Simulationen)' : ''))));
  });
  page.append(parts);

  // Stärken und Schwächen
  const sw = strengths(p, 5);
  const listOf = (xs, good) => (xs.length ? h('ol', { style: { paddingLeft: '1.2rem' } }, xs.map((x) => h('li', null, h('a', { href: '#/lernen/' + x.id }, x.id + ' ' + x.skill.name), ' ', h('span', { class: 'muted small' }, STAGES[x.stage].name + ', ' + pct(x.acc) + ' der Punkte')))) : h('p', { class: 'muted' }, good ? 'Noch zu wenig Daten (mindestens 3 Aufgaben pro Thema).' : 'Noch zu wenig Daten.'));
  page.append(h('div', { class: 'cols two', style: { marginTop: '1rem' } }, h('div', { class: 'card' }, h('h3', null, 'Stärken'), listOf(sw.strong, true)), h('div', { class: 'card' }, h('h3', null, 'Hier holst du am meisten Punkte'), listOf(sw.weak, false), sw.weak.length ? btn('Genau diese Themen im Endlos-Training üben', () => { p.settings.scopeSkills = sw.weak.map((x) => x.id); save(); location.hash = '#/training'; }, { kind: 'small' }) : null)));

  // Tempo-Gewinn
  const gains = speedGains(p);
  if (gains.length) page.append(h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h3', null, 'So viel schneller bist du geworden'), h('ul', { style: { paddingLeft: '1.2rem' } }, gains.slice(0, 8).map((g) => h('li', null, h('b', null, g.skill.id + ' ' + g.skill.name + ': '), Math.round(g.pct * 100) + ' % schneller (pro Punkt ' + fmtDur(g.first) + ' am Anfang, jetzt ' + fmtDur(g.last) + ')'))), h('p', { class: 'hint' }, 'Vergleich: Median deiner ersten 5 Aufgaben mit den letzten 5 (ab 10 Aufgaben pro Thema).')));

  // Tabelle aller Skills
  let subj = args[0] === 'M' ? 'M' : 'D'; let sortKey = 'id'; let dir = 1;
  const wrap = h('div', { class: 'card', style: { marginTop: '1rem' } });
  const draw = () => {
    wrap.innerHTML = '';
    wrap.append(h('div', { class: 'row between' }, h('h3', { style: { margin: 0 } }, 'Alle Themen'), btn('Daten als CSV speichern', exportCsv, { kind: 'small quiet', icon: 'down' })));
    wrap.append(tabs([{ id: 'D', label: 'Deutsch' }, { id: 'M', label: 'Mathematik' }], subj, (id) => { subj = id; draw(); }));
    const rows = st.filter((x) => x.skill.subj === subj);
    const val = { id: (x) => Number(x.id.slice(1)), n: (x) => x.n, err: (x) => (x.err == null ? -1 : x.err), spp: (x) => x.spp || 0, ratio: (x) => (x.ratio == null ? -1 : x.ratio), mastery: (x) => x.stage * 10 + x.mastery, gain: (x) => (x.gain ? x.gain.pct : -9) };
    rows.sort((a, b) => (val[sortKey](a) - val[sortKey](b)) * dir);
    const th = (k, label, cls) => h('th', { class: cls || null, 'aria-sort': sortKey === k ? (dir > 0 ? 'ascending' : 'descending') : null }, h('button', { type: 'button', class: 'linkish', onclick: () => { if (sortKey === k) dir = -dir; else { sortKey = k; dir = k === 'id' ? 1 : -1; } draw(); } }, label + (sortKey === k ? (dir > 0 ? ' ▲' : ' ▼') : '')));
    wrap.append(h('div', { class: 'table-scroll' }, h('table', { class: 'list' }, h('thead', null, h('tr', null, th('id', 'Thema'), th('n', 'Aufgaben', 'num'), th('err', 'Fehlerquote', 'num'), th('spp', 'deine Zeit/Punkt', 'num'), h('th', { class: 'num' }, 'Prüfung/Punkt'), th('ratio', 'Tempo'), th('mastery', 'Stufe'), th('gain', 'schneller seit Beginn', 'num'))),
      h('tbody', null, rows.map((x) => h('tr', null, h('td', null, h('a', { href: '#/lernen/' + x.id }, x.id + ' ' + x.skill.name), null),
        h('td', { class: 'num' }, String(x.n)), h('td', { class: 'num' }, pct(x.err)), h('td', { class: 'num' }, x.spp ? fmtDur(x.spp) : '–'), h('td', { class: 'num' }, fmtDur(x.target)), h('td', null, speedText(x)),
        h('td', null, stagePips(x.stage)),
        h('td', { class: 'num' }, x.gain ? Math.round(x.gain.pct * 100) + ' %' : '–')))))));
    wrap.append(h('p', { class: 'hint' }, 'Fehlerquote = verlorene Punkte : mögliche Punkte. Zeit pro Punkt = Median der letzten 12 Aufgaben. Stufe: Begonnen, Vertraut (meistens richtig), Sicher (zuverlässig richtig), Gemeistert (zuverlässig richtig und im Prüfungstempo). Neue Aufgaben zählen stärker als alte.'));
  };
  draw(); page.append(wrap);

  // Verläufe
  const charts = h('div', { class: 'cols two', style: { marginTop: '1rem' } });
  const mocks = h('div', { class: 'card' }, h('h3', null, 'Noten der Simulationen und offiziellen Prüfungen'));
  const all = [...p.mocks.map((m) => ({ d: m.date, g: m.grade, t: { sprache: 'S', mathe: 'M', aufsatz: 'A' }[m.type] || '?' })), ...p.officials.map((o) => ({ d: o.date, g: o.grade, t: (o.part === 'M' ? 'M' : 'S') + ' ' + o.y }))].sort((a, b) => (a.d < b.d ? -1 : 1));
  if (all.length) mocks.append(lineChart(all.map((x) => ({ x: x.t, y: Math.round(x.g * 100) / 100 })), { min: 1, max: 6, ticks: [1, 2, 3, 4, 5, 6], goal: RULES.neededPN(p.setup.vn), goalLabel: 'nötige Note', label: 'Notenverlauf' }), h('p', { class: 'hint' }, 'S = Sprachprüfung, M = Mathematik, A = Aufsatz. Mit Jahreszahl: offizielle Prüfung.'));
  else mocks.append(h('p', { class: 'muted' }, 'Noch keine Simulation. Ab Phase «Training» jede Woche 1 Simulation.'));
  const cp = courseProgress(p);
  charts.append(mocks, h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', null, 'Stoffkarte'), h('span', { class: 'muted small' }, h('b', null, cp.sure + ' von ' + cp.total), ' sicher')), topicMap(p)));
  page.append(charts);
  page.append(h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h3', null, 'Meilensteine'), h('p', { class: 'muted small' }, 'Gestempelt ist, was du schon erreicht hast. Der Balken zeigt, wie nahe du dem nächsten bist.'), milestoneGrid(p)));
  page.append(h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h3', null, 'Dein Weg zur Prüfung'), h('p', { class: 'muted small' }, 'Jedes Karo ist ein Tag. Je dunkler, desto länger gelernt. Das gelbe Karo mit P ist der Prüfungstag.'), studyCalendar(p)));

  function exportCsv() {
    const lines = ['Zeit;Thema;Aufgabenart;Punkte;Maximum;Sekunden;Modus;Quelle'];
    for (const a of p.attempts) lines.push([new Date(a.t).toISOString(), a.s, a.k, a.p, a.m, a.sec, a.mode, a.src].join(';'));
    saveText('gymi-trainer-versuche.csv', '﻿' + lines.join('\n'), 'text/csv');
  }
}

// ---------- Fehlerheft ----------
export function renderErrors(page) {
  const p = state.profile; const due = dueErrors();
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Fehlerheft'), h('p', null, 'Falsch gelöste Aufgaben kommen nach 1, 7 und 21 Tagen wieder: zuerst genau dieselbe Aufgabe, danach dieselbe Art mit neuen Zahlen. Wer eine Aufgabe 3-mal richtig löst, hat sie im Griff. Ein neuer Fehler setzt sie auf Tag 1 zurück.')));
  const head = h('div', { class: 'card' });
  if (due.length) head.append(h('div', { class: 'row between' }, h('div', null, h('b', null, due.length + (due.length === 1 ? ' Aufgabe ist' : ' Aufgaben sind') + ' fällig.'), h('div', { class: 'muted small' }, 'Die Aufgaben sind genau dieselben wie beim ersten Mal.')), btn('Jetzt wiederholen', () => run(false), { kind: 'primary big', icon: 'play' })));
  else head.append(h('p', null, p.errors.length ? 'Heute ist nichts fällig. Nächste Wiederholung: ' + fmtDate(new Date(Math.min(...p.errors.map((e) => e.due)))) + '.' : 'Das Fehlerheft ist leer. Falsch gelöste Aufgaben landen automatisch hier.'));
  if (p.errors.length) head.append(h('div', { class: 'row', style: { marginTop: '0.6rem' } }, btn(p.errors.length === 1 ? 'Den Eintrag üben' : 'Alle ' + p.errors.length + ' Einträge üben', () => run(true), { kind: due.length ? 'quiet' : '', icon: 'loop' }), h('span', { class: 'muted small' }, 'Zusatztraining: ändert die Wiederholungstermine nicht.')));
  page.append(head);
  const host = h('div'); page.append(host);

  function run(extra) {
    const bad = p.errors.filter((e) => !GEN[e.key]); if (bad.length) { p.errors = p.errors.filter((e) => GEN[e.key]); save(); }
    const list = extra === true ? p.errors.slice().sort(() => Math.random() - 0.5).slice(0, 30) : dueErrors().slice(0, 30); if (!list.length) { refresh(); return; } host.innerHTML = ''; head.hidden = true;
    const sess = runSession(host, { title: 'Fehlerheft', mode: 'fehlerheft', limit: list.length, noErrors: true, backHref: '#/fehlerheft',
      next: (i) => { const e = list[i]; if (!e) return null; const seed = e.stage > 0 ? ((e.seed ^ Math.imul(e.stage, 2654435761)) >>> 0) || 1 : e.seed; let t; try { t = makeTask(e.key, seed); } catch (err) { t = makeTask(e.key, e.seed); } t._err = e.id; return t; }, // 1. Wiederholung: dieselbe Aufgabe, danach neue Zahlen
      review: (task, ok) => { if (task._err && extra !== true) reviewError(task._err, ok); },
      onDone: (sum, root) => root.append(summaryCard(sum, { backHref: '#/fehlerheft', backLabel: 'Zum Fehlerheft' })) });
    setLeave(() => sess.stop());
  }

  if (!p.errors.length) return;
  // Ursachen
  const causes = {}; p.errors.forEach((e) => { const c = e.cause || 'nicht angegeben'; causes[c] = (causes[c] || 0) + 1; });
  page.append(h('div', { class: 'card' }, h('h3', null, 'Fehlerursachen'), h('ul', { style: { paddingLeft: '1.2rem' } }, Object.entries(causes).sort((a, b) => b[1] - a[1]).map(([c, n]) => h('li', null, c + ': ' + n))), h('p', { class: 'hint' }, 'Nach einer falschen Aufgabe kannst du die Ursache wählen. Viele Flüchtigkeitsfehler: langsamer lesen und das Resultat prüfen. «Wissen fehlt»: die Theorie zum Thema ansehen.')));
  // Liste
  const bySkill = {}; p.errors.forEach((e) => { (bySkill[e.skill] = bySkill[e.skill] || []).push(e); });
  const card = h('div', { class: 'card' }, h('h3', null, 'Alle Einträge (' + p.errors.length + ')'));
  card.append(h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Thema'), h('th', null, 'Aufgabe'), h('th', { class: 'num' }, 'Wiederholung'), h('th', null, 'fällig'), h('th', { class: 'num' }, 'falsch'), h('th', null, ''))),
    h('tbody', null, Object.keys(bySkill).sort().flatMap((sid) => bySkill[sid].sort((a, b) => a.due - b.due).map((e) => h('tr', null, h('td', null, SKILL[sid] ? sid + ' ' + SKILL[sid].name : sid), h('td', null, GEN[e.key] ? GEN[e.key].title : e.key), h('td', { class: 'num' }, (e.stage + 1) + ' / 3'), h('td', null, e.due <= Date.now() ? h('span', { class: 'tag warn' }, 'heute') : fmtDate(new Date(e.due))), h('td', { class: 'num' }, String(e.wrong)),
      h('td', null, btn('', () => { p.errors = p.errors.filter((x) => x.id !== e.id); save(); refresh(); }, { kind: 'small quiet', icon: 'trash', aria: 'Eintrag löschen' }))))))));
  card.append(btn('Fehlerheft leeren', async () => { if (await confirmBox('Fehlerheft leeren?', 'Alle ' + p.errors.length + ' Einträge werden gelöscht.', 'Leeren', 'Abbrechen', true)) { p.errors = []; save(); refresh(); } }, { kind: 'small danger' }));
  page.append(card);
}
