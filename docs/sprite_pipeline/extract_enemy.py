import numpy as np, json, sys
from PIL import Image
from scipy import ndimage as ndi
U='/mnt/user-data/uploads/'

def sprite_mask(path,killwhite=False):
    im=Image.open(path); a=np.array(im.convert('RGBA'))
    if im.mode=='RGBA' and (a[:,:,3]<250).mean()>0.2:
        m=a[:,:,3]>=128
        return a,m,None
    rgb=a[:,:,:3].astype(int); mx=rgb.max(2); mn=rgb.min(2)
    bgl=(mn>=205)&((mx-mn)<=30)
    lab,n=ndi.label(bgl)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(border))
    if killwhite:
        sizes=ndi.sum(bgl,lab,range(1,lab.max()+1))
        big=[i+1 for i,z in enumerate(sizes) if z>=90 and (i+1) not in border]
        bg=bg|np.isin(lab,big)
    return a,~bg,(lab,[i+1 for i,z in enumerate(ndi.sum(bgl,lab,range(1,lab.max()+1))) if z>=40 and (i+1) not in border])

def frames(path, bodymin=700, killwhite=False, legwhite=False):
    a,m,bl=sprite_mask(path,killwhite)
    m=ndi.binary_opening(m,structure=np.ones((2,2)))|(m&ndi.binary_dilation(ndi.binary_opening(m,structure=np.ones((2,2))),iterations=1)&m)
    lab,n=ndi.label(m,structure=np.ones((3,3)))
    objs=ndi.find_objects(lab); areas=ndi.sum(m,lab,range(1,n+1))
    comps=[]
    for i,(sl,ar) in enumerate(zip(objs,areas),1):
        if ar<15: continue
        h=sl[0].stop-sl[0].start; w=sl[1].stop-sl[1].start
        comps.append(dict(id=i,y0=sl[0].start,y1=sl[0].stop,x0=sl[1].start,x1=sl[1].stop,area=ar,h=h,w=w))
    bodies=[c for c in comps if c['area']>=bodymin]
    small=[c for c in comps if c['area']<bodymin]
    keep={c['id']:[c['id']] for c in bodies}
    for s in small:
        if s['h']<14 and s['w']>s['h']*2.5: continue  # bayangan tipis
        best=None;bd=1e9
        for b in bodies:
            dx=max(b['x0']-s['x1'],s['x0']-b['x1'],0); dy=max(b['y0']-s['y1'],s['y0']-b['y1'],0); d=(dx*dx+dy*dy)**.5
            if d<bd: bd=d;best=b
        if best is not None and bd<28: keep[best['id']].append(s['id'])
    out=[]
    for b in bodies:
        ids=keep[b['id']]; mm=np.isin(lab,ids)
        ys,xs=np.where(mm); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
        if legwhite and bl is not None:
            lab2,ids2=bl; h=y1-y0; w=x1-x0
            if h>0.6*w:
                for bid in ids2:
                    bm=(lab2==bid)&mm
                    if bm.sum()<40: continue
                    yy,xx=np.where(bm)
                    if yy.mean()>y0+0.60*h: mm=mm&~bm
        crop=a[y0:y1,x0:x1].copy(); crop[~mm[y0:y1,x0:x1],3]=0
        out.append(dict(img=crop,box=(x0,y0,x1,y1)))
    # kelompokkan per baris berdasarkan titik kaki (y1)
    out.sort(key=lambda f:f['box'][3])
    rows=[];
    for f in out:
        if rows and f['box'][3]-np.mean([g['box'][3] for g in rows[-1]])<95: rows[-1].append(f)
        else: rows.append([f])
    for r in rows: r.sort(key=lambda f:(f['box'][0]+f['box'][2])/2)
    return rows

if __name__=='__main__':
    for n in sys.argv[1:]:
        rows=frames(U+n+'.png'); print(n,[len(r) for r in rows])
