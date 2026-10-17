/* What goes with a map view, beside the view row (phase 3, step 3): the ending buttons (Spelling endings only),
   the line that says what the colours mean, and the legend. Nothing here covers the map's controls. */
import { NAME_PARTS, legendOf, partCount, partOf, viewLine, type MapLayer } from '../../lib/layers';
import type { Script } from '../../data/types';
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
export function Legend({ layer }: { layer: MapLayer }) {
  const items = legendOf(layer);
  if (!items.length) return null;
  return (
    <ul className="k-legend">
      {items.map(it => (
        <li key={it.token} className="k-legend__item"><span className="k-legend__swatch" aria-hidden="true" style={{ background: `var(${it.token})` }} />{it.label}</li>
      ))}
    </ul>
  );
}
