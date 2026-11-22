import { FT, FB, doAttack, doSpecial } from './combat.js';
import { dust } from './effects.js';
import { drawChar, sheetReady } from './spritesheets.js';

export const CHARS = [
  { name: 'Abah', tag: 'Sang Ayah, Penjaga Keluarga', wp: 'Pecutan Sarung', sp: 'Pecutan Maut', c: '#4da3ff', fx: '#ffa53a', hp: 140, spd: 100, dmg: 13, reach: 66, cd: 0.32, sr: 140, sm: 2.5 },
  { name: 'Ema', tag: 'Sang Ibu, Sumber Kekuatan', wp: 'Sepatula & Panci', sp: 'Dapur Mematikan', c: '#b36bff', fx: '#c77dff', hp: 120, spd: 115, dmg: 12, reach: 48, cd: 0.27, sr: 115, sm: 2.2, heal: 25 },
  { name: 'Rhe~jab', tag: 'Anak Pertama, Penuh Semangat', wp: 'Golok', sp: 'Tebasan Kilat', c: '#3ddc4a', fx: '#bfe3ff', hp: 100, spd: 150, dmg: 11, reach: 54, cd: 0.2, sr: 130, sm: 3 },
  { name: 'Yhud~haaa', tag: 'Si Bungsu, Penuh Cahaya', wp: 'Pentungan Lightstick', sp: 'Cahaya Penuntun', c: '#f5a623', fx: '#ff4b3a', hp: 85, spd: 160, dmg: 9, reach: 0, cd: 0.26, sr: 170, sm: 2.5, full: 1 },
];

export function newPlayer(i) {
  const c = CHARS[i];
  return { ch: c, x: 190, y: 360, z: 0, vz: 0, f: 1, hp: c.hp, max: c.hp, lives: 3, atkT: 0, cdT: 0, combo: 0, comboT: 0, af: 'atk1', mv: false, inv: 0, hurtT: 0, spT: 0, spCD: 0, w: 0, deadT: 0 };
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
    p.mv = m > 0.15; if (p.mv) p.w += dt * 10;
    if (inp.jump && p.z === 0) p.vz = 330;
    if (inp.atk && p.cdT <= 0) doAttack(G);
    if (inp.sp && p.spCD <= 0) doSpecial(G);
  }
  if (p.z > 0 || p.vz > 0) { p.vz -= 900 * dt; p.z += p.vz * dt; if (p.z <= 0) { p.z = 0; if (p.vz < -150) dust(G, p.x, p.y, 4); p.vz = 0; } }
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

export function drawPlayer(ctx, p, t, idx) {
  if (p.inv > 0 && p.hp > 0 && Math.floor(t * 16) % 2) return;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(p.x, p.y, 18, 5, 0, 0, 7); ctx.fill();
  const c = p.ch;
  let n = 'idle', prog = 0;
  const dead = p.hp <= 0;
  if (dead || p.hurtT > 0) { n = 'hurt'; prog = 1 - Math.max(0, p.hurtT) / 0.3; }
  else if (p.spT > 0) { n = 'special'; prog = 1 - p.spT / 0.5; }
  else if (p.atkT > 0) { n = p.z > 8 ? 'atk2' : p.af; prog = 1 - p.atkT / (c.cd * 0.9); }
  else if (p.z > 0) n = 'jump';
  else if (p.mv) n = Math.floor(p.w / 2) % 2 ? 'walk1' : 'walk0';
  const info = { t, w: p.w, prog, vz: p.vz, dead };
  if (dead && !sheetReady(idx)) { ctx.translate(p.x, p.y); ctx.rotate(-1.4 * p.f); ctx.translate(-p.x, -p.y); ctx.globalAlpha = 0.7; }
  drawChar(ctx, idx, n, p.x, p.y - p.z, p.f, 2, info);
  ctx.restore();
}
