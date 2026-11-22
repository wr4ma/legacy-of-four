export const HEROES = [
  { name: 'Knight', color: '#4da3ff', hp: 140, speed: 150, range: 55, dmg: 18, cd: 0.45, type: 'melee' },
  { name: 'Archer', color: '#5ee07a', hp: 90, speed: 175, range: 260, dmg: 10, cd: 0.35, type: 'arrow' },
  { name: 'Mage', color: '#c47bff', hp: 80, speed: 150, range: 220, dmg: 14, cd: 0.7, type: 'bolt' },
  { name: 'Rogue', color: '#ffcf4d', hp: 100, speed: 210, range: 45, dmg: 12, cd: 0.25, type: 'melee' },
];
export const hero = G => G.heroes[G.cur];

export function newGame(G) {
  G.heroes = HEROES.map(h => ({ ...h, hpMax: h.hp, cdT: 0, spT: 0, alive: true }));
  G.cur = 0; G.score = 0;
  G.p = { x: G.W / 2, y: G.H / 2, r: 14, inv: 0, fx: 1, fy: 0 };
}

export function switchTo(G, i) {
  if (i === 'next') { i = null; for (let k = 1; k <= 4; k++) { const j = (G.cur + k) % 4; if (G.heroes[j].alive) { i = j; break; } } }
  if (typeof i === 'number' && i !== G.cur && G.heroes[i].alive) {
    G.cur = i; G.p.inv = 0.5;
    G.fx.push({ k: 'ring', x: G.p.x, y: G.p.y, r: 40, t: 0.3, max: 0.3, c: G.heroes[i].color });
  }
}

export function hurt(G, dmg) {
  const p = G.p, h = hero(G);
  if (p.inv > 0 || G.state !== 'play') return;
  h.hp -= dmg; p.inv = 0.6; G.shake = 0.15;
  if (h.hp <= 0) {
    h.hp = 0; h.alive = false;
    G.fx.push({ k: 'ring', x: p.x, y: p.y, r: 70, t: 0.5, max: 0.5, c: '#fff' });
    if (G.heroes.some(x => x.alive)) switchTo(G, 'next'); else G.state = 'over';
  }
}

export function updatePlayer(G, dt, input) {
  const h = hero(G), p = G.p;
  h.cdT -= dt; h.spT -= dt; p.inv -= dt;
  if (input.switchTo != null) { switchTo(G, input.switchTo); input.switchTo = null; }
  let { dx, dy } = input; const m = Math.hypot(dx, dy);
  if (m > 1) { dx /= m; dy /= m; }
  if (m > 0.15) { p.fx = dx / (m > 1 ? 1 : m); p.fy = dy / (m > 1 ? 1 : m); }
  const cur = hero(G);
  p.x = Math.max(20, Math.min(G.W - 20, p.x + dx * cur.speed * dt));
  p.y = Math.max(20, Math.min(G.H - 20, p.y + dy * cur.speed * dt));
}

export function drawPlayer(ctx, G) {
  const p = G.p, h = hero(G);
  if (p.inv > 0 && Math.floor(G.t * 20) % 2) ctx.globalAlpha = 0.4;
  ctx.fillStyle = h.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x + p.fx * 8, p.y + p.fy * 8, 4, 0, 7); ctx.fill();
  ctx.globalAlpha = 1;
}
