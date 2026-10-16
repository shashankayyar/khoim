/* What goes with a map view: its controls and its readout, in the bottom sheet on phones and the side panel on
   desktop (design/components/layers/LayerPanel.jsx). Nothing here is a placeholder: the Population view waits
   for Census 2011 and is not offered yet. */
import { houseOf } from '../../data/khoim';
import { MONTHS, NAME_PARTS, allFeasts, layerState, mappedVillages, partCount, partOf, type MapLayer } from '../../lib/layers';
import { nextFeastDate, upcomingMonths } from '../../lib/feasts';
import { Button } from '../core/Button';
import { MonthSlider } from './MonthSlider';
import './layers.css';

const dayMonthYear = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

export interface LayerPanelProps {
  layer: MapLayer;
  onChange: (layer: MapLayer) => void;
  onPickPlace: (id: string) => void;
  /** "Help fill this in": the contribution form, or an email when the form is off. */
  onHelp?: () => void;
  helpHref?: string;
  today?: Date;
}

export function LayerPanel({ layer, onChange, onPickPlace, onHelp, helpHref, today = new Date() }: LayerPanelProps) {
  if (layer.id === 'parts') {
    const part = partOf(layer);
    return (
      <div className="k-layer-panel">
        <p className="k-layer-panel__text">Pick an ending. Every village whose official spelling ends with it lights up.</p>
        <div className="k-parts" role="radiogroup" aria-label="Name part">
          {NAME_PARTS.map(x => (
            <button key={x.id} type="button" role="radio" aria-checked={x.id === part.id} className="k-parts__item" onClick={() => onChange({ ...layer, part: x.id })}>
              <span className="k-parts__label">{x.label}</span><span className="k-parts__count">{partCount(x.id)}</span>
            </button>
          ))}
        </div>
        <p className="k-layer-panel__lead" role="status">{`${partCount(part.id)} villages end in ${part.label}`}</p>
        <p className="k-layer-panel__small">Matched on official spellings. What each part means still needs a source.</p>
      </div>
    );
  }

  if (layer.id === 'feasts') {
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

  if (layer.id === 'need') {
    const V = mappedVillages();
    const n = { lit: 0, review: 0, outline: 0, dim: 0 };
    for (const v of V) n[layerState(v, layer, today)]++;
    const row = (st: 'lit' | 'review' | 'outline', count: number, text: string) => (
      <li className="k-need__row"><span className={'k-need__swatch k-need__swatch--' + st} aria-hidden="true" /><span><strong>{count}</strong> {text}</span></li>
    );
    return (
      <div className="k-layer-panel">
        <p className="k-layer-panel__lead">{`${n.lit} of ${V.length} villages have a checked Konkani name.`}</p>
        <ul className="k-need">
          {row('lit', n.lit, 'checked by a speaker')}
          {row('review', n.review, 'written down, not checked yet')}
          {row('outline', n.outline, 'with no Konkani name yet')}
        </ul>
        <p className="k-layer-panel__text">If you know how your village is written in Devanagari or Romi, tap it and tell us.</p>
        {(onHelp || helpHref) && <div><Button icon={onHelp ? undefined : 'mail'} href={onHelp ? undefined : helpHref} onClick={onHelp}>Help fill this in</Button></div>}
      </div>
    );
  }
  return null;
}
