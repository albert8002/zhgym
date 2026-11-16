// Start der App: Speicher laden, eigene Inhalte laden, Navigation, Seitenwechsel.
import { MOD } from './util.js';
import { h, icon, btn, modal, toast, confirmBox } from './ui.js';
import { state, init, flush, onChange, createProfile, switchProfile, dueErrors } from './store.js';
import { addPack } from './engine/db.js';
import { refreshSources } from './engine/sources.js';
import { officialGate, buildPlan, readiness, minutesInfo } from './stats.js';
import { SKILL, SKILLS } from './skills.js';
import * as onboarding from './views/onboarding.js';
import * as dashboard from './views/dashboard.js';
import * as learn from './views/learn.js';
import * as training from './views/training.js';
import * as mock from './views/mock.js';
import * as official from './views/official.js';
import * as essay from './views/essay.js';
import * as analyse from './views/analyse.js';
import * as plan from './views/plan.js';
import * as content from './views/content.js';
import * as settings from './views/settings.js';
import * as extras from './views/extras.js';

const ROUTES = {
  start: dashboard.render, lernen: learn.render, training: training.renderEndless, blitz: training.renderBlitz, einstufung: training.renderAssessment,
  simulation: mock.render, offiziell: official.render, aufsatz: essay.render, auswertung: analyse.render, fehlerheft: analyse.renderErrors,
  plan: plan.render, noten: plan.renderGrades, inhalte: content.render, einstellungen: settings.render, hilfe: extras.renderHelp, blatt: extras.renderSheet, bericht: extras.renderReport
};
const NAV = [
  ['start', 'Start', 'home'], ['lernen', 'Lernen', 'book'], ['training', 'Endlos-Training', 'loop'], ['blitz', 'Blitz', 'bolt'], null,
  ['simulation', 'Prüfungssimulation', 'exam'], ['offiziell', 'Offizielle Prüfungen', 'seal'], ['aufsatz', 'Aufsatz-Werkstatt', 'pen'], null,
  ['fehlerheft', 'Fehlerheft', 'heft'], ['auswertung', 'Auswertung', 'chart'], ['plan', 'Lernplan', 'cal'], ['noten', 'Notenrechner', 'calc'], null,
  ['inhalte', 'Inhalte', 'box'], ['einstellungen', 'Einstellungen', 'gear'], ['hilfe', 'Hilfe', 'help']
];

let leave = null;          // Aufräumfunktion der aktuellen Seite
let guard = null;          // Rückfrage vor dem Verlassen (z. B. laufende Prüfung)
export const setLeave = (fn) => { leave = fn; };
const busy = (text) => { if (window.gymi && window.gymi.setBusy) window.gymi.setBusy(text || null).catch(() => {}); };
export const setGuard = (fn, text) => { guard = fn; busy(fn ? (text || 'Eine Prüfung läuft noch.') : null); };
let lastHash = '';

export function applySettings() {
  const s = state.profile ? state.profile.settings : { theme: 'hell', font: 'standard', size: 100, motion: true };
  const de = document.documentElement;
  const dark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
  de.dataset.theme = s.theme === 'system' ? (dark ? 'dunkel' : 'hell') : s.theme; de.dataset.font = s.font; de.dataset.motion = s.motion ? 'an' : 'aus';
  de.style.setProperty('--size', String(s.size));
}

function sidebar(active) {
  const p = state.profile; const gate = officialGate(p); const due = dueErrors().length; const pl = buildPlan(p);
  const nav = h('nav', { class: 'nav', 'aria-label': 'Hauptnavigation' });
  NAV.forEach((it) => {
    if (!it) { nav.append(h('div', { class: 'nav-sep', role: 'presentation' })); return; }
    const [id, label, ic] = it;
    nav.append(h('a', { href: '#/' + id, 'aria-current': id === active ? 'page' : null }, icon(id === 'offiziell' && !gate.open ? 'lock' : ic), h('span', null, label), id === 'fehlerheft' && due ? h('span', { class: 'badge', 'aria-label': due + ' fällig' }, String(due)) : null));
  });
  const r = readiness(p); const mi = minutesInfo(p); const todayTarget = (pl.today || []).reduce((a, x) => a + (x.min || 0), 0);
  const foot = h('div', { class: 'side-foot' },
    h('a', { class: 'side-ready', href: '#/auswertung', title: 'Bereitschaft für die Prüfung' }, h('span', { class: 'row between' }, h('span', null, 'Bereitschaft'), h('b', null, Math.round(r.total * 100) + ' %')), h('span', { class: 'side-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(r.total * 100)), 'aria-label': 'Bereitschaft' }, h('i', { style: { width: Math.round(r.total * 100) + '%' } }), h('em', { style: { left: '50%' }, title: 'Ab 50 % sind die offiziellen Prüfungen offen' }))),
    todayTarget ? h('div', { class: 'muted small', style: { margin: '0.35rem 0 0.2rem' } }, 'Heute ' + Math.round(mi.today) + ' von ' + todayTarget + ' Min.') : null,
    h('div', { class: 'muted small', style: { margin: '0.15rem 0 0.45rem' } }, pl.daysLeft >= 0 ? 'Noch ' + pl.daysLeft + ' Tage bis zur Prüfung' : 'Prüfungstermin ist vorbei'),

    btn(p.name, profileDialog, { icon: 'user', kind: 'small', title: 'Profil wechseln' }));
  const search = h('button', { type: 'button', class: 'search-btn', onclick: openSearch, title: 'Schnellsuche (' + MOD + '+K)' }, icon('search', 16), h('span', null, 'Suchen'), h('kbd', null, MOD + ' K'));
  return h('aside', { class: 'side' }, h('div', { class: 'brand' }, h('b', null, 'Gymi-Trainer'), h('span', null, 'Kurzgymnasium Kanton Zürich')), search, nav, foot);
}

// ---------- Schnellsuche (Ctrl+K): Themen und Seiten ----------
let searchEl = null;
function closeSearch() { if (searchEl) { searchEl.remove(); searchEl = null; } }
function openSearch() {
  if (!state.profile || !state.profile.setup.done) return;
  if (searchEl) { searchEl.querySelector('input').focus(); return; }
  const items = [...NAV.filter(Boolean).map(([id, label]) => ({ label, sub: 'Seite', href: '#/' + id })), ...SKILLS.map((sk) => ({ label: sk.id + ' ' + sk.name, sub: sk.desc, href: '#/lernen/' + sk.id })),
    { label: 'Sprachprüfung simulieren', sub: '45 Minuten', href: '#/simulation/sprache' }, { label: 'Mathematik simulieren', sub: '90 Minuten', href: '#/simulation/mathe' }, { label: 'Aufsatz simulieren', sub: '4 Themen, 90 Minuten', href: '#/aufsatz/sim' },
    { label: 'Einstufungstest', sub: 'Standort bestimmen', href: '#/einstufung' }, { label: 'Prüfungstag', sub: 'Ablauf und Checkliste', href: '#/hilfe' }, { label: 'Prüfungsstrategie', sub: 'Zeit einteilen, festgefahren, Kopf leer', href: '#/hilfe' }, { label: 'Wochenbericht', sub: 'Drucken für Eltern oder Lehrperson', href: '#/bericht' }, { label: 'Meilensteine', sub: 'Erreichtes und nächste Ziele', href: '#/auswertung' }, { label: 'Stoffkarte', sub: 'Alle Themen mit ihrer Stufe', href: '#/start' }, { label: 'Beispielprofil', sub: 'Mia mit 3 Wochen Lerndaten anlegen', href: '#/einstellungen' }];
  const inp = h('input', { type: 'search', placeholder: 'Thema oder Seite suchen, zum Beispiel «Komma» oder «Pythagoras»', 'aria-label': 'Suchen', autocomplete: 'off' });
  const list = h('div', { class: 'search-list', role: 'listbox' }); let sel = 0; let hits = [];
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const draw = () => { const q = norm(inp.value.trim()); hits = (q ? items.filter((it) => norm(it.label + ' ' + it.sub).includes(q)) : items.slice(0, 8)).slice(0, 12); sel = Math.min(sel, Math.max(0, hits.length - 1)); list.innerHTML = '';
    if (!hits.length) list.append(h('p', { class: 'muted', style: { padding: '0.6rem' } }, 'Nichts gefunden.'));
    hits.forEach((it, i) => list.append(h('a', { href: it.href, role: 'option', 'aria-selected': String(i === sel), class: i === sel ? 'on' : null, onclick: closeSearch }, h('b', null, it.label), h('span', { class: 'muted small' }, it.sub)))); };
  inp.addEventListener('input', () => { sel = 0; draw(); });
  inp.addEventListener('keydown', (e) => { if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, hits.length - 1); draw(); e.preventDefault(); } else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); } else if (e.key === 'Enter' && hits[sel]) { location.hash = hits[sel].href; closeSearch(); } else if (e.key === 'Escape') closeSearch(); });
  searchEl = h('div', { class: 'overlay search-overlay', onclick: (e) => { if (e.target === searchEl) closeSearch(); } }, h('div', { class: 'modal search-box', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Schnellsuche' }, h('div', { class: 'row' }, icon('search', 20), inp), list, h('p', { class: 'hint', style: { margin: '0.4rem 0 0' } }, 'Pfeiltasten wählen, Enter öffnet, Esc schliesst.')));
  document.body.append(searchEl); draw(); inp.focus();
}

async function profileDialog() {
  const list = h('div', { class: 'stack' });
  state.meta.profiles.forEach((pr) => list.append(h('label', { class: 'choice' }, h('input', { type: 'radio', name: 'prof', value: pr.id, checked: pr.id === state.profile.id || null }), h('span', null, pr.name))));
  const name = h('input', { type: 'text', placeholder: 'Name für ein neues Profil', 'aria-label': 'Name für ein neues Profil' });
  list.append(h('div', { class: 'form-row' }, h('label', null, 'Neues Profil anlegen'), name));
  const r = await modal({ title: 'Profil wählen', body: list, actions: [{ label: 'Abbrechen', value: null }, { label: 'Übernehmen', kind: 'primary', value: () => ({ id: (list.querySelector('input[name=prof]:checked') || {}).value, name: name.value.trim() }) }] });
  if (!r) return;
  if (r.name) { await createProfile(r.name); location.hash = '#/willkommen'; }
  else if (r.id && r.id !== state.profile.id) { await switchProfile(r.id); location.hash = '#/start'; }
  applySettings(); route(true);
}

async function route(force) {
  const hash = location.hash.replace(/^#\/?/, '') || 'start';
  if (!force && hash === lastHash) return;
  if (guard && hash !== lastHash) {
    const ok = await guard();
    if (!ok) { history.replaceState(null, '', '#/' + lastHash); return; }
  }
  guard = null; busy(null); if (leave) { try { leave(); } catch (e) { console.error(e); } leave = null; }
  lastHash = hash; closeSearch();
  const app = document.getElementById('app');
  const [name, ...rest] = hash.split('/');
  if (!state.profile || name === 'willkommen' || !state.profile.setup.done) {
    app.style.gridTemplateColumns = '1fr'; app.innerHTML = '';
    const main = h('main', { class: 'main' }); app.append(main);
    onboarding.render(main, () => { applySettings(); location.hash = state.profile.setup.assessed ? '#/start' : '#/einstufung'; route(true); });
    return;
  }
  app.style.gridTemplateColumns = '';
  const fn = ROUTES[name] || dashboard.render; const active = ROUTES[name] ? name : 'start';
  app.innerHTML = '';
  const main = h('main', { class: 'main', id: 'main', tabindex: '-1' });
  const page = h('div', { class: 'page' }); main.append(page);
  app.append(h('a', { class: 'skip', href: '#main', onclick: (e) => { e.preventDefault(); main.focus(); } }, 'Zum Inhalt springen'), sidebar(active), main);
  if (name === 'lernen' && SKILL[rest[0]] && state.profile.lastSkill !== rest[0]) { state.profile.lastSkill = rest[0]; }
  try { await fn(page, rest.map(decodeURIComponent)); }
  catch (e) { console.error(e); page.innerHTML = ''; page.append(h('div', { class: 'note bad' }, h('b', null, 'Diese Seite konnte nicht geladen werden. '), String(e.message || e))); }
  window.scrollTo(0, 0);
  const ae = document.activeElement; if (!ae || ae === document.body || !document.contains(ae)) main.focus({ preventScroll: true });
}
export const go = (hash) => { if (location.hash === hash) route(true); else location.hash = hash; };
export const refresh = () => route(true);

async function boot() {
  await init();
  try { if (window.speechSynthesis) window.speechSynthesis.getVoices(); } catch (e) { /* Stimmen laden im Hintergrund */ }
  // Eigene Inhaltspakete laden
  let bad = 0;
  for (const pk of state.packs) { const r = addPack(pk.pack, 'eigen:' + pk.name); if (r.errors.length) bad += r.errors.length; }
  refreshSources();
  applySettings();
  window.addEventListener('hashchange', () => route(false));
  if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (state.profile && state.profile.settings.theme === 'system') applySettings(); });
  window.addEventListener('gymi-suche', () => openSearch());
  document.addEventListener('keydown', (e) => {
    if (window.gymi) return; // in der App erledigt das Menü die Tastenkürzel
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    else if (e.key === 'F1') { e.preventDefault(); location.hash = '#/hilfe'; }
  });
  window.addEventListener('beforeunload', () => { flush(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
  await route(true);
  if (bad) toast(bad + ' Einträge aus eigenen Paketen sind fehlerhaft und wurden übersprungen. Details unter «Inhalte».', 'bad', 7000);
}
boot().catch((e) => { console.error(e); document.getElementById('app').innerHTML = '<p style="padding:2rem">Start fehlgeschlagen: ' + String(e.message || e) + '</p>'; });
