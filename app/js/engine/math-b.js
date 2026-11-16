// Mathematik-Generatoren M10–M15: Einheiten, Prozent, Proportionalität, Diagramme, Graphen, Wahrscheinlichkeit.
import { reg, m, steps, fr, ft, num, Frac, gcd, NAMES_F, NAMES_M } from './gen-core.js';
import { sum } from '../util.js';
import { svg, line, pline, text, poly, barChart, pieChart, axes } from './svg.js';

const nf = (id, v, label, unit, extra) => Object.assign({ id, type: 'num', label: label || 'Resultat', answer: v, unit: unit || null, tol: Math.max(1e-9, Math.abs(v) * 1e-9) }, extra || {});
const sig = (v) => Number(v.toPrecision(10));

// ---------- M10 Einheiten ----------
const UNITS = {
  'Länge': { step: 'Von Einheit zu Einheit Faktor 10 (1 km = 1000 m).', u: [['mm', 1e-3], ['cm', 1e-2], ['dm', 1e-1], ['m', 1], ['km', 1e3]] },
  'Fläche': { step: 'Bei Flächen von Einheit zu Einheit Faktor 100 (1 m² = 100 dm² = 10 000 cm²; 1 a = 100 m²; 1 ha = 100 a).', u: [['mm²', 1e-6], ['cm²', 1e-4], ['dm²', 1e-2], ['m²', 1], ['a', 1e2], ['ha', 1e4], ['km²', 1e6]] },
  'Volumen': { step: 'Bei Volumen Faktor 1000 (1 m³ = 1000 dm³). Hohlmasse: 1 l = 1 dm³, 1 ml = 1 cm³, 1 l = 10 dl = 1000 ml, 1 hl = 100 l.', u: [['mm³', 1e-9], ['cm³', 1e-6], ['ml', 1e-6], ['cl', 1e-5], ['dl', 1e-4], ['dm³', 1e-3], ['l', 1e-3], ['hl', 1e-1], ['m³', 1]] },
  'Gewicht': { step: '1 t = 1000 kg, 1 kg = 1000 g, 1 g = 1000 mg.', u: [['mg', 1e-6], ['g', 1e-3], ['kg', 1], ['t', 1e3]] }
};
reg('M10.einheit', { skill: 'M10', title: 'Einheiten umwandeln', diff: 2, quick: true }, (r) => {
  const kind = r.pick(['Länge', 'Fläche', 'Volumen', 'Volumen', 'Gewicht']); const U = UNITS[kind];
  let a, b, v, res;
  do { a = r.pick(U.u); b = r.pick(U.u); v = r.pick([1.2, 2.3, 0.45, 3.5, 12, 0.08, 4.75, 250, 36, 0.6, 7.2, 1500, 0.035, 86]); res = sig(v * a[1] / b[1]); }
  while (a[0] === b[0] || a[1] === b[1] || res < 0.001 || res > 5e6);
  return { html: `Wandle um: ${m(String(v))} ${a[0]} = ? ${b[0]}`, fields: [nf('a', res, null, b[0], { show: num(res, 10) })],
    solution: steps([U.step, `Umrechnungsfaktor von ${a[0]} zu ${b[0]}: ${num(sig(a[1] / b[1]), 10)}`, `${v} ${a[0]} = ${num(res, 10)} ${b[0]}`]) };
});
reg('M10.zeit', { skill: 'M10', title: 'Zeit umrechnen', diff: 1, quick: true }, (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const h = r.pick([1.25, 1.5, 2.25, 0.75, 2.4, 3.2, 0.4]); return { html: `Wandle um: ${h} h = ? min`, fields: [nf('a', sig(h * 60), null, 'min')], solution: steps([`1 h = 60 min`, m(`${h} \\cdot 60 = ${sig(h * 60)}`)]) }; }
  if (t === 1) { const mn = r.pick([15, 45, 75, 90, 105, 135, 150, 195, 36, 48, 84]); return { html: `Wandle um: ${mn} min = ? h (als Dezimalzahl oder Bruch)`, fields: [nf('a', mn / 60, null, 'h', { show: num(mn / 60, 4), tol: 1e-3 })], solution: steps([m(`${mn} : 60 = ${num(mn / 60, 4)}`)]) }; }
  if (t === 2) { const h = r.int(1, 4), mn = r.int(5, 55); return { html: `Wandle um: ${h} h ${mn} min = ? min`, fields: [nf('a', h * 60 + mn, null, 'min')], solution: steps([m(`${h} \\cdot 60 + ${mn} = ${h * 60 + mn}`)]) }; }
  const h1 = r.int(7, 11), m1 = r.pick([5, 15, 25, 35, 40, 50]), d = r.int(50, 200); const end = h1 * 60 + m1 + d;
  return { html: `Ein Film beginnt um ${h1}.${String(m1).padStart(2, '0')} Uhr und endet um ${Math.floor(end / 60)}.${String(end % 60).padStart(2, '0')} Uhr. Wie viele Minuten dauert er?`, fields: [nf('a', d, null, 'min')], solution: steps([`Bis zur nächsten vollen Stunde, dann ganze Stunden, dann der Rest.`, `${d} Minuten`]) };
});

// ---------- M11 Prozent ----------
reg('M11.grund', { skill: 'M11', title: 'Prozentwert, Grundwert, Prozentsatz', diff: 1, quick: true }, (r) => {
  const p = r.pick([5, 8, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75, 7.5, 12.5]), G = r.pick([40, 60, 80, 120, 160, 200, 240, 360, 400, 480, 800]); const W = sig(p * G / 100); const t = r.int(0, 2);
  if (t === 0) return { html: `Berechne ${p} % von ${G}.`, fields: [nf('a', W)], solution: steps([m(`W = \\frac{p}{100} \\cdot G = \\frac{${p}}{100} \\cdot ${G} = ${W}`)]) };
  if (t === 1) return { html: `Wie viel Prozent sind ${W} von ${G}?`, fields: [nf('a', p, null, null, { pct: true })], solution: steps([m(`p = \\frac{W}{G} \\cdot 100 = \\frac{${W}}{${G}} \\cdot 100 = ${p}`), `${p} %`]) };
  return { html: `${p} % einer Zahl sind ${W}. Wie gross ist die Zahl?`, fields: [nf('a', G)], solution: steps([m(`G = \\frac{W \\cdot 100}{p} = \\frac{${W} \\cdot 100}{${p}} = ${G}`)]) };
});
reg('M11.aenderung', { skill: 'M11', title: 'Zunahme und Abnahme', diff: 2 }, (r) => {
  const ctx = r.pick([['Ein Dorf hatte', 'Einwohner', 'Einwohner'], ['Ein Verein hatte', 'Mitglieder', 'Mitglieder'], ['Ein Stadion zählte', 'Zuschauer', 'Zuschauer'], ['Eine Schule hatte', 'Lernende', 'Lernende']]);
  const G = r.pick([400, 600, 800, 1200, 1500, 2400, 3000]), p = r.pick([5, 8, 10, 12, 15, 20, 25]), up = r.bool(); const N = G * (1 + (up ? p : -p) / 100); const t = r.int(0, 2);
  if (t === 0) return { html: `${ctx[0]} ${G} ${ctx[1]}. Die Zahl ${up ? 'steigt' : 'sinkt'} um ${p} %. Wie viele ${ctx[2]} sind es danach?`, fields: [nf('a', N)], solution: steps([`${up ? 'Zunahme' : 'Abnahme'} um ${p} %: neuer Wert = ${100 + (up ? p : -p)} % vom alten Wert.`, m(`${G} \\cdot ${num(1 + (up ? p : -p) / 100)} = ${N}`)]) };
  if (t === 1) return { html: `${ctx[0]} ${G} ${ctx[1]}, jetzt sind es ${N}. Um wie viel Prozent hat sich die Zahl verändert? (Abnahme als negative Zahl)`, fields: [nf('a', up ? p : -p, null, null, { pct: true })], solution: steps([`Veränderung: ${m(`${N} - ${G} = ${N - G}`)}`, `Bezogen auf den alten Wert: ${m(`\\frac{${N - G}}{${G}} \\cdot 100 = ${up ? p : -p}`)} %`]) };
  return { html: `Nach einer ${up ? 'Zunahme' : 'Abnahme'} um ${p} % zählt man ${N} ${ctx[1]}. Wie viele waren es vorher?`, fields: [nf('a', G)], solution: steps([`${N} sind ${100 + (up ? p : -p)} % des alten Werts.`, m(`G = ${N} : ${num(1 + (up ? p : -p) / 100)} = ${G}`)]) };
});
reg('M11.vergleich', { skill: 'M11', title: 'Zwei Prozentangaben verbinden', diff: 3 }, (r) => {
  for (let i = 0; i < 300; i++) {
    const p1 = r.pick([4, 5, 6, 8, 9, 12, 15]), G1 = r.pick([40, 50, 60, 70, 80, 90, 120, 150]), p2 = r.pick([2.5, 5, 7.5, 10, 12.5, 15, 20]); const W = p1 * G1 / 100, G2 = W * 100 / p2;
    if (p1 === p2 || !Number.isInteger(G2) || G2 === G1) continue;
    const A = r.pick(NAMES_F), B = r.pick(NAMES_M);
    return { html: `${A} hat ${p1} % ihres Taschengelds ausgegeben. Das ist gleich viel wie ${p2} % von CHF ${G2}, dem Taschengeld von ${B}. Wie viel Taschengeld hat ${A}?`, fields: [nf('a', G1, null, 'CHF')],
      solution: steps([`Betrag: ${m(`\\frac{${p2}}{100} \\cdot ${G2} = ${num(W)}`)} Franken`, `Das sind ${p1} % von ${A}s Taschengeld: ${m(`G = \\frac{${num(W)} \\cdot 100}{${p1}} = ${G1}`)}`, `CHF ${G1}`]) };
  }
  return { html: 'Berechne 10 % von 250.', fields: [nf('a', 25)], solution: steps([m('25')]) };
});
reg('M11.zweistufig', { skill: 'M11', title: 'Anteile in zwei Stufen', diff: 3, pts: 2 }, (r) => {
  const ctx = r.pick([['An einer Abstimmung nehmen Leute aus zwei Dörfern teil.', 'Unterwil', 'Oberwil', 'Ja', 'Nein', 'Personen'], ['Am Sporttag wählen alle Lernenden zwischen Fussball und Volleyball.', 'der 1. Sek', 'der 2. Sek', 'Fussball', 'Volleyball', 'Lernende'], ['Ein Verein stimmt über ein neues Clubhaus ab.', 'der Juniorenabteilung', 'der Erwachsenenabteilung', 'Ja', 'Nein', 'Mitglieder']]);
  for (let i = 0; i < 500; i++) {
    const pU = r.pick([25, 30, 40, 45, 60, 35]), jaU = r.pick([25, 40, 50, 60, 62.5, 75, 80, 56.25, 37.5]), fO = r.pick([fr(3, 4), fr(2, 3), fr(3, 5), fr(4, 5), fr(5, 8)]), N = r.pick([80, 120, 160, 200, 240, 320, 400, 480, 600]);
    const U = N * pU / 100, O = N - U, OJa = O * fO.val, UNein = U * (1 - jaU / 100);
    if (![U, O, OJa, UNein].every((v) => Number.isInteger(sig(v)) && v > 5)) continue;
    return { html: `${ctx[0]} ${pU} % der Teilnehmenden kommen aus ${ctx[1]}, der Rest aus ${ctx[2]}. Von den Teilnehmenden aus ${ctx[1]} sind ${jaU} % für «${ctx[3]}». Von den Teilnehmenden aus ${ctx[2]} sind ${ft(fO)} für «${ctx[3]}». Alle anderen sind für «${ctx[4]}». Aus ${ctx[2]} sind genau ${sig(OJa)} ${ctx[5]} für «${ctx[3]}».<br>Wie viele ${ctx[5]} aus ${ctx[1]} sind für «${ctx[4]}»?`,
      fields: [nf('a', sig(UNein), 'Anzahl', null, { points: 2 })],
      solution: steps([`Aus ${ctx[2]} insgesamt: ${m(`${sig(OJa)} : ${fO.tex()} = ${O}`)}`, `Das sind ${100 - pU} % von allen: ${m(`${O} : ${num((100 - pU) / 100)} = ${N}`)}`, `Aus ${ctx[1]}: ${m(`${N} - ${O} = ${U}`)}`, `«${ctx[4]}» aus ${ctx[1]}: ${m(`${U} \\cdot ${num(1 - jaU / 100)} = ${sig(UNein)}`)}`]) };
  }
  return { html: 'Berechne 25 % von 80.', fields: [nf('a', 20)], solution: steps([m('20')]) };
});
reg('M11.mischung', { skill: 'M11', title: 'Mischung und Anteil', diff: 3, pts: 2 }, (r) => {
  for (let i = 0; i < 300; i++) {
    const a = r.int(1, 6), b = r.int(2, 14), q = r.pick([5, 8, 10, 12.5, 20]); const p = 100 * a / (a + b); const tot = a * 100 / q, add = tot - (a + b);
    if (!Number.isInteger(sig(p * 10)) || !Number.isInteger(sig(add)) || add <= 0) continue;
    return { html: `Für ein Getränk mischt man ${a} dl Sirup mit ${b} dl Wasser.`, fields: [nf('a', sig(p), 'a) Sirupanteil in Prozent', null, { pct: true }), nf('b', sig(add), `b) Wie viel Wasser muss man dazugeben, damit der Sirupanteil nur noch ${q} % beträgt?`, 'dl')],
      solution: steps([`a) Ganzes Getränk: ${a + b} dl. Anteil: ${m(`\\frac{${a}}{${a + b}} \\cdot 100 = ${num(p)}`)} %`, `b) ${a} dl Sirup sollen ${q} % sein: ganze Menge ${m(`${a} \\cdot 100 : ${q} = ${sig(tot)}`)} dl`, `Dazugeben: ${m(`${sig(tot)} - ${a + b} = ${sig(add)}`)} dl Wasser`]) };
  }
  return { html: 'Berechne 20 % von 50.', fields: [nf('a', 10)], solution: steps([m('10')]) };
});

// ---------- M12 Proportionalität ----------
reg('M12.dreisatz', { skill: 'M12', title: 'Dreisatz', diff: 2, quick: true }, (r) => {
  if (r.bool(0.55)) { const c = r.pick([['kg Äpfel kosten', 'kg', 'CHF'], ['m Stoff kosten', 'm', 'CHF'], ['Hefte kosten', 'Hefte', 'CHF'], ['Liter Farbe reichen für', 'Liter', 'm²']]); const a = r.int(2, 8), unit = r.pick([1.5, 2, 2.5, 3, 4, 4.5, 6]); let b; do { b = r.int(3, 14); } while (b === a);
    return { html: `${a} ${c[0]} ${c[2] === 'CHF' ? 'CHF ' + (Number.isInteger(a * unit) ? a * unit : (a * unit).toFixed(2)) : sig(a * unit) + ' m²'}. ${c[2] === 'CHF' ? 'Wie viel kosten' : 'Für wie viele m² reichen'} ${b} ${c[1]}?`, fields: [nf('a', sig(b * unit), null, c[2])], solution: steps([`Proportional: doppelte Menge, doppelter Wert.`, `Auf 1 ${c[1].replace(/e$/, '')} rechnen: ${m(`${sig(a * unit)} : ${a} = ${unit}`)}`, `Mal ${b}: ${m(`${unit} \\cdot ${b} = ${sig(b * unit)}`)}`]) }; }
  const c = r.pick([['Pumpen leeren ein Becken in', 'Stunden', 'Pumpen'], ['Maschinen erledigen einen Auftrag in', 'Tagen', 'Maschinen'], ['Pferde fressen einen Futtervorrat in', 'Tagen', 'Pferde']]);
  for (let i = 0; i < 200; i++) { const a = r.int(2, 9), t = r.int(4, 24), b = r.int(2, 12); if (a === b || (a * t) % b !== 0) continue;
    return { html: `${a} ${c[0]} ${t} ${c[1]}. Wie lange brauchen ${b} gleiche ${c[2]}?`, fields: [nf('a', a * t / b, null, c[1])], solution: steps([`Umgekehrt proportional: doppelte Anzahl, halbe Zeit. Das Produkt bleibt gleich.`, m(`${a} \\cdot ${t} = ${a * t}`), m(`${a * t} : ${b} = ${a * t / b}`)]) }; }
  return { html: '4 Pumpen brauchen 6 Stunden. Wie lange brauchen 8 Pumpen?', fields: [nf('a', 3, null, 'Stunden')], solution: steps([m('4 \\cdot 6 : 8 = 3')]) };
});
const PROP = [['Anzahl gleicher Hefte → Preis', 0], ['Anzahl Arbeiter → Zeit für dieselbe Arbeit', 1], ['Alter eines Kindes → Körpergrösse', 2], ['Seitenlänge eines Quadrats → Umfang', 0], ['Seitenlänge eines Quadrats → Flächeninhalt', 2], ['Anzahl Personen, die einen Kuchen gleich teilen → Grösse eines Stücks', 1], ['Anzahl gleich langer Schritte → zurückgelegter Weg', 0], ['Breite eines Rechtecks mit festem Flächeninhalt → Länge', 1], ['Anzahl gleicher Pumpen → Zeit, um ein Becken zu leeren', 1], ['Brenndauer → Länge einer Kerze', 2], ['Menge Farbe → gestrichene Fläche', 0], ['Anzahl Tiere → Dauer, die ein Futtervorrat reicht', 1], ['Gewicht eines Pakets → Porto in Stufen', 2], ['Anzahl gleicher Flaschen → Gesamtinhalt', 0]];
reg('M12.erkennen', { skill: 'M12', title: 'Proportional oder umgekehrt proportional?', diff: 2, quick: true }, (r) => { const it = r.sample(PROP, 4);
  return { html: 'Ordne jeden Zusammenhang zu.', fields: [{ id: 'a', type: 'classify', rows: it.map((x) => x[0]), cols: ['proportional', 'umgekehrt proportional', 'keines von beiden'], answers: it.map((x) => x[1]), points: 2 }], solution: steps(['Proportional: Verdoppelt man die erste Grösse, verdoppelt sich die zweite. Der Quotient bleibt gleich.', 'Umgekehrt proportional: Verdoppelt man die erste Grösse, halbiert sich die zweite. Das Produkt bleibt gleich.']) }; });

// ---------- M13 Diagramme und Mittelwert ----------
reg('M13.mittel', { skill: 'M13', title: 'Mittelwert', diff: 1, quick: true }, (r) => {
  const n = r.pick([4, 5, 6]); const mean = r.int(8, 40); let v; do { v = Array.from({ length: n - 1 }, () => mean + r.int(-7, 7)); v.push(mean * n - sum(v)); } while (v[n - 1] <= 0);
  v = r.shuffle(v);
  if (r.bool()) return { html: `Berechne den Mittelwert: ${v.join(', ')}`, fields: [nf('a', mean)], solution: steps([`Summe: ${m(v.join(' + ') + ' = ' + sum(v))}`, `Durch die Anzahl (${n}) teilen: ${m(`${sum(v)} : ${n} = ${mean}`)}`]) };
  const miss = v[n - 1], rest = v.slice(0, n - 1);
  return { html: `Der Mittelwert von ${n} Zahlen ist ${mean}. ${n - 1} der Zahlen sind: ${rest.join(', ')}. Wie gross ist die fehlende Zahl?`, fields: [nf('a', miss)], solution: steps([`Summe aller ${n} Zahlen: ${m(`${mean} \\cdot ${n} = ${mean * n}`)}`, `Summe der bekannten Zahlen: ${sum(rest)}`, m(`${mean * n} - ${sum(rest)} = ${miss}`)]) };
});
reg('M13.saeule', { skill: 'M13', title: 'Säulendiagramm lesen', diff: 2, pts: 3 }, (r) => {
  const labels = ['Mo', 'Di', 'Mi', 'Do', 'Fr']; const total = r.pick([200, 250, 400, 500]); const step = total / 50;
  let v; do { v = Array.from({ length: 4 }, () => r.int(5, 15) * step); v.push(total - sum(v)); } while (v[4] < 4 * step || v[4] > 16 * step || new Set(v).size < 5);
  const k = r.int(0, 4); const mx = Math.max(...v), mn = Math.min(...v);
  return { html: `Das Diagramm zeigt die Besucherzahlen einer Bibliothek in einer Woche.`, fig: barChart(labels, v, 'Besucher'), fields: [nf('a', total / 5, 'a) Mittelwert pro Tag'), nf('b', mx - mn, 'b) Unterschied zwischen dem stärksten und dem schwächsten Tag'), nf('c', sig(v[k] / total * 100), `c) Anteil vom ${labels[k]} an der ganzen Woche in Prozent`, null, { pct: true })],
    solution: steps([`Werte ablesen: ${v.join(', ')}. Summe: ${total}`, `a) ${m(`${total} : 5 = ${total / 5}`)}`, `b) ${m(`${mx} - ${mn} = ${mx - mn}`)}`, `c) ${m(`\\frac{${v[k]}}{${total}} \\cdot 100 = ${sig(v[k] / total * 100)}`)} %`]) };
});
reg('M13.kreis', { skill: 'M13', title: 'Kreisdiagramm', diff: 2, pts: 2 }, (r) => {
  const labels = ['Velo', 'Bus', 'zu Fuss', 'Auto']; let p; do { p = [r.int(3, 9) * 5, r.int(3, 8) * 5, r.int(2, 7) * 5]; p.push(100 - sum(p)); } while (p[3] < 10 || p[3] > 45);
  const N = r.pick([120, 180, 240, 300, 360]); const i = r.int(0, 3), j = (i + r.int(1, 3)) % 4;
  return { html: `${N} Lernende wurden gefragt, wie sie zur Schule kommen. Anteile: ${labels.map((l, k) => `${l} ${p[k]} %`).join(', ')}.`, fig: pieChart(labels, p), fields: [nf('a', N * p[i] / 100, `a) Wie viele Lernende kommen mit «${labels[i]}»?`), nf('b', sig(p[j] * 3.6), `b) Wie gross ist der Winkel des Sektors «${labels[j]}»?`, '°')],
    solution: steps([`a) ${m(`\\frac{${p[i]}}{100} \\cdot ${N} = ${N * p[i] / 100}`)}`, `b) 100 % entsprechen 360°, also 1 % = 3.6°: ${m(`${p[j]} \\cdot 3.6^\\circ = ${sig(p[j] * 3.6)}^\\circ`)}`]) };
});
reg('M13.haeufigkeit', { skill: 'M13', title: 'Absolute und relative Häufigkeit', diff: 1, quick: true }, (r) => {
  const [n, st] = r.pick([[40, 1], [50, 1], [80, 2], [120, 3], [200, 1], [250, 1]]); const kk = st * r.int(2, Math.min(12, Math.floor(n / st / 3))); const p = sig(kk / n * 100);
  return { html: `Bei ${n} Würfen eines Würfels kam ${kk}-mal eine Sechs. Wie gross ist die relative Häufigkeit in Prozent?`, fields: [nf('a', p, null, null, { pct: true, tol: 0.05 })], solution: steps([`Relative Häufigkeit = absolute Häufigkeit geteilt durch Anzahl Versuche.`, m(`\\frac{${kk}}{${n}} = ${num(kk / n, 4)} = ${p}\\,\\%`)]) };
});

// ---------- M14 Graphen ----------
const VESSELS = [
  { id: 'gerade', prof: [[0, 1.2], [1, 1.2]], desc: 'überall gleich breit. Die Höhe steigt gleichmässig (Gerade)' },
  { id: 'untenbreit', prof: [[0, 2], [0.5, 2], [0.5, 0.8], [1, 0.8]], desc: 'unten breit, oben schmal. Zuerst langsam, dann schnell (Knick nach oben)' },
  { id: 'obenbreit', prof: [[0, 0.8], [0.5, 0.8], [0.5, 2], [1, 2]], desc: 'unten schmal, oben breit. Zuerst schnell, dann langsam (Knick nach unten)' },
  { id: 'trichter', prof: [[0, 0.5], [1, 2]], desc: 'nach oben stetig breiter. Die Höhe steigt immer langsamer (Kurve wird flacher)' },
  { id: 'dach', prof: [[0, 2], [1, 0.5]], desc: 'nach oben stetig schmaler. Die Höhe steigt immer schneller (Kurve wird steiler)' },
  { id: 'bauch', prof: [[0, 0.6], [0.5, 2.1], [1, 0.6]], desc: 'in der Mitte am breitesten. Schnell, langsam, schnell' },
  { id: 'taille', prof: [[0, 2.1], [0.5, 0.6], [1, 2.1]], desc: 'in der Mitte am schmalsten. Langsam, schnell, langsam' }
];
function fillCurve(prof) { // Punkte (t, h), t = bisher eingefülltes Volumen (auf 1 normiert)
  const pts = [[0, 0]]; let t = 0;
  for (let i = 0; i < prof.length - 1; i++) { const [h0, w0] = prof[i], [h1, w1] = prof[i + 1]; if (h1 === h0) continue;
    for (let k = 1; k <= 12; k++) { const f = k / 12, h = h0 + (h1 - h0) * f, w = w0 + (w1 - w0) * f; const dt = (h1 - h0) * f * (w0 + w) / 2; pts.push([t + dt, h]); }
    t += (h1 - h0) * (w0 + w1) / 2; }
  return pts.map((p) => [p[0] / t, p[1]]);
}
function vesselSvg(v, x0, label) { const W = 78, H = 96, s = 30; const L = v.prof.map(([h, w]) => [x0 + W / 2 - w * s / 2, 12 + H - h * H]), R = v.prof.map(([h, w]) => [x0 + W / 2 + w * s / 2, 12 + H - h * H]).reverse();
  return pline([...L.slice().reverse(), ...R.slice().reverse()].reverse(), 'fg-line') + line(L[0][0], L[0][1], R[R.length - 1][0], R[R.length - 1][1]) + text(x0 + W / 2, H + 30, label, 'fg-text small bold'); }
function graphSvg(v, x0, y0, label) { const W = 82, H = 70; const pts = fillCurve(v.prof).map(([t, h]) => [x0 + 8 + t * (W - 14), y0 + H - 6 - h * (H - 14)]);
  return line(x0 + 8, y0 + H - 6, x0 + W - 2, y0 + H - 6, 'fg-axis') + line(x0 + 8, y0 + H - 6, x0 + 8, y0 + 4, 'fg-axis') + pline(pts, 'fg-curve') + text(x0 + W / 2, y0 + H + 12, label, 'fg-text small bold'); }
reg('M14.fuellgraph', { skill: 'M14', title: 'Füllgraphen zuordnen', diff: 3, pts: 2 }, (r) => {
  const all = r.shuffle(VESSELS); const ves = all.slice(0, 3); const graphs = r.shuffle(all.slice(0, 5)); const letters = ['A', 'B', 'C', 'D', 'E'];
  let body = ''; ves.forEach((v, i) => { body += vesselSvg(v, 10 + i * 100, 'Gefäss ' + (i + 1)); });
  graphs.forEach((g, i) => { body += graphSvg(g, 6 + i * 88, 150, letters[i]); });
  body += text(8, 146, 'Füllhöhe (nach oben) in Abhängigkeit der Zeit (nach rechts):', 'fg-text tiny', 'start');
  return { html: 'Die Gefässe sind leer und werden gleichmässig mit Wasser gefüllt (pro Sekunde gleich viel). Die Gefässe sind von vorne gezeichnet und überall gleich tief. Ordne jedem Gefäss den passenden Graphen zu.', fig: svg(450, 240, body, 'Drei Gefässe und fünf Füllgraphen'),
    fields: [{ id: 'a', type: 'classify', rows: ves.map((v, i) => 'Gefäss ' + (i + 1)), cols: letters, answers: ves.map((v) => graphs.indexOf(v)), points: 2 }],
    solution: steps(['Regel: Wo das Gefäss breit ist, steigt das Wasser langsam (Graph flach). Wo es schmal ist, steigt das Wasser schnell (Graph steil).', ...ves.map((v, i) => `Gefäss ${i + 1}: ${v.desc}. Passt zu Graph ${letters[graphs.indexOf(v)]}.`)]) };
});
reg('M14.wegzeit', { skill: 'M14', title: 'Weg-Zeit-Graph lesen', diff: 2, pts: 3 }, (r) => {
  let seg; for (;;) { const t1 = r.pick([10, 15, 20]), s1 = r.int(2, 5), p = r.pick([5, 10, 15]), t3 = r.pick([10, 15, 20, 25]), s3 = r.int(1, 5); if (Math.abs(s1 / t1 - s3 / t3) < 0.02 || s1 + s3 > 8) continue; seg = [[0, 0], [t1, s1], [t1 + p, s1], [t1 + p + t3, s1 + s3]]; break; }
  const T = seg[3][0], S = seg[3][1]; const W = 380, H = 230; const ax = axes(W, H, 'Zeit (Min.)', 'Weg (km)');
  const X = (t) => ax.x0 + t / (Math.ceil(T / 5) * 5) * (ax.x1 - ax.x0 - 10), Y = (s) => ax.y0 - s / (S + 1) * (ax.y0 - ax.y1 - 8);
  let body = ''; for (let t = 5; t <= Math.ceil(T / 5) * 5; t += 5) body += line(X(t), ax.y0, X(t), ax.y1, 'fg-grid') + (t % 10 === 0 ? text(X(t), ax.y0 + 13, String(t), 'fg-text tiny') : '');
  for (let s = 1; s <= S + 1; s++) body += line(ax.x0, Y(s), ax.x1, Y(s), 'fg-grid') + text(ax.x0 - 5, Y(s) + 4, String(s), 'fg-text tiny', 'end');
  body += ax.body + pline(seg.map(([t, s]) => [X(t), Y(s)]), 'fg-curve');
  const who = r.pick(NAMES_F); const fast = seg[1][1] / seg[1][0] > (seg[3][1] - seg[2][1]) / (seg[3][0] - seg[2][0]) ? 0 : 1;
  return { html: `${who} fährt mit dem Velo zu einer Freundin. Der Graph zeigt den zurückgelegten Weg.`, fig: svg(W, H, body, 'Weg-Zeit-Graph'),
    fields: [nf('a', seg[1][1], `a) Wie weit ist ${who} nach ${seg[1][0]} Minuten gefahren?`, 'km'), nf('b', seg[2][0] - seg[1][0], 'b) Wie lange dauert die Pause?', 'Min.'), { id: 'c', type: 'mc', label: 'c) In welchem Abschnitt fährt sie schneller?', options: ['vor der Pause', 'nach der Pause'], answer: fast }],
    solution: steps([`a) Bei ${seg[1][0]} Min. nach oben zum Graphen, dann nach links: ${seg[1][1]} km`, `b) Pause = waagrechtes Stück (der Weg wächst nicht): von ${seg[1][0]} bis ${seg[2][0]} Min., also ${seg[2][0] - seg[1][0]} Min.`, `c) Steiler heisst schneller: vor der Pause ${seg[1][1]} km in ${seg[1][0]} Min., nach der Pause ${seg[3][1] - seg[2][1]} km in ${seg[3][0] - seg[2][0]} Min. Schneller: ${fast === 0 ? 'vor' : 'nach'} der Pause.`]) };
});

// ---------- M15 Wahrscheinlichkeit ----------
const pf = (id, f, label, pts) => ({ id, type: 'num', prob: true, label: label || 'Wahrscheinlichkeit (Bruch, Dezimalzahl oder %)', answer: f.val, show: f.toString() + ' ≈ ' + num(f.val * 100, 1) + ' %', tol: 0.0051, points: pts || 1 });
const COL = ['rote', 'blaue', 'grüne', 'gelbe'];
reg('M15.einstufig', { skill: 'M15', title: 'Wahrscheinlichkeit: 1 Zug', diff: 1, quick: true }, (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const c = [r.int(2, 8), r.int(2, 8), r.int(1, 6)], n = sum(c), i = r.int(0, 2); const neg = r.bool(0.3);
    return { html: `In einem Beutel liegen ${c[0]} rote, ${c[1]} blaue und ${c[2]} grüne Kugeln. Man zieht blind 1 Kugel. Wie gross ist die Wahrscheinlichkeit, ${neg ? '<b>keine</b>' : 'eine'} ${COL[i]} Kugel zu ziehen?`, fields: [pf('a', fr(neg ? n - c[i] : c[i], n))], solution: steps([`Mögliche Ergebnisse: ${n} Kugeln`, `Günstige Ergebnisse: ${neg ? n - c[i] : c[i]}`, m(`P = ${fr(neg ? n - c[i] : c[i], n).tex()}`)]) }; }
  if (t === 1) { const ev = r.pick([['eine Zahl grösser als 4', 2], ['eine gerade Zahl', 3], ['eine Primzahl', 3], ['eine Zahl kleiner als 3', 2], ['eine durch 3 teilbare Zahl', 2], ['keine Sechs', 5]]);
    return { html: `Ein Spielwürfel wird 1-mal geworfen. Wie gross ist die Wahrscheinlichkeit für ${ev[0]}?`, fields: [pf('a', fr(ev[1], 6))], solution: steps([`Mögliche Ergebnisse: 6`, `Günstige Ergebnisse: ${ev[1]}`, m(`P = ${fr(ev[1], 6).tex()}`)]) }; }
  const n = r.pick([8, 10, 12]), k = r.int(2, n - 3);
  return { html: `Ein Glücksrad hat ${n} gleich grosse Felder. ${k} davon sind Gewinnfelder. Wie gross ist die Wahrscheinlichkeit für einen Gewinn bei 1 Drehung?`, fields: [pf('a', fr(k, n))], solution: steps([m(`P = \\frac{\\text{günstig}}{\\text{möglich}} = ${fr(k, n).tex()}`)]) };
});
reg('M15.zweistufig', { skill: 'M15', title: 'Wahrscheinlichkeit: 2 Züge', diff: 3, pts: 2 }, (r) => {
  const a = r.int(2, 6), b = r.int(2, 6), n = a + b; const back = r.bool(); const t = r.int(0, 2);
  const p2 = (x, y) => (back ? fr(x * y, n * n) : fr(x * y, n * (n - 1))); const same = (x) => (back ? fr(x * x, n * n) : fr(x * (x - 1), n * (n - 1)));
  let P, q, st;
  if (t === 0) { P = same(a); q = 'beide Kugeln rot sind'; st = [`1. Zug rot: ${m(fr(a, n).tex())}`, `2. Zug rot: ${m(back ? fr(a, n).tex() : fr(a - 1, n - 1).tex())}${back ? '' : ' (1 rote Kugel fehlt jetzt)'}`, `Entlang des Pfads multiplizieren: ${m('P = ' + P.tex())}`]; }
  else if (t === 1) { P = p2(a, b).add(p2(b, a)); q = 'die beiden Kugeln verschiedene Farben haben'; st = [`Pfad rot–blau: ${m(p2(a, b).tex())}`, `Pfad blau–rot: ${m(p2(b, a).tex())}`, `Mehrere Pfade: addieren. ${m('P = ' + P.tex())}`]; }
  else { P = same(a).add(same(b)); q = 'beide Kugeln die gleiche Farbe haben'; st = [`Pfad rot–rot: ${m(same(a).tex())}`, `Pfad blau–blau: ${m(same(b).tex())}`, `Mehrere Pfade: addieren. ${m('P = ' + P.tex())}`]; }
  return { html: `In einem Beutel liegen ${a} rote und ${b} blaue Kugeln. Man zieht 2-mal blind 1 Kugel, ${back ? '<b>mit</b> Zurücklegen' : '<b>ohne</b> Zurücklegen'}. Wie gross ist die Wahrscheinlichkeit, dass ${q}?`, fields: [pf('a', P, null, 2)], solution: steps(['Baumdiagramm mit 2 Stufen zeichnen.', ...st]) };
});
reg('M15.mindestens', { skill: 'M15', title: '«Mindestens ein Treffer»', diff: 3, pts: 2 }, (r) => {
  const fs = [fr(1, 2), fr(2, 3), fr(3, 4), fr(3, 5), fr(4, 5), fr(1, 3), fr(2, 5), fr(5, 6), fr(1, 4)]; let p1, p2; do { p1 = r.pick(fs); p2 = r.pick(fs); } while (p1 === p2);
  const A = r.pick(NAMES_F), B = r.pick(NAMES_M); const none = fr(p1.d - p1.n, p1.d).mul(fr(p2.d - p2.n, p2.d)); const P = fr(1).sub(none);
  return { html: `${A} trifft beim Freiwurf mit einer Wahrscheinlichkeit von ${ft(p1)}, ${B} mit ${ft(p2)}. Beide werfen je 1-mal. Wie gross ist die Wahrscheinlichkeit, dass <b>mindestens eine</b> Person trifft?`, fields: [pf('a', P, null, 2)],
    solution: steps([`Gegenereignis: niemand trifft.`, `${A} trifft nicht: ${m(fr(p1.d - p1.n, p1.d).tex())}; ${B} trifft nicht: ${m(fr(p2.d - p2.n, p2.d).tex())}`, `Niemand trifft: ${m(fr(p1.d - p1.n, p1.d).tex() + ' \\cdot ' + fr(p2.d - p2.n, p2.d).tex() + ' = ' + none.tex())}`, `Mindestens 1 Treffer: ${m('1 - ' + none.tex() + ' = ' + P.tex())} ≈ ${num(P.val * 100, 1)} %`]) };
});
reg('M15.rueckwaerts', { skill: 'M15', title: 'Fehlende Wahrscheinlichkeit', diff: 3, quick: true }, (r) => {
  let p1, p2, both; do { p1 = r.pick([fr(3, 4), fr(1, 2), fr(2, 3), fr(4, 5), fr(3, 5)]); p2 = r.pick([fr(2, 5), fr(1, 2), fr(3, 10), fr(3, 5), fr(1, 4), fr(7, 10)]); both = p1.mul(p2); } while (!Number.isInteger(Math.round(both.val * 1e6) / 1e4 * 2)); const A = r.pick(NAMES_M), B = r.pick(NAMES_M.filter((x) => x !== A));
  return { html: `${A} trifft mit einer Wahrscheinlichkeit von ${ft(p1)}. Die Wahrscheinlichkeit, dass ${A} und ${B} beide treffen, beträgt ${num(both.val * 100, 2)} %. Mit welcher Wahrscheinlichkeit trifft ${B}?`, fields: [pf('a', p2)],
    solution: steps([`Beide treffen: ${m(`P(\\text{${A}}) \\cdot P(\\text{${B}}) = ${num(both.val, 4)}`)}`, `Nach ${m(`P(\\text{${B}})`)} auflösen: ${m(`${num(both.val, 4)} : ${p1.tex()} = ${p2.tex()}`)} = ${num(p2.val * 100, 1)} %`]) };
});
reg('M15.schaetzen', { skill: 'M15', title: 'Relative Häufigkeit und Schätzen', diff: 2, quick: true }, (r) => {
  const n = r.pick([50, 80, 100, 200]), p = r.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.6]), N = r.pick([400, 500, 600, 1000, 1200]); const k = Math.round(n * p);
  return { html: `Ein Glücksrad wurde ${n}-mal gedreht. Dabei blieb es ${k}-mal auf Rot stehen. Wie oft ist bei ${N} Drehungen Rot zu erwarten?`, fields: [nf('a', sig(N * k / n), 'Anzahl')], solution: steps([`Relative Häufigkeit von Rot: ${m(`\\frac{${k}}{${n}} = ${num(k / n)}`)}`, `Schätzung: ${m(`${num(k / n)} \\cdot ${N} = ${sig(N * k / n)}`)}`]) };
});
reg('M15.summe', { skill: 'M15', title: 'Zwei Würfel', diff: 2 }, (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const s = r.int(4, 10); const cnt = 6 - Math.abs(7 - s); return { html: `Zwei Spielwürfel werden geworfen. Wie gross ist die Wahrscheinlichkeit für die Augensumme ${s}?`, fields: [pf('a', fr(cnt, 36))], solution: steps([`Mögliche Ergebnisse: ${m('6 \\cdot 6 = 36')} Paare`, `Günstige Paare: ${Array.from({ length: 6 }, (_, i) => i + 1).filter((a) => s - a >= 1 && s - a <= 6).map((a) => `(${a}|${s - a})`).join(', ')}: ${cnt} Stück`, m('P = ' + fr(cnt, 36).tex())]) }; }
  if (t === 1) return { html: `Zwei Spielwürfel werden geworfen. Wie gross ist die Wahrscheinlichkeit, dass beide die gleiche Zahl zeigen?`, fields: [pf('a', fr(6, 36))], solution: steps(['Mögliche Paare: 36', 'Günstig: (1|1), (2|2), …, (6|6): 6 Paare', m('P = \\frac{6}{36} = \\frac{1}{6}')]) };
  return { html: `Zwei Spielwürfel werden geworfen. Wie gross ist die Wahrscheinlichkeit für <b>mindestens eine</b> Sechs?`, fields: [pf('a', fr(11, 36))], solution: steps([`Gegenereignis: keine Sechs: ${m('\\frac{5}{6} \\cdot \\frac{5}{6} = \\frac{25}{36}')}`, m('P = 1 - \\frac{25}{36} = \\frac{11}{36}')]) };
});
