// Speicher: Profile und Lernstand. In der App als JSON-Dateien auf dem Computer, im Browser-Test im localStorage.
import { uid, dayKey } from './util.js';
import { RULES } from './skills.js';

const api = typeof window !== 'undefined' ? window.gymi : null;
const mem = {};
const backend = {
  async read(name) {
    if (api) return api.storeRead(name);
    try { const v = (typeof localStorage !== 'undefined' ? localStorage.getItem('gymi:' + name) : mem[name]); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  },
  async write(name, data) {
    if (api) return api.storeWrite(name, data);
    try { if (typeof localStorage !== 'undefined') localStorage.setItem('gymi:' + name, JSON.stringify(data)); else mem[name] = JSON.stringify(data); } catch (e) { /* voll */ }
    return true;
  },
  async remove(name) { if (api) return api.storeDelete(name); try { localStorage.removeItem('gymi:' + name); } catch (e) {} return true; }
};

export const state = { meta: { profiles: [], active: null }, profile: null, packs: [] };
const listeners = new Set();
export const onChange = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const emit = () => listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });

export function newProfile(name) {
  return {
    id: uid(), name: name || 'Lernende', created: Date.now(), v: 1,
    setup: { done: false, assessed: false, klasse: '2', vn: null, examDate: RULES.examDate, intensity: 'standard', days: [1, 2, 3, 4, 5, 6], calc: '' },
    settings: { theme: 'hell', font: 'standard', size: 100, motion: true, tts: false, web: false, lt: false, mode: 'mix' },
    attempts: [], xp: 0, days: {}, reading: {}, errors: [], essays: [], mocks: [], officials: [], blitz: { best: 0, streak: 0 },
    clean: {}, mastered: {}, planDone: {}, seenGain: {}, baseline: {}, notes: {}
  };
}

let saveTimer = null;
export function save() {
  if (!state.profile) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { backend.write('profil-' + state.profile.id, state.profile); backend.write('meta', state.meta); }, 350);
  emit();
}
export async function flush() { clearTimeout(saveTimer); if (state.profile) await backend.write('profil-' + state.profile.id, state.profile); await backend.write('meta', state.meta); }

export async function init() {
  const meta = await backend.read('meta');
  if (meta && Array.isArray(meta.profiles)) state.meta = meta;
  state.packs = (await backend.read('pakete')) || [];
  if (state.meta.active) {
    const p = await backend.read('profil-' + state.meta.active);
    if (p) state.profile = migrate(p);
  }
  if (!state.profile && state.meta.profiles.length) await switchProfile(state.meta.profiles[0].id);
  return state;
}
function migrate(p) { const d = newProfile(p.name); for (const k of Object.keys(d)) if (p[k] === undefined) p[k] = d[k]; p.setup = Object.assign({}, d.setup, p.setup); p.settings = Object.assign({}, d.settings, p.settings); return p; }

export async function createProfile(name) {
  await flush();
  const p = newProfile(name); state.profile = p;
  state.meta.profiles.push({ id: p.id, name: p.name }); state.meta.active = p.id;
  await flush(); emit(); return p;
}
export async function switchProfile(id) {
  await flush();
  const p = await backend.read('profil-' + id); if (!p) return false;
  state.profile = migrate(p); state.meta.active = id; await backend.write('meta', state.meta); emit(); return true;
}
export async function deleteProfile(id) {
  state.meta.profiles = state.meta.profiles.filter((x) => x.id !== id);
  await backend.remove('profil-' + id);
  if (state.meta.active === id) { state.profile = null; state.meta.active = null; if (state.meta.profiles.length) await switchProfile(state.meta.profiles[0].id); }
  await backend.write('meta', state.meta); emit();
}
export function renameProfile(name) { state.profile.name = name; const m = state.meta.profiles.find((x) => x.id === state.profile.id); if (m) m.name = name; save(); }
export async function importProfile(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.attempts)) throw new Error('Datei ist kein Gymi-Trainer-Profil.');
  await flush();
  const p = migrate(data); p.id = uid(); state.profile = p; state.meta.profiles.push({ id: p.id, name: p.name }); state.meta.active = p.id; await flush(); emit();
}
// Sicherung zurückholen: Inhalt ersetzen, Profil-ID bleibt
export async function restoreProfile(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.attempts)) throw new Error('Die Sicherung ist beschädigt.');
  const id = state.profile.id; const p = migrate(data); p.id = id; state.profile = p;
  const m = state.meta.profiles.find((x) => x.id === id); if (m) m.name = p.name;
  await flush(); emit();
}
export async function savePacks() { await backend.write('pakete', state.packs); emit(); }
// Ausgeschaltete Pakete (gelten für alle Profile auf diesem Computer, wie die Pakete selbst)
export async function saveMeta() { await backend.write('meta', state.meta); emit(); }

// ---------- Versuche ----------
// a = { key, skill, points, max, sec, mode, src, seed }
export function addAttempt(a) {
  const p = state.profile; if (!p) return;
  const rec = { k: a.key, s: a.skill, t: Date.now(), p: a.points, m: a.max, sec: Math.round(a.sec), mode: a.mode, src: a.src || 'gen', seed: a.seed || 0 };
  p.attempts.push(rec);
  if (p.attempts.length > 8000) p.attempts.splice(0, p.attempts.length - 8000);
  p.xp += attemptXp(a.points, a.max);
  addMinutes(a.sec / 60);
  save();
  return rec;
}
const attemptXp = (pts, max) => Math.round(pts * 10 + (pts >= max && max > 0 ? 2 : 0));
// Punkte eines gespeicherten Versuchs nachträglich ändern (z. B. «Als richtig werten»). own: selbst gewertet (o: 1)
export function rescoreAttempt(rec, points, own) {
  const p = state.profile; if (!p || !rec) return;
  p.xp += attemptXp(points, rec.m) - attemptXp(rec.p, rec.m);
  rec.p = points; if (own) rec.o = 1; else delete rec.o;
  save();
}
export function addMinutes(min) { const p = state.profile; if (!p) return; const k = dayKey(); p.days[k] = Math.round(((p.days[k] || 0) + min) * 100) / 100; }

// ---------- Fehlerheft: Wiederholung nach 1, 7 und 21 Tagen ----------
const STAGES = [1, 7, 21];
export function addError(task, cause) {
  const p = state.profile; if (!p || !task.key) return;
  const ex = p.errors.find((e) => e.key === task.key && e.seed === task.seed);
  const due = Date.now() + STAGES[0] * 86400000;
  if (ex) { ex.stage = 0; ex.due = due; ex.wrong++; if (cause) ex.cause = cause; }
  else p.errors.push({ id: uid(), key: task.key, seed: task.seed, skill: task.skill, added: Date.now(), due, stage: 0, wrong: 1, cause: cause || '' });
  if (p.errors.length > 600) p.errors.splice(0, p.errors.length - 600);
  save();
}
export function reviewError(id, ok) {
  const p = state.profile; const e = p.errors.find((x) => x.id === id); if (!e) return;
  if (ok) { e.stage++; if (e.stage >= STAGES.length) { p.errors = p.errors.filter((x) => x.id !== id); p.errorsClosed = (p.errorsClosed || 0) + 1; } else e.due = Date.now() + STAGES[e.stage] * 86400000; }
  else { e.stage = 0; e.wrong++; e.due = Date.now() + STAGES[0] * 86400000; }
  save();
}
export const dueErrors = () => (state.profile ? state.profile.errors.filter((e) => e.due <= Date.now()) : []);

// 2 fehlerfreie Übungen hintereinander = Skill abgehakt
export function noteSet(skill, clean) {
  const p = state.profile; if (!p) return;
  p.clean[skill] = clean ? (p.clean[skill] || 0) + 1 : 0;
  if (p.clean[skill] >= 2 && !p.mastered[skill]) p.mastered[skill] = dayKey();
  save();
}
