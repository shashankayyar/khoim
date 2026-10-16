import React from 'react';
import { childrenOf, getPlace, STATUS_TEXT } from '../data/khoim.js';
import { Icon } from '../core/Icon.jsx';
import { DataPending } from './DataPending.jsx';
const ORDER = { agree: 0, review: 1, differ: 2, pending: 3 };
/* Every village in a taluka as a sortable list. For people who land from search, and for keyboard and screen-reader use. */
export function VillageTable({ taluka, onPick, compact = false, style }) {
  const [sort, setSort] = React.useState({ key: 'official', dir: 1 });
  const rows = childrenOf(taluka).slice().sort((a, b) => {
    const k = sort.key; let x, y;
    if (k === 'status') { x = ORDER[a.status]; y = ORDER[b.status]; } else { x = a.official; y = b.official; }
    return (x < y ? -1 : x > y ? 1 : a.official.localeCompare(b.official)) * sort.dir;
  });
  const by = k => setSort(s => ({ key: k, dir: s.key === k ? -s.dir : 1 }));
  const t = getPlace(taluka);
  const th = (k, label, can = true) => <th scope="col" aria-sort={sort.key === k ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'} style={{ textAlign: 'left', padding: 0, borderBottom: '2px solid var(--text)' }}>
    <button type="button" disabled={!can} onClick={() => by(k)} title={can ? undefined : 'Loads with Census 2011'} style={{ width: '100%', minHeight: 44, display: 'flex', alignItems: 'center', gap: 6, border: 0, background: 'transparent', color: 'var(--text)', padding: '0 10px', font: 'var(--weight-strong) 14px/1.3 var(--font-latin)', cursor: can ? 'pointer' : 'default' }}>{label}{can && <Icon name="arrow-up-down" size={14} />}</button></th>;
  if (compact) return (
    <div style={{ display: 'grid', gap: 10, ...style }}>
      <div role="group" aria-label="Sort by" style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ font: 'var(--weight-strong) 14px/1 var(--font-latin)', marginRight: 4 }}>Sort</span>
        {[['official', 'A to Z'], ['status', 'Konkani name']].map(([k, l]) => <button key={k} type="button" aria-pressed={sort.key === k} onClick={() => by(k)} style={{ minHeight: 44, padding: '0 12px', borderRadius: 'var(--radius-m)', border: '2px solid ' + (sort.key === k ? 'var(--text)' : 'var(--line)'), background: sort.key === k ? 'var(--surface-invert)' : 'var(--surface-raised)', color: sort.key === k ? 'var(--text-invert)' : 'var(--text)', font: 'var(--weight-strong) 14px/1 var(--font-latin)', cursor: 'pointer' }}>{l}{sort.key === k && (sort.dir > 0 ? ' ↑' : ' ↓')}</button>)}
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
        {rows.map(v => <li key={v.id}><button type="button" onClick={() => onPick && onPick(v.id)} style={{ width: '100%', minHeight: 60, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 10, alignItems: 'center', textAlign: 'left', border: 0, borderRadius: 'var(--radius-m)', background: 'var(--surface-raised)', color: 'var(--text)', padding: '8px 14px', cursor: 'pointer' }}>
          <span style={{ display: 'grid' }}>{v.deva && <span lang="gom" style={{ font: 'var(--weight-strong) 20px/1.5 var(--font-deva)' }}>{v.deva}</span>}<span style={{ font: 'var(--weight-strong) 17px/1.3 var(--font-latin)' }}>{v.official}</span><span style={{ font: 'var(--weight-regular) 14px/1.4 var(--font-latin)' }}>{STATUS_TEXT[v.status]}</span></span>
          <Icon name="chevron-right" size={20} /></button></li>)}
      </ul>
    </div>
  );
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text)', ...style }}>
      <caption style={{ textAlign: 'left', font: 'var(--weight-regular) 15px/1.4 var(--font-latin)', padding: '0 0 10px' }}>{rows.length + ' villages in ' + t.official + '. Choose a column to sort.'}</caption>
      <thead><tr>{th('official', 'Official')}{th('deva', 'देवनागरी', false)}{th('romi', 'Romi', false)}{th('type', 'Village or Census Town', false)}{th('pop', 'People, 2011', false)}{th('status', 'Konkani name')}</tr></thead>
      <tbody>{rows.map(v => <tr key={v.id} style={{ borderBottom: '1px solid var(--line)' }}>
        <td style={{ padding: 0 }}><button type="button" onClick={() => onPick && onPick(v.id)} style={{ minHeight: 44, border: 0, background: 'transparent', color: 'var(--text)', padding: '0 10px', font: 'var(--weight-strong) 16px/1.3 var(--font-latin)', textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer', textAlign: 'left' }}>{v.official}</button></td>
        <td lang="gom" style={{ padding: '0 10px', font: 'var(--weight-strong) 18px/1.5 var(--font-deva)' }}>{v.deva || ''}</td>
        <td style={{ padding: '0 10px', font: 'var(--weight-strong) 16px/1.3 var(--font-latin)' }}>{v.romi || ''}</td>
        <td style={{ padding: '6px 10px' }}>{v.census && v.census.type ? v.census.type : <DataPending label="To load" />}</td>
        <td style={{ padding: '6px 10px' }}>{v.census ? v.census.population.toLocaleString('en-IN') : <DataPending label="To load" />}</td>
        <td style={{ padding: '0 10px', font: 'var(--weight-regular) 15px/1.3 var(--font-latin)' }}>{STATUS_TEXT[v.status]}</td></tr>)}</tbody>
    </table>
  );
}
