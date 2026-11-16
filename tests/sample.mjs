import { ALL_KEYS, makeTask } from '../app/js/engine/sources.js';
import { answerText } from '../app/js/engine/task.js';
const strip = (s) => String(s || '').replace(/<svg[\s\S]*?<\/svg>/g, '[SVG]').replace(/<li>/g, ' • ').replace(/<[^>]+>/g, '').replace(/\\\(|\\\)/g, '').replace(/\s+/g, ' ').trim();
const pre = process.argv[2] || ''; const n = Number(process.argv[3] || 2); const maxLen = Number(process.argv[4] || 420);
for (const k of ALL_KEYS) { if (!k.startsWith(pre)) continue;
  for (let i = 0; i < n; i++) { const t = makeTask(k, 1000 + i * 77);
    console.log(`## ${k} [${t.points}P ${t.src}] ${strip(t.html).slice(0, maxLen)}`);
    console.log('   A: ' + t.fields.map((f) => (f.label ? strip(f.label) + ' ' : '') + strip(answerText(f)).slice(0, 160)).join(' | '));
    console.log('   L: ' + strip(t.solution).slice(0, maxLen)); } }
