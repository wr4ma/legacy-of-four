// Pemuat sprite sheet karakter dengan fallback otomatis ke sprite buatan kode (sprites.js).
// PNG di assets/characters/<id>.png (id: abah | ema | rhejab | yhudhaaa).
// Format: sel 192x160, menghadap kanan, titik kaki di (96,150). Satu baris per animasi,
// urutan baris tetap: idle, walk, atk1, atk2, atk3, jump, hurt, down, special.
// Jumlah frame tiap baris berbeda per karakter -> lihat COUNTS di bawah.
import { drawHeroAt } from './sprites.js';
import { asset } from './ver.js';

export const FW = 192, FH = 160, AXS = 96, AYS = 150;
export const IDS = ['abah', 'ema', 'rhejab', 'yhudhaaa'];
export const ROWS = ['idle', 'walk', 'atk1', 'atk2', 'atk3', 'jump', 'hurt', 'down', 'special'];
export const COUNTS = {
  abah:     { idle: 3, walk: 5, atk1: 4, atk2: 4, atk3: 4, jump: 3, hurt: 2, down: 4, special: 7 },
  ema:      { idle: 3, walk: 5, atk1: 3, atk2: 3, atk3: 3, jump: 3, hurt: 2, down: 4, special: 4 },
  rhejab:   { idle: 3, walk: 6, atk1: 4, atk2: 3, atk3: 4, jump: 3, hurt: 2, down: 4, special: 4 },
  yhudhaaa: { idle: 4, walk: 5, atk1: 3, atk2: 2, atk3: 3, jump: 3, hurt: 2, down: 4, special: 3 },
};
const IDLE_FPS = 5;
const SCALE_K = 0.5; // skala kode (sc=2) -> sheet 1.0 (karakter ±100 px dari 450)

const sheets = {}; // id -> { img, ok, rows, cols }
export function loadSheets(base = 'assets/characters/') {
  if (typeof Image === 'undefined') return;
  IDS.forEach(id => {
    const s = sheets[id] = { img: new Image(), ok: false, rows: 0, cols: 0 };
    s.img.onload = () => {
      s.cols = Math.floor(s.img.naturalWidth / FW); s.rows = Math.floor(s.img.naturalHeight / FH);
      s.ok = s.cols > 0 && s.rows > 0;
    };
    s.img.onerror = () => { s.ok = false; };
    s.img.src = asset(base + id + '.png');
  });
}
loadSheets();

// Pilih (anim, kolom) dari nama pose + info animasi. Fungsi murni, mudah diuji.
// info: { t: waktu detik, w: fase jalan, prog: 0..1 progres serang/special, vz: kecepatan lompat, dead: bool }
export function pickFrame(id, name, info = {}) {
  const C = COUNTS[id]; if (!C) return null;
  const { t = 0, w = 0, prog = 0, vz = 0, dead = false } = info;
  const byProg = a => Math.max(0, Math.min(C[a] - 1, Math.floor(prog * C[a])));
  if (dead) return { anim: 'down', col: C.down - 1 };
  if (name === 'idle') return { anim: 'idle', col: Math.floor(t * IDLE_FPS) % C.idle };
  if (name === 'walk0' || name === 'walk1' || name === 'walk') return { anim: 'walk', col: Math.floor(w) % C.walk };
  if (name === 'jump') return { anim: 'jump', col: vz > 120 ? 0 : vz < -120 ? C.jump - 1 : Math.min(1, C.jump - 1) };
  if (C[name]) return { anim: name, col: byProg(name) };
  return null;
}

export function sheetReady(i) { const s = sheets[IDS[i]]; return !!(s && s.ok); }

// Gambar karakter: pakai sheet bila ada & barisnya lengkap, kalau tidak pakai sprite kode.
// sc memakai skala yang sama dengan drawHeroAt (gameplay = 2).
export function drawChar(ctx, i, name, x, y, f = 1, sc = 2, info = {}) {
  const id = IDS[i], s = sheets[id];
  const pf = s && s.ok ? pickFrame(id, name, info) : null;
  const r = pf ? ROWS.indexOf(pf.anim) : -1;
  if (!pf || r < 0 || r >= s.rows || pf.col >= s.cols) { drawHeroAt(ctx, i, codeName(name), x, y, f, sc); return false; }
  ctx.save(); ctx.translate(x, y); ctx.scale(f * sc * SCALE_K, sc * SCALE_K); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(s.img, pf.col * FW, r * FH, FW, FH, -AXS, -AYS, FW, FH);
  ctx.restore();
  return true;
}
const codeName = n => (n === 'special' ? 'atk3' : n === 'down' ? 'hurt' : n);
