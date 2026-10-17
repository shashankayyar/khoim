/* The place card for Goa, a district or a taluka. Since phase 3 a village has its own sheet
   (src/components/village/VillageSheet.tsx); the village parts below remain for any older caller.
   Sits in a Sheet on phones or docked on the right on desktop, on the place's house colour.
   Order is fixed: Devanagari (largest), Romi, official spelling; then say it, sources, details.
   Missing names show PendingName; never a guess. A name recorded in one script only leads with that script
   and says the other is not recorded yet (Romi only: since 4 October 2026, for names people send in). Ported from design/components/place/PlaceCard.jsx.

   Since 4 October 2026 the card also shows what people have sent about the place and a reviewer has allowed:
   recordings of the name under "Say it", and a row each for crops, food, music and landmarks. A row appears
   only when it has something in it. The layer that is switched on comes first.

   Phase 2 (design/components/village/VillageSheet.jsx): a village's card also carries where its name comes from,
   how sources have spelled it, its vaddos, distances, what it is known for, and every source as a link, in the
   design's order. A block with nothing in it does not show. A Devanagari form from the Gazetteer that nobody has
   checked is shown here only, marked "Needs review" (phase 2 rule 6); it never becomes the place's name elsewhere. */
import { Fragment, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { childCount, getPlace, whereLabel } from '../../data/khoim';
import { CONTACT_EMAIL } from '../../data/site';
import type { Place, VillageFacts } from '../../data/types';
import type { ContributionKind } from '../../lib/contribute';
import { LIVE_LAYERS, NOTE_LAYERS, kindOfLayer, recordingsOf, type LiveItem } from '../../lib/live';
import { correctionHref, tellUsNameHref } from '../../lib/mailto';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { SourceStatus } from '../core/SourceStatus';
import { LayerNotes } from '../layers/LayerNotes';
import { VoiceClip } from '../layers/VoiceClip';
import { PendingName } from './PendingName';
import { SayIt } from './SayIt';
import { Block, FactsGrid, KnownFor, MeaningBlock, SourceLinks, SpellingTimeline, VaddoList, Videos } from '../village/VillageBlocks';
import './place.css';

const INK = 'var(--house-on)', PAPER = 'var(--house-bg)';

/* For a village the government lists but whose outline we do not have. Not in the design; wording settled 1 Oct 2026. */
const NO_OUTLINE_NOTE = 'The outline is not available yet';

/* "2026-10-03" as "3 October 2026" */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function plainDate(iso: string | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m && MONTHS[Number(m[2]) - 1] ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : '';
}

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
  /** What is inside: a taluka's villages as a list; a district's talukas on the map (phase 3: the strip is gone). */
  onShowInside?: () => void;
  /** Opens the contribution form. With it, the card has one way in: a single button, and no email address
      (that lives on the About screen). When missing (the form is not switched on, or the page is being read
      without JavaScript), "Tell us" and "Suggest a correction" open an email instead. */
  onTell?: (kind?: ContributionKind) => void;
  /** What people have sent about this place and a reviewer has allowed (src/lib/live.ts). */
  live?: LiveItem[];
  /** The layer that is switched on. Its row comes first, and the collapsed card's button opens it. */
  layer?: string;
  headingLevel?: 1 | 2 | 3;
  /** For pages read without JavaScript: nothing needs a click. The sources are written out and the beats are text. */
  plain?: boolean;
  /** A village's phase 2 facts (scripts/village-facts.mjs). */
  facts?: VillageFacts | null;
  /** Share this place (phase 2): the share sheet on phones, a copied link on desktop. */
  onShare?: () => void;
}

export function PlaceCard({ place: p, expanded = false, onExpand, onClose, onShowInside, onTell, live = [], layer = 'names', headingLevel = 2, plain = false, facts = null, onShare }: PlaceCardProps) {
  const [showSrc, setShowSrc] = useState(false);
  /* An official name shown as the heading keeps its full size unless one of its words is wider than the card
     (Dharbandora on desktop): then it steps down until every word fits, rather than breaking mid-word. */
  const headRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = headRef.current;
    if (!el) return;
    el.style.fontSize = '';
    let size = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && size > 28) { size -= 2; el.style.fontSize = size + 'px'; }
  }, [p.official, expanded]);
  const H = `h${headingLevel}` as const;
  const sub = (headingLevel + 1) as 2 | 3 | 4;
  const inside = p.level !== 'village' && !!onShowInside;
  const insideLabel = `${childCount(p)} ${p.level === 'taluka' ? 'villages' : 'talukas'}`;
  const taluka = p.level === 'village' ? getPlace(p.parent) : null;
  /* a Konkani name in at least one script */
  const named = !!(p.deva || p.romi);
  const reviewedOn = plainDate(p.reviewedOn);
  const recordings = recordingsOf(live);
  /* the layer that is on, if this place has something in it */
  const lit = LIVE_LAYERS.find(l => l.id === layer);
  const litCount = lit ? live.filter(i => i.kind === kindOfLayer(lit.id)).length : 0;
  const notes = NOTE_LAYERS.map(l => ({ layer: l, items: live.filter(i => i.kind === kindOfLayer(l.id)) })).filter(n => n.items.length > 0);
  const first = notes.filter(n => n.layer.id === layer), rest = notes.filter(n => n.layer.id !== layer);
  /* a village with no reviewed name, whose Devanagari the Gazetteer gives: shown here only, as unchecked */
  const gazetteer = p.level === 'village' && !named ? facts?.gazetteerDeva ?? null : null;
  const status = gazetteer ? 'review' : p.status;
  /* Feast dates are worked out on the day the card is read. A page read without JavaScript shows the rule only. */
  const today = plain ? null : new Date();
  return (
    <article className={expanded ? 'k-card is-expanded' : 'k-card'} aria-label={p.official}>
     <div data-sheet-peek="1">
      <div className="k-card__frame">
        <div className="k-card__top">
          <span className="k-card__where">{whereLabel(p)}</span>
          {onClose && <IconButton icon="x" label="Close" tone="soft" ink={INK} size={44} onClick={onClose} />}
        </div>
        <H className="k-card__heading">
          {gazetteer ? <span className="k-card__deva" lang="gom">{gazetteer}</span> : p.deva
            ? <span className="k-card__deva" lang="gom">{p.deva}</span>
            : p.romi
              ? <span className="k-card__official-head" lang="gom-Latn">{p.romi}</span>
              : <span ref={headRef} className="k-card__official-head">{p.official}</span>}
        </H>
        {p.deva && (
          <div className="k-card__names">
            {p.romi ? <span className="k-card__romi" lang="gom-Latn">{p.romi}</span> : <span className="k-card__no-romi">Romi not recorded yet</span>}
            <span className="k-card__official">{p.official}</span>
          </div>
        )}
        {!p.deva && p.romi && (
          <div className="k-card__names">
            <span className="k-card__no-romi">Devanagari not recorded yet</span>
            <span className="k-card__official">{p.official}</span>
          </div>
        )}
        {gazetteer && (
          <>
            <div className="k-card__names">
              <span className="k-card__no-romi">Romi not recorded yet</span>
              <span className="k-card__official">{p.official}</span>
            </div>
            <span className="k-card__review"><SourceStatus status="review" />{expanded && <span className="k-card__deva-source">Devanagari as in the Gazetteer, 1979</span>}</span>
          </>
        )}
        {!named && !gazetteer && <PendingName label={p.pendingNote ? 'Spelling not settled yet' : 'Konkani name not recorded yet'} />}
      </div>

      {!expanded && (
        <div className={inside ? 'k-card__actions k-card__actions--two' : onShare && p.level === 'village' ? 'k-card__actions k-card__actions--share' : 'k-card__actions'}>
          {lit && litCount > 0
            ? <Button variant="outline" ink={INK} icon={lit.icon} onClick={onExpand}>{lit.label} ({litCount})</Button>
            : <Button variant="outline" ink={INK} onClick={onExpand}>{p.level === 'village' ? 'All about ' + p.official : p.say ? 'How to say it' : 'All names'}</Button>}
          {inside && <Button ink={INK} paper={PAPER} iconAfter={p.level === 'taluka' ? 'list' : 'chevron-down'} onClick={onShowInside}>{insideLabel}</Button>}
          {/* TODO(copy): "Share" is the design's */}
          {!inside && onShare && p.level === 'village' && <Button ink={INK} paper={PAPER} icon="share-2" onClick={onShare}>Share</Button>}
        </div>
      )}
     </div>

      {expanded && (
        <div className="k-card__more">
          {first.map(n => <Fragment key={n.layer.id}><Row level={sub} label={n.layer.label}><LayerNotes items={n.items} /></Row><Rule /></Fragment>)}
          {p.say ? (
            <Row level={sub} label="Say it">
              <SayIt say={p.say} note={p.sayNote} reviewed={p.reviewed} plain={plain} />
              <VoiceClip recordings={recordings} />
            </Row>
          ) : named ? null : (
            <Row level={sub} label="Konkani name">
              <p className="k-card__body">{p.pendingNote || `Know what ${p.official} is called in Konkani? Tell us how your family says it.`}</p>
              <div className="k-card__tell">
                <Button ink={INK} paper={PAPER} icon={onTell ? undefined : 'mail'} iconAfter={onTell ? 'arrow-right' : undefined}
                  href={onTell ? undefined : tellUsNameHref({ official: p.official, taluka: taluka?.official, lgd: p.lgd })} onClick={onTell ? () => onTell('name') : undefined}>
                  Tell us<span className="k-visually-hidden"> how your family says {p.official}</span>
                </Button>
              </div>
              {!onTell && <WriteTo />}
            </Row>
          )}
          {/* a place with no say-it guide can still have recordings of its name */}
          {!p.say && recordings.length > 0 && <>{!named && <Rule />}<Row level={sub} label="Say it"><VoiceClip recordings={recordings} /></Row></>}
          {/* what is missing, said plainly, so someone who knows it can send it with the button at the foot of the card */}
          {!p.deva && p.romi && <>{(p.say || recordings.length > 0) && <Rule />}<Row level={sub} label="Devanagari"><p className="k-card__body">Not recorded yet. Know how {p.romi} is written in Devanagari? Tell us.</p></Row></>}
          {facts?.meaning && <><Rule /><Block level={sub} label="Meaning"><MeaningBlock meaning={facts.meaning} /></Block></>}
          {facts?.spellings && <><Rule /><Block level={sub} label="Spellings"><SpellingTimeline spellings={facts.spellings} /></Block></>}
          {facts?.vaddos && <><Rule /><Block level={sub} label="Vaddos"><VaddoList vaddos={facts.vaddos} /></Block></>}
          {p.level === 'village' && p.km && <><Rule /><Block level={sub} label="Facts"><FactsGrid place={p} /></Block></>}
          {facts?.knownFor && <><Rule /><Block level={sub} label="Known for"><KnownFor items={facts.knownFor} today={today} /></Block></>}
          {facts?.videos && <><Rule /><Block level={sub} label="Video"><Videos videos={facts.videos} plain={plain} /></Block></>}
          <Rule />
          <Row level={sub} label="Sources">
            <SourceStatus status={status} />
            {/* a name that came through the form: who sent it, if they gave their name, and who reviewed it */}
            {p.level === 'village' && p.reviewer && <p className="k-card__body">{p.contributor ? `Added by ${p.contributor}.` : 'Sent in by a contributor.'} Reviewed by {p.reviewer}{reviewedOn ? ', ' + reviewedOn : ''}.</p>}
            {p.sourceNote && <p className="k-card__body">{p.sourceNote}</p>}
            {p.sources && !plain && <button type="button" className="k-card__disclose" aria-expanded={showSrc} onClick={() => setShowSrc(!showSrc)}>{showSrc ? 'Hide sources' : 'Where this comes from'}</button>}
            {p.sources && (showSrc || plain) && <p className="k-card__body">{p.sources}</p>}
            {facts && facts.sources.length > 0 && <SourceLinks sources={facts.sources} />}
          </Row>
          {p.alsoWritten && <><Rule /><Row level={sub} label="Also written"><span className="k-card__other-deva" lang="gom">{p.alsoWritten.join(', ')}</span></Row></>}
          {p.marathi && <><Rule /><Row level={sub} label="In Marathi"><span className="k-card__other-deva" lang="mr">{p.marathi}</span></Row></>}
          {p.officialNote && <><Rule /><Row level={sub} label="Official spelling"><p className="k-card__body">{p.official}. {p.officialNote}.</p></Row></>}
          {p.hq && <><Rule /><Row level={sub} label="Headquarters"><p className="k-card__body">{p.hq}</p></Row></>}
          {p.facts && <><Rule />{p.facts.map(f => <Row key={f} level={sub} label="Worth knowing"><p className="k-card__body">{f}.</p></Row>)}</>}
          {p.level === 'village' && <><Rule /><Row level={sub} label="Boundary"><p className="k-card__body">{boundaryLine(p)}</p></Row></>}
          {rest.map(n => <Fragment key={n.layer.id}><Rule /><Row level={sub} label={n.layer.label}><LayerNotes items={n.items} /></Row></Fragment>)}
          {onShare && (
            <>
              <Rule />
              <div className="k-card__row">
                {/* TODO(copy): "Share {place}" is the design's */}
                <Button full ink={INK} paper={PAPER} icon="share-2" onClick={onShare}>Share {p.official}</Button>
              </div>
            </>
          )}
          {/* On a place that has a Konkani name: the one way in to the form (wording in docs/copy.md).
              Without the form: a way to say the name is wrong, by email. Wording from docs/copy.md, email from docs/email-and-icons.md. */}
          {named && (
            <>
              <Rule />
              {onTell ? (
                <div className="k-card__row k-card__tell">
                  <Button variant="outline" ink={INK} iconAfter="arrow-right" onClick={() => onTell()}>
                    Add or correct something<span className="k-visually-hidden"> about {p.official}</span>
                  </Button>
                </div>
              ) : (
                <div className="k-card__row">
                  <a className="k-card__disclose" href={correctionHref({ official: p.official, taluka: taluka?.official, lgd: p.lgd })}>Suggest a correction<span className="k-visually-hidden"> for {p.official}</span></a>
                  <WriteTo />
                </div>
              )}
            </>
          )}
          {inside && (
            <div className="k-card__inside">
              {p.level === 'taluka'
                ? <Button full ink={INK} paper={PAPER} icon="list" onClick={onShowInside}>See all as a list</Button>
                : <Button full ink={INK} paper={PAPER} iconAfter="chevron-down" onClick={onShowInside}>{insideLabel}</Button>}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
