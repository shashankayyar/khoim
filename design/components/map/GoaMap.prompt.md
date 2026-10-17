The type map (phase 3). Fills its positioned parent. Every village's name inside its outline (384 outlines, LGD and Survey of India).
```jsx
<div style={{ position: 'relative', height: 700 }}>
  <GoaMap selected={sel} focus={taluka} script={script} villages={villages} paths={paths} lines={lines} mapLayer={view}
    insetLeft={448} insetRight={sel ? 408 : 14} onSelect={open} onBackground={close} />
</div>
```
- Fills `--map-tint-*`, names `--map-ink-*` (tokens/typemap.css), at each outline's label point, angle and size from data/scripts/labels.mjs. Latin names set 84% wide.
- Most movement is CSS custom properties on the map's box (`--k` zoom, `--z` zoom against the Goa view, `--tx`, `--ty`): a pan never re-renders.
- Labels show reviewed names only; the official spelling, weight 500 and fainter, otherwise. Never a Gazetteer form.
- Opening a village: 650ms ease-out to 55% of the free space (none under reduced motion), 2.2px outline in `--text`, neighbours named, the rest at 35%.
- Rivers: `--map-water`, round caps, clipped to Goa, width in map units; names past 2.2× the Goa view. Railway 1px `--text`. Stations and village symbols past 5×.
- + and - buttons, 48px, bottom right, are the way to zoom without a wheel or two fingers. The OpenStreetMap credit sits beside them.
- No pins, ever. Live: src/components/map/GoaMap.tsx.
