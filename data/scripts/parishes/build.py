"""Parishes into data/credited/parishes.csv (phase 4, A3).

Sources, both kept in data/raw/ as read on 19 October 2026:
- the Archdiocese of Goa and Daman's parish list (church, location, deanery): parishes_archdiocese_*.tsv
- the UCA News parish directory (church, address, principal patron, feast day): parishes_ucanews_*.tsv
  Daman, Diu and Dadra and Nagar Haveli entries are left out.

One row per church. The patron is the source's own: UCA News's "Principal Patron", or for a church only the
Archdiocese lists, the dedication in its name ("St. Anne Church": St. Anne). The feast rule is UCA News's
"Feast Day", copied as written ("2nd Sun of May", "Aug 15"); it is left empty where no source gives one.

The village: matched only when the source names it (the Archdiocese's location, or a word of UCA News's address)
and the LGD list has exactly one village of that spelling in Goa, or one in the taluka the address names. Everything
else is left without a code, with the reason, for a person to settle. Nothing is matched on a church's name.

Run from the repository root: python3 data/scripts/parishes/build.py
"""
import csv, glob, re

ARCH_URL = 'https://archgoadaman.com/parishes/'
UCA_URL = 'https://www.ucanews.com/directory/parishes-stations/india-goa-daman/18'
key = lambda s: re.sub(r'[^a-z]', '', s.lower())
lgd = list(csv.DictReader(open('data/villages_lgd.csv')))
TALUKAS = sorted({r['taluka'] for r in lgd})
by_name = {}
for r in lgd: by_name.setdefault(key(r['official']), []).append(r)

def place(text):
    """(village row or None, note) from a location or address. Read in this order: the place words, then, only
    when there are none, the post office ("Loutulim PO"). A taluka's name after the first part ("Morjim, Pernem")
    names the taluka, not a village. Two different villages named: none is chosen."""
    parts = [p.strip() for p in re.split(r',', text) if p.strip() and p.strip() != '-' and not p.strip().startswith('Via ')]
    talukas = [x for x in TALUKAS if re.search(rf'\b{x}\b', text, re.I)] + (['Tiswadi'] if re.search(r'\bl?Ilhas\b', text, re.I) else [])
    def names(chunks):
        found, why = [], ''
        for i, c in enumerate(chunks):
            words = re.findall(r"[A-Za-z][A-Za-z'-]*", re.sub(r'\b(Tk|Dt|PB \d+|Via|MC)\b', ' ', c))
            phrases = [' '.join(words[j:j + n]) for n in (3, 2, 1) for j in range(len(words) - n + 1)]
            for ph in phrases:
                if i > 0 and ph.title() in TALUKAS: continue
                rows = by_name.get(key(ph), [])
                if len(rows) == 1: found.append(rows[0])
                elif rows:
                    inside = [r for r in rows if r['taluka'] in talukas]
                    if len(inside) == 1: found.append(inside[0])
                    else: why = f'"{ph}" is the name of {len(rows)} LGD villages and the source does not say which taluka'
        return list({r['lgd_code']: r for r in found}.values()), why
    po = [re.sub(r'\s*\bP[O0]\b.*', '', c).strip() for c in parts if re.search(r'\bP[O0]\b', c)]
    rest = [c for c in parts if not re.search(r'\bP[O0]\b', c)]
    found, why = names(rest)
    if not rest: found, why = names(po)
    if why: return None, why
    if len(found) == 1: return found[0], ''
    if len(found) > 1: return None, 'the source names more than one LGD village: ' + ', '.join(r['official'] for r in found)
    return None, why or 'no LGD village of that name: a locality, a ward or a town without an LGD village code'

GOA = lambda d: not re.search(r'Daman|Diu|Dadra|Haveli|Heveli|Silvassa', d)
uca = [r for r in csv.DictReader(open(sorted(glob.glob('data/raw/parishes_ucanews_*.tsv'))[-1]), delimiter='\t') if GOA(r['district'] + r['address'])]
arch = list(csv.DictReader(open(sorted(glob.glob('data/raw/parishes_archdiocese_*.tsv'))[-1]), delimiter='\t'))

def dedication(church):
    return re.sub(r'\s+(Church|Parish|Cathedral)$', '', re.sub(r'\s*\(\d{4}\)$', '', church.strip())).strip()

rows, used = [], set()
for a in arch:
    v, note = place(a['location'])
    # the same church in UCA News: its address names the Archdiocese's location, and it has the same year or the
    # one dedication contains the other ("St Thomas", "St Thomas the Apostle")
    twin = None
    for i, u in enumerate(uca):
        if i in used: continue
        same_place = key(a['location'].split(' ')[0]) in key(u['address'] + u['church'])
        ka, ku = key(dedication(a['church'])), key(dedication(u['church']))
        year = (re.search(r'\((\d{4})\)', u['church']) or [None, None])[1]
        same_church = year == a['established'] or ka in ku or ku in ka
        if same_place and same_church: twin = i; break
    u = uca[twin] if twin is not None else None
    if twin is not None:
        used.add(twin)
        if not v: v, note = place(u['address'])   # "Navelim" alone is three villages; UCA News adds "Salcete"

    rows.append({'parish': a['church'], 'patron': (u['principal_patron'] if u and u['principal_patron'] else dedication(a['church'])),
                 'feast_rule': u['feast_day'] if u else '', 'village': a['location'], 'village_code': v['lgd_code'] if v else '',
                 'checked': 'yes' if v else 'no',
                 'source': 'Archdiocese of Goa and Daman' + ('; UCA News parish directory' if u else ''),
                 'source_url': ARCH_URL, 'match_note': note})
for i, u in enumerate(uca):
    if i in used: continue
    v, note = place(u['address'])
    rows.append({'parish': re.sub(r'\s*\(\d{4}\)$', '', u['church']), 'patron': u['principal_patron'], 'feast_rule': u['feast_day'],
                 'village': u['address'], 'village_code': v['lgd_code'] if v else '', 'checked': 'yes' if v else 'no',
                 'source': 'UCA News parish directory', 'source_url': UCA_URL, 'match_note': note})

FIELDS = ['parish', 'patron', 'feast_rule', 'village', 'village_code', 'checked', 'source', 'source_url', 'match_note']
rows.sort(key=lambda r: (r['village'].lower(), r['parish'].lower()))
with open('data/credited/parishes.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=FIELDS); w.writeheader(); w.writerows(rows)
ok = [r for r in rows if r['checked'] == 'yes']
print(f'{len(rows)} parishes ({len(arch)} from the Archdiocese, {len(rows) - len(arch)} more from UCA News); '
      f'{len(ok)} matched to {len({r["village_code"] for r in ok})} villages; {sum(1 for r in ok if r["feast_rule"])} with a feast rule')
