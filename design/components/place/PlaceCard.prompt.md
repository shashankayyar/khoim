The place card. Put it inside a Sheet on phones (bg and ink from the house) or a side panel on desktop.
```jsx
const h = KhoimData.houseOf(KhoimData.getPlace('canacona'));
<Sheet label="Canacona" snap={snap} onSnap={setSnap} bg={h.bg} ink={h.on}>
  <PlaceCard place="canacona" expanded={snap === 'full'} onExpand={() => setSnap('full')} onClose={close} onGoInside={goIn} />
</Sheet>
```
- All text uses the house's `-on` ink at full strength (AAA). Dividers are the only thing at reduced opacity.
- Missing names show PendingName; never a guess.
- The heading is the Devanagari name when it exists, so screen readers get the Konkani name first (article is labelled with the official name).
