# Membersihkan aset latar Stage 1 dari upload user (alpha biner, buang bintik, isi logo, sejajarkan garis dasar panel).
# Pakai: python3 prep_stage1_bg.py <folder_upload> <folder_keluar>
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, out = sys.argv[1] + '/', sys.argv[2] + '/'
BASE = 297  # garis dasar bangunan di kanvas 300 px (panel A dan C sudah di 297-299)

def binarize(a, minpx=250):
    m = a[:, :, 3] >= 128
    lab, n = ndi.label(m, structure=np.ones((3, 3)))
    sizes = ndi.sum(m, lab, range(1, n + 1)); keep = np.zeros(n + 1, bool); keep[1:] = sizes >= minpx
    return keep[lab]

def fill_rects(a, m, rects):
    """Isi lubang tertutup (area putih yang ikut terhapus saat key-out) di dalam kotak yang ditentukan."""
    lab, k = ndi.label(~m); H, W = m.shape
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    for i in range(1, k + 1):
        if i in border: continue
        ys, xs = np.where(lab == i); cx, cy = xs.mean(), ys.mean()
        if any(x0 <= cx <= x1 and y0 <= cy <= y1 for x0, y0, x1, y1 in rects):
            rgb = a[ys, xs, :3].astype(int)
            grey = (abs(rgb[:, 0] - rgb[:, 1]) < 8) & (abs(rgb[:, 1] - rgb[:, 2]) < 8) & (rgb[:, 0] > 180)
            rgb[grey] = (246, 246, 240)
            a[ys, xs, :3] = rgb; m[ys, xs] = True
    return m

for n in ['far', 'mid_a', 'mid_b', 'mid_c']:
    a = np.array(Image.open(f'{src}s1_{n}.png').convert('RGBA')); m = binarize(a)
    if n == 'mid_c':  # fasad minimarket, papan pylon, bendera
        m = fill_rects(a, m, [(238, 104, 585, 300), (590, 5, 700, 112), (690, 120, 725, 262)])
    if n == 'mid_b':  # papan MINIMARKET (koordinat sebelum digeser)
        m = fill_rects(a, m, [(515, 143, 705, 185)])
    if n == 'mid_b':  # buang noise di bawah garis dasar (y>266) lalu turunkan panel agar sejajar A dan C
        m[267:, :] = False
        a[:, :, 3] = np.where(m, 255, 0); a[~m, :3] = 0
        base = 265; d = BASE - base
        shifted = np.zeros_like(a); shifted[d:, :, :] = a[:a.shape[0] - d, :, :]; a = shifted
        Image.fromarray(a).save(f'{out}s1_{n}.png'); print(n, 'digeser', d, 'px'); continue
    a[:, :, 3] = np.where(m, 255, 0); a[~m, :3] = 0
    Image.fromarray(a).save(f'{out}s1_{n}.png')
print('selesai')
