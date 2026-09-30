import React from 'react';
import { getPlace, childrenOf, nameIn, houseOf } from '../data/khoim.js';
/* Sideways list of the places inside the current level. Swiping or focusing moves the highlight on the map. */
export function PlaceStrip({ parent, script = 'deva', active, onFocusPlace, onPick, style }) {
  const fp = getPlace(parent || 'goa');
  const items = childrenOf(parent);
  const village = fp && fp.level === 'taluka';
  const ref = React.useRef(null);
  const moved = React.useRef(false);
  const onScroll = () => { const el = ref.current; if (!el) return; if (!moved.current) return; const i = Math.round(el.scrollLeft / 152); const it = items[Math.max(0, Math.min(items.length - 1, i))]; if (it && it.id !== active && onFocusPlace) onFocusPlace(it.id); };
  const heading = nameIn(fp, script);
  return (
    <div style={{ display: 'grid', gap: 10, ...style }}>
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0 10px', padding: '0 var(--gutter)' }}>
        <span lang={heading.kind === 'deva' ? 'gom' : undefined} style={{ font: `var(--weight-strong) ${heading.kind === 'deva' ? 30 : 26}px/1.5 ${heading.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}` }}>{heading.text}</span>
        <span style={{ font: 'var(--weight-regular) 16px/1.4 var(--font-latin)', whiteSpace: 'nowrap' }}>{items.length} {village ? 'villages' : fp.level === 'state' ? 'districts' : 'talukas'}</span>
      </div>
      <ul ref={ref} onScroll={onScroll} onPointerDown={() => { moved.current = true; }} onWheel={() => { moved.current = true; }} onTouchStart={() => { moved.current = true; }} aria-label={'Places in ' + fp.official} style={{ listStyle: 'none', margin: 0, display: 'flex', gap: 10, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPaddingInline: 'var(--gutter)', padding: '4px var(--gutter) 8px', scrollbarWidth: 'none', touchAction: 'pan-x' }}>
        {items.map(it => {
          const hs = houseOf(it), on = it.id === active, n = nameIn(it, script);
          const bg = village ? 'var(--surface-raised)' : hs.bg, ink = village ? 'var(--text)' : hs.on;
          return (
            <li key={it.id} style={{ flex: '0 0 142px', scrollSnapAlign: 'start' }}>
              <button type="button" onClick={() => onPick && onPick(it.id)} onFocus={() => onFocusPlace && onFocusPlace(it.id)} aria-current={on || undefined}
                style={{ width: '100%', height: 100, borderRadius: 'var(--radius-l)', border: village ? '2px solid ' + (on ? 'var(--text)' : 'var(--line)') : 0, background: bg, color: ink, padding: village ? '8px 12px' : 5, cursor: 'pointer', textAlign: 'left',
                  transform: on ? 'translateY(-4px)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast)' }}>
                <span style={{ display: 'grid', alignContent: 'space-between', height: '100%', borderRadius: 'var(--radius-m)', border: village ? 0 : 'var(--trim-width) solid currentColor', padding: village ? 0 : '6px 10px' }}>
                  {village ? <span style={{ font: 'var(--weight-strong) 18px/1.25 var(--font-latin)' }}>{it.official}</span>
                    : <span lang={n.kind === 'deva' ? 'gom' : undefined} style={{ font: `var(--weight-strong) ${n.kind === 'deva' ? 24 : 18}px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}` }}>{n.text}</span>}
                  <span style={{ font: 'var(--weight-regular) 14px/1.3 var(--font-latin)' }}>{village ? 'Official name only' : (n.kind === 'official' ? (it.romi || '') : it.official)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
