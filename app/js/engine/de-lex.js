// Deutsch-Lexikon für den Satzgenerator (Schweizer Schreibung: ss statt ß).
// Alle Formen, die nicht sicher aus einer Regel folgen, stehen ausdrücklich hier.

// Nomen: [Wort, Genus, Plural, Genitiv Singular, Klasse, n-Deklination?]
// Klasse: p = Person, a = Tier, t = Ding, o = Ort
const N = (w, g, pl, gen, k, nd) => ({ w, g, pl, gen: gen || w, k, nd: nd || null });
export const NOUNS = [
  N('Lehrer', 'm', 'Lehrer', 'Lehrers', 'p'), N('Nachbar', 'm', 'Nachbarn', 'Nachbarn', 'p', 'Nachbarn'), N('Bäcker', 'm', 'Bäcker', 'Bäckers', 'p'), N('Arzt', 'm', 'Ärzte', 'Arztes', 'p'),
  N('Freund', 'm', 'Freunde', 'Freundes', 'p'), N('Bruder', 'm', 'Brüder', 'Bruders', 'p'), N('Onkel', 'm', 'Onkel', 'Onkels', 'p'), N('Gärtner', 'm', 'Gärtner', 'Gärtners', 'p'),
  N('Junge', 'm', 'Jungen', 'Jungen', 'p', 'Jungen'), N('Kunde', 'm', 'Kunden', 'Kunden', 'p', 'Kunden'), N('Grossvater', 'm', 'Grossväter', 'Grossvaters', 'p'), N('Verkäufer', 'm', 'Verkäufer', 'Verkäufers', 'p'),
  N('Polizist', 'm', 'Polizisten', 'Polizisten', 'p', 'Polizisten'), N('Schüler', 'm', 'Schüler', 'Schülers', 'p'), N('Koch', 'm', 'Köche', 'Kochs', 'p'), N('Trainer', 'm', 'Trainer', 'Trainers', 'p'),
  N('Lehrerin', 'f', 'Lehrerinnen', null, 'p'), N('Nachbarin', 'f', 'Nachbarinnen', null, 'p'), N('Ärztin', 'f', 'Ärztinnen', null, 'p'), N('Freundin', 'f', 'Freundinnen', null, 'p'),
  N('Schwester', 'f', 'Schwestern', null, 'p'), N('Tante', 'f', 'Tanten', null, 'p'), N('Grossmutter', 'f', 'Grossmütter', null, 'p'), N('Verkäuferin', 'f', 'Verkäuferinnen', null, 'p'),
  N('Schülerin', 'f', 'Schülerinnen', null, 'p'), N('Köchin', 'f', 'Köchinnen', null, 'p'), N('Trainerin', 'f', 'Trainerinnen', null, 'p'), N('Frau', 'f', 'Frauen', null, 'p'),
  N('Kind', 'n', 'Kinder', 'Kindes', 'p'), N('Mädchen', 'n', 'Mädchen', 'Mädchens', 'p'),
  N('Hund', 'm', 'Hunde', 'Hundes', 'a'), N('Katze', 'f', 'Katzen', null, 'a'), N('Pferd', 'n', 'Pferde', 'Pferdes', 'a'), N('Vogel', 'm', 'Vögel', 'Vogels', 'a'),
  N('Brief', 'm', 'Briefe', 'Briefes', 't'), N('Ball', 'm', 'Bälle', 'Balles', 't'), N('Schlüssel', 'm', 'Schlüssel', 'Schlüssels', 't'), N('Koffer', 'm', 'Koffer', 'Koffers', 't'),
  N('Kuchen', 'm', 'Kuchen', 'Kuchens', 't'), N('Apfel', 'm', 'Äpfel', 'Apfels', 't'), N('Rucksack', 'm', 'Rucksäcke', 'Rucksacks', 't'), N('Stuhl', 'm', 'Stühle', 'Stuhls', 't'),
  N('Computer', 'm', 'Computer', 'Computers', 't'), N('Regenschirm', 'm', 'Regenschirme', 'Regenschirms', 't'), N('Hut', 'm', 'Hüte', 'Hutes', 't'),
  N('Tasche', 'f', 'Taschen', null, 't'), N('Zeitung', 'f', 'Zeitungen', null, 't'), N('Jacke', 'f', 'Jacken', null, 't'), N('Blume', 'f', 'Blumen', null, 't'),
  N('Flasche', 'f', 'Flaschen', null, 't'), N('Karte', 'f', 'Karten', null, 't'), N('Uhr', 'f', 'Uhren', null, 't'), N('Lampe', 'f', 'Lampen', null, 't'),
  N('Gitarre', 'f', 'Gitarren', null, 't'), N('Kamera', 'f', 'Kameras', null, 't'), N('Brille', 'f', 'Brillen', null, 't'), N('Mütze', 'f', 'Mützen', null, 't'),
  N('Buch', 'n', 'Bücher', 'Buches', 't'), N('Velo', 'n', 'Velos', 'Velos', 't'), N('Geschenk', 'n', 'Geschenke', 'Geschenks', 't'), N('Bild', 'n', 'Bilder', 'Bildes', 't'),
  N('Heft', 'n', 'Hefte', 'Heftes', 't'), N('Paket', 'n', 'Pakete', 'Pakets', 't'), N('Fenster', 'n', 'Fenster', 'Fensters', 't'), N('Handy', 'n', 'Handys', 'Handys', 't'),
  N('Spiel', 'n', 'Spiele', 'Spiels', 't'), N('Werkzeug', 'n', 'Werkzeuge', 'Werkzeugs', 't'),
  N('Garten', 'm', 'Gärten', 'Gartens', 'o'), N('Park', 'm', 'Parks', 'Parks', 'o'), N('Keller', 'm', 'Keller', 'Kellers', 'o'), N('Wald', 'm', 'Wälder', 'Waldes', 'o'),
  N('Schule', 'f', 'Schulen', null, 'o'), N('Küche', 'f', 'Küchen', null, 'o'), N('Stadt', 'f', 'Städte', null, 'o'), N('Bibliothek', 'f', 'Bibliotheken', null, 'o'),
  N('Garage', 'f', 'Garagen', null, 'o'), N('Werkstatt', 'f', 'Werkstätten', null, 'o'), N('Turnhalle', 'f', 'Turnhallen', null, 'o'),
  N('Haus', 'n', 'Häuser', 'Hauses', 'o'), N('Zimmer', 'n', 'Zimmer', 'Zimmers', 'o'), N('Dorf', 'n', 'Dörfer', 'Dorfes', 'o'), N('Museum', 'n', 'Museen', 'Museums', 'o'), N('Schulhaus', 'n', 'Schulhäuser', 'Schulhauses', 'o')
];
export const NOUN = Object.fromEntries(NOUNS.map((n) => [n.w, n]));
export const nounsOf = (k) => NOUNS.filter((n) => n.k === k);

export const ADJ_P = ['alt', 'jung', 'freundlich', 'nett', 'müde', 'fröhlich', 'klug', 'neu', 'gross', 'klein', 'still', 'höflich', 'mutig', 'fleissig', 'geduldig', 'streng'];
export const ADJ_T = ['neu', 'alt', 'rot', 'blau', 'grün', 'schwer', 'leicht', 'klein', 'gross', 'schön', 'kaputt', 'billig', 'bunt', 'schmutzig', 'sauber', 'gelb', 'schwarz', 'weiss'];
export const ADJ_O = ['gross', 'klein', 'alt', 'neu', 'schön', 'ruhig', 'hell', 'still'];

// Artikel und Begleiter. Reihenfolge der Fälle: N, A, D, G
export const CASES = ['N', 'A', 'D', 'G'];
export const CASE_NAME = { N: 'Nominativ', A: 'Akkusativ', D: 'Dativ', G: 'Genitiv' };
export const DEF = { m: ['der', 'den', 'dem', 'des'], f: ['die', 'die', 'der', 'der'], n: ['das', 'das', 'dem', 'des'], pl: ['die', 'die', 'den', 'der'] };
const EIN = { m: ['', 'en', 'em', 'es'], f: ['e', 'e', 'er', 'er'], n: ['', '', 'em', 'es'], pl: ['e', 'e', 'en', 'er'] };
const DIES = { m: ['er', 'en', 'em', 'es'], f: ['e', 'e', 'er', 'er'], n: ['es', 'es', 'em', 'es'], pl: ['e', 'e', 'en', 'er'] };
// Adjektiv-Endungen: schwach (nach der/dieser), gemischt (nach ein/mein/kein), stark (ohne Begleiter)
const ADJ_WEAK = { m: ['e', 'en', 'en', 'en'], f: ['e', 'e', 'en', 'en'], n: ['e', 'e', 'en', 'en'], pl: ['en', 'en', 'en', 'en'] };
const ADJ_MIX = { m: ['er', 'en', 'en', 'en'], f: ['e', 'e', 'en', 'en'], n: ['es', 'es', 'en', 'en'], pl: ['en', 'en', 'en', 'en'] };
const ADJ_STRONG = { m: ['er', 'en', 'em', 'en'], f: ['e', 'e', 'er', 'er'], n: ['es', 'es', 'em', 'en'], pl: ['e', 'e', 'en', 'er'] };

const ci = (c) => CASES.indexOf(c);
export function nounForm(n, c, plural) {
  if (plural) return c === 'D' && !/[ns]$/.test(n.pl) ? n.pl + 'n' : n.pl;
  if (n.nd && c !== 'N') return n.nd;
  if (c === 'G') return n.gen;
  return n.w;
}
export function adjForm(adj, kind, g, c) {
  const stem = adj.endsWith('e') ? adj.slice(0, -1) : adj;
  const tbl = kind === 'weak' ? ADJ_WEAK : kind === 'mix' ? ADJ_MIX : ADJ_STRONG;
  return stem + tbl[g][ci(c)];
}
// det: 'def' | 'ein' | 'kein' | 'mein' | 'dein' | 'sein' | 'ihr' | 'unser' | 'dies' | 'jed' | 'none'
export function detForm(det, g, c) {
  if (det === 'def') return DEF[g][ci(c)];
  if (det === 'none') return '';
  if (det === 'dies' || det === 'jed') return det + DIES[g][ci(c)];
  if (det === 'unser') return 'unser' + EIN[g][ci(c)];
  return det + EIN[g][ci(c)];
}
export const detKind = (det) => (det === 'def' || det === 'dies' || det === 'jed' ? 'weak' : det === 'none' ? 'strong' : 'mix');

// Nominalgruppe als Tokenliste [{w, tag}]; tag: P Pronomen/Begleiter, A Adjektiv, N Nomen
export function np(noun, c, opt = {}) {
  const n = typeof noun === 'string' ? NOUN[noun] : noun; const pl = !!opt.plural; const g = pl ? 'pl' : n.g; const det = opt.det || 'def';
  if (det === 'ein' && pl) throw new Error('ein + Plural');
  const out = []; const d = detForm(det, g, c);
  if (d) out.push({ w: d, tag: 'P' });
  if (opt.adj) out.push({ w: adjForm(opt.adj, detKind(det), g, c), tag: 'A' });
  out.push({ w: nounForm(n, c, pl), tag: 'N' });
  return out;
}
export const words = (toks) => toks.map((t) => t.w).join(' ');

// Personalpronomen
export const PRON = { '1s': { N: 'ich', A: 'mich', D: 'mir' }, '2s': { N: 'du', A: 'dich', D: 'dir' }, '3sm': { N: 'er', A: 'ihn', D: 'ihm' }, '3sf': { N: 'sie', A: 'sie', D: 'ihr' }, '3sn': { N: 'es', A: 'es', D: 'ihm' }, '1p': { N: 'wir', A: 'uns', D: 'uns' }, '2p': { N: 'ihr', A: 'euch', D: 'euch' }, '3p': { N: 'sie', A: 'sie', D: 'ihnen' } };

// Verben. pres3 = 3. Person Singular Präsens (ohne Verbzusatz), pret = 1./3. Person Singular Präteritum,
// pp = Partizip II (mit Verbzusatz), aux: h = haben, s = sein, sep = Verbzusatz, k2 = Konjunktiv II (3. Sg.)
const V = (inf, pres3, pret, pp, o = {}) => Object.assign({ inf, pres3, pret, pp, aux: 'h', sep: '', pres2: null, k2: null, frame: 'A', objs: null }, o);
const THINGS = nounsOf('t').map((n) => n.w); const PERSONS = nounsOf('p').map((n) => n.w);
export const VERBS = [
  V('kaufen', 'kauft', 'kaufte', 'gekauft'), V('suchen', 'sucht', 'suchte', 'gesucht'), V('finden', 'findet', 'fand', 'gefunden', { k2: 'fände' }), V('holen', 'holt', 'holte', 'geholt'),
  V('nehmen', 'nimmt', 'nahm', 'genommen', { pres2: 'nimmst', k2: 'nähme' }),
  V('tragen', 'trägt', 'trug', 'getragen', { pres2: 'trägst', objs: ['Tasche', 'Koffer', 'Rucksack', 'Paket', 'Jacke', 'Hut', 'Brille', 'Mütze', 'Regenschirm'] }),
  V('verlieren', 'verliert', 'verlor', 'verloren', { objs: ['Schlüssel', 'Handy', 'Brille', 'Mütze', 'Ball', 'Uhr', 'Karte', 'Regenschirm', 'Hut'] }),
  V('reparieren', 'repariert', 'reparierte', 'repariert', { objs: ['Velo', 'Uhr', 'Lampe', 'Computer', 'Fenster', 'Stuhl', 'Kamera', 'Handy', 'Gitarre'] }),
  V('öffnen', 'öffnet', 'öffnete', 'geöffnet', { objs: ['Fenster', 'Tasche', 'Flasche', 'Paket', 'Brief', 'Koffer', 'Geschenk', 'Buch'] }),
  V('lesen', 'liest', 'las', 'gelesen', { pres2: 'liest', objs: ['Brief', 'Zeitung', 'Buch', 'Karte', 'Heft'] }),
  V('essen', 'isst', 'ass', 'gegessen', { pres2: 'isst', objs: ['Kuchen', 'Apfel'] }),
  V('schreiben', 'schreibt', 'schrieb', 'geschrieben', { objs: ['Brief', 'Karte'] }),
  V('vergessen', 'vergisst', 'vergass', 'vergessen', { pres2: 'vergisst', objs: ['Schlüssel', 'Regenschirm', 'Tasche', 'Heft', 'Handy', 'Jacke', 'Mütze', 'Brille'] }),
  V('putzen', 'putzt', 'putzte', 'geputzt', { pres2: 'putzt', objs: ['Fenster', 'Velo', 'Brille', 'Stuhl', 'Lampe'] }),
  V('einpacken', 'packt', 'packte', 'eingepackt', { sep: 'ein', objs: ['Geschenk', 'Koffer', 'Rucksack', 'Buch', 'Kamera', 'Jacke', 'Flasche'] }),
  V('aufräumen', 'räumt', 'räumte', 'aufgeräumt', { sep: 'auf', objs: ['Zimmer', 'Küche', 'Keller', 'Garage', 'Werkstatt'] }),
  V('abholen', 'holt', 'holte', 'abgeholt', { sep: 'ab', frame: 'AP' }), V('anrufen', 'ruft', 'rief', 'angerufen', { sep: 'an', frame: 'AP' }),
  V('besuchen', 'besucht', 'besuchte', 'besucht', { frame: 'AP' }), V('begrüssen', 'begrüsst', 'begrüsste', 'begrüsst', { pres2: 'begrüsst', frame: 'AP' }),
  V('fragen', 'fragt', 'fragte', 'gefragt', { frame: 'AP' }), V('einladen', 'lädt', 'lud', 'eingeladen', { sep: 'ein', pres2: 'lädst', pres2p: 'ladet', frame: 'AP' }), V('sehen', 'sieht', 'sah', 'gesehen', { pres2: 'siehst', frame: 'AP', k2: 'sähe' }),
  V('helfen', 'hilft', 'half', 'geholfen', { pres2: 'hilfst', frame: 'D' }), V('danken', 'dankt', 'dankte', 'gedankt', { frame: 'D' }), V('gratulieren', 'gratuliert', 'gratulierte', 'gratuliert', { frame: 'D' }),
  V('antworten', 'antwortet', 'antwortete', 'geantwortet', { frame: 'D' }), V('zuhören', 'hört', 'hörte', 'zugehört', { sep: 'zu', frame: 'D' }), V('vertrauen', 'vertraut', 'vertraute', 'vertraut', { frame: 'D' }),
  V('folgen', 'folgt', 'folgte', 'gefolgt', { aux: 's', frame: 'D' }), V('begegnen', 'begegnet', 'begegnete', 'begegnet', { aux: 's', frame: 'D' }),
  V('gehören', 'gehört', 'gehörte', 'gehört', { frame: 'TD' }), V('gefallen', 'gefällt', 'gefiel', 'gefallen', { frame: 'TD' }),
  V('geben', 'gibt', 'gab', 'gegeben', { pres2: 'gibst', frame: 'DA', k2: 'gäbe' }), V('schenken', 'schenkt', 'schenkte', 'geschenkt', { frame: 'DA' }), V('zeigen', 'zeigt', 'zeigte', 'gezeigt', { frame: 'DA' }),
  V('bringen', 'bringt', 'brachte', 'gebracht', { frame: 'DA' }), V('schicken', 'schickt', 'schickte', 'geschickt', { frame: 'DA' }), V('leihen', 'leiht', 'lieh', 'geliehen', { frame: 'DA' }),
  V('mitbringen', 'bringt', 'brachte', 'mitgebracht', { sep: 'mit', frame: 'DA' }),
  V('warten', 'wartet', 'wartete', 'gewartet', { frame: 'L' }), V('spielen', 'spielt', 'spielte', 'gespielt', { frame: 'L' }), V('arbeiten', 'arbeitet', 'arbeitete', 'gearbeitet', { frame: 'L' }),
  V('sitzen', 'sitzt', 'sass', 'gesessen', { pres2: 'sitzt', frame: 'L' }), V('stehen', 'steht', 'stand', 'gestanden', { frame: 'L' }), V('schlafen', 'schläft', 'schlief', 'geschlafen', { pres2: 'schläfst', frame: 'L' }),
  V('gehen', 'geht', 'ging', 'gegangen', { aux: 's', frame: 'R', k2: 'ginge' }), V('laufen', 'läuft', 'lief', 'gelaufen', { aux: 's', pres2: 'läufst', frame: 'R' }),
  V('fahren', 'fährt', 'fuhr', 'gefahren', { aux: 's', pres2: 'fährst', frame: 'R' }), V('rennen', 'rennt', 'rannte', 'gerannt', { aux: 's', frame: 'R' }), V('kommen', 'kommt', 'kam', 'gekommen', { aux: 's', frame: 'R', k2: 'käme' })
];
VERBS.forEach((v) => { if (!v.objs && v.frame === 'A') v.objs = THINGS; if (v.frame === 'AP') v.objs = PERSONS; if (v.frame === 'DA' && !v.objs) v.objs = ['Buch', 'Geschenk', 'Brief', 'Karte', 'Bild', 'Paket', 'Ball', 'Blume', 'Heft', 'Kamera', 'Velo', 'Regenschirm', 'Schlüssel']; });
export const VERB = Object.fromEntries(VERBS.map((v) => [v.inf, v]));
export const verbsOf = (...frames) => VERBS.filter((v) => frames.includes(v.frame));

const AUX = {
  haben: { pres: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'], pret: ['hatte', 'hattest', 'hatte', 'hatten', 'hattet', 'hatten'] },
  sein: { pres: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'], pret: ['war', 'warst', 'war', 'waren', 'wart', 'waren'] },
  werden: { pres: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'], pret: ['wurde', 'wurdest', 'wurde', 'wurden', 'wurdet', 'wurden'] }
};
const PIDX = { '1s': 0, '2s': 1, '3s': 2, '1p': 3, '2p': 4, '3p': 5 };
export const auxForm = (aux, tense, person) => AUX[aux][tense][PIDX[person]];
const baseInf = (v) => (v.sep ? v.inf.slice(v.sep.length) : v.inf);
const needsE = (stem) => /[td]$/.test(stem) || /[^lrhmnaeiouäöü][mn]$/.test(stem);

// Personalform (ohne Verbzusatz). tense: 'pres' | 'pret'
export function finite(v, tense, person) {
  const inf = baseInf(v), stem = inf.slice(0, -2);
  if (tense === 'pres') {
    switch (person) {
      case '1s': return stem + 'e';
      case '2s': return v.pres2 || (/(s|ss|z|x)$/.test(stem) ? stem + 't' : needsE(stem) ? stem + 'est' : stem + 'st');
      case '3s': return v.pres3;
      case '2p': return v.pres2p || (needsE(stem) ? stem + 'et' : stem + 't');
      default: return inf;
    }
  }
  const weak = v.pret.endsWith('te');
  switch (person) {
    case '1s': case '3s': return v.pret;
    case '2s': return v.pret + 'st';
    case '2p': return v.pret + 't';
    default: return v.pret + (weak ? 'n' : 'en');
  }
}
export const konj1 = (v) => (v.inf === 'sein' ? 'sei' : baseInf(v).slice(0, -2) + 'e');

export const TIME_ADV = ['heute', 'morgen', 'gestern', 'bald', 'oft', 'manchmal', 'jetzt', 'später', 'abends', 'endlich', 'gern', 'selten', 'täglich', 'vorhin', 'dort', 'hier', 'draussen', 'immer'];
export const PAST_ADV = ['gestern', 'vorhin', 'neulich', 'damals', 'letzte Woche', 'am Montag', 'am Abend', 'vor einer Stunde'];
export const PRES_ADV = ['heute', 'jetzt', 'gerade', 'oft', 'manchmal', 'jeden Tag', 'am Abend', 'am Morgen'];
export const FUT_ADV = ['morgen', 'bald', 'später', 'nächste Woche', 'am Samstag', 'übermorgen'];

// Präpositionen mit festem Fall
export const PREP = {
  A: ['für', 'ohne', 'gegen', 'durch', 'um'],
  D: ['mit', 'nach', 'aus', 'seit', 'bei', 'von', 'zu', 'ausser', 'gegenüber'],
  G: ['wegen', 'trotz', 'während', 'statt', 'innerhalb', 'ausserhalb'],
  W: ['in', 'an', 'auf', 'hinter', 'neben', 'über', 'unter', 'vor', 'zwischen']
};
export const TENSE_NAME = { pres: 'Präsens', pret: 'Präteritum', perf: 'Perfekt', plus: 'Plusquamperfekt', fut: 'Futur I' };
