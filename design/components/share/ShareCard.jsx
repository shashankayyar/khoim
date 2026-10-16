import React from 'react';
import { TALUKA_SHAPES, DISTRICT_SHAPES, VILLAGES } from '../data/goaGeo.js';
import { getPlace, houseOf, whereLabel, SITE } from '../data/khoim.js';
const SIZES = { og: [1200, 630], square: [1080, 1080], story: [1080, 1920] };
function shapeOf(p) {
  const d = p.level === 'village' ? (VILLAGES.find(v => 'v' + v.id === p.id) || {}).d : (TALUKA_SHAPES[p.id] || DISTRICT_SHAPES[p.id] || {}).d;
  if (!d) return null;
  const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number); let b = [1e9, 1e9, -1e9, -1e9];
  for (let i = 0; i < n.length - 1; i += 2) { b[0] = Math.min(b[0], n[i]); b[1] = Math.min(b[1], n[i + 1]); b[2] = Math.max(b[2], n[i]); b[3] = Math.max(b[3], n[i + 1]); }
  return { d, vb: (b[0] - 4) + ' ' + (b[1] - 4) + ' ' + (b[2] - b[0] + 8) + ' ' + (b[3] - b[1] + 8) };
}
/* Link preview (1200x630), square (1080) and story (1080x1920) cards. Made at build time, one per place. */
export function ShareCard({ place, format = 'og', style }) {
  const p = typeof place === 'string' ? getPlace(place) : place;
  if (!p) return null;
  const [W, H] = SIZES[format], hs = houseOf(p), sh = shapeOf(p);
  const og = format === 'og', story = format === 'story';
  const nameSize = og ? 112 : story ? 150 : 130;
  const names = (
    <div style={{ display: 'grid', gap: og ? 4 : 10, alignContent: og ? 'center' : 'end', minWidth: 0 }}>
      <span style={{ font: 'var(--weight-strong) ' + (og ? 30 : 40) + 'px/1.3 var(--font-latin)' }}>{whereLabel(p) + ', Goa'}</span>
      {p.deva ? <span lang="gom" style={{ font: 'var(--weight-strong) ' + nameSize + 'px/1.5 var(--font-deva)' }}>{p.deva}</span> : null}
      {p.romi ? <span lang="gom-Latn" style={{ font: 'var(--weight-strong) ' + nameSize + 'px/1.2 var(--font-latin)' }}>{p.romi}</span> : null}
      {p.deva || p.romi
        ? <span style={{ font: 'var(--weight-regular) ' + (og ? 44 : 56) + 'px/1.3 var(--font-latin)' }}>{p.official}</span>
        : <><span style={{ font: 'var(--weight-strong) ' + nameSize + 'px/1.2 var(--font-latin)' }}>{p.official}</span><span style={{ font: 'var(--weight-strong) ' + (og ? 34 : 44) + 'px/1.35 var(--font-latin)' }}>{p.devaUnreviewed ? 'Konkani name: help us check it' : 'Konkani name: help us find it'}</span></>}
    </div>
  );
  const shape = sh && <svg viewBox={sh.vb} preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ width: '100%', height: '100%', display: 'block' }}><path d={sh.d} fill="currentColor" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeLinejoin="round" /></svg>;
  const foot = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20 }}>
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '.3em', font: 'var(--weight-strong) ' + (og ? 40 : 52) + 'px/1.3 var(--font-latin)' }}><span lang="gom" style={{ fontFamily: 'var(--font-deva)', lineHeight: 1.5 }}>{SITE.deva}</span>{SITE.romi}</span>
      <span style={{ font: 'var(--weight-strong) ' + (og ? 36 : 46) + 'px/1 var(--font-latin)' }}>khoim.in</span>
    </div>
  );
  return (
    <div role="img" aria-label={(p.deva ? p.deva + ', ' : '') + (p.romi ? p.romi + ', ' : '') + p.official + '. Khoim, khoim.in'} style={{ width: W, height: H, background: hs.bg, color: hs.on, padding: og ? 24 : 36, boxSizing: 'border-box', flex: '0 0 auto', ...style }}>
      <div style={{ height: '100%', boxSizing: 'border-box', border: (og ? 5 : 6) + 'px solid currentColor', borderRadius: og ? 36 : 48, padding: og ? '36px 48px' : story ? '72px 64px' : '56px 60px', display: 'grid',
        gridTemplateColumns: og ? '300px minmax(0,1fr)' : '1fr', gridTemplateRows: og ? '1fr auto' : story ? '1fr auto auto' : '1fr auto auto', columnGap: 56, rowGap: story ? 56 : 36 }}>
        <div style={{ minHeight: 0, padding: og ? 0 : story ? '40px 80px' : '0 0 0 0', gridRow: og ? '1 / 2' : 'auto', justifySelf: og ? 'stretch' : 'start', width: og ? 'auto' : story ? '100%' : '44%' }}>{shape}</div>
        {names}
        <div style={{ gridColumn: og ? '1 / -1' : 'auto' }}>{foot}</div>
      </div>
    </div>
  );
}
