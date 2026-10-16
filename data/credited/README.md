# Credited and hand-built data

Facts that come from someone else's work, or that we put together by hand. Nothing here is on the site yet: the phase 2 village sheet will read these files. The plan is in `docs/phase2-brief.md` (A3).

## Rules
- **Joined on codes.** `village_code` is the LGD village code. Every match here was made by name, so each row stays `checked=no` until Shashank confirms it. A row only shows on the site once it says `checked=yes`.
- **Blank code = not matched yet.** `match_note` says why: no LGD village by that name, or more than one. These are never guessed.
- **Our words, with credit.** `origin` is our summary. The author's prose is never copied. Every row keeps author, publication, date and link so the site can credit it.
- **Hedges are kept.** `hedge` is the source's own caution ("believed", "legend", "one theory"). The site shows it with the origin.

## Files
| File | What | Source and licence |
| --- | --- | --- |
| `origins_luis_2026.csv` | Where village names come from | Dr Alvarinho J. Luis, The Goan (2026), and the Gazetteer of the Union Territory Goa, Daman and Diu, Part 1 (1979). Facts restated in our words, credited. |
| `videos_villages_of_goa.csv` | Videos about villages | YouTube channel Villages of Goa (@Villages_of_Goa). Linked and credited, never copied. |
| `gi_products.csv` | Geographical Indication products | GI Registry, search.ipindia.gov.in |
| `stations_wikidata.csv` | The 23 railway stations in Goa | Wikidata (CC0). `osm_check` compares each with OpenStreetMap. |
| `wikidata_units.csv` | Wikidata IDs for Goa, districts, talukas | Wikidata (CC0) |
| `monuments.csv` | Protected monuments | ASI and state lists, transcribed by hand (empty for now) |
| `parishes.csv` | Parishes and their feast rules | UCA News parish directory |
| `feasts.csv` | Feasts and zatras, with the rule that sets the date | Gazetteer 1979 and other sources named per row |

The build stops if a `village_code` here is not in `data/villages_lgd.csv`.
