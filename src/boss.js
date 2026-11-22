import { hurtPlayer } from './combat.js';

// Boss stomp: wide ground shockwave instead of a normal strike.
export function bossStrike(G, e) {
  const p = G.p;
  G.shake = 0.4;
  G.fx.push({ x: e.x, y: e.y - 10, r: 150, t: 0.4, max: 0.4, c: '#ffb703' });
  if (Math.abs(p.x - e.x) < 150 && Math.abs(p.y - e.y) < 60 && p.z < 25) hurtPlayer(G, e.dmg, p.x > e.x ? 1 : -1);
}
