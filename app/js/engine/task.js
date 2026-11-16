// Aufgaben: Bewertung (ohne Oberfläche, auch in Tests nutzbar) und Anzeige der Eingabefelder.
import { parse, parseEq, equivalent, equationEquivalent, size, vars, parseNumber, toTex } from './expr.js';
import { normText, esc } from '../util.js';

// ---------- Bewertung ----------
const res = (points, max, extra = {}) => Object.assign({ points: Math.max(0, Math.min(max, points)), max, ok: points >= max }, extra);

export function fieldMax(f) {
  if (f.points != null) return f.points;
  if (f.type === 'classify') return f.rows.length;
  if (f.type === 'multi') return f.answers.length;
  if (f.type === 'self') return f.checklist.reduce((a, c) => a + (c.points || 1), 0);
  if (f.type === 'edit') return f.errors;
  return 1;
}

export function gradeField(f, v, ctx = {}) {
  const max = fieldMax(f);
  const empty = v == null || v === '' || (Array.isArray(v) && !v.length && f.type !== 'gaps' && f.type !== 'tokens');
  switch (f.type) {
    case 'num': {
      if (empty) return res(0, max, { empty: true });
      const p = parseNumber(v);
      if (!p.ok) return res(0, max, { note: 'Eingabe nicht lesbar. Beispiel: 3/4 oder 0.75' });
      let val = p.value;
      if (f.prob && p.percent) val = val / 100;
      if (f.pct && !p.percent && f.strictPct) return res(Math.max(0, max - 1), max, { note: 'Prozentzeichen fehlt.' });
      const tol = f.tol != null ? f.tol : 1e-9 * Math.max(1, Math.abs(f.answer));
      const good = Math.abs(val - f.answer) <= tol + 1e-12;
      return res(good ? max : 0, max);
    }
    case 'expr': {
      if (empty) return res(0, max, { empty: true });
      let ast;
      try { ast = parse(v); } catch (e) { return res(0, max, { note: 'Term nicht lesbar: ' + e.message }); }
      const allowed = new Set(f.vars || [...vars(parse(f.answer))]);
      for (const n of vars(ast)) if (!allowed.has(n)) return res(0, max, { note: 'Variable ' + n + ' kommt in der Lösung nicht vor.' });
      if (!equivalent(ast, parse(f.answer), [...allowed])) return res(0, max);
      if (f.noGroup && hasGroup(ast)) return res(0, max, { note: 'Gleichwertig, aber die Klammern sind noch nicht aufgelöst.' });
      if (f.simple && size(ast) > size(parse(f.answer)) + (f.slack != null ? f.slack : 2)) return res(0, max, { note: 'Gleichwertig, aber noch nicht fertig vereinfacht.' });
      return res(max, max);
    }
    case 'pf': {
      if (empty) return res(0, max, { empty: true });
      let ast;
      try { ast = parse(v); } catch (e) { return res(0, max, { note: 'Eingabe nicht lesbar. Beispiel: 2^3*5' }); }
      const facs = []; const flat = (n) => { if (n.t === 'grp') flat(n.a); else if (n.t === 'mul') { flat(n.a); flat(n.b); } else facs.push(n); }; flat(ast);
      const isPrime = (k) => { if (!Number.isInteger(k) || k < 2) return false; for (let i = 2; i * i <= k; i++) if (k % i === 0) return false; return true; };
      let prod = 1;
      for (const n of facs) {
        if (n.t === 'num' && isPrime(n.v)) prod *= n.v;
        else if (n.t === 'pow' && n.a.t === 'num' && isPrime(n.a.v) && n.b.t === 'num' && Number.isInteger(n.b.v) && n.b.v > 0) prod *= n.a.v ** n.b.v;
        else return res(0, max, { note: 'Nur Primzahlen (und ihre Potenzen) als Faktoren verwenden.' });
      }
      return res(prod === f.answer ? max : 0, max);
    }
    case 'eq': {
      if (empty) return res(0, max, { empty: true });
      let e;
      try { e = parseEq(v); } catch (x) { return res(0, max, { note: 'Gleichung nicht lesbar: ' + x.message }); }
      const used = new Set([...vars(e.l), ...vars(e.r)]);
      const vn = f.var || 'x';
      if ([...used].some((n) => n !== vn)) return res(0, max, { note: 'Nur die Variable ' + vn + ' ist erlaubt.' });
      return res(equationEquivalent(e, parseEq(f.answer), vn) ? max : 0, max);
    }
    case 'text': {
      if (empty) return res(0, max, { empty: true });
      const o = { ci: !!f.ci, noPunct: !!f.noPunct, noComma: !!f.noComma };
      const mine = normText(v, o);
      let good = f.answers.some((a) => normText(a, o) === mine);
      if (!good && ctx.de) {
        const k = deKey(v, o);
        good = f.answers.some((a) => deKey(a, o) === k);
        if (!good) { const sl = deSlip(f, v, o, ctx); if (sl) return res(max, max, { slip: sl }); }
      }
      if (!good && !f.ci) {
        const lo = { ci: true, noPunct: !!f.noPunct, noComma: !!f.noComma };
        if (f.answers.some((a) => normText(a, lo) === normText(v, lo))) return res(0, max, { note: 'Gross- und Kleinschreibung prüfen.' });
      }
      if (!good && !f.noComma) {
        const nc = { ci: !!f.ci, noPunct: !!f.noPunct, noComma: true };
        if (f.answers.some((a) => normText(a, nc) === normText(v, nc))) return res(0, max, { note: 'Wörter stimmen. Kommas prüfen.' });
      }
      return res(good ? max : 0, max);
    }
    case 'mc': return empty && v !== 0 ? res(0, max, { empty: true }) : res(Number(v) === f.answer ? max : 0, max);
    case 'multi': {
      const sel = new Set((v || []).map(Number));
      let good = 0, bad = 0;
      for (const s of sel) (f.answers.includes(s) ? good++ : bad++);
      const pts = Math.max(0, good - bad);
      return res(Math.floor(pts * max / f.answers.length), max, { note: sel.size > f.answers.length ? 'Zu viele Kreuze: Jedes Kreuz zu viel kostet 1 Punkt.' : null });
    }
    case 'classify': {
      const arr = v || [];
      let good = 0; const rows = [];
      f.answers.forEach((a, i) => { const ok = arr[i] != null && Number(arr[i]) === a; rows.push(ok); if (ok) good++; });
      return res(Math.floor(good * max / f.rows.length), max, { rows });
    }
    case 'tokens': {
      const sel = new Set((v || []).map(Number)); const ans = new Set(f.answer);
      const same = sel.size === ans.size && [...ans].every((x) => sel.has(x));
      return res(same ? max : 0, max, { empty: sel.size === 0 });
    }
    case 'gaps': {
      const sel = new Set((v || []).map(Number)); const ans = new Set(f.answer);
      let miss = 0, extra = 0;
      for (const a of ans) if (!sel.has(a)) miss++;
      for (const s of sel) if (!ans.has(s)) extra++;
      if (miss + extra === 0) return res(max, max);
      return res(f.partial ? Math.max(0, max - miss - extra) : 0, max);
    }
    case 'edit': {
      const wrong = f.text.trim().split(/\s+/), right = f.correct.trim().split(/\s+/), mine = String(v == null ? f.text : v).trim().split(/\s+/);
      const { fixed, changes, moved } = editCount(wrong, right, mine);
      const pts = Math.max(0, fixed - Math.max(0, changes - f.errors));
      const notes = [changes > f.errors ? 'Mehr als ' + f.errors + (f.errors === 1 ? ' Änderung' : ' Änderungen') + ': Abzug.' : fixed + ' von ' + f.errors + ' Fehlern verbessert.'];
      if (moved) notes.push(moved === 1 ? '1 Wort hinzugefügt oder gelöscht: zählt als 1 Änderung.' : moved + ' Wörter hinzugefügt oder gelöscht: zählt als ' + moved + ' Änderungen.');
      return res(Math.floor(pts * max / f.errors), max, { note: notes.join(' ') });
    }
    case 'coords': {
      if (!v || v[0] === '' || v[1] === '' || v[0] == null || v[1] == null) return res(0, max, { empty: true });
      const a = parseNumber(v[0]), b = parseNumber(v[1]);
      const good = a.ok && b.ok && Math.abs(a.value - f.answer[0]) < 1e-6 && Math.abs(b.value - f.answer[1]) < 1e-6;
      return res(good ? max : 0, max);
    }
    case 'self': {
      const ticks = (v && v.ticks) || [];
      let pts = 0; f.checklist.forEach((c, i) => { if (ticks[i]) pts += (c.points || 1); });
      return res(pts, max, { self: true });
    }
  }
  return res(0, max);
}

function hasGroup(n) { if (!n) return false; if (n.t === 'grp') return true; return hasGroup(n.a) || hasGroup(n.b); }

// Fehlertext: verbesserte Fehler und Änderungen zählen. Gleich viele Wörter: Wort für Wort.
// Sonst wird die Antwort dem Text zugeordnet; jedes hinzugefügte oder gelöschte Wort ist 1 Änderung.
function editCount(wrong, right, mine) {
  let fixed = 0, changes = 0, moved = 0;
  if (mine.length === wrong.length) {
    for (let i = 0; i < wrong.length; i++) { if (mine[i] !== wrong[i]) changes++; if (wrong[i] !== right[i] && mine[i] === right[i]) fixed++; }
    return { fixed, changes, moved };
  }
  const n = wrong.length, m = mine.length; const cost = (i, j) => (mine[j] === wrong[i] || mine[j] === right[i] ? 0 : 1);
  const D = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) D[i][j] = Math.min(D[i - 1][j - 1] + cost(i - 1, j - 1), D[i - 1][j] + 1, D[i][j - 1] + 1);
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && D[i][j] === D[i - 1][j - 1] + cost(i - 1, j - 1)) { i--; j--; if (mine[j] !== wrong[i]) changes++; if (wrong[i] !== right[i] && mine[j] === right[i]) fixed++; }
    else if (i > 0 && D[i][j] === D[i - 1][j] + 1) { i--; changes++; moved++; }
    else { j--; changes++; moved++; }
  }
  return { fixed, changes, moved };
}

// ---------- Deutsch: kleine Abweichungen ----------
// Was die Aufgabe prüft, bleibt streng. Daneben zählt höchstens 1 kleiner Fehler pro Antwort als richtig (mit Hinweis).
//   word: das Wort ist gefragt (Gegenwort, Oberbegriff, Wortfamilie, Wort im Text): Gross/klein oder 1 Tippfehler ab 5 Buchstaben.
//   form: die Wortform ist gefragt (Steigerung, Verbform, Fall): nur Gross/klein.
//   satz: ein ganzer Satz (umformen, verbinden, Relativsatz): Gross/klein oder 1 Tippfehler in einem Wort, das aus dem
//         Aufgabensatz abgeschrieben ist. Endungen (-e, -en, -em, -er, -es), Wortstellung und Kommas bleiben streng.
// Immer gleichwertig: ae/oe/ue statt ä/ö/ü, ss statt ß, Abstände bei Satzzeichen, Anführungszeichen aussen.
export const DE_TOL = { 'D10.familie': 'word', 'D11.antonym': 'word', 'D12.oberbegriff': 'word', 'D13.zuordnen': 'word', 'D3.umformen': 'satz', 'D8.verbinden': 'satz', 'D9.relativ': 'satz', 'D9.umformen': 'satz' };
const UML = { 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'Ä': 'Ae', 'Ö': 'Oe', 'Ü': 'Ue' };
const umlOut = (t) => t.replace(/[äöüÄÖÜ]/g, (c) => UML[c]);
function deNorm(s, o) {
  return normText(s, o).replace(/^["']+|["']+$/g, '').replace(/\s+([,.;:!?])/g, '$1').replace(/([,;:])(?=[\p{L}\p{N}])/gu, '$1 ').replace(/\s+/g, ' ').trim();
}
const deKey = (s, o) => umlOut(deNorm(s, o));
const TOK = /[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu;
const isWord = (t) => /[\p{L}\p{N}]/u.test(t);
// Damerau-Levenshtein-Abstand (eingeschränkt)
function dl(a, b) {
  const n = a.length, m = b.length; if (Math.abs(n - m) > 1) return 2;
  const D = Array.from({ length: n + 1 }, (_, i) => Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
    D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) D[i][j] = Math.min(D[i][j], D[i - 2][j - 2] + 1);
  }
  return D[n][m];
}
// Liegt der Unterschied in einer Endung wie -e/-en/-em/-er/-es? (Abstand 1 vorausgesetzt)
function endingChange(a, b) {
  const L = a.length >= b.length ? a : b, S = L === a ? b : a; let p = 0;
  while (p < S.length && L[p] === S[p]) p++;
  if (p < L.length - 2) return false;
  const set = 'emnrs';
  if (L.length === S.length) return set.includes(L[p]) && set.includes(S[p]) && (p + 1 >= L.length || L[p + 1] === S[p + 1] || (set.includes(L[p + 1]) && set.includes(S[p + 1])));
  return set.includes(L[p]);
}
function promptWords(task) {
  const html = String(task.html || ''); const parts = [...html.matchAll(/<span class="satz">([\s\S]*?)<\/span>/g)].map((m) => m[1]);
  const txt = (parts.length ? parts.join(' ') : html).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  return new Set((normText(txt).match(TOK) || []).filter(isWord).map((w) => umlOut(w.toLowerCase())));
}
function deSlip(f, v, o, ctx) {
  const kind = ctx.kind || 'form';
  const mine = deNorm(v, o).match(TOK) || [];
  for (const ans of f.answers) {
    const ref = deNorm(ans, o).match(TOK) || [];
    if (ref.length !== mine.length) continue;
    const slips = []; let fail = false;
    for (let i = 0; i < ref.length && !fail; i++) {
      const x = mine[i], y = ref[i];
      if (umlOut(x) === umlOut(y)) continue;
      if (!isWord(x) || !isWord(y)) { fail = true; break; }
      const xl = umlOut(x.toLowerCase()), yl = umlOut(y.toLowerCase());
      if (xl === yl) { slips.push('«' + x + '» schreibt man «' + y + '» (gross/klein).'); continue; }
      if (kind === 'form') { fail = true; break; }
      const d = Math.min(dl(x.toLowerCase(), y.toLowerCase()), dl(xl, yl));
      const caseToo = x[0] !== y[0] && x[0].toLowerCase() === y[0].toLowerCase();
      let ok = d === 1 && !caseToo;
      if (ok && kind === 'word') ok = y.length >= 5;
      if (ok && kind === 'satz') { const pw = ctx.words || new Set(); ok = y.length >= 4 && pw.has(yl) && !pw.has(xl) && !endingChange(x.toLowerCase(), y.toLowerCase()); }
      if (!ok) { fail = true; break; }
      slips.push('Tippfehler: «' + x + '» statt «' + y + '».');
    }
    if (!fail && slips.length === 1) return slips[0];
  }
  return null;
}

function gradeCtx(task) {
  const de = !!(task.skill && task.skill[0] === 'D'); if (!de) return {};
  const kind = DE_TOL[task.key] || 'form';
  return { de, kind, words: kind === 'satz' && task.fields.some((f) => f.type === 'text') ? promptWords(task) : null };
}

export function taskMax(task) { return task.fields.reduce((a, f) => a + fieldMax(f), 0); }

export function gradeTask(task, values = {}, overrides = {}) {
  const ctx = gradeCtx(task);
  const fields = task.fields.map((f) => {
    const r = gradeField(f, values[f.id], ctx);
    if (overrides && overrides[f.id] && f.selfOk) { r.points = r.max; r.ok = true; r.selfRated = true; r.note = null; }
    return r;
  });
  // Gruppen: Den Punkt gibt es nur, wenn alle Felder der Gruppe stimmen (z. B. Objekt und Fall).
  const groups = {};
  task.fields.forEach((f, i) => { if (f.group) (groups[f.group] = groups[f.group] || []).push(i); });
  for (const idxs of Object.values(groups)) {
    const raw = idxs.map((i) => { const f = task.fields[i]; return gradeField(Object.assign({}, f, { points: 1 }), values[f.id], ctx).ok; });
    const all = raw.every(Boolean);
    idxs.forEach((i, k) => { fields[i].ok = raw[k]; fields[i].grouped = true; fields[i].groupOk = all; if (!all) fields[i].points = 0; });
  }
  const points = fields.reduce((a, r) => a + r.points, 0);
  const max = fields.reduce((a, r) => a + r.max, 0);
  return { points, max, ok: points >= max, fields };
}

// Musterlösung eines Felds als Text (für die Rückmeldung)
export function answerText(f) {
  switch (f.type) {
    case 'num': return (f.show != null ? f.show : String(Math.round(f.answer * 1e6) / 1e6)) + (f.unit ? ' ' + f.unit : '') + (f.pct ? ' %' : '');
    case 'expr': return '\\(' + toTex(parse(f.answer)) + '\\)';
    case 'pf': return '\\(' + f.show + '\\)';
    case 'eq': { const e = parseEq(f.answer); return '\\(' + toTex(e.l) + '=' + toTex(e.r) + '\\)'; }
    case 'text': return esc(f.answers[0]) + (f.answers.length > 1 ? ' <span class="muted">(auch: ' + f.answers.slice(1, 4).map(esc).join(' / ') + ')</span>' : '');
    case 'mc': return f.options[f.answer];
    case 'multi': return f.answers.map((i) => f.options[i]).join(', ');
    case 'classify': return f.rows.map((r, i) => r + ' → <b>' + f.cols[f.answers[i]] + '</b>').join('<br>');
    case 'tokens': return f.answer.map((i) => esc(f.tokens[i])).join(' ');
    case 'gaps': return esc(f.tokens.map((t, i) => t + (f.answer.includes(i) ? ',' : '')).join(' '));
    case 'edit': return esc(f.correct);
    case 'coords': return '(' + f.answer[0] + ' | ' + f.answer[1] + ')';
    case 'self': return f.model || '';
  }
  return '';
}

// ---------- Anzeige ----------
// Zeigt in der Aufgabe selbst, was richtig, falsch oder vergessen ist (nicht nur mit Farbe: Zeichen und Text).
function markField(f, e, v) {
  const setMk = (el, kind, label) => {
    el.classList.remove('mk-ok', 'mk-bad', 'mk-miss'); const old = el.querySelector(':scope > .mk'); if (old) old.remove();
    if (!kind) return; el.classList.add('mk-' + kind);
    const t = document.createElement('span'); t.className = 'mk'; t.textContent = label; el.append(t);
  };
  if (f.type === 'mc' && e.list) {
    const mine = v == null || v === '' ? null : Number(v);
    e.list.querySelectorAll('label.choice').forEach((lab, i) => setMk(lab, i === f.answer ? 'ok' : (mine === i ? 'bad' : null), i === f.answer ? (mine === i ? '✓ richtig' : '✓ Lösung') : '✗ deine Wahl'));
  } else if (f.type === 'multi' && e.list) {
    const sel = new Set((v || []).map(Number));
    e.list.querySelectorAll('label.choice').forEach((lab, i) => { const a = f.answers.includes(i); const kind = sel.has(i) ? (a ? 'ok' : 'bad') : (a ? 'miss' : null); setMk(lab, kind, kind === 'ok' ? '✓ richtig' : kind === 'bad' ? '✗ falsch' : 'fehlt'); });
  } else if (f.type === 'classify' && e.tbl) {
    e.tbl.querySelectorAll('tbody tr').forEach((tr, i) => tr.querySelectorAll('td').forEach((td, j) => {
      const mine = v && v[i] != null ? Number(v[i]) : null;
      setMk(td, j === f.answers[i] ? 'ok' : (mine === j ? 'bad' : null), j === f.answers[i] ? (mine === j ? '✓' : '✓ Lösung') : '✗');
    }));
  } else if ((f.type === 'tokens' || f.type === 'gaps') && e.line) {
    const sel = new Set((v || []).map(Number)); const ans = new Set(f.answer);
    e.line.querySelectorAll(f.type === 'tokens' ? '.tok' : '.gap').forEach((b, i) => {
      const kind = sel.has(i) ? (ans.has(i) ? 'ok' : 'bad') : (ans.has(i) ? 'miss' : null);
      const word = kind === 'ok' ? 'richtig' : kind === 'bad' ? 'falsch' : 'fehlt';
      b.classList.remove('mk-ok', 'mk-bad', 'mk-miss'); if (kind) b.classList.add('mk-' + kind);
      b.setAttribute('aria-label', (f.type === 'tokens' ? f.tokens[i] : 'Komma nach «' + f.tokens[i] + '»') + (kind ? ', ' + word : ''));
      b.title = kind ? word : '';
      if (f.type === 'gaps') b.textContent = kind ? ',' : '';
    });
  }
}
// Getippte Antworten mit mehreren Wörtern: abweichende Wörter in beiden Fassungen markieren.
const DTOK = /[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu;
function lcsMarks(a, b, eq) {
  const n = a.length, m = b.length; const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = eq(a[i], b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const ma = new Array(n).fill(false), mb = new Array(m).fill(false); let i = 0, j = 0;
  while (i < n && j < m) { if (eq(a[i], b[j])) { ma[i] = mb[j] = true; i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  return { ma, mb, len: L[0][0] };
}
function textDiff(f, v) {
  const o = { ci: !!f.ci, noPunct: !!f.noPunct, noComma: !!f.noComma };
  const mine = (normText(v, o).match(DTOK) || []);
  let best = null;
  for (const ans of f.answers) {
    const ref = normText(ans, o).match(DTOK) || []; if (ref.filter((t) => /[\p{L}\p{N}]/u.test(t)).length < 2) continue;
    const r = lcsMarks(mine, ref, (x, y) => x === y);
    if (!best || r.len > best.r.len) best = { ref, r, ans };
  }
  if (!best || !mine.length || !best.r.len) return null; // nichts gemeinsam: einfach die Lösung zeigen
  const join = (toks, marks, tag) => toks.map((t, k) => (k && !/^[,.;:!?)]$/.test(t) ? ' ' : '') + (marks[k] ? esc(t) : '<' + tag + ' class="dw">' + esc(t) + '</' + tag + '>')).join('');
  const rest = f.answers.length > 1 ? ' <span class="muted">(auch richtig: ' + f.answers.filter((a) => a !== best.ans).slice(0, 2).map(esc).join(' / ') + ')</span>' : '';
  return '<div class="tdiff"><div><span class="muted">Deine Antwort:</span> ' + join(mine, best.r.ma, 'mark') + '</div><div><span class="muted">Lösung:</span> ' + join(best.ref, best.r.mb, 'b') + rest + '</div></div>';
}

// mountTask baut die Aufgabe in ein Element und gibt Steuerfunktionen zurück.
export function mountTask(task, root, ui, opts = {}) {
  const { h, mathify } = ui;
  const state = {}; const els = {}; const over = {}; let locked = false;
  const changed = () => { if (opts.onChange) opts.onChange(); };
  root.innerHTML = '';
  root.classList.add('task');
  if (task.html) root.append(h('div', { class: 'task-prompt', html: mathify(task.html) }));
  if (task.fig) root.append(h('div', { class: 'task-fig', html: task.fig }));

  for (const f of task.fields) {
    const wrap = h('div', { class: 'field field-' + f.type, dataset: { fid: f.id } });
    const lab = f.label ? h('div', { class: 'field-label', html: mathify(f.label) }) : null;
    if (lab) { lab.id = 'lab-' + task.seed + '-' + f.id; wrap.append(lab); }
    const fb = h('div', { class: 'field-fb', 'aria-live': 'polite' });
    els[f.id] = { wrap, fb };

    if (f.type === 'num' || f.type === 'expr' || f.type === 'eq' || f.type === 'text' || f.type === 'pf') {
      const input = h(f.long ? 'textarea' : 'input', { type: f.long ? null : 'text', class: 'inp' + (f.type === 'text' ? ' inp-text' : ' inp-math'), autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', rows: f.long ? 2 : null,
        'aria-labelledby': lab ? lab.id : null, 'aria-label': lab ? null : (f.aria || 'Antwort'), placeholder: f.placeholder || (f.type === 'eq' ? 'z. B. 3x + 5 = 20' : f.type === 'expr' ? 'z. B. 3x^2 - 2x' : f.type === 'pf' ? 'z. B. 2^3*5' : '') });
      const preview = h('div', { class: 'preview', 'aria-hidden': 'true' });
      input.addEventListener('input', () => {
        state[f.id] = input.value;
        if (f.type === 'expr' || f.type === 'eq' || f.type === 'pf') {
          let t = '';
          try { if (input.value.trim()) { if (f.type === 'eq') { const e = parseEq(input.value); t = toTex(e.l) + '=' + toTex(e.r); } else t = toTex(parse(input.value)); } } catch (e) { t = ''; }
          preview.innerHTML = t ? mathify('\\(' + t + '\\)') : (input.value.trim() ? '<span class="muted">… noch nicht lesbar</span>' : '');
        }
        changed();
      });
      const row = h('div', { class: 'inp-row' }, f.pre ? h('span', { class: 'inp-pre', html: mathify(f.pre) }) : null, input, f.unit ? h('span', { class: 'inp-unit', html: mathify(f.unit) }) : null, f.pct ? h('span', { class: 'inp-unit' }, '%') : null);
      wrap.append(row);
      if (f.type === 'expr' || f.type === 'eq' || f.type === 'pf') wrap.append(preview);
      els[f.id].input = input;
      els[f.id].set = (v) => { input.value = v || ''; input.dispatchEvent(new Event('input')); };
    } else if (f.type === 'mc') {
      const name = 'mc-' + task.seed + '-' + f.id + '-' + Math.random().toString(36).slice(2, 6);
      const list = h('div', { class: 'choices', role: 'radiogroup', 'aria-labelledby': lab ? lab.id : null });
      f.options.forEach((o, i) => {
        const r = h('input', { type: 'radio', name, value: i, onchange: () => { state[f.id] = i; changed(); } });
        list.append(h('label', { class: 'choice' }, r, h('span', { class: 'choice-key' }, String(i + 1)), h('span', { html: mathify(o) })));
      });
      wrap.append(list); els[f.id].list = list;
      els[f.id].set = (v) => { state[f.id] = v; list.querySelectorAll('input').forEach((r, i) => { r.checked = i === v; }); };
    } else if (f.type === 'multi') {
      state[f.id] = [];
      const list = h('div', { class: 'choices grid', role: 'group', 'aria-labelledby': lab ? lab.id : null });
      f.options.forEach((o, i) => {
        const c = h('input', { type: 'checkbox', value: i, onchange: () => { const s = new Set(state[f.id]); c.checked ? s.add(i) : s.delete(i); state[f.id] = [...s]; changed(); } });
        list.append(h('label', { class: 'choice' }, c, h('span', { html: mathify(o) })));
      });
      wrap.append(h('p', { class: 'hint' }, 'Wähle genau ' + f.answers.length + '. Jedes Kreuz zu viel kostet 1 Punkt.'), list);
      els[f.id].list = list;
      els[f.id].set = (v) => { state[f.id] = v || []; list.querySelectorAll('input').forEach((r, i) => { r.checked = (v || []).includes(i); }); };
    } else if (f.type === 'classify') {
      state[f.id] = f.rows.map(() => null);
      const tbl = h('table', { class: 'classify' });
      tbl.append(h('thead', null, h('tr', null, h('th', null, ''), f.cols.map((c) => h('th', { scope: 'col' }, c)))));
      const tb = h('tbody');
      f.rows.forEach((r, i) => {
        const name = 'cl-' + task.seed + '-' + f.id + '-' + i + '-' + Math.random().toString(36).slice(2, 6);
        tb.append(h('tr', null, h('th', { scope: 'row', html: mathify(r) }), f.cols.map((c, j) =>
          h('td', null, h('input', { type: 'radio', name, 'aria-label': c, onchange: () => { state[f.id][i] = j; changed(); } })))));
      });
      tbl.append(tb); wrap.append(h('div', { class: 'table-scroll' }, tbl)); els[f.id].tbl = tbl;
      els[f.id].set = (v) => { state[f.id] = v || []; tb.querySelectorAll('tr').forEach((tr, i) => tr.querySelectorAll('input').forEach((r, j) => { r.checked = (v || [])[i] === j; })); };
    } else if (f.type === 'tokens') {
      state[f.id] = [];
      const line = h('div', { class: 'tokens', role: 'group', 'aria-labelledby': lab ? lab.id : null });
      f.tokens.forEach((t, i) => {
        const b = h('button', { type: 'button', class: 'tok', 'aria-pressed': 'false', onclick: () => {
          if (locked) return; const s = new Set(state[f.id]); s.has(i) ? s.delete(i) : s.add(i); state[f.id] = [...s].sort((a, b2) => a - b2);
          b.setAttribute('aria-pressed', String(s.has(i))); changed(); } }, t);
        line.append(b);
      });
      wrap.append(line); els[f.id].line = line;
      els[f.id].set = (v) => { state[f.id] = v || []; line.querySelectorAll('.tok').forEach((b, i) => b.setAttribute('aria-pressed', String((v || []).includes(i)))); };
    } else if (f.type === 'gaps') {
      state[f.id] = [];
      const line = h('div', { class: 'gaps', role: 'group', 'aria-labelledby': lab ? lab.id : null });
      f.tokens.forEach((t, i) => {
        line.append(h('span', { class: 'gap-word' }, t));
        if (i < f.tokens.length - 1) {
          const g = h('button', { type: 'button', class: 'gap', 'aria-pressed': 'false', 'aria-label': 'Komma nach «' + t + '»', onclick: () => {
            if (locked) return; const s = new Set(state[f.id]); s.has(i) ? s.delete(i) : s.add(i); state[f.id] = [...s].sort((a, b2) => a - b2);
            g.setAttribute('aria-pressed', String(s.has(i))); g.textContent = s.has(i) ? ',' : ''; changed(); } }, '');
          line.append(g);
        }
      });
      wrap.append(h('p', { class: 'hint' }, 'Klicke zwischen zwei Wörter, um ein Komma zu setzen.'), line); els[f.id].line = line;
      els[f.id].set = (v) => { state[f.id] = v || []; line.querySelectorAll('.gap').forEach((g, i) => { const on = (v || []).includes(i); g.setAttribute('aria-pressed', String(on)); g.textContent = on ? ',' : ''; }); };
    } else if (f.type === 'edit') {
      const ta = h('textarea', { class: 'inp inp-edit', rows: Math.max(4, Math.ceil(f.text.length / 70)), spellcheck: 'false', 'aria-labelledby': lab ? lab.id : null });
      ta.value = f.text; state[f.id] = f.text;
      ta.addEventListener('input', () => { state[f.id] = ta.value; changed(); });
      wrap.append(h('p', { class: 'hint' }, 'Verbessere direkt im Text. Der Text enthält ' + f.errors + ' Fehler.'), ta); els[f.id].input = ta;
      els[f.id].set = (v) => { ta.value = v == null ? f.text : v; state[f.id] = ta.value; };
    } else if (f.type === 'coords') {
      state[f.id] = ['', ''];
      const a = h('input', { type: 'text', class: 'inp inp-math short', 'aria-label': 'x-Koordinate', oninput: () => { state[f.id][0] = a.value; changed(); } });
      const b = h('input', { type: 'text', class: 'inp inp-math short', 'aria-label': 'y-Koordinate', oninput: () => { state[f.id][1] = b.value; changed(); } });
      wrap.append(h('div', { class: 'inp-row' }, h('span', { class: 'inp-pre' }, '('), a, h('span', { class: 'inp-pre' }, '|'), b, h('span', { class: 'inp-pre' }, ')')));
      els[f.id].input = a;
      els[f.id].set = (v) => { state[f.id] = v || ['', '']; a.value = state[f.id][0]; b.value = state[f.id][1]; };
    } else if (f.type === 'self') {
      state[f.id] = { text: '', ticks: f.checklist.map(() => false) };
      if (f.write !== false) {
        const ta = h('textarea', { class: 'inp inp-text', rows: f.rows || 3, 'aria-labelledby': lab ? lab.id : null, placeholder: f.placeholder || 'Deine Antwort (wird nicht automatisch bewertet)' });
        ta.addEventListener('input', () => { state[f.id].text = ta.value; changed(); });
        wrap.append(ta); els[f.id].input = ta;
      } else if (f.paper) wrap.append(h('p', { class: 'paper-note' }, 'Löse diese Aufgabe auf Papier. Danach vergleichst du mit der Lösung.'));
      const box = h('div', { class: 'selfcheck', hidden: true });
      els[f.id].box = box; wrap.append(box);
      els[f.id].set = (v) => { state[f.id] = v || state[f.id]; if (els[f.id].input) els[f.id].input.value = state[f.id].text || ''; };
    }
    wrap.append(fb);
    root.append(wrap);
  }

  function showSelf(f) {
    const e = els[f.id]; if (!e.box || !e.box.hidden) return;
    e.box.hidden = false;
    e.box.append(h('div', { class: 'model' }, h('strong', null, 'Musterlösung'), h('div', { html: mathify(f.model || '') })));
    e.box.append(h('p', { class: 'hint' }, 'Kreuze ehrlich an, was bei dir stimmt.'));
    f.checklist.forEach((c, i) => {
      const cb = h('input', { type: 'checkbox', onchange: () => { state[f.id].ticks[i] = cb.checked; changed(); } });
      cb.checked = !!state[f.id].ticks[i];
      e.box.append(h('label', { class: 'choice' }, cb, h('span', { html: mathify(c.text) }), h('span', { class: 'pts' }, (c.points || 1) + ' P')));
    });
  }

  return {
    values: () => JSON.parse(JSON.stringify(state)),
    setValues(vals) { for (const f of task.fields) if (vals && vals[f.id] !== undefined && els[f.id].set) els[f.id].set(vals[f.id]); },
    hasSelf: () => task.fields.some((f) => f.type === 'self'),
    revealSelf() { task.fields.filter((f) => f.type === 'self').forEach(showSelf); },
    focusFirst() { const first = root.querySelector('input,textarea,button.tok,button.gap'); if (first) first.focus(); },
    lock() { locked = true; root.querySelectorAll('input,textarea').forEach((x) => { if (!x.closest('.selfcheck') && !x.closest('.override')) x.disabled = true; }); },
    overrides: () => Object.assign({}, over),
    // Rückmeldung je Feld anzeigen. o.noOverride: kein Häkchen «gleichwertig» (z. B. in der Auswertung des Einstufungstests)
    show(result, answerHtml, o = {}) {
      task.fields.forEach((f, i) => {
        const r = result.fields[i]; const e = els[f.id];
        e.wrap.classList.remove('ok', 'bad', 'part');
        e.wrap.classList.add(r.ok ? 'ok' : (r.points > 0 ? 'part' : 'bad'));
        const parts = []; let diff = null;
        if (f.type !== 'self') {
          if (r.selfRated) parts.push('<b>Als gleichwertig gewertet</b> (selbst bewertet).');
          else if (r.slip) parts.push('<b>Richtig, mit 1 kleinen Fehler.</b> Zählt als richtig.');
          else parts.push(r.ok ? '<b>Richtig.</b>' : (r.points > 0 ? '<b>Teilweise richtig</b> (' + r.points + ' von ' + r.max + ' P).' : (r.empty ? '<b>Keine Antwort.</b>' : '<b>Nicht richtig.</b>')));
          if (r.grouped && r.ok && !r.groupOk) parts.push('Der Punkt zählt nur, wenn alle Teile stimmen.');
          if (r.slip) parts.push(esc(r.slip));
          if (r.note) parts.push(esc(r.note));
          if (!r.ok && answerHtml !== false) {
            diff = f.type === 'text' && !r.empty ? textDiff(f, state[f.id]) : null;
            if (!diff) parts.push('Lösung: ' + answerText(f));
          }
        } else parts.push('<b>' + r.points + ' von ' + r.max + ' P</b> (selbst bewertet)');
        e.fb.innerHTML = mathify(parts.join(' ')) + (diff || '');
        if (answerHtml !== false) markField(f, e, state[f.id]);
        if (f.selfOk && !r.ok && !r.empty && answerHtml !== false && !e.over && !o.noOverride) {
          const cb = h('input', { type: 'checkbox', onchange: () => { over[f.id] = cb.checked; changed(); } });
          e.over = h('label', { class: 'choice override' }, cb, h('span', null, 'Meine Antwort ist gleichwertig (Inhalt, Form und Kommas stimmen). Als richtig werten.'));
          e.wrap.append(e.over);
        }
        if (f.type === 'classify' && r.rows) e.tbl.querySelectorAll('tbody tr').forEach((tr, k) => { tr.classList.remove('row-ok', 'row-bad'); tr.classList.add(r.rows[k] ? 'row-ok' : 'row-bad'); });
      });
    }
  };
}
