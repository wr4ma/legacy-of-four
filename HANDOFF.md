# LEGACY OF FOUR — HANDOFF (untuk melanjutkan di sesi chat baru)

> Cara mulai di chat baru: lampirkan `legacy-of-four_snapshot.zip` + file ini, lalu tulis:
> "Lanjutkan project Legacy of Four. Baca HANDOFF.md dulu. Balas dalam bahasa Indonesia. Tugas hari ini: ..."

## 1. Pemilik & preferensi
- GitHub: **wr4ma** · Repo: **legacy-of-four** (Public) · Game live: https://wr4ma.github.io/legacy-of-four/
- Bahasa: **Indonesia**. Perangkat: **iPhone (browser Brave)**, kerja lewat web GitHub (Upload files), bukan git/terminal.
- Maunya: otomatis total. Cukup upload `legacy-of-four_update.zip`; tidak mau ekstrak ZIP / edit kode / commit manual.
- Konsep: beat 'em up side-scrolling ala *Cadillacs & Dinosaurs*, 4 karakter, alur **Splash → Pilih Karakter → Game**.
- Ingin visual **sama persis dengan blueprint** (pixel art + efek cahaya) → butuh file sprite jadi (lihat SPRITE_PROMPTS.md).

## 2. Pipeline update (sudah dibuat, 1 file saja)
`.github/workflows/update-game.yml` (isi lengkap logika, tidak ada skrip lain):
- Trigger: push ke `main` + manual (`workflow_dispatch`).
- Job **update**: jika ada `updates/legacy-of-four_update.zip` → cek valid & tidak korup → tolak path traversal/symlink →
  cari root proyek (boleh dibungkus 1 folder) → salin file (tambah/timpa, tidak pernah menghapus) →
  validasi (`index.html` & `src/main.js` ada, referensi file di index.html ada, import JS ada, `node --check` semua `src/*.js`) →
  hapus ZIP → tulis `updates/LAST_UPDATE.json` → commit "Update Legacy of Four game build" → push.
  Gagal validasi = job merah, **tidak ada commit**, game live tidak berubah.
- Job **deploy** (needs update): salin `index.html src assets styles` ke `_site` → GitHub Pages. Jika game belum ada, deploy dilewati.
- Dilindungi (tidak ditimpa ZIP): `.github/`, `.git/`, `updates/`; `README.md/.gitignore/.gitattributes` dilindungi bila sudah ada.
  File workflow hanya bisa diubah manual (GITHUB_TOKEN tidak boleh mengubah workflow).
- Pengaturan manual satu kali (sudah dijelaskan ke user): Settings → Pages → Source = **GitHub Actions**; Settings → Actions → Workflow permissions = **Read and write**.
- **Penting:** folder harus bernama `updates` (huruf kecil, pakai s). User pernah membuat folder `Update` → salah, tidak terpicu.
- Batas: upload browser 25 MB/file.

## 3. Struktur game (HTML5 canvas, ES modules, tanpa build/dependensi)
```
index.html            canvas#game + #touch (stick, btnSp, btnJump, btnAtk)
styles/game.css       layout 16:9; kontrol sentuh hanya tampil di layar sentuh
assets/backgrounds/splash.jpg   splash dari user (1280px) — sudah memuat teks "Coming Soon / Press any key"
assets/{characters,effects,enemies,audio}/  masih kosong (.gitkeep) — disiapkan untuk sprite
src/main.js      loop, state machine (splash→select→play→clear/over/win), kamera, render urut-Y, efek
src/controls.js  keyboard + stick + tombol; edge-trigger (atk/jump/sp/nav/any/tap)
src/player.js    CHARS (data 4 karakter), newPlayer, updatePlayer, drawPlayer, drawMan (dipakai musuh)
src/sprites.js   sprite pixel-art buatan kode: heroFrame(i,pose), drawHeroAt(ctx,i,pose,x,y,f,scale); canvas 64x48, outline otomatis
src/combat.js    hitE, hurtPlayer, doAttack (combo 3 hit), doSpecial, updateShots, FT/FB (lantai y 290..425)
src/enemy.js     thug, raptor, brute, boss; AI; drawEnemy
src/boss.js      bossStrike (stomp AoE)
src/level.js     STAGES (2 stage, wave terkunci + "GO ➜"), startStage, updateLevel, drawBG parallax
src/ui.js        splash (gambar), layar pilih karakter, HUD, overlay, T() teks berkontur
```
Resolusi logika 800×450. Dunia sisi-scroll; kamera mengunci saat wave, lanjut setelah musuh habis. 3 nyawa, +40% HP antar-stage.

## 4. Karakter (sumber: blueprint user — `docs/reference/blueprint.jpg`)
| id | Nama | Julukan | Senjata | Special | Stat & gaya |
|---|---|---|---|---|---|
| abah | Abah | Sang Ayah, Penjaga Keluarga | Pecutan Sarung | **Pecutan Maut** (sapuan oranye) | HP140 SPD100 DMG13 reach66, lambat-berjangkauan |
| ema | Ema | Sang Ibu, Sumber Kekuatan | Sepatula & Panci | **Dapur Mematikan** (gelombang ungu) | HP120 SPD115 DMG12, special +25 HP |
| rhejab | Rhe~jab | Anak Pertama, Penuh Semangat | Golok | **Tebasan Kilat** (tebasan biru-putih) | HP100 SPD150 DMG11, cepat, special dmg ×3 |
| yhudhaaa | Yhud~haaa | Si Bungsu, Penuh Cahaya | Pentungan Lightstick | **Cahaya Penuntun** (cincin merah) | HP85 SPD160 DMG9, **jarak jauh** (tembak cahaya) |
Kontrol: WASD/panah gerak · J/Space/Z serang · K/X lompat · L/C special (cooldown 6 dtk) · ←/→+Enter pilih · sentuh: stick + 3 tombol.
Warna UI: abah #4da3ff, ema #b36bff, rhejab #3ddc4a, yhudhaaa #f5a623.

## 5. Status & keterbatasan jujur
- Sudah: seluruh alur game jalan di simulasi headless (4 karakter tamat stage 1; stage 2 sampai bos di versi awal), pipeline ZIP diuji lokal (ZIP wrapped/root, path traversal, kode rusak).
- **Belum diuji**: di browser/iPhone sungguhan (tata letak kontrol sentuh, performa), dan run Actions nyata di GitHub dari sisi saya.
- Sprite sekarang **buatan kode** (mirip blueprint tapi bukan sama persis). Musuh & latar masih bertema dinosaurus/hutan,
  tidak sesuai splash (kampung/jalan sore, papan "Bersama Selalu", grafiti "Legacy Never Fades").
- Belum ada: suara/musik, item pemulih, jeda/pause, 2 pemain.

## 6. Rencana lanjutan (urut prioritas)
1. ~~Pemuat sprite sheet~~ **SELESAI** (`src/spritesheets.js`: `drawChar`, `pickFrame`; otomatis pakai `assets/characters/<id>.png` bila ada, per karakter, kalau tidak pakai sprite kode). Tinggal menunggu PNG asli user. Diuji di Chromium dengan sheet tes (abah) + 3 karakter fallback.
2. Pemuat **efek** (spritesheet) menggantikan busur garis di `main.js` (blok `f.sp`) + efek hit/ledakan/debu.
3. Ganti latar & musuh ke tema kampung/jalan sore (preman, anjing/kucing liar? — tanya user), bos sesuai cerita.
4. Audio (SFX pukul, special, BGM) — file di `assets/audio/`.
5. Item makanan, pause, 2 pemain, lebih banyak stage.

### Sprite sheet (SUDAH TERPASANG — aset asli dari user)
- Sumber: 4 sheet AI (1536x1024, latar magenta) -> dipotong & disusun ulang (chroma key, potong frame, skala karakter ±100 px, titik kaki rata).
- `assets/characters/<id>.png`: sel **192x160**, menghadap kanan, titik kaki **(96,150)**, baris tetap: idle, walk, atk1, atk2, atk3, jump, hurt, down, special. Jumlah frame per baris BEDA per karakter -> tabel `COUNTS` di `src/spritesheets.js` (abah special 7, ema special 4, rhejab walk 6, yhudhaaa idle 4 dst). Ganti sheet = ubah COUNTS bila jumlah frame berubah.
- `assets/effects/fx_<id>_special.png`: strip sel **256x160**, jumlah frame abah 8, ema 7, rhejab 8, yhudhaaa 7; titik jangkar = kiri-bawah (≈(8,150)) -> taruh di kaki pemain, menghadap kanan. **Belum dipasang di kode** (tugas berikutnya: pemuat efek, ganti busur garis di `main.js` blok `f.sp`).
- Hook: `drawChar()` di `spritesheets.js` dipakai `drawPlayer()`, layar pilih, dan HUD; fallback ke sprite kode bila PNG tidak ada.
- Catatan: pecahan frame hasil potong otomatis (tangan/cambuk yang tumpang tindih antar frame) bisa kurang rapi di beberapa frame; perbaikan = sheet lebih rapi dari generator.

## 7. Cara kerja yang disarankan
- Selalu kirim hasil sebagai `legacy-of-four_update.zip` (game di root atau 1 folder pembungkus; jangan sertakan `.github`).
- Sebelum mengirim: `node --check src/*.js` + simulasi headless; jalankan ulang logika validasi workflow terhadap ZIP.
- Jangan menyuruh user ekstrak/commit manual; beri langkah singkat berbahasa Indonesia untuk iPhone.
