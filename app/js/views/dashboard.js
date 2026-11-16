// Startseite: Bereitschaft, Tagesplan, Tempo-Gewinn, schwächste Skills.
import { h, btn, bar, ruler, icon } from '../ui.js';
import { state, save, dueErrors } from '../store.js';
import { assessInfo } from './training.js';
import { readiness, buildPlan, minutesInfo, speedGains, strengths, PHASE_TEXT, phaseText, officialGate, skillStats, dailyGoal, courseProgress, nextStageIn, STAGES } from '../stats.js';
import { ring, weekStrip, topicMap, stagePips, nextGoalLine, initRewards } from '../progress.js';
import { PARTS, RULES, SKILL } from '../skills.js';
import { fmtDur, fmtMin, fmtGrade, dayKey, fmtDate } from '../util.js';

export function planList(p, pl, compact) {
  const key = dayKey(); const done = new Set(p.planDone[key] || []);
  const box = h('div', { class: 'stack' });
  const items = [...pl.today, pl.reading];
  if (!pl.today.length) box.append(h('p', { class: 'muted' }, 'Heute ist kein Lerntag in deinem Plan. Lesen zählt trotzdem.'));
  items.forEach((it) => {
    const cb = h('input', { type: 'checkbox', checked: done.has(it.id) || null, 'aria-label': it.label + ' erledigt', onchange: () => { const s = new Set(p.planDone[key] || []); cb.checked ? s.add(it.id) : s.delete(it.id); p.planDone[key] = [...s]; if (it.id === 'lesen') { if (cb.checked) p.reading[key] = Math.max(p.reading[key] || 0, 20); else delete p.reading[key]; } save(); } });
    box.append(h('div', { class: 'row' }, cb, h('div', { class: 'grow' }, h('b', null, it.label), h('div', { class: 'muted small' }, it.min + ' Min.')), it.route && it.route !== 'plan' ? h('a', { class: 'btn small', href: '#/' + it.route }, 'Starten') : null));
  });
  if (pl.focus.length && !compact) box.append(h('p', { class: 'small muted' }, 'Themen dieser Woche: ' + pl.focus.join(', ')));
  return box;
}

export function render(page) {
  const p = state.profile; if (initRewards(p)) save(); const r = readiness(p); const pl = buildPlan(p); const mi = minutesInfo(p); const gate = officialGate(p); const dg = dailyGoal(p, pl);
  const need = RULES.neededPN(p.setup.vn);
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Hallo ' + p.name), h('p', null, 'Woche ' + pl.weekNo + ' von ' + pl.totalWeeks + ', Phase «' + pl.phase + '»: ' + phaseText(pl, p))));

  if (!p.setup.assessed) { const ai = assessInfo(p); const part = ai.mathe ? 'Teil Deutsch' : ai.sprache ? 'Teil Mathematik' : null;
    page.append(h('div', { class: 'note', style: { marginBottom: '1rem' } }, h('div', { class: 'row between' }, h('div', null, h('b', null, (part ? 'Einstufung: ' + part + ' noch offen. ' : 'Einstufungstest noch offen. ')), (part ? 'Danach ist der Lernplan ganz auf dich eingestellt.' : 'Er zeigt, wo du stehst, und stellt den Lernplan auf dich ein. Du kannst ihn in 2 Teilen machen.')), h('a', { class: 'btn primary', href: '#/einstufung' }, part ? part + ' machen' : 'Jetzt einstufen')))); }

  // Bereitschaft
  const ready = h('div', { class: 'card' });
  ready.append(h('div', { class: 'row between' }, h('h2', null, 'So bereit bist du'), h('a', { class: 'small', href: '#/auswertung' }, 'Auswertung ansehen')));
  ready.append(h('div', { class: 'row', style: { alignItems: 'flex-end', gap: '1rem' } }, h('div', { class: 'ready-num' }, Math.round(r.total * 100) + ' %'), h('div', { class: 'muted' }, r.coverage < 0.15 ? 'Noch kaum Daten. Die Zahl wird genauer, je mehr du übst.' : 'geübt: ' + Math.round(r.coverage * 100) + ' % des Stoffs' + (r.pn ? ', geschätzte Prüfungsnote ' + fmtGrade(r.pn) + ' (nötig: ' + fmtGrade(need) + ')' : ''))));
  ready.append(ruler(r.total, { flag: 0.5, flagLabel: gate.open ? 'offizielle Prüfungen offen' : 'ab hier: offizielle Prüfungen' }));
  const parts = h('div', { class: 'cols three', style: { marginTop: '0.6rem' } });
  ['sprache', 'aufsatz', 'mathe'].forEach((k) => { const ps = r.parts[k];
    parts.append(h('div', null, h('div', { class: 'row between' }, h('b', null, PARTS[k].name), h('span', { class: 'muted small' }, Math.round(ps.ready * 100) + ' %' + (ps.est ? ', Note ca. ' + fmtGrade(ps.est) : ''))), ruler(ps.ready, { mini: true, label: PARTS[k].name }), h('div', { class: 'muted small' }, 'zählt ' + Math.round(PARTS[k].weight * 100) + ' % der Prüfungsnote'))); });
  ready.append(parts);
  const ng = nextGoalLine(p); if (ng) ready.append(ng);
  page.append(ready);

  const cols = h('div', { class: 'cols two', style: { marginTop: '1rem' } });
  // Heute
  const goalTxt = dg.rest ? h('div', null, h('b', null, 'Freier Tag'), h('div', { class: 'muted small' }, 'Heute ist kein Lerntag in deinem Plan. Lesen oder eine kurze Blitz-Runde zählen trotzdem.'))
    : h('div', null, h('b', null, dg.met ? 'Tagesziel erreicht' : dg.done + ' von ' + dg.goal + ' Minuten'), h('div', { class: 'muted small' }, dg.met ? 'Super. Alles Weitere heute ist ein Bonus.' : dg.done ? 'Noch ' + (dg.goal - dg.done) + ' Minuten bis zum Tagesziel.' : 'Starte mit dem ersten Punkt unten.'));
  const today = h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h2', null, 'Heute, ' + fmtDate(new Date(), true)), h('a', { class: 'small', href: '#/plan' }, 'Plan ändern')),
    h('div', { class: 'today-goal' }, dg.rest ? null : ring(dg.done, dg.goal, { aria: 'Tagesziel: ' + dg.done + ' von ' + dg.goal + ' Minuten' }), goalTxt),
    planList(p, pl, true),
    h('hr'), h('div', { class: 'row between small', style: { marginBottom: '0.4rem' } }, h('b', null, 'Diese Woche'), h('span', { class: 'muted' }, fmtMin(mi.week) + ' von ' + fmtMin(pl.weekTarget) + ' geplant')), weekStrip(p));
  const leftCol = h('div', { class: 'stack' }, today); cols.append(leftCol);

  const side = h('div', { class: 'stack' });
  // Weiterlernen beim zuletzt geöffneten Thema
  if (p.lastSkill && SKILL[p.lastSkill]) { const ls = SKILL[p.lastSkill]; const st = skillStats(p, ls.id);
    const nx = nextStageIn(p, ls.id);
    side.append(h('div', { class: 'card' }, h('h3', null, 'Weiterlernen'), h('p', null, h('b', { style: { display: 'block' } }, ls.id + ' ' + ls.name), stagePips(st.stage), nx && nx.n ? h('span', { class: 'muted small', style: { display: 'block', marginTop: '0.2rem' } }, 'Noch etwa ' + nx.n + (nx.n === 1 ? ' richtige Aufgabe' : ' richtige Aufgaben') + ' bis «' + STAGES[nx.to].name + '»') : null), h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/lernen/' + ls.id + '/ueben' }, icon('play', 18), 'Übungsrunde'), h('a', { class: 'btn quiet', href: '#/lernen/' + ls.id }, 'Theorie')))); }
  // Tempo-Gewinn (wechselt bei jedem Besuch)
  const gains = speedGains(p);
  if (gains.length) { const g = gains[Math.floor(Date.now() / 3600000) % gains.length];
    side.append(h('div', { class: 'card' }, h('h3', null, 'Du bist schneller geworden'), h('p', null, h('b', null, g.skill.id + ' ' + g.skill.name + ': '), 'Am Anfang brauchtest du ' + fmtDur(g.first) + ' pro Punkt, jetzt ' + fmtDur(g.last) + '. Das sind ', h('mark', null, Math.round(g.pct * 100) + ' % weniger Zeit'), '.'), gains.length > 1 ? h('p', { class: 'muted small' }, 'Schneller bist du auch bei ' + (gains.length - 1) + ' weiteren Skills.') : null)); }
  const due = dueErrors().length;
  if (due) side.append(h('div', { class: 'card' }, h('h3', null, 'Fehlerheft'), h('p', null, due + (due === 1 ? ' Aufgabe ist' : ' Aufgaben sind') + ' heute zur Wiederholung fällig.'), h('a', { class: 'btn primary', href: '#/fehlerheft' }, 'Jetzt wiederholen')));
  const sw = strengths(p, 3);
  if (sw.weak.length) { const c = h('div', { class: 'card' }, h('h3', null, 'Hier holst du am meisten Punkte'));
    sw.weak.forEach((x) => c.append(h('div', { class: 'row', style: { marginBottom: '0.4rem' } }, h('div', { class: 'grow' }, h('b', null, x.skill.id + ' ' + x.skill.name), h('div', { class: 'small' }, stagePips(x.stage), h('div', { class: 'muted' }, Math.round((x.acc || 0) * 100) + ' % der Punkte' + (x.ratio ? (x.ratio > 1.05 ? ', Tempo ausbaufähig' : ', im Tempo') : '')))), h('a', { class: 'btn small', href: '#/lernen/' + x.skill.id }, 'Üben'))));
    side.append(c); }
  else side.append(h('div', { class: 'card' }, h('h3', null, 'So startest du'), h('ol', { style: { paddingLeft: '1.2rem', margin: 0 } }, h('li', null, 'Unter «Lernen» ein Thema wählen und die Theorie lesen.'), h('li', null, 'Die Übungen dazu lösen. 2 fehlerfreie Runden haken das Thema ab.'), h('li', null, 'Im «Endlos-Training» auf Prüfungsniveau weiterüben.'))));
  side.append(h('div', { class: 'card' }, h('h3', null, 'Schnell üben'), h('div', { class: 'row' }, h('a', { class: 'btn', href: '#/blitz' }, icon('bolt', 18), 'Blitz'), h('a', { class: 'btn', href: '#/training' }, icon('loop', 18), 'Endlos'), h('a', { class: 'btn', href: '#/aufsatz' }, icon('pen', 18), 'Aufsatz'))));
  cols.append(side); page.append(cols);
  // Stoffkarte: alle Themen auf einen Blick
  const cp = courseProgress(p);
  leftCol.append(h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h2', null, 'Stoffkarte'), h('span', { class: 'muted small' }, h('b', null, cp.sure + ' von ' + cp.total), ' Themen sicher')),
    h('p', { class: 'muted small' }, 'Jedes Karo ist ein Thema. Je dunkler, desto sicherer; ein gelber Strich heisst «Gemeistert». Klick auf ein Karo öffnet das Thema.'), topicMap(p)));
}
