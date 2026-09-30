List of layers inside the Layers sheet. Live layers toggle; next/planned ones show a dashed border and say so.
```jsx
<LayerSwitch value={layer} onChange={setLayer} />
```
- When a layer goes live, flip its status in LAYERS (components/data/khoim.js). Layer marks on the map should be small white trim tiles with the layer icon, never pins.
