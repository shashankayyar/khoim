/* The Khoim app: one map, two layouts (phase 3, docs/prototypes/type-atlas.html).
   - Phone: the header floats over the map (wordmark, script toggle, headline and count, views); a place's card rises
     from the bottom and never takes more than 40% of the screen, so the map keeps at least 60%.
   - Desktop: text and controls in a panel at the top left, the map centred in the space to its right, and the open
     place (or search results) docked on the right.
   The view controls are never covered. */
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
import { Sheet } from '../components/place/Sheet';
import { SearchField } from '../components/search/SearchField';
import { SearchResults } from '../components/search/SearchResults';
import { VillageList } from '../components/village/VillageList';
import { VillageSheet } from '../components/village/VillageSheet';
import { EndingButtons, EndingNote, Legend, ViewLine } from '../components/layers/Views';
import { ShowControl } from '../components/layers/ShowControl';
import { showOptions } from '../lib/layers';
import { ShareSheet } from '../components/share/ShareSheet';
import { Toast } from '../components/share/Toast';
import { copyText, shareUrl } from '../lib/share';
import { PLACES, getPlace, houseOf, nameIn, trailOf } from '../data/khoim';
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
/* Approved in docs/phase3-brief.md. */
const LEDE = 'Goa, written in its own names.';
const HINT = 'Scroll or pinch to read the villages. Tap one.';

export interface KhoimAppProps {
  /** The place this page was built for. Missing on the home page and the not-found page. */
  initialId?: string;
  /** On a village page: that village's record, so its card can show before the full list loads. */
  initialVillage?: RawVillage;
  /** On a taluka's villages/ page: open with the list showing. */
  initialList?: boolean;
}

export default function KhoimApp({ initialId, initialVillage, initialList }: KhoimAppProps) {
  const desktop = useMediaQuery(DESKTOP);
  const k = useKhoim({ desktop, initialId, initialVillage, initialList });
  useEffect(() => {
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

/* The way in to the layers and About. While a layer other than Names is on, the button wears that layer's icon
   and says so, which is how you can tell why there are marks on the map and where to switch them off. */
/** About Khoim. The layers moved into "Show" (phase 4, B3), so this button only opens About. */
function AboutButton({ k, size }: { k: Khoim; size?: number }) {
  return <IconButton icon="info" label="About Khoim" size={size} onClick={k.openMore} />;
}
/* What the map and the strip need to mark the places that have something in the layer that is on. */
const marksOf = (k: Khoim) => (k.litLayer && k.marks ? { marks: k.marks, markIcon: k.litLayer.icon, markLabel: k.litLayer.label } : {});

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

/* What the map needs: every village and outline, the view, the live layer's tiles, and what a tap does.
   A tap on the sea puts the open card away. */
const mapProps = (k: Khoim) => ({
  selected: k.selected, focus: k.focus, hot: k.hot, script: k.script, villages: k.mapVillages, paths: k.allPaths, mapLayer: k.mapLayer,
  lines: k.mapLines, factsReady: k.factsLoaded,
  onSelect: (id: string) => k.pick(id, false), onBackground: () => { if (k.selected) k.setSnap('closed'); }, onInteract: k.touch,
  ...(k.litLayer && k.marks ? { marks: k.marks, markIcon: k.litLayer.icon } : {})
});
/* Share: the sheet on phones; on desktop the link is copied straight away (design, Desktop). A place's card shares
   the place; the layer panel shares the view, at the level you are looking at. */
const viewPlace = (k: Khoim) => getPlace(k.selected ?? k.focus ?? 'goa');
function shareAction(k: Khoim, desktop: boolean, view: boolean) {
  if (!desktop) return k.openShare;
  /* if the browser will not copy, the sheet opens with the link in plain sight instead */
  return async () => { if (await copyText(shareUrl(viewPlace(k), view ? k.mapLayer : null))) k.showToast('Link copied'); else k.openShare(); };
}
/* The taluka's villages as a list: a screen of its own on the phone, over the map on desktop. Back, Escape and the
   browser's back button close it. Picking a village opens its card. */
function ListScreen({ k, compact }: { k: Khoim; compact: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, k.listOpen, k.closeList);
  const t = getPlace(k.focus);
  const open = k.listOpen && !!t;
  return (
    <div ref={ref} tabIndex={-1} className={open ? 'k-list-screen is-open' : 'k-list-screen'} role="dialog" aria-modal="true" aria-labelledby="k-list-title" aria-hidden={!open}>
      {open && t && (
        <>
          <div className="k-list-screen__top">
            {/* TODO(copy): "Back to the map" is in the design's list of new wording */}
            <IconButton icon="arrow-left" label="Back to the map" onClick={k.closeList} />
            {/* TODO(copy): "Villages in {taluka}" is the design's list title */}
            <h1 id="k-list-title" className="k-list-screen__title">
              {t.deva && <span className="k-list-screen__deva" lang="gom">{t.deva}</span>}
              <span>{'Villages in ' + t.official}</span>
            </h1>
          </div>
          <div className="k-list-screen__body">
            {k.villagesLoaded && <VillageList taluka={t.id} compact={compact} onPick={id => { k.select(id); if (compact) k.setSnap('full'); }} />}
          </div>
        </>
      )}
    </div>
  );
}

/* The name in a sheet's handle row: the Devanagari, then the official spelling (phase 2). Reviewed names only. */
function sheetTitle(p: { deva: string | null; official: string }) {
  return p.deva ? <><span lang="gom">{p.deva}</span> {p.official}</> : p.official;
}

/* Every taluka as a house-colour tile, grouped by district, under the search box before anything is typed.
   A list route into the map; one tap opens the taluka. */
function GoaList({ k }: { k: Khoim }) {
  return (
    <div className="k-goa-list">
      {PLACES.filter(p => p.level === 'district').map(d => (
        <section key={d.id} className="k-goa-list__district">
          <h2 className="k-goa-list__head">{d.deva && <span lang="gom">{d.deva}</span>} {d.official}</h2>
          <ul className="k-goa-list__tiles">
            {PLACES.filter(t => t.parent === d.id).map(t => {
              const n = nameIn(t, k.script === 'official' ? 'deva' : k.script);
              return (
                <li key={t.id}>
                  <button type="button" className="k-goa-list__tile" data-house={houseOf(t).key} onClick={() => k.pick(t.id, false)}>
                    {!n.fallback && <span className={n.kind === 'deva' ? 'k-goa-list__name k-goa-list__name--deva' : 'k-goa-list__name'} lang={n.kind === 'deva' ? 'gom' : undefined}>{n.text}</span>}
                    <span className="k-goa-list__official">{t.official}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* Phone: search is its own screen. It slides up over the map and closes with Cancel, Escape or the back button. */
function SearchScreen({ k }: { k: Khoim }) {
  const ref = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  useDialog(ref, k.search, k.closeSearch, input);
  return (
    <div ref={ref} className={k.search ? 'k-search-screen is-open' : 'k-search-screen'} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!k.search}>
      <div className="k-search-screen__top"><SearchField inputRef={input} value={k.query} onChange={k.setQuery} onCancel={k.closeSearch} /></div>
      <div className="k-search-screen__results">
        {k.search && <SearchResults query={k.query} onPick={k.openPlace} villagesLoaded={k.villagesLoaded} factsLoaded={k.factsLoaded} lines={k.mapLines} />}
        {/* nothing typed yet: every district and taluka, a list route into the map */}
        {k.search && !k.query.trim() && <GoaList k={k} />}
      </div>
    </div>
  );
}

/** The height of the window, kept up to date: phone sheets never take more than 40% of it (phase 3). */
function useWindowHeight(): number {
  const [h, set] = useState(() => window.innerHeight);
  useEffect(() => {
    const u = () => set(window.innerHeight);
    window.addEventListener('resize', u);
    return () => window.removeEventListener('resize', u);
  }, []);
  return h;
}
/** Phone sheets stop at this share of the screen, so the map always has at least 60% (phase 3, step 5). */
const SHEET_SHARE = 0.4;

/* What the card's count button does: a taluka opens its villages as a list; a district puts the card away, so its
   talukas show on the map. */
const showInside = (k: Khoim) => () => { if (getPlace(k.selected)?.level === 'taluka') k.openList(); else k.setSnap('closed'); };

/* What the map shows: "Show", the ending buttons (Spelling endings only) and the legend. Never covered. */
function Views({ k, endings = true, compact = false }: { k: Khoim; endings?: boolean; compact?: boolean }) {
  return (
    <div className="k-views">
      <ShowControl options={showOptions(k.layerCounts)} value={k.showValue} onChange={k.show} compact={compact} />
      {endings && <EndingButtons layer={k.mapLayer} onChange={k.setMapLayer} />}
      {endings && <EndingNote layer={k.mapLayer} />}
      <div className="k-views__foot">
        <div className="k-views__key" role="status">{k.coloured && <span className="k-visually-hidden"><ViewLine layer={k.mapLayer} script={k.script} className="" /></span>}<Legend layer={k.mapLayer} script={k.script} /></div>
        {/* the full lists behind two of the choices (phase 4, B5) */}
        {/* TODO(copy): the links' wording */}
        {k.mapLayer.id === 'feasts' && <a className="k-views__more" href="/feasts/">All feasts and zatras, by month</a>}
        {k.mapLayer.id === 'parts' && <a className="k-views__more" href="/meanings/">What the names mean, A to Z</a>}
      </div>
    </div>
  );
}

/* A village's sheet (phase 3): its outline beside its names, the ask, its facts, and the villages next to it,
   whose buttons move the map there. */
function Village({ k, place, desktop }: { k: Khoim; place: NonNullable<ReturnType<typeof getPlace>>; desktop: boolean }) {
  return <VillageSheet place={place} script={k.script} outline={k.allPaths?.[place.id]} facts={k.facts} live={k.live.at(place.id)} layer={k.layer} headingLevel={1}
    onClose={() => k.setSnap('closed')} onTell={k.contrib.open ? kind => k.openForm(place.id, kind ?? null) : undefined} onPick={k.select} onShare={shareAction(k, desktop, false)} />;
}

function Phone({ k }: { k: Khoim }) {
  const sp = getPlace(k.selected);
  const first = !k.focus && !k.selected;
  const winH = useWindowHeight(), cap = Math.round(winH * SHEET_SHARE);
  /* How much of the card shows when collapsed. The card reports what it needs, because names wrap differently
     on different phones; until it has, use the design's figure. Never more than 40% of the screen. */
  const [measured, setMeasured] = useState<{ id: string; px: number } | null>(null);
  const cardPeek = sp ? Math.min(cap, measured?.id === sp.id ? measured.px : sp.deva ? 304 : 344) : 0;
  const spId = sp?.id;
  const onMeasure = useCallback((px: number) => { if (spId) setMeasured(m => (m && m.id === spId && m.px === px ? m : { id: spId, px })); }, [spId]);
  /* the header floats over the map; what it covers, and the sheet or bar at the bottom, frame what the map shows */
  const head = useRef<HTMLElement>(null), bar = useRef<HTMLDivElement>(null);
  const headH = useHeight(head), barH = useHeight(bar);
  /* the bar floats 16px above the bottom edge (app.css), so it takes its height and that gap */
  const bottom = sp ? (k.snap === 'full' ? cap : cardPeek) : barH + 16;
  /* With a card open the headline, the line and the ending buttons fold away; the wordmark, the script toggle and
     the views stay. In a view other than Names its line takes the headline's place, so the map keeps its room. */
  const lede = !sp && !k.layered;
  return (
    <div className="k-app k-app--phone">
      <main className="k-phone-main">
        {/* with no card open the bar at the bottom carries the OpenStreetMap credit, so nothing on the map covers Goa */}
        <GoaMap {...mapProps(k)} insetTop={headH + 8} insetBottom={bottom + 8} showCredit={!!sp} />
      </main>
      <header ref={head} className="k-phone-header">
        <div className="k-phone-header__row">
          <div className="k-phone-header__left">
            <button type="button" className="k-phone-header__wordmark" onClick={k.openMore}><Wordmark size={22} suffix="About Khoim" /></button>
          </div>
          <div className="k-phone-header__right"><ScriptToggle value={k.script} onChange={k.setScript} /></div>
        </div>
        {!first && (
          <div className="k-phone-header__row k-phone-header__row--where">
            {/* the breadcrumb is the way back up; the phone's own back button steps back too */}
            <Crumbs k={k} />
            <div className="k-phone-header__tools">
              <IconButton icon="search" label="Search any name, in any script" onClick={k.openSearch} />
              <AboutButton k={k} />
            </div>
          </div>
        )}
        {lede && <h1 className="k-lede">{LEDE}</h1>}
        {!sp && <ViewLine layer={k.mapLayer} script={k.script} className="k-count" />}
        <Views k={k} endings={!sp} compact />
      </header>
      {!sp && (
        <div ref={bar} className="k-phone-bar">
          <div className="k-phone-bar__notes">
            {/* the first-visit hint, in the phase 3 wording; it goes after the first pan, zoom or tap */}
            {!k.tapped && <p className="k-hint"><Icon name="hand" size={18} />{HINT}</p>}
            <button type="button" className="k-draft-chip" onClick={k.openMore}>Draft for review.</button>
            {k.mapLines && <OsmCredit />}
          </div>
          {first && (
            <div className="k-phone-bar__actions">
              <button type="button" className="k-search-button" onClick={k.openSearch}><Icon name="search" size={20} />Search any name, any script</button>
              <AboutButton k={k} size={56} />
            </div>
          )}
        </div>
      )}
      {sp && (
        <Sheet key={'s' + sp.id} label={sp.official} title={sheetTitle(sp)} snap={k.snap} onSnap={k.setSnap} peek={cardPeek} onMeasure={onMeasure} house={sp.level === 'village' ? undefined : houseOf(sp).key} maxShare={SHEET_SHARE}>
          <div className="k-phone-card">
            {sp.level === 'village'
              ? <Village k={k} place={sp} desktop={false} />
              : <PlaceCard place={sp} expanded={k.snap === 'full'} headingLevel={1} onExpand={() => k.setSnap('full')} onClose={() => k.setSnap('closed')} onShowInside={showInside(k)}
                  onTell={k.contrib.open ? kind => k.openForm(sp.id, kind) : undefined} live={k.live.at(sp.id)} layer={k.layer} facts={k.facts} onShare={shareAction(k, false, false)} />}
          </div>
        </Sheet>
      )}
      <SearchScreen k={k} />
      <ListScreen k={k} compact />
      <ShareSheet open={k.shareOpen} place={viewPlace(k)} layer={!sp && k.layered ? k.mapLayer : null} onClose={k.closeShare} onDone={k.showToast} />
      <Toast text={k.toast} />
      <More open={k.more} onClose={k.closeMore} onTellUs={tellUs(k)} />
      <Contribute k={k} />
      <MailNote />
      <Announcer text={k.announce} />
    </div>
  );
}

/** Desktop: the panel's width, and the gap around it. The map is centred in the space to its right. */
const PANEL = 420, GAP = 14, DOCK = 380, HINT_H = 44;

/** OpenStreetMap's credit for the rivers and railway, off the map where the page has room for it. */
function OsmCredit() {
  return <a className="k-osm-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">Rivers and railway © OpenStreetMap contributors</a>;
}

function Desktop({ k }: { k: Khoim }) {
  const sp = getPlace(k.selected);
  const dock = !!sp || !!k.query;
  const H = sp ? 'p' : 'h1';
  const hint = !k.tapped && !dock;
  return (
    <div className="k-app k-app--desktop">
      <DraftBanner {...banner(k)} />
      <div className="k-desktop">
        <main className="k-desktop__map">
          <GoaMap {...mapProps(k)} insetTop={GAP} insetBottom={hint ? GAP + HINT_H + GAP : GAP} insetLeft={GAP + PANEL + GAP} insetRight={dock ? DOCK + 2 * GAP : GAP} showCredit={false} />
          {/* text and controls: top left, over the map (docs/prototypes/type-atlas.html) */}
          <section className="k-desktop-panel" aria-label="Khoim">
            <div className="k-desktop-panel__top">
              <button type="button" className="k-desktop-header__home" onClick={() => k.goTo(null)}><Wordmark size={24} suffix="All of Goa" /></button>
              <AboutButton k={k} />
            </div>
            <Crumbs k={k} />
            {/* with a place open the panel keeps the way back and the controls, as the phone does (phase 4, B4) */}
            {!sp && <H className="k-lede">{LEDE}</H>}
            {!sp && <ViewLine layer={k.mapLayer} script={k.script} className="k-count" />}
            <ScriptToggle value={k.script} onChange={k.setScript} />
            <Views k={k} />
            <SearchField value={k.query} onChange={k.setQuery} onCancel={k.query ? () => k.setQuery('') : undefined} />
          </section>
          {hint && <p className="k-hint k-desktop-hint"><Icon name="hand" size={18} />{HINT}</p>}
          {/* the open place, or search results: docked on the right */}
          {dock && (
            <aside className="k-desktop-dock" aria-label={k.query ? 'Search' : 'Names'}>
              {k.query ? (
                <div className="k-desktop-dock__search"><SearchResults query={k.query} onPick={id => { k.setQuery(''); k.openPlace(id); }} villagesLoaded={k.villagesLoaded} factsLoaded={k.factsLoaded} lines={k.mapLines} /></div>
              ) : sp?.level === 'village' ? (
                <div key={sp.id} className="k-desktop-card k-desktop-card--village"><div className="k-desktop-card__inner"><Village k={k} place={sp} desktop /></div></div>
              ) : sp ? (
                <div key={sp.id} className="k-desktop-card" data-house={houseOf(sp).key}>
                  <div className="k-desktop-card__inner">
                    <PlaceCard place={sp} expanded headingLevel={1} onClose={() => k.setSnap('closed')} onShowInside={showInside(k)} onTell={k.contrib.open ? kind => k.openForm(sp.id, kind) : undefined} live={k.live.at(sp.id)} layer={k.layer} facts={k.facts} onShare={shareAction(k, true, false)} />
                  </div>
                </div>
              ) : null}
            </aside>
          )}
          <div className="k-desktop-credit"><Credit />{k.mapLines && <OsmCredit />}</div>
          <ListScreen k={k} compact={false} />
        </main>
      </div>
      <ShareSheet open={k.shareOpen} place={viewPlace(k)} layer={!sp && k.layered ? k.mapLayer : null} onClose={k.closeShare} onDone={k.showToast} />
      <Toast text={k.toast} />
      <More open={k.more} onClose={k.closeMore} onTellUs={tellUs(k)} />
      <Contribute k={k} />
      <MailNote />
      <Announcer text={k.announce} />
    </div>
  );
}
