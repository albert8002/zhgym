// Einrichtung: Profil, Klasse, Prüfungstermin, Zeitplan, Darstellung.
import { h, btn, field } from '../ui.js';
import { state, createProfile, save, importProfile } from '../store.js';
import { makeDemoProfile } from '../demo.js';
import { INTENSITY } from '../stats.js';
import { RULES } from '../skills.js';
import { daysBetween, parseDay, fmtDate, weekdayShort } from '../util.js';

export function segmented(options, value, onPick, label) {
  const box = h('div', { class: 'seg', role: 'group', 'aria-label': label || null });
  options.forEach(([val, text]) => box.append(h('button', { type: 'button', 'aria-pressed': String(val === value), onclick: () => { box.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false')); box.querySelector('[data-v="' + val + '"]').setAttribute('aria-pressed', 'true'); onPick(val); }, dataset: { v: String(val) } }, text)));
  return box;
}
export function dayPicker(days, onChange) {
  const box = h('div', { class: 'row', role: 'group', 'aria-label': 'Lerntage' });
  [1, 2, 3, 4, 5, 6, 0].forEach((d) => { const cb = h('input', { type: 'checkbox', checked: days.includes(d) || null, onchange: () => { const s = new Set(days); cb.checked ? s.add(d) : s.delete(d); days = [...s]; onChange(days); } }); box.append(h('label', { class: 'choice', style: { padding: '0.3rem 0.6rem' } }, cb, h('span', null, weekdayShort(d)))); });
  return box;
}

export function render(root, done) {
  root.innerHTML = '';
  const page = h('div', { class: 'page', style: { maxWidth: '760px', margin: '0 auto' } }); root.append(page);
  let step = state.profile ? 1 : 0;
  const draw = () => { page.innerHTML = ''; [stepName, stepExam, stepPlan, stepLook][step](); };

  function nav(nextLabel, onNext, canBack = true) {
    return h('div', { class: 'row between', style: { marginTop: '1.2rem' } }, canBack && step > (state.meta.profiles.length ? 0 : 0) && step > 0 ? btn('Zurück', () => { step--; draw(); }) : h('span'), btn(nextLabel, onNext, { kind: 'primary big' }));
  }
  function stepName() {
    const name = h('input', { type: 'text', autofocus: true, maxlength: '40', placeholder: 'Dein Vorname' });
    const go = async () => { const n = name.value.trim(); if (!n) { name.focus(); return; } await createProfile(n); step = 1; draw(); };
    name.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    page.append(h('div', { class: 'card' }, h('h1', null, 'Willkommen beim Gymi-Trainer'),
      h('p', null, 'Hier bereitest du dich auf die Zentrale Aufnahmeprüfung für das Kurzgymnasium im Kanton Zürich vor: Sprachprüfung, Aufsatz und Mathematik.'),
      h('p', { class: 'muted' }, 'Alles wird nur auf diesem Computer gespeichert. Die App braucht kein Internet, ausser um die offiziellen Prüfungen einmal herunterzuladen.'),
      field('Wie heisst du?', name), nav('Weiter', go, false),
      h('p', { class: 'small muted', style: { marginTop: '1.2rem', borderTop: '1px solid var(--line)', paddingTop: '0.8rem' } }, 'Zuerst umschauen? ', h('button', { class: 'linkish link', type: 'button', onclick: async () => { await importProfile(makeDemoProfile()); done(); } }, 'Beispielprofil öffnen'), ' (3 Wochen Lerndaten von «Mia»; dein eigenes Profil legst du danach im Profil-Menü an).')));
    setTimeout(() => name.focus(), 30);
  }
  function stepExam() {
    const s = state.profile.setup;
    const date = h('input', { type: 'date', value: s.examDate });
    const vn = h('input', { type: 'number', min: '1', max: '6', step: '0.05', value: s.vn == null ? '' : String(s.vn), placeholder: 'z. B. 4.8', style: { width: '8rem' } });
    const info = h('p', { class: 'hint' });
    const upd = () => { const d = daysBetween(new Date(), parseDay(date.value || RULES.examDate)); info.textContent = d > 0 ? 'Das sind noch ' + d + ' Tage (' + Math.ceil(d / 7) + ' Wochen).' : 'Dieses Datum liegt in der Vergangenheit.'; };
    date.addEventListener('input', upd); upd();
    let klasse = s.klasse;
    page.append(h('div', { class: 'card' }, h('h2', null, 'Deine Prüfung'),
      h('div', { class: 'form-row' }, h('label', null, 'In welcher Klasse bist du?'), segmented([['2', '2. Sek'], ['3', '3. Sek'], ['x', 'andere Schule']], klasse, (v) => { klasse = v; }, 'Klasse')),
      field('Prüfungstermin', date, 'Schriftliche Prüfung 2027: Montag, ' + fmtDate(RULES.examDate) + '. Ändere das Datum nur, wenn du für ein anderes Jahr lernst.'), info,
      field('Vornote (wenn du sie schon kennst)', vn, 'Öffentliche Sek A: Durchschnitt aus Deutsch, Französisch, Englisch, Mathematik, Natur und Technik im Januarzeugnis. Sek B/C oder Privatschule: leer lassen.'),
      nav('Weiter', () => { s.klasse = klasse; s.examDate = date.value || RULES.examDate; const v = parseFloat(vn.value); s.vn = isFinite(v) && v >= 1 && v <= 6 ? v : null; save(); step = 2; draw(); })));
  }
  function stepPlan() {
    const s = state.profile.setup; let intensity = s.intensity, days = s.days.slice();
    const list = h('div', { class: 'choices' });
    Object.entries(INTENSITY).forEach(([k, v]) => list.append(h('label', { class: 'choice' }, h('input', { type: 'radio', name: 'int', checked: k === intensity || null, onchange: () => { intensity = k; } }), h('span', null, h('b', null, v.name), h('br'), h('span', { class: 'muted' }, v.text)))));
    page.append(h('div', { class: 'card' }, h('h2', null, 'Dein Zeitplan'),
      h('p', null, 'Regelmässig und kurz bringt mehr als selten und lang. Du kannst den Plan später jederzeit ändern.'),
      h('div', { class: 'form-row' }, h('label', null, 'Wie viel willst du pro Woche lernen?'), list),
      h('div', { class: 'form-row' }, h('label', null, 'An welchen Tagen?'), dayPicker(days, (d) => { days = d; })),
      nav('Weiter', () => { s.intensity = intensity; s.days = days.length ? days : [1, 2, 3, 4, 5, 6]; save(); step = 3; draw(); })));
  }
  function stepLook() {
    const st = state.profile.settings; const apply = () => { const de = document.documentElement; de.dataset.theme = st.theme; de.dataset.font = st.font; de.style.setProperty('--size', String(st.size)); save(); };
    page.append(h('div', { class: 'card' }, h('h2', null, 'Darstellung'), h('p', null, 'Stelle die App so ein, dass du gut lesen kannst.'),
      h('div', { class: 'form-row' }, h('label', null, 'Farben'), segmented([['hell', 'Heft (hell)'], ['dunkel', 'Wandtafel (dunkel)'], ['kontrast', 'Starker Kontrast']], st.theme, (v) => { st.theme = v; apply(); }, 'Farben')),
      h('div', { class: 'form-row' }, h('label', null, 'Schrift'), segmented([['standard', 'Standard'], ['legasthenie', 'Für Legasthenie (OpenDyslexic)']], st.font, (v) => { st.font = v; apply(); }, 'Schrift')),
      h('div', { class: 'form-row' }, h('label', null, 'Schriftgrösse'), segmented([[90, 'klein'], [100, 'normal'], [115, 'gross'], [130, 'sehr gross']], st.size, (v) => { st.size = v; apply(); }, 'Schriftgrösse')),
      h('p', { class: 'note' }, h('b', null, 'Als Nächstes: der Einstufungstest. '), 'Er dauert etwa 40 Minuten und zeigt, wo du stehst. Danach weiss die App, was du zuerst üben sollst. Du kannst ihn auch später machen.'),
      nav('Einrichtung abschliessen', () => { state.profile.setup.done = true; save(); done(); })));
  }
  draw();
}
