// Prüft die Theorie aller Themen: jede Formel lässt sich mit KaTeX setzen, die HTML-Tags sind
// richtig verschachtelt, jedes Thema hat Theorie. Aufruf: node tests/theory.mjs [Thema]
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { THEORY } from '../app/content/theorie.js';
import { SKILLS } from '../app/js/skills.js';

// KaTeX liegt als Browser-Skript bei: in einer eigenen Umgebung ausführen
const ctx = { self: {} }; vm.runInNewContext(readFileSync(new URL('../app/vendor/katex/katex.min.js', import.meta.url), 'utf8'), ctx);
const katex = ctx.self.katex;
const only = process.argv[2] || '';
const VOID = new Set(['br', 'hr', 'img', 'wbr', 'col', 'input']);
let errors = 0;
const fail = (id, msg) => { errors++; console.log('FEHLER ' + id + ': ' + msg); };

for (const s of SKILLS) {
  if (only && s.id !== only) continue;
  const html = THEORY[s.id];
  if (!html) { fail(s.id, 'keine Theorie'); continue; }
  // Formeln
  const display = [...html.matchAll(/\\\[([\s\S]+?)\\\]/g)].map((m) => [m[1], true]);
  const inline = [...html.replace(/\\\[[\s\S]+?\\\]/g, '').matchAll(/\\\(([\s\S]+?)\\\)/g)].map((m) => [m[1], false]);
  for (const [tex, displayMode] of [...display, ...inline]) {
    try { katex.renderToString(tex, { throwOnError: true, displayMode, strict: 'ignore' }); } catch (e) { fail(s.id, 'Formel «' + tex.slice(0, 60) + '»: ' + e.message.split('\n')[0]); }
  }
  const rest = html.replace(/\\\[[\s\S]+?\\\]/g, '').replace(/\\\([\s\S]+?\\\)/g, '');
  if (/\\\(|\\\)|\\\[|\\\]/.test(rest)) fail(s.id, 'Formel ohne Ende: ' + rest.match(/.{0,30}(\\\(|\\\)|\\\[|\\\]).{0,30}/)[0]);
  // HTML-Verschachtelung
  const stack = [];
  for (const m of rest.matchAll(/<(\/?)([a-zA-Z0-9]+)[^>]*?(\/?)>/g)) {
    const [, close, tag0, self] = m; const tag = tag0.toLowerCase();
    if (VOID.has(tag) || self) continue;
    if (!close) stack.push(tag);
    else if (stack.pop() !== tag) { fail(s.id, 'Tag </' + tag + '> passt nicht'); break; }
  }
  if (stack.length) fail(s.id, 'nicht geschlossen: ' + stack.join(', '));
  if (/ß/.test(rest.replace(/statt ß/g, ''))) fail(s.id, 'ß statt ss (Schweizer Schreibweise)');
}
const words = (id) => (THEORY[id] || '').replace(/\\\([\s\S]+?\\\)/g, ' F ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
if (only) console.log(only + ': ' + words(only) + ' Wörter');
console.log(errors ? errors + ' Fehler in der Theorie' : 'Theorie: alle ' + (only ? '1 Thema' : SKILLS.length + ' Themen') + ' in Ordnung');
process.exit(errors ? 1 : 0);
