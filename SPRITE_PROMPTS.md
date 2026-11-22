# LEGACY OF FOUR — PANDUAN PROMPT SPRITE (untuk generator gambar AI / pixel artist)

Referensi wajib dilampirkan di setiap generate: **blueprint.jpg** (docs/reference) + splash. Prompt ditulis Inggris karena generator lebih patuh.

## A. Alur kerja yang disarankan
1. Generate **1 gambar acuan per karakter** (pose berdiri, 3/4 sisi kanan) dengan lampiran blueprint → kunci wajah, kostum, warna.
2. Untuk tiap frame, generate dengan **gambar acuan yang sama + seed/“character reference” yang sama**, latar polos **magenta #FF00FF** (mudah dihapus).
3. Hasil AI jarang rapi per-piksel → **perkecil dengan nearest-neighbor** ke 128×128, rapikan di Aseprite/Pixilart (palet dikunci, garis tepi 1 px gelap).
4. Susun jadi sheet sesuai spesifikasi di bagian D. Kirim ke chat; saya pasang lewat update ZIP.
Tips: pakai generator khusus pixel-art bila ada; generate 4 varian per frame lalu pilih yang paling konsisten.

## B. Blok gaya (tempel di AWAL semua prompt)
```
STYLE: 16-bit arcade beat 'em up game sprite, in the style of Cadillacs and Dinosaurs and Streets of Rage 2,
clean pixel art, limited palette (max 32 colors), crisp 1px dark outline, hard pixel edges, no anti-aliasing,
no blur, no gradients, cel-shaded 3-tone shading, light from top-left, side view facing RIGHT, full body visible,
feet on the same baseline, solid flat magenta (#FF00FF) background, no ground shadow, no text, no watermark, no grid.
Match the attached blueprint exactly (face, outfit, colors, proportions). Canvas 128x128, character height ~96px.
NEGATIVE: realistic, 3d render, painterly, smooth shading, blurry, extra limbs, extra fingers, different outfit,
changed colors, text, logo, background scenery, cropped body, multiple characters.
```

## C. Deskripsi karakter (tempel setelah blok gaya)
- **ABAH**: elderly Malay father, black songkok/peci cap, white full beard and eyebrows, stern face, white collared shirt with chest pocket,
  green plaid sarong, brown sandals. Weapon: braided brown leather whip (sarong whip) with dark grip. Sturdy, slightly stocky.
- **EMA**: middle-aged Malay mother, lilac/purple hijab, brown-orange batik long dress with dark patterns, stern determined face.
  Weapons: stainless steel spatula (right hand) and steel saucepan (left hand, used as shield/bash).
- **RHE~JAB**: young man, eldest child, short messy black hair, determined look, black t-shirt, green plaid sarong tied at waist,
  brown sandals. Weapon: Malay golok/parang machete with brown wooden handle and bright steel blade.
- **YHUD~HAAA**: youngest son, white baseball cap, friendly cocky smile, neon lime-green reflective safety vest over black tee,
  brown cargo pants, white sneakers, whistle necklace. Weapon: glowing red traffic lightstick baton.

## D. Daftar frame (satu prompt per frame; ganti [CHAR] dan baris AKSI)
Format: `[BLOK GAYA] [DESKRIPSI KARAKTER], ANIMATION FRAME: [AKSI]`

| Anim (frame) | Baris AKSI |
|---|---|
| **idle** (4) | 1: relaxed ready stance, weapon held low · 2: chest rises slightly, weight on back foot · 3: same as 1 · 4: slight shift forward |
| **walk** (6) | contact pose L foot forward · down pose · passing pose · contact R foot forward · down · passing. Arms swing opposite to legs, weapon held ready |
| **atk1** (4) | 1: wind-up pulling weapon back · 2: fast forward strike, arm fully extended · 3: follow-through · 4: recover |
| **atk2** (4) | same as atk1 but different direction: lower, diagonal strike (second hit of combo) |
| **atk3** (5) | big finishing blow: crouch and coil · leap into swing · apex of heavy overhead/wide strike · impact with motion lines · recover. Strongest, most dramatic |
| **jump** (3) | crouch before jump · mid-air legs tucked, weapon raised · falling, legs extended |
| **hurt** (2) | 1: head snapped back, eyes shut, body leaning back · 2: staggering back, arms flung out |
| **down** (4) | falling backward · hitting the ground · lying flat on back · pushing up to stand |
| **special** (8) | see per-character below |

**Penyesuaian senjata (tambahkan ke AKSI atk1–atk3):**
- ABAH: whip lashes in a long arc (atk1 horizontal crack, atk2 low sweep, atk3 overhead spiral whip over head).
- EMA: atk1 spatula swat, atk2 saucepan bash forward, atk3 spinning swing with the pan then spatula.
- RHE~JAB: atk1 horizontal slash, atk2 rising diagonal slash, atk3 wide double slash with blade glint.
- YHUD~HAAA: atk1 baton thrust forward, atk2 baton sweep, atk3 spinning baton swing leaving red light trail.

**SPECIAL (8 frame) per karakter:**
- ABAH – *Pecutan Maut*: stance low, whip coiled back → whip cracks into huge sweeping arc ahead → follow through, dust kicked up around feet.
- EMA – *Dapur Mematikan*: deep lunge, pan swung forward in a wide sweep, purple energy swirl trailing → pose held, purple sparks.
- RHE~JAB – *Tebasan Kilat*: low fast lunge, golok drawn back → ultra-fast slash forward with white-blue crescent → blade extended, afterimage.
- YHUD~HAAA – *Cahaya Penuntun*: arms spread, lightstick raised → spins body, red-orange light ring circles the character → fire sparks and glow at feet.
(Frame karakter special TANPA efek; efeknya dibuat terpisah di bagian E supaya bisa diatur di game.)

## E. Efek (prompt terpisah, latar magenta atau transparan)
Gaya efek: `pixel art VFX sprite animation frame, 16-bit arcade, bright core fading to saturated edges, hard pixel edges, no anti-aliasing, solid magenta background, 256x256, 8 frames progression: [DESKRIPSI]`
- **fx_abah_special** (8): giant orange-gold crescent whip slash sweeping left-to-right, growing then fading into sparks and dust clouds at the bottom.
- **fx_ema_special** (8): purple/violet energy wave swirling forward like a kitchen blast, pan-shaped shockwave, white-hot core, lilac sparks.
- **fx_rhejab_special** (8): white-blue lightning crescent slash, thin sharp blade-shaped streak with cyan glow, afterimage trail, tiny sparks.
- **fx_yhudhaaa_special** (8): red-orange circular light ring expanding around center, rotating arcs of light, flames and sparks, bright burst at peak.
- **fx_hit** (5): comic-style impact spark, white star burst → yellow → orange → fade (small, 128px centered).
- **fx_burst** (6): "ledakan cahaya" light explosion, white flash → yellow-orange fireball ring → smoke puffs → fade.
- **fx_dust** (5): small brown dust puffs kicked up from feet, expanding and fading.

## F. Musuh & latar (opsional, supaya satu gaya dengan splash — kampung/jalan sore)
- Musuh (tiap jenis: walk 6, attack 4, hurt 2, down 4): preman jalanan berjaket, preman bertubuh besar (brute), pelari cepat; bos: sosok besar pemimpin geng. Tanyakan ke user tema musuh yang diinginkan.
- Latar parallax 3 lapis (tile horizontal, tinggi 450, lebar 1600): (1) langit senja ungu-oranye + matahari, (2) rumah genteng merah, tiang listrik, kabel, pohon, grafiti "LEGACY NEVER FADES", papan "BERSAMA SELALU", (3) jalan aspal retak dengan trotoar.
  Prompt: `pixel art side-scrolling beat 'em up background, Malaysian kampung street at sunset, ... seamless horizontal tile, 16-bit, limited palette`.

## G. Cek kualitas sebelum dikirim
- Ukuran frame persis sama; kaki selalu di titik yang sama; menghadap kanan; latar transparan (hapus magenta).
- Warna & kostum konsisten antar-frame (peci Abah, hijab ungu Ema, rompi hijau neon Yhud~haaa).
- Nama file: `abah.png ema.png rhejab.png yhudhaaa.png` + efek `fx_*.png`.
