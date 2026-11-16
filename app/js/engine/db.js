// Aufgaben-Datenbank: eingebaute Inhalte und Inhalte aus eigenen Paketen (JSON) landen hier.
// Jeder Typ hat ein festes Format (siehe SCHEMA). validateItem prüft Importe.

export const DB = {};
export const TYPES = {
  wortart: { name: 'Sätze mit Wortarten', skill: 'D1', req: ['s'], help: 'Jedes Wort mit |V |N |A |P |K |PR |X markieren (Verb, Nomen, Adjektiv, Pronomen, Konjunktion, Präposition, übrige Partikel).', example: { s: 'Der|P alte|A Hund|N schläft|V oft|X im|PR Garten|N .' } },
  steigerung: { name: 'Steigerung von Adjektiven', skill: 'D1', req: ['p', 'k', 's'], example: { p: 'gut', k: 'besser', s: 'am besten' } },
  objekt: { name: 'Sätze mit Objekten', skill: 'D7', req: ['s'], help: 'Objekte in eckige Klammern mit Fall: [dem Nachbarn|D]. Fälle: A, D, G. Subjekt optional mit |S.', example: { s: '[Die Lehrerin|S] dankt [dem neuen Schüler|D] herzlich.' } },
  modus: { name: 'Modus und Funktion', skill: 'D4', req: ['s', 'm', 'f'], help: 'Das Verb in eckige Klammern. m: I (Indikativ), K1, K2, IMP. f: Wirklichkeit, Vorsatz, Vermutung, Bitte, Befehl, Verbot, indirekte Rede, Wunsch.', example: { s: 'Sie sagt, er [habe] keine Zeit.', m: 'K1', f: 'indirekte Rede' } },
  modusform: { name: 'Verbform ergänzen', skill: 'D4', req: ['s', 'a', 'm'], example: { s: 'Wenn ich Zeit ___ (haben), käme ich mit.', a: ['hätte'], m: 'Konjunktiv II' } },
  verbinden: { name: 'Sätze verbinden', skill: 'D8', req: ['c', 'main', 'sub'], help: 'Teilsatz als «Subjekt|Personalform|Mitte|Verbende|Verb-am-Ende-Form». c = Konjunktion. Bei und/aber/denn/oder: main und sub sind beides Hauptsätze.', example: { c: 'weil', main: 'wir|blieben|zu Hause||', sub: 'es|regnete|stark||' } },
  umformen: { name: 'Sätze umformen', skill: 'D9', req: ['src', 'how', 'answers'], example: { src: 'Wegen des Regens blieben wir zu Hause.', how: 'Nebensatz mit «weil»', answers: ['Weil es regnete, blieben wir zu Hause.', 'Wir blieben zu Hause, weil es regnete.'] } },
  wortfamilie: { name: 'Wortfamilien', skill: 'D10', req: ['n', 'v', 'a'], help: 'n = Nomen mit Artikel, v = Verben, a = Adjektive (je eine Liste erlaubter Antworten). Keine zusammengesetzten Wörter, keine nominalisierten Verben, keine Partizipien.', example: { n: ['der Mut'], v: ['ermutigen'], a: ['mutig'] } },
  synonym: { name: 'Synonym-Gruppen', skill: 'D11', req: ['g', 'x'], help: 'g = mindestens 3 Wörter mit gleicher Bedeutung, x = Wörter, die nicht passen.', example: { g: ['schnell', 'rasch', 'flink'], x: ['gemächlich', 'pünktlich'] } },
  antonym: { name: 'Antonyme', skill: 'D11', req: ['w', 's', 'a'], help: 'w = Wort, s = Satz oder Wortgruppe, a = erlaubte Gegenwörter (nie mit un-).', example: { w: 'leicht', s: 'ein leichter Rucksack', a: ['schwer'] } },
  oberbegriff: { name: 'Ober- und Unterbegriffe', skill: 'D12', req: ['o', 'u'], example: { o: ['Werkzeug', 'Werkzeuge'], u: ['Hammer', 'Zange', 'Säge', 'Feile'] } },
  wortfeld: { name: 'Wortfeld: Wort und Bedeutung', skill: 'D12', req: ['feld', 'w', 'd'], example: { feld: 'gehen', w: 'schlendern', d: 'gemütlich und ohne Eile gehen' } },
  komma: { name: 'Kommasätze', skill: 'D14', req: ['s'], help: 'Korrekter Satz mit allen Kommas. Mindestens 1 Komma.', example: { s: 'Als es dunkel wurde, gingen wir nach Hause.' } },
  nominal: { name: 'Gross oder klein?', skill: 'D15', req: ['s', 'o', 'a'], help: 's = Satz mit ___, o = 2 Schreibweisen, a = Index der richtigen, why = Regel.', example: { s: 'Beim ___ vergesse ich die Zeit.', o: ['Lesen', 'lesen'], a: 0, why: 'Nominalisiertes Verb nach «beim».' } },
  schreibung: { name: 'Rechtschreibung: richtig oder falsch', skill: 'D15', req: ['o', 'a'], help: 'o = Schreibweisen oder Wörter zur Wahl, a = Index der richtigen, s = Satz mit ___ (optional).', example: { o: ['nämlich', 'nähmlich'], a: 0 } },
  fehlertext: { name: 'Texte für die Fehlersuche', skill: 'D15', req: ['t'], help: 'Fehlerfreier Text mit 40–90 Wörtern, mindestens 4 Kommas und 1 «dass».', example: { t: 'Als wir am Morgen aufbrachen, …' } },
  text: { name: 'Lesetexte mit Aufgaben', skill: 'D16', req: ['title', 'text', 'aussagen'], help: 'Siehe LLM-Anleitung: Text mit Figur, Aussagen, Wortzuordnung, Fragen.' },
  aufsatz: { name: 'Aufsatzthemen', skill: 'D29', req: ['title', 'typ', 'auftrag'], help: 'typ: eroerterung, erzaehlung, fortsetzung, bild, erlebnis, beschreibung, bericht.', example: { title: 'Hausaufgaben abschaffen?', typ: 'eroerterung', auftrag: ['Erkläre, wozu Hausaufgaben dienen.', 'Erörtere Vor- und Nachteile.', 'Begründe deine eigene Meinung.'], keys: ['Hausaufgaben'] } },
  baustein: { name: 'Aufsatz-Bausteine', skill: 'D22', req: ['kind', 'rows', 'cols', 'a'], help: 'Zuordnungsaufgabe: rows = Sätze, cols = Kategorien, a = richtige Spalte je Satz, skill = D22–D27.' },
  quiz: { name: 'Quizfragen', skill: 'D31', req: ['skill', 'q', 'o', 'a'], help: 'o[a] ist richtig. why = Erklärung.', example: { skill: 'D31', q: 'Wie viele Kreuze setzt du, wenn 4 Adjektive verlangt sind?', o: ['Genau 4', 'So viele wie möglich', 'Mindestens 5'], a: 0, why: 'Jedes Kreuz zu viel kostet 1 Punkt.' } },
  mathe: { name: 'Mathe-Textaufgaben mit Platzhaltern', skill: 'M11', req: ['skill', 'text', 'params', 'answer'], help: 'Platzhalter {a}. params: Bereich {min,max,step} oder {pick:[…]}. answer.expr = Formel aus den Platzhaltern. where = Bedingungen. Siehe LLM-Anleitung.', example: { skill: 'M11', text: ['In einer Klasse mit {n} Lernenden kommen {k} mit dem Velo. Wie viel Prozent sind das?'], params: { n: { pick: [20, 24, 25] }, k: { min: 3, max: 12 } }, where: ['k<n'], answer: { expr: 'k/n*100', unit: '%', round: 1 }, solution: ['Anteil = {k} : {n}', 'mal 100'] } }
};
// ALL hält alle Einträge, DB nur die aus verwendeten Paketen (siehe setInactive)
const ALL = {};
let OFF = new Set();
Object.keys(TYPES).forEach((t) => { DB[t] = []; ALL[t] = []; });
export const allItems = (type) => ALL[type] || [];
// Herkunft ausschalten: 'eingebaut' oder 'eigen:<Paketname>'. Aufgaben kommen dann nur noch aus den übrigen Paketen.
export function setInactive(origins) { OFF = new Set(origins || []); for (const t of Object.keys(ALL)) DB[t] = ALL[t].filter((it) => !OFF.has(it._o)); }
export const isActive = (origin) => !OFF.has(origin);
// Einträge aus den verwendeten Paketen; sind es weniger als min (z. B. für Ablenker oder in Simulationen), dann aus allen Paketen
export function poolOf(type, pred, min = 1) { const a = pred ? DB[type].filter(pred) : DB[type]; if (a.length >= min) return a; return pred ? ALL[type].filter(pred) : ALL[type]; }
export function originCounts() { const out = {}; for (const t of Object.keys(ALL)) for (const it of ALL[t]) out[it._o] = (out[it._o] || 0) + 1; return out; }

export function validateItem(type, it) {
  const T = TYPES[type];
  if (!T) return 'Unbekannter Typ «' + type + '»';
  if (!it || typeof it !== 'object') return 'Eintrag ist kein Objekt';
  for (const k of T.req) if (it[k] == null || it[k] === '' || (Array.isArray(it[k]) && !it[k].length)) return 'Feld «' + k + '» fehlt';
  if (type === 'wortart' && !/\|(V|N|A|P|K|PR|X)\b/.test(it.s)) return 'Keine Wortart-Marken gefunden';
  if (type === 'objekt' && !/\[[^\]]+\|[ADG]\]/.test(it.s)) return 'Kein Objekt in [..|A/D/G] gefunden';
  if (type === 'modus' && (!/\[[^\]]+\]/.test(it.s) || !['I', 'K1', 'K2', 'IMP'].includes(it.m))) return 'Verb in [ ] oder Modus (I, K1, K2, IMP) fehlt';
  if (type === 'komma' && !it.s.includes(',')) return 'Satz enthält kein Komma';
  if ((type === 'nominal' || type === 'schreibung' || type === 'quiz') && !(Number.isInteger(it.a) && it.a >= 0 && it.a < it.o.length)) return 'a muss ein gültiger Index in o sein';
  if (type === 'synonym' && (it.g.length < 3 || it.x.length < 1)) return 'g braucht mindestens 3 Wörter, x mindestens 1';
  if (type === 'verbinden') for (const k of ['main', 'sub']) if (String(it[k]).split('|').length < 4) return k + ': Format Subjekt|Personalform|Mitte|Verbende';
  if (type === 'mathe') { if (!Array.isArray(it.text) || !it.answer || !it.answer.expr) return 'text (Liste) und answer.expr nötig'; }
  if (type === 'aufsatz' && !Array.isArray(it.auftrag)) return 'auftrag muss eine Liste sein';
  if (type === 'baustein' && it.rows.length !== it.a.length) return 'rows und a müssen gleich lang sein';
  return null;
}

// Fügt Einträge hinzu. Gibt { added, errors } zurück.
export function addItems(type, items, origin = 'eingebaut') {
  const errors = []; let added = 0;
  if (!DB[type]) return { added, errors: ['Unbekannter Typ «' + type + '»'] };
  (items || []).forEach((it, i) => {
    const err = validateItem(type, it);
    if (err) { errors.push(type + ' #' + (i + 1) + ': ' + err); return; }
    const item = Object.assign({}, it, { _o: origin, _id: it.id || (origin + ':' + type + ':' + ALL[type].length) });
    ALL[type].push(item); if (!OFF.has(origin)) DB[type].push(item);
    added++;
  });
  return { added, errors };
}
export function removeOrigin(origin) { for (const t of Object.keys(ALL)) { ALL[t] = ALL[t].filter((it) => it._o !== origin); DB[t] = DB[t].filter((it) => it._o !== origin); } }
export function counts() { const out = {}; for (const t of Object.keys(DB)) out[t] = { total: DB[t].length, own: DB[t].filter((it) => it._o !== 'eingebaut').length }; return out; }

// Ein Paket ist { name, items: { typ: [einträge] } }
export function addPack(pack, origin) {
  const report = { added: 0, errors: [] };
  if (!pack || typeof pack !== 'object' || !pack.items || typeof pack.items !== 'object') { report.errors.push('Paket braucht das Feld «items» mit Listen pro Typ.'); return report; }
  for (const [type, items] of Object.entries(pack.items)) {
    if (!Array.isArray(items)) { report.errors.push(type + ': keine Liste'); continue; }
    const r = addItems(type, items, origin); report.added += r.added; report.errors.push(...r.errors);
  }
  return report;
}
