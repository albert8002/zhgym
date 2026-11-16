// Oberfläche: Bausteine für HTML, Formeln, Dialoge, Hinweise, Vorlesen.
import { esc } from './util.js';

export function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

// Formeln: \( ... \) im Text wird mit KaTeX gesetzt.
export function mathify(html) {
  if (html == null) return '';
  const K = globalThis.katex;
  return String(html).replace(/\\\[([\s\S]+?)\\\]/g, (m, t) => {
    if (!K) return '<code>' + esc(t) + '</code>';
    try { return K.renderToString(t, { throwOnError: false, displayMode: true }); } catch (e) { return esc(t); }
  }).replace(/\\\(([\s\S]+?)\\\)/g, (m, t) => {
    if (!K) return '<code>' + esc(t) + '</code>';
    try { return K.renderToString(t, { throwOnError: false }); } catch (e) { return esc(t); }
  });
}
export const mhtml = (tag, html, cls) => h(tag, { class: cls || null, html: mathify(html) });

const ICONS = {
  home: 'M3 11l9-8 9 8v10h-6v-6H9v6H3z',
  filter: 'M3 4h18l-7 8.5V18l-4 2v-7.5z',
  book: 'M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7z',
  loop: 'M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3',
  bolt: 'M13 2L4 14h6l-1 8 9-12h-6z',
  exam: 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8M9 9h2',
  seal: 'M12 2l2.4 2.6 3.5-.4.6 3.5 3 1.8-1.5 3.2 1.5 3.2-3 1.8-.6 3.5-3.5-.4L12 23l-2.4-2.6-3.5.4-.6-3.5-3-1.8L4 12.3 2.5 9.1l3-1.8.6-3.5 3.5.4zM8.5 12.5l2.5 2.5 4.5-5',
  pen: 'M3 21l1-5L16 4l4 4L8 20zM14 6l4 4',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  heft: 'M6 2h13v20H6zM6 2v20M3 6h3M3 10h3M3 14h3M3 18h3M10 8h6M10 12h6',
  cal: 'M4 5h16v16H4zM4 9h16M8 3v4M16 3v4',
  box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  calc: 'M5 2h14v20H5zM8 6h8v3H8zM8 13h2M12 13h1M15 13h1M8 17h2M12 17h1M15 17h1',
  gear: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  check: 'M4 12l5 5L20 6',
  cross: 'M5 5l14 14M19 5L5 19',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  sound: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 018 0v4',
  down: 'M12 3v12M7 10l5 5 5-5M4 21h16',
  up: 'M12 21V9M7 14l5-5 5 5M4 3h16',
  plus: 'M12 5v14M5 12h14',
  info: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5v.5',
  warn: 'M12 3l10 18H2zM12 10v5M12 17.5v.5',
  flag: 'M5 22V3M5 4h13l-3 4 3 4H5',
  user: 'M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c0-4 4-6 8-6s8 2 8 6',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14',
  play: 'M7 4l13 8-13 8z',
  help: 'M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9a2.5 2.5 0 015 0c0 2-2.5 2-2.5 4M12 17v.5',
  search: 'M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15.5 15.5L21 21',
  print: 'M6 9V3h12v6M6 18H3v-8h18v8h-3M6 14h12v7H6z',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z'
};
export function icon(name, size = 20) {
  const d = ICONS[name] || ICONS.info;
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', size); s.setAttribute('height', size);
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.8');
  s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.setAttribute('aria-hidden', 'true');
  s.classList.add('icon');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); s.append(p);
  return s;
}

export function btn(label, onClick, opts = {}) {
  const b = h('button', { type: 'button', class: 'btn ' + (opts.kind || ''), onclick: onClick, title: opts.title || null, disabled: opts.disabled || null, 'aria-label': opts.aria || null },
    opts.icon ? icon(opts.icon, opts.iconSize || 18) : null, label ? h('span', null, label) : null);
  return b;
}

let toastBox = null;
export function toast(msg, kind = 'info', ms = 4200) {
  if (!toastBox) { toastBox = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' }); document.body.append(toastBox); }
  const t = h('div', { class: 'toast ' + kind }, msg);
  toastBox.append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms);
}

// Dialogfenster. Gibt ein Promise zurück, das mit dem Wert des gedrückten Knopfs endet.
export function modal({ title, body, actions, wide, dismissable = true }) {
  return new Promise((resolve) => {
    const prev = document.activeElement;
    const close = (v) => { ov.remove(); document.removeEventListener('keydown', onKey, true); if (prev && prev.focus) prev.focus(); resolve(v); };
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissable) { e.stopPropagation(); close(null); }
      if (e.key === 'Tab') {
        const f = [...box.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const foot = h('div', { class: 'modal-foot' }, (actions || [{ label: 'Schliessen', value: true, kind: 'primary' }]).map((a) =>
      btn(a.label, () => close(typeof a.value === 'function' ? a.value() : a.value), { kind: a.kind || '' })));
    const box = h('div', { class: 'modal' + (wide ? ' wide' : ''), role: 'dialog', 'aria-modal': 'true', 'aria-label': title },
      h('h2', null, title), h('div', { class: 'modal-body' }, body), foot);
    const ov = h('div', { class: 'overlay', onmousedown: (e) => { if (e.target === ov && dismissable) close(null); } }, box);
    document.body.append(ov);
    document.addEventListener('keydown', onKey, true);
    const f = box.querySelector('[autofocus]') || foot.querySelector('.primary') || foot.querySelector('button');
    if (f) f.focus();
  });
}
export const confirmBox = (title, text, yes = 'Ja', no = 'Abbrechen', danger = false) =>
  modal({ title, body: h('p', null, text), actions: [{ label: no, value: false }, { label: yes, value: true, kind: danger ? 'danger' : 'primary' }] });

// Vorlesen (Windows-Stimmen, offline)
export function speak(text) {
  try {
    const sy = window.speechSynthesis; if (!sy) return false;
    sy.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, ' '));
    const vs = sy.getVoices();
    if (!vs.length) { toast('Keine Stimme zum Vorlesen gefunden. Windows: unter Einstellungen → Zeit und Sprache → Sprache eine deutsche Stimme hinzufügen. Linux: das Paket «speech-dispatcher» (mit espeak-ng) installieren.', 'bad', 9000); return false; }
    u.voice = vs.find((v) => /de[-_]CH/i.test(v.lang)) || vs.find((v) => /^de/i.test(v.lang)) || null;
    if (!u.voice) toast('Keine deutsche Stimme gefunden. Es wird eine andere Stimme verwendet.', 'info', 5000);
    u.lang = u.voice ? u.voice.lang : 'de-CH'; u.rate = 0.95;
    sy.speak(u); return true;
  } catch (e) { return false; }
}
export const stopSpeak = () => { try { window.speechSynthesis.cancel(); } catch (e) {} };

// Fortschrittsbalken und Ringe
export function bar(value, max = 1, cls = '', label = '') {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return h('div', { class: 'bar ' + cls, role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(pct), 'aria-label': label || null },
    h('div', { class: 'bar-fill', style: { width: pct + '%' } }));
}

export function field(label, control, hint) {
  const id = 'f' + Math.random().toString(36).slice(2, 9);
  if (control && control.setAttribute && !control.id) control.id = id;
  return h('div', { class: 'form-row' }, h('label', { for: control.id || id }, label), control, hint ? h('p', { class: 'hint' }, hint) : null);
}

export function emptyState(title, text, action) {
  return h('div', { class: 'empty' }, h('h3', null, title), h('p', null, text), action || null);
}

export function tabs(items, active, onPick) {
  return h('div', { class: 'tabs', role: 'tablist' }, items.map((it) =>
    h('button', { type: 'button', role: 'tab', 'aria-selected': String(it.id === active), class: 'tab' + (it.id === active ? ' on' : ''), onclick: () => onPick(it.id) }, it.label)));
}

export function saveText(name, content, mime = 'text/plain') {
  if (window.gymi && window.gymi.fileSave) {
    const ext = (name.split('.').pop() || 'txt');
    return window.gymi.fileSave({ defaultName: name, content, filters: [{ name: ext.toUpperCase(), extensions: [ext] }] });
  }
  const a = h('a', { href: URL.createObjectURL(new Blob([content], { type: mime })), download: name });
  document.body.append(a); a.click(); a.remove();
  return Promise.resolve({ ok: true });
}

// Lineal mit Leuchtstift: zeigt einen Anteil von 0 bis 1.
export function ruler(value, opts = {}) {
  const pct = Math.max(0, Math.min(100, (value || 0) * 100));
  const el = h('div', { class: 'ruler' + (opts.mini ? ' mini' : ''), role: 'img', 'aria-label': (opts.label || 'Bereitschaft') + ': ' + Math.round(pct) + ' Prozent' },
    h('div', { class: 'ruler-body' }, h('div', { class: 'ruler-fill', style: { width: pct + '%' } }), h('div', { class: 'ruler-ticks' })));
  if (!opts.mini) {
    [0, 25, 50, 75, 100].forEach((n) => el.append(h('span', { class: 'ruler-num' + (n === 0 ? ' start' : n === 100 ? ' end' : ''), style: { left: n + '%' } }, n + ' %')));
    if (opts.flag != null) el.append(h('span', { class: 'ruler-flag', style: { left: opts.flag * 100 + '%' } }, opts.flagLabel || ''));
  }
  return el;
}

// Liniendiagramm für Verläufe (z. B. Noten der Simulationen). points: [{x: Text, y: Zahl}]
export function lineChart(points, opts = {}) {
  const W = opts.w || 520, H = opts.h || 170, L = 34, B = 24, T = 10, R = 10;
  const ys = points.map((p) => p.y); const min = opts.min != null ? opts.min : Math.min(...ys), max = opts.max != null ? opts.max : Math.max(...ys);
  const X = (i) => L + (points.length <= 1 ? (W - L - R) / 2 : i * (W - L - R) / (points.length - 1)), Y = (v) => T + (max - v) / (max - min || 1) * (H - T - B);
  let s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + (opts.label || 'Verlauf') + '">';
  const ticks = opts.ticks || [min, (min + max) / 2, max];
  ticks.forEach((t) => { s += '<line class="axis" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(t) + '" y2="' + Y(t) + '"/><text x="' + (L - 6) + '" y="' + (Y(t) + 4) + '" text-anchor="end">' + (Math.round(t * 100) / 100) + '</text>'; });
  if (opts.goal != null) s += '<line class="goal" x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(opts.goal) + '" y2="' + Y(opts.goal) + '"/><text x="' + (W - R) + '" y="' + (Y(opts.goal) - 4) + '" text-anchor="end">' + (opts.goalLabel || '') + '</text>';
  if (points.length > 1) s += '<polyline class="ln" points="' + points.map((p, i) => X(i) + ',' + Y(p.y)).join(' ') + '"/>';
  points.forEach((p, i) => { s += '<circle class="pt" cx="' + X(i) + '" cy="' + Y(p.y) + '" r="3.5"><title>' + esc(p.x + ': ' + p.y) + '</title></circle>'; if (points.length <= 10 || i % Math.ceil(points.length / 8) === 0) s += '<text x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(p.x) + '</text>'; });
  s += '</svg>';
  const d = h('div', { class: 'table-scroll', html: s }); return d;
}
// Säulen für Minuten pro Tag
export function barsChart(items, opts = {}) {
  const W = opts.w || 520, H = opts.h || 130, L = 30, B = 22, T = 8; const max = Math.max(opts.goal || 0, ...items.map((i) => i.y), 1); const bw = (W - L - 6) / items.length;
  let s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + (opts.label || 'Säulen') + '">';
  s += '<line class="axis" x1="' + L + '" x2="' + W + '" y1="' + (H - B) + '" y2="' + (H - B) + '"/><text x="' + (L - 5) + '" y="' + (T + 8) + '" text-anchor="end">' + Math.round(max) + '</text>';
  items.forEach((it, i) => { const hh = it.y / max * (H - B - T); s += '<rect class="bars" x="' + (L + i * bw + bw * 0.15) + '" y="' + (H - B - hh) + '" width="' + bw * 0.7 + '" height="' + hh + '" rx="2"><title>' + esc(it.x + ': ' + Math.round(it.y) + ' Min.') + '</title></rect>'; if (items.length <= 14 || i % 2 === 0) s += '<text x="' + (L + i * bw + bw / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + esc(it.x) + '</text>'; });
  if (opts.goal) { const y = H - B - opts.goal / max * (H - B - T); s += '<line class="goal" x1="' + L + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/>'; }
  return h('div', { class: 'table-scroll', html: s + '</svg>' });
}
