/* The map views as a visible, labelled row, never hidden behind an icon or covered by a sheet (phase 3 rule 4).
   A radio group: one view at a time. Styled as the prototype's segmented row (docs/prototypes/type-atlas.html). */
import { MAP_LAYERS, type MapLayerId } from '../../lib/layers';
import './layers.css';

export function LayerRow({ value, onChange }: { value: MapLayerId; onChange: (id: MapLayerId) => void }) {
  const move = (e: React.KeyboardEvent, i: number) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const next = MAP_LAYERS[(i + d + MAP_LAYERS.length) % MAP_LAYERS.length];
    onChange(next.id);
    (e.currentTarget.parentElement?.children[MAP_LAYERS.indexOf(next)] as HTMLElement | undefined)?.focus();
  };
  return (
    <div className="k-layer-row" role="radiogroup" aria-label="Map views">
      {MAP_LAYERS.map((l, i) => {
        const on = l.id === value;
        return (
          <button key={l.id} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} className="k-layer-row__item" onClick={() => onChange(l.id)} onKeyDown={e => move(e, i)}>
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
