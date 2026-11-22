import { CHARS, drawMan } from './player.js';
import { STAGES } from './level.js';

export function T(ctx, s, x, y, sz, c = '#fff', al = 'center') {
  ctx.font = `bold ${sz}px Impact, system-ui, sans-serif`; ctx.textAlign = al;
  ctx.lineWidth = sz / 6; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y);
  ctx.fillStyle = c; ctx.fillText(s, x, y);
}
const cardX = i => 39 + i * 184;
export function cardHit(x, y) {
  for (let i = 0; i < 4; i++) if (x > cardX(i) && x < cardX(i) + 170 && y > 105 && y < 375) return i;
  return -1;
}

export function drawSplash(ctx, G) {
  const g = ctx.createLinearGradient(0, 0, 0, G.H); g.addColorStop(0, '#2b1055'); g.addColorStop(0.6, '#d9582b'); g.addColorStop(1, '#ffb347');
  ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H);
  ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(400, 250, 90, 0, 7); ctx.fill();
  ctx.fillStyle = '#1a0a2e';
  for (let x = -60; x < G.W + 100; x += 200) { ctx.beginPath(); ctx.moveTo(x, 400); ctx.lineTo(x + 110, 240); ctx.lineTo(x + 220, 400); ctx.fill(); }
  ctx.fillRect(0, 390, G.W, 60);
  CHARS.forEach((c, i) => drawMan(ctx, { x: 190 + i * 140 + ((G.t * 60) % 40) * 0, y: 420, z: 0, f: 1, w: G.t * 10 + i, atk: false }, c.c, c.hair, 1.6));
  T(ctx, 'LEGACY', 400, 120, 78, '#ffd23f'); T(ctx, 'OF FOUR', 400, 195, 78, '#ff5a36');
  T(ctx, "A PREHISTORIC BEAT 'EM UP", 400, 232, 20, '#fff');
  if (Math.floor(G.t * 2) % 2) T(ctx, 'TAP OR PRESS ENTER', 400, 300, 26, '#fff');
}

export function drawSelect(ctx, G) {
  ctx.fillStyle = '#14101f'; ctx.fillRect(0, 0, G.W, G.H);
  T(ctx, 'SELECT YOUR FIGHTER', 400, 70, 40, '#ffd23f');
  CHARS.forEach((c, i) => {
    const x = cardX(i), sel = i === G.sel;
    ctx.fillStyle = sel ? '#2c2547' : '#1d1830'; ctx.fillRect(x, 105, 170, 270);
    ctx.strokeStyle = sel ? c.c : '#443d66'; ctx.lineWidth = sel ? 4 : 2; ctx.strokeRect(x, 105, 170, 270);
    drawMan(ctx, { x: x + 85, y: 215, z: 0, f: 1, w: sel ? G.t * 9 : 0, atk: sel && Math.floor(G.t * 3) % 2 }, c.c, c.hair, 1.7);
    T(ctx, c.name.toUpperCase(), x + 85, 252, 24, c.c); T(ctx, c.role, x + 85, 272, 14, '#ccc');
    const bar = (l, v, y) => { T(ctx, l, x + 12, y + 9, 11, '#aaa', 'left'); ctx.fillStyle = '#000'; ctx.fillRect(x + 48, y, 110, 9); ctx.fillStyle = c.c; ctx.fillRect(x + 48, y, 110 * v, 9); };
    bar('HP', c.hp / 160, 288); bar('SPD', c.spd / 165, 308); bar('PWR', c.dmg / 15, 328);
    if (c.reach === 0) T(ctx, 'RANGED', x + 85, 360, 12, '#fff');
  });
  T(ctx, 'Tap a card, tap again to start  ·  ←/→ + Enter', 400, 410, 16, '#bbb');
}

export function drawHUD(ctx, G) {
  const p = G.p, c = p.ch;
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(8, 8, 230, 58);
  ctx.fillStyle = c.c; ctx.beginPath(); ctx.arc(32, 36, 17, 0, 7); ctx.fill();
  T(ctx, c.name.toUpperCase(), 58, 26, 16, c.c, 'left'); T(ctx, `x${Math.max(p.lives, 0)}`, 228, 26, 16, '#fff', 'right');
  ctx.fillStyle = '#300'; ctx.fillRect(58, 32, 170, 11); ctx.fillStyle = '#f5c518'; ctx.fillRect(58, 32, 170 * Math.max(0, p.hp) / p.max, 11);
  ctx.fillStyle = '#123'; ctx.fillRect(58, 48, 170, 6); ctx.fillStyle = '#4cf'; ctx.fillRect(58, 48, 170 * (1 - Math.max(0, p.spCD) / 6), 6);
  T(ctx, `SCORE ${G.score}`, G.W - 14, 30, 22, '#fff', 'right');
  const b = G.ents.find(e => e.boss && e.hp > 0);
  if (b) { T(ctx, 'THE TYRANT', 400, 36, 16, '#f66'); ctx.fillStyle = '#300'; ctx.fillRect(250, 42, 300, 12); ctx.fillStyle = '#e63946'; ctx.fillRect(250, 42, 300 * b.hp / b.max, 12); }
  if (G.go > 0 && Math.floor(G.t * 3) % 2) T(ctx, 'GO ➜', G.W - 70, 220, 40, '#ffd23f');
  if (G.title > 0) T(ctx, STAGES[G.stage].name.toUpperCase(), 400, 150, 44, '#fff');
}

export function drawOverlay(ctx, G) {
  const M = { over: ['GAME OVER', `Score ${G.score}`, 'Tap or press Enter'], win: ['LEGACY SECURED!', `Score ${G.score}`, 'Tap or press Enter'], clear: ['STAGE CLEAR', `Score ${G.score}`, ''] }[G.state];
  if (!M) return;
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, G.W, G.H);
  T(ctx, M[0], 400, 210, 64, '#ffd23f'); T(ctx, M[1], 400, 260, 28); T(ctx, M[2], 400, 310, 22);
}
