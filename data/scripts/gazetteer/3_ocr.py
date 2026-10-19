import sys, json, subprocess, os, re
import numpy as np
from PIL import Image, ImageOps
from scipy import ndimage
from concurrent.futures import ThreadPoolExecutor
G=sys.argv[1]
L=json.load(open(f'{G}/layout.json'))
env=dict(os.environ, TESSDATA_PREFIX=f'{G}/tessdata', OMP_THREAD_LIMIT='1')
os.makedirs(f'{G}/ocrin',exist_ok=True)
def blank(im):
    d=np.array(im)<150; lab,n=ndimage.label(d)
    return not any((s[0].stop-s[0].start)>12 for s in ndimage.find_objects(lab))
def tess(p,lang): return subprocess.run(['tesseract',p,'-','-l',lang,'--psm','7'],capture_output=True,text=True,env=env).stdout.strip()
def clean(s): s=re.sub(r'^[.…।,:;|\'"`‘’“”_~ ]+|[.…।,:;|\'"`‘’“”_~ ]+$','',s.strip()); s=re.sub(r'\s*\.\.+\s*',' ',s); return re.sub(r'\s+',' ',s).strip()
def run(j):
    leaf,i=j; out=[leaf,i]
    for c in (1,2,3,4):
        im=Image.open(f'{G}/cells/{leaf}_{i:02d}_{c}.png').convert('L')
        if blank(im): out.append(''); continue
        p=f'{G}/ocrin/{leaf}_{i:02d}_{c}.png'
        ImageOps.expand(im.resize((im.width*2,im.height*2),Image.BICUBIC),30,fill=255).save(p)
        out.append(clean(tess(p,'eng' if c<4 else 'mar+hin')))
    return out
jobs=[(int(l),i) for l in L for i in range(len(L[l]['rows']))]
with ThreadPoolExecutor(8) as ex: res=list(ex.map(run,jobs))
with open(f'{G}/ocr.tsv','w') as f:
    for r in res: f.write('\t'.join(map(str,r))+'\n')
print(len(res))
