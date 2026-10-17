# Khoim phase 3: the type atlas

Rebuild the map around the prototype in `docs/prototypes/type-atlas.html`. Open it in a browser first and use it on a phone-sized window and on desktop: it is the spec for how the map looks and behaves. Where this brief and the prototype differ, this brief wins. All rules in `CLAUDE.md`, `docs/phase2-brief.md` and `docs/phase2-decisions.md` still apply, including the merge rule. Shashank has approved this direction and the wording below.

## What changes, in one paragraph
The map of Goa is drawn with its village names inside the village shapes, so the map is made of names. People pan and zoom freely to read it. Three views change only the emphasis on the same map. Rivers become a few named, quiet lines. The strip of village cards goes. Every place keeps its own page and URL, so search, sharing and the sitemap are unaffected.

## Rules
1. **Names on the map follow rule 6 of phase 2.** Map labels show reviewed names only. Where a village has no reviewed name in the chosen script, its official spelling shows in a light weight and lower opacity. Gazetteer-only names never appear on the map.
2. **One colour, one meaning, per view.** Every view that uses colour for meaning shows a legend on the map. The legend swatch and the map colour are the same token.
3. **Same framing in every view.** Switching view never moves or resizes the map. Village names, taluka names and taluka borders stay visible in every view.
4. **The view controls are never hidden.** No sheet or card covers or replaces them.
5. **One count.** 384 villages have shapes and are drawn. Use that number everywhere the map counts villages. Where the site talks about all villages, say 429 and that 45 are not drawn yet. Never show 383 or 38-of-something without the taluka name.

## Build steps, one PR each, in this order

### 1. Label data at build time
Port the label logic from `docs/prototypes/build_labels.py` into `data/scripts/`: for each village shape, a label point, an angle along the shape's long axis (kept between -55° and 55°, snapped to 0 under 8°), a font size that fits the shape, and neighbours (shapes sharing at least two boundary points). Write it into the map data the site already loads. Check the output for Aldona: neighbours Corjuem, Olaulim, Nachinola, Tivim, Moira, Pomburpa.

### 2. The type map and free zoom
- Draw each village name inside its shape as SVG text in Anek Latin at width 75 (Anek Devanagari for Devanagari), colour from its taluka house, on the house tint fill.
- Pan with drag, zoom with wheel and pinch, around the pointer. Show a village name only once it is at least 7 px tall on screen. Taluka names are large at Goa level and fade out as you zoom in.
- Tapping a village zooms to it, keeps its neighbours' names visible, outlines it, and opens its sheet. The URL changes to the village page, as now. Back and the breadcrumb still work.
- The script toggle (Official, देवनागरी, Romi) changes the map labels as well as the sheet.
- Keep the plain-link list of every place for search engines and keyboard users. The SVG labels are `aria-hidden`; "See all as a list" stays.

### 3. Views and legend
- Replace the layer row with: **Names**, **Spelling endings**, **Still unwritten**.
- **Spelling endings:** ending buttons appear only in this view (-im, -em, -gao, -ona, -ora, with counts). Matching villages fill with ink and their names turn to paper colour. Others turn to the quiet neutral with faint names. Line above the map: "{n} of 384 villages end in “-{ending}” in their official spelling." Legend: "ends in -{ending}" and "other villages".
- **Still unwritten:** villages with a reviewed Konkani name in any script fill with kokum. Everything else is quiet with its official name faint. Line: "{n} of 384 villages have a Konkani name written here. The rest still show their official spelling." Legend: "written in Konkani, {n}" and "not yet, {384-n}".
- **Feasts and zatras:** take it out of the view row until the data has at least 20 entries. Keep feasts on village sheets.
- **Population:** stays hidden until Census data exists, as now.

### 4. Rivers and railway
- Draw only named main rivers from `data/raw/osm_lines_ODbL.geojson`: Mandovi, Zuari, Chapora, Terekhol, Sal, Talpona, Galgibaga, Mhadei, Kushavati, Valvanti, Dudhsagar, Mapusa River. Drop unnamed and minor streams. `docs/prototypes/rivers-proto.json` shows the projection and weights used.
- Soft water colour, round caps, width in map units so it grows with zoom, heavier for the Mandovi and Zuari. Clip to Goa's outline.
- River names follow the line once zoomed in past about 2.2 times the Goa view. Official names only; no invented Konkani river names.
- In the other two views rivers fade to 30% and lose their names.
- Railway: one thin ink line, station names only at village zoom. Feast, monument and GI symbols show only in the Names view and only at village zoom.
- Keep the OpenStreetMap credit.

### 5. Layout
- Remove the strip of village cards under the map.
- Desktop: text and controls sit in a panel at top left. The map is centred in the space to its right. The village sheet docks on the right.
- Phone: the map takes at least 60% of the screen in every state. When a village is open, the headline, count and ending buttons collapse; the wordmark and script toggle stay.
- The first screen headline is "Goa, written in its own names." with the count line under it. This replaces "Every taluka in Goa, with its Konkani name and how to say it."

### 6. The village sheet
Match the prototype's sheet:
- Village outline as the picture beside the name.
- Official, देवनागरी and Romi listed together, with "not written yet" where empty. A Gazetteer-only Devanagari form shows only here, with "Needs review" and its note.
- The ask: "Do you know how {village} is said at home? Record it or write it in either script, and it goes on the map with your name." linking to the existing contribution form.
- Sourced facts, then "Next to" with neighbour buttons that move the map.
- Keep everything phase 2 added (video, feast strip, sources, share).

## Approved wording
"Goa, written in its own names." · "{n} villages, as the government spells them. Switch script to see how many we can write in Konkani yet." · "{n} of {total} villages written in {Devanagari|Romi} so far. The faint names are still waiting for someone who knows them." · "Names" · "Spelling endings" · "Still unwritten" · the view lines and legends above · "Scroll or pinch to read the villages. Tap one." · "Village in {taluka}" · "not written yet" · "Next to" · the ask line above.

## Done means
- All six PRs merged and checked on khoim.in, phone and desktop, light and dark, against the prototype.
- No view moves the map, hides the view controls, or shows a colour without a matching legend.
- Search pages, sitemap, share cards, contributions and the contributors page work as before.
- After merging, update `design/` (README, tokens, components) so the design files describe what is live. Note anything you changed from the prototype and why.
