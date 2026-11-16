// Aufsatz-Prüfung ohne KI: Regeln für Rechtschreibung, Zeichensetzung, Grammatik, Stil und Aufbau.
// Rechtschreibung zusätzlich mit Hunspell (Schweizer Wörterbuch) in der App, optional LanguageTool online.
// Alle Meldungen sind Hinweise: Ein Programm versteht den Inhalt nicht.
import { gradeFromPoints, quarter } from '../util.js';

export const TYP_NAME = { eroerterung: 'Erörterung', erzaehlung: 'Erzählung', fortsetzung: 'Fortsetzung', bild: 'Bild oder Cartoon', erlebnis: 'Erlebnis und Reflexion', beschreibung: 'Beschreibung', bericht: 'Bericht', frei: 'Freies Thema' };
export const TYP_SKILL = { eroerterung: 'D22', erzaehlung: 'D23', fortsetzung: 'D24', bild: 'D25', erlebnis: 'D26', beschreibung: 'D29', bericht: 'D29', frei: 'D29' };
export const CATS = ['Rechtschreibung', 'Zeichensetzung', 'Grammatik', 'Stil', 'Aufbau', 'Inhalt'];
const COUNTS_AS_ERROR = new Set(['Rechtschreibung', 'Zeichensetzung', 'Grammatik']);

const WORD = /[A-Za-zÄÖÜäöüßéèàêëïç]+(?:-[A-Za-zÄÖÜäöüßéèàêëïç]+)*/g;
const STOP = new Set('der die das den dem des ein eine einen einem einer eines und oder aber denn sondern weil dass ob wenn als wie so auch nur noch schon nicht kein keine keinen ich du er sie es wir ihr mich dich sich uns euch mir dir ihm ihn ihnen ihr mein meine dein sein seine unser man in im an am auf aus bei mit nach von vom zu zum zur für gegen ohne um über unter vor hinter neben zwischen durch ist sind war waren bin bist hat habe hast haben hatte hatten wird werden wurde wurden kann können konnte muss müssen will wollte soll sollte darf dann da hier dort sehr mehr viel viele was wer wo wann warum doch ja nein immer wieder alle alles etwas nichts diese dieser dieses jetzt sehr einmal'.split(' '));
const PRAES = new Set('ist sind bin bist hat habe hast wird werde kann muss will darf geht gehe kommt komme sieht sehe sagt sage macht mache steht liegt sitzt läuft rennt denkt weiss gibt nimmt ruft fragt bleibt fährt hört spürt merkt schaut öffnet findet zeigt gehört scheint beginnt fällt hält lässt trägt schläft isst trinkt spielt wartet lacht weint schreit flüstert antwortet erklärt versucht braucht kennt glaubt hofft fühlt'.split(' '));
const PRAET = new Set('war waren warst hatte hatten wurde wurden konnte konnten musste mussten wollte wollten durfte ging gingen kam kamen sah sahen sagte sagten machte machten stand standen lag sass lief liefen rannte dachte wusste gab nahm rief fragte blieb fuhr hörte spürte merkte schaute öffnete fand zeigte gehörte schien begann fiel hielt liess trug schlief ass trank spielte wartete lachte weinte schrie flüsterte antwortete erklärte versuchte brauchte kannte glaubte hoffte fühlte'.split(' '));
const COLLOQ = ['mega', 'krass', 'geil', 'cool', 'okay', 'ok', 'halt', 'irgendwie', 'chillen', 'checken', 'gecheckt', 'Bock', 'super', 'isch', 'nöd', 'nüt', 'chli', 'gsi', 'öppis', 'gell', 'Grüezi', 'grüezi', 'äuä'];
const ABBR_BEFORE = /(?:\b[a-zA-Z]|usw|bzw|ca|etc|evtl|ggf|inkl|Nr|St|Dr|vgl|Hr|Fr)\.$/;
const SUB_ERR = ['weil', 'dass', 'obwohl', 'nachdem', 'sodass', 'falls', 'sobald', 'bevor'];
const SUB_TIP = ['wenn', 'ob', 'damit', 'während'];
const NO_COMMA_PREV = new Set(['und', 'oder', 'aber', 'sondern', 'als', 'wie', 'auch', 'selbst', 'nur', 'so', 'sogar', 'erst', 'allem', 'gerade', 'schon', 'bereits', 'doch', 'besonders', 'vielleicht', 'denn', 'ohne', 'statt', 'anstatt', 'dass', 'nämlich', 'ausser', 'gerade']);
const START_SUB = ['Weil', 'Wenn', 'Obwohl', 'Nachdem', 'Bevor', 'Falls', 'Sobald', 'Dass', 'Als', 'Während'];

function wordsOf(text) { const out = []; let m; WORD.lastIndex = 0; while ((m = WORD.exec(text))) out.push({ w: m[0], i: m.index, j: m.index + m[0].length }); return out; }
function sentencesOf(text) {
  const out = []; const re = /[^.!?\n]+(?:[.!?]+[»"“]?|\n|$)/g; let m;
  while ((m = re.exec(text))) { const s = m[0]; if (!s.trim()) { if (re.lastIndex === m.index) re.lastIndex++; continue; } const lead = s.length - s.trimStart().length; out.push({ s: s.trim(), i: m.index + lead, j: m.index + s.trimEnd().length }); if (re.lastIndex === m.index) re.lastIndex++; }
  return out;
}
function quoteRanges(text) { const r = []; const re = /«[^»]*»|„[^“]*“|"[^"]*"/g; let m; while ((m = re.exec(text))) r.push([m.index, m.index + m[0].length]); return r; }
const inRanges = (pos, rs) => rs.some(([a, b]) => pos >= a && pos < b);
const keyRe = (k) => k.split('|').map((x) => x.trim()).filter(Boolean);
export function keyCount(text, key) {
  const alts = keyRe(key); let n = 0; const lower = text.toLowerCase();
  for (const a of alts) {
    if (a.includes(' ')) { let i = -1; const al = a.toLowerCase(); while ((i = lower.indexOf(al, i + 1)) >= 0) n++; }
    else { const al = a.toLowerCase(); for (const w of wordsOf(text)) if (w.w.toLowerCase().startsWith(al)) n++; }
  }
  return n;
}
function tenseCount(text, from = 0, to = text.length, skip = []) {
  let pr = 0, pt = 0; const hits = { pr: [], pt: [] };
  for (const w of wordsOf(text.slice(from, to))) { const pos = from + w.i; if (inRanges(pos, skip)) continue; if (PRAES.has(w.w)) { pr++; hits.pr.push(pos); } else if (PRAET.has(w.w)) { pt++; hits.pt.push(pos); } }
  return { pr, pt, hits };
}
const anyOf = (text, list) => { const t = ' ' + text.toLowerCase() + ' '; return list.reduce((a, x) => a + (t.split(x.toLowerCase()).length - 1), 0); };

function lev(a, b) { a = a.toLowerCase(); b = b.toLowerCase(); if (Math.abs(a.length - b.length) > 1) return 9; const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; }
// Hauptfunktion. topic = { typ, keys, min, anfang, title }. spell = Ergebnis von window.gymi.spellCheck (optional).
export function analyse(text, topic = {}, spell = null) {
  const issues = []; const add = (kind, cat, msg, i, j, sugg) => issues.push({ kind, cat, msg, i: i == null ? -1 : i, j: j == null ? -1 : j, sugg: sugg || null });
  const typ = topic.typ || 'frei';
  const words = wordsOf(text); const sents = sentencesOf(text); const quotes = quoteRanges(text);
  const paras = text.split(/\n\s*/).map((x) => x.trim()).filter((x) => x.length > 0);
  const stats = { words: words.length, sentences: sents.length, paragraphs: paras.length, avg: sents.length ? words.length / sents.length : 0, longest: 0 };
  if (!words.length) return { issues, stats, metrics: {}, spellAvailable: !!(spell && spell.available) };

  // 1. ß und Abstände
  for (let i = text.indexOf('ß'); i >= 0; i = text.indexOf('ß', i + 1)) add('err', 'Rechtschreibung', 'In der Schweiz schreibt man «ss» statt «ß».', i, i + 1, 'ss');
  let m; const sp = / +([,.!?;:])(?!\.)/g; while ((m = sp.exec(text))) add('err', 'Zeichensetzung', 'Kein Leerschlag vor einem Satzzeichen.', m.index, m.index + m[0].length, m[1]);
  const ns = /([,;!?])(?=[A-Za-zÄÖÜäöü])/g; while ((m = ns.exec(text))) add('err', 'Zeichensetzung', 'Nach einem Satzzeichen folgt ein Leerschlag.', m.index, m.index + 1);
  const dbl = /\b([A-Za-zÄÖÜäöü]{2,})\s+\1\b/gi; while ((m = dbl.exec(text))) { const lw0 = m[1].toLowerCase(); if (['das', 'sie', 'es'].includes(lw0)) continue; if (['die', 'der', 'den', 'dem'].includes(lw0) && /,\s*$/.test(text.slice(0, m.index))) continue; add('err', 'Grammatik', 'Wort doppelt: «' + m[1] + '».', m.index, m.index + m[0].length); }

  // Satzzeichen am Ende jeder Zeile (Absatz)
  { let off = 0; for (const line of text.split('\n')) { const t = line.trimEnd(); if (t.trim() && wordsOf(t).length >= 4 && !/[.!?:»"“…]$/.test(t)) add('err', 'Zeichensetzung', 'Am Satzende fehlt ein Satzzeichen.', off + t.length - (t.match(/[A-Za-zÄÖÜäöüß]+$/) || [''])[0].length, off + t.length); off += line.length + 1; } }
  // 2. Satzanfänge klein, Satzlänge, Wiederholung am Satzanfang
  let lastStart = '', run = 0, dann = 0;
  sents.forEach((s, k) => {
    const fw = (s.s.match(/[A-Za-zÄÖÜäöü]+/) || [''])[0]; const fwPos = s.i + s.s.indexOf(fw);
    const before = text.slice(Math.max(0, s.i - 12), s.i).trimEnd();
    if (fw && /^[a-zäöü]/.test(fw) && !ABBR_BEFORE.test(before) && !/[,:;…–-]$/.test(before) && !/[!?][»"“]$/.test(before)) add('err', 'Rechtschreibung', 'Satzanfang gross schreiben.', fwPos, fwPos + fw.length, fw.charAt(0).toUpperCase() + fw.slice(1));
    const n = wordsOf(s.s).length; stats.longest = Math.max(stats.longest, n);
    if (n > 30) add('tip', 'Stil', 'Sehr langer Satz (' + n + ' Wörter). Teile ihn auf.', s.i, s.j);
    const lw = fw.toLowerCase(); if (lw === 'dann') dann++;
    if (lw && lw === lastStart) { run++; if (run === 2) add('tip', 'Stil', '3 Sätze nacheinander beginnen mit «' + fw + '». Wechsle die Satzanfänge.', fwPos, fwPos + fw.length); } else run = 0;
    lastStart = lw;
    // Nebensatz am Satzanfang ohne Komma
    const sw = START_SUB.find((c) => fw === c);
    if (sw && !s.s.includes(',')) { const next = (s.s.slice(fw.length).match(/[A-Za-zÄÖÜäöü]+/) || [''])[0]; const skip = (sw === 'Als' && /^[A-ZÄÖÜ]/.test(next)) || (sw === 'Während' && /^(des|der|dem|den)$/.test(next)); if (!skip && n >= 5) add('err', 'Zeichensetzung', 'Der Satz beginnt mit einem Nebensatz («' + sw + ' …»). Nach dem Nebensatz fehlt ein Komma.', s.i, s.j); }
  });
  if (dann >= 3) add('tip', 'Stil', dann + ' Sätze beginnen mit «Dann». Abwechseln: Kurz darauf, Plötzlich, Danach, Als …');

  // 3. Komma vor Nebensatz
  const conj = new RegExp('(\\S)(\\s+)(' + SUB_ERR.concat(SUB_TIP).join('|') + ')\\b', 'g');
  while ((m = conj.exec(text))) {
    const prevChar = m[1]; const c = m[3]; const at = m.index + m[1].length + m[2].length;
    if (/[,;:.!?«»"„“(–-]/.test(prevChar)) continue;
    const prevWord = (text.slice(0, m.index + 1).match(/([A-Za-zÄÖÜäöü]+)$/) || ['', ''])[1].toLowerCase();
    if (NO_COMMA_PREV.has(prevWord)) continue;
    const after = text.slice(at + c.length, at + c.length + 12);
    if (c === 'damit' && /^\s*[.!?,]/.test(after)) continue;
    if (c === 'während' && /^\s+(des|der|dem|den|eines|einer)\b/.test(after)) continue;
    add(SUB_ERR.includes(c) ? 'err' : 'tip', 'Zeichensetzung', 'Komma vor «' + c + '»? Vor einem Nebensatz steht ein Komma.', at, at + c.length, ', ' + c);
  }
  const sodass = /([^,\s])\s+(so|ohne|statt|anstatt)\s+dass\b/g; while ((m = sodass.exec(text))) { const at = m.index + m[1].length; add('err', 'Zeichensetzung', 'Komma vor «' + m[2] + ' dass».', at, at + m[0].length - m[1].length); }

  // 4. das / dass
  const dassNach = /\b(glaube|glaubt|hoffe|hofft|weiss|denke|denkt|finde|findet|sagt|sagte|meine|meint|zeigt|bedeutet|bin sicher|ist klar|ist wichtig|merkte|merke|wusste|dachte|hoffte|fand),\s+das\b/gi;
  while ((m = dassNach.exec(text))) { const at = m.index + m[0].length - 3; add('tip', 'Grammatik', '«das» oder «dass»? Lässt sich «das» nicht durch «dieses» oder «welches» ersetzen, schreibt man «dass».', at, at + 3, 'dass'); }
  const dassSah = /\b(sah|sahen|sehe|sieht|merkte|merkten|bemerkte|wusste|wussten|weiss|glaube|glaubte|hoffe|hoffte|denke|dachte|fand|finde|sagte|sagt|zeigt|zeigte|hörte|spürte|vergass|vergesse),?\s+das\s+(der|die|das|den|dem|ein|eine|einen|er|sie|es|ich|du|wir|ihr|man|mein|meine|sein|seine|alle|niemand|jemand)\b/gi;
  while ((m = dassSah.exec(text))) { const at = m.index + m[0].toLowerCase().lastIndexOf(' das ') + 1; if (!/,\s+das/.test(m[0])) add('err', 'Zeichensetzung', 'Vor dem Nebensatz fehlt ein Komma.', at, at + 3); add('err', 'Grammatik', 'Hier leitet das Wort einen Nebensatz ein: «dass».', at, at + 3, 'dass'); }
  const dasRel = /\b(das|ein|kein|dieses|jedes|mein|unser)\s+([A-ZÄÖÜ][a-zäöü]+)\s*,\s*(dass)\b/g;
  while ((m = dasRel.exec(text))) { const at = m.index + m[0].length - 4; add('tip', 'Grammatik', '«dass» oder «das»? Bezieht sich das Wort auf «' + m[2] + '», ist es das Relativpronomen «das».', at, at + 4, 'das'); }

  // 5. Nominalisierung
  const nom = /\b([Bb]eim|[Zz]um|[Vv]om|[Ii]ns)\s+([a-zäöü][a-zäöü]+en)\b(?!\s+[A-ZÄÖÜ])/g; while ((m = nom.exec(text))) { const at = m.index + m[1].length + 1; add('err', 'Rechtschreibung', 'Nominalisiertes Verb gross: «' + m[1] + ' ' + m[2].charAt(0).toUpperCase() + m[2].slice(1) + '».', at, at + m[2].length, m[2].charAt(0).toUpperCase() + m[2].slice(1)); }
  const nom2 = /\b([Ee]twas|[Nn]ichts|[Vv]iel|[Ww]enig|[Aa]llerlei|[Aa]lles)\s+([a-zäöü][a-zäöü]+e[s]?)\b(\s+[A-Za-zÄÖÜäöü]+)?/g;
  while ((m = nom2.exec(text))) { if (m[3] && /^\s+[A-ZÄÖÜ]/.test(m[3])) continue; if (!/(es|e)$/.test(m[2]) || STOP.has(m[2]) || ['andere', 'anderes', 'beide', 'diese', 'dieses', 'jede', 'meine', 'deine', 'seine', 'keine', 'eine', 'gerne', 'heute', 'alle', 'ganze', 'genauso', 'ebenso', 'sehe', 'habe', 'gebe', 'mache', 'lese', 'gehe', 'lerne'].includes(m[2])) continue; if (m[1].toLowerCase() === 'alles' && !/e$/.test(m[2])) continue; const at = m.index + m[1].length + 1; add('tip', 'Rechtschreibung', 'Nominalisiertes Adjektiv gross? «' + m[1] + ' ' + m[2].charAt(0).toUpperCase() + m[2].slice(1) + '».', at, at + m[2].length, m[2].charAt(0).toUpperCase() + m[2].slice(1)); }

  // 6. Anführungszeichen und direkte Rede
  const open = (text.match(/«/g) || []).length, close = (text.match(/»/g) || []).length;
  if (open !== close) add('err', 'Zeichensetzung', 'Anführungszeichen: ' + open + '-mal «, aber ' + close + '-mal ». Jede direkte Rede braucht Anfang und Ende.');
  if (/"/.test(text)) add('tip', 'Zeichensetzung', 'In der Schweiz setzt man die Anführungszeichen so: «…».');
  const redeKomma = /([»“"])\s+(sagte|fragte|rief|antwortete|meinte|flüsterte|schrie|murmelte|erklärte|sagt|fragt|ruft|meint|antwortet|flüstert|schreit)\b/g;
  while ((m = redeKomma.exec(text))) add('err', 'Zeichensetzung', 'Nach der direkten Rede folgt ein Komma: «…», ' + m[2] + ' …', m.index, m.index + m[0].length);

  // 7. Wortwahl
  for (const w of words) { if (COLLOQ.includes(w.w) || (COLLOQ.includes(w.w.toLowerCase()) && w.w !== 'Super')) add('tip', 'Stil', '«' + w.w + '» ist Umgangssprache oder Dialekt. Schreibe Standardsprache.', w.i, w.j); }
  const machen = words.filter((w) => /^(mache|machst|macht|machen|machte|machten|gemacht)$/i.test(w.w)); if (machen.length >= 3) add('tip', 'Stil', '«machen» kommt ' + machen.length + '-mal vor. Suche treffendere Verben.', machen[2].i, machen[2].j);
  const gibt = (text.match(/\bes gibt\b|\bgibt es\b/gi) || []).length; if (gibt >= 3) add('tip', 'Stil', '«es gibt» kommt ' + gibt + '-mal vor. Formuliere genauer.');
  // Wiederholungen nah beieinander
  const keyWords = new Set((topic.keys || []).flatMap(keyRe).map((x) => x.toLowerCase()));
  const seen = new Set();
  for (let a = 0; a < words.length; a++) {
    const lw = words[a].w.toLowerCase(); if (lw.length < 5 || STOP.has(lw) || seen.has(lw) || [...keyWords].some((k) => lw.startsWith(k))) continue;
    let n = 0; let last = null; for (let b = a; b < Math.min(words.length, a + 50); b++) if (words[b].w.toLowerCase() === lw) { n++; last = words[b]; }
    if (n >= 3) { seen.add(lw); add('tip', 'Stil', '«' + words[a].w + '» kommt ' + n + '-mal nah beieinander vor. Ersetze es durch ein Synonym oder Pronomen.', last.i, last.j); }
  }

  // 8. Zeitform
  const tc = tenseCount(text, 0, text.length, quotes); const tot = tc.pr + tc.pt;
  const metrics = { praes: tc.pr, praet: tc.pt };
  const narrative = typ === 'erzaehlung' || typ === 'fortsetzung';
  if (narrative && tot >= 6) {
    let want = 'pt';
    if (typ === 'fortsetzung' && topic.anfang) { const ta = tenseCount(topic.anfang); if (ta.pr > ta.pt) want = 'pr'; }
    const wrong = want === 'pt' ? tc.pr : tc.pt; const share = wrong / tot;
    if (share >= 0.25 && wrong >= 3) { const hits = want === 'pt' ? tc.hits.pr : tc.hits.pt; add('err', 'Grammatik', 'Die Zeitform wechselt: ' + tc.pt + ' Verben im Präteritum, ' + tc.pr + ' im Präsens (ohne direkte Rede). ' + (want === 'pt' ? 'Erzähle durchgehend im Präteritum.' : 'Der Anfang steht im Präsens: Bleib im Präsens.'), hits[0], hits[0] + (text.slice(hits[0]).match(/^[A-Za-zÄÖÜäöüß]+/) || [''])[0].length); hits.slice(1, 4).forEach((p) => add('tip', 'Grammatik', 'Zeitform prüfen.', p, p + (text.slice(p).match(/^[A-Za-zÄÖÜäöüß]+/) || [''])[0].length)); }
    metrics.tenseOk = !(share >= 0.25 && wrong >= 3);
  } else if ((typ === 'eroerterung' || typ === 'beschreibung') && tot >= 8) {
    metrics.tenseOk = !(tc.pt / tot >= 0.6);
    if (!metrics.tenseOk) add('tip', 'Grammatik', 'Viele Verben im Präteritum. Erörterung und Beschreibung stehen im Präsens. Nur Beispiele aus der Vergangenheit stehen im Präteritum.');
  } else if (typ === 'erlebnis' && tot >= 6) {
    metrics.tenseOk = tc.pt >= 2 && tc.pr >= 2;
    if (tc.pt < 2) add('tip', 'Aufbau', 'Das Erlebnis erzählst du im Präteritum. Im Text fehlen fast alle Präteritum-Formen.');
    if (tc.pr < 2) add('tip', 'Aufbau', 'Die Reflexion (Nachdenken) steht im Präsens. Fehlt dieser Teil?');
  } else metrics.tenseOk = true;

  // 9. Aufbau und Textsorte
  const needPara = typ === 'eroerterung' ? 4 : 3;
  if (paras.length < needPara) add(paras.length <= 1 ? 'err' : 'tip', 'Aufbau', paras.length + (paras.length === 1 ? ' Absatz' : ' Absätze') + '. Gliedere mit Absätzen: Einleitung, Hauptteil' + (typ === 'eroerterung' ? ' (1 Absatz pro Argument)' : '') + ', Schluss.');
  const lastPara = paras[paras.length - 1] || '';
  if (typ === 'eroerterung' || typ === 'bild') {
    const pro = anyOf(text, ['vorteil', 'dafür spricht', 'spricht dafür', 'positiv', 'chance', 'einerseits', 'zwar', 'nützlich', 'hilft']);
    const contra = anyOf(text, ['nachteil', 'dagegen spricht', 'spricht dagegen', 'negativ', 'risiko', 'gefahr', 'andererseits', 'jedoch', 'allerdings', 'hingegen', 'aber ']);
    const opinionAll = anyOf(text, ['meiner meinung nach', 'meines erachtens', 'meiner ansicht nach', 'ich finde', 'ich bin der meinung', 'ich bin der ansicht', 'ich bin überzeugt', 'ich persönlich', 'für mich', 'meine meinung', 'ich denke', 'ich glaube']);
    const opinionEnd = anyOf(lastPara, ['meiner meinung nach', 'meines erachtens', 'meiner ansicht nach', 'ich finde', 'ich bin der meinung', 'ich bin der ansicht', 'ich bin überzeugt', 'ich persönlich', 'für mich', 'meine meinung', 'ich denke', 'ich glaube', 'deshalb', 'darum', 'zusammenfassend', 'alles in allem', 'insgesamt']);
    const examples = anyOf(text, ['zum beispiel', 'beispielsweise', 'z. b.', 'z.b.', 'etwa ', 'so habe ich', 'als ich', 'letzte woche', 'letztes jahr', 'einmal ']);
    const reasons = anyOf(text, ['weil', 'denn ', ' da ', 'deshalb', 'darum', 'nämlich', 'daher']);
    Object.assign(metrics, { pro, contra, opinionAll, opinionEnd, examples, reasons });
    if (typ === 'eroerterung') {
      if (!pro || !contra) add('err', 'Inhalt', 'Ich finde nur ' + (pro ? 'Vorteile' : contra ? 'Nachteile' : 'wenige Hinweise auf Argumente') + '. Eine Erörterung zeigt beide Seiten (Vor- und Nachteile).');
      if (!opinionAll) add('err', 'Inhalt', 'Ich finde keine eigene Meinung (zum Beispiel «Meiner Meinung nach …»). Sie gehört begründet in den Schluss.');
      else if (!opinionEnd && paras.length >= 3) add('tip', 'Aufbau', 'Steht deine Meinung im Schluss? Der letzte Absatz zieht das Fazit.');
    }
    if (examples < 2) add('tip', 'Inhalt', 'Wenige Beispiele. Jedes Argument: Behauptung, Begründung, Beispiel.');
    if (reasons < 3) add('tip', 'Inhalt', 'Wenige Begründungen (weil, denn, deshalb, nämlich).');
  }
  if (typ === 'bild') {
    const refs = paras.slice(1).some((pp) => /\b(Bild|Bildes|Cartoon|Zeichnung|Vordergrund|Hintergrund|Bildrand)\b/.test(pp));
    metrics.bildRef = refs; if (paras.length >= 3 && !refs) add('tip', 'Aufbau', 'Nach der Einleitung kommt das Bild nicht mehr vor. Greife es im Hauptteil oder Schluss wieder auf.');
    if (!/\b(Bild|Cartoon|Zeichnung)\b/.test(paras[0] || '')) add('tip', 'Aufbau', 'Beschreibe das Bild schon in der Einleitung.');
  }
  if (narrative) {
    const inner = anyOf(text, ['dachte', 'fühlte', 'spürte', 'hoffte', 'fürchtete', 'angst', 'herz', 'zitterte', 'freude', 'wütend', 'traurig', 'erschrak', 'erschrocken', 'staunte', 'nervös', 'gedanke', 'gefühl', 'schämte', 'wünschte', 'glücklich', 'panik', 'tränen', 'unheimlich', 'schluckte', 'atmete', 'fragte mich', 'überlegte']);
    metrics.inner = inner; if (inner < 4) add('tip', 'Inhalt', 'Wenig innere Handlung. Zeige Gedanken und Gefühle der Figur, besonders am Höhepunkt.');
    const speech = (text.match(/«/g) || []).length; if (speech > 14) add('tip', 'Stil', 'Viel direkte Rede (' + speech + '-mal). Setze sie sparsam ein.');
    if (/aufgewacht|wachte[^.]{0,40}auf|nur ein traum|geträumt/i.test(lastPara)) add('tip', 'Inhalt', '«Alles nur ein Traum» ist ein schwacher Schluss. Finde einen Schluss, der zur Handlung passt.');
    if (typ === 'fortsetzung' && topic.anfang) {
      const ich = /\b(ich|mir|mich|mein)\b/i.test(topic.anfang); const ichText = (text.match(/\b(ich|mir|mich|meine?)\b/gi) || []).length;
      if (ich && ichText < 3) add('err', 'Aufbau', 'Der Anfang steht in der Ich-Form. Erzähle in der Ich-Form weiter.');
      if (!ich && ichText > 5 && !inRanges(text.search(/\bich\b/i), quotes)) add('tip', 'Aufbau', 'Der Anfang steht nicht in der Ich-Form. Prüfe die Erzählperspektive.');
    }
  }
  // 10. Vorgaben aus dem Auftrag
  const minN = topic.min || 1; metrics.keysMissing = []; metrics.keysFew = [];
  for (const k of topic.keys || []) { const n = keyCount(text, k); const label = keyRe(k)[0]; if (n === 0) { metrics.keysMissing.push(label); add('err', 'Inhalt', '«' + label + '» kommt im Text nicht vor. Ist dieser Teil des Auftrags erfüllt?'); } else if (n < minN) { metrics.keysFew.push(label); add('tip', 'Inhalt', '«' + label + '» kommt nur ' + n + '-mal vor. Eine zentrale Vorgabe kommt meist öfter vor und ist wichtig für die Handlung.'); } }
  if (words.length < 250) add('tip', 'Inhalt', 'Der Text ist kurz (' + words.length + ' Wörter). Prüfe, ob jeder Teilauftrag genug ausgeführt ist.');

  // 11. Rechtschreibung mit Wörterbuch
  const spellAvailable = !!(spell && spell.available);
  if (spellAvailable) {
    const res = spell.result || {}; const startSet = new Set(sents.map((s) => s.i + s.s.search(/[A-Za-zÄÖÜäöü]/)));
    const title = (topic.title || '').toLowerCase();
    let count = 0;
    for (const w of words) {
      const r = res[w.w]; if (!r || r.ok || w.w.length < 2 || /ß/.test(w.w)) continue;
      if ([...keyWords].some((k) => w.w.toLowerCase().startsWith(k)) || title.includes(w.w.toLowerCase())) continue;
      const atStart = startSet.has(w.i);
      if (r.capOk && /^[a-zäöü]/.test(w.w) && !atStart) add('err', 'Rechtschreibung', 'Nomen schreibt man gross: «' + w.w.charAt(0).toUpperCase() + w.w.slice(1) + '».', w.i, w.j, w.w.charAt(0).toUpperCase() + w.w.slice(1));
      else if (atStart && r.capOk) continue;
      else if (r.lowerOk && /^[A-ZÄÖÜ]/.test(w.w) && !atStart) add('tip', 'Rechtschreibung', 'Klein schreiben? «' + w.w.toLowerCase() + '».', w.i, w.j, w.w.toLowerCase());
      else if (/^[A-ZÄÖÜ]/.test(w.w) && !atStart && r.sugg && r.sugg.some((x) => lev(x, w.w) <= 1)) add('err', 'Rechtschreibung', 'Rechtschreibung prüfen (oder ein Name?): ' + r.sugg.slice(0, 3).join(', '), w.i, w.j, r.sugg.find((x) => lev(x, w.w) <= 1));
      else if (/^[A-ZÄÖÜ]/.test(w.w) && !atStart) add('tip', 'Rechtschreibung', 'Unbekanntes Wort (Name?)' + (r.sugg && r.sugg.length ? ': ' + r.sugg.slice(0, 3).join(', ') : ''), w.i, w.j, r.sugg && r.sugg[0]);
      else add('err', 'Rechtschreibung', 'Rechtschreibung prüfen' + (r.sugg && r.sugg.length ? ': ' + r.sugg.slice(0, 3).join(', ') : '.'), w.i, w.j, r.sugg && r.sugg[0]);
      if (++count > 150) break;
    }
  }
  // Doppelte Meldungen an derselben Stelle: Fehler vor Hinweis behalten
  { const seenAt = new Map(); for (const x of issues.slice().sort((a, b) => (a.kind === 'err' ? 0 : 1) - (b.kind === 'err' ? 0 : 1))) { if (x.i < 0) continue; const k = x.i + ':' + x.j + ':' + (x.cat === 'Zeichensetzung' ? 'Z' : 'G'); if (seenAt.has(k)) x._dup = true; else seenAt.set(k, x); } for (let q = issues.length - 1; q >= 0; q--) if (issues[q]._dup) issues.splice(q, 1); }
  const errN = issues.filter((x) => x.kind === 'err' && COUNTS_AS_ERROR.has(x.cat)).length;
  metrics.errPer100 = errN / words.length * 100;
  metrics.styleTips = issues.filter((x) => x.cat === 'Stil').length;
  metrics.repeat = issues.filter((x) => x.cat === 'Stil' && /nah beieinander|beginnen mit/.test(x.msg)).length;
  metrics.colloq = issues.filter((x) => /Umgangssprache|machen|es gibt/.test(x.msg)).length;
  metrics.longSent = issues.filter((x) => /langer Satz/.test(x.msg)).length;
  metrics.lens = sents.map((s) => wordsOf(s.s).length);
  issues.sort((a, b) => (a.i < 0 ? 1e9 : a.i) - (b.i < 0 ? 1e9 : b.i));
  return { issues, stats, metrics, spellAvailable };
}

// Meldungen von LanguageTool (online, freiwillig) übernehmen
export function fromLanguageTool(json, text) {
  const out = [];
  try {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    for (const mt of data.matches || []) {
      const cat = /TYPOS|SPELL/i.test(mt.rule && mt.rule.category && mt.rule.category.id || '') ? 'Rechtschreibung' : /PUNCT|KOMMA|COMMA/i.test((mt.rule && mt.rule.category && mt.rule.category.id) || '') ? 'Zeichensetzung' : /STYLE|REDUNDANCY|COLLOQ/i.test((mt.rule && mt.rule.category && mt.rule.category.id) || '') ? 'Stil' : 'Grammatik';
      const sugg = (mt.replacements || []).slice(0, 3).map((r) => String(r.value).replace(/ß/g, 'ss'));
      out.push({ kind: cat === 'Stil' ? 'tip' : 'err', cat, msg: 'LanguageTool: ' + String(mt.message || '').replace(/ß/g, 'ss') + (sugg.length ? ' Vorschlag: ' + sugg.join(', ') : ''), i: mt.offset, j: mt.offset + mt.length, sugg: sugg[0] || null, lt: true });
    }
  } catch (e) { /* ungültige Antwort */ }
  return out.filter((x) => x.i >= 0 && x.j <= text.length);
}

// ---------- Bewertungsraster: 15 Leitfragen in 3 gleich wichtigen Bereichen ----------
export const LEITFRAGEN = [
  { id: 1, area: 'Inhalt', q: 'Auf Thema und Auftrag ausgerichtet? Jeder Teilauftrag erfüllt?' },
  { id: 2, area: 'Inhalt', q: 'Plausibel und nachvollziehbar?' },
  { id: 3, area: 'Inhalt', q: 'Überzeugend und eigenständig (eigene Gedanken, eigene Beispiele)?' },
  { id: 4, area: 'Inhalt', q: 'Inhalt und Umfang im sinnvollen Verhältnis (Teile so gewichtet, wie es der Auftrag nahelegt)?' },
  { id: 5, area: 'Inhalt', q: 'Sachlich richtig und relevant?' },
  { id: 6, area: 'Aufbau', q: 'Zusammenhängend (roter Faden, Übergänge)?' },
  { id: 7, area: 'Aufbau', q: 'Innere oder äussere Gliederung erkennbar (Einleitung, Hauptteil, Schluss, Absätze)?' },
  { id: 8, area: 'Aufbau', q: 'Ohne unnötige Wiederholungen und Widersprüche?' },
  { id: 9, area: 'Aufbau', q: 'Argumentation oder Handlung schlüssig?' },
  { id: 10, area: 'Aufbau', q: 'Textsorte wie verlangt umgesetzt?' },
  { id: 11, area: 'Sprache', q: 'Anschaulich beschrieben oder erzählt?' },
  { id: 12, area: 'Sprache', q: 'Grammatik, Rechtschreibung, Zeichensetzung stufengerecht?' },
  { id: 13, area: 'Sprache', q: 'Wortwahl abwechslungsreich, präzise, angemessen, Standardsprache?' },
  { id: 14, area: 'Sprache', q: 'Satzbau abwechslungsreich und korrekt?' },
  { id: 15, area: 'Sprache', q: 'Besondere Stilmittel (Vergleiche, Bilder, Spannung, treffende Ausdrücke)?' }
];
// Vorlagen je Textsorte: worauf bei einzelnen Leitfragen besonders zu achten ist
export const PRESET = {
  eroerterung: { 1: 'Einleitung genau wie verlangt; Hauptteil mit Vor- und Nachteilen; Schluss mit Meinung.', 3: 'Eigene, konkrete Beispiele statt allgemeiner Sätze.', 4: '2–3 Argumente pro Seite, 1 Absatz pro Argument.', 9: 'Jedes Argument: Behauptung, Begründung, Beispiel. Stärkstes Argument zuletzt.', 10: 'Beide Seiten erörtert, Meinung im Schluss begründet, kein neues Argument im Schluss, Präsens.' },
  erzaehlung: { 1: 'Titel-Element oder Vorgaben sind der Kern der Handlung, nicht nur erwähnt.', 4: 'Kurze Einleitung, Höhepunkt ausführlich.', 9: 'Klare Handlung mit Spannung, Höhepunkt oder Pointe und passendem Schluss; keine Figuren ohne Grund.', 10: 'Präteritum durchgehend, Perspektive gehalten.', 11: 'Innere Handlung: Gedanken, Gefühle, Sinne. Zeigen statt behaupten.' },
  fortsetzung: { 1: 'Alle wichtigen Elemente des Anfangs aufgenommen.', 9: 'Klar: was passiert, warum, wie es endet.', 10: 'Gleiche Perspektive und Zeitform wie der Anfang.', 11: 'Innere Handlung und Spannung.' },
  bild: { 1: 'Bild zusammenhängend beschrieben, dann der Hauptauftrag erfüllt.', 6: 'Gedanken beziehen sich auf das Bild.', 7: 'Beschreibung geordnet (Überblick, dann Einzelheiten).', 10: 'Bild im ganzen Text wieder aufgegriffen; Deutung belegt.' },
  erlebnis: { 1: 'Erlebnis und Reflexion beide vorhanden.', 4: 'Verhältnis der beiden Teile wie im Auftrag («kurz berichten» = kleiner Teil).', 10: 'Erlebnis im Präteritum, Reflexion im Präsens.', 11: 'Erlebnis konkret und anschaulich.' },
  beschreibung: { 7: 'Feste Reihenfolge der Beschreibung.', 10: 'Präsens, genau, treffende Adjektive; verlangte Begründung oder Erörterung vorhanden.', 11: 'Anschaulich, sodass man es sich vorstellen kann.' },
  bericht: { 1: 'Alle W-Fragen beantwortet (wer, was, wann, wo, wie, warum).', 10: 'Sachlich, ohne Gefühle, zeitliche Reihenfolge, Präteritum.' },
  frei: {}
};
export const MASSSTAB = { mild: { name: 'Mild', e1: 2.5, e2: 6 }, normal: { name: 'Normal', e1: 1.5, e2: 4 }, streng: { name: 'Streng', e1: 0.8, e2: 2.5 } };

// Vorschläge für messbare Leitfragen. Alles andere bewertet der Mensch.
export function suggest(an, typ, massstab = 'normal') {
  const M = an.metrics || {}; const S = an.stats || {}; const ms = MASSSTAB[massstab] || MASSSTAB.normal; const out = {}; const why = {};
  if (!S.words) return { values: out, why };
  if (M.keysMissing && M.keysMissing.length) { out[1] = M.keysMissing.length > 1 ? 0 : 0.5; why[1] = 'Vorgabe fehlt: ' + M.keysMissing.join(', '); }
  const need = typ === 'eroerterung' ? 4 : 3; out[7] = S.paragraphs >= need ? 1 : S.paragraphs >= 2 ? 0.5 : 0; why[7] = S.paragraphs + ' Absätze';
  out[8] = M.repeat <= 1 ? 1 : M.repeat <= 4 ? 0.5 : 0; why[8] = M.repeat + ' Wiederholungen gefunden';
  if (typ === 'eroerterung') { const ok = M.pro > 0 && M.contra > 0; out[10] = ok && M.opinionAll && M.tenseOk ? 1 : ok || M.opinionAll ? 0.5 : 0; why[10] = (ok ? 'beide Seiten' : 'nur 1 Seite erkennbar') + ', ' + (M.opinionAll ? 'Meinung vorhanden' : 'keine Meinung gefunden'); }
  else if (typ === 'erzaehlung' || typ === 'fortsetzung') { out[10] = M.tenseOk ? 1 : 0.5; why[10] = M.tenseOk ? 'Zeitform einheitlich' : 'Zeitform wechselt'; out[11] = M.inner >= 6 ? 1 : M.inner >= 3 ? 0.5 : 0; why[11] = M.inner + ' Hinweise auf innere Handlung'; }
  else if (typ === 'erlebnis') { out[10] = M.tenseOk ? 1 : 0.5; why[10] = M.tenseOk ? 'Erlebnis und Reflexion erkennbar' : 'ein Teil scheint zu fehlen'; }
  else if (typ === 'bild') { out[10] = M.bildRef ? 1 : 0.5; why[10] = M.bildRef ? 'Bild im Text wieder aufgegriffen' : 'Bild nur am Anfang'; }
  out[12] = M.errPer100 <= ms.e1 ? 1 : M.errPer100 <= ms.e2 ? 0.5 : 0; why[12] = (Math.round(M.errPer100 * 10) / 10) + ' gefundene Fehler pro 100 Wörter' + (an.spellAvailable ? '' : ' (ohne Wörterbuch-Prüfung)');
  out[13] = M.colloq === 0 ? 1 : M.colloq <= 3 ? 0.5 : 0; why[13] = M.colloq + ' Hinweise zu Umgangssprache oder schwachen Verben';
  const lens = M.lens || []; const mean = lens.reduce((a, b) => a + b, 0) / (lens.length || 1); const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / (lens.length || 1));
  out[14] = M.longSent <= 1 && sd >= 3 && mean >= 7 ? 1 : M.longSent <= 3 ? 0.5 : 0; why[14] = 'Ø ' + Math.round(mean) + ' Wörter pro Satz, ' + M.longSent + ' sehr lange Sätze';
  return { values: out, why };
}
export function gradeRubric(values) {
  let pts = 0, n = 0; for (const f of LEITFRAGEN) { const v = values[f.id]; if (v != null) { pts += v; n++; } }
  return { points: pts, max: 15, complete: n === 15, grade: quarter(gradeFromPoints(pts, 15)), byArea: ['Inhalt', 'Aufbau', 'Sprache'].map((a) => ({ area: a, p: LEITFRAGEN.filter((f) => f.area === a).reduce((s, f) => s + (values[f.id] || 0), 0), m: 5 })) };
}
export const CHECKLIST = ['Jeder Teilauftrag erfüllt?', 'Einleitung, Hauptteil, Schluss mit Absätzen erkennbar?', 'Bei Erörterung: beide Seiten und begründete Meinung am Schluss?', 'Bei Erzählung: Vorgabe zentral, Höhepunkt, passender Schluss?', 'Zeitform durchgehend gleich?', 'Komma vor jedem Nebensatz?', 'das/dass, gross/klein, ss geprüft?', 'Wiederholungen ersetzt?'];
export const PLAN_TEMPLATE = {
  eroerterung: 'Einleitung: \nContra 1: \nContra 2: \nPro 1: \nPro 2: \nPro 3 (stärkstes): \nSchluss (Meinung + Begründung): ',
  erzaehlung: 'Einleitung (wer, wo, wann): \nSpannung 1: \nSpannung 2: \nHöhepunkt (Gedanken, Gefühle): \nSchluss: ',
  fortsetzung: 'Was übernehme ich (Perspektive, Zeitform, Figuren, Gegenstände): \nSpannung: \nHöhepunkt: \nSchluss (wie endet es, warum): ',
  bild: 'Bild beschreiben (Überblick, Einzelheiten): \nDeutung: \nHauptauftrag Teil 1: \nHauptauftrag Teil 2: \nSchluss mit Bezug zum Bild: ',
  erlebnis: 'Erlebnis (Präteritum, knapp): \nWas bedeutet es? \nWie sehe ich es heute? \nWas gilt allgemein? ',
  beschreibung: 'Überblick: \nEinzelheit 1: \nEinzelheit 2: \nEinzelheit 3: \nBegründung / Bedeutung: ',
  bericht: 'Wer, was, wann, wo: \nWie (Ablauf 1, 2, 3): \nWarum, Folgen: ',
  frei: 'Absatz 1: \nAbsatz 2: \nAbsatz 3: \nAbsatz 4: \nAbsatz 5: '
};
