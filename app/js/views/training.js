// Endlos-Training, Blitz und Einstufungstest.
import { h, btn, bar, icon, toast } from '../ui.js';
import { state, save } from '../store.js';
import { SKILLS, SKILL, AREAS, PARTS } from '../skills.js';
import { adaptiveWeights, readiness, skillStats, strengths } from '../stats.js';
import { stagePips } from '../progress.js';
import { randomTask, makeTask, keysFor, hasSources, genInfo } from '../engine/sources.js';
import { runSession, summaryCard } from '../runner.js';
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
export function renderAssessment(page) {
  const p = state.profile; const info = assessInfo(p);
  const minM = assessMin(ASSESS_PARTS.mathe), minD = assessMin(ASSESS_PARTS.sprache);
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Einstufungstest'), h('p', null, ASSESS.length + ' Aufgaben aus allen Bereichen, höchstens etwa ' + (minM + minD) + ' Minuten. Du kannst ihn in 2 Teilen machen. Die Lösungen siehst du am Schluss.')));
  const intro = h('div', { class: 'card' }, h('ul', { style: { paddingLeft: '1.2rem' } }, h('li', null, 'Arbeite konzentriert und ohne Hilfe. Für Mathematik brauchst du Papier, Stift und deinen Taschenrechner.'), h('li', null, 'Was du noch nicht hattest, überspringst du. Das ist normal und geht schneller.'), h('li', null, 'Jeder Teil zählt für sich. Du kannst also heute Mathematik und morgen Deutsch machen.'), h('li', null, 'Das Resultat sieht nur du. Es dient dazu, den Lernplan auf dich einzustellen.')),
    info.all ? h('p', { class: 'note warn' }, 'Du hast den Test schon gemacht. Eine Wiederholung zählt zusätzlich in die Auswertung.') : null);
  const host = h('div');
  const start = (keys, label) => {
    intro.hidden = true; const seeds = keys.map(() => newSeed()); const need = Math.ceil(keys.length / 2);
    const sess = runSession(host, { title: label, mode: 'einstufung', limit: keys.length, noFeedback: true, noErrors: true,
      next: (i) => (i < keys.length ? makeTask(keys[i], seeds[i]) : null),
      onDone: (sum, root) => {
        setGuard(null);
        const counts = sum.n >= need;
        if (counts) {
          p.setup.assessedParts = p.setup.assessedParts || {};
          if (keys.some((k) => k[0] === 'M')) p.setup.assessedParts.mathe = true;
          if (keys.some((k) => k[0] === 'D')) p.setup.assessedParts.sprache = true;
          if (p.setup.assessedParts.mathe && p.setup.assessedParts.sprache) p.setup.assessed = true;
          for (const [sid, v] of Object.entries(sum.perSkill)) p.baseline[sid] = { acc: v.max ? v.points / v.max : 0, t: Date.now() }; save();
        }
        const byPart = { sprache: [0, 0], mathe: [0, 0] };
        for (const [sid, v] of Object.entries(sum.perSkill)) { const part = SKILL[sid].part === 'mathe' ? 'mathe' : 'sprache'; byPart[part][0] += v.points; byPart[part][1] += v.max; }
        const card = h('div', { class: 'card' }, h('h2', null, 'Dein Standort'));
        if (!counts) card.append(h('p', { class: 'note warn' }, 'Du hast weniger als ' + need + ' Aufgaben bearbeitet. Der Test zählt so noch nicht als Einstufung.'));
        card.append(h('div', { class: 'kpi' }, byPart.sprache[1] ? h('div', null, h('b', null, Math.round(byPart.sprache[0] / byPart.sprache[1] * 100) + ' %'), h('span', null, 'Deutsch: Punkte erreicht')) : null, byPart.mathe[1] ? h('div', null, h('b', null, Math.round(byPart.mathe[0] / byPart.mathe[1] * 100) + ' %'), h('span', null, 'Mathematik: Punkte erreicht')) : null, h('div', null, h('b', null, fmtDur(sum.sec)), h('span', null, 'Zeit insgesamt'))));
        const weak = Object.entries(sum.perSkill).filter(([, v]) => v.points < v.max).map(([sid]) => SKILL[sid]);
        if (weak.length) { card.append(h('h3', { style: { marginTop: '1rem' } }, 'Damit fängst du an'), h('p', { class: 'muted' }, 'Bei diesen Themen hast du Punkte verloren oder die Aufgabe übersprungen:'));
          const list = h('div'); weak.slice(0, 12).forEach((s) => list.append(h('a', { class: 'skill-row', href: '#/lernen/' + s.id, style: { gridTemplateColumns: '3.2rem 1fr' } }, h('span', { class: 'skill-id' }, s.id), h('span', null, h('b', null, s.name), h('small', null, s.desc))))); card.append(list); }
        else card.append(h('p', { class: 'note ok' }, 'Alles richtig. Übe im Endlos-Training auf Prüfungsniveau und achte auf das Tempo.'));
        const now = assessInfo(p); const open = !now.all && counts ? (now.mathe ? 'sprache' : 'mathe') : null;
        if (open) card.append(h('p', { class: 'note', style: { marginTop: '1rem' } }, h('b', null, 'Teil ' + (open === 'mathe' ? 'Mathematik' : 'Deutsch') + ' fehlt noch. '), 'Mach ihn heute oder morgen, dann ist der Lernplan ganz auf dich eingestellt.'));
        card.append(h('div', { class: 'row', style: { marginTop: '1rem' } }, open ? btn('Teil ' + (open === 'mathe' ? 'Mathematik' : 'Deutsch') + ' jetzt machen', () => { host.innerHTML = ''; start(ASSESS_PARTS[open], 'Einstufung ' + (open === 'mathe' ? 'Mathematik' : 'Deutsch')); }, { kind: 'primary' }) : null, h('a', { class: 'btn' + (open ? '' : ' primary'), href: '#/start' }, 'Zur Startseite'), h('a', { class: 'btn', href: '#/plan' }, 'Lernplan ansehen')));
        root.append(card);
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
