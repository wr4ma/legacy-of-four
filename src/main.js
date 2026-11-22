import { initControls, pollInput, input } from './controls.js';
import { newPlayer, updatePlayer, drawPlayer } from './player.js';
import { updateEnemies, drawEnemy } from './enemy.js';
import { drawFx } from './effects.js';
import { updateShots } from './combat.js';
import { STAGES, startStage, updateLevel, drawBG } from './level.js';
import { drawSplash, drawSelect, drawSelectTall, tallHit, drawHUD, drawOverlay, cardHit } from './ui.js';

const H = 450;
const cv = document.getElementById('game'), ctx = cv.getContext('2d');
cv.width = 800; cv.height = H;
const G = { W: 800, H, state: 'splash', t: 0, sel: 0, stage: 0, cam: 0, score: 0, wi: 0, go: 0, title: 0, t2: 0, locked: false, shake: 0, ents: [], shots: [], fx: [], p: null };
initControls(cv);

// Lebar logis menyesuaikan layar HP landscape (tanpa bar hitam): 800 (16:9) sampai 1080 (2.4:1).
// Pilih karakter di portrait memakai kanvas tinggi 450 x H (mengikuti rasio layar).
const landMQ = matchMedia('(pointer:coarse) and (orientation:landscape)');
const portMQ = matchMedia('(orientation:portrait)');
const isTall = () => G.state === 'select' && portMQ.matches;
function fit() {
  let w = 800, h = H;
  if (isTall()) {
    const r = cv.getBoundingClientRect(); w = 450;
    h = r.width > 0 ? Math.max(640, Math.min(1100, Math.round(450 * r.height / r.width))) : 800;
  } else if (landMQ.matches) w = Math.round(H * Math.max(16 / 9, Math.min(2.4, innerWidth / innerHeight)));
  if (cv.width !== w) cv.width = w;
  if (cv.height !== h) cv.height = h;
  G.W = w; G.H = h;
}
fit(); addEventListener('resize', fit); addEventListener('orientationchange', () => setTimeout(fit, 120));

function begin() { G.p = newPlayer(G.sel); G.score = 0; startStage(G, 0); G.state = 'play'; }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function step(dt) {
  pollInput(); G.t += dt;
  const ok = input.nav === 'ok' || input.tap;
  if (G.state === 'splash') { if (ok || input.any || input.nav) G.state = 'select'; return; }
  if (G.state === 'select') {
    if (input.nav === 'left') G.sel = (G.sel + 3) % 4;
    if (input.nav === 'right') G.sel = (G.sel + 1) % 4;
    if (input.nav === 'ok') begin();
    if (input.tap && isTall()) { const h = tallHit(input.tap.x, input.tap.y, G); if (h && h.start) begin(); else if (h && h.i === G.sel) begin(); else if (h) G.sel = h.i; }
    else if (input.tap) { const i = cardHit(input.tap.x - (G.W - 800) / 2, input.tap.y); if (i === G.sel) begin(); else if (i >= 0) G.sel = i; }
    return;
  }
  if (G.state === 'over' || G.state === 'win') { if (ok) { G.state = 'splash'; G.sel = 0; } return; }
  if (G.state === 'clear') {
    G.t2 -= dt;
    if (G.t2 <= 0) { const p = G.p; p.hp = Math.min(p.max, p.hp + p.max * 0.4); startStage(G, G.stage + 1); G.state = 'play'; }
    return;
  }
  const p = G.p, S = STAGES[G.stage];
  updatePlayer(G, dt, input);
  if (!G.locked) G.cam = Math.max(G.cam, Math.min(p.x - G.W / 2, S.len - G.W));
  p.x = clamp(p.x, G.cam + 20, G.cam + G.W - 20);
  updateEnemies(G, dt); updateShots(G, dt); updateLevel(G, dt);
  G.shake = Math.max(0, G.shake - dt);
  if (p.hp <= 0 && G.state === 'play') {
    p.deadT += dt;
    if (p.deadT > 1.5) {
      p.lives--;
      if (p.lives <= 0) G.state = 'over';
      else { p.hp = p.max; p.inv = 2; p.x = G.cam + 190; p.y = 360; p.z = 0; p.deadT = 0; }
    }
  }
}

function draw() {
  if (document.body.dataset.state !== G.state) document.body.dataset.state = G.state;
  fit(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (G.state === 'splash') return drawSplash(ctx, G);
  if (G.state === 'select') return isTall() ? drawSelectTall(ctx, G) : drawSelect(ctx, G);
  if (G.shake > 0) ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  drawBG(ctx, G);
  ctx.save(); ctx.translate(-G.cam, 0);
  const list = G.ents.map(e => ({ y: e.y, f: () => drawEnemy(ctx, e, G.t) }));
  list.push({ y: G.p.y, f: () => drawPlayer(ctx, G.p, G.t, G.sel) });
  list.sort((a, b) => a.y - b.y).forEach(o => o.f());
  ctx.fillStyle = '#fff';
  for (const s of G.shots) { ctx.fillStyle = G.p.ch.fx; ctx.beginPath(); ctx.arc(s.x, s.y - 40 - s.z, 8, 0, 7); ctx.fill(); }
  for (const f of G.fx) drawFx(ctx, f);
  ctx.restore();
  drawHUD(ctx, G); drawOverlay(ctx, G);
}

let last = performance.now();
function loop(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; step(dt); draw(); requestAnimationFrame(loop); }
requestAnimationFrame(loop);
