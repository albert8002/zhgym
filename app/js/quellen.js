// Aufgabenquellen: welche Arten (Generator, Datenbank, Shuffle, Web) und welche Pakete verwendet werden.
// Die Arten gelten pro Profil. Die Pakete gelten für alle Profile auf diesem Computer (wie unter «Inhalte»).
import { h, btn, modal, toast } from './ui.js';
import { state, save, saveMeta } from './store.js';
import { setInactive, originCounts } from './engine/db.js';
import { refreshSources, keysFor, hasSources } from './engine/sources.js';
import { SKILL, SKILLS } from './skills.js';
import { fmtDate } from './util.js';
import { WEB_SKILLS } from './engine/web.js';

// ---------- Pakete ----------
export const BUILTIN = 'eingebaut';
export const offList = () => state.meta.dbOff || [];
export const allOrigins = () => [BUILTIN, ...state.packs.map((x) => 'eigen:' + x.name)];
export const latestPack = () => state.packs.slice().sort((a, b) => (b.added || 0) - (a.added || 0))[0] || null;
export async function setOff(list) { state.meta.dbOff = [...new Set(list)]; setInactive(state.meta.dbOff); refreshSources(); await saveMeta(); }
// Themen, die mit der aktuellen Paketauswahl keine Aufgaben mehr haben
export function lostTopics() {
  const cur = offList(); if (!cur.length) return [];
  setInactive([]); refreshSources(); const all = SKILLS.filter((x) => hasSources(x.id)).map((x) => x.id);
  setInactive(cur); refreshSources();
  return all.filter((id) => !hasSources(id));
}

// ---------- Arten ----------
export const KINDS = [
  ['gen', 'Generator', 'vom Computer berechnet, unendlich viele'],
  ['db', 'Datenbank', 'geprüfte Aufgaben aus den Paketen unten'],
  ['web', 'Web (experimentell)', 'Sätze und Zahlen aus Wikipedia und Wikidata, kann Fehler enthalten']
];
// Einstellungen lesen; ältere Profile hatten nur eine Quelle (settings.mode)
export function srcSettings(p = state.profile) {
  if (!p.settings.src) {
    const m = p.settings.mode || 'mix';
    p.settings.src = m === 'gen' ? { gen: true, db: false, shuffle: false, web: false }
      : m === 'db' ? { gen: false, db: true, shuffle: false, web: false }
      : m === 'shuffle' ? { gen: false, db: false, shuffle: true, web: false }
      : m === 'web' ? { gen: false, db: false, shuffle: false, web: true }
      : { gen: true, db: true, shuffle: true, web: false };
  }
  return p.settings.src;
}
// Für keysFor und randomTask: 'mix' oder die Liste der erlaubten Arten
export function srcAllow(p = state.profile) {
  const s = srcSettings(p); const a = ['gen', 'db', 'shuffle'].filter((k) => s[k]);
  return a.length === 3 || !a.length ? 'mix' : a;
}
export const webActive = (p = state.profile) => !!(srcSettings(p).web && p.settings.web);
// Soll diese Aufgabe aus dem Web kommen? Mit anderen Arten zusammen nur mit einem fairen Anteil.
export function useWeb(skill, p = state.profile) {
  if (!webActive(p) || !WEB_SKILLS.includes(skill)) return false;
  const others = ['gen', 'db', 'shuffle'].filter((k) => srcSettings(p)[k]).length;
  return others === 0 || Math.random() < 1 / (others + 1);
}
// Nur Web gewählt: Ersatzaufgaben aus anderen Quellen gelten nicht als «falsche Quelle»
export const webOnly = (p = state.profile) => { const s = srcSettings(p); return webActive(p) && !s.gen && !s.db && !s.shuffle; };

// Kurzbeschreibung, z. B. «Generator, Datenbank und Shuffle; 2 von 3 Paketen»
export function srcSummary(p = state.profile) {
  const s = srcSettings(p);
  const names = [s.gen && 'Generator', s.db && 'Datenbank', s.shuffle && 'Shuffle', s.web && p.settings.web && 'Web'].filter(Boolean);
  if (!names.length) names.push('Generator', 'Datenbank', 'Shuffle'); // nichts Gültiges gewählt: alles
  const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' und ' + names[names.length - 1] : names[0] || 'keine';
  const total = allOrigins().length, used = allOrigins().filter((o) => !offList().includes(o)).length;
  return list + '; ' + (used === total ? (total === 1 ? 'eingebaute Datenbank' : 'alle ' + total + ' Pakete') : used + ' von ' + total + ' Paketen');
}

// ---------- Fenster ----------
const kbtn = (key, label, fn, opts) => { const b = btn(label, fn, opts); b.dataset.k = key; return b; };
// opts.skill: ein Thema (Lernen), opts.skills(): gewählte Themen (Endlos-Training). Gibt { packsChanged } zurück.
export async function openSources(opts = {}) {
  const p = state.profile; const s = srcSettings(p); let packsChanged = false;
  const body = h('div', { class: 'srcpop' });
  const keep = () => { const a = document.activeElement; return a && body.contains(a) ? a.dataset.k : null; };
  const draw = (focusKey) => {
    body.innerHTML = '';
    // Arten (Mehrfachauswahl)
    const kinds = h('fieldset', { class: 'src-group' }, h('legend', null, 'Aufgabenarten'), h('p', { class: 'hint' }, 'Kreuze an, woher die Aufgaben kommen. Mehrere sind möglich.'));
    KINDS.forEach(([k, name, desc]) => {
      const disabled = k === 'web' && !p.settings.web;
      const cb = h('input', { type: 'checkbox', 'data-k': 'k:' + k, checked: (s[k] && !disabled) || null, disabled: disabled || null, onchange: () => {
        s[k] = cb.checked;
        if (!s.gen && !s.db && !s.shuffle && !webActive(p)) { s[k] = true; cb.checked = true; toast('Mindestens eine Quelle muss gewählt sein.', 'bad'); return; }
        save(); draw(keep());
      } });
      kinds.append(h('label', { class: 'choice' }, cb, h('span', null, h('b', null, name), h('br'), h('span', { class: 'muted small' }, disabled ? 'zuerst unter «Einstellungen» einschalten' : desc))));
    });
    // Shuffle als Schalter
    const sw = h('input', { type: 'checkbox', role: 'switch', class: 'switch', 'data-k': 'shuffle', checked: s.shuffle || null, 'aria-label': 'Shuffle', onchange: () => {
      s.shuffle = sw.checked;
      if (!s.gen && !s.db && !s.shuffle && !webActive(p)) { s.shuffle = true; sw.checked = true; toast('Mindestens eine Quelle muss gewählt sein.', 'bad'); return; }
      save(); draw(keep());
    } });
    const shuf = h('label', { class: 'switch-row' }, h('span', null, h('b', null, 'Shuffle ' + (s.shuffle ? 'an' : 'aus')), h('br'), h('span', { class: 'muted small' }, 'Aufgaben aus den Paketen zusätzlich mit neuen Zahlen und anderer Formulierung')), sw);
    // Pakete (Mehrfachauswahl)
    const off = new Set(offList()); const oc = originCounts(); const latest = latestPack();
    const setPacks = async (list) => { await setOff(list); packsChanged = true; draw(keep()); };
    const packBox = (o, label, sub) => {
      const cb = h('input', { type: 'checkbox', 'data-k': 'p:' + o, checked: !off.has(o) || null, onchange: () => { const next = new Set(offList()); if (cb.checked) next.delete(o); else next.add(o); setPacks([...next]); } });
      return h('label', { class: 'choice' }, cb, h('span', null, h('b', null, label), h('br'), h('span', { class: 'muted small' }, sub)));
    };
    const packs = h('fieldset', { class: 'src-group' }, h('legend', null, 'Pakete'),
      h('p', { class: 'hint' }, 'Datenbank und Shuffle nehmen ihre Einträge aus den angekreuzten Paketen. Die Auswahl gilt überall in der App, auch unter «Inhalte».'),
      packBox(BUILTIN, 'Eingebaute Datenbank', (oc[BUILTIN] || 0) + ' Einträge, mit der App'),
      state.packs.map((x) => packBox('eigen:' + x.name, x.name, (oc['eigen:' + x.name] || 0) + ' Einträge' + (x.added ? ', importiert am ' + fmtDate(new Date(x.added)) : ''))),
      state.packs.length ? h('div', { class: 'row', style: { marginTop: '0.5rem' } },
        kbtn('all', 'Alle', () => setPacks([]), { kind: 'small' }),
        kbtn('latest', 'Nur das neueste: «' + latest.name + '»', () => setPacks(allOrigins().filter((o) => o !== 'eigen:' + latest.name)), { kind: 'small' }))
        : h('p', { class: 'muted small' }, 'Eigene Pakete importierst du unter «Inhalte».'));
    body.append(kinds, shuf, packs, infoLine(opts));
    const el = focusKey && body.querySelector('[data-k="' + focusKey + '"]'); if (el) el.focus(); else if (focusKey) { const f = body.querySelector('input:not([disabled])'); if (f) f.focus(); }
  };
  draw();
  await modal({ title: 'Aufgabenquellen', body, actions: [{ label: 'Fertig', value: true, kind: 'primary' }] });
  save();
  return { packsChanged };
}

// Was die Auswahl für das Thema oder die gewählten Themen bedeutet
function infoLine(opts) {
  const allow = srcAllow(); const lost = lostTopics();
  if (opts.skill) {
    const id = opts.skill, name = id + ' ' + SKILL[id].name;
    if (!hasSources(id)) return h('p', { class: 'note bad', 'aria-live': 'polite' }, 'Mit diesen Paketen gibt es für ' + name + ' keine Aufgaben. Schalte ein Paket ein.');
    const { keys, fallback } = keysFor(id, allow);
    if (fallback && !webOnly()) return h('p', { class: 'note warn', 'aria-live': 'polite' }, 'Für ' + name + ' passt keine Aufgabenart zu dieser Auswahl. Die Runde nimmt dann Aufgaben aus allen Quellen.');
    return h('p', { class: 'note ok', 'aria-live': 'polite' }, 'Für ' + name + ' gibt es mit dieser Auswahl ' + keys.length + (keys.length === 1 ? ' Aufgabenart.' : ' Aufgabenarten.'));
  }
  const parts = [];
  if (opts.skills) {
    const ids = opts.skills().filter(hasSources);
    const mixed = ids.filter((id) => keysFor(id, allow).fallback);
    if (mixed.length && !webOnly()) parts.push(mixed.length + (mixed.length === 1 ? ' gewähltes Thema hat' : ' gewählte Themen haben') + ' keine passende Aufgabenart. Dort kommen Aufgaben aus allen Quellen.');
  }
  if (lost.length) parts.push('Ohne Aufgaben mit diesen Paketen: ' + lost.map((id) => id + ' ' + SKILL[id].name).join(', ') + '.');
  return parts.length ? h('p', { class: 'note warn', 'aria-live': 'polite' }, parts.join(' ')) : h('p', { class: 'note ok', 'aria-live': 'polite' }, 'Alle Themen haben mit dieser Auswahl Aufgaben.');
}

// Zeile mit Zusammenfassung und Knopf, für Lernen und Endlos-Training
export function sourceRow(opts = {}) {
  const sum = h('span', { class: 'src-sum' });
  const upd = () => { sum.textContent = srcSummary(); };
  upd();
  return h('div', { class: 'row src-row' }, h('span', { class: 'small muted' }, 'Quellen:'), sum,
    btn('Quellen wählen', async () => { const r = await openSources(opts); upd(); if (opts.onChange) opts.onChange(r); }, { kind: 'small', icon: 'filter' }));
}
