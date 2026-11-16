// Katalog aller Skills (D1–D31, M1–M25) nach den Prüfungsanforderungen ZAP2.
// w = Gewicht im Prüfungsteil (Punkte in der Prüfung 2026, sonst kleiner Schätzwert).
// part: 'sprache' (Sprachprüfung, 45 Min., 75 P), 'aufsatz' (90 Min.), 'mathe' (90 Min., 37 P).

export const PARTS = {
  sprache: { name: 'Sprachprüfung', long: 'Sprachbetrachtung und Textverständnis', minutes: 45, points: 75, weight: 0.25, secPerPoint: 36 },
  aufsatz: { name: 'Aufsatz', long: 'Verfassen eines Textes', minutes: 90, points: 15, weight: 0.25, secPerPoint: 360 },
  mathe: { name: 'Mathematik', long: 'Mathematik', minutes: 90, points: 37, weight: 0.5, secPerPoint: 146 }
};

export const AREAS = [
  { id: 'd-gram', subj: 'D', name: 'Grammatik' },
  { id: 'd-wort', subj: 'D', name: 'Wortschatz' },
  { id: 'd-recht', subj: 'D', name: 'Komma und Rechtschreibung' },
  { id: 'd-text', subj: 'D', name: 'Textverständnis' },
  { id: 'd-aufsatz', subj: 'D', name: 'Aufsatz' },
  { id: 'd-tech', subj: 'D', name: 'Lesen und Prüfungstechnik' },
  { id: 'm-zahl', subj: 'M', name: 'Zahlen und Terme' },
  { id: 'm-gleich', subj: 'M', name: 'Gleichungen' },
  { id: 'm-sach', subj: 'M', name: 'Sachrechnen, Daten, Funktionen' },
  { id: 'm-ebene', subj: 'M', name: 'Geometrie in der Ebene' },
  { id: 'm-raum', subj: 'M', name: 'Geometrie im Raum' },
  { id: 'm-tech', subj: 'M', name: 'Prüfungstechnik' }
];

const S = (id, area, part, w, name, desc, ref, week) => ({ id, area, part, w, name, desc, ref: ref || '', week, subj: id[0] });

export const SKILLS = [
  S('D1', 'd-gram', 'sprache', 6, 'Wortarten', 'Verb, Nomen, Adjektiv, Pronomen, Partikel bestimmen; bei Partikeln Präposition, Konjunktion, übrige.', 'Aufg. 9', 2),
  S('D2', 'd-gram', 'sprache', 1, 'Verbteile', 'Personalform, Infinitiv, Partizip II, Verbzusatz finden.', 'Aufg. 6, 8', 3),
  S('D3', 'd-gram', 'sprache', 4, 'Zeitformen', 'Präsens, Präteritum, Perfekt, Plusquamperfekt, Futur I bilden und umformen.', 'Aufg. 8', 3),
  S('D4', 'd-gram', 'sprache', 6, 'Modus', 'Indikativ, Imperativ, Konjunktiv I und II erkennen, Form ergänzen, Funktion zuordnen.', 'Aufg. 6', 4),
  S('D5', 'd-gram', 'sprache', 1, 'Aktiv und Passiv', 'Aktiv und Passiv erkennen.', '', 4),
  S('D6', 'd-gram', 'sprache', 6, 'Fall (Kasus)', 'Nomen, Adjektiv, Pronomen richtig deklinieren; Fall nach Präposition.', 'Aufg. 7', 5),
  S('D7', 'd-gram', 'sprache', 5, 'Satzglieder', 'Subjekt, Akkusativ-, Dativ-, Genitivobjekt mit Frageprobe bestimmen.', 'Aufg. 10', 6),
  S('D8', 'd-gram', 'sprache', 6, 'Sätze verbinden', 'Sätze mit Konjunktionen verbinden; Verb im Nebensatz am Ende.', 'Aufg. 5', 7),
  S('D9', 'd-gram', 'sprache', 4, 'Sätze umformen', 'Umformen mit weil, obwohl, während oder Relativsatz.', 'Aufg. 13', 12),
  S('D10', 'd-wort', 'sprache', 6, 'Wortfamilie', 'Zu einem Wort Nomen (mit Artikel), Verb und Adjektiv bilden.', 'Aufg. 11', 10),
  S('D11', 'd-wort', 'sprache', 4, 'Synonyme und Antonyme', 'Passendes Synonym oder Antonym finden; Antonym nie mit «un-».', 'Aufg. 12', 11),
  S('D12', 'd-wort', 'sprache', 1, 'Ober- und Unterbegriffe, Wortfelder', 'Begriffe ordnen; Wörter eines Wortfelds unterscheiden.', '', 10),
  S('D13', 'd-wort', 'sprache', 5, 'Wortbedeutung aus dem Text', 'Ein Wort aus dem Text einem Satz zuordnen.', 'Aufg. 2', 4),
  S('D14', 'd-recht', 'sprache', 3, 'Komma', 'Komma bei Aufzählung, vor Nebensatz, um Relativsatz; Anführungszeichen.', 'Aufg. 14', 9),
  S('D15', 'd-recht', 'sprache', 2, 'Rechtschreibung', 'das/dass, gross/klein, Nominalisierung, ss statt ß, Fehlerwörter.', 'Aufg. 14', 12),
  S('D16', 'd-text', 'sprache', 7, 'Aussagen prüfen', 'Richtig, falsch oder keine Angabe: Nur zählt, was im Text steht.', 'Aufg. 3', 2),
  S('D17', 'd-text', 'sprache', 4, 'Figur charakterisieren', 'Passende Adjektive für eine Figur wählen und belegen.', 'Aufg. 1', 3),
  S('D18', 'd-text', 'sprache', 4, 'Offene Fragen', 'Fragen zum Text in eigenen Worten beantworten.', 'Aufg. 4', 5),
  S('D19', 'd-text', 'sprache', 3, 'Absicht, Kernaussage, Titel', 'Absicht, Pointe, Kernaussage und Titel deuten; Realität und Fiktion trennen.', 'Aufg. 4', 6),
  S('D20', 'd-aufsatz', 'aufsatz', 1, 'Auftrag zerlegen', 'Teilaufträge und Verben (beschreibe, erörtere, begründe …) markieren.', '', 2),
  S('D21', 'd-aufsatz', 'aufsatz', 1, 'In 10 Minuten planen', 'Stichwortplan mit 1 Zeile pro Absatz.', '', 2),
  S('D22', 'd-aufsatz', 'aufsatz', 3, 'Erörterung', 'Einleitung, Pro und Contra (Behauptung, Begründung, Beispiel), Schluss mit Meinung.', '', 2),
  S('D23', 'd-aufsatz', 'aufsatz', 2, 'Erzählung', 'Spannungsbogen, Höhepunkt, innere Handlung, Präteritum, passender Schluss.', '', 4),
  S('D24', 'd-aufsatz', 'aufsatz', 1, 'Fortsetzung', 'Perspektive, Zeitform und Elemente des Anfangs übernehmen.', '', 7),
  S('D25', 'd-aufsatz', 'aufsatz', 1.5, 'Bild oder Cartoon', 'Geordnet beschreiben und deuten.', '', 6),
  S('D26', 'd-aufsatz', 'aufsatz', 1, 'Erlebnis und Reflexion', '2 Teile im Verhältnis, das der Auftrag nahelegt.', '', 9),
  S('D27', 'd-aufsatz', 'aufsatz', 1.5, 'Stil', 'Satzanfänge wechseln, Verbindungswörter, treffende Verben, keine Wiederholungen.', '', 10),
  S('D28', 'd-aufsatz', 'aufsatz', 1, 'Überarbeiten', 'In 15 Minuten mit Checkliste überarbeiten.', '', 11),
  S('D29', 'd-aufsatz', 'aufsatz', 2, 'Ganzer Aufsatz in 90 Minuten', 'Planen, schreiben, überarbeiten unter Zeit.', '', 8),
  S('D30', 'd-tech', 'sprache', 0, 'Täglich lesen', '20 Minuten pro Tag: mehr Wortschatz, schnelleres Lesen, mehr Beispiele.', '', 1),
  S('D31', 'd-tech', 'sprache', 1, 'Regeln der Sprachprüfung', 'Nie mehr Kreuze als verlangt; 1 Wort, wo 1 Wort verlangt ist; höchstens 5 Änderungen.', '', 12),

  S('M1', 'm-zahl', 'mathe', 1, 'Rechenregeln und Brüche', 'Punkt vor Strich, Klammern, Vorzeichen; Brüche kürzen, erweitern, rechnen.', '', 2),
  S('M2', 'm-zahl', 'mathe', 2, 'Potenzen und Wurzeln', 'Potenzregeln bei gleicher Basis, Zehnerpotenzen, Quadratwurzel.', 'Aufg. 1b, 3b', 2),
  S('M3', 'm-zahl', 'mathe', 1, 'Teiler, ggT, kgV', 'Teiler, Vielfache, Primfaktoren, ggT, kgV; Sachaufgaben (Zahnräder).', 'Aufg. 1e', 7),
  S('M4', 'm-zahl', 'mathe', 3, 'Terme', 'Vereinfachen, ausmultiplizieren, ausklammern, Werte einsetzen.', 'Aufg. 1a–1c', 3),
  S('M5', 'm-zahl', 'mathe', 4, 'Bruch- und Wurzelterme', 'Bruchterme kürzen, multiplizieren, dividieren; Wurzelterme vereinfachen.', 'Aufg. 3', 4),
  S('M6', 'm-gleich', 'mathe', 4, 'Lineare Gleichungen', 'Gleichungen mit Klammern und Brüchen lösen; Probe machen.', 'Aufg. 2', 5),
  S('M7', 'm-gleich', 'mathe', 1, 'Formeln auflösen', 'Formeln nach jeder Variablen auflösen.', 'Aufg. 1d', 5),
  S('M8', 'm-gleich', 'mathe', 3, 'Textgleichungen', 'Gleichung aus einem Text aufstellen.', 'Aufg. 4', 6),
  S('M9', 'm-gleich', 'mathe', 2, 'Figurenfolgen', 'Anzahl bei Figur n als Term.', 'Aufg. 10', 6),
  S('M10', 'm-sach', 'mathe', 1, 'Einheiten', 'Länge, Fläche, Volumen, Liter, Gewicht, Zeit umwandeln.', 'Aufg. 1f', 8),
  S('M11', 'm-sach', 'mathe', 3, 'Prozent', 'Prozentwert, Grundwert, Prozentsatz; Zu- und Abnahme; Anteile.', 'Aufg. 5', 7),
  S('M12', 'm-sach', 'mathe', 1, 'Proportionalität', 'Proportional und umgekehrt proportional (Dreisatz).', '', 7),
  S('M13', 'm-sach', 'mathe', 1, 'Diagramme und Mittelwert', 'Säulen-, Linien-, Kreisdiagramm lesen; Mittelwert.', '', 12),
  S('M14', 'm-sach', 'mathe', 2, 'Graphen', 'Weg-Zeit-Graph und Füllgraph lesen und zuordnen.', 'Aufg. 6', 12),
  S('M15', 'm-sach', 'mathe', 3, 'Wahrscheinlichkeit', 'Günstig durch möglich; 2-stufig; «mindestens 1» über das Gegenereignis.', 'Aufg. 7', 12),
  S('M16', 'm-ebene', 'mathe', 1, 'Winkel', 'Winkel an Geraden und Parallelen; Winkelsumme Dreieck und Viereck.', 'Aufg. 1g', 9),
  S('M17', 'm-ebene', 'mathe', 3, 'Umfang und Fläche', 'Dreiecke, Vierecke, zusammengesetzte Figuren; Länge über Gleichung.', 'Aufg. 1g, 8', 9),
  S('M18', 'm-ebene', 'mathe', 2, 'Pythagoras und Thales', 'Satz des Pythagoras (eben und im Raum), Satz des Thales.', 'Aufg. 9a', 10),
  S('M19', 'm-ebene', 'mathe', 1, 'Konstruieren', 'Mittelsenkrechte, Winkelhalbierende, Höhen, Schwerlinien, In- und Umkreis, Vierecke.', 'Aufg. 1i', 10),
  S('M20', 'm-ebene', 'mathe', 2, 'Symmetrie und Spiegelung', 'Achsen-, Punkt-, Drehsymmetrie; Spiegelung an Gerade und Punkt.', 'Aufg. 6', 10),
  S('M21', 'm-raum', 'mathe', 1.5, 'Körper: Netze, Ansichten', 'Würfel, Quader, Prisma, Pyramide: Netz, Ansichten, Ecken, Kanten, Flächen.', 'Aufg. 10', 11),
  S('M22', 'm-raum', 'mathe', 3, 'Volumen und Oberfläche', 'Volumen, Oberfläche; Pyramidenhöhe mit Pythagoras.', 'Aufg. 1h, 9', 11),
  S('M23', 'm-tech', 'mathe', 0.5, 'Taschenrechner', 'Eigenen Rechner sicher bedienen: Brüche, Potenzen, Wurzeln, Klammern.', '', 1),
  S('M24', 'm-tech', 'mathe', 0.5, 'Lösungsweg zeigen', 'Weg zeigen, Resultat markieren, nur 1 Lösung stehen lassen.', '', 8),
  S('M25', 'm-tech', 'mathe', 1, 'Aufgabe 1 im Tempo', '9 Kurzaufgaben in höchstens 24 Minuten.', '', 13)
];

export const SKILL = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
export const skillsOf = (pred) => SKILLS.filter(pred);
export const areaSkills = (areaId) => SKILLS.filter((s) => s.area === areaId);
export const partSkills = (part) => SKILLS.filter((s) => s.part === part);
export const secPerPoint = (skillId) => PARTS[SKILL[skillId].part].secPerPoint;

// Bestehensgrenzen und Notenformeln (Kanton Zürich, Aufnahme 2027)
export const RULES = {
  examDate: '2027-03-08',
  passWithVN: 4.75, passNoVN: 4.5,
  pn: (ns, na, nm) => 0.25 * ns + 0.25 * na + 0.5 * nm,
  neededPN: (vn) => (vn == null ? 4.5 : 9.5 - vn),
  neededMath: (pnMin, ns, na) => 2 * pnMin - 0.5 * ns - 0.5 * na
};
