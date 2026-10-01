/* The place card. Sits in a Sheet on phones or in the names panel on desktop, on the place's house colour.
   Order is fixed: Devanagari (largest), Romi, official spelling; then say it, sources, details.
   Missing names show PendingName; never a guess. Ported from design/components/place/PlaceCard.jsx. */
import { useState, type ReactNode } from 'react';
import { childCount, getPlace, whereLabel } from '../../data/khoim';
import { CONTACT_EMAIL } from '../../data/site';
import type { Place, Recording } from '../../data/types';
import { correctionHref, tellUsNameHref } from '../../lib/mailto';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { SourceStatus } from '../core/SourceStatus';
import { VoiceClip } from '../layers/VoiceClip';
import { PendingName } from './PendingName';
import { SayIt } from './SayIt';
import './place.css';

const INK = 'var(--house-on)', PAPER = 'var(--house-bg)';

/* For a village the government lists but whose outline we do not have. Not in the design; wording settled 1 Oct 2026. */
const NO_OUTLINE_NOTE = 'The outline is not available yet';

const Rule = () => <hr className="k-card__rule" aria-hidden="true" />;
/* One section of the card. Its label is a real heading, one level under the place's name, so the card can be
   read and skipped through by heading. */
function Row({ label, level, children }: { label: string; level: 2 | 3 | 4; children: ReactNode }) {
  const H = `h${level}` as const;
  return <div className="k-card__row"><H className="k-card__label">{label}</H>{children}</div>;
}

/* The address in plain sight wherever a button opens an email, for anyone whose phone or computer has no
   mail app set up. Wording from the About screen. */
const WriteTo = () => <p className="k-card__body k-card__write">Write to us at <strong>{CONTACT_EMAIL}</strong>.</p>;

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
  /** Puts the card away to show the strip of places inside this one. Leave out where the strip is already on screen. */
  onShowInside?: () => void;
  recordings?: Recording[];
  headingLevel?: 1 | 2 | 3;
  /** For pages read without JavaScript: nothing needs a click. The sources are written out and the beats are text. */
  plain?: boolean;
}

export function PlaceCard({ place: p, expanded = false, onExpand, onClose, onShowInside, recordings, headingLevel = 2, plain = false }: PlaceCardProps) {
  const [showSrc, setShowSrc] = useState(false);
  const H = `h${headingLevel}` as const;
  const sub = (headingLevel + 1) as 2 | 3 | 4;
  const inside = p.level !== 'village' && !!onShowInside;
  const insideLabel = `${childCount(p)} ${p.level === 'taluka' ? 'villages' : 'talukas'}`;
  const taluka = p.level === 'village' ? getPlace(p.parent) : null;
  return (
    <article className={expanded ? 'k-card is-expanded' : 'k-card'} aria-label={p.official}>
     <div data-sheet-peek="1">
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
          {inside && <Button ink={INK} paper={PAPER} iconAfter="chevron-down" onClick={onShowInside}>{insideLabel}</Button>}
        </div>
      )}
     </div>

      {expanded && (
        <div className="k-card__more">
          {p.say ? (
            <Row level={sub} label="Say it">
              <SayIt say={p.say} note={p.sayNote} reviewed={p.reviewed} plain={plain} />
              <VoiceClip recordings={recordings} />
            </Row>
          ) : (
            <Row level={sub} label="Konkani name">
              <p className="k-card__body">{p.pendingNote || `Know what ${p.official} is called in Konkani? Tell us how your family says it.`}</p>
              <div className="k-card__tell">
                <Button ink={INK} paper={PAPER} icon="mail" href={tellUsNameHref({ official: p.official, taluka: taluka?.official, lgd: p.lgd })}>
                  Tell us<span className="k-visually-hidden"> how your family says {p.official}</span>
                </Button>
              </div>
              <WriteTo />
            </Row>
          )}
          <Rule />
          <Row level={sub} label="Sources">
            <SourceStatus status={p.status} />
            {p.sourceNote && <p className="k-card__body">{p.sourceNote}</p>}
            {p.sources && !plain && <button type="button" className="k-card__disclose" aria-expanded={showSrc} onClick={() => setShowSrc(!showSrc)}>{showSrc ? 'Hide sources' : 'Where this comes from'}</button>}
            {p.sources && (showSrc || plain) && <p className="k-card__body">{p.sources}</p>}
          </Row>
          {p.alsoWritten && <><Rule /><Row level={sub} label="Also written"><span className="k-card__other-deva" lang="gom">{p.alsoWritten.join(', ')}</span></Row></>}
          {p.marathi && <><Rule /><Row level={sub} label="In Marathi"><span className="k-card__other-deva" lang="mr">{p.marathi}</span></Row></>}
          {p.officialNote && <><Rule /><Row level={sub} label="Official spelling"><p className="k-card__body">{p.official}. {p.officialNote}.</p></Row></>}
          {p.hq && <><Rule /><Row level={sub} label="Headquarters"><p className="k-card__body">{p.hq}</p></Row></>}
          {p.facts && <><Rule />{p.facts.map(f => <Row key={f} level={sub} label="Worth knowing"><p className="k-card__body">{f}.</p></Row>)}</>}
          {p.level === 'village' && <><Rule /><Row level={sub} label="Boundary"><p className="k-card__body">{boundaryLine(p)}</p></Row></>}
          {/* On a place that has a Konkani name: a way to say it is wrong. Wording from docs/copy.md, email from docs/email-and-icons.md. */}
          {p.deva && (
            <>
              <Rule />
              <div className="k-card__row">
                <a className="k-card__disclose" href={correctionHref({ official: p.official, taluka: taluka?.official, lgd: p.lgd })}>
                  Suggest a correction<span className="k-visually-hidden"> for {p.official}</span>
                </a>
                <WriteTo />
              </div>
            </>
          )}
          {inside && (
            <div className="k-card__inside">
              <Button full ink={INK} paper={PAPER} iconAfter="chevron-down" onClick={onShowInside}>{insideLabel}</Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
