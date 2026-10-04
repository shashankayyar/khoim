import type { LiveItem } from '../../lib/live';
import './layers.css';

export interface LayerNotesProps {
  /** What people have sent about this place for one layer, already allowed by a reviewer. */
  items: LiveItem[];
}

/** One layer's notes on the place card: each thing as it was allowed, with the contributor's name if they gave one. */
export function LayerNotes({ items }: LayerNotesProps) {
  return (
    <ul className="k-notes">
      {items.map(i => {
        const deva = i.script === 'deva' || i.script === 'mixed';
        return (
          <li key={i.id} className="k-note">
            <span className={deva ? 'k-note__text k-note__text--deva' : 'k-note__text'} lang={i.script === 'deva' ? 'gom' : undefined}>{i.text}</span>
            {i.by && <span className="k-note__by">Added by {i.by}</span>}
          </li>
        );
      })}
    </ul>
  );
}
