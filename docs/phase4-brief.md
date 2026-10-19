# Khoim phase 4: fill the map, then fix it

On 19 October 2026 the live site was walked through on a phone and on desktop, in light and dark mode, as six kinds of visitor. The layout from phase 3 holds up. What fails is the content: the site is built to show things it does not yet hold. Every control that filters by a Konkani name, a feast or a layer ends up showing nearly nothing, so the buttons seem to do nothing.

What the site holds today: 2 of 429 villages with a reviewed Konkani name, none in Devanagari. 1 Gazetteer spelling row (Aldona). 2 feasts, 1 parish, 0 landmarks, 1 voice. Google may index 7 of 429 village pages, and Panaji and Margao are not among them.

Part A fills the data. Part B fixes the site. Do Part A first: several Part B steps depend on it. All rules in `CLAUDE.md` still apply, with the merge rule in DEPLOY, and so do `docs/phase2-brief.md` (rule 6 included), `docs/phase2-decisions.md`, `docs/phase2-copy-approved.md` and `docs/phase3-brief.md`, except where this brief changes them.

## Decisions (Shashank, 19 October 2026)
1. **The site opens in Official.** It is the spelling on signboards and in documents, and it takes neither side of the Devanagari and Romi argument. A visitor's own choice is still saved (`khoim-script`).
2. **Gazetteer Devanagari stays off the map.** Phase 2 rule 6 is unchanged. The 1970 list leans Marathi, and showing it in the देवनागरी view would present Marathi-leaning spellings as Konkani names. The map fills through review instead (A5).
3. **One control for what the map shows.** The view row and the Layers panel in About become one control (B3).

## Part A: data, one PR each

Every row needs a source and a page number or URL. `checked=yes` only when the source itself names the village and states the fact. Never fill a gap, correct a spelling or work one script out from another. Konkani and Romi names come only from the sources CLAUDE.md allows.

### A1. The Gazetteer spelling list, all villages
Aldona's row in `data/village_names_review.xlsx` came from the village spelling list in the Gazetteer of the Union Territory Goa, Daman and Diu, Part 1, 1979 (https://archive.org/details/dli.ministry.08183). Find that list in the scan and fill `gazetteer_government`, `gazetteer_soi`, `advisory_body_form`, `gazetteer_devanagari` and `gazetteer_page` for every village it covers.
- Read each line two ways: from the page image yourself, and with OCR (Tesseract with Marathi and Hindi data). Keep a value only where both readings agree exactly.
- Put every disagreement in `docs/gazetteer-disagreements.md`, with the page, both readings and a crop of the line saved in `docs/gazetteer-crops/`, for a reviewer to settle. Leave those cells empty.
- Match to LGD codes on taluka plus spelling, never on spelling alone. List rows that don't match in the same file.
- Display stays as rule 6: village sheet only, "Needs review", never on the map.

### A2. Feasts and zatras
Fill `data/credited/feasts.csv` from the Gazetteer's fairs and festivals lists (village by village), temple and committee sites, and Goa Tourism's festival calendar. Use the rule as the source states it ("Vaishakh Shuddh Panchami", "third Saturday after Easter"), with `calendar` set to lunar or gregorian. Work out the next date only for gregorian rules, as now. There is no target number: take every row a source supports.

### A3. Parishes
Fill `data/credited/parishes.csv` from the Archdiocese of Goa's parish list: church, patron, village. Add the feast rule only where a source states it.

### A4. Landmarks
`data/credited/monuments.csv` is empty. Fill it from the ASI and Goa State Archaeology lists of protected monuments, plus the temples, churches, mosques, forts and springs the Gazetteer names village by village. Use official or source names only, and invent no Konkani names.

### A5. A review batch, so the map can fill
Make `docs/review-batch-1.csv`, one row per village: official name, taluka, LGD code, Konkani Wikipedia candidate (135 are already in the review sheet), Gazetteer forms from A1, Luis spelling, and OpenStreetMap's `name_gom` (ODbL, marked as such). Leave empty columns for the reviewer's Devanagari, Romi, say-it and initials. Sort by taluka. The point is that one reviewer can settle many names in one sitting. Nothing in this file shows on the site until it is reviewed and written into `data/villages_lgd.csv` as CLAUDE.md describes.

### A6. Towns and common names
- Places whose LGD code is a town code (they start with 9, or come through `data/town_outline_matches.csv`) are towns. Show "Town in {taluka}", not "Village in {taluka}", and use "town" in titles and descriptions. This covers Panaji, Margao (Madgaon), Mapusa and the rest.
- Search aliases come from `data/raw/osm_localities_ODbL.csv`: `alt_name`, `old_name`, `name_pt` and `name_en`, in Latin script only. Panjim, Pangim, Vasco da Gama, Madgaon and Margão must find their place. Credit OpenStreetMap wherever aliases are used. OSM's Devanagari names go to the review batch (A5) only, never to search or display.

## Part B: the site, one PR each

### B1. Broken things
- On desktop, pressing + on any taluka page collapses the map into a box in the top left, with station names floating outside it. Fix it.
- At the all-Goa view, the whole of Goa fits on every screen from 360 px wide to 1920. Nothing covers land: not the draft banner, the "Scroll or pinch" hint, the OpenStreetMap credit or the zoom buttons.
- Zoom has limits. Out: all of Goa. In: a village fills about 60% of the shorter side of the map.
- A village without an outline (Sirigao, for one) zooms to its taluka, outlines the taluka, and says in its sheet that the village outline is not available yet. Never leave the map at all-Goa with nothing marked.

### B2. Labels you can read
- No two labels overlap at any zoom. When two collide, hide the smaller or less important one.
- Taluka names never sit on village names. Fade them out once village names are readable, and give them a paper-coloured outline in views that fill villages with colour.
- River names are straight text set along the straightest stretch of each river, shown only when zoomed in, and they meet the AAA contrast target in light and dark. Never place a river name letter by letter around a curve.
- Station names appear only at village zoom, and never on top of a village name.
- Every symbol on the map (church, temple, feast, station) has a name on tap and an entry in the legend.

### B3. One control for what the map shows
- Replace the view row and the Layers panel in About with one "Show" control. Its options: Names, Spelling endings, then any of Feasts, Landmarks, Voices, Crops, Food and Music that hold at least 10 entries, each with its count. An option with fewer than 10 does not appear.
- Remove "Still unwritten". The script toggle does that job: in देवनागरी or Romi, villages with a reviewed name show at full strength and the rest go faint, with the count line explaining it. The difference must be plain at the all-Goa view, using the house fill the way Still unwritten did.
- About keeps the about text, the credits and the contribution note. It no longer has layers.
- The phase 3 rules still hold: switching never moves the map, the control is never hidden, and every colour has a legend.

### B4. The village sheet
- "Do you know how {village} is said at home?" opens the contribution form for that village, recorder included, whenever `/api/config` says the form is open. Email only when it is not. This is CLAUDE.md's "one way in".
- When two spelling sources give the same form, show it once with both sources listed (Aldona shows "Aldona" twice today).
- Put the distances to Panaji and Margao last, after the facts with more to say.
- On desktop, when a place is open, the panel shows the breadcrumb and the controls, and hides the headline and count line, as the phone already does.

### B5. Findable without the map
- Search covers feasts, landmarks, rivers and the aliases from A6. Each result says what kind of thing it is and where ("Lairai zatra, feast in Sirigao, Bicholim").
- Add two pages:
  - `/feasts/`: feasts and zatras by month, starting with this month. Lunar feasts go under the month the source gives, or under "Lunar date, moves each year".
  - `/meanings/`: name origins from A to Z.

  Every entry links to its village. Both pages go in the sitemap, and both are linked from About and from the map's "Show" control.

### B6. Spelling endings explained
Spelling endings shows one line per ending on what it tells you, quoted or paraphrased from a source in `data/credited/` with its credit. If no source explains an ending, show no line for it and list it in your summary. Never write the explanation from general knowledge.

### B7. Google
- Index every village or town page that has at least one sourced fact beyond the official name: a meaning, feast, parish, landmark, video or Gazetteer spelling. Rule 6 still applies to how the Gazetteer form is displayed.
- Titles and descriptions mention the meaning or the main feast where there is one, following the patterns in `src/data/seo.ts`.
- The sitemap's `lastmod` is the date the page's data last changed, not a fixed date.

### B8. Opening script
The site opens in Official (decision 1).

## Done means
Repeat this walk-through on khoim.in after the last merge, at 390x844 and 1440x900, in light and dark. Every line must pass:
- Searches for Panjim, Vasco, Madgaon, Lairai, Dudhsagar and São João each find the right place.
- The first screen's count line on a first visit does not start with 0.
- Switching between Official, देवनागरी and Romi visibly changes the all-Goa map.
- No label overlaps any other at the all-Goa view, at a taluka view and at a village view. Check with the overlap count in `scripts/dev/` (add one if missing) and by looking.
- Every river name that shows can be read.
- Pressing + and − on every page leaves the map whole.
- The ask on a village sheet opens the recorder.
- `/feasts/` and `/meanings/` are live, in the sitemap, and every entry opens its village.
- The sitemap lists every village page that has a sourced fact.
- `scripts/dev/contrast-audit.js` passes in all four combinations.

New wording goes in with `TODO(copy)` and in your final summary for Shashank. Then update `design/` to describe what is live, in its own PR.
