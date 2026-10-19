What the map shows (phase 4, B3): one control, "Show", for the views and the layers.
```jsx
<ShowControl options={showOptions(liveCounts)} value={showValue} onChange={show} compact={phone} />
<EndingButtons layer={view} onChange={setView} />   {/* Spelling endings only */}
<EndingNote layer={view} />                          {/* what the ending tells you, from a source; none for -em, -ona */}
<Legend layer={view} script={script} />              {/* swatches in the map's own tokens */}
```
- Choices: Names, Spelling endings, then Feasts and zatras, Landmarks, Voices, Crops, Food, Music with counts, each only with 10 or more entries.
- A radio group named "Show" on desktop (arrow keys move), a labelled native select on phones. Selected: `--surface-invert` with `--text-invert`.
- In देवनागरी or Romi, Names fills the villages written in that script with `--map-written`, the rest `--map-quiet` (this replaced Still unwritten).
- Choosing never moves the map, never closes the open card, never hides the controls. `?layer=parts&part=im`, `?layer=feasts`, `?layer=landmarks` open a choice; `?layer=need` opens Names.
- Live: src/components/layers/ShowControl.tsx, Views.tsx; wording and counts in src/lib/layers.ts.
