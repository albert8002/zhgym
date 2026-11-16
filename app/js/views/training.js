// Endlos-Training, Blitz und Einstufungstest.
import { h, btn, bar, icon, toast } from '../ui.js';
import { state, save } from '../store.js';
import { SKILLS, SKILL, AREAS, PARTS } from '../skills.js';
import { adaptiveWeights, readiness, skillStats } from '../stats.js';
import { randomTask, makeTask, keysFor, hasSources, genInfo } from '../engine/sources.js';
import { runSession, summaryCard } from '../runner.js';
import { modePicker } from './learn.js';
import { setLeave, setGuard, go } from '../main.js';
import { newSeed, RNG, fmtDur } from '../util.js';
import { confirmBox } from '../ui.js';
import { webTask, WEB_SKILLS } from '../engine/web.js';

const NO_AUTO = new Set(['D21', 'D18', 'M19', 'D30']); // Planen, offene Fragen, Konstruktionen: nicht im schnellen Zufallstraining
export const levelOf = (xp) => { const lvl = Math.floor(Math.sqrt(xp / 150)) + 1; const cur = 150 * (lvl - 1) ** 2, nxt = 150 * lvl ** 2; return { lvl, cur, nxt, frac: (xp - cur) / (nxt - cur) }; };

function scopePicker(sel, onChange) {
  const box = h('div', { class: 'choices grid' });
  AREAS.filter((a) => a.id !== 'd-tech').forEach((a) => { const cb = h('input', { type: 'checkbox', checked: sel.has(a.id) || null, onchange: () => { cb.checked ? sel.add(a.id) : sel.delete(a.id); onChange(); } }); box.append(h('label', { class: 'choice' }, cb, h('span', null, (a.subj === 'D' ? 'Deutsch: ' : 'Mathe: ') + a.name))); });
  return box;
}
const skillsOfAreas = (sel) => SKILLS.filter((s) => sel.has(s.area) && hasSources(s.id) && !NO_AUTO.has(s.id)).map((s) => s.id);
const hasSelf = (t) => t.fields.some((f) => f.type === 'self');

export function renderEndless(page) {
  const p = state.profile; const sel = new Set(p.settings.scope || AREAS.filter((a) => a.id !== 'd-tech' && a.id !== 'd-aufsatz').map((a) => a.id));
  let adaptive = p.settings.adaptive !== false, examOnly = p.settings.examOnly !== false, mode = p.settings.mode;
  const L = levelOf(p.xp);
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Endlos-Training'), h('p', null, 'Unendlich viele Aufgaben auf Prüfungsniveau. Jeder Punkt gibt 10 Erfahrungspunkte.')));
  const setup = h('div', { class: 'card' });
  setup.append(h('div', { class: 'row between' }, h('h3', null, 'Trainingslevel ' + L.lvl), h('span', { class: 'muted small' }, p.xp + ' Erfahrungspunkte, Level ' + (L.lvl + 1) + ' bei ' + L.nxt)), bar(L.frac, 1, '', 'Fortschritt zum nächsten Trainingslevel'));
  setup.append(h('h3', { style: { marginTop: '1.1rem' } }, 'Was willst du üben?'), h('div', { class: 'row', style: { marginBottom: '0.5rem' } },
    btn('Alles', () => { AREAS.forEach((a) => { if (a.id !== 'd-tech') sel.add(a.id); }); redraw(); }, { kind: 'small' }), btn('Nur Deutsch', () => { sel.clear(); AREAS.filter((a) => a.subj === 'D' && a.id !== 'd-tech').forEach((a) => sel.add(a.id)); redraw(); }, { kind: 'small' }), btn('Nur Mathematik', () => { sel.clear(); AREAS.filter((a) => a.subj === 'M').forEach((a) => sel.add(a.id)); redraw(); }, { kind: 'small' })));
  const pickHost = h('div'); setup.append(pickHost);
  const redraw = () => { pickHost.innerHTML = ''; pickHost.append(scopePicker(sel, () => {})); };
  redraw();
  const cbA = h('input', { type: 'checkbox', checked: adaptive || null, onchange: () => { adaptive = cbA.checked; } }), cbE = h('input', { type: 'checkbox', checked: examOnly || null, onchange: () => { examOnly = cbE.checked; } });
  setup.append(h('div', { class: 'stack', style: { marginTop: '0.9rem' } }, h('label', { class: 'choice' }, cbA, h('span', null, h('b', null, 'Schwache Themen häufiger'), h('br'), h('span', { class: 'muted small' }, 'Die App wählt öfter, was du noch nicht sicher kannst und was an der Prüfung viele Punkte gibt.'))), h('label', { class: 'choice' }, cbE, h('span', null, h('b', null, 'Nur Prüfungsniveau'), h('br'), h('span', { class: 'muted small' }, 'Lässt Einstiegsaufgaben weg.'))), modePicker((m) => { mode = m; })));
  const host = h('div');
  const start = () => {
    const skills = skillsOfAreas(sel); if (!skills.length) { toast('Wähle mindestens einen Bereich.', 'bad'); return; }
    p.settings.scope = [...sel]; p.settings.adaptive = adaptive; p.settings.examOnly = examOnly; save();
    setup.hidden = true; page.querySelector('.page-head').hidden = true;
    const sess = runSession(host, { title: 'Endlos-Training', mode: 'endlos', backHref: '#/training',
      next: async () => {
        if (mode === 'web' && p.settings.web) { const ws = skills.filter((s) => WEB_SKILLS.includes(s)); if (ws.length) { try { const t = await webTask(ws[Math.floor(Math.random() * ws.length)], newSeed()); if (t) return t; } catch (e) { console.warn(e); } } }
        const weights = adaptive ? adaptiveWeights(p, skills) : null;
        for (let k = 0; k < 6; k++) { const t = randomTask(skills, newSeed(), { weights, mode: mode === 'web' ? 'mix' : mode, minDiff: examOnly ? 3 : 0 }); if (!hasSelf(t)) return t; }
        return randomTask(skills, newSeed(), { weights, mode: 'mix' });
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
