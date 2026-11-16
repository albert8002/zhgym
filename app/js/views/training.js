// Endlos-Training, Blitz und Einstufungstest.
import { h, btn, bar, icon, toast, mathify } from '../ui.js';
import { state, save, rescoreAttempt } from '../store.js';
import { mountTask, gradeTask } from '../engine/task.js';
import { SKILLS, SKILL, AREAS, PARTS } from '../skills.js';
import { adaptiveWeights, readiness, skillStats, strengths } from '../stats.js';
import { stagePips } from '../progress.js';
import { randomTask, makeTask, keysFor, hasSources, genInfo } from '../engine/sources.js';
import { runSession, summaryCard, textPanel } from '../runner.js';
import { sourceRow, srcAllow, useWeb, webOnly } from '../quellen.js';
import { setLeave, setGuard, go } from '../main.js';
import { newSeed, RNG, fmtDur } from '../util.js';
import { confirmBox } from '../ui.js';
import { webTask, WEB_SKILLS } from '../engine/web.js';

const NO_AUTO = new Set(['D21', 'D18', 'M19', 'D30']); // Planen, offene Fragen, Konstruktionen: nicht im schnellen Zufallstraining
export const levelOf = (xp) => { const lvl = Math.floor(Math.sqrt(xp / 150)) + 1; const cur = 150 * (lvl - 1) ** 2, nxt = 150 * lvl ** 2; return { lvl, cur, nxt, frac: (xp - cur) / (nxt - cur) }; };

// Auswahl für das Endlos-Training: ganze Bereiche oder einzelne Themen
const eligible = (id) => SKILL[id] && SKILL[id].area !== 'd-tech' && hasSources(id) && !NO_AUTO.has(id);
const areaSkills = (aid) => SKILLS.filter((s) => s.area === aid && eligible(s.id)).map((s) => s.id);
const pickAreas = () => AREAS.filter((a) => areaSkills(a.id).length); // hängt von den verwendeten Paketen ab
const defaultAreas = () => pickAreas().filter((a) => a.id !== 'd-aufsatz').map((a) => a.id);
function initialScope(p) {
  if (Array.isArray(p.settings.scopeSkills)) { const ids = p.settings.scopeSkills.filter(eligible); if (ids.length) return new Set(ids); }
  return new Set((p.settings.scope || defaultAreas()).flatMap(areaSkills)); // ältere Profile: nur Bereiche gespeichert
}
function scopePicker(sel, onChange) {
  const p = state.profile; const box = h('div', { class: 'scope' }); const open = new Set(); const stage = {};
  const stageOf = (id) => (stage[id] ??= skillStats(p, id).stage);
  const countIn = (ids) => ids.filter((id) => sel.has(id)).length;
  const openPartial = () => pickAreas().forEach((a) => { const ids = areaSkills(a.id), n = countIn(ids); if (n > 0 && n < ids.length) open.add(a.id); });
  openPartial();
  const draw = () => {
    const focusKey = document.activeElement && box.contains(document.activeElement) ? document.activeElement.dataset.k : null;
    box.innerHTML = '';
    pickAreas().forEach((a) => {
      const ids = areaSkills(a.id), n = countIn(ids), isOpen = open.has(a.id), tid = 'scope-' + a.id;
      const cb = h('input', { type: 'checkbox', 'data-k': 'a:' + a.id, checked: n === ids.length || null, onchange: () => { ids.forEach((id) => (cb.checked ? sel.add(id) : sel.delete(id))); changed(); } });
      cb.indeterminate = n > 0 && n < ids.length;
      const toggle = h('button', { type: 'button', class: 'btn small quiet', 'data-k': 'x:' + a.id, 'aria-expanded': String(isOpen), 'aria-controls': tid, onclick: () => { if (isOpen) open.delete(a.id); else open.add(a.id); draw(); } }, isOpen ? 'Themen ausblenden' : 'Themen wählen');
      const item = h('div', { class: 'scope-area' + (n ? ' on' : '') },
        h('div', { class: 'scope-head' }, h('label', { class: 'scope-name' }, cb, h('span', null, h('b', null, (a.subj === 'D' ? 'Deutsch: ' : 'Mathematik: ') + a.name), h('small', null, n + ' von ' + ids.length + ' Themen'))), toggle));
      if (isOpen) item.append(h('div', { class: 'scope-topics', id: tid }, ids.map((id) => {
        const c = h('input', { type: 'checkbox', 'data-k': 't:' + id, checked: sel.has(id) || null, onchange: () => { if (c.checked) sel.add(id); else sel.delete(id); changed(); } });
        return h('label', { class: 'choice' }, c, h('span', null, id + ' ' + SKILL[id].name), h('span', { class: 'pts' }, stagePips(stageOf(id))));
      })));
      box.append(item);
    });
    if (focusKey) { const el = box.querySelector('[data-k="' + focusKey + '"]'); if (el) el.focus(); }
  };
  const changed = () => { onChange(); draw(); };
  draw();
  return { el: box, redraw: () => { openPartial(); draw(); } };
}
const hasSelf = (t) => t.fields.some((f) => f.type === 'self');

export function renderEndless(page) {
  const p = state.profile; const sel = initialScope(p);
  let adaptive = p.settings.adaptive !== false, examOnly = p.settings.examOnly !== false;
  const L = levelOf(p.xp);
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Endlos-Training'), h('p', null, 'Unendlich viele Aufgaben auf Prüfungsniveau. Jeder Punkt gibt 10 Erfahrungspunkte.')));
  const setup = h('div', { class: 'card' });
  setup.append(h('div', { class: 'row between' }, h('h3', null, 'Trainingslevel ' + L.lvl), h('span', { class: 'muted small' }, p.xp + ' Erfahrungspunkte, Level ' + (L.lvl + 1) + ' bei ' + L.nxt)), bar(L.frac, 1, '', 'Fortschritt zum nächsten Trainingslevel'));
  const weak = strengths(p, 5).weak.map((x) => x.id).filter(eligible);
  const count = h('span', { class: 'muted small', 'aria-live': 'polite' });
  const setCount = () => { count.textContent = sel.size === 1 ? '1 Thema gewählt' : sel.size + ' Themen gewählt'; };
  const preset = (ids) => { sel.clear(); ids.forEach((id) => sel.add(id)); setCount(); picker.redraw(); };
  const allOf = (subj) => pickAreas().filter((a) => !subj || a.subj === subj).flatMap((a) => areaSkills(a.id));
  setup.append(h('h3', { style: { marginTop: '1.1rem' } }, 'Was willst du üben?'),
    h('p', { class: 'hint' }, 'Kreuze ganze Bereiche an. Mit «Themen wählen» wählst du einzelne Themen.'),
    h('div', { class: 'row', style: { marginBottom: '0.6rem' } },
      btn('Alles', () => preset(allOf()), { kind: 'small' }), btn('Nur Deutsch', () => preset(allOf('D')), { kind: 'small' }), btn('Nur Mathematik', () => preset(allOf('M')), { kind: 'small' }),
      weak.length ? btn('Meine 5 schwächsten Themen', () => preset(weak), { kind: 'small' }) : null,
      btn('Keine', () => preset([]), { kind: 'small quiet' }), count));
  const picker = scopePicker(sel, setCount); setCount();
  setup.append(picker.el);
  const cbA = h('input', { type: 'checkbox', checked: adaptive || null, onchange: () => { adaptive = cbA.checked; } }), cbE = h('input', { type: 'checkbox', checked: examOnly || null, onchange: () => { examOnly = cbE.checked; } });
  setup.append(h('div', { class: 'stack', style: { marginTop: '0.9rem' } }, h('label', { class: 'choice' }, cbA, h('span', null, h('b', null, 'Schwache Themen häufiger'), h('br'), h('span', { class: 'muted small' }, 'Die App wählt öfter, was du noch nicht sicher kannst und was an der Prüfung viele Punkte gibt.'))), h('label', { class: 'choice' }, cbE, h('span', null, h('b', null, 'Nur Prüfungsniveau'), h('br'), h('span', { class: 'muted small' }, 'Lässt Einstiegsaufgaben weg.'))), sourceRow({ skills: () => [...sel].filter(eligible), onChange: (r) => { if (r.packsChanged) { picker.redraw(); setCount(); } } })));
  const host = h('div');
  const start = () => {
    const skills = [...sel].filter(eligible); if (!skills.length) { toast('Wähle mindestens ein Thema.', 'bad'); return; }
    p.settings.scopeSkills = skills; p.settings.adaptive = adaptive; p.settings.examOnly = examOnly; save();
    setup.hidden = true; page.querySelector('.page-head').hidden = true;
    const sess = runSession(host, { title: 'Endlos-Training', mode: 'endlos', backHref: '#/training',
      next: async () => {
        const ws = skills.filter((s) => WEB_SKILLS.includes(s));
        if (ws.length) { const wsk = ws[Math.floor(Math.random() * ws.length)]; if (useWeb(wsk)) { try { const t = await webTask(wsk, newSeed()); if (t) return t; } catch (e) { console.warn(e); } } }
        const weights = adaptive ? adaptiveWeights(p, skills) : null;
        const fix = (t) => { if (webOnly()) t.fallback = false; return t; };
        for (let k = 0; k < 6; k++) { const t = randomTask(skills, newSeed(), { weights, mode: srcAllow(), minDiff: examOnly ? 3 : 0 }); if (!hasSelf(t)) return fix(t); }
        return fix(randomTask(skills, newSeed(), { weights, mode: srcAllow() }));
      },
      onDone: (sum, root) => { root.append(summaryCard(sum, { again: () => go('#/training'), backHref: '#/start' })); const L2 = levelOf(p.xp); if (L2.lvl > L.lvl) root.prepend(h('p', { class: 'note ok' }, h('b', null, 'Trainingslevel ' + L2.lvl + ' erreicht. '), 'Weiter so.')); } });
    setLeave(() => sess.stop());
  };
  setup.append(h('div', { class: 'row', style: { marginTop: '1rem' } }, btn('Training starten', start, { kind: 'primary big', icon: 'play' })));
  page.append(setup, host);
}

export function renderBlitz(page) {
  const p = state.profile; let scope = p.settings.blitzScope || 'beide';
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Blitz'), h('p', null, 'Kurze Aufgaben im Prüfungstempo. Die Uhr läuft rückwärts. Wie lang wird deine Serie?')));
  const setup = h('div', { class: 'card' });
  const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Fach' });
  [['beide', 'Deutsch und Mathematik'], ['D', 'Nur Deutsch'], ['M', 'Nur Mathematik']].forEach(([v, t]) => seg.append(h('button', { type: 'button', 'aria-pressed': String(v === scope), onclick: (e) => { scope = v; seg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget))); } }, t)));
  setup.append(h('div', { class: 'kpi', style: { marginBottom: '1rem' } }, h('div', null, h('b', null, String(p.blitz.best || 0)), h('span', null, 'längste Serie bisher')), h('div', null, h('b', null, String(p.blitz.points || 0)), h('span', null, 'meiste Punkte in einer Runde'))), h('div', { class: 'form-row' }, h('label', null, 'Fach'), seg),
    h('p', { class: 'hint' }, 'Zeit pro Aufgabe = Zeit, die du an der Prüfung dafür hast (Deutsch 36 Sekunden pro Punkt, Mathematik rund 2.4 Minuten pro Punkt). Läuft die Zeit ab, zählt die Aufgabe als falsch.'));
  const host = h('div');
  const start = () => {
    p.settings.blitzScope = scope; save();
    const skills = SKILLS.filter((s) => (scope === 'beide' || s.subj === scope) && hasSources(s.id) && !NO_AUTO.has(s.id) && keysFor(s.id, 'mix').keys.some((k) => genInfo(k).quick)).map((s) => s.id);
    setup.hidden = true;
    const sess = runSession(host, { title: 'Blitz', mode: 'blitz', blitz: true, backHref: '#/blitz',
      next: () => { for (let k = 0; k < 8; k++) { const t = randomTask(skills, newSeed(), { quick: true, mode: 'mix' }); if (t.quick && !hasSelf(t)) return t; } return randomTask(skills, newSeed(), { quick: true }); },
      onDone: (sum, root) => { if (sum.best > (p.blitz.best || 0)) { p.blitz.best = sum.best; root.append(h('p', { class: 'note ok' }, h('b', null, 'Neuer Rekord: '), sum.best + ' richtige Aufgaben in Folge.')); } if (sum.points > (p.blitz.points || 0)) p.blitz.points = sum.points; save(); root.append(summaryCard(sum, { blitz: true, again: () => go('#/blitz'), backHref: '#/start' })); } });
    setLeave(() => sess.stop());
  };
  setup.append(btn('Blitz starten', start, { kind: 'primary big', icon: 'bolt' }));
  page.append(setup, host);
}

// ---------- Einstufungstest ----------
const ASSESS = ['M1.bruchsumme', 'M2.regel', 'M4.vereinfachen', 'M5.kuerzen', 'M6.klammer', 'M8.aufstellen', 'M10.einheit', 'M11.aenderung', 'M12.dreisatz', 'M15.zweistufig', 'M16.dreieck', 'M17.formel', 'M18.pythagoras', 'M22.grund', 'M20.spiegeln', 'M3.kgv',
  'D1.wort', 'D3.umformen', 'D4.bestimmen', 'D6.setzen', 'D7.objekt', 'D8.verbinden', 'D10.familie', 'D11.antonym', 'D14.komma', 'D15.gross', 'D15.dasdass', 'D16.aussagen', 'D13.zuordnen'];
// Zeitbedarf im Prüfungstempo, auf 5 Minuten gerundet (wer etwas nicht kann, überspringt und ist schneller)
const assessMin = (keys) => Math.max(5, Math.round(keys.reduce((a, k) => { try { return a + makeTask(k, 7).targetSec; } catch (e) { return a + 90; } }, 0) / 300) * 5);
export const ASSESS_PARTS = { mathe: ASSESS.filter((k) => k[0] === 'M'), sprache: ASSESS.filter((k) => k[0] === 'D') };
export function assessInfo(p) { const done = (p.setup && p.setup.assessedParts) || {}; const all = !!(p.setup && p.setup.assessed); return { mathe: all || !!done.mathe, sprache: all || !!done.sprache, all }; }
// Punkte je Thema: selbst als richtig gewertet = volle Punkte, übersprungen = 0 von den möglichen Punkten.
const entryPts = (e) => (e.skipped ? 0 : e.own ? e.result.max : e.result.points);
const entryMax = (e) => (e.skipped ? e.task.points : e.result.max);
function entryState(e) { if (e.skipped) return 'skip'; if (e.own) return 'own'; if (e.result.points >= e.result.max) return 'ok'; return e.result.points > 0 ? 'part' : 'bad'; }
function assessPerSkill(log) {
  const m = {};
  for (const e of log) { const v = (m[e.task.skill] = m[e.task.skill] || { points: 0, max: 0, n: 0, skipped: 0 }); v.points += entryPts(e); v.max += entryMax(e); v.n++; if (e.skipped) v.skipped++; }
  return m;
}
const ST = { ok: ['Richtig', 'ok', '✓'], part: ['Teilweise', 'warn', '◐'], bad: ['Falsch', 'bad', '✗'], skip: ['Übersprungen', '', '–'], own: ['Selbst als richtig gewertet', 'ink', '✓'] };
// Auswertung am Schluss: jede Aufgabe mit Antwort, Markierung und Lösung. Falsche Antworten lassen sich selbst als richtig werten.
function reviewCard(log, onChange) {
  const card = h('div', { class: 'card review', id: 'rev-list', tabindex: '-1' }, h('h2', null, 'Deine Antworten'),
    h('p', { class: 'muted' }, 'Jede Aufgabe mit deiner Antwort und der Lösung. Aufgaben mit Fehlern sind aufgeklappt. Stimmt eine Antwort trotzdem, zum Beispiel anders formuliert, kannst du sie als richtig werten. Entscheide ehrlich: Der Lernplan richtet sich danach.'));
  const nav = h('div', { class: 'rev-nav', role: 'list', 'aria-label': 'Übersicht der Aufgaben' }); const list = h('div', { class: 'rev-list' });
  card.append(nav, list);
  log.forEach((e, k) => {
    const sid = e.task.skill; const s = SKILL[sid]; const n = k + 1;
    const det = h('details', { class: 'rev-item', id: 'rev-' + n });
    const tagEl = h('span', { class: 'tag' }); const ptsEl = h('span', { class: 'rev-p small nowrap' });
    const chip = h('button', { type: 'button', class: 'rev-chip', onclick: () => { det.open = true; det.scrollIntoView({ behavior: 'smooth', block: 'start' }); det.querySelector('summary').focus({ preventScroll: true }); } });
    nav.append(h('span', { role: 'listitem' }, chip));
    const head = () => {
      const st = entryState(e); const [label, cls, sym] = ST[st];
      const slip = !e.skipped && !e.own && e.result.fields.some((r) => r.slip);
      tagEl.className = 'tag' + (cls ? ' ' + cls : ''); tagEl.textContent = st === 'part' ? 'Teilweise' : label + (slip ? ', kleiner Fehler' : '');
      ptsEl.textContent = entryPts(e) + ' / ' + entryMax(e) + ' P';
      det.className = 'rev-item st-' + st;
      chip.className = 'rev-chip st-' + st; chip.textContent = n + ' ' + sym; chip.setAttribute('aria-label', 'Aufgabe ' + n + ': ' + label);
    };
    det.append(h('summary', null, h('span', { class: 'rev-n' }, String(n)), h('span', { class: 'rev-t' }, h('b', null, s.id + ' ' + s.name), h('small', { class: 'muted' }, e.task.title || '')), tagEl, ptsEl));
    const body = h('div', { class: 'rev-body' }); det.append(body);
    let mounted = false;
    const mountBody = () => {
      if (mounted) return; mounted = true;
      if (e.task.textId) { const tp = textPanel(e.task.textId); if (tp) body.append(h('details', { class: 'rev-text' }, h('summary', null, 'Text zur Aufgabe anzeigen'), tp)); }
      const tEl = h('div'); body.append(tEl);
      const c = mountTask(e.task, tEl, { h, mathify }, {});
      if (!e.skipped) c.setValues(e.values);
      c.lock(); if (c.hasSelf()) c.revealSelf();
      tEl.querySelectorAll('input,textarea').forEach((x) => { x.disabled = true; });
      c.show(e.skipped ? gradeTask(e.task, {}, {}) : e.result, undefined, { noOverride: true });
      body.append(h('div', { class: 'solution' }, h('h4', null, 'Lösungsweg'), h('div', { html: mathify(e.task.solution || '') })));
      if (e.skipped) body.append(h('p', { class: 'note' }, 'Übersprungen. Die Aufgabe zählt mit 0 Punkten.'));
      else if (e.result.points < e.result.max) {
        const sw = h('input', { type: 'checkbox', role: 'switch', class: 'switch', checked: e.own || null, onchange: () => { e.own = sw.checked; rescoreAttempt(e.rec, e.own ? e.result.max : e.result.points, e.own); head(); onChange(); toast(e.own ? 'Aufgabe ' + n + ' zählt jetzt als richtig.' : 'Aufgabe ' + n + ' zählt wieder wie bewertet.', 'ok'); } });
        body.append(h('label', { class: 'switch-row rev-own' }, h('span', null, h('b', null, 'Als richtig werten'), h('small', { class: 'muted', style: { display: 'block' } }, 'Nur wenn deine Antwort stimmt, auch wenn sie anders aussieht als die Lösung. ' + (e.result.max === 1 ? 'Gibt dann 1 P.' : 'Gibt dann alle ' + e.result.max + ' P.'))), sw));
      }
    };
    det.addEventListener('toggle', () => { if (det.open) mountBody(); });
    head(); list.append(det);
    if (entryState(e) !== 'ok') { det.open = true; mountBody(); }
  });
  return card;
}

export function renderAssessment(page) {
  const p = state.profile; const info = assessInfo(p);
  const minM = assessMin(ASSESS_PARTS.mathe), minD = assessMin(ASSESS_PARTS.sprache);
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Einstufungstest'), h('p', null, ASSESS.length + ' Aufgaben aus allen Bereichen, höchstens etwa ' + (minM + minD) + ' Minuten. Du kannst ihn in 2 Teilen machen. Am Schluss siehst du jede Aufgabe mit deiner Antwort und der Lösung.')));
  const intro = h('div', { class: 'card' }, h('ul', { style: { paddingLeft: '1.2rem' } }, h('li', null, 'Arbeite konzentriert und ohne Hilfe. Für Mathematik brauchst du Papier, Stift und deinen Taschenrechner.'), h('li', null, 'Was du noch nicht hattest, überspringst du. Das ist normal und geht schneller.'), h('li', null, 'Jeder Teil zählt für sich. Du kannst also heute Mathematik und morgen Deutsch machen.'), h('li', null, 'Am Schluss siehst du, wo du Fehler gemacht hast. Stimmt eine Antwort trotzdem (zum Beispiel anders formuliert), wertest du sie selbst als richtig.'), h('li', null, 'Das Resultat sieht nur du. Es dient dazu, den Lernplan auf dich einzustellen.')),
    info.all ? h('p', { class: 'note warn' }, 'Du hast den Test schon gemacht. Eine Wiederholung zählt zusätzlich in die Auswertung.') : null);
  const host = h('div');
  const start = (keys, label) => {
    intro.hidden = true; const seeds = keys.map(() => newSeed()); const need = Math.ceil(keys.length / 2);
    const sess = runSession(host, { title: label, mode: 'einstufung', limit: keys.length, noFeedback: true, noErrors: true, keepLog: true,
      next: (i) => (i < keys.length ? makeTask(keys[i], seeds[i]) : null),
      onDone: (sum, root) => {
        setGuard(null);
        const log = sum.log; const counts = log.filter((e) => !e.skipped).length >= need;
        const saveBase = () => { if (!counts) return; for (const [sid, v] of Object.entries(assessPerSkill(log))) p.baseline[sid] = { acc: v.max ? v.points / v.max : 0, t: Date.now() }; save(); };
        if (counts) {
          p.setup.assessedParts = p.setup.assessedParts || {};
          if (keys.some((k) => k[0] === 'M')) p.setup.assessedParts.mathe = true;
          if (keys.some((k) => k[0] === 'D')) p.setup.assessedParts.sprache = true;
          if (p.setup.assessedParts.mathe && p.setup.assessedParts.sprache) p.setup.assessed = true;
          saveBase();
        }
        const box = h('div');
        const draw = () => {
          const per = assessPerSkill(log); const byPart = { sprache: [0, 0], mathe: [0, 0] };
          for (const [sid, v] of Object.entries(per)) { const part = SKILL[sid].part === 'mathe' ? 'mathe' : 'sprache'; byPart[part][0] += v.points; byPart[part][1] += v.max; }
          const cnt = { ok: 0, part: 0, bad: 0, skip: 0, own: 0 }; log.forEach((e) => cnt[entryState(e)]++);
          const card = h('div', { class: 'card' }, h('h2', null, 'Dein Standort'));
          if (!counts) card.append(h('p', { class: 'note warn' }, 'Du hast weniger als ' + need + ' Aufgaben bearbeitet. Der Test zählt so noch nicht als Einstufung.'));
          const pct = (x) => Math.round(x[0] / x[1] * 100) + ' %';
          card.append(h('div', { class: 'kpi' }, byPart.sprache[1] ? h('div', null, h('b', null, pct(byPart.sprache)), h('span', null, 'Deutsch: Punkte erreicht')) : null, byPart.mathe[1] ? h('div', null, h('b', null, pct(byPart.mathe)), h('span', null, 'Mathematik: Punkte erreicht')) : null, h('div', null, h('b', null, fmtDur(sum.sec)), h('span', null, 'Zeit insgesamt'))));
          const bits = [cnt.ok + ' richtig', cnt.part + ' teilweise', cnt.bad + ' falsch', cnt.skip + ' übersprungen'];
          card.append(h('p', { class: 'muted', style: { marginTop: '0.6rem' } }, log.length + ' Aufgaben: ' + bits.join(', ') + '.' + (cnt.own ? ' ' + cnt.own + (cnt.own === 1 ? ' Antwort hast' : ' Antworten hast') + ' du selbst als richtig gewertet.' : '') + (cnt.skip ? ' Übersprungene Aufgaben zählen mit 0 Punkten.' : '')));
          const weak = Object.entries(per).filter(([, v]) => v.points < v.max).sort((a, b) => a[1].points / a[1].max - b[1].points / b[1].max);
          if (weak.length) {
            card.append(h('h3', { style: { marginTop: '1rem' } }, 'Damit fängst du an'), h('p', { class: 'muted' }, 'Bei diesen Themen hast du Punkte verloren oder die Aufgabe übersprungen. Das schwächste Thema steht zuoberst.'));
            const list = h('div'); weak.slice(0, 12).forEach(([sid, v]) => { const s = SKILL[sid]; list.append(h('a', { class: 'skill-row', href: '#/lernen/' + s.id, style: { gridTemplateColumns: '3.2rem 1fr auto' } }, h('span', { class: 'skill-id' }, s.id), h('span', null, h('b', null, s.name), h('small', null, s.desc)), h('span', { class: 'small muted nowrap' }, v.skipped === v.n ? 'übersprungen' : v.points + ' von ' + v.max + ' P'))); }); card.append(list);
          } else card.append(h('p', { class: 'note ok' }, 'Alles richtig. Übe im Endlos-Training auf Prüfungsniveau und achte auf das Tempo.'));
          const now = assessInfo(p); const open = !now.all && counts ? (now.mathe ? 'sprache' : 'mathe') : null;
          if (open) card.append(h('p', { class: 'note', style: { marginTop: '1rem' } }, h('b', null, 'Teil ' + (open === 'mathe' ? 'Mathematik' : 'Deutsch') + ' fehlt noch. '), 'Mach ihn heute oder morgen, dann ist der Lernplan ganz auf dich eingestellt.'));
          card.append(h('div', { class: 'row', style: { marginTop: '1rem' } }, open ? btn('Teil ' + (open === 'mathe' ? 'Mathematik' : 'Deutsch') + ' jetzt machen', () => { host.innerHTML = ''; start(ASSESS_PARTS[open], 'Einstufung ' + (open === 'mathe' ? 'Mathematik' : 'Deutsch')); }, { kind: 'primary' }) : null, btn('Antworten ansehen', () => { const r = document.getElementById('rev-list'); if (r) { r.scrollIntoView({ behavior: 'smooth', block: 'start' }); r.focus({ preventScroll: true }); } }), h('a', { class: 'btn' + (open ? '' : ' primary'), href: '#/start' }, 'Zur Startseite'), h('a', { class: 'btn', href: '#/plan' }, 'Lernplan ansehen')));
          box.replaceChildren(card);
        };
        draw();
        root.append(box, reviewCard(log, () => { saveBase(); draw(); }));
      } });
    setLeave(() => sess.stop());
    setGuard(() => confirmBox('Test abbrechen?', 'Dieser Teil ist noch nicht fertig. Wenn du die Seite verlässt, zählt er nicht.', 'Abbrechen und verlassen', 'Weitermachen', true));
  };
  const tag = (ok) => (ok ? h('span', { class: 'tag ok' }, 'erledigt') : null);
  intro.append(h('div', { class: 'row', style: { marginTop: '0.8rem', flexWrap: 'wrap' } },
    !info.mathe && !info.sprache ? btn('Ganzer Test (' + ASSESS.length + ' Aufgaben)', () => start(ASSESS, 'Einstufungstest'), { kind: 'primary big', icon: 'play' }) : null,
    h('span', { class: 'row' }, btn('Nur Mathematik (' + ASSESS_PARTS.mathe.length + ' Aufgaben, bis ' + minM + ' Min.)', () => start(ASSESS_PARTS.mathe, 'Einstufung Mathematik'), { kind: info.sprache && !info.mathe ? 'primary' : '' }), tag(info.mathe)),
    h('span', { class: 'row' }, btn('Nur Deutsch (' + ASSESS_PARTS.sprache.length + ' Aufgaben, bis ' + minD + ' Min.)', () => start(ASSESS_PARTS.sprache, 'Einstufung Deutsch'), { kind: info.mathe && !info.sprache ? 'primary' : '' }), tag(info.sprache)),
    h('a', { class: 'btn quiet', href: '#/start', onclick: () => { p.setup.assessLater = true; save(); } }, 'Später')));
  page.append(intro, host);
}
