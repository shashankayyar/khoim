Taluka page as a village list. Route: /north-goa/bardez/villages.
```jsx
<VillageTable taluka="bardez" onPick={openPlace} />
<VillageTable taluka="bardez" compact onPick={openPlace} />
```
- People column sorts once Census 2011 loads; until then it is disabled and shows DataPending.
