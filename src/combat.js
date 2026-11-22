import { hero, hurt } from './player.js';

export function nearest(G, maxD) {
  let b = null, bd = maxD;
  for (const e of G.enemies) { if (e.dead) continue; const d = Math.hypot(e.x - G.p.x, e.y - G.p.y) - e.r; if (d < bd) { bd = d; b = e; } }
  return b;
}

export function hit(G, e, dmg, nx, ny, kb) {
  if (e.dead) return;
  e.hp -= dmg; e.flash = 0.1;
  const k = e.boss ? kb * 0.15 : kb; e.kx += nx * k; e.ky += ny * k;
  if (e.hp <= 0) {
    e.dead = true; G.score += e.score;
    G.fx.push({ k: 'ring', x: e.x, y: e.y, r: e.r * 2.2, t: 0.3, max: 0.3, c: e.c });
  }
}

export function attack(G) {
  const h = hero(G), p = G.p, t = nearest(G, h.range + 40);
  let dx = p.fx, dy = p.fy;
  if (t) { const d = Math.hypot(t.x - p.x, t.y - p.y) || 1; dx = (t.x - p.x) / d; dy = (t.y - p.y) / d; p.fx = dx; p.fy = dy; }
  if (h.type === 'melee') {
    for (const e of G.enemies) {
      const ex = e.x - p.x, ey = e.y - p.y, d = Math.hypot(ex, ey) || 1;
      if (d < h.range + e.r && ((ex * dx + ey * dy) / d > -0.2 || d < e.r + 10)) hit(G, e, h.dmg, ex / d, ey / d, 160);
    }
    G.fx.push({ k: 'slash', x: p.x, y: p.y, a: Math.atan2(dy, dx), r: h.range, t: 0.15, max: 0.15, c: h.color });
  } else {
    const bolt = h.type === 'bolt';
    G.shots.push({ x: p.x, y: p.y, vx: dx * 380, vy: dy * 380, dmg: h.dmg, r: bolt ? 7 : 4, life: 1.2, c: h.color, aoe: bolt ? 45 : 0 });
  }
}

function ring(G, r, c) { G.fx.push({ k: 'ring', x: G.p.x, y: G.p.y, r, t: 0.35, max: 0.35, c }); }

export function special(G) {
  const h = hero(G), p = G.p;
  h.spT = 7;
  const area = (r, mult, kb) => {
    for (const e of G.enemies) {
      const ex = e.x - p.x, ey = e.y - p.y, d = Math.hypot(ex, ey) || 1;
      if (d < r + e.r) hit(G, e, h.dmg * mult, ex / d, ey / d, kb);
    }
    ring(G, r, h.color);
  };
  if (h.name === 'Knight') area(100, 2, 300);
  else if (h.name === 'Mage') area(170, 2.5, 120);
  else if (h.name === 'Archer') {
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; G.shots.push({ x: p.x, y: p.y, vx: Math.cos(a) * 380, vy: Math.sin(a) * 380, dmg: h.dmg, r: 4, life: 1, c: h.color, aoe: 0 }); }
    ring(G, 40, h.color);
  } else {
    const ox = p.x, oy = p.y;
    p.x = Math.max(20, Math.min(G.W - 20, p.x + p.fx * 120)); p.y = Math.max(20, Math.min(G.H - 20, p.y + p.fy * 120)); p.inv = 0.4;
    for (const e of G.enemies) {
      const mx = (ox + p.x) / 2, my = (oy + p.y) / 2;
      if (Math.hypot(e.x - mx, e.y - my) < 80 + e.r) hit(G, e, h.dmg * 2.5, p.fx, p.fy, 150);
    }
    ring(G, 50, h.color);
  }
}

export function updateCombat(G, dt) {
  const p = G.p;
  for (const s of G.shots) {
    s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
    for (const e of G.enemies) {
      if (e.dead || Math.hypot(e.x - s.x, e.y - s.y) >= e.r + s.r) continue;
      const d = Math.hypot(s.vx, s.vy) || 1;
      hit(G, e, s.dmg, s.vx / d, s.vy / d, 120);
      if (s.aoe) {
        for (const o of G.enemies) if (o !== e && Math.hypot(o.x - s.x, o.y - s.y) < s.aoe + o.r) hit(G, o, s.dmg * 0.5, 0, 0, 0);
        G.fx.push({ k: 'ring', x: s.x, y: s.y, r: s.aoe, t: 0.25, max: 0.25, c: s.c });
      }
      s.life = 0; break;
    }
  }
  G.shots = G.shots.filter(s => s.life > 0 && s.x > -20 && s.x < G.W + 20 && s.y > -20 && s.y < G.H + 20);
  for (const s of G.eshots) {
    s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
    if (Math.hypot(p.x - s.x, p.y - s.y) < p.r + s.r) { hurt(G, s.dmg); s.life = 0; }
  }
  G.eshots = G.eshots.filter(s => s.life > 0 && s.x > -20 && s.x < G.W + 20 && s.y > -20 && s.y < G.H + 20);
  for (const f of G.fx) f.t -= dt;
  G.fx = G.fx.filter(f => f.t > 0);
}

export function drawCombat(ctx, G) {
  for (const s of G.shots) { ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); }
  for (const s of G.eshots) { ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill(); }
  for (const f of G.fx) {
    const k = 1 - f.t / f.max;
    ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.c; ctx.lineWidth = 4;
    ctx.beginPath();
    if (f.k === 'slash') ctx.arc(f.x, f.y, f.r, f.a - 1, f.a + 1); else ctx.arc(f.x, f.y, f.r * k, 0, 7);
    ctx.stroke(); ctx.globalAlpha = 1;
  }
}
