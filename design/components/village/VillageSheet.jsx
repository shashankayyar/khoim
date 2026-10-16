import React from 'react';
import { getPlace, whereLabel, houseOf, villageFacts } from '../data/khoim.js';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Icon } from '../core/Icon.jsx';
import { SourceStatus } from '../core/SourceStatus.jsx';
import { SayIt } from '../place/SayIt.jsx';
import { PendingName } from '../place/PendingName.jsx';
import { MeaningBlock } from './MeaningBlock.jsx';
import { NameSplit } from './NameSplit.jsx';
import { SpellingTimeline } from './SpellingTimeline.jsx';
import { VaddoList } from './VaddoList.jsx';
import { VillageFacts } from './VillageFacts.jsx';
import { KnownFor } from './KnownFor.jsx';
import { VideoFacade } from './VideoFacade.jsx';

function Block({ label, children }) {
  return <section style={{ display: 'grid', gap: 10, padding: '18px 0', borderTop: '1px solid color-mix(in srgb, currentColor 35%, transparent)' }}>
    <h3 style={{ margin: 0, font: 'var(--weight-strong) 15px/1.3 var(--font-latin)' }}>{label}</h3>{children}</section>;
}
const LGD = { title: 'Local Government Directory, Government of India', url: 'https://lgdirectory.gov.in/' };
function collectSources(p, f) {
  if (f && f.sources) return f.sources;
  const out = [LGD], seen = new Set([LGD.title]);
  const add = (t, url) => { if (t && !seen.has(t)) { seen.add(t); out.push({ title: t, url: url || null }); } };
  if (p.devaSource) add(p.devaSource);
  if (f) {
    (f.spellings && f.spellings.items || []).forEach(i => add(i.sourceTitle));
    (f.meaning && f.meaning.readings || []).forEach(r => add(r.source));
    if (f.split) add(f.split.source);
    if (f.vaddos) add(f.vaddos.source);
    (f.knownFor || []).forEach(k => add(k.source));
    if (f.video) add(f.video.channel + ', ' + f.video.title, f.video.url);
  }
  return out;
}
/* Village sheet. Fixed order; a block with no data does not render. */
export function VillageSheet({ place, expanded = false, recordings, today, onExpand, onClose, onShare, onSuggest, onRecord, onPickPlace, headingLevel = 2, style }) {
  const p = typeof place === 'string' ? getPlace(place) : place;
  const [playing, setPlaying] = React.useState(false);
  if (!p) return null;
  const f = villageFacts(p) || {};
  const hs = houseOf(p), ink = hs.on, paper = hs.bg, H = 'h' + headingLevel;
  const rec = recordings && recordings.length ? recordings[0] : null;
  const where = whereLabel(p);
  const devaShown = p.deva || p.devaUnreviewed;
  return (
    <article aria-label={p.official} style={{ color: ink, display: 'grid', '--sheet-bg': paper, ...style }}>
      <div style={{ border: 'var(--trim-width) solid currentColor', borderRadius: 'var(--radius-xl)', padding: expanded ? '12px 16px 16px' : '8px 14px 12px', display: 'grid', gap: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ font: 'var(--weight-strong) 15px/1.3 var(--font-latin)' }}>{where}</span>
          {onClose && <IconButton icon="x" label="Close" tone="soft" ink={ink} size={44} onClick={onClose} />}
        </div>
        <H style={{ margin: 0 }}>
          {devaShown ? <span lang="gom" style={{ display: 'block', font: 'var(--weight-strong) ' + (expanded ? 'var(--size-name-hero)' : '44px') + '/1.5 var(--font-deva)', transition: 'font-size var(--dur-sheet) var(--ease-standard)' }}>{devaShown}</span>
            : <span style={{ display: 'block', font: 'var(--weight-strong) ' + (expanded ? 60 : 46) + 'px/1.25 var(--font-latin)', margin: '6px 0 8px' }}>{p.official}</span>}
        </H>
        {devaShown && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', alignItems: 'baseline' }}>
          {p.romi ? <span lang="gom-Latn" style={{ font: 'var(--weight-strong) var(--size-name-m)/1.3 var(--font-latin)' }}>{p.romi}</span>
            : <span style={{ font: 'var(--weight-strong) 15px/1.35 var(--font-latin)', border: 'var(--placeholder-border)', borderRadius: 'var(--radius-s)', padding: '6px 10px', justifySelf: 'start' }}>Romi not recorded yet</span>}
          <span style={{ font: 'var(--weight-regular) 20px/1.3 var(--font-latin)' }}>{p.official}</span>
        </div>}
        {!devaShown && <PendingName ink={ink} label="Konkani name not recorded yet" />}
        {p.alsoKnownAs && <span style={{ font: 'var(--weight-regular) 16px/1.4 var(--font-latin)' }}>{'Also written ' + p.alsoKnownAs}</span>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: expanded ? 10 : 6, flexWrap: 'wrap' }}>
          <span style={{ display: 'grid', gap: 2 }}><SourceStatus status={p.status} color={ink} size={16} />{p.devaSource && expanded && <span style={{ font: 'var(--weight-regular) 14px/1.4 var(--font-latin)' }}>{'Devanagari as in the ' + p.devaSource}</span>}</span>
          {rec && <button type="button" aria-pressed={playing} onClick={() => setPlaying(!playing)} aria-label={(playing ? 'Pause ' : 'Play ') + rec.speaker + ', ' + rec.village}
            style={{ height: 48, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 14px 0 6px', borderRadius: 'var(--radius-m)', border: 0, background: ink, color: paper, cursor: 'pointer', font: 'var(--weight-strong) 15px/1 var(--font-latin)' }}>
            <span style={{ width: 36, height: 36, display: 'grid', placeItems: 'center' }}><Icon name={playing ? 'pause' : 'play'} size={20} /></span>{rec.speaker}</button>}
        </div>
      </div>

      {!expanded && <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginTop: 12 }}>
        <Button variant="outline" ink={ink} onClick={onExpand}>{'All about ' + p.official}</Button>
        {onShare && <Button ink={ink} paper={paper} icon="share-2" onClick={onShare}>Share</Button>}
      </div>}

      {expanded && <div style={{ marginTop: 8, animation: 'khoim-rise var(--dur-base) var(--ease-out) both' }}>
        <Block label="Say it">
          {p.say ? <SayIt say={p.say} note={p.sayNote} reviewed={p.reviewed} ink={ink} paper={paper} />
            : <div style={{ display: 'grid', gap: 10 }}><p style={{ margin: 0, font: 'var(--weight-strong) 18px/1.45 var(--font-latin)' }}>{'Know how ' + p.official + ' is said? Tell us.'}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><Button size="m" ink={ink} paper={paper} icon="mic" onClick={onRecord}>Record it</Button><Button size="m" variant="outline" ink={ink} onClick={onSuggest}>Write it down</Button></div></div>}
        </Block>
        {f.meaning && <Block label="Meaning"><MeaningBlock meaning={f.meaning} /></Block>}
        {f.split && <Block label="Name split"><NameSplit split={f.split} onPickPlace={onPickPlace} /></Block>}
        {f.spellings && <Block label={f.spellings.ordered ? 'Spellings over time' : 'Spellings'}><SpellingTimeline spellings={f.spellings} /></Block>}
        {f.vaddos && <Block label="Vaddos"><VaddoList vaddos={f.vaddos} /></Block>}
        <Block label="Facts"><VillageFacts place={p} /></Block>
        {f.knownFor && <Block label="Known for"><KnownFor items={f.knownFor} today={today} /></Block>}
        {f.video && <Block label="Video"><VideoFacade video={f.video} /></Block>}
        <Block label="Sources"><ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 6, font: 'var(--weight-regular) 15px/1.5 var(--font-latin)' }}>{collectSources(p, f).map(s => <li key={s.title}>{s.url ? <a href={s.url} target="_blank" rel="noopener" style={{ color: 'inherit', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 4, display: 'inline-block', padding: '6px 0' }}>{s.title}</a> : <span>{s.title} <span style={{ fontWeight: 600 }}>(link to add)</span></span>}</li>)}</ul></Block>
        <div style={{ display: 'grid', gap: 10, paddingTop: 18, borderTop: '1px solid color-mix(in srgb, currentColor 35%, transparent)' }}>
          {onShare && <Button full ink={ink} paper={paper} icon="share-2" onClick={onShare}>{'Share ' + p.official}</Button>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Button variant="outline" ink={ink} icon="mail" onClick={onSuggest}>Tell us</Button>
            <Button variant="outline" ink={ink} icon="mic" onClick={onRecord}>Record the name</Button>
          </div>
        </div>
      </div>}
    </article>
  );
}
