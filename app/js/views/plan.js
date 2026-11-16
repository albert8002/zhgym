// Lernplan (Zeitplan, Einsatz, Wochenthemen) und Notenrechner (Prüfungsnote, Vornote, nötige Noten).
import { h, btn, field, toast, bar } from '../ui.js';
import { state, save } from '../store.js';
import { buildPlan, minutesInfo, INTENSITY, PHASE_TEXT, phaseText, skillStats } from '../stats.js';
import { planList } from './dashboard.js';
import { segmented, dayPicker } from './onboarding.js';
import { SKILL, RULES } from '../skills.js';
import { refresh } from '../main.js';
import { fmtDate, fmtMin, addDays, parseDay, dayKey, fmtGrade, quarter, clamp } from '../util.js';

export function render(page) {
  const p = state.profile; const pl = buildPlan(p); const mi = minutesInfo(p);
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Lernplan'), h('p', null, pl.daysLeft >= 0 ? 'Prüfung am ' + fmtDate(p.setup.examDate, true) + ': noch ' + pl.daysLeft + ' Tage (' + pl.weeksLeft + ' Wochen).' : 'Der Prüfungstermin ist vorbei. Trage unten den neuen Termin ein.')));

  // Phasen
  const total = pl.phases.reduce((a, x) => a + x.weeks, 0); let acc = 0;
  const strip = h('div', { class: 'phases', role: 'list' });
  pl.phases.forEach((ph) => { const from = acc + 1, to = acc + ph.weeks; acc = to; const cur = pl.weekNo >= from && pl.weekNo <= to;
    strip.append(h('div', { role: 'listitem', class: 'phase' + (cur ? ' on' : ''), style: { flex: String(ph.weeks) } }, h('b', null, ph.name), h('span', null, from === to ? 'Woche ' + from : 'Wochen ' + from + '–' + to))); });
  page.append(h('div', { class: 'card' }, h('h3', null, 'Phasen bis zur Prüfung'), strip, h('p', null, h('b', null, 'Jetzt: ' + pl.phase + '. '), phaseText(pl, p)), h('p', { class: 'hint' }, 'Du bist in Woche ' + pl.weekNo + ' von ' + total + '.')));

  // Heute und diese Woche
  const week = h('div', { class: 'card' }, h('h3', null, 'Diese Woche'), h('div', { class: 'row between' }, h('span', null, fmtMin(mi.week) + ' von ' + fmtMin(pl.weekTarget) + ' geübt'), h('span', { class: 'muted small' }, INTENSITY[p.setup.intensity].name)), bar(mi.week, pl.weekTarget, mi.week >= pl.weekTarget ? 'ok' : '', 'Wochenziel'));
  if (pl.focus.length) week.append(h('h4', { style: { marginTop: '1rem' } }, 'Themen dieser Woche'), h('div', { class: 'stack' }, pl.focus.map((id) => { const st = skillStats(p, id); return h('div', { class: 'row between' }, h('a', { href: '#/lernen/' + id }, id + ' ' + SKILL[id].name), st.done ? h('span', { class: 'tag ok' }, 'abgehakt') : h('span', { class: 'tag' }, st.n + (st.n === 1 ? ' Aufgabe' : ' Aufgaben'))); })));
  page.append(h('div', { class: 'cols two', style: { marginTop: '1rem' } }, h('div', { class: 'card' }, h('h3', null, 'Heute'), planList(p, pl, false)), week));

  // Wochenthemen
  if (pl.learn > 0) {
    const start = addDays(parseDay(dayKey(new Date(p.created || Date.now()))), pl.standort * 7);
    const rows = pl.weekSkills.map((ids, i) => { const d = addDays(start, i * 7); const cur = pl.weekNo === pl.standort + i + 1;
      return h('tr', { class: cur ? 'row-ok' : null }, h('td', null, 'Woche ' + (pl.standort + i + 1)), h('td', null, fmtDate(d)), h('td', null, ids.length ? ids.map((id) => h('a', { href: '#/lernen/' + id, style: { marginRight: '0.6rem' } }, id + ' ' + SKILL[id].name, p.mastered[id] ? ' ✓' : '')) : h('span', { class: 'muted' }, 'Wiederholen und Fehlerheft'))); });
    page.append(h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h3', null, 'Themen Woche für Woche'), h('div', { class: 'table-scroll' }, h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Woche'), h('th', null, 'ab'), h('th', null, 'neue Themen'))), h('tbody', null, rows))), h('p', { class: 'hint' }, 'Reihenfolge nach dem Lehrplan: zuerst Fundament (Wortarten, Verbformen, Rechenregeln), dann Satzbau, Wortschatz, Rechtschreibung, Geometrie und Daten. ✓ = abgehakt.')));
  }

  // Einstellungen
  const date = h('input', { type: 'date', value: p.setup.examDate });
  const vn = h('input', { type: 'number', min: '1', max: '6', step: '0.01', value: p.setup.vn == null ? '' : String(p.setup.vn), placeholder: 'leer = zählt nicht' });
  let intensity = p.setup.intensity; let days = (p.setup.days || []).slice();
  page.append(h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h3', null, 'Plan anpassen'),
    field('Prüfungsdatum', date, 'Kurzgymnasium 2027: schriftliche Prüfung am Montag, 8. März 2027.'),
    field('Einsatz', segmented(Object.entries(INTENSITY).map(([k, v]) => [k, v.name + ' (' + v.text + ')']), intensity, (v) => { intensity = v; }, 'Einsatz')),
    h('div', { class: 'form-row' }, h('label', null, 'Lerntage'), dayPicker(days, (d) => { days = d; })),
    field('Vornote (VN)', vn, 'Durchschnitt der 5 Zeugnisnoten aus dem Januarzeugnis. Leer lassen, wenn sie nicht zählt (zum Beispiel Sek B oder Privatschule).'),
    btn('Speichern', () => {
      if (!date.value) { toast('Wähle ein Datum.', 'bad'); return; }
      const v = vn.value.trim() === '' ? null : Number(vn.value); if (v != null && !(v >= 1 && v <= 6)) { toast('Die Vornote liegt zwischen 1 und 6.', 'bad'); return; }
      if (!days.length) { toast('Wähle mindestens 1 Lerntag.', 'bad'); return; }
      Object.assign(p.setup, { examDate: date.value, intensity, days, vn: v }); save(); toast('Plan gespeichert.', 'ok'); refresh();
    }, { kind: 'primary' })));
}

// ---------- Notenrechner ----------
const q = (n) => quarter(n);
export function renderGrades(page) {
  const p = state.profile;
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Notenrechner'), h('p', null, 'Prüfungsnote, Gesamtnote und die Note, die du in Mathematik noch brauchst. Regeln Kurzgymnasium, Aufnahme 2027.')));
  const num = (v, ph) => h('input', { type: 'number', min: '1', max: '6', step: '0.25', value: v == null ? '' : String(v), placeholder: ph || '' });
  const ns = num(null, 'z. B. 4.5'), na = num(null, 'z. B. 4.75'), nm = num(null, 'z. B. 5'), vnI = num(p.setup.vn, 'leer = zählt nicht'); vnI.step = '0.01';
  const out = h('div', { 'aria-live': 'polite' });
  const val = (el) => (el.value.trim() === '' ? null : Number(el.value));
  const calc = () => {
    out.innerHTML = ''; const S = val(ns), A = val(na), M = val(nm), V = val(vnI);
    const bad = [S, A, M, V].some((x) => x != null && !(x >= 1 && x <= 6)); if (bad) { out.append(h('p', { class: 'note bad' }, 'Noten liegen zwischen 1 und 6.')); return; }
    const pnMin = RULES.neededPN(V);
    const rows = [];
    rows.push(h('p', null, h('b', null, 'Nötige Prüfungsnote: '), V == null ? 'PN ≥ 4.5 (Vornote zählt nicht).' : 'PN ≥ 9.5 − VN = 9.5 − ' + V + ' = ' + fmtGrade(pnMin) + '.'));
    if (S != null && A != null && M != null) {
      const PN = RULES.pn(S, A, M); const GN = V == null ? PN : Math.round(((PN + V) / 2) * 100) / 100; const ok = V == null ? PN >= RULES.passNoVN : GN >= RULES.passWithVN;
      rows.push(h('p', null, 'PN = ¼ · ' + S + ' + ¼ · ' + A + ' + ½ · ' + M + ' = ' + (0.25 * S).toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + ' + ' + (0.25 * A).toFixed(4).replace(/0+$/, '').replace(/\.$/, '') + ' + ' + (0.5 * M).toFixed(3).replace(/0+$/, '').replace(/\.$/, '') + ' = ' + (Math.round(PN * 10000) / 10000)));
      if (V != null) rows.push(h('p', null, 'GN = ½ · PN + ½ · VN = ½ · ' + (Math.round(PN * 10000) / 10000) + ' + ½ · ' + V + ' = ' + GN.toFixed(2)));
      rows.push(h('p', { class: 'note ' + (ok ? 'ok' : 'bad') }, h('b', null, ok ? 'Bestanden. ' : 'Nicht bestanden. '), V == null ? 'Grenze: PN ≥ 4.5.' : 'Grenze: GN ≥ 4.75.'));
    }
    if (S != null && A != null) {
      const need = RULES.neededMath(pnMin, S, A); const needQ = Math.ceil(need * 4 - 1e-9) / 4;
      rows.push(h('p', null, h('b', null, 'Nötige Mathe-Note: '), 'NM ≥ 2 · PNmin − ½ · NS − ½ · NA = 2 · ' + fmtGrade(pnMin) + ' − ½ · ' + S + ' − ½ · ' + A + ' = ' + (Math.round(need * 1000) / 1000) + '.'));
      rows.push(h('p', { class: 'note ' + (need <= 6 ? (need <= 1 ? 'ok' : '') : 'bad') }, need > 6 ? 'Selbst eine 6 in Mathematik reicht nicht. Die Noten in Deutsch müssen steigen.' : need <= 1 ? 'Mit diesen Deutsch-Noten reicht jede Mathe-Note.' : 'In Viertelnoten: mindestens ' + fmtGrade(clamp(needQ, 1, 6)) + ' in Mathematik.'));
    }
    if (!rows.length) rows.push(h('p', { class: 'muted' }, 'Trage Noten ein.'));
    out.append(...rows);
  };
  [ns, na, nm, vnI].forEach((el) => el.addEventListener('input', calc));
  page.append(h('div', { class: 'cols two' }, h('div', { class: 'card' }, h('h3', null, 'Noten eingeben'), field('Sprachprüfung (NS)', ns), field('Aufsatz (NA)', na), field('Mathematik (NM)', nm), field('Vornote (VN)', vnI, 'Leer lassen, wenn sie nicht zählt.'), h('p', { class: 'hint' }, 'Teilnoten gibt es in Viertelnoten (4.25, 4.5, 4.75 …).')), h('div', { class: 'card' }, h('h3', null, 'Ergebnis'), out)));

  // Vornote berechnen
  const z = {}; const zIn = (id, label) => { z[id] = num(null); z[id].step = '0.5'; return field(label, z[id]); };
  const zOut = h('p', { 'aria-live': 'polite' });
  const zCalc = () => { const v = (k) => val(z[k]); const third = p.setup.klasse === '3';
    const ZM = third ? v('aa') : (v('aa') != null && v('g') != null ? (2 / 3) * v('aa') + (1 / 3) * v('g') : null);
    const all = [v('d'), v('e'), v('f'), v('nt'), ZM];
    if (all.some((x) => x == null)) { zOut.textContent = 'Trage alle Zeugnisnoten ein.'; return; }
    const VN = all.reduce((a, b) => a + b, 0) / 5; zOut.innerHTML = ''; zOut.append('Mathematik = ' + (third ? 'Arithmetik und Algebra = ' + ZM : '⅔ · ' + v('aa') + ' + ⅓ · ' + v('g') + ' = ' + (Math.round(ZM * 1000) / 1000)) + '. VN = (' + all.map((x) => Math.round(x * 1000) / 1000).join(' + ') + ') : 5 = ', h('b', null, String(Math.round(VN * 1000) / 1000)), ' ', btn('Als Vornote übernehmen', () => { vnI.value = String(Math.round(VN * 1000) / 1000); p.setup.vn = Math.round(VN * 1000) / 1000; save(); calc(); toast('Vornote übernommen.', 'ok'); }, { kind: 'small' })); };
  const vnCard = h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h3', null, 'Vornote aus dem Januarzeugnis'), h('p', { class: 'muted' }, 'Die Vornote zählt nur, wenn du die öffentliche Zürcher Sek A besuchst (bei Anforderungsstufen alle Fächer in der höchsten Stufe) und in allen 5 Fächern eine Note hast. Noten werden nicht gerundet.'),
    h('div', { class: 'cols three' }, zIn('d', 'Deutsch'), zIn('e', 'Englisch'), zIn('f', 'Französisch'), zIn('nt', 'Natur und Technik'), zIn('aa', 'Mathematik: Arithmetik und Algebra'), p.setup.klasse === '3' ? null : zIn('g', 'Mathematik: Geometrie')),
    h('p', { class: 'hint' }, p.setup.klasse === '3' ? '3. Sek: Die Mathematik-Note ist die Teilnote Arithmetik und Algebra.' : '2. Sek: Mathematik = ⅔ Arithmetik und Algebra + ⅓ Geometrie.'), zOut);
  Object.values(z).forEach((el) => el.addEventListener('input', zCalc));
  page.append(vnCard);
  page.append(h('div', { class: 'card', style: { marginTop: '1rem' } }, h('h3', null, 'Regeln'), h('ul', { style: { paddingLeft: '1.2rem' } },
    h('li', null, 'PN = ¼ Sprachprüfung + ¼ Aufsatz + ½ Mathematik.'), h('li', null, 'Mit Vornote: GN = ½ PN + ½ VN, bestanden ab GN 4.75. Ohne Vornote: bestanden ab PN 4.5.'),
    h('li', null, 'Die Notenskala der Prüfung wird nicht veröffentlicht. Die Kommissionen legen sie erst nach der Korrektur fest.'), h('li', null, 'Mathematik zählt doppelt: 1 Note mehr in Mathematik hebt die PN um 0.5, 1 Note mehr im Aufsatz um 0.25.'))));
  calc();
}
