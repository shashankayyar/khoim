/* The Khoim app: one map, two layouts. Phone is the default; desktop adds the names panel on the right.
   Based on design/ui_kits/khoim/Screens.jsx. */
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Credit } from '../components/core/Credit';
import { DraftBanner } from '../components/core/DraftBanner';
import { Icon } from '../components/core/Icon';
import { IconButton } from '../components/core/IconButton';
import { ScriptToggle } from '../components/core/ScriptToggle';
import { Wordmark } from '../components/core/Wordmark';
import { ContributeForm } from '../components/contribute/ContributeForm';
import { GoaMap } from '../components/map/GoaMap';
import { PlaceCard } from '../components/place/PlaceCard';
import { PlaceStrip } from '../components/place/PlaceStrip';
import { Sheet } from '../components/place/Sheet';
import { SearchField } from '../components/search/SearchField';
import { SearchResults } from '../components/search/SearchResults';
import { getPlace, houseOf, trailOf } from '../data/khoim';
import type { RawVillage } from '../data/types';
import { CONTACT_EMAIL } from '../data/site';
import { useDialog } from '../lib/dialog';
import { useMailFallback } from '../lib/mailFallback';
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

/** The height of an element, kept up to date as text wraps or the screen turns. */
function useHeight(ref: RefObject<HTMLElement | null>): number {
  const [h, set] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const u = () => set(el.offsetHeight);
    u();
    const ro = new ResizeObserver(u);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return h;
}

function Announcer({ text }: { text: string }) {
  return <div className="k-visually-hidden" role="status" aria-live="polite">{text}</div>;
}

/* Shown when an email link was pressed but no mail app opened. Wording from the About screen. */
function MailNote() {
  const show = useMailFallback();
  return (
    <div className="k-mail-note" role="status" aria-live="polite">
      {show && <p>Write to us at <strong>{CONTACT_EMAIL}</strong>.</p>}
    </div>
  );
}

/* "Tell us what is wrong" on the draft banner: the form, about the place in view (or Goa). An email only when
   the form is not switched on. */
const tellUs = (k: Khoim) => (k.contrib.open ? () => k.openForm(k.selected ?? k.focus ?? 'goa', 'correction') : undefined);
const banner = (k: Khoim) => { const onTellUs = tellUs(k); return onTellUs ? { onTellUs } : { tellUsHref: tellUsWhatIsWrongHref(window.location.href) }; };

/* The contribution form, when it is switched on. */
function Contribute({ k }: { k: Khoim }) {
  if (!k.contrib.open) return null;
  return <ContributeForm place={getPlace(k.form?.placeId)} kind={k.form?.kind ?? null} siteKey={k.contrib.siteKey} onClose={k.closeForm} />;
}

/** Goa / South Goa / Salcete. Each part takes you to that level. */
function Crumbs({ k }: { k: Khoim }) {
  const trail = trailOf(k.focus || 'goa');
  if (trail.length < 2) return null;
  return (
    <nav className="k-crumbs" aria-label="Where you are">
      {trail.map((t, i) => (
        <Fragment key={t.id}>
          {i > 0 && <span aria-hidden="true">/</span>}
          <button type="button" className="k-crumbs__link" aria-current={i === trail.length - 1 ? 'page' : undefined} onClick={() => k.goTo(t.id === 'goa' ? null : t.id)}>{t.official}</button>
        </Fragment>
      ))}
    </nav>
  );
}

/* Phone: search is its own screen. It slides up over the map and closes with Cancel, Escape or the back button. */
function SearchScreen({ k }: { k: Khoim }) {
  const ref = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  useDialog(ref, k.search, k.closeSearch, input);
  return (
    <div ref={ref} className={k.search ? 'k-search-screen is-open' : 'k-search-screen'} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!k.search}>
      <div className="k-search-screen__top"><SearchField inputRef={input} value={k.query} onChange={k.setQuery} onCancel={k.closeSearch} /></div>
      <div className="k-search-screen__results">{k.search && <SearchResults query={k.query} onPick={k.openPlace} villagesLoaded={k.villagesLoaded} />}</div>
    </div>
  );
}

function Phone({ k }: { k: Khoim }) {
  const [paintIn] = useState(() => !paintedOnce && !k.focus && !k.selected);
  const fp = getPlace(k.focus), sp = getPlace(k.selected);
  const first = !k.focus && !k.selected;
  const parent = fp && fp.parent && fp.parent !== 'goa' ? getPlace(fp.parent) : null;
  const sheet = sp ? 'place' : fp ? 'strip' : null;
  /* How much of the card shows when collapsed. The card reports what it needs, because names wrap differently
     on different phones; until it has, use the design's figure. The map keeps clear of it. */
  const [measured, setMeasured] = useState<{ id: string; px: number } | null>(null);
  const cardPeek = sp ? (measured?.id === sp.id ? measured.px : sp.deva ? 304 : 344) : 0;
  const peek = sp ? cardPeek : fp ? (fp.level === 'taluka' ? 224 : 200) : 0;
  const spId = sp?.id;
  const onMeasure = useCallback((px: number) => { if (spId) setMeasured(m => (m && m.id === spId && m.px === px ? m : { id: spId, px })); }, [spId]);
  /* On the first screen the map sits between the title and the buttons, however many lines they take on this phone. */
  const title = useRef<HTMLHeadingElement>(null), bottom = useRef<HTMLDivElement>(null);
  const titleH = useHeight(title), bottomH = useHeight(bottom);
  const firstTop = titleH ? 76 + titleH + 12 : 176, firstBottom = bottomH ? bottomH + 28 : 190;
  return (
    <div className="k-app k-app--phone">
      <main className="k-phone-main">
        <GoaMap focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} onSelect={k.pick} onHot={k.setHot}
          insetTop={first ? firstTop : 124} insetBottom={sheet ? peek + 8 : firstBottom} paintIn={paintIn} villages={k.villages} villagePaths={k.villagePaths} />
      </main>
      <header className="k-phone-header">
        <div className="k-phone-header__row">
          <div className="k-phone-header__left">
            {first
              ? <button type="button" className="k-phone-header__wordmark" onClick={k.openMore}><Wordmark size={22} suffix="About Khoim" /></button>
              : <IconButton icon="arrow-left" label={sp?.level === 'village' && fp ? 'Back to ' + fp.official : parent ? 'Back to ' + parent.official : 'Back to Goa'} onClick={k.back} />}
          </div>
          <div className="k-phone-header__right"><ScriptToggle value={k.script} onChange={k.setScript} /></div>
        </div>
        {!first && (
          <div className="k-phone-header__row k-phone-header__row--where">
            <Crumbs k={k} />
            <IconButton icon="search" label="Search any name, in any script" onClick={k.openSearch} />
          </div>
        )}
      </header>
      <h1 ref={title} className={first ? 'k-phone-title' : 'k-phone-title is-hidden'} aria-hidden={!first}>{TITLE}</h1>
      <div ref={bottom} className={sheet ? 'k-phone-bottom is-hidden' : 'k-phone-bottom'}>
        <div className="k-phone-bottom__notes">
          <p className="k-hint">Tap a district, or press and drag along Goa</p>
          <button type="button" className="k-draft-chip" onClick={k.openMore}>Draft for review.</button>
        </div>
        <div className="k-phone-bottom__actions">
          <button type="button" className="k-search-button" onClick={k.openSearch}><Icon name="search" size={20} />Search any name, any script</button>
          <IconButton icon="layers" label="Layers and about" size={58} onClick={k.openMore} />
        </div>
      </div>
      {sp && (
        <Sheet key={'s' + sp.id} label={sp.official} snap={k.snap} onSnap={k.setSnap} peek={peek} onMeasure={onMeasure} house={houseOf(sp).key}>
          <div className="k-phone-card">
            <PlaceCard place={sp} expanded={k.snap === 'full'} headingLevel={1} onExpand={() => k.setSnap('full')} onClose={() => k.setSnap('closed')} onShowInside={() => k.setSnap('closed')}
              onTell={k.contrib.open ? kind => k.openForm(sp.id, kind) : undefined} />
          </div>
        </Sheet>
      )}
      {!sp && fp && (
        <Sheet key={'t' + fp.id} label={'Places in ' + fp.official} onSnap={s => { if (s === 'closed') k.back(); }} peek={peek} expandable={false}>
          <PlaceStrip parent={fp.id} script={k.script} active={k.hot} onFocusPlace={k.setHot} onPick={k.select} headingLevel={1} />
        </Sheet>
      )}
      <SearchScreen k={k} />
      <More open={k.more} onClose={k.closeMore} layer={k.layer} onLayer={k.setLayer} onTellUs={tellUs(k)} />
      <Contribute k={k} />
      <MailNote />
      <Announcer text={k.announce} />
    </div>
  );
}

function Desktop({ k }: { k: Khoim }) {
  const [paintIn] = useState(() => !paintedOnce && !k.focus && !k.selected);
  const fp = getPlace(k.focus), sp = getPlace(k.selected);
  return (
    <div className="k-app k-app--desktop">
      <DraftBanner {...banner(k)} />
      <div className="k-desktop">
        <main className="k-desktop__map">
          <GoaMap focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} onSelect={k.pick} onHot={k.setHot}
            insetTop={96} insetBottom={fp ? (fp.level === 'taluka' ? 194 : 170) : 24} insetLeft={fp ? 0 : 360} paintIn={paintIn} villages={k.villages} villagePaths={k.villagePaths} />
          <header className="k-desktop-header">
            <div className="k-desktop-header__left">
              <button type="button" className="k-desktop-header__home" onClick={() => k.goTo(null)}><Wordmark size={26} suffix="All of Goa" /></button>
              <Crumbs k={k} />
            </div>
            <div className="k-desktop-header__right">
              <ScriptToggle value={k.script} onChange={k.setScript} />
              <IconButton icon="layers" label="Layers and about" onClick={k.openMore} />
            </div>
          </header>
          {!fp && !sp && (
            <div className="k-desktop-intro">
              <h1>{TITLE}</h1>
              <p>Click a district, or press and drag along Goa.</p>
            </div>
          )}
          {fp && (
            <div className="k-desktop-strip">
              <PlaceStrip parent={fp.id} script={k.script} active={k.hot || k.selected} onFocusPlace={k.setHot} onPick={k.select} headingLevel={sp ? 2 : 1} />
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
                  <PlaceCard place={sp} expanded headingLevel={1} onClose={() => k.setSnap('closed')} onTell={k.contrib.open ? kind => k.openForm(sp.id, kind) : undefined} />
                </div>
              </div>
            ) : (
              <>
                <p className="k-desktop__panel-intro">Pick a place on the map to see all its names. Search works in any script: try <span lang="gom">साश्टी</span>, Saxtti or Salcete.</p>
                {/* the three districts as a list too, for anyone who would rather pick from names */}
                {!fp && (
                  <div className="k-desktop__panel-list">
                    <PlaceStrip parent={null} script={k.script} active={k.hot} onFocusPlace={k.setHot} onPick={k.select} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="k-desktop__panel-credit"><Credit /></div>
        </aside>
      </div>
      <More open={k.more} onClose={k.closeMore} layer={k.layer} onLayer={k.setLayer} onTellUs={tellUs(k)} />
      <Contribute k={k} />
      <MailNote />
      <Announcer text={k.announce} />
    </div>
  );
}
