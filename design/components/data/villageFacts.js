// Khoim phase 2: verified village content. Only the examples given in the phase 2 brief (16 Oct 2026). Never add facts here without a source.
// Village keys are place ids ('v' + LGD code). Census figures are not loaded yet: every Census field is null and renders as a marked placeholder.
export const VILLAGE_FACTS = {
  v626704: {
    deva: 'हळदोणें', devaSource: 'Gazetteer, 1979', devaReviewed: false,
    spellings: { ordered: false, caption: 'Columns of the 1970 spelling list in the Gazetteer of Goa, Daman and Diu, 1979.', items: [
      { form: 'Aldona', source: 'Government spelling' },
      { form: 'Aldona', source: 'Survey of India spelling' },
      { form: 'Haldone', source: 'Advisory Body spelling' },
      { form: 'हळदोणें', source: 'Devanagari', lang: 'gom', note: 'pending review' }
    ] },
    meaning: { kind: 'roots', readings: [
      { text: 'Haldona', roots: [{ from: 'hal', gloss: 'plough' }, { from: 'haldi', gloss: 'turmeric' }], note: 'Two options.', source: 'Dr Alvarinho J. Luis, The Goan, 21 Feb 2026' }
    ] },
    sources: [
      { title: 'Local Government Directory, Government of India', url: 'https://lgdirectory.gov.in/' },
      { title: 'Gazetteer of the Union Territory Goa, Daman and Diu, Part 1, 1979 (spellings and Devanagari)', url: 'https://archive.org/details/dli.ministry.08183' },
      { title: 'Dr Alvarinho J. Luis, The Goan, 21 Feb 2026', url: 'https://www.thegoan.net/life-sunday/goa%E2%80%99s-village-names-hidden-stories-behind-them/143881.html' },
      { title: 'UCA News parish directory', url: 'https://www.ucanews.com/directory/' }
    ],
    knownFor: [
      { kind: 'parish', icon: 'church', title: 'St Thomas parish', detail: 'Parish feast', when: { easterSaturday: 3 }, whenText: 'Third Saturday after Easter', source: 'UCA News directory' }
    ]
  },
  v626869: {
    spellings: { ordered: true, items: [
      { form: 'Bandhavatika', source: 'Gazetteer, 1979' },
      { form: 'Bandawada', source: 'Gazetteer, 1979' },
      { form: 'Bandiwade', source: 'Gazetteer, 1979' },
      { form: 'Bandora', source: 'Gazetteer, 1979' }
    ] },
    video: { title: 'Shree Mahalaxmi Mandir', channel: 'Villages of Goa', youtubeId: 'ho03VQfgEcg', url: 'https://youtu.be/ho03VQfgEcg' }
  },
  v626695: {
    meaning: { kind: 'differ', readings: [
      { text: 'Kalyanagudi', source: 'Alfred Bragança, 1964' },
      { text: 'Koli-gutti', gloss: 'land of fishermen', source: 'Dr Alvarinho J. Luis, 2026' }
    ] },
    split: { whole: 'Koli-gutti', source: 'Dr Alvarinho J. Luis, 2026', parts: [{ part: 'Koli', sharedWith: [] }, { part: 'gutti', sharedWith: [] }] }
  },
  v627014: {
    meaning: { kind: 'tradition', readings: [{ text: 'Rishivan', gloss: 'dwelling of sages', source: 'Gazetteer, 1979' }] }
  },
  v626690: {
    knownFor: [{ kind: 'festival', icon: 'sailboat', title: 'Sao Joao boat parade', when: { month: 6, day: 24 }, whenText: '24 June', source: 'Goa Tourism; Herald' }]
  },
  v626692: {
    meaning: { kind: 'single', readings: [{ text: 'Moriya', gloss: 'a Mauryan settlement', source: 'Dr Alvarinho J. Luis, 2026' }] },
    knownFor: [{ kind: 'gi', icon: 'banana', title: 'Myndoli banana', detail: 'GI no. 680', source: 'GI Registry' }]
  },
  v627022: {
    knownFor: [{ kind: 'gi', icon: 'sprout', title: 'Khola chilli', detail: 'GI no. 618', source: 'GI Registry' }]
  },
  v626675: {
    vaddos: { source: 'CEO Goa electoral roll', items: ['Britto Vaddo', 'Jackney Vaddo (I)', 'Jackney Vaddo (II)'] }
  }
};
/* Villages in Goa's village list that have no polygon in our boundary file yet.
   Sirigao (Shirgao): government and Gazetteer spelling, Bicholim taluka. TODO(data): its LGD code and boundary, or a point, so it can be drawn. */
export const EXTRA_VILLAGES = [
  { id: 'vsirigao', official: 'Sirigao', taluka: 'bicholim', alsoKnownAs: 'Shirgao', lgd: null, lp: null,
    facts: { knownFor: [{ kind: 'zatra', icon: 'flame', title: 'Lairai zatra', detail: "Dhonds' fire-walk", when: { lunar: true, months: [4, 5] }, whenText: 'Vaishakh Shuddh Panchami', source: 'Gazetteer, 1979' }] } }
];
export const UNMATCHED = [];
/* River and railway lines. TODO(data): load from OpenStreetMap at build. These two are PLACEHOLDER geometry, drawn only to show the style. */
export const LINES = [
  { id: 'river-bardez', kind: 'river', taluka: 'bardez', placeholder: true, label: 'River', d: 'M318,196C312,240 330,280 318,322S296,392 300,430S278,478 262,508' },
  { id: 'rail-bardez', kind: 'rail', taluka: 'bardez', placeholder: true, label: 'Railway', d: 'M336,190C326,250 340,300 322,350S330,440 344,505', station: { at: [327, 298], label: 'Station' } }
];
/* Census 2011. TODO(data): load the village directory. Until then every value is null. */
export const CENSUS = {};
/* Approximate km per map unit (map plane is about 100 km tall). TODO(data): compute from latitude and longitude at build. */
export const KM_PER_UNIT = 0.0707;
