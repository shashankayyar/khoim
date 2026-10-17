# Reference only. Written against a copy of design/components/data/goaGeo.js, places.js and data/villages_lgd.csv;
# the 'base' path below points at that copy. Port the logic into data/scripts/, reading the repo's own files.
import re,json,math,csv
base='/mnt/user-data/uploads/Khoim/'
lines=open(base+'design/components/data/goaGeo.js').read().split('\n')
def grab(name):
    for l in lines:
        if l.startswith('export const '+name):
            return json.loads(l.split('=',1)[1].strip().rstrip(';'))
V=grab('VILLAGES'); T=grab('TALUKA_SHAPES'); D=grab('DISTRICT_SHAPES')
ps=open(base+'design/components/data/places.js').read()
P=json.loads(ps[ps.find('['):ps.rfind(']')+1])
pl={p['id']:p for p in P}
lgd={r['lgd_code']:r for r in csv.DictReader(open(base+'data/villages_lgd.csv'))}
def pts(d):
    return [(float(a),float(b)) for a,b in re.findall(r'(-?[\d.]+),(-?[\d.]+)',d)]
vill=[];vert={}
for v in V:
    p=pts(v['d']); n=len(p)
    cx=sum(x for x,y in p)/n; cy=sum(y for x,y in p)/n
    sxx=sum((x-cx)**2 for x,y in p)/n; syy=sum((y-cy)**2 for x,y in p)/n; sxy=sum((x-cx)*(y-cy) for x,y in p)/n
    deg=math.degrees(0.5*math.atan2(2*sxy,sxx-syy))
    if deg>90:deg-=180
    if deg<-90:deg+=180
    if abs(deg)>55: deg = deg-90 if deg>0 else deg+90
    if abs(deg)<8: deg=0
    a=math.radians(deg); ux,uy=math.cos(a),math.sin(a)
    proj=[(x-cx)*ux+(y-cy)*uy for x,y in p]; perp=[-(x-cx)*uy+(y-cy)*ux for x,y in p]
    L=max(proj)-min(proj); W=max(perp)-min(perp)
    name=v['n']; r=lgd.get(v['id'],{})
    fs=min(L*0.8/(0.5*max(len(name),3)), W*0.5); fs=max(1.4,min(fs,16))
    xs=[x for x,y in p]; ys=[y for x,y in p]
    it={'id':v['id'],'n':name,'t':v['t'],'d':v['d'],'lp':v['lp'],'a':round(deg,1),'fs':round(fs,2),'b':[round(min(xs),1),round(min(ys),1),round(max(xs),1),round(max(ys),1)]}
    if r.get('romi') and r.get('reviewer'): it['romi']=r['romi']
    if r.get('konkani_deva') and r.get('reviewer'): it['deva']=r['konkani_deva']
    vill.append(it)
    for q in set((round(x),round(y)) for x,y in p): vert.setdefault(q,set()).add(v['id'])
nb={}
for q,ids in vert.items():
    for i in ids:
        for j in ids:
            if i!=j: nb.setdefault(i,{}); nb[i][j]=nb[i].get(j,0)+1
for it in vill:
    it['nb']=[j for j,c in sorted(nb.get(it['id'],{}).items(),key=lambda x:-x[1]) if c>=2][:10]
tal=[]
for k,sh in T.items():
    p=pl.get(k,{})
    tal.append({'id':k,'d':sh['d'],'lp':sh.get('lp'),'official':p.get('official',k.title()),'deva':p.get('deva'),'romi':p.get('romi'),'house':p.get('house','mustard'),'district':sh.get('district')})
dis=[{'id':k,'d':sh['d'],'official':pl[k]['official'],'deva':pl[k]['deva'],'romi':pl[k].get('romi')} for k,sh in D.items()]
data={'size':[1000,1419.2],'villages':vill,'talukas':tal,'districts':dis}
js=json.dumps(data,ensure_ascii=False,separators=(',',':'))
open('data.json','w').write(js)
print(len(vill),len(js)//1024,'KB')
print([(t['id'],t['house'],bool(t['lp'])) for t in tal])
al=[v for v in vill if v['n']=='Aldona'][0]; print(al['nb'], al['fs'], al['a'])
print(sorted(v['fs'] for v in vill)[::40])
