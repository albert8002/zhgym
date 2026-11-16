// Aufsatz-Werkstatt: Thema wählen, unter Zeit schreiben, automatisch prüfen, mit dem Raster bewerten.
import { h, btn, toast, confirmBox, icon, tabs, saveText, field } from '../ui.js';
import { state, save, addAttempt } from '../store.js';
import { DB } from '../engine/sources.js';
import { BILDER } from '../../content/de-aufsatz.js';
import { analyse, fromLanguageTool, LEITFRAGEN, PRESET, MASSSTAB, suggest, gradeRubric, CHECKLIST, PLAN_TEMPLATE, TYP_NAME, TYP_SKILL, CATS } from '../engine/essay-check.js';
import { segmented } from './onboarding.js';
import { SKILL } from '../skills.js';
import { afterProgress } from '../progress.js';
import { setLeave, setGuard, refresh } from '../main.js';
import { RNG, newSeed, fmtDur, fmtDate, dayKey, uid, esc, fmtGrade } from '../util.js';

const api = window.gymi || null;
const TYPES = ['eroerterung', 'erzaehlung', 'fortsetzung', 'bild', 'erlebnis', 'beschreibung'];
const PHASES = [[0, 5, 'Thema wählen'], [5, 15, 'Planen'], [15, 75, 'Schreiben'], [75, 90, 'Überarbeiten']];
const topicOf = (t) => ({ title: t.title, typ: t.typ, auftrag: t.auftrag || [], keys: t.keys || [], min: t.min || 1, anfang: t.anfang || '', bild: t.bild || '', jahr: t.jahr || null, np: !!t.np, pdf: !!t.pdf, hinweis: t.hinweis || '', id: t._id });
const essayById = (id) => state.profile.essays.find((e) => e.id === id);
const wordsN = (s) => (String(s).match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;

function newEssay(topic, sim) {
  const e = { id: uid(), title: topic.title, typ: topic.typ, topic, created: Date.now(), updated: Date.now(), sim: !!sim, start: sim ? Date.now() : null, seconds: 0, text: '', plan: '', done: false, ticks: [], rubric: {}, grade: null, massstab: 'normal' };
  state.profile.essays.push(e); save(); return e;
}
function topicCard(t, onPick) {
  return h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', { style: { margin: 0 } }, t.title), h('span', { class: 'row' }, h('span', { class: 'tag ink' }, TYP_NAME[t.typ] || t.typ), t.jahr ? h('span', { class: 'tag' }, (t.np ? 'Nachprüfung ' : 'Prüfung ') + t.jahr) : h('span', { class: 'tag' }, 'eigenes Thema'))),
    h('ul', { style: { paddingLeft: '1.2rem', margin: '0.5rem 0' } }, (t.auftrag || []).map((a) => h('li', null, a))),
    t.pdf && !(t.bild && BILDER[t.bild]) ? h('p', { class: 'hint' }, (t.hinweis || 'Bild oder Text dazu im offiziellen PDF.') + ' ', h('a', { href: '#/offiziell/' + t.jahr + '/A' }, 'Aufsatzthemen ' + t.jahr + ' öffnen')) : null,
    onPick ? btn('Dieses Thema schreiben', onPick, { kind: 'primary', icon: 'pen' }) : null);
}

// Fehlermuster: zählt Fehler pro Kategorie und gleiche Hinweise über alle korrigierten Aufsätze.
const normMsg = (m) => m.replace(/«[^»]*»/g, '«…»').replace(/^(Rechtschreibung prüfen[^:]*):.*$/, '$1').replace(/\s+Vorschlag:.*$/, '').trim();
function errorProfile(an, text) {
  const cats = {}, msgs = {}, ex = {};
  an.issues.filter((x) => x.kind === 'err' && !x.lt).forEach((x) => {
    cats[x.cat] = (cats[x.cat] || 0) + 1; const k = x.cat + '|' + normMsg(x.msg); msgs[k] = (msgs[k] || 0) + 1;
    if (!ex[k]) ex[k] = x.msg.includes('«') || x.i < 0 || !/[A-Za-zÄÖÜäöü]/.test(text.slice(x.i, x.j)) ? x.msg : x.msg.replace(/[.:]?\s*$/, '') + ' (bei «' + text.slice(x.i, x.j) + '»)';
  });
  return { words: an.stats.words || 0, cats, msgs, ex };
}
const CAT_SKILL = { Rechtschreibung: 'D15', Zeichensetzung: 'D14', Stil: 'D27' };
// Passende Übung zu einem Fehler: das/dass → D15, Zeitform → D3, sonst nach Bereich
const skillFor = (cat, msg) => (/dass/.test(msg) ? 'D15' : /Zeitform|Präteritum/.test(msg) ? 'D3' : CAT_SKILL[cat] || null);
function patternsCard(essays) {
  const xs = essays.filter((e) => e.done && e.prof && e.prof.words >= 50);
  if (!xs.length) return null;
  const words = xs.reduce((a, e) => a + e.prof.words, 0);
  const cats = {}; const msgs = {};
  xs.slice().sort((a, b) => a.updated - b.updated).forEach((e) => { for (const [c, n] of Object.entries(e.prof.cats)) cats[c] = (cats[c] || 0) + n; for (const [k, n] of Object.entries(e.prof.msgs)) { msgs[k] = msgs[k] || { n: 0, in: 0 }; msgs[k].n += n; msgs[k].in += 1; if (e.prof.ex && e.prof.ex[k]) msgs[k].ex = e.prof.ex[k]; } });
  const catRows = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const top = Object.entries(msgs).sort((a, b) => b[1].in - a[1].in || b[1].n - a[1].n).slice(0, 5);
  const per100 = (n) => (Math.round(n / words * 1000) / 10).toFixed(1);
  return h('div', { class: 'card' }, h('h2', null, 'Deine Fehlermuster'),
    h('p', { class: 'muted' }, 'Aus ' + xs.length + (xs.length === 1 ? ' korrigiertem Aufsatz' : ' korrigierten Aufsätzen') + ' (' + words + ' Wörter). Gezählt werden nur sichere Fehler der App-Prüfung. Wer weiss, welche Fehler er immer wieder macht, kann gezielt danach suchen.'),
    catRows.length ? h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Bereich'), h('th', { class: 'num' }, 'Fehler'), h('th', { class: 'num' }, 'pro 100 Wörter'), h('th', null, ''))),
      h('tbody', null, catRows.map(([c, n]) => { const top = Object.entries(msgs).filter(([k]) => k.startsWith(c + '|')).sort((a, b) => b[1].n - a[1].n)[0]; const sk = skillFor(c, top ? top[0] + ' ' + (top[1].ex || '') : ''); return h('tr', null, h('td', null, c), h('td', { class: 'num' }, String(n)), h('td', { class: 'num' }, per100(n)), h('td', null, sk ? h('a', { href: '#/lernen/' + sk }, 'Üben: ' + SKILL[sk].name) : null)); }))) : h('p', null, 'Keine Fehler gefunden. Sehr gut.'),
    top.length ? h('div', null, h('h3', null, 'Das passiert dir am häufigsten'), h('ol', { style: { paddingLeft: '1.2rem' } }, top.map(([k, v]) => { const [c, m] = k.split('|'); const sk = skillFor(c, m + ' ' + (v.ex || '')); return h('li', null, h('b', null, c + ': '), v.ex || m, sk ? [' ', h('a', { href: '#/lernen/' + sk, class: 'small' }, 'Üben')] : null, h('span', { class: 'muted' }, ' (' + v.n + '-mal, in ' + v.in + ' von ' + xs.length + (xs.length === 1 ? ' Aufsatz)' : ' Aufsätzen)'))); })),
      h('p', { class: 'hint' }, 'Tipp: Schreib dir die 2 häufigsten Punkte auf. Lies an der Prüfung deinen Text am Schluss einmal nur auf diese Fehler durch.')) : null);
}

function overview(page) {
  const p = state.profile;
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Aufsatz-Werkstatt'), h('p', null, 'Schreibe Aufsätze wie an der Prüfung. Die App prüft Rechtschreibung, Zeichensetzung, Stil und Aufbau und schlägt Punkte im Bewertungsraster vor. Den Inhalt beurteilst du selbst oder eine erwachsene Person.')));
  page.append(h('div', { class: 'cols three' },
    h('div', { class: 'card' }, h('h3', null, 'Prüfung simulieren'), h('p', null, '4 Themen zur Wahl, 90 Minuten, keine Hilfe während dem Schreiben.'), h('a', { class: 'btn primary', href: '#/aufsatz/sim' }, 'Simulation starten')),
    h('div', { class: 'card' }, h('h3', null, 'Thema wählen'), h('p', null, (DB.aufsatz || []).length + ' Themen: alle Prüfungsthemen 2015–2026 und eigene Themen.'), h('a', { class: 'btn', href: '#/aufsatz/neu/' }, 'Themen ansehen')),
    h('div', { class: 'card' }, h('h3', null, 'Eigenes Thema'), h('p', null, 'Zum Beispiel ein Thema aus der Schule oder aus einer offiziellen Prüfung.'), h('a', { class: 'btn', href: '#/aufsatz/neu/frei' }, 'Thema eingeben'))));
  const list = p.essays.slice().sort((a, b) => b.updated - a.updated);
  const card = h('div', { class: 'card' }, h('h2', null, 'Meine Aufsätze'));
  if (!list.length) card.append(h('p', { class: 'muted' }, 'Noch kein Aufsatz. Am besten jeden Samstag 1 Aufsatz in 90 Minuten.'));
  else card.append(h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Datum'), h('th', null, 'Thema'), h('th', null, 'Textsorte'), h('th', { class: 'num' }, 'Wörter'), h('th', { class: 'num' }, 'Note'), h('th', null, ''))),
    h('tbody', null, list.map((e) => h('tr', null, h('td', null, fmtDate(new Date(e.created))), h('td', null, e.title, e.sim ? h('span', { class: 'tag', style: { marginLeft: '0.4rem' } }, 'Simulation') : null), h('td', null, TYP_NAME[e.typ] || e.typ), h('td', { class: 'num' }, String(wordsN(e.text))), h('td', { class: 'num' }, e.grade ? fmtGrade(e.grade) : (e.done ? 'offen' : 'in Arbeit')),
      h('td', null, h('a', { class: 'btn small', href: '#/aufsatz/e/' + e.id }, e.done ? 'Ansehen' : 'Weiterschreiben'), btn('', async () => { if (await confirmBox('Aufsatz löschen?', '«' + e.title + '» wird gelöscht.', 'Löschen', 'Behalten', true)) { p.essays = p.essays.filter((x) => x.id !== e.id); save(); refresh(); } }, { kind: 'small quiet', icon: 'trash', aria: 'Löschen' })))))));
  page.append(card);
  const slot = h('div'); page.append(slot);
  const drawPc = () => { slot.innerHTML = ''; const pc = patternsCard(p.essays); if (pc) slot.append(pc); };
  drawPc();
  // Fehlermuster für fertige Aufsätze ohne Auswertung nachholen (z. B. ältere Aufsätze oder Beispielprofil)
  const todo = p.essays.filter((e) => e.done && !e.prof && (e.text || '').length > 200).slice(0, 6);
  if (todo.length) (async () => { for (const e of todo) { try { const an = await fullCheck(e, false); e.prof = errorProfile(an, e.text); } catch (err) { console.error(err); } } save(); if (slot.isConnected) drawPc(); })();
  page.append(h('p', { class: 'note' }, h('b', null, 'Wichtig: '), 'Die offizielle Bewertung macht eine Lehrperson nach einem internen Raster. Die App kann nur Regeln prüfen, nicht verstehen, ob deine Gedanken überzeugen. Lass wenn möglich eine erwachsene Person mit dem Raster mitlesen.'));
}

function picker(page, typ) {
  page.append(h('a', { class: 'back', href: '#/aufsatz' }, '‹ Werkstatt'));
  if (typ === 'frei') {
    page.append(h('div', { class: 'page-head' }, h('h1', null, 'Eigenes Thema')));
    const title = h('input', { type: 'text', placeholder: 'Titel' }); const sel = h('select', null, TYPES.map((t) => h('option', { value: t }, TYP_NAME[t])));
    const auf = h('textarea', { rows: 4, placeholder: 'Auftrag: 1 Teilauftrag pro Zeile' }); const keys = h('input', { type: 'text', placeholder: 'zum Beispiel: Kokosnuss, Karte' });
    page.append(h('div', { class: 'card' }, field('Titel', title), field('Textsorte', sel), field('Auftrag', auf, 'Schreibe jeden Teilauftrag auf eine eigene Zeile.'), field('Vorgegebene Wörter (freiwillig)', keys, 'Die App prüft, ob diese Wörter vorkommen. Mit Komma trennen.'),
      btn('Schreiben', () => { if (!title.value.trim()) { toast('Gib einen Titel ein.', 'bad'); return; } const t = { title: title.value.trim(), typ: sel.value, auftrag: auf.value.split('\n').map((x) => x.trim()).filter(Boolean), keys: keys.value.split(',').map((x) => x.trim()).filter(Boolean) }; const e = newEssay(topicOf(t), false); location.hash = '#/aufsatz/e/' + e.id; }, { kind: 'primary', icon: 'pen' })));
    return;
  }
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Thema wählen'), h('p', null, 'Prüfungsthemen 2015–2026 (Auftrag sinngemäss) und eigene Themen in der gleichen Bauart.')));
  let cur = TYPES.includes(typ) ? typ : 'alle';
  const box = h('div');
  const draw = () => { box.innerHTML = ''; const list = (DB.aufsatz || []).filter((t) => cur === 'alle' || t.typ === cur).slice().sort((a, b) => (b.jahr || 0) - (a.jahr || 0));
    if (!list.length) box.append(h('p', { class: 'muted' }, 'Keine Themen dieser Art.'));
    list.forEach((t) => box.append(topicCard(t, () => { const e = newEssay(topicOf(t), false); location.hash = '#/aufsatz/e/' + e.id; }))); };
  page.append(tabs([{ id: 'alle', label: 'Alle' }, ...TYPES.map((t) => ({ id: t, label: TYP_NAME[t] }))], cur, (id) => { cur = id; page.querySelectorAll('.tab').forEach((b) => { const on = b.textContent === (id === 'alle' ? 'Alle' : TYP_NAME[id]); b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); }); draw(); }), box);
  draw();
}

function simStart(page) {
  page.append(h('a', { class: 'back', href: '#/aufsatz' }, '‹ Werkstatt'));
  const r = new RNG(newSeed()); const ok = (t) => !t.pdf || (t.bild && BILDER[t.bild]);
  const pool = (DB.aufsatz || []).filter(ok);
  const story = r.pick(pool.filter((t) => t.typ === 'erzaehlung' || t.typ === 'fortsetzung'));
  const erort = r.sample(pool.filter((t) => t.typ === 'eroerterung'), 2);
  const other = r.pick(pool.filter((t) => ['bild', 'erlebnis', 'beschreibung'].includes(t.typ)));
  const four = r.shuffle([story, ...erort, other].filter(Boolean));
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Aufsatz: Simulation'), h('p', null, 'Wie an der Prüfung: 4 Themen, du wählst 1. Die Uhr läuft ab jetzt 90 Minuten. Die Korrekturhilfe siehst du erst nach dem Abgeben.')));
  const t0 = Date.now(); const clock = h('div', { class: 'timer' }, '90:00');
  const iv = setInterval(() => { clock.textContent = fmtDur(Math.max(0, 5400 - Math.round((Date.now() - t0) / 1000))); }, 500); setLeave(() => clearInterval(iv));
  page.append(h('div', { class: 'card row between' }, h('b', null, 'Wähle in den ersten 5 Minuten. Nimm das Thema, zu dem dir die meisten konkreten Beispiele einfallen.'), clock));
  four.forEach((t) => page.append(topicCard(t, () => { const e = newEssay(topicOf(t), true); e.start = t0; save(); location.hash = '#/aufsatz/e/' + e.id; })));
}

function auftragCard(e, editable) {
  const t = e.topic || {};
  const card = h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h2', { style: { margin: 0 } }, e.title), h('span', { class: 'tag ink' }, TYP_NAME[e.typ] || e.typ)));
  if (t.auftrag && t.auftrag.length) card.append(h('div', { class: 'stack', style: { marginTop: '0.6rem' } }, t.auftrag.map((a, i) => { const cb = h('input', { type: 'checkbox', checked: e.ticks[i] || null, disabled: !editable || null, onchange: () => { e.ticks[i] = cb.checked; save(); } }); return h('label', { class: 'choice' }, cb, h('span', null, a)); })));
  if (t.anfang) card.append(h('div', { class: 'readtext', style: { marginTop: '0.6rem' } }, h('b', null, 'Anfang: '), t.anfang));
  if (t.bild && BILDER[t.bild]) card.append(h('div', { class: 'row', style: { marginTop: '0.6rem', alignItems: 'flex-start' } }, BILDER[t.bild].map((svg, i) => h('figure', { style: { margin: 0, flex: '1 1 220px' } }, h('div', { html: svg }), BILDER[t.bild].length > 1 ? h('figcaption', { class: 'muted small' }, 'Bild ' + 'AB'[i]) : null))));
  if (t.hinweis) card.append(h('p', { class: 'hint' }, t.hinweis));
  if (t.pdf && t.jahr) card.append(h('p', { class: 'hint' }, h('a', { href: '#/offiziell/' + t.jahr + '/A' }, 'Offizielles PDF «Aufsatzthemen ' + t.jahr + '» öffnen')));
  return card;
}

async function spellFor(text) {
  if (!api || !api.spellCheck) return null;
  const words = [...new Set(String(text).match(/[A-Za-zÄÖÜäöüßéèàê]+(?:-[A-Za-zÄÖÜäöüß]+)*/g) || [])];
  try { return await api.spellCheck(words); } catch (x) { return null; }
}
async function fullCheck(e, withLT) {
  const spell = await spellFor(e.text);
  const an = analyse(e.text, Object.assign({}, e.topic, { title: e.title }), spell);
  if (withLT && api && api.ltCheck) {
    const r = await api.ltCheck({ text: e.text });
    if (r && r.ok) { const lt = fromLanguageTool(r.text, e.text).filter((x) => !an.issues.some((y) => y.i === x.i)); an.issues.push(...lt); an.issues.sort((a, b) => (a.i < 0 ? 1e9 : a.i) - (b.i < 0 ? 1e9 : b.i)); an.lt = lt.length; }
    else { an.ltError = 'LanguageTool ist nicht erreichbar. Die Prüfung ohne Internet ist trotzdem vollständig.'; }
  }
  return an;
}

function issueList(an, onPick) {
  const box = h('div', { class: 'issues' });
  if (!an.issues.length) { box.append(h('p', { class: 'note ok' }, 'Keine Hinweise gefunden. Das heisst nicht, dass der Text fehlerfrei ist: Lies ihn mit der Checkliste noch einmal durch.')); return box; }
  CATS.forEach((c) => { const xs = an.issues.filter((x) => x.cat === c); if (!xs.length) return;
    box.append(h('h4', null, c + ' (' + xs.length + ')'));
    xs.forEach((x) => box.append(h('div', { class: 'issue ' + (x.kind === 'err' ? 'err' : 'tip'), role: x.i >= 0 ? 'button' : null, tabindex: x.i >= 0 ? '0' : null, style: { cursor: x.i >= 0 ? 'pointer' : 'default' }, onclick: () => x.i >= 0 && onPick(x), onkeydown: (ev) => { if (ev.key === 'Enter' && x.i >= 0) onPick(x); } }, x.msg))); });
  return box;
}
function markedText(text, issues) {
  let html = '', pos = 0; const xs = issues.filter((x) => x.i >= 0 && x.j > x.i).sort((a, b) => a.i - b.i);
  xs.forEach((x, k) => { if (x.i < pos) return; html += esc(text.slice(pos, x.i)) + '<span id="iss-' + k + '" class="' + (x.kind === 'err' ? 'e' : x.cat === 'Stil' ? 't' : 'w') + '" title="' + esc(x.msg) + '">' + esc(text.slice(x.i, x.j)) + '</span>'; pos = x.j; x._k = k; });
  return h('div', { class: 'marked-text', html: html + esc(text.slice(pos)) });
}

function editor(page, e) {
  page.classList.add('wide');
  page.append(h('a', { class: 'back', href: '#/aufsatz' }, '‹ Werkstatt'));
  const p = state.profile;
  const ta = h('textarea', { class: 'editor', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', 'aria-label': 'Dein Aufsatz', placeholder: 'Schreibe hier deinen Aufsatz. Absätze mit der Eingabetaste.' }); ta.value = e.text;
  const plan = h('textarea', { rows: 8, 'aria-label': 'Stichwortplan', placeholder: 'Stichwortplan: 1 Zeile pro Absatz' }); plan.value = e.plan || '';
  const count = h('span', { class: 'muted' }); const clock = h('div', { class: 'timer', role: 'timer' }); const phaseBox = h('div', { class: 'row small' });
  const out = h('div');
  let since = Date.now(), timer = null, saveT = null, finished = false;
  const elapsed = () => (e.sim ? Math.round((Date.now() - e.start) / 1000) : e.seconds + Math.round((Date.now() - since) / 1000));
  const persist = () => { e.text = ta.value; e.plan = plan.value; e.updated = Date.now(); if (!e.sim) { e.seconds += Math.round((Date.now() - since) / 1000); since = Date.now(); } save(); };
  const saved = h('span', { class: 'muted small', 'aria-live': 'polite' });
  const onInput = () => { count.textContent = wordsN(ta.value) + ' Wörter'; saved.textContent = ''; clearTimeout(saveT); saveT = setTimeout(() => { persist(); const d = new Date(); saved.textContent = 'Gespeichert ' + d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); }, 800); };
  ta.addEventListener('input', onInput); plan.addEventListener('input', onInput); onInput();
  const tick = () => {
    const s = elapsed(); const min = s / 60;
    clock.textContent = e.sim ? fmtDur(Math.max(0, 5400 - s)) : fmtDur(s); clock.classList.toggle('low', e.sim && 5400 - s < 300); clock.classList.toggle('over', !e.sim && s > 5400);
    phaseBox.innerHTML = ''; PHASES.forEach(([a, b, name]) => phaseBox.append(h('span', { class: 'tag' + (min >= a && min < b ? ' ink' : '') }, a + '–' + b + ' ' + name)));
    if (e.sim && s >= 5400 && !finished) { toast('Die 90 Minuten sind um. Der Aufsatz wird abgegeben.', 'info', 6000); finish(); }
  };
  async function finish() { if (finished) return; finished = true; clearInterval(timer); persist(); e.seconds = e.sim ? Math.min(5400, elapsed()) : e.seconds; e.done = true; save(); setTimeout(afterProgress, 600); setGuard(null); location.hash = '#/aufsatz/e/' + e.id + '/korrektur'; }
  const onVis = () => { if (e.sim || finished) return; if (document.hidden) persist(); else since = Date.now(); };
  document.addEventListener('visibilitychange', onVis);
  timer = setInterval(tick, 500); tick();
  setLeave(() => { clearInterval(timer); document.removeEventListener('visibilitychange', onVis); document.removeEventListener('keydown', onEsc); document.body.classList.remove('focus-mode'); if (!finished) persist(); });
  const toggleFocus = () => { const on = !document.body.classList.contains('focus-mode'); document.body.classList.toggle('focus-mode', on); if (on) toast('Schreibmodus: Esc beendet ihn.', 'info', 2500); ta.focus(); };
  const onEsc = (ev) => { if (ev.key === 'Escape' && document.body.classList.contains('focus-mode')) document.body.classList.remove('focus-mode'); };
  document.addEventListener('keydown', onEsc);
  const left = h('div', { class: 'essay-side' }, auftragCard(e, true), h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', { style: { margin: 0 } }, 'Stichwortplan'), btn('Vorlage einfügen', () => { if (!plan.value.trim()) { plan.value = PLAN_TEMPLATE[e.typ] || PLAN_TEMPLATE.frei; onInput(); } else toast('Der Plan ist nicht leer.', 'info'); }, { kind: 'small quiet' })), plan),
    h('div', { class: 'card' }, h('h3', null, 'Checkliste zum Überarbeiten'), h('ul', { style: { paddingLeft: '1.2rem' } }, CHECKLIST.map((c) => h('li', null, c)))));
  const right = h('div', null, h('div', { class: 'card' }, h('div', { class: 'row between', style: { marginBottom: '0.5rem' } }, phaseBox, clock), ta,
    h('div', { class: 'row between', style: { marginTop: '0.6rem' } }, h('div', { class: 'row' }, count, saved), h('div', { class: 'row' },
      btn('Schreibmodus', toggleFocus, { kind: 'quiet', icon: 'expand', title: 'Nur Auftrag und Text zeigen (Esc beendet)' }),
      !e.sim ? btn('Prüfen', async () => { persist(); out.innerHTML = '<p class="muted">Prüfe …</p>'; const an = await fullCheck(e, false); out.innerHTML = ''; out.append(h('div', { class: 'card' }, h('h3', null, 'Hinweise (' + an.issues.length + ')'), an.spellAvailable ? null : h('p', { class: 'hint' }, 'Die Prüfung mit Wörterbuch gibt es nur in der installierten App.'), issueList(an, (x) => { ta.focus(); ta.setSelectionRange(x.i, x.j); const line = ta.value.slice(0, x.i).split('\n').length; ta.scrollTop = Math.max(0, (line - 3) * 28); }))); }, { icon: 'check' }) : null,
      btn(e.sim ? 'Abgeben' : 'Fertig: zur Korrektur', async () => { if (await confirmBox(e.sim ? 'Aufsatz abgeben?' : 'Zur Korrektur?', e.sim ? 'Nach dem Abgeben kannst du nichts mehr ändern.' : 'Du kannst danach weiter überarbeiten.', e.sim ? 'Abgeben' : 'Zur Korrektur', 'Weiterschreiben')) finish(); }, { kind: 'primary' })))), out);
  page.append(h('div', { class: 'split' }, left, right));
  if (e.sim) setGuard(() => (finished ? Promise.resolve(true) : confirmBox('Simulation verlassen?', 'Dein Text ist gespeichert. Die Uhr läuft weiter, auch wenn du die Seite verlässt.', 'Verlassen', 'Weiterschreiben')), 'Eine Aufsatz-Simulation läuft. Dein Text ist gespeichert.');
  ta.focus();
}

async function review(page, e) {
  page.classList.add('wide');
  const p = state.profile;
  page.append(h('a', { class: 'back', href: '#/aufsatz' }, '‹ Werkstatt'));
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Korrektur: ' + e.title), h('p', null, (TYP_NAME[e.typ] || e.typ) + ', ' + wordsN(e.text) + ' Wörter, ' + fmtDur(e.seconds) + ' Schreibzeit' + (e.grade ? ', Note ' + fmtGrade(e.grade) : ''))));
  const wait = h('p', { class: 'muted' }, 'Prüfe den Text …'); page.append(wait);
  const an = await fullCheck(e, false); wait.remove();
  { const prof = errorProfile(an, e.text); if (JSON.stringify(prof) !== JSON.stringify(e.prof)) { e.prof = prof; save(); } }
  const textCard = h('div', { class: 'card' });
  const drawText = (a) => { textCard.innerHTML = ''; textCard.append(h('div', { class: 'row between' }, h('h3', { style: { margin: 0 } }, 'Dein Text'), h('div', { class: 'row small' }, h('span', { class: 'marked-text' }, h('span', { class: 'e' }, 'Fehler')), h('span', { class: 'marked-text' }, h('span', { class: 'w' }, 'Hinweis')), h('span', { class: 'marked-text' }, h('span', { class: 't' }, 'Stil')))), markedText(e.text, a.issues)); };
  drawText(an);
  const errN = an.issues.filter((x) => x.kind === 'err').length;
  const kpi = h('div', { class: 'kpi', style: { margin: '1rem 0' } },
    h('div', null, h('b', null, String(an.stats.words)), h('span', null, 'Wörter')), h('div', null, h('b', null, String(an.stats.paragraphs)), h('span', null, 'Absätze')),
    h('div', null, h('b', null, an.stats.sentences ? String(Math.round(an.stats.avg)) : '–'), h('span', null, 'Wörter pro Satz')), h('div', null, h('b', null, String(errN)), h('span', null, 'Fehler gefunden')), h('div', null, h('b', null, (Math.round(an.metrics.errPer100 * 10) / 10 || 0) + ''), h('span', null, 'Fehler pro 100 Wörter')));
  const issuesCard = h('div', { class: 'card' }, h('h3', null, 'Hinweise'), an.spellAvailable ? null : h('p', { class: 'hint' }, 'Ohne Wörterbuch geprüft (nur in der installierten App möglich).'));
  const drawIssues = (a) => { issuesCard.querySelectorAll('.issues').forEach((x) => x.remove()); issuesCard.append(issueList(a, (x) => { const el = document.getElementById('iss-' + x._k); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.style.outline = '3px solid var(--mark)'; setTimeout(() => { el.style.outline = ''; }, 1500); } })); };
  drawIssues(an);
  if (p.settings.lt && api && api.ltCheck) issuesCard.append(btn('Zusätzlich online prüfen (LanguageTool)', async (ev) => { ev.currentTarget.disabled = true; const a2 = await fullCheck(e, true); if (a2.ltError) toast(a2.ltError, 'bad', 6000); else toast((a2.lt || 0) + ' zusätzliche Hinweise von LanguageTool.', 'ok'); drawText(a2); drawIssues(a2); }, { kind: 'small', icon: 'globe' }), h('p', { class: 'hint' }, 'Dabei wird dein Text an languagetool.org gesendet.'));

  // Bewertungsraster
  const vals = Object.assign({}, e.rubric || {}); let ms = e.massstab || 'normal'; let sug = suggest(an, e.typ, ms);
  const sum = h('div', { class: 'note', 'aria-live': 'polite' });
  const upd = () => { const g = gradeRubric(vals); sum.innerHTML = ''; sum.append(h('b', null, g.points + ' von 15 Punkten: Note ' + fmtGrade(g.grade)), ' (' + g.byArea.map((b) => b.area + ' ' + b.p + '/5').join(', ') + ')', g.complete ? '' : h('div', { class: 'muted small' }, 'Noch nicht alle Leitfragen bewertet. Offene zählen 0 Punkte.')); };
  const tb = h('tbody');
  const drawRows = () => { tb.innerHTML = ''; let area = '';
    LEITFRAGEN.forEach((f) => { if (f.area !== area) { area = f.area; tb.append(h('tr', null, h('th', { colspan: '3' }, area))); }
      const hint = (PRESET[e.typ] || {})[f.id]; const s = sug.values[f.id];
      tb.append(h('tr', null, h('td', null, h('b', null, f.id + '. '), f.q, hint ? h('div', { class: 'muted small' }, hint) : null),
        h('td', { class: 'small' }, s != null ? h('span', null, 'Vorschlag: ', h('b', null, s === 0.5 ? '½' : String(s)), h('div', { class: 'muted' }, sug.why[f.id] || '')) : h('span', { class: 'muted' }, 'selbst beurteilen')),
        h('td', null, segmented([[0, '0'], [0.5, '½'], [1, '1']], vals[f.id], (v) => { vals[f.id] = v; upd(); }, 'Punkte für Leitfrage ' + f.id)))); }); };
  drawRows(); upd();
  const msSel = segmented(Object.entries(MASSSTAB).map(([k, v]) => [k, v.name]), ms, (v) => { ms = v; sug = suggest(an, e.typ, ms); drawRows(); }, 'Massstab');
  const rubric = h('div', { class: 'card' }, h('h3', null, 'Bewertungsraster'), h('p', { class: 'muted' }, '15 Leitfragen in 3 gleich wichtigen Bereichen (Inhalt, Aufbau, Sprache). Je 0, ½ oder 1 Punkt. Note = 1 + 5 × Punkte : 15, gerundet auf Viertelnoten. Hilfsraster nach veröffentlichten Leitfragen, nicht die offizielle Bewertung.'),
    h('div', { class: 'row', style: { marginBottom: '0.6rem' } }, h('span', null, 'Massstab für die Vorschläge:'), msSel, btn('Vorschläge übernehmen', () => { for (const [k, v] of Object.entries(sug.values)) if (vals[k] == null) vals[k] = v; drawRows(); upd(); }, { kind: 'small' })),
    h('table', { class: 'list rubric' }, tb), sum,
    h('div', { class: 'row', style: { marginTop: '0.8rem' } }, btn('Bewertung speichern', () => {
      const g = gradeRubric(vals); const first = !e.grade;
      e.rubric = Object.assign({}, vals); e.grade = g.grade; e.points = g.points; e.massstab = ms; e.updated = Date.now(); e.errPer100 = an.metrics.errPer100;
      if (first) {
        addAttempt({ key: 'aufsatz.' + e.typ, skill: 'D29', points: g.points, max: 15, sec: e.seconds, mode: e.sim ? 'sim' : 'aufsatz', src: 'eigen', seed: 0 });
        const ts = TYP_SKILL[e.typ]; const ia = g.byArea[0].p + g.byArea[1].p; if (ts && ts !== 'D29') addAttempt({ key: 'aufsatz.' + e.typ, skill: ts, points: ia, max: 10, sec: 0, mode: 'aufsatz', src: 'eigen', seed: 0 });
        addAttempt({ key: 'aufsatz.stil', skill: 'D27', points: g.byArea[2].p, max: 5, sec: 0, mode: 'aufsatz', src: 'eigen', seed: 0 });
        if (e.sim) p.mocks.push({ id: uid(), type: 'aufsatz', date: dayKey(), points: g.points, max: 15, grade: g.grade, seconds: e.seconds });
      }
      save(); toast('Gespeichert: Note ' + fmtGrade(g.grade) + '.', 'ok');
    }, { kind: 'primary' }),
    !e.sim ? btn('Weiter überarbeiten', () => { e.done = false; save(); location.hash = '#/aufsatz/e/' + e.id; }, {}) : null,
    btn('Als Textdatei speichern', () => saveText(e.title.replace(/[^\wäöüÄÖÜ -]/g, '') + '.txt', e.title + '\n\n' + e.text + '\n\n--- Hinweise ---\n' + an.issues.map((x) => '- ' + x.cat + ': ' + x.msg + (x.i >= 0 ? ' («' + e.text.slice(x.i, x.j) + '»)' : '')).join('\n') + '\n\n--- Raster ---\n' + LEITFRAGEN.map((f) => f.id + '. ' + f.q + ': ' + (vals[f.id] == null ? '–' : vals[f.id])).join('\n') + '\nNote: ' + fmtGrade(gradeRubric(vals).grade)), { kind: 'quiet', icon: 'down' }),
    btn('Drucken', () => window.print(), { kind: 'quiet' })));
  page.append(auftragCard(e, false), kpi, h('div', { class: 'split' }, textCard, issuesCard), rubric);
}

export function render(page, args) {
  const [a, b, c] = args;
  if (a === 'neu') return picker(page, b || '');
  if (a === 'sim') return simStart(page);
  if (a === 'e' && b) { const e = essayById(b); if (!e) return overview(page); if (e.done || c === 'korrektur') { if (!e.done) { e.done = true; save(); } return review(page, e); } return editor(page, e); }
  return overview(page);
}
