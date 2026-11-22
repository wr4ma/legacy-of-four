// Efek visual: special (sprite strip assets/effects/fx_<id>_special.png), percikan pukulan, debu, cincin.
// Strip: sel 256x160, jangkar kiri-bawah ~(8,150), menghadap kanan, dipasang di kaki pemain.
const IDS = ['abah', 'ema', 'rhejab', 'yhudhaaa'];
const FW = 256, FH = 160, AX = 8, AY = 150;
const fx = {};
if (typeof Image !== 'undefined') IDS.forEach(id => {
  const s = fx[id] = { img: new Image(), n: 0, ok: false };
  s.img.onload = () => { s.n = Math.floor(s.img.naturalWidth / FW); s.ok = s.n > 0; };
  s.img.onerror = () => { s.ok = false; };
  s.img.src = 'assets/effects/fx_' + id + '_special.png';
});
export const fxReady = i => !!(fx[IDS[i]] && fx[IDS[i]].ok);

export const spark = (G, x, y, c = '#fff', big = 1) => G.fx.push({ k: 'spark', x, y, t: 0.18, max: 0.18, c, r: 22 * big, a: Math.random() * 3 });
export const dust = (G, x, y, n = 4, dir = 0) => { for (let i = 0; i < n; i++) G.fx.push({ k: 'dust', x: x + (Math.random() - 0.5) * 24, y, vx: (Math.random() - 0.5) * 60 + dir * 40, t: 0.45, max: 0.45, r: 5 + Math.random() * 5 }); };

function ring(ctx, f, k) { ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.c; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * k, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }

function legacyArc(ctx, f, k) {
  ctx.save(); ctx.translate(f.x, f.y); ctx.scale(f.d, 1);
  for (let i = 0; i < 3; i++) { ctx.globalAlpha = (1 - k) * (1 - i * 0.25); ctx.strokeStyle = i ? f.c : '#fff'; ctx.lineWidth = 14 - i * 4; ctx.beginPath(); ctx.arc(0, 0, f.r * (0.5 + k * 0.5) + i * 6, -f.a, f.a); ctx.stroke(); }
  ctx.restore(); ctx.globalAlpha = 1;
}

export function drawFx(ctx, f) {
  const k = 1 - f.t / f.max;
  if (f.k === 'spark') {
    ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.a); ctx.globalAlpha = 1 - k; ctx.strokeStyle = f.c; ctx.lineWidth = 3;
    const r0 = f.r * 0.25 * (1 + k), r1 = f.r * (0.5 + k);
    ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); } ctx.stroke();
    ctx.restore(); ctx.globalAlpha = 1; return;
  }
  if (f.k === 'dust') {
    f.x += f.vx * 0.016; f.y -= 0.25;
    ctx.globalAlpha = 0.5 * (1 - k); ctx.fillStyle = '#d9c7a0'; ctx.beginPath(); ctx.arc(f.x, f.y - 4, f.r * (1 + k), 0, 7); ctx.fill(); ctx.globalAlpha = 1; return;
  }
  if (f.sp) {
    const s = fx[IDS[f.id]];
    if (!s || !s.ok) return legacyArc(ctx, f, k);
    const col = Math.min(s.n - 1, Math.floor(k * s.n)), sc = f.sc;
    const side = (d) => { ctx.save(); ctx.translate(f.x, f.y); ctx.scale(d * sc, sc); ctx.imageSmoothingEnabled = false; ctx.drawImage(s.img, col * FW, 0, FW, FH, -AX, -AY, FW, FH); ctx.restore(); };
    side(f.d); if (f.full) side(-f.d);
    return;
  }
  ring(ctx, f, k);
}
