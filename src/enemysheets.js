// Sprite musuh (assets/enemies/<id>.png, dibuat dari sheet AI lewat docs/sprite_pipeline/build_enemies.py).
// Sel 192x160, menghadap kanan, kaki di (96,150). Baris: idle, walk, atk, hurt, down (jumlah frame: ECOUNTS).
import { asset } from './ver.js';
import { ECOUNTS } from './enemydata.js';
const FW = 192, FH = 160, AX = 96, AY = 150, ROW = { idle: 0, walk: 1, atk: 2, hurt: 3, down: 4 };
const S = {};
if (typeof Image !== 'undefined') for (const id of Object.keys(ECOUNTS)) { const s = S[id] = { img: new Image(), ok: false }; s.img.onload = () => { s.ok = true; }; s.img.src = asset('assets/enemies/' + id + '.png'); }
const cl = (v, n) => Math.max(0, Math.min(n - 1, v));

function pick(e, t, N) {
  if (e.hp <= 0) return ['down', cl(Math.floor(e.fade / 0.5 * N.down), N.down)];
  if (e.downT > 0) return ['down', cl(Math.floor((1 - e.downT / 0.9) * N.down), N.down)];
  if (e.hurtT > 0) return ['hurt', cl(Math.floor((1 - e.hurtT / 0.25) * N.hurt), N.hurt)];
  if (e.aT > 0) return ['atk', cl(Math.floor((1 - e.aT / (e.aMax || 0.4)) * N.atk), N.atk)];
  if (e.mv) return ['walk', Math.floor(e.w * (e.wf || 0.9)) % N.walk];
  return ['idle', Math.floor(t * 7 + (e.x | 0) * 0.01) % N.idle];
}

export function drawSpr(ctx, e, t) {
  const s = S[e.spr]; if (!s || !s.ok) return false;
  const N = ECOUNTS[e.spr], [a, i] = pick(e, t, N), ss = e.ss || 1;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(e.x, e.y, (e.dog ? 30 : 24) * ss, 6 * ss, 0, 0, 7); ctx.fill();
  if (e.hp <= 0 && e.fade > 0.55) ctx.globalAlpha = Math.floor(t * 20) % 2 ? 0.2 : 0.7;
  ctx.translate(e.x, e.y - e.z); ctx.scale(e.f * ss, ss); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(s.img, i * FW, ROW[a] * FH, FW, FH, -AX, -AY, FW, FH);
  ctx.restore(); return true;
}
