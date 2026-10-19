import sys, json
G, R = sys.argv[1], sys.argv[2]
dis = json.load(open(f'{G}/dis.json')); match = json.load(open(f'{G}/match.json')); s = json.load(open(f'{G}/summary.json'))
LABEL = ['Government spelling', 'Survey of India spelling', 'Advisory Body spelling', 'Devanagari']
show = lambda v: '(blank)' if v == '' else ('unsure: ' + v[1:] if v.startswith('?') else v)
o = []
o.append('# Gazetteer spelling list: readings that disagree\n')
o.append('Source: *Gazetteer of the Union Territory Goa, Daman and Diu, Part 1* (1979), "A list of spellings of place names, Goa District", pages 997 to 1007 (https://archive.org/details/dli.ministry.08183, scan leaves 1013 to 1023).\n')
o.append('Every line of the list was read twice: once from the page image by Claude, once by OCR (Tesseract 5.5, Marathi and Hindi data for the Devanagari column, English for the rest). A value went into `data/village_names_review.xlsx` only where both readings are exactly the same. Every reading, kept or not, is in `data/gazetteer/readings_1979.csv`.\n')
o.append(f'- Lines in the list: {s["rows"]}. Matched to an LGD village: {sum(1 for m in match if m["status"]=="matched")}. Villages given at least one Gazetteer value: {s["villages"]}.')
o.append(f'- Values kept: Government spelling {s["filled"]["gazetteer_government"]}, Survey of India spelling {s["filled"]["gazetteer_soi"]}, Advisory Body spelling {s["filled"]["advisory_body_form"]}, Devanagari {s["filled"]["gazetteer_devanagari"]}.')
o.append(f'- Lines with at least one disagreement: {len(dis)}. Those cells are empty in the review sheet, waiting for a reviewer.')
o.append('- Aldona (626704) was transcribed by hand before this pass and was left exactly as it was.\n')
o.append('## How to settle one\nOpen the crop, read the line, and type the value into the matching column of `data/village_names_review.xlsx` (the row with that LGD code). "unsure" means Claude could not read it with confidence; "(blank)" means no text was read there (in the Survey of India column, "...." on the page means the Survey of India gives no spelling). The Devanagari is the Gazetteer\'s own 1970 spelling: it shows only on the village sheet, marked "Needs review", never on the map (phase 2, rule 6).\n')
o.append('## Disagreements, by page\n')
page = None
for d in dis:
    if d['page'] != page:
        page = d['page']; o.append(f'\n### Page {page}\n')
    who = f'{d["name"]} ({d["code"]})' if d['code'] else f'{d["name"]} (not matched to LGD)'
    note = ' Two lines on the page; read together.' if d['multi'] else ''
    o.append(f'**{who}**, line {d["line"]}.{note} ![line](gazetteer-crops/{d["crop"]})\n')
    o.append('| Column | Read from the image | Read by OCR |\n| --- | --- | --- |')
    for c, e, r in d['bad']:
        o.append(f'| {LABEL[c]} | {show(e)} | {show(r)} |')
    o.append('')
o.append('\n## Lines not matched to an LGD village\n')
o.append('Matching is on taluka plus spelling, never spelling alone. The spelling list has no taluka column, so the taluka comes from the same Gazetteer\'s Directory of Villages and Towns (pages 944 to 996): by the same name, or, where the Directory spells the name a little differently, by the entry in the same place in its alphabetical order. Talukas of 1979 that have since been split are compared with today\'s: Sanguem and Ponda villages may now be in Dharbandora. The LGD name must then be spelt exactly as in the list. Lines below need a person.\n')
o.append('| Page | Line | Spelling list | Why | LGD entries with this spelling elsewhere |\n| --- | --- | --- | --- | --- |')
for m in match:
    if m['status'] == 'matched': continue
    o.append(f'| {m["page"]} | {m["row"]+1} | {m["name"]} | {m["status"]} | {"; ".join(m.get("hint", [])) or ""} |')
open(f'{R}/docs/gazetteer-disagreements.md', 'w').write('\n'.join(o) + '\n')
