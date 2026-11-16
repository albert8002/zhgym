// Gemeinsame Bausteine für alle Aufgaben-Generatoren.
import { texOf, Frac, parse, toTex } from './expr.js';
import { gcd } from '../util.js';

export const GEN = {};
// meta: { skill, title, diff (1 leicht, 2 mittel, 3 Prüfungsniveau), quick (für Blitz), pts }
export function reg(key, meta, make) { GEN[key] = Object.assign({ key, diff: 2, quick: false }, meta, { make }); }

export const m = (s) => '\\(' + s + '\\)';
export const mt = (plain) => '\\(' + (texOf(plain) || plain) + '\\)';
export const eqt = (plain) => { const [l, r] = plain.split('='); return '\\(' + texOf(l) + '=' + texOf(r) + '\\)'; };
export const pm = (n) => (n < 0 ? '-' + (-n) : '+' + n);
export const co = (a, v) => (a === 1 ? v : a === -1 ? '-' + v : a + v);
export const L = (a, b, v = 'x') => (a === 0 ? String(b) : co(a, v) + (b ? pm(b) : ''));
export const steps = (arr) => '<ol class="steps">' + arr.filter(Boolean).map((s) => '<li>' + s + '</li>').join('') + '</ol>';
export const fr = (n, d = 1) => new Frac(n, d);
export const ft = (f) => m(f.tex());
export const num = (v, d = 4) => String(Math.round(v * 10 ** d) / 10 ** d);
export const chf = (v) => 'CHF ' + (Number.isInteger(v) ? v : v.toFixed(2));

// Summe aus Gliedern [{c, v}] als Text: 3x - 2y + 5
export function sumStr(terms) {
  let s = '';
  for (const t of terms) {
    if (t.c === 0) continue;
    const body = t.v ? co(Math.abs(t.c), t.v) : String(Math.abs(t.c));
    s += s === '' ? (t.c < 0 ? '-' : '') + body : (t.c < 0 ? '-' : '+') + body;
  }
  return s || '0';
}

// Monom: Koeffizient (Bruch) mal x^ex mal y^ey …
export class Mono {
  constructor(c, e = {}) { this.c = Frac.of(c); this.e = {}; for (const k of Object.keys(e).sort()) if (e[k] !== 0) this.e[k] = e[k]; }
  mul(o) { const e = Object.assign({}, this.e); for (const k in o.e) e[k] = (e[k] || 0) + o.e[k]; return new Mono(this.c.mul(o.c), e); }
  div(o) { const e = Object.assign({}, this.e); for (const k in o.e) e[k] = (e[k] || 0) - o.e[k]; return new Mono(this.c.div(o.c), e); }
  pow(n) { const e = {}; for (const k in this.e) e[k] = this.e[k] * n; return new Mono(new Frac(this.c.n ** n, this.c.d ** n), e); }
  static vpart(e, sign) {
    let s = '';
    for (const k of Object.keys(e).sort()) { const x = e[k] * sign; if (x > 0) s += k + (x > 1 ? '^' + x : ''); }
    return s;
  }
  // Text wie (2x)/(3y) – als Bruch geschrieben
  plain() {
    const top = Mono.vpart(this.e, 1), bot = Mono.vpart(this.e, -1);
    const n = Math.abs(this.c.n), d = this.c.d, neg = this.c.n < 0 ? '-' : '';
    const T = (n === 1 && top ? '' : String(n)) + top;
    const B = (d === 1 ? '' : String(d)) + bot;
    if (!B) return neg + (T || '1');
    return neg + '(' + (T || '1') + ')/(' + B + ')';
  }
  tex() { return texOf(this.plain()); }
}
export const mono = (c, e) => new Mono(c, e);

export function primeFactors(n) {
  const out = []; let p = 2;
  while (n > 1) { let k = 0; while (n % p === 0) { n /= p; k++; } if (k) out.push([p, k]); p++; if (p * p > n && n > 1) { out.push([n, 1]); break; } }
  return out;
}
export const pfTex = (n) => primeFactors(n).map(([p, k]) => (k > 1 ? p + '^{' + k + '}' : String(p))).join(' \\cdot ');
export const isSquare = (n) => Number.isInteger(Math.sqrt(n));
export const coprime = (a, b) => gcd(a, b) === 1;
export { Frac, gcd, texOf, parse, toTex };

export const NAMES_F = ['Lena', 'Mia', 'Sara', 'Nora', 'Alina', 'Laura', 'Elif', 'Jana', 'Livia', 'Noemi', 'Samira', 'Valeria'];
export const NAMES_M = ['Luca', 'Noah', 'Jan', 'Tim', 'Leon', 'David', 'Nico', 'Fabian', 'Elias', 'Yannick', 'Marco', 'Arjun'];
