// Zeichnungen für Aufgaben als SVG-Text (Farben kommen aus dem Stylesheet).
const r1 = (v) => Math.round(v * 10) / 10;

export function svg(w, h, body, label = 'Figur') {
  return '<svg class="fig" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + label + '">' + body + '</svg>';
}
export const line = (x1, y1, x2, y2, cls = 'fg-line') => '<line class="' + cls + '" x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '"/>';
export const poly = (pts, cls = 'fg-shape') => '<polygon class="' + cls + '" points="' + pts.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ') + '"/>';
export const pline = (pts, cls = 'fg-line') => '<polyline class="' + cls + '" fill="none" points="' + pts.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ') + '"/>';
export const circle = (x, y, r, cls = 'fg-line') => '<circle class="' + cls + '" cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '"/>';
export const dot = (x, y, cls = 'fg-dot', r = 3.2) => '<circle class="' + cls + '" cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r + '"/>';
export const text = (x, y, s, cls = 'fg-text', anchor = 'middle') => '<text class="' + cls + '" x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + anchor + '">' + s + '</text>';
export const rect = (x, y, w, h, cls = 'fg-shape') => '<rect class="' + cls + '" x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '"/>';

// Rechter-Winkel-Zeichen bei Punkt p zwischen den Richtungen zu a und b
export function rightAngle(p, a, b, s = 10) {
  const u = unit(sub(a, p)), v = unit(sub(b, p));
  const p1 = [p[0] + u[0] * s, p[1] + u[1] * s], p2 = [p1[0] + v[0] * s, p1[1] + v[1] * s], p3 = [p[0] + v[0] * s, p[1] + v[1] * s];
  return pline([p1, p2, p3], 'fg-thin');
}
// Winkelbogen bei p von Richtung a nach Richtung b mit Beschriftung
export function angleArc(p, a, b, label, rad = 22) {
  const u = unit(sub(a, p)), v = unit(sub(b, p));
  const s = [p[0] + u[0] * rad, p[1] + u[1] * rad], e = [p[0] + v[0] * rad, p[1] + v[1] * rad];
  const cross = u[0] * v[1] - u[1] * v[0];
  const m = unit([u[0] + v[0], u[1] + v[1]]);
  const lp = [p[0] + m[0] * (rad + 13), p[1] + m[1] * (rad + 13) + 4];
  return '<path class="fg-thin" fill="none" d="M' + r1(s[0]) + ' ' + r1(s[1]) + ' A' + rad + ' ' + rad + ' 0 0 ' + (cross > 0 ? 1 : 0) + ' ' + r1(e[0]) + ' ' + r1(e[1]) + '"/>' + (label ? text(lp[0], lp[1], label, 'fg-text small') : '');
}
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const unit = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
export const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
// Beschriftung neben der Strecke a–b (nach aussen versetzt, weg vom Punkt c)
export function sideLabel(a, b, away, s, off = 14) {
  const m = mid(a, b); const n = unit([-(b[1] - a[1]), b[0] - a[0]]);
  const sign = ((m[0] + n[0] - away[0]) ** 2 + (m[1] + n[1] - away[1]) ** 2) > ((m[0] - n[0] - away[0]) ** 2 + (m[1] - n[1] - away[1]) ** 2) ? 1 : -1;
  return text(m[0] + n[0] * off * sign, m[1] + n[1] * off * sign + 4, s);
}
export function vertexLabel(p, centroid, s, off = 14) {
  const u = unit(sub(p, centroid));
  return text(p[0] + u[0] * off, p[1] + u[1] * off + 4, s, 'fg-text bold');
}

// Koordinatensystem mit Gitter. Gibt Umrechner und SVG-Teile zurück.
export function grid(xmin, xmax, ymin, ymax, cell = 22, pad = 26) {
  const W = (xmax - xmin) * cell + pad * 2, H = (ymax - ymin) * cell + pad * 2;
  const X = (x) => pad + (x - xmin) * cell, Y = (y) => pad + (ymax - y) * cell;
  let s = '';
  for (let x = xmin; x <= xmax; x++) s += line(X(x), Y(ymin), X(x), Y(ymax), x === 0 ? 'fg-axis' : 'fg-grid');
  for (let y = ymin; y <= ymax; y++) s += line(X(xmin), Y(y), X(xmax), Y(y), y === 0 ? 'fg-axis' : 'fg-grid');
  for (let x = xmin; x <= xmax; x++) if (x !== 0 && x % 1 === 0 && (xmax - xmin <= 14 || x % 2 === 0)) s += text(X(x), Y(0) + 15, String(x).replace('-', '−'), 'fg-text tiny');
  for (let y = ymin; y <= ymax; y++) if (y !== 0 && (ymax - ymin <= 14 || y % 2 === 0)) s += text(X(0) - 7, Y(y) + 4, String(y).replace('-', '−'), 'fg-text tiny', 'end');
  s += text(X(xmax) + 12, Y(0) + 4, 'x', 'fg-text small') + text(X(0), Y(ymax) - 10, 'y', 'fg-text small');
  return { W, H, X, Y, body: s };
}

// Diagramm-Achsen für Graphen (t nach rechts, Wert nach oben)
export function axes(w, h, xlab, ylab, pad = 34) {
  const x0 = pad, y0 = h - pad, x1 = w - 12, y1 = 12;
  return { x0, y0, x1, y1, body: line(x0, y0, x1, y0, 'fg-axis') + line(x0, y0, x0, y1, 'fg-axis') + text(x1, y0 + 18, xlab, 'fg-text small', 'end') + text(x0 - 6, y1 + 4, ylab, 'fg-text small', 'end') };
}

// Würfelgebäude in Schrägansicht. heights[y][x], y = 0 hinten.
export function cubes(heights, s = 24) {
  const rows = heights.length, cols = heights[0].length;
  const dx = s * 0.5, dy = s * 0.35; // Versatz nach hinten
  const maxH = Math.max(...heights.flat(), 1);
  const W = cols * s + rows * dx + 16, H = maxH * s + rows * dy + 20;
  const ox = 8, oy = H - 10;
  let body = '';
  // von hinten nach vorne, links nach rechts, unten nach oben
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) for (let z = 0; z < heights[y][x]; z++) {
    const depth = rows - 1 - y; // 0 = vorne
    const bx = ox + x * s + depth * dx, by = oy - z * s - depth * dy;
    const f = [[bx, by], [bx + s, by], [bx + s, by - s], [bx, by - s]];
    const top = [[bx, by - s], [bx + s, by - s], [bx + s + dx, by - s - dy], [bx + dx, by - s - dy]];
    const side = [[bx + s, by], [bx + s + dx, by - dy], [bx + s + dx, by - s - dy], [bx + s, by - s]];
    body += poly(top, 'cube-top') + poly(side, 'cube-side') + poly(f, 'cube-front');
  }
  return svg(W, H, body, 'Würfelgebäude');
}

// Raster-Ansicht (für Ansichten von oben / vorne / rechts): cells[row][col] = true/false
export function viewGrid(cells, s = 16) {
  const rows = cells.length, cols = cells[0].length;
  let body = '';
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) body += rect(2 + x * s, 2 + y * s, s, s, cells[y][x] ? 'cell-on' : 'cell-off');
  return svg(cols * s + 4, rows * s + 4, body, 'Ansicht');
}

// Netz aus Quadraten: Liste von [x, y]
export function net(cellsList, s = 22) {
  const xs = cellsList.map((c) => c[0]), ys = cellsList.map((c) => c[1]);
  const minx = Math.min(...xs), miny = Math.min(...ys), w = Math.max(...xs) - minx + 1, hgt = Math.max(...ys) - miny + 1;
  let body = '';
  for (const [x, y] of cellsList) body += rect(3 + (x - minx) * s, 3 + (y - miny) * s, s, s, 'cell-net');
  return svg(w * s + 6, hgt * s + 6, body, 'Netz');
}

// Säulendiagramm
export function barChart(labels, values, unitLabel = '') {
  const W = 360, H = 220, pad = 40, bw = (W - pad - 16) / labels.length;
  const max = Math.max(...values); const step = niceStep(max); const top = Math.ceil(max / step) * step;
  const Y = (v) => H - 34 - (v / top) * (H - 60);
  let body = '';
  for (let v = 0; v <= top + 1e-9; v += step) body += line(pad, Y(v), W - 8, Y(v), 'fg-grid') + text(pad - 6, Y(v) + 4, String(v), 'fg-text tiny', 'end');
  labels.forEach((l, i) => {
    const x = pad + i * bw + bw * 0.18;
    body += rect(x, Y(values[i]), bw * 0.64, H - 34 - Y(values[i]), 'bar-rect') + text(x + bw * 0.32, H - 18, l, 'fg-text tiny');
  });
  body += line(pad, H - 34, W - 8, H - 34, 'fg-axis') + line(pad, H - 34, pad, 14, 'fg-axis');
  if (unitLabel) body += text(pad, 10, unitLabel, 'fg-text tiny', 'start');
  return svg(W, H, body, 'Säulendiagramm');
}
function niceStep(max) { const raw = max / 5; const p = 10 ** Math.floor(Math.log10(raw)); const m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }

// Kreisdiagramm mit Sektoren (Anteile in Prozent), Muster statt nur Farbe
export function pieChart(labels, percents) {
  const cx = 110, cy = 110, R = 92; let a = -Math.PI / 2; let body = '';
  percents.forEach((p, i) => {
    const b = a + (p / 100) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a), x2 = cx + R * Math.cos(b), y2 = cy + R * Math.sin(b);
    body += '<path class="pie pie-' + (i % 5) + '" d="M' + cx + ' ' + cy + ' L' + r1(x1) + ' ' + r1(y1) + ' A' + R + ' ' + R + ' 0 ' + (p > 50 ? 1 : 0) + ' 1 ' + r1(x2) + ' ' + r1(y2) + ' Z"/>';
    const m = (a + b) / 2;
    body += text(cx + R * 0.62 * Math.cos(m), cy + R * 0.62 * Math.sin(m) + 4, labels[i], 'fg-text small bold');
    a = b;
  });
  return svg(220, 220, body, 'Kreisdiagramm');
}
