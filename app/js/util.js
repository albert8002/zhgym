// Kleine Helfer: Zufall mit Startwert (damit jede Aufgabe wiederholbar ist), Zahlen, Text.

export function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export class RNG {
  constructor(seed) { this.s = (seed >>> 0) || 1; }
  next() { // mulberry32
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(a, b) { return a + Math.floor(this.next() * (b - a + 1)); }
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  bool(p = 0.5) { return this.next() < p; }
  shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(this.next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  sample(arr, n) { return this.shuffle(arr).slice(0, n); }
  nz(a, b) { let v = 0; while (v === 0) v = this.int(a, b); return v; } // ganze Zahl ungleich 0
}

export const newSeed = () => (Math.floor(Math.random() * 4294967295) >>> 0) || 1;
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; };
export const lcm = (a, b) => (a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b));
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const sum = (arr) => arr.reduce((a, b) => a + b, 0);
export const mean = (arr) => (arr.length ? sum(arr) / arr.length : 0);
export const median = (arr) => { if (!arr.length) return 0; const a = arr.slice().sort((x, y) => x - y); const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
export const round = (v, d = 2) => { const f = 10 ** d; return Math.round((v + Number.EPSILON) * f) / f; };

export function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Zahl für die Anzeige: Dezimalpunkt, Minus als echtes Minuszeichen.
export function fmt(v, d = 4) {
  if (typeof v !== 'number') return String(v);
  const r = round(v, d);
  return String(r).replace('-', '−');
}
export const tex = (v, d = 4) => String(round(v, d));

export function fmtDur(sec) {
  sec = Math.max(0, Math.round(sec));
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : String(m)) + ':' + String(s).padStart(2, '0');
}
export function fmtMin(min) {
  min = Math.round(min);
  if (min < 60) return min + ' Min.';
  const h = Math.floor(min / 60), m = min % 60;
  return h + ' Std.' + (m ? ' ' + m + ' Min.' : '');
}

export const dayKey = (d = new Date()) => { const x = new Date(d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };
export const parseDay = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const daysBetween = (a, b) => Math.round((parseDay(dayKey(b)) - parseDay(dayKey(a))) / 86400000);
const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MON = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];
export const fmtDate = (d, withWd = false) => { const x = typeof d === 'string' ? parseDay(d) : new Date(d); return (withWd ? WD[x.getDay()] + ', ' : '') + x.getDate() + '. ' + MON[x.getMonth()] + ' ' + x.getFullYear(); };
export const fmtDateShort = (d) => { const x = typeof d === 'string' ? parseDay(d) : new Date(d); return x.getDate() + '. ' + MON[x.getMonth()]; };
export const weekdayShort = (i) => WD[i];

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Note aus Punkten (lineare Skala, nicht offiziell), auf Viertelnoten gerundet.
export const gradeFromPoints = (p, max) => (max > 0 ? clamp(1 + 5 * p / max, 1, 6) : 1);
export const quarter = (n) => Math.round(n * 4) / 4;
export const fmtGrade = (n) => (Math.round(n * 100) / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, '.0');

// Textvergleich für getippte Antworten.
export function normText(s, opts = {}) {
  let t = String(s == null ? '' : s).normalize('NFC').replace(/[‘’‚']/g, "'").replace(/[«»„“”"]/g, '"').replace(/ß/g, 'ss');
  t = t.replace(/\s+/g, ' ').trim();
  if (opts.noEndPunct !== false) t = t.replace(/[.!?]+$/g, '').trim();
  if (opts.noPunct) t = t.replace(/[.,;:!?"]/g, '').replace(/\s+/g, ' ').trim();
  if (opts.noComma) t = t.replace(/,/g, '').replace(/\s+/g, ' ').trim();
  if (opts.ci) t = t.toLowerCase();
  return t;
}

// Plattform: auf dem Mac heisst die Steuertaste ⌘
export const IS_MAC = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform || navigator.userAgent || '');
export const MOD = IS_MAC ? '⌘' : 'Ctrl';
