// Web-Modus (experimentell): Sätze aus der deutschen Wikipedia und Zahlen aus Wikidata.
// Die Lösung stammt aus der Quelle (Komma, das/dass) oder wird berechnet (Prozent, Dichte, Mittelwert).
// Quellen können Fehler oder freiwillige Kommas enthalten. Darum ist der Modus als unzuverlässig markiert.
import { RNG, esc, round, sum } from '../util.js';
import { barChart } from './svg.js';
import { SKILL, secPerPoint } from '../skills.js';
import { taskMax } from './task.js';

export const WEB_SKILLS = ['D14', 'D15', 'M11', 'M12', 'M13'];
const WARN = '<p class="note warn small">Web-Aufgabe (experimentell): Satz oder Zahlen stammen aus dem Internet und wurden automatisch umgebaut. Sie können Fehler enthalten.</p>';
const steps = (arr) => '<ol class="steps">' + arr.filter(Boolean).map((s) => '<li>' + s + '</li>').join('') + '</ol>';

async function get(url) {
  if (typeof window !== 'undefined' && window.gymi && window.gymi.webFetch) { const r = await window.gymi.webFetch({ url }); if (!r || !r.ok) throw new Error('Keine Verbindung zu ' + new URL(url).hostname); return r.text; }
  const r = await fetch(url, { headers: { Accept: 'application/json' } }); if (!r.ok) throw new Error('HTTP ' + r.status); return r.text();
}

// ---------- Wikipedia: Sätze sammeln ----------
const cache = { komma: [], das: [], dass: [], seen: new Set(), numbers: null };
const ABBR = /\b(z|u|d|o|s|v|bzw|ca|etc|evtl|ggf|inkl|Nr|St|Dr|Prof|Hrsg|Jh|Jhd|Mio|Mrd|vgl|usw|sog|gest|geb|bspw)\.\s?/;
export function cleanSentences(extract) {
  // Absätze zu Sätzen. Nur einfache, saubere Sätze bleiben übrig.
  const raw = String(extract || '').replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ])/);
  return raw.map((s) => s.trim()).filter((s) => {
    const w = s.split(' ');
    return w.length >= 8 && w.length <= 32 && /^[A-ZÄÖÜ]/.test(s) && /[a-zäöüß]\.$/.test(s)
      && !/[0-9()\[\];:„“"«»‚‘'\/=+&%§]/.test(s) && !ABBR.test(s) && !/\s[,.]/.test(s) && !/[A-Za-zäöü]\.[A-Za-zäöü]/.test(s)
      && !/ - | – /.test(s) && (s.match(/\./g) || []).length === 1;
  }).map((s) => s.replace(/ß/g, 'ss'));
}
export function classify(s) {
  const out = [];
  if (s.includes(',') && s.split(',').length <= 5) out.push('komma');
  if (/\bdass\b/.test(s)) out.push('dass');
  if (/, das\b/.test(s)) out.push('das');
  return out;
}
async function refill() {
  const url = 'https://de.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=random&grnnamespace=0&grnlimit=10&prop=extracts&exintro=1&explaintext=1&exlimit=10';
  const data = JSON.parse(await get(url));
  const pages = Object.values((data.query && data.query.pages) || {});
  let n = 0;
  for (const pg of pages) for (const s of cleanSentences(pg.extract)) { if (cache.seen.has(s)) continue; cache.seen.add(s); for (const k of classify(s)) { cache[k].push({ s, title: pg.title }); n++; } }
  return n;
}
async function sentence(kind, r) {
  for (let i = 0; i < 6 && cache[kind].length === 0; i++) await refill();
  if (!cache[kind].length) throw new Error('Gerade keine passenden Sätze gefunden. Versuche es noch einmal.');
  return cache[kind].splice(r.int(0, cache[kind].length - 1), 1)[0];
}
const srcNote = (title) => 'Quelle: Wikipedia, Artikel «' + esc(title) + '» (Lizenz CC BY-SA 4.0).';

function kommaTask(it) {
  const raw = it.s.split(/\s+/); const tokens = raw.map((w) => w.replace(/,$/, '')); const answer = raw.map((w, i) => (w.endsWith(',') ? i : -1)).filter((i) => i >= 0);
  return { skill: 'D14', title: 'Kommas setzen (Wikipedia-Satz)', html: WARN + 'Setze alle fehlenden Kommas.', fields: [{ id: 'a', type: 'gaps', tokens, answer }],
    solution: steps([esc(it.s), 'Im Original stehen ' + answer.length + (answer.length === 1 ? ' Komma.' : ' Kommas.') + ' Manche Kommas in Lexikon-Texten sind freiwillig (zum Beispiel bei Beifügungen). Wenn du anderer Meinung bist, schaue die Regel unter D14 nach.', srcNote(it.title)]) };
}
function dasTask(it, kind) {
  const re = kind === 'dass' ? /\bdass\b/ : /, das\b/;
  const s = kind === 'dass' ? it.s.replace(re, '___') : it.s.replace(re, ', ___');
  return { skill: 'D15', title: 'das oder dass? (Wikipedia-Satz)', html: WARN + 'das oder dass?<br><span class="satz">' + esc(s) + '</span>', fields: [{ id: 'a', type: 'mc', options: ['das', 'dass'], answer: kind === 'dass' ? 1 : 0 }],
    solution: steps([esc(it.s), kind === 'dass' ? '«dass» ist eine Konjunktion. Ersatzprobe mit «welches» oder «dieses» geht nicht.' : '«das» ist hier ein Relativpronomen oder Artikel. Ersatzprobe mit «welches» oder «dieses» geht.', srcNote(it.title)]) };
}

// ---------- Wikidata: Kantone der Schweiz ----------
async function cantons() {
  if (cache.numbers) return cache.numbers;
  const q = 'SELECT ?item ?itemLabel ?pop ?area WHERE { ?item wdt:P31 wd:Q23058; wdt:P1082 ?pop; wdt:P2046 ?area. SERVICE wikibase:label { bd:serviceParam wikibase:language "de". } }';
  const data = JSON.parse(await get('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q)));
  const by = {};
  for (const b of data.results.bindings) {
    const name = b.itemLabel.value; const pop = Number(b.pop.value), area = Number(b.area.value);
    if (!/^Kanton /.test(name) || !(pop > 10000) || !(area > 30)) continue;
    if (!by[name] || pop > by[name].pop) by[name] = { name, pop: Math.round(pop), area: round(area, 1) };
  }
  const list = Object.values(by);
  if (list.length < 10) throw new Error('Wikidata hat zu wenige Kantonsdaten geliefert.');
  cache.numbers = list; return list;
}
const fmtN = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '’');
const wdNote = 'Quelle: Wikidata (frei, CC0). Die Zahlen können veraltet sein. Die Lösung ist mit diesen Zahlen berechnet.';
function numField(id, v, label, d, unit, extra) { const tol = 0.5 * 10 ** -d + 1e-9; return Object.assign({ id, type: 'num', label, answer: round(v, d), tol, unit: unit || null }, extra || {}); }

function prozentTask(list, r) {
  let a, b; do { [a, b] = r.sample(list, 2); } while (a.pop === b.pop || Math.max(a.pop, b.pop) / Math.min(a.pop, b.pop) > 6);
  if (a.pop < b.pop) [a, b] = [b, a];
  const p = (a.pop - b.pop) / b.pop * 100;
  if (r.bool()) return { skill: 'M11', title: 'Prozent mit echten Zahlen', html: WARN + `Der ${esc(a.name)} hat ${fmtN(a.pop)} Einwohnerinnen und Einwohner, der ${esc(b.name)} hat ${fmtN(b.pop)}.<br>Um wie viel Prozent ist die Bevölkerung im ${esc(a.name)} grösser als im ${esc(b.name)}? Runde auf 1 Stelle nach dem Komma.`,
    fields: [numField('a', p, 'Zunahme in Prozent', 1, null, { pct: true })], solution: steps([`Grundwert ist der kleinere Kanton: \\(${b.pop}\\)`, `Unterschied: \\(${a.pop} - ${b.pop} = ${a.pop - b.pop}\\)`, `\\(${a.pop - b.pop} : ${b.pop} \\cdot 100 \\approx ${round(p, 1)}\\,\\%\\)`, wdNote]) };
  const tot = sum(list.map((x) => x.pop)); const s = a.pop / tot * 100;
  return { skill: 'M11', title: 'Anteil in Prozent mit echten Zahlen', html: WARN + `Alle ${list.length} Kantone zusammen haben ${fmtN(tot)} Einwohnerinnen und Einwohner. Der ${esc(a.name)} hat ${fmtN(a.pop)}.<br>Wie viel Prozent der Bevölkerung leben im ${esc(a.name)}? Runde auf 1 Stelle nach dem Komma.`,
    fields: [numField('a', s, 'Anteil in Prozent', 1, null, { pct: true })], solution: steps([`Prozentsatz = Prozentwert : Grundwert · 100`, `\\(${a.pop} : ${tot} \\cdot 100 \\approx ${round(s, 1)}\\,\\%\\)`, wdNote]) };
}
function dichteTask(list, r) {
  const a = r.pick(list); const d = a.pop / a.area;
  return { skill: 'M12', title: 'Bevölkerungsdichte mit echten Zahlen', html: WARN + `Der ${esc(a.name)} hat ${fmtN(a.pop)} Einwohnerinnen und Einwohner und eine Fläche von ${String(a.area)} km².<br>Wie viele Personen leben im Durchschnitt auf 1 km²? Runde auf eine ganze Zahl.`,
    fields: [numField('a', d, 'Personen pro km²', 0, 'Personen pro km²')], solution: steps([`Dichte = Anzahl Personen : Fläche`, `\\(${a.pop} : ${a.area} \\approx ${Math.round(d)}\\)`, 'Das ist ein Durchschnitt: In Städten leben mehr Menschen pro km², in den Bergen weniger.', wdNote]) };
}
function diagrammTask(list, r) {
  const five = r.sample(list.filter((x) => x.pop < 1000000), 5); const v = five.map((x) => Math.round(x.pop / 1000));
  const short = five.map((x) => x.name.replace(/^Kanton /, '').slice(0, 9));
  const mean = sum(v) / 5;
  return { skill: 'M13', title: 'Diagramm mit echten Zahlen', html: WARN + `Das Diagramm zeigt die Bevölkerung von 5 Kantonen in Tausend (gerundet): ${five.map((x, i) => esc(short[i]) + ' ' + v[i]).join(', ')}.`, fig: barChart(short, v, 'Tausend'),
    fields: [numField('a', mean, 'a) Mittelwert in Tausend (1 Stelle nach dem Komma)', 1), numField('b', Math.max(...v) - Math.min(...v), 'b) Unterschied zwischen dem grössten und dem kleinsten Wert in Tausend', 0)],
    solution: steps([`Summe: \\(${v.join(' + ')} = ${sum(v)}\\)`, `Mittelwert: \\(${sum(v)} : 5 = ${round(mean, 1)}\\)`, `Unterschied: \\(${Math.max(...v)} - ${Math.min(...v)} = ${Math.max(...v) - Math.min(...v)}\\)`, wdNote]) };
}

export async function webTask(skill, seed) {
  const r = new RNG(seed); let t;
  if (skill === 'D14') t = kommaTask(await sentence('komma', r));
  else if (skill === 'D15') { const kind = r.bool() ? 'dass' : 'das'; t = dasTask(await sentence(kind, r), kind); }
  else if (skill === 'M11') t = prozentTask(await cantons(), r);
  else if (skill === 'M12') t = dichteTask(await cantons(), r);
  else if (skill === 'M13') t = diagrammTask(await cantons(), r);
  else return null;
  t.key = 'web.' + skill; t.seed = 0; t.src = 'web'; t.diff = 3; t.quick = false;
  t.points = taskMax(t); t.targetSec = Math.max(20, Math.round(t.points * secPerPoint(skill)));
  return t;
}
