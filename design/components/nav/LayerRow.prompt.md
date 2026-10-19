**Replaced in phase 4 by ShowControl** (see ShowControl.prompt.md). Kept as the phase 3 record.

The map views (phase 3): a radio group styled as the prototype's segmented row.
```jsx
<LayerRow value={view.id} onChange={id => setView(layerWith(id))} />
<EndingButtons layer={view} onChange={setView} />   {/* Spelling endings only: -im 68, -em 98, -gao 11, -ona 12, -ora 9 */}
<ViewLine layer={view} script={script} />            {/* "68 of 384 villages end in “-im” in their official spelling." */}
<Legend layer={view} />                              {/* swatches in the map's own tokens */}
```
- Labels: Names, Spelling endings, Still unwritten. The group is named "Map views". Arrow keys move between views.
- Selected view: `--surface-invert` with `--text-invert`. Ending chips are pills (the prototype's), 44px tall.
- Switching view never moves the map, never closes the open card, never hides the controls.
- Feasts and zatras returns to the row once there are 20 or more; Population after Census 2011. `?layer=parts&part=im` and `?layer=need` still open the views.
- Live: src/components/layers/LayerRow.tsx and Views.tsx, wording and counts in src/lib/layers.ts.
