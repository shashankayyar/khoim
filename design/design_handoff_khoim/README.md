# Handoff: Khoim (खंय), the Konkani place-names map of Goa

## Overview
Khoim ("where" in Konkani) is a non-profit, mobile-first web app. It is an interactive map of Goa that shows each place's Konkani name in Devanagari and Romi next to its official spelling, with a rough guide to saying it. The map is the whole site: tap a place to see its names, tap again to go inside (Goa → district → taluka → village). It must work well on cheap Android phones and slow networks, meet WCAG 2.2 AAA, and grow into later layers (voices, crops, food, music, landmarks).

## About the design files
The files in this project are **design references built in HTML/React (in-browser Babel)**. They show the intended look and behaviour; they are not production code. Recreate them in the target stack. With no codebase yet, we suggest **Vite + React + TypeScript**, plain CSS with the provided custom properties (no CSS-in-JS), static JSON data and a service worker for offline use. Keep the SVG map approach (no WebGL, no map tiles).

## Fidelity
**High fidelity.** Colours, type, spacing, radii, motion and copy are final for this phase. Match them exactly, using the tokens in `tokens/`.

## Where things are (paths from the project root)
Download the whole project; this folder is its entry point. Serve the project root (e.g. `npx serve`) and open `ui_kits/khoim/index.html` to click through every state. `readme.md` at the root is the full design guide.

- `styles.css` → `tokens/fonts.css`, `tokens/base.css`, `tokens/themes.css`, `tokens/elements.css`. **Copy these as-is.**
- `components/**/X.jsx` + `X.d.ts` (props contract) + `X.prompt.md` (usage notes). These are reference implementations of every component.
- `components/data/`: `places.js` (names), `goaGeo.js` (boundaries), `khoim.js` (lookups, search, spoken names, house colours, layers). Turn these into JSON plus a small TS module.
- `ui_kits/khoim/`: the full app. `index.html` has buttons for every state, phone and desktop, light and dark. `state.jsx` holds the state machine, `Screens.jsx` the phone and desktop layouts, `More.jsx` the About/Layers/Help screen.
- `guidelines/accessibility.md`: the AAA checklist and every contrast figure.
- `assets/lucide/`: the 22 icons used (Lucide, ISC). `assets/names_districts_talukas.csv`, `assets/goa-map*.svg`: source data.

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
