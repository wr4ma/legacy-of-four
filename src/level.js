import { spawn } from './enemy.js';
import { FT } from './combat.js';

export const STAGES = [
  { name: 'Jungle Outpost', sky: ['#2a6f4f', '#e0a840'], far: '#1f4d3a', mid: '#173a2c', gnd: '#6b4f2a', len: 2300,
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

export function drawBG(ctx, G) {
  const S = STAGES[G.stage || 0], W = G.W, H = G.H, cam = G.cam || 0;
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
