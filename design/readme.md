# Khoim (खंय) design system

**Khoim** means "where" in Konkani. It is a non-profit, mobile-first map of Goa that shows how Goan places are really named and said: the official Portuguese-era spelling (Canacona) next to the Konkani name people use (काणकोण, Kannkonn in Romi). Formerly drafted as "Goem".

Design direction: **painted houses. Frozen 30 Sept 2026.** Goa is drawn as a street of lime-washed houses. Each taluka has a house colour, and white trim runs between them, like the trim round Goan windows and pilasters. Tapping a place brings up its names on that colour, inside a white trim frame.

Credit (verbatim): *Khoim is a non-profit initiative by Pangolin Marketing. Boundaries and official names: Local Government Directory, Government of India.*

## Product
- **The map is the site.** Tap once to select and see names. Tap again to go inside. Press and drag along Goa to scrub; a loupe shows the name under your finger.
- **Levels:** Goa, 3 districts (North Goa, South Goa, Kushavati), 12 talukas, 384 villages (LGD, 37 village polygons from Survey of India).
- **Place card order (fixed):** Devanagari (largest), Romi, official spelling; then say it, sources, details.
- **Script toggle:** Official / देवनागरी / Romi. Remembered.
- **Search** in any script.
- **Layers, future:** Voices (next), then Crops, Food, Music, Landmarks. Built as `LayerSwitch` + `VoiceClip`, with data in `KhoimData.LAYERS`.
- **Audience:** Goans everywhere including the diaspora, people moving to Goa, and Konkani scholars, archivists and musicians invited as collaborators.

## Sources given
- `uploads/BRIEF.md`: original brief. `uploads/Goem References.html`: reference wall (Gaelic Place-Names, Te Aka, Gambay, Local Contexts, Radio Garden, Native Land, Berliner Straßennamen, India Street Lettering, PARI, Indian Memory Project, The Pudding, MAP Bengaluru).
- `uploads/names_districts_talukas.csv` (copied to `assets/`): names, LGD codes, say-it drafts, sources.
- `uploads/geo.prototype.json`: boundaries with label points; the source of `components/data/goaGeo.js`.
- `uploads/goem-draft.html`: the live draft. Its copy (About, sources, scripts, help, roadmap), statuses and data fields are carried over verbatim.
- `uploads/goa-map.svg`, `goa-map-talukas.svg` (copied to `assets/`).
- No logo exists. The wordmark is type.

## CONTENT FUNDAMENTALS
- Short, plain Indian English, as if a person from Goa typed it. Sentence case. No exclamation marks, no emoji, no em dashes.
- "You" only when asking ("Know what Raia is called in Konkani? Tell us how your family says it."). "We" when owning a gap ("We are waiting for the Directorate of Official Language to confirm it.").
- Honest states are content: "Rough guide, retroflex t. Not yet checked by a speaker." / "Official name only" / "Konkani name not recorded yet" / "No recordings yet."
- Instructions: "Scroll or pinch to read the villages. Tap one." (phase 3; it replaced "Tap a district, or press and drag along Goa.") "Search any name, any script." "Type a name the way you know it. Official spelling, देवनागरी or Romi all work."
- Never: vibrant, rich heritage, nestled, journey, discover; sets of three adjectives; invented names, spellings, pronunciations or speakers. UI copy is English; Konkani UI strings wait for reviewers.

## VISUAL FOUNDATIONS
- **Colour.** (Phase 3: on the map, villages use `--map-tint-*` fills and `--map-ink-*` names; see `tokens/typemap.css`. The district colours below are no longer drawn on the map.) Nine Goan house colours (`--house-*`): haldi yellow, kokum, rose, Portuguese green, red oxide, lilac, sky, neel, mustard. Each is tuned so its ink (`--house-*-on`, soot or white) reads at 7:1 or better. Dimmed map areas use precomputed tints (`--map-*-dim`), not opacity. Neutrals are lime-wash white (`--lime-*`) and soot (`--ink-*`, `--soot-*`). No gradients.
- **Taluka to house:** Pernem, Quepem haldi · Bardez kokum · Tiswadi, Canacona rose · Bicholim, Sanguem green · Sattari oxide · Ponda lilac · Mormugao sky · Salcete neel · Dharbandora mustard. Districts: North Goa green, South Goa neel, Kushavati oxide. Villages take their taluka's colour.
- **Trim.** 2px white (`--trim`) between talukas on the map. On any house surface, a 2px frame in the ink colour sits 6px inside the edge.
- **Type.** Anek, one design in two scripts: Anek Devanagari and Anek Latin, weights 500/600/700 only. Devanagari line height ≥1.5, never letter-spaced. Romi is upright and full ink, never italic or grey. Title 29/1.15 at −0.01em (Latin only).
- **Space.** 4px base. Gutter 20px. Tap targets 48px, minimum 44px.
- **Corners.** Soft squares: 4 / 8 / 12 / 16 / 20, sheets 28. Never pills.
- **Elevation.** Warm low shadows (`--shadow-1..3`, `--shadow-sheet`). No blur effects, no glass.
- **Backgrounds.** Flat surfaces. The map is the only image. No photos, textures or illustrations.
- **Motion (subtle, from Goan life).** Repaint on first load (north to south, 60ms stagger, 700ms wipe). Zoom inside with one FLIP transform (600ms). Sheets 480ms, follow the finger. Say-it beats at 420ms, like a ghumot. Missing names breathe in an oyster-shell window (4.2s). Press to 97% in 140ms. Easing `--ease-standard` cubic-bezier(.32,.72,0,1) and `--ease-out` cubic-bezier(.22,1,.36,1). No bounce. Everything is zeroed under `prefers-reduced-motion`.
- **States.** Press: scale 0.97. Focus: two rings (surface 2px, then ink to 5px). Selection on the map: full house colour while everything else goes to tint. Disabled: dashed border, label never dimmed.
- **Layout.** Phone: no header bar; wordmark top left, script toggle top right, breadcrumb with search and layers under them once you leave the first screen, search at the bottom of the first screen in thumb reach, sheets from the bottom that never take more than 40% of the screen. Desktop (phase 3): the map fills the screen; a 420px panel at the top left (wordmark, breadcrumb, headline, count line, script toggle, views, search); the open place or search results docked on the right; draft banner on top.
- **The type map (phase 3).** Every village is filled with its taluka's tint and named inside its outline in that house's ink (`tokens/typemap.css`); names show once 7px tall, taluka names fade as you zoom in. Pan and zoom freely; + and - buttons for anyone who cannot pinch. Map labels show reviewed names only; otherwise the official spelling, lighter and fainter. Views change colours only, and every coloured view has a legend in the same tokens. Rivers are a few named, quiet water lines. Pills appear only for the ending chips and the "Next to" buttons, as in the phase 3 prototype; everything else keeps soft squares.
- **Dark.** `[data-theme="dark"]`: soot surfaces, same house colours, dark tints, soot trim.

## ICONOGRAPHY
- Lucide (ISC), 22 icons copied into `assets/lucide/` and inlined in `components/core/iconPaths.js`. 24px grid, 2px stroke, round caps, currentColor. Use `Icon` / `IconButton`.
- Icons sit next to a word, or inside an IconButton with a label. Layer icons: languages, mic, wheat, soup, music, landmark.
- No emoji, no pins, no icon fonts, no drawn illustrations. Future layer marks on the map: small white trim tiles with the layer icon.

## Index
- `styles.css`: imports only. `tokens/fonts.css`, `tokens/base.css` (raw values), `tokens/themes.css` (semantic, light and dark, reduced motion), `tokens/elements.css` (focus, placeholder, keyframes).
- `components/`: see below. `components/data/`: `places.js`, `goaGeo.js`, `khoim.js` (`KhoimData`: lookups, search, spoken names, houses, layers, `SITE`).
- `guidelines/`: foundation cards and `accessibility.md`.
- `ui_kits/khoim/`: the app, phone and desktop, all states, light and dark.
- `assets/`: maps, CSV, `lucide/`.
- `design_handoff_khoim/`: the Claude Code handoff package.
- `SKILL.md`, `thumbnail.html`.

## Components
- core: **Wordmark**, **Icon**, **Button**, **IconButton**, **ScriptToggle**, **SourceStatus** (agree, differ, pending, review), **DraftBanner**, **Credit**
- map: **GoaMap** (layers, neighbour labels, river and rail lines, glyph tiles)
- nav (phase 2): **Breadcrumb**, **LayerRow**, **TapHint**
- place: **Sheet** (with place name in the handle row), **PlaceCard**, **SayIt**, **PendingName**, **PlaceStrip**
- village (phase 2): **VillageSheet**, **MeaningBlock**, **NameSplit**, **SpellingTimeline**, **VaddoList**, **VillageFacts**, **PopulationDots**, **KnownFor**, **FeastStrip**, **VideoFacade**, **DataPending**, **VillageTable**
- layers: **LayerSwitch**, **VoiceClip**, **LayerPanel** (phase 2), **MonthSlider** (phase 2)
- search: **SearchField**, **SearchResults**
- share (phase 2): **ShareSheet**, **ShareCard**, **Toast**

### Intentional additions
- `KhoimData` (not a component): one place for names, fallbacks, search and spoken labels.

## Phase 2 (16 Oct 2026)
Village facts, map layers, clearer touch cues, sharing. Same tokens, fonts and house colours. New tokens in `tokens/layers.css`. Verified content lives in `components/data/villageFacts.js`; nothing there is unsourced. Census 2011, PIN, panchayat, station, river and railway geometry are marked placeholders (TODO(data)). Full spec in `design_handoff_khoim/README.md`. Rule: unreviewed Konkani names (p.devaUnreviewed) appear only in the village sheet name block, labelled "Needs review"; maps, cards, titles and lists use reviewed names only.

## Open items
- Say-it guides are all unreviewed drafts. Dharbandora's Konkani is pending. Pernem and Kushavati have no Romi.
- Village Konkani names, recordings and all future layers have no data yet.
