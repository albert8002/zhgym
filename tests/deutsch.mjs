// Bewertung Deutsch: kleine Abweichungen zählen als richtig, Geprüftes bleibt streng. Mathematik ohne Toleranz.
import { gradeTask } from '../app/js/engine/task.js';
const T = (key, skill, html, field) => ({ key, skill, html, fields: [Object.assign({ id: 'a', type: 'text' }, field)] });
const q = (s) => '<span class="satz">' + s + '</span>';
const cases = [
  // [Aufgabe, Antwort, erwartet ok]
  [T('D3.umformen', 'D3', 'Setze den Satz ins <b>Futur I</b>. Ändere nur die Verbform.<br>' + q('Er half dem Polizisten oft.'), { answers: ['Er wird dem Polizisten oft helfen.'], long: true }), 'Er wird dem Polizisten oft helfen', true, 'exakt ohne Punkt'],
  [T('D3.umformen', 'D3', 'x' + q('Er half dem Polizisten oft.'), { answers: ['Er wird dem Polizisten oft helfen.'] }), 'er wird dem Polizisten oft helfen.', true, 'Satzanfang klein'],
  [T('D3.umformen', 'D3', 'x' + q('Er half dem Polizisten oft.'), { answers: ['Er wird dem Polizisten oft helfen.'] }), 'Er wird dem Polizsten oft helfen.', true, 'Tippfehler in abgeschriebenem Wort'],
  [T('D3.umformen', 'D3', 'x' + q('Er half dem Polizisten oft.'), { answers: ['Er wird dem Polizisten oft helfen.'] }), 'Er wird dem Polizist oft helfen.', false, 'Endung fehlt (2 Buchstaben)'],
  [T('D3.umformen', 'D3', 'x' + q('Er half dem Polizisten oft.'), { answers: ['Er wird dem Polizisten oft helfen.'] }), 'Er wird dem Polizisten oft helfn.', false, 'Tippfehler im geprüften Verb'],
  [T('D3.umformen', 'D3', 'x' + q('Er half dem Polizisten oft.'), { answers: ['Er wird dem Polizisten oft helfen.'] }), 'er wird dem Polizsten oft helfen.', false, '2 kleine Fehler'],
  [T('D3.umformen', 'D3', 'x' + q('Er half dem Polizisten oft.'), { answers: ['Er wird dem Polizisten oft helfen.'] }), 'Er wird oft dem Polizisten helfen.', false, 'Wortstellung'],
  [T('D9.relativ', 'D9', 'x' + q('Die Ärztin schrieb einen Brief.') + q('Die Ärztin schlief in unserem Garten.'), { answers: ['Die Ärztin, die in unserem Garten schlief, schrieb einen Brief.'] }), 'Die Ärztin, die in unseren Garten schlief, schrieb einen Brief.', false, 'Fall-Endung -em/-en'],
  [T('D9.relativ', 'D9', 'x' + q('Die Ärztin schrieb einen Brief.') + q('Die Ärztin schlief in unserem Garten.'), { answers: ['Die Ärztin, die in unserem Garten schlief, schrieb einen Brief.'] }), 'Die Aerztin , die in unserem Garten schlief,schrieb einen Brief', true, 'ae und Abstände'],
  [T('D9.relativ', 'D9', 'x' + q('Die Ärztin schrieb einen Brief.') + q('Die Ärztin schlief in unserem Garten.'), { answers: ['Die Ärztin, die in unserem Garten schlief, schrieb einen Brief.'] }), 'Die Ärztin die in unserem Garten schlief, schrieb einen Brief.', false, 'Komma fehlt'],
  [T('D8.verbinden', 'D8', 'x' + q('Sie stellt den Wecker.') + q('Sie verschläft nicht.'), { answers: ['Sie stellt den Wecker, damit sie nicht verschläft.'] }), 'Sie stellt den Wecker, damit sie nicht verschlaeft.', true, 'ae'],
  [T('D8.verbinden', 'D8', 'x' + q('Sie stellt den Wecker.') + q('Sie verschläft nicht.'), { answers: ['Sie stellt den Wecker, damit sie nicht verschläft.'] }), 'Sie stellt den Wekcer, damit sie nicht verschläft.', true, 'Buchstaben vertauscht'],
  [T('D8.verbinden', 'D8', 'x' + q('Sie stellt den Wecker.') + q('Sie verschläft nicht.'), { answers: ['Sie stellt den Wecker, damit sie nicht verschläft.'] }), 'Sie stellt den Wecker, damit sie verschläft nicht.', false, 'Verbstellung'],
  [T('D12.oberbegriff', 'D12', 'Nenne den Oberbegriff: Fluss, See', { answers: ['Gewässer'] }), 'gewässer', true, 'klein'],
  [T('D12.oberbegriff', 'D12', 'x', { answers: ['Gewässer'] }), 'Gewäser', true, 'Tippfehler Wort'],
  [T('D12.oberbegriff', 'D12', 'x', { answers: ['Gewürze'] }), 'Gewürz', true, 'Einzahl'],
  [T('D12.oberbegriff', 'D12', 'x', { answers: ['Gewässer'] }), 'gewäser', false, 'klein + Tippfehler'],
  [T('D12.oberbegriff', 'D12', 'x', { answers: ['Obst'] }), 'Obts', false, 'kurzes Wort (4)'],
  [T('D11.antonym', 'D11', 'x', { answers: ['schmal', 'eng'], ci: true }), 'Schmal', true, 'ci'],
  [T('D11.antonym', 'D11', 'x', { answers: ['schmal', 'eng'], ci: true }), 'schmahl', true, 'Tippfehler'],
  [T('D11.antonym', 'D11', 'x', { answers: ['schmal', 'eng'], ci: true }), 'breit', false, 'falsch'],
  [T('D10.familie', 'D10', 'x', { answers: ['die Geduld'] }), 'die geduld', true, 'Nomen klein'],
  [T('D10.familie', 'D10', 'x', { answers: ['die Geduld'] }), 'Geduld', false, 'ohne Artikel'],
  [T('D10.familie', 'D10', 'x', { answers: ['die Geduld'] }), 'der Geduld', false, 'falscher Artikel'],
  [T('D6.setzen', 'D6', 'x', { answers: ['meinem kleinen Rucksack'] }), 'meinem kleinen rucksack', true, 'Form: klein'],
  [T('D6.setzen', 'D6', 'x', { answers: ['meinem kleinen Rucksack'] }), 'meinem kleinem Rucksack', false, 'Form: Endung'],
  [T('D6.setzen', 'D6', 'x', { answers: ['meinem kleinen Rucksack'] }), 'meinem kleinen Ruksack', false, 'Form: Tippfehler'],
  [T('D1.steigerung', 'D1', 'x', { answers: ['am besten'], ci: true }), 'am Besten', true, 'ci'],
  [T('D4.form', 'D4', 'x', { answers: ['Gib'] }), 'gib', true, 'Form: Gross/klein'],
  [T('D4.form', 'D4', 'x', { answers: ['wäre'] }), 'waere', true, 'ae'],
  [T('D4.form', 'D4', 'x', { answers: ['wäre'] }), 'war', false, 'falsche Form'],
  [T('D4.form', 'D4', 'x', { answers: ['könne'] }), 'konne', false, 'Umlaut fehlt'],
  [T('D3.form', 'D3', 'x', { answers: ['öffnete', 'ich öffnete'] }), 'Ich öffnete', true, 'Pronomen gross'],
  [T('D13.zuordnen', 'D13', 'x', { answers: ['Markierungen'], ci: true }), 'Markierungn', true, 'Wort im Text Tippfehler'],
  [T('D13.zuordnen', 'D13', 'x', { answers: ['Markierungen'], ci: true }), 'die Markierungen', false, '2 Wörter'],
  [T('M8.x', 'M8', 'x', { answers: ['Gewässer'] }), 'gewässer', false, 'Mathe: keine Toleranz'],
];
let bad = 0;
for (const [t, v, exp, name] of cases) {
  const r = gradeTask(t, { a: v }); const f = r.fields[0];
  const okk = r.ok === exp; if (!okk) bad++;
  if (!okk || process.argv[2] === '-v') console.log((okk ? 'OK  ' : 'FEHL') + ' ' + name.padEnd(38) + ' → ' + (r.ok ? 'richtig' : 'falsch') + (f.slip ? ' | ' + f.slip : '') + (f.note ? ' | ' + f.note : ''));
}
console.log(bad ? 'Deutsch-Toleranz: ' + bad + ' Fehler' : 'Deutsch-Toleranz: alle ' + cases.length + ' Fälle wie erwartet');
if (bad) process.exit(1);
