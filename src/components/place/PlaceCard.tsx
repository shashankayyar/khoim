/* The place card. Sits in a Sheet on phones or in the names panel on desktop, on the place's house colour.
   Order is fixed: Devanagari (largest), Romi, official spelling; then say it, sources, details.
   Missing names show PendingName; never a guess. Ported from design/components/place/PlaceCard.jsx. */
import { useState, type ReactNode } from 'react';
import { childCount, getPlace, whereLabel } from '../../data/khoim';
import type { Place, Recording } from '../../data/types';
import { tellUsNameHref } from '../../lib/mailto';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { SourceStatus } from '../core/SourceStatus';
import { VoiceClip } from '../layers/VoiceClip';
import { PendingName } from './PendingName';
import { SayIt } from './SayIt';
import './place.css';

const INK = 'var(--house-on)', PAPER = 'var(--house-bg)';

// TODO(copy): wording for a village the government lists but whose outline we do not have yet. Not in the design.
const NO_OUTLINE_NOTE = 'The outline is not available yet';

const Rule = () => <hr className="k-card__rule" aria-hidden="true" />;
function Row({ label, children }: { label: string; children: ReactNode }) {
  return <div className="k-card__row"><span className="k-card__label">{label}</span>{children}</div>;
}

function boundaryLine(p: Place): string {
  const code = p.lgd ? 'LGD code ' + p.lgd : '';
  const town = p.town ? '. Census town' : '';
  if (!p.boundarySource) return NO_OUTLINE_NOTE + (code ? '. ' + code : '') + town + '.';
  return (p.boundarySource === 'SOI' ? 'Survey of India' : 'Local Government Directory') + (code ? ', ' + code : '') + town + '.';
}

export interface PlaceCardProps {
  place: Place;
  /** Peek shows the names and two buttons. Expanded shows everything. */
  expanded?: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  onGoInside?: (id: string) => void;
  recordings?: Recording[];
  headingLevel?: 2 | 3;
}

export function PlaceCard({ place: p, expanded = false, onExpand, onClose, onGoInside, recordings, headingLevel = 2 }: PlaceCardProps) {
  const [showSrc, setShowSrc] = useState(false);
  const H = `h${headingLevel}` as const;
  const inside = p.level !== 'village' && !!onGoInside;
  const kids = childCount(p);
  const taluka = p.level === 'village' ? getPlace(p.parent) : null;
  return (
    <article className={expanded ? 'k-card is-expanded' : 'k-card'} aria-label={p.official}>
      <div className="k-card__frame">
        <div className="k-card__top">
          <span className="k-card__where">{whereLabel(p)}</span>
          {onClose && <IconButton icon="x" label="Close" tone="soft" ink={INK} size={44} onClick={onClose} />}
        </div>
        <H className="k-card__heading">
          {p.deva
            ? <span className="k-card__deva" lang="gom">{p.deva}</span>
            : <span className="k-card__official-head">{p.official}</span>}
        </H>
        {p.deva && (
          <div className="k-card__names">
            {p.romi ? <span className="k-card__romi" lang="gom-Latn">{p.romi}</span> : <span className="k-card__no-romi">Romi not recorded yet</span>}
            <span className="k-card__official">{p.official}</span>
          </div>
        )}
        {!p.deva && <PendingName label={p.pendingNote ? 'Spelling not settled yet' : 'Konkani name not recorded yet'} />}
      </div>

      {!expanded && (
        <div className={inside ? 'k-card__actions k-card__actions--two' : 'k-card__actions'}>
          <Button variant="outline" ink={INK} onClick={onExpand}>{p.say ? 'How to say it' : 'All names'}</Button>
          {inside && <Button ink={INK} paper={PAPER} iconAfter="arrow-right" onClick={() => onGoInside(p.id)}>Go inside</Button>}
        </div>
      )}

      {expanded && (
        <div className="k-card__more">
          {p.say ? (
            <Row label="Say it">
              <SayIt say={p.say} note={p.sayNote} reviewed={p.reviewed} />
              <VoiceClip recordings={recordings} />
            </Row>
          ) : (
            <Row label="Konkani name">
              <p className="k-card__body">{p.pendingNote || `Know what ${p.official} is called in Konkani? Tell us how your family says it.`}</p>
              <div className="k-card__tell">
                <Button ink={INK} paper={PAPER} icon="mail" href={tellUsNameHref({ official: p.official, taluka: taluka?.official, lgd: p.lgd })}>Tell us</Button>
              </div>
            </Row>
          )}
          <Rule />
          <Row label="Sources">
            <SourceStatus status={p.status} />
            {p.sourceNote && <p className="k-card__body">{p.sourceNote}</p>}
            {p.sources && <button type="button" className="k-card__disclose" aria-expanded={showSrc} onClick={() => setShowSrc(!showSrc)}>{showSrc ? 'Hide sources' : 'Where this comes from'}</button>}
            {showSrc && <p className="k-card__body">{p.sources}</p>}
          </Row>
          {p.alsoWritten && <><Rule /><Row label="Also written"><span className="k-card__other-deva" lang="gom">{p.alsoWritten.join(', ')}</span></Row></>}
          {p.marathi && <><Rule /><Row label="In Marathi"><span className="k-card__other-deva" lang="mr">{p.marathi}</span></Row></>}
          {p.officialNote && <><Rule /><Row label="Official spelling"><p className="k-card__body">{p.official}. {p.officialNote}.</p></Row></>}
          {p.hq && <><Rule /><Row label="Headquarters"><p className="k-card__body">{p.hq}</p></Row></>}
          {p.facts && <><Rule />{p.facts.map(f => <Row key={f} label="Worth knowing"><p className="k-card__body">{f}.</p></Row>)}</>}
          {p.level === 'village' && <><Rule /><Row label="Boundary"><p className="k-card__body">{boundaryLine(p)}</p></Row></>}
          {inside && (
            <div className="k-card__inside">
              <Button full ink={INK} paper={PAPER} iconAfter="arrow-right" onClick={() => onGoInside(p.id)}>{`Go inside, ${kids} ${p.level === 'taluka' ? 'villages' : 'talukas'}`}</Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
