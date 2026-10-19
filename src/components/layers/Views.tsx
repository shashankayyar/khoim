/* What goes with a map view, beside the "Show" control (phase 3, step 3; phase 4, B3): the ending buttons (Spelling endings only),
   the line that says what the colours mean, and the legend. Nothing here covers the map's controls. */
import { NAME_PARTS, legendOf, partCount, partOf, viewLine, type MapLayer } from '../../lib/layers';
import type { Script } from '../../data/types';
import endings from '../../data/generated/endings.json';
import { getPlace, pathOf } from '../../data/khoim';
import './layers.css';

/** -im 68, -em 98 ... Only in the Spelling endings view. */
export function EndingButtons({ layer, onChange }: { layer: MapLayer; onChange: (layer: MapLayer) => void }) {
  if (layer.id !== 'parts') return null;
  const part = partOf(layer);
  return (
    <div className="k-endings" role="radiogroup" aria-label="Spelling endings">
      {NAME_PARTS.map(x => (
        <button key={x.id} type="button" role="radio" aria-checked={x.id === part.id} className="k-endings__item" onClick={() => onChange({ ...layer, part: x.id })}>
          {x.label} <span className="k-endings__count">{partCount(x.id)}</span>
        </button>
      ))}
    </div>
  );
}

/** "68 of 384 villages end in “-im” in their official spelling." */
export function ViewLine({ layer, script, className = 'k-view-line' }: { layer: MapLayer; script: Script; className?: string }) {
  const l = viewLine(layer, script);
  return <p className={className}><strong>{l.strong}</strong>{l.rest}</p>;
}

/** One swatch per colour on the map, filled with the same token the map uses. */
export function Legend({ layer, script }: { layer: MapLayer; script: Script }) {
  const items = legendOf(layer, script);
  if (!items.length) return null;
  return (
    <ul className="k-legend">
      {items.map(it => (
        <li key={it.token} className="k-legend__item"><span className="k-legend__swatch" aria-hidden="true" style={{ background: `var(${it.token})` }} />{it.label}</li>
      ))}
    </ul>
  );
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const day = (iso: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso); return m ? `${+m[3]} ${SHORT_MONTHS[+m[2] - 1]} ${m[1]}` : iso; };

/** What the chosen ending tells you, only where a source in data/credited/ says so (phase 4, B6): "In Batim, “-im” is
    read as “place”." with the source's hedge and credit. No line for an ending no source explains. */
export function EndingNote({ layer }: { layer: MapLayer }) {
  if (layer.id !== 'parts') return null;
  const part = partOf(layer).id, lines = endings.filter(e => e.ending === part);
  if (!lines.length) return null;
  return (
    <p className="k-ending-note">
      {/* TODO(copy): the sentence that frames each reading */}
      {lines.map((e, i) => {
        const p = getPlace(e.id);
        return (
          <span key={e.id}>
            {i > 0 && ' '}In {p ? <a href={pathOf(p)}>{e.village}</a> : e.village}, {e.reading}{e.hedge ? ` (${e.hedge})` : ''}.{' '}
            <a href={e.url} target="_blank" rel="noopener">{e.credit}, {day(e.date)}</a>.
          </span>
        );
      })}
    </p>
  );
}
