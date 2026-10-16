Visible row of map layers under the breadcrumb (phone) or in the map header (desktop).
```jsx
<LayerRow value={layer.id} onChange={id => setLayer({ id })} />
```
- Soft square tiles, radius 12, never pills. Selected tile is soot with white text.
- Each layer view has its own link (KhoimData.layerUrl). Pair with LayerPanel for the controls of the chosen layer.
