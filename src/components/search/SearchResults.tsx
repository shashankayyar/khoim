/* Mixed-script results. Latin is accent-folded (ã = a); Devanagari matches as typed.
   Districts and talukas rank above villages. Ported from design/components/search/SearchResults.jsx. */
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { fold, houseOf, searchPlaces, whereLabel } from '../../data/khoim';
import type { MapLines } from '../../data/geo';
import { searchThings } from '../../lib/things';
import './search.css';

/** Who an other spelling comes from (phase 4, A6). OpenStreetMap's are ODbL and always credited. */
const AKA_CREDIT = { o: '© OpenStreetMap contributors', g: 'Gazetteer, 1979', l: 'Dr Alvarinho J. Luis' } as const;

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
  /** Feasts, parishes and landmarks join once the village facts have loaded; rivers once the map's lines have. */
  factsLoaded?: boolean;
  lines?: MapLines | null;
}

export function SearchResults({ query, onPick, villagesLoaded, factsLoaded = false, lines = null }: SearchResultsProps) {
  const res = useMemo(() => searchPlaces(query), [query, villagesLoaded]);
  const things = useMemo(() => searchThings(query, lines), [query, factsLoaded, lines]); // eslint-disable-line react-hooks/exhaustive-deps
  const total = res.length + things.length;
  if (!query.trim()) return <p className="k-search-note">Type a name the way you know it. Official spelling, देवनागरी or Romi all work.</p>;
  return (
    <div>
      <p className="k-search-note k-search-note--count" role="status" aria-live="polite">
        {total ? `${res.length} ${res.length === 1 ? 'place' : 'places'}${things.length ? ` and ${things.length} other ${things.length === 1 ? 'match' : 'matches'}` : ''}` : `Nothing for "${query}" yet. Try the official spelling.`}
      </p>
      <ul className="k-results">
        {res.map(({ place: p, field, aka }, i) => (
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
                {aka && <span className="k-result__sub">Also written {mark(aka[0], query)} ({AKA_CREDIT[aka[1]]})</span>}
              </span>
            </button>
          </li>
        ))}
        {things.map((t, i) => (
          <li key={t.key} className="k-results__item" style={{ '--rise-delay': `${Math.min(res.length + i, 8) * 30}ms` } as CSSProperties}>
            <button type="button" className="k-result" onClick={() => onPick(t.open)}>
              <span className="k-result__tab" aria-hidden="true" data-house={houseOf(null).key} />
              <span className="k-result__text">
                <span className="k-result__official-head">{mark(t.name, query)}</span>
                <span className="k-result__sub">{t.what.charAt(0).toUpperCase() + t.what.slice(1)} in {t.where}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
