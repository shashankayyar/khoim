"""Build the simplified map geometry used by the prototype (reference/geo.prototype.json).
Inputs: data/raw/goa_talukas_lgd.geojson, goa_villages_lgd.geojson, goa_districts_2026.geojson, lgd_all_villages_goa_*.xlsx
Output: projected SVG path strings in a 1000-wide viewBox. Reuse or port to the site's build step.
Needs: geopandas, pandas, openpyxl."""
import geopandas as gpd, pandas as pd, json, math, sys
R='data/raw/'
t=gpd.read_file(R+'goa_talukas_lgd.geojson'); v=gpd.read_file(R+'goa_villages_lgd.geojson'); d=gpd.read_file(R+'goa_districts_2026.geojson')
t['taluka']=t.taluka.replace({'Satari':'Sattari'}); v['taluka']=v.taluka.replace({'Satari':'Sattari'})
lgd=pd.read_excel(sorted(__import__('glob').glob(R+'lgd_all_villages_goa_*.xlsx'))[-1],header=1)
lgd['nm']=lgd['Village Name (In English)'].str.replace(r'\s*\((.*?)\)','',regex=True).str.strip()
nm=dict(zip(lgd['Village Code'],lgd['nm']))
minx,miny,maxx,maxy=t.total_bounds; k=math.cos(math.radians((miny+maxy)/2)); W=1000; sx=W/((maxx-minx)*k); H=(maxy-miny)*sx
P=lambda x,y:(round((x-minx)*k*sx,1),round((maxy-y)*sx,1))
def path(g):
    out=[]
    for p in ([g] if g.geom_type=='Polygon' else list(g.geoms)):
        for ring in [p.exterior]+list(p.interiors):
            pts=[P(x,y) for x,y in ring.coords]; dd=[pts[0]]+[q for i,q in enumerate(pts[1:]) if q!=pts[i]]
            if len(dd)>=3: out.append('M'+'L'.join(f'{a:g},{b:g}' for a,b in dd)+'Z')
    return ''.join(out)
def bb(g):
    a,b,c,e=g.bounds; x0,y1=P(a,b); x1,y0=P(c,e); return [x0,y0,round(x1-x0,1),round(y1-y0,1)]
lab=lambda g:list(P(g.representative_point().x,g.representative_point().y))
geo=dict(W=W,H=round(H,1),
 districts=[dict(id=r.district_2026,d=path(r.geometry.simplify(6e-4)),bb=bb(r.geometry),lp=lab(r.geometry)) for _,r in d.iterrows()],
 talukas=[dict(id=r.taluka,dist=r.district_2026,d=path(r.geometry.simplify(5e-4)),bb=bb(r.geometry),lp=lab(r.geometry)) for _,r in t.iterrows()],
 villages=[])
for i,r in v.iterrows():
    code=int(r.vil_lgd); name=nm.get(code) or r.official_name or (r.soi_name or '').title()
    if not name: continue
    g=r.geometry.simplify(3.5e-4)
    geo['villages'].append(dict(id=f'v{i}',code=code,n=name,src='LGD' if code in nm else 'SOI',t=r.taluka,d=path(g),bb=bb(g),lp=lab(g)))
json.dump(geo,open(sys.argv[1] if len(sys.argv)>1 else 'geo.json','w'),separators=(',',':'),ensure_ascii=False)
