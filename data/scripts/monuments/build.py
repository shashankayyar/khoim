"""Landmarks into data/credited/monuments.csv (phase 4, A4).

Sources, in this order of precedence (a landmark already listed by an earlier source is not repeated):
1. ASI, centrally protected monuments, Goa Circle (21): data/raw/monuments_asi_goa_circle.tsv,
   from https://asi.nic.in/pdf/CPM_List.pdf (section 7).
2. Government of Goa, list of 57 protected monuments in the State, tabled in the Goa Legislative Assembly:
   data/raw/monuments_goa_state_57.tsv, read from the scanned annexure.
3. The 1979 Gazetteer, Places of Interest (pp. 765 to 855): landmarks with their own sub-heading only.
4. The 1979 Gazetteer, Directory of Villages (pp. 945 to 995): named temples, churches, chapels, mosques, maths,
   forts, springs, waterfalls and caves, village by village.

Names are the source's own. The Directory's abbreviations are spelled out with its key (p. 942): "tl" temple,
"Cch" church. Unnamed entries ("Fort", "fountain") are left out. No Konkani name is added.

A landmark gets a village code only when the source's village (or locality) is spelt exactly as an LGD village in
the same taluka (the Gazetteer's 1979 talukas include today's Dharbandora), or, for the ASI's localities, as the
only LGD village of that name in the district. "Tambdi Surla" is Surla, Dharbandora (626974), as Shashank decided on
16 October 2026 (docs/phase2-decisions.md). Everything else stays without a code, with the reason.

Run from the repository root: python3 data/scripts/monuments/build.py
"""
import csv, re

key = lambda s: re.sub(r'[^a-z]', '', s.lower())
lgd = list(csv.DictReader(open('data/villages_lgd.csv')))
TALUKA = {'Dicholi': ['Bicholim'], 'Ponda': ['Ponda', 'Dharbandora'], 'Sanguem': ['Sanguem', 'Dharbandora']}
ABBR = {'BRD': ['Bardez'], 'BCL': ['Bicholim'], 'CNC': ['Canacona'], 'QP': ['Quepem'], 'MRG': ['Mormugao'], 'PRN': ['Pernem'],
        'PND': ['Ponda', 'Dharbandora'], 'SNG': ['Sanguem', 'Dharbandora'], 'SLCT': ['Salcete'], 'STR': ['Sattari'], 'TWD': ['Tiswadi']}
DISTRICT = {'North Goa': ['North Goa'], 'South Goa': ['South Goa', 'Kushavati']}
GAZ_URL = 'https://archive.org/details/dli.ministry.08183'

def in_talukas(name, talukas):
    c = [r for r in lgd if r['taluka'] in talukas and key(r['official']) == key(name)]
    return c[0] if len(c) == 1 else None

rows = []
def add(name, kind, village, v, protection, source, url, page='', note=''):
    rows.append({'name': name, 'type': kind, 'village': village, 'village_code': v['lgd_code'] if v else '',
                 'checked': 'yes' if v else 'no', 'protection': protection, 'source': source, 'page': page,
                 'source_url': url, 'match_note': '' if v else note})

def kind_of(name):
    n = name.lower()
    for k, words in [('fort', ['fort', 'fortress', 'fortification', 'gad']), ('church', ['church', 'basilica', 'cathedral', 'se’ ']),
                     ('chapel', ['chapel']), ('mosque', ['masjid', 'mosque', 'namazgah']), ('cave', ['cave']),
                     ('temple', ['temple', 'mandir', 'devasthan', 'basti']), ('math', ['math']), ('waterfall', ['fall', 'sagar']),
                     ('spring', ['spring', 'fountain', 'tirtha'])]:
        if any(w in n for w in words): return k
    return 'monument'

# 1. ASI
for r in csv.DictReader(open('data/raw/monuments_asi_goa_circle.tsv'), delimiter='\t'):
    loc = r['locality']
    if loc == 'Tambdisurla': v = next(x for x in lgd if x['lgd_code'] == '626974')
    else:
        c = [x for x in lgd if x['district'] in DISTRICT[r['district']] and key(x['official']) == key(loc)]
        v = c[0] if len(c) == 1 else None
    note = 'Old Goa is not an LGD village; the State list files Old Goa monuments under Ella' if loc == 'Old Goa' else f'no LGD village spelt "{loc}" in {r["district"]}'
    add(r['name'], kind_of(r['name']), loc, v, 'Centrally protected (ASI)', 'Archaeological Survey of India, Goa Circle',
        'https://asi.nic.in/pdf/CPM_List.pdf', note=note)

# 2. Government of Goa
for r in csv.DictReader(open('data/raw/monuments_goa_state_57.tsv'), delimiter='\t'):
    talukas = TALUKA.get(r['taluka'], [r['taluka']])
    v = in_talukas(r['village'], talukas)
    add(r['name'], kind_of(r['name']), f'{r["village"]}, {r["taluka"]}', v, 'State protected (Goa)',
        'Government of Goa, list of 57 protected monuments (Goa Legislative Assembly)',
        'https://static.goavidhansabha.gov.in/goalpub/docs/question_docs/file_2dc16977-c136-4c24-85a2-a470dbf4b5a8.pdf',
        note=f'no LGD village spelt "{r["village"]}" in {" or ".join(talukas)}')

# taluka of each 1979 place, from the Directory of Villages
taluka_of = {}
for r in csv.DictReader(open('data/gazetteer/directory_names_1979.csv')): taluka_of.setdefault(key(r['name']), r['taluka_abbr'])
for r in csv.DictReader(open('data/gazetteer/directory_facts_1979.tsv'), delimiter='\t'): taluka_of[key(r['village'])] = r['abbr']

# 3. Places of Interest: sub-headings only (the source line is the name itself)
KEEP = {'temple', 'church', 'chapel', 'mosque', 'math', 'fort', 'spring', 'waterfall', 'cave', 'monument'}
for r in csv.DictReader(open('data/gazetteer/places_of_interest_landmarks_1979.csv')):
    if r['type'] not in KEEP or r['quote'].strip() != r['name'].strip() or r['ocr_doubt'] == 'yes': continue
    head = r['place_heading'].title()
    abbr = taluka_of.get(key(head))
    v = in_talukas(head, ABBR[abbr]) if abbr else None
    if head == 'Surla': v = next(x for x in lgd if x['lgd_code'] == '626974')
    add(r['name'], r['type'], head, v, '', 'Gazetteer 1979, Part 1, Places of Interest', GAZ_URL, r['page'],
        'Old Goa is not an LGD village' if head == 'Old Goa' else f'no LGD village spelt "{head}" in the 1979 taluka')

# 4. Directory of Villages: named ones only
GENERIC = {'fort', 'fountain', 'lake', 'spring'}
for r in csv.DictReader(open('data/gazetteer/directory_facts_1979.tsv'), delimiter='\t'):
    if r['type'] not in KEEP or key(r['name']) in GENERIC: continue
    v = in_talukas(r['village'], ABBR[r['abbr']])
    add(r['name'], r['type'], r['village'], v, '', 'Gazetteer 1979, Part 1, Directory of Villages', GAZ_URL, r['page'],
        f'no LGD village spelt "{r["village"]}" in {" or ".join(ABBR[r["abbr"]])}')

# one row per landmark: same village, and the same distinctive words once generic ones are set aside
STOP = r'\b(the|of|at|and|shri|shree|sri|temple|tl|mandir|church|chapel|fort|fortress|site|ruins|devasthan|saunsthan|caves?|st|nossa|senhora|our|lady)\b'
core = lambda n: key(re.sub(STOP, ' ', n.lower()))
seen, out = {}, []
for r in rows:
    k = (r['village_code'] or key(r['village']), core(r['name']), r['type'] if r['type'] in ('cave', 'fort') else '')
    if k[1] and k in seen:
        first = seen[k]
        if r['source'] not in first['source']: first['source'] += '; ' + r['source'] + (f', p. {r["page"]}' if r['page'] else '')
        continue
    seen[k] = r; out.append(r)

FIELDS = ['name', 'type', 'village', 'village_code', 'checked', 'protection', 'source', 'page', 'source_url', 'match_note']
with open('data/credited/monuments.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=FIELDS); w.writeheader(); w.writerows(out)
ok = [r for r in out if r['checked'] == 'yes']
print(f'{len(out)} landmarks ({sum(1 for r in out if r["protection"])} protected); {len(ok)} matched to {len({r["village_code"] for r in ok})} villages')
for r in out:
    if r['checked'] != 'yes' and r['protection']: print('  unmatched:', r['name'], '|', r['village'], '|', r['match_note'])
