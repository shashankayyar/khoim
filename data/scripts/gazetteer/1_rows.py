import sys, json, numpy as np
from PIL import Image
G=sys.argv[1]
res={}
for leaf in range(1013,1024):
    im=np.array(Image.open(f'{G}/img/p{leaf}.png').convert('L'))
    dark=im<150; H,W=dark.shape
    rs=dark.sum(1)
    rules=[y for y in range(H) if rs[y]>0.35*W]
    top=max([y for y in rules if 700<y<1000] or [700])
    bot=min([y for y in rules if y>2300] or [H-150])
    body=dark[top+5:bot-3]
    cs=body.sum(0)
    x0=int(np.argmax(cs>2))
    band=body[:, x0:x0+200]
    rp=band.sum(1)
    lines=[];inl=False
    for i,v in enumerate(rp):
        if v>1 and not inl: s=i; inl=True
        elif v<=1 and inl:
            if i-s>6: lines.append([top+5+s, top+5+i])
            inl=False
    res[leaf]={'top':top,'bot':bot,'x0':x0,'lines':lines}
    print(leaf,top,bot,x0,len(lines),[b-a for a,b in lines])
json.dump(res,open(f'{G}/rows.json','w'))
