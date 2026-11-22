import { hurtPlayer, FT, FB } from './combat.js';
import { drawMan } from './player.js';
import { bossStrike } from './boss.js';

export const TYPES = {
  thug:   { hp: 30,  spd: 60,  dmg: 8,  r: 16, reach: 34, col: '#6d8b3a', sc: 1,   score: 100 },
  raptor: { hp: 22,  spd: 125, dmg: 7,  r: 18, reach: 38, col: '#3fa34d', sc: 1,   score: 120, rap: true },
  brute:  { hp: 110, spd: 45,  dmg: 16, r: 26, reach: 50, col: '#a0522d', sc: 1.5, score: 300 },
  boss:   { hp: 380, spd: 55,  dmg: 20, r: 34, reach: 64, col: '#9b2226', sc: 1.9, score: 2000, boss: true },
};

export function spawn(G, t, x, y) {
  const d = TYPES[t];
  G.ents.push({ t, ...d, max: d.hp, x, y, z: 0, vz: 0, f: -1, hurtT: 0, downT: 0, kx: 0, aT: 0, cdT: 1, w: 0, dead: false, fade: 0 });
}

export function updateEnemies(G, dt) {
  const p = G.p;
  for (const e of G.ents) {
    e.x += e.kx * dt; e.kx *= Math.pow(0.05, dt);
    if (e.hp <= 0) { e.fade += dt; if (e.fade > 1) e.dead = true; continue; }
    e.hurtT -= dt; e.cdT -= dt;
    if (e.downT > 0) { e.downT -= dt; e.z += e.vz * dt; e.vz -= 900 * dt; if (e.z < 0) { e.z = 0; e.vz = 0; } continue; }
    if (e.hurtT > 0) continue;
    if (e.aT > 0) {
      e.aT -= dt;
      if (e.aT <= 0) {
        if (e.boss) bossStrike(G, e);
        else if ((p.x - e.x) * e.f > -10 && (p.x - e.x) * e.f < e.reach + 14 && Math.abs(p.y - e.y) < 22 && p.z < 30) hurtPlayer(G, e.dmg, e.f);
      }
      continue;
    }
    const sd = e.x < p.x ? -1 : 1, vx = p.x + sd * (e.reach - 8) - e.x, vy = p.y - e.y, n = Math.hypot(vx, vy) || 1;
    if (n > 5) { e.x += vx / n * e.spd * dt; e.y += vy / n * e.spd * 0.7 * dt; e.w += dt * 8; }
    e.f = p.x > e.x ? 1 : -1;
    e.y = Math.max(FT, Math.min(FB, e.y));
    if (p.hp > 0 && e.cdT <= 0 && Math.abs(p.x - e.x) < e.reach + 10 && Math.abs(p.y - e.y) < 18) { e.aT = e.boss ? 0.7 : 0.4; e.cdT = 1.4 + Math.random() * 0.6; }
  }
  G.ents = G.ents.filter(e => !e.dead);
}

function drawRaptor(ctx, e, col) {
  ctx.save(); ctx.translate(e.x, e.y);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, 0, 22, 6, 0, 0, 7); ctx.fill();
  ctx.translate(0, -e.z); ctx.scale(e.f, 1);
  const s = Math.sin(e.w) * 5;
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(0, -28, 20, 11, -0.2, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-16, -30); ctx.lineTo(-46, -18); ctx.lineTo(-14, -22); ctx.fill();
  ctx.fillRect(-7 + s, -20, 5, 20); ctx.fillRect(6 - s, -20, 5, 20);
  ctx.beginPath(); ctx.ellipse(24, -40, 13, 8, -0.3, 0, 7); ctx.fill();
  ctx.fillRect(14, -40, 8, 14);
  if (e.aT > 0) { ctx.fillStyle = '#fff'; ctx.fillRect(26, -36, 14, 4); }
  ctx.fillStyle = '#ff0'; ctx.fillRect(26, -44, 3, 3);
  ctx.restore();
}

export function drawEnemy(ctx, e, t) {
  ctx.save();
  const down = e.downT > 0 || e.hp <= 0;
  if (down) { ctx.translate(e.x, e.y); ctx.rotate(-1.4 * e.f); ctx.translate(-e.x, -e.y); }
  if (e.hp <= 0) ctx.globalAlpha = Math.floor(t * 20) % 2 ? 0.2 : 0.7;
  const col = e.hurtT > 0 ? '#fff' : e.col;
  if (e.rap) drawRaptor(ctx, e, col);
  else drawMan(ctx, { x: e.x, y: e.y, z: e.z, f: e.f, w: e.w, atk: e.aT > 0 }, col, '#222', e.sc, '#9ccc65');
  ctx.restore();
}
