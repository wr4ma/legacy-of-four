import { spawnEdge } from './enemy.js';
import { spawnBoss } from './boss.js';

export const LEVELS = [
  { name: 'The Ashen Road', bg: ['#2b3a2b', '#1d281d'], waves: [{ grunt: 4 }, { grunt: 5, runner: 2 }, { grunt: 4, runner: 4 }] },
  { name: 'Sunken Crypt', bg: ['#2a2a44', '#1c1c30'], waves: [{ grunt: 5, spitter: 2 }, { runner: 6, brute: 1 }, { grunt: 4, spitter: 3, brute: 2 }] },
  { name: 'Throne of Ash', bg: ['#442a2a', '#301c1c'], waves: [{ brute: 2, spitter: 3, runner: 4 }, { boss: 1 }] },
];

export function startLevel(G, i) {
  G.level = i; G.wave = 0; G.spawnT = 1.5;
  G.enemies = []; G.shots = []; G.eshots = []; G.fx = [];
  G.p.x = G.W / 2; G.p.y = G.H / 2; G.p.inv = 1;
  for (const h of G.heroes) { h.alive = true; h.hp = Math.min(h.hpMax, Math.max(h.hp, h.hpMax * 0.5) + h.hpMax * 0.3); h.cdT = 0; h.spT = 0; }
  if (!G.heroes[G.cur].alive) G.cur = 0;
  G.msg = LEVELS[i].name; G.msgT = 2;
}

export function updateLevel(G, dt) {
  const L = LEVELS[G.level];
  if (G.enemies.length) return;
  if (G.wave >= L.waves.length) { G.state = G.level >= LEVELS.length - 1 ? 'win' : 'clear'; G.clearT = 3; return; }
  G.spawnT -= dt;
  if (G.spawnT <= 0) {
    for (const [k, n] of Object.entries(L.waves[G.wave])) {
      if (k === 'boss') spawnBoss(G); else for (let i = 0; i < n; i++) spawnEdge(G, k);
    }
    G.wave++; G.spawnT = 1.5; G.msg = `Wave ${G.wave}/${L.waves.length}`; G.msgT = 1.5;
  }
}
