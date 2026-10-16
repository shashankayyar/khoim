/* Every village in a taluka as a sortable list (phase 2, screen 10). Ported from design/components/village/VillageTable.jsx.
   Phone: a list of rows with two sort buttons. Desktop: a real table whose column headings are sort buttons with
   aria-sort. The Devanagari and Romi columns carry reviewed names only (revision 1); a village whose only Konkani
   form is the Gazetteer's says "Needs review" in the last column. Census columns join once A2 loads them;
   until then they are left out, not shown as placeholders. */
import { useState } from 'react';
import { STATUS_TEXT, allVillagesOf, factsOf, getPlace } from '../../data/khoim';
import type { Place, Status } from '../../data/types';
import { Icon } from '../core/Icon';
import './village.css';

type Key = 'official' | 'status';
const ORDER: Partial<Record<Status, number>> = { reviewed: 0, review: 1, pending: 2 };
const statusOf = (v: Place): Status => (v.deva || v.romi ? 'reviewed' : factsOf(v.id)?.gazetteerDeva ? 'review' : 'pending');

export interface VillageListProps {
  taluka: string;
  onPick: (id: string) => void;
  /** Phone: rows and sort buttons. Desktop: a table. */
  compact?: boolean;
}

export function VillageList({ taluka, onPick, compact = false }: VillageListProps) {
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'official', dir: 1 });
  const t = getPlace(taluka);
  const rows = allVillagesOf(taluka).map(v => ({ v, status: statusOf(v) })).sort((a, b) => {
    const x = sort.key === 'status' ? (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9) : a.v.official.localeCompare(b.v.official);
    return (x || a.v.official.localeCompare(b.v.official)) * sort.dir;
  });
  const by = (key: Key) => setSort(s => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }));
  if (!t) return null;

  if (compact) {
    return (
      <div className="k-vlist">
        <div className="k-vlist__sort" role="group" aria-label="Sort by">
          <span className="k-vlist__sort-label">Sort</span>
          {([['official', 'A to Z'], ['status', 'Konkani name']] as const).map(([key, label]) => (
            <button key={key} type="button" className="k-vlist__sort-button" aria-pressed={sort.key === key} onClick={() => by(key)}>
              {label}{sort.key === key && <span aria-hidden="true">{sort.dir === 1 ? ' ↑' : ' ↓'}</span>}
            </button>
          ))}
        </div>
        <ul className="k-vlist__rows">
          {rows.map(({ v, status }) => (
            <li key={v.id}>
              <button type="button" className="k-vlist__row" onClick={() => onPick(v.id)}>
                <span className="k-vlist__names">
                  {v.deva && <span className="k-vlist__deva" lang="gom">{v.deva}</span>}
                  {!v.deva && v.romi && <span className="k-vlist__official" lang="gom-Latn">{v.romi}</span>}
                  <span className="k-vlist__official">{v.official}</span>
                  <span className="k-vlist__status">{STATUS_TEXT[status]}</span>
                </span>
                <Icon name="chevron-right" size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const th = (key: Key | null, label: string, lang?: string) => (
    <th scope="col" aria-sort={key && sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}>
      {key
        ? <button type="button" className="k-vtable__sort" onClick={() => by(key)}><span lang={lang}>{label}</span><Icon name="arrow-up-down" size={14} /></button>
        : <span className="k-vtable__head" lang={lang}>{label}</span>}
    </th>
  );
  return (
    <table className="k-vtable">
      <caption>{`${rows.length} villages in ${t.official}. Choose a column to sort.`}</caption>
      <thead><tr>{th('official', 'Official')}{th(null, 'देवनागरी', 'gom')}{th(null, 'Romi')}{th('status', 'Konkani name')}</tr></thead>
      <tbody>
        {rows.map(({ v, status }) => (
          <tr key={v.id}>
            <th scope="row"><button type="button" className="k-vtable__pick" onClick={() => onPick(v.id)}>{v.official}</button></th>
            <td className="k-vtable__deva" lang="gom">{v.deva ?? ''}</td>
            <td className="k-vtable__romi" lang="gom-Latn">{v.romi ?? ''}</td>
            <td>{STATUS_TEXT[status]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
