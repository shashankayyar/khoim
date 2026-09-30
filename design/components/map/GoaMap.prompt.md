The map. Fills its positioned parent. Real LGD boundaries (3 districts, 12 talukas, 384 villages).
```jsx
<div style={{ position: 'relative', height: 700 }}>
  <GoaMap focus={focus} selected={sel} hot={hot} script={script} insetTop={120} insetBottom={300}
    onSelect={(id, scrub) => (!scrub && id === sel) ? goInside(id) : setSel(id)} onHot={setHot} paintIn />
</div>
```
- Colours come from `--house-*` tokens; dimmed areas use `--map-*-dim`. Labels switch between the house's `-on` ink and `--text`, so every label is 7:1 or better.
- Labels sit at each shape's label point (`lp`), not the centroid.
- Level change: one FLIP transform, `--dur-zoom` (600ms) `--ease-out`. Paint-in: 60ms stagger, 700ms wipe. Both off under reduced motion.
- Village dots are not tab stops; pair the map with `PlaceStrip`, which lists the same places as buttons.
- No pins, ever.
