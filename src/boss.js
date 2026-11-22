import { hurt } from './player.js';
import { spawn } from './enemy.js';

export function spawnBoss(G) {
  G.enemies.push({ type: 'boss', boss: true, name: 'The Hollow King', hp: 600, maxHp: 600, sp: 50, r: 34, c: '#b71c1c',
    dmg: 20, score: 500, x: G.W / 2, y: 110, flash: 0, kx: 0, ky: 0, cd: 2, hit: 0, ang: 0 });
}

export function bossAI(G, e, dt, nx, ny) {
  const p2 = e.hp < e.maxHp / 2;
  const sp = e.sp * (p2 ? 1.5 : 1);
  e.x += nx * sp * dt; e.y += ny * sp * dt;
  e.cd -= dt;
  if (e.cd <= 0) {
    const n = p2 ? 16 : 10; e.ang += 0.3;
    for (let i = 0; i < n; i++) {
      const a = e.ang + i * Math.PI * 2 / n;
      G.eshots.push({ x: e.x, y: e.y, vx: Math.cos(a) * 150, vy: Math.sin(a) * 150, dmg: 10, r: 6, life: 4, c: '#ff6b6b' });
    }
    if (p2) { spawn(G, 'runner', e.x - 40, e.y); spawn(G, 'runner', e.x + 40, e.y); }
    e.cd = p2 ? 2.4 : 3;
    G.shake = 0.1;
  }
}
