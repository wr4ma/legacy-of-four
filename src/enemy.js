import { hurt } from './player.js';
import { bossAI } from './boss.js';

export const TYPES = {
  grunt:   { hp: 30, sp: 55,  r: 13, c: '#d9534f', dmg: 8,  score: 10 },
  runner:  { hp: 18, sp: 115, r: 10, c: '#f0ad4e', dmg: 6,  score: 12 },
  brute:   { hp: 90, sp: 40,  r: 20, c: '#a0522d', dmg: 16, score: 30 },
  spitter: { hp: 24, sp: 45,  r: 11, c: '#e84393', dmg: 7,  score: 20 },
};

export function spawn(G, type, x, y) {
  const t = TYPES[type];
  G.enemies.push({ type, ...t, maxHp: t.hp, x, y, flash: 0, cd: 1 + Math.random(), hit: 0, kx: 0, ky: 0 });
}
export function spawnEdge(G, type) {
  const s = Math.floor(Math.random() * 4), a = Math.random();
  const x = s < 2 ? a * G.W : (s === 2 ? 0 : G.W), y = s < 2 ? (s === 0 ? 0 : G.H) : a * G.H;
  spawn(G, type, x, y);
}

export function updateEnemies(G, dt) {
  const p = G.p;
  for (const e of G.enemies) {
    if (e.dead) continue;
    e.flash -= dt; e.hit -= dt;
    e.x += e.kx * dt; e.y += e.ky * dt;
    const f = Math.pow(0.02, dt); e.kx *= f; e.ky *= f;
    const dx = p.x - e.x, dy = p.y - e.y, d = Math.hypot(dx, dy) || 1;
    if (e.type === 'boss') bossAI(G, e, dt, dx / d, dy / d, d);
    else {
      let dir = 1;
      if (e.type === 'spitter') {
        dir = d > 260 ? 1 : d < 180 ? -1 : 0;
        e.cd -= dt;
        if (e.cd <= 0) {
          e.cd = 2;
          G.eshots.push({ x: e.x, y: e.y, vx: dx / d * 170, vy: dy / d * 170, dmg: e.dmg, r: 5, life: 3, c: e.c });
        }
      }
      e.x += dx / d * e.sp * dir * dt; e.y += dy / d * e.sp * dir * dt;
    }
    if (d < e.r + p.r && e.hit <= 0) { e.hit = 0.8; hurt(G, e.dmg); }
  }
  G.enemies = G.enemies.filter(e => !e.dead);
}

export function drawEnemies(ctx, G) {
  for (const e of G.enemies) {
    ctx.fillStyle = e.flash > 0 ? '#fff' : e.c;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 7); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(e.x - e.r * 0.3, e.y - e.r * 0.15, e.r * 0.15, 0, 7); ctx.arc(e.x + e.r * 0.3, e.y - e.r * 0.15, e.r * 0.15, 0, 7); ctx.fill();
    if (!e.boss && e.hp < e.maxHp) {
      ctx.fillStyle = '#400'; ctx.fillRect(e.x - e.r, e.y - e.r - 7, e.r * 2, 3);
      ctx.fillStyle = '#f55'; ctx.fillRect(e.x - e.r, e.y - e.r - 7, e.r * 2 * e.hp / e.maxHp, 3);
    }
  }
}
