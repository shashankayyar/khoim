import sys, json, numpy as np, os
from PIL import Image, ImageDraw
from scipy import ndimage
G=sys.argv[1]; R=json.load(open(f'{G}/rows.json'))
os.makedirs(f'{G}/cells',exist_ok=True); os.makedirs(f'{G}/view',exist_ok=True)
layout={}
for leaf in range(1013,1024):
    r=R[str(leaf)]
    img=Image.open(f'{G}/img/p{leaf}.png').convert('L'); im=np.array(img); dark=im<150
    body=dark[r['top']+5:r['bot']-3]
    lab,n=ndimage.label(body); xs=[]
    for s in ndimage.find_objects(lab):
        h=s[0].stop-s[0].start; w=s[1].stop-s[1].start
        if 3<=h<=11 and 3<=w<=11: xs.append((s[1].start+s[1].stop)//2)
    hist=np.bincount(np.array(xs)//10, minlength=200)
    def cluster(lo,hi,default):
        b=[i*10 for i in range(lo//10,hi//10+1) if hist[i]>=8]
        return (min(b),max(b)+10) if b else default
    L1=cluster(555,650,(580,620)); L2=cluster(860,960,(890,930)); L3=cluster(1170,1270,(1200,1240))
    lines=[l for l in r['lines'] if l[1]-l[0]>12]
    bounds=[]
    for i,(a,b) in enumerate(lines):
        top=(lines[i-1][1]+a)//2 if i else a-14
        bot=(b+lines[i+1][0])//2 if i<len(lines)-1 else b+14
        bounds.append((top,bot))
    cols=[(r['x0']-6,L1[0]-2),(L1[1]+4,L2[0]-2),(L2[1]+4,L3[0]-2),(L3[1]+4,1660)]
    layout[leaf]={'cols':cols,'rows':bounds}
    for i,(t,b) in enumerate(bounds):
        for c,(x1,x2) in enumerate(cols):
            img.crop((x1,t,x2,b)).save(f'{G}/cells/{leaf}_{i:02d}_{c+1}.png')
    # view chunks
    for k in range(0,len(bounds),13):
        ch=bounds[k:k+13]; t=ch[0][0]; b=ch[-1][1]
        v=img.crop((r['x0']-10,t,1660,b)).convert('RGB'); d=ImageDraw.Draw(v)
        for j,(tt,bb) in enumerate(ch):
            d.text((0,tt-t+2),str(k+j),fill=(255,0,0))
        v.save(f'{G}/view/{leaf}_{k//13}.png')
        z=img.crop((cols[3][0],t,cols[3][0]+380,b)); z=z.resize((z.width*2,z.height*2),Image.LANCZOS).convert('RGB'); d=ImageDraw.Draw(z)
        for j,(tt,bb) in enumerate(ch): d.text((2,(tt-t)*2+4),str(k+j),fill=(255,0,0))
        z.save(f'{G}/view/{leaf}_{k//13}_deva.png')
    print(leaf,cols,len(bounds))
json.dump(layout,open(f'{G}/layout.json','w'))
