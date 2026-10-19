# Phase 4 wording: approved 19 Oct 2026

Shashank delegated this review. Everything listed under "New wording waiting for approval" in the phase 4 section of `design/design_handoff_khoim/README.md`, and every `TODO(copy)` in `src/` today, is approved as written, except for the changes below. Apply them, remove the `TODO(copy)` markers, and add the approved strings to `docs/copy.md` under a "Phase 4" heading.

## Changes
1. **Town label in the village table** (`VillageTable.astro`): "Census Town" becomes "Town", the same word the sheet, titles and search use.
2. **Page descriptions** (`src/data/seo.ts`): "The name: {reading}." becomes "Name meaning: {reading}."
3. **/feasts/ intro**: "{total} feasts, zatras and parish feasts, each with its village. A date that follows the moon is listed under its lunar month, as the source gives it." Drop the rest of the sentence, because each entry already names its source.
4. **Phone legend button** (new in the polish brief): "Key". Its accessible name is "Key to the map".

## Approved as written (for the record)
- Show: "Show", counts beside each choice, the Feasts and Landmarks lines and legends, "All feasts and zatras, by month", "What the names mean, A to Z".
- Map legend: "Church or church feast", "Zatra, fair or festival", "Festival on the water", "Temple, mosque or monument", "Fort", "Spring or waterfall", "GI product", "Railway station".
- Search: "Feast / Parish / Landmark / River in {where}", "{n} places and {m} other matches", "Also written {spelling} ({source})".
- Towns: "Town", "Town in {taluka}", "is a town in", "town facts".
- Endings frame: "In {village}, … ({caution}). {credit}, {date}."
- Titles: "name meaning and village facts", "{feast} and village facts", "Known for {feast}, {date}."
- Pages: the /feasts/, /meanings/ and /contributors/ titles and headings; About's links to them.
- Older markers still open from earlier phases: "More" / "Less", "Share", "Share {place}", "Share this view", "Villages in {taluka}", "Back to the map", "Zoom in", "Zoom out", "Contributors", "Konkani name: help us check it" / "help us find it".
