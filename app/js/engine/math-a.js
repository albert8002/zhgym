// Mathematik-Generatoren M1–M9: Zahlen, Terme, Gleichungen, Figurenfolgen.
import { reg, m, mt, eqt, pm, co, L, steps, fr, ft, sumStr, mono, pfTex, coprime, Frac, gcd, texOf, NAMES_F, NAMES_M } from './gen-core.js';
import { lcm } from '../util.js';
import { evaluate, parse } from './expr.js';
import { svg, line, dot, rect } from './svg.js';

const fracField = (id, f, label) => ({ id, type: 'num', label: label || 'Resultat', answer: f.val, show: f.toString(), tol: 1e-9 });
// Echter Bruch in gekürzter Form (kein ganzer Wert)
function rfrac(r, dens, maxNum) { let n, d; do { d = r.pick(dens); n = r.int(1, maxNum || d - 1); } while (gcd(n, d) !== 1 || n === d); return fr(n, d); }
const intField = (id, v, label, unit) => ({ id, type: 'num', label: label || 'Resultat', answer: v, unit: unit || null });

// ---------- M1 Rechenregeln und Brüche ----------
reg('M1.punktstrich', { skill: 'M1', title: 'Punkt vor Strich, Klammern', diff: 1, quick: true }, (r) => {
  const t = r.int(0, 3); let plain, st;
  const a = r.int(8, 40), b = r.int(2, 7), c = r.int(2, 9), d = r.int(2, 12), e = r.int(2, 6);
  if (t === 0) { plain = `${a}-${b}*(${c}-${d})`; st = [`Klammer zuerst: ${m(`${c}-${d}=${c - d}`)}`, `Punkt vor Strich: ${m(`${b}\\cdot(${c - d})=${b * (c - d)}`)}`, m(`${a}-(${b * (c - d)})=${a - b * (c - d)}`)]; }
  else if (t === 1) { plain = `(${a}+${b})*${c}-${d}*${e}`; st = [`Klammer: ${m(`${a}+${b}=${a + b}`)}`, `Produkte: ${m(`${a + b}\\cdot ${c}=${(a + b) * c}`)} und ${m(`${d}\\cdot ${e}=${d * e}`)}`, m(`${(a + b) * c}-${d * e}=${(a + b) * c - d * e}`)]; }
  else if (t === 2) { plain = `${a}-(${d}-${b}*${c})`; st = [`In der Klammer Punkt vor Strich: ${m(`${b}\\cdot ${c}=${b * c}`)}`, `Klammer: ${m(`${d}-${b * c}=${d - b * c}`)}`, m(`${a}-(${d - b * c})=${a - (d - b * c)}`)]; }
  else { const k = d * e; plain = `-${b}*(${c}-${d})+${k}/${e}`; st = [`Klammer: ${m(`${c}-${d}=${c - d}`)}`, `Punktrechnungen: ${m(`-${b}\\cdot(${c - d})=${-b * (c - d)}`)} und ${m(`${k}:${e}=${d}`)}`, m(`${-b * (c - d)}+${d}=${-b * (c - d) + d}`)]; }
  const val = evaluate(parse(plain), {});
  const shown = texOf(plain).replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1:$2');
  return { html: `Berechne ohne Taschenrechner: ${m(shown)}`, fields: [intField('a', val)], solution: steps(st) };
});

reg('M1.bruchsumme', { skill: 'M1', title: 'Brüche addieren und subtrahieren', diff: 2, quick: true }, (r) => {
  const dens = [2, 3, 4, 5, 6, 8, 9, 10, 12]; let b, d;
  do { b = r.pick(dens); d = r.pick(dens); } while (b === d);
  const a = r.int(1, b - 1) + (r.bool(0.25) ? b : 0), c = r.int(1, d - 1); const minus = r.bool();
  const A = fr(a, b), C = fr(c, d), R = minus ? A.sub(C) : A.add(C); const H = lcm(A.d, C.d);
  return { html: `Berechne und kürze: ${m(`${A.tex()} ${minus ? '-' : '+'} ${C.tex()}`)}`, fields: [fracField('a', R)],
    solution: steps([`Hauptnenner (kgV von ${A.d} und ${C.d}): ${H}`, `Erweitern: ${m(`\\frac{${A.n * H / A.d}}{${H}} ${minus ? '-' : '+'} \\frac{${C.n * H / C.d}}{${H}} = \\frac{${A.n * H / A.d + (minus ? -1 : 1) * C.n * H / C.d}}{${H}}`)}`, `Kürzen: ${ft(R)}`]) };
});

reg('M1.bruchprodukt', { skill: 'M1', title: 'Brüche multiplizieren und dividieren', diff: 2, quick: true }, (r) => {
  const DD = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]; const A = rfrac(r, DD, 9), C = rfrac(r, DD, 9); const div = r.bool();
  const R = div ? A.div(C) : A.mul(C);
  return { html: `Berechne und kürze: ${m(`${A.tex()} ${div ? ':' : '\\cdot'} ${C.tex()}`)}`, fields: [fracField('a', R)],
    solution: steps([div ? `Dividieren heisst: mit dem Kehrwert multiplizieren: ${m(`${A.tex()} \\cdot \\frac{${C.d}}{${C.n}}`)}` : 'Zähler mal Zähler, Nenner mal Nenner.', `${m(`\\frac{${A.n * (div ? C.d : C.n)}}{${A.d * (div ? C.n : C.d)}}`)} kürzen: ${ft(R)}`]) };
});

reg('M1.bruchmix', { skill: 'M1', title: 'Brüche: Punkt vor Strich', diff: 3 }, (r) => {
  let A, B, C; do { A = rfrac(r, [2, 3, 4, 6], 5); B = rfrac(r, [2, 3, 4, 5], 5); C = rfrac(r, [2, 3, 5, 6], 4); } while (A.val === B.val);
  const t = r.int(0, 1);
  if (t === 0) { const P = B.mul(C), R = A.add(P);
    return { html: `Berechne und kürze: ${m(`${A.tex()} + ${B.tex()} \\cdot ${C.tex()}`)}`, fields: [fracField('a', R)], solution: steps([`Punkt vor Strich: ${m(`${B.tex()} \\cdot ${C.tex()} = ${P.tex()}`)}`, `${m(`${A.tex()} + ${P.tex()} = ${R.tex()}`)}`]) }; }
  const D = A.sub(B), R = D.div(C);
  return { html: `Berechne und kürze: ${m(`\\left(${A.tex()} - ${B.tex()}\\right) : ${C.tex()}`)}`, fields: [fracField('a', R)], solution: steps([`Klammer zuerst: ${m(`${A.tex()} - ${B.tex()} = ${D.tex()}`)}`, `Mit dem Kehrwert multiplizieren: ${m(`${D.tex()} \\cdot \\frac{${C.d}}{${C.n}} = ${R.tex()}`)}`]) };
});

// ---------- M2 Potenzen, Zehnerpotenzen, Wurzeln ----------
reg('M2.potenzwert', { skill: 'M2', title: 'Potenzen berechnen', diff: 2, quick: true }, (r) => {
  const t = r.int(0, 3);
  if (t === 0) { const B = r.pick([2, 3]), k = r.pick([1, 2, 3]), A = B * B * k, v = B * k * k;
    return { html: `Dividiere das Quadrat von ${A} durch die dritte Potenz von ${B}.`, fields: [intField('a', v)], solution: steps([m(`${A}^2 = ${A * A}`), m(`${B}^3 = ${B ** 3}`), m(`${A * A} : ${B ** 3} = ${v}`)]) }; }
  if (t === 1) { const a = r.pick([2, 3]), mm = r.int(2, 4), b = r.pick([2, 3, 5]), c = r.int(3, 7); const v = a ** mm * b ** 2 - c ** 2;
    return { html: `Berechne: ${m(`${a}^{${mm}} \\cdot ${b}^2 - ${c}^2`)}`, fields: [intField('a', v)], solution: steps([m(`${a}^{${mm}}=${a ** mm},\\; ${b}^2=${b * b},\\; ${c}^2=${c * c}`), m(`${a ** mm}\\cdot ${b * b} - ${c * c} = ${v}`)]) }; }
  if (t === 2) { const a = r.int(2, 6), b = r.int(2, 3); const v = a * a - (-(a * a)) + (-b) ** 3; // (-a)^2 - (-a^2) + (-b)^3
    return { html: `Berechne: ${m(`(-${a})^2 - (-${a}^2) + (-${b})^3`)}`, fields: [intField('a', v)], solution: steps([`${m(`(-${a})^2 = ${a * a}`)} (Klammer: das Minus wird mitquadriert)`, `${m(`-${a}^2 = -${a * a}`)} (ohne Klammer: nur ${a} wird quadriert)`, m(`(-${b})^3 = ${(-b) ** 3}`), m(`${a * a} - (-${a * a}) + (${(-b) ** 3}) = ${v}`)]) }; }
  const a = r.int(2, 4), b = r.int(6, 12); const v = b * b - a ** 3;
  return { html: `Subtrahiere die dritte Potenz von ${a} vom Quadrat von ${b}.`, fields: [intField('a', v)], solution: steps([m(`${b}^2 = ${b * b}`), m(`${a}^3 = ${a ** 3}`), m(`${b * b} - ${a ** 3} = ${v}`)]) };
});

reg('M2.regel', { skill: 'M2', title: 'Potenzregeln', diff: 2, quick: true }, (r) => {
  const v = r.pick(['x', 'a', 'y']); const t = r.int(0, 3);
  if (t === 0) { const p = r.int(3, 7), q = r.int(2, 6), k = r.int(1, Math.min(p + q - 2, 5)); const e = p + q - k;
    return { html: `Vereinfache: ${m(`${v}^{${p}} \\cdot ${v}^{${q}} : ${v}^{${k}}`)}`, fields: [{ id: 'a', type: 'expr', answer: `${v}^${e}`, vars: [v], simple: true, label: 'Resultat' }], solution: steps([`Gleiche Basis: beim Multiplizieren Exponenten addieren, beim Dividieren subtrahieren.`, m(`${v}^{${p}+${q}-${k}} = ${v}^{${e}}`)]) }; }
  if (t === 1) { const p = r.int(2, 5), q = r.int(2, 4);
    return { html: `Vereinfache: ${m(`\\left(${v}^{${p}}\\right)^{${q}}`)}`, fields: [{ id: 'a', type: 'expr', answer: `${v}^${p * q}`, vars: [v], simple: true, label: 'Resultat' }], solution: steps([`Potenz einer Potenz: Exponenten multiplizieren.`, m(`${v}^{${p}\\cdot ${q}} = ${v}^{${p * q}}`)]) }; }
  if (t === 2) { const c = r.pick([2, 3, -2, -3, 5]), p = r.int(2, 4), q = r.pick([2, 3]); const cc = c ** q;
    return { html: `Vereinfache: ${m(`\\left(${c}${v}^{${p}}\\right)^{${q}}`)}`, fields: [{ id: 'a', type: 'expr', answer: `${cc}${v}^${p * q}`, vars: [v], simple: true, label: 'Resultat' }], solution: steps([`Jeden Faktor potenzieren: ${m(`(${c})^{${q}} = ${cc}`)} und ${m(`(${v}^{${p}})^{${q}} = ${v}^{${p * q}}`)}`, m(`${cc}${v}^{${p * q}}`)]) }; }
  const p = r.int(2, 4), q = r.int(1, 3);
  return { html: `Vereinfache: ${m(`\\left(a^{${p}} b^{${q}}\\right)^2 \\cdot a`)}`, fields: [{ id: 'a', type: 'expr', answer: `a^${2 * p + 1}*b^${2 * q}`, vars: ['a', 'b'], simple: true, label: 'Resultat' }], solution: steps([m(`(a^{${p}} b^{${q}})^2 = a^{${2 * p}} b^{${2 * q}}`), m(`a^{${2 * p}} \\cdot a = a^{${2 * p + 1}}`), m(`a^{${2 * p + 1}} b^{${2 * q}}`)]) };
});

reg('M2.zehner', { skill: 'M2', title: 'Zehnerpotenzen', diff: 2, quick: true }, (r) => {
  const t = r.int(0, 2); const a = r.pick([1.2, 2.5, 3.4, 4.5, 6.8, 7.2, 9.1]), n = r.int(3, 7);
  const big = Math.round(a * 10 ** n);
  const sp = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  if (t === 0) return { html: `Schreibe als gewöhnliche Zahl: ${m(`${a} \\cdot 10^{${n}}`)}`, fields: [intField('a', big)], solution: steps([`Mal ${m(`10^{${n}}`)} heisst: Komma um ${n} Stellen nach rechts.`, m(sp(big))]) };
  if (t === 1) return { html: `${m(`${sp(big)} = ${a} \\cdot 10^{n}`)}. Bestimme ${m('n')}.`, fields: [intField('a', n, 'n =')], solution: steps([`Das Komma wandert von ${a} um ${n} Stellen nach rechts.`, m(`n = ${n}`)]) };
  const b = r.int(2, 4), c = r.int(2, 3), p = r.int(2, 5), q = r.int(2, 5);
  return { html: `${m(`(${b} \\cdot 10^{${p}}) \\cdot (${c} \\cdot 10^{${q}}) = ${b * c} \\cdot 10^{n}`)}. Bestimme ${m('n')}.`, fields: [intField('a', p + q, 'n =')], solution: steps([`Zahlen multiplizieren: ${m(`${b}\\cdot ${c}=${b * c}`)}`, `Zehnerpotenzen: Exponenten addieren: ${m(`10^{${p}+${q}} = 10^{${p + q}}`)}`]) };
});

reg('M2.wurzel', { skill: 'M2', title: 'Quadratwurzeln', diff: 2, quick: true }, (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const pool = [[121, 11], [144, 12], [169, 13], [196, 14], [225, 15], [256, 16], [289, 17], [324, 18], [361, 19], [400, 20], [0.25, 0.5], [1.44, 1.2], [0.81, 0.9], [2.25, 1.5], [6.25, 2.5]]; const [a, b] = r.pick(pool);
    return { html: `Berechne ohne Taschenrechner: ${m(`\\sqrt{${a}}`)}`, fields: [intField('a', b)], solution: steps([`Gesucht ist die positive Zahl, die mit sich selbst multipliziert ${a} ergibt.`, m(`${b} \\cdot ${b} = ${a}`)]) }; }
  if (t === 1) { const [a, b, c] = r.pick([[3, 27, 9], [2, 8, 4], [5, 20, 10], [12, 3, 6], [2, 50, 10], [6, 24, 12], [3, 12, 6], [8, 18, 12], [7, 28, 14], [10, 40, 20], [2, 32, 8], [5, 45, 15]]);
    return { html: `Berechne ohne Taschenrechner: ${m(`\\sqrt{${a}} \\cdot \\sqrt{${b}}`)}`, fields: [intField('a', c)], solution: steps([`Unter eine Wurzel schreiben: ${m(`\\sqrt{${a}\\cdot ${b}} = \\sqrt{${a * b}}`)}`, m(`\\sqrt{${a * b}} = ${c}`)]) }; }
  const k = r.int(2, 7), q = r.pick([2, 3, 5, 6, 7, 10]); const N = k * k * q;
  return { html: `Ziehe teilweise die Wurzel: ${m(`\\sqrt{${N}} = a \\cdot \\sqrt{b}`)} mit möglichst kleinem ${m('b')}.`, fields: [intField('a', k, 'a ='), intField('b', q, 'b =')], solution: steps([`Grösste Quadratzahl als Faktor suchen: ${m(`${N} = ${k * k} \\cdot ${q}`)}`, m(`\\sqrt{${k * k}\\cdot ${q}} = ${k}\\sqrt{${q}}`)]) };
});

// ---------- M3 Teiler, ggT, kgV ----------
function ggtPair(r, maxG = 12) { let g, u, v; do { g = r.int(2, maxG); u = r.int(2, 9); v = r.int(2, 9); } while (u === v || !coprime(u, v)); return [g * u, g * v, g]; }
reg('M3.ggt', { skill: 'M3', title: 'ggT bestimmen', diff: 1, quick: true }, (r) => { const [a, b, g] = ggtPair(r, 14);
  return { html: `Bestimme den grössten gemeinsamen Teiler (ggT) von ${a} und ${b}.`, fields: [intField('a', g, 'ggT =')], solution: steps([`Primfaktoren: ${m(`${a} = ${pfTex(a)}`)} und ${m(`${b} = ${pfTex(b)}`)}`, `Gemeinsame Faktoren multiplizieren: ggT = ${g}`]) }; });
reg('M3.kgv', { skill: 'M3', title: 'kgV bestimmen', diff: 1, quick: true }, (r) => { const [a, b] = ggtPair(r, 8); const k = lcm(a, b);
  return { html: `Bestimme das kleinste gemeinsame Vielfache (kgV) von ${a} und ${b}.`, fields: [intField('a', k, 'kgV =')], solution: steps([`Primfaktoren: ${m(`${a} = ${pfTex(a)}`)} und ${m(`${b} = ${pfTex(b)}`)}`, `Jeden Primfaktor mit der höchsten Potenz nehmen: kgV = ${m(pfTex(k))} = ${k}`]) }; });
reg('M3.primfaktoren', { skill: 'M3', title: 'Primfaktorzerlegung', diff: 2, quick: true }, (r) => {
  let n; do { n = 2 ** r.int(0, 4) * 3 ** r.int(0, 3) * 5 ** r.int(0, 2) * 7 ** r.int(0, 1); } while (n < 24 || n > 1200);
  return { html: `Zerlege ${n} in Primfaktoren. Schreibe gleiche Faktoren als Potenz, zum Beispiel <code>2^3*5</code>.`, fields: [{ id: 'a', type: 'pf', answer: n, label: `${n} =`, show: pfTex(n) }], solution: steps([`Immer wieder durch die kleinste mögliche Primzahl teilen.`, m(`${n} = ${pfTex(n)}`)]) }; });
reg('M3.sach', { skill: 'M3', title: 'ggT und kgV im Alltag', diff: 3 }, (r) => {
  const t = r.int(0, 4);
  if (t === 0) { let a, b; do { a = r.pick([8, 9, 10, 12, 14, 15, 16, 18]); b = r.pick([10, 12, 15, 16, 18, 20, 21, 24]); } while (a >= b || b % a === 0); const k = lcm(a, b);
    return { html: `Zwei Zahnräder greifen ineinander. Das linke hat ${a} Zähne, das rechte ${b} Zähne. Wie viele ganze Umdrehungen macht das <b>linke</b> Zahnrad, bis beide zum ersten Mal wieder in der Startstellung stehen?`, fields: [intField('a', k / a, 'Umdrehungen')],
      solution: steps([`Startstellung wieder erreicht, wenn die Zahl der bewegten Zähne ein Vielfaches von ${a} und von ${b} ist.`, `kgV(${a}, ${b}) = ${k} Zähne`, `Linkes Rad: ${m(`${k} : ${a} = ${k / a}`)} Umdrehungen`]) }; }
  if (t === 1) { let a, b; do { a = r.pick([6, 8, 9, 10, 12, 15]); b = r.pick([10, 12, 14, 15, 18, 20, 25]); } while (a >= b || b % a === 0); const k = lcm(a, b);
    return { html: `Die Buslinie A fährt alle ${a} Minuten, die Linie B alle ${b} Minuten. Um 7.00 Uhr fahren beide gleichzeitig ab. Nach wie vielen Minuten fahren sie zum ersten Mal wieder gleichzeitig ab?`, fields: [intField('a', k, 'Zeit', 'Min.')], solution: steps([`Gesucht: kleinste Zahl, die Vielfaches von ${a} und von ${b} ist.`, `kgV(${a}, ${b}) = ${k} Minuten`]) }; }
  if (t === 2) { const [a, b, g] = ggtPair(r, 12); const A = a * 10, B = b * 10;
    return { html: `Ein rechteckiger Boden ist ${A} cm lang und ${B} cm breit. Er wird lückenlos mit möglichst grossen quadratischen Platten belegt (alle gleich gross, keine wird zerschnitten).`, fields: [intField('a', g * 10, 'Seitenlänge einer Platte', 'cm'), intField('b', (a / g) * (b / g), 'Anzahl Platten')],
      solution: steps([`Die Seitenlänge muss ${A} und ${B} teilen und möglichst gross sein: ggT.`, `ggT(${A}, ${B}) = ${g * 10} cm`, `Anzahl: ${m(`\\frac{${A}}{${g * 10}} \\cdot \\frac{${B}}{${g * 10}} = ${a / g} \\cdot ${b / g} = ${(a / g) * (b / g)}`)}`]) }; }
  if (t === 3) { const [a, b, g] = ggtPair(r, 12);
    return { html: `Eine Gärtnerin hat ${a} Rosen und ${b} Tulpen. Sie bindet möglichst viele gleiche Sträusse. Alle Blumen werden gebraucht. Wie viele Sträusse gibt es?`, fields: [intField('a', g, 'Anzahl Sträusse')], solution: steps([`Die Anzahl Sträusse muss ${a} und ${b} teilen und möglichst gross sein.`, `ggT(${a}, ${b}) = ${g}`, `Pro Strauss: ${a / g} Rosen und ${b / g} Tulpen.`]) }; }
  let a, b; do { a = r.pick([6, 8, 9, 12, 15]); b = r.pick([10, 14, 16, 18, 20]); } while (b % a === 0); const k = lcm(a, b);
  return { html: `Aus Klötzen der Höhe ${a} cm baut ${r.pick(NAMES_F)} einen Turm. Aus Klötzen der Höhe ${b} cm baut ${r.pick(NAMES_M)} einen zweiten Turm. Bei welcher kleinsten Höhe sind beide Türme genau gleich hoch?`, fields: [intField('a', k, 'Höhe', 'cm')], solution: steps([`Die Höhe ist ein Vielfaches von ${a} und von ${b}.`, `kgV(${a}, ${b}) = ${k} cm`]) };
});

// ---------- M4 Terme ----------
reg('M4.vereinfachen', { skill: 'M4', title: 'Terme vereinfachen', diff: 2, quick: true }, (r) => {
  const t = r.int(0, 3);
  if (t === 0) { let p, q, k, a, b; do { p = r.nz(-6, 9); q = r.nz(-6, 9); k = r.int(2, 5); a = r.int(1, 4); b = r.int(1, 5); } while (p - k * a === 0 && q + k * b === 0);
    const plain = `${sumStr([{ c: p, v: 'x' }, { c: q, v: 'y' }])}-${k}(${sumStr([{ c: a, v: 'x' }, { c: -b, v: 'y' }])})`;
    const ans = sumStr([{ c: p - k * a, v: 'x' }, { c: q + k * b, v: 'y' }]);
    return { html: `Vereinfache so weit wie möglich: ${mt(plain)}`, fields: [{ id: 'a', type: 'expr', answer: ans, vars: ['x', 'y'], simple: true, label: 'Resultat' }], solution: steps([`Klammer auflösen (Minus vor der Klammer dreht die Vorzeichen): ${mt(sumStr([{ c: p, v: 'x' }, { c: q, v: 'y' }, { c: -k * a, v: 'x' }, { c: k * b, v: 'y' }]))}`, `Gleiche Glieder zusammenfassen: ${mt(ans)}`]) }; }
  if (t === 1) { const a = r.int(2, 5), b = r.int(2, 6), c = r.int(1, 9), d = r.int(1, 6); const s = a * b - c + d;
    if (s === 0) return GENSAFE(r);
    return { html: `Vereinfache so weit wie möglich: ${m(`${a}x \\cdot ${b}y - ${c}xy + ${d === 1 ? '' : d}yx`)}`, fields: [{ id: 'a', type: 'expr', answer: `${co(s, 'x')}y`, vars: ['x', 'y'], simple: true, label: 'Resultat' }], solution: steps([`Produkt: ${m(`${a}x \\cdot ${b}y = ${a * b}xy`)}`, `${m('yx = xy')}, also gleiche Glieder: ${m(`${a * b}xy - ${c}xy + ${d}xy = ${co(s, 'x')}y`)}`]) }; }
  if (t === 2) { let a, b, c, d; do { a = r.int(2, 6); b = r.nz(-7, 7); c = r.int(1, 6); d = r.nz(-6, 6); } while (a === c || b + d === 0);
    const plain = `x(${L(a, b)})-${co(c, 'x')}^2${pm(d)}x`.replace(/([+-])1x$/, '$1x');
    const ans = `${co(a - c, 'x')}^2${b + d < 0 ? '-' : '+'}${co(Math.abs(b + d), 'x')}`;
    return { html: `Vereinfache so weit wie möglich: ${mt(plain)}`, fields: [{ id: 'a', type: 'expr', answer: ans, vars: ['x'], simple: true, label: 'Resultat' }], solution: steps([`Ausmultiplizieren: ${mt(`${co(a, 'x')}^2${b < 0 ? '-' : '+'}${co(Math.abs(b), 'x')}`)}`, `Zusammenfassen: ${m('x^2')}-Glieder ${m(`${a}-${c}=${a - c}`)}, ${m('x')}-Glieder ${m(`${b}${pm(d)}=${b + d}`)}`, mt(ans)]) }; }
  const g = r.int(2, 6), u = r.int(2, 6), w = r.int(1, 7);
  return { html: `Vereinfache so weit wie möglich: ${m(`(${g * u}xy - ${g * w}x) : (${g}x)`)}`, fields: [{ id: 'a', type: 'expr', answer: `${u}y-${w}`, vars: ['x', 'y'], simple: true, label: 'Resultat' }], solution: steps([`Jedes Glied der Klammer durch ${m(`${g}x`)} teilen.`, `${m(`${g * u}xy : ${g}x = ${u}y`)} und ${m(`${g * w}x : ${g}x = ${w}`)}`, m(`${u}y - ${w}`)]) };
});
function GENSAFE(r) { const a = r.int(2, 6), b = r.int(2, 6); return { html: `Vereinfache so weit wie möglich: ${m(`${a}x \\cdot ${b}y`)}`, fields: [{ id: 'a', type: 'expr', answer: `${a * b}xy`, vars: ['x', 'y'], simple: true, label: 'Resultat' }], solution: steps([m(`${a}\\cdot ${b} = ${a * b}`), m(`${a * b}xy`)]) }; }

reg('M4.ausmultiplizieren', { skill: 'M4', title: 'Ausmultiplizieren', diff: 1, quick: true }, (r) => {
  const k = r.nz(-6, 7), a = r.int(1, 6), b = r.nz(-8, 8); const withX = r.bool();
  if (k === 1) return GENSAFE(r);
  const head = withX ? co(k, 'x') : (k === -1 ? '-' : String(k));
  const plain = `${head}(${sumStr([{ c: a, v: 'x' }, { c: b, v: withX ? 'y' : '' }])})`;
  const ans = withX ? `${co(k * a, 'x')}^2${k * b < 0 ? '-' : '+'}${co(Math.abs(k * b), 'x')}y` : sumStr([{ c: k * a, v: 'x' }, { c: k * b, v: '' }]);
  return { html: `Multipliziere aus: ${mt(plain)}`, fields: [{ id: 'a', type: 'expr', answer: ans, vars: ['x', 'y'], noGroup: true, label: 'Resultat' }], solution: steps([`Jedes Glied in der Klammer mit ${mt(head)} multiplizieren. Auf die Vorzeichen achten.`, mt(ans)]) };
});

reg('M4.ausklammern', { skill: 'M4', title: 'Ausklammern', diff: 2, quick: true }, (r) => {
  let g, u, w; do { g = r.int(2, 9); u = r.int(1, 7); w = r.int(1, 7); } while (!coprime(u, w));
  const neg = r.bool(); const t = r.int(0, 2); let expd, fac, inner;
  if (t === 0) { expd = `${g * u}ab${neg ? '-' : '+'}${g * w}a^2`; fac = `${g}a`; inner = `${co(u, 'b')}${neg ? '-' : '+'}${co(w, 'a')}`; }
  else if (t === 1) { expd = `${g * u}x^2${neg ? '-' : '+'}${g * w}x`; fac = `${g}x`; inner = `${co(u, 'x')}${neg ? '-' : '+'}${w}`; }
  else { expd = `${g * u}x^2y${neg ? '-' : '+'}${g * w}xy^2`; fac = `${g}xy`; inner = `${co(u, 'x')}${neg ? '-' : '+'}${co(w, 'y')}`; }
  const askInner = r.bool();
  return { html: `Klammere so viel wie möglich aus: ${mt(expd)} ${m('=')} ` + (askInner ? `${mt(fac)} ${m('\\cdot\\,(\\;?\\;)')}. Gib den Term in der Klammer an.` : `${m('?\\;\\cdot')} ${m('\\left(' + texOf(inner) + '\\right)')}. Gib den Faktor vor der Klammer an.`),
    fields: [{ id: 'a', type: 'expr', answer: askInner ? inner : fac, vars: ['a', 'b', 'x', 'y'], simple: true, label: askInner ? 'Klammer' : 'Faktor' }],
    solution: steps([`Grösster gemeinsamer Faktor der Zahlen: ggT(${g * u}, ${g * w}) = ${g}`, `Gemeinsame Variablen mit der kleinsten Potenz: ${mt(fac.replace(/^\d+/, ''))}`, `${mt(expd)} ${m('=')} ${m(texOf(fac) + '\\left(' + texOf(inner) + '\\right)')}`]) };
});

reg('M4.einsetzen', { skill: 'M4', title: 'Werte einsetzen', diff: 1, quick: true }, (r) => {
  const a = r.int(2, 5), b = r.int(1, 4), x = r.nz(-4, 5), y = r.nz(-5, 5); const t = r.int(0, 1);
  const plain = t === 0 ? `${a}x^2-${co(b, 'x')}y+y` : `${a}(x-y)^2-${co(b, 'x')}`;
  const val = evaluate(parse(plain), { x, y });
  return { html: `Berechne den Wert des Terms ${mt(plain)} für ${m(`x = ${x}`)} und ${m(`y = ${y}`)}.`, fields: [intField('a', val)],
    solution: steps([`Negative Zahlen beim Einsetzen in Klammern schreiben.`, t === 0 ? m(`${a}\\cdot(${x})^2 - ${b}\\cdot(${x})\\cdot(${y}) + (${y}) = ${a * x * x} - (${b * x * y}) + (${y}) = ${val}`) : m(`${a}\\cdot(${x}-(${y}))^2 - ${b}\\cdot(${x}) = ${a}\\cdot ${(x - y) ** 2} - (${b * x}) = ${val}`)]) };
});

reg('M4.termT', { skill: 'M4', title: 'Term bestimmen', diff: 3, quick: true }, (r) => {
  const a = r.int(2, 7), b = r.nz(-8, 8), c = r.nz(-5, 5), d = r.nz(-9, 9); const t = r.int(0, 2);
  let q, ansA, ansB, st;
  if (t === 0) { q = `T-(${L(a, b)})=${L(c, d)}`; ansA = c + a; ansB = d + b; st = `Auf beiden Seiten ${m('(' + texOf(L(a, b)) + ')')} addieren: ${m('T = ' + texOf(L(c, d)) + ' + (' + texOf(L(a, b)) + ')')}`; }
  else if (t === 1) { q = `T+(${L(a, b)})=${L(c, d)}`; ansA = c - a; ansB = d - b; st = `Auf beiden Seiten ${m('(' + texOf(L(a, b)) + ')')} subtrahieren: ${m('T = ' + texOf(L(c, d)) + ' - (' + texOf(L(a, b)) + ')')}`; }
  else { q = `(${L(a, b)})-T=${L(c, d)}`; ansA = a - c; ansB = b - d; st = `Umstellen: ${m('T = (' + texOf(L(a, b)) + ') - (' + texOf(L(c, d)) + ')')}`; }
  if (ansA === 0 && ansB === 0) ansB = 0;
  const ans = L(ansA, ansB);
  const [l, rr] = q.split('=');
  return { html: `Bestimme den Term ${m('T')}: ${m(texOf(l) + ' = ' + texOf(rr))}`, fields: [{ id: 'a', type: 'expr', answer: ans, vars: ['x'], simple: true, label: 'T =' }], solution: steps([st, `Klammern auflösen und zusammenfassen: ${m('T = ' + texOf(ans))}`]) };
});

// ---------- M5 Bruchterme und Wurzelterme ----------
function randMonoFrac(r) { // Bruchterm mit kleinen Exponenten
  let g, u, v; do { g = r.int(2, 6); u = r.int(1, 7); v = r.int(2, 7); } while (!coprime(u, v));
  const ex1 = r.int(1, 4), ex2 = r.int(1, 4), ey1 = r.int(0, 3), ey2 = r.int(0, 3);
  return { top: mono(g * u, { x: ex1, y: ey1 }), bot: mono(g * v, { x: ex2, y: ey2 }) };
}
const monoField = (M, vars = ['x', 'y']) => ({ id: 'a', type: 'expr', answer: M.plain(), vars, simple: true, slack: 2, label: 'Resultat' });
const fracTex = (top, bot) => `\\frac{${top.tex()}}{${bot.tex()}}`;

reg('M5.kuerzen', { skill: 'M5', title: 'Bruchterme kürzen', diff: 2, quick: true }, (r) => {
  let f, R; do { f = randMonoFrac(r); R = f.top.div(f.bot); } while (Object.keys(R.e).length === 0);
  return { html: `Kürze so weit wie möglich: ${m(fracTex(f.top, f.bot))}`, fields: [monoField(R)], solution: steps([`Zahlen kürzen mit dem ggT: ${m(`\\frac{${f.top.c.n}}{${f.bot.c.n}} = ${R.c.tex()}`)}`, `Gleiche Variablen kürzen: Exponenten subtrahieren.`, m(R.tex())]) };
});

reg('M5.muldiv', { skill: 'M5', title: 'Bruchterme multiplizieren und dividieren', diff: 3, pts: 2 }, (r) => {
  const pick = () => { let a, b; do { a = r.int(1, 9); b = r.int(2, 9); } while (!coprime(a, b)); return { top: mono(a, { x: r.int(0, 2), y: r.int(0, 2) }), bot: mono(b, { x: r.int(0, 2), y: r.int(0, 2) }) }; };
  let A, B, R, div, tries = 0;
  do { A = pick(); B = pick(); div = r.bool(0.6); const a = A.top.div(A.bot), b = B.top.div(B.bot); R = div ? a.div(b) : a.mul(b); tries++; }
  while ((Object.keys(R.e).length === 0 || R.c.n > 60 || R.c.d > 60 || A.top.plain() === '1' || B.top.plain() === '1') && tries < 200);
  const f = monoField(R); f.points = 2;
  return { html: `Vereinfache so weit wie möglich: ${m(fracTex(A.top, A.bot) + (div ? ' : ' : ' \\cdot ') + fracTex(B.top, B.bot))}`, fields: [f],
    solution: steps([div ? `Dividieren heisst: mit dem Kehrwert multiplizieren: ${m(fracTex(A.top, A.bot) + ' \\cdot ' + fracTex(B.bot, B.top))}` : 'Zähler mal Zähler, Nenner mal Nenner.', `Vor dem Ausrechnen kürzen (Zahlen und Variablen).`, m(R.tex())]) };
});

reg('M5.summe', { skill: 'M5', title: 'Bruchterme: Punkt vor Strich', diff: 3, pts: 2 }, (r) => {
  const M = r.pick([{ y: 1 }, { x: 1 }, { x: 1, y: 1 }]);
  const k = r.pick([fr(4, 3), fr(2, 3), fr(3, 2), fr(5, 2), fr(2, 1), fr(3, 4), fr(5, 3), fr(5, 4)]);
  const p = r.pick([fr(1, 4), fr(1, 2), fr(1, 3), fr(3, 4), fr(1, 6), fr(2, 3)]);
  let c1, c2; do { c1 = r.int(2, 9); c2 = r.pick([4, 8, 9, 10, 15, 16]); } while (!coprime(c1, c2));
  const C = mono(fr(c1, c2), { x: 1, y: -1 });       // z. B. 9x/(16y)
  const B = mono(k, M).mul(C);                          // so gewählt, dass B : C = k·M
  const A = mono(p, M); const R = mono(p.add(k), M);
  const f = monoField(R); f.points = 2;
  return { html: `Vereinfache so weit wie möglich: ${m(A.tex() + ' + ' + B.tex() + ' : ' + C.tex())}`, fields: [f],
    solution: steps([`Punkt vor Strich: zuerst die Division.`, `Mit dem Kehrwert multiplizieren und kürzen: ${m(B.tex() + ' : ' + C.tex() + ' = ' + mono(k, M).tex())}`, `Addieren (Hauptnenner ${lcm(p.d, k.d)}): ${m(A.tex() + ' + ' + mono(k, M).tex() + ' = ' + R.tex())}`]) };
});

reg('M5.addieren', { skill: 'M5', title: 'Bruchterme addieren', diff: 2 }, (r) => {
  let mm, n; do { mm = r.pick([2, 3, 4, 5, 6]); n = r.pick([2, 3, 4, 6, 8]); } while (mm === n);
  const a = r.nz(-5, 6), b = r.nz(-5, 6), minus = r.bool(); const H = lcm(mm, n);
  const ca = H / mm + (minus ? -1 : 1) * (H / n), cb = (H / mm) * a + (minus ? -1 : 1) * (H / n) * b;
  if (ca === 0) return GENSAFE(r);
  const g = gcd(gcd(ca, cb), H); const top = L(ca / g, cb / g); const ans = H / g === 1 ? top : `(${top})/${H / g}`;
  return { html: `Schreibe als einen Bruch und vereinfache: ${m(`\\frac{${texOf(L(1, a))}}{${mm}} ${minus ? '-' : '+'} \\frac{${texOf(L(1, b))}}{${n}}`)}`, fields: [{ id: 'a', type: 'expr', answer: ans, vars: ['x'], simple: true, slack: 2, label: 'Resultat' }],
    solution: steps([`Hauptnenner: kgV(${mm}, ${n}) = ${H}`, `Erweitern: ${m(`\\frac{${H / mm}(${texOf(L(1, a))}) ${minus ? '-' : '+'} ${H / n}(${texOf(L(1, b))})}{${H}}`)}`, `Zähler ausmultiplizieren und zusammenfassen: ${m(`\\frac{${texOf(L(ca, cb))}}{${H}}`)}`, g > 1 ? `Mit ${g} kürzen: ${mt(ans)}` : null]) };
});

reg('M5.wurzelterm', { skill: 'M5', title: 'Wurzelterme vereinfachen', diff: 3, pts: 2 }, (r) => {
  const p = r.int(2, 9), q = r.int(2, 7); const [u, w, rt] = r.pick([[3, 27, 9], [2, 8, 4], [5, 20, 10], [2, 18, 6], [3, 12, 6], [2, 32, 8], [5, 45, 15], [2, 50, 10]]);
  const s1 = r.bool(0.7), s2 = r.bool(0.4); // Vorzeichen der Glieder 2 und 3
  const lin = p + (s2 ? rt : -rt), quad = (s1 ? 1 : -1) * q * q;
  if (lin === 0) return GEN_WURZEL_FALLBACK(r);
  const shown = `\\sqrt{${p * p}a^2} ${s1 ? '+' : '-'} (-${q}a)^2 ${s2 ? '+' : '-'} \\sqrt{${u}a} \\cdot \\sqrt{${w}a}`;
  const ans = `${co(quad, 'a')}^2${lin < 0 ? '-' : '+'}${co(Math.abs(lin), 'a')}`;
  return { html: `Vereinfache so weit wie möglich (${m('a > 0')}): ${m(shown)}`, fields: [{ id: 'a', type: 'expr', answer: ans, vars: ['a'], simple: true, points: 2, label: 'Resultat' }],
    solution: steps([`${m(`\\sqrt{${p * p}a^2} = ${p}a`)}`, `${m(`(-${q}a)^2 = ${q * q}a^2`)}`, `${m(`\\sqrt{${u}a}\\cdot\\sqrt{${w}a} = \\sqrt{${u * w}a^2} = ${rt}a`)}`, `Einsetzen und zusammenfassen: ${mt(ans)}`]) };
});
function GEN_WURZEL_FALLBACK(r) { const k = r.int(2, 9); return { html: `Vereinfache (${m('a > 0')}): ${m(`\\sqrt{${k * k}a^2}`)}`, fields: [{ id: 'a', type: 'expr', answer: `${k}a`, vars: ['a'], simple: true, label: 'Resultat' }], solution: steps([m(`\\sqrt{${k * k}} = ${k}`), m(`\\sqrt{a^2} = a`), m(`${k}a`)]) }; }

reg('M5.wurzelsumme', { skill: 'M5', title: 'Wurzeln zusammenfassen', diff: 3 }, (r) => {
  const q = r.pick([2, 3, 5, 7]); let k1, k2; do { k1 = r.int(2, 7); k2 = r.int(2, 6); } while (k1 === k2 || Math.abs(k1 - k2) === 1);
  const minus = r.bool() && k1 > k2; const s = minus ? k1 - k2 : k1 + k2;
  return { html: `Vereinfache: ${m(`\\sqrt{${k1 * k1 * q}} ${minus ? '-' : '+'} \\sqrt{${k2 * k2 * q}}`)}. Schreibe das Resultat in der Form <code>k*sqrt(${q})</code>.`,
    fields: [{ id: 'a', type: 'expr', answer: `${s}*sqrt(${q})`, vars: [], simple: true, slack: 0, label: 'Resultat' }],
    solution: steps([`Teilweise Wurzel ziehen: ${m(`\\sqrt{${k1 * k1 * q}} = ${k1}\\sqrt{${q}}`)} und ${m(`\\sqrt{${k2 * k2 * q}} = ${k2}\\sqrt{${q}}`)}`, `Gleiche Wurzeln zusammenfassen: ${m(`${s}\\sqrt{${q}}`)}`]) };
});

// ---------- M6 Lineare Gleichungen ----------
const Lr = (p, q) => `${q}${p < 0 ? '-' : '+'}${co(Math.abs(p), 'x')}`; // Zahl zuerst: 2 - 9x
function pieceStr(p) {
  if (p.t === 'c') return String(p.v);
  if (p.t === 'x') return co(p.k, 'x');
  const inner = p.rev ? Lr(p.p, p.q) : L(p.p, p.q);
  if (p.t === 'g') return (p.k === 1 ? '' : p.k === -1 ? '-' : String(p.k)) + '(' + inner + ')';
  return (p.s < 0 ? '-' : '') + '(' + inner + ')/' + p.den; // Bruch
}
const sideStr = (ps) => ps.map((p, i) => { const s = pieceStr(p); return i === 0 || s.startsWith('-') ? s : '+' + s; }).join('');
function expandTerms(ps, H = 1) { // Glieder nach dem Auflösen der Klammern (H = Hauptnenner)
  const out = [];
  for (const p of ps) {
    if (p.t === 'c') out.push({ c: p.v * H, v: '' });
    else if (p.t === 'x') out.push({ c: p.k * H, v: 'x' });
    else { const k = p.t === 'g' ? p.k : p.s * H / p.den; const a = { c: k * p.p, v: 'x' }, b = { c: k * p.q, v: '' }; if (p.rev) out.push(b, a); else out.push(a, b); }
  }
  return out;
}
const linOf = (terms) => ({ a: terms.filter((t) => t.v).reduce((s, t) => s + t.c, 0), b: terms.filter((t) => !t.v).reduce((s, t) => s + t.c, 0) });
function eqTask(r, build, pts, intro) {
  for (let tries = 0; tries < 400; tries++) {
    const { l, rt } = build();
    const dens = [...l, ...rt].filter((p) => p.t === 'f').map((p) => p.den);
    const H = dens.reduce((a, b) => lcm(a, b), 1);
    const el = expandTerms(l, H), er = expandTerms(rt, H); const A = linOf(el), B = linOf(er);
    const ca = A.a - B.a, cb = B.b - A.b;
    if (ca === 0 || (A.a === 0 && A.b === 0) || (B.a === 0 && B.b === 0 && H === 1 && l.length > 1 && l.every((p) => p.t === 'g'))) continue;
    const x = fr(cb, ca);
    if (x.d > 1 || Math.abs(x.n) > 15 || x.n === 0) continue;
    const eq = sideStr(l) + '=' + sideStr(rt);
    const st = []; const orig = texOf(sideStr(l)) + ' = ' + texOf(sideStr(rt));
    if (H > 1) st.push(`Beide Seiten mit dem Hauptnenner ${H} multiplizieren (jeden Bruch und jedes Glied).`);
    const exp = texOf(sumStr(el)) + ' = ' + texOf(sumStr(er)); const col = texOf(L(A.a, A.b)) + ' = ' + texOf(L(B.a, B.b));
    if (exp !== orig) st.push(`Klammern auflösen: ${m(exp)}`);
    if (col !== exp) st.push(`Zusammenfassen: ${m(col)}`);
    st.push(`${m('x')}-Glieder nach links, Zahlen nach rechts: ${m(`${co(ca, 'x')} = ${cb}`)}`);
    if (ca !== 1) st.push(`Durch ${ca < 0 ? '(' + ca + ')' : ca} teilen: ${m('x = ' + x.tex())}`);
    const lv = evaluate(parse(sideStr(l)), { x: x.val }), rv = evaluate(parse(sideStr(rt)), { x: x.val });
    st.push(`Probe: links ${m(String(Math.round(lv * 1000) / 1000))}, rechts ${m(String(Math.round(rv * 1000) / 1000))}. Stimmt.`);
    return { html: `${intro || 'Löse die Gleichung nach'} ${m('x')} ${intro ? '' : 'auf'}: ${m(texOf(sideStr(l)) + ' = ' + texOf(sideStr(rt)))}`, fields: [{ id: 'a', type: 'num', label: 'x =', answer: x.val, show: x.toString(), tol: 1e-9, points: pts }], solution: steps(st), _eq: eq };
  }
  return { html: `Löse nach ${m('x')} auf: ${m('2x + 3 = 11')}`, fields: [{ id: 'a', type: 'num', label: 'x =', answer: 4, points: pts }], solution: steps([m('2x = 8'), m('x = 4')]) };
}
reg('M6.einfach', { skill: 'M6', title: 'Einfache Gleichung', diff: 1, quick: true }, (r) =>
  eqTask(r, () => ({ l: [{ t: 'x', k: r.int(2, 9) }, { t: 'c', v: r.nz(-12, 12) }], rt: [{ t: 'x', k: r.nz(-5, 6) }, { t: 'c', v: r.nz(-20, 20) }] }), 1));
reg('M6.klammer', { skill: 'M6', title: 'Gleichung mit Klammern', diff: 3, pts: 2 }, (r) => eqTask(r, () => {
  const t = r.int(0, 2);
  if (t === 0) return { l: [{ t: 'c', v: r.int(2, 12) }, { t: 'g', k: -1, p: r.int(2, 7), q: -r.int(2, 14) }], rt: [{ t: 'c', v: r.int(2, 14) }, { t: 'g', k: -r.int(2, 5), p: r.int(2, 5), q: r.int(1, 6) }] };
  if (t === 1) return { l: [{ t: 'g', k: r.int(3, 7), p: 1, q: r.nz(-6, 6) }, { t: 'g', k: -2, p: r.int(1, 3), q: -r.int(1, 7) }], rt: [{ t: 'x', k: r.nz(-4, 5) }, { t: 'c', v: r.nz(-15, 15) }] };
  return { l: [{ t: 'g', k: r.int(2, 5), p: r.int(1, 4), q: -r.int(1, 8) }], rt: [{ t: 'c', v: r.int(3, 20) }, { t: 'g', k: -1, p: r.int(2, 6), q: r.nz(-9, 9) }] };
}, 2));
reg('M6.bruch', { skill: 'M6', title: 'Gleichung mit Brüchen', diff: 3, pts: 2 }, (r) => eqTask(r, () => {
  let d1, d2; do { d1 = r.pick([2, 3, 4, 5, 6]); d2 = r.pick([2, 3, 4, 5, 6, 8]); } while (d1 === d2);
  const t = r.int(0, 1);
  if (t === 0) return { l: [{ t: 'f', s: 1, p: r.int(1, 6), q: r.nz(-6, 7), den: d1 }, { t: 'f', s: -1, p: -r.int(1, 9), q: r.int(1, 6), den: d2, rev: true }], rt: [{ t: 'x', k: r.int(1, 4) }] };
  return { l: [{ t: 'f', s: 1, p: 1, q: r.nz(-7, 7), den: d1 }, { t: 'f', s: r.bool() ? 1 : -1, p: r.int(1, 4), q: r.nz(-5, 5), den: d2 }], rt: [{ t: 'c', v: r.nz(-6, 8) }] };
}, 2));

// ---------- M7 Formeln auflösen ----------
const FORMELN = [
  ['A=g*h/2', 'h', '2A/g', 'Dreiecksfläche'], ['A=g*h/2', 'g', '2A/h', 'Dreiecksfläche'], ['V=G*h/3', 'h', '3V/G', 'Pyramidenvolumen'], ['V=G*h/3', 'G', '3V/h', 'Pyramidenvolumen'],
  ['U=2(a+b)', 'a', 'U/2-b', 'Rechteckumfang'], ['A=(a+c)/2*h', 'h', '2A/(a+c)', 'Trapezfläche'], ['A=(a+c)/2*h', 'a', '2A/h-c', 'Trapezfläche'],
  ['W=p*G/100', 'p', '100W/G', 'Prozentwert'], ['W=p*G/100', 'G', '100W/p', 'Prozentwert'], ['V=a*b*c', 'c', 'V/(a*b)', 'Quadervolumen'], ['A=e*f/2', 'e', '2A/f', 'Rhombusfläche'],
  ['O=2(a*b+a*c+b*c)', 'a', '(O-2b*c)/(2(b+c))', 'Quaderoberfläche'], ['y=m*x+q', 'x', '(y-q)/m', 'Gerade'], ['y=m*x+q', 'm', '(y-q)/x', 'Gerade']
];
reg('M7.formel', { skill: 'M7', title: 'Formel auflösen', diff: 2, quick: true }, (r) => {
  if (r.bool(0.4)) { // Bauart wie Prüfung 1d: k·y = (a·x ± c)/n
    const k = r.int(2, 5), n = r.int(2, 5), c = r.int(1, 9), minus = r.bool();
    const eq = `${k}y=(a*x${minus ? '-' : '+'}${c})/${n}`; const ans = `(${k * n}y${minus ? '+' : '-'}${c})/a`;
    return { html: `Löse nach ${m('x')} auf: ${eqt(eq)}`, fields: [{ id: 'a', type: 'expr', answer: ans, vars: ['a', 'y'], label: 'x =' }],
      solution: steps([`Beide Seiten mal ${n}: ${m(`${k * n}y = ax ${minus ? '-' : '+'} ${c}`)}`, `Beide Seiten ${minus ? 'plus' : 'minus'} ${c}: ${m(`${k * n}y ${minus ? '+' : '-'} ${c} = ax`)}`, `Durch ${m('a')} teilen: ${m('x = ' + texOf(ans))}`]) }; }
  const [eq, v, ans, name] = r.pick(FORMELN);
  const all = [...new Set(eq.replace(/[^a-zA-Z]/g, '').split(''))].filter((c) => c !== v);
  return { html: `${name}: ${eqt(eq)}. Löse die Formel nach ${m(v)} auf.`, fields: [{ id: 'a', type: 'expr', answer: ans, vars: all, label: `${v} =` }],
    solution: steps([`Ziel: ${m(v)} steht allein auf einer Seite. Auf beiden Seiten immer dasselbe tun.`, `Brüche zuerst wegmultiplizieren, dann alles ohne ${m(v)} auf die andere Seite bringen, am Schluss durch den Faktor bei ${m(v)} teilen.`, m(v + ' = ' + texOf(ans))]) };
});

// ---------- M8 Textgleichungen ----------
function textEq(r) {
  const t = r.int(0, 6);
  if (t === 0) { const ort = r.pick(['einen Freizeitpark', 'das Hallenbad', 'den Zoo', 'ein Museum', 'das Kino']); const p1 = r.int(18, 36), p2 = r.int(8, p1 - 6), n = r.int(18, 50), x = r.int(4, n - 4);
    return { x, text: `Der Eintritt in ${ort} kostet für Erwachsene CHF ${p1} und für Kinder CHF ${p2}. Eine Gruppe von ${n} Personen bezahlt zusammen CHF ${p1 * x + p2 * (n - x)}.`, def: 'die Anzahl Erwachsene', eq: `${p1}x+${p2}(${n}-x)=${p1 * x + p2 * (n - x)}`, why: [`Erwachsene: ${m(`${p1}x`)} Franken`, `Kinder: es sind ${m(`${n}-x`)} Kinder, also ${m(`${p2}(${n}-x)`)} Franken`, 'Beides zusammen ergibt den Gesamtpreis.'] }; }
  if (t === 1) { const A = r.pick(NAMES_F), B = r.pick(NAMES_M), k = r.int(3, 6), mm = r.int(2, k - 1), a = r.int(2, 9) * 50, b = r.int(1, 6) * 25; const xn = a + b, xd = k + 1 - mm; if (xn % xd !== 0) return textEq(r); const x = xn / xd; if (x <= b || k * x <= a) return textEq(r);
    return { x, text: `${A} hat ${k}-mal so viel Geld wie ${B}. ${A} gibt CHF ${a} aus, ${B} gibt CHF ${b} aus. Danach besitzen beide zusammen ${mm}-mal so viel, wie ${B} am Anfang hatte.`, def: `der Betrag in Franken, den ${B} am Anfang hatte`, eq: `${k}x-${a}+x-${b}=${mm}x`, why: [`${A} am Anfang: ${m(`${k}x`)}, danach ${m(`${k}x-${a}`)}`, `${B} danach: ${m(`x-${b}`)}`, `Zusammen: ${m(`${mm}x`)}`] }; }
  if (t === 2) { const k = r.int(3, 8), mm = r.int(2, k - 1), x = r.int(2, 15), b = r.int(1, 12); const a = (k - mm) * x - b; if (a <= 0) return textEq(r);
    return { x, text: `Vermindert man das ${k}-Fache einer Zahl um ${a}, so erhält man ${b} mehr als das ${mm}-Fache der Zahl.`, def: 'die gesuchte Zahl', eq: `${k}x-${a}=${co(mm, 'x')}+${b}`, why: [`«Das ${k}-Fache, vermindert um ${a}»: ${m(`${k}x-${a}`)}`, `«${b} mehr als das ${mm}-Fache»: ${m(`${co(mm, 'x')}+${b}`)}`] }; }
  if (t === 3) { const tier = r.pick([['Hühner', 'Kaninchen', 2, 4], ['Enten', 'Schafe', 2, 4], ['Vögel', 'Käfer', 2, 6], ['Velos', 'Dreiräder', 2, 3]]); const n = r.int(15, 45), x = r.int(4, n - 4); const word = tier[0] === 'Velos' ? 'Räder' : 'Beine';
    return { x, text: `${tier[0] === 'Velos' ? 'Vor dem Schulhaus stehen' : 'Auf einem Hof zählt man'} ${tier[0]} und ${tier[1]}: zusammen ${n} ${tier[0] === 'Velos' ? 'Fahrzeuge' : 'Tiere'} mit total ${tier[2] * x + tier[3] * (n - x)} ${word}n.`, def: `die Anzahl ${tier[0]}`, eq: `${tier[2]}x+${tier[3]}(${n}-x)=${tier[2] * x + tier[3] * (n - x)}`, why: [`${tier[0]}: ${m(`${tier[2]}x`)} ${word}`, `${tier[1]}: ${m(`${n}-x`)} Stück mit je ${tier[3]} ${word}n: ${m(`${tier[3]}(${n}-x)`)}`] }; }
  if (t === 4) { const P = r.pick(NAMES_M), k = r.int(3, 5), b = r.int(2, 8), x = r.int(8, 15); const s = k * x + b + x + b;
    return { x, text: `Die Mutter ist heute ${k}-mal so alt wie ${P}. In ${b} Jahren sind beide zusammen ${s} Jahre alt.`, def: `das heutige Alter von ${P} in Jahren`, eq: `${k}x+${b}+x+${b}=${s}`, why: [`Mutter in ${b} Jahren: ${m(`${k}x+${b}`)}`, `${P} in ${b} Jahren: ${m(`x+${b}`)}`, `Summe: ${s}`] }; }
  if (t === 5) { const a = r.int(2, 12), x = r.int(4, 20); const U = 2 * (x + x + a);
    return { x, text: `Ein Rechteck ist ${a} cm länger als breit. Sein Umfang misst ${U} cm.`, def: 'die Breite in cm', eq: `2(x+x+${a})=${U}`, why: [`Länge: ${m(`x+${a}`)}`, `Umfang = 2 · (Breite + Länge)`] }; }
  const k = r.int(2, 4), a = r.int(2, 9), mm = r.int(k + 1, k + 4), b = r.int(1, 9); const xn = -(k * a) - 2 * b, xd = 2 * mm - k; // k(x-a)/2 = m x + b
  if (xd === 0 || xn % xd !== 0) return textEq(r); const x = xn / xd;
  return { x, text: `Die Hälfte des ${k}-Fachen von ${m(`(x-${a})`)} ist um ${b} grösser als das ${mm}-Fache von ${m('x')}.`, def: 'eine Zahl', eq: `${k}(x-${a})/2=${mm}x+${b}`, why: [`«Das ${k}-Fache von (x − ${a})»: ${m(`${k}(x-${a})`)}; die Hälfte davon: geteilt durch 2`, `«um ${b} grösser als das ${mm}-Fache»: ${m(`${mm}x+${b}`)}`] };
}
reg('M8.aufstellen', { skill: 'M8', title: 'Gleichung aufstellen', diff: 3, quick: true }, (r) => { const q = textEq(r);
  return { html: `${q.text}<br>${m('x')} ist ${q.def}. Stelle eine Gleichung für ${m('x')} auf. <b>Nicht lösen.</b>`, fields: [{ id: 'a', type: 'eq', answer: q.eq, var: 'x', label: 'Gleichung' }], solution: steps([...q.why, `Gleichung: ${eqt(q.eq)}`, 'Jede gleichwertige Gleichung zählt. In der Prüfung: Variable genau wie vorgegeben verwenden.']) }; });
reg('M8.loesen', { skill: 'M8', title: 'Gleichung aufstellen und lösen', diff: 2, pts: 2 }, (r) => { const q = textEq(r);
  return { html: `${q.text}<br>${m('x')} ist ${q.def}. Stelle eine Gleichung auf und löse sie.`, fields: [{ id: 'a', type: 'eq', answer: q.eq, var: 'x', label: 'Gleichung' }, { id: 'b', type: 'num', answer: q.x, label: 'x =' }], solution: steps([...q.why, `Gleichung: ${eqt(q.eq)}`, `Lösung: ${m('x = ' + q.x)}`]) }; });

// ---------- M9 Figurenfolgen ----------
const PATTERNS = [
  { name: 'Hölzchen', unit: 'Hölzchen', term: '3n+1', f: (n) => 3 * n + 1, why: 'Das erste Quadrat braucht 4 Hölzchen, jedes weitere 3.', segs: (n) => { const s = []; for (let i = 0; i < n; i++) { s.push([i, 0, i + 1, 0], [i, 1, i + 1, 1], [i + 1, 0, i + 1, 1]); } s.push([0, 0, 0, 1]); return s; } },
  { name: 'Hölzchen', unit: 'Hölzchen', term: '2n+1', f: (n) => 2 * n + 1, why: 'Das erste Dreieck braucht 3 Hölzchen, jedes weitere 2.', segs: (n) => { const s = []; const P = (i) => [i * 0.5, i % 2 === 0 ? 0.87 : 0]; for (let i = 0; i <= n; i++) s.push([...P(i), ...P(i + 1)]); for (let i = 0; i < n; i++) s.push([...P(i), ...P(i + 2)]); return s; } },
  { name: 'Punkte', unit: 'Punkte', term: '4n+1', f: (n) => 4 * n + 1, why: '1 Punkt in der Mitte und 4 Arme mit je n Punkten.', dots: (n) => { const d = [[0, 0]]; for (let i = 1; i <= n; i++) d.push([i, 0], [-i, 0], [0, i], [0, -i]); return d; } },
  { name: 'Punkte', unit: 'Punkte', term: '2n+1', f: (n) => 2 * n + 1, why: 'Eine Ecke und 2 Arme mit je n Punkten.', dots: (n) => { const d = [[0, 0]]; for (let i = 1; i <= n; i++) d.push([i, 0], [0, -i]); return d; } },
  { name: 'Punkte', unit: 'Punkte', term: 'n^2+2n', f: (n) => n * n + 2 * n, why: 'Rechteck mit n Reihen und n + 2 Punkten pro Reihe: n · (n + 2).', dots: (n) => { const d = []; for (let y = 0; y < n; y++) for (let x = 0; x < n + 2; x++) d.push([x, y]); return d; } },
  { name: 'Punkte', unit: 'Punkte', term: '4n', f: (n) => 4 * n, why: 'Quadratrahmen mit n + 1 Punkten pro Seite: 4 Seiten mal n (jede Ecke nur 1-mal zählen).', dots: (n) => { const d = []; for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) if (i === 0 || j === 0 || i === n || j === n) d.push([i, j]); return d; } },
  { name: 'Punkte', unit: 'Punkte', term: 'n^2+1', f: (n) => n * n + 1, why: 'Quadrat mit n mal n Punkten und 1 Punkt dazu.', dots: (n) => { const d = [[n, -1]]; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) d.push([x, y]); return d; } },
  { name: 'Punkte', unit: 'Punkte', term: '3n+2', f: (n) => 3 * n + 2, why: '3 Reihen mit je n Punkten und 2 Punkte am Rand.', dots: (n) => { const d = [[-1, 1], [n, 1]]; for (let y = 0; y < 3; y++) for (let x = 0; x < n; x++) d.push([x, y]); return d; } }
];
function drawPattern(p, upTo = 3) {
  let body = '', x0 = 14; const S = 16; let H = 0; const parts = [];
  for (let n = 1; n <= upTo; n++) {
    if (p.dots) { const d = p.dots(n); const xs = d.map((q) => q[0]), ys = d.map((q) => q[1]); const mnx = Math.min(...xs), mny = Math.min(...ys), w = (Math.max(...xs) - mnx) * S, hh = (Math.max(...ys) - mny) * S; parts.push({ n, w, hh, draw: (ox, oy) => d.map((q) => dot(ox + (q[0] - mnx) * S, oy + (q[1] - mny) * S, 'fg-dot', 4)).join('') }); H = Math.max(H, hh); }
    else { const sg = p.segs(n); const SS = 26; const xs = sg.flatMap((q) => [q[0], q[2]]), ys = sg.flatMap((q) => [q[1], q[3]]); const w = Math.max(...xs) * SS, hh = Math.max(...ys) * SS; parts.push({ n, w, hh, draw: (ox, oy) => sg.map((q) => line(ox + q[0] * SS, oy + q[1] * SS, ox + q[2] * SS, oy + q[3] * SS, 'fg-stick')).join('') }); H = Math.max(H, hh); }
  }
  for (const pt of parts) { body += pt.draw(x0, 12 + (H - pt.hh) / 2) + `<text class="fg-text small" x="${x0 + pt.w / 2}" y="${H + 34}" text-anchor="middle">Figur ${pt.n}</text>`; x0 += pt.w + 34; }
  return svg(x0, H + 44, body, 'Figurenfolge: Figuren 1 bis ' + upTo);
}
reg('M9.folge', { skill: 'M9', title: 'Figurenfolge: Term für Figur n', diff: 3, pts: 2 }, (r) => {
  const p = r.pick(PATTERNS); const k = r.pick([5, 6, 8, 10, 12, 20]);
  return { html: `Die Figurenfolge wird nach demselben Muster fortgesetzt. Gezählt werden die ${p.unit}.`, fig: drawPattern(p), fields: [{ id: 'a', type: 'num', answer: p.f(k), label: `Anzahl ${p.unit} in Figur ${k}` }, { id: 'b', type: 'expr', answer: p.term, vars: ['n'], label: `Term für Figur ${m('n')}` }],
    solution: steps([`Zählen: Figur 1: ${p.f(1)}, Figur 2: ${p.f(2)}, Figur 3: ${p.f(3)}`, p.why, `Term: ${mt(p.term)}`, `Für Figur ${k} die Zahl ${k} für ${m('n')} einsetzen: ${p.f(k)} ${p.unit}`]) };
});
reg('M9.tabelle', { skill: 'M9', title: 'Zahlenfolge: Term finden', diff: 2, quick: true }, (r) => {
  const a = r.int(2, 7), b = r.nz(-4, 9); const f = (n) => a * n + b;
  return { html: `Eine Folge beginnt so: <table class="mini"><tr><th>${m('n')}</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>Wert</th><td>${f(1)}</td><td>${f(2)}</td><td>${f(3)}</td><td>${f(4)}</td></tr></table> Gib einen Term für den Wert bei ${m('n')} an.`, fields: [{ id: 'a', type: 'expr', answer: L(a, b, 'n'), vars: ['n'], label: 'Term' }],
    solution: steps([`Von Wert zu Wert kommt immer ${a} dazu: Der Term enthält ${m(`${a}n`)}.`, `Für ${m('n = 1')}: ${m(`${a}\\cdot 1 = ${a}`)}, der Wert ist aber ${f(1)}: also ${m(pm(b))}.`, mt(L(a, b, 'n'))]) };
});
