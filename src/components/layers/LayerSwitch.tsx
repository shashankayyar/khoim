import { LAYERS } from '../../data/khoim';
import { Icon } from '../core/Icon';
import './layers.css';

export interface LayerSwitchProps {
  value: string;
  onChange: (id: string) => void;
  /** For the layers that fill in from contributions: how many things each holds so far. Missing until known. */
  counts?: Record<string, number> | null;
}

/** Khoim's layers. One is on at a time: Names, or one of the layers people add to, which then shows its marks
    on the map. A layer that is not live yet cannot be switched on and says when it is coming. */
export function LayerSwitch({ value, onChange, counts }: LayerSwitchProps) {
  return (
    <ul className="k-layers" role="list">
      {LAYERS.map(l => {
        const live = l.status === 'live', on = value === l.id, n = counts?.[l.id];
        return (
          <li key={l.id}>
            <button type="button" className={'k-layer' + (live ? '' : ' k-layer--coming') + (on ? ' is-on' : '')}
              aria-pressed={live ? on : undefined} aria-disabled={!live || undefined} onClick={() => { if (live) onChange(l.id); }}>
              <span className="k-layer__icon" aria-hidden="true"><Icon name={l.icon} size={20} /></span>
              <span className="k-layer__text"><span className="k-layer__label">{l.label}</span><span className="k-layer__note">{l.note}</span>{n !== undefined && <span className="k-layer__count">{n ? `${n} so far` : 'None yet'}</span>}</span>
              <span className="k-layer__status">{live ? (on ? 'On' : 'Off') : l.status === 'next' ? 'Next' : 'Planned'}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
