/* What the map shows: one control for the views and the layers (phase 4, B3). Always visible, never behind an icon
   or under a sheet (phase 3 rule 4). A radio group: one choice at a time. Names and Spelling endings always; the
   data choices only with 10 or more entries, each with its count (src/lib/layers.ts, showOptions). */
import type { ShowOption } from '../../lib/layers';
import './layers.css';

export function ShowControl({ options, value, onChange }: { options: ShowOption[]; value: string; onChange: (id: string) => void }) {
  const move = (e: React.KeyboardEvent, i: number) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const j = (i + d + options.length) % options.length;
    onChange(options[j].id);
    (e.currentTarget.parentElement?.querySelectorAll('button')[j] as HTMLElement | undefined)?.focus();
  };
  return (
    <div className="k-show" role="radiogroup" aria-labelledby="k-show-label">
      {/* TODO(copy): "Show", the control's name */}
      <span id="k-show-label" className="k-show__label">Show</span>
      {options.map((o, i) => {
        const on = o.id === value;
        return (
          <button key={o.id} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} className="k-show__item" onClick={() => onChange(o.id)} onKeyDown={e => move(e, i)}>
            {o.label}{o.count !== undefined && <span className="k-show__count">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
