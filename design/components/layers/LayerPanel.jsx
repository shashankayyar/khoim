import React from 'react';
import { KhoimData } from '../data/khoim.js';
import { Button } from '../core/Button.jsx';
import { MonthSlider } from './MonthSlider.jsx';
const D = KhoimData;
const fmtNext = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const p16 = { margin: 0, font: 'var(--weight-regular) 16px/1.5 var(--font-latin)' };
/* Controls and readout for the chosen map layer. Goes in the bottom sheet (phone) or side panel (desktop). */
export function LayerPanel({ layer, onChange, onShare, onPickPlace, onHelp, year = new Date().getFullYear(), style }) {
  if (!layer || layer.id === 'names') return null;
  const box = { display: 'grid', gap: 14, padding: '0 var(--gutter) 20px', ...style };
  const share = onShare && <Button variant="outline" icon="share-2" onClick={onShare}>Share this view</Button>;
  if (layer.id === 'parts') {
    const part = D.NAME_PARTS.find(x => x.id === layer.part) || D.NAME_PARTS[0];
    return <div style={box}>
      <p style={p16}>Pick an ending. Every village whose official spelling ends with it lights up.</p>
      <div role="radiogroup" aria-label="Name part" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {D.NAME_PARTS.map(x => { const on = x.id === part.id;
          return <button key={x.id} type="button" role="radio" aria-checked={on} onClick={() => onChange({ ...layer, part: x.id })}
            style={{ minHeight: 48, padding: '0 14px', borderRadius: 'var(--radius-m)', border: '2px solid ' + (on ? 'var(--text)' : 'var(--line)'), background: on ? 'var(--surface-invert)' : 'var(--surface-raised)', color: on ? 'var(--text-invert)' : 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ font: 'var(--weight-strong) 20px/1 var(--font-latin)' }}>{x.label}</span><span style={{ font: 'var(--weight-regular) 14px/1 var(--font-latin)' }}>{x.count}</span></button>; })}
      </div>
      <p style={{ ...p16, fontWeight: 600, fontSize: 18 }}>{part.count + ' villages end in ' + part.label}</p>
      <p style={{ ...p16, fontSize: 15 }}>Matched on official spellings. What each part means still needs a source.</p>
      {share}
    </div>;
  }
  if (layer.id === 'feasts') {
    const all = D.allFeasts();
    const counts = Array.from({ length: 12 }, (_, i) => all.filter(f => D.upcomingMonths(f.item.when).includes(i + 1)).length);
    const now = all.filter(f => D.upcomingMonths(f.item.when).includes(layer.month));
    return <div style={box}>
      <MonthSlider value={layer.month} onChange={m => onChange({ ...layer, month: m })} counts={counts} />
      {now.length ? <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
        {now.map((f, i) => { const d = D.nextFeastDate(f.item.when);
          return <li key={i}><button type="button" disabled={!f.place} onClick={() => f.place && onPickPlace && onPickPlace(f.place.id)}
            style={{ width: '100%', display: 'grid', gridTemplateColumns: '10px minmax(0,1fr)', gap: 12, alignItems: 'stretch', textAlign: 'left', border: 0, borderRadius: 'var(--radius-l)', background: 'var(--surface-raised)', color: 'var(--text)', padding: '12px 14px 12px 12px', cursor: f.place ? 'pointer' : 'default', boxShadow: 'var(--shadow-1)' }}>
            <span aria-hidden="true" style={{ borderRadius: 5, background: 'var(--house-' + D.houseOf(f.place || { parent: f.taluka }).key + ')' }}></span>
            <span style={{ display: 'grid', gap: 2 }}><span style={{ font: 'var(--weight-strong) 18px/1.3 var(--font-latin)' }}>{f.item.title}</span><span style={{ font: 'var(--weight-strong) 15px/1.4 var(--font-latin)' }}>{f.name}</span><span style={{ font: 'var(--weight-regular) 15px/1.45 var(--font-latin)' }}>{f.item.whenText + '. ' + (d ? 'Next: ' + fmtNext(d) + '.' : 'Lunar date, so it moves each year.')}</span></span></button></li>; })}
      </ul> : <p style={p16}>No feast or zatra recorded for this month yet. Know one? Tell us.</p>}
      {share}
    </div>;
  }
  if (layer.id === 'need') {
    const V = D.VILLAGES, rev = V.filter(v => v.deva && v.status !== 'review').length, rv = V.filter(v => v.status === 'review').length, none = V.length - rev - rv;
    const sw = (st) => ({ width: 28, height: 20, borderRadius: 4, flex: '0 0 auto', background: st === 'lit' ? 'var(--house-kokum)' : st === 'review' ? 'var(--map-kokum-dim)' : 'var(--map-unlit)', border: st === 'lit' ? 0 : '1.5px ' + (st === 'review' ? 'dashed' : 'solid') + ' var(--map-outline)' });
    const row = (st, n, t) => <li style={{ display: 'flex', alignItems: 'center', gap: 12, font: 'var(--weight-regular) 16px/1.4 var(--font-latin)' }}><span aria-hidden="true" style={sw(st)}></span><span><strong style={{ fontWeight: 700 }}>{n}</strong>{' ' + t}</span></li>;
    return <div style={box}>
      <p style={{ ...p16, fontWeight: 600, fontSize: 18 }}>{rev + ' of ' + V.length + ' villages have a checked Konkani name.'}</p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>{row('lit', rev, 'checked by a speaker')}{row('review', rv, 'written down, not checked yet')}{row('outline', none, 'with no Konkani name yet')}</ul>
      <p style={p16}>If you know how your village is written in Devanagari or Romi, tap it and tell us.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}><Button icon="mail" onClick={onHelp}>Help fill this in</Button>{share}</div>
    </div>;
  }
  if (layer.id === 'population') {
    return <div style={box}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ height: 22, borderRadius: 4, background: 'var(--pop-' + i + ')', border: '1px solid var(--line)' }}></span>)}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--weight-regular) 15px/1.3 var(--font-latin)' }}><span>Fewer people</span><span>More</span></div>
      <p style={{ ...p16, fontWeight: 600 }}>Placeholder shading. Census 2011 figures are not loaded yet.</p>
      {share}
    </div>;
  }
  return null;
}
