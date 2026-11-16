// Aufgabenquellen: verbindet Generatoren, Datenbank und Shuffle. Jede Aufgabe ist über (Schlüssel, Startzahl) wiederholbar.
import '../../content/index.js';
import { GEN, reg } from './gen-core.js';
import './math-a.js';
import './math-b.js';
import './math-c.js';
import './de-gen.js';
import { DB, poolOf, allItems } from './db.js';
import { RNG, hashStr, gcd, lcm, esc } from '../util.js';
import { parse, evaluate } from './expr.js';
import { taskMax } from './task.js';
import { SKILLS, SKILL, secPerPoint } from '../skills.js';

// ---------- Mathe-Vorlagen aus der Datenbank (mit Platzhaltern) ----------
const NAMES1 = ['Lena', 'Mia', 'Sara', 'Nora', 'Alina', 'Elif', 'Livia', 'Noemi'], NAMES2 = ['Jan', 'Luca', 'Noah', 'Tim', 'Leon', 'David', 'Nico', 'Arjun'];
const tplVal = (expr, env) => evaluate(parse(String(expr)), env);
const nice = (v) => { const r = Math.round(v * 1e4) / 1e4; return String(r); };
function tplCheck(cond, env) {
  if (cond.startsWith('int:')) { const v = tplVal(cond.slice(4), env); return isFinite(v) && Math.abs(v - Math.round(v)) < 1e-9; }
  const m = cond.match(/^(.+?)(<=|>=|!=|==|<|>)(.+)$/); if (!m) return true;
  const a = tplVal(m[1], env), b = tplVal(m[3], env);
  return { '<': a < b, '>': a > b, '<=': a <= b, '>=': a >= b, '!=': Math.abs(a - b) > 1e-9, '==': Math.abs(a - b) < 1e-9 }[m[2]];
}
function tplFill(str, env, names) {
  return String(str).replace(/\{=([^}]+)\}/g, (_, e) => nice(tplVal(e, env))).replace(/\{(N[12])\}/g, (_, n) => names[n]).replace(/\{([a-zA-Z])\}/g, (_, k) => (k in env ? nice(env[k]) : '{' + k + '}'));
}
function tplSample(p, r, jitter) {
  if (p.pick) return jitter ? r.pick(p.pick) : p.pick[0];
  const step = p.step || 1; if (!jitter) return p.def != null ? p.def : p.min;
  return p.min + step * r.int(0, Math.floor((p.max - p.min) / step));
}
export function templateTask(it, r, jitter) {
  let env = null;
  for (let tries = 0; tries < (jitter ? 400 : 1); tries++) {
    const e = {}; for (const [k, p] of Object.entries(it.params || {})) e[k] = tplSample(p, r, jitter);
    for (const [k, c] of Object.entries(it.calc || {})) {
      const m = String(c).match(/^(kgv|ggt):([a-zA-Z]),([a-zA-Z])$/);
      e[k] = m ? (m[1] === 'kgv' ? lcm(e[m[2]], e[m[3]]) : gcd(e[m[2]], e[m[3]])) : tplVal(c, e);
    }
    let ok = true; try { ok = (it.where || []).every((c) => tplCheck(c, e)); } catch (x) { ok = false; }
    if (ok) { env = e; break; }
  }
  if (!env) return templateTask(it, r, false); // Standardwerte, falls keine neue Kombination passt
  const names = { N1: jitter ? r.pick(NAMES1) : NAMES1[0], N2: jitter ? r.pick(NAMES2) : NAMES2[0] };
  const text = jitter ? r.pick(it.text) : it.text[0]; const a = it.answer; let field;
  if (a.eq) field = { id: 'a', type: 'eq', answer: tplFill(a.eq, env, names), var: a.var || 'x', label: 'Gleichung' };
  else if (a.term) field = { id: 'a', type: 'expr', answer: tplFill(a.term, env, names), vars: a.vars || ['x'], label: 'Term' };
  else {
    let v = tplVal(a.expr, env); if (a.round != null) v = Math.round(v * 10 ** a.round) / 10 ** a.round;
    field = { id: 'a', type: 'num', label: 'Resultat', answer: v, unit: a.unit || null, pct: !!a.pct, prob: !!a.prob, tol: a.tol != null ? a.tol : a.prob ? 0.0051 : a.round != null ? 0.5 * 10 ** -a.round + 1e-9 : Math.max(1e-9, Math.abs(v) * 1e-9), show: a.prob ? (Math.round(v * 1000) / 1000) + ' ≈ ' + (Math.round(v * 1000) / 10) + ' %' : nice(v) };
  }
  return { html: esc(tplFill(text, env, names)), fields: [field], solution: '<ol class="steps">' + (it.solution || []).map((s) => '<li>' + esc(tplFill(s, env, names)) + '</li>').join('') + '</ol>' };
}
const tplPool = (skill) => DB.mathe.filter((x) => x.skill === skill); // nur verwendete Pakete: entscheidet, ob es die Aufgabenart gibt
const tplPick = (skill) => poolOf('mathe', (x) => x.skill === skill); // beim Erzeugen notfalls aus allen Paketen (Fehlerheft, Simulation)
SKILLS.filter((s) => s.subj === 'M').forEach((s) => {
  reg(s.id + '.vorlage', { skill: s.id, title: 'Textaufgabe aus der Datenbank', src: 'db', diff: 2, needs: () => tplPool(s.id).length > 0 }, (r) => { const p = tplPick(s.id); return templateTask(p[r.int(0, p.length - 1)], r, false); });
  reg(s.id + '.shuffle', { skill: s.id, title: 'Textaufgabe mit neuen Zahlen', src: 'shuffle', diff: 2, needs: () => tplPool(s.id).length > 0 }, (r) => { const p = tplPick(s.id); return templateTask(p[r.int(0, p.length - 1)], r, true); });
});

// ---------- M25: Kurzaufgaben im Tempo ----------
const drillKeys = () => Object.values(GEN).filter((g) => g.quick && g.skill[0] === 'M' && !['M23', 'M24', 'M25'].includes(g.skill) && (!g.src || g.src === 'gen')).map((g) => g.key);
reg('M25.drill', { skill: 'M25', title: 'Kurzaufgabe im Tempo', diff: 3, quick: true }, (r) => { const k = r.pick(drillKeys()); const t = GEN[k].make(r); t.html = '<span class="tag">Kurzaufgabe wie in Aufgabe 1</span> ' + t.html; return t; });

// ---------- Einteilung der Quellen ----------
const DB_KEYS = new Set(['D1.steigerung', 'D4.funktion', 'D4.form', 'D8.verbinden', 'D8.wahl', 'D9.umformen', 'D10.familie', 'D11.streichen', 'D11.synonym', 'D11.antonym', 'D12.oberbegriff', 'D12.wortfeld',
  'D15.gross', 'D15.schreibung', 'D16.aussagen', 'D17.figur', 'D13.zuordnen', 'D18.fragen', 'D19.deuten', 'D20.auftrag', 'D21.plan']);
const SHUFFLE_KEYS = new Set(['D15.fehlertext', 'D28.ueberarbeiten']);
const NEEDS = { // Datenbank-Typ, den ein Generator braucht
  'D1.steigerung': ['steigerung'], 'D4.funktion': ['modus'], 'D4.form': ['modusform'], 'D8.verbinden': ['verbinden'], 'D8.wahl': ['verbinden'], 'D9.umformen': ['umformen'], 'D10.familie': ['wortfamilie'],
  'D11.streichen': ['synonym'], 'D11.synonym': ['synonym'], 'D11.antonym': ['antonym'], 'D12.oberbegriff': ['oberbegriff'], 'D12.wortfeld': ['wortfeld'], 'D15.gross': ['nominal'], 'D15.schreibung': ['schreibung'],
  'D15.fehlertext': ['fehlertext'], 'D28.ueberarbeiten': ['fehlertext'], 'D16.aussagen': ['text'], 'D17.figur': ['text'], 'D13.zuordnen': ['text'], 'D18.fragen': ['text'], 'D19.deuten': ['text'], 'D20.auftrag': ['aufsatz'], 'D21.plan': ['aufsatz']
};
for (const g of Object.values(GEN)) {
  if (g.src) continue;
  if (/\.(baustein|quiz)$/.test(g.key)) g.src = 'db';
  else if (DB_KEYS.has(g.key)) g.src = 'db';
  else if (SHUFFLE_KEYS.has(g.key)) g.src = 'shuffle';
  else g.src = 'gen';
}
function available(g) {
  if (g.needs) return g.needs();
  if (NEEDS[g.key]) return NEEDS[g.key].every((t) => DB[t].length > 0);
  const m = g.key.match(/^(D\d+)\.(baustein|quiz)$/);
  if (m) return DB[m[2]].some((x) => x.skill === m[1]);
  return true;
}

export let ALL_KEYS = [];
export let SKILL_SOURCES = {};
export function refreshSources() {
  ALL_KEYS = Object.values(GEN).filter(available).map((g) => g.key).sort();
  SKILL_SOURCES = {};
  for (const k of ALL_KEYS) (SKILL_SOURCES[GEN[k].skill] = SKILL_SOURCES[GEN[k].skill] || []).push(k);
  return ALL_KEYS.length;
}
refreshSources();

export const genInfo = (key) => GEN[key];
// Schlüssel für einen Skill. mode: gen | db | shuffle | mix. opts: { quick }
export function keysFor(skill, mode = 'mix', opts = {}) {
  let keys = (SKILL_SOURCES[skill] || []).slice();
  if (opts.quick) { const q = keys.filter((k) => GEN[k].quick); if (q.length) keys = q; }
  if (opts.minDiff) { const d = keys.filter((k) => GEN[k].diff >= opts.minDiff); if (d.length) keys = d; }
  if (mode !== 'mix') { const m = keys.filter((k) => GEN[k].src === mode); if (m.length) return { keys: m, fallback: false }; return { keys, fallback: true }; }
  return { keys, fallback: false };
}
export const hasSources = (skill) => (SKILL_SOURCES[skill] || []).length > 0;

export function makeTask(key, seed) {
  const g = GEN[key]; if (!g) throw new Error('Unbekannte Aufgabenart: ' + key);
  const r = new RNG(hashStr(key + '#' + seed));
  const t = g.make(r);
  t.key = key; t.seed = seed; t.skill = g.skill; t.title = g.title; t.src = g.src || 'gen'; t.diff = g.diff; t.quick = !!g.quick;
  t.fields.forEach((f, i) => { if (!f.id) f.id = 'f' + i; });
  t.points = taskMax(t);
  if (!t.targetSec) t.targetSec = Math.max(20, Math.round(t.points * secPerPoint(g.skill)));
  return t;
}

// Zufällige Aufgabe aus einer Liste von Skills. weights: { skillId: Gewicht }
export function randomTask(skills, seed, opts = {}) {
  const r = new RNG(seed);
  const pool = skills.filter(hasSources); if (!pool.length) throw new Error('Keine Aufgaben für diese Auswahl.');
  let skill = pool[0];
  if (opts.weights) { const tot = pool.reduce((a, s) => a + (opts.weights[s] || 1), 0); let x = r.next() * tot; for (const s of pool) { x -= (opts.weights[s] || 1); if (x <= 0) { skill = s; break; } } }
  else skill = r.pick(pool);
  const { keys, fallback } = keysFor(skill, opts.mode || 'mix', opts);
  const key = r.pick(keys);
  const t = makeTask(key, r.int(1, 2147483646));
  t.fallback = fallback;
  return t;
}
export const textById = (id) => allItems('text').find((t) => t._id === id); // auch aus ausgeschalteten Paketen (Fehlerheft, alte Simulationen)
export { DB, GEN, SKILL };
