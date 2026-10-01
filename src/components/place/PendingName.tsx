import type { CSSProperties } from 'react';
import './place.css';

export interface PendingNameProps {
  label?: string;
}

/** A name we do not have yet, drawn as an oyster-shell (carepa) window: panes of light, no glass. Never a guess. */
export function PendingName({ label = 'Konkani name not recorded yet' }: PendingNameProps) {
  return (
    <div className="k-pending" role="note">
      <div className="k-pending__panes" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i} style={{ '--pane-delay': `${(i % 8) * 0.14 + Math.floor(i / 8) * 0.35}s` } as CSSProperties} />
        ))}
      </div>
      <span className="k-pending__center"><span className="k-pending__label">{label}</span></span>
    </div>
  );
}
