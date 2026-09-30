56px search field. On phones it sits at the bottom of the map in thumb reach; tapping it slides the search screen up.
```jsx
<SearchField value={q} onChange={setQ} onCancel={close} autoFocus />
```
- Placeholder colour is set to var(--text-2) (8.7:1) in tokens/elements.css.
