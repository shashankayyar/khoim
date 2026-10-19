# Credited and hand-built data

Facts that come from someone else's work, or that we put together by hand. Nothing here is on the site yet: the phase 2 village sheet will read these files. The plan is in `docs/phase2-brief.md` (A3).

## Rules
- **Joined on codes.** `village_code` is the LGD village code. Every match here was made by name, so each row stays `checked=no` until Shashank confirms it. A row only shows on the site once it says `checked=yes`.
- **Blank code = not matched.** `match_note` says why: no LGD village by that name, more than one, or a locality. These are never guessed.
- **Localities are not villages.** Ashwem, Baga, Dona Paula, Banastarim, Ribandar and Agassaim are places inside a village. Their origins and products are about the locality's own name, so they are never attached to the village. `locality_of` holds the village's LGD code where known, for a later localities layer.
- **Pages without an LGD code.** `place_id` points at a page that has no LGD code, such as the Mapusa town page (a Survey of India outline).
- Matches confirmed by Shashank on 16 October 2026 are in `docs/phase2-decisions.md`. Rows whose `match_note` says "keyed by LGD code in the phase 2 design data" came from `design/components/data/villageFacts.js`, which already joins on the code.
- **On the site:** the village sheet reads every `checked=yes` row (`scripts/village-facts.mjs`). The Gazetteer columns of `data/village_names_review.xlsx` (`gazetteer_government`, `gazetteer_soi`, `advisory_body_form`, `gazetteer_devanagari`, `gazetteer_page`) show as the village's spellings; the Devanagari form is marked "Needs review" and appears on the sheet only. They were read from the Gazetteer's spelling list (pp. 997 to 1007) twice, by eye and by OCR, and only values both readings agree on were kept (`data/scripts/gazetteer/README.md`, `docs/gazetteer-disagreements.md`).
- **Our words, with credit.** `origin` is our summary. The author's prose is never copied. Every row keeps author, publication, date and link so the site can credit it.
- **Hedges are kept.** `hedge` is the source's own caution ("believed", "legend", "one theory"). The site shows it with the origin.

## Files
| File | What | Source and licence |
| --- | --- | --- |
| `origins_luis_2026.csv` | Where village names come from | Dr Alvarinho J. Luis, The Goan (2026), and the Gazetteer of the Union Territory Goa, Daman and Diu, Part 1 (1979). Facts restated in our words, credited. |
| `videos_villages_of_goa.csv` | Videos about villages | YouTube channel Villages of Goa (@Villages_of_Goa). Linked and credited, never copied. |
| `gi_products.csv` | Geographical Indication products | GI Registry, search.ipindia.gov.in |
| `stations_wikidata.csv` | The 23 railway stations in Goa | Wikidata (CC0). `osm_check` compares each with OpenStreetMap. Wikidata's points are kept even where they differ: Kalem is about 500 m from OpenStreetMap's point, which does not show at map scale, and Marmagao (MRH) is missing from OpenStreetMap as a station (checked 16 October 2026). |
| `wikidata_units.csv` | Wikidata IDs for Goa, districts, talukas | Wikidata (CC0) |
| `monuments.csv` | Protected monuments | ASI and state lists, transcribed by hand (empty for now) |
| `parishes.csv` | Parishes and their feast rules | UCA News parish directory |
| `feasts.csv` | Feasts, zatras and festivals, with the rule that sets the date. `kind` (zatra, festival) and `icon` pick the glyph. Rules the build reads: "24 June", "third Saturday after Easter", or a lunar date such as "Vaishakh Shuddh Panchami" with `calendar` = lunar (shown with its months only, never a day). | Gazetteer 1979 and other sources named per row |
| `vaddos.csv` | Vaddos of a village, one per row. Shown as a list, never as shapes. | Named per row (CEO Goa electoral roll for Parra) |

The build stops if a `village_code` here is not in `data/villages_lgd.csv`.
