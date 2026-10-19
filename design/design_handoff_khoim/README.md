# Handoff: Khoim (खंय), the Konkani place-names map of Goa

## Overview
Khoim ("where" in Konkani) is a non-profit, mobile-first web app. It is an interactive map of Goa that shows each place's Konkani name in Devanagari and Romi next to its official spelling, with a rough guide to saying it. The map is the whole site: tap a place to see its names, tap again to go inside (Goa → district → taluka → village). It must work well on cheap Android phones and slow networks, meet WCAG 2.2 AAA, and grow into later layers (voices, crops, food, music, landmarks).

## About the design files
The files in this project are **design references built in HTML/React (in-browser Babel)**. They show the intended look and behaviour; they are not production code. Recreate them in the target stack. With no codebase yet, we suggest **Vite + React + TypeScript**, plain CSS with the provided custom properties (no CSS-in-JS), static JSON data and a service worker for offline use. Keep the SVG map approach (no WebGL, no map tiles).

## Fidelity
**High fidelity.** Colours, type, spacing, radii, motion and copy are final for this phase. Match them exactly, using the tokens in `tokens/`.

## Where things are (paths from the project root)
Download the whole project; this folder is its entry point. Serve the project root (e.g. `npx serve`) and open `ui_kits/khoim/index.html` to click through every state. `readme.md` at the root is the full design guide.

- `styles.css` → `tokens/fonts.css`, `tokens/base.css`, `tokens/themes.css`, `tokens/layers.css` (phase 2), `tokens/elements.css`, `tokens/typemap.css` (phase 3). **Copy these as-is.**
- `components/**/X.jsx` + `X.d.ts` (props contract) + `X.prompt.md` (usage notes). These are reference implementations of every component.
- `components/data/`: `places.js` (names), `goaGeo.js` (boundaries), `khoim.js` (lookups, search, spoken names, house colours, layers). Turn these into JSON plus a small TS module.
- `ui_kits/khoim/`: the full app. `index.html` has buttons for every state, phone and desktop, light and dark. `state.jsx` holds the state machine and presets, `Phone.jsx` and `Desktop.jsx` the layouts, `Cards.jsx` the share images, `More.jsx` the About/Help screen. The inline script in `index.html` only rebuilds components in the browser when the compiled bundle is stale; do not port it.
- `guidelines/accessibility.md`: the AAA checklist and every contrast figure.
- `assets/lucide/`: the 22 icons used (Lucide, ISC). `assets/names_districts_talukas.csv`, `assets/goa-map*.svg`: source data.

> **Phase 3 (at the end) is what is live now** and wins over phases 1 and 2: the map is made of village names, with free pan and zoom, three views with legends, named rivers, a new layout and a new village sheet. `tokens/typemap.css` holds its tokens.

> **Phase 2 (below) changes the phone chrome:** the breadcrumb replaces the back button, a layer row sits under it, and every sheet has the place name in its handle row. Where phase 1 and phase 2 differ, phase 2 wins.

## Screens / views

### 1. Map, all Goa (phone 390×844)
- **Purpose:** first screen. Invites touch.
- **Layout:** full-bleed map. No header bar. Floating on top:
  - Top left, 14px from the top and 16px from the left: the Wordmark (खंय Khoim, 22px, weight 600). Tapping it opens About.
  - Top right: ScriptToggle, 206×48.
  - Title at top 76px, left 20px, right 36px: "Every taluka in Goa, with its Konkani name and how to say it." Anek Latin 600, 29px, line height 1.15, letter-spacing −0.01em.
  - Bottom (16px sides, 20px from the bottom): hint chip "Tap a district, or press and drag along Goa" (soot fill, white text, 15px/600, 10×12 padding, radius 12). Under it, a 58px search button: white, radius 16, shadow-2, search icon plus "Search any name, any script" (18px/500).
- **Map insets:** top 176px, bottom 108px. Talukas repaint north to south on first load.

### 2. District tapped once
- The district's talukas keep full house colour; every other taluka switches to its `--map-*-dim` tint. Labels on lit talukas use the house ink; on dim ones they use `--text`.
- A sheet peeks 296px high (336px when there is no Devanagari name). Its background is the district's house colour and its text is that house's ink. Inside, a trim frame (2px, radius 20, padding 14/16/18) holds:
  - "District" (15px/600) and a 44px close button.
  - Devanagari name, 54px/600, line height 1.5.
  - Romi, 30px/600, then the official spelling at 18px/500.
- Two buttons follow, 56px tall, radius 16, 10px gap: "How to say it" (outline) and "Go inside →" (solid in house ink, label in the house colour).
- Map inset bottom = peek + 8px. The map eases to the new inset over 480ms.

### 3. Inside a taluka
- Zoom (FLIP transform, 600ms, `--ease-out`) to the taluka's box plus 6% padding. Village polygons get a white 1px outline at 45%. Villages show as white dots at their label points: r 4px, 5px for census towns, 9px with a 3px ink ring when selected. A white tag above the selected dot shows its official name (15px/600, radius 12, shadow-2).
- Back button: 48px IconButton, top left. Its label is "Back to <parent>". Next to it, the taluka name in the current script.
- The strip sheet peeks 200px:
  - Heading: the taluka name at 30px, plus "47 villages".
  - A sideways snap list of 142×100 cards, 10px gap. Village cards are white with a 2px line border and show the name at 18px/600 plus "Official name only". Taluka cards take their house colour, with an inner trim frame.
  - Swiping moves the highlight on the map. The active card lifts 4px and gets a 2px ink border.

### 4. Place card, full (Canacona)
- Drag the sheet up or tap "How to say it". The sheet goes to full: top 56px, radius 28 at the top, shadow-sheet.
- The name frame grows: Devanagari 76px, Romi 40px. Rows are separated by 1px ink rules at 35% opacity, and each has a 14px/600 label. The rows are:
  1. **Say it:** SayIt beats, then "Rough guide, both n sounds are retroflex. Not yet checked by a speaker.", then VoiceClip in its empty state, "No recordings yet."
  2. **Sources:** SourceStatus, plus a "Where this comes from" disclosure.
  3. **Also written / In Marathi / Official spelling:** only when the data has them.
  4. **Headquarters.**
  5. **Worth knowing:** facts from the data.
  6. **Go inside, N villages:** full-width solid button.
- The expanded content rises in: 8px, 320ms.

### 4b. Place card for a village with the official name only (Raia)
- Neel sheet (Raia is in Salcete). The official name "Raia" is the headline at 64px/600.
- In place of the Devanagari name, PendingName: an oyster-shell window, a 2px frame holding 16 soft panes that breathe over 4.2s. A white label tile in the middle reads "Konkani name not recorded yet".
- Konkani name row: "Know what Raia is called in Konkani? Tell us how your family says it." plus a "Tell us" button with the mail icon.
- Sources row: "Official name only", shown by an empty mark.
- Boundary row: "Local Government Directory, LGD code 626925. Census town." (when `town` is true).

### 5. Search (mixed scripts)
- The search screen slides up (480ms). Field at top 54px: 56px tall, radius 16, white, shadow-1, search icon, placeholder "Canacona, काणकोण, Kannkonn". A "Cancel" text button sits beside it.
- A live count follows ("16 places"). Each result is a white card, radius 16, padding 12/14:
  - A 10px house-colour tab on the left.
  - Devanagari name 28px and Romi 21px on one line.
  - Official spelling and "Taluka in South Goa" underneath at 15px.
  - The matched part is highlighted in `--mark` (radius 4).
  - Villages show "Official name only".
- Results rise in with a 30ms stagger.

### 6. Layers and About
- Full-screen dialog. The draft banner sits on top:
  - Layout: soot strip, 14px text.
  - Copy: "**Draft for review.** Names and pronunciation guides are not final. **Tell us what is wrong**".
- Below the banner:
  - Wordmark at 40px, with theme (sun/moon) and close buttons.
  - Lead line: "Khoim means "where" in Konkani. …"
  - Sections: Layers (LayerSwitch), Why Khoim, Where the names come from, A note on scripts, and Help us (four role cards plus a "Write to us" button). Then the full credit.
- All copy is verbatim from the current draft site. See `More.jsx`.

### Desktop (1280×800)
- **Frame:** draft banner on top. Below it, a grid: the map takes the flexible column, and a 460px names panel sits on the right. The panel is `--surface-sunk` with a 1px left border.
- **Map header** (top 20px, 28px sides):
  - Wordmark (26px) and a breadcrumb: Goa / South Goa / Salcete, 16px/600, underlined links.
  - On the right: ScriptToggle and a Layers IconButton.
- **Goa level:** the title sits at left 32px, top 120px, width 330px (40px/600, line height 1.1), with the instruction under it at 19px. The map is inset 360px from the left.
- **Inside a level:** PlaceStrip runs along the bottom of the map; map inset bottom 170px.
- **Panel:**
  - SearchField at the top (padding 20/24/12).
  - Below it: results, or the selected place's card, always expanded. The card sits on its house colour, radius 28, 6px inset.
  - Credit at the bottom.

## Interactions & behaviour
- **Tap model:**
  - Tapping an unselected place selects it.
  - Tapping the selected district or taluka goes inside. Tapping the selected village expands its card.
  - A label tap counts the same as a shape tap. At Goa level, a taluka label selects its district.
- **Scrub:**
  - Starts after a pointer moves 8px. A loupe (220px wide, the house colour, trim frame, shadow-3) follows 150px above the finger.
  - It shows the Devanagari name (32px) and "Romi · Official" (15px).
  - Releasing selects the place under the finger.
  - Scrubbing is optional; tapping covers everything it does.
- **Sheets:**
  - The sheet follows the finger 1:1.
  - On release, a move over 48px up (or velocity under −0.4px/ms) expands it. Over 72px down from full collapses it. Over 64px down from peek closes it.
  - The handle is a button that toggles. Escape closes.
- **Back:** clears the selection first, then goes up one level.
- **Script toggle:** changes every label, strip and heading. A missing form falls back to the official spelling at 2px smaller. Saved in localStorage as `khoim-script`; default `deva`.
- **Say it:** tap to step through the syllables at 420ms each. The active syllable fills with the ink colour and lifts 3px. The stressed syllable is the capitalised one in the data (700, 30px); the others are 500, 24px.
- **Announcements:** a polite live region reads `spokenName(place)` on selection, and "Inside Salcete. 47 villages." on going inside.
- **Reduced motion:**
  - Every duration token goes to 0.
  - Paint-in is skipped, the shimmer stops, the FLIP zoom jumps.
  - The sheet still moves with the finger but snaps without animating.

## State (see `ui_kits/khoim/state.jsx`)
`focus` (null | district | taluka id), `selected` (id | null), `snap` ('peek' | 'full'), `hot` (id for transient highlight), `script`, `search` (bool), `query`, `more` (bool), `layer` ('names'), `announce` (string). URL routing is recommended in build: `/`, `/south-goa`, `/south-goa/salcete`, `/south-goa/salcete/raia`, `?q=`.

## Data
- **Place:**
  ```
  { id, level: 'state'|'district'|'taluka'|'village', parent, lgd, official,
    deva, romi, say, sayNote, status: 'agree'|'differ'|'pending', house,
    reviewed, alsoWritten[], marathi, officialNote, pendingNote, hq, facts[],
    sources }
  ```
  Villages are generated from the geo file with `status: 'pending'`, plus `town` and `boundarySource` ('LGD'|'SOI').
- **Geo:** 1000×1419.2 plane. Each shape has `d` (SVG path), `b` ([x0,y0,x1,y1]) and `lp` (label point). About 200 KB as JS; ship it as gzipped JSON, and lazy-load village polygons per taluka.
- **Search:** Latin is folded to strip accents; Devanagari matches as typed. The fields searched are deva, romi, official, alsoWritten and marathi. Ranking: prefix before substring, and districts and talukas before villages.
- **Future recordings:** `{ speaker, village, src, duration }` on a place. Always credited by name and village.

## Design tokens (all in `tokens/`)
- **House colours / ink / contrast:**
  - haldi #E8B23A / soot, 9.65
  - kokum #8C2E4A / white, 8.06
  - rose #E2869D / soot, 7.22
  - green #206150 / white, 7.27
  - oxide #913D28 / white, 7.24
  - lilac #A79AD2 / soot, 7.28
  - sky #50AEC5 / soot, 7.28
  - neel #294C9C / white, 8.05
  - mustard #DF9036 / soot, 7.27
  
  The light and dark tints are in `base.css`.
- **Taluka to house:**
  - Pernem, Quepem: haldi
  - Bardez: kokum
  - Tiswadi, Canacona: rose
  - Bicholim, Sanguem: green
  - Sattari: oxide
  - Ponda: lilac
  - Mormugao: sky
  - Salcete: neel
  - Dharbandora: mustard
  - Districts: North Goa green, South Goa neel, Kushavati oxide
- **Neutrals:**
  - Light: surface #F6F5F1, raised #FFFFFF, sunk #ECEAE3, line #DEDAD0, text #16120C, text-2 #4A453E
  - Dark: surface #15130F, raised #211E19, sunk #1B1814, line #2E2A24, text #F3F0E8, text-2 #C9C3B8
  - Search mark: #F4D98A light, #6B5412 dark
- **Type:** Anek Devanagari and Anek Latin, weights 500/600/700.
  - Name sizes: 76 / 54 / 40 / 30 / 24
  - Text sizes: title 29, lead 19, body 17, small 15, caption 14
  - Line heights: Devanagari 1.5, Latin 1.3, body 1.5, title 1.15
- **Spacing:** 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 64. Gutter 20. Tap 48, minimum 44.
- **Radii:** 4, 8, 12, 16, 20, sheet 28. Trim 2px, inset 6px.
- **Shadows:**
  - 1: 0 2px 10px rgba(22,18,12,.08)
  - 2: 0 6px 24px rgba(22,18,12,.12)
  - 3: 0 14px 36px rgba(22,18,12,.24)
  - sheet: 0 −10px 40px rgba(22,18,12,.16)
- **Motion:**
  - Easings: standard cubic-bezier(.32,.72,0,1), out cubic-bezier(.22,1,.36,1)
  - Durations: press 140, fast 200, base 320, sheet 480, zoom 600, paint 700, stagger 60, beat 420 (ms)
  - Press scale 0.97
- **Focus:** 0 0 0 2px surface, 0 0 0 5px ink.

## Assets
- Fonts: Google Fonts, Anek Devanagari and Anek Latin (OFL). Self-host subsets in build.
- Icons: Lucide 0.453.0, 22 icons in `assets/lucide/`.
- There is no logo; the wordmark is type.
- Devanagari spelling खंय confirmed.

## Not designed yet
- Recording flow and the contribution form ("Tell us").
- Map marks for future layers. Plan: small white trim tiles with the layer icon, never pins.
- Offline and error states.
- Village Konkani names.


---

# Phase 2: village facts, map layers, touch cues, sharing (16 Oct 2026)

Same tokens, fonts, icons and house colours. New tokens are in `tokens/layers.css`. Click through every state in `ui_kits/khoim/index.html`, presets 1 to 12.

## Data rule
Only sourced content. Everything verified so far is in `components/data/villageFacts.js` (Aldona, Bandora, Calangute, Rivona, Shirgao, Siolim, Moira, Cola, Parra). Unknown values are `null` and render as **DataPending** (a dashed tile reading "To load"). Never fill a gap with a guess.

TODO(data), before launch:
- Census 2011 village directory: population, households, panchayat. PIN codes. Nearest station.
- River and railway lines from OpenStreetMap. The two Bardez lines in `LINES` are placeholder geometry (`placeholder: true`, drawn dashed, station labelled "Station (to load)").
- Sirigao (Shirgao), Bicholim: load its LGD code and point. It stays off the map until then (see Phase 2 revisions, 8).
- YouTube id for the Bandora episode.
- Distances: `KM_PER_UNIT` (0.0707) is an approximation. Compute straight-line km from latitude and longitude at build.
- A source for what each name part means (the Name parts layer matches official spellings only).

## New data fields
- `VILLAGE_FACTS[placeId]`:
  - `deva`, `devaSource`, `devaReviewed`
  - `spellings { ordered, items[{ form, source, year?, lang?, note? }] }`
  - `meaning { kind: options|differ|tradition|single, readings[{ text, from?, gloss?, source }] }`
  - `split { whole, source, parts[{ part, sharedWith[{ id, name }] }] }`
  - `vaddos { source, items[] }`
  - `knownFor[{ kind: monument|gi|parish|zatra|festival, icon, title, detail?, when?, whenText?, source }]`
  - `video { title, channel, youtubeId, thumb? }`
- `when`: `{ month, day }` | `{ easterSaturday: n }` (nth Saturday after Easter, computed) | `{ lunar: true, months[] }`. Lunar dates are never converted to a guessed day.
- Place status adds `review`: a Konkani form exists in a source but nobody has checked it. Label "Needs review", shown as a dashed ring with a centre dot.
- `NEIGHBOURS` (`components/data/neighbours.js`) is computed from shared boundary points (2.5 units tolerance). Regenerate it when boundaries change.
- `CENSUS[placeId]`: `{ population, households, panchayat, pin, station, step }`. Empty for now.
- Helpers in `KhoimData`:
  - Places and geography: `neighboursOf`, `villageFacts`, `distanceKm`, `glyphsFor`, `linesFor`
  - Feasts: `easter`, `feastDate`, `feastMonths`, `allFeasts`
  - Layers: `layerState`, `populationStep` (placeholder), `layerUrl`, `NAME_PARTS`, `MAP_LAYERS`

## New tokens (`tokens/layers.css`)
- **Map lines:**
  - River: `--map-river` (sky) on a 6px `--map-river-casing` (trim)
  - Railway: `--map-rail` (soot in light, chalk in dark), 2px, on a 6px `--map-rail-tie`
  - Placeholder lines are dashed 8/5.
- **Layer fills:**
  - Lit: the village's house colour, with a 1px `--map-lit-outline`
  - Dim: the house tint (`--map-*-dim`)
  - Review: house tint with a dashed 1.5px `--map-outline`
  - Outline: `--map-unlit` with a 0.6px `--map-outline` (ink-700 in light, chalk-300 in dark)
  - Population: `--pop-1..5` (light #DDE1E7 → #294C9C, dark #202F30 → #50AEC5)
- **Glyphs:** `--glyph-bg` (white in both themes) and `--glyph-ink` (soot). Tile 30px, icon 16–18px, hit area 44px.
- **Hit targets:** `--label-hit` 44px, `--chip-height` 44px, `--chip-radius` 12px.
- **Placeholder border:** `--placeholder-border`, 2px dashed currentColor.
- **Toast and hint:** `--toast-bg` / `--toast-text` and `--hint-bg` / `--hint-text` (soot and white, inverted in dark).
- **Motion:** `--dur-demo` 2400ms, `--dur-pressed` 0ms (the pressed state is instant).
- **Share image sizes:** `--og-width` / `--og-height` 1200×630, `--square-size` 1080, `--story-width` / `--story-height` 1080×1920.

## Interaction cues
- **Tap targets:** at Goa level the tap targets are now talukas, not districts. Tap a taluka to select it, tap again to go inside; the district stays in the breadcrumb. Every map label is a button at least 44×44 (`--label-hit`).
- **Pressed state:** shown on pointerdown, before any work: a white tile with soot text, shadow-1 and scale 0.94, no transition.
- **First visit demo** (preset 1):
  - After the paint-in (about 1.7s), the map selects Bardez and its sheet rises with its names.
  - After `--dur-demo` (2400ms) it settles back and **TapHint** "Tap any taluka" appears above the sheet.
  - The hint goes after the first tap and never comes back (localStorage `khoim-tapped`).
  - Reduced motion: Bardez is shown lit and the hint is visible; nothing moves.
- **Sheet:** there is always one at the bottom. Its handle row (44px) shows the current place name (Devanagari, then official) on the left, the grip in the middle and "More" / "Less" on the right. Peek heights:
  - Goa: 128
  - Taluka strip: 246
  - Taluka or district card: 312
  - Village: 318, or 360 with no Devanagari
  - Layer: 280, or 300 for feasts and 200 for population
- **Breadcrumb:** Goa / district / taluka / village as 44px tiles, following the script toggle. The current step is a soot tile; each earlier step is a white tile and the way back. Desktop uses the same component in the map header.
- **LayerRow:** under the breadcrumb, a visible row: Names, Name parts, Feasts and zatras, Names we need, Population. 44px tiles, radius 12, icon plus label. It scrolls sideways.
- **Empty states ask for help:** "Know how Aldona is said? Tell us." with "Record it" and "Write it down".

## Phone screens (390×844)
**Chrome:**
- Row 1 (top 12px): Wordmark (21px) and ScriptToggle (200px).
- Row 2: the breadcrumb. At Goa level this row holds the title (25px, line height 1.15); in a layer view it holds the layer headline (22px/600), e.g. "Names ending -im, 68 villages".
- Row 3: LayerRow.
- Map insets: top 170px inside a place or layer, 202px at Goa level; bottom is the sheet peek plus 4px.

1. **First visit.** Repaint, then the demo. The Goa sheet holds a search button (56px) and, pulled up, all 12 talukas as house-colour tiles grouped by district (a list route into the map).
2. **Inside Bardez, Aldona tapped:**
   - The map frames Aldona and its neighbours: union of their bounding boxes plus 8%.
   - Aldona gets a 3px trim outline and its name tag (17px, white, shadow-2). Neighbours are labelled with small white tags (13px/600) that work as buttons, and their shapes get a light wash.
   - River and railway lines show with the station marker.
   - Glyph tiles (church, banana, sailboat…) sit 8px below-right of each village's label point.
   - The sheet peeks on kokum.
3. **Aldona, full sheet.** Blocks in this order (one with no data doesn't render):
   - Name block: Devanagari 76px, Romi slot (dashed "Romi not recorded yet"), official 20px, SourceStatus "Needs review", "Devanagari as in the Gazetteer, 1979". A play button appears here once a recording exists.
   - Say it: the empty-state ask.
   - Meaning: one entry, "Haldona, from hal (plough) or haldi (turmeric). Two options.", credited to Dr Alvarinho J. Luis, The Goan, 21 Feb 2026.
   - Spellings: a vertical line with stops: Government spelling Aldona, Survey of India spelling Aldona, Advisory Body spelling Haldone, Devanagari हळदोणें (pending review), captioned as columns of the 1970 spelling list in the Gazetteer, 1979.
   - Facts: a 2-column grid of People, Households, Village or Census Town, Panchayat, PIN and Nearest station (all DataPending), then "about N km" to Panaji and Margao, tagged "Placeholder data", "Distances are in a straight line.", and the PopulationDots strip (tagged "Placeholder data").
   - Known for: St Thomas parish feast, third Saturday after Easter, with a FeastStrip ("Next: Saturday 17 April 2027" after this year's 25 April).
   - Sources: Local Government Directory, Government of India; Gazetteer of Goa, Daman and Diu, 1979 (spellings and Devanagari); Dr Alvarinho J. Luis, The Goan, 21 Feb 2026; UCA News parish directory. Each is a link; missing URLs show "(link to add)".
   - Actions: "Share Aldona" (full width), then "Tell us" and "Record the name".
4. **Parra, official name and facts.** Official name as the headline (60px), PendingName window, "Official name only". Then Say it (ask), Vaddos (Britto Vaddo, Jackney Vaddo (I), Jackney Vaddo (II), CEO Goa electoral roll, with "We do not draw their edges."), Facts and Sources.
5. **Name parts, -im.**
   - Map: every village whose official spelling ends -im is lit in its house colour; the rest go to tint.
   - Panel: intro line, part tiles (-em 98, -im 68, -gao 12, -ona 12, -ora 10; 48px tall), "68 villages end in -im", the source caveat and "Share this view".
   - Link: `?layer=parts&part=im`.
6. **Feasts and zatras, April.**
   - Panel: MonthSlider (role=slider, 52px, drag, tap or arrow keys, with a dot under each month that has something), then a list: St Thomas parish, Aldona, 25 April; Lairai zatra, Sirigao, "Vaishakh Shuddh Panchami. Lunar date, so it moves each year." St Thomas reads "Third Saturday after Easter. Next: 17 April 2027."
   - June shows the Sao Joao boat parade, Siolim, 24 June.
   - Empty month: "No feast or zatra recorded for this month yet. Know one? Tell us."
7. **Names we need.**
   - Map: villages with a checked Konkani name are filled, unchecked forms are tinted with a dashed outline, the rest are outlined.
   - Panel: "0 of 384 villages have a checked Konkani name.", a three-row legend with counts, the call to help, and "Help fill this in" plus "Share this view".
8. **Share menu on Aldona.**
   - Layout: a scrim (`--scrim`) behind a ShareSheet that rises from the bottom.
   - Contents: title "Share Aldona", the link-preview card at 29%, the short URL `khoim.in/north-goa/bardez/aldona`, then rows: Send (navigator.share: "WhatsApp, Instagram and the rest"), Copy link, Save image square, Save image tall.
   - Confirmation: Toast, "Link copied" / "Square image saved" / "Tall image saved", for 2400ms.
9. **Share images** (`ShareCard`, rendered headless at build time):
   - Formats: og 1200×630 (og:image), square 1080, story 1080×1920.
   - Layout: house colour, a 5–6px trim frame (radius 36–48), the place's own shape in the ink colour, a where-line, then Devanagari and Romi at the **same** size (112px og, 130 square, 150 story) and the official spelling smaller (44 / 56).
   - Footer: wordmark and khoim.in.
   - A missing script is left out. A place with no Konkani name shows the official name plus "Konkani name: help us find it".
   - At 300px wide (WhatsApp thumbnail) the Devanagari is still about 28px.
10. **Bardez as a village list.**
    - Phone: a full-screen list with back button and title (Devanagari, then "Villages in Bardez"). Sort buttons: A to Z, Konkani name. Each row is 60px: reviewed Devanagari if any, official, then the status ("Needs review").
    - Desktop: a real table. Each th is a button with aria-sort. Columns: Official (link), देवनागरी and Romi (reviewed names only), Village or Census Town and People 2011 (both DataPending, sort disabled until Census loads), Konkani name.
    - Route: `/north-goa/bardez/villages`. Opened from "See all as a list" under the village strip.

## Desktop (1280×800)
- **Map header:** Wordmark, Breadcrumb, ScriptToggle and an About button, with LayerRow on a second row. Map inset top 140.
- **Panel (460px):** search, then the VillageSheet (always expanded, on its house colour) or the LayerPanel.
- **Share:** copies the link straight away and shows the Toast; no sheet.
- **Village list:** the table opens over the map area, with a back button.

## Dark
All of the above works under `[data-theme="dark"]`:
- House colours stay as they are.
- Rails and outlines switch to chalk.
- The population ramp moves to sky on soot.
- Glyph tiles stay white with soot icons, so they read on both grounds.

## Routes and links
- **Places:** `/`, `/north-goa`, `/north-goa/bardez`, `/north-goa/bardez/aldona`, `/north-goa/bardez/villages`.
- **Layer views:** `?layer=parts&part=im`, `?layer=feasts&month=4`, `?layer=need`, `?layer=population`. Built by `KhoimData.layerUrl(place, layer)`; a shared link opens with the same layer and part or month selected.
- **Preview cards:** every place page gets an og:image card made at build. Never add share counts, like counts or social logins.

## Accessibility additions
- **Labels and glyphs:** map labels, neighbour tags and glyph tiles are buttons with spoken names, e.g. "St Thomas parish, Aldona".
- **Keyboard:** MonthSlider has full keyboard support and an aria-valuetext of "April, 2 places". Layer rows and part pickers are radiogroups.
- **Status messages:** Toast and the result counts are polite live regions.
- **Reduced motion:** the demo, the sheet transitions and the label pressed scale all respect it.
- **Contrast:** every text pair is still 7:1. Placeholders use dashed borders, never faded text.

## TODO(copy): new UI text in phase 2, for review
- Tap any taluka / Click any taluka
- More / Less (sheet handle)
- All about {place}
- Share / Share {place} / Share this view
- Know how {place} is said? Tell us.
- Record it / Write it down / Record the name / Tell us
- Two readings / Sources differ / Local tradition / One interpretation / Tradition
- Name split / As split in {whole}, {source} / No other villages linked to "{part}" yet. / Also in:
- Spellings / Spellings over time / Earliest at the top, in the order the source gives. / How each source spells it.
- Vaddos / {n} vaddos listed in the {source}. We do not draw their edges.
- Facts / People, Census 2011 / Households / Counted as / Census town / Village / Panchayat / PIN / Nearest station / To Panaji / To Margao / about {n} km / Distances are in a straight line. / To load / Placeholder data / Fewest people / Most
- Known for / Parish feast / This year: {date} / Next: {date} / Date follows the Hindu calendar, so it moves each year. / This year it fell on {date}.
- Video / {channel} on YouTube. YouTube loads only when you tap play. / Episode link still to add.
- Sources
- Needs review / Devanagari as in the {source} / Romi not recorded yet / Konkani name not recorded yet
- Names / Name parts / Feasts and zatras / Names we need / Population
- Pick an ending. Every village whose official spelling ends with it lights up. / {n} villages end in {part} / Matched on official spellings. What each part means still needs a source. / Names ending {part}, {n} villages
- {n} places / Lunar date / {place}, not on the map yet / No feast or zatra recorded for this month yet. Know one? Tell us. / Feasts and zatras in {month}
- {n} of {total} villages have a checked Konkani name. / checked by a speaker / written down, not checked yet / with no Konkani name yet / If you know how your village is written in Devanagari or Romi, tap it and tell us. / Help fill this in / Konkani names we still need
- Placeholder shading. Census 2011 figures are not loaded yet. / Fewer people / More / People per village, Census 2011
- Send / WhatsApp, Instagram and the rest / Copy link / Save image, square / For posts. Your name in Konkani / Save image, tall / For status and stories / Link copied / Square image saved / Tall image saved
- {where}, Goa / Konkani name: help us find it (share cards)
- See all as a list / Villages in {taluka} / Sort / A to Z / Konkani name / Town first / {n} villages in {taluka}. Choose a column to sort. / Official / Counted as / People, 2011 / Back to the map
- Station (to load) / River (placeholder lines)


---

## Phase 2 revisions (16 Oct 2026). These rules override anything above

### 1. Reviewed names only, except inside the village sheet
- **Data model:** `p.deva` and `p.romi` hold **reviewed** names only. A Konkani form nobody has checked yet (Aldona's हळदोणें, from the Gazetteer, 1979) lives in `p.devaUnreviewed`, with `status: 'review'` and `devaSource`.
- **Where the unreviewed form is shown:** only in the village sheet's name block, with SourceStatus "Needs review" and the note "Devanagari as in the Gazetteer, 1979". Search also matches it, but result rows show only the official name and status.
- **Where it is never used:**
  - **Map labels:** in the देवनागरी and Romi modes they use reviewed names; everything else falls back to the official spelling.
  - **Breadcrumb and sheet handle title:** same fallback.
  - **Page titles and `og:title`:** reviewed names only, e.g. "Aldona, Bardez | Khoim".
  - **Village list:** the देवनागरी and Romi columns stay blank and the status column says "Needs review".
  - **Share cards** (link preview, square, tall): the official name, plus "Konkani name: help us check it" when an unreviewed form exists, or "Konkani name: help us find it" when none does (as on Raia).
  - **Names we need layer:** reviewed counts as filled; unreviewed is tinted with a dashed outline.
- **When a reviewer signs off:** set `devaReviewed: true`. The form then moves into `p.deva` and appears everywhere.

### 2. No Census-derived facts until the files load
"Village or Census Town" is **To load** everywhere: the Facts grid, the sheet header (now just "Village in Bardez"), the village list and the map. Village dots are one size; they no longer grow for towns. The boundary file's `ty: 'Ct'` flag is not used as a fact.

### 3. Distances are placeholders
"about N km" to Panaji and Margao is measured on the map with an approximate scale (`KM_PER_UNIT`, `DISTANCE_IS_PLACEHOLDER = true`), and is tagged "Placeholder data". At build, compute great-circle distance from village centroid latitude and longitude, set `CENSUS[id].kmPanaji` / `kmMargao`, and the tag goes.

### 4. Meaning with several roots
`meaning.kind: 'roots'` renders one entry: "Haldona, from hal (plough) or haldi (turmeric). Two options." with one credit line. Use `differ` only when separate sources disagree (Calangute).

### 5. Sources
Every village sheet ends with a list of linked sources (`facts.sources[{ title, url }]`). Columns of a source, such as the Gazetteer's Government, Survey of India and Advisory Body spellings, are not separate sources. LGD is listed once. Source URLs: Gazetteer of the Union Territory Goa, Daman and Diu, Part 1 (1979), https://archive.org/details/dli.ministry.08183. Dr Alvarinho J. Luis, The Goan, 21 Feb 2026, https://www.thegoan.net/life-sunday/goa’s-village-names-hidden-stories-behind-them/143881.html (encode the curly apostrophe as %E2%80%99 in hrefs).

### 6. Feasts show the rule and the next date
In the sheet and in the Feasts layer: "{rule}. Next: {date}". The next date comes from `nextFeastDate(when, today)`: this year's date if it is still to come, otherwise next year's. The month filter uses the next occurrence too (`upcomingMonths`). Lunar zatras show the rule and "Lunar date, so it moves each year."

### 7. Layer contrast
- **Non-matching villages:** in Name parts and Feasts they all go to one neutral, `--map-fade` (#E4E1D9 light, #2A2721 dark), with `--map-fade-edge` borders.
- **Matching villages:** they keep their house colour and get a 1.75px `--map-lit-outline` (soot in light, chalk in dark), drawn on top.
- **Why the outline:** the outline against the fade is 14.3:1 (light) and 13.1:1 (dark), which meets the 3:1 requirement. House fills alone do not reach 3:1 against one neutral for every colour; the light houses (haldi, rose, lilac, sky, mustard) are about 1.5–2.0 on the light fade. Never remove the outline.

### 8. Sirigao (Shirgao)
Sirigao is the government and Gazetteer spelling, in Bicholim taluka. It is now a place (`vsirigao`, also written Shirgao) in `EXTRA_VILLAGES`, so the Lairai zatra appears in search, the Bicholim list and the Feasts list without "not on the map yet". **Data task for Claude Code:** Sirigao stays off the map for now. Load its LGD code and a point (or boundary) from the Local Government Directory, set `lgd` and `lp` in `EXTRA_VILLAGES`, and it lights up in the Feasts layer and carries its zatra glyph like any other village.

### 9. Video
Bandora: https://youtu.be/ho03VQfgEcg (Shree Mahalaxmi Mandir, Villages of Goa). The facade shows no YouTube image before the tap. At build, download the thumbnail once, self-host it as `facts.video.thumb`, then embed youtube-nocookie only on tap.

### 10. First visit
"Tap any taluka" shows from the end of the demo until the first tap, including the settled state and under reduced motion (Bardez stays lit, nothing moves). Once tapped it never returns (localStorage `khoim-tapped`).

### 11. Themes
Set `data-theme="light"` or `"dark"` explicitly on the root. Default to `prefers-color-scheme`; the About screen toggle overrides it.

### TODO(copy) changes
- **Added:**
  - Konkani name: help us check it
  - Village or Census Town
  - Also written {name}
  - {rule}. Next: {date}.
  - Lunar date, so it moves each year.
  - (link to add)
  - Columns of the 1970 spelling list in the Gazetteer of Goa, Daman and Diu, 1979.
  - Government spelling / Survey of India spelling / Advisory Body spelling
  - For posts. Your village in Konkani
- **Removed:** Counted as, Census town (as a fact), Town first, Two readings (for Aldona), "{place}, not on the map yet", Lunar date (as a column).

# Phase 3: the type map (live on khoim.in since 17 Oct 2026)

This section describes what is live. **Where it differs from phases 1 and 2 above, phase 3 wins.** The brief is `docs/phase3-brief.md` and the prototype `docs/prototypes/type-atlas.html` (at the repository root, outside `design/`). The reference app in `ui_kits/khoim/` and most `.jsx` references still show phase 2; for phase 3 the live code in `src/` is the reference, and this section says where to find each piece.

## What changed, in one paragraph
Goa is drawn with every village's name inside its own outline, so the map is made of names. People pan and zoom freely to read it. Three views change only the colours of the same map. Rivers are a few named, quiet lines. The strip of village cards is gone. Every place keeps its own page and address, so search, sharing and the sitemap are unchanged.

## Rules
1. **Map labels show reviewed names only**, in the script chosen in the toggle. Without one, the official spelling shows lighter (weight 500) and fainter. A Gazetteer-only form never appears on the map.
2. **One colour, one meaning, per view.** Every view that colours for meaning has a legend on the map, and each swatch is the same token the map fills with.
3. **Same framing in every view.** Switching view never moves or resizes the map, and never closes the open card. Village names, taluka names and taluka borders show in every view.
4. **The view controls are never hidden.** No sheet or card covers them. On phones a sheet stops at 40% of the screen.
5. **One count.** 384 village outlines are drawn (Curchorem-Cacora is two of them). Say 384 wherever the map counts villages; 429 where the site means all of them, with 45 not drawn yet.

## The map (`src/components/map/GoaMap.tsx`, `map.css`)
- **Villages:** filled with the taluka's tint (`--map-tint-*`), 0.6px edge in `--map-village-edge`, named in the house ink (`--map-ink-*`) at the angle and size worked out at build time (`data/scripts/labels.mjs`: long axis kept within ±55°, level under 8°, size 1.4 to 16 map units). Latin names are set 84% wide, close to the prototype's narrow Anek. A name shows once it is 7px tall on screen and fades in over the next 3px.
- **Talukas:** borders always drawn (`--map-taluka-edge` at 35%). Names large over all of Goa (15 to 30px on screen), with a page-colour halo, fading out between 1.7 and 2.9 times the Goa view, and hidden while a village is open.
- **Moving:** drag to pan; wheel, pinch or the **+ and - buttons** (48px, bottom right) to zoom around the pointer, from 0.8 to 22 times the Goa view. Some of Goa always stays on screen.
- **Opening:** tapping a village opens it. The map moves to it (it fills 55% of the free space, up to 14 times the Goa view, 650ms ease-out, none under reduced motion), outlines it in `--text` at 2.2px, keeps its neighbours named at any zoom and dims every other village to 35%. A district or taluka opened from search, the breadcrumb or a list is framed and outlined the same way. Tapping the sea puts the card away.
- **Rivers** (`scripts/map-lines.mjs`): only Mandovi, Zuari, Chapora, Terekhol, Sal, Talpona, Galgibaga, Mhadei, Kushavati, Valvanti River, Dudhsagar and Mapusa River, in OpenStreetMap's own names. `--map-water` at 75%, round caps, clipped to Goa, width in map units (weight × 0.9; the Mandovi draws about 175 m wide), never under 1px. Names (`--map-water-text`, 12px, letter-spaced, page-colour halo) follow the line past 2.2 times the Goa view. In the other views rivers and railway fade to 30% and river names go.
- **Railway:** one 1px line in `--text` at 70%. **Stations** (Wikidata) and **symbols** for feasts, monuments and GI products (white tiles, 26px) show only at village zoom, past 5 times the Goa view; the symbols only in the Names view. Neither is a button: tapping the village opens it.
- **Live layers** (Voices, Crops and the rest): white tiles with the layer's icon and a count, over each village that holds something (at village-label zoom) and each taluka (with the taluka names).
- **Credit:** "Rivers and railway © OpenStreetMap contributors", a 44px tap target, bottom right beside the zoom buttons.
- The SVG is aria-hidden. Search, the lists, the breadcrumb and the plain links on every page reach every place.

## Views (`src/lib/layers.ts`, `src/components/layers/LayerRow.tsx`, `Views.tsx`)
- A segmented row (44px), one view at a time: **Names · Spelling endings · Still unwritten**.
- **Spelling endings:** chips -im, -em, -gao, -ona, -ora with their counts, only in this view. Matching villages fill `--map-view-on` (ink) with names in `--map-view-on-text`; the rest `--map-quiet` with faint names. Line: "{n} of 384 villages end in “-{ending}” in their official spelling." Legend: "ends in -{ending}", "other villages".
- **Still unwritten:** villages with a reviewed Konkani name in either script fill `--map-written` (kokum) with names in `--map-written-text`; the rest quiet. Line: "{n} of 384 villages have a Konkani name written here. The rest still show their official spelling." Legend: "written in Konkani, {n}", "not yet, {384-n}".
- Feasts and zatras is out of the row until there are 20 or more. Population waits for Census 2011. Phase 2 links keep working: `?layer=parts&part=im`, `?layer=need`.

## Phone (390×844)
- The header floats over the map, each piece of text on the page colour: wordmark (opens About) and script toggle; once you leave the first screen, the breadcrumb with search and layers beside it; the headline "Goa, written in its own names." (28px/1.08) and the count line; the view row; the ending chips and the legend.
- In a view other than Names its line takes the headline's place. With a card open, the headline, count line and ending chips fold away; the wordmark, script toggle, views and legend stay.
- The first screen's foot: the hint "Scroll or pinch to read the villages. Tap one." (goes after the first pan, zoom or tap), "Draft for review.", then search and layers. Search opens the search screen, which lists every district and taluka as house-colour tiles before anything is typed.
- Sheets stop at 40% of the screen and scroll inside, so the map always keeps 60%.

## Desktop (1280 and wider)
- The draft banner on top, then the map filling the screen.
- A 420px panel at the top left, on the page colour, radius 16: wordmark and layers button, breadcrumb, the headline (44px), the count line, script toggle, views, search.
- The map is centred in the space to the panel's right. The open place, or search results, dock on the right: 380px, 14px from the edges, radius 18. The map re-centres in the space left between them.
- The credit line sits bottom left. A taluka's list of villages opens over the map, beside the panel, which stays in view.

## The village sheet (`src/components/village/VillageSheet.tsx`, `village.css`)
On the page colour (`--surface-raised`); the house colour is the outline.
1. "Village in {taluka}" and Close.
2. **Hero:** the outline (96px square, in `--map-ink-*`) beside the name: the reviewed form in the chosen script, else the official spelling (40px; Devanagari 38/1.5). Under it, **Official, देवनागरी and Romi** listed together, "not written yet" (italic, full ink) where empty. A Gazetteer-only Devanagari form shows only here, in the देवनागरी row, with "Needs review" and "Devanagari as in the Gazetteer, 1979".
3. **The ask**, when a script is missing: a dashed box, "**Do you know how {village} is said at home?** Record it or write it in either script, and it goes on the map with your name." It opens the contribution form (an email, with the address in plain text, where the form is off).
4. Say it and recordings, then the phase 2 blocks, each only with data: Meaning, Spellings, Vaddos, Facts (distances), Known for (with the 12-month feast strip), Video.
5. **Next to:** a 44px pill per neighbour, its name in the chosen script; tapping one opens it and moves the map there.
6. Sources (status, who added and reviewed the name, links), Boundary, Share, and "Add or correct something" (or "Suggest a correction" by email).
On phones the sheet peeks at the top two parts. Districts and talukas keep the house-colour place card; a taluka card's count button opens "See all as a list".

## New tokens (`tokens/typemap.css`)
| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--map-tint-{house}` | prototype tints, e.g. kokum #EAD6DA | e.g. kokum #3A1B25 | village fills |
| `--map-ink-{house}` | prototype inks; haldi #80600F, rose #9A3A55, mustard #8A4C12 deepened | prototype dark inks | village names, the outline on the sheet |
| `--map-village-edge` | #FFFFFF | soot-950 | between villages |
| `--map-taluka-edge` | ink-900 | chalk-100 | taluka borders, at 35% |
| `--map-water`, `--map-water-text` | #6E9FB3, #2F6478 | #4F7F93, #8EC3D6 | rivers, river names |
| `--map-quiet` | #ECEAE3 | #211E19 | villages a view does not pick out |
| `--map-view-on`, `--map-view-on-text` | ink-900, lime-100 | chalk-100, soot-950 | Spelling endings |
| `--map-written`, `--map-written-text` | #8C2E4A, lime-100 | #E07A98, soot-950 | Still unwritten |

Every village name reads at 4.5:1 or more on its own tint. The deepened light inks for haldi, rose and mustard replace the prototype's, which gave 2.6 to 3.6.

## Changed from the prototype, and why
- **Zoom buttons** added: pinching and the wheel need a one-finger, one-click alternative (WCAG 2.5.1, 2.5.7).
- **Narrow letters** are drawn by setting Latin names 84% wide: the site's fonts have no width axis. **Faint names** use weight 500, the lightest the site's fonts carry (weights 500 to 700, agreed 1 October 2026), not 300.
- **Three inks deepened** (above). **River width** follows the map's real scale, because the prototype's formula drew rivers about 1px wide over all of Goa. **Railway** fades with the rivers in the other views.
- **Stations and village symbols** wait for 5 times the Goa view, so they don't crowd a taluka.
- **Search** sits in the desktop panel with results docked right; the prototype had none.
- **Phone:** no back arrow (the breadcrumb is the way up); the view's line replaces the headline in the other views; sheets are capped at 40%; the taluka tiles moved from a bottom sheet into the search screen.
- **Pills** for the ending chips and the "Next to" buttons, as in the prototype, although phases 1 and 2 used soft squares only.
- The ask, "Next to" and the outline follow the prototype; everything phase 2 added to the sheet stays.

## New wording waiting for approval
"Zoom in" and "Zoom out" (the + and - buttons, read by screen readers), and "Map views" as the name of the view row. Everything else on screen is the approved wording in `docs/phase3-brief.md`, listed in `docs/copy.md`.

---

# Phase 4: fill the map, then fix it (live on khoim.in since 19 Oct 2026)

This section describes what is live. **Where it differs from the phases above, phase 4 wins.** The brief is `docs/phase4-brief.md`. As in phase 3, the live code in `src/` is the reference; `ui_kits/khoim/` and most `.jsx` files still show phase 2.

## Decisions (Shashank, 19 October 2026)
1. **The site opens in Official**, the spelling on signboards and in documents. A visitor's own choice is still saved (`khoim-script`).
2. **Gazetteer Devanagari stays off the map.** Phase 2 rule 6 is unchanged: village sheet only, "Needs review".
3. **One control for what the map shows**: "Show" (below).

## The data behind the map (Part A)
- **Gazetteer spellings** for 298 villages, read twice (by eye and by OCR) from the 1979 Gazetteer's spelling list, pp. 997 to 1007; only values both readings agree on. Disagreements, with crops of each line: `docs/gazetteer-disagreements.md`.
- **326 feasts, zatras and parish feasts** (`data/credited/feasts.csv`, `parishes.csv`), from the Gazetteer's Directory of Villages and Places of Interest chapter and the Archdiocese and UCA News parish lists, each rule as its source states it.
- **128 landmarks on 72 villages** (`monuments.csv`): ASI and State protected monuments, and the temples, churches, forts, springs and waterfalls the Gazetteer names.
- **Towns** (LGD codes starting with 9, matched town outlines, Municipal Council outlines) read "Town in {taluka}" and "town" in titles.
- **Other spellings for search** (Panjim, Pangim, Vasco da Gama, Madgaon, Dicholi): OpenStreetMap's Latin `alt_name`, `old_name`, `name_pt`, `name_en` (credited on the result), the Gazetteer's agreed spellings and Dr Luis's.
- **Review batch 1** (`docs/review-batch-1.csv`): every source's form of each village name on one row, for one reviewer to settle many names in one sitting. Nothing in it shows on the site until reviewed.

## The map (`src/components/map/GoaMap.tsx`, `map.css`)
Changes to the phase 3 map:
- **All of Goa** is the whole map plane (0,0 to 1000,1419.2). At the all-Goa view nothing covers land at any width from 360 to 1920: the OpenStreetMap credit moves off the map (into the phone's bottom bar, and under the desktop credit) and comes back over the map only with a card open; the desktop hint has its own room.
- **Zoom limits:** out to all of Goa (1×), in until a typical village (the median outline) fills about 60% of the map's shorter side. An open village is framed at 60% too. The map's transform is also rendered, so a redraw can never drop it to the unzoomed plane.
- **Zoom buttons** sit left of the desktop's docked card (`--map-inset-right`), never under it.
- **A village with no outline** (Sirigao) frames and outlines its taluka; its sheet says "The outline is not available yet."
- **No two names overlap, at any zoom.** After each move the map ranks every name that would show: the open village (always shown), its neighbours, taluka names while they show (a taluka name fading out gives way), village names by size on screen (reviewed names before official spellings), river names, stations, then the symbols under names. A name that would overlap one ranked above it is hidden (`is-culled`). `scripts/dev/map-audit.js` checks this.
- **River names are straight text** on each river's straightest stretch (worked out at build time: the longest chord its points stay within 2.2 map units of), 13px, shown past 2.2× the Goa view and only where the stretch is longer than the name. Light-mode ink deepened to `#1F4E60` (8.3:1, AAA).
- **Symbols are named on tap.** At village zoom, tapping a symbol shows a small label with the village and what the symbol stands for there. A **legend** at the top left of the map's free space lists the symbols and stations in view.

## Show (`src/components/layers/ShowControl.tsx`, `src/lib/layers.ts`)
Replaces the phase 3 view row and the Layers list in About.
- Choices: **Names**, **Spelling endings**, then **Feasts and zatras**, **Landmarks**, **Voices**, **Crops**, **Food**, **Music**, each with its count, offered only with **10 or more entries**. Today: Feasts and zatras 326, Landmarks 128.
- **Desktop:** the segmented row, wrapping (never scrolling), with the word "Show" in front. **Phone:** one row, "Show" and the phone's own list, so the map keeps its room.
- **Still unwritten is gone.** In देवनागरी or Romi, the Names view fills villages with a reviewed name in that script with `--map-written` (names `--map-written-text`) and the rest `--map-quiet`, with the legend "written in Konkani, {n}" / "not yet, {384-n}". Switching script plainly changes the whole map. Old `?layer=need` links open Names.
- **Feasts and zatras** and **Landmarks** fill villages that have one on file with `--map-view-on`; legend and line say how many. Choosing Landmarks also shows landmarks people sent, as tiles.
- **Spelling endings** adds a line per ending from a source in `data/credited/endings.csv` (Dr Luis, with his caution and a link): -im, -gao, -ora. **-em and -ona have no line**: no source explains them.
- Under Feasts and zatras: "All feasts and zatras, by month" (`/feasts/`). Under Spelling endings: "What the names mean, A to Z" (`/meanings/`).
- About keeps the about text, credits and how to help; it no longer has layers. The header's layers button is now an About button (info icon, "About Khoim").

## The village sheet
- **The ask** opens the contribution form for the village with the name and **the recorder** ready, whenever `/api/config` says the form is open (asked as the page opens). Email only when it is off.
- **Spellings:** a form two sources share shows once, "Government spelling and Survey of India spelling".
- **Distances** to Panaji and Margao come last, after Meaning, Spellings, Known for and Video.
- A feast whose rule names no month shows its rule as written, with no month strip.
- **Desktop:** with a place open the panel keeps the breadcrumb and controls and drops the headline and count line.

## Findable without the map
- **Search** also finds feasts and zatras, parishes, landmarks and rivers, each saying what and where ("Lairai jatra · Feast in Sirigao, Bicholim"; "Mandovi · River in Bicholim and Tiswadi"), and other spellings ("Panaji · … · Also written Panjim (© OpenStreetMap contributors)"). Spaces do not count (Dudhsagar finds Dudh Sagar).
- **`/feasts/`**: by month, this month first; lunar dates under "Lunar date, moves each year" with the rule as the source gives it. **`/meanings/`**: A to Z. Both in the sitemap, linked from About and from Show.

## Google
- A village or town page is indexable with **one** sourced fact beyond its official name (meaning, feast, parish, landmark, product, video, vaddo list, or a Gazetteer spelling differing from the official one): 332 of 454.
- Titles and descriptions name the meaning or main feast: "Sirigao, Bicholim, Goa: Lairai jatra and village facts | Khoim".
- The sitemap's date for a village is the last change to its own rows (LGD list, credited files, Gazetteer columns).

## Tokens
`tokens/typemap.css`: `--map-water-text` light is now `#1F4E60` (was `#2F6478`, 6.0:1). Everything else unchanged; Feasts and zatras and Landmarks reuse `--map-view-on`, the script view reuses `--map-written`.

## Wording (approved 19 October 2026, `docs/phase4-copy-approved.md`; listed in `docs/copy.md`, Phase 4)
- **Show:** "Show"; counts beside choices; "{n} of 384 villages have a feast or zatra on file. Tap one to see when."; "{n} of 384 villages have a temple, church, fort or other landmark on file."; legends "feast or zatra on file, {n}", "landmark on file, {n}", "not yet, {n}"; links "All feasts and zatras, by month", "What the names mean, A to Z".
- **Map legend:** "Church or church feast", "Zatra, fair or festival", "Festival on the water", "Temple, mosque or monument", "Fort", "Spring or waterfall", "GI product", "Railway station".
- **Search:** "Feast / Parish / Landmark / River in {where}"; "{n} places and {m} other matches"; "Also written {spelling} ({source})".
- **Towns:** "Town", "Town in {taluka}", "is a town in", "town facts"; the village table says "Town" too.
- **Phone legend:** a "Key" button (read out as "Key to the map").
- **Endings:** the frame "In {village}, … ({caution}). {credit}, {date}."
- **Titles:** "name meaning and village facts", "{feast} and village facts"; descriptions "Name meaning: {reading}." and "Known for {feast}, {date}."
- **Pages:** /feasts/ and /meanings/ titles, intros and section headings; About's links to them.
