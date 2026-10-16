import React from 'react';
import { distanceKm, PANAJI, MARGAO, DISTANCE_IS_PLACEHOLDER } from '../data/khoim.js';
import { DataPending } from './DataPending.jsx';
import { PopulationDots } from './PopulationDots.jsx';
/* Census 2011 and practical facts. Missing values show as marked placeholders. */
export function VillageFacts({ place, style }) {
  if (!place) return null;
  if (place.noShape) { /* no polygon yet: no map-measured distance */ }
  const c = place.census || {};
  const cell = (label, value) => <div style={{ display: 'grid', gap: 4, alignContent: 'start', padding: '10px 0', borderTop: '1px solid color-mix(in srgb, currentColor 35%, transparent)' }}><span style={{ font: 'var(--weight-regular) 14px/1.3 var(--font-latin)' }}>{label}</span><span style={{ font: 'var(--weight-strong) 19px/1.35 var(--font-latin)' }}>{value}</span></div>;
  const pend = <DataPending label="To load" />;
  const est = km => DISTANCE_IS_PLACEHOLDER ? <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>{'about ' + km + ' km'}<span style={{ background: 'var(--surface-raised)', color: 'var(--text)', borderRadius: 'var(--radius-xs)', padding: '1px 7px', font: 'var(--weight-strong) 12px/1.4 var(--font-latin)' }}>Placeholder data</span></span> : km + ' km';
  const kmP = place.id === PANAJI || !place.lp ? null : distanceKm(place, PANAJI), kmM = place.id === MARGAO || !place.lp ? null : distanceKm(place, MARGAO);
  return (
    <div style={{ display: 'grid', gap: 4, ...style }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16 }}>
        {cell('People, Census 2011', c.population ? c.population.toLocaleString('en-IN') : pend)}
        {cell('Households', c.households ? c.households.toLocaleString('en-IN') : pend)}
        {cell('Village or Census Town', c.type || pend)}
        {cell('Panchayat', c.panchayat || pend)}
        {cell('PIN', c.pin || pend)}
        {cell('Nearest station', c.station || pend)}
        {kmP !== null && cell('To Panaji', c.kmPanaji ? c.kmPanaji + ' km' : est(kmP))}
        {kmM !== null && cell('To Margao', c.kmMargao ? c.kmMargao + ' km' : est(kmM))}
      </div>
      <span style={{ font: 'var(--weight-regular) 14px/1.45 var(--font-latin)', marginBottom: 6 }}>Distances are in a straight line.</span>
      <PopulationDots placeId={place.id} placeholder={!c.population} />
    </div>
  );
}
