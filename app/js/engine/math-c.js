// Mathematik-Generatoren M16–M24: Winkel, Flächen, Pythagoras, Konstruktionen, Spiegelung, Körper, Technik.
import { reg, m, steps, num, texOf } from './gen-core.js';
import { svg, line, pline, poly, text, circle, dot, rect, rightAngle, angleArc, sideLabel, vertexLabel, mid, grid, cubes, viewGrid, net } from './svg.js';
import { evaluate, parse } from './expr.js';

const nf = (id, v, label, unit, extra) => Object.assign({ id, type: 'num', label: label || 'Resultat', answer: v, unit: unit || null, tol: Math.max(1e-9, Math.abs(v) * 1e-9) }, extra || {});
const r2 = (v) => Math.round(v * 100) / 100;
const rf = (id, v, label, unit, pts) => ({ id, type: 'num', label: (label || 'Resultat') + ' (auf 2 Dezimalen)', answer: r2(v), unit: unit || null, tol: 0.011, show: r2(v).toFixed(2), points: pts || 1 });
const NS = '<p class="hint">Figur nicht massstäblich.</p>';
const cen = (P) => [P.reduce((a, p) => a + p[0], 0) / P.length, P.reduce((a, p) => a + p[1], 0) / P.length];

function triFig(P, names, angles, sides, extra = '') {
  const c = cen(P); let b = poly(P, 'fg-shape');
  P.forEach((p, i) => { b += vertexLabel(p, c, names[i]); if (angles && angles[i]) b += angleArc(p, P[(i + 1) % 3], P[(i + 2) % 3], angles[i]); });
  if (sides) sides.forEach((s, i) => { if (s) b += sideLabel(P[(i + 1) % 3], P[(i + 2) % 3], P[i], s); }); // Seite gegenüber von Ecke i
  return svg(320, 200, b + extra, 'Dreieck');
}

// ---------- M16 Winkel ----------
reg('M16.dreieck', { skill: 'M16', title: 'Winkel im Dreieck', diff: 1, quick: true }, (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const a = r.int(28, 80), b = r.int(30, 140 - a); const g = 180 - a - b;
    return { html: `Berechne den Winkel ${m('x')}.` + NS, fig: triFig([[40, 165], [270, 165], [190, 40]], ['A', 'B', 'C'], [a + '°', b + '°', 'x']), fields: [nf('a', g, 'x =', '°')], solution: steps([`Winkelsumme im Dreieck: 180°`, m(`x = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${g}^\\circ`)]) }; }
  if (t === 1) { const apex = r.int(10, 70) * 2; const base = (180 - apex) / 2; const giveApex = r.bool();
    const tick = line(96, 97, 108, 105, 'fg-thin') + line(204, 97, 192, 105, 'fg-thin');
    return { html: `Das Dreieck ist gleichschenklig (${m('\\overline{AC} = \\overline{BC}')}). Berechne ${m('x')}.` + NS, fig: triFig([[50, 165], [250, 165], [150, 40]], ['A', 'B', 'C'], giveApex ? ['x', '', apex + '°'] : [base + '°', '', 'x'], null, tick), fields: [nf('a', giveApex ? base : apex, 'x =', '°')],
      solution: steps([`Gleichschenklig: die beiden Basiswinkel bei A und B sind gleich gross.`, giveApex ? m(`x = (180^\\circ - ${apex}^\\circ) : 2 = ${base}^\\circ`) : m(`x = 180^\\circ - 2 \\cdot ${base}^\\circ = ${apex}^\\circ`)]) }; }
  const a = r.int(30, 75), g = r.int(35, 80); const P = [[40, 165], [230, 165], [170, 45]];
  const extra = line(230, 165, 305, 165, 'fg-line') + angleArc([230, 165], [305, 165], [170, 45], 'x');
  return { html: `Die Seite ${m('AB')} ist über ${m('B')} hinaus verlängert. Berechne den Aussenwinkel ${m('x')}.` + NS, fig: triFig(P, ['A', 'B', 'C'], [a + '°', '', g + '°'], null, extra), fields: [nf('a', a + g, 'x =', '°')],
    solution: steps([`Innenwinkel bei B: ${m(`180^\\circ - ${a}^\\circ - ${g}^\\circ = ${180 - a - g}^\\circ`)}`, `Aussenwinkel = Nebenwinkel: ${m(`x = 180^\\circ - ${180 - a - g}^\\circ = ${a + g}^\\circ`)}`, `Kurz: Aussenwinkel = Summe der beiden anderen Innenwinkel.`]) };
});
reg('M16.parallelen', { skill: 'M16', title: 'Winkel an Parallelen', diff: 2, quick: true }, (r) => {
  const a = r.int(35, 145); const t = r.int(0, 2);
  const P1 = [120, 150], P2 = [210, 60];
  let b = line(20, 150, 300, 150) + line(20, 60, 300, 60) + line(75, 195, 250, 20) + text(308, 154, 'g', 'fg-text small') + text(308, 64, 'h', 'fg-text small');
  b += angleArc(P1, [300, 150], [250, 20], a + '°');
  let ans, why;
  if (t === 0) { b += angleArc(P2, [300, 60], [250, 20], 'x'); ans = a; why = 'Stufenwinkel an Parallelen sind gleich gross.'; }
  else if (t === 1) { b += angleArc(P2, [20, 60], [75, 195], 'x'); ans = a; why = 'Wechselwinkel an Parallelen sind gleich gross.'; }
  else { b += angleArc(P2, [20, 60], [250, 20], 'x'); ans = 180 - a; why = 'Der Stufenwinkel bei h ist gleich gross wie der gegebene Winkel. x ist sein Nebenwinkel: zusammen 180°.'; }
  return { html: `Die Geraden ${m('g')} und ${m('h')} sind parallel. Berechne ${m('x')}.` + NS, fig: svg(325, 210, b, 'Zwei Parallelen mit Schnittgerade'), fields: [nf('a', ans, 'x =', '°')], solution: steps([why, m(`x = ${ans}^\\circ`)]) };
});
reg('M16.viereck', { skill: 'M16', title: 'Winkel im Viereck', diff: 2, quick: true }, (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const a = r.int(60, 110), b = r.int(70, 120), c = r.int(50, 100); const d = 360 - a - b - c;
    return { html: `In einem Viereck messen drei Winkel ${a}°, ${b}° und ${c}°. Wie gross ist der vierte Winkel?`, fields: [nf('a', d, null, '°')], solution: steps([`Winkelsumme im Viereck: 360°`, m(`360^\\circ - ${a}^\\circ - ${b}^\\circ - ${c}^\\circ = ${d}^\\circ`)]) }; }
  if (t === 1) { const a = r.int(40, 85); const what = r.pick(['Parallelogramm', 'Rhombus']);
    return { html: `In einem ${what} ${m('ABCD')} misst der Winkel ${m('\\alpha')} bei ${m('A')} ${a}°. Wie gross ist der Winkel ${m('\\beta')} bei ${m('B')}?`, fields: [nf('a', 180 - a, '\\(\\beta\\) =', '°')], solution: steps([`Im ${what} sind gegenüberliegende Winkel gleich, benachbarte Winkel ergeben zusammen 180°.`, m(`\\beta = 180^\\circ - ${a}^\\circ = ${180 - a}^\\circ`)]) }; }
  const a = r.int(95, 140), c = r.int(40, 80); const b = (360 - a - c) / 2; if (!Number.isInteger(b)) return { html: `In einem Viereck messen drei Winkel 90°, 85° und 110°. Wie gross ist der vierte Winkel?`, fields: [nf('a', 75, null, '°')], solution: steps([m('360^\\circ - 285^\\circ = 75^\\circ')]) };
  return { html: `Im Drachenviereck ${m('ABCD')} ist ${m('AC')} die Symmetrieachse. Die Winkel bei ${m('A')} und ${m('C')} messen ${a}° und ${c}°. Wie gross ist der Winkel bei ${m('B')}?`, fields: [nf('a', b, null, '°')], solution: steps([`Die Winkel bei B und D sind gleich gross (Symmetrie).`, m(`(360^\\circ - ${a}^\\circ - ${c}^\\circ) : 2 = ${b}^\\circ`)]) };
});

// ---------- M17 Umfang und Fläche ----------
reg('M17.formel', { skill: 'M17', title: 'Flächenformeln', diff: 1, quick: true }, (r) => {
  const t = r.int(0, 4); const a = r.int(4, 14), b = r.int(3, 11), c = r.int(2, 9);
  if (t === 0) return { html: `Ein Dreieck hat die Grundseite ${m(`g = ${a}`)} cm und die zugehörige Höhe ${m(`h = ${b}`)} cm. Berechne den Flächeninhalt.`, fields: [nf('a', a * b / 2, 'A =', 'cm²')], solution: steps([m(`A = \\frac{g \\cdot h}{2} = \\frac{${a} \\cdot ${b}}{2} = ${a * b / 2}`)]) };
  if (t === 1) return { html: `Ein Parallelogramm hat die Seite ${m(`a = ${a}`)} cm und die zugehörige Höhe ${m(`h = ${b}`)} cm. Berechne den Flächeninhalt.`, fields: [nf('a', a * b, 'A =', 'cm²')], solution: steps([m(`A = a \\cdot h = ${a} \\cdot ${b} = ${a * b}`)]) };
  if (t === 2) return { html: `Ein Trapez hat die parallelen Seiten ${m(`a = ${a + c}`)} cm und ${m(`c = ${c}`)} cm. Ihr Abstand ist ${m(`h = ${b}`)} cm. Berechne den Flächeninhalt.`, fields: [nf('a', (a + 2 * c) / 2 * b, 'A =', 'cm²')], solution: steps([m(`A = \\frac{a + c}{2} \\cdot h = \\frac{${a + c} + ${c}}{2} \\cdot ${b} = ${(a + 2 * c) / 2 * b}`)]) };
  const what = t === 3 ? 'Rhombus' : 'Drachenviereck';
  return { html: `Ein ${what} hat die Diagonalen ${m(`e = ${a}`)} cm und ${m(`f = ${b}`)} cm. Berechne den Flächeninhalt.`, fields: [nf('a', a * b / 2, 'A =', 'cm²')], solution: steps([`Die Diagonalen stehen senkrecht aufeinander.`, m(`A = \\frac{e \\cdot f}{2} = \\frac{${a} \\cdot ${b}}{2} = ${a * b / 2}`)]) };
});
reg('M17.zusammengesetzt', { skill: 'M17', title: 'Zusammengesetzte Figur', diff: 2, pts: 2 }, (r) => {
  if (r.bool()) { const a = r.int(7, 14), b = r.int(6, 11), c = r.int(2, a - 3), d = r.int(2, b - 3); const s = 14;
    const P = [[20, 20 + d * s], [20 + (a - c) * s, 20 + d * s], [20 + (a - c) * s, 20], [20, 20]]; // nur für Lage
    const pts = [[20, 20], [20 + (a - c) * s, 20], [20 + (a - c) * s, 20 + d * s], [20 + a * s, 20 + d * s], [20 + a * s, 20 + b * s], [20, 20 + b * s]];
    const body = poly(pts, 'fg-shape grey') + text(20 + a * s / 2, 38 + b * s, a + ' cm') + text(8, 24 + b * s / 2, b + ' cm', 'fg-text', 'end') + text(20 + (a - c / 2) * s, 14 + d * s, c + ' cm') + text(26 + (a - c) * s, 24 + d * s / 2, d + ' cm', 'fg-text', 'start');
    return { html: 'Alle Ecken der Figur sind rechte Winkel.' + NS, fig: svg(a * s + 80, b * s + 50, `<g transform="translate(34,0)">${body}</g>`, 'L-förmige Figur'), fields: [nf('a', a * b - c * d, 'Flächeninhalt', 'cm²'), nf('b', 2 * (a + b), 'Umfang', 'cm')],
      solution: steps([`Ganzes Rechteck minus die fehlende Ecke: ${m(`${a} \\cdot ${b} - ${c} \\cdot ${d} = ${a * b - c * d}`)} cm²`, `Umfang: Die eingezogenen Seiten sind zusammen gleich lang wie die fehlenden Stücke. ${m(`2 \\cdot (${a} + ${b}) = ${2 * (a + b)}`)} cm`]) }; }
  const w = r.int(4, 10), hh = r.int(3, 8), t = r.int(2, 6); const s = 16; const x0 = 30, y0 = 20 + t * s;
  const body = poly([[x0, y0], [x0 + w * s / 2, 20], [x0 + w * s, y0], [x0 + w * s, y0 + hh * s], [x0, y0 + hh * s]], 'fg-shape grey') + line(x0, y0, x0 + w * s, y0, 'fg-dash') + line(x0 + w * s / 2, 20, x0 + w * s / 2, y0, 'fg-dash') + text(x0 + w * s / 2, y0 + hh * s + 18, w + ' m') + text(x0 - 6, y0 + hh * s / 2 + 4, hh + ' m', 'fg-text', 'end') + text(x0 + w * s / 2 + 6, 20 + t * s / 2 + 4, t + ' m', 'fg-text', 'start');
  return { html: 'Die Giebelwand eines Hauses besteht aus einem Rechteck und einem gleichschenkligen Dreieck. Berechne den Flächeninhalt der ganzen Wand.' + NS, fig: svg(w * s + 90, (hh + t) * s + 50, body, 'Hauswand'), fields: [nf('a', w * hh + w * t / 2, 'Flächeninhalt', 'm²', { points: 2 })],
    solution: steps([`Rechteck: ${m(`${w} \\cdot ${hh} = ${w * hh}`)} m²`, `Dreieck: ${m(`\\frac{${w} \\cdot ${t}}{2} = ${w * t / 2}`)} m²`, `Zusammen: ${w * hh + w * t / 2} m²`]) };
});
reg('M17.gleichung', { skill: 'M17', title: 'Fläche und Gleichung für x', diff: 3, pts: 3 }, (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const k1 = r.int(1, 3), k2 = r.int(1, 3), k3 = r.int(1, 3), hgt = r.pick([4, 6, 8, 10]), x = r.pick([1.5, 2, 2.5, 3, 3.5, 4, 5]); const G = hgt * x * (k1 + 2 * k2 + k3) / 2;
    const K = k1 + k2 + k3, s = 250 / K, x0 = 46, y0 = 34, H = 110; const cx = (k) => (k === 1 ? 'x' : k + 'x');
    const body = rect(x0, y0, K * s, H, 'fg-shape') + poly([[x0, y0 + H], [x0 + k1 * s, y0], [x0 + (k1 + k2) * s, y0], [x0 + K * s, y0 + H]], 'fg-shape grey') +
      text(x0 + k1 * s / 2, y0 - 8, cx(k1)) + text(x0 + (k1 + k2 / 2) * s, y0 - 8, cx(k2)) + text(x0 + (k1 + k2 + k3 / 2) * s, y0 - 8, cx(k3)) + text(x0 - 8, y0 + H / 2 + 4, hgt + ' cm', 'fg-text', 'end') +
      text(x0 - 8, y0 - 6, 'D', 'fg-text bold') + text(x0 + K * s + 8, y0 - 6, 'C', 'fg-text bold') + text(x0 - 8, y0 + H + 14, 'A', 'fg-text bold') + text(x0 + K * s + 8, y0 + H + 14, 'B', 'fg-text bold');
    const coef = hgt * (k1 + 2 * k2 + k3) / 2;
    return { html: `Im Rechteck ${m('ABCD')} hat die graue Fläche den Inhalt ${G} cm². Die Seite ${m('AD')} misst ${hgt} cm. Die obere Seite ist in drei Stücke geteilt (siehe Figur). Berechne ${m('x')}.` + NS, fig: svg(340, 175, body, 'Rechteck mit grauer Fläche'), fields: [nf('a', x, 'x =', 'cm', { points: 3 })],
      solution: steps([`Ganzes Rechteck: ${m(`${hgt} \\cdot ${K}x = ${hgt * K}x`)}`, `Weisses Dreieck links: ${m(`\\frac{1}{2} \\cdot ${cx(k1)} \\cdot ${hgt} = ${num(hgt * k1 / 2)}x`)}; rechts: ${m(`\\frac{1}{2} \\cdot ${cx(k3)} \\cdot ${hgt} = ${num(hgt * k3 / 2)}x`)}`, `Gleichung: ${m(`${hgt * K}x - ${num(hgt * k1 / 2)}x - ${num(hgt * k3 / 2)}x = ${G}`)}`, `${m(`${num(coef)}x = ${G}`)}, also ${m(`x = ${x}`)} cm`]) }; }
  if (t === 1) { const k = r.int(2, 5), h = r.pick([4, 6, 8, 12]), x = r.pick([1.5, 2, 2.5, 3, 4, 5]); const A = k * x * h / 2;
    return { html: `Ein Dreieck hat die Grundseite ${m(`${k}x`)} cm und die zugehörige Höhe ${h} cm. Sein Flächeninhalt ist ${A} cm². Berechne ${m('x')}.`, fields: [nf('a', x, 'x =', 'cm', { points: 3 })], solution: steps([`Flächenformel: ${m(`\\frac{${k}x \\cdot ${h}}{2} = ${A}`)}`, m(`${num(k * h / 2)}x = ${A}`), m(`x = ${x}`)]) }; }
  const a = r.int(1, 5), b = r.int(6, 12), h = r.pick([4, 6, 8]), x = r.int(2, 9); const A = (2 * x + a + b) / 2 * h;
  return { html: `Ein Trapez hat die parallelen Seiten ${m(`x + ${a}`)} cm und ${m(`x + ${b}`)} cm. Ihr Abstand ist ${h} cm. Der Flächeninhalt ist ${A} cm². Berechne ${m('x')}.`, fields: [nf('a', x, 'x =', 'cm', { points: 3 })],
    solution: steps([`Flächenformel: ${m(`\\frac{(x + ${a}) + (x + ${b})}{2} \\cdot ${h} = ${A}`)}`, `Vereinfachen: ${m(`(2x + ${a + b}) \\cdot ${h / 2} = ${A}`)}`, m(`2x + ${a + b} = ${A / (h / 2)}`), m(`x = ${x}`)]) };
});

// ---------- M18 Pythagoras und Thales ----------
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25], [20, 21, 29], [12, 16, 20], [1.5, 2, 2.5], [4.5, 6, 7.5]];
function rightFig(la, lb, lc) { const A = [40, 160], B = [250, 160], C = [250, 50];
  return svg(310, 190, poly([A, B, C], 'fg-shape') + rightAngle(B, A, C) + sideLabel(A, B, C, la) + sideLabel(B, C, A, lb) + sideLabel(A, C, B, lc), 'Rechtwinkliges Dreieck'); }
reg('M18.pythagoras', { skill: 'M18', title: 'Satz des Pythagoras', diff: 1, quick: true }, (r) => {
  if (r.bool(0.5)) { const [a, b, c] = r.pick(TRIPLES); const t = r.int(0, 1);
    if (t === 0) return { html: 'Berechne die Länge ' + m('x') + ' (Längen in cm).' + NS, fig: rightFig(a, b, 'x'), fields: [nf('a', c, 'x =', 'cm')], solution: steps([`x liegt dem rechten Winkel gegenüber: Hypotenuse.`, m(`x = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${r2(a * a + b * b)}} = ${c}`)]) };
    return { html: 'Berechne die Länge ' + m('x') + ' (Längen in cm).' + NS, fig: rightFig(a, 'x', c), fields: [nf('a', b, 'x =', 'cm')], solution: steps([`x ist eine Kathete: von der Hypotenuse aus rechnen.`, m(`x = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${r2(c * c - a * a)}} = ${b}`)]) }; }
  const a = r.int(3, 12), b = r.int(3, 12); const c = Math.hypot(a, b);
  return { html: 'Berechne die Länge ' + m('x') + ' (Längen in cm).' + NS, fig: rightFig(a, b, 'x'), fields: [rf('a', c, 'x =', 'cm')], solution: steps([m(`x = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} \\approx ${r2(c).toFixed(2)}`)]) };
});
reg('M18.anwendung', { skill: 'M18', title: 'Pythagoras anwenden', diff: 3, pts: 2 }, (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const L = r.pick([5, 6.5, 7.5, 8, 10]), d = r.pick([1.4, 1.8, 2, 2.5, 3]); const h = Math.sqrt(L * L - d * d);
    return { html: `Eine ${L} m lange Leiter lehnt an einer senkrechten Wand. Ihr Fuss steht ${d} m von der Wand entfernt. In welcher Höhe berührt die Leiter die Wand?`, fields: [rf('a', h, 'Höhe', 'm', 2)], solution: steps([`Leiter = Hypotenuse, Abstand und Höhe = Katheten.`, m(`h = \\sqrt{${L}^2 - ${d}^2} = \\sqrt{${r2(L * L - d * d)}} \\approx ${r2(h).toFixed(2)}`)]) }; }
  if (t === 1) { const a = r.int(5, 14), b = r.int(3, 10); const d = Math.hypot(a, b);
    return { html: `Ein Rechteck ist ${a} cm lang und ${b} cm breit. Wie lang ist seine Diagonale?`, fields: [rf('a', d, 'Diagonale', 'cm', 2)], solution: steps([`Die Diagonale teilt das Rechteck in 2 rechtwinklige Dreiecke.`, m(`d = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} \\approx ${r2(d).toFixed(2)}`)]) }; }
  if (t === 2) { const s = r.int(6, 13), g = r.int(4, 2 * s - 4); const gg = g % 2 ? g + 1 : g; const h = Math.sqrt(s * s - (gg / 2) ** 2);
    return { html: `Ein gleichschenkliges Dreieck hat die Schenkel ${s} cm und die Basis ${gg} cm. Berechne die Höhe auf die Basis und den Flächeninhalt.`, fields: [rf('a', h, 'Höhe', 'cm'), rf('b', gg * h / 2, 'Flächeninhalt', 'cm²')], solution: steps([`Die Höhe halbiert die Basis: rechtwinkliges Dreieck mit Katheten ${gg / 2} und h, Hypotenuse ${s}.`, m(`h = \\sqrt{${s}^2 - ${gg / 2}^2} = \\sqrt{${s * s - (gg / 2) ** 2}} \\approx ${r2(h).toFixed(2)}`), m(`A = \\frac{${gg} \\cdot h}{2} \\approx ${r2(gg * h / 2).toFixed(2)}`)]) }; }
  const a = r.int(3, 12); const c = a * Math.SQRT2;
  return { html: `Ein rechtwinkliges Dreieck hat einen Winkel von 45°. Eine Kathete misst ${a} cm. Wie lang ist die Hypotenuse?`, fields: [rf('a', c, 'Hypotenuse', 'cm', 2)], solution: steps([`Winkel 90°, 45°, 45°: Das Dreieck ist gleichschenklig, beide Katheten messen ${a} cm.`, m(`c = \\sqrt{${a}^2 + ${a}^2} = \\sqrt{${2 * a * a}} = ${a}\\sqrt{2} \\approx ${r2(c).toFixed(2)}`)]) };
});
reg('M18.raum', { skill: 'M18', title: 'Pythagoras im Raum', diff: 3, pts: 2 }, (r) => {
  if (r.bool()) { const a = r.int(3, 12), b = r.int(2, 9), c = r.int(2, 8); const d = Math.sqrt(a * a + b * b + c * c);
    return { html: `Ein Quader hat die Kanten ${a} cm, ${b} cm und ${c} cm. Berechne die Länge der Raumdiagonale.`, fields: [rf('a', d, 'Raumdiagonale', 'cm', 2)], solution: steps([`Zuerst die Diagonale der Grundfläche: ${m(`e = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}}`)}`, `Dann mit der Höhe: ${m(`d = \\sqrt{e^2 + ${c}^2} = \\sqrt{${a * a + b * b} + ${c * c}} = \\sqrt{${a * a + b * b + c * c}} \\approx ${r2(d).toFixed(2)}`)}`]) }; }
  const a = r.pick([4, 6, 8, 10]), s = r.int(a, a + 6); const h = Math.sqrt(s * s - a * a / 2);
  return { html: `Eine gerade Pyramide hat ein Quadrat mit Seite ${a} cm als Grundfläche. Alle Seitenkanten messen ${s} cm. Berechne die Höhe der Pyramide.`, fields: [rf('a', h, 'Höhe', 'cm', 2)], solution: steps([`Die Höhe steht über dem Mittelpunkt des Quadrats. Halbe Diagonale: ${m(`\\frac{${a}\\sqrt{2}}{2}`)}, ihr Quadrat: ${m(`${a * a / 2}`)}`, `Rechtwinkliges Dreieck: halbe Diagonale, Höhe, Seitenkante.`, m(`h = \\sqrt{${s}^2 - ${a * a / 2}} = \\sqrt{${s * s - a * a / 2}} \\approx ${r2(h).toFixed(2)}`)]) };
});
reg('M18.thales', { skill: 'M18', title: 'Satz des Thales', diff: 2, quick: true }, (r) => {
  const A = [40, 150], B = [280, 150], M = mid(A, B), R = 120; const ang = r.int(40, 140) * Math.PI / 180; const C = [M[0] + R * Math.cos(ang), M[1] - R * Math.sin(ang)];
  const arc = `<path class="fg-thin" fill="none" d="M40 150 A120 120 0 0 1 280 150"/>`;
  if (r.bool()) { const a = r.int(20, 70);
    return { html: `${m('C')} liegt auf dem Halbkreis über ${m('AB')}. Der Winkel bei ${m('A')} misst ${a}°. Wie gross ist der Winkel ${m('x')} bei ${m('B')}?` + NS, fig: svg(320, 175, arc + poly([A, B, C], 'fg-shape') + vertexLabel(A, cen([A, B, C]), 'A') + vertexLabel(B, cen([A, B, C]), 'B') + vertexLabel(C, cen([A, B, C]), 'C') + angleArc(A, B, C, a + '°') + angleArc(B, C, A, 'x') + dot(M[0], M[1]), 'Dreieck im Halbkreis'), fields: [nf('a', 90 - a, 'x =', '°')],
      solution: steps([`Satz des Thales: Liegt C auf dem Halbkreis über AB, so ist der Winkel bei C ein rechter Winkel.`, m(`x = 180^\\circ - 90^\\circ - ${a}^\\circ = ${90 - a}^\\circ`)]) }; }
  const [a, b, c] = r.pick(TRIPLES.slice(0, 8));
  return { html: `${m('C')} liegt auf dem Halbkreis über ${m('AB')}. Es gilt ${m(`\\overline{AB} = ${c}`)} cm und ${m(`\\overline{AC} = ${a}`)} cm. Berechne ${m('\\overline{BC}')}.` + NS, fig: svg(320, 175, arc + poly([A, B, C], 'fg-shape') + vertexLabel(A, cen([A, B, C]), 'A') + vertexLabel(B, cen([A, B, C]), 'B') + vertexLabel(C, cen([A, B, C]), 'C') + dot(M[0], M[1]), 'Dreieck im Halbkreis'), fields: [nf('a', b, null, 'cm')],
    solution: steps([`Satz des Thales: rechter Winkel bei C. AB ist die Hypotenuse.`, m(`\\overline{BC} = \\sqrt{${c}^2 - ${a}^2} = \\sqrt{${r2(c * c - a * a)}} = ${b}`)]) };
});

// ---------- M19 Konstruieren (auf Papier, mit Messkontrolle) ----------
const SELF_K = { id: 's', type: 'self', write: false, paper: true, label: 'Selbstkontrolle', model: 'Vergleiche deine Konstruktion mit den Schritten in der Lösung.', checklist: [{ text: 'Alle Zirkelbögen und Hilfslinien sind sichtbar (in der Prüfung nötig für den Punkt).', points: 1 }] };
function triangle(a, b, c) { const Cx = (b * b + c * c - a * a) / (2 * c), Cy = Math.sqrt(Math.max(0, b * b - Cx * Cx)); return { A: [0, 0], B: [c, 0], C: [Cx, Cy], area: c * Cy / 2 }; }
function triSides(r) { for (;;) { const a = r.int(5, 9), b = r.int(5, 9), c = r.int(6, 10); if (a + b > c + 1.5 && a + c > b + 1.5 && b + c > a + 1.5 && new Set([a, b, c]).size > 1) { const T = triangle(a, b, c); const cosC = (a * a + b * b - c * c) / (2 * a * b); if (cosC > -0.2) return [a, b, c, T]; } } }
function konstrFig(T, extra) { const s = 22, ox = 70, oy = 250; const X = (p) => [ox + p[0] * s, oy - p[1] * s]; const P = [X(T.A), X(T.B), X(T.C)]; const c = cen(P);
  return svg(380, 320, poly(P, 'fg-shape') + vertexLabel(P[0], c, 'A') + vertexLabel(P[1], c, 'B') + vertexLabel(P[2], c, 'C') + extra(X, s), 'Fertige Konstruktion (verkleinert)'); }
reg('M19.dreieck', { skill: 'M19', title: 'Konstruktion im Dreieck', diff: 3, pts: 2 }, (r) => {
  const [a, b, c, T] = triSides(r); const t = r.int(0, 4); const sP = (a + b + c) / 2;
  const base = `Konstruiere auf Papier das Dreieck ${m('ABC')} mit ${m(`a = ${a}`)} cm, ${m(`b = ${b}`)} cm, ${m(`c = ${c}`)} cm (${m('a = \\overline{BC}')}, ${m('b = \\overline{AC}')}, ${m('c = \\overline{AB}')}). `;
  const stepTri = `Dreieck: ${m(`c = ${c}`)} cm zeichnen, Kreisbogen um A mit Radius ${b} cm und um B mit Radius ${a} cm. Schnittpunkt = C.`;
  let q, val, st, extra;
  if (t === 0) { const R = a * b * c / (4 * T.area); const U = [c / 2, (T.C[0] ** 2 + T.C[1] ** 2 - c * T.C[0]) / (2 * T.C[1])];
    q = 'Konstruiere den Umkreis. Miss den Umkreisradius.'; val = R; st = ['Mittelsenkrechten von 2 Seiten konstruieren (Kreisbögen mit gleichem Radius um beide Endpunkte, Schnittpunkte verbinden).', 'Schnittpunkt der Mittelsenkrechten = Umkreismittelpunkt U.', 'Kreis um U durch A (geht auch durch B und C).'];
    extra = (X, s) => { const u = X(U); return circle(u[0], u[1], R * s, 'fg-thin') + dot(u[0], u[1]) + text(u[0] + 10, u[1] - 6, 'U', 'fg-text small'); }; }
  else if (t === 1) { const rr = T.area / sP; const I = [(a * T.A[0] + b * T.B[0] + c * T.C[0]) / (a + b + c), (a * T.A[1] + b * T.B[1] + c * T.C[1]) / (a + b + c)];
    q = 'Konstruiere den Inkreis. Miss den Inkreisradius.'; val = rr; st = ['Winkelhalbierende von 2 Winkeln konstruieren.', 'Schnittpunkt = Inkreismittelpunkt I.', 'Lot von I auf eine Seite fällen: Lotfusspunkt gibt den Radius.', 'Kreis um I, der alle 3 Seiten berührt.'];
    extra = (X, s) => { const u = X(I); return circle(u[0], u[1], rr * s, 'fg-thin') + dot(u[0], u[1]) + text(u[0] + 10, u[1] - 6, 'I', 'fg-text small'); }; }
  else if (t === 2) { q = `Konstruiere die Höhe ${m('h_c')} (von C auf die Seite c). Miss ihre Länge.`; val = T.C[1]; st = ['Kreisbogen um C, der die Gerade AB in 2 Punkten schneidet.', 'Um diese 2 Punkte Kreisbögen mit gleichem Radius: Schnittpunkt mit C verbinden.', 'Die Höhe steht senkrecht auf c.'];
    extra = (X) => { const f = X([T.C[0], 0]), cc = X(T.C); return line(cc[0], cc[1], f[0], f[1], 'fg-dash') + rightAngle(f, X(T.A), cc, 8); }; }
  else if (t === 3) { const sc = 0.5 * Math.sqrt(2 * a * a + 2 * b * b - c * c); q = `Konstruiere die Schwerlinie ${m('s_c')} (von C zur Mitte von c). Miss ihre Länge.`; val = sc; st = ['Mittelpunkt M von AB mit der Mittelsenkrechten konstruieren.', 'M mit C verbinden.'];
    extra = (X) => { const mm = X([c / 2, 0]), cc = X(T.C); return line(cc[0], cc[1], mm[0], mm[1], 'fg-dash') + dot(mm[0], mm[1]) + text(mm[0], mm[1] + 16, 'M', 'fg-text small'); }; }
  else { const sc = 0.5 * Math.sqrt(2 * a * a + 2 * b * b - c * c); q = 'Konstruiere den Schwerpunkt S. Miss den Abstand von C zu S.'; val = sc * 2 / 3; st = ['2 Schwerlinien konstruieren (Ecke mit der Mitte der Gegenseite verbinden).', 'Schnittpunkt = Schwerpunkt S.', 'S teilt jede Schwerlinie im Verhältnis 2 : 1.'];
    extra = (X) => { const S = X([(T.A[0] + T.B[0] + T.C[0]) / 3, (T.A[1] + T.B[1] + T.C[1]) / 3]), mm = X([c / 2, 0]), cc = X(T.C), ma = X(mid(T.B, T.C)), aa = X(T.A); return line(cc[0], cc[1], mm[0], mm[1], 'fg-dash') + line(aa[0], aa[1], ma[0], ma[1], 'fg-dash') + dot(S[0], S[1]) + text(S[0] + 10, S[1] - 6, 'S', 'fg-text small'); }; }
  return { html: base + q, fields: [{ id: 'a', type: 'num', label: 'Gemessene Länge', unit: 'cm', answer: r2(val), tol: 0.25, show: r2(val).toFixed(1) + ' (± 2 mm)' }, Object.assign({}, SELF_K)],
    solution: steps([stepTri, ...st, `Kontrolle durch Rechnung: ${r2(val).toFixed(2)} cm`]) + konstrFig(T, extra) };
});
reg('M19.viereck', { skill: 'M19', title: 'Viereck konstruieren', diff: 3, pts: 2 }, (r) => {
  if (r.bool()) { let d, s, L, p; do { d = r.int(4, 8); s = r.int(3, 6); L = r.int(7, 12); p = Math.sqrt(s * s - d * d / 4); } while (!(s > d / 2 + 0.5) || L - p < 2); const bc = Math.hypot(d / 2, L - p);
    return { html: `Konstruiere auf Papier das Drachenviereck ${m('ABCD')}: Zeichne die Diagonale ${m(`\\overline{BD} = ${d}`)} cm. Weiter gilt ${m(`\\overline{AB} = ${s}`)} cm und ${m(`\\overline{AC} = ${L}`)} cm (AC ist die Symmetrieachse). Miss die Seite ${m('\\overline{BC}')}.`, fields: [{ id: 'a', type: 'num', label: 'Gemessene Länge', unit: 'cm', answer: r2(bc), tol: 0.25, show: r2(bc).toFixed(1) + ' (± 2 mm)' }, Object.assign({}, SELF_K)],
      solution: steps([`Kreisbogen um B und um D mit Radius ${s} cm: Schnittpunkt = A.`, 'Mittelsenkrechte von BD konstruieren: Sie ist die Symmetrieachse und geht durch A.', `Von A aus ${L} cm auf der Achse abtragen (über BD hinaus): Punkt C.`, 'B und D mit C verbinden.', `Kontrolle durch Rechnung: ${r2(bc).toFixed(2)} cm`]) }; }
  const e = r.int(6, 12), f = r.int(4, 9); const side = Math.hypot(e / 2, f / 2);
  return { html: `Konstruiere auf Papier einen Rhombus mit den Diagonalen ${m(`e = ${e}`)} cm und ${m(`f = ${f}`)} cm. Miss eine Seite.`, fields: [{ id: 'a', type: 'num', label: 'Gemessene Länge', unit: 'cm', answer: r2(side), tol: 0.25, show: r2(side).toFixed(1) + ' (± 2 mm)' }, Object.assign({}, SELF_K)],
    solution: steps([`Diagonale e = ${e} cm zeichnen.`, 'Mittelsenkrechte von e konstruieren.', `Vom Mittelpunkt aus auf beiden Seiten ${f / 2} cm abtragen.`, 'Die 4 Punkte verbinden.', `Kontrolle durch Rechnung: ${m(`\\sqrt{${e / 2}^2 + ${f / 2}^2} \\approx ${r2(side).toFixed(2)}`)} cm`]) };
});

// ---------- M20 Symmetrie und Spiegelung ----------
reg('M20.spiegeln', { skill: 'M20', title: 'Punkt spiegeln', diff: 2, quick: true }, (r) => {
  const t = r.int(0, 4); const P = [r.nz(-6, 6), r.nz(-6, 6)]; let img, how, why, axis = '';
  const g = grid(-8, 8, -8, 8, 15, 22);
  if (t === 0) { img = [P[0], -P[1]]; how = 'an der x-Achse'; why = 'x bleibt gleich, y wechselt das Vorzeichen.'; }
  else if (t === 1) { img = [-P[0], P[1]]; how = 'an der y-Achse'; why = 'y bleibt gleich, x wechselt das Vorzeichen.'; }
  else if (t === 2) { let k; do { k = r.int(-3, 3); } while (k === P[0] || Math.abs(2 * k - P[0]) > 8); img = [2 * k - P[0], P[1]]; how = `an der Geraden ${m('g')} (parallel zur y-Achse durch ${m(`x = ${k}`)})`; why = `Abstand zur Geraden: ${Math.abs(P[0] - k)}. Der Bildpunkt liegt gleich weit auf der anderen Seite: ${m(`x' = 2 \\cdot ${k} - (${P[0]}) = ${2 * k - P[0]}`)}`; axis = line(g.X(k), g.Y(-8), g.X(k), g.Y(8), 'fg-curve') + text(g.X(k) + 8, g.Y(7.2), 'g', 'fg-text small'); }
  else if (t === 3) { let k; do { k = r.int(-3, 3); } while (k === P[1] || Math.abs(2 * k - P[1]) > 8); img = [P[0], 2 * k - P[1]]; how = `an der Geraden ${m('g')} (parallel zur x-Achse durch ${m(`y = ${k}`)})`; why = `Abstand zur Geraden: ${Math.abs(P[1] - k)}. ${m(`y' = 2 \\cdot ${k} - (${P[1]}) = ${2 * k - P[1]}`)}`; axis = line(g.X(-8), g.Y(k), g.X(8), g.Y(k), 'fg-curve') + text(g.X(7.2), g.Y(k) - 6, 'g', 'fg-text small'); }
  else { let Z; do { Z = [r.int(-2, 2), r.int(-2, 2)]; } while ((Z[0] === P[0] && Z[1] === P[1]) || Math.abs(2 * Z[0] - P[0]) > 8 || Math.abs(2 * Z[1] - P[1]) > 8); img = [2 * Z[0] - P[0], 2 * Z[1] - P[1]]; how = `am Punkt ${m(`Z(${Z[0]}|${Z[1]})`)}`; why = `Z ist die Mitte zwischen P und P': ${m(`P' = (2 \\cdot ${Z[0]} - (${P[0]}) \\,|\\, 2 \\cdot ${Z[1]} - (${P[1]}))`)}`; axis = dot(g.X(Z[0]), g.Y(Z[1]), 'fg-dot alt') + text(g.X(Z[0]) + 9, g.Y(Z[1]) - 6, 'Z', 'fg-text small bold'); }
  return { html: `Spiegle den Punkt ${m(`P(${P[0]}|${P[1]})`)} ${how}. Gib die Koordinaten des Bildpunkts ${m("P'")} an.`, fig: svg(g.W, g.H, g.body + axis + dot(g.X(P[0]), g.Y(P[1])) + text(g.X(P[0]) + 9, g.Y(P[1]) - 6, 'P', 'fg-text small bold'), 'Koordinatensystem'), fields: [{ id: 'a', type: 'coords', label: "P' =", answer: img }], solution: steps([why, m(`P'(${img[0]}|${img[1]})`)]) };
});
reg('M20.zentrum', { skill: 'M20', title: 'Spiegelzentrum finden', diff: 3, quick: true }, (r) => {
  const Z = [r.int(-3, 3), r.int(-3, 3)], d = [r.nz(-4, 4), r.int(-4, 4)]; const P = [Z[0] + d[0], Z[1] + d[1]], Q = [Z[0] - d[0], Z[1] - d[1]];
  return { html: `Bei einer Punktspiegelung wird ${m(`P(${P[0]}|${P[1]})`)} auf ${m(`P'(${Q[0]}|${Q[1]})`)} abgebildet. Bestimme das Zentrum ${m('Z')}.`, fields: [{ id: 'a', type: 'coords', label: 'Z =', answer: Z }], solution: steps([`Z ist der Mittelpunkt der Strecke PP'.`, m(`Z = \\left(\\frac{${P[0]} + (${Q[0]})}{2} \\,\\Big|\\, \\frac{${P[1]} + (${Q[1]})}{2}\\right) = (${Z[0]}|${Z[1]})`)]) };
});
const SYM = [['gleichseitiges Dreieck', 3, false], ['Quadrat', 4, true], ['Rechteck (kein Quadrat)', 2, true], ['Rhombus (kein Quadrat)', 2, true], ['Parallelogramm (kein Rechteck, kein Rhombus)', 0, true], ['gleichschenkliges Trapez', 1, false], ['Drachenviereck (kein Rhombus)', 1, false], ['regelmässiges Sechseck', 6, true], ['gleichschenkliges Dreieck (nicht gleichseitig)', 1, false], ['regelmässiges Fünfeck', 5, false]];
reg('M20.achsen', { skill: 'M20', title: 'Symmetrieachsen und Punktsymmetrie', diff: 2, quick: true }, (r) => {
  if (r.bool()) { const s = r.pick(SYM); const opts = ['0', '1', '2', '3', '4', '5', '6'];
    return { html: `Wie viele Symmetrieachsen hat die Figur: <b>${s[0]}</b>?`, fields: [{ id: 'a', type: 'mc', options: opts, answer: s[1] }], solution: steps([`${s[0]}: ${s[1]} Symmetrieachse${s[1] === 1 ? '' : 'n'}.`, 'Probe: An jeder Achse muss die Figur beim Falten genau auf sich selbst fallen.']) }; }
  const it = r.sample(SYM, 4);
  return { html: 'Welche Figuren sind punktsymmetrisch (Drehung um 180° bildet die Figur auf sich selbst ab)?', fields: [{ id: 'a', type: 'classify', rows: it.map((x) => x[0]), cols: ['punktsymmetrisch', 'nicht punktsymmetrisch'], answers: it.map((x) => (x[2] ? 0 : 1)), points: 2 }], solution: steps(['Punktsymmetrisch: Zu jedem Punkt gibt es einen gegenüberliegenden Punkt im gleichen Abstand zum Zentrum.', 'Parallelogramme (auch Rechteck, Rhombus, Quadrat) und regelmässige Vielecke mit gerader Eckenzahl sind punktsymmetrisch.']) };
});

// ---------- M21 Körper ----------
const NECK = { 3: 'Dreieck', 4: 'Viereck', 5: 'Fünfeck', 6: 'Sechseck', 8: 'Achteck' };
reg('M21.zaehlen', { skill: 'M21', title: 'Ecken, Kanten, Flächen', diff: 2, quick: true }, (r) => {
  const n = r.pick([3, 4, 5, 6, 8]); const pr = r.bool(); const E = pr ? 2 * n : n + 1, K = pr ? 3 * n : 2 * n, F = pr ? n + 2 : n + 1;
  if (r.bool(0.35)) { const what = r.pick([['Kanten', pr ? '3n' : '2n'], ['Ecken', pr ? '2n' : 'n+1'], ['Flächen', pr ? 'n+2' : 'n+1']]);
    return { html: `${pr ? 'Ein gerades Prisma' : 'Eine Pyramide'} hat ein ${m('n')}-Eck als Grundfläche. Gib einen Term für die Anzahl <b>${what[0]}</b> an.`, fields: [{ id: 'a', type: 'expr', answer: what[1], vars: ['n'], label: 'Term' }], solution: steps([pr ? 'Prisma: 2 gleiche n-Ecke (Boden, Deckel) und n Rechtecke als Seitenflächen.' : 'Pyramide: 1 n-Eck als Boden, n Dreiecke, 1 Spitze.', `${what[0]}: ${m(texOf(what[1]))}`]) }; }
  return { html: `${pr ? 'Ein gerades Prisma' : 'Eine Pyramide'} hat ein ${NECK[n]} als Grundfläche. Bestimme die Anzahl Ecken, Kanten und Flächen.`, fields: [nf('a', E, 'Ecken'), nf('b', K, 'Kanten'), nf('c', F, 'Flächen')],
    solution: steps([pr ? `Ecken: ${m(`2 \\cdot ${n} = ${E}`)}; Kanten: ${m(`3 \\cdot ${n} = ${K}`)}; Flächen: ${m(`${n} + 2 = ${F}`)}` : `Ecken: ${m(`${n} + 1 = ${E}`)}; Kanten: ${m(`2 \\cdot ${n} = ${K}`)}; Flächen: ${m(`${n} + 1 = ${F}`)}`, `Kontrolle (Eulerscher Polyedersatz): Ecken + Flächen − Kanten = 2: ${m(`${E} + ${F} - ${K} = 2`)}`]) };
});
function validNet(r) { const t = r.int(0, 5); if (t === 0) return [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3], [1, 4]]; if (t === 1) return [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 3]]; return [[1, 0], [1, 1], [1, 2], [1, 3], [0, r.int(0, 3)], [2, r.int(0, 3)]]; }
function invalidNet(r) { const t = r.int(0, 4);
  if (t === 0) return [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]];
  if (t === 1) { let a, b; do { a = r.int(0, 3); b = r.int(0, 3); } while (a === b); return [[1, 0], [1, 1], [1, 2], [1, 3], [0, a], [0, b]]; }
  if (t === 2) return [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, r.int(0, 4)]];
  if (t === 3) return [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [3, 1]];
  return [[0, 0], [1, 0], [0, 1], [1, 1], [1, 2], [1, 3]]; }
reg('M21.netz', { skill: 'M21', title: 'Würfelnetz erkennen', diff: 2, quick: true }, (r) => {
  const wantValid = r.bool(); const nets = []; const seen = new Set();
  const add = (n, ok) => { const k = JSON.stringify(n); if (seen.has(k)) return false; seen.add(k); nets.push({ n, ok }); return true; };
  while (nets.length < 1) add(wantValid ? validNet(r) : invalidNet(r), wantValid);
  let guard = 0; while (nets.length < 4 && guard++ < 100) add(wantValid ? invalidNet(r) : validNet(r), !wantValid);
  const order = r.shuffle(nets);
  return { html: wantValid ? 'Nur eine Figur lässt sich zu einem Würfel falten. Welche?' : 'Eine Figur ist <b>kein</b> Würfelnetz. Welche?', fields: [{ id: 'a', type: 'mc', options: order.map((x) => net(x.n)), answer: order.findIndex((x) => x.ok === wantValid) }],
    solution: steps(['Ein Würfelnetz hat 6 Quadrate. Beim Falten darf keine Fläche doppelt belegt sein.', 'Nie ein Würfelnetz: 5 oder 6 Quadrate in einer Reihe; 4 Quadrate als Block (2 mal 2); bei einer Viererreihe beide Einzelquadrate auf derselben Seite.']) };
});
reg('M21.wuerfelbau', { skill: 'M21', title: 'Würfelgebäude und Ansichten', diff: 2, pts: 2 }, (r) => {
  let hm;
  do {
    hm = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => r.pick([0, 0, 1, 1, 1, 2, 2, 3])));
    // Damit die Zeichnung eindeutig lesbar ist: hinten nie niedriger als vorne, links nie niedriger als rechts.
    for (let x = 0; x < 3; x++) { const col = [hm[0][x], hm[1][x], hm[2][x]].sort((a, b) => b - a); for (let y = 0; y < 3; y++) hm[y][x] = col[y]; }
    for (let y = 0; y < 3; y++) hm[y].sort((a, b) => b - a);
  } while (hm.flat().reduce((a, b) => a + b, 0) < 6 || Math.max(...hm.flat()) < 2 || new Set(hm.flat()).size < 3);
  const total = hm.flat().reduce((a, b) => a + b, 0); const H = Math.max(...hm.flat());
  const colMax = [0, 1, 2].map((x) => Math.max(hm[0][x], hm[1][x], hm[2][x])), rowMax = [2, 1, 0].map((y) => Math.max(...hm[y]));
  const up = (cols) => Array.from({ length: H }, (_, i) => cols.map((c) => c >= H - i));
  const views = { vorne: up(colMax), rechts: up(rowMax), links: up(rowMax.slice().reverse()), oben: hm.map((row) => row.map((v) => v > 0)) };
  const ask = r.pick(['vorne', 'rechts', 'oben']); const opts = []; const seen = new Set();
  const add = (g) => { const k = JSON.stringify(g); if (seen.has(k)) return; seen.add(k); opts.push(g); };
  add(views[ask]); ['vorne', 'rechts', 'links', 'oben'].forEach((k) => add(views[k]));
  let guard = 0; while (opts.length < 4 && guard++ < 50) { const g = views[ask].map((row) => row.slice()); const y = r.int(0, g.length - 1), x = r.int(0, 2); g[y][x] = !g[y][x]; add(g); }
  const order = r.shuffle(opts.slice(0, 4)); const key = JSON.stringify(views[ask]);
  return { html: `Das Gebäude besteht aus gleich grossen Würfeln. Jeder Würfel liegt auf dem Boden oder auf einem anderen Würfel. Es gibt keine versteckten Lücken.`, fig: cubes(hm), fields: [nf('a', total, 'a) Aus wie vielen Würfeln besteht das Gebäude?'), { id: 'b', type: 'mc', label: `b) Welches Bild zeigt die Ansicht von <b>${ask}</b>?`, options: order.map((g) => viewGrid(g)), answer: order.findIndex((g) => JSON.stringify(g) === key) }],
    solution: steps([`a) Turm für Turm zählen (von hinten nach vorne, Reihe für Reihe): ${hm.map((row) => row.join(' + ')).join(' + ')} = ${total}`, `b) Ansicht von ${ask}: ${ask === 'oben' ? 'Ein Feld ist ausgefüllt, wenn dort mindestens 1 Würfel steht.' : 'In jeder Spalte zählt der höchste Turm, der in dieser Blickrichtung steht.'}`]) };
});

// ---------- M22 Volumen und Oberfläche ----------
reg('M22.grund', { skill: 'M22', title: 'Volumen und Oberfläche', diff: 1, quick: true }, (r) => {
  const t = r.int(0, 4); const a = r.int(2, 9), b = r.int(2, 8), c = r.int(2, 7);
  if (t === 0) { const o = r.bool(); return { html: `Ein Würfel hat die Kantenlänge ${a} cm. Berechne ${o ? 'die Oberfläche' : 'das Volumen'}.`, fields: [nf('a', o ? 6 * a * a : a ** 3, null, o ? 'cm²' : 'cm³')], solution: steps([o ? m(`O = 6a^2 = 6 \\cdot ${a}^2 = ${6 * a * a}`) : m(`V = a^3 = ${a}^3 = ${a ** 3}`)]) }; }
  if (t === 1) { const o = r.bool(); return { html: `Ein Quader hat die Kanten ${a} cm, ${b} cm und ${c} cm. Berechne ${o ? 'die Oberfläche' : 'das Volumen'}.`, fields: [nf('a', o ? 2 * (a * b + a * c + b * c) : a * b * c, null, o ? 'cm²' : 'cm³')], solution: steps([o ? m(`O = 2(ab + ac + bc) = 2(${a * b} + ${a * c} + ${b * c}) = ${2 * (a * b + a * c + b * c)}`) : m(`V = a \\cdot b \\cdot c = ${a * b * c}`)]) }; }
  if (t === 2) { const h = r.int(4, 12); return { html: `Ein gerades Prisma hat als Grundfläche ein rechtwinkliges Dreieck mit den Katheten ${a + 1} cm und ${b + 2} cm. Das Prisma ist ${h} cm hoch. Berechne das Volumen.`, fields: [nf('a', (a + 1) * (b + 2) / 2 * h, 'V =', 'cm³')], solution: steps([`Grundfläche: ${m(`G = \\frac{${a + 1} \\cdot ${b + 2}}{2} = ${(a + 1) * (b + 2) / 2}`)}`, m(`V = G \\cdot h = ${(a + 1) * (b + 2) / 2} \\cdot ${h} = ${(a + 1) * (b + 2) / 2 * h}`)]) }; }
  if (t === 3) { const h = r.pick([3, 6, 9, 12]); return { html: `Eine Pyramide hat ein Rechteck mit den Seiten ${a + 2} cm und ${b + 1} cm als Grundfläche. Sie ist ${h} cm hoch. Berechne das Volumen.`, fields: [nf('a', (a + 2) * (b + 1) * h / 3, 'V =', 'cm³')], solution: steps([m(`V = \\frac{G \\cdot h}{3} = \\frac{${(a + 2) * (b + 1)} \\cdot ${h}}{3} = ${(a + 2) * (b + 1) * h / 3}`)]) }; }
  const l = r.int(3, 9), w = r.int(2, 6), h = r.int(2, 6);
  return { html: `Ein quaderförmiges Aquarium ist innen ${l} dm lang, ${w} dm breit und ${h} dm hoch. Wie viele Liter fasst es?`, fields: [nf('a', l * w * h, null, 'l')], solution: steps([m(`V = ${l} \\cdot ${w} \\cdot ${h} = ${l * w * h}`) + ' dm³', '1 dm³ = 1 l']) };
});
reg('M22.pyramidenhoehe', { skill: 'M22', title: 'Pyramide: Höhe aus dem Volumen', diff: 3, quick: true }, (r) => {
  const a = r.int(4, 30), b = r.int(3, 20), h = 3 * r.int(2, 13); const G = a * b; const V = G * h / 3;
  return { html: `Eine Pyramide hat das Volumen ${V} m³. Ihre rechteckige Grundfläche misst ${a} m mal ${b} m. Berechne die Höhe.`, fields: [nf('a', h, 'h =', 'm')], solution: steps([`Formel umstellen: ${m(`V = \\frac{G \\cdot h}{3} \\;\\Rightarrow\\; h = \\frac{3V}{G}`)}`, `${m(`G = ${a} \\cdot ${b} = ${G}`)} m²`, m(`h = \\frac{3 \\cdot ${V}}{${G}} = ${h}`)]) };
});
reg('M22.pyramide', { skill: 'M22', title: 'Pyramide mit Pythagoras', diff: 3, pts: 3 }, (r) => {
  const [p, h, hs] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [4.5, 6, 7.5]]); const a = 2 * p; const V = a * a * h / 3, O = a * a + 2 * a * hs;
  const askO = r.bool(0.4);
  return { html: `Eine gerade Pyramide hat ein Quadrat mit Seite ${a} cm als Grundfläche. Die Höhe jeder Seitenfläche (vom Fuss in der Kantenmitte bis zur Spitze) misst ${hs} cm.`, fields: [nf('a', h, 'a) Höhe der Pyramide', 'cm'), askO ? nf('b', O, 'b) Oberfläche', 'cm²', { points: 2 }) : nf('b', V, 'b) Volumen', 'cm³', { points: 2 })],
    solution: steps([`a) Rechtwinkliges Dreieck: halbe Grundkante ${p}, Körperhöhe h, Seitenflächenhöhe ${hs}. ${m(`h = \\sqrt{${hs}^2 - ${p}^2} = ${h}`)} cm`, askO ? `b) Grundfläche ${m(`${a}^2 = ${a * a}`)}; 4 Dreiecke je ${m(`\\frac{${a} \\cdot ${hs}}{2} = ${a * hs / 2}`)}; ${m(`O = ${a * a} + 4 \\cdot ${a * hs / 2} = ${O}`)} cm²` : `b) ${m(`V = \\frac{G \\cdot h}{3} = \\frac{${a * a} \\cdot ${h}}{3} = ${V}`)} cm³`]) };
});
reg('M22.zelt', { skill: 'M22', title: 'Zelt als Prisma', diff: 3, pts: 3 }, (r) => {
  const [p, h, s] = r.pick([[1.5, 2, 2.5], [3, 4, 5], [0.9, 1.2, 1.5], [1.2, 1.6, 2], [2.5, 6, 6.5]]); const b = 2 * p, l = r.pick([2, 2.5, 3, 4, 5]); const V = b * h / 2 * l;
  const body = poly([[40, 130], [140, 130], [90, 50]], 'fg-shape grey') + poly([[140, 130], [250, 100], [200, 20], [90, 50]], 'fg-shape') + line(90, 50, 90, 130, 'fg-dash') + text(90, 146, b + ' m') + text(204, 128, l + ' m') + text(98, 100, h + ' m', 'fg-text', 'start') + text(54, 86, 'x', 'fg-text bold');
  return { html: 'Ein Zelt hat die Form eines liegenden Prismas. Die Vorderseite ist ein gleichschenkliges Dreieck.' + NS, fig: svg(280, 160, body, 'Zelt'), fields: [nf('a', s, 'a) Länge x der schrägen Kante', 'm'), nf('b', r2(V), 'b) Volumen des Zelts', 'm³', { points: 2, tol: 0.006 })],
    solution: steps([`a) Die Höhe halbiert die Bodenbreite: Katheten ${p} m und ${h} m. ${m(`x = \\sqrt{${p}^2 + ${h}^2} = ${s}`)} m`, `b) Grundfläche = Dreieck: ${m(`G = \\frac{${b} \\cdot ${h}}{2} = ${r2(b * h / 2)}`)} m²`, m(`V = G \\cdot l = ${r2(b * h / 2)} \\cdot ${l} = ${r2(V)}`) + ' m³']) };
});
reg('M22.wasser', { skill: 'M22', title: 'Wasser im Quader', diff: 3, pts: 2 }, (r) => {
  const l = r.int(4, 10), w = r.int(3, 6), h = r.int(4, 8), p = r.pick([25, 40, 50, 60, 75, 80]); const lit = l * w * h * p / 100;
  if (r.bool()) return { html: `Ein quaderförmiger Tank ist innen ${l} dm lang, ${w} dm breit und ${h} dm hoch. Er ist zu ${p} % gefüllt. Wie viele Liter Wasser sind im Tank?`, fields: [nf('a', lit, null, 'l', { points: 2 })], solution: steps([`Ganzes Volumen: ${m(`${l} \\cdot ${w} \\cdot ${h} = ${l * w * h}`)} dm³ = ${l * w * h} l`, `${p} % davon: ${m(`${l * w * h} \\cdot ${p / 100} = ${lit}`)} l`]) };
  const V = l * w * r.int(1, h - 1);
  return { html: `In einen leeren quaderförmigen Tank (innen ${l} dm lang, ${w} dm breit, ${h} dm hoch) giesst man ${V} Liter Wasser. Wie hoch steht das Wasser?`, fields: [nf('a', V / (l * w), null, 'dm', { points: 2 })], solution: steps([`${V} l = ${V} dm³`, `Grundfläche: ${m(`${l} \\cdot ${w} = ${l * w}`)} dm²`, `Höhe: ${m(`${V} : ${l * w} = ${V / (l * w)}`)} dm`]) };
});

// ---------- M23 Taschenrechner, M24 Lösungsweg ----------
reg('M23.rechner', { skill: 'M23', title: 'Mit dem Taschenrechner', diff: 2, quick: true }, (r) => {
  const a = r.pick([3.7, 4.2, 5.6, 6.3, 7.9]), b = r.pick([1.9, 2.4, 0.8, 1.3]), c = r.pick([4.2, 3.1, 2.6]), d = r.pick([18.49, 7.29, 12.25, 30.25]), e = r.pick([0.6, 1.4, 2.5]); const t = r.int(0, 2);
  const plain = t === 0 ? `(${a}^2-${b}*${c})/(sqrt(${d})+${e})` : t === 1 ? `sqrt(${a}^2+${c}^2)/${b}` : `(${a}+${b})/(${c}-${e})*${d}`;
  const v = evaluate(parse(plain), {});
  return { html: `Berechne mit dem Taschenrechner und runde auf 2 Dezimalen: ${m(texOf(plain))}`, fields: [{ id: 'a', type: 'num', label: 'Resultat', answer: r2(v), tol: 0.006, show: r2(v).toFixed(2) }], solution: steps(['Zähler und Nenner eines Bruchs beim Eintippen in Klammern setzen.', 'Erst am Schluss runden.', m(`\\approx ${r2(v).toFixed(2)}`)]) };
});
const M24Q = [
  ['In der Prüfung stehen bei einer Aufgabe zwei verschiedene Resultate von dir im Heft, eines davon ist falsch. Was passiert?', ['Mindestens 1 Punkt Abzug', 'Das richtige Resultat zählt', 'Das zuerst geschriebene zählt'], 0, 'Mehrere Lösungen, darunter eine falsche: mindestens 1 Punkt Abzug. Was nicht zählen soll, durchstreichen.'],
  ['Du findest das richtige Resultat, schreibst aber keinen Lösungsweg hin (Aufgabe 2–10). Was gilt?', ['Keine volle Punktzahl', 'Volle Punktzahl', 'Immer 0 Punkte'], 0, 'Der Lösungsweg muss sichtbar sein, sonst gibt es keine volle Punktzahl (ausser es steht etwas anderes).'],
  ['Bei Aufgabe 1 (Kurzaufgaben) schreibst du nur das richtige Resultat hin. Was gilt?', ['Der Punkt zählt', 'Kein Punkt ohne Weg', 'Halber Punkt'], 0, 'Bei den Kurzaufgaben gibt es 0 oder 1 Punkt. Der Punkt gilt auch ohne Lösungsweg.'],
  ['Bei einer Textgleichung ist x als «Anzahl Erwachsene» vorgegeben. Du nimmst x für die Anzahl Kinder und stellst eine dazu passende Gleichung auf. Was gilt?', ['0 Punkte', '1 Punkt, weil die Gleichung stimmt', 'Halber Punkt'], 0, 'Die Variable muss genau wie vorgegeben verwendet werden, sonst 0 Punkte.'],
  ['Du vergisst bei einem Resultat die Einheit cm. Was gilt in der Regel?', ['Kein Abzug, ausser es ist vermerkt', 'Immer 1 Punkt Abzug', '0 Punkte'], 0, 'Kein Abzug für vergessene Einheiten, Rundungsfehler oder fehlenden Antwortsatz, ausser es ist vermerkt.'],
  ['Wohin gehören Zwischenrechnungen und Skizzen?', ['Ins Prüfungsheft', 'Auf eigenes Notizpapier', 'Auf die Tischplatte'], 0, 'Eigenes Papier ist verboten. Alles gehört ins Prüfungsheft.'],
  ['Bei einer Konstruktion fehlt der Zirkelbogen, die Figur stimmt aber. Was gilt?', ['Kein Punkt', 'Voller Punkt', 'Halber Punkt'], 0, 'Bei Konstruktionen muss der Zirkelbogen sichtbar sein.'],
  ['Du löst eine 3-Punkte-Aufgabe nur zur Hälfte richtig, der Weg ist sichtbar. Was gilt?', ['Teilpunkte sind möglich', '0 Punkte', 'Volle Punktzahl'], 0, 'Für richtige Teilschritte gibt es Teilpunkte. Darum: Weg immer zeigen.'],
  ['Welches Gerät darfst du an der Prüfung 2027 benutzen?', ['Einen der 4 erlaubten Rechner, z. B. TI-30X IIS', 'Jeden Taschenrechner', 'Das Handy im Flugmodus'], 0, 'Erlaubt: TI-30 ECO RS, TI-30X IIS, CASIO FX-82 SOLAR II, SHARP EL-501 T. Andere werden eingezogen.'],
  ['Wie viel Zeit ist für 1 Punkt etwa eingeplant (90 Min., 37 Punkte)?', ['Etwa 2.4 Minuten', 'Etwa 1 Minute', 'Etwa 5 Minuten'], 0, '90 Min. geteilt durch 37 Punkte sind etwa 2.4 Min. pro Punkt.']
];
reg('M24.regeln', { skill: 'M24', title: 'Regeln der Mathe-Prüfung', diff: 1, quick: true }, (r) => { const q = r.pick(M24Q); const order = r.shuffle([0, 1, 2]);
  return { html: q[0], fields: [{ id: 'a', type: 'mc', options: order.map((i) => q[1][i]), answer: order.indexOf(q[2]) }], solution: steps([q[3]]) }; });
