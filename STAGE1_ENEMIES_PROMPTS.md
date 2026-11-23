# LEGACY OF FOUR — STAGE 1: MUSUH & BOS (prompt sprite)

Cerita musuh: **pasukan Belanda yang kembali menjajah**. Di jalan kampung mereka bergabung dengan **preman bayaran** dan **anjing penjaga**. Bos: **Jenderal Belanda**.

Referensi wajib dilampirkan di setiap generate: `docs/reference/blueprint.jpg` (acuan gaya pixel-art yang sama dengan 4 karakter) + latar stage (`assets/backgrounds/s1_mid_a.png`).

## 1. Format sprite (sama dengan karakter, supaya pemuat yang ada bisa dipakai)
- Sel **192×160**, menghadap **kanan**, kaki di titik **(96,150)**, latar magenta #FF00FF lalu dihapus jadi transparan.
- Satu baris per animasi, urutan baris tetap. Frame berjarak jelas satu sama lain (jangan ada senjata yang menembus sel tetangga).
- Tinggi karakter di sel: **manusia ±100 px**, pasukan berat ±115 px, **bos ±140 px**, **anjing ±55 px** (panjang badan ±95 px).
- Nama file: `assets/enemies/<id>.png`.

| File | Isi | Baris (jumlah frame) |
|---|---|---|
| `preman_a.png`, `preman_b.png`, `preman_c.png` | 3 variasi preman | idle 3 · walk 6 · **pukul** (atk1) 4 · **serang** (atk2) 4 · hurt 2 · down 4 |
| `tentara_a.png`, `tentara_b.png`, `tentara_c.png` | 3 variasi tentara Belanda | idle 3 · walk 6 · **pukul** 4 · **serang** 4 · hurt 2 · down 4 |
| `anjing_a.png`, `anjing_b.png` | 2 variasi anjing | idle 3 · lari 6 · **gigit** 4 · **terkam** 5 · hurt 2 · down 3 |
| `jenderal.png` | bos | idle 4 · walk 6 · **pukul** 5 · **hantam** (atk2) 6 · **amuk** (atk3) 6 · taunt 4 · hurt 2 · down 5 |

Arti animasi: **pukul** = serangan ringan cepat. **serang** = serangan utama yang mengenai pemain (frame ke-3 = momen kena). **hantam** (bos) = pentungan diangkat lalu dihantam ke tanah, bertepatan dengan gelombang kejut di game.

## 2. Alur kerja
1. Generate **1 gambar acuan per musuh** (berdiri, 3/4 kanan). Cek wajah dan kostum.
2. Generate **sheet** per musuh dengan acuan itu memakai prompt di bagian 5. Minta 4 varian lalu pilih yang paling konsisten.
3. Perkecil nearest-neighbor, rapikan palet, hapus magenta. Kirim ke chat, saya pasang lewat update ZIP (pemuat musuh bersprite + 3 gelombang stage + bos).

## 3. Blok gaya, tempel di AWAL semua prompt
```
STYLE: 16-bit arcade beat 'em up enemy sprite sheet, in the style of Streets of Rage 2 and Cadillacs and Dinosaurs, clean pixel art,
limited palette (max 32 colors), crisp 1px dark outline, hard pixel edges, no anti-aliasing, no blur, cel-shaded 3-tone shading,
light from top-left, side view facing RIGHT, full body visible, feet on the same baseline in every frame, solid flat magenta (#FF00FF)
background, no ground shadow, no text, no watermark, no grid lines. Same art style and pixel density as the attached blueprint.
Each frame sits in its own clearly separated cell of 192x160 px with empty margin so nothing touches the neighbor cell.
NEGATIVE: realistic, 3d render, painterly, smooth shading, blurry, extra limbs, extra fingers, gore, blood, changed outfit between frames,
text, logo, background scenery, cropped body, multiple characters per frame.
```

## 4. Deskripsi musuh (tempel setelah blok gaya)

**PREMAN A — "Golok"**: lean street thug, tan skin, red bandana around the head, sleeveless dark denim vest over bare chest, ripped jeans, worn sandals, scar on cheek. Weapon: large Indonesian golok machete with rusty steel blade and wooden handle, held in right hand.
**PREMAN B — "Pisau"**: wiry thug, shaved head with a thin mustache, tight white tank top (singlet) with sweat stains, tribal tattoo on the shoulder, black cargo shorts, flip-flops, chain necklace. Weapon: a long kitchen knife held in reverse grip.
**PREMAN C — "Jaket Kulit"**: stocky thug, cap worn backwards, black faux-leather jacket with a gold dragon on the back, dark jeans, boots, gold teeth grin. Weapon: a curved belati dagger in each hand (two short knives).

**TENTARA A — Prajurit**: Dutch colonial soldier of the 1940s, steel combat helmet, khaki-olive uniform with leather belt and ammo pouches, tall brown boots, small orange armband, stern pale face. Weapon: an electric baton (tongkat listrik): black rod with a metal tip crackling with blue-white electric sparks.
**TENTARA B — Sersan**: Dutch sergeant, wide-brim khaki hat with a small orange badge, big blond mustache, khaki uniform with sergeant chevrons on the sleeve, polished boots, red face. Same crackling electric baton, held higher and more aggressive.
**TENTARA C — Pasukan Berat**: big heavy Dutch trooper (broader and taller than others), steel helmet with a face guard, grey-green armored chest plate over the uniform, orange armband, thick gloves. Electric baton larger with a brighter, wider electric arc.

**ANJING A — Anjing Kampung**: skinny aggressive stray dog, short brown fur with a dark muzzle, ribs slightly visible, bared teeth, drooling, torn ear, bristling back fur.
**ANJING B — Anjing Penjaga**: muscular black-and-tan German shepherd-type guard dog with a spiked leather collar bearing a small orange tag, bared fangs, intense eyes, tail raised.

**JENDERAL (BOS)**: tall, broad-shouldered Dutch general, 50s, black beret with a gold-and-orange badge tilted on his head, cold blue eyes, grey crew-cut sideburns, thick grey mustache, a scar across one eyebrow. Heavy olive-green military jacket with medals and gold shoulder epaulettes; the LEFT SLEEVE IS TORN OPEN above the elbow showing a muscular forearm with a visible TATTOO (an anchor entwined with a crowned lion, no text). Black leather gloves, wide belt with a gold buckle, polished black boots. Weapon: a thick military truncheon (pentungan) of dark wood with a leather wrist strap and a metal cap, swung one-handed. Looks intimidating and disciplined.

## 5. Prompt sheet (satu per musuh)
Format: `[BLOK GAYA] [DESKRIPSI MUSUH], ANIMATION SPRITE SHEET with one row per animation, rows top to bottom: [DAFTAR BARIS]`

**Preman & tentara** (ganti [DESKRIPSI]):
```
ROWS: 1 IDLE (3 frames): menacing ready stance, weapon held low, slight breathing bob.
2 WALK (6 frames): walk cycle toward the right, contact/down/passing poses, weapon held ready, arms swing opposite to legs.
3 PUKUL (4 frames): quick light attack: wind-up, fast forward strike with the weapon, follow-through, recover.
4 SERANG (4 frames): main attack: big wind-up pulling the weapon back, leaning forward, powerful strike (frame 3 = moment of impact, motion lines),
recover. Soldiers: the baton discharges a bright electric arc on frame 3.
5 HURT (2 frames): head snapped back, eyes shut, body leaning back; then staggering back.
6 DOWN (4 frames): falling backward, hitting the ground, lying flat on back, weapon dropped beside the body.
Total sheet: 6 rows, up to 6 columns, each cell 192x160.
```
Tambahan senjata per variasi: **Preman A** serang = tebasan golok diagonal dari atas · **Preman B** serang = tusukan cepat dua kali · **Preman C** serang = tusuk silang dengan dua belati · **Tentara A** serang = sodokan tongkat ke depan · **Tentara B** serang = ayunan horizontal lebar · **Tentara C** serang = hantaman tongkat dari atas, percikan listrik besar.

**Anjing**:
```
ROWS: 1 IDLE (3 frames): standing, growling, head lowered, tail twitching.
2 LARI (6 frames): full gallop cycle to the right, legs extended and tucked, ears back.
3 GIGIT (4 frames): head thrusting forward to bite, mouth wide, snapping shut, recover.
4 TERKAM (5 frames): crouch, leap forward with open mouth, apex in the air, landing, recover.
5 HURT (2 frames): yelp, body recoiling backward; staggering.
6 DOWN (3 frames): knocked over onto its side, lying flat, legs twitching. No blood.
Total sheet: 6 rows, up to 6 columns, each cell 192x160, dog about 95 px long.
```

**Jenderal (bos)** (boleh dibagi 2 gambar bila generator kewalahan: baris 1-4 dan baris 5-8):
```
ROWS: 1 IDLE (4 frames): upright commanding stance, truncheon tapped against the palm, chest rising.
2 WALK (6 frames): slow heavy march to the right, shoulders swaying, truncheon held at his side.
3 PUKUL (5 frames): fast horizontal truncheon swing: wind-up, wide sweep, follow-through, recover.
4 HANTAM (6 frames): raises the truncheon high with both hands, rears back, slams it down into the ground (frame 4 = impact with a
yellow-white shockwave ring of dust), holds, recovers.
5 AMUK (6 frames): enraged flurry: three rapid alternating truncheon strikes, shouting with an open mouth.
6 TAUNT (4 frames): raises the truncheon, points forward, barks an order.
7 HURT (2 frames): head snapped back, beret slipping, staggering.
8 DOWN (5 frames): staggering, falling to his knees, collapsing face-up, beret dropped beside him, lying still.
Total sheet: 8 rows, up to 6 columns, each cell 192x160, general about 140 px tall (bigger than other characters).
```

## 6. Rencana penerapan di game (saya kerjakan setelah sprite masuk)
| Musuh | Peran | Stat awal |
|---|---|---|
| Preman A/B/C | pasukan dasar, 3 variasi acak | HP 30·22·40, kecepatan sedang-cepat, dmg 6–9 |
| Tentara A/B | lebih tahan, tongkat listrik membuat pemain **terhenti sebentar** (stun) | HP 55, dmg 11, kecepatan lambat |
| Tentara C | pasukan berat, mini-boss | HP 110, dmg 16 |
| Anjing A/B | pelari cepat, menerkam | HP 22, kecepatan 125, dmg 7 |
| Jenderal | bos akhir stage di depan minimarket: pukul, hantam (gelombang kejut), amuk saat HP < 40% | HP 380 |

Gelombang usulan (x = posisi pemain): 500 → 3 preman · 1100 → 2 preman + 2 anjing · 1650 → 2 tentara + preman · **2200 → Jenderal + 2 tentara** (kamera terkunci di arena parkiran).

## 7. Cek kualitas
- Ukuran sel konsisten, kaki selalu di titik yang sama, menghadap kanan, latar transparan.
- Warna kostum konsisten antar-frame (ikat kepala merah, helm baja, baret hitam, lengan sobek + tato Jenderal terlihat di semua frame).
- Tidak ada darah atau gore. Frame down cukup digambarkan terkapar.
