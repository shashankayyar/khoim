# Khoim phase 2: build brief for Claude Code

Phase 1 is live at khoim.in. Phase 2 adds village facts, credited sources, search fixes, map layers and sharing. The phase 2 screens are final in Claude Design (Goem Design System). **Part A starts now. Part B waits until Shashank replaces `design/` with the phase 2 export**; its `design/design_handoff_khoim/README.md` will then have a phase 2 section, and that is the spec for Part B. All rules in `CLAUDE.md` still apply, including DEPLOY: branch, PR, preview link to Shashank, never merge yourself. Where this brief and `CLAUDE.md` differ on phase 2 work, this brief wins.

## New rules for phase 2
1. **Joins on codes only.** LGD village code and Census 2011 code. Anything matched by name (credited sources below) goes into a mapping file with the LGD code filled in and checked by hand; ambiguous matches are listed for Shashank, never guessed.
2. **Facts in our words, with credit.** Every fact from a person's work shows author, publication, date and link. Never copy their prose.
3. **Uncertainty is shown.** Each origin carries its source's own hedge ("believed", "one theory", "legend", "local tradition"). One source alone never shows "Sources agree". Where sources disagree, show both.
4. **Census figures always say "Census 2011".** Census Towns use the Town Directory, villages the Village Directory. Label which a place is, but only once the Census files are loaded; until then the field shows "To load".
5. **Dates that move are stored as rules** (for example "Vaishakh Shuddh Panchami", "third Saturday after Easter") and shown with the next computed date beside them.
6. **Gazetteer Devanagari shows only on the village sheet, labelled.** It follows 1970 Marathi-leaning spelling. On the sheet it appears with the "Needs review" status and the note "Devanagari as in the Gazetteer, 1979". It never appears in map labels, page titles, descriptions, JSON-LD, the village list's Konkani column, link previews or save-image cards; those use reviewed names only, and otherwise the official name. A Gazetteer-only name does not count towards the indexing rule in A1.
7. Distance is straight-line from our shapes, labelled "straight-line". Villages without a shape get none.

## Part A: start now

### A1. Indexing
- A place page is indexable only if it has a reviewed Konkani name or at least two sourced facts beyond the official name. All others get `<meta name="robots" content="noindex">` and are left out of `sitemap.xml`. Never block them in robots.txt.
- Generate `sitemap.xml` at build with `lastmod` from the date each page's data last changed (from git history of the data files), not the build date.
- Report how many pages are indexable after each data PR.

### A2. Data pipeline
Shashank will add these to `data/raw/` (captcha downloads; don't try to fetch them):
- LGD: Village to Gram Panchayat mapping; Pincode to Village mapping; urban villages mapped to urban local bodies.
- Census 2011: Village Amenities CSVs for North Goa (585) and South Goa (586); Town Directory; Primary Census Abstract.

Build `data/scripts/build_facts.py`:
- Joins on LGD village code, and on Census 2011 code via LGD's census code column (check `data/raw/lgd_all_villages_goa_2026-09-30.xlsx` has it).
- Outputs `data/build/village_facts.json` keyed by LGD code: panchayat, PIN, population, households, place type (village or Census Town), nearest town and distance as reported in 2011, straight-line distance to Panaji and Margao, nearest railway station.
- Runs without failing when a source file is missing, and writes `data/build/coverage.md`: rows matched, unmatched, and blanks per field.
- Before using the Census files, print their column names in the PR description so Shashank can confirm we read the right fields.
- Sirigao (also written Shirgao, Bicholim) has no shape or point in our boundary file. Find its LGD code and add a point so its feast can show on the map; list any other village in the same situation.

### A3. Credited and hand-built datasets
Create these CSVs in `data/credited/` from the tables at the end of this brief, plus a `village_code` column you fill from LGD and mark `checked=no` until Shashank confirms:
- `origins_luis_2026.csv`
- `videos_villages_of_goa.csv`
- `gi_products.csv`
- `stations_wikidata.csv`: the 23 Goa railway stations with code and coordinates from Wikidata (CC0). Check each against OpenStreetMap and list any that differ.
- `wikidata_units.csv`: QIDs for Goa, districts, talukas.
- `monuments.csv`: empty with headers (name, village, village_code, protection, source_url). Shashank will transcribe the ASI and state lists.
- `parishes.csv`: headers (parish, patron, feast_rule, village_code, source). First row: St Thomas, Aldona, "third Saturday after Easter", UCA News directory.
- `feasts.csv`: headers (name, village, village_code, rule, calendar, source). First row: Lairai zatra, Sirigao (Shirgao), Bicholim, "Vaishakh Shuddh Panchami", lunar, Gazetteer 1979 pp. 847-48.

Source links to use in credits:
- Gazetteer of the Union Territory Goa, Daman and Diu, Part 1 (1979): https://archive.org/details/dli.ministry.08183
- UCA News parish directory: https://www.ucanews.com/directory/parishes-stations/india-goa-daman/18

### A4. Review sheet
Add columns to `data/village_names_review.xlsx`: `gazetteer_devanagari`, `advisory_body_form`, `gazetteer_page`, `luis_spelling`. Pre-fill `luis_spelling` from the origins table. Leave Gazetteer columns empty for manual transcription. Display: reviewed rows go everywhere; Gazetteer-only rows show on the village sheet only, as in rule 6.

### A5. Taluka and district pages as village lists
- Each taluka page and the Kushavati page carry a full, server-rendered table of their villages: official name, Konkani names where reviewed (PendingName otherwise), population (Census 2011), panchayat, village or Census Town. Sortable on the client, readable without JavaScript.
- Use existing tokens and table styles until the phase 2 design lands, then switch to its VillageTable component. New UI text gets `TODO(copy)`.

### A6. SEO technical
- Unique `<title>` and description per page, built from that page's facts. Pattern for a reviewed place: "[Official] ([Devanagari], [Romi]): Konkani name, how to say it | Khoim". Pattern for any other place: "[Official], [taluka], Goa: village facts | Khoim". Confirm the final wording with Shashank in the PR.
- JSON-LD per page: `Place` for villages, `AdministrativeArea` for talukas and districts, with `alternateName` values tagged `gom-Deva` and `gom-Latn` (reviewed names only), `containedInPlace`, `geo` from our shapes, `sameAs` to Wikidata where we have a QID. `BreadcrumbList` on every place page. `WebSite` with name "Khoim" on home.
- Every place reachable through plain `<a>` links from district to taluka to village, never only through the map.
- No hreflang.

### A7. Preview cards
Build-time generation of one Open Graph image per place (static PNG, no server), referenced from `og:image`. Plain placeholder layout until the phase 2 design lands, then its ShareCard. Reviewed names only (rule 6); a place without one gets the official name and "Konkani name: help us check it". Check Devanagari renders joined in the generated PNGs (साश्टी, म्हापशें, धारबांदोडें).

## Part B: after `design/` is updated
Build exactly what the phase 2 `design/` shows. Expected:
- Village sheet order and visuals: name split, spellings timeline, population dot strip, 12-month feast strip, sources with links.
- Village-level map: labelled neighbours, rivers and railway (OpenStreetMap, ODbL, kept as a separate attributed layer), drawn glyphs for monument, GI product, feast.
- Layers: Name parts, Feasts and zatras (month slider), Names we need, Population. Non-matching villages fade to neutral and matching ones keep a dark outline.
- First-visit hint ("Tap any taluka"), pressed states, peeking sheet, breadcrumb.
- Sharing: Web Share API with copy-link fallback; preview card; "My village in Konkani" square and 9:16 images; shareable layer URLs.
- YouTube embeds from `videos_villages_of_goa.csv`, loaded only on tap (thumbnail stored at build, no YouTube request before the tap), credited to the channel.
- Contributors page, and credit lines on recordings: "Said by [name], [village]".
- Placeholders in the design ("To load", "Placeholder data") are replaced by real data from `village_facts.json`; where data is still missing, the block is hidden, not shown as a placeholder.

## Suggested PRs
1. A1 indexing and sitemap
2. A3 credited CSVs and A4 review sheet columns
3. A2 data pipeline (after Shashank adds the raw files)
4. A5 taluka and district lists
5. A6 SEO and A7 preview cards
6. Part B, in pieces

## Data for A3

### Origins: Dr Alvarinho J. Luis, "Goa's village names: hidden stories behind them", The Goan (Life Sunday), 2026
Credit line: "Dr Alvarinho J. Luis, The Goan, [date]". The series names no sources. Gazetteer = Gazetteer of the Union Territory Goa, Daman and Diu, Part 1 (1979).

Part URLs:
- P1, 21 Feb 2026: https://www.thegoan.net/life-sunday/goa’s-village-names-hidden-stories-behind-them/143881.html
- P2, 1 Mar 2026: https://www.thegoan.net/life-sunday/hidden-stories-behind-goas-villages2/144260.html
- P3, 15 Mar 2026: https://www.thegoan.net/life-sunday/hidden-stories-behind-goas-villages-3/145013.html
- P4, 28 Mar 2026: https://www.thegoan.net/life-sunday/goas-village-names-hidden-stories-behind-them-4/145723.html
- P5, 24 May 2026: https://www.thegoan.net/life-sunday/from-margao-to-maina-stories-of-goa’s-heritage-villages/148636.html
- P6, 2 Aug 2026: https://www.thegoan.net/life-sunday/goa’s-village-names-hidden-stories-behind-them/152075.html
- P7, 16 Aug 2026: https://www.thegoan.net/life-sunday/goa’s-village-names-hidden-stories-behind-them/152750.html
- P8, 30 Aug 2026: https://www.thegoan.net/life-sunday/goa’s-village-names-hidden-stories-behind-them/153428.html
- R1, 7 Oct 2026: https://www.thegoan.net/life-sunday/x/155192.html
- R2, 15 Oct 2026: https://www.thegoan.net/life-sunday/exploring-goa’s-hidden-vainguinims-and-bainguinim/155593.html

| village | part | origin (our words) | hedge | luis_spelling | gazetteer_note |
| --- | --- | --- | --- | --- | --- |
| Adcolna | P1 | Ad (upper) and colna (settlement or waterway) | likely | | no entry |
| Agonda | P1 | Perhaps Aghanda, hills and water | possibly | | Agond, no origin |
| Aldona | P1 | Haldona, from hal (plough) or haldi (turmeric) | two options | Oidone | Haldone, no origin |
| Amona | P1 | A peaceful riverside settlement | stated | | no entry |
| Anjadiva | P1 | Ange (near) and diva (island) | stated | | differs: origin doubtful, four Sanskrit readings |
| Anjuna | P1 | Arabic anjuman, a merchants' guild | stated | Honjunnem | Hanjun, no origin |
| Arpora | P1 | Haripur, Vishnu's village, or ar (channel) and pora (settlement) | some historians suggest | | no entry |
| Ashwem | P1 | Ashwa (horse), horse breeding or cavalry routes | some suggest | Ashvem | no entry |
| Assagao | P1 | Ashram-gaon, village of hermitages | one common theory | Fullyanchem Gaon | no entry |
| Assonora | P1 | Asan tree and ora (locality), or a clan name | theories | | no entry |
| Baga | P1 | A word for a small tide or estuary | likely | | no origin |
| Bambolim | P1 | Bamboo groves | likely | | no origin |
| Banastarim | P1 | A forest settlement, possibly linked to Bhandaris | likely | | no origin |
| Batim | P1 | Bat (road) and -im (place), a village on a route | stated | | Bhati, no origin |
| Benaulim | P1 | Banahalli, village of the arrow, from Parashurama's legend | legend | Banavalli | no origin |
| Betalbatim | P1 | After its former deity Betal | stated | Betpatte | no origin |
| Bicholim | P1 | From Divchali; perhaps visolm (snakes) or two streams | believed | Divchali | differs: older name Batagrama |
| Calangute | P2 | Koli-gutti, land of fishermen, or Konvallo-Ghott, coconut trees | two options | Kolongutt | Kalangut, no origin |
| Camurlim | P2 | Camara-halli, village of blacksmiths | stated | | Kamurli, no origin |
| Chicalim | P2 | Chikal (clay), from marshy land | believed | | no entry |
| Chimbel | P2 | Chimb (soaked), low-lying land | believed | | no entry |
| Chinchinim | P2 | Chinch (tamarind), or the deity Chinchinath | two theories | Chinchone | no entry |
| Chorao | P2 | Chudamani, a precious jewel | stated | Choddnnem | no origin |
| Collem | P2 | Originally Kulem; spelt Colem, then Collem after 1961 | stated | Kulem | Colem, no origin |
| Colva | P2 | Khol (bay) and va (village) | believed | | Kolve, no origin |
| Cortalim | P2 | Formerly Kushastali | stated | | agrees on Kushasthali |
| Cumbharjua | P2 | Cumbhar (potter) and jua (stream or place) | believed | | no entry |
| Cuncolim | P2 | Kumkumahalli, where vermilion was made | stated | | no origin |
| Cunchelim | P2 | Cunche (corner) and lim (place) | believed | | no entry |
| Chandor | P3 | The ancient capital Chandrapura | stated | | agrees: Bhoja capital Chandrapur |
| Davorlim | P3 | A Davor community, or dav (herbs) and -lim | debated | | Daorli, no origin |
| Dona Paula | P3 | Once Oddavel, renamed after Dona Paula de Menezes | legend | Oddavel | no origin |
| Gandaulim | P3 | A settlement of the Gaudde community | believed | Gaundale | Gaondali, no origin |
| Goa Velha | P4 | Kadamba port capital, once Gopakapattana | stated | Vhoddlem Goem | agrees: Gopaka |
| Harmal (Arambol) | P4 | From "Hari Mall", a cry of the Pandavas | legend | | no origin |
| Margao | P5 | Mahargao or Maravile; earlier Mathagrama, nine mathas | debated | Madgaon | partly: Mathagrama, by Hindu tradition |
| Maem | P5 | Deity Mahamaya, mhov (honey) or Mayurvan (peafowl forest) | three traditions | Mayem | no entry |
| Moira | P6 | Moriya, a Mauryan settlement | one interpretation | | no entry |
| Mandrem | P7 | Arabic mudras (teacher) | traditionally believed | Mandre | no entry |
| Malar | P8 | From the church of St Mathias | believed | | no entry |
| Mandur | P8 | Recorded as Mandura; no meaning given | | Mandura | listed |
| Ribandar | R1 | Rayachem Banddar, the king's wharf | believed | | no entry |
| Vainguinim | R2 | Portuguese vanguinhas, small waves | sometimes believed | | no entry |

Gazetteer-sourced origins for the same CSV (source "Gazetteer 1979, Part 1, ch. 19"): Bandora (formerly Bandhavatika; inscription gives Bandawada, later Bandiwade), Borim (formerly Badrigrama), Queula (formerly Kapilgrama), Paroda (anciently Parvat), Sanguem (Samgampur), Rivona (Rishivan, according to local tradition), Carambolim-Brama (reported formerly Chandiwade), Anjediva (doubtful; Adyadvipa, Ajyadvip, Anjidipa, Ajdvipa).

### Videos: Villages of Goa (YouTube, @Villages_of_Goa)
| place | title | url | uploaded |
| --- | --- | --- | --- |
| Assagao | Shree Ghateshwar Mandir | https://youtu.be/aRapVtNhWBg | 2026-07-01 |
| Bandora | Shree Mahalaxmi Mandir | https://youtu.be/ho03VQfgEcg | 2026-07-06 |
| Usgao (Bondla) | Bondla wildlife sanctuary | https://youtu.be/IDTKfiH0t-g | 2024-10-06 |
| Dhamshem | Dhamshem village | https://youtu.be/eqF7O8xs2oE | 2025-11-15 |
| Dhavem | Dhavem village | https://youtu.be/_Jz80enyCfk | 2025-11-10 |
| Harvalem | Maharudreshwar temple | https://youtu.be/UGzjhGzVV38 | 2025-10-28 |
| Kavlem | Kalyan Maruti Gad | https://youtu.be/gXxXYUF_rEA | 2026-07-17 |
| Keri (Ponda) | Shree Vijaydurga Mandir | https://youtu.be/VR83jBh_Hlo | 2026-07-07 |
| Khandepar | Saptakoteshwar mandir | https://youtu.be/BUAd76JblGg | 2025-11-11 |
| Khandepar | Datta temple | https://youtu.be/J3_Eh9Jo4so | 2025-10-30 |
| Mapusa | Shree Bodgeshwar Mandir | https://youtu.be/w78sdAEolRM | 2026-07-08 |
| Marcel | Chikhal Kalo festival | https://youtu.be/mbK4se5m-rI | 2026-07-20 |
| Mauxi | Mauxi village | https://youtu.be/TRYNI45D03Y | 2026-01-19 |
| Mauxi | Mauxi village | https://youtu.be/TRlK7Pu4uQs | 2025-11-09 |
| Mayem | Mayem village | https://youtu.be/Hs4R6xZDcB4 | 2025-11-13 |
| Narve | Narve village | https://youtu.be/zoLe1UFlnKk | 2025-11-12 |
| Panaji | Panjim | https://youtu.be/TsyggUbdqZw | 2025-10-26 |
| Pernem | Shree Mulvir Devasthan | https://youtu.be/UubfYIWbTTk | 2026-07-05 |
| Ponda | Shankar Parvati Ganesh Mandir | https://youtu.be/cxvSvXMfNCc | 2026-07-21 |
| Savoi-Verem | Savoi Verem ferry | https://youtu.be/-hYyhDYsjww | 2018-08-14 |
| Shiroli (Sattari) | Shiroli village | https://youtu.be/z6culuIqP2c | 2026-07-08 |
| Tambdi Surla | Mahashivratri at Tambdi Surla | https://youtu.be/Wl8CONkgMC4 | 2026-02-15 |
| Vantem | Ganpati temple | https://youtu.be/Yz3gmDuiHXI | 2025-10-27 |
| Veling | Shree Laxmi Narsimha Temple | https://youtu.be/9R2mWvtWgWk | 2026-07-10 |

Panaji, Mapusa and Ponda are municipal towns; attach those videos only if the town has a page.

### GI products (GI Registry, search.ipindia.gov.in/GIRPublicSearch)
| app_no | product | village tie |
| --- | --- | --- |
| 120 | Feni (cashew) | Goa-wide |
| 618 | Khola Chilli | Cola (Khola), Canacona |
| 642 | Harmal Chilli | Arambol (Harmal), Pernem |
| 655 | Goan Khaje | Goa-wide |
| 680 | Myndoli Banana | Moira, Bardez |
| 714 | Goa Cashew | Goa-wide |
| 728 | Goa Mankurad Mango | Goa-wide |
| 746 | Goan Bebinca | Goa-wide |
| 763 | Agsechi Vayingim (Agassaim brinjal) | Agassaim |
| 790 | Sat Shiro Bheno | Goa-wide |
| 878 | Taleigao Vayingim | Taleigao |
| 879 | Goa Hilario Mango | Goa-wide |
| 916 | Goa Korgut Rice | Goa-wide |
| 1079 | Goa Kaju Apple | Goa-wide |
| 1080 | Goa Mussarat Mango | Goa-wide |

### Wikidata QIDs
Goa Q1171; North Goa Q108234; South Goa Q108244; Kushavati Q137802695; Pernem Q15265990; Bardez Q3632943; Tiswadi Q3291873; Bicholim Q65445416; Sattari Q7426523; Ponda Q7227680; Mormugao Q6912704; Salcete Q256847; Quepem Q7271307; Sanguem Q7418155; Canacona Q861954; Dharbandora Q16973685. Check Ponda and Mormugao aren't the town items before using them in `sameAs`.

## Done means
- Part A merged in small PRs, each with a preview link and a plain-English note for Shashank.
- `coverage.md` shows how many villages have each fact, and how many pages are indexable.
- Nothing shown that isn't in a source file, a reviewed row, or (on the village sheet only) a labelled Gazetteer form.
