# LEGACY OF FOUR — STAGE 1: "KAMPUNG SORE" (prompt environment)

Tema: jalan kampung Indonesia saat sore (golden hour). Ada minimarket waralaba (bergaya Alfamart), warung gorengan, warung kopi, pos ronda, rumah warga berpagar, tiang listrik dengan kabel semrawut, motor parkir.

## 1. Spesifikasi teknis (sesuai engine)
Kanvas game: tinggi 450 px, lebar 800–1080 px. **Horizon/dasar bangunan di y=280.** Pemain berjalan di y 290–425, jadi lantai (aspal) mengisi y 280–450. 1 piksel gambar = 1 piksel game (karakter ±100 px tinggi), jadi bangunan harus se-skala: pintu ±90 px, atap rumah ±150 px dari tanah.

| Layer | Nama file (assets/backgrounds/) | Ukuran akhir | Kecepatan gulir | Catatan |
|---|---|---|---|---|
| Langit | `s1_sky.png` | 1280×290 | 0.05 | seamless kiri-kanan, tanpa bangunan |
| Jauh | `s1_far.png` | 1600×290 | 0.2 | siluet jauh, TRANSPARAN, dasar rata di y=290 |
| Tengah (utama) | `s1_mid_a.png`, `s1_mid_b.png`, `s1_mid_c.png` | 800×300 ×3 (disambung jadi 2400) | 0.5 | TRANSPARAN, dasar bangunan di y=290, tepi kiri-kanan harus nyambung |
| Lantai | `s1_ground.png` | 512×170 | 1.0 | seamless kiri-kanan, menutup y 280–450 |
| Properti (opsional) | `s1_props.png` | sheet 8 objek @ ±96 px | 1.0 | transparan, untuk dekor/benda yang bisa dipecah nanti |

Urutan zona (cocok dengan gelombang musuh di x≈500, 1100, 1800): **A** masuk kampung (0–800) → **B** deretan warung (800–1600) → **C** minimarket + parkiran (1600–2400).

## 2. Alur kerja
1. Generate dulu **1 gambar konsep lebar** (prompt di bagian 3) untuk mengunci gaya, palet, dan suasana.
2. Pakai konsep itu sebagai **gambar acuan** (reference image) di setiap layer berikutnya.
3. Generate lebih besar (2–4×), lalu perkecil dengan **nearest-neighbor** ke ukuran akhir dan rapikan palet di Aseprite/Pixilart. Hapus latar jadi transparan (gunakan latar magenta #FF00FF saat generate).
4. Kirim PNG ke chat. Saya pasang pemuat gambar parallax-nya dan menyambungkan ke stage.

## 3. Blok gaya, tempel di AWAL semua prompt
```
STYLE: 16-bit arcade beat 'em up game background, in the style of Streets of Rage 2 and Cadillacs and Dinosaurs, detailed pixel art,
limited palette (max 48 colors), crisp hard pixel edges, no anti-aliasing, no blur, no photo-realism, cel-shaded, side-view orthographic
(flat, no perspective vanishing point), warm golden-hour late afternoon light from the left, long soft shadows, orange-pink-purple sky tones,
Indonesian village (kampung) street. No people, no characters, no text overlays, no watermark.
NEGATIVE: realistic, 3d render, photograph, painterly, blurry, perspective view, fisheye, people, animals, readable copyrighted logos,
extra text, UI, grid, frame.
```

## 4. Prompt per bagian

### 4.0 Konsep utama (generate pertama, 16:9)
```
[BLOK GAYA] WIDE CONCEPT ART of one continuous side-view Indonesian kampung street at sunset, left to right: a red-white gapura (village gate)
with merah-putih flags, houses with orange clay-tile roofs and low fences, a pos ronda (guard post), a gorengan stall (warung gorengan) with a
glass display of fried snacks and a steaming wok, a warung kopi with plastic stools, a modern convenience minimarket franchise building in
red, blue and white (Alfamart-style) with a parking area and parked motorbikes, tall utility poles with tangled power lines, coconut palms
and banana trees, distant hills and a mosque dome silhouette, a warm orange sunset sky. Asphalt road with sidewalk in the foreground.
```

### 4.1 Langit `s1_sky.png` (1280×290, seamless horizontal)
```
[BLOK GAYA] SKY ONLY, seamless horizontally tileable, sunset gradient from deep purple at top to pink and warm orange at the horizon, soft
layered pixel clouds with orange highlights, a few swallows (tiny birds) silhouettes, big low sun disk partially glowing near the horizon.
No buildings, no ground. Canvas 1280x290.
```

### 4.2 Jauh `s1_far.png` (1600×290, transparan)
```
[BLOK GAYA] FAR BACKGROUND SILHOUETTE LAYER, hazy purple-blue distant shapes, bottom edge perfectly flat at the bottom of the canvas:
rolling hills and a volcano shape, rows of coconut palm silhouettes, tiny rooftops of a far village, a mosque with a dome and minaret,
a telecom tower, a water tower. Low contrast atmospheric haze, limited cool palette. Solid flat magenta #FF00FF background for the sky area.
Canvas 1600x290.
```

### 4.3 Tengah A `s1_mid_a.png` (800×300) — Masuk kampung
```
[BLOK GAYA] MID-GROUND BUILDING STRIP, side view, building bases sit on a flat line at the bottom edge, solid flat magenta #FF00FF
background. Left to right: open edge with a banana tree; a red-white Indonesian gapura arch with small merah-putih flags and bunting;
two single-storey Indonesian houses with orange clay roof tiles, cream and mint-green walls, low iron fences and potted plants, laundry
hanging on a line; a pos ronda (wooden guard hut with a bench and a kentongan); a utility pole with tangled wires at the right edge, left and
right edges end with open space so the strip can be joined to the next. Canvas 800x300.
```

### 4.4 Tengah B `s1_mid_b.png` (800×300) — Deretan warung
```
[BLOK GAYA] MID-GROUND BUILDING STRIP, side view, building bases on a flat line at the bottom edge, solid flat magenta #FF00FF background.
Left to right: edge with a utility pole; a warung gorengan: small wooden stall with tin roof, glass display case full of golden fried snacks
(bakwan, pisang goreng, tahu isi), a big steaming wok, a hand-painted board 'GORENGAN' in simple blocky letters; next to it a warung kopi
with plastic stools, hanging sachets of instant coffee, a thermos and a small TV; a tambal ban (tire repair) shack with stacked tires;
a mural of a rooster on a wall; right edge open space for joining. Canvas 800x300.
```

### 4.5 Tengah C `s1_mid_c.png` (800×300) — Minimarket + parkiran
```
[BLOK GAYA] MID-GROUND BUILDING STRIP, side view, building bases on a flat line at the bottom edge, solid flat magenta #FF00FF background.
Left edge open space; a modern two-tone red, blue and white convenience minimarket franchise (Alfamart-style) with glass doors, a canopy,
a lit sign with a generic made-up name, posters in the windows, a bench and a trash bin; a covered motorbike parking area with two parked
scooters; an ATM booth; a street lamp and utility pole at the right edge. Canvas 800x300.
```

### 4.6 Lantai `s1_ground.png` (512×170, seamless horizontal)
```
[BLOK GAYA] GROUND TEXTURE, top-down-ish side view of the street floor, seamless horizontally tileable. Top 25 px: raised concrete sidewalk with
paving blocks and a drainage gutter (got) with a few weeds; below: dark grey asphalt road with faint worn white dashed lane marking, small
cracks, a pothole, a puddle reflecting orange sunset, scattered leaves and a few bottle caps. Slight orange rim light on the sidewalk edge.
Canvas 512x170.
```

### 4.7 Properti `s1_props.png` (opsional)
Sheet 8 objek @ ±96 px, latar magenta, semua objek berdiri di garis dasar yang sama.
```
[BLOK GAYA] PROP SPRITE SHEET, 8 separate objects in one row, each ~96px tall, same ground line, solid flat magenta #FF00FF background:
1 gorengan push-cart (gerobak) with glass case, 2 parked red motor scooter, 3 stack of plastic stools, 4 green trash bin, 5 wooden crate of
bottles, 6 potted plant, 7 umbul-umbul (red-white flags on a bamboo pole), 8 cardboard boxes. Canvas 800x120.
```

## 5. Catatan
- "Alfamart" adalah merek dagang. Generator sering salah menulis logo; untuk rilis publik lebih aman memakai nama rekaan dengan warna merah-biru-putih (sudah begitu di prompt 4.5).
- Setelah gambar jadi, saya tambahkan pemuat layer (`drawBG` memakai gambar bila ada, kembali ke latar prosedural bila tidak), sehingga stage tetap jalan selama gambar belum lengkap.
