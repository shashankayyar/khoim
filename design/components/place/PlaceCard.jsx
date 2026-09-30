import React from 'react';
import { getPlace, whereLabel, houseOf, childrenOf, STATUS_TEXT } from '../data/khoim.js';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { SourceStatus } from '../core/SourceStatus.jsx';
import { SayIt } from './SayIt.jsx';
import { PendingName } from './PendingName.jsx';
import { VoiceClip } from '../layers/VoiceClip.jsx';

const Rule = () => <hr aria-hidden="true" style={{ border: 0, borderTop: '1px solid currentColor', opacity: .35, margin: 0 }} />;
function Row({ label, children }) {
  return <div style={{ display: 'grid', gap: 6, padding: '16px 0' }}><span style={{ font: 'var(--weight-strong) 14px/1.3 var(--font-latin)' }}>{label}</span>{children}</div>;
}

export function PlaceCard({ place, expanded = false, onExpand, onClose, onGoInside, onSuggest, recordings, headingLevel = 2, style }) {
  const p = typeof place === 'string' ? getPlace(place) : place;
  const [showSrc, setShowSrc] = React.useState(false);
  if (!p) return null;
  const hs = houseOf(p), ink = hs.on, paper = hs.bg;
  const H = 'h' + headingLevel;
  const kids = p.level !== 'village' ? childrenOf(p.id).length : 0;
  const inside = p.level !== 'village' && onGoInside;
  const body = { font: 'var(--weight-regular) var(--size-body)/1.5 var(--font-latin)', margin: 0 };
  return (
    <article aria-label={p.official} style={{ color: ink, display: 'grid', ...style }}>
      <div style={{ border: 'var(--trim-width) solid currentColor', borderRadius: 'var(--radius-xl)', padding: '14px 16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ font: 'var(--weight-strong) 15px/1.3 var(--font-latin)' }}>{whereLabel(p)}</span>
          {onClose && <IconButton icon="x" label="Close" tone="soft" ink={ink} size={44} onClick={onClose} />}
        </div>
        <H style={{ margin: 0 }}>
          {p.deva
            ? <span lang="gom" style={{ display: 'block', font: `var(--weight-strong) ${expanded ? 'var(--size-name-hero)' : 'var(--size-name-xl)'}/1.5 var(--font-deva)`, marginTop: 4, transition: 'font-size var(--dur-sheet) var(--ease-standard)' }}>{p.deva}</span>
            : <span style={{ display: 'block', font: `var(--weight-strong) ${expanded ? 64 : 48}px/1.25 var(--font-latin)`, margin: '8px 0 10px' }}>{p.official}</span>}
        </H>
        {p.deva && <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 14px' }}>
          {p.romi ? <span lang="gom-Latn" style={{ font: `var(--weight-strong) ${expanded ? 'var(--size-name-l)' : 'var(--size-name-m)'}/1.3 var(--font-latin)` }}>{p.romi}</span> : <span style={{ font: 'var(--weight-regular) 17px/1.4 var(--font-latin)' }}>Romi not recorded yet</span>}
          <span style={{ font: 'var(--weight-regular) 18px/1.3 var(--font-latin)' }}>{p.official}</span>
        </div>}
        {!p.deva && <PendingName ink={ink} label={p.pendingNote ? 'Spelling not settled yet' : 'Konkani name not recorded yet'} />}
      </div>

      {!expanded && <div style={{ display: 'grid', gridTemplateColumns: inside ? '1fr 1fr' : '1fr', gap: 10, marginTop: 14 }}>
        <Button variant="outline" ink={ink} onClick={onExpand}>{p.say ? 'How to say it' : 'All names'}</Button>
        {inside && <Button ink={ink} paper={paper} iconAfter="arrow-right" onClick={() => onGoInside(p.id)}>Go inside</Button>}
      </div>}

      {expanded && <div style={{ marginTop: 8, animation: 'khoim-rise var(--dur-base) var(--ease-out) both' }}>
        {p.say
          ? <Row label="Say it"><SayIt say={p.say} note={p.sayNote} reviewed={p.reviewed} ink={ink} paper={paper} />
              <VoiceClip recordings={recordings} ink={ink} paper={paper} placeName={p.official} /></Row>
          : <Row label="Konkani name">
              <p style={body}>{p.pendingNote || `Know what ${p.official} is called in Konkani? Tell us how your family says it.`}</p>
              {onSuggest && <div style={{ marginTop: 6 }}><Button ink={ink} paper={paper} icon="mail" onClick={onSuggest}>Tell us</Button></div>}
            </Row>}
        <Rule />
        <Row label="Sources">
          <SourceStatus status={p.status} color={ink} />
          {p.sourceNote && <p style={body}>{p.sourceNote}</p>}
          {p.sources && <button type="button" aria-expanded={showSrc} onClick={() => setShowSrc(!showSrc)} style={{ justifySelf: 'start', border: 0, background: 'transparent', color: ink, padding: '8px 0', font: 'var(--weight-strong) 16px/1.5 var(--font-latin)', textDecoration: 'underline', textUnderlineOffset: 4, cursor: 'pointer', textAlign: 'left' }}>{showSrc ? 'Hide sources' : 'Where this comes from'}</button>}
          {showSrc && <p style={body}>{p.sources}</p>}
        </Row>
        {p.alsoWritten && <><Rule /><Row label="Also written"><span lang="gom" style={{ font: 'var(--weight-regular) 22px/1.6 var(--font-deva)' }}>{p.alsoWritten.join(', ')}</span></Row></>}
        {p.marathi && <><Rule /><Row label="In Marathi"><span lang="mr" style={{ font: 'var(--weight-regular) 22px/1.6 var(--font-deva)' }}>{p.marathi}</span></Row></>}
        {p.officialNote && <><Rule /><Row label="Official spelling"><p style={body}>{p.official}. {p.officialNote}.</p></Row></>}
        {p.hq && <><Rule /><Row label="Headquarters"><p style={body}>{p.hq}</p></Row></>}
        {p.facts && <><Rule />{p.facts.map(f => <Row key={f} label="Worth knowing"><p style={body}>{f}.</p></Row>)}</>}
        {p.level === 'village' && <><Rule /><Row label="Boundary"><p style={body}>{p.boundarySource === 'SOI' ? 'Survey of India' : 'Local Government Directory'}{p.lgd ? ', LGD code ' + p.lgd : ''}{p.town ? '. Census town' : ''}.</p></Row></>}
        {inside && <div style={{ paddingTop: 8 }}><Button full ink={ink} paper={paper} iconAfter="arrow-right" onClick={() => onGoInside(p.id)}>{`Go inside, ${kids} ${p.level === 'taluka' ? 'villages' : 'talukas'}`}</Button></div>}
      </div>}
    </article>
  );
}
