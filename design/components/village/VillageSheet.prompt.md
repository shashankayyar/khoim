Village sheet, peek and full. Put it in a Sheet on phones (bg/ink from KhoimData.houseOf) or a side panel on desktop.
```jsx
<VillageSheet place="v626704" expanded={snap==='full'} onExpand={...} onShare={openShare} onSuggest={...} onRecord={...} />
```
- Order is fixed. Blocks with no data are not rendered; Facts always renders with DataPending placeholders until Census 2011 loads.
- Sets --sheet-bg to the house colour so filled cells can invert text.
