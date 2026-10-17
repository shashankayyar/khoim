/* The Feasts and zatras view's controls: a month slider and the feasts in that month (phase 2,
   design/components/layers/LayerPanel.jsx). Out of the view row since phase 3 until the data has at least 20
   feasts and zatras (docs/phase3-brief.md, step 3); kept here for when it comes back. Feasts stay on village sheets. */
import { houseOf } from '../../data/khoim';
import { MONTHS, allFeasts, type MapLayer } from '../../lib/layers';
import { nextFeastDate, upcomingMonths } from '../../lib/feasts';
import { MonthSlider } from './MonthSlider';
import './layers.css';

const dayMonthYear = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

export interface LayerPanelProps {
  layer: MapLayer;
  onChange: (layer: MapLayer) => void;
  onPickPlace: (id: string) => void;
  today?: Date;
}

export function LayerPanel({ layer, onChange, onPickPlace, today = new Date() }: LayerPanelProps) {
  if (layer.id !== 'feasts') return null;
  const all = allFeasts(), month = layer.month ?? today.getMonth() + 1;
  const counts = Array.from({ length: 12 }, (_, i) => all.filter(f => upcomingMonths(f.item.when!, today).includes(i + 1)).length);
  const now = all.filter(f => upcomingMonths(f.item.when!, today).includes(month));
  return (
    <div className="k-layer-panel">
      <MonthSlider value={month} onChange={m => onChange({ ...layer, month: m })} counts={counts} />
      {now.length ? (
        <ul className="k-feasts">
          {now.map(f => {
            const d = nextFeastDate(f.item.when!, today);
            return (
              <li key={f.place.id + f.item.title}>
                <button type="button" className="k-feasts__item" onClick={() => onPickPlace(f.place.id)}>
                  <span className="k-feasts__bar" aria-hidden="true" style={{ background: `var(--house-${houseOf(f.place).key})` }} />
                  <span className="k-feasts__text">
                    <span className="k-feasts__title">{f.item.title}</span>
                    <span className="k-feasts__place">{f.place.official}</span>
                    <span className="k-feasts__when">{`${f.item.whenText}. ${d ? `Next: ${dayMonthYear(d)}.` : 'Lunar date, so it moves each year.'}`}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : <p className="k-layer-panel__text">No feast or zatra recorded for this month yet. Know one? Tell us.</p>}
    </div>
  );
}
