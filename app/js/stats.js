// Auswertung: Fehlerquote, Tempo, Beherrschung je Skill, Bereitschaft je Prüfungsteil, Tempo-Gewinn, Lernplan.
import { SKILLS, SKILL, PARTS, partSkills, secPerPoint, RULES } from './skills.js';
import { median, clamp, dayKey, parseDay, addDays, daysBetween, gradeFromPoints } from './util.js';

const scored = (a) => a.m > 0;
export function skillStats(p, id) {
  const all = p.attempts.filter((a) => a.s === id && scored(a));
  const target = secPerPoint(id);
  const out = { id, n: all.length, target, acc: null, err: null, recent: null, spp: null, ratio: null, mastery: 0, level: 'neu', gain: null, last: null, clean: p.clean[id] || 0, done: !!p.mastered[id] };
  if (!all.length) { out.stage = stageOf(out, p, id); out.stageName = STAGES[out.stage].name; return out; }
  const pts = all.reduce((s, a) => s + a.p, 0), max = all.reduce((s, a) => s + a.m, 0);
  out.acc = pts / max; out.err = 1 - out.acc; out.last = all[all.length - 1].t;
  const rec = all.slice(-12); let w = 0, ws = 0;
  rec.forEach((a, i) => { const k = 0.6 + 0.4 * (i + 1) / rec.length; ws += k * (a.p / a.m); w += k; });
  out.recent = ws / w;
  const timed = all.filter((a) => a.sec > 0 && a.mode !== 'offiziell');
  if (timed.length) {
    const per = (arr) => median(arr.map((a) => a.sec / a.m));
    out.spp = per(timed.slice(-12)); out.ratio = out.spp / target;
    if (timed.length >= 10) { const first = per(timed.slice(0, 5)), last = per(timed.slice(-5)); out.gain = { first, last, pct: first > 0 ? (first - last) / first : 0, perTask: [first * (timed[0].m || 1), last * (timed[0].m || 1)] }; }
  }
  const conf = Math.min(1, all.length / 6);
  const speed = out.ratio == null ? 1 : clamp(1.15 - 0.15 * out.ratio, 0.7, 1);
  out.mastery = out.recent * conf * speed;
  out.level = all.length < 3 ? 'neu' : out.mastery >= 0.8 ? 'stark' : out.mastery >= 0.55 ? 'mittel' : 'schwach';
  out.stage = stageOf(out, p, id); out.stageName = STAGES[out.stage].name;
  return out;
}

// ---------- Stufen (nach dem Vorbild «Mastery learning»): positiv benannt, steigen mit Übung ----------
export const STAGES = [
  { id: 'neu', name: 'Neu', text: 'noch nicht geübt' },
  { id: 'begonnen', name: 'Begonnen', text: 'erste Aufgaben gelöst' },
  { id: 'vertraut', name: 'Vertraut', text: 'meistens richtig' },
  { id: 'sicher', name: 'Sicher', text: 'zuverlässig richtig' },
  { id: 'gemeistert', name: 'Gemeistert', text: 'zuverlässig richtig und im Prüfungstempo' }
];
export const SURE = 3; // ab «Sicher» zählt ein Thema als gelernt
function stageOf(st, p, id) {
  if (id === 'D30') { const n = Object.keys(p.reading || {}).length; return n >= 30 ? 4 : n >= 15 ? 3 : n >= 5 ? 2 : n >= 1 ? 1 : 0; } // Täglich lesen: Lesetage
  if (!st.n) return 0;
  if (st.n < 3 || st.mastery < 0.45) return 1;
  if (st.mastery < 0.7) return 2;
  if (st.mastery < 0.85 || st.n < 8 || (st.ratio != null && st.ratio > 1.1)) return 3;
  return 4;
}
// Wie viele richtige Aufgaben im Prüfungstempo bis zur nächsten Stufe? (Schätzung, höchstens 15)
export function nextStageIn(p, id) {
  const cur = skillStats(p, id); if (cur.stage >= 4 || id === 'D30') return null;
  const mine = p.attempts.filter((a) => a.s === id && a.m > 0); const tgt = secPerPoint(id); const fake = Object.assign({}, p, { attempts: mine.slice() });
  for (let k = 1; k <= 15; k++) { fake.attempts.push({ k: 'x', s: id, t: Date.now(), p: 1, m: 1, sec: tgt, mode: 'lernen' }); const st = skillStats(fake, id); if (st.stage > cur.stage) return { n: k, to: st.stage }; }
  return { n: null, to: cur.stage + 1 };
}
export function courseProgress(p) {
  const st = allStats(p); const counts = [0, 0, 0, 0, 0]; st.forEach((x) => counts[x.stage]++);
  const sure = counts[3] + counts[4]; return { st, counts, sure, total: st.length, pct: sure / st.length };
}

// ---------- Wochenziel statt starrer Tages-Serie: 1 freier Tag pro Woche ist eingeplant ----------
export const DAY_MIN = 10; // ab 10 Minuten zählt ein Tag als Lerntag
const mondayOf = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return addDays(x, -((x.getDay() + 6) % 7)); };
export function weekGoal(p, ref = new Date()) {
  const planned = (p.setup.days || [1, 2, 3, 4, 5, 6]).length; const goal = planned >= 4 ? planned - 1 : Math.max(1, planned);
  const learned = (k) => (p.days[k] || 0) >= DAY_MIN;
  const mon = mondayOf(ref); const today = dayKey(ref);
  const days = Array.from({ length: 7 }, (_, i) => { const k = dayKey(addDays(mon, i)); return { k, done: learned(k), today: k === today, future: k > today, min: p.days[k] || 0 }; });
  const count = days.filter((d) => d.done).length;
  let streak = 0; // abgeschlossene Wochen in Folge mit erreichtem Ziel (+ diese Woche, falls schon erreicht)
  const first = mondayOf(p.created || Date.now());
  for (let w = 1; w < 60; w++) { const m = addDays(mon, -7 * w); if (m < first) break; let c = 0; for (let i = 0; i < 7; i++) if (learned(dayKey(addDays(m, i)))) c++; if (c >= goal) streak++; else break; }
  if (count >= goal) streak++;
  return { goal, planned, days, count, met: count >= goal, streak };
}
export function dailyGoal(p, pl) {
  const goal = Math.round((pl || buildPlan(p)).today.reduce((a, x) => a + (x.min || 0), 0));
  const done = Math.round(p.days[dayKey()] || 0); return { goal, done, met: goal > 0 && done >= goal, rest: goal === 0 };
}
export const allStats = (p) => SKILLS.map((s) => Object.assign(skillStats(p, s.id), { skill: s }));

export function partStats(p, part) {
  const sk = partSkills(part).filter((s) => s.w > 0); const st = sk.map((s) => skillStats(p, s.id));
  const W = sk.reduce((a, s) => a + s.w, 0);
  let ready = sk.reduce((a, s, i) => a + s.w * st[i].mastery, 0) / W;
  const coverage = sk.reduce((a, s, i) => a + (st[i].n >= 3 ? s.w : 0), 0) / W;
  const mocks = p.mocks.filter((m) => m.type === part).slice(-3);
  let essayAvg = null;
  if (part === 'aufsatz') {
    const es = p.essays.filter((e) => e.grade).slice(-3);
    if (es.length) { essayAvg = es.reduce((a, e) => a + e.grade, 0) / es.length; ready = 0.5 * ready + 0.5 * clamp((essayAvg - 1) / 5, 0, 1) * Math.min(1, es.length / 2 + 0.5); }
    else ready *= 0.6;
  }
  let est = null;
  if (mocks.length) est = mocks.reduce((a, m) => a + m.grade, 0) / mocks.length;
  else if (part === 'aufsatz' && essayAvg) est = essayAvg;
  else if (coverage >= 0.5) { const acc = sk.reduce((a, s, i) => a + s.w * (st[i].recent == null ? 0 : st[i].recent * (st[i].ratio == null ? 1 : clamp(1.15 - 0.15 * st[i].ratio, 0.7, 1))), 0) / W; est = gradeFromPoints(acc, 1); }
  return { part, ready, coverage, est, mocks: mocks.length, essayAvg };
}
export function readiness(p) {
  const parts = { sprache: partStats(p, 'sprache'), aufsatz: partStats(p, 'aufsatz'), mathe: partStats(p, 'mathe') };
  const total = 0.25 * parts.sprache.ready + 0.25 * parts.aufsatz.ready + 0.5 * parts.mathe.ready;
  const coverage = 0.25 * parts.sprache.coverage + 0.25 * parts.aufsatz.coverage + 0.5 * parts.mathe.coverage;
  const have = ['sprache', 'aufsatz', 'mathe'].every((k) => parts[k].est != null);
  const pn = have ? RULES.pn(parts.sprache.est, parts.aufsatz.est, parts.mathe.est) : null;
  return { total, coverage, parts, pn };
}
// Offizielle Prüfungen sind das zuverlässigste Messinstrument: erst öffnen, wenn es sich lohnt.
export function officialGate(p) {
  const r = readiness(p);
  if (r.coverage < 0.6) return { open: false, why: 'Du hast erst ' + Math.round(r.coverage * 100) + ' % des Stoffs geübt. Offizielle Prüfungen gibt es nur 6-mal im aktuellen Format. Spare sie auf, bis du mindestens 60 % geübt hast.', r };
  if (r.total < 0.5) return { open: false, why: 'Deine Bereitschaft liegt bei ' + Math.round(r.total * 100) + ' %. Ab 50 % zeigt dir eine offizielle Prüfung wirklich, wo du stehst. Vorher verbrauchst du sie nur.', r };
  return { open: true, why: '', r };
}

export function speedGains(p) {
  return SKILLS.map((s) => ({ s, st: skillStats(p, s.id) })).filter((x) => x.st.gain && x.st.gain.pct >= 0.1).sort((a, b) => b.st.gain.pct - a.st.gain.pct)
    .map((x) => ({ skill: x.s, pct: x.st.gain.pct, first: x.st.gain.first, last: x.st.gain.last }));
}
export function strengths(p, n = 5) {
  // Beide Listen ohne Überschneidung: bei wenig Daten je die Hälfte
  const st = allStats(p).filter((x) => x.n >= 3 && x.skill.w > 0); const k = Math.min(n, Math.ceil(st.length / 2));
  const strong = st.slice().sort((a, b) => b.mastery - a.mastery).slice(0, k);
  return { strong, weak: st.slice().sort((a, b) => a.mastery - b.mastery).filter((x) => !strong.includes(x)).slice(0, n) };
}

// Gewichte für die adaptive Auswahl: wichtig in der Prüfung und noch schwach = häufiger
export function adaptiveWeights(p, skills) {
  const w = {}; for (const id of skills) { const st = skillStats(p, id); w[id] = (SKILL[id].w || 0.5) * (1.25 - st.mastery) + 0.2; } return w;
}

export function minutesInfo(p) {
  const today = dayKey(); const d = new Date(); const monday = addDays(d, -((d.getDay() + 6) % 7));
  let week = 0; for (let i = 0; i < 7; i++) week += p.days[dayKey(addDays(monday, i))] || 0;
  let streak = 0; for (let i = 0; i < 400; i++) { const k = dayKey(addDays(d, -i)); if ((p.days[k] || 0) >= 5) streak++; else if (i > 0) break; }
  return { today: p.days[today] || 0, week, streak, total: Object.values(p.days).reduce((a, b) => a + b, 0) };
}

// ---------- Lernplan ----------
export const INTENSITY = { locker: { name: 'Locker', factor: 0.6, text: 'ca. 3 Std. pro Woche' }, standard: { name: 'Standard', factor: 1, text: 'ca. 5 Std. 15 Min. pro Woche (Empfehlung)' }, intensiv: { name: 'Intensiv', factor: 1.5, text: 'ca. 8 Std. pro Woche' } };
const SLOTS = [ // Standardwoche aus dem Lehrplan (Minuten)
  { id: 'm-neu', label: 'Mathematik: neues Thema', min: 45, kind: 'M', route: 'lernen' },
  { id: 'd-gram', label: 'Deutsch: Grammatik und Wortschatz', min: 45, kind: 'D', route: 'lernen' },
  { id: 'm-ueben', label: 'Mathematik: üben', min: 45, kind: 'M', route: 'training' },
  { id: 'd-text', label: 'Deutsch: Textverständnis', min: 45, kind: 'D', route: 'training' },
  { id: 'fehler', label: 'Fehlerheft: beide Fächer', min: 30, kind: 'F', route: 'fehlerheft' },
  { id: 'aufsatz', label: 'Aufsatz schreiben', min: 90, kind: 'A', route: 'aufsatz' }
];
export function buildPlan(p, now = new Date()) {
  const exam = parseDay(p.setup.examDate); const daysLeft = daysBetween(now, exam); const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
  const f = (INTENSITY[p.setup.intensity] || INTENSITY.standard).factor;
  const start = parseDay(dayKey(p.created ? new Date(p.created) : now));
  const totalWeeks = Math.max(1, Math.ceil(daysBetween(start, exam) / 7));
  const weekNo = clamp(totalWeeks - weeksLeft + 1, 1, totalWeeks);
  // Phasen: Standort (1 Woche), Fundament, Ausbau, Training (bis 4 Wochen), Ausklang (1 Woche)
  const ausklang = totalWeeks >= 4 ? 1 : 0, training = totalWeeks >= 10 ? 4 : totalWeeks >= 6 ? 2 : totalWeeks >= 4 ? 1 : 0, standort = totalWeeks >= 3 ? 1 : 0;
  const learn = Math.max(1, totalWeeks - ausklang - training - standort); const fund = Math.ceil(learn * 0.55);
  const phaseOf = (w) => (w <= standort ? 'Standort' : w <= standort + fund ? 'Fundament' : w <= standort + learn ? 'Ausbau' : w <= standort + learn + training ? 'Training' : 'Ausklang');
  const phases = [['Standort', standort], ['Fundament', fund], ['Ausbau', learn - fund], ['Training', training], ['Ausklang', ausklang]].filter((x) => x[1] > 0).map(([name, weeks]) => ({ name, weeks }));
  // Skills der Lehrplan-Wochen 2–12 auf die Lernwochen verteilen
  const learnIdx = (lw) => clamp(Math.floor((lw - 2) / 11 * learn), 0, learn - 1);
  const weekSkills = Array.from({ length: learn }, () => []);
  SKILLS.forEach((s) => { if (s.week >= 2 && s.week <= 12) weekSkills[learnIdx(s.week)].push(s.id); });
  const phase = phaseOf(weekNo); const li = weekNo - standort - 1;
  const focus = phase === 'Fundament' || phase === 'Ausbau' ? (weekSkills[clamp(li, 0, learn - 1)] || []) : [];
  // Heutige Einheiten: Standardwoche auf die gewählten Lerntage verteilen
  const days = (p.setup.days && p.setup.days.length ? p.setup.days : [1, 2, 3, 4, 5, 6]).slice().sort();
  const perDay = {}; days.forEach((d) => { perDay[d] = []; });
  SLOTS.forEach((s, i) => { perDay[days[i % days.length]].push(Object.assign({}, s, { min: Math.round(s.min * f / 5) * 5 })); });
  let today = (perDay[now.getDay()] || []).slice();
  if (phase === 'Standort') today = p.setup.assessed ? [{ id: 'theorie', label: 'Erste Themen ansehen: D1 Wortarten, M1 Rechenregeln', min: Math.round(30 * f), kind: 'D', route: 'lernen' }] : [{ id: 'einstufung', label: p.setup.assessedParts && (p.setup.assessedParts.mathe || p.setup.assessedParts.sprache) ? 'Einstufung: zweiten Teil machen' : 'Einstufungstest machen (geht auch in 2 Teilen)', min: p.setup.assessedParts && p.setup.assessedParts.mathe ? 15 : p.setup.assessedParts && p.setup.assessedParts.sprache ? 45 : 60, kind: 'E', route: 'einstufung' }];
  if (phase === 'Training') today = today.map((s) => (s.id === 'aufsatz' ? Object.assign({}, s, { label: 'Prüfungssimulation (im Wechsel: Sprache, Mathematik, Aufsatz)', route: 'simulation' }) : s.id === 'm-neu' || s.id === 'd-gram' ? Object.assign({}, s, { label: s.kind === 'M' ? 'Mathematik: Lücken aus dem Fehlerheft schliessen' : 'Deutsch: Lücken aus dem Fehlerheft schliessen', route: 'training' }) : s));
  if (phase === 'Ausklang') today = [{ id: 'leicht', label: 'Fehlerheft durchsehen und 1 Kurzaufgaben-Serie', min: 25, kind: 'F', route: 'fehlerheft' }];
  const reading = { id: 'lesen', label: 'Lesen (Buch oder Zeitung)', min: 20, kind: 'L', route: 'plan' };
  const weekTarget = Math.round(SLOTS.reduce((a, s) => a + s.min, 0) * f);
  return { daysLeft, weeksLeft, weekNo, totalWeeks, phase, phases, focus, today, reading, weekTarget, weekSkills, standort, learn, exam };
}
export const phaseText = (pl, p) => PHASE_TEXT[pl.phase === 'Standort' && p.setup && p.setup.assessed ? 'StandortFertig' : pl.phase];
export const PHASE_TEXT = {
  Standort: 'Niveau messen und Lücken finden. Mach den Einstufungstest.',
  StandortFertig: 'Einstufung erledigt. Jetzt die ersten Themen aus deiner Liste lernen.',
  Fundament: 'Theorie und Grundtechnik für jeden Skill. Pro Woche 3 bis 4 neue Skills.',
  Ausbau: 'Auf Prüfungsniveau üben, Tempo aufbauen, Stoff verbinden.',
  Training: 'Ganze Prüfungen unter Zeit. Jetzt lohnen sich die offiziellen Prüfungen.',
  Ausklang: 'Nichts Neues. Nur Fehlerheft, Schlaf, Material bereitlegen.'
};
