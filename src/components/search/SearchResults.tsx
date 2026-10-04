/* Mixed-script results. Latin is accent-folded (ã = a); Devanagari matches as typed.
   Districts and talukas rank above villages. Ported from design/components/search/SearchResults.jsx. */
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { fold, houseOf, searchPlaces, whereLabel } from '../../data/khoim';
import './search.css';

/** Wraps the matched part of a name in the search highlight. */
function mark(text: string, q: string): ReactNode {
  const f = fold(text), i = f.indexOf(fold(q.trim()));
  if (i < 0 || f.length !== text.length) return text;
  const n = fold(q.trim()).length;
  return <>{text.slice(0, i)}<mark className="k-result__mark">{text.slice(i, i + n)}</mark>{text.slice(i + n)}</>;
}

export interface SearchResultsProps {
  query: string;
  onPick: (id: string) => void;
  /** Villages join the results once their list has loaded. */
  villagesLoaded: boolean;
}

export function SearchResults({ query, onPick, villagesLoaded }: SearchResultsProps) {
  const res = useMemo(() => searchPlaces(query), [query, villagesLoaded]);
  if (!query.trim()) return <p className="k-search-note">Type a name the way you know it. Official spelling, देवनागरी or Romi all work.</p>;
  return (
    <div>
      <p className="k-search-note k-search-note--count" role="status" aria-live="polite">
        {res.length ? `${res.length} ${res.length === 1 ? 'place' : 'places'}` : `Nothing for "${query}" yet. Try the official spelling.`}
      </p>
      <ul className="k-results">
        {res.map(({ place: p, field }, i) => (
          <li key={p.id} className="k-results__item" style={{ '--rise-delay': `${Math.min(i, 8) * 30}ms` } as CSSProperties}>
            <button type="button" className="k-result" onClick={() => onPick(p.id)}>
              <span className="k-result__tab" aria-hidden="true" data-house={houseOf(p).key} />
              <span className="k-result__text">
                {p.deva ? (
                  <span className="k-result__names">
                    <span className="k-result__deva" lang="gom">{field === 'deva' ? mark(p.deva, query) : p.deva}</span>
                    {p.romi && <span className="k-result__romi" lang="gom-Latn">{field === 'romi' ? mark(p.romi, query) : p.romi}</span>}
                  </span>
                ) : p.romi ? (
                  /* a name recorded in Romi only: Romi leads, as Devanagari does elsewhere */
                  <span className="k-result__official-head" lang="gom-Latn">{field === 'romi' ? mark(p.romi, query) : p.romi}</span>
                ) : (
                  <span className="k-result__official-head">{mark(p.official, query)}</span>
                )}
                <span className="k-result__sub">
                  {p.deva || p.romi ? <>{field === 'official' ? mark(p.official, query) : p.official} · </> : 'Official name only · '}{whereLabel(p)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
