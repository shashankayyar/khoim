/* The phase 2 blocks of a village's sheet, in the design's order after "Say it": Meaning, Spellings, Vaddos, Facts,
   Known for. Ported from design/components/village/*.jsx. A block with nothing in it does not render (Part B: where
   data is still missing the block is hidden, never shown as a placeholder). Every claim carries its source. */
import type { ReactNode } from 'react';
import type { KnownForItem, Place, VillageFacts } from '../../data/types';
import { longDate, nextFeastDate, upcomingMonths } from '../../lib/feasts';
import { Icon } from '../core/Icon';
import type { IconName } from '../core/iconPaths';
import './village.css';

const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1) + (/[.!?]$/.test(s) ? '' : '.');

/** One block, its label a real heading one level under the place's name. */
export function Block({ label, level, children }: { label: string; level: 2 | 3 | 4; children: ReactNode }) {
  const H = `h${level}` as const;
  return <section className="k-vblock"><H className="k-card__label">{label}</H>{children}</section>;
}

/** What the name means. Competing readings sit side by side at the same size, each with its own credit. */
export function MeaningBlock({ meaning }: { meaning: NonNullable<VillageFacts['meaning']> }) {
  const two = meaning.readings.length > 1;
  return (
    <div className="k-meaning">
      {meaning.differ && <span className="k-meaning__kind">Sources differ</span>}
      <div className={two ? 'k-meaning__readings k-meaning__readings--two' : 'k-meaning__readings'}>
        {meaning.readings.map(r => (
          <div className="k-meaning__reading" key={r.credit + r.text}>
            <span className="k-meaning__text">{r.text}.{r.hedge && ' ' + sentence(r.hedge)}</span>
            <span className="k-vsmall">{r.credit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** How sources have spelled the name, as a small line with stops. */
export function SpellingTimeline({ spellings }: { spellings: NonNullable<VillageFacts['spellings']> }) {
  return (
    <div className="k-spellings">
      <ol className="k-spellings__list">
        {spellings.items.map((it, i) => (
          <li key={i} className="k-spellings__item">
            <span className="k-spellings__stop" aria-hidden="true" />
            <span className="k-spellings__text">
              <span className={it.lang ? 'k-spellings__form k-spellings__form--deva' : 'k-spellings__form'} lang={it.lang}>{it.form}</span>
              <span className="k-vsmall">{it.source}{it.note ? ', ' + it.note : ''}</span>
            </span>
          </li>
        ))}
      </ol>
      <span className="k-vsmall">Columns of the 1970 spelling list in the Gazetteer of Goa, Daman and Diu, 1979.{spellings.page ? ` Page ${spellings.page}.` : ''}</span>
    </div>
  );
}

/** Vaddos are a list, never shapes: their only boundaries are electoral wards. */
export function VaddoList({ vaddos }: { vaddos: NonNullable<VillageFacts['vaddos']> }) {
  return (
    <div className="k-vaddos">
      <ul className="k-vaddos__list">{vaddos.items.map(v => <li key={v}>{v}</li>)}</ul>
      <span className="k-vsmall">{`${vaddos.items.length} vaddos listed in the ${vaddos.source}. We do not draw their edges.`}</span>
    </div>
  );
}

/** Straight-line distances from our own outlines (phase 2 rule 7). Census figures join them with A2. */
export function FactsGrid({ place }: { place: Place }) {
  const [panaji, margao] = place.km ?? [null, null];
  if (panaji == null && margao == null) return null;
  return (
    <div className="k-facts">
      <dl className="k-facts__grid">
        {panaji != null && <div className="k-facts__cell"><dt>To Panaji</dt><dd>{panaji} km</dd></div>}
        {margao != null && <div className="k-facts__cell"><dt>To Margao</dt><dd>{margao} km</dd></div>}
      </dl>
      <span className="k-vsmall">Distances are in a straight line.</span>
    </div>
  );
}

const M = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
/** A 12-month strip with the next date of a feast. A lunar date marks its months, dashed, and says it moves. */
function FeastStrip({ item, today }: { item: KnownForItem; today: Date | null }) {
  const when = item.when!, lunar = 'lunar' in when;
  const next = today ? nextFeastDate(when, today) : null;
  const months = today || lunar ? upcomingMonths(when, today ?? new Date(0)) : [];
  return (
    <div className="k-feast">
      <div className="k-feast__strip" aria-hidden="true">
        {M.map((m, i) => <span key={i} className={months.includes(i + 1) ? (lunar ? 'is-lunar' : 'is-on') : undefined}>{m}</span>)}
      </div>
      <p className="k-feast__when">
        {item.whenText}.{' '}
        {lunar ? 'Lunar date, so it moves each year.' : next ? `Next: ${longDate(next)}.` : null}
      </p>
    </div>
  );
}

/** Monuments, GI products, parish feasts, zatras, festivals: the same glyph as the map mark. */
export function KnownFor({ items, today }: { items: KnownForItem[]; today: Date | null }) {
  return (
    <ul className="k-known">
      {items.map(it => (
        <li key={it.kind + it.title} className="k-known__item">
          <span className="k-known__glyph" aria-hidden="true"><Icon name={it.icon as IconName} size={20} /></span>
          <div className="k-known__text">
            <span className="k-known__title">{it.title}</span>
            {it.detail && <span className="k-known__detail">{it.detail}</span>}
            {it.when && <FeastStrip item={it} today={today} />}
            <span className="k-vsmall">{it.source}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Every source behind the sheet, each once, as a link. A missing link says so; it is never made up. */
export function SourceLinks({ sources }: { sources: VillageFacts['sources'] }) {
  return (
    <ul className="k-vsources">
      {sources.map(s => (
        <li key={s.title}>
          {s.url ? <a href={s.url} target="_blank" rel="noopener">{s.title}</a> : <span>{s.title} <strong>(link to add)</strong></span>}
        </li>
      ))}
    </ul>
  );
}
