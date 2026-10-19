"""Feasts, zatras and festivals from the 1979 Gazetteer into data/credited/feasts.csv (phase 4, A2).

Two parts of the same book:
- the Directory of Villages and Towns, column 11 (pp. 945 to 995): read from the page images, one village at a
  time, into data/gazetteer/directory_facts_1979.tsv. It gives each fair or feast with the month in the
  Directory's own abbreviations ("Fr-Kt", "Fs-Feb"), expanded here with the key on p. 942.
- Chapter 19, Places of Interest (pp. 765 to 855): data/gazetteer/places_of_interest_feasts_1979.csv, with the
  date as the text states it and the sentence it comes from.

Matching is on taluka plus spelling: the Directory gives each village's taluka, and a village is matched only
when the LGD list has exactly one place of that spelling in that taluka (or in Dharbandora, which was carved out
of Sanguem and Ponda). A row is checked=yes only when it is matched and its text was read without doubt.
Rows already in the file (not from the Gazetteer) are kept as they are.

Run from the repository root: python3 data/scripts/gazetteer/8_feasts.py
"""
import csv, re

URL = 'https://archive.org/details/dli.ministry.08183'
ABBR = {'BRD': ['Bardez'], 'BCL': ['Bicholim'], 'CNC': ['Canacona'], 'QP': ['Quepem'], 'MRG': ['Mormugao'],
        'PRN': ['Pernem'], 'PND': ['Ponda', 'Dharbandora'], 'SNG': ['Sanguem', 'Dharbandora'],
        'SLCT': ['Salcete'], 'STR': ['Sattari'], 'TWD': ['Tiswadi']}
# the Directory's key to Hindu months (p. 942), as it spells them
LUNAR = {'Chaitra': 'Chaitra', 'Vaishakh': 'Vaishakha', 'Kartik': 'Kartika', 'Margashirsha': 'Margashirsha',
         'Paush': 'Pausha', 'Magh': 'Magha', 'Phalgun': 'Phalguna', 'Shravan': 'Shravana', 'Ashwin': 'Ashvina'}
GREG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
        'November', 'December']
key = lambda s: re.sub(r'[\s\-.]+', '', s.lower())

lgd = list(csv.DictReader(open('data/villages_lgd.csv')))
def find(name, abbr):
    c = [r for r in lgd if r['taluka'] in ABBR[abbr] and key(r['official']) == key(name)]
    return c[0] if len(c) == 1 else None

def calendar_of(rule):
    if not rule: return ''
    first = re.split(r'[\s\-/]', rule)[0]
    if first in GREG or re.match(r'^\d', rule): return 'gregorian'
    return 'lunar'

rows = []
# 1. the Directory
taluka_of = {}
for r in csv.DictReader(open('data/gazetteer/directory_names_1979.csv')): taluka_of.setdefault(key(r['name']), r['taluka_abbr'])
for r in csv.DictReader(open('data/gazetteer/directory_facts_1979.tsv'), delimiter='\t'):
    taluka_of[key(r['village'])] = r['abbr']
    if r['type'] not in ('fair', 'feast', 'festival'): continue
    v = find(r['village'], r['abbr'])
    note = ''
    if not v:
        # a 1979 entry that joins two or three villages ("Moira Nachinola"): matched only when the feast's own name
        # names one of them ("Moira feast")
        parts = [p for p in re.split(r'[\s\-]+', r['village']) if len(p) > 2]
        if len(parts) > 1:
            named = [p for p in parts if key(r['name']).startswith(key(p))]
            if len(named) == 1: v = find(named[0], r['abbr'])
            if not v: note = f'1979 entry "{r["village"]}" covers more than one village today'
        if not v and not note: note = f'no LGD place spelt "{r["village"]}" in {" or ".join(ABBR[r["abbr"]])}'
    rule = r['rule']
    for short, full in LUNAR.items(): rule = re.sub(rf'\b{short}\b', full, rule)
    page = r['page']
    rows.append({'name': r['name'], 'kind': {'fair': 'zatra', 'feast': 'feast', 'festival': 'festival'}[r['type']],
                 'icon': 'church' if r['type'] == 'feast' else 'flame', 'village': r['village'],
                 'village_code': v['lgd_code'] if v else '', 'checked': 'yes' if v else 'no', 'rule': rule,
                 'calendar': calendar_of(rule), 'source': f'Gazetteer 1979, Part 1, Directory of Villages, p. {page}',
                 'source_url': URL, 'as_printed': r['printed'], 'match_note': note})

# 2. Chapter 19: dated rows only, and only where the Directory has nothing for the same deity in the same village
for r in csv.DictReader(open('data/gazetteer/places_of_interest_feasts_1979.csv')):
    if not r['rule']: continue
    head = r['place_heading'].title()
    abbr = taluka_of.get(key(head))
    v = find(head, abbr) if abbr else None
    if head == 'Surla': abbr, v = 'SNG', next(x for x in lgd if x['lgd_code'] == '626974')  # "in the Sanguem taluka"; Tambdi Surla, confirmed 16 Oct 2026
    note = '' if v else ('not an LGD village' if head in ('Old Goa', 'Marcela') else f'no LGD place spelt "{head}" in the 1979 taluka')
    doubt = r['ocr_doubt'] == 'yes'
    if doubt: note = (note + '; ' if note else '') + 'the scan\'s text is unclear in the date: check against the page'
    rows.append({'name': r['name'][0].upper() + r['name'][1:], 'kind': {'zatra': 'zatra', 'feast': 'feast'}.get(r['kind'], 'festival'),
                 'icon': 'church' if r['kind'] == 'feast' else 'flame', 'village': head,
                 'village_code': v['lgd_code'] if v else '', 'checked': 'yes' if v and not doubt else 'no',
                 'rule': r['rule'], 'calendar': r['calendar'] if r['calendar'] in ('lunar', 'gregorian') else '',
                 'source': f'Gazetteer 1979, Part 1, Places of Interest, p. {r["page"]}', 'source_url': URL,
                 'as_printed': r['quote'], 'match_note': note})

# A Chapter 19 date and a Directory month for the same fair: keep the fuller Chapter 19 row
def deity(n): return key(n.split(' ')[0])
ch19 = [r for r in rows if 'Places of Interest' in r['source'] and r['village_code']]
drop = []
for r in rows:
    if r['source'].startswith('Gazetteer 1979, Part 1, Directory') and r['village_code']:
        for c in ch19:
            if c['village_code'] == r['village_code'] and deity(r['name']) in key(c['name']) and deity(r['name']) not in ('fair', 'feast', 'church'):
                drop.append(id(r)); c['source'] += f'; Directory of Villages, p. {r["source"].rsplit(" ", 1)[1]}'
rows = [r for r in rows if id(r) not in drop]

# keep rows that did not come from the Gazetteer passes (the Lairai row typed in phase 2 is replaced by Chapter 19's)
FIELDS = ['name', 'kind', 'icon', 'village', 'village_code', 'checked', 'rule', 'calendar', 'source', 'source_url', 'as_printed', 'match_note']
old = [r for r in csv.DictReader(open('data/credited/feasts.csv')) if not r['source'].startswith('Gazetteer 1979')]
out = sorted(old + rows, key=lambda r: (r['village'].lower(), r['name'].lower()))
with open('data/credited/feasts.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=FIELDS, extrasaction='ignore'); w.writeheader()
    for r in out: w.writerow({k: r.get(k, '') for k in FIELDS})
ok = [r for r in out if r['checked'] == 'yes']
print(f'{len(out)} rows, {len(ok)} checked, {len(set(r["village_code"] for r in ok))} villages; '
      f'{sum(1 for r in ok if r["rule"])} with a date rule')
