# Membangun assets/enemies/<id>.png + src/enemydata.js dari sheet AI user (1536x1024 dll).
# Pakai: python3 build_enemies.py <folder_upload> <root_game>
# Sel 192x160, menghadap kanan, kaki di (96,150). Baris: idle, walk, atk, hurt, down. Kolom = frame terbanyak.
import sys, json, numpy as np
from PIL import Image
from extract_enemy import frames
U = sys.argv[1].rstrip('/') + '/'; R = sys.argv[2].rstrip('/') + '/'
FW, FH, AX, AY = 192, 160, 96, 150
# (baris, [indeks]) -> daftar frame per animasi. Skala = piksel game per piksel sheet.
CFG = {
 'tentara_a': dict(s=0.54, idle=[(0,range(8))], walk=[(1,range(8))], atk=[(2,range(8))], hurt=[(3,range(4))], down=[(4,range(7))]),
 'tentara_b': dict(s=0.54, idle=[(0,range(8))], walk=[(1,range(8))], atk=[(2,range(8))], hurt=[(3,range(4))], down=[(4,range(7))]),
 'tentara_c': dict(s=0.54, idle=[(0,range(8))], walk=[(1,range(8))], atk=[(2,range(8))], hurt=[(3,range(4))], down=[(4,range(7))]),
 'preman_a':  dict(s=0.48, idle=[(0,range(8))], walk=[(1,range(8))], atk=[(2,range(8))], hurt=[(3,range(4))], down=[(3,[6,7]),(4,range(6))]),
 'preman_b':  dict(s=0.58, idle=[(0,range(8))], walk=[(1,range(8))], atk=[(3,range(8))], hurt=[(4,range(4))], down=[(4,[7]),(5,range(7))]),
 'preman_c':  dict(s=0.54, idle=[(0,range(5))], walk=[(1,range(8))], atk=[(2,range(8))], hurt=[(4,range(4))], down=[(3,[5,6,7]),(4,range(4,8))]),
 'preman_d':  dict(s=0.58, idle=[(3,range(4))], walk=[(1,range(2,8))], atk=[(2,range(8))], hurt=[(3,range(4,8))], down=[(4,range(7))]),
 'anjing_a':  dict(s=0.42, idle=[(0,range(8))], walk=[(1,range(8))], atk=[(2,range(8))], hurt=[(3,range(3))], down=[(3,[4,5,6]),(4,[1])]),
 'anjing_b':  dict(s=1.05, idle=[(0,range(3))], walk=[(1,range(6))], atk=[(2,range(4)),(3,range(1,5))], hurt=[(4,range(2))], down=[(5,range(3))]),
}
ORDER = ['idle', 'walk', 'atk', 'hurt', 'down']
KILLW = lambda n: n.startswith('tentara') or n.startswith('anjing_a')
LEGW = lambda n: n.startswith('preman_') and n != 'preman_a'

def place(fr, s):
    im = Image.fromarray(fr['img']); w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
    im = im.resize((w, h), Image.LANCZOS); a = np.array(im); a[:, :, 3] = np.where(a[:, :, 3] >= 128, 255, 0); im = Image.fromarray(a)
    arr = np.array(im)[:, :, 3] > 0; ys, xs = np.where(arr)
    if h > 0.7 * w:  # berdiri: jangkar x = tengah kaki (15% baris bawah)
        low = ys >= ys.max() - max(2, int(h * 0.15)); ax = int(xs[low].mean())
    else: ax = (xs.min() + xs.max()) // 2
    cell = Image.new('RGBA', (FW, FH), (0, 0, 0, 0)); ox, oy = AX - ax, AY - ys.max() - 1
    cell.alpha_composite(im, (max(0, ox), max(0, oy))) if ox >= 0 and oy >= 0 else cell.paste(im, (ox, oy), im)
    clip = (ox < 0 or ox + w > FW or oy < 0)
    return cell, clip, h

data = {}
for n, c in CFG.items():
    rows = frames(U + n + '.png', killwhite=KILLW(n), legwhite=LEGW(n)); anims = {}; maxc = 0; clipn = 0; hs = []
    for a in ORDER:
        lst = []
        for r, idx in c[a]:
            for i in idx: lst.append(rows[r][i])
        cells = []
        for f in lst:
            cell, clip, h = place(f, c['s']); cells.append(cell); clipn += clip; hs.append(h)
        anims[a] = cells; maxc = max(maxc, len(cells))
    sheet = Image.new('RGBA', (FW * maxc, FH * len(ORDER)), (0, 0, 0, 0))
    for ri, a in enumerate(ORDER):
        for ci, cell in enumerate(anims[a]): sheet.paste(cell, (ci * FW, ri * FH))
    sheet.save(f'{R}assets/enemies/{n}.png'); data[n] = {a: len(anims[a]) for a in ORDER}
    print(n, data[n], 'tinggi idle ~', int(np.median([h for h in hs[:len(anims['idle'])]])), 'dipotong:', clipn)
open(R + 'src/enemydata.js', 'w').write('// Dibuat oleh docs/sprite_pipeline/build_enemies.py. Baris: idle, walk, atk, hurt, down. Sel 192x160, kaki di (96,150).\nexport const ECOUNTS = ' + json.dumps(data) + ';\n')
