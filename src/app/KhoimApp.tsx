/* The Khoim app: one map, two layouts. Phone is the default; desktop adds the names panel on the right.
   Ported from design/ui_kits/khoim/Screens.jsx. */
import { Fragment, useEffect, useRef, useState } from 'react';
import { Credit } from '../components/core/Credit';
import { DraftBanner } from '../components/core/DraftBanner';
import { Icon } from '../components/core/Icon';
import { IconButton } from '../components/core/IconButton';
import { ScriptToggle } from '../components/core/ScriptToggle';
import { Wordmark } from '../components/core/Wordmark';
import { GoaMap } from '../components/map/GoaMap';
import { PlaceCard } from '../components/place/PlaceCard';
import { PlaceStrip } from '../components/place/PlaceStrip';
import { Sheet } from '../components/place/Sheet';
import { SearchField } from '../components/search/SearchField';
import { SearchResults } from '../components/search/SearchResults';
import { getPlace, houseOf, nameIn, trailOf } from '../data/khoim';
import type { RawVillage } from '../data/types';
import { tellUsWhatIsWrongHref } from '../lib/mailto';
import { useMediaQuery } from '../lib/motion';
import { More } from './More';
import { useKhoim, type Khoim } from './useKhoim';
import './app.css';

/** The desktop design is drawn at 1280. Below this width the map has too little room next to the panel. */
const DESKTOP = '(min-width: 1180px)';
const TITLE = 'Every taluka in Goa, with its Konkani name and how to say it.';

/* Talukas repaint north to south on the first load only, not when the layout changes. */
let paintedOnce = false;

export interface KhoimAppProps {
  /** The place this page was built for. Missing on the home page and the not-found page. */
  initialId?: string;
  /** On a village page: that village's record, so its card can show before the full list loads. */
  initialVillage?: RawVillage;
}

export default function KhoimApp({ initialId, initialVillage }: KhoimAppProps) {
  const desktop = useMediaQuery(DESKTOP);
  const k = useKhoim({ desktop, initialId, initialVillage });
  useEffect(() => {
    paintedOnce = true;
    document.documentElement.dataset.app = 'ready';
    return () => { delete document.documentElement.dataset.app; };
  }, []);
  return desktop ? <Desktop k={k} /> : <Phone k={k} />;
}

function Announcer({ text }: { text: string }) {
  return <div className="k-visually-hidden" role="status" aria-live="polite">{text}</div>;
}

/* Phone: search is its own screen. It slides up over the map and closes with Cancel or Escape. */
function SearchScreen({ k }: { k: Khoim }) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!k.search) return;
    const t = window.setTimeout(() => input.current?.focus({ preventScroll: true }), 320);
    return () => window.clearTimeout(t);
  }, [k.search]);
  return (
    <div className={k.search ? 'k-search-screen is-open' : 'k-search-screen'} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!k.search}
      onKeyDown={e => { if (e.key === 'Escape') k.closeSearch(); }}>
      <div className="k-search-screen__top"><SearchField inputRef={input} value={k.query} onChange={k.setQuery} onCancel={k.closeSearch} /></div>
      <div className="k-search-screen__results">{k.search && <SearchResults query={k.query} onPick={k.openPlace} villagesLoaded={k.villagesLoaded} />}</div>
    </div>
  );
}

function Phone({ k }: { k: Khoim }) {
  const [paintIn] = useState(() => !paintedOnce && !k.focus && !k.selected);
  const fp = getPlace(k.focus), sp = getPlace(k.selected);
  const first = !k.focus && !k.selected;
  const nm = fp ? nameIn(fp, k.script) : null;
  const parent = fp && fp.parent && fp.parent !== 'goa' ? getPlace(fp.parent) : null;
  const sheet = sp ? 'place' : fp ? 'strip' : null;
  /* how much of the sheet shows when collapsed; the map keeps clear of it */
  const peek = sp ? (sp.deva ? 296 : 336) : fp ? 200 : 0;
  /* when search is cancelled, the keyboard focus goes back to the button that opened it */
  const searchButton = useRef<HTMLButtonElement>(null);
  const wasSearching = useRef(false);
  useEffect(() => {
    if (wasSearching.current && !k.search) searchButton.current?.focus({ preventScroll: true });
    wasSearching.current = k.search;
  }, [k.search]);
  return (
    <div className="k-app k-app--phone">
      <GoaMap focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} onSelect={k.pick} onHot={k.setHot}
        insetTop={first ? 176 : 72} insetBottom={sheet ? peek + 8 : 108} paintIn={paintIn} villages={k.villages} villagePaths={k.villagePaths} />
      <header className="k-phone-header">
        <div className="k-phone-header__left">
          {k.focus || k.selected
            ? <IconButton icon="arrow-left" label={parent ? 'Back to ' + parent.official : 'Back to Goa'} onClick={k.back} />
            : <button type="button" className="k-phone-header__wordmark" onClick={k.openMore} aria-label="About Khoim"><Wordmark size={22} /></button>}
          {nm && <span className={nm.kind === 'deva' ? 'k-phone-header__place k-phone-header__place--deva' : 'k-phone-header__place'} lang={nm.kind === 'deva' ? 'gom' : undefined}>{nm.text}</span>}
        </div>
        <div className="k-phone-header__right"><ScriptToggle value={k.script} onChange={k.setScript} /></div>
      </header>
      <h1 className={first ? 'k-phone-title' : 'k-phone-title is-hidden'} aria-hidden={!first}>{TITLE}</h1>
      <div className={sheet ? 'k-phone-bottom is-hidden' : 'k-phone-bottom'}>
        {first && <p className="k-hint">Tap a district, or press and drag along Goa</p>}
        <button type="button" className="k-search-button" ref={searchButton} onClick={k.openSearch}><Icon name="search" size={20} />Search any name, any script</button>
      </div>
      {sp && (
        <Sheet key={'s' + sp.id} label={sp.official} snap={k.snap} onSnap={k.setSnap} peek={peek} house={houseOf(sp).key}>
          <div className="k-phone-card">
            <PlaceCard place={sp} expanded={k.snap === 'full'} onExpand={() => k.setSnap('full')} onClose={() => k.setSnap('closed')} onGoInside={k.goInside} />
          </div>
        </Sheet>
      )}
      {!sp && fp && (
        <Sheet key={'t' + fp.id} label={'Places in ' + fp.official} onSnap={s => { if (s === 'closed') k.back(); }} peek={peek} expandable={false}>
          <PlaceStrip parent={fp.id} script={k.script} active={k.hot} onFocusPlace={k.setHot} onPick={k.select} />
        </Sheet>
      )}
      <SearchScreen k={k} />
      <More open={k.more} onClose={k.closeMore} layer={k.layer} onLayer={k.setLayer} />
      <Announcer text={k.announce} />
    </div>
  );
}

function Desktop({ k }: { k: Khoim }) {
  const [paintIn] = useState(() => !paintedOnce && !k.focus && !k.selected);
  const fp = getPlace(k.focus), sp = getPlace(k.selected);
  const trail = trailOf(k.focus || 'goa');
  return (
    <div className="k-app k-app--desktop">
      <DraftBanner tellUsHref={tellUsWhatIsWrongHref(window.location.href)} />
      <div className="k-desktop">
        <main className="k-desktop__map">
          <GoaMap focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} onSelect={k.pick} onHot={k.setHot}
            insetTop={96} insetBottom={fp ? 170 : 24} insetLeft={fp ? 0 : 360} paintIn={paintIn} villages={k.villages} villagePaths={k.villagePaths} />
          <header className="k-desktop-header">
            <div className="k-desktop-header__left">
              <button type="button" className="k-desktop-header__home" onClick={() => k.goTo(null)} aria-label="Khoim, all of Goa"><Wordmark size={26} /></button>
              <nav className="k-crumbs" aria-label="Where you are">
                {trail.length > 1 && trail.map((t, i) => (
                  <Fragment key={t.id}>
                    {i > 0 && <span aria-hidden="true">/</span>}
                    <button type="button" className="k-crumbs__link" aria-current={i === trail.length - 1 ? 'page' : undefined} onClick={() => k.goTo(t.id === 'goa' ? null : t.id)}>{t.official}</button>
                  </Fragment>
                ))}
              </nav>
            </div>
            <div className="k-desktop-header__right">
              <ScriptToggle value={k.script} onChange={k.setScript} />
              <IconButton icon="layers" label="Layers and about" onClick={k.openMore} />
            </div>
          </header>
          {!fp && !sp && (
            <div className="k-desktop-intro">
              <h1>{TITLE}</h1>
              <p>Click a district, or press and drag along Goa. Click again to go inside.</p>
            </div>
          )}
          {fp && (
            <div className="k-desktop-strip">
              <PlaceStrip parent={fp.id} script={k.script} active={k.hot || k.selected} onFocusPlace={k.setHot} onPick={k.select} />
            </div>
          )}
        </main>
        <aside className="k-desktop__panel" aria-label="Names">
          <div className="k-desktop__panel-top">
            <SearchField value={k.query} onChange={k.setQuery} onCancel={k.query ? () => k.setQuery('') : undefined} />
          </div>
          <div className="k-desktop__panel-body">
            {k.query ? (
              <SearchResults query={k.query} onPick={id => { k.setQuery(''); k.openPlace(id); }} villagesLoaded={k.villagesLoaded} />
            ) : sp ? (
              <div key={sp.id} className="k-desktop-card" data-house={houseOf(sp).key}>
                <div className="k-desktop-card__inner">
                  <PlaceCard place={sp} expanded onClose={() => k.setSnap('closed')} onGoInside={k.goInside} />
                </div>
              </div>
            ) : (
              <p className="k-desktop__panel-intro">Pick a place on the map to see all its names. Search works in any script: try <span lang="gom">साश्टी</span>, Saxtti or Salcete.</p>
            )}
          </div>
          <div className="k-desktop__panel-credit"><Credit /></div>
        </aside>
      </div>
      <More open={k.more} onClose={k.closeMore} layer={k.layer} onLayer={k.setLayer} />
      <Announcer text={k.announce} />
    </div>
  );
}
