# Khoim phase 4 polish

A short round after phase 4, from a check of khoim.in on 19 October 2026. Everything in `CLAUDE.md` and `docs/phase4-brief.md` still applies, including the merge rule. One PR per numbered step, in this order.

## 1. The document pages look like the site
`/feasts/`, `/meanings/`, `/contributors/` and `/privacy/` (check each) currently show browser-default blue links with text running to the screen edge on a phone. Make them match the site:
- the site's page colour, type and tokens, in light and dark;
- a 16 px side gutter on a phone and a reading width of about 680 px on desktop;
- a header with the Khoim wordmark linking home, and "Back to the map";
- links in the site's ink, underlined, never browser blue;
- on `/feasts/`, the months as a row of buttons that jump to each month, with the current month first;
- each entry laid out as: the name, then the village (a link) and the date, then the source in small type.

The contrast audit must cover these pages.

## 2. A phone village view with room for the map
On a phone at 390x844 with a village open, at least 45% of the screen must show map that nothing covers. Today it is about a third. Measure it in `scripts/dev/map-audit.js`.
- **Legend:** on a phone, it folds into a button labelled "Key" (accessible name "Key to the map"), which opens it over the map and closes on a tap elsewhere. Desktop is unchanged.
- **OpenStreetMap credit:** on a phone with a sheet open, it moves to the bottom of the sheet. It still appears wherever map lines show, as now.
- **Overlays:** no symbol, name or tile is ever drawn under the header, breadcrumb, Show control, zoom buttons or sheet. Today a feast symbol sits over the wordmark on Aldona's page. Treat those areas the way names already treat each other.

## 3. Symbols that belong to a name
- At village zoom, a village's symbols sit in one row just under its name. If the name is hidden in a clash, its symbols hide with it, so no symbol floats on its own.
- Towns and taluka headquarters (Panaji, Margao, Mapusa, Vasco da Gama's place, Ponda and the rest) rank above other villages in clashes. Panaji's name is hidden at the Tiswadi view today, and the capital must always show.

## 4. Old Goa is Ella
Shashank's decision, 19 Oct 2026: the 14 protected monuments in Old Goa (Bom Jesus, Se Cathedral and the rest) go on Ella's page. The State's own list files them under Ella, and the Gazetteer puts the St Francis Xavier feast there too. Set `match_note` to "Old Goa lies in Ella; the State list files it there". Make "Old Goa" and "Velha Goa" search aliases for Ella, with that list as their source.

## 5. Wording
Apply `docs/phase4-copy-approved.md`.

## Done means
- All five PRs are merged and checked on khoim.in, at 390x844 and 1440x900, in light and dark.
- `scripts/dev/map-audit.js` passes: no overlapping names, and nothing drawn under an overlay. With Aldona, Panaji and Sirigao each open on a phone, at least 45% of the screen shows map.
- `scripts/dev/contrast-audit.js` passes, the document pages included.
- No `TODO(copy)` markers remain except for wording added in this round, which goes in your summary.
- Searching "Old Goa" opens Ella, and Ella's sheet lists Bom Jesus.
- Finish with a short plain-English summary for Shashank: what changed (with pages to look at), anything unmerged and why, and any new wording. No jargon, no em dashes.
