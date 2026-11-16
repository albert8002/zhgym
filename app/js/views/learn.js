// Lernen: Themenliste, Theorie und Übungen pro Skill.
import { h, btn, bar, tabs, mathify, icon, barsChart, toast } from '../ui.js';
import { state, save } from '../store.js';
import { SKILLS, SKILL, AREAS, PARTS } from '../skills.js';
import { skillStats, buildPlan, nextStageIn, STAGES, SURE } from '../stats.js';
import { stagePips } from '../progress.js';
import { keysFor, makeTask, hasSources, genInfo } from '../engine/sources.js';
import { runSession, summaryCard } from '../runner.js';
import { THEORY } from '../../content/theorie.js';
import { setLeave, refresh } from '../main.js';
import { newSeed, fmtDur, dayKey, addDays, fmtDateShort, RNG } from '../util.js';
import { webTask, WEB_SKILLS } from '../engine/web.js';

const LEVEL = { neu: ['neu', ''], schwach: ['schwach', 'bad'], mittel: ['mittel', 'warn'], stark: ['stark', 'ok'] };
export const MODES = [['mix', 'Mix'], ['gen', 'Generator'], ['db', 'Datenbank'], ['shuffle', 'Shuffle'], ['web', 'Web (experimentell)']];
export const MODE_HELP = { mix: 'Alle Quellen gemischt.', gen: 'Vom Computer berechnete Aufgaben: unendlich viele.', db: 'Geprüfte Aufgaben aus der Datenbank (erweiterbar unter «Inhalte»).', shuffle: 'Datenbank-Aufgaben mit neuen Zahlen und anderer Formulierung.', web: 'Sätze und Zahlen aus dem Internet (Wikipedia, Wikidata). Kann Fehler enthalten.' };

export function modePicker(onPick) {
  const p = state.profile; const sel = h('select', { 'aria-label': 'Aufgabenquelle', onchange: () => { if (sel.value === 'web' && !p.settings.web) { toast('Schalte den Web-Modus zuerst unter «Einstellungen» ein.', 'bad'); sel.value = p.settings.mode; return; } p.settings.mode = sel.value; save(); hint.textContent = MODE_HELP[sel.value]; if (onPick) onPick(sel.value); } });
  MODES.forEach(([v, t]) => sel.append(h('option', { value: v, selected: v === p.settings.mode || null }, t)));
  const hint = h('span', { class: 'hint' }, MODE_HELP[p.settings.mode] || '');
  return h('div', { class: 'row' }, h('label', { class: 'small' }, 'Quelle: '), sel, hint);
}

// Nächste Aufgabe für einen Skill: Schwierigkeit steigt innerhalb der Runde
export async function nextTaskFor(skill, i, n, mode) {
  if (mode === 'web' && state.profile.settings.web && WEB_SKILLS.includes(skill)) { try { const t = await webTask(skill, newSeed()); if (t) return t; } catch (e) { console.warn(e); } }
  const { keys, fallback } = keysFor(skill, mode === 'web' ? 'mix' : mode);
  const sorted = keys.slice().sort((a, b) => genInfo(a).diff - genInfo(b).diff);
  const r = new RNG(newSeed());
  // erstes Drittel leichter, dann alles, am Schluss Prüfungsniveau
  const frac = n > 1 ? i / (n - 1) : 1; let pool = sorted;
  if (sorted.length >= 3) { const hard = sorted.filter((k) => genInfo(k).diff >= 3), easy = sorted.filter((k) => genInfo(k).diff <= 2); if (frac < 0.34 && easy.length) pool = easy; else if (frac > 0.66 && hard.length) pool = hard; }
  const t = makeTask(r.pick(pool), newSeed()); t.fallback = fallback && mode !== 'web'; return t;
}

function index(page, subj) {
  const p = state.profile;
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Lernen'), h('p', null, 'Jedes Thema hat Theorie und Übungen. Mit jeder Übung steigt das Thema eine Stufe: Begonnen, Vertraut, Sicher, Gemeistert.')));
  page.append(tabs([{ id: 'D', label: 'Deutsch (' + SKILLS.filter((s) => s.subj === 'D').length + ' Themen)' }, { id: 'M', label: 'Mathematik (' + SKILLS.filter((s) => s.subj === 'M').length + ' Themen)' }], subj, (id) => { location.hash = '#/lernen/' + id; }));
  AREAS.filter((a) => a.subj === subj).forEach((a) => {
    const list = SKILLS.filter((s) => s.area === a.id); const sts = list.map((s) => skillStats(p, s.id)); const sure = sts.filter((x) => x.stage >= SURE).length;
    const card = h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', null, a.name), h('span', { class: 'small muted' }, sure + ' von ' + list.length + ' sicher')));
    list.forEach((s, j) => { const st = sts[j];
      card.append(h('a', { class: 'skill-row', href: '#/lernen/' + s.id }, h('span', { class: 'skill-id' }, s.id), h('span', null, h('b', null, s.name), h('small', null, s.desc)),
        h('span', { class: 'muted small' }, s.ref ? 'Prüfung: ' + s.ref : ''),
        h('span', { class: 'right' }, stagePips(st.stage)))); });
    page.append(card);
  });
}

function readingLog(box) {
  const p = state.profile; const key = dayKey();
  const inp = h('input', { type: 'number', min: '0', max: '300', step: '5', value: String(p.reading[key] || 0), style: { width: '6rem' }, 'aria-label': 'Heute gelesene Minuten' });
  const items = []; for (let i = 13; i >= 0; i--) { const d = addDays(new Date(), -i); items.push({ x: fmtDateShort(d).replace(/\.$/, ''), y: p.reading[dayKey(d)] || 0 }); }
  box.append(h('div', { class: 'card' }, h('h3', null, 'Lesetagebuch'), h('p', null, 'Trage ein, wie lange du heute gelesen hast (Buch oder Zeitung, kein Handy).'),
    h('div', { class: 'row' }, inp, h('span', null, 'Minuten'), btn('Speichern', () => { const v = Math.max(0, Math.min(300, Number(inp.value) || 0)); if (v) p.reading[key] = v; else delete p.reading[key]; save(); refresh(); }, { kind: 'primary' })),
    h('div', { style: { marginTop: '0.8rem' } }, barsChart(items, { goal: 20, label: 'Leseminuten der letzten 14 Tage' })), h('p', { class: 'hint' }, 'Gestrichelte Linie: Ziel 20 Minuten pro Tag.')));
}

// Nächstes Thema: zuerst noch nicht abgehakte Themen dieser Woche, sonst das folgende Thema im gleichen Fach
function nextSkill(id) {
  const p = state.profile; const pl = buildPlan(p);
  const f = (pl.focus || []).find((x) => x !== id && !p.mastered[x] && hasSources(x)); if (f) return SKILL[f];
  const list = SKILLS.filter((x) => x.subj === SKILL[id].subj && hasSources(x.id)); const i = list.findIndex((x) => x.id === id);
  return list.slice(i + 1).find((x) => !p.mastered[x.id]) || null;
}
function skillPage(page, id, tab) {
  const p = state.profile; const s = SKILL[id]; const st = skillStats(p, id);
  page.append(h('a', { class: 'back', href: '#/lernen/' + s.subj }, '‹ Alle Themen'));
  page.append(h('div', { class: 'page-head' }, h('h1', null, s.id + ' ' + s.name), h('p', null, s.desc + (s.ref ? ' In der Prüfung: ' + s.ref + '.' : ''))));
  page.append(h('div', { class: 'kpi', style: { marginBottom: '1rem' } },
    h('div', { class: 'kpi-stage' }, stagePips(st.stage), h('span', null, (() => { const nx = nextStageIn(p, id); return st.stage >= 4 ? 'Höchste Stufe. Halte sie mit gelegentlichen Wiederholungen.' : nx && nx.n ? 'Noch etwa ' + nx.n + (nx.n === 1 ? ' richtige Aufgabe' : ' richtige Aufgaben') + ' bis «' + STAGES[nx.to].name + '»' : 'Übe weiter, dann steigt die Stufe.'; })())),
    h('div', null, h('b', null, st.n ? Math.round(st.acc * 100) + ' %' : '–'), h('span', null, 'der Punkte erreicht')),
    h('div', null, h('b', null, st.spp ? fmtDur(st.spp) : '–'), h('span', null, 'deine Zeit pro Punkt')),
    h('div', null, h('b', null, fmtDur(st.target)), h('span', null, 'Zeit pro Punkt an der Prüfung')),
    h('div', null, h('b', null, st.done ? 'erledigt' : st.clean + ' / 2'), h('span', null, st.done ? 'im Lernplan abgehakt (2 fehlerfreie Runden)' : 'fehlerfreie Runden bis zum Abhaken'))));
  page.append(tabs([{ id: 'theorie', label: 'Theorie' }, { id: 'ueben', label: 'Üben' }], tab, (t) => { location.hash = '#/lernen/' + id + '/' + t; }));
  const box = h('div'); page.append(box);
  if (tab === 'theorie') {
    const th = h('div', { class: 'card theory', html: mathify(THEORY[id] || '<p>Für dieses Thema gibt es noch keine Theorie.</p>') });
    box.append(th);
    const note = h('textarea', { rows: 3, placeholder: 'Eigene Merksätze, Eselsbrücken, Beispiele …', 'aria-label': 'Eigene Notizen' }); note.value = p.notes[id] || '';
    note.addEventListener('change', () => { p.notes[id] = note.value; save(); });
    box.append(h('div', { class: 'card' }, h('h3', null, 'Eigene Notizen'), note));
    if (id === 'D30') readingLog(box);
    box.append(h('div', { class: 'row', style: { marginTop: '1rem' } }, hasSources(id) ? h('a', { class: 'btn primary big', href: '#/lernen/' + id + '/ueben' }, 'Zu den Übungen') : null, h('a', { class: 'btn', href: '#/blatt/' + id + '/theorie' }, icon('print', 18), 'Merkblatt drucken')));
    return;
  }
  // Üben
  if (!hasSources(id)) { if (id === 'D30') readingLog(box); else box.append(h('p', { class: 'muted' }, 'Für dieses Thema gibt es keine Aufgaben.')); return; }
  const essayType = { D22: 'eroerterung', D23: 'erzaehlung', D24: 'fortsetzung', D25: 'bild', D26: 'erlebnis', D29: '' }[id];
  const start = h('div', { class: 'card' });
  const N = id === 'M25' ? 9 : ['D16', 'D17', 'D13', 'D15', 'D21', 'D28'].includes(id) ? 4 : 8;
  let mode = p.settings.mode;
  start.append(h('h3', null, id === 'M25' ? '9 Kurzaufgaben wie in Aufgabe 1 (Ziel: höchstens 24 Minuten)' : 'Übungsrunde mit ' + N + ' Aufgaben'), h('p', { class: 'muted' }, 'Die Aufgaben werden innerhalb der Runde schwieriger. Nach jeder Aufgabe siehst du den Lösungsweg.'), modePicker((m) => { mode = m; }));
  const run = () => { box.innerHTML = ''; const host = h('div'); box.append(host);
    const sess = runSession(host, { title: s.name, mode: 'lernen', limit: N, backHref: '#/lernen/' + id, next: (i) => nextTaskFor(id, i, N, mode),
      onDone: (sum, root) => { root.append(summaryCard(sum, { again: run, backHref: '#/lernen/' + s.subj, backLabel: 'Alle Themen' })); const nx = nextSkill(id); if (nx) root.append(h('p', { style: { marginTop: '0.8rem' } }, h('a', { class: 'btn', href: '#/lernen/' + nx.id }, 'Nächstes Thema: ' + nx.id + ' ' + nx.name))); if (id === 'M25' && sum.n >= 9) root.append(h('p', { class: 'note ' + (sum.sec <= 24 * 60 ? 'ok' : 'warn'), style: { marginTop: '1rem' } }, 'Gesamtzeit: ' + fmtDur(sum.sec) + '. Ziel an der Prüfung: höchstens 24:00 für Aufgabe 1.')); } });
    setLeave(() => sess.stop()); };
  start.append(h('div', { class: 'row', style: { marginTop: '0.8rem' } }, btn('Runde starten', run, { kind: 'primary big', icon: 'play' }), essayType !== undefined ? h('a', { class: 'btn', href: '#/aufsatz/neu/' + essayType }, icon('pen', 18), 'Ganzen Aufsatz schreiben') : null, !['D13', 'D16', 'D17', 'D18', 'D19'].includes(id) ? h('a', { class: 'btn quiet', href: '#/blatt/' + id }, icon('print', 18), 'Arbeitsblatt für Papier') : null));
  box.append(start);
  // Aufgabenarten einzeln üben (zählt nicht für das Abhaken: dafür braucht es die gemischte Runde)
  const kinds = keysFor(id, 'mix').keys.map((k) => ({ k, g: genInfo(k) })).sort((a, b) => a.g.diff - b.g.diff);
  const DIFF = (d) => (d >= 3 ? h('span', { class: 'tag ink' }, 'Prüfungsniveau') : d === 1 ? h('span', { class: 'tag' }, 'Einstieg') : h('span', { class: 'tag' }, 'mittel'));
  const SRC = { gen: 'Generator', db: 'Datenbank', shuffle: 'Shuffle' };
  const runKind = (k, g) => { box.innerHTML = ''; const host = h('div'); box.append(host);
    const sess = runSession(host, { title: s.name + ': ' + g.title, mode: 'art', limit: N, backHref: '#/lernen/' + id + '/ueben', next: () => makeTask(k, newSeed()),
      onDone: (sum, root) => { root.append(summaryCard(sum, { again: () => runKind(k, g), backHref: '#/lernen/' + id + '/ueben', backLabel: 'Zurück zum Thema' })); } });
    setLeave(() => sess.stop()); };
  box.append(h('div', { class: 'card' }, h('h3', null, 'Aufgabenarten einzeln üben'),
    h('p', { class: 'hint' }, 'Die Übungsrunde oben mischt alle Arten und wird schwieriger. Hier übst du eine Art gezielt, ' + N + ' Aufgaben lang. Fürs Abhaken im Lernplan zählen nur die gemischten Runden.'),
    h('table', { class: 'list kinds' }, h('thead', null, h('tr', null, h('th', null, 'Aufgabenart'), h('th', null, 'Quelle'), h('th', null, 'Schwierigkeit'), h('th', null, h('span', { class: 'sr' }, 'Aktion')))),
      h('tbody', null, kinds.map(({ k, g }) => h('tr', null, h('td', null, g.title), h('td', null, h('span', { class: 'tag', title: MODE_HELP[g.src] || '' }, SRC[g.src] || g.src)), h('td', null, DIFF(g.diff)),
        h('td', { class: 'num' }, btn('Üben', () => runKind(k, g), { kind: 'small', icon: 'play', iconSize: 14, aria: g.title + ' üben' })))))),
    h('p', { class: 'hint' }, 'Generator: vom Computer berechnet, unendlich viele. Datenbank: geprüfte Aufgaben, erweiterbar unter «Inhalte». Shuffle: Datenbank-Aufgaben mit neuen Zahlen und anderer Formulierung.')));
}

export function render(page, args) {
  const a = args[0] || 'D';
  if (a === 'D' || a === 'M') return index(page, a);
  if (SKILL[a]) return skillPage(page, a, args[1] || 'theorie');
  return index(page, 'D');
}
