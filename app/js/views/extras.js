// Hilfe (Prüfungstag, Tastenkürzel, Fragen) und druckbare Arbeitsblätter mit Lösungen.
import { h, btn, mathify, toast, icon } from '../ui.js';
import { state, save } from '../store.js';
import { SKILL, SKILLS, RULES } from '../skills.js';
import { keysFor, makeTask, genInfo, hasSources } from '../engine/sources.js';
import { mountTask, answerText } from '../engine/task.js';
import { THEORY } from '../../content/theorie.js';
import { newSeed, fmtDate, RNG, dayKey, addDays, fmtGrade, fmtDur, MOD, IS_MAC } from '../util.js';
import { readiness, buildPlan, strengths, skillStats, allStats, weekGoal, STAGES, SURE } from '../stats.js';

const api = window.gymi || null;
const ZH = 'https://www.zh.ch/de/bildung/schulen/maturitaetsschule/zentrale-aufnahmepruefung/pruefung-fuer-das-kurzgymnasium.html';
const ui = { h, mathify };

// Stand: Website des Kantons Zürich (Prüfung für das Kurzgymnasium), abgerufen im November 2026.
const BRING = [
  ['ausweis', 'Amtlicher Ausweis (Pass oder Identitätskarte)'],
  ['stift', 'Füllfeder, Kugelschreiber oder Filzstift in Blau oder Schwarz'],
  ['korrektur', 'Tipp-Ex oder Korrekturroller'],
  ['lineal', 'Lineal'],
  ['bleistift', 'Bleistift und Radiergummi (nur für Geometrie)'],
  ['geo', 'Geodreieck und Zirkel'],
  ['rechner', 'Taschenrechner: 1 der 4 erlaubten Modelle (TI-30 ECO RS, TI-30X IIS, CASIO FX-82 SOLAR II, SHARP EL-501 T)'],
  ['woerterbuch', 'Für den Aufsatz: das Wörterbuch aus der Sek oder der Duden Band 1 «Die deutsche Rechtschreibung» (ohne Notizen und Beilagen)']
];
const NOT_ALLOWED = ['radierbare Stifte', 'Notizen oder Beilagen im Wörterbuch', 'eigenes Papier', 'digitale Geräte (werden abgegeben)', 'eigene Gehörschutzstöpsel (ausser mit Nachteilsausgleich)'];

export function renderHelp(page) {
  const p = state.profile; p.checklist = p.checklist || {};
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Hilfe'), h('p', null, 'Prüfungstag, Bedienung und häufige Fragen.')));

  // Prüfungstag
  const list = h('div', { class: 'stack' }, BRING.map(([k, label]) => { const cb = h('input', { type: 'checkbox', checked: p.checklist[k] || null, onchange: () => { p.checklist[k] = cb.checked; save(); } }); return h('label', { class: 'choice' }, cb, h('span', null, label)); }));
  page.append(h('div', { class: 'cols two', style: { alignItems: 'start' } },
    h('div', { class: 'card' }, h('h2', null, 'Prüfungstag'), h('p', null, h('b', null, 'Montag, 8. März 2027'), ' (Kurzgymnasium).'),
      h('table', { class: 'list' }, h('tbody', null,
        h('tr', null, h('td', { class: 'nowrap' }, '9.00–9.45'), h('td', null, 'Deutsch: Sprachbetrachtung und Textverständnis (45 Min.)')),
        h('tr', null, h('td', { class: 'nowrap' }, '10.15–11.45'), h('td', null, 'Mathematik (90 Min.)')),
        h('tr', null, h('td', { class: 'nowrap' }, '13.15–14.45'), h('td', null, 'Deutsch: Aufsatz (90 Min.)')))),
      h('p', { class: 'small' }, h('b', null, 'Krank? '), 'Melde dich bei der Schulleitung und reiche innerhalb von 3 Tagen ein ärztliches Zeugnis ein. Du wirst zur Nachprüfung aufgeboten.'),
      h('p', { class: 'small' }, h('b', null, 'Bestanden: '), 'Gesamtnote mindestens 4.75 mit Vornote, mindestens 4.5 ohne Vornote. Die Ergebnisse kommen per Post und sind am Tag danach online einsehbar.')),
    h('div', { class: 'card' }, h('h2', null, 'Das nimmst du mit'), list, h('h4', null, 'Nicht erlaubt'), h('p', { class: 'small' }, NOT_ALLOWED.join(', ') + '.'),
      h('p', { class: 'hint' }, 'Stand: Website des Kantons Zürich. Kurz vor der Prüfung dort nachsehen: ', h('a', { href: ZH, target: '_blank', rel: 'noopener' }, 'Prüfung für das Kurzgymnasium')))));

  // Strategie und Methode
  page.append(h('div', { class: 'cols two', style: { marginTop: '1rem' } },
    h('div', { class: 'card' }, h('h2', null, 'Im Prüfungsraum: so gehst du vor'), h('ol', { style: { paddingLeft: '1.2rem' } },
      h('li', null, h('b', null, 'Zuerst überfliegen (1 bis 2 Min.): '), 'Wie viele Aufgaben? Wo gibt es viele Punkte?'),
      h('li', null, h('b', null, 'Punkte sind Zeit: '), 'Sprache rund 36 Sekunden pro Punkt, Mathematik rund 2.4 Minuten pro Punkt. Der Tempo-Richtwert in den Simulationen übt genau das.'),
      h('li', null, h('b', null, 'Festgefahren? '), 'Aufgabe markieren, überspringen, am Schluss zurückkommen. Leichte Punkte zuerst sichern.'),
      h('li', null, h('b', null, 'Kopf leer? '), 'Stift kurz weglegen, langsam ausatmen, dann mit der leichtesten offenen Aufgabe weitermachen.'),
      h('li', null, h('b', null, 'Letzte 5 Minuten: '), 'Lücken füllen, Einheiten und Antwortsätze prüfen. Eine leere Antwort gibt sicher 0 Punkte.'),
      h('li', null, h('b', null, 'Aufsatz: '), '5 Min. Thema wählen, 10 Min. planen, 60 Min. schreiben, 15 Min. überarbeiten. Beim Überarbeiten gezielt nach deinen häufigsten Fehlern suchen (Aufsatz-Werkstatt, «Deine Fehlermuster»).'),
      h('li', null, h('b', null, 'In den Pausen: '), 'essen, trinken, bewegen. Nicht über Lösungen reden: Die vorherige Prüfung ist vorbei.')),
      h('p', { class: 'small' }, h('b', null, 'Letzte Woche: '), 'nichts Neues mehr lernen. Fehlerheft durchsehen, genug schlafen, Material am Vorabend bereitlegen, den Weg zum Prüfungsort vorher anschauen.')),
    h('div', { class: 'card' }, h('h2', null, 'Warum die App so lernt'),
      h('p', null, 'Eine grosse Übersichtsstudie (Dunlosky und andere, 2013) hat 10 verbreitete Lerntechniken verglichen. Am besten wirkten 2: ', h('b', null, 'sich selbst testen'), ' und ', h('b', null, 'über Wochen verteilt lernen'), '. Nochmals lesen und Markieren halfen wenig.'),
      h('ul', { style: { paddingLeft: '1.2rem' } },
        h('li', null, 'Darum ist die Theorie kurz und danach kommen sofort Aufgaben.'),
        h('li', null, 'Darum kommen Fehler nach 1, 7 und 21 Tagen wieder (Fehlerheft), ab dem 2. Mal mit neuen Zahlen.'),
        h('li', null, 'Darum mischt das Endlos-Training die Themen: An der Prüfung steht auch nicht dabei, welche Regel gefragt ist.'),
        h('li', null, 'Darum gibt es Simulationen mit echter Zeit: Was man kennt, macht weniger nervös.'),
        h('li', null, 'Keine Ranglisten: Du vergleichst dich nur mit dir selbst von letzter Woche.')))));

  // Bedienung
  const keys = [['Enter', 'Antwort prüfen, dann nächste Aufgabe'], [MOD + ' K', 'Schnellsuche: Thema oder Seite öffnen'], [IS_MAC ? '⌘ ?' : 'F1', 'Diese Hilfe'], [MOD + ' +|' + MOD + ' −|' + MOD + ' 0', 'Grösser, kleiner, normale Grösse'], [IS_MAC ? '⌃ ⌘ F' : 'F11', 'Vollbild'], ['Esc', 'Dialog oder Suche schliessen, Schreibmodus verlassen'], ['Tab', 'Zum nächsten Feld']];
  page.append(h('div', { class: 'cols two', style: { marginTop: '1rem' } },
    h('div', { class: 'card' }, h('h2', null, 'Tastenkürzel'), h('table', { class: 'list help-keys' }, h('tbody', null, keys.map(([k, t]) => h('tr', null, h('td', { class: 'nowrap' }, k.split('|').map((x) => h('kbd', { style: { marginRight: '0.3rem' } }, x))), h('td', null, t)))))),
    h('div', { class: 'card' }, h('h2', null, 'So arbeitest du mit der App'), h('ol', { style: { paddingLeft: '1.2rem' } },
      h('li', null, h('b', null, 'Lernen: '), 'Theorie lesen, dann eine Übungsrunde. 2 fehlerfreie Runden in Folge haken ein Thema ab.'),
      h('li', null, h('b', null, 'Endlos-Training und Blitz: '), 'gemischte Aufgaben im Prüfungsniveau, so viele du willst. Schwache Themen kommen öfter.'),
      h('li', null, h('b', null, 'Fehlerheft: '), 'jeden Tag die fälligen Aufgaben wiederholen.'),
      h('li', null, h('b', null, 'Simulationen: '), 'ab der Trainingsphase jede Woche 1 ganze Prüfung unter Zeit.'),
      h('li', null, h('b', null, 'Offizielle Prüfungen: '), 'erst ab 50 % Bereitschaft. Sie sind der beste Test, aber jede kannst du nur 1-mal unvorbereitet lösen.')))));

  // Fragen
  const faq = [
    ['Wie wird die Bereitschaft berechnet?', 'Pro Thema zählen Trefferquote (neue Aufgaben zählen mehr), Anzahl Aufgaben und Tempo im Vergleich zur Prüfung. Die Themen werden nach ihrem Gewicht an der Prüfung gezählt, die Teile wie die Prüfungsnote (Sprache 25 %, Aufsatz 25 %, Mathematik 50 %). Beim Aufsatz zählen bewertete Aufsätze zur Hälfte mit. Die geschätzte Note kommt aus den letzten Simulationen.'],
    ['Woher kommen die Aufgaben?', 'Generator: berechnet unendlich viele Aufgaben. Datenbank: Sätze, Texte und Themen, die von Hand geschrieben wurden. Shuffle: Datenbank-Aufgaben mit neuen Zahlen und anderer Formulierung. Web (experimentell): Sätze aus der Wikipedia und Zahlen aus Wikidata. Mit «Quellen wählen» (in Lernen, im Endlos-Training und unter «Inhalte») kreuzt du an, welche Arten und welche Pakete verwendet werden, und schaltest Shuffle ein oder aus.'],
    ['Wie streng wird Deutsch bewertet?', 'Was die Aufgabe prüft, zählt genau, zum Beispiel Verbformen, Fallendungen, Wortstellung und Kommas. Daneben zählt höchstens 1 kleiner Fehler pro Antwort als richtig, mit Hinweis: falsche Gross- oder Kleinschreibung oder 1 Tippfehler. Ein Tippfehler zählt nur in einem Wort, nach dem gefragt ist (ab 5 Buchstaben, zum Beispiel Gegenwort oder Oberbegriff), oder in einem Wort, das du aus dem Aufgabensatz abschreibst. Bei Wortformen (Steigerung, Verbform, Fall) zählt kein Tippfehler. ae, oe, ue statt ä, ö, ü und ss statt ß sind immer richtig. In Mathematik gibt es diese Toleranz nicht. Im Einstufungstest kannst du am Schluss jede Antwort selbst als richtig werten.'],
    ['Wie zuverlässig ist die Aufsatz-Korrektur?', 'Die App findet viele Fehler in Rechtschreibung, Zeichensetzung und Stil und prüft den Aufbau. Ob Gedanken überzeugen, kann sie nicht beurteilen. Die Note ist ein Hilfsraster. Lass Aufsätze wenn möglich von einer erwachsenen Person mitlesen.'],
    ['Wo sind meine Daten?', 'Nur auf diesem Computer, im Datenordner (Einstellungen → Daten). Jeden Tag entsteht automatisch eine Sicherung pro Profil; die letzten 14 bleiben. Unter Einstellungen kannst du eine Sicherung zurückholen oder dein Profil exportieren.'],
    ['Warum ist die Note der Simulation streng?', 'Die App rechnet linear: Note = 1 + 5 × Punkte : Maximum. Die echte Notenskala legen die Kommissionen erst nach der Korrektur fest. Vergleiche vor allem deine Punkte und dein Tempo.'],
    ['Was bedeuten die Stufen?', 'Jedes Thema hat 4 Stufen: Begonnen (erste Aufgaben gelöst), Vertraut (meistens richtig), Sicher (zuverlässig richtig) und Gemeistert (zuverlässig richtig und im Prüfungstempo). Neue Aufgaben zählen stärker als alte. Deshalb kann eine Stufe auch wieder sinken, wenn du ein Thema länger nicht geübt hast und dann Fehler machst. Die App sagt dir bei jedem Thema, wie viele richtige Aufgaben es etwa bis zur nächsten Stufe braucht.'],
    ['Warum ein Wochenziel und keine tägliche Serie?', 'Wer jeden Tag eine Serie halten muss, lernt oft aus Angst, sie zu verlieren. Die Forschung zeigt: Ein verpasster Tag schadet einer Gewohnheit kaum. Darum zählt die App Lerntage pro Woche. Bei 6 geplanten Lerntagen sind 5 das Ziel, 1 Tag Pause ist eingeplant. Ein Tag zählt ab 10 Minuten.'],
    ['Was sind Meilensteine und Stempel?', 'Meilensteine sind echte Lernschritte, zum Beispiel das erste sichere Thema oder 4 Wochen im Wochenziel. Wenn du einen erreichst oder ein Thema aufsteigt, setzt die App einen Stempel. Unter «Auswertung» siehst du alle Meilensteine und wie nahe du dem nächsten bist. Stempel lassen sich in den Einstellungen ausschalten.'],
    ['Gibt es ein Beispielprofil?', 'Ja. Auf dem Willkommensbildschirm oder unter «Einstellungen» → «Profil» → «Beispielprofil anlegen». Es enthält 3½ Wochen Lerndaten von «Mia», 2 Aufsätze und 2 Simulationen. Gut zum Ausprobieren und für Vorführungen. Löschen geht unter «Einstellungen».'],
    ['Was zeigt der Tempo-Richtwert?', 'In den Simulationen verteilt die App die Punkte gleichmässig auf die Zeit. Beispiel Mathematik: Nach 45 von 90 Minuten solltest du etwa die Hälfte der Punkte bearbeitet haben. Gezählt wird jede Aufgabe mit einer Antwort, egal in welcher Reihenfolge. Du kannst ihn vor dem Start ausschalten.'],
    ['Was ist der Wochenbericht?', 'Eine Seite zum Drucken oder als PDF: Lernzeit, gelöste Aufgaben, Trefferquote im Vergleich zur Vorwoche, Simulationen, Aufsätze, Stärken und Schwächen. Gedacht für ein kurzes Gespräch mit Eltern oder Lehrperson. Zu finden unter «Auswertung».'],
    ['Wie bekomme ich mehr Aufgaben?', 'Unter «Inhalte» die Anleitung für eine KI herunterladen, Aufgaben erstellen lassen und das Paket importieren.'],
    ['Kann ich nur meine neuesten Pakete verwenden?', 'Ja. Unter «Inhalte» → «Pakete» kreuzt du an, welche Pakete verwendet werden, auch die eingebaute Datenbank. «Nur das neueste Paket» schaltet mit einem Klick alle anderen aus. Berechnete Aufgaben gibt es immer; Simulationen nehmen fehlende Aufgabenarten aus den übrigen Paketen.'],
    ['Kann ich im Endlos-Training einzelne Themen üben?', 'Ja. Kreuze ganze Bereiche an oder öffne einen Bereich mit «Themen wählen» und wähle einzelne Themen. «Meine 5 schwächsten Themen» wählt sie für dich aus.']
  ];
  page.append(h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h2', null, 'Häufige Fragen'), ...faq.map(([q, a]) => h('details', { class: 'faq' }, h('summary', null, q), h('p', null, a)))));
}

// ---------- Arbeitsblatt ----------
function staticTask(t, n) {
  const box = h('div', { class: 'ws-task' });
  const head = h('div', { class: 'ws-head' }, h('b', null, n + '.'), h('span', { class: 'muted small' }, t.title + ' (' + t.points + (t.points === 1 ? ' Punkt' : ' Punkte') + ')'));
  const body = h('div'); box.append(head, body);
  mountTask(t, body, ui, { print: true });
  body.querySelectorAll('input, select, textarea, button').forEach((el) => { el.tabIndex = -1; el.setAttribute('aria-hidden', 'true'); });
  if (t.skill && t.skill[0] === 'M') box.append(h('div', { class: 'ws-space' }));
  return box;
}
function solutionOf(t, n) {
  const ans = t.fields.map((f) => { const a = answerText(f); return a ? h('div', null, (f.label ? h('span', { html: mathify(f.label) + (/[=:]\s*$/.test(f.label) ? ' ' : ': ') }) : null), h('b', { html: mathify(a) })) : null; });
  return h('div', { class: 'ws-sol' }, h('b', null, n + '. '), ...ans, t.solution ? h('div', { class: 'small', html: mathify(t.solution) }) : null);
}
export function renderSheet(page, args) {
  const id = args[0]; const s = SKILL[id];
  if (!s) { page.append(h('p', null, 'Unbekanntes Thema.')); return; }
  const theoryOnly = args[1] === 'theorie';
  page.classList.add('wide');
  let count = Number(args[1]) || 10; let withSol = true; let withTheory = theoryOnly; let seed = newSeed();
  const tools = h('div', { class: 'card row between no-print' });
  const sheet = h('div', { class: 'worksheet' });
  page.append(h('a', { class: 'back no-print', href: '#/lernen/' + id }, '‹ ' + s.id + ' ' + s.name), tools, sheet);
  const textSkill = ['D13', 'D16', 'D17', 'D18', 'D19'].includes(id);
  const draw = () => {
    sheet.innerHTML = '';
    sheet.append(h('div', { class: 'ws-title' }, h('div', null, h('h1', null, (theoryOnly ? 'Merkblatt ' : 'Arbeitsblatt ') + s.id + ' ' + s.name), h('p', { class: 'muted' }, s.desc)), h('div', { class: 'ws-name' }, 'Name: ________________', h('br'), 'Datum: ' + fmtDate(new Date()))));
    if (withTheory && THEORY[id]) sheet.append(h('div', { class: 'theory ws-theory', html: mathify(THEORY[id]) }));
    if (theoryOnly) return;
    if (textSkill || !hasSources(id)) { sheet.append(h('p', { class: 'note' }, textSkill ? 'Aufgaben zu Lesetexten gibt es in der App und in den Simulationen. Für Papier eignen sich die offiziellen Prüfungen.' : 'Für dieses Thema gibt es keine Aufgaben.')); return; }
    // Aufgabenarten der Reihe nach mischen, gleiche Aufgaben vermeiden
    const { keys } = keysFor(id, 'mix', { minDiff: 2 }); const r = new RNG(seed); const order = r.shuffle(keys.slice());
    const tasks = []; const seen = new Set();
    for (let i = 0, tries = 0; tasks.length < count && tries < count * 6; tries++) { const k = order[i % order.length]; i++; try { const t = makeTask(k, r.int(1, 1e9)); const sig = t.html.replace(/\d+/g, '#'); const exact = t.html; if (seen.has(exact) || (seen.has(sig) && tries < count * 3 && order.length > 1)) continue; seen.add(exact); seen.add(sig); tasks.push(t); } catch (e) { /* überspringen */ } }
    tasks.forEach((t, i) => sheet.append(staticTask(t, i + 1)));
    const total = tasks.reduce((a, t) => a + t.points, 0); const min = Math.round(tasks.reduce((a, t) => a + t.targetSec, 0) / 60);
    sheet.append(h('p', { class: 'muted small' }, total + ' Punkte. Zeit wie an der Prüfung: etwa ' + min + ' Minuten.'));
    if (withSol) sheet.append(h('div', { class: 'ws-solutions' }, h('h2', null, 'Lösungen'), ...tasks.map((t, i) => solutionOf(t, i + 1))));
  };
  const cnt = h('select', { 'aria-label': 'Anzahl Aufgaben', onchange: () => { count = Number(cnt.value); draw(); } }, [6, 10, 16, 24].map((n) => h('option', { value: String(n), selected: n === count || null }, n + ' Aufgaben')));
  const sol = h('input', { type: 'checkbox', checked: true, onchange: () => { withSol = sol.checked; draw(); } });
  const th = h('input', { type: 'checkbox', checked: withTheory || null, onchange: () => { withTheory = th.checked; draw(); } });
  tools.append(h('div', { class: 'row' }, theoryOnly ? null : cnt, theoryOnly ? null : h('label', { class: 'row small' }, sol, 'Lösungen am Schluss'), theoryOnly ? null : h('label', { class: 'row small' }, th, 'Theorie dazu'), theoryOnly ? null : btn('Neue Aufgaben', () => { seed = newSeed(); draw(); }, { kind: 'small', icon: 'loop' })),
    h('div', { class: 'row' }, btn('Drucken', () => window.print(), { kind: 'primary', icon: 'print' }), api && api.printPdf ? btn('Als PDF speichern', async () => { const r = await api.printPdf({ defaultName: (theoryOnly ? 'Merkblatt ' : 'Arbeitsblatt ') + s.id + ' ' + s.name.replace(/[^\wäöüÄÖÜ -]/g, '') + '.pdf' }); if (r && r.ok) toast('PDF gespeichert.', 'ok'); }, { icon: 'down' }) : null));
  draw();
}

// ---------- Wochenbericht: 1 Seite für Eltern oder Lehrperson ----------
export function renderReport(page) {
  const p = state.profile; page.classList.add('wide');
  const now = new Date(); const from = dayKey(addDays(now, -6)); const prevFrom = dayKey(addDays(now, -13)); const to = dayKey(now);
  const startOf = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
  const t0 = startOf(from), tPrev = startOf(prevFrom);
  const inWeek = (k) => k >= from && k <= to; const inPrev = (k) => k >= prevFrom && k < from;
  const mins = (f) => Math.round(Object.entries(p.days).filter(([k]) => f(k)).reduce((a, [, v]) => a + v, 0));
  const days = Object.entries(p.days).filter(([k, v]) => inWeek(k) && v >= 10).length;
  const tasks = (ok, part) => p.attempts.filter((a) => ok(a.t) && a.m > 0 && !String(a.k).startsWith('aufsatz') && (!part || (SKILL[a.s] && SKILL[a.s].part === part)));
  const acc = (xs) => (xs.length ? Math.round(xs.reduce((a, x) => a + x.p, 0) / xs.reduce((a, x) => a + x.m, 0) * 100) : null);
  const thisW = (t) => t >= t0; const prevW = (t) => t >= tPrev && t < t0;
  const pl = buildPlan(p); const r = readiness(p); const st = strengths(p, 3);
  const mocks = p.mocks.filter((m) => inWeek(m.date)); const essays = p.essays.filter((e) => e.created >= t0);
  const due = p.errors.filter((e) => e.due <= Date.now()).length;
  const PN = { sprache: 'Sprachprüfung', aufsatz: 'Aufsatz', mathe: 'Mathematik' };
  const pct = (x) => (x == null ? '–' : x + ' %');
  const trend = (a, b) => (a == null || b == null ? '' : a > b + 2 ? ' (Vorwoche ' + b + ' %, besser)' : a < b - 2 ? ' (Vorwoche ' + b + ' %, schwächer)' : ' (Vorwoche ' + b + ' %, gleich)');
  const row = (k, v) => h('tr', null, h('th', { scope: 'row' }, k), h('td', null, v));
  const sheet = h('div', { class: 'worksheet report' },
    h('div', { class: 'row between' }, h('h1', null, 'Wochenbericht: ' + p.name), h('span', { class: 'muted' }, fmtDate(from) + ' bis ' + fmtDate(to))),
    h('p', { class: 'muted' }, 'Gymi-Trainer ZH. Prüfung am ' + fmtDate(pl.exam, true) + ', noch ' + pl.daysLeft + ' Tage. Phase «' + pl.phase + '», Woche ' + pl.weekNo + ' von ' + pl.totalWeeks + '.'),
    h('h2', null, 'Diese Woche'),
    h('table', { class: 'list report-t' }, h('tbody', null,
      row('Lernzeit', mins(inWeek) + ' Min. von ' + pl.weekTarget + ' Min. geplant (Vorwoche ' + mins(inPrev) + ' Min.)'),
      row('Lerntage', (() => { const wg = weekGoal(p); return days + ' von 7 Tagen mit mindestens 10 Minuten (Wochenziel ' + wg.goal + ' Tage' + (wg.streak > 1 ? ', ' + wg.streak + ' Wochen in Folge erreicht' : '') + ')'; })()),
      row('Neu sicher', (() => { const old = Object.assign({}, p, { attempts: p.attempts.filter((a) => a.t < t0), reading: Object.fromEntries(Object.entries(p.reading || {}).filter(([k]) => k < from)) }); const was = Object.fromEntries(allStats(old).map((x) => [x.id, x.stage])); const up = allStats(p).filter((x) => x.stage >= SURE && (was[x.id] || 0) < SURE); return up.length ? up.map((x) => x.id + ' ' + x.skill.name + ' (' + STAGES[x.stage].name + ')').join(', ') : 'diese Woche kein neues Thema auf «Sicher»'; })()),
      row('Aufgaben gelöst', tasks(thisW).length + ' (Vorwoche ' + tasks(prevW).length + ')'),
      row('Punkte erreicht', pct(acc(tasks(thisW))) + trend(acc(tasks(thisW)), acc(tasks(prevW)))),
      row('Sprache / Mathematik', 'Sprache ' + pct(acc(tasks(thisW, 'sprache'))) + ', Mathematik ' + pct(acc(tasks(thisW, 'mathe')))),
      row('Simulationen', mocks.length ? mocks.map((m) => PN[m.type] + ' Note ' + fmtGrade(m.grade)).join(', ') : 'keine'),
      row('Aufsätze', essays.length ? essays.map((e) => '«' + e.title + '»' + (e.grade ? ' Note ' + fmtGrade(e.grade) : ' (noch nicht bewertet)')).join(', ') : 'keine'),
      row('Fehlerheft', p.errors.length + ' Einträge, davon ' + due + ' heute fällig'))),
    h('h2', null, 'Stand insgesamt'),
    h('table', { class: 'list report-t' }, h('tbody', null,
      row('Bereitschaft', Math.round(r.total * 100) + ' % (geübt: ' + Math.round(r.coverage * 100) + ' % des Stoffs)'),
      ...['sprache', 'aufsatz', 'mathe'].map((k) => row(PN[k], Math.round(r.parts[k].ready * 100) + ' %' + (r.parts[k].est != null ? ', geschätzte Note ' + fmtGrade(Math.round(r.parts[k].est * 4) / 4) : ''))),
      row('Geschätzte Prüfungsnote', r.pn != null ? fmtGrade(Math.round(r.pn * 4) / 4) + ' (Schätzung der App, nicht offiziell)' : 'noch zu wenig Daten'))),
    h('div', { class: 'cols' },
      h('div', null, h('h3', null, 'Stärken'), st.strong.length ? h('ul', null, st.strong.map((x) => h('li', null, x.skill.id + ' ' + x.skill.name))) : h('p', { class: 'muted' }, 'Noch zu wenig Daten.')),
      h('div', null, h('h3', null, 'Hier lohnt sich Üben'), st.weak.length ? h('ul', null, st.weak.map((x) => h('li', null, x.skill.id + ' ' + x.skill.name))) : h('p', { class: 'muted' }, 'Noch zu wenig Daten.'))),
    pl.focus && pl.focus.length ? h('p', null, h('b', null, 'Themen dieser Woche im Plan: '), pl.focus.map((id) => id + ' ' + SKILL[id].name).join(', ') + '.') : null,
    h('h3', null, 'Bemerkungen'), h('div', { class: 'ws-space', style: { minHeight: '5rem' } }),
    h('p', { class: 'muted small' }, 'Bereitschaft = gewichteter Lernstand über alle Themen (Mathematik zählt doppelt wie an der Prüfung). Noten sind Schätzungen aus Übungen und Simulationen, keine offizielle Bewertung.'));
  const tools = h('div', { class: 'card no-print row between' }, h('div', null, h('b', null, 'Wochenbericht'), h('div', { class: 'muted small' }, 'Für ein kurzes Gespräch mit Eltern oder Lehrperson: was diese Woche lief und wo es noch hakt.')),
    h('div', { class: 'row' }, btn('Drucken', () => window.print(), { kind: 'primary', icon: 'print' }), api && api.printPdf ? btn('Als PDF speichern', async () => { const x = await api.printPdf({ defaultName: 'Wochenbericht ' + p.name.replace(/[^\wäöüÄÖÜ -]/g, '') + ' ' + to + '.pdf' }); if (x && x.ok) toast('PDF gespeichert.', 'ok'); }, { icon: 'down' }) : null));
  page.append(h('a', { class: 'back no-print', href: '#/auswertung' }, '‹ Auswertung'), tools, sheet);
}
