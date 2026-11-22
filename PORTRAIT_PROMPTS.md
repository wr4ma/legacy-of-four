# LEGACY OF FOUR — PROMPT PORTRAIT & KEY ART (layar Pilih Karakter)

Semua opsional. Game sudah memakai potret otomatis dari sprite. Ganti dengan hasil AI memakai NAMA FILE yang sama.

| File | Ukuran | Dipakai untuk |
|---|---|---|
| `assets/portraits/<id>_thumb.png` | 192×192, persegi | potret kecil di bawah layar (menggantikan yang otomatis) |
| `assets/portraits/<id>_full.png` | ±800×1200, latar TRANSPARAN | gambar besar karakter di kartu detail. Bila ada, sprite in-game tampil kecil di pojok kartu |

`<id>` = `abah`, `ema`, `rhejab`, `yhudhaaa`. Lampirkan `docs/reference/blueprint.jpg` di setiap generate agar wajah dan kostum konsisten.

## A. Blok gaya, tempel di AWAL semua prompt
```
STYLE: 16-bit arcade fighting-game character select art, in the style of Cadillacs and Dinosaurs and Streets of Rage 2 / King of Fighters
portraits, detailed pixel art, limited palette (max 48 colors), crisp 1px dark outline, hard pixel edges, no anti-aliasing,
cel-shaded shading, light from top-left. Match the attached blueprint exactly (face, outfit, colors, proportions). No text, no logo,
no watermark, no frame, no background scenery.
NEGATIVE: realistic, 3d render, painterly, smooth gradients, blurry, extra limbs, extra fingers, different outfit, changed colors,
text, multiple characters, cropped head.
```

## B. Potret kecil `<id>_thumb.png` (bust, 192×192)
Tambahkan setelah blok gaya. Latar: gradien polos sesuai warna karakter (atau magenta #FF00FF lalu dihapus).
- **ABAH** (warna biru #4da3ff): `BUST PORTRAIT, head and shoulders, facing slightly right, elderly Malay father, black songkok cap, white full beard and eyebrows, stern kind eyes, white collared shirt. Background: dark blue gradient. Square 192x192.`
- **EMA** (ungu #b36bff): `BUST PORTRAIT, head and shoulders, facing slightly right, middle-aged Malay mother, lilac hijab, determined warm expression, brown-orange batik dress collar. Background: purple gradient. Square 192x192.`
- **RHE~JAB** (hijau #3ddc4a): `BUST PORTRAIT, head and shoulders, facing slightly right, young man eldest son, short messy black hair, confident determined look, black t-shirt. Background: green gradient. Square 192x192.`
- **YHUD~HAAA** (oranye #f5a623): `BUST PORTRAIT, head and shoulders, facing slightly right, youngest son, white baseball cap, cheerful cocky smile, neon lime reflective safety vest over black tee, whistle necklace. Background: orange gradient. Square 192x192.`

## C. Gambar besar `<id>_full.png` (full body, latar transparan)
Tambahkan setelah blok gaya. Pose heroik 3/4 menghadap kanan, seluruh badan terlihat, kaki menyentuh dasar gambar, latar polos magenta #FF00FF (hapus jadi transparan), kanvas 800×1200.
- **ABAH**: `FULL BODY KEY ART, heroic ready stance, 3/4 view facing right, holds braided brown leather sarong whip coiled in right hand, elderly father, black songkok, white beard, white shirt with chest pocket, green plaid sarong, brown sandals. Faint orange fire glow around the whip.`
- **EMA**: `FULL BODY KEY ART, fierce protective stance, 3/4 view facing right, steel spatula in right hand, steel saucepan held forward in left hand, lilac hijab, brown-orange batik long dress, determined face. Faint purple sparkle around the pan.`
- **RHE~JAB**: `FULL BODY KEY ART, fast aggressive stance, 3/4 view facing right, golok machete with brown wooden handle and bright steel blade held low behind, short messy black hair, black t-shirt, green plaid sarong, brown sandals. Faint white-blue glint on the blade.`
- **YHUD~HAAA**: `FULL BODY KEY ART, playful confident stance, 3/4 view facing right, glowing red lightstick baton in right hand, white baseball cap, neon lime safety vest over black tee, brown cargo pants, white sneakers. Faint red-orange glow from the baton.`

## D. Tips
- Generate 4 varian, pilih yang wajahnya paling mirip blueprint.
- Setelah dihapus latarnya, simpan PNG transparan. Kirim ke chat, saya pasang lewat update ZIP.
- Cerita karakter ada di `src/lore.js` (draft, bebas diubah).
