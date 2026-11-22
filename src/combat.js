import { spark, dust } from './effects.js';
export const FT = 290, FB = 425;
const sgn = v => (v < 0 ? -1 : 1);
const ring = (G, x, y, r, c, t = 0.3) => G.fx.push({ x, y, r, t, max: t, c });

export function hitE(G, e, d, kd, dir) {
  if (e.hp <= 0) return;
  e.hp -= d; e.hurtT = 0.25; e.f = -dir; e.aT = 0; G.shake = 0.1;
  spark(G, e.x - dir * 6, e.y - 40 - e.z, '#fff', e.hp <= 0 ? 1.5 : 1);
  if (e.hp <= 0) { G.score += e.score; kd = true; }
  if (kd && !(e.boss && e.hp > 0)) { dust(G, e.x, e.y, 3, dir); e.downT = 0.9; e.vz = 180; e.kx = dir * 220; } else e.kx = dir * 60;
}

export function hurtPlayer(G, d, dir) {
  const p = G.p;
  if (p.inv > 0 || p.hp <= 0) return;
  p.hp = Math.max(0, p.hp - d); p.hurtT = 0.3; p.inv = 0.9; p.x += dir * 12; G.shake = 0.18;
  ring(G, p.x, p.y - 30 - p.z, 18, '#f55', 0.2);
}

export function doAttack(G) {
  const p = G.p, c = p.ch; p.cdT = c.cd; p.atkT = c.cd * 0.9;
  if (c.reach === 0) { p.af = 'atk1'; G.shots.push({ x: p.x + p.f * 20, y: p.y, z: p.z, vx: p.f * 420, dmg: c.dmg, life: 1.1 }); return; }
  const air = p.z > 10;
  p.combo = p.comboT > 0 ? p.combo + 1 : 1; p.comboT = 0.55;
  const fin = p.combo >= 3; p.af = fin ? 'atk3' : p.combo === 1 ? 'atk1' : 'atk2'; if (fin) p.combo = 0;
  for (const e of G.ents) {
    const dx = (e.x - p.x) * p.f;
    if (e.hp > 0 && e.downT <= 0 && dx > -12 && dx < c.reach + e.r && Math.abs(e.y - p.y) < 24 && Math.abs(e.z - p.z) < 40)
      hitE(G, e, c.dmg * (fin ? 1.6 : 1) * (air ? 1.2 : 1), fin || air, p.f);
  }
}

export function doSpecial(G) {
  const p = G.p, c = p.ch, R = c.sr;
  p.spCD = 6; p.spT = 0.5; p.inv = 0.7; G.shake = 0.25;
  for (const e of G.ents) if (e.hp > 0 && Math.abs(e.x - p.x) < R + e.r && Math.abs(e.y - p.y) < 60) hitE(G, e, c.dmg * c.sm, true, sgn(e.x - p.x));
  if (c.heal) p.hp = Math.min(p.max, p.hp + c.heal);
  G.fx.push({ sp: 1, id: G.sel, full: c.full, sc: R / 85, x: p.x, y: p.y, d: p.f, r: R * 0.8, a: c.full ? 3.14 : 1.3, t: 0.5, max: 0.5, c: c.fx });
  dust(G, p.x, p.y, 6);
  G.sk = { s: c.sp, c: c.fx, t: 1.3 };
}

export function updateShots(G, dt) {
  for (const s of G.shots) {
    s.x += s.vx * dt; s.life -= dt;
    for (const e of G.ents) if (e.hp > 0 && Math.abs(e.x - s.x) < e.r + 8 && Math.abs(e.y - s.y) < 24 && Math.abs(e.z - s.z) < 50) { hitE(G, e, s.dmg, false, sgn(s.vx)); s.life = 0; break; }
  }
  G.shots = G.shots.filter(s => s.life > 0);
  for (const f of G.fx) f.t -= dt;
  if (G.sk) G.sk.t -= dt;
  G.fx = G.fx.filter(f => f.t > 0);
}
