/* The Khoim app: one map, two layouts. Phone is the default; desktop adds the names panel on the right.
   Based on design/ui_kits/khoim/Screens.jsx. */
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Credit } from '../components/core/Credit';
import { DraftBanner } from '../components/core/DraftBanner';
import { Icon } from '../components/core/Icon';
import { IconButton } from '../components/core/IconButton';
import { ScriptToggle } from '../components/core/ScriptToggle';
import { Wordmark } from '../components/core/Wordmark';
import { Button } from '../components/core/Button';
import { ContributeForm } from '../components/contribute/ContributeForm';
import { GoaMap } from '../components/map/GoaMap';
import { PlaceCard } from '../components/place/PlaceCard';
import { PlaceStrip } from '../components/place/PlaceStrip';
import { Sheet } from '../components/place/Sheet';
import { SearchField } from '../components/search/SearchField';
import { SearchResults } from '../components/search/SearchResults';
import { VillageList } from '../components/village/VillageList';
import { EndingButtons, Legend, ViewLine } from '../components/layers/Views';
import { LayerRow } from '../components/layers/LayerRow';
import { layerWith } from '../lib/layers';
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
const TITLE = 'Every taluka in Goa, with its Konkani name and how to say it.';
/* Approved in docs/phase3-brief.md. */
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
function LayersButton({ k, size }: { k: Khoim; size?: number }) {
  return <IconButton icon={k.litLayer ? k.litLayer.icon : 'layers'} label={'Layers and about' + (k.litLayer ? `. ${k.litLayer.label} layer is on` : '')} size={size} onClick={k.openMore} />;
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

/* The map views (phase 3): the row, the ending buttons in Spelling endings, and the line and legend that say what
   the colours mean. Always on screen; no sheet or card covers them. */
function Layers({ k }: { k: Khoim }) {
  return (
    <div className="k-views">
      <LayerRow value={k.mapLayer.id} onChange={id => k.setMapLayer(id === k.mapLayer.id ? k.mapLayer : layerWith(id))} />
      <EndingButtons layer={k.mapLayer} onChange={k.setMapLayer} />
      {k.layered && <div className="k-views__key" role="status"><ViewLine layer={k.mapLayer} script={k.script} /><Legend layer={k.mapLayer} /></div>}
    </div>
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
/* "See all as a list", under the strip of a taluka's villages (phase 2). */
function ListButton({ k }: { k: Khoim }) {
  const fp = getPlace(k.focus);
  if (fp?.level !== 'taluka') return null;
  return <div className="k-list-button"><Button variant="ghost" size="m" icon="list" onClick={k.openList}>See all as a list</Button></div>;
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

/* All of Goa, pulled up from the first screen: every taluka as a house-colour tile, grouped by district. A list
   route into the map; one tap opens the taluka. */
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
      <div className="k-search-screen__results">{k.search && <SearchResults query={k.query} onPick={k.openPlace} villagesLoaded={k.villagesLoaded} />}</div>
    </div>
  );
}

const childCountOf = (p: NonNullable<ReturnType<typeof getPlace>>) => p.level === 'taluka' ? (p.villageCount ?? 0) : PLACES.filter(x => x.parent === p.id).length;

function Phone({ k }: { k: Khoim }) {
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
  /* the layer row sits under the header's first row on the first screen, and under the second row elsewhere */
  /* the Goa sheet (search and layers) peeks 128px up on the first screen; the hint and the draft link sit above it */
  const GOA_PEEK = 128;
  const [goaSnap, setGoaSnap] = useState<'peek' | 'full'>('peek');
  /* opening a place puts the Goa sheet back to its peek, so going back lands on the map */
  useEffect(() => { if (sheet) setGoaSnap('peek'); }, [sheet]);
  const firstTop = titleH ? 128 + titleH + 12 : 228, firstBottom = GOA_PEEK + (bottomH ? bottomH + 20 : 70);
  return (
    <div className="k-app k-app--phone">
      <main className="k-phone-main">
        <GoaMap {...mapProps(k)} insetTop={first ? firstTop : 176} insetBottom={sheet ? peek + 8 : firstBottom} />
      </main>
      <header className="k-phone-header">
        <div className="k-phone-header__row">
          <div className="k-phone-header__left">
            {first
              ? <button type="button" className="k-phone-header__wordmark" onClick={k.openMore}><Wordmark size={22} suffix="About Khoim" /></button>
              : <IconButton icon="arrow-left" label={sp?.level === 'village' && fp ? 'Back to ' + fp.official : parent ? 'Back to ' + parent.official : 'Back to Goa'} onClick={k.back} />}
          </div>
          {/* past the first screen (which has its own layers button by the search box) the way in to layers sits here */}
          <div className="k-phone-header__right"><ScriptToggle value={k.script} onChange={k.setScript} />{!first && <LayersButton k={k} />}</div>
        </div>
        {!first && (
          <div className="k-phone-header__row k-phone-header__row--where">
            <Crumbs k={k} />
            <IconButton icon="search" label="Search any name, in any script" onClick={k.openSearch} />
          </div>
        )}
        <Layers k={k} />
      </header>
      <h1 ref={title} className={first && !k.layered && !k.mapMoved ? 'k-phone-title' : 'k-phone-title is-hidden'} aria-hidden={!first || k.layered}>{TITLE}</h1>
      <div ref={bottom} className={sheet || goaSnap === 'full' ? 'k-phone-bottom is-hidden' : 'k-phone-bottom'} style={{ bottom: GOA_PEEK + 12 }}>
        <div className="k-phone-bottom__notes">
          {/* the first-visit hint, in the phase 3 wording; it goes after the first pan, zoom or tap */}
          {!k.tapped && <p className="k-hint"><Icon name="hand" size={18} />{HINT}</p>}
          <button type="button" className="k-draft-chip" onClick={k.openMore}>Draft for review.</button>
        </div>
      </div>
      {!sheet && (
        <Sheet key="goa" label={getPlace('goa')!.official} title={sheetTitle(getPlace('goa')!)} snap={goaSnap} onSnap={sn => setGoaSnap(sn === 'full' ? 'full' : 'peek')} peek={GOA_PEEK}>
          <div className="k-phone-bottom__actions k-goa-actions">
            <button type="button" className="k-search-button" onClick={k.openSearch}><Icon name="search" size={20} />Search any name, any script</button>
            <LayersButton k={k} size={56} />
          </div>
          <GoaList k={k} />
        </Sheet>
      )}
      {sp && (
        <Sheet key={'s' + sp.id} label={sp.official} title={sheetTitle(sp)} snap={k.snap} onSnap={k.setSnap} peek={peek} onMeasure={onMeasure} house={houseOf(sp).key}>
          <div className="k-phone-card">
            <PlaceCard place={sp} expanded={k.snap === 'full'} headingLevel={1} onExpand={() => k.setSnap('full')} onClose={() => k.setSnap('closed')} onShowInside={() => k.setSnap('closed')}
              onTell={k.contrib.open ? kind => k.openForm(sp.id, kind) : undefined} live={k.live.at(sp.id)} layer={k.layer} facts={k.facts} onShare={shareAction(k, false, false)} />
          </div>
        </Sheet>
      )}
      {!sp && fp && (
        <Sheet key={'t' + fp.id} label={'Places in ' + fp.official} title={`${fp.official} · ${childCountOf(fp)} ${fp.level === 'taluka' ? 'villages' : 'talukas'}`} onSnap={s => { if (s === 'closed') k.back(); }} peek={peek + 16} expandable={false}>
          <PlaceStrip parent={fp.id} script={k.script} active={k.hot} onFocusPlace={k.setHot} onPick={k.select} headingLevel={1} {...marksOf(k)} />
          <ListButton k={k} />
        </Sheet>
      )}
      <SearchScreen k={k} />
      <ListScreen k={k} compact />
      <ShareSheet open={k.shareOpen} place={viewPlace(k)} layer={!sp && k.layered ? k.mapLayer : null} onClose={k.closeShare} onDone={k.showToast} />
      <Toast text={k.toast} />
      <More open={k.more} onClose={k.closeMore} layer={k.layer} onLayer={k.setLayer} layerCounts={k.layerCounts} onTellUs={tellUs(k)} />
      <Contribute k={k} />
      <MailNote />
      <Announcer text={k.announce} />
    </div>
  );
}

function Desktop({ k }: { k: Khoim }) {
  const fp = getPlace(k.focus), sp = getPlace(k.selected);
  return (
    <div className="k-app k-app--desktop">
      <DraftBanner {...banner(k)} />
      <div className="k-desktop">
        <main className="k-desktop__map">
          <GoaMap {...mapProps(k)} insetTop={148} insetBottom={fp ? (fp.level === 'taluka' ? 194 : 170) : 24} insetLeft={fp ? 0 : 360} />
          <header className="k-desktop-header">
            <div className="k-desktop-header__left">
              <button type="button" className="k-desktop-header__home" onClick={() => k.goTo(null)}><Wordmark size={26} suffix="All of Goa" /></button>
              <Crumbs k={k} />
            </div>
            <div className="k-desktop-header__right">
              <ScriptToggle value={k.script} onChange={k.setScript} />
              <LayersButton k={k} />
            </div>
          </header>
          <div className="k-desktop-layers"><Layers k={k} /></div>
          {!fp && !sp && !k.layered && !k.mapMoved && (
            <div className="k-desktop-intro">
              <h1>{TITLE}</h1>
              <p>{HINT}</p>
            </div>
          )}
          {fp && (
            <div className="k-desktop-strip">
              <ListButton k={k} />
              <PlaceStrip parent={fp.id} script={k.script} active={k.hot || k.selected} onFocusPlace={k.setHot} onPick={k.select} headingLevel={sp ? 2 : 1} {...marksOf(k)} />
            </div>
          )}
          <ListScreen k={k} compact={false} />
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
                  <PlaceCard place={sp} expanded headingLevel={1} onClose={() => k.setSnap('closed')} onTell={k.contrib.open ? kind => k.openForm(sp.id, kind) : undefined} live={k.live.at(sp.id)} layer={k.layer} facts={k.facts} onShare={shareAction(k, true, false)} />
                </div>
              </div>
            ) : (
              <>
                <p className="k-desktop__panel-intro">Pick a place on the map to see all its names. Search works in any script: try <span lang="gom">साश्टी</span>, Saxtti or Salcete.</p>
                {/* the three districts as a list too, for anyone who would rather pick from names */}
                {!fp && (
                  <div className="k-desktop__panel-list">
                    <PlaceStrip parent={null} script={k.script} active={k.hot} onFocusPlace={k.setHot} onPick={k.select} {...marksOf(k)} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className="k-desktop__panel-credit"><Credit /></div>
        </aside>
      </div>
      <ShareSheet open={k.shareOpen} place={viewPlace(k)} layer={!getPlace(k.selected) && k.layered ? k.mapLayer : null} onClose={k.closeShare} onDone={k.showToast} />
      <Toast text={k.toast} />
      <More open={k.more} onClose={k.closeMore} layer={k.layer} onLayer={k.setLayer} layerCounts={k.layerCounts} onTellUs={tellUs(k)} />
      <Contribute k={k} />
      <MailNote />
      <Announcer text={k.announce} />
    </div>
  );
}
