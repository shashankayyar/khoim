"""Turns the two readings of the Gazetteer's spelling list into review-sheet values, a disagreements list and line crops."""
import sys, json, os, unicodedata as ud, openpyxl, re
from PIL import Image
G, R = sys.argv[1], sys.argv[2]
N = lambda s: re.sub('[‌‍]', '', ud.normalize('NFC', s.strip()))
def tsv(f):
    d = {}
    for l in open(f):
        p = l.rstrip('\n').split('\t'); p += [''] * (6 - len(p)); d[(int(p[0]), int(p[1]))] = [N(x) for x in p[2:6]]
    return d
eye, ocr = tsv(f'{G}/eye.tsv'), tsv(f'{G}/ocr.tsv')
L = json.load(open(f'{G}/layout.json'))
match = {(r['leaf'], r['row']): r for r in json.load(open(f'{G}/match.json'))}
COLS = ['gazetteer_government', 'gazetteer_soi', 'advisory_body_form', 'gazetteer_devanagari']
LABEL = ['Government spelling', 'Survey of India spelling', 'Advisory Body spelling', 'Devanagari']
os.makedirs(f'{R}/docs/gazetteer-crops', exist_ok=True)
keep, dis, rows = {}, [], []
for k in sorted(eye):
    e, o = eye[k], ocr.get(k, [''] * 4)
    if e[0] in ('HEADER', 'CONT'): continue
    leaf, row = k; page = leaf - 16
    # a two-line entry: my reading covers both lines, the OCR cell only one, so it can never agree
    multi = (leaf, row + 1) in eye and eye[(leaf, row + 1)][0] == 'CONT' or (leaf == 1015 and row == 4)
    vals, bad = [], []
    for c in range(4):
        ok = not multi and not e[c].startswith('?') and e[c] == o[c]
        vals.append(e[c] if ok else None)
        rows.append({'page': page, 'line': row + 1, 'name': e[0].lstrip('?'), 'column': LABEL[c], 'eye': e[c], 'ocr': o[c], 'kept': 'yes' if ok else 'no'})
        if not ok: bad.append((c, e[c], o[c]))
    m = match.get(k, {})
    if bad:
        top, bot = L[str(leaf)]['rows'][row]
        if multi: bot = L[str(leaf)]['rows'][row + 1][1]
        crop = f'p{page}-line{row + 1:02d}.png'
        Image.open(f'{G}/img/p{leaf}.png').convert('L').crop((180, top - 4, 1640, bot + 4)).quantize(4).save(f'{R}/docs/gazetteer-crops/{crop}', optimize=True)
        dis.append({'page': page, 'line': row + 1, 'name': e[0].lstrip('?'), 'code': m.get('code'), 'crop': crop, 'bad': bad, 'multi': multi})
    if m.get('status') == 'matched':
        keep[m['code']] = {'vals': vals, 'page': page, 'how': m['how']}
# write the review sheet
wb = openpyxl.load_workbook(f'{R}/data/village_names_review.xlsx'); ws = wb['Review']
hdr = [c.value for c in ws[1]]; ix = {h: i for i, h in enumerate(hdr)}
filled = {c: 0 for c in COLS}; touched = 0; skipped = []
for r in ws.iter_rows(min_row=2):
    code = str(r[ix['LGD code']].value).replace('.0', '')
    if code not in keep: continue
    if any(r[ix[c]].value for c in COLS):   # filled by hand before this pass (Aldona): left as it was
        skipped.append(code); continue
    v = keep[code]
    if not any(v['vals']): continue
    touched += 1
    for c, val in zip(COLS, v['vals']):
        if val: r[ix[c]].value = val; filled[c] += 1
    r[ix['gazetteer_page']].value = str(v['page'])
wb.save(f'{R}/data/village_names_review.xlsx')
json.dump({'filled': filled, 'villages': touched, 'left_as_before': skipped, 'disagreements': len(dis), 'rows': len([k for k in eye if eye[k][0] not in ('HEADER', 'CONT')])}, open(f'{G}/summary.json', 'w'), indent=1)
json.dump(dis, open(f'{G}/dis.json', 'w'), ensure_ascii=False, indent=0)
import csv
with open(f'{R}/data/gazetteer/readings_1979.csv', 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=['page', 'line', 'name', 'column', 'eye', 'ocr', 'kept']); w.writeheader(); w.writerows(rows)
print(open(f'{G}/summary.json').read())
