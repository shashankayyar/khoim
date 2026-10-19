A village's sheet (phase 3). In a Sheet on phones (capped at 40% of the screen, it scrolls), docked right on desktop.
```jsx
<VillageSheet place={aldona} script={script} outline={paths[aldona.id]} facts={facts} onTell={openForm} onPick={openVillage} onShare={share} />
```
- On `--surface-raised`. The house colour is the outline only (96px square, `--map-ink-{house}`).
- Big name: the reviewed form in the chosen script, else the official spelling. Rows: Official, देवनागरी, Romi; "not written yet" in italic, full ink.
- Gazetteer-only Devanagari: in the देवनागरी row only, with Needs review and "Devanagari as in the Gazetteer, 1979".
- The ask (when a script is missing), a dashed box: "Do you know how {village} is said at home? Record it or write it in either script, and it goes on the map with your name."
- Next to: 44px pills, names in the chosen script. Phase 2 blocks stay, each only with data.
- Phase 4: the ask opens the contribution form with the name and the recorder ready (email only when the form is off); a spelling two sources share shows once with both; the distances come last; a feast whose rule names no month shows the rule alone.
- Live: src/components/village/VillageSheet.tsx and village.css.
