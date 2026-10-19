# Review batch 1: village names

`docs/review-batch-1.csv` puts what every source says about each village's name on one row, so that one reviewer can settle many names in one sitting. It has one row per village or town in the government list (429), sorted by taluka. Rebuild it with `python3 data/scripts/review/batch.py`.

Nothing in this file is on the site. A name goes on khoim.in only when a reviewer has written it into `data/villages_lgd.csv` (`konkani_deva`, `romi`, `say`, `reviewer`, `reviewed_on`), in a pull request, as CLAUDE.md describes under "Onto the site".

## The columns
| Column | What it is |
| --- | --- |
| taluka, official, lgd_code | The government list (LGD). |
| kind | `town` for a town code (starting with 9, or matched to a Survey of India town outline), `village` otherwise. |
| konkani_wikipedia | The Konkani Wikipedia article's title (135 villages). A candidate, not a checked name. |
| gazetteer_government, gazetteer_soi, advisory_body_form, gazetteer_devanagari, gazetteer_page | The 1979 Gazetteer's spelling list, only where two readings agreed (`docs/gazetteer-disagreements.md` has the rest). The Devanagari follows the 1970 Advisory Body's spelling, which leans Marathi. |
| luis_spelling | Dr Alvarinho J. Luis, The Goan, 2026. |
| osm_name_gom (ODbL) | OpenStreetMap's `name:gom`, only where an OpenStreetMap place has the village's own name and lies inside it. © OpenStreetMap contributors, ODbL: keep this column separate and credited if it is ever reused. |
| reviewer_devanagari, reviewer_romi, reviewer_say_it, reviewer_initials, reviewer_note | Empty, for the reviewer. Two rows (already reviewed) show what is on the site now. |

## How to use it
1. Open the CSV in a spreadsheet, filter to one taluka.
2. For each village you know, write the name as it is said at home in either script or both, a say-it guide if you like, and your initials. Leave a column empty rather than guess, and never work one script out from the other.
3. Send the file back (hello@khoim.in), or let Claude read it from this folder. Each filled row is then copied into `data/villages_lgd.csv` with the reviewer's name and the date, and shows on the map after the pull request is merged.
