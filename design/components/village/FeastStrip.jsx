import React from 'react';
import { feastDate, feastMonths } from '../data/khoim.js';
const M = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const fmt = d => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
/* Thin 12-month strip with this year's date of a feast or zatra. Lunar dates show their months and the calendar rule. */
export function FeastStrip({ when, whenText, today = new Date(), style }) {
  const y = today.getFullYear();
  const d = feastDate(when, y), months = feastMonths(when, y);
  const next = d && d < today ? feastDate(when, y + 1) : null;
  const pos = d ? (d.getMonth() + (d.getDate() - 1) / 31) / 12 : null;
  const now = (today.getMonth() + (today.getDate() - 1) / 31) / 12;
  return (
    <div style={{ display: 'grid', gap: 6, ...style }}>
      <div aria-hidden="true" style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 2, height: 30 }}>
        {M.map((m, i) => { const on = months.includes(i + 1);
          return <span key={i} style={{ display: 'grid', placeItems: 'center', borderRadius: 4, border: '2px ' + (when && when.lunar && on ? 'dashed' : 'solid') + ' currentColor', background: on && !(when && when.lunar) ? 'currentColor' : 'transparent', font: 'var(--weight-strong) 12px/1 var(--font-latin)' }}>
            <span style={{ color: on && !(when && when.lunar) ? 'var(--sheet-bg, var(--surface))' : 'inherit' }}>{m}</span></span>; })}
        {pos !== null && <span style={{ position: 'absolute', left: 'calc(' + (pos * 100) + '% - 1px)', top: -5, bottom: -5, width: 3, borderRadius: 2, background: 'currentColor' }}></span>}
        <span title="Today" style={{ position: 'absolute', left: 'calc(' + (now * 100) + '% - 5px)', bottom: -11, width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '6px solid currentColor' }}></span>
      </div>
      <p style={{ margin: '8px 0 0', font: 'var(--weight-strong) 16px/1.45 var(--font-latin)' }}>
        {d ? (next ? 'Next: ' + fmt(next) : 'This year: ' + fmt(d)) : 'Date follows the Hindu calendar, so it moves each year.'}
      </p>
      <p style={{ margin: 0, font: 'var(--weight-regular) 15px/1.45 var(--font-latin)' }}>{whenText}{d && next ? '. This year it fell on ' + fmt(d) + '.' : ''}</p>
    </div>
  );
}
