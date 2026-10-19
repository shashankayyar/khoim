import sys, re, csv, json, difflib
G=sys.argv[1]; R=sys.argv[2]
ABBR={'BRD':['Bardez'],'BCL':['Bicholim'],'CNC':['Canacona'],'QP':['Quepem'],'MRG':['Mormugao'],'PRN':['Pernem'],'PND':['Ponda','Dharbandora'],'SNG':['Sanguem','Dharbandora'],'SLCT':['Salcete'],'STR':['Sattari'],'TWD':['Tiswadi']}
PAGE=lambda leaf: leaf-16
A=json.load(open(f'{G}/dir_col1.json'))   # (leaf,name,abbr) my OCR of the Directory, in page order
t=open(f'{G}/GR557_djvu.txt').read().split('\n')[59270:66720]
pat=re.compile(r"^([A-Z][A-Za-z\-\.' ()]+?)\s*[;,:\-]\s*(BRD|BCL|CNC|QP|MRG|PRN|PND|SNG|SLCT|STR|TWD)\b")
B=[(m.group(1).strip(),m.group(2)) for l in t for m in [pat.match(l.strip())] if m]
exact={}
for _,n,a in A: exact.setdefault(n,set()).add(a)
for n,a in B: exact.setdefault(n,set()).add(a)
countA={}
for _,n,a in A: countA[n]=countA.get(n,0)+1
countB={}
for n,a in B: countB[n]=countB.get(n,0)+1
lgd=list(csv.DictReader(open(f'{R}/data/villages_lgd.csv')))
key=lambda s: re.sub(r'[\s\-]+',' ',s.lower()).strip()
S=[]
for l in open(f'{G}/eye.tsv'):
    p=l.rstrip('\n').split('\t')
    if p[2] in ('HEADER','CONT'): continue
    S.append((int(p[0]),int(p[1]),p[2].lstrip('?')))
# align S names with A names (both alphabetical)
sim=lambda x,y: difflib.SequenceMatcher(None,key(x),key(y)).ratio()
n,m=len(S),len(A); GAP=-0.4
import numpy as np
D=np.zeros((n+1,m+1)); P=np.zeros((n+1,m+1),int)
for i in range(1,n+1): D[i][0]=i*GAP; P[i][0]=1
for j in range(1,m+1): D[0][j]=j*GAP; P[0][j]=2
for i in range(1,n+1):
    for j in range(1,m+1):
        s=sim(S[i-1][2],A[j-1][1]); opts=[D[i-1][j-1]+(s*2-1),D[i-1][j]+GAP,D[i][j-1]+GAP]
        k=int(np.argmax(opts)); D[i][j]=opts[k]; P[i][j]=k
pair={}; i,j=n,m
while i>0 and j>0:
    k=P[i][j]
    if k==0: pair[i-1]=j-1; i-=1; j-=1
    elif k==1: i-=1
    else: j-=1
out=[]
for idx,(leaf,row,name) in enumerate(S):
    rec={'leaf':leaf,'page':PAGE(leaf),'row':row,'name':name}
    tal=None; how=None
    ex=exact.get(name)
    if ex and len(ex)==1 and max(countA.get(name,0),countB.get(name,0))==1:
        tal=next(iter(ex)); how=f'Directory of Villages lists "{name}; {tal}."'
    elif ex and (len(ex)>1 or max(countA.get(name,0),countB.get(name,0))>1):
        rec['status']=f'the Directory of Villages has more than one place called {name} ({", ".join(sorted(ex))}); the spelling list has one row'; out.append(rec); continue
    elif idx in pair and sim(name,A[pair[idx]][1])>=0.7:
        dl,dn,da=A[pair[idx]]
        if max(countA.get(dn,0),countB.get(dn,0))>1: rec['status']=f'its Directory entry {dn} is one of several places of that name'; out.append(rec); continue
        tal=da; how=f'Directory of Villages p. {PAGE(dl)} spells it "{dn}; {da}." (same place in the alphabetical order)'
    if not tal:
        rec['status']='taluka not found in the Directory of Villages'; out.append(rec); continue
    rec['taluka1979']=tal; rec['how']=how
    cands=[r for r in lgd if r['taluka'] in ABBR[tal] and key(r['official'])==key(name)]
    if len(cands)==1: rec.update(code=cands[0]['lgd_code'],lgd=cands[0]['official'],taluka=cands[0]['taluka'],status='matched')
    elif not cands: rec['status']=f'no LGD place spelt "{name}" in {" or ".join(ABBR[tal])}'
    else: rec['status']='more than one LGD entry: '+', '.join(c['lgd_code']+' '+c['official'] for c in cands)
    if rec['status']!='matched':
        hint=[r['lgd_code']+' '+r['official']+' ('+r['taluka']+')' for r in lgd if key(r['official'])==key(name)]
        if hint: rec['hint']=hint
    out.append(rec)
json.dump(out,open(f'{G}/match.json','w'),ensure_ascii=False,indent=0)
import collections
print(collections.Counter(r['status'][:40] for r in out))
codes=[r['code'] for r in out if r.get('code')]; print('dupe codes',[c for c in set(codes) if codes.count(c)>1])
for r in out:
    if r['status']=='matched' and 'same place' in r['how']: print('ALIGN',r['name'],r['how'],r['code'])
