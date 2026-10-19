"""docs/review-batch-1.csv: one row per LGD village, for a reviewer to settle many names in one sitting (phase 4, A5).

Columns are what the sources already say, side by side, and empty columns for the reviewer. Nothing in this file
shows on the site: a name goes on khoim.in only once a reviewer has written it into data/villages_lgd.csv with their
name and the date (CLAUDE.md, "Onto the site").

- konkani_wikipedia: the Konkani Wikipedia candidate from data/village_names_review.xlsx.
- gazetteer_*: the 1979 Gazetteer's spelling list, only the values both readings agreed on (phase 4, A1).
- luis_spelling: Dr Alvarinho J. Luis, The Goan, 2026.
- osm_name_gom: OpenStreetMap's name:gom (ODbL, © OpenStreetMap contributors), only for an OpenStreetMap place
  whose name is the village's official name and which lies inside that village in the same taluka.

Run from the repository root: python3 data/scripts/review/batch.py
"""
import csv, re, sys
sys.path.insert(0, 'data/scripts/review')
key = lambda s: re.sub(r'[^a-z]', '', (s or '').lower())

def read_sheet():
    import zipfile, xml.etree.ElementTree as ET
    z = zipfile.ZipFile('data/village_names_review.xlsx'); ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    shared = [''.join(t.text or '' for t in si.iter('{%s}t' % ns['m'])) for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', ns)] if 'xl/sharedStrings.xml' in z.namelist() else []
    sheet = ET.fromstring(z.read('xl/worksheets/sheet2.xml'))
    rows = []
    for row in sheet.iter('{%s}row' % ns['m']):
        vals = {}
        for c in row.findall('m:c', ns):
            col = re.sub(r'\d', '', c.get('r')); v = c.find('m:v', ns); t = c.get('t')
            if t == 's' and v is not None: val = shared[int(v.text)]
            elif t == 'inlineStr': val = ''.join(x.text or '' for x in c.iter('{%s}t' % ns['m']))
            else: val = v.text if v is not None else ''
            vals[col] = val
        rows.append(vals)
    head = rows[0]; cols = sorted(head, key=lambda c: (len(c), c))
    return [{head[c]: r.get(c, '') for c in cols} for r in rows[1:]]

sheet = {str(r['LGD code']).replace('.0', ''): r for r in read_sheet()}
lgd = list(csv.DictReader(open('data/villages_lgd.csv')))
towns = {r['lgd_code'] for r in csv.DictReader(open('data/town_outline_matches.csv'))}
osm = list(csv.DictReader(open('data/raw/osm_localities_ODbL.csv')))

def osm_gom(v):
    hits = [o for o in osm if o['name_gom'] and key(o['name']) == key(v['official']) and key(o['inside_village']) == key(v['official']) and o['inside_taluka'] == v['taluka']]
    return '; '.join(sorted({o['name_gom'] for o in hits}))

FIELDS = ['taluka', 'official', 'lgd_code', 'kind', 'konkani_wikipedia', 'gazetteer_government', 'gazetteer_soi', 'advisory_body_form',
          'gazetteer_devanagari', 'gazetteer_page', 'luis_spelling', 'osm_name_gom (ODbL)',
          'reviewer_devanagari', 'reviewer_romi', 'reviewer_say_it', 'reviewer_initials', 'reviewer_note']
out = []
for v in lgd:
    s = sheet.get(v['lgd_code'], {})
    out.append({'taluka': v['taluka'], 'official': v['official'], 'lgd_code': v['lgd_code'],
                'kind': 'town' if v['lgd_code'].startswith('9') or v['lgd_code'] in towns else 'village',
                'konkani_wikipedia': s.get('Candidate: Konkani Wikipedia', ''),
                **{c: s.get(c, '') for c in ['gazetteer_government', 'gazetteer_soi', 'advisory_body_form', 'gazetteer_devanagari', 'gazetteer_page', 'luis_spelling']},
                'osm_name_gom (ODbL)': osm_gom(v),
                'reviewer_devanagari': v['konkani_deva'], 'reviewer_romi': v['romi'], 'reviewer_say_it': v['say'], 'reviewer_initials': v['reviewer'], 'reviewer_note': ''})
out.sort(key=lambda r: (r['taluka'], r['official'].lower()))
with open('docs/review-batch-1.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=FIELDS); w.writeheader(); w.writerows(out)
n = lambda c: sum(1 for r in out if r[c])
print(f'{len(out)} rows; Konkani Wikipedia {n("konkani_wikipedia")}, Gazetteer Devanagari {n("gazetteer_devanagari")}, '
      f'Advisory Body {n("advisory_body_form")}, Luis {n("luis_spelling")}, OSM name:gom {n("osm_name_gom (ODbL)")}; '
      f'already reviewed {n("reviewer_initials")}; towns {sum(1 for r in out if r["kind"] == "town")}')
