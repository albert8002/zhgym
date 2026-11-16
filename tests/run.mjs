// Massentest: Jeder Generator wird viele Male ausgeführt. Geprüft wird:
// 1) kein Absturz, 2) keine «undefined/NaN» im Text, 3) die Musterlösung besteht die eigene Prüfung,
// 4) eine falsche Antwort fällt durch, 5) gleiche Startzahl = gleiche Aufgabe.
import { RNG } from '../app/js/util.js';
import { gradeTask, taskMax, answerText } from '../app/js/engine/task.js';
import { primeFactors } from '../app/js/engine/gen-core.js';
import { ALL_KEYS, makeTask, SKILL_SOURCES } from '../app/js/engine/sources.js';
import { SKILLS } from '../app/js/skills.js';

const N = Number(process.argv[2] || 300);
const only = process.argv[3] || '';

function modelValue(f) {
  switch (f.type) {
    case 'num': return String(f.answer);
    case 'expr': case 'eq': return f.answer;
    case 'pf': return primeFactors(f.answer).map(([p, k]) => (k > 1 ? p + '^' + k : String(p))).join('*');
    case 'text': return f.answers[0];
    case 'mc': return f.answer;
    case 'multi': return f.answers.slice();
    case 'classify': return f.answers.slice();
    case 'tokens': case 'gaps': return f.answer.slice();
    case 'edit': return f.correct;
    case 'coords': return [String(f.answer[0]), String(f.answer[1])];
    case 'self': return { text: '', ticks: f.checklist.map(() => true) };
  }
}
function wrongValue(f) {
  switch (f.type) {
    case 'num': return String(f.answer + 1.37 + (f.tol || 0) * 3);
    case 'expr': return '(' + f.answer + ')+1';
    case 'eq': return f.answer.replace('=', '+1=');
    case 'pf': return String(f.answer);
    case 'text': return f.answers[0] + ' xx';
    case 'mc': return (f.answer + 1) % f.options.length;
    case 'multi': return [];
    case 'classify': return f.answers.map((a) => (a + 1) % f.cols.length);
    case 'tokens': return f.answer.length ? [] : [0];
    case 'gaps': return f.answer.length ? [] : [0];
    case 'edit': return f.text;
    case 'coords': return [String(f.answer[0] + 1), String(f.answer[1])];
    case 'self': return { text: '', ticks: f.checklist.map(() => false) };
  }
}

let fail = 0, total = 0; const perKey = {};
const bad = (key, seed, msg) => { fail++; if (fail <= 14) console.log('FEHLER', key, 'seed', seed, '→', msg); };

for (const key of ALL_KEYS) {
  if (only && !key.startsWith(only)) continue;
  perKey[key] = 0;
  for (let i = 0; i < N; i++) {
    const seed = (i * 7919 + 13) >>> 0; total++;
    let t;
    try { t = makeTask(key, seed); } catch (e) { bad(key, seed, 'Absturz: ' + e.message + '\n' + (e.stack || '').split('\n').slice(1, 3).join('\n')); continue; }
    if (!t || !t.fields || !t.fields.length) { bad(key, seed, 'keine Felder'); continue; }
    const blob = JSON.stringify([t.html, t.solution, t.fields.map((f) => [f.label, f.options, f.rows, f.tokens, f.text, f.correct, f.answers])]);
    if (/undefined|NaN|\[object|Infinity/.test(blob)) { bad(key, seed, 'undefined/NaN im Text: ' + blob.slice(Math.max(0, blob.search(/undefined|NaN|\[object|Infinity/) - 80), blob.search(/undefined|NaN|\[object|Infinity/) + 40)); continue; }
    try { t.fields.forEach((f) => answerText(f)); } catch (e) { bad(key, seed, 'answerText: ' + e.message); continue; }
    const good = {}, wrong = {};
    for (const f of t.fields) { good[f.id] = modelValue(f); wrong[f.id] = wrongValue(f); }
    let g;
    try { g = gradeTask(t, good); } catch (e) { bad(key, seed, 'gradeTask: ' + e.message); continue; }
    if (g.points !== g.max || g.max !== taskMax(t) || g.max <= 0) { bad(key, seed, 'Musterlösung fällt durch: ' + g.points + '/' + g.max + ' ' + JSON.stringify(good).slice(0, 200) + ' | ' + JSON.stringify(g.fields.map((x) => x.note || x.points))); continue; }
    const w = gradeTask(t, wrong);
    if (w.points >= w.max) { bad(key, seed, 'falsche Antwort wird akzeptiert: ' + JSON.stringify(wrong).slice(0, 160)); continue; }
    const t2 = makeTask(key, seed);
    if (JSON.stringify(t2.html) !== JSON.stringify(t.html)) { bad(key, seed, 'nicht wiederholbar'); continue; }
    perKey[key]++;
  }
}
// Abdeckung: Jeder Skill braucht mindestens eine Quelle.
const uncovered = SKILLS.filter((s) => s.id !== 'D30' && !(SKILL_SOURCES[s.id] && SKILL_SOURCES[s.id].length)).map((s) => s.id);
console.log('\nGeneratoren:', Object.keys(perKey).length, '| Aufgaben geprüft:', total, '| Fehler:', fail);
console.log('Skills ohne Aufgabenquelle:', uncovered.length ? uncovered.join(', ') : 'keine');
if (fail) process.exit(1);
