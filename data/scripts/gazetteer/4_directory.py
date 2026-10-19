import sys, subprocess, os, re, json
from PIL import Image, ImageOps
from concurrent.futures import ThreadPoolExecutor
G=sys.argv[1]; env=dict(os.environ, TESSDATA_PREFIX=f'{G}/tessdata', OMP_THREAD_LIMIT='1')
def run(leaf):
    im=Image.open(f'{G}/dir/p{leaf:04d}.png').convert('L')
    # find the first vertical rule: column 1 ends around x~580 on even pages
    c=im.crop((100,650,600,2600)); c=c.resize((c.width*2,c.height*2),Image.BICUBIC)
    p=f'{G}/dir/c{leaf}.png'; c.save(p)
    txt=subprocess.run(['tesseract',p,'-','-l','eng','--psm','4'],capture_output=True,text=True,env=env).stdout
    return leaf,txt
leaves=[l for l in range(960,1013,2)]
with ThreadPoolExecutor(8) as ex: res=dict(ex.map(run,leaves))
pat=re.compile(r"([A-Z][A-Za-z\-\.' ()]+?)\s*[;,:]\s*(BRD|BCL|CNC|QP|MRG|PRN|PND|SNG|SLCT|STR|TWD)\b")
out=[]
for l in leaves:
    for line in res[l].split('\n'):
        m=pat.search(line)
        if m: out.append((l,m.group(1).strip(),m.group(2)))
json.dump(out,open(f'{G}/dir_col1.json','w'))
print(len(out)); print(out[:30])
