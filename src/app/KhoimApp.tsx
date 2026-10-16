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
import { LayerPanel } from '../components/layers/LayerPanel';
import { LayerRow } from '../components/layers/LayerRow';
import { MAP_LAYERS, layerHeadline, layerWith, mappedVillages } from '../lib/layers';
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
  /** On a taluka's villages/ page: open with the list showing. */
  initialList?: boolean;
}

export default function KhoimApp({ initialId, initialVillage, initialList }: KhoimAppProps) {
  const desktop = useMediaQuery(DESKTOP);
  const k = useKhoim({ desktop, initialId, initialVillage, initialList });
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

/* The phase 2 map views: the row, and what the map needs for them. */
function Layers({ k }: { k: Khoim }) {
  return <LayerRow value={k.mapLayer.id} onChange={id => k.setMapLayer(id === k.mapLayer.id ? k.mapLayer : layerWith(id))} />;
}
const layerMap = (k: Khoim) => ({ mapLayer: k.mapLayer, layerVillages: k.layered && k.villagesLoaded ? mappedVillages() : undefined, allPaths: k.allPaths });
function Panel({ k }: { k: Khoim }) {
  return <LayerPanel layer={k.mapLayer} onChange={k.setMapLayer} onPickPlace={k.openPlace}
    onHelp={k.contrib.open ? () => k.openForm(k.selected ?? k.focus ?? 'goa', 'name') : undefined} helpHref={k.contrib.open ? undefined : tellUsWhatIsWrongHref(window.location.href)} />;
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
  const sheet = sp ? 'place' : k.layered ? 'layer' : fp ? 'strip' : null;
  /* How much of the card shows when collapsed. The card reports what it needs, because names wrap differently
     on different phones; until it has, use the design's figure. The map keeps clear of it. */
  const [measured, setMeasured] = useState<{ id: string; px: number } | null>(null);
  const cardPeek = sp ? (measured?.id === sp.id ? measured.px : sp.deva ? 304 : 344) : 0;
  const peek = sp ? cardPeek : k.layered ? (k.mapLayer.id === 'feasts' ? 300 : 280) : fp ? (fp.level === 'taluka' ? 224 : 200) : 0;
  const spId = sp?.id;
  const onMeasure = useCallback((px: number) => { if (spId) setMeasured(m => (m && m.id === spId && m.px === px ? m : { id: spId, px })); }, [spId]);
  /* On the first screen the map sits between the title and the buttons, however many lines they take on this phone. */
  const title = useRef<HTMLHeadingElement>(null), bottom = useRef<HTMLDivElement>(null);
  const titleH = useHeight(title), bottomH = useHeight(bottom);
  /* the layer row sits under the header's first row on the first screen, and under the second row elsewhere */
  const firstTop = titleH ? 128 + titleH + 12 : 228, firstBottom = bottomH ? bottomH + 28 : 190;
  const headline = first && k.layered ? layerHeadline(k.mapLayer) : null;
  return (
    <div className="k-app k-app--phone">
      <main className="k-phone-main">
        <GoaMap focus={k.focus} selected={k.selected} hot={k.hot} script={k.script} onSelect={k.pick} onHot={k.setHot}
          insetTop={first ? firstTop : 176} insetBottom={sheet ? peek + 8 : firstBottom} paintIn={paintIn} villages={k.villages} villagePaths={k.villagePaths} extra={k.mapExtra} factsReady={k.factsLoaded} {...marksOf(k)} {...layerMap(k)} />
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
      <h1 ref={title} className={first && !headline ? 'k-phone-title' : 'k-phone-title is-hidden'} aria-hidden={!first || !!headline}>{TITLE}</h1>
      {headline && <p className="k-phone-title k-phone-title--layer" role="status">{headline}</p>}
      <div ref={bottom} className={sheet ? 'k-phone-bottom is-hidden' : 'k-phone-bottom'}>
        <div className="k-phone-bottom__notes">
          <p className="k-hint">Tap a district, or press and drag along Goa</p>
          <button type="button" className="k-draft-chip" onClick={k.openMore}>Draft for review.</button>
        </div>
        <div className="k-phone-bottom__actions">
          <button type="button" className="k-search-button" onClick={k.openSearch}><Icon name="search" size={20} />Search any name, any script</button>
          <LayersButton k={k} size={58} />
        </div>
      </div>
      {sp && (
        <Sheet key={'s' + sp.id} label={sp.official} snap={k.snap} onSnap={k.setSnap} peek={peek} onMeasure={onMeasure} house={houseOf(sp).key}>
          <div className="k-phone-card">
            <PlaceCard place={sp} expanded={k.snap === 'full'} headingLevel={1} onExpand={() => k.setSnap('full')} onClose={() => k.setSnap('closed')} onShowInside={() => k.setSnap('closed')}
              onTell={k.contrib.open ? kind => k.openForm(sp.id, kind) : undefined} live={k.live.at(sp.id)} layer={k.layer} facts={k.facts} />
          </div>
        </Sheet>
      )}
      {!sp && k.layered && (
        <Sheet key={'l' + k.mapLayer.id} label={MAP_LAYERS.find(l => l.id === k.mapLayer.id)!.label} snap={k.snap} onSnap={sn => (sn === 'closed' ? k.setMapLayer(layerWith('names')) : k.setSnap(sn))} peek={peek}>
          <Panel k={k} />
        </Sheet>
      )}
      {!sp && !k.layered && fp && (
        <Sheet key={'t' + fp.id} label={'Places in ' + fp.official} onSnap={s => { if (s === 'closed') k.back(); }} peek={peek} expandable={false}>
          <PlaceStrip parent={fp.id} script={k.script} active={k.hot} onFocusPlace={k.setHot} onPick={k.select} headingLevel={1} {...marksOf(k)} />
          <ListButton k={k} />
        </Sheet>
      )}
      <SearchScreen k={k} />
      <ListScreen k={k} compact />
      <More open={k.more} onClose={k.closeMore} layer={k.layer} onLayer={k.setLayer} layerCounts={k.layerCounts} onTellUs={tellUs(k)} />
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
            insetTop={148} insetBottom={fp ? (fp.level === 'taluka' ? 194 : 170) : 24} insetLeft={fp ? 0 : 360} paintIn={paintIn} villages={k.villages} villagePaths={k.villagePaths} extra={k.mapExtra} factsReady={k.factsLoaded} creditAt="top" {...layerMap(k)} {...marksOf(k)} />
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
          {!fp && !sp && !k.layered && (
            <div className="k-desktop-intro">
              <h1>{TITLE}</h1>
              <p>Click a district, or press and drag along Goa.</p>
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
                  <PlaceCard place={sp} expanded headingLevel={1} onClose={() => k.setSnap('closed')} onTell={k.contrib.open ? kind => k.openForm(sp.id, kind) : undefined} live={k.live.at(sp.id)} layer={k.layer} facts={k.facts} />
                </div>
              </div>
            ) : k.layered ? (
              <div className="k-desktop__panel-layer">
                <h1 className="k-desktop__panel-headline">{layerHeadline(k.mapLayer)}</h1>
                <Panel k={k} />
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
      <More open={k.more} onClose={k.closeMore} layer={k.layer} onLayer={k.setLayer} layerCounts={k.layerCounts} onTellUs={tellUs(k)} />
      <Contribute k={k} />
      <MailNote />
      <Announcer text={k.announce} />
    </div>
  );
}
