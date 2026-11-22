import { CHARS } from './player.js';
import { drawHeroAt } from './sprites.js';
import { STAGES } from './level.js';

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

const splash = new Image(); splash.src = 'assets/backgrounds/splash.jpg';

export function drawSplash(ctx, G) {
  if (splash.complete && splash.naturalWidth) ctx.drawImage(splash, 0, 0, G.W, G.H);
  else { ctx.fillStyle = '#2b1055'; ctx.fillRect(0, 0, G.W, G.H); T(ctx, 'LEGACY OF FOUR', 400, 220, 60, '#ffd23f'); T(ctx, 'PRESS ANY KEY TO CONTINUE', 400, 400, 20); }
}

export function drawSelect(ctx, G) {
  ctx.fillStyle = '#0d1230'; ctx.fillRect(0, 0, G.W, G.H);
  ctx.strokeStyle = 'rgba(80,120,255,.12)'; ctx.lineWidth = 1;
  for (let x = 0; x < G.W; x += 25) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, G.H); ctx.stroke(); }
  for (let y = 0; y < G.H; y += 25) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(G.W, y); ctx.stroke(); }
  T(ctx, 'SELECT YOUR FIGHTER', 400, 62, 38, '#ffd23f');
  CHARS.forEach((c, i) => {
    const x = cardX(i), sel = i === G.sel, cx = x + 85;
    ctx.fillStyle = sel ? '#1d2656' : '#141a40'; ctx.fillRect(x, 90, 170, 295);
    ctx.strokeStyle = sel ? c.c : '#33407a'; ctx.lineWidth = sel ? 4 : 2; ctx.strokeRect(x, 90, 170, 295);
    ctx.fillStyle = c.c; ctx.globalAlpha = 0.85; ctx.fillRect(x, 90, 170, 24); ctx.globalAlpha = 1;
    T(ctx, c.name.toUpperCase(), cx, 109, 18, '#fff');
    const fr = sel ? ['idle', 'atk1', 'idle', 'atk2', 'idle', 'atk3'][Math.floor(G.t * 3) % 6] : 'idle';
    drawHeroAt(ctx, i, fr, cx - 4, 220, 1, 2.2);
    T(ctx, c.tag, cx, 244, 10, '#cfd6ff');
    const bar = (l, v, y) => { T(ctx, l, x + 10, y + 8, 10, '#aab', 'left'); ctx.fillStyle = '#000'; ctx.fillRect(x + 44, y, 116, 8); ctx.fillStyle = c.c; ctx.fillRect(x + 44, y, 116 * Math.min(1, v), 8); };
    bar('HP', c.hp / 140, 254); bar('SPD', c.spd / 160, 268); bar('PWR', c.dmg / 13, 282);
    T(ctx, 'SENJATA', cx, 312, 10, '#889'); T(ctx, c.wp, cx, 326, 12, '#fff');
    T(ctx, 'SPECIAL', cx, 346, 10, '#889'); T(ctx, c.sp, cx, 362, 14, c.fx);
    if (c.reach === 0) T(ctx, 'RANGED', cx, 378, 9, '#fff');
  });
  T(ctx, 'Tap a card, tap again to start  ·  ←/→ + Enter', 400, 416, 15, '#aab');
}

export function drawHUD(ctx, G) {
  const p = G.p, c = p.ch;
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(8, 8, 230, 58);
  drawHeroAt(ctx, G.sel, 'idle', 30, 62, 1, 0.9);
  T(ctx, c.name.toUpperCase(), 58, 26, 16, c.c, 'left'); T(ctx, `x${Math.max(p.lives, 0)}`, 228, 26, 16, '#fff', 'right');
  ctx.fillStyle = '#300'; ctx.fillRect(58, 32, 170, 11); ctx.fillStyle = '#f5c518'; ctx.fillRect(58, 32, 170 * Math.max(0, p.hp) / p.max, 11);
  ctx.fillStyle = '#123'; ctx.fillRect(58, 48, 170, 6); ctx.fillStyle = '#4cf'; ctx.fillRect(58, 48, 170 * (1 - Math.max(0, p.spCD) / 6), 6);
  T(ctx, `SCORE ${G.score}`, G.W - 14, 30, 22, '#fff', 'right');
  const b = G.ents.find(e => e.boss && e.hp > 0);
  if (b) { T(ctx, 'THE TYRANT', 400, 36, 16, '#f66'); ctx.fillStyle = '#300'; ctx.fillRect(250, 42, 300, 12); ctx.fillStyle = '#e63946'; ctx.fillRect(250, 42, 300 * b.hp / b.max, 12); }
  if (G.go > 0 && Math.floor(G.t * 3) % 2) T(ctx, 'GO ➜', G.W - 70, 220, 40, '#ffd23f');
  if (G.sk && G.sk.t > 0) T(ctx, G.sk.s.toUpperCase() + '!', 400, 120, 36, G.sk.c);
  if (G.title > 0) T(ctx, STAGES[G.stage].name.toUpperCase(), 400, 190, 44, '#fff');
}

export function drawOverlay(ctx, G) {
  const M = { over: ['GAME OVER', `Score ${G.score}`, 'Tap or press Enter'], win: ['LEGACY SECURED!', `Score ${G.score}`, 'Tap or press Enter'], clear: ['STAGE CLEAR', `Score ${G.score}`, ''] }[G.state];
  if (!M) return;
  ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, G.W, G.H);
  T(ctx, M[0], 400, 210, 64, '#ffd23f'); T(ctx, M[1], 400, 260, 28); T(ctx, M[2], 400, 310, 22);
}
