// Procedural pixel-art heroes: each frame is drawn on a tiny 64x46 canvas, outlined, then scaled up with no smoothing.
export const SW = 64, SH = 48, AX = 28, AY = 48;
const R = (g, c, x, y, w, h) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
function L(g, c, x0, y0, x1, y1, t) {
  g.fillStyle = c; const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) g.fillRect(Math.round(x0 + (x1 - x0) * i / n - t / 2), Math.round(y0 + (y1 - y0) * i / n - t / 2), t, t);
}
function arm(g, sx, sy, hx, hy, sleeve, skin, full) {
  const mx = (sx + hx) / 2, my = (sy + hy) / 2;
  L(g, sleeve, sx, sy, full ? hx : mx, full ? hy : my, 3);
  if (!full) L(g, skin, mx, my, hx, hy, 3);
  R(g, skin, hx - 1, hy - 1, 3, 3);
}
function plaid(g, x, y, w, h) {
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const px = x + i, py = y + j; let c = '#2f7d32';
    if (px % 5 === 0) c = '#7cb342'; else if (px % 5 === 2) c = '#1b5e20';
    if (py % 5 === 2) c = c === '#7cb342' ? '#c5e1a5' : '#8bc34a';
    g.fillStyle = c; g.fillRect(px, py, 1, 1);
  }
}
const batik = (x, y) => ((x * 3 + y * 2) % 9 === 0 || (x + y * 3) % 11 === 0) ? '#f0a040' : ((x + y) % 5 === 0 && x % 2) ? '#4a2206' : '#9a4f1a';

function whip(g, x, y, P) {
  R(g, '#2b2b2b', x - 1, y - 2, 4, 4);
  if (P.atk) {
    const hi = P === POSES.atk3;
    for (let i = 0; i < 15; i++) R(g, i % 3 ? '#a05a24' : '#5d3414', x + 3 + i * 2, Math.round(y - 1 - Math.sin(i * 0.45) * (hi ? 7 : 3) + (hi ? -i * 0.5 : i * 0.1)), 2, 2);
  } else for (let i = 0; i < 10; i++) { const a = i / 9 * Math.PI * 1.7; R(g, '#a05a24', x + 2 + Math.round(Math.sin(a) * 4), y + 2 + Math.round(i * 1.1), 2, 2); }
}
function parang(g, x, y, wd) {
  const ex = x + wd[0] * 5, ey = y + wd[1] * 5;
  L(g, '#5a3418', x, y, ex, ey, 3);
  L(g, '#cfd6df', ex, ey, ex + wd[0] * 15, ey + wd[1] * 15 + 1, 3);
  L(g, '#ffffff', ex + 1, ey - 1, ex + wd[0] * 15, ey + wd[1] * 15, 1);
}
function stick(g, x, y, wd) {
  g.globalAlpha = 0.35; L(g, '#ff4b3a', x, y, x + wd[0] * 18, y + wd[1] * 18, 7); g.globalAlpha = 1;
  L(g, '#222222', x - wd[0] * 2, y - wd[1] * 2, x + wd[0] * 3, y + wd[1] * 3, 4);
  L(g, '#ff3b30', x + wd[0] * 4, y + wd[1] * 4, x + wd[0] * 18, y + wd[1] * 18, 3);
  L(g, '#ffe0d8', x + wd[0] * 4, y + wd[1] * 4, x + wd[0] * 18, y + wd[1] * 18, 1);
}
function spatula(g, x, y, wd) {
  L(g, '#9aa0aa', x, y, x + wd[0] * 8, y + wd[1] * 8, 2);
  const hx = Math.round(x + wd[0] * 10), hy = Math.round(y + wd[1] * 10);
  R(g, '#d8dce2', hx - 2, hy - 3, 5, 6); R(g, '#6b7078', hx - 1, hy - 2, 1, 3); R(g, '#6b7078', hx + 1, hy - 2, 1, 3);
}
function pan(g, x, y, wd) {
  L(g, '#4a3020', x, y, x + wd[0] * 6, y + wd[1] * 6, 2);
  const cx = Math.round(x + wd[0] * 11), cy = Math.round(y + wd[1] * 11);
  for (let d = -5; d <= 5; d++) { const w = Math.round(Math.sqrt(30 - d * d)); R(g, '#7b7f8a', cx - w, cy + d, w * 2 + 1, 1); R(g, '#c9ccd4', cx - w, cy + d, 1, 1); R(g, '#c9ccd4', cx + w, cy + d, 1, 1); }
  R(g, '#3b3d45', cx - 2, cy - 2, 5, 4);
}

const face = (g, l, skin, y = 8) => { R(g, '#222222', 14 + l, y, 2, 2); R(g, '#222222', 18 + l, y, 2, 2); };

const CH = [
  { // ABAH
    back: (g, P) => arm(g, 11, 16, P.hb[0], P.hb[1], '#e9e9e2', '#d6a06c', 1),
    lower: (g, P) => { plaid(g, 9, 27, 15, 17); R(g, '#c9a56a', 11 + P.l[0], 43, 5, 3); R(g, '#c9a56a', 18 + P.l[1], 43, 5, 3); },
    upper: (g, P, l) => {
      R(g, '#f3f3ee', 10 + l, 14, 12, 14); R(g, '#cfcfc6', 10 + l, 14, 2, 14); R(g, '#bdbdb4', 18 + l, 19, 3, 3);
      R(g, '#d6a06c', 11 + l, 4, 10, 10); R(g, '#161616', 10 + l, 0, 12, 5); R(g, '#555', 10 + l, 4, 12, 1);
      R(g, '#dddddd', 10 + l, 8, 2, 5); R(g, '#dddddd', 20 + l, 8, 2, 5); R(g, '#f4f4f4', 11 + l, 11, 10, 4); R(g, '#d6a06c', 14 + l, 11, 4, 1);
      face(g, l); R(g, '#eeeeee', 13 + l, 7, 4, 1); R(g, '#eeeeee', 18 + l, 7, 4, 1);
    },
    front: (g, P) => { arm(g, 21, 16, P.hf[0], P.hf[1], '#f3f3ee', '#d6a06c', 1); whip(g, P.hf[0], P.hf[1], P); },
  },
  { // EMA
    back: (g, P) => { arm(g, 11, 16, P.hb[0], P.hb[1], '#a8581c', '#e0aa78', 1); spatula(g, P.hb[0], P.hb[1], [0.3, -1]); },
    lower: (g, P) => {
      for (let y = 15; y < 44; y++) { const x0 = Math.round(10 - Math.max(0, y - 26) * 0.14), x1 = Math.round(22 + Math.max(0, y - 26) * 0.14); for (let x = x0; x <= x1; x++) R(g, batik(x, y), x, y, 1, 1); }
      R(g, '#3a2a22', 11 + P.l[0], 44, 5, 2); R(g, '#3a2a22', 17 + P.l[1], 44, 5, 2);
    },
    upper: (g, P, l) => {
      R(g, '#b48ad6', 10 + l, 1, 12, 2); R(g, '#b48ad6', 9 + l, 3, 14, 14); R(g, '#8f63b8', 9 + l, 15, 14, 4); R(g, '#8f63b8', 9 + l, 3, 2, 12);
      R(g, '#e0aa78', 12 + l, 5, 8, 8); R(g, '#a9783f', 12 + l, 5, 8, 1);
      face(g, l - 1, 0, 8); R(g, '#5a2d12', 13 + l, 7, 3, 1); R(g, '#5a2d12', 17 + l, 7, 3, 1); R(g, '#b04a4a', 14 + l, 11, 4, 1);
    },
    front: (g, P) => { arm(g, 21, 16, P.hf[0], P.hf[1], '#a8581c', '#e0aa78', 1); pan(g, P.hf[0], P.hf[1], P.wd); },
  },
  { // RHE~JAB
    back: (g, P) => arm(g, 11, 16, P.hb[0], P.hb[1], '#1c1c22', '#d8a272', 0),
    lower: (g, P) => { plaid(g, 9, 28, 15, 16); R(g, '#4caf50', 9, 26, 15, 3); R(g, '#2e7d32', 9, 28, 15, 1); R(g, '#c9a56a', 11 + P.l[0], 43, 5, 3); R(g, '#c9a56a', 18 + P.l[1], 43, 5, 3); },
    upper: (g, P, l) => {
      R(g, '#1c1c22', 10 + l, 14, 12, 13); R(g, '#34343c', 10 + l, 14, 2, 13);
      R(g, '#d8a272', 11 + l, 4, 10, 10); R(g, '#151515', 10 + l, 0, 12, 5); R(g, '#151515', 11 + l, -1, 3, 2); R(g, '#151515', 16 + l, -1, 4, 2); R(g, '#151515', 10 + l, 4, 2, 4); R(g, '#151515', 20 + l, 4, 2, 3);
      face(g, l); R(g, '#151515', 13 + l, 7, 4, 1); R(g, '#151515', 18 + l, 7, 4, 1);
    },
    front: (g, P) => { arm(g, 21, 16, P.hf[0], P.hf[1], '#1c1c22', '#d8a272', 0); parang(g, P.hf[0], P.hf[1], P.atk ? P.wd : [0.7, 0.7]); },
  },
  { // YHUD~HAAA
    back: (g, P) => arm(g, 11, 16, P.hb[0], P.hb[1], '#1c1c22', '#c68c5c', 0),
    lower: (g, P) => {
      for (const [x, o] of [[11, P.l[0]], [17, P.l[1]]]) { R(g, '#8c7050', x + o, 28, 5, 15); R(g, '#6f573c', x + o, 34, 5, 3); R(g, '#f4f4f4', x + o - 1, 43, 7, 3); R(g, '#aaaaaa', x + o - 1, 45, 7, 1); }
    },
    upper: (g, P, l) => {
      R(g, '#1c1c22', 10 + l, 14, 12, 14); R(g, '#b7e04a', 10 + l, 14, 5, 14); R(g, '#b7e04a', 17 + l, 14, 5, 14); R(g, '#ecf8c8', 10 + l, 21, 5, 2); R(g, '#ecf8c8', 17 + l, 21, 5, 2);
      R(g, '#c68c5c', 11 + l, 5, 10, 9); R(g, '#ececec', 10 + l, 1, 12, 5); R(g, '#ececec', 15 + l, 4, 11, 2); R(g, '#b9b9b9', 15 + l, 5, 11, 1);
      face(g, l, 0, 8); R(g, '#222222', 14 + l, 11, 5, 1);
    },
    front: (g, P) => { arm(g, 21, 16, P.hf[0], P.hf[1], '#1c1c22', '#c68c5c', 0); stick(g, P.hf[0], P.hf[1], P.wd); },
  },
];

export const POSES = {
  idle:  { b: 0,  l: [0, 0],  hf: [24, 27], hb: [8, 27], wd: [0.5, -0.85] },
  walk0: { b: 1,  l: [-3, 3], hf: [24, 28], hb: [8, 28], wd: [0.5, -0.85] },
  walk1: { b: 0,  l: [3, -3], hf: [23, 27], hb: [9, 27], wd: [0.5, -0.85] },
  atk1:  { b: 0,  l: [-3, 3], hf: [31, 20], hb: [9, 25], wd: [1, 0], atk: 1 },
  atk2:  { b: 0,  l: [-4, 4], hf: [32, 26], hb: [8, 22], wd: [1, 0.35], atk: 1 },
  atk3:  { b: -1, l: [-4, 4], hf: [29, 10], hb: [8, 27], wd: [0.75, -0.65], atk: 1 },
  jump:  { b: -2, l: [-2, 3], hf: [27, 20], hb: [7, 22], wd: [1, -0.2] },
  hurt:  { b: 0,  l: [-1, 1], hf: [26, 12], hb: [6, 18], wd: [-0.3, -1], lean: -2 },
};

function outline(cv) {
  const g = cv.getContext('2d'), im = g.getImageData(0, 0, SW, SH), d = im.data, o = new Uint8ClampedArray(d);
  const A = (x, y) => (x < 0 || y < 0 || x >= SW || y >= SH ? 0 : d[(y * SW + x) * 4 + 3]);
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) if (A(x, y) < 40 && (A(x - 1, y) > 200 || A(x + 1, y) > 200 || A(x, y - 1) > 200 || A(x, y + 1) > 200)) { const i = (y * SW + x) * 4; o[i] = 17; o[i + 1] = 14; o[i + 2] = 24; o[i + 3] = 255; }
  d.set(o); g.putImageData(im, 0, 0);
}

const cache = {};
export function heroFrame(i, name) {
  const k = i + name; if (cache[k]) return cache[k];
  const P = POSES[name], cv = document.createElement('canvas'); cv.width = SW; cv.height = SH;
  const g = cv.getContext('2d'); g.translate(12, P.b + 2);
  const c = CH[i], l = P.lean || 0;
  c.back(g, P); c.lower(g, P); c.upper(g, P, l); c.front(g, P);
  outline(cv);
  return (cache[k] = cv);
}

export function drawHeroAt(ctx, i, name, x, y, f = 1, sc = 2) {
  ctx.save(); ctx.translate(x, y); ctx.scale(f * sc, sc); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(heroFrame(i, name), -AX, -AY); ctx.restore();
}
