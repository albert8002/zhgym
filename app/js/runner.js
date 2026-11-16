// Übungslauf: zeigt eine Aufgabe nach der anderen, misst die Zeit, bewertet, erklärt und speichert.
import { h, mathify, btn, icon, toast, bar, speak, stopSpeak } from './ui.js';
import { mountTask, gradeTask } from './engine/task.js';
import { textById } from './engine/sources.js';
import { addAttempt, addError, state, save, noteSet } from './store.js';
import { skillStats, nextStageIn, dailyGoal, STAGES } from './stats.js';
import { roundCells, stagePips, ring, weekStrip, afterProgress, stageChanges } from './progress.js';
import { SKILL } from './skills.js';
import { fmtDur, esc } from './util.js';

const ui = { h, mathify };
const CAUSES = ['Wissen fehlt', 'Flüchtigkeit', 'Auftrag falsch gelesen', 'Zeit zu knapp'];

export function textPanel(textId) {
  const t = textById(textId); if (!t) return null;
  const box = h('div', { class: 'readtext', tabindex: '0', 'aria-label': 'Text: ' + t.title });
  box.append(h('div', { class: 'row between' }, h('h3', null, t.title), state.profile && state.profile.settings.tts ? btn('Vorlesen', () => speak(t.text.join(' ')), { kind: 'small quiet', icon: 'sound' }) : null));
  t.text.forEach((p, i) => box.append(h('p', null, h('span', { class: 'pn' }, String(i + 1)), p)));
  return box;
}

// opts: { title, mode, next(i) → Aufgabe | null, limit, blitz, onDone(summary), backHref, showSkill, review(task, ok) }
export function runSession(root, opts) {
  let i = 0, task = null, ctl = null, t0 = 0, tick = null, phase = 'answer', result = null, cause = '', left = 0;
  const sum = { n: 0, points: 0, max: 0, sec: 0, target: 0, streak: 0, best: 0, perSkill: {}, gains: [] };
  const before = {}; const results = [];
  root.innerHTML = '';
  const head = h('div', { class: 'session-head' });
  const prog = h('div');
  const body = h('div');
  const foot = h('div', { class: 'session-foot' });
  root.append(head, prog, body, foot);

  const stop = () => { clearInterval(tick); tick = null; stopSpeak(); };
  function finish() {
    stop(); document.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis);
    for (const [sid, v] of Object.entries(sum.perSkill)) if (opts.mode === 'lernen' && v.n >= 4) noteSet(sid, v.points >= v.max);
    // Tempo-Gewinn melden (höchstens 1-mal pro Skill und Woche)
    const p = state.profile;
    for (const sid of Object.keys(sum.perSkill)) { const st = skillStats(p, sid); if (st.gain && st.gain.pct >= 0.15 && (!p.seenGain[sid] || Date.now() - p.seenGain[sid] > 6 * 86400000)) { p.seenGain[sid] = Date.now(); sum.gains.push({ skill: SKILL[sid], pct: st.gain.pct, first: st.gain.first, last: st.gain.last }); } }
    sum.stages = stageChanges(before, Object.keys(sum.perSkill)); sum.mode = opts.mode;
    save();
    root.innerHTML = '';
    if (opts.onDone) opts.onDone(sum, root); else root.append(summaryCard(sum, opts));
    if (opts.mode !== 'einstufung' && sum.n) afterProgress();
  }
  function header() {
    head.innerHTML = '';
    head.append(h('div', null, h('strong', null, opts.title || 'Übung'), h('div', { class: 'muted small' }, task ? SKILL[task.skill].id + ' ' + SKILL[task.skill].name + (task.src === 'db' ? ', Datenbank' : task.src === 'shuffle' ? ', Shuffle' : task.src === 'web' ? ', Web (experimentell)' : '') : '')));
    head.append(h('div', { class: 'grow' }));
    if (opts.blitz) head.append(h('div', { class: 'center' }, h('div', { class: 'combo', id: 'combo' }, String(sum.streak)), h('div', { class: 'muted small' }, 'in Folge')));
    head.append(h('div', { class: 'right' }, h('div', { class: 'timer', id: 'timer', 'aria-live': 'off' }, '0:00'), h('div', { class: 'muted small', id: 'target' }, task ? 'Prüfungstempo: ' + fmtDur(task.targetSec) : '')));
    head.append(h('div', { class: 'muted small nowrap' }, (opts.limit ? 'Aufgabe ' + (i + 1) + ' von ' + opts.limit : 'Aufgabe ' + (i + 1)) + ', ' + sum.points + ' P'));
    prog.innerHTML = ''; if (opts.limit && opts.limit <= 40) prog.append(roundCells(opts.limit, opts.noFeedback ? results.map((r) => (r == null ? r : -2)) : results, i));
  }
  // Zeit, in der die App verborgen war (minimiert, anderer Tab), zählt nicht.
  let hidMs = 0, hidAt = null;
  const onVis = () => { if (document.hidden) hidAt = performance.now(); else if (hidAt != null) { hidMs += performance.now() - hidAt; hidAt = null; } };
  document.addEventListener('visibilitychange', onVis);
  const elapsed = () => (performance.now() - t0 - hidMs - (hidAt != null ? performance.now() - hidAt : 0)) / 1000;
  function startTimer() {
    t0 = performance.now(); hidMs = 0; hidAt = document.hidden ? performance.now() : null; stop();
    const el = () => document.getElementById('timer');
    const upd = () => {
      const sec = elapsed(); const e = el(); if (!e) return;
      if (opts.blitz) { left = task.targetSec - sec; e.textContent = fmtDur(Math.max(0, left)); e.classList.toggle('low', left < 10); if (left <= 0 && phase === 'answer') check(true); }
      else { e.textContent = fmtDur(sec); e.classList.toggle('over', sec > task.targetSec); }
    };
    upd(); tick = setInterval(upd, 250);
  }
  async function load() {
    phase = 'loading'; body.innerHTML = '<p class="muted">Aufgabe wird vorbereitet …</p>'; foot.innerHTML = '';
    try { task = await opts.next(i); } catch (e) { console.error(e); task = null; toast('Aufgabe konnte nicht erstellt werden: ' + e.message, 'bad'); }
    if (!task) return finish();
    phase = 'answer'; result = null; cause = '';
    if (!(task.skill in before)) before[task.skill] = skillStats(state.profile, task.skill);
    header(); body.innerHTML = '';
    const card = h('div', { class: 'card' });
    const tp = task.textId ? textPanel(task.textId) : null;
    if (tp) body.append(h('div', { class: 'split' }, tp, card)); else body.append(card);
    if (task.fallback && opts.mode !== 'fehler') card.append(h('p', { class: 'hint' }, 'Für diesen Skill gibt es in der gewählten Quelle keine Aufgaben. Diese Aufgabe stammt aus einer anderen Quelle.'));
    if (task.note) card.append(h('p', { class: 'note warn small', html: task.note }));
    const tEl = h('div'); card.append(tEl);
    ctl = mountTask(task, tEl, ui, {});
    card.append(h('div', { id: 'sol' }));
    buttons(); startTimer();
    setTimeout(() => ctl && ctl.focusFirst(), 30);
  }
  function buttons() {
    foot.innerHTML = '';
    if (phase === 'answer') {
      foot.append(btn(ctl.hasSelf() ? 'Lösung zeigen' : opts.noFeedback ? 'Antwort abgeben' : 'Prüfen', () => check(false), { kind: 'primary big', icon: 'check' }));
      if (!opts.blitz) foot.append(btn('Überspringen', () => { results[i] = -1; i++; if (opts.limit && i >= opts.limit) return finish(); load(); }, { kind: 'quiet' }));
      if (state.profile.settings.tts) foot.append(btn('Vorlesen', () => speak(document.querySelector('.task-prompt') ? document.querySelector('.task-prompt').textContent : ''), { kind: 'quiet', icon: 'sound' }));
    } else {
      foot.append(btn(opts.limit && i + 1 >= opts.limit ? 'Abschliessen' : 'Weiter', next, { kind: 'primary big' }));
    }
    foot.append(h('div', { class: 'grow' }));
    foot.append(btn('Beenden', finish, { kind: 'quiet' }));
    foot.append(h('span', { class: 'muted small' }, phase === 'answer' ? 'Enter = prüfen' : 'Enter = weiter'));
  }
  function check(timeout) {
    if (phase !== 'answer') return;
    const sec = Math.min(elapsed(), task.targetSec * 6 + 120);
    task._sec = sec; stop();
    if (opts.noFeedback && !ctl.hasSelf()) { result = gradeTask(task, ctl.values(), {}); phase = 'done'; next(); return; }
    if (ctl.hasSelf()) { ctl.revealSelf(); phase = 'self'; ctl.lock(); showSolution(); foot.innerHTML = ''; foot.append(btn('Punkte übernehmen', () => { phase = 'answer'; finalize(false); }, { kind: 'primary big', icon: 'check' }), h('span', { class: 'muted small' }, 'Kreuze oben an, was bei dir stimmt.')); return; }
    finalize(timeout);
  }
  function finalize(timeout) {
    result = gradeTask(task, ctl.values(), ctl.overrides());
    ctl.lock(); ctl.show(result); phase = 'done';
    const tEl = document.getElementById('timer'); if (tEl && timeout) tEl.textContent = 'Zeit um';
    showSolution();
    if (opts.blitz) { sum.streak = result.ok ? sum.streak + 1 : 0; sum.best = Math.max(sum.best, sum.streak); const c = document.getElementById('combo'); if (c) c.textContent = String(sum.streak); }
    buttons();
    const nb = foot.querySelector('.primary'); if (nb) nb.focus();
    if (opts.blitz && result.ok) setTimeout(() => { if (phase === 'done') next(); }, 900);
  }
  function showSolution() {
    const sol = document.getElementById('sol'); if (!sol || sol.childElementCount) return;
    const box = h('div', { class: 'solution' }, h('h4', null, 'Lösungsweg'), h('div', { html: mathify(task.solution || '') }));
    sol.append(box);
    if (result && !result.ok) {
      const row = h('div', { class: 'cause' }, h('span', { class: 'small muted' }, 'Fehlerursache (fürs Fehlerheft):'));
      CAUSES.forEach((c) => { const b = h('button', { type: 'button', class: 'btn small', 'aria-pressed': 'false', onclick: () => { cause = c; row.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); b.classList.add('primary'); row.querySelectorAll('button').forEach((x) => { if (x !== b) x.classList.remove('primary'); }); } }, c); row.append(b); });
      sol.append(row);
    }
  }
  function commit() {
    if (!result) return;
    result = gradeTask(task, ctl.values(), opts.noFeedback ? {} : ctl.overrides()); // Häkchen «gleichwertig» können sich geändert haben
    addAttempt({ key: task.key, skill: task.skill, points: result.points, max: result.max, sec: task._sec, mode: opts.mode || 'lernen', src: task.src, seed: task.seed });
    sum.n++; sum.points += result.points; sum.max += result.max; sum.sec += task._sec; sum.target += task.targetSec; results[i] = result.max ? result.points / result.max : 0;
    const ps = (sum.perSkill[task.skill] = sum.perSkill[task.skill] || { n: 0, points: 0, max: 0 }); ps.n++; ps.points += result.points; ps.max += result.max;
    if (result.points < result.max && task.src !== 'web' && !opts.noErrors) addError(task, cause);
    if (opts.review) opts.review(task, result.points >= result.max);
    result = null;
  }
  function next() { if (phase !== 'done') return; commit(); i++; if (opts.limit && i >= opts.limit) return finish(); load(); }
  function onKey(e) {
    if (e.key !== 'Enter' || e.shiftKey || document.querySelector('.overlay')) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea' || (tag === 'button' && !e.target.classList.contains('tok') && !e.target.classList.contains('gap'))) return;
    if (!root.isConnected) { document.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis); stop(); return; }
    e.preventDefault();
    if (phase === 'answer') check(false); else if (phase === 'done') next();
  }
  document.addEventListener('keydown', onKey);
  load();
  return { stop: () => { stop(); document.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', onVis); }, finish };
}

export function summaryCard(sum, opts = {}) {
  const acc = sum.max ? sum.points / sum.max : 0; const ratio = sum.target ? sum.sec / sum.target : 0;
  const card = h('div', { class: 'card' }, h('h2', null, 'Auswertung dieser Runde'));
  if (!sum.n) { card.append(h('p', null, 'Keine Aufgabe gelöst.')); }
  else {
    card.append(h('div', { class: 'kpi' },
      h('div', null, h('b', null, sum.points + ' / ' + sum.max), h('span', null, 'Punkte')),
      h('div', null, h('b', null, Math.round((1 - acc) * 100) + ' %'), h('span', null, 'Fehlerquote')),
      h('div', null, h('b', null, fmtDur(sum.sec / sum.n)), h('span', null, 'Zeit pro Aufgabe (Ziel ' + fmtDur(sum.target / sum.n) + ')')),
      opts.blitz ? h('div', null, h('b', null, String(sum.best)), h('span', null, 'längste Serie')) : h('div', null, h('b', null, ratio <= 1 ? 'im Tempo' : Math.round((ratio - 1) * 100) + ' % zu langsam'), h('span', null, 'verglichen mit dem Prüfungstempo'))));
    const rows = Object.entries(sum.perSkill).map(([sid, v]) => h('tr', null, h('td', null, sid + ' ' + SKILL[sid].name), h('td', { class: 'num' }, v.points + ' / ' + v.max), h('td', null, bar(v.points, v.max, v.points >= v.max ? 'ok' : v.points / v.max < 0.5 ? 'bad' : 'warn'))));
    card.append(h('table', { class: 'list', style: { marginTop: '1rem' } }, h('thead', null, h('tr', null, h('th', null, 'Skill'), h('th', { class: 'num' }, 'Punkte'), h('th', null, ''))), h('tbody', null, rows)));
    sum.gains.forEach((g) => card.append(h('p', { class: 'note ok', style: { marginTop: '0.8rem' } }, h('b', null, 'Schneller geworden: '), g.skill.name + '. Am Anfang ' + fmtDur(g.first) + ' pro Punkt, jetzt ' + fmtDur(g.last) + '. Das sind ' + Math.round(g.pct * 100) + ' % weniger Zeit.')));
    if (sum.stages && sum.stages.length && sum.mode !== 'einstufung') card.append(progressBlock(sum));
  }
  const row = h('div', { class: 'row', style: { marginTop: '1rem' } });
  if (opts.again) row.append(btn('Noch eine Runde', opts.again, { kind: 'primary' }));
  row.append(h('a', { class: 'btn', href: opts.backHref || '#/start' }, opts.backLabel || 'Zur Startseite'));
  card.append(row);
  return card;
}

// Fortschritt nach der Runde: Stufe vorher → nachher, nächster Schritt, Tagesziel, Woche
export function progressBlock(sum) {
  const p = state.profile; const box = h('div', { class: 'progress-block' }, h('h3', { style: { margin: 0 } }, 'Dein Fortschritt'));
  sum.stages.slice(0, 6).forEach((c) => {
    const up = c.to > c.from; const nx = nextStageIn(p, c.sid);
    box.append(h('div', { class: 'stage-change' + (up ? ' up' : '') }, h('b', { style: { minWidth: '13rem' } }, c.sid + ' ' + SKILL[c.sid].name),
      up ? [stagePips(c.from), h('span', { class: 'arrow', 'aria-hidden': 'true' }, '→'), stagePips(c.to), h('span', { class: 'small' }, 'aufgestiegen')] : stagePips(c.to),
      nx && nx.n ? h('span', { class: 'small muted' }, 'Noch etwa ' + nx.n + (nx.n === 1 ? ' richtige Aufgabe' : ' richtige Aufgaben') + ' im Prüfungstempo bis «' + STAGES[nx.to].name + '»') : null));
  });
  const dg = dailyGoal(p);
  box.append(h('div', { class: 'row', style: { gap: '1.2rem', alignItems: 'center', flexWrap: 'wrap' } },
    dg.rest ? h('span', { class: 'small muted' }, 'Heute ist ein freier Tag in deinem Plan. Alles zählt trotzdem.') : h('div', { class: 'today-goal', style: { padding: 0 } }, ring(dg.done, dg.goal, { size: 52 }), h('div', { class: 'small' }, h('b', null, dg.met ? 'Tagesziel erreicht' : 'Heute ' + dg.done + ' von ' + dg.goal + ' Min.'), h('div', { class: 'muted' }, dg.met ? 'Alles Weitere ist ein Bonus.' : 'Noch ' + (dg.goal - dg.done) + ' Min. bis zum Tagesziel.'))),
    weekStrip(p, { text: false })));
  return box;
}
