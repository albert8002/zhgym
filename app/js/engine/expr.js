// Termrechner: liest getippte Terme (z. B. "3x^2 - 2(x+1)", "sqrt(50)", "13/15"),
// rechnet sie aus, vergleicht zwei Terme auf Gleichwertigkeit und schreibt sie als LaTeX.
import { gcd } from '../util.js';

// ---------- Bruch (exakt) ----------
export class Frac {
  constructor(n, d = 1) {
    if (d === 0) throw new Error('Nenner 0');
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    this.n = n / g; this.d = d / g;
  }
  static of(v) { return v instanceof Frac ? v : new Frac(v, 1); }
  add(o) { o = Frac.of(o); return new Frac(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { o = Frac.of(o); return new Frac(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { o = Frac.of(o); return new Frac(this.n * o.n, this.d * o.d); }
  div(o) { o = Frac.of(o); return new Frac(this.n * o.d, this.d * o.n); }
  neg() { return new Frac(-this.n, this.d); }
  get val() { return this.n / this.d; }
  isInt() { return this.d === 1; }
  toString() { return this.d === 1 ? String(this.n) : this.n + '/' + this.d; }
  tex() { return this.d === 1 ? String(this.n) : (this.n < 0 ? '-' : '') + '\\frac{' + Math.abs(this.n) + '}{' + this.d + '}'; }
}

// ---------- Zerlegen in Zeichen ----------
function tokenize(src) {
  let s = String(src).replace(/−|–|—/g, '-').replace(/[·×∙⋅]/g, '*').replace(/[÷:]/g, '/').replace(/²/g, '^2').replace(/³/g, '^3').replace(/\s+/g, ' ').trim();
  s = s.replace(/\\cdot/g, '*').replace(/(\d)['’](?=\d{3})/g, '$1');
  const out = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (/[0-9]/.test(c) || ((c === '.' || c === ',') && /[0-9]/.test(s[i + 1] || ''))) {
      let j = i; let seenDot = false;
      while (j < s.length && (/[0-9]/.test(s[j]) || ((s[j] === '.' || s[j] === ',') && !seenDot && /[0-9]/.test(s[j + 1] || '')))) { if (s[j] === '.' || s[j] === ',') seenDot = true; j++; }
      // Tausender-Apostroph erlauben: 1'000
      out.push({ t: 'num', v: parseFloat(s.slice(i, j).replace(',', '.')) }); i = j; continue;
    }
    if (c === "'" || c === '’') { i++; continue; }
    if (c === '√') { out.push({ t: 'sqrt' }); i++; continue; }
    if (/[a-zA-Zäöü]/.test(c)) {
      const rest = s.slice(i).toLowerCase();
      if (rest.startsWith('sqrt')) { out.push({ t: 'sqrt' }); i += 4; continue; }
      if (rest.startsWith('wurzel')) { out.push({ t: 'sqrt' }); i += 6; continue; }
      out.push({ t: 'var', n: c }); i++; continue;
    }
    if ('+-*/^()='.includes(c)) { out.push({ t: c }); i++; continue; }
    throw new Error('Zeichen nicht erlaubt: ' + c);
  }
  return out;
}

// ---------- Baum bauen ----------
class Parser {
  constructor(tokens) { this.k = tokens; this.i = 0; }
  peek() { return this.k[this.i]; }
  eat(t) { const k = this.k[this.i]; if (!k || k.t !== t) throw new Error('Erwartet: ' + t); this.i++; return k; }
  startsPrimary() { const k = this.peek(); return !!k && (k.t === 'num' || k.t === 'var' || k.t === '(' || k.t === 'sqrt'); }
  expr() {
    let a = this.term();
    while (this.peek() && (this.peek().t === '+' || this.peek().t === '-')) {
      const op = this.k[this.i++].t; const b = this.term();
      a = { t: op === '+' ? 'add' : 'sub', a, b };
    }
    return a;
  }
  term() {
    let a = this.unary();
    for (;;) {
      const k = this.peek();
      if (k && (k.t === '*' || k.t === '/')) { this.i++; const b = this.unary(); a = { t: k.t === '*' ? 'mul' : 'div', a, b }; }
      else if (this.startsPrimary()) {
        if (k.t === 'num' && this.k[this.i - 1] && this.k[this.i - 1].t === 'num') throw new Error('Zwei Zahlen hintereinander');
        const b = this.power(); a = { t: 'mul', a, b, imp: true };
      }
      else break;
    }
    return a;
  }
  unary() {
    const k = this.peek();
    if (k && k.t === '-') { this.i++; return { t: 'neg', a: this.unary() }; }
    if (k && k.t === '+') { this.i++; return this.unary(); }
    return this.power();
  }
  power() {
    const base = this.primary();
    const k = this.peek();
    if (k && k.t === '^') { this.i++; const e = this.unary(); return { t: 'pow', a: base, b: e }; }
    return base;
  }
  primary() {
    const k = this.peek();
    if (!k) throw new Error('Term unvollständig');
    if (k.t === 'num') { this.i++; return { t: 'num', v: k.v }; }
    if (k.t === 'var') { this.i++; return { t: 'var', n: k.n }; }
    if (k.t === '(') { this.i++; const e = this.expr(); this.eat(')'); return { t: 'grp', a: e }; }
    if (k.t === 'sqrt') { this.i++; const a = this.primary(); return { t: 'sqrt', a: a.t === 'grp' ? a.a : a }; }
    throw new Error('Unerwartet: ' + k.t);
  }
}

export function parse(src) {
  const tokens = tokenize(src);
  if (!tokens.length) throw new Error('Leer');
  const p = new Parser(tokens);
  const e = p.expr();
  if (p.i < tokens.length) throw new Error('Rest nicht lesbar');
  return e;
}

// Gleichung "links = rechts"
export function parseEq(src) {
  const parts = String(src).split('=');
  if (parts.length !== 2) throw new Error('Genau ein Gleichheitszeichen nötig');
  return { l: parse(parts[0]), r: parse(parts[1]) };
}

export function evaluate(n, env = {}) {
  switch (n.t) {
    case 'num': return n.v;
    case 'var': if (!(n.n in env)) throw new Error('Unbekannte Variable ' + n.n); return env[n.n];
    case 'grp': return evaluate(n.a, env);
    case 'neg': return -evaluate(n.a, env);
    case 'add': return evaluate(n.a, env) + evaluate(n.b, env);
    case 'sub': return evaluate(n.a, env) - evaluate(n.b, env);
    case 'mul': return evaluate(n.a, env) * evaluate(n.b, env);
    case 'div': return evaluate(n.a, env) / evaluate(n.b, env);
    case 'pow': return Math.pow(evaluate(n.a, env), evaluate(n.b, env));
    case 'sqrt': return Math.sqrt(evaluate(n.a, env));
  }
  throw new Error('Unbekannter Knoten');
}

export function vars(n, set = new Set()) {
  if (!n) return set;
  if (n.t === 'var') set.add(n.n);
  if (n.a) vars(n.a, set);
  if (n.b) vars(n.b, set);
  return set;
}

// Grösse eines Terms (für «vereinfache so weit wie möglich»)
export function size(n) {
  if (!n) return 0;
  if (n.t === 'grp') return size(n.a);
  if (n.t === 'num' || n.t === 'var') return 1;
  if (n.t === 'neg') return size(n.a);
  return 1 + size(n.a) + (n.b ? size(n.b) : 0);
}

const close = (a, b) => {
  if (!isFinite(a) || !isFinite(b)) return false;
  return Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
};

const TEST_POINTS = [1.37, 2.71, 3.19, 0.83, 4.43, 1.91, 2.29, 3.67];
function envFor(names, k) { const env = {}; names.forEach((v, i) => { env[v] = TEST_POINTS[(k * 3 + i * 5 + k * i) % TEST_POINTS.length] + 0.011 * i; }); return env; }

// Sind zwei Terme für alle Werte gleich? (Probe an mehreren Stellen)
export function equivalent(a, b, names) {
  const A = typeof a === 'string' ? parse(a) : a;
  const B = typeof b === 'string' ? parse(b) : b;
  const vs = names || [...new Set([...vars(A), ...vars(B)])].sort();
  for (let k = 0; k < 5; k++) {
    const env = envFor(vs, k);
    let x, y;
    try { x = evaluate(A, env); y = evaluate(B, env); } catch (e) { return false; }
    if (!close(x, y)) return false;
  }
  return true;
}

// Sind zwei lineare Gleichungen gleichwertig? f = l - r, g = l - r; f = k * g mit k ≠ 0.
export function equationEquivalent(a, b, v = 'x') {
  const A = typeof a === 'string' ? parseEq(a) : a;
  const B = typeof b === 'string' ? parseEq(b) : b;
  const names = [...new Set([...vars(A.l), ...vars(A.r), ...vars(B.l), ...vars(B.r)])];
  if (names.some((n) => n !== v)) return false;
  if (![...vars(A.l), ...vars(A.r)].includes(v)) return false;
  const f = (x) => evaluate(A.l, { [v]: x }) - evaluate(A.r, { [v]: x });
  const g = (x) => evaluate(B.l, { [v]: x }) - evaluate(B.r, { [v]: x });
  try {
    // Nullstelle von g (linear): g(x) = g0 + m x
    const g0 = g(0), m = g(1) - g0;
    if (Math.abs(m) < 1e-12) return false;
    const root = -g0 / m;
    if (!close(f(root) + 1, 1)) return false;
    const pts = [root + 1.3, root - 2.1, root + 5.7];
    let k = null;
    for (const x of pts) {
      const fv = f(x), gv = g(x);
      if (!isFinite(fv) || !isFinite(gv) || Math.abs(gv) < 1e-12) return false;
      const q = fv / gv;
      if (Math.abs(q) < 1e-12) return false;
      if (k === null) k = q; else if (!close(q, k)) return false;
    }
    return true;
  } catch (e) { return false; }
}

// ---------- LaTeX ----------
const prec = (n) => ({ add: 1, sub: 1, mul: 2, div: 2, neg: 2.5, pow: 3 }[n.t] || 9);
export function toTex(n, parent = 0) {
  let s;
  switch (n.t) {
    case 'num': s = String(n.v); break;
    case 'var': s = n.n; break;
    case 'grp': return toTex(n.a, parent);
    case 'neg': s = '-' + toTex(n.a, 2.5); break;
    case 'add': s = toTex(n.a, 1) + '+' + toTex(n.b, 1); break;
    case 'sub': s = toTex(n.a, 1) + '-' + toTex(n.b, 1.5); break;
    case 'mul': {
      const l = toTex(n.a, 2), r = toTex(n.b, 2.2);
      const needDot = /^[0-9]/.test(r) || (/[0-9]$/.test(l) && /^[0-9(]/.test(r) && !/^\(/.test(r));
      s = l + (needDot ? '\\cdot ' : ' ') + r; break;
    }
    case 'div': return '\\frac{' + toTex(n.a, 0) + '}{' + toTex(n.b, 0) + '}';
    case 'pow': s = toTex(n.a, 3.5) + '^{' + toTex(n.b, 0) + '}'; break;
    case 'sqrt': return '\\sqrt{' + toTex(n.a, 0) + '}';
  }
  return prec(n) < parent ? '\\left(' + s + '\\right)' : s;
}

export function texOf(src) { try { return toTex(parse(src)); } catch (e) { return null; } }

// Zahl aus getippter Antwort: erlaubt "3/4", "0.75", "75%", "1'200", "7.5 cm".
export function parseNumber(input) {
  let s = String(input == null ? '' : input).trim();
  if (!s) return { ok: false };
  let percent = false;
  if (/%/.test(s)) { percent = true; s = s.replace(/%/g, ''); }
  s = s.replace(/^(CHF|Fr\.|Franken)\s*/i, '');
  s = s.replace(/\s*(CHF|Fr\.|Franken|Rappen|Rp\.|cm|mm|dm|km|m|kg|mg|g|t|ml|dl|cl|hl|l|min|s|h|Stück|Stk\.|Grad|°)\s*(\^?[23]|²|³)?\s*$/i, '').trim();
  try {
    const ast = parse(s);
    if (vars(ast).size) return { ok: false };
    const v = evaluate(ast, {});
    if (!isFinite(v)) return { ok: false };
    return { ok: true, value: v, percent };
  } catch (e) { return { ok: false }; }
}
