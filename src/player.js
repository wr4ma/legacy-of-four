import { FT, FB, doAttack, doSpecial } from './combat.js';

export const CHARS = [
  { name: 'Rex', role: 'Brawler', c: '#e8643c', hair: '#5a2d0c', hp: 120, spd: 120, dmg: 10, reach: 50, cd: 0.25 },
  { name: 'Kira', role: 'Speedster', c: '#35c6dc', hair: '#111', hp: 90, spd: 165, dmg: 8, reach: 44, cd: 0.17 },
  { name: 'Bruno', role: 'Heavy', c: '#8d6e63', hair: '#bbb', hp: 160, spd: 95, dmg: 15, reach: 56, cd: 0.34 },
  { name: 'Mira', role: 'Ranged Mage', c: '#c77dff', hair: '#ff4fa3', hp: 80, spd: 125, dmg: 9, reach: 0, cd: 0.3 },
];

export function newPlayer(i) {
  const c = CHARS[i];
  return { ch: c, x: 100, y: 360, z: 0, vz: 0, f: 1, hp: c.hp, max: c.hp, lives: 3, atkT: 0, cdT: 0, combo: 0, comboT: 0, inv: 0, hurtT: 0, spT: 0, spCD: 0, w: 0, deadT: 0 };
}

export function updatePlayer(G, dt, inp) {
  const p = G.p, c = p.ch;
  p.atkT -= dt; p.cdT -= dt; p.comboT -= dt; p.inv -= dt; p.hurtT -= dt; p.spT -= dt; p.spCD -= dt;
  if (p.hp > 0 && p.hurtT <= 0 && p.spT <= 0) {
    let { dx, dy } = inp; const m = Math.hypot(dx, dy);
    if (m > 1) { dx /= m; dy /= m; }
    const s = c.spd * (p.atkT > 0 && p.z === 0 ? 0.3 : 1);
    p.x += dx * s * dt; p.y += dy * s * 0.7 * dt;
    if (Math.abs(dx) > 0.2) p.f = dx > 0 ? 1 : -1;
    if (m > 0.15) p.w += dt * 10;
    if (inp.jump && p.z === 0) p.vz = 330;
    if (inp.atk && p.cdT <= 0) doAttack(G);
    if (inp.sp && p.spCD <= 0) doSpecial(G);
  }
  if (p.z > 0 || p.vz > 0) { p.vz -= 900 * dt; p.z += p.vz * dt; if (p.z <= 0) { p.z = 0; p.vz = 0; } }
  p.y = Math.max(FT, Math.min(FB, p.y));
}

export function drawMan(ctx, o, col, hair, sc = 1, skin = '#f1c27d') {
  ctx.save(); ctx.translate(o.x, o.y);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, 0, 16 * sc, 5 * sc, 0, 0, 7); ctx.fill();
  ctx.translate(0, -o.z); ctx.scale(o.f * sc, sc);
  const s = Math.sin(o.w) * 6;
  ctx.fillStyle = '#2d3047'; ctx.fillRect(-8 + s, -22, 7, 22); ctx.fillRect(1 - s, -22, 7, 22);
  if (o.kick) ctx.fillRect(4, -26, 28, 7);
  ctx.fillStyle = col; ctx.fillRect(-10, -46, 20, 26);
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(1, -56, 9, 0, 7); ctx.fill();
  ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(0, -58, 9, Math.PI, 0); ctx.fill();
  ctx.fillStyle = skin; if (o.atk) ctx.fillRect(6, -43, 28, 7); else ctx.fillRect(7, -42, 6, 18);
  ctx.fillStyle = '#000'; ctx.fillRect(5, -58, 3, 3);
  ctx.restore();
}

export function drawPlayer(ctx, p, t) {
  if (p.inv > 0 && p.hp > 0 && Math.floor(t * 16) % 2) return;
  ctx.save();
  if (p.hp <= 0) { ctx.translate(p.x, p.y); ctx.rotate(-1.4 * p.f); ctx.translate(-p.x, -p.y); ctx.globalAlpha = 0.7; }
  drawMan(ctx, { x: p.x, y: p.y, z: p.z, f: p.f, w: p.w, atk: p.atkT > 0 || p.spT > 0, kick: p.z > 8 && p.atkT > 0 }, p.ch.c, p.ch.hair);
  ctx.restore();
}
