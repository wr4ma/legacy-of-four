import { initControls, pollInput, input } from './controls.js';
import { newGame, updatePlayer, drawPlayer, hero } from './player.js';
import { updateEnemies, drawEnemies } from './enemy.js';
import { updateCombat, drawCombat, attack, special } from './combat.js';
import { updateLevel, startLevel } from './level.js';
import { drawArena, drawHUD, drawScreen } from './ui.js';

const W = 800, H = 600;
const cv = document.getElementById('game'), ctx = cv.getContext('2d');
cv.width = W; cv.height = H;
const G = { W, H, state: 'title', t: 0, level: 0, wave: 0, score: 0, enemies: [], shots: [], eshots: [], fx: [], msg: '', msgT: 0, shake: 0, clearT: 0, heroes: [], cur: 0, p: { x: 400, y: 300 } };
initControls(cv);

function begin() { newGame(G); startLevel(G, 0); G.state = 'play'; }

function step(dt) {
  pollInput();
  if (G.state === 'title' || G.state === 'over' || G.state === 'win') {
    if (input.start) { input.start = false; begin(); }
    return;
  }
  if (G.state === 'clear') {
    G.clearT -= dt;
    if (G.clearT <= 0) { input.start = false; startLevel(G, G.level + 1); G.state = 'play'; }
    return;
  }
  input.start = false;
  updatePlayer(G, dt, input);
  const h = hero(G);
  if (input.attack && h.cdT <= 0) { h.cdT = h.cd; attack(G); }
  if (input.special && h.spT <= 0) special(G);
  updateEnemies(G, dt);
  updateCombat(G, dt);
  if (G.state === 'play') updateLevel(G, dt);
  G.t += dt; G.msgT -= dt; G.shake = Math.max(0, G.shake - dt);
}

function draw() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (G.shake > 0) ctx.translate((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
  drawArena(G, ctx);
  if (G.heroes.length) { drawEnemies(ctx, G); drawPlayer(ctx, G); drawCombat(ctx, G); drawHUD(G, ctx); }
  drawScreen(G, ctx);
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  step(dt); draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
