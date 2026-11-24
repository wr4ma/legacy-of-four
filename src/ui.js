import { CHARS } from './player.js';
import { drawChar } from './spritesheets.js';
import { STAGES } from './level.js';
import { LORE } from './lore.js';
import { asset } from './ver.js';
import { drawFx } from './effects.js';

export function T(ctx, s, x, y, sz, c = '#fff', al = 'center') {
  ctx.font = `bold ${sz}px Impact, system-ui, sans-serif`; ctx.textAlign = al;
  ctx.lineWidth = sz / 6; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y);
  ctx.fillStyle = c; ctx.fillText(s, x, y);
}
const cardX = i => 39 + i * 184;
export function cardHit(x, y) {
  for (let i = 0; i < 4; i++) if (x > cardX(i) && x < cardX(i) + 170 && y > 90 && y < 385) return i;
  return -1;
}

const splash = new Image(); splash.src = asset('assets/backgrounds/splash.jpg');

export function drawSplash(ctx, G) {
  const ox = (G.W - 800) / 2;
  if (splash.complete && splash.naturalWidth) {
    if (ox > 0) { const h = G.W * 9 / 16; ctx.drawImage(splash, 0, (G.H - h) / 2, G.W, h); ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, G.W, G.H); }
    ctx.drawImage(splash, ox, 0, 800, G.H);
  } else { ctx.fillStyle = '#2b1055'; ctx.fillRect(0, 0, G.W, G.H); T(ctx, 'LEGACY OF FOUR', G.W / 2, 220, 60, '#ffd23f'); T(ctx, 'PRESS ANY KEY TO CONTINUE', G.W / 2, 400, 20); }
}

export function drawSelect(ctx, G) {
  ctx.fillStyle = '#0d1230'; ctx.fillRect(0, 0, G.W, G.H);
  ctx.strokeStyle = 'rgba(80,120,255,.12)'; ctx.lineWidth = 1;
  for (let x = 0; x < G.W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, G.H); ctx.stroke(); }
  for (let y = 0; y < G.H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(G.W, y); ctx.stroke(); }
  ctx.save(); ctx.translate((G.W - 800) / 2, 0);
  T(ctx, 'SELECT YOUR FIGHTER', 400, 62, 38, '#ffd23f');
  CHARS.forEach((c, i) => {
    const x = cardX(i), sel = i === G.sel, cx = x + 85;
    ctx.fillStyle = sel ? '#1d2656' : '#141a40'; ctx.fillRect(x, 90, 170, 295);
    ctx.strokeStyle = sel ? c.c : '#33407a'; ctx.lineWidth = sel ? 4 : 2; ctx.strokeRect(x, 90, 170, 295);
    ctx.fillStyle = c.c; ctx.globalAlpha = 0.85; ctx.fillRect(x, 90, 170, 24); ctx.globalAlpha = 1;
    T(ctx, c.name.toUpperCase(), cx, 109, 18, '#fff');
    const fr = sel ? ['idle', 'atk1', 'idle', 'atk2', 'idle', 'atk3'][Math.floor(G.t * 3) % 6] : 'idle';
    drawChar(ctx, i, fr, cx - 4, 220, 1, 2.2, { t: G.t, prog: (G.t * 3) % 1 });
    T(ctx, c.tag, cx, 244, 10, '#cfd6ff');
    const bar = (l, v, y) => { T(ctx, l, x + 10, y + 8, 10, '#aab', 'left'); ctx.fillStyle = '#000'; ctx.fillRect(x + 44, y, 116, 8); ctx.fillStyle = c.c; ctx.fillRect(x + 44, y, 116 * Math.min(1, v), 8); };
    bar('HP', c.hp / 140, 254); bar('SPD', c.spd / 160, 268); bar('PWR', c.dmg / 13, 282);
    T(ctx, 'SENJATA', cx, 312, 10, '#889'); T(ctx, c.wp, cx, 326, 12, '#fff');
    T(ctx, 'SPECIAL', cx, 346, 10, '#889'); T(ctx, c.sp, cx, 362, 14, c.fx);
    if (c.reach === 0) T(ctx, 'RANGED', cx, 378, 9, '#fff');
  });
  T(ctx, 'Tap a card, tap again to start  ·  ←/→ + Enter', 400, 416, 15, '#aab');
  ctx.restore();
}

export function drawHUD(ctx, G) {
  const p = G.p, c = p.ch;
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(8, 8, 230, 58);
  drawChar(ctx, G.sel, 'idle', 30, 62, 1, 0.9, { t: G.t });
  T(ctx, c.name.toUpperCase(), 58, 26, 16, c.c, 'left'); T(ctx, `x${Math.max(p.lives, 0)}`, 228, 26, 16, '#fff', 'right');
  ctx.fillStyle = '#300'; ctx.fillRect(58, 32, 170, 11); ctx.fillStyle = '#f5c518'; ctx.fillRect(58, 32, 170 * Math.max(0, p.hp) / p.max, 11);
  ctx.fillStyle = '#123'; ctx.fillRect(58, 48, 170, 6); ctx.fillStyle = '#4cf'; ctx.fillRect(58, 48, 170 * (1 - Math.max(0, p.spCD) / 6), 6);
  T(ctx, `SCORE ${G.score}`, G.W - 14, 30, 22, '#fff', 'right');
  const b = G.ents.find(e => e.boss && e.hp > 0);
  if (b) { const bx = G.W / 2 - 150; T(ctx, 'THE TYRANT', G.W / 2, 36, 16, '#f66'); ctx.fillStyle = '#300'; ctx.fillRect(bx, 42, 300, 12); ctx.fillStyle = '#e63946'; ctx.fillRect(bx, 42, 300 * b.hp / b.max, 12); }
  if (G.go > 0 && Math.floor(G.t * 3) % 2) T(ctx, 'GO ➜', G.W - 70, 220, 40, '#ffd23f');
  if (G.sk && G.sk.t > 0) T(ctx, G.sk.s.toUpperCase() + '!', G.W / 2, 120, 36, G.sk.c);
  if (G.title > 0) T(ctx, STAGES[G.stage].name.toUpperCase(), G.W / 2, 190, 44, '#fff');
}

export function drawOverlay(ctx, G) {
  const M = { over: ['GAME OVER', `Score ${G.score}`, 'Tap or press Enter'], win: ['LEGACY SECURED!', `Score ${G.score}`, 'Tap or press Enter'], clear: ['STAGE CLEAR', `Score ${G.score}`, ''] }[G.state];
  if (!M) return;
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, G.W, G.H);
  const cx = G.W / 2; T(ctx, M[0], cx, 210, 64, '#ffd23f'); T(ctx, M[1], cx, 260, 28); T(ctx, M[2], cx, 310, 22);
}

// ===== Pilih karakter versi portrait (kanvas tinggi 450 x H) =====
const ids = ['abah', 'ema', 'rhejab', 'yhudhaaa'];
const load = f => { const im = new Image(); im.src = asset(f); return im; };
const thumbs = ids.map(id => load('assets/portraits/' + id + '_thumb.png'));
const arts = ids.map(id => { const im = new Image(); im.onerror = () => { im.bad = 1; }; im.src = asset('assets/portraits/' + id + '_full.png'); return im; }); // opsional
const okImg = im => im && im.complete && im.naturalWidth > 0;

export function tallLayout(G) {
  const W = G.W, H = G.H, selH = 118, selY = H - 8 - selH, st = { x: 12, y: selY - 56, w: W - 24, h: 46 };
  const cw = 96, gap = 8, x0 = (W - (4 * cw + 3 * gap)) / 2;
  const th = ids.map((_, i) => ({ x: x0 + i * (cw + gap), y: selY, w: cw, h: selH }));
  const top = 56, avail = st.y - 8 - top, heroH = Math.max(250, Math.min(400, avail * 0.55));
  return { th, st, top, heroH, storyY: top + heroH + 8, storyH: avail - heroH - 8 };
}
export function tallHit(x, y, G) {
  const L = tallLayout(G), in_ = (r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  if (in_(L.st)) return { start: true };
  for (let i = 0; i < 4; i++) if (in_(L.th[i])) return { i };
  return null;
}
function P(ctx, text, x, y, maxW, lh, sz, col, maxLines = 99, italic = false) {
  ctx.font = (italic ? 'italic ' : '') + sz + 'px system-ui, -apple-system, sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = col;
  const words = text.split(' '); let line = '', n = 0;
  const flush = l => { if (n < maxLines) ctx.fillText(l, x, y + n * lh); n++; };
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { flush(line); line = w; } else line = t; }
  flush(line); return Math.min(n, maxLines) * lh;
}
const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };

// demo aksi: idle, jalan, 3 serangan, special (dengan efek asli)
function demo(ctx, G, i, x, y, sc, W) {
  const c = CHARS[i], seq = [['idle', 1.8, 'SIAGA'], ['walk', 1.4, 'BERJALAN'], ['atk1', 0.45, 'SERANG 1'], ['atk2', 0.45, 'SERANG 2'], ['atk3', 0.6, 'SERANG 3'], ['special', 0.9, c.sp.toUpperCase()]];
  const tot = seq.reduce((a, s) => a + s[1], 0); let t = G.t % tot, k = 0; while (t >= seq[k][1]) { t -= seq[k][1]; k++; }
  const [name, dur, label] = seq[k], prog = Math.min(1, t / dur);
  if (name === 'special') { drawChar(ctx, i, 'special', x, y, 1, sc, { t: G.t, prog: Math.min(1, t / 0.5) }); if (t < 0.5) drawFx(ctx, { sp: 1, id: i, full: c.full, sc: c.sr / 85 * sc / 2, x, y, d: 1, t: 0.5 - t, max: 0.5, c: c.fx }); }
  else drawChar(ctx, i, name, x, y, 1, sc, { t: G.t, w: G.t * 9, prog });
  return label;
}

export function drawSelectTall(ctx, G) {
  const W = G.W, H = G.H, L = tallLayout(G), c = CHARS[G.sel], lo = LORE[G.sel], i = G.sel;
  ctx.fillStyle = '#0b1030'; ctx.fillRect(0, 0, W, H);
  const gr = ctx.createLinearGradient(0, 0, 0, H * 0.6); gr.addColorStop(0, c.c + '55'); gr.addColorStop(1, 'rgba(11,16,48,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H * 0.6);
  ctx.strokeStyle = 'rgba(80,120,255,.10)'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  T(ctx, 'PILIH KARAKTER', W / 2, 40, 28, '#ffd23f');
  // kartu hero: panggung kiri + info kanan
  const hx = 12, hy = L.top, hw = W - 24, hh = L.heroH, sw = 200;
  ctx.fillStyle = 'rgba(10,14,40,.75)'; rr(ctx, hx, hy, hw, hh, 12); ctx.fill(); ctx.strokeStyle = c.c; ctx.lineWidth = 3; ctx.stroke();
  ctx.save(); rr(ctx, hx + 6, hy + 6, sw, hh - 12, 8); ctx.clip();
  const sg = ctx.createRadialGradient(hx + 6 + sw / 2, hy + hh * 0.7, 10, hx + 6 + sw / 2, hy + hh * 0.7, sw); sg.addColorStop(0, c.c + 'aa'); sg.addColorStop(1, 'rgba(8,10,30,.9)'); ctx.fillStyle = sg; ctx.fillRect(hx + 6, hy + 6, sw, hh - 12);
  const cx = hx + 6 + sw / 2, gy = hy + hh - 40;
  ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.beginPath(); ctx.ellipse(cx, gy, 70, 14, 0, 0, 7); ctx.fill();
  const art = arts[i]; let label;
  if (okImg(art)) {
    const r = Math.min((sw - 8) / art.naturalWidth, (hh - 24) / art.naturalHeight); ctx.drawImage(art, cx - art.naturalWidth * r / 2, hy + 12 + (hh - 24 - art.naturalHeight * r), art.naturalWidth * r, art.naturalHeight * r);
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(hx + 6 + sw - 84, hy + hh - 6 - 84, 80, 80); ctx.save(); ctx.beginPath(); ctx.rect(hx + 6 + sw - 84, hy + hh - 90, 80, 80); ctx.clip();
    label = demo(ctx, G, i, hx + 6 + sw - 44, hy + hh - 20, 1.6, W); ctx.restore();
  } else label = demo(ctx, G, i, cx, gy, Math.min(4.6, (hh - 70) / 46), W);
  ctx.restore();
  T(ctx, 'IN-GAME  ·  ' + label, cx, hy + hh - 14, 11, '#cfe', 'center');
  // info kanan
  const ix = hx + sw + 20, iw = hw - sw - 28; let y = hy + 38;
  T(ctx, c.name.toUpperCase(), ix, y, 30, c.c, 'left'); y += 22;
  y += P(ctx, c.tag, ix, y, iw, 16, 13, '#cfd6ff', 2) + 8;
  const bar = (l, v, txt) => { ctx.font = 'bold 11px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = '#9ab'; ctx.fillText(l, ix, y); ctx.fillStyle = '#000'; ctx.fillRect(ix + 74, y - 9, iw - 74, 10); ctx.fillStyle = c.c; ctx.fillRect(ix + 74, y - 9, (iw - 74) * Math.min(1, v), 10); y += 20; };
  bar('HP', c.hp / 140); bar('KECEPATAN', c.spd / 160); bar('SERANGAN', c.dmg / 13); bar('JANGKAUAN', c.reach === 0 ? 1 : c.reach / 66);
  y += 4; ctx.font = 'bold 11px system-ui,sans-serif'; ctx.fillStyle = '#889'; ctx.fillText('SENJATA', ix, y); y += 16;
  y += P(ctx, c.wp, ix, y, iw, 16, 14, '#fff', 2, false) + 6;
  ctx.font = 'bold 11px system-ui,sans-serif'; ctx.fillStyle = '#889'; ctx.fillText('SPECIAL', ix, y); y += 16;
  P(ctx, c.sp + ' - ' + lo.sp, ix, y, iw, 15, 12, c.fx, Math.max(1, Math.floor((hy + hh - 10 - y) / 15)));
  // cerita
  const sy = L.storyY, sh = L.storyH;
  ctx.fillStyle = 'rgba(10,14,40,.75)'; rr(ctx, hx, sy, hw, sh, 12); ctx.fill(); ctx.strokeStyle = '#33407a'; ctx.lineWidth = 2; ctx.stroke();
  ctx.font = 'bold 12px system-ui,sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = c.c; ctx.fillText('LATAR BELAKANG', hx + 14, sy + 22);
  const fs = sh > 250 ? 15 : 12, lh = fs + 6; let yy = sy + 44, maxL = Math.floor((sh - 44 - 10) / lh);
  yy += P(ctx, lo.story, hx + 14, yy, hw - 28, lh, fs, '#e8ecff', maxL) + 6;
  if (yy + lh < sy + sh - 6) { yy += P(ctx, lo.quote, hx + 14, yy, hw - 28, lh, fs, c.fx, 2, true) + 4; }
  if (yy + lh < sy + sh - 4) P(ctx, 'GAYA: ' + lo.role, hx + 14, yy + 8, hw - 28, lh, fs - 1, '#9fb0ff', 2);
  // tombol mulai
  const s = L.st; const bg = ctx.createLinearGradient(0, s.y, 0, s.y + s.h); bg.addColorStop(0, c.c); bg.addColorStop(1, '#0008'); ctx.fillStyle = c.c; rr(ctx, s.x, s.y, s.w, s.h, 12); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.28)'; rr(ctx, s.x, s.y + s.h * 0.5, s.w, s.h * 0.5, 12); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; rr(ctx, s.x, s.y, s.w, s.h, 12); ctx.stroke();
  T(ctx, 'MULAI  ▶  ' + c.name.toUpperCase(), W / 2, s.y + 31, 24, '#fff');
  // potret kecil di bawah
  L.th.forEach((r, k) => {
    const sel = k === G.sel, cc = CHARS[k]; ctx.save(); ctx.globalAlpha = sel ? 1 : 0.6;
    ctx.save(); rr(ctx, r.x, r.y, r.w, r.w, 10); ctx.clip();
    if (okImg(thumbs[k])) ctx.drawImage(thumbs[k], r.x, r.y, r.w, r.w); else { ctx.fillStyle = cc.c; ctx.fillRect(r.x, r.y, r.w, r.w); }
    ctx.restore(); ctx.strokeStyle = sel ? cc.c : '#33407a'; ctx.lineWidth = sel ? 5 : 2; rr(ctx, r.x, r.y, r.w, r.w, 10); ctx.stroke(); ctx.restore();
    T(ctx, cc.name.toUpperCase(), r.x + r.w / 2, r.y + r.w + 16, 13, sel ? cc.c : '#aab');
  });
}
