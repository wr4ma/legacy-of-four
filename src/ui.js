import { LEVELS } from './level.js';

export function drawArena(G, ctx) {
  const L = LEVELS[G.level] || LEVELS[0];
  const g = ctx.createRadialGradient(400, 300, 50, 400, 300, 480);
  g.addColorStop(0, L.bg[0]); g.addColorStop(1, L.bg[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H);
  ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
  for (let x = 0; x <= G.W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, G.H); ctx.stroke(); }
  for (let y = 0; y <= G.H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(G.W, y); ctx.stroke(); }
}

export function drawHUD(G, ctx) {
  ctx.font = 'bold 12px system-ui'; ctx.textAlign = 'left';
  G.heroes.forEach((h, i) => {
    const x = 10 + i * 98, y = 10;
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(x, y, 92, 44);
    ctx.strokeStyle = i === G.cur ? h.color : 'rgba(255,255,255,.15)'; ctx.lineWidth = i === G.cur ? 2 : 1; ctx.strokeRect(x, y, 92, 44);
    ctx.fillStyle = h.alive ? h.color : '#777'; ctx.fillText(`${i + 1} ${h.name}`, x + 6, y + 16);
    ctx.fillStyle = '#222'; ctx.fillRect(x + 6, y + 24, 80, 8);
    ctx.fillStyle = h.alive ? '#e55' : '#555'; ctx.fillRect(x + 6, y + 24, 80 * h.hp / h.hpMax, 8);
    if (i === G.cur) { ctx.fillStyle = '#222'; ctx.fillRect(x + 6, y + 36, 80, 4); ctx.fillStyle = '#6cf'; ctx.fillRect(x + 6, y + 36, 80 * (1 - Math.max(0, h.spT) / 7), 4); }
  });
  ctx.textAlign = 'right'; ctx.fillStyle = '#fff';
  ctx.fillText(`${LEVELS[G.level].name}  ·  Score ${G.score}`, G.W - 12, 24);
  const b = G.enemies.find(e => e.boss);
  if (b) {
    ctx.textAlign = 'center'; ctx.fillText(b.name, G.W / 2, G.H - 34);
    ctx.fillStyle = '#300'; ctx.fillRect(200, G.H - 28, 400, 12);
    ctx.fillStyle = '#d33'; ctx.fillRect(200, G.H - 28, 400 * Math.max(0, b.hp) / b.maxHp, 12);
  }
  if (G.msgT > 0) { ctx.textAlign = 'center'; ctx.font = 'bold 28px system-ui'; ctx.globalAlpha = Math.min(1, G.msgT); ctx.fillStyle = '#fff'; ctx.fillText(G.msg, G.W / 2, 110); ctx.globalAlpha = 1; }
}

export function drawScreen(G, ctx) {
  if (G.state === 'play') return;
  ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(0, 0, G.W, G.H);
  const T = {
    title: ['LEGACY OF FOUR', 'Knight · Archer · Mage · Rogue', 'Tap or press Enter to begin', 'WASD move · Space attack · K special · 1-4 / E swap hero'],
    over: ['ALL FOUR HAVE FALLEN', `Score ${G.score}`, 'Tap or press Enter to retry', ''],
    win: ['LEGACY SECURED', `Score ${G.score}`, 'Tap or press Enter to play again', ''],
    clear: [`${LEVELS[G.level].name} cleared`, 'Your heroes rest and recover…', '', ''],
  }[G.state];
  ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
  ctx.font = 'bold 48px system-ui'; ctx.fillText(T[0], G.W / 2, 240);
  ctx.font = '22px system-ui'; ctx.fillText(T[1], G.W / 2, 290);
  ctx.fillText(T[2], G.W / 2, 350);
  ctx.font = '15px system-ui'; ctx.fillStyle = '#aaa'; ctx.fillText(T[3], G.W / 2, 400);
}
