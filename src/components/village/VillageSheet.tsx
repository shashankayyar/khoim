/* A village's sheet (phase 3, docs/prototypes/type-atlas.html; docs/phase3-brief.md step 6).
   - Its outline, in its taluka's ink, as the picture beside the name. The name is the reviewed form in the chosen
     script, or the official spelling.
   - Official, देवनागरी and Romi listed together, with "not written yet" where there is none. A Devanagari form
     the Gazetteer gives and nobody has checked shows here only, marked "Needs review" with its note (phase 2 rule 6).
   - The ask, when a script is missing: it opens the contribution form (an email when the form is off).
   - Then what phase 2 added, each block only when it has something: say it and recordings, meaning, spellings,
     vaddos, distances, what it is known for (with the feast strip), video; then "Next to", with a button per
     neighbour that moves the map there; then sources, boundary, share and the way to correct it.
   On the page colour, not the house colour: the house colour is the outline. */
import { Fragment, type ReactNode } from 'react';
import { CONTACT_EMAIL } from '../../data/site';
import { getPlace, nameIn, whereLabel } from '../../data/khoim';
import type { Place, Script, VillageFacts } from '../../data/types';
import type { ContributionKind } from '../../lib/contribute';
import { NOTE_LAYERS, kindOfLayer, recordingsOf, type LiveItem } from '../../lib/live';
import { correctionHref, tellUsNameHref } from '../../lib/mailto';
import { pathOf } from '../../data/khoim';
import { Button } from '../core/Button';
import { IconButton } from '../core/IconButton';
import { SourceStatus } from '../core/SourceStatus';
import { LayerNotes } from '../layers/LayerNotes';
import { VoiceClip } from '../layers/VoiceClip';
import { SayIt } from '../place/SayIt';
import { Block, FactsGrid, KnownFor, MeaningBlock, SourceLinks, SpellingTimeline, VaddoList, Videos } from './VillageBlocks';
import './village.css';

const INK = 'var(--text)', PAPER = 'var(--surface-raised)';
/* Approved in docs/phase3-brief.md. */
const NOT_YET = 'not written yet';
const ask = (official: string) => <><strong>Do you know how {official} is said at home?</strong> Record it or write it in either script, and it goes on the map with your name.</>;
/* For a village the government lists but whose outline we do not have. Wording settled 1 Oct 2026. */
const NO_OUTLINE_NOTE = 'The outline is not available yet';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function plainDate(iso: string | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m && MONTHS[Number(m[2]) - 1] ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : '';
}
function boundaryLine(p: Place): string {
  const code = p.lgd ? 'LGD code ' + p.lgd : '';
  const town = p.town ? '. Census town' : '';
  if (!p.boundarySource) return NO_OUTLINE_NOTE + (code ? '. ' + code : '') + town + '.';
  return (p.boundarySource === 'SOI' ? 'Survey of India' : 'Local Government Directory') + (code ? ', ' + code : '') + town + '.';
}

const Rule = () => <hr className="k-card__rule" aria-hidden="true" />;
function Row({ label, level, children }: { label: string; level: 2 | 3 | 4; children: ReactNode }) {
  const H = `h${level}` as const;
  return <div className="k-card__row"><H className="k-card__label">{label}</H>{children}</div>;
}
/* The address in plain sight wherever a button opens an email. Wording from the About screen. */
const WriteTo = () => <p className="k-card__body k-card__write">Write to us at <strong>{CONTACT_EMAIL}</strong>.</p>;

/** The village's outline, filling a square, in its taluka's ink. */
function Outline({ d, box, house }: { d: string; box: [number, number, number, number]; house: string }) {
  const [x0, y0, x1, y1] = box, w = x1 - x0, h = y1 - y0, s = Math.max(w, h), pad = s * 0.08;
  return (
    <svg className="k-vsheet__outline" viewBox={`${x0 + w / 2 - s / 2 - pad} ${y0 + h / 2 - s / 2 - pad} ${s + 2 * pad} ${s + 2 * pad}`} aria-hidden="true">
      <path d={d} style={{ fill: `var(--map-ink-${house})` }} />
    </svg>
  );
}

export interface VillageSheetProps {
  place: Place;
  /** The chosen script: the big name follows it. */
  script: Script;
  /** The village's outline, once the outlines have loaded. */
  outline?: string | null;
  facts?: VillageFacts | null;
  live?: LiveItem[];
  /** The layer people add to that is switched on: its row comes first. */
  layer?: string;
  headingLevel?: 1 | 2 | 3;
  onClose?: () => void;
  /** Opens the contribution form. Without it the ask and the correction open an email. */
  onTell?: (kind?: ContributionKind) => void;
  /** A neighbour's button: open it and move the map there. */
  onPick?: (id: string) => void;
  onShare?: () => void;
  /** For pages read without JavaScript: neighbours are links, the beats are text. */
  plain?: boolean;
}

export function VillageSheet({ place: p, script, outline, facts = null, live = [], layer = 'names', headingLevel = 2, onClose, onTell, onPick, onShare, plain = false }: VillageSheetProps) {
  const H = `h${headingLevel}` as const;
  const sub = (headingLevel + 1) as 2 | 3 | 4;
  const taluka = getPlace(p.parent);
  const head = nameIn(p, script);
  const named = !!(p.deva || p.romi);
  /* a Devanagari form from the Gazetteer that nobody has checked: here only, labelled */
  const gazetteer = !p.deva ? facts?.gazetteerDeva ?? null : null;
  const status = p.deva || p.romi ? p.status : gazetteer ? 'review' : p.status;
  const recordings = recordingsOf(live);
  const notes = NOTE_LAYERS.map(l => ({ layer: l, items: live.filter(i => i.kind === kindOfLayer(l.id)) })).filter(n => n.items.length > 0);
  const first = notes.filter(n => n.layer.id === layer), rest = notes.filter(n => n.layer.id !== layer);
  const reviewedOn = plainDate(p.reviewedOn);
  const today = plain ? null : new Date();
  const nbs = (p.map?.nb ?? []).map(id => getPlace(id)).filter((x): x is Place => !!x);
  const mail = { official: p.official, taluka: taluka?.official, lgd: p.lgd };
  return (
    <article className="k-card k-vsheet is-expanded" aria-label={p.official}>
      <div data-sheet-peek="1">
        <div className="k-card__top">
          <span className="k-card__where">{whereLabel(p)}</span>
          {onClose && <IconButton icon="x" label="Close" tone="soft" ink={INK} size={44} onClick={onClose} />}
        </div>
        <div className={outline && p.map ? 'k-vsheet__hero' : 'k-vsheet__hero k-vsheet__hero--text'}>
          {outline && p.map && <Outline d={outline} box={p.map.b} house={p.house} />}
          <div className="k-vsheet__names">
            <H className={head.kind === 'deva' ? 'k-vsheet__name k-vsheet__name--deva' : 'k-vsheet__name'} lang={head.kind === 'deva' ? 'gom' : head.kind === 'romi' ? 'gom-Latn' : undefined}>{head.text}</H>
            <dl className="k-vsheet__forms">
              <div><dt>Official</dt><dd>{p.official}</dd></div>
              <div>
                <dt lang="gom">देवनागरी</dt>
                {p.deva ? <dd className="k-vsheet__deva" lang="gom">{p.deva}</dd>
                  : gazetteer ? <dd><span className="k-vsheet__deva" lang="gom">{gazetteer}</span><span className="k-vsheet__review"><SourceStatus status="review" /><span>Devanagari as in the Gazetteer, 1979</span></span></dd>
                  : <dd className="k-vsheet__missing">{NOT_YET}</dd>}
              </div>
              <div><dt>Romi</dt>{p.romi ? <dd lang="gom-Latn">{p.romi}</dd> : <dd className="k-vsheet__missing">{NOT_YET}</dd>}</div>
            </dl>
          </div>
        </div>
      </div>

      <div className="k-card__more">
        {(!p.deva || !p.romi) && (
          <>
            {onTell
              ? <button type="button" className="k-vsheet__ask" onClick={() => onTell()}>{ask(p.official)}</button>
              : <a className="k-vsheet__ask" href={tellUsNameHref(mail)}>{ask(p.official)}</a>}
            {!onTell && <WriteTo />}
          </>
        )}
        {first.map(n => <Fragment key={n.layer.id}><Rule /><Row level={sub} label={n.layer.label}><LayerNotes items={n.items} /></Row></Fragment>)}
        {p.say && <><Rule /><Row level={sub} label="Say it"><SayIt say={p.say} note={p.sayNote} reviewed={p.reviewed} plain={plain} /><VoiceClip recordings={recordings} /></Row></>}
        {!p.say && recordings.length > 0 && <><Rule /><Row level={sub} label="Say it"><VoiceClip recordings={recordings} /></Row></>}
        {facts?.meaning && <><Rule /><Block level={sub} label="Meaning"><MeaningBlock meaning={facts.meaning} /></Block></>}
        {facts?.spellings && <><Rule /><Block level={sub} label="Spellings"><SpellingTimeline spellings={facts.spellings} /></Block></>}
        {facts?.vaddos && <><Rule /><Block level={sub} label="Vaddos"><VaddoList vaddos={facts.vaddos} /></Block></>}
        {p.km && <><Rule /><Block level={sub} label="Facts"><FactsGrid place={p} /></Block></>}
        {facts?.knownFor && <><Rule /><Block level={sub} label="Known for"><KnownFor items={facts.knownFor} today={today} /></Block></>}
        {facts?.videos && <><Rule /><Block level={sub} label="Video"><Videos videos={facts.videos} plain={plain} /></Block></>}
        {nbs.length > 0 && (
          <>
            <Rule />
            <Row level={sub} label="Next to">
              <ul className="k-vsheet__next">
                {nbs.map(nb => {
                  const n = nameIn(nb, script), deva = n.kind === 'deva';
                  const label = <span lang={deva ? 'gom' : undefined} className={deva ? 'k-vsheet__deva' : undefined}>{n.text}</span>;
                  return (
                    <li key={nb.id}>
                      {plain || !onPick
                        ? <a className="k-vsheet__nb" href={pathOf(nb)}>{label}</a>
                        : <button type="button" className="k-vsheet__nb" onClick={() => onPick(nb.id)}>{label}</button>}
                    </li>
                  );
                })}
              </ul>
            </Row>
          </>
        )}
        <Rule />
        <Row level={sub} label="Sources">
          <SourceStatus status={status} />
          {/* a name that came through the form: who sent it, if they gave their name, and who reviewed it */}
          {p.reviewer && <p className="k-card__body">{p.contributor ? `Added by ${p.contributor}.` : 'Sent in by a contributor.'} Reviewed by {p.reviewer}{reviewedOn ? ', ' + reviewedOn : ''}.</p>}
          {facts && facts.sources.length > 0 && <SourceLinks sources={facts.sources} />}
        </Row>
        <Rule />
        <Row level={sub} label="Boundary"><p className="k-card__body">{boundaryLine(p)}</p></Row>
        {rest.map(n => <Fragment key={n.layer.id}><Rule /><Row level={sub} label={n.layer.label}><LayerNotes items={n.items} /></Row></Fragment>)}
        {onShare && (
          <>
            <Rule />
            {/* TODO(copy): "Share {place}" is the design's */}
            <div className="k-card__row"><Button full ink={INK} paper={PAPER} icon="share-2" onClick={onShare}>Share {p.official}</Button></div>
          </>
        )}
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
                <a className="k-card__disclose" href={correctionHref(mail)}>Suggest a correction<span className="k-visually-hidden"> for {p.official}</span></a>
                <WriteTo />
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
