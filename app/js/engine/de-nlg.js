// Satzgenerator: baut grammatisch korrekte deutsche Sätze aus dem Lexikon und kennt dabei
// für jedes Wort die Wortart, das Satzglied und den Verbteil. Daraus entstehen unendlich viele Grammatik-Aufgaben.
import { NOUN, nounsOf, np, PRON, VERBS, verbsOf, finite, auxForm, ADJ_P, ADJ_T, ADJ_O, DEF } from './de-lex.js';
import { cap } from '../util.js';

// Nominalgruppen-Angabe: { noun, det, adj, plural } oder { pron: '1s' }
export function npToks(spec, c, role) {
  if (spec.pron) return [{ w: PRON[spec.pron][c], tag: 'P', role }];
  return np(spec.noun, c, spec).map((t) => Object.assign(t, { role }));
}
export function personOf(spec) { if (spec.pron) return spec.pron.slice(0, 2); return spec.plural ? '3p' : '3s'; }

function ppToks(prep, spec, c, role = 'PP') {
  const toks = npToks(spec, c, role);
  if (prep === 'in' && (!spec.det || spec.det === 'def') && !spec.plural && !spec.pron) {
    const g = NOUN[spec.noun].g;
    if (c === 'D' && (g === 'm' || g === 'n')) return [{ w: 'im', tag: 'PR', role, contr: true }, ...toks.slice(1)];
    if (c === 'A' && g === 'n') return [{ w: 'ins', tag: 'PR', role, contr: true }, ...toks.slice(1)];
  }
  return [{ w: prep, tag: 'PR', role }, ...toks];
}

// Verbformen eines Teilsatzes: Personalform und Verbteile am Satzende
export function verbParts(cl) {
  const v = cl.verb, p = cl.passive ? personOf(cl.acc) : personOf(cl.subj);
  const V = (w, vpart) => ({ w, tag: 'V', role: 'V', vpart });
  if (cl.passive) {
    if (cl.tense === 'pres') return { fin: V(auxForm('werden', 'pres', p), 'pers'), end: [V(v.pp, 'pp')] };
    if (cl.tense === 'pret') return { fin: V(auxForm('werden', 'pret', p), 'pers'), end: [V(v.pp, 'pp')] };
    if (cl.tense === 'perf') return { fin: V(auxForm('sein', 'pres', p), 'pers'), end: [V(v.pp, 'pp'), V('worden', 'pp')] };
    if (cl.tense === 'plus') return { fin: V(auxForm('sein', 'pret', p), 'pers'), end: [V(v.pp, 'pp'), V('worden', 'pp')] };
    return { fin: V(auxForm('werden', 'pres', p), 'pers'), end: [V(v.pp, 'pp'), V('werden', 'inf')] };
  }
  const aux = v.aux === 's' ? 'sein' : 'haben';
  if (cl.tense === 'pres' || cl.tense === 'pret') return { fin: V(finite(v, cl.tense, p), 'pers'), end: v.sep ? [V(v.sep, 'sep')] : [] };
  if (cl.tense === 'perf') return { fin: V(auxForm(aux, 'pres', p), 'pers'), end: [V(v.pp, 'pp')] };
  if (cl.tense === 'plus') return { fin: V(auxForm(aux, 'pret', p), 'pers'), end: [V(v.pp, 'pp')] };
  return { fin: V(auxForm('werden', 'pres', p), 'pers'), end: [V(v.inf, 'inf')] };
}

// Satzglieder in der Grundreihenfolge
function parts(cl) {
  const out = [];
  if (cl.passive) {
    out.push({ id: 'S', toks: npToks(cl.acc, 'N', 'S') });
    if (cl.agent) out.push({ id: 'AG', toks: ppToks('von', cl.subj, 'D', 'AG') });
    if (cl.adv) out.push({ id: 'ADV', toks: [{ w: cl.adv, tag: 'X', role: 'ADV' }] });
  } else {
    out.push({ id: 'S', toks: npToks(cl.subj, 'N', 'S') });
    if (cl.dat) out.push({ id: 'D', toks: npToks(cl.dat, 'D', 'D') });
    if (cl.adv) out.push({ id: 'ADV', toks: [{ w: cl.adv, tag: 'X', role: 'ADV' }] });
    if (cl.acc) out.push({ id: 'A', toks: npToks(cl.acc, 'A', 'A') });
  }
  if (cl.pp) out.push({ id: 'PP', toks: ppToks(cl.pp.prep, cl.pp.np, cl.pp.c) });
  return out;
}

// Wortfolge. mode: 'main' (Verb an 2. Stelle), 'inv' (Verb zuerst, z. B. nach einem Nebensatz), 'sub' (Verb am Ende)
export function linearize(cl, mode = 'main', front = 'S') {
  const ps = parts(cl); const { fin, end } = verbParts(cl);
  if (mode === 'sub') {
    const tail = (cl.tense === 'pres' || cl.tense === 'pret') && end.length && !cl.passive
      ? [{ w: end[0].w + fin.w, tag: 'V', role: 'V', vpart: 'pers' }] : [...end, fin];
    return [...ps.flatMap((p) => p.toks), ...tail];
  }
  if (mode === 'inv') return [fin, ...ps.flatMap((p) => p.toks), ...end];
  const f = ps.find((p) => p.id === front) || ps[0];
  return [...f.toks, fin, ...ps.filter((p) => p !== f).flatMap((p) => p.toks), ...end];
}
export const sentence = (toks, endMark = '.') => cap(toks.map((t) => t.w).join(' ')) + endMark;
export const plain = (toks) => toks.map((t) => t.w).join(' ');

const ADV = { pres: ['heute', 'jetzt', 'oft', 'manchmal', 'gerade', 'täglich'], past: ['gestern', 'vorhin', 'neulich', 'damals'], fut: ['morgen', 'bald', 'später', 'übermorgen'] };
export const advFor = (r, tense) => r.pick(tense === 'pres' ? ADV.pres : tense === 'fut' ? ADV.fut : ADV.past);

function randNP(r, klass, opt = {}) {
  const pool = opt.pool ? opt.pool.map((w) => NOUN[w]) : nounsOf(klass);
  let n; do { n = r.pick(pool); } while (opt.not && opt.not.includes(n.w));
  const adjPool = n.k === 'p' || n.k === 'a' ? ADJ_P : n.k === 'o' ? ADJ_O : ADJ_T;
  const dets = opt.dets || (n.k === 'p' ? ['def', 'def', 'mein', 'unser', 'dies', 'ein'] : ['def', 'ein', 'ein', 'mein', 'dies', 'sein']);
  let det = r.pick(dets); const plural = !!opt.plural && r.bool(0.25) && n.pl !== n.w; // Plural nur, wenn die Form erkennbar ist
  if (plural && det === 'ein') det = 'def';
  return { noun: n.w, det, adj: r.bool(opt.adjP != null ? opt.adjP : 0.45) ? r.pick(adjPool) : null, plural };
}

// Zufälliger Teilsatz. opts: { frames, tense, adv, adjP, pron, plural }
export function randClause(r, opts = {}) {
  const frames = opts.frames || ['A', 'AP', 'D', 'DA', 'L', 'R', 'TD'];
  const v = opts.verb || r.pick(verbsOf(...frames)); const tense = opts.tense || r.pick(['pres', 'pret', 'perf', 'plus', 'fut']);
  const cl = { verb: v, tense };
  const nOpt = { adjP: opts.adjP, plural: opts.plural };
  if (v.frame === 'TD') { cl.subj = randNP(r, 't', Object.assign({ dets: ['def', 'dies', 'mein'] }, nOpt)); cl.dat = randNP(r, 'p', nOpt); }
  else {
    cl.subj = opts.pron && r.bool(opts.pron) ? { pron: r.pick(tense === 'pres' || tense === 'perf' || tense === 'fut' || tense === 'plus' ? ['1s', '1p', '3sm', '3sf', '3p'] : ['1s', '1p', '3sm', '3sf', '3p']) } : randNP(r, v.frame === 'L' && r.bool(0.25) ? 'a' : 'p', nOpt);
    const used = cl.subj.noun ? [cl.subj.noun] : [];
    if (v.frame === 'A') cl.acc = randNP(r, 't', Object.assign({ pool: v.objs }, nOpt));
    if (v.frame === 'AP') cl.acc = randNP(r, 'p', Object.assign({ not: used }, nOpt));
    if (v.frame === 'D') cl.dat = randNP(r, 'p', Object.assign({ not: used }, nOpt));
    if (v.frame === 'DA') { cl.dat = randNP(r, 'p', Object.assign({ not: used }, nOpt)); cl.acc = randNP(r, 't', Object.assign({ pool: v.objs }, nOpt)); }
    if (v.frame === 'L') cl.pp = { prep: 'in', c: 'D', np: randNP(r, 'o', { adjP: 0.3, dets: ['def', 'def', 'unser', 'dies'] }) };
    if (v.frame === 'R') cl.pp = { prep: 'in', c: 'A', np: randNP(r, 'o', { adjP: 0.3, dets: ['def', 'def', 'unser', 'dies'] }) };
  }
  if (opts.adv !== false && r.bool(opts.adv != null ? opts.adv : 0.5)) cl.adv = advFor(r, tense);
  return cl;
}

export function toPassive(cl, withAgent) { return Object.assign({}, cl, { passive: true, agent: !!withAgent, dat: null, pp: null }); }
export const canPassive = (cl) => (cl.verb.frame === 'A' || cl.verb.frame === 'AP') && cl.acc && !cl.subj.pron;

// Getaggte Sätze aus der Datenbank: "Der|P Hund|N bellt|V ." → Tokens
export function parseTagged(s) {
  return s.trim().split(/\s+/).map((part) => { const i = part.lastIndexOf('|'); return i < 0 ? { w: part, tag: null } : { w: part.slice(0, i), tag: part.slice(i + 1) }; });
}
// Sätze mit markierten Objekten: "Sie hilft [dem Nachbarn|D] gern." → Tokens und Spannen
export function parseBracket(s) {
  const toks = []; const spans = []; const re = /\[([^\]|]+)\|([NADGS])\]|(\S+)/g; let mm;
  while ((mm = re.exec(s))) {
    if (mm[1]) { const ws = mm[1].trim().split(/\s+/); spans.push({ c: mm[2], idx: ws.map((_, k) => toks.length + k) }); ws.forEach((w) => toks.push(w)); }
    else if (!/^[.,;:!?]+$/.test(mm[3])) toks.push(mm[3]);
  }
  return { toks, spans };
}
export { DEF };
