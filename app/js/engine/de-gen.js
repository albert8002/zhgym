// Deutsch-Generatoren: Grammatik (aus dem Satzgenerator, unendlich), Wortschatz, Komma, Rechtschreibung (aus der Datenbank).
import { reg } from './gen-core.js';
import { DB } from './db.js';
import { esc, cap } from '../util.js';
import { NOUN, nounsOf, np, words, VERBS, VERB, verbsOf, finite, konj1, auxForm, CASE_NAME, TENSE_NAME, DEF, ADJ_P, ADJ_T } from './de-lex.js';
import { randClause, linearize, sentence, plain, npToks, personOf, toPassive, canPassive, parseTagged, parseBracket, verbParts, advFor } from './de-nlg.js';

const steps = (arr) => '<ol class="steps">' + arr.filter(Boolean).map((s) => '<li>' + s + '</li>').join('') + '</ol>';
const pickDB = (r, type, pred) => { const pool = pred ? DB[type].filter(pred) : DB[type]; if (!pool.length) throw new Error('Datenbank «' + type + '» ist leer'); return pool[r.int(0, pool.length - 1)]; };
const mark = (w) => '<b class="mark">' + esc(w) + '</b>';
const q = (s) => '<span class="satz">' + s + '</span>';
// Tokens zu Text, Satzzeichen ohne Leerschlag davor; markierte Indizes hervorgehoben
function joinToks(toks, marks = [], upper = false) {
  let s = '';
  toks.forEach((t, i) => { const w = typeof t === 'string' ? t : t.w; const punct = /^[.,;:!?»]$/.test(w);
    const shown = marks.includes(i) ? mark(upper ? w.toUpperCase() : w) : esc(i === 0 ? cap(w) : w);
    s += (i === 0 || punct ? '' : ' ') + shown; });
  return s;
}
const NEUTRAL_ADV = ['oft', 'gern', 'dort', 'hier', 'draussen', 'immer', 'selten', 'manchmal'];

// ---------- D1 Wortarten ----------
const COLS7 = ['Verb', 'Nomen', 'Adjektiv', 'Pronomen', 'Konjunktion', 'Präposition', 'übrige Partikel'];
const TAGCOL = { V: 0, N: 1, A: 2, P: 3, K: 4, PR: 5, X: 6 };
const WHY = { V: 'Verb: lässt sich konjugieren (ich …, du …). Auch Hilfsverb, Partizip und Infinitiv sind Verbteile.', N: 'Nomen: hat ein festes Geschlecht (der, die, das) und wird grossgeschrieben.', A: 'Adjektiv: lässt sich zwischen Artikel und Nomen setzen (der … Hund) und meist steigern. Es bleibt Adjektiv, auch wenn es beim Verb steht.', P: 'Pronomen: Begleiter oder Stellvertreter des Nomens. Dazu gehören auch die Artikel. Es lässt sich in die Fälle setzen.', K: 'Konjunktion: verbindet Wörter, Wortgruppen oder Teilsätze. Sie ist unveränderlich.', PR: 'Präposition: steht vor einer Nominalgruppe und verlangt einen bestimmten Fall. Sie ist unveränderlich.', X: 'Übrige Partikel: unveränderliches Wort, das weder Präposition noch Konjunktion ist (z. B. heute, nicht, sehr, dort).' };
const CONJ_SUB = ['weil', 'obwohl', 'während', 'bevor', 'nachdem', 'wenn'];
function wortartRow(r, wantTag) {
  let toks;
  if (DB.wortart.length && r.bool(0.45)) toks = parseTagged(pickDB(r, 'wortart').s);
  else {
    const c1 = randClause(r, { adjP: 0.6, adv: 0.6, tense: r.pick(['pres', 'pret', 'perf', 'fut']) });
    toks = linearize(c1, 'main', c1.adv && r.bool(0.3) ? 'ADV' : 'S');
    if (r.bool(0.3)) { const c2 = randClause(r, { adjP: 0.3, adv: 0.2, tense: c1.tense === 'fut' ? 'pres' : c1.tense, frames: ['A', 'D', 'L'] }); const k = r.pick(r.bool(0.4) ? ['und', 'aber'] : CONJ_SUB);
      toks = [...toks, { w: ',', tag: null }, { w: k, tag: 'K' }, ...(k === 'und' || k === 'aber' ? linearize(c2, 'main') : linearize(c2, 'sub'))]; }
    toks.push({ w: '.', tag: null });
  }
  let cand = toks.map((t, i) => i).filter((i) => toks[i].tag && TAGCOL[toks[i].tag] != null && !toks[i].contr && toks[i].vpart !== 'sep');
  const pref = cand.filter((i) => toks[i].tag === wantTag);
  if (pref.length) cand = pref;
  const idx = r.pick(cand);
  return { html: joinToks(toks, [idx], true), col: TAGCOL[toks[idx].tag], tag: toks[idx].tag, word: toks[idx].w };
}
reg('D1.wort', { skill: 'D1', title: 'Wortart bestimmen', diff: 2, quick: true }, (r) => {
  const row = wortartRow(r, r.pick(['V', 'N', 'A', 'P', 'P', 'K', 'PR', 'X', 'X']));
  return { html: 'Bestimme die Wortart des hervorgehobenen Worts.', fields: [{ id: 'a', type: 'classify', rows: [row.html], cols: COLS7, answers: [row.col] }], solution: steps([`«${esc(row.word)}» ist hier: <b>${COLS7[row.col]}</b>.`, WHY[row.tag]]) };
});
reg('D1.steigerung', { skill: 'D1', title: 'Adjektive steigern', diff: 1, quick: true }, (r) => { const it = pickDB(r, 'steigerung');
  return { html: `Steigere das Adjektiv <b>${esc(it.p)}</b>.`, fields: [{ id: 'a', type: 'text', label: 'Komparativ', answers: [it.k], ci: true }, { id: 'b', type: 'text', label: 'Superlativ (mit «am»)', answers: [it.s], ci: true }], solution: steps([`${it.p} – ${it.k} – ${it.s}`, 'Was sich so steigern lässt, ist ein Adjektiv.']) }; });

// ---------- D2 Verbteile ----------
reg('D2.teile', { skill: 'D2', title: 'Verbteile finden', diff: 2, quick: true }, (r) => {
  const kind = r.pick(['pers', 'pp', 'inf', 'sep', 'alle']);
  let cl;
  if (kind === 'pp') cl = randClause(r, { tense: r.pick(['perf', 'plus']) });
  else if (kind === 'inf') cl = randClause(r, { tense: 'fut' });
  else if (kind === 'sep') cl = randClause(r, { tense: r.pick(['pres', 'pret']), verb: r.pick(VERBS.filter((v) => v.sep)) });
  else cl = randClause(r);
  const toks = linearize(cl, 'main', cl.adv && r.bool(0.3) ? 'ADV' : 'S');
  const want = (t) => t.tag === 'V' && (kind === 'alle' || t.vpart === kind);
  const ans = toks.map((t, i) => (want(t) ? i : -1)).filter((i) => i >= 0);
  const label = { pers: 'die Personalform', pp: 'das Partizip II', inf: 'den Infinitiv', sep: 'den Verbzusatz', alle: 'alle verbalen Teile' }[kind];
  return { html: `Klicke ${label} an.`, fields: [{ id: 'a', type: 'tokens', tokens: toks.map((t, i) => (i === 0 ? cap(t.w) : t.w)), answer: ans }],
    solution: steps([`Satz: ${esc(sentence(toks))}`, 'Personalform: der Verbteil, der sich mit der Person ändert (ich …, du …). Im Aussagesatz steht sie an 2. Stelle.', 'Partizip II (gekauft, gegangen) und Infinitiv (kaufen) stehen am Satzende, ebenso der Verbzusatz (an, auf, ein, mit, zu).']) };
});

// ---------- D3 Zeitformen ----------
const TENSES = ['pres', 'pret', 'perf', 'plus', 'fut'];
const BOTH_AUX = ['sitzen', 'stehen']; // in der Schweiz auch «ist gesessen / gestanden»: nicht abfragen
function tenseItem(r) {
  const from = r.pick(TENSES); let to; do { to = r.pick(TENSES); } while (to === from);
  let cl; do { cl = randClause(r, { tense: from, adv: false, adjP: 0.3, pron: 0.3 }); } while (BOTH_AUX.includes(cl.verb.inf) && [from, to].some((t) => t === 'perf' || t === 'plus'));
  if (r.bool(0.4)) cl.adv = r.pick(NEUTRAL_ADV);
  const a = sentence(linearize(cl)), b = sentence(linearize(Object.assign({}, cl, { tense: to })));
  return { from, to, a, b, cl };
}
reg('D3.umformen', { skill: 'D3', title: 'Satz in eine andere Zeitform setzen', diff: 3 }, (r) => { const it = tenseItem(r); const v = it.cl.verb;
  return { html: `Setze den Satz ins <b>${TENSE_NAME[it.to]}</b>. Ändere nur die Verbform.<br>${q(esc(it.a))}`, fields: [{ id: 'a', type: 'text', long: true, answers: [it.b], aria: 'Satz in der neuen Zeitform' }],
    solution: steps([`Verb: ${v.inf} (Präteritum: ${v.pret}, Partizip II: ${v.pp}, Hilfsverb: ${v.aux === 's' ? 'sein' : 'haben'})`, `${TENSE_NAME[it.to]}: ${{ pres: 'Personalform im Präsens', pret: 'Personalform im Präteritum', perf: 'Präsens von haben/sein + Partizip II', plus: 'Präteritum von haben/sein (hatte/war) + Partizip II', fut: 'Präsens von werden + Infinitiv' }[it.to]}`, esc(it.b)]) };
});
reg('D3.bestimmen', { skill: 'D3', title: 'Zeitform bestimmen', diff: 1, quick: true }, (r) => { const cl = randClause(r, { adv: 0.3, pron: 0.3 }); const names = TENSES.map((t) => TENSE_NAME[t]);
  return { html: `In welcher Zeitform steht der Satz?<br>${q(esc(sentence(linearize(cl))))}`, fields: [{ id: 'a', type: 'mc', options: names, answer: TENSES.indexOf(cl.tense) }], solution: steps([`${TENSE_NAME[cl.tense]}: ${{ pres: 'nur eine Personalform in der Gegenwart', pret: 'nur eine Personalform in der Vergangenheit', perf: 'haben/sein im Präsens + Partizip II', plus: 'hatte/war + Partizip II', fut: 'werden + Infinitiv' }[cl.tense]}`]) }; });
const PERSON_NAME = { '1s': '1. Person Singular (ich)', '3s': '3. Person Singular (er/sie/es)', '1p': '1. Person Plural (wir)', '3p': '3. Person Plural (sie)', '2s': '2. Person Singular (du)' };
reg('D3.form', { skill: 'D3', title: 'Verbform bilden', diff: 2, quick: true }, (r) => {
  const tense = r.pick(['pret', 'pret', 'perf', 'pres']); const v = r.pick(VERBS.filter((x) => !x.sep && !(tense === 'perf' && BOTH_AUX.includes(x.inf)))); const p = r.pick(tense === 'pres' ? ['2s', '3s'] : ['1s', '3s', '1p', '3p']);
  const subj = { '1s': 'ich', '2s': 'du', '3s': 'er', '1p': 'wir', '3p': 'sie' }[p];
  const form = tense === 'perf' ? auxForm(v.aux === 's' ? 'sein' : 'haben', 'pres', p) + ' ' + v.pp : finite(v, tense, p);
  return { html: `Bilde die Verbform: <b>${v.inf}</b>, ${PERSON_NAME[p]}, ${TENSE_NAME[tense]}.`, fields: [{ id: 'a', type: 'text', pre: subj, answers: [form, subj + ' ' + form], ci: false }], solution: steps([`${subj} ${form}`, v.pret.endsWith('te') ? 'Regelmässiges (schwaches) Verb: Präteritum mit -te, Partizip II mit -t.' : 'Unregelmässiges (starkes) Verb: Der Stammvokal ändert sich. Diese Formen muss man auswendig können.']) };
});

// ---------- D4 Modus ----------
const IMP = { nehmen: 'nimm', lesen: 'lies', essen: 'iss', vergessen: 'vergiss', sehen: 'sieh', helfen: 'hilf', geben: 'gib' };
const needsE = (stem) => /[td]$/.test(stem) || /[^lrhmnaeiouäöü][mn]$/.test(stem);
function imperativ(v) { const inf = v.sep ? v.inf.slice(v.sep.length) : v.inf; if (IMP[inf]) return IMP[inf]; const stem = inf.slice(0, -2); return needsE(stem) ? stem + 'e' : stem; }
const MODI = ['Indikativ', 'Konjunktiv I', 'Konjunktiv II', 'Imperativ'];
const MCOL = { I: 0, K1: 1, K2: 2, IMP: 3 };
function infPhrase(cl) { const out = []; if (cl.dat) out.push(words(npToks(cl.dat, 'D'))); if (cl.acc) out.push(words(npToks(cl.acc, 'A'))); if (cl.pp) out.push(plain(linearize({ subj: { pron: '1s' }, verb: cl.verb, tense: 'pres', pp: cl.pp }).slice(2).filter((t) => t.role === 'PP'))); out.push(cl.verb.inf); return out.join(' '); }
function modusRow(r, want) {
  const m = want || r.pick(['I', 'K1', 'K2', 'IMP']);
  if (DB.modus.length && r.bool(0.45)) { const it = pickDB(r, 'modus', (x) => x.m === m); return { html: esc(it.s).replace(/\[([^\]]+)\]/, (_, w) => mark(w)), m, f: it.f, word: (it.s.match(/\[([^\]]+)\]/) || [])[1] }; }
  if (m === 'I') { const cl = randClause(r, { tense: r.pick(['pres', 'pret']), adv: 0.4 }); const toks = linearize(cl); const i = toks.findIndex((t) => t.vpart === 'pers'); return { html: joinToks([...toks, '.'], [i]), m, f: 'Wirklichkeit', word: toks[i].w }; }
  if (m === 'IMP') { const v = r.pick(verbsOf('A', 'D', 'AP')); const cl = randClause(r, { verb: v, tense: 'pres', adv: false }); const plural = r.bool(0.3);
    const obj = cl.acc ? words(npToks(Object.assign({}, cl.acc, { det: r.pick(['def', plural ? 'eur' : 'dein', 'dies']) === 'eur' ? 'def' : r.pick(['def', 'dein', 'dies']) }), 'A')) : words(npToks(Object.assign({}, cl.dat, { det: r.pick(['def', 'dein']) }), 'D'));
    const form = plural ? finite(v, 'pres', '2p') : imperativ(v); const bitte = r.bool(0.4);
    return { html: mark(cap(form)) + ' ' + (bitte ? 'bitte ' : '') + esc(obj) + (v.sep ? ' ' + v.sep : '') + '!', m, f: bitte ? 'Bitte' : 'Befehl', word: cap(form) }; }
  if (m === 'K2') { const cl = randClause(r, { frames: ['A', 'D', 'R', 'DA'], tense: 'pres', adv: false, adjP: 0.2 }); const t = r.int(0, 2); const ph = infPhrase(cl);
    if (t === 0) { const p = r.pick([['ich', 'ich', 'hätte', 'würde'], ['wir', 'wir', 'hätten', 'würden'], ['er', 'er', 'hätte', 'würde'], ['sie', 'sie', 'hätte', 'würde']]); return { html: `Wenn ${p[0]} mehr Zeit ${p[2]}, ${mark(p[3])} ${p[1]} ${esc(ph)}.`, m, f: 'Vorstellung, nicht Wirklichkeit', word: p[3] }; }
    if (t === 1) { const s = words(npToks(cl.subj, 'N')); return { html: `${esc(cap(s))} ${mark(cl.subj.plural ? 'würden' : 'würde')} gern ${esc(ph)}.`, m, f: 'Wunsch', word: cl.subj.plural ? 'würden' : 'würde' }; }
    const c2 = randClause(r, { frames: ['DA'], tense: 'pres', adv: false, adjP: 0.2 }); return { html: `${mark('Könntest')} du mir bitte ${esc(words(npToks(Object.assign({}, c2.acc, { det: 'def' }), 'A')))} ${c2.verb.inf}?`, m, f: 'Bitte', word: 'Könntest' }; }
  // Konjunktiv I: indirekte Rede, nur 3. Person Singular (dort ist die Form eindeutig)
  const cl = randClause(r, { tense: r.pick(['pres', 'perf']), adv: 0.3, adjP: 0.2 }); cl.subj = Object.assign({}, cl.subj, { plural: false }); if (cl.subj.det === undefined) cl.subj = { noun: 'Nachbar', det: 'def' };
  const who = r.pick(['Die Lehrerin sagt', 'Mein Bruder behauptet', 'In der Zeitung steht', 'Sie erzählt', 'Er meint']);
  const toks = linearize(cl); const i = toks.findIndex((t) => t.vpart === 'pers');
  const k1 = cl.tense === 'perf' ? (cl.verb.aux === 's' ? 'sei' : 'habe') : konj1(cl.verb);
  toks[i] = Object.assign({}, toks[i], { w: k1 });
  return { html: `${who}, ${joinToks(toks, [i]).replace(/^./, (c) => c.toLowerCase())}.`, m, f: 'indirekte Rede', word: k1 };
}
const MWHY = { I: 'Indikativ: Etwas wird als wirklich dargestellt.', K1: 'Konjunktiv I: indirekte Rede. Jemand gibt wieder, was eine andere Person sagt (er habe, sie sei, er komme).', K2: 'Konjunktiv II: Vorstellung, Wunsch oder höfliche Bitte (wäre, hätte, käme, würde, könnte).', IMP: 'Imperativ: Befehlsform (Geh! Nimm! Wartet!).' };
reg('D4.bestimmen', { skill: 'D4', title: 'Modus bestimmen', diff: 2, quick: true }, (r) => { const row = modusRow(r);
  return { html: 'In welchem Modus steht die hervorgehobene Verbform?', fields: [{ id: 'a', type: 'classify', rows: [row.html], cols: MODI, answers: [MCOL[row.m]] }], solution: steps([`«${esc(row.word)}»: <b>${MODI[MCOL[row.m]]}</b>`, MWHY[row.m]]) }; });
const FUNKT = ['Wirklichkeit', 'Vorsatz', 'Vermutung', 'Bitte', 'Befehl', 'Verbot', 'indirekte Rede', 'Wunsch'];
reg('D4.funktion', { skill: 'D4', title: 'Modus und Funktion', diff: 3 }, (r) => { const it = pickDB(r, 'modus', (x) => FUNKT.includes(x.f)); const others = r.shuffle(FUNKT.filter((f) => f !== it.f)).slice(0, 3); const opts = r.shuffle([it.f, ...others]);
  return { html: `Bestimme Modus und Funktion der hervorgehobenen Verbform. In der Prüfung gibt es den Punkt nur, wenn beides stimmt.<br>${q(esc(it.s).replace(/\[([^\]]+)\]/, (_, w) => mark(w)))}`, fields: [{ id: 'a', type: 'mc', label: 'Funktion', options: opts, answer: opts.indexOf(it.f), group: 'g', points: 1 }, { id: 'b', type: 'mc', label: 'Modus', options: MODI, answer: MCOL[it.m], group: 'g', points: 0 }], solution: steps([`Funktion: ${it.f}`, `Modus: ${MODI[MCOL[it.m]]}`, MWHY[it.m]]) }; });
reg('D4.form', { skill: 'D4', title: 'Verbform ergänzen', diff: 3 }, (r) => { const it = pickDB(r, 'modusform');
  return { html: `Ergänze die passende Verbform (${esc(it.m)}).<br>${q(esc(it.s))}`, fields: [{ id: 'a', type: 'text', answers: it.a, aria: 'Verbform' }], solution: steps([esc(it.s.replace(/___\s*(\([^)]*\))?/, it.a[0])), it.why ? esc(it.why) : null]) }; });

// ---------- D5 Aktiv und Passiv ----------
function voiceRow(r) {
  const t = r.int(0, 4); const withAdv = (cl) => { if (r.bool(0.35)) cl.adv = advFor(r, cl.tense); return cl; };
  if (t === 4) { const cl = withAdv(randClause(r, { frames: ['R'], tense: r.pick(['perf', 'plus']), adv: false })); return { html: esc(sentence(linearize(cl))), a: 0, why: 'Aktiv: «sein» + Partizip II ist hier Perfekt oder Plusquamperfekt. Das Subjekt handelt selbst.' }; }
  let cl; do { cl = randClause(r, { frames: ['A', 'AP'], adv: false, adjP: 0.3 }); } while (!canPassive(cl));
  if (t === 0 || t === 3) { if (t === 3) cl.tense = 'fut'; withAdv(cl); return { html: esc(sentence(linearize(cl))), a: 0, why: t === 3 ? 'Aktiv: «werden» + Infinitiv ist Futur I. Das Subjekt handelt.' : 'Aktiv: Das Subjekt handelt.' }; }
  const p = toPassive(cl, r.bool(0.5)); if (t === 2) p.tense = 'pres'; withAdv(p);
  return { html: esc(sentence(linearize(p))), a: 1, why: 'Passiv: «werden» + Partizip II. Mit dem Subjekt geschieht etwas.' };
}
reg('D5.erkennen', { skill: 'D5', title: 'Aktiv oder Passiv?', diff: 2, quick: true }, (r) => { const rows = [voiceRow(r), voiceRow(r)];
  return { html: 'Steht der Satz im Aktiv oder im Passiv?', fields: [{ id: 'a', type: 'classify', rows: rows.map((x) => x.html), cols: ['Aktiv', 'Passiv'], answers: rows.map((x) => x.a), points: 1 }], solution: steps(rows.map((x) => x.why).filter((v, i, a) => a.indexOf(v) === i)) }; });

// ---------- D6 Fall ----------
const EVENTS = [['Unterricht', 'm', 'Unterrichts'], ['Pause', 'f', 'Pause'], ['Konzert', 'n', 'Konzerts'], ['Spiel', 'n', 'Spiels'], ['Reise', 'f', 'Reise'], ['Film', 'm', 'Films'], ['Gewitter', 'n', 'Gewitters'], ['Ausflug', 'm', 'Ausflugs'], ['Prüfung', 'f', 'Prüfung'], ['Training', 'n', 'Trainings']];
const EV_ADJ = ['lang', 'kurz', 'spannend', 'laut', 'letzt', 'ganz'];
function evNP(r, c, det = 'def') { const [w, g, gen] = r.pick(EVENTS); const adj = r.pick(EV_ADJ); const n = { w, g, pl: w, gen, k: 'e', nd: null }; return { nom: words(np(n, 'N', { det, adj })), form: words(np(n, c, { det, adj })) }; }
function pNP(r, klass, c, o = {}) { const pool = o.pool ? o.pool.map((x) => NOUN[x]) : nounsOf(klass); const n = r.pick(pool); const det = r.pick(o.dets || ['def', 'mein', 'unser', 'dies', 'ein', 'sein']); const adj = r.bool(0.75) ? r.pick(klass === 't' ? ADJ_T : ADJ_P) : null; return { nom: words(np(n, 'N', { det, adj })), form: words(np(n, c, { det, adj })) }; }
const NO_CONTR = ['mein', 'unser', 'dies', 'ein', 'sein']; // Begleiter, die nicht mit der Präposition verschmelzen
const FALL_CTX = [
  (r) => { const x = pNP(r, 'p', 'D'); return [`Wir gehen heute mit (${x.nom}) ins Kino.`, x, 'D', '«mit» verlangt den Dativ.']; },
  (r) => { const x = pNP(r, 'p', 'A'); return [`Dieses Geschenk ist für (${x.nom}).`, x, 'A', '«für» verlangt den Akkusativ.']; },
  (r) => { const x = pNP(r, 't', 'A', { pool: ['Regenschirm', 'Rucksack', 'Schlüssel', 'Jacke', 'Mütze', 'Handy', 'Brille', 'Hut'], dets: ['mein', 'dies', 'ein', 'sein'] }); return [`Ohne (${x.nom}) gehe ich nicht aus dem Haus.`, x, 'A', '«ohne» verlangt den Akkusativ.']; },
  (r) => { const x = evNP(r, 'G'); return [`Während (${x.nom}) blieb es im Saal ruhig.`, x, 'G', '«während» verlangt den Genitiv.']; },
  (r) => { const x = evNP(r, 'G'); return [`Wegen (${x.nom}) kamen wir später nach Hause.`, x, 'G', '«wegen» verlangt den Genitiv.']; },
  (r) => { const x = evNP(r, 'G'); return [`Trotz (${x.nom}) waren alle guter Laune.`, x, 'G', '«trotz» verlangt den Genitiv.']; },
  (r) => { const x = evNP(r, 'D', 'dies'); return [`Nach (${x.nom}) gingen alle nach Hause.`, x, 'D', '«nach» verlangt den Dativ.']; },
  (r) => { const x = pNP(r, 'p', 'D', { dets: NO_CONTR }); return [`Seit einem Jahr wohnt sie bei (${x.nom}).`, x, 'D', '«bei» verlangt den Dativ.']; },
  (r) => { const x = pNP(r, 'o', 'A', { pool: ['Garten', 'Park', 'Wald', 'Stadt', 'Dorf', 'Turnhalle'], dets: ['def', 'dies', 'unser'] }); return [`Der Hund rennt durch (${x.nom}).`, x, 'A', '«durch» verlangt den Akkusativ.']; },
  (r) => { const x = pNP(r, 'p', 'D'); const v = r.pick(['dankt', 'hilft', 'gratuliert', 'antwortet', 'vertraut']); return [`Die Trainerin ${v} (${x.nom}).`, x, 'D', `«${v}» verlangt ein Dativobjekt (Frage: Wem?).`]; },
  (r) => { const x = pNP(r, 'p', 'A'); const v = r.pick(['besucht', 'begrüsst', 'fragt', 'sieht', 'kennt']); return [`Der Trainer ${v} (${x.nom}).`, x, 'A', `«${v}» verlangt ein Akkusativobjekt (Frage: Wen?).`]; },
  (r) => { const x = pNP(r, 'p', 'G', { dets: ['def', 'mein', 'unser', 'dies'] }); const t = r.pick(['das Velo', 'die Tasche', 'der Hund', 'das Zimmer', 'die Stimme']); return [`Das ist ${t} (${x.nom}).`, x, 'G', 'Zugehörigkeit (Frage: Wessen?) steht im Genitiv.']; },
  (r) => { const x = pNP(r, 't', 'D', { pool: ['Stuhl', 'Koffer', 'Tasche', 'Buch', 'Rucksack', 'Paket'], dets: ['def', 'dies', 'mein'] }); return [`Die Katze schläft auf (${x.nom}).`, x, 'D', '«auf» mit der Frage «Wo?» verlangt den Dativ.']; },
  (r) => { const x = pNP(r, 't', 'A', { pool: ['Stuhl', 'Koffer', 'Tasche', 'Buch', 'Rucksack', 'Paket'], dets: ['def', 'dies', 'mein'] }); return [`Die Katze springt auf (${x.nom}).`, x, 'A', '«auf» mit der Frage «Wohin?» verlangt den Akkusativ.']; }
];
reg('D6.setzen', { skill: 'D6', title: 'In den richtigen Fall setzen', diff: 3 }, (r) => { const [s, x, c, why] = r.pick(FALL_CTX)(r);
  return { html: `Setze die Wortgruppe in der Klammer in den richtigen Fall. Die Zahl (Singular/Plural) bleibt gleich.<br>${q(esc(s))}`, fields: [{ id: 'a', type: 'text', answers: [x.form], aria: 'Wortgruppe im richtigen Fall' }], solution: steps([why, `${CASE_NAME[c]}: <b>${esc(x.form)}</b>`, 'Begleiter, Adjektiv und Nomen müssen alle zum Fall passen.']) }; });
reg('D6.bestimmen', { skill: 'D6', title: 'Fall bestimmen', diff: 2, quick: true }, (r) => {
  const cols = ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'];
  if (r.bool(0.3)) { const [s, x, c] = r.pick(FALL_CTX)(r); return { html: 'In welchem Fall steht die hervorgehobene Wortgruppe?', fields: [{ id: 'a', type: 'classify', rows: [esc(s).replace(/\(([^)]+)\)/, mark(x.form))], cols, answers: ['N', 'A', 'D', 'G'].indexOf(c) }].map((f) => Object.assign(f, { answers: [f.answers] })), solution: steps([`${CASE_NAME[c]}`, 'Frageprobe: Wer oder was? (Nominativ) – Wen oder was? (Akkusativ) – Wem? (Dativ) – Wessen? (Genitiv). Nach Präpositionen bestimmt die Präposition den Fall.']) }; }
  const cl = randClause(r, { frames: ['A', 'AP', 'D', 'DA'], adv: 0.3, tense: r.pick(['pres', 'pret']) }); const toks = linearize(cl); const role = r.pick(['S', cl.dat ? 'D' : 'A', cl.acc ? 'A' : 'D']);
  const idx = toks.map((t, i) => (t.role === role ? i : -1)).filter((i) => i >= 0); const c = role === 'S' ? 'N' : role;
  let html = ''; toks.forEach((t, i) => { const w = esc(i === 0 ? cap(t.w) : t.w); html += (i ? ' ' : '') + (i === idx[0] ? '<b class="mark">' : '') + w + (i === idx[idx.length - 1] ? '</b>' : ''); });
  return { html: 'In welchem Fall steht die hervorgehobene Wortgruppe?', fields: [{ id: 'a', type: 'classify', rows: [html + '.'], cols, answers: [['N', 'A', 'D', 'G'].indexOf(c)] }], solution: steps([`${CASE_NAME[c]}`, 'Frageprobe: Wer oder was? (Nominativ) – Wen oder was? (Akkusativ) – Wem? (Dativ) – Wessen? (Genitiv).']) };
});

// ---------- D7 Satzglieder ----------
const sameForm = (spec) => words(npToks(spec, 'N')) === words(npToks(spec, 'A'));
function objektItem(r) {
  if (DB.objekt.length && r.bool(0.45)) { const it = pickDB(r, 'objekt'); const { toks, spans } = parseBracket(it.s); const objs = spans.filter((s) => s.c !== 'S' && s.c !== 'N'); const sp = r.pick(objs);
    const clean = toks.slice(); return { toks: clean, idx: sp.idx, c: sp.c, multi: objs.length > 1 }; }
  const cl = randClause(r, { frames: ['A', 'AP', 'D', 'DA', 'TD'], adv: 0.5, tense: r.pick(['pres', 'pret', 'perf']), adjP: 0.5 });
  const role = cl.dat && cl.acc ? r.pick(['D', 'A']) : cl.dat ? 'D' : 'A';
  let front = 'S'; if (r.bool(0.3)) { if (cl.adv) front = 'ADV'; else if (role === 'D') front = 'D'; else if (role === 'A' && !sameForm(cl.acc) && !sameForm(cl.subj)) front = 'A'; }
  if (cl.acc && sameForm(cl.acc) && sameForm(cl.subj) && front !== 'S') front = cl.adv ? 'ADV' : 'S';
  const toks = linearize(cl, 'main', front);
  return { toks: toks.map((t, i) => (i === 0 ? cap(t.w) : t.w)), idx: toks.map((t, i) => (t.role === role ? i : -1)).filter((i) => i >= 0), c: role, multi: !!(cl.dat && cl.acc) };
}
const stripEnd = (toks) => toks.map((t) => t.replace(/[.!?]$/, ''));
reg('D7.objekt', { skill: 'D7', title: 'Objekt markieren und Fall bestimmen', diff: 3 }, (r) => { const it = objektItem(r); const cases = ['Akkusativ', 'Dativ', 'Genitiv']; const toks = stripEnd(it.toks);
  const sol = steps([`Objekt: <b>${esc(it.idx.map((i) => toks[i]).join(' '))}</b> (${CASE_NAME[it.c]}objekt)`, 'Frageprobe mit dem Verb: Wen oder was? (Akkusativ) – Wem? (Dativ) – Wessen? (Genitiv)', 'Zum Objekt gehören Begleiter, Adjektive und Nomen: das ganze Satzglied anklicken.']);
  if (it.multi) return { html: `Der Satz hat mehrere Objekte. Klicke alle Wörter des <b>${CASE_NAME[it.c]}objekts</b> an.`, fields: [{ id: 'a', type: 'tokens', tokens: toks, answer: it.idx }], solution: sol };
  return { html: 'Klicke alle Wörter des Objekts an und bestimme den Fall. Den Punkt gibt es nur, wenn beides stimmt.', fields: [{ id: 'a', type: 'tokens', tokens: toks, answer: it.idx, group: 'g', points: 1 }, { id: 'b', type: 'mc', label: 'Fall des Objekts', options: cases, answer: ['A', 'D', 'G'].indexOf(it.c), group: 'g', points: 0 }], solution: sol }; });
reg('D7.subjekt', { skill: 'D7', title: 'Subjekt finden', diff: 2, quick: true }, (r) => {
  const cl = randClause(r, { adv: 0.6, tense: r.pick(['pres', 'pret', 'perf']) }); let front = 'S'; if (r.bool(0.5)) front = cl.adv ? 'ADV' : cl.dat ? 'D' : cl.pp ? 'PP' : 'S';
  const toks = linearize(cl, 'main', front);
  return { html: 'Klicke alle Wörter des <b>Subjekts</b> an.', fields: [{ id: 'a', type: 'tokens', tokens: toks.map((t, i) => (i === 0 ? cap(t.w) : t.w)), answer: toks.map((t, i) => (t.role === 'S' ? i : -1)).filter((i) => i >= 0) }], solution: steps(['Frageprobe: Wer oder was + Personalform?', 'Das Subjekt steht im Nominativ und bestimmt die Personalform. Es steht nicht immer am Satzanfang.']) };
});

// ---------- D8 Sätze verbinden ----------
const KOORD = ['und', 'aber', 'denn', 'oder', 'sondern', 'doch'];
function clauseOf(str) { const [s, v, mm, e, vf] = str.split('|').map((x) => (x || '').trim()); return { s, v, m: mm, e, vf }; }
const J = (...xs) => xs.filter(Boolean).join(' ');
const mainOrder = (c) => J(c.s, c.v, c.m, c.e);
const invOrder = (c) => J(c.v, c.s, c.m, c.e);
const subOrder = (c) => J(c.s, c.m, c.vf ? c.vf : J(c.e, c.v));
function verbindeAnswers(it) {
  const A = clauseOf(it.main), B = clauseOf(it.sub), c = it.c;
  if (KOORD.includes(c)) { const out = [cap(mainOrder(A)) + ', ' + c + ' ' + mainOrder(B) + '.']; if (c === 'und' || c === 'oder') out.push(cap(mainOrder(A)) + ' ' + c + ' ' + mainOrder(B) + '.'); return out; }
  return [cap(mainOrder(A)) + ', ' + c + ' ' + subOrder(B) + '.', cap(c) + ' ' + subOrder(B) + ', ' + invOrder(A) + '.'];
}
reg('D8.verbinden', { skill: 'D8', title: 'Sätze mit Konjunktion verbinden', diff: 3 }, (r) => { const it = pickDB(r, 'verbinden'); const A = clauseOf(it.main), B = clauseOf(it.sub); const ans = verbindeAnswers(it);
  return { html: `Verbinde die beiden Sätze mit <b>${esc(it.c)}</b> zu einem Satz. Achte auf Wortstellung und Komma.<br>${q(esc(cap(mainOrder(A)) + '.'))}<br>${q(esc(cap(mainOrder(B)) + '.'))}`, fields: [{ id: 'a', type: 'text', long: true, answers: ans, selfOk: true, aria: 'Verbundener Satz' }],
    solution: steps([KOORD.includes(it.c) ? `«${it.c}» verbindet zwei Hauptsätze: Die Wortstellung bleibt.` : `«${it.c}» leitet einen Nebensatz ein: Die Personalform steht am Ende.`, ...ans.map(esc), 'Zwischen Hauptsatz und Nebensatz steht ein Komma.']) }; });
reg('D8.wahl', { skill: 'D8', title: 'Konjunktion nach Wortstellung wählen', diff: 2, quick: true }, (r) => {
  const pool = DB.verbinden.filter((x) => ['weil', 'obwohl'].includes(x.c) && (clauseOf(x.sub).m || clauseOf(x.sub).e)); if (!pool.length) throw new Error('Datenbank «verbinden» ist leer');
  const it = pool[r.int(0, pool.length - 1)]; const A = clauseOf(it.main), B = clauseOf(it.sub); const pair = it.c === 'weil' ? ['weil', 'denn'] : ['obwohl', 'aber']; const useSub = r.bool();
  const s = cap(mainOrder(A)) + ', ___ ' + (useSub ? subOrder(B) : mainOrder(B)) + '.';
  return { html: `Welche Konjunktion passt zur Wortstellung?<br>${q(esc(s))}`, fields: [{ id: 'a', type: 'mc', options: pair, answer: useSub ? 0 : 1 }], solution: steps([useSub ? `Die Personalform steht am Ende: Nebensatz. Es passt «${pair[0]}».` : `Die Personalform steht an 2. Stelle: Hauptsatz. Es passt «${pair[1]}».`]) };
});

// ---------- D9 Sätze umformen ----------
reg('D9.umformen', { skill: 'D9', title: 'Satz umformen', diff: 3 }, (r) => { const it = pickDB(r, 'umformen');
  return { html: `Forme um: <b>${esc(it.how)}</b>. Der Inhalt bleibt gleich.<br>${q(esc(it.src))}`, fields: [{ id: 'a', type: 'text', long: true, answers: it.answers, selfOk: true, aria: 'Umgeformter Satz' }], solution: steps([...it.answers.map(esc), 'Zeitform und Fall müssen stimmen. Der Nebensatz wird durch Komma abgetrennt.']) }; });
reg('D9.relativ', { skill: 'D9', title: 'Relativsatz bilden', diff: 3 }, (r) => {
  const c1 = randClause(r, { frames: ['A', 'D', 'DA', 'AP'], tense: r.pick(['pres', 'pret']), adv: false, adjP: 0.2 }); c1.subj = Object.assign({}, c1.subj, { det: 'def', plural: false });
  const c2 = randClause(r, { frames: ['L', 'R'], tense: c1.tense, adv: 0.3, adjP: 0.2 }); c2.subj = Object.assign({}, c1.subj, { adj: null });
  const n = NOUN[c1.subj.noun]; const rel = DEF[n.g][0];
  const subjW = words(npToks(c1.subj, 'N')); const mainRest = plain(linearize(c1).filter((t) => t.role !== 'S')); const subRest = plain(linearize(c2, 'sub').filter((t) => t.role !== 'S'));
  const ans = cap(subjW) + ', ' + rel + ' ' + subRest + ', ' + mainRest + '.';
  return { html: `Mache aus dem <b>zweiten</b> Satz einen Relativsatz und füge ihn in den ersten ein.<br>${q(esc(sentence(linearize(c1))))}<br>${q(esc(sentence(linearize(c2))))}`, fields: [{ id: 'a', type: 'text', long: true, answers: [ans], selfOk: true, aria: 'Satz mit Relativsatz' }],
    solution: steps([`Relativpronomen: «${rel}» (richtet sich nach «${n.w}»)`, 'Der Relativsatz steht direkt hinter dem Nomen, zwischen 2 Kommas. Die Personalform steht am Ende.', esc(ans)]) };
});

// ---------- D10 Wortfamilie ----------
const WF = { n: 'Nomen (mit Artikel)', v: 'Verb', a: 'Adjektiv' };
reg('D10.familie', { skill: 'D10', title: 'Wortfamilie', diff: 3 }, (r) => { const it = pickDB(r, 'wortfamilie'); const given = r.pick(['n', 'v', 'a']); const ask = ['n', 'v', 'a'].filter((k) => k !== given);
  return { html: `Bilde aus derselben Wortfamilie die fehlenden Wortarten zu <b>${esc(it[given][0])}</b> (${WF[given].replace(' (mit Artikel)', '')}). Nicht erlaubt: zusammengesetzte Wörter, nominalisierte Verben (das Laufen), Partizipien als Adjektive.`, fields: ask.map((k) => ({ id: k, type: 'text', label: WF[k], answers: it[k], selfOk: true })),
    solution: steps([`Nomen: ${it.n.map(esc).join(' / ')}`, `Verb: ${it.v.map(esc).join(' / ')}`, `Adjektiv: ${it.a.map(esc).join(' / ')}`]) }; });

// ---------- D11 Synonyme und Antonyme ----------
reg('D11.streichen', { skill: 'D11', title: 'Welches Wort passt nicht?', diff: 2, quick: true }, (r) => { const it = pickDB(r, 'synonym'); const sh = r.shuffle(it.g); const base = sh[0]; const syn = sh.slice(1, 4); const odd = r.pick(it.x); const opts = r.shuffle([...syn, odd]);
  return { html: `${syn.length === 3 ? 'Drei' : 'Zwei'} dieser Wörter bedeuten etwa dasselbe wie <b>${esc(base)}</b>, eines nicht. Welches passt <b>nicht</b>?`, fields: [{ id: 'a', type: 'mc', options: opts.map(esc), answer: opts.indexOf(odd) }], solution: steps([`Synonyme: ${it.g.map(esc).join(', ')}`, `«${esc(odd)}» bedeutet etwas anderes.`]) }; });
reg('D11.synonym', { skill: 'D11', title: 'Synonym wählen', diff: 2, quick: true }, (r) => { const it = pickDB(r, 'synonym'); const [w, syn] = r.sample(it.g, 2); const others = DB.synonym.filter((x) => x !== it); const dis = [r.pick(it.x), ...r.sample(others, 2).map((x) => r.pick(x.g))]; const opts = r.shuffle([syn, ...dis]);
  return { html: `Welches Wort hat die gleiche Bedeutung wie <b>${esc(w)}</b>?`, fields: [{ id: 'a', type: 'mc', options: opts.map(esc), answer: opts.indexOf(syn) }], solution: steps([`${esc(w)} = ${esc(syn)}`, `Weitere Synonyme: ${it.g.filter((x) => x !== w && x !== syn).map(esc).join(', ') || '–'}`]) }; });
reg('D11.antonym', { skill: 'D11', title: 'Antonym finden', diff: 3 }, (r) => { const it = pickDB(r, 'antonym');
  return { html: `Schreibe ein Antonym (Gegenwort) zum hervorgehobenen Wort. Es muss in den Zusammenhang passen. Nicht mit «un-» bilden.<br>${q(esc(it.s).replace(new RegExp((it.m || it.w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\p{L}*', 'u'), (x) => mark(x)))}`, fields: [{ id: 'a', type: 'text', answers: it.a, ci: true, selfOk: true, aria: 'Antonym' }], solution: steps([`${esc(it.w)} ↔ ${it.a.map(esc).join(' / ')}`, 'Gleiche Wortart wie das Ausgangswort. «un-» + Wort zählt nicht.']) }; });

// ---------- D12 Ober- und Unterbegriffe, Wortfelder ----------
reg('D12.oberbegriff', { skill: 'D12', title: 'Oberbegriff finden', diff: 2, quick: true }, (r) => { const it = pickDB(r, 'oberbegriff'); const u = r.sample(it.u, Math.min(4, it.u.length));
  if (r.bool()) { const other = pickDB(r, 'oberbegriff', (x) => x !== it); const odd = r.pick(other.u); const opts = r.shuffle([...u.slice(0, 3), odd]);
    return { html: 'Drei Wörter haben einen gemeinsamen Oberbegriff. Welches Wort gehört <b>nicht</b> dazu?', fields: [{ id: 'a', type: 'mc', options: opts.map(esc), answer: opts.indexOf(odd) }], solution: steps([`Oberbegriff: ${esc(it.o[0])}`, `«${esc(odd)}» gehört zu: ${esc(other.o[0])}`]) }; }
  return { html: `Nenne den Oberbegriff: ${u.map(esc).join(', ')}`, fields: [{ id: 'a', type: 'text', answers: it.o, selfOk: true, aria: 'Oberbegriff' }], solution: steps([`Oberbegriff: ${it.o.map(esc).join(' / ')}`, 'Der Oberbegriff fasst alle Wörter zusammen und ist nicht zu weit (nicht einfach «Dinge»).']) }; });
reg('D12.wortfeld', { skill: 'D12', title: 'Wortfeld: treffendes Wort', diff: 2, quick: true }, (r) => { const it = pickDB(r, 'wortfeld'); const same = DB.wortfeld.filter((x) => x.feld === it.feld && x !== it); const dis = r.sample(same.length >= 3 ? same : DB.wortfeld.filter((x) => x !== it), 3).map((x) => x.w); const opts = r.shuffle([it.w, ...dis]);
  return { html: `Wortfeld «${esc(it.feld)}»: Welches Wort bedeutet <b>${esc(it.d)}</b>?`, fields: [{ id: 'a', type: 'mc', options: opts.map(esc), answer: opts.indexOf(it.w) }], solution: steps([`${esc(it.w)}: ${esc(it.d)}`]) }; });

// ---------- D14 Komma ----------
function kommaItem(r) {
  const t = r.int(0, 9);
  if (t <= 3 && DB.komma.length) return pickDB(r, 'komma').s;
  if (t <= 5 && DB.verbinden.length) { const it = pickDB(r, 'verbinden', (x) => !['und', 'oder'].includes(x.c)); return r.pick(verbindeAnswers(it)); }
  if (t <= 7) { const items = r.sample(nounsOf('t'), 4).map((n) => words(np(n, 'A', { det: 'ein', adj: r.bool(0.4) ? r.pick(ADJ_T) : null }))); const who = r.pick(['Im Rucksack habe ich', 'Für die Reise packt sie', 'Auf dem Tisch sehe ich', 'Im Laden kaufen wir']); return `${who} ${items[0]}, ${items[1]}, ${items[2]} und ${items[3]}.`; }
  const c1 = randClause(r, { frames: ['A', 'D', 'DA'], tense: r.pick(['pres', 'pret']), adv: false, adjP: 0.2 }); c1.subj = Object.assign({}, c1.subj, { det: 'def', plural: false });
  const c2 = randClause(r, { frames: ['L', 'R'], tense: c1.tense, adv: 0.3, adjP: 0.2 }); c2.subj = Object.assign({}, c1.subj, { adj: null }); const n = NOUN[c1.subj.noun];
  return cap(words(npToks(c1.subj, 'N'))) + ', ' + DEF[n.g][0] + ' ' + plain(linearize(c2, 'sub').filter((x) => x.role !== 'S')) + ', ' + plain(linearize(c1).filter((x) => x.role !== 'S')) + '.';
}
function gapsOf(s) { const raw = s.trim().split(/\s+/); const tokens = raw.map((w) => w.replace(/,$/, '')); const answer = raw.map((w, i) => (w.endsWith(',') ? i : -1)).filter((i) => i >= 0); return { tokens, answer }; }
reg('D14.komma', { skill: 'D14', title: 'Kommas setzen', diff: 3, quick: true }, (r) => { const s = kommaItem(r); const g = gapsOf(s);
  return { html: 'Setze alle fehlenden Kommas.', fields: [{ id: 'a', type: 'gaps', tokens: g.tokens, answer: g.answer }], solution: steps([esc(s), 'Komma: zwischen Hauptsatz und Nebensatz (vor weil, dass, obwohl, wenn, als, während …), vor und nach einem eingeschobenen Relativsatz, zwischen den Gliedern einer Aufzählung (nicht vor «und» / «oder»), vor aber, denn, sondern.']) }; });

// ---------- D15 Rechtschreibung ----------
reg('D15.dasdass', { skill: 'D15', title: 'das oder dass?', diff: 2, quick: true }, (r) => {
  const t = r.int(0, 2);
  if (t === 0) { const cl = randClause(r, { tense: r.pick(['pres', 'perf', 'fut']), adv: 0.3, adjP: 0.2 }); const who = r.pick(['Ich glaube', 'Wir hoffen', 'Sie sagt', 'Er weiss', 'Ich finde es gut', 'Niemand merkt', 'Es ist klar']);
    return { html: `das oder dass?<br>${q(esc(`${who}, ___ ${plain(linearize(cl, 'sub'))}.`))}`, fields: [{ id: 'a', type: 'mc', options: ['das', 'dass'], answer: 1 }], solution: steps(['«dass» ist eine Konjunktion: Sie leitet einen Nebensatz ein.', 'Probe: Lässt sich das Wort nicht durch «dieses», «jenes» oder «welches» ersetzen, schreibt man «dass».']) }; }
  if (t === 1) { const n = r.pick(nounsOf('t').filter((x) => x.g === 'n')); const cl = randClause(r, { frames: ['A'], verb: r.pick(VERBS.filter((v) => v.frame === 'A' && v.objs.includes(n.w))), tense: r.pick(['pres', 'pret', 'perf']), adv: 0.3 }); const sub = plain(linearize(cl, 'sub').filter((x) => x.role !== 'A'));
    const end = r.pick(['ist neu', 'war teuer', 'gefällt mir', 'liegt auf dem Tisch', 'gehört meiner Schwester']);
    return { html: `das oder dass?<br>${q(esc(`Das ${n.w}, ___ ${sub}, ${end}.`))}`, fields: [{ id: 'a', type: 'mc', options: ['das', 'dass'], answer: 0 }], solution: steps([`«das» ist hier ein Relativpronomen: Es bezieht sich auf «das ${n.w}».`, 'Probe: Ersetzbar durch «welches»: also «das».']) }; }
  const it = r.pick([['___ Wetter war schön, aber kalt.', 0, 'Artikel: «das Wetter».'], ['Ich weiss, ___ das nicht stimmt.', 1, 'Konjunktion: leitet den Nebensatz ein.'], ['___ habe ich nicht gewusst.', 0, 'Pronomen: ersetzbar durch «dies».'], ['Sie freut sich, ___ du kommst.', 1, 'Konjunktion: nicht ersetzbar durch «dieses» oder «welches».'], ['Ist ___ dein Ernst?', 0, 'Pronomen: ersetzbar durch «dies».'], ['Es regnete so stark, ___ wir umkehrten.', 1, 'Konjunktion (so …, dass).'], ['Ich hoffe, ___ das Spiel, ___ wir sehen, spannend wird. (1. Lücke)', 1, 'Konjunktion nach «ich hoffe». Die 2. Lücke ist das Relativpronomen «das».']]);
  return { html: `das oder dass?<br>${q(esc(it[0]))}`, fields: [{ id: 'a', type: 'mc', options: ['das', 'dass'], answer: it[1] }], solution: steps([it[2], 'Probe: Ersetzbar durch «dieses», «jenes» oder «welches» → «das». Sonst «dass».']) };
});
reg('D15.gross', { skill: 'D15', title: 'Gross oder klein?', diff: 2, quick: true }, (r) => { const it = pickDB(r, 'nominal'); const order = r.shuffle(it.o.map((_, i) => i));
  return { html: `Welche Schreibweise ist richtig?<br>${q(esc(it.s))}`, fields: [{ id: 'a', type: 'mc', options: order.map((i) => esc(it.o[i])), answer: order.indexOf(it.a) }], solution: steps([esc(it.s.replace('___', it.o[it.a])), it.why ? esc(it.why) : null]) }; });
reg('D15.schreibung', { skill: 'D15', title: 'Richtig geschrieben?', diff: 2, quick: true }, (r) => { const it = pickDB(r, 'schreibung'); const order = r.shuffle(it.o.map((_, i) => i));
  return { html: (it.s ? `Welches Wort passt?<br>${q(esc(it.s))}` : 'Welche Schreibweise ist richtig?'), fields: [{ id: 'a', type: 'mc', options: order.map((i) => esc(it.o[i])), answer: order.indexOf(it.a) }], solution: steps([it.s ? esc(it.s.replace('___', it.o[it.a])) : `Richtig: ${esc(it.o[it.a])}`, it.why ? esc(it.why) : null]) }; });

const WRONG = { 'nämlich': 'nähmlich', 'ziemlich': 'ziehmlich', 'vielleicht': 'villeicht', 'plötzlich': 'plözlich', 'eigentlich': 'eigendlich', 'endlich': 'entlich', 'wahrscheinlich': 'warscheinlich', 'während': 'wärend', 'allmählich': 'allmälich', 'interessant': 'interresant', 'überhaupt': 'überhaubt', 'ausserdem': 'auserdem', 'spazieren': 'spatzieren', 'wieder': 'wider', 'trotzdem': 'trozdem', 'schliesslich': 'schlieslich', 'bisschen': 'bischen', 'vorbei': 'forbei', 'fertig': 'vertig', 'ungefähr': 'ungefär', 'Rhythmus': 'Rythmus', 'Fahrrad': 'Fahrad', 'Bibliothek': 'Bibliotek', 'Maschine': 'Maschiene', 'kaputt': 'kaput', 'tatsächlich': 'tatsächlig', 'selbstständig': 'selbstständich', 'wussten': 'wusten', 'musste': 'muste', 'liess': 'lies', 'fiel': 'viel', 'seid': 'seit', 'wäre': 'währe', 'hätte': 'hette', 'zurück': 'zurük', 'stets': 'stehts', 'niemand': 'niemant', 'morgens': 'Morgens', 'nichts': 'nichtz', 'jetzt': 'jetz', 'ging': 'gieng', 'gab': 'gaab' };
function injectErrors(r, text, n) {
  const toks = text.trim().split(/\s+/); const cand = [];
  toks.forEach((w, i) => {
    const core = w.replace(/[.,;:!?»«"]/g, '');
    if (w.endsWith(',')) cand.push({ i, kind: 'komma', bad: w.slice(0, -1) });
    if (core === 'dass') cand.push({ i, kind: 'dass', bad: w.replace('dass', 'das') });
    if (WRONG[core]) cand.push({ i, kind: 'wort', bad: w.replace(core, WRONG[core]) });
    const prev = i > 0 ? toks[i - 1] : '.';
    if (/^[A-ZÄÖÜ][a-zäöü]{3,}/.test(core) && !/[.!?:«]$/.test(prev) && i > 0) cand.push({ i, kind: 'gross', bad: w.charAt(0).toLowerCase() + w.slice(1) });
  });
  const chosen = []; const used = new Set(); const quota = { komma: 2, dass: 1, wort: 2, gross: 2 };
  for (const c of r.shuffle(cand)) { if (chosen.length >= n) break; if (used.has(c.i) || quota[c.kind] <= 0) continue; quota[c.kind]--; used.add(c.i); chosen.push(c); }
  if (chosen.length < n) for (const c of r.shuffle(cand)) { if (chosen.length >= n) break; if (used.has(c.i)) continue; used.add(c.i); chosen.push(c); }
  const bad = toks.slice(); chosen.forEach((c) => { bad[c.i] = c.bad; });
  return { text: bad.join(' '), correct: toks.join(' '), errors: chosen.length, list: chosen.map((c) => ({ falsch: c.bad, richtig: toks[c.i], kind: c.kind })) };
}
const KIND = { komma: 'Komma fehlt', dass: 'das/dass', wort: 'Rechtschreibung', gross: 'Grossschreibung (Nomen)' };
function fehlerTask(r, n, skill) { const it = pickDB(r, 'fehlertext'); const e = injectErrors(r, it.t, n);
  return { html: `Der Text enthält <b>${e.errors} Fehler</b> (fehlende Kommas, Rechtschreibung). Verbessere sie direkt im Text. In der Prüfung kosten mehr als ${e.errors} Änderungen Punkte.`, fields: [{ id: 'a', type: 'edit', text: e.text, correct: e.correct, errors: e.errors }],
    solution: steps(e.list.map((x) => `<s>${esc(x.falsch)}</s> → <b>${esc(x.richtig)}</b> (${KIND[x.kind]})`)) }; }
reg('D15.fehlertext', { skill: 'D15', title: 'Fehler korrigieren', diff: 3, pts: 5 }, (r) => fehlerTask(r, 5));
reg('D28.ueberarbeiten', { skill: 'D28', title: 'Text überarbeiten', diff: 3, pts: 6 }, (r) => fehlerTask(r, 6));

// ---------- Aufsatz-Bausteine, Quiz ----------
const AUFTRAG_VERBEN = ['beschreibe', 'beschreib', 'erkläre', 'erläutere', 'erörtere', 'begründe', 'erzähle', 'erzähl', 'nimm', 'schildere', 'zeige', 'nenne', 'beurteile', 'berichte', 'vergleiche', 'überlege', 'schreibe', 'schreib', 'stelle', 'führe', 'äussere', 'diskutiere', 'wähle', 'gib', 'lege', 'mache', 'mach', 'denke', 'setze', 'behalte', 'baue', 'stell', 'zeig'];
reg('D20.auftrag', { skill: 'D20', title: 'Auftrag zerlegen', diff: 2 }, (r) => { const it = pickDB(r, 'aufsatz', (x) => x.auftrag.length >= 2); const toks = it.auftrag.join(' ').split(/\s+/);
  const ans = toks.map((w, i) => (AUFTRAG_VERBEN.includes(w.toLowerCase().replace(/[.,:;!?]/g, '')) ? i : -1)).filter((i) => i >= 0);
  if (!ans.length) return { html: `Thema «${esc(it.title)}»: Wie viele Teilaufträge enthält der Auftrag?<br>${q(esc(it.auftrag.join(' ')))}`, fields: [{ id: 'b', type: 'num', label: 'Anzahl Teilaufträge', answer: it.auftrag.length }], solution: steps(it.auftrag.map(esc)) };
  return { html: `Thema «${esc(it.title)}». Klicke alle <b>Auftragsverben</b> an (die Wörter, die sagen, was du tun musst).`, fields: [{ id: 'a', type: 'tokens', tokens: toks, answer: ans }],
    solution: steps([`Auftragsverben: ${ans.map((i) => esc(toks[i])).join(', ')}`, ...it.auftrag.map((a, i) => `Satz ${i + 1}: ${esc(a)}`), 'Jeder Auftrag und jede Vorgabe muss im Aufsatz erfüllt sein. Fehlt etwas, gibt es Abzug beim Inhalt.']) }; });
reg('D21.plan', { skill: 'D21', title: 'In 10 Minuten planen', diff: 2 }, (r) => { const it = pickDB(r, 'aufsatz'); const er = it.typ === 'erzaehlung' || it.typ === 'fortsetzung';
  return { html: `Plane diesen Aufsatz in <b>10 Minuten</b> (Stichwörter, 1 Zeile pro Absatz). Nicht ausformulieren.<br><b>${esc(it.title)}</b><br>${it.auftrag.map((a) => q(esc(a))).join('<br>')}`,
    fields: [{ id: 'a', type: 'self', rows: 9, placeholder: 'Stichwortplan: 1 Zeile pro Absatz', model: er ? 'Einleitung: wer, wo, wann (1–2 Sätze) · Auslöser · Spannung steigt (2–3 Schritte) · Höhepunkt mit Gedanken und Gefühlen · passender Schluss' : 'Einleitung: genau das Verlangte (Begriff, Bild oder Rolle) · Hauptteil: 2–3 Argumente pro Seite, je Behauptung → Begründung → Beispiel · Schluss: eigene Meinung, kurz begründet, kein neues Argument',
      checklist: er ? [{ text: 'Jeder Teilauftrag und jede Vorgabe kommt im Plan vor.' }, { text: 'Einleitung, Höhepunkt und Schluss sind geplant.' }, { text: 'Gedanken und Gefühle sind eingeplant.' }, { text: 'Der Plan hat 5 bis 8 Zeilen und ist in 10 Minuten fertig.' }] : [{ text: 'Jeder Teilauftrag kommt im Plan vor.' }, { text: 'Beide Seiten (Vor- und Nachteile) haben je 2 bis 3 Argumente.' }, { text: 'Zu jedem Argument steht ein Beispiel.' }, { text: 'Der Schluss enthält meine Meinung.' }] }],
    solution: steps(['Zuerst Auftragsverben und Teilaufträge markieren.', 'Pro Absatz 1 Zeile. Das stärkste Argument kommt zuletzt.', 'Zeit: 10 Minuten planen, 60 schreiben, 15 überarbeiten.']) }; });
function bausteinGen(skill) { return (r) => { const it = pickDB(r, 'baustein', (x) => x.skill === skill); const idx = r.shuffle(it.rows.map((_, i) => i)).slice(0, Math.min(5, it.rows.length));
  return { html: esc(it.kind), fields: [{ id: 'a', type: 'classify', rows: idx.map((i) => esc(it.rows[i])), cols: it.cols, answers: idx.map((i) => it.a[i]), points: Math.min(3, idx.length) }], solution: steps([it.why ? esc(it.why) : 'Vergleiche jede Zeile mit der Regel aus der Theorie.']) }; }; }
['D22', 'D23', 'D24', 'D25', 'D26', 'D27'].forEach((s) => reg(s + '.baustein', { skill: s, title: 'Bausteine zuordnen', diff: 2 }, bausteinGen(s)));
function quizGen(skill) { return (r) => { const it = pickDB(r, 'quiz', (x) => x.skill === skill); const order = r.shuffle(it.o.map((_, i) => i));
  return { html: esc(it.q), fields: [{ id: 'a', type: 'mc', options: order.map((i) => esc(it.o[i])), answer: order.indexOf(it.a) }], solution: steps([it.why ? esc(it.why) : `Richtig: ${esc(it.o[it.a])}`]) }; }; }
['D22', 'D23', 'D24', 'D25', 'D26', 'D27', 'D29', 'D31', 'D19'].forEach((s) => reg(s + '.quiz', { skill: s, title: 'Kurzfrage', diff: 1, quick: true }, quizGen(s)));

// ---------- Lesetexte (D13, D16–D19) ----------
// Die Bausteine sind exportiert, damit die Prüfungssimulation alle Aufgaben zum selben Text stellen kann.
const AMAP = { r: 0, f: 1, k: 2 }; const ANAMES = ['richtig', 'falsch', 'keine Angabe'];
export function aussagenTask(t, r, n = 7) { const rows = r.sample(t.aussagen, Math.min(n, t.aussagen.length));
  return { textId: t._id, html: 'Lies den Text. Kreuze für jede Aussage an: richtig, falsch oder keine Angabe möglich. Es zählt nur, was im Text steht.', fields: [{ id: 'a', type: 'classify', rows: rows.map((x) => esc(x.s)), cols: ANAMES, answers: rows.map((x) => AMAP[x.a]) }], solution: steps(rows.map((x) => `${esc(x.s)} → <b>${ANAMES[AMAP[x.a]]}</b>${x.why ? ': ' + esc(x.why) : ''}`)) }; }
export function figurTask(t, r) { const f = t.figur; const order = r.shuffle(f.o.map((_, i) => i));
  return { textId: t._id, html: `Lies den Text. Welche 4 Adjektive passen am besten zu <b>${esc(f.name)}</b>?`, fields: [{ id: 'a', type: 'multi', options: order.map((i) => esc(f.o[i])), answers: order.map((x, i) => (f.a.includes(x) ? i : -1)).filter((i) => i >= 0) }], solution: steps([`Passend: ${f.a.map((i) => esc(f.o[i])).join(', ')}`, f.why ? esc(f.why) : null, 'Jedes Adjektiv muss sich mit einer Textstelle belegen lassen.']) }; }
export function zuordnenTask(t, r, n = 3) { const items = r.sample(t.zuordnen, Math.min(n, t.zuordnen.length));
  return { textId: t._id, html: 'Lies den Text. Suche für jeden Satz <b>genau 1 Wort aus dem Text</b>, das dazu passt. Mehrere Wörter ergeben 0 Punkte.', fields: items.map((x, i) => ({ id: 'w' + i, type: 'text', label: esc(x.satz) + (x.zeilen ? ' <span class="muted">(Absatz ' + esc(x.zeilen) + ')</span>' : ''), answers: x.wort, ci: true })), solution: steps(items.map((x) => `${esc(x.satz)} → <b>${esc(x.wort[0])}</b>`)) }; }
export function frageTask(t, f) {
  return { textId: t._id, html: `Lies den Text und beantworte die Frage in eigenen Worten.<br><b>${esc(f.q)}</b>`, fields: [{ id: 'a', type: 'self', rows: 3, model: esc(f.model), checklist: f.check.map((c) => ({ text: esc(c), points: 1 })) }], solution: steps(['Antwort am Text belegen. Unvollständige Sätze geben in der Prüfung keinen Abzug.']) }; }
export function deutenTask(t, f, r) { const order = r.shuffle(f.o.map((_, i) => i));
  return { textId: t._id, html: `Lies den Text.<br><b>${esc(f.q)}</b>`, fields: [{ id: 'a', type: 'mc', options: order.map((i) => esc(f.o[i])), answer: order.indexOf(f.a) }], solution: steps([`Richtig: ${esc(f.o[f.a])}`, f.why ? esc(f.why) : null]) }; }
reg('D16.aussagen', { skill: 'D16', title: 'Aussagen zum Text prüfen', diff: 3, pts: 7 }, (r) => aussagenTask(pickDB(r, 'text'), r));
reg('D17.figur', { skill: 'D17', title: 'Figur charakterisieren', diff: 3, pts: 4 }, (r) => figurTask(pickDB(r, 'text', (x) => x.figur), r));
reg('D13.zuordnen', { skill: 'D13', title: 'Wort aus dem Text zuordnen', diff: 3, pts: 3 }, (r) => zuordnenTask(pickDB(r, 'text', (x) => x.zuordnen && x.zuordnen.length), r));
reg('D18.fragen', { skill: 'D18', title: 'Offene Frage zum Text', diff: 3, pts: 2 }, (r) => { const t = pickDB(r, 'text', (x) => x.fragen && x.fragen.some((fr) => (fr.skill || 'D18') === 'D18')); return frageTask(t, r.pick(t.fragen.filter((fr) => (fr.skill || 'D18') === 'D18'))); });
reg('D19.deuten', { skill: 'D19', title: 'Absicht, Kernaussage, Titel', diff: 3 }, (r) => { const t = pickDB(r, 'text', (x) => x.mc && x.mc.length); return deutenTask(t, r.pick(t.mc), r); });
