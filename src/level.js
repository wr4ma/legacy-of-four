import { spawn } from './enemy.js';
import { FT } from './combat.js';

export const STAGES = [
  { name: 'Kampung Sore', bg: 's1', sky: ['#7a3b8a', '#ffa040'], far: '#3b3a6b', mid: '#2a2a50', gnd: '#5d5a68', len: 2300,
    waves: [[500, ['thug', 'thug', 'thug']], [1100, ['thug', 'raptor', 'raptor', 'thug']], [1800, ['brute', 'thug', 'thug']]] },
  { name: 'Volcano Rim', sky: ['#5a1f1f', '#ff8a3d'], far: '#3b1717', mid: '#2a1010', gnd: '#4a3a3a', len: 2300,
    waves: [[500, ['raptor', 'raptor', 'thug', 'thug']], [1100, ['brute', 'raptor', 'raptor']], [1750, ['boss', 'thug', 'thug']]] },
];

export function startStage(G, i) {
  G.stage = i; G.cam = 0; G.wi = 0; G.locked = false; G.go = 0; G.title = 2.2;
  G.ents = []; G.shots = []; G.fx = [];
  G.p.x = 100; G.p.y = 360; G.p.inv = 1.5;
}

export function updateLevel(G, dt) {
  const S = STAGES[G.stage], alive = G.ents.some(e => e.hp > 0);
  G.go -= dt; G.title -= dt;
  if (G.locked) { if (!alive) { G.locked = false; G.go = 3; } return; }
  if (G.wi < S.waves.length) {
    const w = S.waves[G.wi];
    if (G.p.x > w[0]) {
      G.locked = true; G.wi++;
      w[1].forEach((t, i) => spawn(G, t, G.cam + (i % 2 ? G.W + 40 : -40), FT + (i * 47) % 130));
    }
  } else if (!alive) { G.state = G.stage >= STAGES.length - 1 ? 'win' : 'clear'; G.t2 = 3; }
}

// ---- latar bergambar (assets/backgrounds/<bg>_*.png); bila belum lengkap, dipakai latar prosedural ----
const IMG = {};
const img = f => (IMG[f] || (IMG[f] = (() => { const i = new Image(); i.src = 'assets/backgrounds/' + f + '.png'; return i; })()));
const rdy = i => i.complete && i.naturalWidth > 0;
function drawImgBG(ctx, G, S) {
  const k = S.bg, sky = img(k + '_sky'), far = img(k + '_far'), ground = img(k + '_ground'), mids = ['a', 'b', 'c'].map(x => img(k + '_mid_' + x));
  if (![sky, far, ground, ...mids].every(rdy)) return false;
  const W = G.W, H = G.H, cam = G.cam || 0, camMax = Math.max(1, S.len - W);
  ctx.imageSmoothingEnabled = false;
  const so = -((cam * 0.05) % sky.naturalWidth);
  for (let x = so; x < W; x += sky.naturalWidth) ctx.drawImage(sky, Math.round(x), 0);
  ctx.fillStyle = S.sky[1]; ctx.fillRect(0, sky.naturalHeight, W, H);
  ctx.drawImage(far, -Math.round(Math.min(cam * 0.2, far.naturalWidth - W)), 0);
  // strip tengah 3 x 800 = 2400 px dipetakan ke panjang stage supaya zona A-B-C selalu tercapai
  const mw = 800 * mids.length, mo = Math.round(Math.max(0, Math.min(cam / camMax, 1) * (mw - W)));
  mids.forEach((m, i) => { const x = i * 800 - mo; if (x < W && x + 800 > 0) ctx.drawImage(m, x, -12); });
  ctx.fillStyle = S.gnd; ctx.fillRect(0, 286, W, H - 286);
  const gw = ground.naturalWidth, go = -(cam % gw);
  for (let x = go; x < W; x += gw) ctx.drawImage(ground, Math.round(x), 280);
  ctx.fillStyle = S.gnd; ctx.fillRect(0, 280 + ground.naturalHeight, W, H);
  return true;
}

export function drawBG(ctx, G) {
  const S = STAGES[G.stage || 0], W = G.W, H = G.H, cam = G.cam || 0;
  if (S.bg && drawImgBG(ctx, G, S)) return;
  const g = ctx.createLinearGradient(0, 0, 0, 290); g.addColorStop(0, S.sky[0]); g.addColorStop(1, S.sky[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,240,200,.8)'; ctx.beginPath(); ctx.arc(640, 90, 40, 0, 7); ctx.fill();
  const off = (m, sz) => -((cam * m) % sz);
  ctx.fillStyle = S.far;
  for (let x = off(0.2, 260) - 260; x < W + 260; x += 260) { ctx.beginPath(); ctx.moveTo(x, 290); ctx.lineTo(x + 130, 130); ctx.lineTo(x + 260, 290); ctx.fill(); }
  ctx.fillStyle = S.mid;
  for (let x = off(0.5, 120) - 120; x < W + 120; x += 120) { ctx.fillRect(x + 50, 200, 10, 90); ctx.beginPath(); ctx.arc(x + 55, 195, 34, 0, 7); ctx.fill(); }
  ctx.fillStyle = S.gnd; ctx.fillRect(0, 280, W, H - 280);
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  for (let x = off(1, 80) - 80; x < W + 80; x += 80) ctx.fillRect(x, 280, 3, H - 280);
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(0, 280, W, 4);
}
