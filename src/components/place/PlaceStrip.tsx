/* Sideways list of the places inside the current level: talukas on their house colours, villages as white tiles.
   Swiping or focusing a card moves the highlight on the map. This is also how keyboard and screen reader
   users reach villages, because the dots on the map are not buttons.
   Ported from design/components/place/PlaceStrip.jsx. */
import { useRef } from 'react';
import { childCount, childrenOf, getPlace, houseOf, nameIn } from '../../data/khoim';
import type { Script } from '../../data/types';
import './place.css';

/** Card width plus the gap, for working out which card a swipe has landed on. */
const STEP = 152;

export interface PlaceStripProps {
  /** District or taluka id, or null for all of Goa. */
  parent: string | null;
  script?: Script;
  /** The card to lift: the highlighted or selected place. */
  active?: string | null;
  onFocusPlace?: (id: string) => void;
  onPick?: (id: string) => void;
}

export function PlaceStrip({ parent, script = 'deva', active, onFocusPlace, onPick }: PlaceStripProps) {
  const fp = getPlace(parent || 'goa')!;
  const items = childrenOf(parent);
  const village = fp.level === 'taluka';
  const ref = useRef<HTMLUListElement>(null);
  const moved = useRef(false);
  const onScroll = () => {
    const el = ref.current;
    if (!el || !moved.current) return;
    const it = items[Math.max(0, Math.min(items.length - 1, Math.round(el.scrollLeft / STEP)))];
    if (it && it.id !== active) onFocusPlace?.(it.id);
  };
  const touched = () => { moved.current = true; };
  const heading = nameIn(fp, script);
  const count = fp.level === 'state' ? items.length : childCount(fp);
  return (
    <div className="k-strip">
      <div className="k-strip__head">
        <span className={heading.kind === 'deva' ? 'k-strip__name k-strip__name--deva' : 'k-strip__name'} lang={heading.kind === 'deva' ? 'gom' : undefined}>{heading.text}</span>
        <span className="k-strip__count">{count} {village ? 'villages' : fp.level === 'state' ? 'districts' : 'talukas'}</span>
      </div>
      <ul ref={ref} className="k-strip__list" aria-label={'Places in ' + fp.official} onScroll={onScroll} onPointerDown={touched} onWheel={touched} onTouchStart={touched}>
        {items.map(it => {
          const on = it.id === active, n = nameIn(it, script);
          /* A village with no Konkani name yet is a white tile showing its official name. */
          const plain = village && !it.deva;
          return (
            <li key={it.id} className="k-strip__item">
              <button type="button" className={'k-strip__card' + (plain ? ' k-strip__card--plain' : '') + (on ? ' is-on' : '')} data-house={plain ? undefined : houseOf(it).key}
                aria-current={on || undefined} onClick={() => onPick?.(it.id)} onFocus={() => onFocusPlace?.(it.id)}>
                <span className="k-strip__inner">
                  {plain
                    ? <span className="k-strip__official">{it.official}</span>
                    : <span className={n.kind === 'deva' ? 'k-strip__title k-strip__title--deva' : 'k-strip__title'} lang={n.kind === 'deva' ? 'gom' : undefined}>{n.text}</span>}
                  <span className="k-strip__sub">{plain ? 'Official name only' : (n.kind === 'official' ? (it.romi || '') : it.official)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
