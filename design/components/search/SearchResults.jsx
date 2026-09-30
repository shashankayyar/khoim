import React from 'react';
import { searchPlaces, whereLabel, houseOf } from '../data/khoim.js';
import { useReducedMotion } from '../core/motion.js';
function mark(text, q) {
  const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const f = fold(text), i = f.indexOf(fold(q.trim()));
  if (i < 0 || f.length !== text.length) return text;
  const n = q.trim().length;
  return <>{text.slice(0, i)}<mark style={{ background: 'var(--mark)', color: 'inherit', borderRadius: 4, padding: '0 1px' }}>{text.slice(i, i + n)}</mark>{text.slice(i + n)}</>;
}
export function SearchResults({ query = '', onPick, limit = 16, style }) {
  const reduce = useReducedMotion();
  const res = searchPlaces(query, limit);
  const note = { margin: '8px 4px', font: 'var(--weight-regular) 17px/1.5 var(--font-latin)', color: 'var(--text)' };
  if (!query.trim()) return <p style={{ ...note, ...style }}>Type a name the way you know it. Official spelling, देवनागरी or Romi all work.</p>;
  return (
    <div style={style}>
      <p role="status" aria-live="polite" style={{ ...note, fontSize: 15, margin: '4px 4px 10px' }}>{res.length ? `${res.length} ${res.length === 1 ? 'place' : 'places'}` : `Nothing for "${query}" yet. Try the official spelling.`}</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
        {res.map(({ place: p, field }, i) => (
          <li key={p.id} style={{ animation: reduce ? 'none' : `khoim-rise var(--dur-base) var(--ease-out) ${Math.min(i, 8) * 30}ms both` }}>
            <button type="button" onClick={() => onPick && onPick(p.id)} style={{ width: '100%', display: 'grid', gridTemplateColumns: '10px minmax(0,1fr)', gap: 14, alignItems: 'stretch', textAlign: 'left', border: 0, borderRadius: 'var(--radius-l)', background: 'var(--surface-raised)', padding: '12px 14px 12px 12px', cursor: 'pointer', color: 'var(--text)' }}>
              <span aria-hidden="true" style={{ borderRadius: 5, background: houseOf(p).bg }}></span>
              <span style={{ display: 'grid', gap: 2 }}>
                {p.deva ? <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0 12px' }}>
                    <span lang="gom" style={{ font: 'var(--weight-strong) 28px/1.5 var(--font-deva)' }}>{field === 'deva' ? mark(p.deva, query) : p.deva}</span>
                    {p.romi && <span lang="gom-Latn" style={{ font: 'var(--weight-strong) 21px/1.3 var(--font-latin)' }}>{field === 'romi' ? mark(p.romi, query) : p.romi}</span>}
                  </span>
                  : <span style={{ font: 'var(--weight-strong) 21px/1.4 var(--font-latin)' }}>{mark(p.official, query)}</span>}
                <span style={{ font: 'var(--weight-regular) 15px/1.4 var(--font-latin)' }}>{p.deva ? <>{field === 'official' ? mark(p.official, query) : p.official} · </> : 'Official name only · '}{whereLabel(p)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
