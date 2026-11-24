# LEGACY OF FOUR — HANDOFF (untuk melanjutkan di sesi chat baru)

> Cara mulai di chat baru: lampirkan `legacy-of-four_snapshot.zip` + file ini, lalu tulis:
> "Lanjutkan project Legacy of Four. Baca HANDOFF.md dulu. Balas dalam bahasa Indonesia. Tugas hari ini: ..."
> Terakhir diperbarui: 23 Nov 2026.

## 1. Pemilik & preferensi
- GitHub: **wr4ma** · Repo: **legacy-of-four** (Public) · Game live: https://wr4ma.github.io/legacy-of-four/
- Bahasa: **Indonesia**. Perangkat: **iPhone (browser Brave)**, kerja lewat web GitHub (Upload files), bukan git/terminal.
- Maunya: otomatis total. Cukup upload `legacy-of-four_update.zip` ke folder `updates`; tidak mau ekstrak ZIP / edit kode / commit manual.
- Konsep: beat 'em up side-scrolling ala *Cadillacs & Dinosaurs*, 4 karakter keluarga, alur **Splash → Pilih Karakter → Game**.
- Sprite asli (4 sheet AI) sudah dipasang. Visual target = blueprint (`docs/reference/blueprint.jpg`).

## 2. Pipeline update (sudah jalan, terbukti di GitHub nyata)
`.github/workflows/update-game.yml` (hanya bisa diubah manual oleh user):
- Trigger: push ke `main` + manual. Job **update**: jika ada `updates/legacy-of-four_update.zip` → cek valid → tolak path traversal/symlink →
  cari root proyek **dengan mencari `index.html` di dalam ZIP** → salin file (tambah/timpa, tidak pernah menghapus) → validasi
  (`index.html` & `src/main.js` ada, referensi di index.html ada, import JS ada, `node --check src/*.js`) → hapus ZIP → commit → push.
  Gagal validasi = job merah, tidak ada commit, game live tidak berubah.
- Job **deploy**: menyalin **hanya** `index.html src assets styles` ke GitHub Pages. => file di luar empat itu (mis. manifest di root) TIDAK ikut live. Taruh semua aset di `assets/`.
- Dilindungi: `.github/`, `.git/`, `updates/`; README/.gitignore/.gitattributes bila sudah ada.
- Pengaturan satu kali (sudah beres): Pages Source = GitHub Actions; Workflow permissions = Read and write.
- **PELAJARAN:** ZIP update HARUS berisi game lengkap (ada `index.html` di root atau 1 folder pembungkus). ZIP parsial berisi file yang berubah saja ditolak ("No index.html found in the ZIP"). Selalu kirim paket penuh (±2–3 MB). Folder harus bernama `updates` (huruf kecil).
- Batas upload browser 25 MB/file. Setelah update, user sebaiknya tutup-buka tab (cache).

## 3. Struktur game (HTML5 canvas, ES modules, tanpa build/dependensi)
```
index.html            #stage(judul + #screen(canvas#game + tombol #fs)) + #touch(#stick/#knob, #btns: btnJump/btnSp/btnAtk); meta PWA/iOS
styles/game.css       variabel --u (skala UI), portrait/landscape/desktop, panel arcade, tombol 3D
assets/backgrounds/splash.jpg    splash user (memuat "Coming Soon / Press any key")
assets/characters/<id>.png       sprite sheet 4 karakter (lihat bagian 6)
assets/effects/fx_<id>_special.png  efek special (BELUM dipakai kode)
assets/icons/icon-{180,192,512}.png + assets/manifest.webmanifest   (PWA / Add to Home Screen)
src/main.js      loop, state machine (splash→select→play→clear/over/win), kamera, render urut-Y, efek busur garis (blok f.sp), fit() lebar adaptif, set body[data-state]
src/controls.js  keyboard + stick + tombol (edge-trigger), tap→koordinat canvas (cv.width), tombol fullscreen, blok zoom iOS
src/player.js    CHARS (data 4 karakter), newPlayer (spawn x=190), updatePlayer, drawPlayer (pilih pose+progres → drawChar), drawMan (musuh)
src/spritesheets.js  loadSheets, COUNTS (frame per baris per karakter), pickFrame (murni), drawChar (sheet, fallback ke sprites.js)
src/sprites.js   sprite pixel-art buatan kode (fallback): heroFrame, drawHeroAt
src/combat.js    hitE, hurtPlayer, doAttack (combo 3 hit), doSpecial, updateShots, FT/FB (lantai y 290..425)
src/enemy.js     thug, raptor, brute, boss; AI; drawEnemy
src/boss.js      bossStrike (stomp AoE)
src/level.js     STAGES (2 stage, wave terkunci + "GO ➜"), startStage, updateLevel, drawBG parallax (pakai G.W)
src/level.js    STAGES[0]='Kampung Sore' (bg:'s1'): drawImgBG pakai assets/backgrounds/s1_{sky,far,mid_a,mid_b,mid_c,ground}.png (sky 0.05, far 0.2 clamp, mid 3x800 dipetakan ke panjang stage, ground 1.0 tile); fallback prosedural bila gambar belum ada
src/effects.js  pemuat strip efek special, spark(), dust(), drawFx() (dipanggil dari main.js)
src/ui.js        splash (gambar, latar blur gelap bila layar lebih lebar), pilih karakter (digeser ke tengah), HUD, overlay, T()
docs/reference/blueprint.jpg, splash_original.jpg ; docs/sprite_pipeline/ (skrip + sheet sumber, lihat bagian 6)
```
Resolusi logis: tinggi tetap 450; lebar **800** (portrait/desktop) atau **800–1080** (HP landscape, mengikuti rasio layar, `fit()` di main.js). Kode yang butuh lebar pakai `G.W`; menu pakai offset `(G.W-800)/2`.
Dunia sisi-scroll; kamera mengunci saat wave. 3 nyawa, +40% HP antar-stage.

## 4. Karakter
| id | Nama | Senjata | Special | Stat & gaya |
|---|---|---|---|---|
| abah | Abah (Sang Ayah) | Pecutan Sarung | **Pecutan Maut** (api oranye) | HP140 SPD100 DMG13 reach66 |
| ema | Ema (Sang Ibu) | Sepatula & Panci | **Dapur Mematikan** (ungu) | HP120 SPD115 DMG12, special +25 HP |
| rhejab | Rhe~jab (Anak Pertama) | Golok | **Tebasan Kilat** (biru-putih) | HP100 SPD150 DMG11, special dmg ×3 |
| yhudhaaa | Yhud~haaa (Si Bungsu) | Pentungan Lightstick | **Cahaya Penuntun** (cincin merah) | HP85 SPD160 DMG9, jarak jauh |
Kontrol: WASD/panah gerak · J/Space/Z serang · K/X lompat · L/C special (cooldown 6 dtk) · ←/→+Enter pilih · sentuh: joystick + 3 tombol.
Warna UI: abah #4da3ff, ema #b36bff, rhejab #3ddc4a, yhudhaaa #f5a623.

## 5. UX / layout (terbaru)
- **Pilih karakter PORTRAIT (23 Nov, redesign):** kanvas tinggi 450×H (H mengikuti rasio layar, `fit()` di main.js, `isTall()`), judul & panel kontrol disembunyikan saat state select. Isi: kartu detail (sprite in-game beranimasi + siklus aksi/special dengan efek asli, statistik, senjata, special), panel LATAR BELAKANG (`src/lore.js`, DRAFT), tombol MULAI, potret kecil 4 karakter di bawah (`assets/portraits/<id>_thumb.png`, dibuat otomatis dari sprite). Opsional `assets/portraits/<id>_full.png` (key art besar, auto-terdeteksi). Prompt: `PORTRAIT_PROMPTS.md`. Landscape/desktop tetap layar kartu lama (`drawSelect`).
- **Portrait sentuh:** judul "LEGACY OF FOUR" + bezel layar di tengah area atas; panel arcade di bawah: joystick bola merah kiri; tombol segitiga tanpa tindih (Jump kiri-atas biru, Special kanan-atas kuning, Attack besar merah di bawah).
- **Landscape sentuh (23 Nov: kontrol diperbesar ±35%, `--u = min(100dvh/430, 1.3px)`, tanpa tumpang tindih di 667x375 s/d 1024x768; fitur atur-posisi tombol DIBATALKAN user):** layar penuh tanpa bar hitam (canvas melebar), kontrol melayang transparan (.6) di dalam game, disembunyikan saat menu (splash/select/over/win; ketuk layar saja), judul disembunyikan.
- **Desktop:** kontrol sentuh disembunyikan, judul tampil.
- **Zoom** (double-tap/pinch) dimatikan di controls.js + `touch-action:none`.
- **Fullscreen:** iPhone TIDAK mengizinkan menyembunyikan bar browser. Solusi: Safari → Share → Tambah ke Layar Utama (meta apple-mobile-web-app-capable sudah ada). Tombol ⛶ (Fullscreen API) hanya muncul di browser yang mendukung (Android/iPad/desktop).
- Cache iOS keras: setelah update, tutup-buka tab bila tampilan belum berubah.

## 6. Sprite
- Sumber: 4 sheet AI user (1536×1024, latar magenta) di `docs/sprite_pipeline/source/` (abah=784BE68C…, ema=B3B3B966…, rhejab=60563C7E…, yhudhaaa=77FA7204…).
- Pipeline ulang: `docs/sprite_pipeline/{key.py,seg.py,build.py}` (butuh Python + numpy/scipy/Pillow; path input di `key.py` mengarah ke /mnt/user-data/uploads — sesuaikan). Chroma key magenta, potong komponen terhubung, belah gabungan di minimum profil kolom, bersihkan pecahan liar, skala karakter ±100 px, kaki rata di garis tanah.
- `assets/characters/<id>.png`: sel **192×160**, menghadap kanan, kaki di **(96,150)**, baris tetap: idle, walk, atk1, atk2, atk3, jump, hurt, down, special. Jumlah frame per baris BEDA per karakter → `COUNTS` di `src/spritesheets.js`:
  abah idle3 walk5 atk1 4 atk2 4 atk3 4 jump3 hurt2 down4 special7 · ema 3/5/3/3/3/3/2/4/4 · rhejab 3/6/4/3/4/3/2/4/4 · yhudhaaa 4/5/3/2/3/3/2/4/3 (urutan sama).
  Mengubah jumlah frame di sheet = ubah COUNTS.
- Pembagian atk1/2/3 untuk Ema & Yhud~haaa adalah TEBAKAN dari urutan gambar; bila gerakan terasa terbalik, geser pembagiannya di build.py + COUNTS.
- `assets/effects/fx_<id>_special.png`: strip sel **256×160** (abah 8, ema 7, rhejab 8, yhudhaaa 7 frame), jangkar kiri-bawah ≈(8,150): taruh di kaki pemain, menghadap kanan. **SUDAH dipasang** lewat `src/effects.js` (drawFx; skala = sr/85, karakter `full` (Yhud~haaa) dicerminkan dua sisi).
- Kekurangan: potongan otomatis kadang menyisakan tangan/cambuk yang terpotong antar-frame (terutama walk Rhe~jab, atk Abah). Perbaikan terbaik = sheet yang lebih rapi dari generator (frame berjarak jelas).

## 7. Status & keterbatasan jujur
- Diuji headless + Chromium (portrait 390×844, landscape 844×390/932×430, desktop) tanpa error; alur ketuk-pilih-mulai di landscape lolos. **Belum diuji langsung di iPhone oleh saya** (user mengirim screenshot hasil live: sprite & layout tampil, sempat ada tombol tumpang tindih → sudah diperbaiki di build terakhir, belum dikonfirmasi user).
- Pipeline GitHub terbukti berjalan (gagal sekali karena ZIP parsial, lalu dibenahi).
- Musuh & latar masih tema dinosaurus/hutan, tidak cocok dengan splash/keluarga (kampung/jalan sore, papan "Bersama Selalu", grafiti "Legacy Never Fades").
- Belum ada: pemuat efek special, suara/musik, item pemulih, pause, 2 pemain.

## 8. Rencana lanjutan (urut prioritas)
1. ~~Pemuat efek~~ SELESAI 23 Nov (special sprite + percikan pukul + debu pendaratan/jatuh). Dulu: (`assets/effects/fx_<id>_special.png`) menggantikan busur garis di `main.js` blok `f.sp`; + efek hit/debu/ledakan. Frame di-sync dengan `doSpecial` (durasi spT 0.5 dtk).
2. Ganti latar & musuh ke tema kampung/jalan sore (tanya user jenis musuh: preman? anjing/kucing liar?), bos sesuai cerita. Perlu sprite musuh (siapkan prompt seperti SPRITE_PROMPTS.md).
3. Audio (SFX pukul, special, BGM) di `assets/audio/`.
4. Pause, item makanan, 2 pemain, lebih banyak stage; tombol fullscreen/pause di UI.
5. Rapikan frame sprite yang terpotong bila user punya sheet yang lebih bersih.

## 9. Cara kerja yang disarankan
- Selalu kirim **ZIP game lengkap** `legacy-of-four_update.zip` (index.html di root; jangan sertakan `.github`). Cek `node --check src/*.js`, uji di Playwright/Chromium (viewport HP), lalu `present_files`.
- Jaga ringkas, langkah iPhone berbahasa Indonesia: folder `updates` → Upload files → Commit → tunggu Actions hijau → tutup-buka game.
- Jika Actions merah, minta screenshot log langkah "Validate and apply update ZIP".


## 23 Nov: Stage 1 bergambar + rencana musuh
- Stage 1 kini 'Kampung Sore' (aset user, alpha dibersihkan). Jungle Outpost diganti; stage 2 masih Volcano Rim (placeholder prosedural, bos lama).
- Musuh stage 1 masih placeholder prosedural (thug/raptor/brute). Prompt musuh Belanda + preman + anjing + Jenderal: `STAGE1_ENEMIES_PROMPTS.md` (sheet 192x160 di assets/enemies/<id>.png). Langkah berikutnya: pemuat musuh bersprite, tongkat listrik (stun), bos Jenderal.
- Catatan merek: s1_mid_c.png menampilkan logo 'Indomaret' (merek dagang nyata).

## 24 Nov: perbaikan stage 1, anti-cache, dev tools
- Latar: panel `s1_mid_b` diturunkan 32 px agar garis dasar sejajar A dan C; logo/papan minimarket (lubang transparan akibat key-out putih) diisi lagi; noise dibuang. Skrip: `docs/sprite_pipeline/prep_stage1_bg.py <folder_upload> assets/backgrounds` (sumber = file asli user).
- **Anti-cache deploy:** `index.html` kini bootstrap: baca `assets/build.json` (no-store) lalu memuat CSS/JS/gambar dengan `?v=<build>`; import map memetakan semua `src/*.js` ke versi bernomor (butuh Safari 16.4+, bila tidak ada hanya entri yang bernomor). Gambar lewat `asset()` di `src/ver.js`. **Setiap membuat update ZIP jalankan `python3 docs/sprite_pipeline/stamp_build.py`** (menulis build.json baru + daftar modul). Modul baru otomatis ikut karena daftar dibuat dari `src/*.js`.
- **Dev tools** (`src/dev.js`, dibuat lewat JS, aktif saat state play/clear/over/win): Bunuh musuh, Bunuh diri (HP pemain 0, kehilangan 1 nyawa), Lewati stage. Tombol DEV menyembunyikan/menampilkan (disimpan di localStorage `lof_dev`). Portrait: di bawah layar; landscape: melayang di bawah tengah.
- Debug: `window.__G` = state game.
