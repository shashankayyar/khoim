Bottom sheet for the place card and the strips. Drag or tap the handle to expand; drag down from peek to close.
```jsx
<Sheet label="Canacona" snap={snap} onSnap={setSnap} peek={296} bg="var(--house-rose)" ink="var(--house-rose-on)">
  <PlaceCard place="canacona" expanded={snap === 'full'} ... />
</Sheet>
```
- 480ms `--ease-standard`, follows the finger 1:1, flick velocity 0.4px/ms decides the snap.
- The handle is a real button (aria-expanded). Escape closes.
