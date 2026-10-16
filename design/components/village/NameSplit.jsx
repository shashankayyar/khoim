import React from 'react';
/* The name broken into the parts a source gives. Each part opens the villages that share it. */
export function NameSplit({ split, onPickPlace, style }) {
  const [open, setOpen] = React.useState(null);
  if (!split || !split.parts || !split.parts.length) return null;
  return (
    <div style={{ display: 'grid', gap: 10, ...style }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        {split.parts.map((pt, i) => <React.Fragment key={i}>{i > 0 && <span aria-hidden="true" style={{ font: 'var(--weight-strong) 20px/1 var(--font-latin)' }}>+</span>}
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} style={{ minHeight: 48, padding: '0 14px', borderRadius: 'var(--radius-m)', border: '2px solid currentColor', background: open === i ? 'currentColor' : 'transparent', cursor: 'pointer', font: 'var(--weight-strong) 22px/1.2 var(--font-latin)' }}>
            <span style={{ color: open === i ? 'var(--sheet-paper, var(--surface-raised))' : 'inherit' }}>{pt.part}</span></button></React.Fragment>)}
      </div>
      {open !== null && <div style={{ font: 'var(--weight-regular) 16px/1.5 var(--font-latin)' }}>
        {split.parts[open].sharedWith.length
          ? <span>Also in: {split.parts[open].sharedWith.map((s, i) => <button key={s.id} type="button" onClick={() => onPickPlace && onPickPlace(s.id)} style={{ border: 0, background: 'transparent', color: 'inherit', padding: '8px 4px', font: 'inherit', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer' }}>{s.name}</button>)}</span>
          : <span>{'No other villages linked to "' + split.parts[open].part + '" yet.'}</span>}
      </div>}
      <span style={{ font: 'var(--weight-regular) 14px/1.45 var(--font-latin)' }}>{'As split in ' + split.whole + ', ' + split.source}</span>
    </div>
  );
}
