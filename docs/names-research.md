# Names research (30 September 2026)

The structured data is in `data/names_districts_talukas.csv`. This file keeps the evidence and the open questions.

## Rules we follow
- Government data first. Any single government page counts as one source, because district portals are inconsistent (the Kushavati Konkani pages use both काणकोण and कानाकोना for Canacona).
- Konkani in Devanagari is the official language under the Goa, Daman and Diu Official Language Act 1987, s.2(c). Marathi may be used for official purposes (Notification 1-1-87/OL&PG).
- Marathi and Konkani spellings differ, for example म्हापशें (Konkani) and म्हापसा (Marathi). Never label a Marathi form as Konkani.
- Every respelling is derived from the Devanagari. No audio or IPA from a government source exists for any unit.

## Confidence at 30 September 2026
- **High:** Goa, North Goa, Kushavati, Pernem, Bicholim, Sattari, Ponda, Mormugao, Sanguem, Canacona.
- **Medium (sources differ):** South Goa (दक्षिण vs दक्षीण), Bardez, Tiswadi (no government Konkani page found), Salcete (साश्टी vs सासष्टी vs साष्टी), Quepem (केपें vs केंपें vs केपे).
- **Withheld:** Dharbandora (धारबांदोडें vs धारबांदोडा). Ask the Directorate of Official Language.
- **Romi missing:** Kushavati, Pernem (inconsistent), Dharbandora.

## Village names in Devanagari (phase 2)
- LGD: no Devanagari for any Goa village. The local-name field is empty for 395 of 429 and repeats the English for 34.
- CEO Goa rolls, State Election Commission lists, Goa Gazette reservation notifications: English only.
- Kushavati Konkani site, village panchayat page: about 29 panchayats in Devanagari, mixed quality.
- South Goa Marathi site: full village list, but machine-transliterated from Portuguese spellings. Unusable.
- District Konkani constituency lists: all 40 assembly constituency names in good Konkani (म्हापशें, हळदोणें, कुंकळ्ळी, वेळ्ळीं, कुडचडें). Covers major towns only.
- Verdict: no government source has complete village names in Konkani Devanagari. Phase 2 base: Konkani Vishwakosh and Konkani Wikipedia as leads, reviewed by Konkani speakers, and a written request (or RTI) to the Directorate of Official Language for its official list.
- `data/village_names_review.xlsx` is the reviewer sheet: 429 villages with candidate spellings from secondary sources in separate columns and empty reviewer columns. Candidates are leads only. The town-name list from GitHub is known to be wrong in places (it gives कोणकोण for Canacona).

## Sources opened
- kushavati.goa.gov.in (home, about, history, Konkani and Marathi pages, village panchayats)
- southgoa.nic.in (Konkani: district, administration, assembly; Marathi: taluka, village and panchayat)
- northgoa.gov.in/kok (district, history, demography, subdivisions, constituencies, municipalities)
- Official Language Act 1987: prsindia.org/files/bills_acts/acts_states/goa/1987/1987GOA5.pdf
- dol.goa.gov.in (Official Language Konkani and Marathi PDF)
- lgdirectory.gov.in web services (district, subdistrict and village lists for state 30)
- ceogoa.nic.in SIR 2026 final roll; sec.goa.gov.in village panchayats; Goa Gazette reservation notification 2022
- Konkani Vishwakosh on Wikisource (Vol 2 pp 184, 795, 925; Vol 3 p 739; Vol 4 p 858)
- gom.wikipedia.org (Bardez, Tiswadi, Sattari, Gõy) and its database dump
- Wikidata entities for Goa, the districts and talukas
- en.wiktionary.org (Saxtti, Tiswadi)
