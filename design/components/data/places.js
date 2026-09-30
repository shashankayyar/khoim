// Khoim place names. Source: assets/names_districts_talukas.csv and the Goem draft of 30 Sept 2026.
// status: "agree" | "differ" | "pending" (pending = official name only; no reliable Konkani name yet)
// house: key into the --house-* colour tokens. reviewed: false until a Konkani speaker signs off the say-it guide.
// Villages are generated from goaGeo.js with status "pending" and their taluka's house.
export const PLACES = [
 {
  "id": "goa",
  "level": "state",
  "parent": null,
  "lgd": "30",
  "official": "Goa",
  "deva": "गोंय",
  "romi": "Goem",
  "say": "goy",
  "sayNote": "the o is nasal",
  "status": "agree",
  "house": "neel",
  "marathi": "गोवा",
  "sources": "District sites (header), Wikidata",
  "reviewed": false
 },
 {
  "id": "north-goa",
  "level": "district",
  "parent": "goa",
  "lgd": "551",
  "official": "North Goa",
  "deva": "उत्तर गोंय",
  "romi": "Ut'tor Goem",
  "say": "UT-tor goy",
  "sayNote": null,
  "status": "agree",
  "house": "green",
  "hq": "Panaji",
  "sources": "North Goa and South Goa Konkani sites, Wikidata",
  "reviewed": false
 },
 {
  "id": "south-goa",
  "level": "district",
  "parent": "goa",
  "lgd": "552",
  "official": "South Goa",
  "deva": "दक्षिण गोंय",
  "romi": "Dokxinn Goem",
  "say": "DOK-shin goy",
  "sayNote": null,
  "status": "differ",
  "house": "neel",
  "alsoWritten": [
   "दक्षीण गोंय"
  ],
  "hq": "Margao",
  "sources": "Wikidata, Kushavati Konkani site; South Goa header writes दक्षीण",
  "reviewed": false
 },
 {
  "id": "kushavati",
  "level": "district",
  "parent": "goa",
  "lgd": "793",
  "official": "Kushavati",
  "deva": "कुशावती",
  "romi": null,
  "say": "ku-SHAA-vo-tee",
  "sayNote": null,
  "status": "agree",
  "house": "oxide",
  "hq": "Quepem",
  "facts": [
   "Goa's third district, notified 31 December 2025"
  ],
  "sources": "kushavati.goa.gov.in header (Konkani and Marathi)",
  "reviewed": false
 },
 {
  "id": "pernem",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5609",
  "official": "Pernem",
  "deva": "पेडणें",
  "romi": null,
  "say": "PED-nen",
  "sayNote": "retroflex d and n, nasal ending",
  "status": "agree",
  "house": "haldi",
  "hq": "Pernem",
  "facts": [
   "Terekhol fort sits at its northern tip"
  ],
  "sources": "North Goa Konkani history page, Konkani Vishwakosh, Wikidata",
  "reviewed": false
 },
 {
  "id": "bardez",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5610",
  "official": "Bardez",
  "deva": "बार्देस",
  "romi": "Bardes",
  "say": "BAAR-des",
  "sayNote": null,
  "status": "differ",
  "house": "kokum",
  "sourceNote": "No government Konkani source yet.",
  "hq": "Mapusa",
  "facts": [
   "The Mandovi separates it from Tiswadi"
  ],
  "sources": "Konkani Vishwakosh, Konkani Wikipedia (no government Konkani page found)",
  "reviewed": false
 },
 {
  "id": "tiswadi",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5611",
  "official": "Tiswadi",
  "deva": "तिसवाडी",
  "romi": "Tisvaddi",
  "say": "TIS-vaa-dee",
  "sayNote": "retroflex d",
  "status": "differ",
  "house": "rose",
  "sourceNote": "No government Konkani source yet.",
  "hq": "Panaji",
  "facts": [
   "An island between the Mandovi and the Zuari"
  ],
  "sources": "Konkani Vishwakosh, Konkani Wikipedia (no government Konkani page found)",
  "reviewed": false
 },
 {
  "id": "bicholim",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5612",
  "official": "Bicholim",
  "deva": "दिवचल",
  "romi": "Divchol",
  "say": "DIV-chol",
  "sayNote": null,
  "status": "agree",
  "house": "green",
  "marathi": "बिचोळी",
  "hq": "Bicholim",
  "facts": [
   "Came under Portuguese rule only in the 18th century"
  ],
  "sources": "North Goa Konkani site (2 pages), Konkani Vishwakosh, Wikidata",
  "reviewed": false
 },
 {
  "id": "sattari",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5613",
  "official": "Sattari",
  "deva": "सत्तरी",
  "romi": "Sattari",
  "say": "SUT-tuh-ree",
  "sayNote": null,
  "status": "agree",
  "house": "oxide",
  "officialNote": "LGD spells it Satari",
  "hq": "Valpoi",
  "facts": [
   "The Mandovi is called Mhadei here"
  ],
  "sources": "North Goa Konkani site, Konkani Vishwakosh, Konkani Wikipedia",
  "reviewed": false
 },
 {
  "id": "ponda",
  "level": "taluka",
  "parent": "south-goa",
  "lgd": "5614",
  "official": "Ponda",
  "deva": "फोंडें",
  "romi": "Fonddem",
  "say": "PHON-den",
  "sayNote": "retroflex d, nasal ending",
  "status": "agree",
  "house": "lilac",
  "marathi": "फोंडा",
  "hq": "Ponda",
  "facts": [
   "Known in older records as Antruz"
  ],
  "sources": "South Goa Konkani constituency list, Konkani Vishwakosh, Wikidata",
  "reviewed": false
 },
 {
  "id": "mormugao",
  "level": "taluka",
  "parent": "south-goa",
  "lgd": "5615",
  "official": "Mormugao",
  "deva": "मुरगांव",
  "romi": "Murganv",
  "say": "MOOR-gaanv",
  "sayNote": "nasal aa",
  "status": "agree",
  "house": "sky",
  "hq": "Vasco da Gama",
  "facts": [
   "Separated from Salcete in the 17th century"
  ],
  "sources": "South Goa Konkani site, Konkani Vishwakosh, Wikidata",
  "reviewed": false
 },
 {
  "id": "salcete",
  "level": "taluka",
  "parent": "south-goa",
  "lgd": "5616",
  "official": "Salcete",
  "deva": "साश्टी",
  "romi": "Saxtti",
  "say": "SAASH-tee",
  "sayNote": "retroflex t",
  "status": "differ",
  "house": "neel",
  "alsoWritten": [
   "सासष्टी",
   "साष्टी"
  ],
  "hq": "Margao",
  "facts": [
   "Margao is also the South Goa district headquarters"
  ],
  "sources": "Konkani Vishwakosh, Konkani Wikipedia; variants सासष्टी, साष्टी",
  "reviewed": false
 },
 {
  "id": "quepem",
  "level": "taluka",
  "parent": "kushavati",
  "lgd": "5617",
  "official": "Quepem",
  "deva": "केपें",
  "romi": "Kepem",
  "say": "KAY-pen",
  "sayNote": "nasal ending",
  "status": "differ",
  "house": "haldi",
  "alsoWritten": [
   "केंपें",
   "केपे"
  ],
  "hq": "Quepem",
  "facts": [
   "Headquarters of Kushavati district"
  ],
  "sources": "Konkani Vishwakosh, Konkani Wikipedia; government pages write केंपें and केपे",
  "reviewed": false
 },
 {
  "id": "sanguem",
  "level": "taluka",
  "parent": "kushavati",
  "lgd": "5618",
  "official": "Sanguem",
  "deva": "सांगें",
  "romi": "Sangem",
  "say": "SAAN-gen",
  "sayNote": "nasal aa and nasal ending",
  "status": "agree",
  "house": "green",
  "hq": "Sanguem",
  "facts": [
   "Dudhsagar falls lie in this taluka"
  ],
  "sources": "South Goa Konkani site (2 pages), Konkani Vishwakosh, Wikidata",
  "reviewed": false
 },
 {
  "id": "canacona",
  "level": "taluka",
  "parent": "kushavati",
  "lgd": "5619",
  "official": "Canacona",
  "deva": "काणकोण",
  "romi": "Kannkonn",
  "say": "KAAN-kon",
  "sayNote": "both n sounds are retroflex",
  "status": "agree",
  "house": "rose",
  "hq": "Chaudi",
  "facts": [
   "Cotigao wildlife sanctuary is here"
  ],
  "sources": "South Goa and Kushavati Konkani sites, Konkani Vishwakosh, Wikidata",
  "reviewed": false
 },
 {
  "id": "dharbandora",
  "level": "taluka",
  "parent": "kushavati",
  "lgd": "5931",
  "official": "Dharbandora",
  "deva": null,
  "romi": null,
  "say": null,
  "sayNote": null,
  "status": "pending",
  "house": "mustard",
  "pendingNote": "Sources disagree on the Konkani spelling. We are waiting for the Directorate of Official Language to confirm it.",
  "hq": "Dharbandora",
  "facts": [
   "Formed mostly from Sanguem, with two villages from Ponda"
  ],
  "sources": "Conflicting: धारबांदोडें (Wikidata gom), धारबांदोडा (Kushavati site). Awaiting Directorate of Official Language",
  "reviewed": false
 }
];
export const HOUSE_OF = {"pernem":"haldi","bardez":"kokum","tiswadi":"rose","bicholim":"green","sattari":"oxide","ponda":"lilac","mormugao":"sky","salcete":"neel","quepem":"haldi","sanguem":"green","canacona":"rose","dharbandora":"mustard","north-goa":"green","south-goa":"neel","kushavati":"oxide","goa":"neel"};
