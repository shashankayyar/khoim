/* @ds-bundle: {"format":4,"namespace":"GoemDesignSystem_26c22a","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Credit","sourcePath":"components/core/Credit.jsx"},{"name":"DraftBanner","sourcePath":"components/core/DraftBanner.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"ScriptToggle","sourcePath":"components/core/ScriptToggle.jsx"},{"name":"SourceStatus","sourcePath":"components/core/SourceStatus.jsx"},{"name":"Wordmark","sourcePath":"components/core/Wordmark.jsx"},{"name":"ICON_PATHS","sourcePath":"components/core/iconPaths.js"},{"name":"GOA_SIZE","sourcePath":"components/data/goaGeo.js"},{"name":"DISTRICT_SHAPES","sourcePath":"components/data/goaGeo.js"},{"name":"TALUKA_SHAPES","sourcePath":"components/data/goaGeo.js"},{"name":"VILLAGES","sourcePath":"components/data/goaGeo.js"},{"name":"SITE","sourcePath":"components/data/khoim.js"},{"name":"STATUS_TEXT","sourcePath":"components/data/khoim.js"},{"name":"LAYERS","sourcePath":"components/data/khoim.js"},{"name":"KhoimData","sourcePath":"components/data/khoim.js"},{"name":"PLACES","sourcePath":"components/data/places.js"},{"name":"HOUSE_OF","sourcePath":"components/data/places.js"},{"name":"LayerSwitch","sourcePath":"components/layers/LayerSwitch.jsx"},{"name":"VoiceClip","sourcePath":"components/layers/VoiceClip.jsx"},{"name":"GoaMap","sourcePath":"components/map/GoaMap.jsx"},{"name":"PendingName","sourcePath":"components/place/PendingName.jsx"},{"name":"PlaceCard","sourcePath":"components/place/PlaceCard.jsx"},{"name":"PlaceStrip","sourcePath":"components/place/PlaceStrip.jsx"},{"name":"SayIt","sourcePath":"components/place/SayIt.jsx"},{"name":"Sheet","sourcePath":"components/place/Sheet.jsx"},{"name":"SearchField","sourcePath":"components/search/SearchField.jsx"},{"name":"SearchResults","sourcePath":"components/search/SearchResults.jsx"}],"sourceHashes":{"components/core/Button.jsx":"f0c75fe53045","components/core/Credit.jsx":"eb5e0da123b4","components/core/DraftBanner.jsx":"d22ed89a5061","components/core/Icon.jsx":"d9690c93ebeb","components/core/IconButton.jsx":"ad76926fa1b8","components/core/ScriptToggle.jsx":"62e16a26d92a","components/core/SourceStatus.jsx":"31b765133fc5","components/core/Wordmark.jsx":"9cc9a95ff297","components/core/iconPaths.js":"669054346d62","components/core/motion.js":"185a17633a6f","components/data/goaGeo.js":"30471b5844a1","components/data/khoim.js":"8f364f2ddb8b","components/data/places.js":"03a9972a9177","components/layers/LayerSwitch.jsx":"9d987ece2120","components/layers/VoiceClip.jsx":"180e25b7f791","components/map/GoaMap.jsx":"c43d854a154a","components/place/PendingName.jsx":"4957863cad76","components/place/PlaceCard.jsx":"0dab31f02786","components/place/PlaceStrip.jsx":"c6288790c30b","components/place/SayIt.jsx":"0bf8239957ff","components/place/Sheet.jsx":"b8f5c0ddf4d8","components/search/SearchField.jsx":"2fdafa2b9b64","components/search/SearchResults.jsx":"938fb0e2720e","ui_kits/khoim/More.jsx":"5a1218ee1ee0","ui_kits/khoim/Screens.jsx":"6c5355e7a681","ui_kits/khoim/state.jsx":"875601b35b96"},"inlinedExternals":[],"unexposedExports":[{"name":"childrenOf","sourcePath":"components/data/khoim.js"},{"name":"getPlace","sourcePath":"components/data/khoim.js"},{"name":"houseOf","sourcePath":"components/data/khoim.js"},{"name":"levelLabel","sourcePath":"components/data/khoim.js"},{"name":"nameIn","sourcePath":"components/data/khoim.js"},{"name":"sayParts","sourcePath":"components/data/khoim.js"},{"name":"searchPlaces","sourcePath":"components/data/khoim.js"},{"name":"shapeOf","sourcePath":"components/data/khoim.js"},{"name":"spokenName","sourcePath":"components/data/khoim.js"},{"name":"trailOf","sourcePath":"components/data/khoim.js"},{"name":"usePress","sourcePath":"components/core/motion.js"},{"name":"useReducedMotion","sourcePath":"components/core/motion.js"},{"name":"whereLabel","sourcePath":"components/data/khoim.js"}]} */

(() => {

const __ds_ns = (window.GoemDesignSystem_26c22a = window.GoemDesignSystem_26c22a || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Credit.jsx
try { (() => {
function Credit({
  full = false,
  style
}) {
  const p = {
    margin: 0,
    font: 'var(--weight-regular) var(--size-caption)/1.5 var(--font-latin)',
    color: 'var(--text-2)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4,
      ...style
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: p
  }, "Khoim is a non-profit initiative by Pangolin Marketing. Boundaries and official names: Local Government Directory, Government of India."), full && /*#__PURE__*/React.createElement("p", {
    style: p
  }, "Konkani names: Goa district websites, Konkani Vishwakosh (Goa University), Konkani Wikipedia. Data licence to be confirmed."));
}
Object.assign(__ds_scope, { Credit });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Credit.jsx", error: String((e && e.message) || e) }); }

// components/core/DraftBanner.jsx
try { (() => {
function DraftBanner({
  onTellUs,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "note",
    style: {
      background: 'var(--surface-invert)',
      color: 'var(--text-invert)',
      padding: '8px var(--gutter)',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '2px 10px',
      font: 'var(--weight-regular) 14px/1.45 var(--font-latin)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 700
    }
  }, "Draft for review."), /*#__PURE__*/React.createElement("span", null, "Names and pronunciation guides are not final."), onTellUs && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onTellUs,
    style: {
      border: 0,
      background: 'transparent',
      padding: '6px 0',
      margin: '-6px 0',
      color: 'inherit',
      font: 'inherit',
      fontWeight: 700,
      textDecoration: 'underline',
      textUnderlineOffset: 4,
      cursor: 'pointer'
    }
  }, "Tell us what is wrong"));
}
Object.assign(__ds_scope, { DraftBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/DraftBanner.jsx", error: String((e && e.message) || e) }); }

// components/core/ScriptToggle.jsx
try { (() => {
const OPTS = [['official', 'Official', 'var(--font-latin)'], ['deva', 'देवनागरी', 'var(--font-deva)'], ['romi', 'Romi', 'var(--font-latin)']];
function ScriptToggle({
  value = 'deva',
  onChange,
  width = 220,
  style
}) {
  const i = Math.max(0, OPTS.findIndex(o => o[0] === value));
  const refs = React.useRef([]);
  const key = e => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + 3) % 3;
    onChange && onChange(OPTS[n][0]);
    refs.current[n] && refs.current[n].focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    "aria-label": "Names on the map",
    onKeyDown: key,
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      width,
      height: 48,
      padding: 4,
      borderRadius: 'var(--radius-l)',
      background: 'var(--surface-raised)',
      boxShadow: 'var(--shadow-1)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      top: 4,
      bottom: 4,
      left: 4,
      width: 'calc((100% - 8px) / 3)',
      borderRadius: 'var(--radius-m)',
      background: 'var(--surface-invert)',
      transform: `translateX(${i * 100}%)`,
      transition: 'transform var(--dur-base) var(--ease-standard)'
    }
  }), OPTS.map(([v, l, f], n) => /*#__PURE__*/React.createElement("button", {
    key: v,
    ref: el => refs.current[n] = el,
    type: "button",
    role: "radio",
    "aria-checked": v === value,
    tabIndex: v === value ? 0 : -1,
    lang: v === 'deva' ? 'gom' : undefined,
    onClick: () => onChange && onChange(v),
    style: {
      position: 'relative',
      border: 0,
      background: 'transparent',
      borderRadius: 'var(--radius-m)',
      color: v === value ? 'var(--text-invert)' : 'var(--text)',
      font: `var(--weight-strong) 15px/1.5 ${f}`,
      cursor: 'pointer',
      transition: 'color var(--dur-fast)'
    }
  }, l)));
}
Object.assign(__ds_scope, { ScriptToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ScriptToggle.jsx", error: String((e && e.message) || e) }); }

// components/core/SourceStatus.jsx
try { (() => {
const TXT = {
  agree: 'Sources agree',
  differ: 'Sources differ',
  pending: 'Official name only'
};
function SourceStatus({
  status = 'agree',
  color = 'currentColor',
  size = 17,
  style
}) {
  const dot = {
    width: 12,
    height: 12,
    borderRadius: 6,
    border: '2px solid ' + color,
    flex: '0 0 auto',
    boxSizing: 'border-box'
  };
  const fill = status === 'agree' ? {
    background: color
  } : status === 'differ' ? {
    background: `linear-gradient(90deg, ${color} 50%, transparent 50%)`
  } : null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      color,
      font: `var(--weight-strong) ${size}px/1.4 var(--font-latin)`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      ...dot,
      ...fill
    }
  }), TXT[status]);
}
Object.assign(__ds_scope, { SourceStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SourceStatus.jsx", error: String((e && e.message) || e) }); }

// components/core/iconPaths.js
try { (() => {
// Lucide icons (ISC licence), copied from lucide-static@0.453.0 into assets/icons/. Inner SVG markup, 24x24, stroke-based.
const ICON_PATHS = {
  "arrow-left": "<path d=\"m12 19-7-7 7-7\"></path> <path d=\"M19 12H5\"></path>",
  "arrow-right": "<path d=\"M5 12h14\"></path> <path d=\"m12 5 7 7-7 7\"></path>",
  "check": "<path d=\"M20 6 9 17l-5-5\"></path>",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\"></path>",
  "chevron-up": "<path d=\"m18 15-6-6-6 6\"></path>",
  "circle-help": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"></path> <path d=\"M12 17h.01\"></path>",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle> <path d=\"M12 16v-4\"></path> <path d=\"M12 8h.01\"></path>",
  "landmark": "<line x1=\"3\" x2=\"21\" y1=\"22\" y2=\"22\"></line> <line x1=\"6\" x2=\"6\" y1=\"18\" y2=\"11\"></line> <line x1=\"10\" x2=\"10\" y1=\"18\" y2=\"11\"></line> <line x1=\"14\" x2=\"14\" y1=\"18\" y2=\"11\"></line> <line x1=\"18\" x2=\"18\" y1=\"18\" y2=\"11\"></line> <polygon points=\"12 2 20 7 4 7\"></polygon>",
  "languages": "<path d=\"m5 8 6 6\"></path> <path d=\"m4 14 6-6 2-3\"></path> <path d=\"M2 5h12\"></path> <path d=\"M7 2h1\"></path> <path d=\"m22 22-5-10-5 10\"></path> <path d=\"M14 18h6\"></path>",
  "layers": "<path d=\"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z\"></path> <path d=\"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65\"></path> <path d=\"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65\"></path>",
  "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"></rect> <path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"></path>",
  "mic": "<path d=\"M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z\"></path> <path d=\"M19 10v2a7 7 0 0 1-14 0v-2\"></path> <line x1=\"12\" x2=\"12\" y1=\"19\" y2=\"22\"></line>",
  "moon": "<path d=\"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z\"></path>",
  "music": "<path d=\"M9 18V5l12-2v13\"></path> <circle cx=\"6\" cy=\"18\" r=\"3\"></circle> <circle cx=\"18\" cy=\"16\" r=\"3\"></circle>",
  "pause": "<rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"></rect> <rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"></rect>",
  "play": "<polygon points=\"6 3 20 12 6 21 6 3\"></polygon>",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"></circle> <path d=\"m21 21-4.3-4.3\"></path>",
  "soup": "<path d=\"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z\"></path> <path d=\"M7 21h10\"></path> <path d=\"M19.5 12 22 6\"></path> <path d=\"M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62\"></path> <path d=\"M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62\"></path> <path d=\"M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62\"></path>",
  "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"></circle> <path d=\"M12 2v2\"></path> <path d=\"M12 20v2\"></path> <path d=\"m4.93 4.93 1.41 1.41\"></path> <path d=\"m17.66 17.66 1.41 1.41\"></path> <path d=\"M2 12h2\"></path> <path d=\"M20 12h2\"></path> <path d=\"m6.34 17.66-1.41 1.41\"></path> <path d=\"m19.07 4.93-1.41 1.41\"></path>",
  "volume-2": "<path d=\"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z\"></path> <path d=\"M16 9a5 5 0 0 1 0 6\"></path> <path d=\"M19.364 18.364a9 9 0 0 0 0-12.728\"></path>",
  "wheat": "<path d=\"M2 22 16 8\"></path> <path d=\"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"></path> <path d=\"M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"></path> <path d=\"M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\"></path> <path d=\"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z\"></path> <path d=\"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"></path> <path d=\"M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"></path> <path d=\"M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\"></path>",
  "x": "<path d=\"M18 6 6 18\"></path> <path d=\"m6 6 12 12\"></path>"
};
Object.assign(__ds_scope, { ICON_PATHS });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/iconPaths.js", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  label,
  style
}) {
  const inner = __ds_scope.ICON_PATHS[name] || '';
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    focusable: "false",
    style: {
      flex: '0 0 auto',
      display: 'block',
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/motion.js
try { (() => {
/* true when the user asked the OS for less motion. Components must check it before any transform animation. */
function useReducedMotion() {
  const q = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const [r, set] = React.useState(q ? q.matches : false);
  React.useEffect(() => {
    if (!q) return;
    const f = e => set(e.matches);
    q.addEventListener('change', f);
    return () => q.removeEventListener('change', f);
  }, []);
  return r;
}
function usePress() {
  const [p, set] = React.useState(false);
  return [p, {
    onPointerDown: () => set(true),
    onPointerUp: () => set(false),
    onPointerLeave: () => set(false),
    onPointerCancel: () => set(false)
  }];
}
Object.assign(__ds_scope, { useReducedMotion, usePress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/motion.js", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Button({
  variant = 'solid',
  size = 'l',
  ink = 'var(--text)',
  paper = 'var(--surface-raised)',
  icon,
  iconAfter,
  full = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  style,
  ...rest
}) {
  const [pressed, press] = __ds_scope.usePress();
  const h = size === 'l' ? 56 : 48;
  const v = {
    solid: {
      background: ink,
      color: paper,
      border: '2px solid ' + ink
    },
    outline: {
      background: 'transparent',
      color: ink,
      border: '2px solid ' + ink
    },
    ghost: {
      background: 'transparent',
      color: ink,
      border: '2px solid transparent',
      textDecoration: 'underline',
      textUnderlineOffset: 5,
      textDecorationThickness: 2
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    onClick: disabled ? undefined : onClick,
    "aria-disabled": disabled || undefined
  }, press, rest, {
    style: {
      minHeight: h,
      padding: '0 20px',
      borderRadius: 'var(--radius-l)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      width: full ? '100%' : 'auto',
      font: `var(--weight-strong) ${size === 'l' ? 18 : 17}px/1.2 var(--font-latin)`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transform: pressed && !disabled ? 'scale(var(--press-scale))' : 'none',
      transition: 'transform var(--dur-press) var(--ease-out), background-color var(--dur-fast) var(--ease-out)',
      ...v,
      ...(disabled ? {
        borderStyle: 'dashed',
        background: 'transparent',
        color: ink
      } : null),
      ...style
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  }), children, iconAfter && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconAfter,
    size: 20
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  label,
  onClick,
  tone = 'raised',
  ink = 'var(--text)',
  size = 48,
  style,
  ...rest
}) {
  const [pressed, press] = __ds_scope.usePress();
  const bg = tone === 'raised' ? 'var(--surface-raised)' : tone === 'soft' ? 'color-mix(in srgb, currentColor 14%, transparent)' : 'transparent';
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    onClick: onClick
  }, press, rest, {
    style: {
      width: size,
      height: size,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-l)',
      border: 0,
      display: 'grid',
      placeItems: 'center',
      cursor: 'pointer',
      color: ink,
      background: bg,
      boxShadow: tone === 'raised' ? 'var(--shadow-1)' : 'none',
      transform: pressed ? 'scale(var(--press-scale))' : 'none',
      transition: 'transform var(--dur-press) var(--ease-out)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/goaGeo.js
try { (() => {
// Khoim geography. Source: uploads/geo.prototype.json (LGD boundaries; a few village polygons from Survey of India, src "SOI").
// Coordinates in a 1000 x 1419.2 plane. b = [x0,y0,x1,y1]. lp = label point inside the shape. Village ids are LGD codes; n1..nN have no code.
const GOA_SIZE = [1000, 1419.2];
const DISTRICT_SHAPES = {
  "kushavati": {
    "d": "M619.6,1419.2L619.3,1417L621.1,1417.4L619.6,1419.2ZM874.4,1262.5L871.8,1269.6L872.7,1272L877.2,1276.8L880.6,1278L890.6,1293.3L885.6,1296.5L882.7,1306.6L876.9,1306.1L874.2,1316.7L874.6,1320.7L872.9,1323.9L869.2,1322.7L867.8,1323.9L865.2,1319.4L862.3,1319.5L852.5,1311.9L848.8,1311.7L846.1,1315.2L842.9,1316L840.8,1325.4L841.3,1332.9L838.3,1337.4L834.5,1338.5L832.5,1337.4L829.5,1339.9L823.4,1341.3L819.7,1344.5L813.8,1341.8L810.8,1348.3L812.3,1353.5L807,1356.9L799.5,1372.2L795.5,1376.3L780.5,1364.8L785,1358.5L785.2,1354L779.9,1346L770.8,1342.4L766.1,1339.6L765,1337.3L762.4,1336.9L760.3,1332.4L762,1327.1L754.8,1324.7L749.7,1326.9L737.9,1324.8L733.6,1329.4L731.2,1329L731.6,1330.6L729.6,1333.3L730.5,1334.8L729.1,1336.1L729.9,1339.3L725.4,1343.7L723.6,1348.5L725.6,1350.4L723.8,1354.1L726.8,1355.7L730.3,1369.3L731.7,1372.1L736.4,1374.5L741.4,1387.5L741.9,1390.8L735.7,1397.7L722.5,1391.2L722.5,1389.8L710.8,1387L707.8,1383.1L702.4,1380.3L694.6,1382L686.7,1376.7L678.2,1377L672.5,1385.6L674.2,1388.5L671.8,1390.2L663.6,1387.9L662.1,1389.6L656.1,1390.1L654.4,1394.9L648.8,1396.5L644,1392L633.2,1399.5L626.8,1411.4L623.6,1411.4L619.3,1416.3L617.4,1416L616.5,1415.2L617.6,1413.2L616.3,1411.8L617.2,1408.8L612.8,1402.5L604.1,1403.4L598,1407.2L596.2,1403.9L593.5,1403.7L591.6,1407.6L588.3,1403.8L582.1,1402.4L576.4,1395.6L562.6,1394.6L556.9,1390.7L554.7,1382.1L559.7,1379.8L557.6,1376.3L559.1,1374.7L557.6,1371.8L561.4,1371.1L562.1,1369L560.1,1366.5L562.4,1364.4L561,1362.9L559.3,1352.5L557.1,1350.7L558.7,1346.7L555.9,1343.8L559.1,1342.4L558.1,1340.4L563.2,1339.6L562.2,1334.1L564.7,1331.8L565.8,1326.7L557.6,1305.2L555.3,1303.7L556.2,1301.8L551.5,1289.6L543.5,1287.8L549.3,1284.8L547.8,1278.2L544.6,1272.4L550.5,1271.4L552.1,1266.8L550,1271L548.4,1270L543.6,1271.7L543.9,1268.5L539.5,1262.2L535.6,1262.1L532.2,1264.6L535.2,1260.8L534.7,1258.2L531.9,1257L529.4,1258.8L527,1257.3L531.5,1255.6L530,1249.5L523.1,1243.9L515.6,1242L518.4,1237.7L518.1,1235.7L521.6,1237.2L521.8,1232.5L518.6,1232.3L518.2,1234.1L516.5,1234.3L513.3,1243.1L510.6,1245.4L508.6,1241.9L501.7,1237.6L500.7,1234.4L494.9,1235.9L492.7,1231L489.3,1232.2L486.6,1228.2L484.5,1228.8L480.5,1233.5L473.9,1229.8L474.2,1224.2L472.3,1221.1L468.8,1221.1L471.9,1219.2L469,1216.3L475.3,1214.3L476.4,1209.8L467.2,1185.6L460.6,1174.6L462.5,1176.4L465.5,1176.3L472.2,1172.8L464.5,1176.4L460,1173.6L459.7,1178.1L452,1182.6L447.6,1179.2L447.7,1174.3L444.9,1167L440.2,1163L440.5,1157.9L434.5,1157.9L432.7,1155L425.3,1150.9L421,1150.8L422.4,1148L421.6,1146.4L411.1,1144L402.2,1144.6L393.9,1138.5L387.9,1138.2L385.9,1135L386.2,1130L380.6,1128.8L378.1,1126.2L373.2,1125.1L365.3,1130.6L363.2,1127.2L359.1,1128.5L357.6,1127.6L362.9,1126.5L364.9,1121.7L372.1,1120.3L372.7,1118L375.2,1117.3L376.3,1112.3L380.2,1109.7L377.2,1096.2L372.8,1095.6L372.8,1092.3L366.2,1092.5L378.5,1089.5L389.5,1083.3L392.9,1086.1L395.7,1075.7L400.9,1076.2L399.7,1065L400.9,1061.8L399.6,1058.2L396.1,1056.8L395.9,1054.5L393.3,1053.1L394.3,1051.4L397.7,1051.5L403,1048.8L407.3,1042.7L406.2,1040.4L408.7,1038.1L414.4,1039L423.6,1046.8L430.5,1044.4L435,1038.1L441.2,1040.3L442.8,1038.5L444.7,1039.2L449.7,1033.9L452.5,1034L452.9,1031.1L454.2,1032.1L459.5,1030L461.1,1026.2L476.7,1017.7L490.8,1015.4L491.7,1013.4L491.8,1015.6L498.7,1019.2L498.6,1020.7L503.7,1021.7L510.2,1014.1L510.2,1010.5L514.2,1009.9L518.2,1005.3L516.6,1002.3L526.8,1000.1L525.2,990.2L538,986L549.3,984.7L552.1,981.7L543.2,969.2L543,956.5L553.1,955.4L558.3,948.2L563,944.5L560.3,942.4L561.2,936.4L562.9,935.3L559.9,923.4L557,919.5L558.2,918L562.6,920.7L568.6,921.7L573.9,919.6L580.5,913.6L585.4,912.2L586.4,909.7L586.3,906.7L582.6,902.7L574.7,905.4L559.9,898.6L561.3,882.7L559.7,876.5L557,873L564.2,867.1L568.8,861.2L576.6,861.5L579,852L586.3,851L584.7,839.9L594.1,840.3L597.1,833.3L602.6,827.6L605.8,830.1L615.7,824.8L617.8,825.1L624.5,832.2L629.3,839.4L641.9,837.7L641.7,835L644.9,833.2L645.4,828L651.5,816.7L649.4,813L650.4,809.7L635.5,796.2L631.5,796.2L629.2,794.7L629,791.5L624.4,789.9L625,785.6L628.3,782.6L622.2,772.3L623.2,770.2L622,766L623.9,762.6L619.3,760.6L616.2,753.2L617.9,746.2L626,740.1L628.6,739.7L631.8,736.2L633.3,731.3L635.2,730.3L634.3,728.5L637.6,721.1L636.3,718.8L639.3,716.7L645.2,716L647.8,717.3L650.2,716L647.3,711.9L641.8,711L640.3,709L642.6,702.9L645,702.8L646.8,704.7L648.7,703.1L644,697.1L646,692.1L649.2,690.8L649.2,687.5L644.7,685.7L645.7,680.8L643.8,678L643.5,673.7L639.5,673.1L636.1,670.2L632.7,673L632.3,670.1L634.5,664.4L638,667.5L640.4,666L636.7,659.9L633.7,658.5L629.9,658.1L628.3,660.9L624.3,645.8L618.5,648.3L612.6,639.3L609.8,644.7L606.4,645.6L604.8,638.4L607.9,633.1L606.9,631.4L603.1,630.6L599.7,625L603.8,617.5L599.1,612.5L616.2,604.4L619.1,600.5L629.2,597.9L648,589.4L657.5,602.5L658.9,588.5L663.3,584.7L670.4,582.6L679.2,572.8L692.7,577.8L698.6,575.1L700.6,571.1L715.4,571.7L720,570L720.8,566.5L722.8,566.2L726.7,569.8L734,566.1L738.5,567.4L746.4,564.3L749.3,570.1L762,573.7L767.5,566.1L775,562.5L777.5,558.3L778.2,545L793.4,527.7L802.6,522.4L811.5,520.5L816.3,517.3L827.1,513.8L835.8,504.5L838.3,503.1L840.1,505.2L839.9,502.2L841.6,500.2L857.7,493.4L863.2,493.2L866,488.8L871.3,487.8L881.5,501.5L890.1,516.8L907.5,553.2L910.4,566.9L909.7,570.9L906.9,573.2L909.7,575.2L899.1,589.6L897.4,600.5L899.9,605.5L905.8,609.2L908.7,617.4L911.8,621.6L908.2,643.8L919,657.4L942.8,659L957.8,670.7L979.9,681.4L969.4,688.7L969.1,693.5L977.9,719.3L970.9,732.5L970.6,742L981.8,772.2L1000,795.8L991.4,807.5L984.7,813.4L975.9,811.9L974.5,813.8L956.8,814L936.2,804.8L934.7,812.2L926,813.2L917.1,818.6L908.9,813.7L901.5,817.5L899.3,824.2L891.9,836.7L888,847.7L885.7,850.4L870.6,852.5L876.1,860L872.3,864.8L883.4,880.5L916.1,888L924.6,893.5L931.9,891.9L947.2,906.8L944.5,913.7L946.9,918.2L948.1,916.7L951.6,918.8L951.2,923L953.1,925.2L953.5,930.3L960,935.2L957.8,942.2L958.9,948.5L963.6,959.1L969.1,964.2L971.1,970.6L966.2,975.6L966.4,980.4L962.3,983.8L951.8,1002.3L938.2,1021.7L931.6,1025.4L922.2,1025.2L919.8,1034.9L922.3,1044.6L920.8,1050.7L921.8,1080.4L918.8,1081.8L918.5,1091.7L909.2,1093.8L906.1,1097.1L903.3,1106.2L907.2,1108.7L914,1121L915.5,1151.3L920.1,1155.5L928.8,1157.6L930,1175.2L936.6,1182.2L939.4,1194.7L926.9,1201.8L919.4,1209.9L919.6,1222.5L903,1237.1L897.9,1245.2L893.9,1248.7L894.2,1253.1L896.3,1256.4L887,1259.2L883.3,1258.7L874.4,1262.5Z",
    "lp": [758, 951.9],
    "b": [357.6, 487.8, 1000, 1419.2]
  },
  "north-goa": {
    "d": "M404.6,163.1L405.9,164.7L408.7,162.3L416.3,164.4L418.5,159.6L422.1,159.9L424.8,158.1L426.6,160.4L428,158.8L428.9,160.3L427.8,161.8L434.7,170.2L435.5,176.9L433.3,200.9L437.9,206.9L441.1,221.3L433.1,233.8L430.8,244.4L431.9,250.5L440.4,260.6L441.1,268L445.5,273L458.1,273.4L471.4,289.9L475.5,296.9L479.8,299.4L493,298.6L503.2,300.1L521.4,306.5L528.4,301.2L531.9,289.8L537.1,280.5L552.7,277.5L566.6,277L580.7,273.1L583.3,271.2L583.6,274.3L586,274.5L589.6,269.4L595.3,268.9L596.2,270.2L607.5,265.4L608.9,266.1L619.9,260L624,254.8L632.8,249.5L637.7,251.6L644.1,249L646.2,245.6L652.2,243L656.8,242.3L662.5,243.6L662.9,239.4L665.9,238.8L668.1,234.1L682.9,235.7L695.4,240L703.8,235.7L715.9,234.4L718.9,234.5L723.9,237.6L728.6,230.1L739.2,232L740.9,230.6L740.1,225L741.1,214L743.6,202.7L750.1,200L757.3,190.2L764.3,186.9L776,188.8L778.4,189.8L779.2,191.9L779.3,195.9L772,198.9L773.2,210L797,216.8L799.3,216L795.8,227.5L800.9,235.8L819.6,233.2L826.7,228.6L826.8,226.7L820,224.3L816.1,217.2L819.9,218.1L820.4,214.9L829.2,207.6L830.4,211.9L836.2,214.8L838.3,211.7L840.9,212L843.7,209.2L848.2,208.2L849.4,211.9L852.9,214.5L851,216L858.3,217.9L861.1,224.6L869.6,226L869.2,227.8L871.9,230.7L860.1,275L866.3,280.1L874.6,274L881.8,279.3L882,283.4L885.9,285.7L890.6,291.7L887,302.8L884.1,305.5L885.3,315L883.5,321.9L884.5,327.7L867,346.9L869.7,351.7L861.6,368.6L868.4,366.9L881.6,376.3L886.7,371.3L889.6,373.8L892.1,381.5L911.3,400.8L918.4,423.9L917,432.2L911.6,437.4L912.1,445.8L905.1,454.1L884.6,463.2L874.7,470.6L872.4,474.4L870.3,486.2L871.2,488.5L866,488.8L863.2,493.2L857.7,493.4L841.6,500.2L839.9,502.2L840.1,505.2L838.3,503.1L835.8,504.5L827.1,513.8L816.3,517.3L811.5,520.5L802.6,522.4L793.4,527.7L778.2,545L777.5,558.3L775,562.5L767.5,566.1L762,573.7L749.3,570.1L746.4,564.3L738.5,567.4L734,566.1L726.7,569.8L722.8,566.2L720.8,566.5L720,570L715.4,571.7L700.6,571.1L698.6,575.1L692.7,577.8L679.2,572.8L670.4,582.6L663.3,584.7L658.9,588.5L657.5,602.5L648,589.4L629.2,597.9L619.1,600.5L616.2,604.4L599.4,612.5L595.8,610.9L592.8,613.2L587.4,612.4L584.7,617.5L578.7,618.8L576.7,622.8L575.2,621.6L573.6,613.1L568.6,610.9L568.7,604.2L565.6,602.8L564.1,600.1L569.9,592.4L567.5,586.3L571.7,584.3L572,578.1L567.8,575.7L563,580L560.7,576.7L563.6,572.5L561.9,568.5L554.4,564.5L549.2,559.1L546.9,558.9L545.4,560.6L543,559L542.7,551.3L549.7,554.5L553,551.3L549.8,545.6L546,543.7L542.8,539.6L542.9,527.1L533.3,521.3L529.7,516.2L536.4,512.4L537.6,508.2L525.6,505.3L522.8,487.3L516.2,479.8L496.4,475.9L492.6,473.8L489.5,470.7L487.2,459.6L483.5,452.8L471.3,444.5L446.2,435L440.1,420.5L437,415.6L432.6,412.3L426.4,416.7L426.2,420.2L420.2,431.9L411.6,436.4L406.1,436.7L413.5,446.6L413.8,452.4L420.8,458.5L426.6,459.7L432.9,470.2L432.5,471.8L428.7,471.8L420.3,477.1L422.9,495L422.4,498L417.1,504.2L415.8,510.3L417.8,516L424.9,522.9L425.9,532.3L421.4,536.1L413.1,537.5L408.9,544.5L406.8,555.9L409.5,565.4L408.8,570.6L400.2,574.7L389.3,576.7L382.6,581.1L379.3,586.4L379.6,595.2L370.7,606.5L365.5,617.6L351.5,614.8L334.7,615.4L300.4,604.8L284.6,604.3L278.4,602.3L260.8,592.4L249.8,588.7L231.3,585.8L201.1,583.8L165.4,572L167.9,536.4L169.3,536L168.1,532.8L171,530.2L158.6,511.7L149.7,490.5L147.8,490.4L146.7,488.4L140.7,488L140.5,489.1L139,484.6L135.9,484.6L134.4,479.8L137,478.9L137.9,474.7L119,402.5L109.6,378.1L110.6,374.9L105.1,379.4L98.4,375.1L96.8,362.3L89,339L87.6,336.3L85,336L83.8,334L84.1,331.1L87.1,327.9L84.2,322.7L85.2,320.7L83.4,319.6L86.7,314.5L82.9,306.6L83.6,305.2L93.7,303.8L97.5,307.8L102.7,307.1L99.5,305.1L95.9,297.2L89.6,298L85.6,294.1L74.9,274.3L71.3,272.4L69.6,274L68.2,271L69.6,269.9L68.5,265.4L67.2,262.6L65.1,262.2L66.5,261L62.2,253.6L57.9,241L55.7,232.4L56.3,228.7L54.8,228.3L52.2,216.8L42.4,198.4L39,180.4L36.2,173.9L32.5,173L31.5,165L26.3,159.6L25.5,148.2L18.8,130.5L19.1,128.4L22.5,127.4L25.4,130.6L33.7,130.5L36.1,129.6L36.8,126.7L50.8,121L55.1,122L60.3,120.5L65.2,121.5L68.5,126L72.2,127.9L70.6,131.7L74.8,132L83.2,126.6L87.8,112.4L94.7,104.6L99.9,101.3L114.9,103.7L119.3,102.9L132.7,106.5L133.8,105.6L141.6,111.2L151.6,114.1L154.1,113.6L163.8,117.8L167.7,114.4L169.8,104.1L176.2,100.3L182.4,105L196.6,99.6L200.9,92.8L205.7,92.1L214.2,96.8L220.5,95.1L227.3,90.1L227.6,84.6L233.3,74.1L231.7,57.7L234.4,56L243.1,54.6L244.9,52.6L248.5,39.1L253.2,31.3L262.2,33.8L266.4,31.6L266.4,29.7L257.9,23.9L263.1,17.9L266.6,6.2L271.9,0.1L288.9,6.3L284.9,16L286.8,24.6L292.5,27.5L298,37.6L302.5,41.4L304.7,42.2L304.3,40.3L304.7,39.9L308,42L308,44.3L303.9,51.8L300.4,53.2L303.4,57.5L300,62.2L297.4,63.1L297.1,72.9L301.4,78.2L309.6,80.5L316.1,78.6L327.4,81.2L333.4,83.3L337,86.5L348.8,83.4L348.8,80.3L360.7,87.4L389.3,88.7L396.9,90.7L400.2,98.9L399.7,105L401.4,108.4L401.5,112.9L407.9,125.5L416.3,132.5L416.1,136L417.6,136.2L412.8,140.7L413.7,142L409.7,143.4L412.9,145.2L411.3,148.2L411.8,153.3L410.6,156.9L404.6,163.1ZM19.4,112.5L23.6,114.5L25.3,120.9L28.6,120.9L29.9,122.3L28.9,124.6L24.1,125.1L16.5,121.8L15.3,125.4L9.2,126.8L9.7,124.2L4.5,125.6L5.1,124.4L3.7,124L6.1,120.7L5.6,119.3L0.1,118.1L2.1,116L2.3,113.3L19.4,112.5Z",
    "lp": [485, 311.1],
    "b": [0.1, 0.1, 918.4, 622.8]
  },
  "south-goa": {
    "d": "M602.5,827.8L597.1,833.3L594.7,839.8L591.1,840.9L584.7,839.9L586.5,850.7L579,852L576.6,861.5L569.1,861.1L564.2,867.1L557.1,872.4L561.3,882.7L559.9,898.6L574.7,905.4L582.6,902.7L586.3,906.7L586.4,909.7L585.4,912.2L580.5,913.6L573.9,919.6L568.6,921.7L562.6,920.7L558.2,918L557,919.5L559.9,923.4L562.9,935.3L561.2,936.4L560.3,942.4L563,944.5L558.3,948.2L553.1,955.4L543,956.5L543.2,969.2L552.1,981.7L549.3,984.7L538,986L525.2,990.2L526.8,1000.1L516.6,1002.3L518.2,1005.3L514.2,1009.9L510.2,1010.5L510.2,1014.1L503.7,1021.7L498.6,1020.7L498.7,1019.2L491.8,1015.6L491.7,1013.4L490.8,1015.4L476.7,1017.7L461.1,1026.2L459.5,1030L454.2,1032.1L452.9,1031.1L452.5,1034L449.7,1033.9L444.7,1039.2L442.8,1038.5L441.2,1040.3L435,1038.1L430.5,1044.4L423.2,1046.2L412.8,1031.9L396.9,969.3L397.1,965.5L392.9,953L384.1,912.3L380.4,903.3L381.2,900.1L377.8,893L371.6,869.5L368.6,864.4L364.4,846.3L356.1,823.8L351,802.2L341.4,772.7L331.1,746.2L329.9,739.3L314.2,704.1L306.6,690.5L298.3,681.1L294.7,679L283.1,681L282.1,686L268.3,687.2L267,693.2L264.4,695.1L251.3,696L243.5,691.5L240.9,684.1L234.8,678.5L232.5,680.7L229.9,680.9L221.4,678.3L219.4,674.8L211.6,674.5L204.5,668.6L200,668.9L198.4,666.1L201.3,663.7L202.6,659.3L200.8,663.3L198.6,663.4L199,655.7L195.6,643.4L192.6,640.4L187.1,642.5L180.3,641L179.1,642.5L172.3,640.2L171.5,635.7L172.8,635L174.4,632.2L173.6,633.3L170.6,631.9L165.6,621.2L161.8,617.8L161.1,613.6L162.6,610.7L166.7,609.8L170.8,611.6L174.1,603.1L174.3,600.4L165.4,572L201.1,583.8L231.3,585.8L249.8,588.7L260.8,592.4L278.4,602.3L284.6,604.3L300.4,604.8L334.7,615.4L351.5,614.8L365.5,617.6L370.7,606.5L379.6,595.2L379.3,586.4L382.6,581.1L389.3,576.7L400.2,574.7L408.8,570.6L409.5,565.4L406.8,555.9L408.9,544.5L413.1,537.5L421.4,536.1L425.9,532.3L424.9,522.9L417.8,516L415.8,510.3L417.1,504.2L422.4,498L422.9,495L420.3,477.1L428.7,471.8L432.5,471.8L432.9,470.2L426.6,459.7L420.8,458.5L413.8,452.4L413.5,446.6L406.1,436.7L411.6,436.4L420.2,431.9L426.2,420.2L426.4,416.7L432.6,412.3L437,415.6L440.1,420.5L446.2,435L471.3,444.5L483.5,452.8L487.2,459.6L489.5,470.7L493.4,474.6L514.5,478.8L520.5,483.9L523.6,489.9L525.6,505.3L537.8,508.5L536.4,512.4L529.7,516.2L533.3,521.3L542.9,527.1L542.8,539.6L546,543.7L549.8,545.6L553,551.3L549.7,554.5L542.7,551.3L543,559L545.4,560.6L546.9,558.9L549.2,559.1L554.4,564.5L561.9,568.5L563.6,572.5L560.7,576.7L563,580L567.8,575.7L572,578.1L571.7,584.3L567.5,586.3L569.9,592.4L564.1,600.1L565.6,602.8L568.7,604.2L567.9,608.7L569,611.5L573.6,613.1L575.2,621.6L576.7,622.8L578.7,618.8L584.7,617.5L587.4,612.4L592.8,613.2L595.8,610.9L599.1,612.5L603.8,617.5L599.7,625L603.1,630.6L606.9,631.4L607.9,633.1L604.8,638.4L606.4,645.6L609.8,644.7L612.6,639.3L618.5,648.3L624.3,645.8L628.3,660.9L629.9,658.1L633.7,658.5L636.7,659.9L640.4,666L638,667.5L634.5,664.4L632.3,670.1L632.7,673L636.1,670.2L639.5,673.1L643.8,674.2L643.6,677.4L645.7,680.8L644.7,685.7L649,687L649.3,688.3L649.2,690.8L646,692.1L644,697.4L648.7,702.9L646.8,704.7L645,702.8L642.5,703L640.3,709.3L641.8,711L647.3,711.9L650.2,716L647.8,717.3L645.2,716L639.3,716.7L636.3,718.8L637.6,721.1L634.3,728.5L635.2,730.3L633.3,731.3L631.8,736.2L628.6,739.7L626,740.1L617.9,746.2L616.2,753.2L619.3,760.6L623.9,762.6L622,766L623.2,770.2L622.2,772.3L628.3,782.6L625,785.6L624.4,789.9L629,791.5L629.2,794.7L631.5,796.2L635.5,796.2L650.4,809.7L649.4,813L651.5,816.7L645.4,828L644.9,833.2L641.3,835.6L641.9,837.7L629.3,839.4L617,824.7L605.8,830.1L602.5,827.8Z",
    "lp": [480.1, 729.4],
    "b": [161.1, 412.3, 651.5, 1046.2]
  }
};
const TALUKA_SHAPES = {
  "sanguem": {
    "district": "kushavati",
    "d": "M762.1,726.2L761.4,732.1L757.8,735L758.2,739.6L763.6,747.7L769.8,752.4L766.8,755.5L771.6,762.4L771.8,771.2L775.5,770.7L784.8,772.3L789.7,771.5L799.2,774.6L804.3,774.4L807.6,770.6L812.1,771.2L828.4,763.3L833,759L834.6,755.9L837.2,755.6L840.3,748L841.3,749.2L843,748.2L843.6,750.5L850.3,753.1L849.6,755.4L851.3,760.3L857.3,766L867.1,767.3L869.4,781.9L876,783.6L879.3,785.8L883.2,781.6L886,782.8L887.6,785.6L893.8,781.9L903.8,781.6L911.2,767.9L912.9,773.1L916.5,775.8L917.6,778.9L916.5,784.8L917,791.6L921.8,793.5L923.4,796.2L936,805.6L934.7,812.2L926,813.2L917.1,818.6L908.9,813.7L901.5,817.5L899.3,824.2L891.9,836.7L886.4,849.6L870.6,852.5L876.1,860L872.3,864.8L877,870.3L877.8,874.2L883.4,880.5L916.1,888L924.6,893.5L931.9,891.9L947.2,906.8L944.5,913.7L946.9,918.2L948.1,916.7L951.6,918.8L951.2,923L953.1,925.2L953.5,930.3L960,935.2L957.8,942.2L960.5,953.4L964.6,960.5L968.4,963.4L970.5,966.7L971.1,970.6L966.2,975.6L966.4,980.4L962.3,983.8L951.8,1002.3L938.2,1021.7L931.6,1025.4L922.2,1025.2L921.4,1030.9L919.9,1031.1L919.8,1034.9L922.3,1044.6L920.8,1050.7L921.8,1080.4L918.8,1081.8L918.5,1091.7L909.2,1093.8L906.1,1097.1L903.3,1106.2L907.2,1108.7L914,1121L915.5,1151.3L920.1,1155.5L928.8,1157.6L930,1175.2L934,1180.8L936.6,1182.2L939.4,1194.7L926.9,1201.8L919.4,1209.9L919.6,1222.5L903,1237.1L897.9,1245.2L893.9,1248.7L894.2,1253.1L896.3,1256.4L887,1259.2L883.3,1258.7L874.1,1263.2L868.6,1257.8L857.6,1256L848.4,1244.9L845.1,1237.6L841.5,1223.3L840.6,1215.1L841.2,1208.1L837.4,1203.5L823.3,1194.7L819.3,1190.3L805.5,1193.1L776.5,1194.5L767.4,1196.4L772.1,1189.5L774.3,1177.5L776.8,1173.6L780.8,1171L783.3,1161.8L782.4,1160.1L778.2,1157.7L778.7,1153.7L775.8,1153L790.5,1150.6L791.8,1149.6L791.9,1146.9L786,1138L779.3,1133.2L776.8,1132.7L772.4,1134.2L765.7,1131.8L755.5,1131.3L754.5,1127.4L751.1,1126L752.3,1123.4L749.9,1119.3L752.8,1119.8L755.5,1118.2L759,1094.3L761,1091.4L754.5,1084.2L753.9,1081.4L748.9,1081.1L749.3,1076.1L745.8,1071.9L742,1073L741,1069.6L731.4,1067.2L730.3,1068.5L727.9,1067L726.9,1068.7L723.2,1069.7L718.9,1074.4L707,1081.1L700.3,1080.8L694.5,1077L693.7,1072.5L688,1071.3L685.2,1065.8L681.6,1069L683.5,1071.6L677.8,1079.1L672.6,1079.7L667.3,1077.7L658.4,1079.3L657.2,1079.8L655.4,1085.5L653.4,1086.5L652,1091.3L646.7,1092.3L645.4,1090.8L645.9,1084L644,1081.4L645.3,1080.7L644.3,1076.5L641.1,1070.9L641.1,1067.3L642.7,1065.2L641.1,1063.6L641.6,1059.6L638.7,1058.3L639,1055.6L637.3,1053.5L637,1048.9L625.8,1047.1L621.4,1048.6L619.8,1047.9L614.6,1042.3L613.2,1037.9L611.7,1037.1L610.7,1028.8L612,1027.7L609.4,1018L606.8,1014.8L597.6,1014.5L586.9,1007.3L593.2,996.8L590,982.6L594.6,980.4L598.3,982.3L601.4,981.4L603.9,979L608,977.8L610.4,974.3L614.5,975.1L619.3,973.2L622.6,973.4L622,969.5L626,968.1L628.8,964.1L636.3,961.6L637.6,964.2L641.9,964.7L644.7,962.7L651.8,961.2L651,963.5L655.4,971.5L658.3,975.2L662.2,976.8L663.9,982.9L670.1,987.7L672.1,992.2L677,995.5L678.5,995.7L681.8,992.7L684.8,993.4L689,990L715.4,997.9L724,994L727.5,990.2L742.3,987.8L752.2,983.2L756,966.5L753.2,965.1L749.9,958.8L744.3,960.2L734.5,958.9L732.3,953L721,941.9L715.8,939.9L709.7,934L703.5,930.5L699.5,929.4L694.6,930.3L693.2,926.6L687.7,920.7L684.4,912.9L683.9,906.3L687.2,901.9L696.2,895.7L700.6,896L704.1,893.8L706.8,893.7L708.7,891.3L708.5,888.8L714.7,887.2L715.4,883.3L713,882.4L710,884.7L708.5,884.3L707.7,876.6L699.7,874.9L698.7,873.2L700.2,869.5L694.8,863.3L690.3,864.4L687.6,866.6L686.3,870.1L684,870.1L684.7,857.2L682.6,854.5L678.6,855.6L674.8,853L676.5,844.1L673,836.1L669,836.2L662.6,844.1L657.2,841.8L647,842.9L641.9,837.7L641.3,835.6L644.9,833.2L645.4,828L651.5,816.7L649.4,813L650.4,809.7L645.3,805L652.8,797.4L670.3,797.8L674.6,799.7L682.9,800.4L685.5,802.6L686.1,806.5L693.3,801.8L696.4,795L698.1,795.1L707,790.4L708.1,786.4L706.6,778.8L711.2,776.8L711.5,773.9L706.6,759.4L709.2,757.6L714.4,748.9L720.8,746.5L720.7,744.5L722.7,743.8L727.3,736.8L726.9,734.7L722.2,732.8L719.8,729.9L720.1,725.3L724.1,726.4L729.9,721.7L731.2,723.5L728.4,725.3L727.9,730.6L729.6,730.7L731.7,728.6L739.1,731.9L740.5,727.5L744.7,726.5L749.1,723.1L750.3,723.9L748.8,726L751.8,726.8L753.6,726.1L756.7,721.7L761.2,721.2L762.3,721.7L761,724.6L762.1,726.2Z",
    "lp": [842.3, 991.2],
    "b": [586.9, 721.2, 971.1, 1263.2]
  },
  "canacona": {
    "district": "kushavati",
    "d": "M620.7,1417.6L619.6,1419.2L619.2,1418.9L619.3,1417L620.7,1417.6ZM402.6,1085.3L411.2,1093.6L418.2,1109.8L422.3,1113.6L427.5,1121.6L461.2,1105.6L470.7,1108.2L476.4,1106.9L478,1109.4L480.1,1107.3L484,1107L488.3,1104.5L491.5,1106.8L499,1105.4L496.9,1107.8L495.2,1113L495.1,1127.9L496.6,1129L497.5,1133.3L502.2,1139.9L508.8,1143.4L511.4,1147L515.6,1148.4L511.4,1155.3L506.9,1156.8L506.4,1159L505.2,1159L510.3,1169.3L512.8,1177.5L519.4,1177.5L526.1,1180L531,1179.3L539.2,1181.2L546.2,1179L561.6,1183L569.9,1186.7L582.7,1178.9L593.2,1180.3L598,1176.5L601.5,1176.2L612.1,1180.1L617.6,1178.7L630.9,1185.9L634,1192L638.8,1194.7L649.7,1174L659.5,1166L679.5,1159.7L684.2,1157L687.3,1157.3L697.6,1154.2L703,1155L707.4,1158.4L716.9,1155.1L728.4,1157.5L732.6,1156.2L736.4,1157L741.4,1162.4L748.2,1166.9L748.7,1169.7L744.3,1177.2L739,1178.4L734.9,1183.9L737.3,1185.8L741.7,1185.3L741.5,1189.2L743.1,1191L747,1190.6L754.9,1193.3L758.3,1196.9L762,1197.6L765.2,1195.4L767.9,1196.4L776.5,1194.5L805.5,1193.1L819.3,1190.3L823.3,1194.7L839.5,1205.4L841.2,1208.1L840.6,1215.1L841.5,1223.3L847.4,1243.4L857.6,1256L868.6,1257.8L873.5,1262.4L872.1,1271L876.5,1276.2L880.6,1278L890.6,1293.3L885.6,1296.5L882.7,1306.6L876.9,1306.1L874.2,1316.7L874.6,1320.7L872.9,1323.9L869.2,1322.7L867.8,1323.9L865.2,1319.4L862.3,1319.5L860.3,1317.2L855.9,1315.6L852.5,1311.9L848.8,1311.7L846.1,1315.2L842.9,1316L840.8,1325.4L841.3,1332.9L840,1335.2L838.3,1337.4L834.5,1338.5L832.5,1337.4L829.5,1339.9L823.4,1341.3L819.7,1344.5L813.8,1341.8L810.8,1348.3L812.3,1353.5L807,1356.9L799.5,1372.2L795.5,1376.3L780.5,1364.8L785,1358.5L785.2,1354L779.9,1346L770.8,1342.4L766.1,1339.6L765,1337.3L762.4,1336.9L760.3,1332.4L762,1327.1L754.8,1324.7L749.7,1326.9L748.2,1325.7L737.9,1324.8L733.6,1329.4L731.2,1329L731.6,1330.6L729.6,1333.3L730.5,1334.8L729.1,1336.1L729.9,1339.3L725.4,1343.7L724.9,1347.5L723.6,1348.5L725.6,1350.4L723.8,1354.1L726.8,1355.7L727.6,1362.4L729,1363.3L730.3,1369.3L731.7,1372.1L736.4,1374.5L741.4,1387.5L741.9,1390.8L735.7,1397.7L722.5,1391.2L722.5,1389.8L710.8,1387L707.8,1383.1L702.4,1380.3L694.6,1382L686.7,1376.7L678.2,1377L672.5,1385.6L674.2,1388.5L671.8,1390.2L663.6,1387.9L662.1,1389.6L660.8,1388.9L656.1,1390.1L654.4,1394.9L652.6,1394.5L648.8,1396.5L644,1392L633.2,1399.5L626.8,1411.4L623.6,1411.4L619.3,1416.3L616.5,1415.4L617.6,1413.2L616.3,1411.2L617.5,1409.8L612.8,1402.5L604.1,1403.4L598,1407.2L596.5,1406.2L596.2,1403.9L593.5,1403.7L591.6,1407.6L591,1405.8L588.3,1403.8L582.1,1402.4L576.4,1395.6L562.6,1394.6L557.4,1391.5L554.6,1384.1L555.3,1381.1L559.8,1379.6L558.9,1376.7L557.6,1376.3L559.1,1374.7L557.6,1371.8L561.4,1371.1L562.1,1369L560.1,1366.5L562.4,1364.4L561,1362.9L559.3,1352.5L557.1,1350.7L558.9,1348.6L558.7,1346.7L555.9,1343.8L559.1,1342.4L558.1,1340.4L560.8,1340.8L563.2,1339.6L562.2,1334.1L564.7,1331.8L565.8,1326.7L557.6,1305.2L555.3,1303.7L556.2,1301.8L551.5,1289.6L543.5,1287.8L544.5,1286.6L548.3,1286.2L549.3,1284.8L547.8,1278.2L544.6,1272.4L550.5,1271.4L552.1,1266.7L550.3,1268.5L550,1271L548.4,1270L543.6,1271.7L543.9,1268.5L539.5,1262.2L535.6,1262.1L532.2,1264.6L535.2,1260.8L534.7,1258.2L531.9,1257L529.4,1258.8L527,1257.3L531.5,1255.6L530,1249.5L523.1,1243.9L515.6,1242L518.4,1237.7L518.1,1235.7L521.6,1237.2L522.5,1234.5L521.8,1232.5L518.6,1232.3L518.2,1234.1L516.5,1234.3L513.3,1243.1L510.6,1245.4L508.6,1241.9L501.7,1237.6L500.7,1234.4L494.9,1235.9L492.7,1231L489.3,1232.2L486.6,1228.2L484.5,1228.8L483.8,1230.9L480.5,1233.5L473.9,1229.8L474.2,1224.2L472.3,1221.1L468.8,1221.1L471.9,1219.2L469,1216.3L475.3,1214.3L476.4,1209.8L467.2,1185.6L460.6,1174.6L462.5,1176.4L465.5,1176.3L467,1174.6L472.2,1172.8L467.2,1174.2L464.5,1176.4L460,1173.6L459.7,1178.1L452,1182.6L447.6,1179.2L447.7,1174.3L444.9,1167L442.7,1163.9L440.2,1163L441.1,1160.9L440.5,1157.9L434.5,1157.9L432.7,1155L429,1154L425.3,1150.9L421,1150.8L422.4,1148L421.6,1146.4L411.1,1144L402.2,1144.6L393.9,1138.5L387.9,1138.2L385.9,1135L386.2,1130L380.6,1128.8L378.1,1126.2L373.2,1125.1L365.3,1130.6L363.2,1127.2L357.7,1128.1L358.2,1126.9L362.9,1126.5L364.5,1122L369.1,1120L372.1,1120.3L372.7,1118L375.2,1117.3L376.3,1112.3L380.2,1109.7L377.2,1096.2L372.8,1095.6L372.8,1092.3L366.2,1092.5L378.5,1089.5L382.3,1086.4L389.5,1083.3L392.9,1086.1L395.7,1075.7L402.6,1085.3Z",
    "lp": [689, 1247.4],
    "b": [357.7, 1075.7, 890.6, 1419.2]
  },
  "quepem": {
    "district": "kushavati",
    "d": "M641.9,837.7L647,842.9L657.2,841.8L662.6,844.1L669,836.2L673,836.1L676.5,844.1L674.8,853L678.6,855.6L682.6,854.5L684.7,857.2L684,870.1L686.3,870.1L687.6,866.6L690.3,864.4L694.8,863.3L700.2,869.5L698.7,873.2L699.7,874.9L707.7,876.6L708.5,884.3L710,884.7L713,882.4L715.4,883.3L714.7,887.2L708.5,888.8L708.7,891.3L706.8,893.7L704.1,893.8L700.6,896L696.2,895.7L687.2,901.9L683.9,906.3L684.4,912.9L687.7,920.7L693.2,926.6L694.6,930.3L699.5,929.4L703.5,930.5L709.7,934L715.8,939.9L721,941.9L732.3,953L734.5,958.9L744.3,960.2L749.9,958.8L753.2,965.1L756,966.5L752.6,982.1L750.5,984.5L742.3,987.8L727.5,990.2L724,994L715.4,997.9L689,990L684.8,993.4L681.8,992.7L678.5,995.7L677,995.5L672.1,992.2L670.1,987.7L663.9,982.9L662.2,976.8L658.3,975.2L655.4,971.5L651,963.5L651.8,961.2L644.7,962.7L641.9,964.7L637.6,964.2L636.3,961.6L628.8,964.1L626,968.1L622,969.5L622.6,973.4L619.3,973.2L614.5,975.1L610.4,974.3L608,977.8L603.9,979L601.4,981.4L598.3,982.3L594.6,980.4L590,982.6L593.2,996.8L586.9,1007.3L597.6,1014.5L606.8,1014.8L609.4,1018L612,1027.7L610.7,1028.8L611.7,1037.1L613.2,1037.9L614.6,1042.3L619.8,1047.9L621.4,1048.6L625.8,1047.1L637,1048.9L637.3,1053.5L639,1055.6L638.7,1058.3L641.6,1059.6L641.1,1063.6L642.7,1065.2L641.1,1067.3L641.1,1070.9L644.3,1076.5L645.3,1080.7L644,1081.4L645.9,1084L645.4,1090.8L646.7,1092.3L652,1091.3L653.4,1086.5L655.4,1085.5L657.2,1079.8L658.4,1079.3L667.3,1077.7L672.6,1079.7L677.8,1079.1L683.5,1071.6L681.6,1069L685.2,1065.8L688,1071.3L693.7,1072.5L694.5,1077L700.3,1080.8L707,1081.1L718.9,1074.4L723.2,1069.7L726.9,1068.7L727.9,1067L730.3,1068.5L731.4,1067.2L741,1069.6L742,1073L745.8,1071.9L747.7,1073.8L749.6,1077.4L748.9,1081.1L753.9,1081.4L754.5,1084.2L761,1091.4L759,1094.3L755.5,1118.2L752.8,1119.8L749.9,1119.3L752.3,1123.4L751.1,1126L754.5,1127.4L755.5,1131.3L765.7,1131.8L772.4,1134.2L776.8,1132.7L779.3,1133.2L786,1138L791.9,1146.9L791.8,1149.6L790.5,1150.6L775.8,1153L778.7,1153.7L778.2,1157.7L782.4,1160.1L783.3,1161.8L780.8,1171L776.8,1173.6L774.3,1177.5L772.1,1189.5L767.4,1196.4L765.2,1195.4L762,1197.6L758.3,1196.9L754.9,1193.3L747,1190.6L743.1,1191L741.5,1189.2L741.7,1185.3L737.3,1185.8L734.9,1183.9L739,1178.4L744.3,1177.2L748.7,1169.7L748.2,1166.9L741.4,1162.4L736.4,1157L733,1156.2L729.2,1157.6L716.9,1155.1L707.4,1158.4L703,1155L696.3,1154.3L687.3,1157.3L684.2,1157L679.5,1159.7L659.5,1166L649.7,1174L638.8,1194.7L634,1192L630.9,1185.9L617.6,1178.7L612.1,1180.1L601.5,1176.2L598,1176.5L593.2,1180.3L582.7,1178.9L569.9,1186.7L561.6,1183L546.2,1179L539.2,1181.2L531,1179.3L526.1,1180L519.4,1177.5L512.8,1177.5L510.3,1169.3L505.2,1159L506.4,1159L506.9,1156.8L511.4,1155.3L515.6,1148.4L511.4,1147L508.8,1143.4L502.2,1139.9L497.5,1133.3L496.6,1129L495.1,1127.9L495.2,1113L496.9,1107.8L499,1105.4L491.5,1106.8L488.3,1104.5L484,1107L480.1,1107.3L478,1109.4L476.4,1106.9L470.7,1108.2L461.2,1105.6L427.5,1121.6L422.3,1113.6L418.2,1109.8L411.2,1093.6L404.3,1087.8L396.6,1075.7L399.8,1075.2L400.9,1076.2L401.1,1070.3L399.7,1065L401.1,1062.4L399.6,1058.2L396.1,1056.8L395.9,1054.5L393.3,1053.1L394.3,1051.4L397.7,1051.5L403,1048.8L407.3,1042.7L406.2,1040.4L408.7,1038.1L414.4,1039L423.6,1046.8L430.5,1044.4L432.1,1041.3L434.4,1040.5L435,1038.1L441.2,1040.3L442.8,1038.5L444.7,1039.2L445.5,1037.1L449.7,1033.9L452.5,1034L452.9,1031.1L454.2,1032.1L459.5,1030L461.1,1026.2L476.7,1017.7L490.8,1015.4L491.7,1013.4L491.8,1015.6L498.7,1019.2L498.6,1020.7L503.7,1021.7L510.2,1014.1L510.2,1010.5L514.2,1009.9L518.2,1005.3L516.6,1002.3L526.8,1000.1L525.2,990.2L538,986L549.3,984.7L550.6,983.5L552.1,981.7L543.2,969.2L543,956.5L553.1,955.4L558.3,948.2L563,944.5L562.6,943L560.3,942.4L561.4,940.1L561.2,936.4L562.9,935.3L559.6,925.9L559.9,923.4L557,919.5L558.2,918L562.6,920.7L568.6,921.7L573.9,919.6L580.5,913.6L585.4,912.2L586.4,909.7L586.3,906.7L582.6,902.7L574.7,905.4L559.9,898.6L561.3,882.7L559.7,876.5L557.1,872.4L564.2,867.1L569.1,861.1L576.6,861.5L579,852L586.5,850.7L584.7,839.9L591.1,840.9L594.7,839.8L597.1,833.3L602.6,827.6L605.8,830.1L613.3,825.6L617,824.7L624.5,832.2L629.3,839.4L641.9,837.7Z",
    "lp": [552, 1012],
    "b": [393.3, 824.7, 791.9, 1197.6]
  },
  "salcete": {
    "district": "south-goa",
    "d": "M429.9,678L438,681.8L449,681.3L456.2,683.3L473.5,701.8L484.9,706.7L489.4,707.4L493,711.3L498.6,714.7L500.2,720.1L497.9,728.8L497.9,733.3L505.4,766.9L508.8,774.8L508.2,780L510.5,783.4L517.4,786.1L529.6,786.6L536.4,784.8L549.5,778.3L551.5,779.8L555,787.8L559.1,790.6L572.5,789.7L586.4,793L590.8,795.2L597.6,801.3L597.8,804.8L595.3,813L602.7,827.1L597.1,833.3L595.1,839.6L591.1,840.9L584.7,839.9L586.5,850.7L579,852L576.6,861.5L569.1,861.1L564.2,867.1L557.1,872.4L559.7,876.5L561.3,882.7L559.9,898.6L574.7,905.4L582.6,902.7L586.3,906.7L586.4,909.7L585.4,912.2L580.5,913.6L573.9,919.6L568.6,921.7L562.6,920.7L558.2,918L557,919.5L559.9,923.4L559.6,925.9L562.9,935.3L561.2,936.4L561.4,940.1L560.3,942.4L562.6,943L563,944.5L558.3,948.2L553.1,955.4L543,956.5L543.2,969.2L552.1,981.7L549.3,984.7L538,986L525.2,990.2L526.8,1000.1L516.6,1002.3L518.2,1005.3L514.2,1009.9L510.2,1010.5L510.2,1014.1L503.7,1021.7L498.6,1020.7L498.7,1019.2L491.8,1015.6L491.7,1013.4L490.8,1015.4L476.7,1017.7L461.1,1026.2L459.5,1030L454.2,1032.1L452.9,1031.1L452.5,1034L449.7,1033.9L445.5,1037.1L444.7,1039.2L442.8,1038.5L441.2,1040.3L435,1038.1L434.4,1040.5L432.1,1041.3L431,1044.1L424.4,1046.6L422,1045.2L419.2,1039.2L412.8,1031.9L396.9,969.3L397.1,965.5L395.7,964.3L392.9,953L384.1,912.3L380.4,903.3L381.2,900.1L377.8,893L371.6,869.5L368.6,864.4L361.2,835.9L358.9,832L352.2,810.6L351,802.2L333,750.4L349.9,749.3L348.4,737.6L360.6,732.2L358.4,727.9L359.8,727.2L359.4,725.3L361.7,721.3L360.2,720.5L357.8,714.3L355.1,711.8L355.3,707.7L356.2,707.9L357.3,704.5L356.4,699.8L360.8,699L360.9,697.3L362.6,697.1L362,694.2L363.7,687.6L362.3,687.5L363,683.7L364.8,684.7L367.2,681.9L370,687.9L373.5,686.2L375.1,687.3L377,686.6L378.4,672.8L387.8,678.3L392.7,678.9L406,678.2L414.3,672L425.5,671.4L429.9,678Z",
    "lp": [472.2, 856.5],
    "b": [333, 671.4, 602.7, 1046.6]
  },
  "mormugao": {
    "district": "south-goa",
    "d": "M315.7,610.4L336.4,615.7L353.3,615.1L381.2,622.5L409.8,626.7L414.8,630.7L422.1,649.7L425.5,671.4L414.3,672L406,678.2L392.7,678.9L387.8,678.3L378.4,672.8L377,686.6L375.1,687.3L373.5,686.2L370,687.9L367.2,681.9L364.8,684.7L363,683.7L362.3,687.5L363.7,687.6L362,694.2L362.6,697.1L360.9,697.3L360.8,699L356.4,699.8L357.3,704.5L356.2,707.9L355.3,707.7L355.1,711.8L357.8,714.3L360.2,720.5L361.7,721.3L359.4,725.3L359.8,727.2L358.4,727.9L360.7,731.9L348.4,737.6L349.9,749.3L333,750.4L330.6,744.7L329.9,739.3L314.2,704.1L306.6,690.5L296.7,680L292.8,678.7L290.3,680.2L283.4,680.8L282.5,685.8L268.2,687.3L267.1,688.6L267,693.2L264.4,695.1L251.3,696L243.5,691.5L240.4,685.2L240.9,684.1L234.8,678.5L232.5,680.7L229.9,680.9L221.4,678.3L219.4,674.8L211.6,674.5L210.1,672.1L204.5,668.6L200,668.9L198.4,666.1L201.3,663.7L201.4,660.4L202.6,659.3L201.1,660.4L200.8,663.3L198.6,663.4L199,655.7L195.6,643.4L192.6,640.4L187.1,642.5L180.3,641L179.1,642.5L172.3,640.2L171.1,637.9L171.5,635.7L172.8,635L174.4,632.2L173.6,633.3L170.6,631.9L165.6,621.2L163,620.1L161.8,617.8L161.1,613.6L162.6,610.7L166.7,609.8L170.8,611.6L174.1,603.1L174.3,600.4L165.4,572L201.1,583.8L246.1,587.8L260.8,592.4L280.7,603.2L300.4,604.8L315.7,610.4Z",
    "lp": [312.7, 661.9],
    "b": [161.1, 572, 425.5, 750.4]
  },
  "tiswadi": {
    "district": "north-goa",
    "d": "M331.1,386.3L333.8,385.7L335.7,380.5L333.6,375L334.7,371.6L338.4,371.2L342.7,376.6L345.3,375.2L347,376L347.1,380.3L344.3,383.2L348.4,386.2L348.8,390.5L354.3,394.6L356,398.5L366.2,405.1L370.4,411.2L375.3,413.2L382,418.4L391.3,414L399.6,408L409.7,398.5L412.9,397.4L415.8,397.1L422.7,401.2L432.6,412.3L426.4,416.7L426.2,420.2L422.5,425.5L420.2,431.9L411.6,436.4L406.1,436.7L406.3,438.3L413.5,446.6L413.8,452.4L420.8,458.5L426.6,459.7L432.9,470.2L432.5,471.8L428.7,471.8L420.3,477.1L422.9,489L422.9,495L422.4,498L417.1,504.2L415.8,511.1L417.8,516L424.9,522.9L426.2,530.8L423.1,535.3L413.1,537.5L408.9,544.5L406.8,555.9L409.5,565.4L408.8,570.6L400.2,574.7L389.3,576.7L382.6,581.1L379.3,586.4L379.6,595.2L370.7,606.5L365.5,617.6L351.5,614.8L334.7,615.4L315.7,610.4L300.4,604.8L284.6,604.3L278.4,602.3L260.8,592.4L249.8,588.7L231.3,585.8L201.1,583.8L165.4,572L168.7,537.5L167.9,536.4L169.3,536L168.1,532.8L171,530.2L158.6,511.7L168.3,507.7L206.5,485L212.4,473.8L212.4,469.4L215.3,465.7L223.8,469.9L233.1,469.8L241.7,472.5L251.9,470.6L256.8,466.2L254.8,459.1L255.3,455.2L264,441L269.3,438.3L281.6,436.3L289.6,431.9L296.8,430L301.3,426.5L302.2,420.1L293.1,410.8L291.2,405.9L291.6,399.3L294,392.5L291,379.9L294.1,375.3L313.7,369.2L316.5,366.1L320.3,373.3L327.3,375.7L327.6,377.8L324.9,381.9L331.1,386.3Z",
    "lp": [308.8, 492],
    "b": [158.6, 366.1, 432.9, 617.6]
  },
  "pernem": {
    "district": "north-goa",
    "d": "M18.9,112.4L23.6,114.5L25.3,120.9L28.6,120.9L29.9,122.3L28.9,124.6L24.1,125.1L16.5,121.8L15.3,125.4L9.2,126.8L9.7,124.2L4.5,125.6L5.1,124.4L3.7,124L6.1,120.7L5.6,119.3L0.1,118.1L2.1,116L2.3,113.3L6.4,112.2L18.9,112.4ZM286.6,24.3L292.5,27.5L298,37.6L302.5,41.4L304.7,42.2L304.3,40.3L304.7,39.9L308,42L308,44.3L303.9,51.8L301.3,51.9L300.4,53.2L303.4,57.5L300,62.2L297.4,63.1L297.1,72.9L301.4,78.2L309.6,80.5L316.1,78.6L327.4,81.2L329.8,83L333.4,83.3L337,86.5L338.6,85.3L348.8,83.4L348.8,80.3L360.7,87.4L389.3,88.7L396.9,90.7L396.8,92.7L400.2,98.9L399.7,105L401.4,108.4L401.5,112.9L407.9,125.5L411.3,127.6L412.7,130.5L413.5,129.8L414.5,132.2L416.3,132.5L416.1,136L417.6,136.2L415,139.9L412.8,140.7L413.7,142L409.7,143.4L412.9,145.2L411.3,148.2L411.8,153.3L410.6,156.9L404.6,162.8L397.6,158.6L390.2,158.3L378.8,164L375.6,167.8L369.7,171.2L365.3,176.3L360.6,177.2L355.5,173.1L351.7,171.9L349,168.1L345.5,166.8L343.6,160.8L341.5,158.9L336.1,156.6L330.5,156.1L328.6,156.9L315.3,172.4L314.4,175.7L316.1,183.7L314.2,187.1L299.2,192.3L294.4,192.6L285.7,190.5L282.4,191.4L278.4,194.9L271.2,198.1L263.2,209.1L252.3,213.3L248.6,216.3L248.4,225.9L250.1,239.5L247.6,243.5L244.3,243.6L237,236.3L223,237.3L217,233.6L210.4,232.1L199.8,234L181.6,241.2L167.8,234.9L156.2,235.7L152.5,238.6L148,249.5L144.9,254.3L134.6,259.7L129.1,265L121.2,264.8L118.7,266L108.1,277.6L101.4,281.9L98.5,285.5L95.9,297.2L88.8,297.5L82.8,289.9L75.8,275.4L72,272.5L69.7,274.1L68.3,271.1L69.6,269.9L68.5,265.4L67.2,262.6L65.1,262.2L66.5,261L62.2,253.6L57.9,241L58.3,239.2L55.7,232.4L56.3,228.7L54.8,228.3L52.2,216.8L42.4,198.4L39,180.4L36.2,173.9L32.5,173L31.5,165L26.3,159.6L25.5,148.2L18.8,130.5L19.1,128.4L21.7,128.6L22.5,127.4L25.4,130.6L33.7,130.5L36.1,129.6L36.8,126.7L40.9,126L50.8,121L55.1,122L60.3,120.5L65.2,121.5L68.5,126L72.2,127.9L70.6,131.7L74.8,132L83.2,126.6L87.8,112.4L94.7,104.6L99.9,101.3L114.9,103.7L119.3,102.9L132.7,106.5L133.8,105.6L141.6,111.2L151.6,114.1L154.1,113.6L163.8,117.8L167.7,114.4L169.3,110.5L169.8,104.1L176.2,100.3L182.4,105L196.6,99.6L200.9,92.8L205.7,92.1L214.2,96.8L220.5,95.1L226.9,90.7L227.8,84.1L233.3,73.9L231.7,57.7L234.4,56L243.1,54.6L244.9,52.6L248.5,39.1L253.2,31.3L262.2,33.8L266.4,31.6L266.4,29.7L257.9,23.9L258.5,21.9L261.6,20.2L263.1,17.9L266.6,6.2L271.1,0L288.9,6.3L287,8.6L284.9,16L286.6,24.3Z",
    "lp": [218.6, 150.8],
    "b": [0.1, 0, 417.6, 297.5]
  },
  "bardez": {
    "district": "north-goa",
    "d": "M318.5,187.2L331.4,187.7L332.8,191.3L335.5,193.1L337.7,196.6L339.2,202.2L344.6,212.1L341.7,221L342,225L339.9,228.1L341.7,230.7L340.4,234L332.4,238.9L324.3,237.4L316.2,242.6L311.8,241.8L309,242.8L309.4,248L313.6,250.6L317.5,249.5L317,255.9L322.7,261.4L322.4,263.7L324.4,263.6L323.7,268.5L328.9,267.7L336.1,269.9L344.5,265.6L346.6,262.5L350.4,262.6L353.8,258.5L355.3,260.5L354.8,262.4L350.2,265.7L352.1,270.3L349.7,274.9L352.5,278.7L347.8,280.9L347.1,284.3L349.6,293.2L351.5,294.8L339.9,295.4L337.9,296.9L336.7,300L332.7,302.3L330.4,300.4L328.1,300.2L323.6,295.9L319.1,295.4L319.8,299.4L317.1,301.8L318.7,304.5L324.4,307.9L325.9,311L325.6,316L331.4,318L333,319.8L332.3,325.7L329.6,331.2L327.3,333.2L324.2,333.6L321.5,336.4L320.7,339.8L321.4,343.4L319.2,345.6L318.9,353.2L321.4,356.1L321.2,358.6L324.9,359.2L327,361.9L328.9,360.1L332.1,359.8L333.5,355.5L339.9,356.2L341.8,367.8L346.7,372L345.3,375.2L342.7,376.6L338.4,371.2L334.7,371.6L333.6,375L335.7,380.5L333.8,385.7L331.9,386.3L324.9,381.9L327.6,377.8L327.3,375.7L320.3,373.3L316.5,366.1L313.7,369.2L294.1,375.3L291,379.9L294,392.5L291.6,399.3L291.2,405.9L293.1,410.8L302.2,420.1L301.3,426.5L296.8,430L289.6,431.9L281.6,436.3L269.3,438.3L264,441L255.3,455.2L254.8,459.1L256.8,466.2L251.9,470.6L241.7,472.5L233.1,469.8L223.8,469.9L215.3,465.7L212.4,469.4L212.4,473.8L206.5,485L168.3,507.7L158.6,511.7L149.7,490.5L147.8,490.4L146.7,488.4L140.7,488L140.5,489.1L139,484.6L135.9,484.6L134.4,479.8L137,478.9L137.9,474.7L119,402.5L109.6,378.1L110.6,374.9L106,379.2L104,379.4L97.9,374.1L96.8,362.3L93.9,356.4L90.2,342.4L87.6,336.3L85,336L83.8,334L84.1,331.1L87.1,327.9L84.2,322.7L85.2,320.7L83.4,319.2L86.7,314.5L82.9,306.4L84.4,304.4L90.8,303.6L93.9,303.8L97.5,307.8L102.7,307.1L99.5,305.1L95.9,297.2L98.5,285.5L101.4,281.9L108.1,277.6L119.5,265.5L129.1,265L134.6,259.7L144.9,254.3L154.5,236.5L160.1,234.7L165.9,234.5L170.7,235.6L181.6,241.2L199.8,234L210.4,232.1L217,233.6L223,237.3L237,236.3L244.3,243.6L246.7,243.8L249,242.1L250.1,239.5L248.4,225.9L248.6,216.3L252.3,213.3L263.2,209.1L271.2,198.1L284.7,190.5L296.2,192.6L311.5,188.5L315.7,185.6L318.5,187.2Z",
    "lp": [205.6, 349.4],
    "b": [82.9, 185.6, 355.3, 511.7]
  },
  "bicholim": {
    "district": "north-goa",
    "d": "M358.8,176.6L365.3,176.3L369.7,171.2L375.6,167.8L378.8,164L390.2,158.3L399.3,159.3L405.9,164.7L408.7,162.3L416.3,164.4L418.5,159.6L421.4,159L422.1,159.9L424.8,158.1L426.6,160.4L428.5,158.9L427.8,161.8L434.9,170.9L435.5,176.9L433.3,200.9L437.9,206.9L438.2,212.2L439.8,214.4L441,220.7L440.2,223.7L433.7,232.5L431.3,238.5L431.5,249.3L440.4,260.6L439.9,264.5L441.1,268L444.6,270.9L446.5,274.9L429.8,287L426.2,284.6L416.5,283.7L406.8,288.8L406.2,292.4L416.9,301.3L433,305.3L440.3,309.9L444.4,310.5L449.2,318.7L448.7,321L449.7,322.5L453.6,320.8L455.1,318L456.6,320.4L459.9,321.7L462.6,318.6L465.4,319.3L469.2,328.1L471.6,329.6L474.7,343.6L476,341L483.9,342L486.5,344.6L485.5,351.2L487.1,359.9L494,367.2L498.6,367.2L502.3,369.2L507.2,368.4L511.5,370.5L515.5,369.8L519.7,373.4L524.7,373L529.9,368.7L534.1,370.8L540.2,371.1L545.9,366.5L555.5,361.3L568,362.7L574.4,369.7L572.3,377.2L555.7,395.5L555.5,399.5L550.3,407.4L551.9,411.5L549.7,412.3L551.7,413.1L548.6,414.6L549.7,417.8L546.8,426.4L550.1,431.5L555.9,436.5L561.4,448L568.6,456.2L584.5,463.2L591.8,470.8L593.6,470.7L597.8,476.9L595.8,481.8L595.7,486.6L601.9,498L612.8,504.5L615.9,504.5L618.7,508.9L627.6,511.5L630,514.7L634.5,523.6L614.8,528.5L607.6,536.3L605.7,535.9L606,540.7L609.6,547.3L620.6,552.6L622.5,557.2L628.5,558.1L633.5,567.4L631.9,571.2L635.6,579L646.8,575.6L648.2,571.9L650,570.6L649.2,568.1L651.5,565.8L666.8,581.4L667.8,583L663.3,584.7L658.9,588.5L657.5,602.5L648,589.4L629.2,597.9L619.1,600.5L616.2,604.4L599.4,612.5L595.8,610.9L592.8,613.2L587.4,612.4L584.7,617.5L578.7,618.8L577.3,620.5L577.5,622.2L576.1,622.6L573.8,617L573.6,613.1L571.8,611.6L569,611.5L567.9,608.7L568.7,604.2L565.6,602.8L564.1,600.1L569.9,592.4L567.5,586.3L571.7,584.3L572,578.1L567.8,575.7L563,580L560.7,576.7L563.6,572.5L561.9,568.5L554.4,564.5L549.2,559.1L546.9,558.9L545.4,560.6L543,559L542.7,551.3L549.7,554.5L553,551.3L549.8,545.6L546,543.7L542.8,539.6L542.9,527.1L533.3,521.3L529.7,516.2L536.4,512.4L537.8,508.5L525.6,505.3L524.5,502.5L523.6,489.9L520.5,483.9L514.5,478.8L498.9,476.5L493.4,474.6L489.5,470.7L487.2,459.6L483.5,452.8L471.3,444.5L446.2,435L437,415.6L432.6,412.3L422.7,401.2L415.8,397.1L409.7,398.5L399.6,408L391.3,414L382.7,418.3L378.5,416.6L375.3,413.2L370.4,411.2L366.2,405.1L356,398.5L354.3,394.6L348.8,390.5L348.4,386.2L344.3,383.2L347.1,380.3L347,376L345.3,375.2L346.7,372L341.8,367.8L340,359.6L340.6,356.9L333.5,355.5L332.1,359.8L328.9,360.1L327,361.9L324.9,359.2L321.2,358.6L321.4,356.1L318.6,352.4L319.2,345.6L321.4,343.4L320.9,338.2L323.6,334.1L327.3,333.2L329.6,331.2L332.3,325.7L333,319.8L331.4,318L325.6,316L325.9,311L324.4,307.9L317.3,302.4L319.8,299.4L319.1,295.4L323.6,295.9L328.1,300.2L330.4,300.4L332.7,302.3L336.7,300L337.9,296.9L339.9,295.4L351.5,294.8L349.6,293.2L347.1,284.3L347.8,280.9L352.5,278.7L349.7,274.9L352.1,270.3L350.3,265.1L355.3,261.1L353.8,258.5L350.4,262.6L346.6,262.5L344.5,265.6L336.1,269.9L328.9,267.7L323.7,268.5L324.4,263.6L322.4,263.7L322.7,261.4L317,255.9L317.5,249.5L313.6,250.6L309.4,248L309,242.8L311.8,241.8L316.2,242.6L324.3,237.4L332.4,238.9L340.4,234L341.7,230.7L339.9,228.1L342,225L341.7,221L344.6,212.1L339.2,202.2L337.7,196.6L335.5,193.1L332.8,191.3L331.4,187.7L318.5,187.2L315.7,185.6L314.5,174.1L328.6,156.9L332.1,155.8L338.9,157.4L343,160L345.5,166.8L349,168.1L351.1,171.4L355.5,173.1L358.8,176.6Z",
    "lp": [455.3, 388.4],
    "b": [309, 155.8, 667.8, 622.6]
  },
  "sattari": {
    "district": "north-goa",
    "d": "M765.7,186.8L778.4,189.8L779.2,191.9L779.3,195.9L772,198.9L773.2,210L797,216.8L799.3,216L795.8,227.5L800.9,235.8L817.2,232.7L819.6,233.2L826.7,228.6L826.8,226.7L820,224.3L816.1,217.2L819.9,218.1L820.4,214.9L829.2,207.6L830.4,208.8L830.4,211.9L833.4,212.4L836.2,214.8L838.3,211.7L840.9,212L843.7,209.2L848.2,208.2L849.4,211.9L852.9,214.5L851,216L858.3,217.9L861.1,224.6L869.6,226L869.2,227.8L871.9,230.7L860.1,275L866.3,280.1L874.6,274L881.8,279.3L882,283.4L885.9,285.7L890.6,291.7L887,302.8L884.1,305.5L885.3,315L883.5,321.9L884.5,327.7L867,346.9L869.7,351.7L861.6,368.6L868.4,366.9L876.8,373.9L881.6,376.3L883.2,375.9L886.1,371.4L888.9,372.8L892.1,381.5L911.3,400.8L917.7,420L917.8,430.3L916.5,433.1L912.2,436.1L912.1,445.8L906.7,452.8L899.8,457.2L884.6,463.2L874.7,470.6L872.4,474.4L870.3,486.2L871.2,488.5L866,488.8L863.2,493.2L857.7,493.4L841.6,500.2L839.9,502.2L840.1,505.2L838.3,503.1L835.8,504.5L827.8,513.4L816.3,517.3L811.9,520.4L802.6,522.4L794.6,526.9L791,531.3L788.2,532.5L783.9,539.6L778.2,545L777.5,558.3L775,562.5L767.5,566.1L762,573.7L749.3,570.1L746.4,564.3L738.5,567.4L734,566.1L726.7,569.8L723.5,568L722.8,566.2L720.8,566.5L720,570L715.4,571.7L700.6,571.1L698.6,575.1L692.7,577.8L679.2,572.8L671.5,581.6L667.8,583L660.8,574.3L651.5,565.8L649.2,568.1L650,570.6L648.2,571.9L646.8,575.6L635.7,579.1L631.9,571.2L633.5,567.4L628.5,558.1L622.5,557.2L620.6,552.6L609.6,547.3L605.8,539.8L605.7,535.9L607.6,536.3L614.8,528.5L634.5,523.6L630,514.7L627.6,511.5L618.7,508.9L615.9,504.5L612.8,504.5L601.9,498L595.7,486.6L595.8,481.8L597.8,476.9L593.6,470.7L591.8,470.8L584.5,463.2L568.6,456.2L561.4,448L555.9,436.5L550.1,431.5L546.8,426.4L549.7,417.8L548.6,414.6L551.7,413.1L549.7,412.3L551.9,411.5L550.3,407.4L555.5,399.5L555.7,395.5L572.3,377.2L574.4,369.7L568,362.7L555.5,361.3L545.9,366.5L540.2,371.1L534.1,370.8L529.9,368.7L524.7,373L519.7,373.4L515.5,369.8L511.5,370.5L507.2,368.4L502.3,369.2L498.6,367.2L494,367.2L487.1,359.9L485.5,351.2L486.5,344.6L483.9,342L476,341L474.7,343.6L471.6,329.6L469.2,328.1L465.4,319.3L462.6,318.6L459.9,321.7L456.6,320.4L455.1,318L453.6,320.8L449.7,322.5L448.7,321L449.2,318.7L444.4,310.5L440.3,309.9L433,305.3L416.9,301.3L408,294.8L406.2,292.4L406,289.6L416.5,283.7L426.2,284.6L429.8,287L446.5,274.9L445.6,273L458.1,273.4L460.8,278.2L471.4,289.9L475.5,296.9L479.8,299.4L493,298.6L503.2,300.1L521.4,306.5L528.4,301.2L531.9,289.8L537.1,280.5L552.7,277.5L566.6,277L580.7,273.1L583.3,271.2L583.6,274.3L586,274.5L589.6,269.4L595.3,268.9L596.2,270.2L607.5,265.4L608.9,266.1L619.9,260L624,254.8L632.8,249.5L637.7,251.6L644.1,249L646.2,245.6L652.2,243L654.8,243.5L656.8,242.3L662.5,243.6L662.9,239.4L665.9,238.8L668.1,234.1L676.5,234.5L677.7,236L682.9,235.7L695.4,240L703.8,235.7L715.9,234.4L718.9,234.5L723.9,237.6L728.6,230.1L739.2,232L740.9,230.6L740.1,225L741.1,214L744.2,204L743.6,202.7L750.1,200L754.5,194.8L755.3,192.1L760.4,188.5L765.7,186.8Z",
    "lp": [730.5, 388.5],
    "b": [406, 186.8, 917.8, 583]
  },
  "ponda": {
    "district": "south-goa",
    "d": "M447.5,435.9L471.3,444.5L483.5,452.8L487.2,459.6L489.5,470.7L493.4,474.6L498.9,476.5L514.5,478.8L520.5,483.9L523.6,489.9L524.5,502.5L525.6,505.3L537.8,508.5L536.4,512.4L529.7,516.2L533.3,521.3L542.9,527.1L542.8,539.6L546,543.7L549.8,545.6L553,551.3L549.7,554.5L542.7,551.3L543,559L545.4,560.6L546.9,558.9L549.2,559.1L554.4,564.5L561.9,568.5L563.6,572.5L560.7,576.7L563,580L567.8,575.7L572,578.1L571.7,584.3L567.5,586.3L569.9,592.4L564.1,600.1L565.6,602.8L568.7,604.2L567.9,608.7L569,611.5L571.8,611.6L573.6,613.1L575.2,621.6L576.7,622.8L578.7,618.8L584.7,617.5L587.4,612.4L592.8,613.2L595.8,610.9L599.1,612.5L603.8,617.5L599.7,625L603.1,630.6L606.9,631.4L607.9,633.1L604.8,638.4L606.4,645.6L607.7,646.1L609.8,644.7L612.6,639.3L613.6,642.3L618.5,648.3L624.3,645.8L628.3,660.9L629.6,660.4L629.9,658.1L633.7,658.5L636.7,659.9L640.3,665.7L640.2,667.2L638,667.5L634.5,664.4L632.4,672.2L633.2,673.1L636.1,670.2L638.3,670.9L639.5,673.1L643.5,673.7L643.8,678L645.7,680.8L644.7,685.7L649.2,687.5L649.2,690.8L646,692.1L644,697.1L648.7,703.1L646.8,704.7L645,702.8L642.6,702.9L640.3,709L641.8,711L647.3,711.9L650.2,716L647.8,717.3L645.2,716L639.3,716.7L636.3,718.8L637.6,721.1L634.3,728.5L635.2,730.3L633.3,731.3L631.8,736.2L628.6,739.7L626,740.1L620.7,745.1L617.9,746.2L616.2,753.2L619.3,760.6L623.9,762.6L622,766L623.2,770.2L622.2,772.3L628.3,782.6L625,785.6L624.4,789.9L629,791.5L629.2,794.7L631.5,796.2L635.5,796.2L650.4,809.7L649.4,813L651.5,816.7L645.4,828L644.9,833.2L641.3,835.6L641.9,837.7L629.3,839.4L624.5,832.2L617,824.7L613.3,825.6L605.8,830.1L604.2,829.6L595.3,813L597.8,804.8L597.6,801.3L590.8,795.2L586.4,793L572.5,789.7L559.1,790.6L555,787.8L551.5,779.8L549.5,778.3L536.4,784.8L529.6,786.6L517.4,786.1L510.8,783.5L508.2,780L508.8,774.8L505.4,766.9L497.9,733.3L497.9,728.8L500.2,720.1L498.6,714.7L493,711.3L489.4,707.4L484.9,706.7L473.5,701.8L456.2,683.3L449,681.3L438,681.8L429.9,678L425.5,671.7L421.7,648.4L414.8,630.7L411.2,627.4L381.2,622.5L365.5,617.6L370.7,606.5L379.6,595.2L379.3,586.4L382.6,581.1L389.3,576.7L400.2,574.7L408.8,570.6L409.5,565.4L406.8,555.9L408.9,544.5L413.1,537.5L421.4,536.1L425.9,532.3L426.4,528.8L424.9,522.9L417.8,516L415.8,510.3L417.1,504.2L422.4,498L422.9,495L422.9,489L420.3,477.1L428.7,471.8L432.5,471.8L432.9,470.2L426.6,459.7L420.8,458.5L413.8,452.4L413.5,446.6L406.3,438.3L406.1,436.7L411.6,436.4L420.2,431.9L422.5,425.5L426.2,420.2L426.4,416.7L432.6,412.3L437,415.6L441.4,423.2L445.6,434.3L447.5,435.9Z",
    "lp": [502.2, 626.2],
    "b": [365.5, 412.3, 651.5, 839.4]
  },
  "dharbandora": {
    "district": "kushavati",
    "d": "M871.3,487.8L881.5,501.5L890.1,516.8L907.5,553.2L908.8,563.1L910.4,566.9L909.7,570.9L906.9,573.2L909.7,575.2L899.1,589.6L897.4,600.5L899.9,605.5L905.8,609.2L908.7,617.4L911.8,621.6L908.2,643.8L919,657.4L942.8,659L957.8,670.7L979.9,681.4L969.4,688.7L969.1,693.5L977.9,719.3L970.9,732.5L971.6,734.5L970.6,742L981.8,772.2L1000,795.8L991.4,807.5L984.7,813.4L975.9,811.9L974.5,813.8L956.8,814L939.3,805.4L936.2,804.8L936,805.6L923.4,796.2L921.8,793.5L917,791.6L916.5,784.8L917.6,778.9L916.5,775.8L912.9,773.1L911.2,767.9L905.6,779.8L903.6,781.6L893.8,781.9L887.6,785.6L886,782.8L883.2,781.6L879.3,785.8L876,783.6L869.4,781.9L867.2,767.4L862.8,765.9L857.3,766L851.3,760.3L849.6,755.4L850.3,753.1L843.6,750.5L842.9,748.2L841.3,749.2L840,748L837.2,755.6L834.7,755.8L833,759L825.6,765.2L820.2,766.7L810.9,771.6L807.6,770.6L804.3,774.4L799.2,774.6L789.7,771.5L784.8,772.3L775.5,770.7L771.8,771.2L771.6,762.4L766.8,755.5L769.8,752.4L763.6,747.7L758.2,739.6L757.8,735L761.4,732.1L762.4,727.7L761,724.6L762.3,721.7L761.2,721.2L756.7,721.7L753.6,726.1L751.8,726.8L748.8,726L750.3,723.9L749.1,723.1L744.7,726.5L740.5,727.5L739.1,731.9L731.7,728.6L729.6,730.7L727.9,730.6L728.4,725.3L731.2,723.5L729.9,721.7L724.1,726.4L720.1,725.3L719.8,729.9L722.2,732.8L726.9,734.7L727.3,736.8L722.7,743.8L720.7,744.5L720.8,746.5L714.4,748.9L709.2,757.6L706.6,759.4L711.5,773.9L711.2,776.8L706.6,778.8L708.1,784.5L707.8,788.5L704.5,792.2L696.4,795L693.3,801.8L687.1,806.1L686.1,806.5L685.5,802.6L682.9,800.4L674.6,799.7L670.3,797.8L656.8,797.3L652.8,797.4L645.3,805L635.5,796.2L631.5,796.2L629.2,794.7L629,791.5L624.4,789.9L625,785.6L628.3,782.6L622.2,772.3L623.2,770.2L622,766L623.9,762.6L619.3,760.6L616.4,754.7L616.4,751.1L618,746L620.7,745.1L626,740.1L628.6,739.7L631.8,736.2L632.1,733.1L635.3,730L634.3,728.5L637.6,721.1L636.3,718.8L639.3,716.7L645.2,716L647.8,717.3L650.2,716L647.3,711.9L641.8,711L640.3,709L642.6,702.9L645,702.8L646.8,704.7L648.7,703.1L644,697.1L646,692.1L649.2,690.8L649.2,687.5L644.7,685.7L645.7,680.8L643.8,678L643.5,673.7L639.5,673.1L638.3,670.9L636.1,670.2L632.7,673L632.3,670.1L634.5,664.4L638,667.5L639.5,667.6L640.4,666L636.7,659.9L633.7,658.5L629.9,658.1L629.6,660.4L628.3,660.9L624.3,645.8L618.5,648.3L613.6,642.3L612.6,639.3L609.8,644.7L607.7,646.1L606.4,645.6L604.8,638.4L607.9,633.1L606.9,631.4L603.1,630.6L599.7,625L603.8,617.5L599.1,612.5L616.2,604.4L619.1,600.5L629.2,597.9L648,589.4L657.5,602.5L658.9,588.5L663.3,584.7L670.4,582.6L679.2,572.8L692.7,577.8L698.6,575.1L700.6,571.1L715.4,571.7L720,570L720.8,566.5L722.8,566.2L723.5,568L726.7,569.8L734,566.1L738.5,567.4L746.4,564.3L749.3,570.1L762,573.7L767.5,566.1L775,562.5L777.5,558.3L778.2,545L783.9,539.6L786.9,533.9L791,531.3L793.4,527.7L802.6,522.4L811.5,520.5L816.3,517.3L827.1,513.8L835.8,504.5L838.3,503.1L840.1,505.2L839.9,502.2L841.6,500.2L857.7,493.4L863.2,493.2L866,488.8L871.3,487.8Z",
    "lp": [770.7, 652.9],
    "b": [599.1, 487.8, 1000, 814]
  }
};
const VILLAGES = [{
  "id": "626658",
  "n": "Arambol",
  "t": "pernem",
  "town": true,
  "src": "LGD",
  "lp": [69.6, 180.2],
  "d": "M104,175L100,180L99,185L92,190L89,190L87,192L84,193L80,192L75,195L71,193L63,194L53,201L48,202L45,201L44,201L42,198L41,188L39,180L36,174L33,173L32,170L32,167L32,166L36,160L53,160L67,165L73,168L75,167L77,169L89,162L89,159L92,160L99,173L102,173L104,175Z"
}, {
  "id": "626635",
  "n": "Tiracol",
  "t": "pernem",
  "src": "LGD",
  "lp": [15.4, 120],
  "d": "M19,112L24,115L25,121L29,121L30,122L29,125L24,125L21,123L18,123L17,122L15,125L12,127L9,127L10,124L6,125L5,126L4,124L6,121L6,119L0,118L2,116L2,113L6,112L19,112Z"
}, {
  "id": "626636",
  "n": "Querim",
  "t": "pernem",
  "src": "LGD",
  "lp": [35.6, 139.2],
  "d": "M52,121L51,130L52,132L50,131L49,130L50,137L49,141L43,146L35,148L28,149L25,155L26,152L26,148L19,131L19,128L22,129L23,127L25,131L34,131L36,130L37,127L41,126L51,121Z"
}, {
  "id": "626637",
  "n": "Paliem",
  "t": "pernem",
  "src": "LGD",
  "lp": [69.7, 143.8],
  "d": "M83,127L84,132L86,134L87,137L91,138L94,142L96,149L94,150L92,156L89,159L89,162L77,169L75,167L73,168L67,165L53,160L36,160L32,166L26,160L25,155L28,149L35,148L43,146L49,141L50,137L49,130L50,131L51,133L51,130L52,121L58,122L60,121L65,122L67,123L69,126L72,128L70,131L73,133L75,132L83,127Z"
}, {
  "id": "626640",
  "n": "Poroscodem",
  "t": "pernem",
  "src": "LGD",
  "lp": [217.5, 108.9],
  "d": "M256,91L252,98L241,107L237,109L230,109L229,110L228,112L228,117L230,121L229,123L225,128L211,124L212,120L210,115L211,113L208,111L207,113L206,112L205,110L201,110L201,108L196,106L194,103L193,101L197,100L201,93L206,92L211,96L214,97L218,96L226,91L227,93L230,93L231,95L234,95L236,96L240,96L244,92L251,92L254,90L256,91Z"
}, {
  "id": "626654",
  "n": "Virnora",
  "t": "pernem",
  "src": "LGD",
  "lp": [213.1, 179.4],
  "d": "M223,167L222,170L222,172L221,176L224,178L223,181L224,183L224,185L223,187L219,189L218,194L217,202L209,202L203,192L206,190L206,185L202,177L201,174L198,164L199,159L203,161L207,159L217,157L222,162L223,167Z"
}, {
  "id": "626655",
  "n": "Tuem",
  "t": "pernem",
  "src": "LGD",
  "lp": [194.6, 207.3],
  "d": "M203,192L209,202L217,202L224,213L227,215L226,217L222,216L222,222L219,221L217,222L219,226L214,226L213,229L209,230L208,233L200,234L183,241L180,241L174,237L168,235L169,223L168,218L165,213L168,209L169,206L174,196L162,184L160,183L161,180L166,173L179,177L192,183L195,186L195,190L198,193L203,192Z"
}, {
  "id": "803241",
  "n": "Pernem",
  "t": "pernem",
  "src": "SOI",
  "lp": [200.2, 146.9],
  "d": "M182,105L193,101L194,103L196,106L201,108L201,110L205,110L206,112L207,113L208,111L211,113L210,114L211,119L211,124L225,128L227,129L228,131L231,132L231,135L236,138L243,140L250,146L248,151L241,157L240,160L239,162L232,165L226,165L223,167L222,162L217,157L207,159L203,161L199,159L198,164L201,174L202,177L206,185L206,190L203,192L198,193L195,190L195,186L192,183L179,177L166,173L165,171L166,168L163,156L152,148L147,144L143,143L140,141L136,134L132,128L128,118L127,108L128,105L133,107L134,106L142,111L152,114L154,114L162,118L164,118L168,114L169,111L170,104L173,102L176,100L182,105Z"
}, {
  "id": "626638",
  "n": "Corgao",
  "t": "pernem",
  "src": "LGD",
  "lp": [124.2, 148.4],
  "d": "M100,101L115,104L119,103L128,105L127,108L127,114L129,121L132,128L136,134L140,141L143,143L147,144L152,148L163,156L166,168L166,174L165,175L161,180L154,180L149,183L144,191L141,192L137,196L135,197L131,194L122,191L115,180L110,173L108,173L104,175L102,173L99,173L92,160L90,158L92,156L94,150L96,149L94,142L91,138L88,138L86,134L84,132L83,127L88,112L90,110L98,103L100,101Z"
}, {
  "id": "626659",
  "n": "Mandrem",
  "t": "pernem",
  "town": true,
  "src": "LGD",
  "lp": [89.8, 212],
  "d": "M109,173L115,180L122,191L131,194L135,197L140,202L137,209L123,215L121,219L125,226L125,229L129,238L123,242L120,247L115,243L108,244L94,236L91,236L85,240L82,241L74,245L71,249L68,250L67,253L64,255L62,254L61,249L58,241L58,239L56,232L56,230L55,228L52,217L44,201L45,201L48,202L51,202L55,200L59,197L63,194L71,193L75,195L80,192L82,193L85,193L89,190L92,190L97,187L99,185L100,180L105,174L109,173Z"
}, {
  "id": "626660",
  "n": "Parcem",
  "t": "pernem",
  "town": true,
  "src": "LGD",
  "lp": [145.7, 213.9],
  "d": "M161,180L160,183L162,184L174,195L173,199L169,206L168,209L165,213L168,218L169,223L168,235L160,235L155,237L152,239L149,246L141,239L138,239L136,237L129,238L125,229L125,226L121,219L123,215L137,209L140,202L135,197L137,196L141,192L144,191L149,183L154,180L161,180Z"
}, {
  "id": "626662",
  "n": "Oxel",
  "t": "bardez",
  "src": "LGD",
  "lp": [151, 263.3],
  "d": "M173,260L172,263L170,264L169,267L166,267L167,270L157,272L155,274L144,276L143,274L141,274L140,270L136,270L130,265L135,260L145,254L148,250L154,255L155,257L154,258L156,259L156,262L159,261L164,261L171,258L173,260Z"
}, {
  "id": "626657",
  "n": "Agarvado",
  "t": "pernem",
  "src": "LGD",
  "lp": [134.6, 248.4],
  "d": "M149,246L148,250L145,254L133,261L127,256L126,253L122,250L120,247L126,240L129,238L135,237L141,239L149,246Z"
}, {
  "id": "626661",
  "n": "Morgim",
  "t": "pernem",
  "src": "LGD",
  "lp": [93, 268],
  "d": "M108,244L115,243L133,261L129,265L121,265L119,266L108,278L101,282L99,286L97,289L96,297L90,298L85,293L75,274L71,272L70,274L70,273L68,271L70,270L69,265L67,263L65,262L67,262L64,255L67,253L68,250L71,249L74,245L82,241L85,240L91,236L94,236L108,244Z"
}, {
  "id": "626690",
  "n": "Siolim",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [157.2, 278.6],
  "d": "M208,275L208,280L204,286L202,295L193,294L183,289L179,288L176,288L161,292L155,290L153,286L149,291L148,291L145,291L142,294L135,290L127,288L125,289L124,292L122,293L120,292L110,295L96,297L97,289L99,286L101,282L108,278L117,267L121,265L126,266L130,265L136,270L140,270L141,274L143,274L144,276L155,274L157,272L167,270L166,267L169,267L170,264L172,263L173,260L175,261L176,263L186,263L193,270L195,270L200,274L204,276L208,275Z"
}, {
  "id": "626671",
  "n": "Marna",
  "t": "bardez",
  "src": "LGD",
  "lp": [166.8, 295.1],
  "d": "M177,288L183,289L187,292L193,294L192,298L191,305L184,302L173,302L170,303L169,304L166,305L161,306L156,305L152,304L141,296L142,294L145,291L148,291L150,290L153,286L155,290L161,292L177,288Z"
}, {
  "id": "626663",
  "n": "Camurlim",
  "t": "bardez",
  "src": "LGD",
  "lp": [179.4, 253.3],
  "d": "M213,233L212,237L207,242L211,244L212,245L210,248L206,252L209,258L209,262L210,265L208,275L206,276L200,274L195,270L193,270L186,263L176,263L176,261L171,258L164,261L159,261L156,262L156,259L154,258L155,257L154,255L148,250L153,238L155,237L158,235L164,234L171,236L180,241L182,241L200,234L210,232L213,233Z"
}, {
  "id": "626670",
  "n": "Tivim",
  "t": "bardez",
  "src": "LGD",
  "lp": [263.2, 277.4],
  "d": "M309,243L309,248L314,251L318,250L317,256L322,261L323,262L322,264L310,267L298,275L287,279L290,288L292,289L295,290L296,292L296,294L298,295L299,297L291,303L290,306L292,311L290,316L289,318L286,319L282,316L270,315L259,313L254,311L248,306L242,306L241,303L235,300L232,298L229,295L226,294L228,289L229,285L232,279L235,276L237,270L238,267L239,265L244,265L249,267L253,266L254,263L263,262L270,257L278,248L281,246L290,244L297,239L300,240L309,243Z"
}, {
  "id": "626669",
  "n": "Sircaim",
  "t": "bardez",
  "src": "LGD",
  "lp": [304.3, 280.7],
  "d": "M324,264L323,275L321,281L320,283L316,295L304,295L299,297L298,295L296,294L296,292L295,290L292,289L290,288L287,280L288,278L298,275L310,267L324,264Z"
}, {
  "id": "626691",
  "n": "Colvale",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [242.3, 249.8],
  "d": "M298,229L298,237L298,239L294,241L290,244L281,246L278,248L270,257L264,262L254,263L253,266L249,267L247,265L241,265L238,266L237,270L236,275L235,277L232,279L229,284L226,294L223,295L222,294L217,287L214,285L208,280L210,265L209,262L209,258L206,252L210,248L212,245L211,244L207,242L212,237L213,233L217,234L223,237L237,236L244,244L248,244L250,241L250,240L248,226L249,216L252,213L262,210L264,208L271,211L281,222L292,229L296,230L298,229Z"
}, {
  "id": "626653",
  "n": "Dargalim",
  "t": "pernem",
  "src": "LGD",
  "lp": [246.2, 196.5],
  "d": "M270,152L269,156L270,160L278,163L283,169L286,175L284,183L283,185L282,192L278,195L271,198L263,209L252,213L249,216L248,220L250,239L250,241L248,244L244,244L237,236L223,237L217,234L210,232L208,233L209,230L213,229L214,226L219,226L217,222L219,221L222,222L222,216L226,218L227,215L224,213L217,202L218,200L218,194L219,189L223,187L224,185L224,183L223,181L224,178L222,177L222,172L222,170L223,167L226,165L232,165L239,162L240,160L241,157L248,151L250,146L255,149L260,152L265,151L270,152Z"
}, {
  "id": "626652",
  "n": "Ozorim",
  "t": "pernem",
  "src": "LGD",
  "lp": [300.2, 168.7],
  "d": "M319,168L315,174L316,184L316,186L314,187L299,192L294,193L286,191L282,191L283,185L284,183L286,175L283,169L278,163L270,160L269,156L269,153L274,144L275,146L276,147L284,146L297,152L299,152L302,155L308,156L312,159L319,168Z"
}, {
  "id": "626665",
  "n": "Nadora",
  "t": "bardez",
  "src": "LGD",
  "lp": [284.6, 209.6],
  "d": "M300,192L303,198L303,202L298,229L296,230L292,229L281,222L271,211L264,208L271,198L278,195L282,191L286,191L294,193L300,192Z"
}, {
  "id": "626667",
  "n": "Moitem",
  "t": "bardez",
  "src": "LGD",
  "lp": [321.6, 216.6],
  "d": "M331,188L333,191L336,193L338,197L339,202L344,210L345,212L342,221L342,225L340,228L342,231L340,234L332,239L329,238L324,238L316,243L312,242L309,243L299,240L298,237L298,227L303,200L302,196L300,192L312,189L316,186L319,187L331,188Z"
}, {
  "id": "626742",
  "n": "Dumacem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [348.4, 191.7],
  "d": "M345,212L344,212L345,212L345,212ZM345,212L344,210L339,202L338,197L336,193L333,191L332,189L336,188L343,184L344,182L344,179L348,177L352,172L356,173L359,177L362,177L363,192L359,196L355,202L346,208L346,211Z"
}, {
  "id": "626741",
  "n": "Mencurem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [333.5, 172.1],
  "d": "M352,172L348,177L344,179L343,183L336,188L319,187L316,186L316,184L314,176L315,172L329,157L331,156L339,157L343,160L344,165L346,167L350,169L352,172Z"
}, {
  "id": "626650",
  "n": "Ibrampur",
  "t": "pernem",
  "src": "LGD",
  "lp": [392.7, 146.4],
  "d": "M413,145L411,148L412,153L411,156L408,160L405,161L405,163L398,159L390,158L379,164L376,167L370,156L371,151L373,148L375,142L375,134L376,131L380,129L388,132L396,133L400,131L407,131L411,128L413,131L415,132L417,133L416,136L418,136L415,140L413,141L414,142L411,142L410,143L413,145Z"
}, {
  "id": "626743",
  "n": "Salem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [398.8, 179.2],
  "d": "M431,167L435,171L436,177L435,189L433,195L434,197L433,200L428,200L427,199L416,200L411,195L404,195L397,194L391,194L387,191L375,192L371,190L363,190L363,181L362,177L365,176L370,171L376,168L379,164L390,158L396,158L399,159L405,163L406,165L409,162L415,163L416,164L419,160L421,159L425,158L426,160L428,159L429,160L428,162L430,164L431,167Z"
}, {
  "id": "626744",
  "n": "Latambarcem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [392.7, 238.9],
  "d": "M374,192L387,191L391,194L397,194L404,195L411,195L416,200L427,199L428,200L433,200L434,203L437,205L438,207L438,212L440,214L440,216L441,221L440,224L434,233L432,236L431,240L432,249L440,261L441,263L440,265L441,268L445,271L447,275L430,287L426,285L417,284L406,290L396,282L392,281L384,277L378,277L369,273L352,271L352,270L350,267L350,265L355,262L355,259L354,238L355,236L349,223L345,222L342,223L342,220L344,213L346,211L346,208L355,202L359,196L363,192L363,190L371,190L374,192Z"
}, {
  "id": "626745",
  "n": "Adwalpale",
  "t": "bicholim",
  "src": "LGD",
  "lp": [332.1, 245.4],
  "d": "M355,260L354,259L350,263L347,263L345,266L336,270L329,268L324,269L324,264L322,264L323,261L317,256L318,250L314,251L309,248L309,243L312,242L316,243L324,237L333,239L340,234L342,231L340,228L342,225L342,223L345,222L349,223L355,236L354,238L357,259L355,260Z"
}, {
  "id": "626668",
  "n": "Assonora",
  "t": "bardez",
  "src": "LGD",
  "lp": [335.8, 279.8],
  "d": "M355,260L355,262L350,266L352,270L350,275L353,279L348,281L347,284L347,286L349,289L350,293L352,295L345,296L341,295L340,295L338,297L337,300L333,302L330,300L328,300L324,296L316,295L320,283L321,281L323,275L324,269L329,268L336,270L345,266L347,263L350,263L354,259L355,260Z"
}, {
  "id": "626747",
  "n": "Mulgao",
  "t": "bicholim",
  "src": "LGD",
  "lp": [352.1, 303.9],
  "d": "M403,288L394,297L389,300L389,301L387,303L381,306L379,311L387,316L393,324L394,326L393,336L387,329L382,327L374,316L367,313L355,306L355,317L352,321L340,316L329,310L325,310L323,307L319,305L317,302L320,299L319,295L324,296L328,300L330,300L333,302L337,300L338,297L340,295L341,295L345,296L350,296L350,293L349,289L347,286L348,281L353,279L350,275L352,271L369,273L378,277L384,277L392,281L396,282L403,288Z"
}, {
  "id": "626748",
  "n": "Ona",
  "t": "sattari",
  "src": "LGD",
  "lp": [419.4, 293.6],
  "d": "M430,287L432,291L432,298L433,305L417,301L408,295L406,292L406,290L417,284L426,285L430,287Z"
}, {
  "id": "626749",
  "n": "Maulinguem-North",
  "t": "sattari",
  "src": "LGD",
  "lp": [454, 297.8],
  "d": "M446,273L458,273L461,278L471,290L476,297L477,302L478,305L476,309L476,313L467,313L466,314L467,318L465,319L463,319L460,322L457,320L455,318L454,321L450,323L449,321L449,319L447,316L447,313L444,311L440,310L433,305L432,298L432,291L430,287L447,275L446,273Z"
}, {
  "id": "626767",
  "n": "Ravona",
  "t": "sattari",
  "src": "LGD",
  "lp": [547.5, 298.9],
  "d": "M567,286L566,289L567,293L567,297L565,302L566,312L564,313L562,314L560,316L551,319L550,323L533,308L532,306L531,302L528,301L532,290L537,281L553,278L566,277L567,279L566,284L567,286Z"
}, {
  "id": "626649",
  "n": "Alorna",
  "t": "pernem",
  "src": "LGD",
  "lp": [371, 128.3],
  "d": "M349,80L361,87L365,87L374,89L389,89L397,91L397,93L400,99L400,105L401,108L402,113L404,116L404,118L406,119L408,126L411,128L407,131L400,131L396,133L388,132L380,129L376,131L374,135L375,142L374,144L371,151L370,155L376,167L370,171L365,176L363,177L359,177L356,173L351,171L349,168L346,167L344,165L344,161L339,157L331,156L329,157L324,162L317,158L319,155L318,152L320,144L326,145L327,147L332,140L332,139L329,139L327,134L332,128L335,121L337,115L341,113L348,111L350,111L349,108L341,105L339,103L339,97L338,90L337,87L339,85L349,83L349,80Z"
}, {
  "id": "626648",
  "n": "Chandel",
  "t": "pernem",
  "src": "LGD",
  "lp": [317.4, 99.9],
  "d": "M337,87L337,89L339,97L339,103L341,105L348,108L350,110L348,111L344,112L340,113L336,117L325,114L310,113L306,110L291,107L299,96L302,93L304,89L305,82L306,80L310,81L316,79L327,81L330,83L333,83L337,87Z"
}, {
  "id": "626647",
  "n": "Mopa",
  "t": "pernem",
  "src": "LGD",
  "lp": [282.7, 77.2],
  "d": "M305,49L304,52L301,52L300,53L302,56L303,58L300,62L297,63L297,73L301,78L306,80L305,82L304,89L302,93L299,96L291,107L287,105L282,104L278,100L275,99L267,94L266,90L267,87L265,85L266,79L265,76L260,71L257,72L255,73L255,63L260,62L262,58L265,57L268,55L271,55L272,54L277,52L283,53L284,52L289,53L292,52L298,56L301,52L301,49L305,49Z"
}, {
  "id": "626651",
  "n": "Cansarvornem",
  "t": "pernem",
  "src": "LGD",
  "lp": [300.9, 136],
  "d": "M336,117L335,121L332,128L327,134L329,139L332,139L330,144L327,147L326,145L320,144L318,152L319,155L317,158L324,162L319,168L312,159L308,156L302,155L299,152L297,152L284,146L281,146L277,147L275,147L274,145L275,142L275,138L274,134L271,132L270,130L274,127L275,122L280,119L284,118L285,116L284,113L289,108L291,107L297,108L306,110L310,113L325,114L336,117Z"
}, {
  "id": "626642",
  "n": "Varconda",
  "t": "pernem",
  "src": "LGD",
  "lp": [252.9, 121.2],
  "d": "M291,107L288,109L285,112L284,114L285,116L284,118L280,119L275,122L274,127L270,129L270,132L274,134L275,139L275,143L270,152L265,151L260,152L254,148L248,146L243,140L236,138L231,135L231,132L225,128L229,123L230,121L228,117L228,112L229,110L230,109L237,109L241,107L252,98L256,91L263,92L266,90L267,93L272,97L278,100L282,104L287,105L291,107Z"
}, {
  "id": "626644",
  "n": "Uguem",
  "t": "pernem",
  "src": "LGD",
  "lp": [247.1, 81.9],
  "d": "M246,71L248,73L248,75L252,73L252,75L257,73L260,71L264,75L266,79L265,85L267,87L266,91L263,92L254,90L251,92L247,93L245,92L242,94L240,96L236,96L234,95L231,95L230,93L227,93L226,91L227,90L228,85L233,74L236,72L238,72L240,73L246,71Z"
}, {
  "id": "626645",
  "n": "Tamboxem",
  "t": "pernem",
  "src": "LGD",
  "lp": [243.7, 66.7],
  "d": "M244,56L255,63L255,73L252,75L252,73L248,75L248,73L246,71L240,73L238,72L236,72L233,74L232,58L237,55L243,55L244,56Z"
}, {
  "id": "626646",
  "n": "Torxem",
  "t": "pernem",
  "src": "LGD",
  "lp": [280.3, 31.4],
  "d": "M271,0L289,6L287,9L285,16L287,25L293,28L294,29L294,31L298,38L300,39L304,42L304,40L308,42L308,44L305,49L301,49L301,52L298,56L292,52L289,53L284,52L283,53L277,52L272,54L271,55L268,55L265,57L262,58L260,62L255,63L244,56L243,55L245,53L249,39L253,31L262,34L266,32L266,30L258,24L259,22L262,20L263,18L267,6L271,0Z"
}, {
  "id": "626769",
  "n": "Siroli",
  "t": "sattari",
  "src": "LGD",
  "lp": [590.1, 278],
  "d": "M609,266L611,270L611,275L615,279L615,283L605,288L600,288L595,290L587,292L581,290L580,288L577,287L572,287L571,286L568,287L566,284L567,279L566,277L581,273L583,271L584,274L586,275L588,271L590,269L595,269L596,270L608,265L609,266Z"
}, {
  "id": "626768",
  "n": "Gonteli",
  "t": "sattari",
  "src": "LGD",
  "lp": [575.9, 303.7],
  "d": "M580,288L583,297L586,299L586,302L587,306L585,309L584,312L585,314L584,321L582,322L576,319L574,316L572,317L569,314L569,313L566,312L565,302L567,297L567,293L566,289L567,286L571,286L572,287L577,287L580,288Z"
}, {
  "id": "626770",
  "n": "Anjunem",
  "t": "sattari",
  "src": "LGD",
  "lp": [620.7, 272.9],
  "d": "M630,285L626,291L624,292L622,288L616,283L615,279L611,275L611,270L609,266L620,260L620,258L624,255L629,253L630,255L632,260L630,264L630,269L631,276L632,281L630,285Z"
}, {
  "id": "626771",
  "n": "Quelaudem",
  "t": "sattari",
  "src": "LGD",
  "lp": [640.5, 265.8],
  "d": "M657,242L663,244L663,247L664,251L654,261L650,268L647,270L647,272L643,277L643,279L639,280L635,282L634,284L636,287L635,289L631,290L628,289L630,285L632,281L631,276L630,269L630,264L632,260L630,255L629,253L633,250L638,252L644,249L646,246L652,243L655,244L657,242Z"
}, {
  "id": "626773",
  "n": "Choraundem",
  "t": "sattari",
  "src": "LGD",
  "lp": [671.7, 262],
  "d": "M668,234L677,235L678,236L683,236L695,240L697,240L698,246L693,252L690,260L691,263L693,267L691,269L691,271L695,279L694,281L696,284L701,286L702,288L699,291L697,292L692,291L685,292L679,291L677,287L676,282L672,283L672,287L671,289L666,289L665,287L661,287L654,283L651,284L648,283L643,279L643,277L647,272L647,270L650,268L654,261L664,251L662,245L663,239L666,239L668,234Z"
}, {
  "id": "626774",
  "n": "Ivrem-Buzruco",
  "t": "sattari",
  "src": "LGD",
  "lp": [702.8, 261.9],
  "d": "M711,283L702,288L701,286L696,284L694,281L695,279L691,272L691,269L693,267L691,263L690,260L693,252L698,246L697,240L699,237L704,236L713,235L715,240L714,243L716,246L714,253L716,261L715,264L717,272L714,275L711,283Z"
}, {
  "id": "626775",
  "n": "Ivrem-Curdo",
  "t": "sattari",
  "src": "LGD",
  "lp": [724.3, 260],
  "d": "M724,238L725,240L733,249L735,254L737,256L737,259L733,260L732,262L732,267L730,273L721,286L719,284L713,285L711,283L714,275L717,272L715,264L716,261L714,253L716,246L714,243L715,240L713,235L719,235L724,238Z"
}, {
  "id": "626781",
  "n": "Rivem",
  "t": "sattari",
  "src": "LGD",
  "lp": [757.8, 282.3],
  "d": "M771,259L771,262L779,270L780,274L784,280L781,284L776,288L774,293L769,297L766,300L765,306L765,309L760,308L756,306L748,306L740,301L735,302L734,301L729,299L728,298L730,298L731,295L730,287L736,278L739,271L746,265L747,261L752,260L755,258L758,258L768,260L771,259Z"
}, {
  "id": "626777",
  "n": "Surla",
  "t": "sattari",
  "src": "LGD",
  "lp": [778.1, 232.7],
  "d": "M772,189L776,189L778,190L779,192L779,196L778,198L772,199L773,210L797,217L799,216L796,228L801,236L804,235L802,239L802,241L801,244L803,250L802,262L801,265L799,267L800,270L799,272L800,275L799,278L795,276L784,280L780,274L779,270L771,262L772,259L771,254L767,246L765,238L760,235L754,230L746,231L740,226L741,214L743,206L744,204L744,203L750,200L755,195L755,192L760,189L766,187L772,189Z"
}, {
  "id": "626776",
  "n": "Golauli",
  "t": "sattari",
  "src": "LGD",
  "lp": [754.2, 256.9],
  "d": "M745,230L754,230L760,235L765,238L767,246L771,254L771,259L768,260L758,258L755,258L752,260L747,261L746,265L739,271L736,278L730,287L725,286L721,287L730,273L732,267L732,262L733,260L737,259L737,256L735,254L733,249L725,240L724,238L729,230L739,232L741,231L740,226L745,230Z"
}, {
  "id": "626778",
  "n": "Satrem",
  "t": "sattari",
  "src": "LGD",
  "lp": [833.2, 257.5],
  "d": "M835,213L836,215L838,212L841,212L844,209L848,208L849,212L853,215L851,216L858,218L861,225L870,226L869,228L872,231L865,253L860,275L866,280L864,282L862,284L859,285L848,289L838,296L829,297L825,300L817,302L815,300L812,289L808,285L807,282L799,278L800,275L799,272L799,271L799,267L801,265L802,262L803,250L801,244L802,241L802,239L804,235L817,233L820,233L827,229L827,227L820,224L816,217L820,218L820,215L829,208L830,209L830,212L835,213Z"
}, {
  "id": "626779",
  "n": "Derodem",
  "t": "sattari",
  "src": "LGD",
  "lp": [851.2, 305.4],
  "d": "M890,291L887,303L884,306L885,315L884,319L874,321L871,320L869,322L866,326L861,327L853,325L841,326L834,332L828,332L823,335L819,337L816,334L815,331L815,329L818,322L816,316L818,310L818,305L817,302L825,300L829,297L838,296L848,289L862,284L864,282L866,281L875,274L882,279L882,283L886,286L889,289L890,291Z"
}, {
  "id": "626798",
  "n": "Vainguinim",
  "t": "sattari",
  "src": "LGD",
  "lp": [845.2, 345.6],
  "d": "M863,368L863,371L861,371L848,364L846,359L840,353L829,356L821,344L824,343L824,341L819,337L823,335L828,332L834,332L841,326L853,325L861,327L866,326L869,322L871,320L874,321L884,319L884,322L885,328L867,347L870,352L862,369L863,368Z"
}, {
  "id": "n1",
  "n": "Forest",
  "t": "sattari",
  "src": "SOI",
  "lp": [836.4, 368.7],
  "d": "M821,344L829,356L840,353L846,359L848,364L855,367L859,370L862,371L863,368L868,367L880,376L882,376L884,375L884,377L874,385L865,388L862,393L859,393L851,389L845,391L843,390L840,386L837,384L832,376L830,376L812,378L816,369L818,360L815,358L806,356L805,354L812,353L821,344Z"
}, {
  "id": "626819",
  "n": "Pendral",
  "t": "sattari",
  "src": "LGD",
  "lp": [866.2, 421.1],
  "d": "M844,390L851,389L858,393L859,398L864,407L869,411L880,411L882,412L883,414L888,415L890,418L912,439L912,446L907,453L900,457L885,463L876,469L849,440L845,434L842,430L841,429L842,425L841,423L837,419L838,415L832,411L832,406L836,399L832,398L828,393L823,385L821,377L830,376L832,376L837,384L840,386L842,389L844,390Z"
}, {
  "id": "626818",
  "n": "Codvol",
  "t": "sattari",
  "src": "LGD",
  "lp": [887.7, 404.5],
  "d": "M890,375L891,379L892,382L902,391L905,396L910,400L912,403L918,424L917,432L912,436L912,439L890,418L888,415L883,414L882,412L880,411L870,411L867,410L866,408L864,407L859,396L858,393L862,393L865,388L874,385L884,378L884,375L886,372L889,373L890,375Z"
}, {
  "id": "626820",
  "n": "Caranzol",
  "t": "sattari",
  "src": "LGD",
  "lp": [811.7, 448.9],
  "d": "M876,469L872,474L870,486L871,489L866,489L863,493L858,493L842,500L840,502L840,505L838,503L833,506L828,513L816,517L815,513L804,503L801,500L801,498L802,495L799,489L796,474L786,468L779,467L775,463L774,460L774,454L772,452L767,451L766,447L767,444L770,443L770,441L767,439L765,436L764,431L765,427L765,422L767,422L775,424L780,418L786,419L788,413L787,406L789,402L793,400L800,403L802,402L802,399L797,396L798,394L803,388L804,379L806,378L821,377L823,385L828,393L832,398L836,399L832,406L832,411L838,415L837,419L841,423L842,425L841,429L842,430L845,434L849,440L876,469Z"
}, {
  "id": "626817",
  "n": "Sonal",
  "t": "sattari",
  "src": "LGD",
  "lp": [775.1, 406.8],
  "d": "M793,400L789,402L787,405L787,408L788,413L786,419L780,418L775,424L765,422L763,413L764,409L763,406L766,402L774,400L782,393L785,392L789,395L793,400Z"
}, {
  "id": "626816",
  "n": "Sanvordem",
  "t": "sattari",
  "src": "LGD",
  "lp": [751.7, 437.7],
  "d": "M770,443L764,444L760,448L757,449L750,449L749,447L740,454L740,452L736,451L735,448L736,445L736,440L736,438L740,437L745,437L746,436L746,432L745,425L747,424L753,424L756,424L763,423L765,422L765,427L764,431L765,436L767,439L770,441L770,443Z"
}, {
  "id": "626821",
  "n": "Carambolim-Buzruco",
  "t": "sattari",
  "src": "LGD",
  "lp": [758.3, 461.7],
  "d": "M767,444L766,447L766,450L768,451L772,452L774,454L774,460L775,463L779,467L786,468L790,471L795,474L797,479L791,478L784,479L778,478L772,480L764,475L763,472L758,468L753,470L744,467L742,463L743,461L743,456L740,454L749,447L750,449L757,449L760,448L764,444L767,444Z"
}, {
  "id": "626822",
  "n": "Velguem",
  "t": "sattari",
  "src": "LGD",
  "lp": [728.9, 461.7],
  "d": "M735,447L736,451L739,451L740,454L743,456L743,461L742,463L744,467L753,470L754,472L752,476L749,477L748,480L743,485L741,484L737,486L731,491L731,493L728,495L727,492L723,488L720,488L716,485L719,474L716,470L717,467L715,456L714,453L711,448L713,447L717,442L718,440L720,436L721,433L726,430L729,431L727,439L728,444L735,447Z"
}, {
  "id": "626802",
  "n": "Bombedem",
  "t": "sattari",
  "src": "LGD",
  "lp": [736.5, 418.8],
  "d": "M744,422L747,433L746,437L740,437L736,438L736,440L736,445L735,447L728,444L727,439L729,431L726,430L723,432L720,427L730,416L728,412L727,408L732,405L733,402L732,401L734,400L735,397L735,395L736,395L736,393L740,392L743,393L745,391L747,394L745,398L747,409L747,415L744,422Z"
}, {
  "id": "626801",
  "n": "Davem",
  "t": "sattari",
  "src": "LGD",
  "lp": [760, 398.5],
  "d": "M785,392L782,393L774,400L766,402L763,406L764,409L763,413L765,422L763,423L756,424L753,424L747,424L745,425L744,422L747,415L747,409L745,398L747,394L744,391L746,382L750,376L751,377L754,377L755,379L758,379L764,376L769,376L771,374L776,380L778,380L780,381L780,384L785,392Z"
}, {
  "id": "626803",
  "n": "Ambedem",
  "t": "sattari",
  "src": "LGD",
  "lp": [735.2, 384.1],
  "d": "M750,376L746,382L745,391L743,393L740,392L737,392L736,395L735,395L735,397L734,400L732,401L728,396L726,392L726,386L724,381L721,378L720,367L724,367L729,368L733,366L735,371L737,373L746,371L750,376Z"
}, {
  "id": "626793",
  "n": "Carambolim- Brama",
  "t": "sattari",
  "src": "LGD",
  "lp": [741.6, 360.8],
  "d": "M759,342L761,351L759,354L758,357L762,360L764,365L766,370L764,373L765,376L756,379L754,377L751,377L750,376L746,371L737,373L735,371L733,366L729,368L724,367L720,367L719,365L720,362L722,360L724,355L728,348L733,346L734,347L745,343L759,342Z"
}, {
  "id": "626800",
  "n": "Ustem",
  "t": "sattari",
  "src": "LGD",
  "lp": [791.7, 382.6],
  "d": "M816,367L812,378L804,379L803,388L798,394L797,396L802,400L802,402L801,403L793,400L791,397L780,384L780,381L778,380L776,380L771,374L775,371L781,370L785,367L790,367L794,363L800,361L805,365L816,367Z"
}, {
  "id": "626797",
  "n": "Nanorem",
  "t": "sattari",
  "src": "LGD",
  "lp": [804, 348.8],
  "d": "M818,335L824,341L824,343L820,345L812,353L806,354L805,355L807,356L816,358L818,360L816,367L805,365L795,354L794,350L789,347L783,348L778,342L782,332L789,333L795,333L799,339L800,341L804,342L808,342L815,338L818,335Z"
}, {
  "id": "626796",
  "n": "Maloli",
  "t": "sattari",
  "src": "LGD",
  "lp": [776.9, 352.3],
  "d": "M782,332L778,342L783,348L789,347L794,350L794,354L800,361L794,363L790,367L785,367L781,370L775,371L769,376L765,376L764,373L766,370L764,365L762,360L758,357L759,354L761,351L759,342L759,336L762,336L767,328L770,329L771,330L773,330L780,327L782,332Z"
}, {
  "id": "626780",
  "n": "Codal",
  "t": "sattari",
  "src": "LGD",
  "lp": [791.4, 307.9],
  "d": "M795,276L807,282L808,285L812,289L815,300L817,302L818,304L818,310L816,316L818,322L815,331L816,334L818,335L815,338L808,342L800,342L795,333L790,332L782,332L780,327L774,330L771,330L770,329L767,328L763,324L763,319L766,314L765,306L765,301L767,298L774,293L776,288L781,284L784,280L795,276Z"
}, {
  "id": "626794",
  "n": "Xelopo-Buzruco",
  "t": "sattari",
  "src": "LGD",
  "lp": [741, 332.6],
  "d": "M759,338L759,342L745,343L738,338L732,335L732,334L724,329L721,329L725,327L728,327L731,324L731,322L733,324L736,323L741,325L744,329L751,332L755,337L759,338Z"
}, {
  "id": "626795",
  "n": "Sigonem",
  "t": "sattari",
  "src": "LGD",
  "lp": [747.3, 320.8],
  "d": "M765,309L766,314L763,319L763,324L767,328L762,336L759,336L759,338L755,337L751,332L744,329L741,325L737,324L733,324L731,322L732,314L736,315L742,314L741,310L746,308L748,306L756,306L760,308L765,309Z"
}, {
  "id": "626782",
  "n": "Dongurli",
  "t": "sattari",
  "src": "LGD",
  "lp": [720, 307.1],
  "d": "M697,292L711,283L713,285L719,284L721,287L725,286L729,287L730,290L731,295L730,298L728,298L729,299L734,301L735,302L740,301L748,306L746,308L741,310L742,314L736,315L732,314L731,323L728,327L725,327L715,333L703,332L702,329L705,325L705,321L696,315L695,309L693,306L693,304L685,305L679,309L669,306L673,301L673,294L671,289L672,287L672,283L676,282L677,287L679,291L684,292L692,291L697,292Z"
}, {
  "id": "626805",
  "n": "Satorem",
  "t": "sattari",
  "src": "LGD",
  "lp": [715.6, 378],
  "d": "M720,362L719,366L721,378L724,381L725,384L726,387L725,391L727,395L724,394L720,395L714,395L711,396L697,397L702,388L709,383L710,378L708,377L706,378L704,373L700,373L698,366L700,364L706,365L708,361L710,360L714,360L720,362Z"
}, {
  "id": "626792",
  "n": "Naneli",
  "t": "sattari",
  "src": "LGD",
  "lp": [713.3, 347],
  "d": "M724,329L732,334L732,335L738,338L745,343L734,347L733,346L728,348L724,355L722,360L720,362L714,360L710,360L708,361L706,365L700,365L671,349L671,345L673,344L677,345L682,347L685,346L687,347L688,349L691,349L700,346L704,346L701,342L701,336L703,332L715,333L721,329L724,329Z"
}, {
  "id": "626791",
  "n": "Edorem",
  "t": "sattari",
  "src": "LGD",
  "lp": [684.2, 372.7],
  "d": "M671,349L700,365L698,366L700,373L704,373L706,378L708,377L710,378L709,383L702,388L696,399L689,402L687,401L686,398L686,395L677,389L672,384L670,376L659,365L655,355L655,352L657,350L662,348L666,343L671,349Z"
}, {
  "id": "626783",
  "n": "Pale",
  "t": "sattari",
  "src": "LGD",
  "lp": [679.7, 326.2],
  "d": "M696,314L705,321L705,323L705,325L702,329L701,342L704,345L700,346L691,349L688,349L687,347L685,346L682,347L677,345L673,344L671,345L671,349L663,340L657,333L653,329L654,327L657,326L656,320L659,315L669,306L679,309L684,306L692,305L693,305L695,309L696,314Z"
}, {
  "id": "626784",
  "n": "Gululem",
  "t": "sattari",
  "src": "LGD",
  "lp": [647.6, 305],
  "d": "M671,289L673,296L673,302L659,315L656,320L657,326L654,327L652,330L644,329L638,325L632,316L630,311L625,308L626,301L628,299L624,292L626,291L628,289L631,290L634,289L636,287L635,284L639,280L643,279L648,283L651,284L654,283L661,287L665,287L666,289L671,289Z"
}, {
  "id": "626785",
  "n": "Querim",
  "t": "sattari",
  "src": "LGD",
  "lp": [609.3, 318.4],
  "d": "M622,288L628,299L626,301L625,308L630,311L632,316L638,325L644,329L636,330L628,338L628,344L626,347L619,348L617,351L610,348L598,342L593,337L592,331L587,328L582,322L584,321L585,314L584,312L585,309L587,306L586,302L586,299L583,297L581,290L587,292L595,290L600,288L605,288L615,283L622,288Z"
}, {
  "id": "626786",
  "n": "Morlem",
  "t": "sattari",
  "src": "LGD",
  "lp": [573.6, 339.2],
  "d": "M582,322L587,328L592,331L593,337L598,342L601,344L594,361L584,366L574,369L568,363L556,361L559,359L555,349L554,344L550,335L547,332L548,326L550,324L551,319L560,316L562,314L564,313L566,312L569,313L569,314L572,317L574,316L576,319L582,322Z"
}, {
  "id": "626787",
  "n": "Saleli",
  "t": "sattari",
  "src": "LGD",
  "lp": [612.5, 376.8],
  "d": "M617,351L618,355L621,360L629,372L632,374L633,380L633,383L634,384L633,388L629,390L627,390L623,394L616,397L609,399L598,406L594,406L588,408L589,405L592,400L591,398L593,394L592,388L594,360L601,344L614,350L617,351Z"
}, {
  "id": "626788",
  "n": "Zormen",
  "t": "sattari",
  "src": "LGD",
  "lp": [640.3, 362.4],
  "d": "M636,330L650,330L653,329L657,333L662,340L666,343L662,348L657,350L655,352L655,355L659,365L670,376L672,384L667,387L660,389L655,391L649,391L635,397L633,393L629,390L633,388L634,385L633,383L633,380L632,374L629,372L621,360L618,355L617,351L619,348L626,347L628,344L628,340L636,330Z"
}, {
  "id": "626807",
  "n": "Buimpal",
  "t": "sattari",
  "src": "LGD",
  "lp": [621.8, 402.1],
  "d": "M629,390L634,394L642,406L629,417L622,417L616,421L612,421L611,420L608,415L597,413L589,413L584,410L594,406L598,406L609,399L616,397L623,394L627,390L629,390Z"
}, {
  "id": "626842",
  "n": "Onda",
  "t": "sattari",
  "town": true,
  "src": "LGD",
  "lp": [574.3, 394.9],
  "d": "M588,408L584,410L581,413L569,416L565,419L564,421L564,427L563,429L556,423L557,421L556,419L554,419L550,418L549,415L552,413L550,412L552,412L550,409L550,407L552,406L556,400L556,396L557,394L561,389L564,387L572,377L574,370L584,366L594,360L592,388L593,394L591,398L592,400L589,405L588,408Z"
}, {
  "id": "626809",
  "n": "Pissurlem",
  "t": "sattari",
  "src": "LGD",
  "lp": [590.4, 433.1],
  "d": "M616,421L614,425L615,438L619,447L612,452L603,463L602,454L599,452L594,449L583,448L578,442L570,438L563,429L564,427L564,422L565,419L569,416L581,413L584,410L589,413L597,413L608,415L612,421L616,421Z"
}, {
  "id": "626810",
  "n": "Sonus-Vonvoliem",
  "t": "sattari",
  "src": "LGD",
  "lp": [570, 444.8],
  "d": "M563,429L570,438L578,442L583,448L594,449L599,452L602,454L603,466L602,467L592,471L585,463L569,456L561,448L556,437L550,432L547,427L547,424L550,418L554,419L556,419L557,421L556,423L563,429Z"
}, {
  "id": "626808",
  "n": "Cumarconda",
  "t": "sattari",
  "src": "LGD",
  "lp": [633.7, 429.8],
  "d": "M647,417L647,420L651,423L653,426L653,434L639,447L634,450L634,448L632,447L626,452L619,447L615,438L614,425L616,421L622,417L629,417L642,406L645,409L645,414L647,417Z"
}, {
  "id": "626812",
  "n": "Codiem",
  "t": "sattari",
  "src": "LGD",
  "lp": [639.2, 455.7],
  "d": "M669,441L673,449L675,455L681,462L675,467L671,464L667,457L662,455L660,449L656,445L653,447L647,456L643,466L638,468L636,472L636,474L627,478L628,464L634,450L639,447L653,434L662,441L666,440L669,441Z"
}, {
  "id": "n2",
  "n": "Nanuz",
  "t": "sattari",
  "src": "SOI",
  "lp": [684.7, 445.5],
  "d": "M700,450L697,451L695,454L697,458L686,463L682,462L675,455L673,449L669,441L685,434L691,440L697,442L700,450Z"
}, {
  "id": "626813",
  "n": "Naguem",
  "t": "sattari",
  "src": "LGD",
  "lp": [665.3, 424.4],
  "d": "M676,421L683,430L685,434L669,441L666,440L662,441L653,434L653,426L651,423L647,420L647,417L651,410L670,417L676,421Z"
}, {
  "id": "626806",
  "n": "Mauxi",
  "t": "sattari",
  "src": "LGD",
  "lp": [663.7, 402.5],
  "d": "M686,398L690,407L689,408L691,410L691,413L692,415L679,426L676,421L670,417L651,410L647,417L645,414L645,409L635,397L649,391L655,391L660,389L667,387L672,384L677,389L686,395L686,398Z"
}, {
  "id": "n3",
  "n": "Veluz",
  "t": "sattari",
  "src": "SOI",
  "lp": [709.3, 411.3],
  "d": "M727,395L733,402L731,406L727,408L728,412L730,416L720,427L717,423L710,420L691,414L691,410L689,408L690,407L688,403L696,399L697,397L711,396L714,395L720,395L724,394L727,395Z"
}, {
  "id": "803246",
  "n": "Valpoi",
  "t": "sattari",
  "src": "SOI",
  "lp": [702.8, 432.2],
  "d": "M717,423L723,432L721,433L720,436L718,440L717,442L712,448L705,451L700,450L697,442L691,440L688,437L686,435L679,426L692,414L710,420L717,423Z"
}, {
  "id": "626823",
  "n": "Codqui",
  "t": "sattari",
  "src": "LGD",
  "lp": [707.1, 467.9],
  "d": "M716,485L710,482L704,486L702,485L702,484L704,481L698,469L697,457L695,455L696,452L697,451L701,449L705,451L711,448L712,453L715,456L717,467L716,470L719,474L716,485Z"
}, {
  "id": "626832",
  "n": "Cotorem",
  "t": "sattari",
  "src": "LGD",
  "lp": [713, 501.2],
  "d": "M710,482L720,488L723,488L727,492L732,500L737,505L737,508L735,510L732,510L724,516L721,517L715,516L706,520L700,519L698,521L694,521L694,517L696,512L693,502L693,500L695,498L699,499L700,498L702,495L702,485L704,486L710,482Z"
}, {
  "id": "626831",
  "n": "Damocem",
  "t": "sattari",
  "src": "LGD",
  "lp": [683.9, 507.6],
  "d": "M693,500L693,502L696,512L694,517L694,521L688,524L680,524L678,522L678,520L670,511L675,504L682,499L687,498L693,500Z"
}, {
  "id": "626828",
  "n": "Guleli",
  "t": "sattari",
  "src": "LGD",
  "lp": [663.2, 515.5],
  "d": "M670,511L678,520L679,523L683,525L679,528L674,530L672,527L668,524L665,523L664,520L661,521L661,525L660,527L659,526L658,525L657,521L656,520L653,520L653,516L652,514L648,515L645,516L648,508L655,503L658,503L661,508L670,511Z"
}, {
  "id": "626829",
  "n": "Padeli",
  "t": "sattari",
  "src": "LGD",
  "lp": [664, 496.2],
  "d": "M667,484L670,487L670,490L672,493L675,504L670,511L661,508L658,503L656,502L655,499L655,494L657,492L663,491L664,488L665,484L667,484Z"
}, {
  "id": "626830",
  "n": "Birondem",
  "t": "sattari",
  "src": "LGD",
  "lp": [686.3, 491.7],
  "d": "M702,485L702,495L700,498L695,498L693,500L687,498L682,499L675,504L672,493L670,490L670,487L667,484L673,482L676,480L677,479L688,481L690,482L699,484L702,485Z"
}, {
  "id": "626824",
  "n": "Sanvorcem",
  "t": "sattari",
  "src": "LGD",
  "lp": [686.8, 470.2],
  "d": "M702,485L699,484L690,482L688,481L677,479L674,473L675,467L681,462L686,463L697,458L698,468L704,481L702,484L702,485Z"
}, {
  "id": "626825",
  "n": "Advoi",
  "t": "sattari",
  "src": "LGD",
  "lp": [655.7, 470.4],
  "d": "M671,464L675,467L674,473L677,479L676,480L668,484L665,484L663,490L656,493L655,496L650,493L648,493L646,486L644,484L638,480L636,476L636,473L638,468L639,467L642,467L643,466L647,456L653,447L656,445L660,449L662,455L667,457L671,464Z"
}, {
  "id": "626827",
  "n": "Vantem",
  "t": "sattari",
  "src": "LGD",
  "lp": [637.2, 499.6],
  "d": "M646,486L648,493L650,493L655,496L656,502L649,507L645,516L638,523L635,524L628,512L620,510L617,506L616,505L619,503L620,502L618,498L618,493L617,491L617,489L619,487L618,485L625,480L636,474L636,476L638,479L644,484L646,486Z"
}, {
  "id": "626811",
  "n": "Vaguriem",
  "t": "sattari",
  "src": "LGD",
  "lp": [614.2, 467.1],
  "d": "M634,450L628,464L627,478L618,485L609,473L603,471L599,468L603,466L603,463L612,452L619,447L626,452L632,447L634,448L634,450Z"
}, {
  "id": "626762",
  "n": "Velguem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [580.8, 473.3],
  "d": "M594,471L598,477L584,489L577,493L567,483L564,481L562,477L565,475L568,471L569,456L585,463L592,471L594,471Z"
}, {
  "id": "626826",
  "n": "Ponocem",
  "t": "sattari",
  "src": "LGD",
  "lp": [606.5, 484.2],
  "d": "M610,474L619,487L617,489L617,491L618,493L618,498L620,502L618,504L613,505L601,497L596,487L596,482L598,479L598,477L594,471L599,468L603,471L608,472L610,474Z"
}, {
  "id": "626764",
  "n": "Pale",
  "t": "bicholim",
  "town": true,
  "src": "LGD",
  "lp": [594.8, 518.5],
  "d": "M616,505L619,509L628,512L635,524L623,527L616,528L614,530L609,536L607,534L605,532L603,530L596,522L593,521L591,522L590,526L594,534L593,537L591,539L588,539L586,538L584,537L577,537L570,539L567,542L567,544L571,552L572,559L572,563L570,564L560,559L561,556L559,553L560,550L557,547L555,539L554,536L556,534L558,529L557,521L559,516L564,512L564,510L567,506L576,500L577,497L577,493L584,489L598,477L598,479L596,482L596,487L601,497L613,505L616,505Z"
}, {
  "id": "626852",
  "n": "Gangem",
  "t": "sattari",
  "src": "LGD",
  "lp": [644.8, 549.6],
  "d": "M674,530L666,531L667,539L671,541L672,547L677,552L677,562L675,565L676,569L679,573L674,578L672,582L668,583L661,574L652,566L649,568L650,571L648,572L647,576L640,577L636,579L633,575L632,571L634,567L629,558L625,557L623,557L621,553L610,547L606,540L606,536L608,536L615,529L637,524L645,516L650,514L653,516L653,520L656,520L657,521L658,525L659,526L660,527L661,525L661,521L664,520L665,523L668,524L672,527L674,530Z"
}, {
  "id": "626873",
  "n": "Usgao",
  "t": "bicholim",
  "town": true,
  "src": "LGD",
  "lp": [597.9, 572.2],
  "d": "M609,536L607,536L606,536L606,540L610,547L621,553L623,557L625,557L629,558L634,567L632,571L633,575L636,579L640,577L647,576L648,572L650,571L649,568L652,566L661,574L668,583L663,585L659,589L657,599L658,603L648,589L629,598L624,600L619,601L616,604L599,613L596,611L593,613L587,612L585,618L579,619L577,621L578,622L575,622L574,617L574,613L572,612L569,612L568,609L569,604L566,603L564,600L566,597L570,592L568,586L570,586L572,584L572,578L570,576L568,576L563,580L562,579L561,577L564,573L563,570L562,569L554,565L549,559L547,559L545,561L544,560L543,559L542,552L550,555L552,554L553,551L559,559L568,563L571,564L572,559L571,552L567,544L567,542L570,539L577,537L584,537L586,538L588,539L591,539L593,537L594,534L590,526L591,522L593,521L596,522L603,530L605,532L607,534L609,536Z"
}, {
  "id": "626840",
  "n": "Melauli",
  "t": "sattari",
  "src": "LGD",
  "lp": [703.1, 543.9],
  "d": "M742,518L737,520L736,524L726,526L731,533L736,547L739,550L746,564L739,567L737,566L734,566L733,567L730,568L727,570L724,568L723,566L721,567L720,570L715,572L709,571L704,572L701,571L699,575L693,578L689,576L684,575L681,573L679,573L676,569L675,565L677,562L677,552L672,547L671,541L667,539L665,532L665,531L673,531L679,528L683,525L688,524L694,521L698,521L700,519L706,520L715,516L721,517L724,516L732,510L735,510L737,508L741,514L742,518Z"
}, {
  "id": "626973",
  "n": "Aglote",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [745.3, 588.2],
  "d": "M787,610L783,612L780,615L777,617L775,609L773,607L763,609L758,611L757,610L755,607L755,600L747,595L746,597L743,615L738,613L734,610L728,611L724,608L723,605L719,606L714,602L709,599L708,597L708,593L710,589L703,586L703,584L704,578L700,575L700,571L704,572L709,571L715,572L720,570L721,567L723,566L724,568L727,570L730,568L733,567L734,566L737,566L739,567L746,564L749,570L762,574L768,566L774,563L776,562L786,571L787,573L788,578L788,580L786,583L784,587L780,591L781,597L785,600L787,608L787,610Z"
}, {
  "id": "n4",
  "n": "Panas",
  "t": "dharbandora",
  "src": "SOI",
  "lp": [767.1, 613.4],
  "d": "M787,610L784,616L784,621L782,623L780,621L777,622L774,619L771,619L770,621L763,619L759,616L757,611L760,611L763,609L773,607L775,609L777,617L780,615L783,612L787,610Z"
}, {
  "id": "626838",
  "n": "Malpona",
  "t": "sattari",
  "src": "LGD",
  "lp": [759.3, 553.7],
  "d": "M778,545L778,551L777,556L778,558L774,563L768,566L762,574L749,570L739,550L743,544L748,541L752,538L752,539L755,544L759,546L769,546L772,548L778,545Z"
}, {
  "id": "626839",
  "n": "Ambeli",
  "t": "sattari",
  "src": "LGD",
  "lp": [739.4, 534.5],
  "d": "M748,523L750,527L749,531L747,534L748,535L752,536L752,538L748,541L743,544L739,550L736,547L731,533L726,526L736,524L737,520L742,518L748,523Z"
}, {
  "id": "626837",
  "n": "Govanem",
  "t": "sattari",
  "src": "LGD",
  "lp": [767.7, 533.2],
  "d": "M797,526L793,528L791,531L788,533L782,542L773,548L767,546L759,546L755,544L753,541L752,539L752,536L748,535L747,534L749,531L750,527L748,523L748,522L760,517L763,520L769,522L773,525L777,523L782,524L788,526L794,525L797,526Z"
}, {
  "id": "626833",
  "n": "Xelopo-Curdo",
  "t": "sattari",
  "src": "LGD",
  "lp": [748.9, 496.9],
  "d": "M797,479L794,481L789,483L786,487L781,489L775,490L771,492L766,499L762,503L760,507L762,511L760,514L760,517L749,521L748,522L748,523L742,519L741,514L737,508L737,505L732,500L728,495L731,493L731,491L737,486L741,484L743,485L748,480L749,477L752,476L754,472L753,470L757,468L763,472L764,475L772,480L778,478L784,479L791,478L797,479Z"
}, {
  "id": "626835",
  "n": "Sirsodem",
  "t": "sattari",
  "src": "LGD",
  "lp": [785.8, 493.6],
  "d": "M801,500L798,500L794,503L791,507L787,505L782,506L778,504L771,505L765,508L762,508L761,507L762,503L766,499L771,492L775,490L781,489L786,487L789,483L794,481L797,479L798,482L799,489L802,495L801,498L801,500Z"
}, {
  "id": "626836",
  "n": "Assodem",
  "t": "sattari",
  "src": "LGD",
  "lp": [787.8, 513.1],
  "d": "M816,517L815,519L813,519L812,520L803,522L797,526L794,525L788,526L782,524L777,523L773,525L769,522L763,520L760,517L760,514L762,511L760,507L762,508L765,508L771,505L778,504L782,506L787,505L791,507L794,503L798,500L801,500L804,503L815,513L816,517Z"
}, {
  "id": "626974",
  "n": "Surla",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [844.5, 565],
  "d": "M894,525L908,553L909,563L910,567L910,571L907,573L910,575L899,590L897,601L898,603L895,603L894,602L891,602L884,597L883,598L881,597L872,602L869,607L866,604L861,607L857,607L854,609L849,613L839,629L833,630L829,632L825,637L819,638L816,640L814,640L811,641L809,640L807,638L807,630L804,628L803,625L798,622L796,618L793,618L790,614L789,611L787,610L787,608L785,600L781,597L780,591L784,587L786,583L788,580L788,578L786,571L776,562L778,558L777,556L778,551L778,545L784,540L788,533L791,531L795,527L799,525L803,522L810,520L812,521L813,519L815,519L816,517L827,514L836,505L838,503L840,505L840,502L842,500L858,493L863,493L865,490L867,489L869,489L871,488L882,502L891,518L894,525Z"
}, {
  "id": "626975",
  "n": "Molem",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [864.7, 651.2],
  "d": "M884,597L891,602L894,602L895,603L898,602L900,606L906,609L909,617L912,622L908,644L919,657L925,658L915,661L906,666L898,673L890,677L889,677L886,673L883,673L875,686L874,686L870,685L870,680L867,676L864,677L860,681L855,680L851,680L848,682L848,684L844,687L839,689L838,691L838,695L833,701L830,701L828,702L825,703L820,700L815,700L813,697L809,698L806,698L805,696L806,692L802,688L799,692L791,694L790,686L784,681L785,678L788,676L787,672L789,670L792,665L800,661L801,659L804,658L808,656L815,653L816,650L820,648L818,645L818,642L816,640L825,637L829,632L833,630L839,629L849,613L854,609L857,607L861,607L866,604L869,607L872,602L875,600L881,597L883,598L884,597Z"
}, {
  "id": "626972",
  "n": "Sancordem",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [771.5, 638.3],
  "d": "M758,610L759,616L763,619L770,621L771,619L774,619L777,622L780,621L782,623L784,621L784,616L787,610L789,612L789,614L791,616L793,618L796,618L798,622L803,625L804,628L807,630L807,637L809,640L811,641L814,640L816,640L818,642L818,645L821,647L820,649L816,650L815,653L808,656L804,658L801,659L800,661L792,665L789,670L787,672L788,676L785,678L784,681L781,681L775,680L773,674L767,673L755,667L750,669L746,666L745,662L743,659L741,658L735,652L733,652L732,650L732,648L738,647L740,644L734,637L729,632L726,632L726,629L724,625L716,618L710,613L709,611L709,604L708,601L709,600L714,602L719,606L723,605L727,611L734,610L736,612L742,615L744,614L746,597L747,595L755,600L755,606L758,610Z"
}, {
  "id": "626979",
  "n": "Sangod",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [756.5, 694.9],
  "d": "M784,681L790,686L791,694L787,699L790,705L782,709L779,708L775,709L774,708L772,708L771,711L768,715L770,720L770,722L767,721L762,723L761,721L757,722L754,726L752,727L749,726L750,724L749,723L745,727L741,728L739,732L733,730L732,729L730,731L728,731L728,725L731,724L731,722L729,722L724,726L722,726L718,723L719,714L716,713L716,709L714,709L711,712L708,710L708,708L711,708L711,703L713,702L713,699L718,698L720,699L722,696L728,691L737,669L738,663L740,658L743,659L745,662L746,666L750,669L755,667L767,673L773,674L775,680L781,681L784,681Z"
}, {
  "id": "626978",
  "n": "Sigao",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [801.5, 739.4],
  "d": "M842,746L840,751L837,756L835,756L833,759L828,763L825,765L820,767L812,771L810,772L808,771L804,774L799,775L790,772L785,772L776,771L772,771L771,767L772,762L767,756L770,753L764,748L759,742L758,736L762,732L761,730L762,728L761,725L767,721L770,722L770,720L768,715L771,711L772,708L774,708L775,709L779,708L782,709L790,705L794,703L799,703L802,706L804,706L805,708L807,710L815,710L818,709L822,709L824,708L826,707L832,710L838,722L839,727L841,729L841,731L842,733L840,736L844,738L845,741L848,742L842,744L842,746Z"
}, {
  "id": "626988",
  "n": "Calem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [836.5, 773.7],
  "d": "M762,723L761,725L762,728L761,730L762,732L758,736L758,740L764,748L770,752L767,756L772,762L771,767L772,771L776,771L785,772L790,772L799,775L804,774L808,771L811,772L820,767L826,765L833,759L835,756L837,756L840,751L840,748L841,749L843,748L844,751L847,751L850,753L850,755L851,760L854,762L857,766L863,766L867,767L869,782L876,784L879,786L882,783L883,782L885,782L887,784L888,786L884,791L884,794L886,800L891,806L890,806L884,803L873,795L870,799L867,799L863,795L857,795L854,799L851,800L848,805L844,807L846,814L846,818L847,821L850,822L851,824L847,827L843,825L835,817L834,812L832,809L825,812L824,810L822,810L819,808L814,807L812,805L810,806L806,812L801,809L797,813L795,812L794,814L790,812L790,816L788,816L786,814L784,813L783,814L784,816L782,817L779,815L780,811L775,810L772,812L768,813L767,815L761,816L759,819L753,818L750,820L747,819L741,822L740,819L740,812L738,810L737,802L735,799L738,797L738,795L736,793L734,793L733,791L733,788L736,783L733,781L736,776L736,773L735,772L734,771L737,770L736,768L738,768L740,770L740,772L747,768L746,761L748,754L745,753L743,751L744,736L745,727L749,723L750,724L749,726L752,727L754,726L757,722L761,721L762,723Z"
}, {
  "id": "626977",
  "n": "Colem",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [873.3, 729.9],
  "d": "M885,674L887,678L889,679L889,682L892,687L891,691L893,693L892,698L894,700L892,703L891,705L891,707L889,712L890,716L898,713L901,714L904,716L905,721L904,725L909,738L909,741L908,743L904,752L906,757L906,763L908,763L911,768L907,775L906,780L904,782L897,781L894,782L891,783L888,786L886,783L883,782L882,783L879,786L876,784L869,782L868,770L867,767L863,766L857,766L854,762L851,760L850,755L850,753L847,751L844,751L843,748L841,749L842,746L842,744L848,742L845,741L844,738L840,736L842,733L841,731L841,729L839,727L838,722L831,710L826,707L824,708L822,709L818,709L815,710L807,710L805,708L804,706L802,706L799,703L794,703L790,705L787,699L791,694L799,692L802,688L806,692L805,696L806,698L809,698L813,697L815,700L820,700L825,703L828,702L830,701L833,701L838,695L838,691L839,689L844,687L848,684L848,682L851,680L855,680L860,681L864,677L867,676L870,680L870,685L874,686L876,684L883,674L885,674Z"
}, {
  "id": "626991",
  "n": "Odxel",
  "t": "sanguem",
  "src": "LGD",
  "lp": [872.8, 815.8],
  "d": "M890,806L893,811L898,813L901,818L899,824L891,839L876,832L873,833L871,837L866,834L860,833L858,828L854,828L850,822L847,821L846,818L846,814L844,807L848,805L851,800L854,799L857,795L863,795L867,799L870,799L873,795L884,803L890,806Z"
}, {
  "id": "626992",
  "n": "Dongurli",
  "t": "sanguem",
  "src": "LGD",
  "lp": [829.2, 829.5],
  "d": "M814,807L819,808L822,810L824,810L826,812L832,809L834,812L835,817L843,825L847,827L851,824L854,828L858,828L860,833L866,834L871,837L873,833L876,832L890,839L888,848L886,850L871,853L872,855L870,854L867,856L860,854L856,852L853,843L851,842L848,841L842,839L837,843L835,841L831,843L824,840L818,840L814,838L810,837L804,834L800,831L801,827L798,823L791,822L789,817L790,814L794,814L795,812L797,813L801,809L806,812L810,806L812,805L814,807Z"
}, {
  "id": "627004",
  "n": "Todou",
  "t": "sanguem",
  "src": "LGD",
  "lp": [844.4, 907.4],
  "d": "M886,881L881,886L879,893L874,900L871,902L867,911L865,912L862,917L858,918L857,920L855,922L852,929L848,933L846,939L841,939L839,936L841,935L841,933L838,931L837,928L833,927L831,923L828,923L828,917L826,914L825,911L821,909L820,906L817,906L815,910L813,912L808,909L802,909L804,902L803,900L800,896L800,893L804,891L810,890L814,887L815,889L817,889L820,892L822,889L821,886L835,883L838,884L839,883L841,884L843,885L847,883L849,880L851,880L855,883L859,882L865,881L874,876L877,878L879,876L883,881L886,881Z"
}, {
  "id": "626993",
  "n": "Patiem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [838.2, 867.6],
  "d": "M853,843L856,852L865,856L872,855L876,860L872,865L877,870L878,874L879,876L877,878L874,876L865,881L858,883L855,883L851,880L849,880L847,883L843,885L841,884L839,883L838,884L835,883L825,885L821,886L822,889L820,892L817,889L815,889L814,887L810,890L802,890L801,889L791,882L796,874L805,864L817,861L825,852L830,849L831,843L835,841L837,843L842,839L853,843Z"
}, {
  "id": "627003",
  "n": "Uguem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [777.1, 891.7],
  "d": "M805,864L796,874L791,882L801,889L802,890L804,891L801,893L800,896L803,900L804,901L803,909L808,909L813,912L815,910L817,906L820,906L821,909L825,911L826,914L828,917L828,922L822,924L817,929L811,927L805,928L798,927L797,926L795,926L792,926L790,925L787,926L785,925L782,925L775,922L773,923L773,925L769,929L763,927L762,928L760,928L757,923L754,925L748,924L749,919L748,918L738,921L736,921L735,918L736,914L739,914L744,912L744,907L745,905L747,903L749,899L752,899L751,893L755,882L755,875L757,872L757,868L759,867L764,866L771,858L776,855L777,857L783,860L790,859L800,863L805,864Z"
}, {
  "id": "626996",
  "n": "Costi",
  "t": "sanguem",
  "src": "LGD",
  "lp": [749.1, 851.5],
  "d": "M776,855L771,858L764,866L759,867L757,868L757,872L755,875L752,875L749,873L747,871L744,870L736,864L732,860L730,856L725,849L725,844L727,840L728,832L734,832L744,828L750,828L755,832L758,840L767,850L775,853L776,855Z"
}, {
  "id": "626995",
  "n": "Dudal",
  "t": "sanguem",
  "src": "LGD",
  "lp": [776.5, 832.4],
  "d": "M789,817L791,822L798,823L801,826L801,828L800,831L794,836L788,845L783,846L778,849L777,854L776,855L775,853L767,850L758,840L755,832L750,828L744,828L736,832L731,833L728,832L725,828L729,825L737,822L740,820L742,822L747,819L750,820L753,818L759,819L761,816L767,815L768,813L772,812L775,810L780,811L779,814L782,817L784,816L783,814L784,813L786,814L787,816L789,817Z"
}, {
  "id": "626994",
  "n": "Maulinguem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [805.3, 847.3],
  "d": "M831,843L830,849L825,852L817,861L810,863L800,863L790,859L783,860L776,857L776,855L777,854L778,849L783,846L788,845L794,836L800,831L804,834L810,837L814,838L818,840L824,840L831,843Z"
}, {
  "id": "626984",
  "n": "Bandoli",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [683.4, 783.7],
  "d": "M693,802L692,802L690,805L686,807L686,803L683,800L675,800L670,798L653,797L655,793L656,788L660,783L661,780L674,770L678,769L683,764L686,764L690,762L694,762L703,761L707,759L712,774L711,777L707,779L708,785L708,789L707,790L705,792L698,795L696,795L696,798L693,802Z"
}, {
  "id": "626985",
  "n": "Rumbrem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [673.6, 808.1],
  "d": "M692,802L697,801L699,810L693,811L688,816L677,815L676,816L668,818L665,821L661,818L658,815L651,815L649,813L650,810L645,805L653,797L655,797L661,798L670,798L675,800L683,800L686,803L686,807L690,805L692,802Z"
}, {
  "id": "627021",
  "n": "Sanvordem",
  "t": "sanguem",
  "town": true,
  "src": "LGD",
  "lp": [666.9, 829.5],
  "d": "M688,816L686,820L689,824L689,830L688,832L685,835L685,838L687,841L686,844L681,843L678,841L676,841L673,836L671,835L669,836L664,844L663,844L657,842L647,843L641,836L642,835L645,833L645,829L650,818L652,817L651,815L658,815L661,818L665,821L668,818L676,816L677,815L688,816Z"
}, {
  "id": "803252",
  "n": "Curchorem-Cacora",
  "t": "quepem",
  "src": "SOI",
  "lp": [659.9, 849.5],
  "d": "M676,841L677,847L675,853L679,856L682,854L684,855L685,858L685,864L679,864L665,857L659,856L658,857L650,857L647,853L644,851L643,848L641,845L638,851L637,857L629,854L626,851L627,849L625,845L625,841L628,838L629,839L641,837L647,843L657,842L663,844L664,844L669,836L671,835L673,836L676,841Z"
}, {
  "id": "626998",
  "n": "Comproi",
  "t": "sanguem",
  "src": "LGD",
  "lp": [687.5, 856.1],
  "d": "M686,844L686,848L689,850L691,857L697,862L696,864L693,863L690,865L688,867L685,871L684,869L685,864L685,858L684,855L682,854L679,856L676,854L675,852L676,850L677,847L676,841L678,841L681,843L686,844Z"
}, {
  "id": "626997",
  "n": "Coranginim",
  "t": "sanguem",
  "src": "LGD",
  "lp": [704.1, 845.8],
  "d": "M725,828L728,832L726,842L725,844L718,849L715,849L715,851L712,856L708,859L698,862L692,858L689,850L686,848L686,844L695,841L701,837L705,828L707,827L708,831L711,832L714,831L717,831L725,828Z"
}, {
  "id": "626986",
  "n": "Antoriem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [697.6, 825.6],
  "d": "M707,827L705,828L701,837L695,841L686,844L687,841L685,838L685,835L688,832L689,830L689,824L686,820L688,817L693,811L699,810L704,816L706,822L707,827Z"
}, {
  "id": "626999",
  "n": "Muguli",
  "t": "sanguem",
  "src": "LGD",
  "lp": [728, 875.3],
  "d": "M755,875L755,882L751,893L752,899L749,899L747,903L745,905L744,907L743,903L740,896L743,896L739,892L734,890L730,891L728,887L725,886L717,889L715,887L716,884L715,882L712,883L710,885L709,884L708,877L706,876L702,876L700,875L699,873L700,871L700,870L696,864L697,862L709,858L714,853L715,851L715,849L718,849L725,844L725,849L730,856L732,860L736,864L744,870L747,871L749,873L752,875L755,875Z"
}, {
  "id": "803253",
  "n": "Sanguem",
  "t": "sanguem",
  "src": "SOI",
  "lp": [733.2, 909.3],
  "d": "M743,903L744,912L739,914L729,913L726,915L726,913L723,911L723,907L721,906L720,906L715,915L717,931L711,924L710,922L702,912L700,904L696,901L693,901L691,899L697,895L701,896L704,894L707,894L709,891L709,889L710,888L713,888L715,887L717,889L722,886L726,886L728,888L730,891L734,890L739,891L743,895L740,896L742,903Z"
}, {
  "id": "627000",
  "n": "Cotarli",
  "t": "sanguem",
  "src": "LGD",
  "lp": [726.5, 925.3],
  "d": "M729,913L736,914L735,918L737,923L735,937L739,940L737,945L734,945L734,947L732,949L732,952L725,947L721,942L716,940L707,932L700,929L695,930L693,927L689,923L687,919L684,912L684,906L684,905L691,899L693,901L696,901L700,904L701,905L702,912L710,922L711,924L717,931L715,915L720,906L721,906L723,907L723,911L726,913L726,915L729,913Z"
}, {
  "id": "626942",
  "n": "Nagvem",
  "t": "quepem",
  "src": "LGD",
  "lp": [681.2, 930.5],
  "d": "M695,930L692,935L690,944L688,946L680,948L674,945L669,947L665,944L663,945L661,944L657,937L658,930L661,932L665,932L668,931L670,928L673,923L679,922L685,914L688,922L693,927L695,930Z"
}, {
  "id": "803252-2",
  "n": "Curchorem-Cacora",
  "t": "quepem",
  "src": "SOI",
  "lp": [674.9, 890],
  "d": "M685,864L684,869L684,870L688,867L690,865L693,863L696,864L700,870L700,871L699,873L699,874L702,876L707,876L708,878L709,884L710,885L712,883L715,882L716,884L715,886L713,888L710,888L709,889L709,891L707,894L704,894L701,896L698,895L696,896L689,900L684,905L684,911L685,914L680,922L673,922L670,928L668,931L664,932L661,932L658,930L655,924L652,923L649,914L646,914L643,910L643,907L639,905L640,902L639,893L641,891L641,881L635,880L633,878L633,876L631,878L628,875L628,873L634,862L637,859L638,851L641,845L643,848L644,851L647,853L650,857L658,857L659,856L665,857L679,864L685,864Z"
}, {
  "id": "626969",
  "n": "Xeldem",
  "t": "quepem",
  "town": true,
  "src": "LGD",
  "lp": [618.1, 885],
  "d": "M637,857L636,861L634,862L628,873L628,875L631,878L633,876L633,878L635,880L641,881L641,891L639,893L640,902L639,905L627,908L621,914L619,914L620,916L606,919L608,912L610,909L610,905L605,901L604,899L601,898L600,895L598,894L598,893L598,890L597,887L595,884L597,882L594,877L595,874L597,874L598,873L599,868L598,865L598,862L603,860L605,859L608,860L610,861L613,857L615,855L618,854L624,853L625,851L626,851L630,855L637,857Z"
}, {
  "id": "626941",
  "n": "Sirvoi",
  "t": "quepem",
  "src": "LGD",
  "lp": [634.3, 932.8],
  "d": "M658,930L657,937L660,941L664,949L664,953L661,957L655,960L645,963L642,965L638,964L636,962L637,959L636,958L631,960L627,958L621,957L619,954L616,955L616,960L613,959L608,956L604,958L603,954L600,949L600,948L601,946L606,947L608,946L607,943L604,940L603,937L604,936L610,936L612,929L610,926L612,924L613,920L618,918L620,916L619,914L621,914L627,908L639,905L641,906L643,907L643,910L646,914L649,914L652,923L655,924L658,930Z"
}, {
  "id": "n5",
  "n": "Amona",
  "t": "quepem",
  "src": "SOI",
  "lp": [592.9, 901.9],
  "d": "M598,894L600,895L601,898L604,899L605,901L610,905L610,909L608,912L606,911L602,908L602,905L593,908L589,907L586,912L583,913L586,912L586,907L583,903L580,903L579,901L582,898L586,899L589,899L589,897L588,895L592,891L594,892L598,894Z"
}, {
  "id": "803251",
  "n": "Quepem",
  "t": "quepem",
  "src": "SOI",
  "lp": [598.6, 921.9],
  "d": "M608,912L606,919L616,917L618,917L613,920L612,924L610,926L612,929L610,936L604,936L603,938L599,940L599,937L596,936L579,915L582,913L586,912L589,907L593,908L602,905L602,908L608,912Z"
}, {
  "id": "n6",
  "n": "Kusmana",
  "t": "quepem",
  "src": "SOI",
  "lp": [579.9, 925.9],
  "d": "M590,929L585,930L582,933L576,936L575,935L573,935L573,932L570,931L574,920L576,917L579,915L586,923L590,929Z"
}, {
  "id": "626939",
  "n": "Avedem",
  "t": "quepem",
  "src": "LGD",
  "lp": [572, 891.5],
  "d": "M585,887L583,890L584,893L582,894L582,898L580,901L580,903L576,905L574,905L568,902L564,901L560,898L561,884L574,880L575,878L578,880L578,882L581,884L585,887Z"
}, {
  "id": "626940",
  "n": "Chaifi",
  "t": "quepem",
  "src": "LGD",
  "lp": [587.2, 891.8],
  "d": "M592,891L588,895L589,897L589,899L586,899L582,898L582,894L584,893L583,890L585,887L587,887L589,886L592,891Z"
}, {
  "id": "626938",
  "n": "Cotombi",
  "t": "quepem",
  "src": "LGD",
  "lp": [576.9, 877.2],
  "d": "M595,874L594,878L597,882L595,884L595,886L598,890L597,892L598,894L594,892L592,891L589,886L587,887L585,887L581,884L578,882L578,880L575,878L574,880L561,884L560,877L557,873L559,871L564,867L569,861L576,862L577,861L580,867L583,869L583,870L584,871L587,870L590,871L595,874Z"
}, {
  "id": "626903",
  "n": "Guirdolim",
  "t": "salcete",
  "src": "LGD",
  "lp": [562.4, 841.4],
  "d": "M599,820L601,824L603,828L597,833L596,838L595,840L591,841L585,840L584,842L587,848L587,851L579,852L576,862L569,861L565,866L562,862L559,862L557,860L559,857L560,858L562,855L565,855L564,853L558,850L545,848L540,844L543,832L545,828L546,823L549,817L557,817L566,820L577,817L587,821L588,821L589,820L596,822L597,822L599,820Z"
}, {
  "id": "626934",
  "n": "Assolda",
  "t": "quepem",
  "src": "LGD",
  "lp": [592.9, 851.8],
  "d": "M606,858L603,860L598,862L598,865L599,868L597,874L595,874L590,871L587,870L583,871L583,869L580,867L577,861L579,852L586,852L587,848L584,842L585,840L590,841L594,840L596,838L597,833L602,829L602,831L601,837L605,839L604,842L601,843L600,845L601,848L603,849L606,858Z"
}, {
  "id": "626935",
  "n": "Xic-Xelvona",
  "t": "quepem",
  "src": "LGD",
  "lp": [613.6, 842.6],
  "d": "M628,838L625,841L625,845L627,849L626,851L625,851L624,853L618,854L615,855L613,857L610,861L607,860L604,854L603,849L601,848L600,845L601,843L604,842L605,839L601,837L602,831L602,829L603,828L605,830L613,826L617,825L622,831L625,832L628,838Z"
}, {
  "id": "626982",
  "n": "Camarconda",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [640, 789.1],
  "d": "M653,797L645,805L637,799L636,796L634,796L632,796L630,795L629,792L624,790L625,786L628,783L632,784L635,784L644,780L652,778L663,774L670,774L661,780L660,783L656,788L655,793L653,797Z"
}, {
  "id": "626864",
  "n": "Ponchavadi",
  "t": "ponda",
  "src": "LGD",
  "lp": [610.7, 795.2],
  "d": "M616,751L616,755L617,757L620,760L623,761L624,763L622,766L623,770L622,772L628,783L625,786L624,790L629,792L629,795L632,796L634,796L636,796L637,799L650,810L649,813L652,817L650,818L645,828L645,833L641,836L642,838L639,838L629,839L625,832L622,831L617,825L613,826L606,830L603,828L601,823L595,813L598,805L598,801L590,795L581,792L584,786L589,783L591,781L591,776L590,772L591,765L592,762L596,761L595,759L595,753L601,752L603,753L609,752L615,752L616,751Z"
}, {
  "id": "626902",
  "n": "Macasana",
  "t": "salcete",
  "src": "LGD",
  "lp": [579.1, 806.6],
  "d": "M581,792L590,795L598,801L598,805L595,813L599,820L597,822L594,822L589,820L588,821L587,821L577,817L566,820L558,818L558,816L561,815L562,813L561,808L562,797L561,791L571,790L581,792Z"
}, {
  "id": "626862",
  "n": "Conxem",
  "t": "ponda",
  "src": "LGD",
  "lp": [595.3, 711.3],
  "d": "M605,724L599,722L597,723L594,722L590,722L587,717L585,711L588,710L589,707L597,700L602,700L606,705L606,709L605,712L606,716L605,718L605,722L604,723L605,724Z"
}, {
  "id": "626983",
  "n": "Moissal",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [639.3, 758.3],
  "d": "M670,774L663,774L652,778L644,780L635,784L632,784L628,783L622,772L623,770L622,766L624,763L623,761L619,761L617,757L616,755L616,751L618,749L618,746L621,745L626,740L629,740L630,737L632,736L632,733L633,731L635,730L638,734L639,736L640,738L648,742L652,746L654,746L656,745L661,745L662,755L660,760L660,763L667,773L670,774Z"
}, {
  "id": "626987",
  "n": "Santona",
  "t": "sanguem",
  "src": "LGD",
  "lp": [721.5, 777.8],
  "d": "M745,727L744,736L743,751L745,753L748,754L746,761L747,768L740,772L739,768L736,768L737,770L734,771L735,772L736,773L736,775L733,780L736,783L733,788L733,791L734,793L737,793L738,795L737,798L735,799L737,802L738,810L740,812L740,820L737,822L731,824L727,827L719,831L714,831L711,832L708,831L706,822L703,814L699,810L697,802L693,802L696,798L696,795L698,795L705,792L707,790L708,789L708,785L707,779L711,777L712,774L707,759L709,758L711,753L713,752L714,749L717,747L721,747L721,745L723,744L723,742L725,741L727,738L727,735L725,733L722,733L720,730L720,725L722,726L724,726L730,722L731,724L728,725L728,731L730,731L732,729L733,730L739,732L741,728L745,727Z"
}, {
  "id": "626981",
  "n": "Codli",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [678.5, 731.2],
  "d": "M711,703L711,708L708,708L708,710L711,712L715,709L716,713L719,714L718,721L718,723L720,725L720,730L722,733L725,733L727,735L727,736L727,738L725,741L723,742L723,744L721,745L721,747L717,747L714,749L713,752L711,753L709,758L707,759L703,761L694,762L690,762L686,764L683,764L678,769L674,770L670,774L667,773L660,763L660,760L662,755L661,745L656,745L654,746L652,746L648,742L640,738L639,736L638,734L634,729L638,721L636,719L638,718L639,717L642,717L645,716L648,717L650,716L647,712L642,711L640,709L643,703L645,703L647,705L649,703L644,698L646,692L650,691L653,692L654,694L657,695L660,692L662,686L664,687L669,690L671,689L672,691L674,694L672,697L673,700L675,701L679,698L682,698L684,700L682,704L684,707L686,707L690,705L691,701L694,701L697,699L699,699L702,701L706,700L711,703Z"
}, {
  "id": "626971",
  "n": "Darbandora",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [675.7, 641.1],
  "d": "M709,600L708,601L709,604L709,611L710,613L716,618L724,625L726,629L726,632L729,632L734,637L740,644L738,647L734,647L732,649L733,652L735,652L740,658L738,663L737,669L735,674L732,684L728,691L722,696L720,699L718,698L713,698L712,703L711,703L706,700L702,701L699,699L697,699L694,701L691,701L690,705L686,707L684,707L682,704L684,701L682,698L679,698L675,701L673,700L672,697L674,693L671,689L669,690L662,686L660,692L658,695L656,696L654,694L653,692L649,691L649,687L645,686L646,681L644,678L644,674L640,673L638,671L636,670L633,673L632,670L635,664L638,668L640,668L640,667L637,660L631,658L630,660L625,647L623,646L620,648L619,648L614,642L613,639L610,645L607,646L605,638L608,633L607,631L603,631L600,625L604,618L603,615L599,613L616,604L619,601L624,600L629,598L648,589L657,603L657,599L659,589L663,585L670,583L674,578L679,573L681,573L684,575L689,576L693,578L699,575L700,573L700,576L704,577L703,584L703,586L710,589L708,593L708,597L709,600Z"
}, {
  "id": "626861",
  "n": "Nirancal",
  "t": "ponda",
  "src": "LGD",
  "lp": [604.4, 698.5],
  "d": "M631,658L637,660L640,666L640,668L638,668L636,665L632,670L633,673L636,670L638,671L640,673L644,674L644,678L646,681L645,686L649,688L649,691L646,692L644,697L649,703L647,705L645,703L643,703L640,709L642,711L647,712L650,716L648,717L645,716L642,717L639,717L636,719L638,721L636,726L634,729L635,730L633,731L632,733L632,736L630,737L629,740L627,740L621,738L618,738L614,736L612,729L605,724L604,723L605,722L605,718L606,716L605,712L606,707L604,702L602,700L597,700L589,707L588,710L585,711L582,710L567,704L565,703L563,697L566,691L567,688L566,685L570,678L573,678L573,676L579,672L580,669L580,667L584,667L599,662L602,663L606,663L608,663L611,661L616,660L617,661L622,661L624,659L627,659L629,661L630,660L630,658L631,658Z"
}, {
  "id": "626860",
  "n": "Codar",
  "t": "ponda",
  "src": "LGD",
  "lp": [582.5, 638.8],
  "d": "M596,611L603,615L604,618L600,625L603,631L607,631L608,633L605,638L606,646L610,645L613,639L614,642L619,648L620,648L623,646L624,646L628,659L624,659L622,661L617,661L616,660L613,660L608,663L606,663L602,664L599,662L584,667L580,667L578,659L572,653L572,651L570,652L569,650L569,646L567,646L560,641L560,635L561,633L566,631L575,621L577,623L579,619L585,618L587,612L593,613L595,611Z"
}, {
  "id": "626859",
  "n": "Betora",
  "t": "ponda",
  "src": "LGD",
  "lp": [541, 658.3],
  "d": "M560,635L560,641L567,646L569,646L569,650L570,652L572,651L572,653L578,659L580,667L580,669L579,672L573,676L573,678L570,678L566,685L567,688L566,691L564,688L560,688L558,685L551,685L550,686L546,683L541,682L537,680L524,678L522,676L523,674L523,673L519,671L516,667L514,668L512,669L505,663L505,658L504,655L504,651L510,643L512,644L517,643L518,642L522,641L526,638L531,637L534,633L538,634L540,633L544,634L546,632L548,633L550,630L550,625L553,627L554,631L560,635Z"
}, {
  "id": "626872",
  "n": "Borim",
  "t": "ponda",
  "town": true,
  "src": "LGD",
  "lp": [531.1, 695.7],
  "d": "M566,691L563,697L565,703L564,704L559,704L551,710L549,713L546,710L542,710L539,708L527,702L523,698L518,696L515,700L512,701L513,703L511,705L518,712L513,715L510,719L509,721L505,725L499,725L500,720L500,717L498,714L493,712L492,710L498,695L497,681L491,673L500,671L508,665L512,669L514,668L516,667L519,671L523,673L523,674L522,676L524,678L537,680L541,682L546,683L550,686L551,685L558,685L560,688L564,688L566,691Z"
}, {
  "id": "803247",
  "n": "Ponda",
  "t": "ponda",
  "src": "SOI",
  "lp": [497.5, 637.3],
  "d": "M549,620L550,630L548,633L546,632L544,634L540,633L538,634L534,633L531,637L526,638L522,641L518,642L517,643L512,644L510,644L506,648L504,655L505,658L505,663L508,665L499,671L490,673L483,667L478,660L475,656L471,652L466,649L461,648L458,646L459,643L463,643L464,641L468,636L470,636L472,633L475,631L479,631L481,628L485,625L488,625L490,628L492,628L493,626L494,626L496,621L501,617L502,615L501,609L504,608L506,609L508,609L509,606L512,608L514,605L516,607L520,608L520,610L524,613L528,613L541,601L545,605L546,607L545,610L549,620Z"
}, {
  "id": "626857",
  "n": "Telaulim",
  "t": "ponda",
  "src": "LGD",
  "lp": [436.3, 657.5],
  "d": "M464,641L463,643L460,643L458,645L461,647L458,649L453,656L447,659L447,662L446,668L452,673L457,676L455,683L449,681L438,682L432,680L428,676L426,672L421,648L426,645L430,636L430,634L433,632L434,632L439,638L444,641L448,642L455,642L464,641Z"
}, {
  "id": "626856",
  "n": "Durbhat",
  "t": "ponda",
  "src": "LGD",
  "lp": [460.4, 661.6],
  "d": "M458,649L466,649L471,652L475,656L477,659L474,661L466,670L461,670L460,670L457,676L452,673L446,668L447,662L447,659L453,656L458,649Z"
}, {
  "id": "626858",
  "n": "Vadi",
  "t": "ponda",
  "src": "LGD",
  "lp": [469.8, 672.4],
  "d": "M484,668L479,674L476,677L474,676L471,678L470,675L469,677L467,676L463,679L463,681L459,686L455,683L456,678L460,670L461,670L466,670L474,661L477,659L484,668Z"
}, {
  "id": "n7",
  "n": "Tamsheri",
  "t": "ponda",
  "src": "SOI",
  "lp": [480.5, 690.3],
  "d": "M491,673L497,681L498,695L492,710L489,707L485,707L474,702L459,686L463,681L463,679L467,676L469,677L470,675L471,678L474,676L476,677L479,674L484,668L491,673Z"
}, {
  "id": "626889",
  "n": "Loutulim",
  "t": "salcete",
  "src": "LGD",
  "lp": [460.3, 709.4],
  "d": "M426,671L428,676L434,681L440,682L449,681L456,683L474,702L485,707L489,707L493,711L498,714L500,717L500,720L498,730L499,739L495,740L494,738L494,735L490,735L487,729L484,730L479,728L473,729L470,732L470,736L462,741L460,741L456,744L454,745L452,741L449,741L448,743L439,744L436,746L434,746L437,739L435,737L435,734L432,733L430,726L427,719L431,717L429,707L427,704L420,704L419,699L417,695L414,692L411,687L406,680L406,678L411,674L414,672L426,671Z"
}, {
  "id": "626924",
  "n": "Nuvem",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [409.4, 770],
  "d": "M436,738L437,740L434,746L434,753L437,756L437,760L435,767L430,768L430,779L428,781L428,784L430,786L431,788L425,790L424,789L421,789L419,787L417,788L415,783L415,798L412,802L411,802L410,803L407,801L408,799L407,797L405,795L406,793L403,791L405,790L403,786L403,783L402,783L402,785L399,790L392,790L392,792L390,792L385,786L381,784L381,782L383,780L385,778L386,776L393,776L393,772L389,772L387,758L383,750L384,749L391,752L400,744L410,744L410,743L413,741L414,741L418,745L420,741L424,738L428,737L431,739L436,738Z"
}, {
  "id": "626890",
  "n": "Camurlim",
  "t": "salcete",
  "src": "LGD",
  "lp": [470.4, 744.2],
  "d": "M495,740L490,745L487,743L481,749L478,749L475,754L475,757L472,760L465,758L460,758L457,756L454,758L451,741L454,745L456,744L460,741L462,741L470,736L470,732L473,729L479,728L484,730L487,729L490,735L494,735L494,738L495,740Z"
}, {
  "id": "626925",
  "n": "Raia",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [461.1, 778.4],
  "d": "M451,741L454,758L457,756L460,758L465,758L471,760L475,757L475,754L478,749L481,749L487,743L489,745L489,747L491,751L493,761L497,768L491,770L491,775L492,778L500,781L503,781L504,784L498,792L496,792L494,791L491,797L492,800L489,810L489,812L490,815L487,815L482,808L476,806L475,801L473,797L471,800L467,797L460,801L453,803L450,794L448,793L446,789L438,787L431,788L428,784L428,781L430,779L430,768L435,767L437,760L437,756L434,753L434,746L448,743L449,741L451,741Z"
}, {
  "id": "626863",
  "n": "Shiroda",
  "t": "ponda",
  "src": "LGD",
  "lp": [562, 742.5],
  "d": "M565,703L569,705L582,710L585,711L587,717L590,722L594,722L597,723L599,722L607,725L612,729L614,736L618,738L621,738L627,740L621,745L618,746L617,750L615,752L609,752L603,753L601,752L595,753L595,759L596,761L592,762L591,765L590,772L591,776L591,781L589,783L584,786L581,792L571,790L562,791L558,790L555,788L552,780L550,778L536,785L532,786L517,786L511,784L509,782L508,780L509,775L505,767L498,730L499,725L505,726L509,721L509,719L513,715L518,712L511,705L513,703L512,701L515,700L518,696L523,698L527,702L539,708L542,710L546,710L549,713L551,710L559,704L564,704L565,703Z"
}, {
  "id": "626926",
  "n": "Curtorim",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [529.5, 791.4],
  "d": "M561,791L562,797L561,808L562,813L561,815L558,816L558,818L549,817L546,823L545,828L543,832L540,843L525,843L524,844L518,842L514,843L510,841L511,836L502,835L501,828L499,828L499,826L491,823L490,825L487,824L483,824L477,821L487,815L490,815L490,813L489,810L492,800L491,797L494,791L496,792L498,792L504,784L503,781L500,781L492,778L491,775L491,770L497,768L493,761L491,751L489,747L489,745L492,743L495,740L499,739L505,767L509,775L508,780L511,784L514,786L517,786L530,787L536,785L550,778L552,780L556,789L561,791Z"
}, {
  "id": "n8",
  "n": "Mugal",
  "t": "salcete",
  "src": "SOI",
  "lp": [493.3, 831.4],
  "d": "M510,841L501,845L492,846L493,840L487,835L481,824L477,821L483,824L487,824L490,825L491,823L499,826L499,828L501,828L502,835L511,836L510,841Z"
}, {
  "id": "n9",
  "n": "Marmagoo",
  "t": "salcete",
  "src": "SOI",
  "lp": [488.8, 843.7],
  "d": "M487,835L493,840L492,846L489,851L484,850L485,848L486,842L487,841L487,835Z"
}, {
  "id": "626910",
  "n": "Cavorim",
  "t": "salcete",
  "src": "LGD",
  "lp": [547.1, 868.6],
  "d": "M565,866L557,872L558,874L560,877L561,881L561,889L560,894L556,894L551,885L546,886L544,887L543,886L544,884L542,881L541,878L539,877L537,878L537,875L532,870L533,867L532,863L529,860L529,857L532,852L533,851L536,851L538,849L540,844L545,848L558,850L564,853L565,855L562,855L560,858L559,857L557,860L559,862L562,862L565,866Z"
}, {
  "id": "626912",
  "n": "Paroda",
  "t": "salcete",
  "src": "LGD",
  "lp": [563.9, 912.6],
  "d": "M580,903L583,903L586,907L586,912L581,914L576,917L574,920L568,922L563,921L558,918L557,920L560,923L560,926L546,927L544,926L544,916L546,905L545,902L547,902L550,900L560,899L564,901L569,902L575,905L580,903Z"
}, {
  "id": "626913",
  "n": "Mulem",
  "t": "salcete",
  "src": "LGD",
  "lp": [527, 901],
  "d": "M560,894L560,899L550,900L548,902L545,902L545,905L544,916L544,926L537,920L528,919L522,921L512,926L511,920L509,918L505,911L505,908L508,905L505,902L504,898L507,895L512,892L512,890L516,887L519,887L522,888L527,884L531,883L533,882L534,880L536,878L539,878L541,878L542,881L544,884L543,886L544,887L546,886L551,885L556,894L560,894Z"
}, {
  "id": "626927",
  "n": "Sao Jose De Areal",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [510.6, 868.3],
  "d": "M540,843L539,847L538,849L536,851L533,851L532,852L529,857L529,860L532,863L533,867L532,870L536,874L537,876L537,878L536,878L534,880L532,881L531,883L527,884L522,888L519,887L516,887L512,890L512,892L507,894L504,898L501,898L498,897L497,894L493,894L491,892L489,891L481,881L481,880L485,874L485,870L487,870L495,863L493,856L489,851L492,846L501,845L510,841L514,843L518,842L524,844L525,843L540,843Z"
}, {
  "id": "626909",
  "n": "Dicarpale",
  "t": "salcete",
  "src": "LGD",
  "lp": [485.2, 861],
  "d": "M483,849L489,851L493,856L495,863L487,870L485,870L485,873L482,878L480,875L475,872L477,866L476,859L474,850L471,849L470,847L474,847L480,851L482,850L483,849Z"
}, {
  "id": "626929",
  "n": "Aquem-Baixo",
  "t": "salcete",
  "src": "LGD",
  "lp": [464.2, 858.2],
  "d": "M470,847L471,849L474,850L476,859L477,866L475,872L472,869L472,866L468,862L465,860L459,861L456,860L451,857L451,856L447,853L451,852L458,846L460,848L465,847L470,847Z"
}, {
  "id": "626908",
  "n": "Dramapur",
  "t": "salcete",
  "src": "LGD",
  "lp": [466.3, 888.6],
  "d": "M472,869L482,877L481,880L488,891L486,896L483,900L470,905L468,905L465,904L460,899L458,899L457,897L447,897L447,895L444,895L447,893L445,887L446,883L448,883L447,878L446,877L453,873L456,874L468,869L472,869Z"
}, {
  "id": "626914",
  "n": "Sarzora",
  "t": "salcete",
  "src": "LGD",
  "lp": [484.8, 918.5],
  "d": "M504,898L505,902L508,905L505,908L505,911L509,918L511,920L512,926L510,935L506,945L504,946L502,945L500,945L500,943L494,943L493,942L491,943L492,940L494,939L494,937L495,934L493,934L490,933L490,936L488,936L486,938L481,940L475,931L468,925L458,917L455,904L454,898L457,897L458,899L460,899L466,904L470,905L483,900L486,896L488,891L493,894L497,894L498,897L504,898Z"
}, {
  "id": "626918",
  "n": "Deussua",
  "t": "salcete",
  "src": "LGD",
  "lp": [439.2, 920.8],
  "d": "M454,898L455,904L457,914L446,915L448,919L452,920L451,924L451,927L449,928L444,928L442,931L445,932L446,935L448,937L449,933L450,934L451,933L453,934L454,941L450,939L449,940L452,943L447,942L439,947L435,947L430,945L429,943L430,940L435,936L437,929L435,927L431,926L427,921L427,919L430,911L429,907L437,907L436,905L440,906L439,902L436,902L438,900L438,898L440,896L442,897L443,900L446,899L444,898L444,895L447,895L447,897L454,898Z"
}, {
  "id": "626932",
  "n": "Varca",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [396.7, 915.3],
  "d": "M408,882L410,884L415,884L418,897L425,898L429,900L424,902L415,903L409,905L408,908L410,921L402,925L402,927L402,928L404,929L405,937L404,940L405,949L404,951L402,949L403,946L401,945L401,943L391,945L390,938L385,918L384,912L380,903L381,900L379,898L377,888L384,886L387,887L390,885L393,885L402,882L408,882Z"
}, {
  "id": "626916",
  "n": "Orlim",
  "t": "salcete",
  "src": "LGD",
  "lp": [418.4, 914.8],
  "d": "M429,907L430,911L427,919L427,921L429,925L411,928L404,929L402,928L402,925L410,921L408,908L409,905L417,902L424,902L429,900L431,900L433,902L433,903L430,902L429,907Z"
}, {
  "id": "626907",
  "n": "Talaulim",
  "t": "salcete",
  "src": "LGD",
  "lp": [430.6, 885],
  "d": "M446,877L447,878L448,883L446,883L445,887L447,893L444,895L444,898L446,899L443,900L442,897L440,896L438,900L436,902L439,902L440,905L437,904L437,907L429,907L430,902L433,903L432,901L428,900L425,898L418,897L415,881L416,878L418,878L419,873L423,871L422,866L424,866L426,864L434,861L439,865L442,876L446,877Z"
}, {
  "id": "626930",
  "n": "Navelim",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [452.8, 862.9],
  "d": "M447,853L451,856L451,857L456,860L459,861L465,860L468,862L472,866L472,869L468,869L456,874L453,873L446,877L443,876L439,865L434,861L426,864L424,866L422,866L423,871L419,873L418,878L416,878L415,884L410,884L409,883L408,880L409,878L408,874L403,868L408,864L410,860L412,857L409,856L409,854L416,849L420,841L420,844L421,845L424,845L423,847L423,849L426,847L424,849L426,849L428,851L427,852L429,850L427,848L430,848L430,847L432,846L435,850L433,851L432,852L435,852L434,853L435,855L438,856L439,857L447,853Z"
}, {
  "id": "626928",
  "n": "Davorlim",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [472.9, 837.2],
  "d": "M477,821L481,824L487,834L487,840L486,842L485,849L480,851L474,847L466,846L460,848L458,846L459,846L458,844L458,840L461,826L465,822L470,822L474,821L477,821Z"
}, {
  "id": "803249",
  "n": "Margao",
  "t": "salcete",
  "src": "SOI",
  "lp": [443.2, 819.9],
  "d": "M430,788L438,787L446,789L448,793L450,794L453,803L460,801L467,797L471,800L473,797L475,801L476,806L482,808L485,816L477,821L474,821L470,822L465,822L461,828L460,832L458,837L458,841L459,846L455,848L451,852L439,857L438,856L435,855L434,853L435,852L432,852L433,851L435,850L432,846L430,847L430,848L427,848L429,850L428,852L428,851L426,849L424,849L426,847L423,849L423,847L424,845L422,846L420,845L420,843L420,839L416,837L416,833L414,833L413,832L413,828L416,826L413,822L411,823L406,820L409,820L403,813L412,813L415,809L414,804L412,802L415,798L415,783L416,789L419,787L421,789L424,789L425,790L430,788Z"
}, {
  "id": "626900",
  "n": "Duncolim",
  "t": "salcete",
  "src": "LGD",
  "lp": [397.2, 794.1],
  "d": "M406,796L404,797L404,799L402,799L399,803L395,805L386,807L387,805L387,803L386,801L389,800L390,798L389,795L390,792L392,790L399,790L402,785L402,783L403,783L403,786L405,790L403,791L406,793L405,795Z"
}, {
  "id": "n10",
  "n": "Mungul",
  "t": "salcete",
  "src": "SOI",
  "lp": [398.2, 810.3],
  "d": "M411,802L414,804L414,806L415,808L413,812L403,813L409,819L406,820L409,821L404,824L396,823L385,824L383,817L383,808L396,804L400,802L402,799L404,799L404,797L406,796L408,798L407,801L410,803L411,802Z"
}, {
  "id": "626897",
  "n": "Colva",
  "t": "salcete",
  "src": "LGD",
  "lp": [367.3, 817.6],
  "d": "M384,806L384,808L381,808L381,810L379,811L380,814L380,821L379,824L377,824L376,827L374,828L375,832L372,833L370,832L364,833L360,834L353,811L358,809L360,809L360,806L363,806L364,807L365,810L371,811L373,810L372,802L374,801L378,802L380,804L381,806L384,806Z"
}, {
  "id": "626896",
  "n": "Gaundaulim",
  "t": "salcete",
  "src": "LGD",
  "lp": [367.9, 806.1],
  "d": "M372,802L373,810L370,811L369,810L365,810L363,808L363,805L365,802L368,802L369,803L372,802Z"
}, {
  "id": "626895",
  "n": "Betalbatim",
  "t": "salcete",
  "src": "LGD",
  "lp": [368.6, 793.5],
  "d": "M377,783L385,786L390,792L389,795L390,798L389,800L386,801L387,803L387,805L386,806L381,806L380,804L377,801L374,801L369,803L368,802L364,803L363,806L360,806L360,809L353,811L351,805L351,802L346,788L352,786L355,786L356,784L360,783L361,784L362,782L365,779L365,775L367,774L369,774L367,776L369,776L371,777L369,778L371,778L373,782L377,782Z"
}, {
  "id": "626905",
  "n": "Sernabatim",
  "t": "salcete",
  "src": "LGD",
  "lp": [368.9, 835.9],
  "d": "M382,838L383,844L381,845L381,848L366,851L360,834L364,833L370,833L372,833L375,832L374,828L376,827L377,824L379,824L379,827L377,829L378,832L376,834L379,839L382,838Z"
}, {
  "id": "626898",
  "n": "Vanelim",
  "t": "salcete",
  "src": "LGD",
  "lp": [382.6, 825.3],
  "d": "M383,808L383,818L386,827L389,830L390,833L387,836L386,839L383,841L382,838L379,839L376,834L378,832L377,829L379,827L380,824L380,821L380,814L379,811L381,810L381,808L383,808Z"
}, {
  "id": "626904",
  "n": "Cana",
  "t": "salcete",
  "src": "LGD",
  "lp": [391.8, 836.1],
  "d": "M391,843L389,843L387,842L387,836L390,833L390,831L393,829L393,835L396,836L397,836L396,837L393,842L391,843Z"
}, {
  "id": "626906",
  "n": "Adsulim",
  "t": "salcete",
  "src": "LGD",
  "lp": [386.5, 844.8],
  "d": "M391,843L389,845L391,846L390,848L388,849L388,850L385,850L384,849L384,845L383,844L382,842L386,839L387,842L388,842L391,843Z"
}, {
  "id": "626931",
  "n": "Benaulim",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [387.7, 854.7],
  "d": "M420,841L416,849L409,854L409,856L412,856L410,860L408,864L403,868L408,874L409,877L408,880L408,882L402,882L393,885L390,885L387,887L384,886L383,887L377,888L372,870L369,864L366,851L381,848L381,845L383,844L384,845L384,849L385,850L388,850L388,849L390,848L391,846L389,845L393,842L396,837L397,836L396,836L393,835L393,829L390,831L386,827L385,824L396,823L404,824L409,821L411,823L413,822L416,826L413,828L413,832L414,833L416,833L417,834L416,837L420,839L420,841Z"
}, {
  "id": "626893",
  "n": "Utorda",
  "t": "salcete",
  "src": "LGD",
  "lp": [357.5, 749.2],
  "d": "M376,740L372,742L373,744L374,745L361,752L356,757L356,760L352,763L349,764L348,766L346,763L339,766L333,750L345,749L350,749L348,738L360,732L360,735L361,736L366,738L367,739L370,737L371,738L375,740Z"
}, {
  "id": "626894",
  "n": "Gonsua",
  "t": "salcete",
  "src": "LGD",
  "lp": [349.9, 778.2],
  "d": "M344,783L342,775L354,773L352,775L354,775L357,776L357,780L359,782L356,782L355,781L352,780L344,783Z"
}, {
  "id": "626892",
  "n": "Majorda",
  "t": "salcete",
  "src": "LGD",
  "lp": [364.9, 764.6],
  "d": "M383,750L387,757L387,761L382,763L381,767L378,768L377,765L372,767L369,767L365,772L366,775L365,779L361,781L361,784L360,783L356,784L355,786L352,786L346,788L344,783L352,780L354,782L356,781L359,782L357,780L357,776L354,775L353,775L355,773L342,775L339,766L346,763L348,766L349,763L352,763L356,760L356,757L361,752L374,745L373,744L372,742L374,741L376,740L378,744L380,747L379,749L382,749L383,750Z"
}, {
  "id": "626891",
  "n": "Calata",
  "t": "salcete",
  "src": "LGD",
  "lp": [376.9, 771.9],
  "d": "M381,784L377,783L373,782L371,778L369,779L371,777L369,778L367,776L369,775L368,774L366,775L365,772L370,766L372,767L377,765L378,768L381,767L382,763L387,760L389,772L393,772L393,776L386,776L385,777L383,780L382,781L380,781L381,784Z"
}, {
  "id": "626923",
  "n": "Verna",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [402.8, 715.7],
  "d": "M436,738L431,739L428,737L424,738L420,741L418,745L414,741L413,741L410,743L410,744L400,744L391,752L386,749L384,750L382,749L379,749L379,746L375,740L371,738L370,737L367,739L366,738L361,736L360,733L361,732L359,730L358,728L360,727L359,725L360,723L361,721L364,721L376,715L380,709L381,705L383,702L383,700L384,697L386,695L390,695L393,693L398,688L398,685L403,685L406,680L411,687L414,692L417,695L419,699L420,704L427,704L428,705L431,717L427,719L430,726L432,733L435,734L436,738Z"
}, {
  "id": "626884",
  "n": "Arossim",
  "t": "mormugao",
  "src": "LGD",
  "lp": [341.1, 734.9],
  "d": "M361,721L361,723L359,725L360,727L358,728L359,730L361,732L348,738L350,749L345,749L333,750L331,745L330,739L325,729L330,726L332,727L344,724L344,721L355,718L358,717L360,721Z"
}, {
  "id": "626883",
  "n": "Cansaulim",
  "t": "mormugao",
  "src": "LGD",
  "lp": [334.9, 719.6],
  "d": "M355,712L358,714L358,717L355,717L353,719L344,721L344,724L332,727L330,726L325,729L320,717L333,711L337,712L338,714L340,714L342,712L352,710L352,711L355,712Z"
}, {
  "id": "626882",
  "n": "Velsao",
  "t": "mormugao",
  "src": "LGD",
  "lp": [341.4, 696.6],
  "d": "M363,684L362,688L364,688L362,694L363,697L361,697L361,699L356,700L357,704L356,708L355,712L352,711L352,710L342,712L340,714L338,714L337,712L333,712L320,717L314,704L311,699L318,698L322,696L324,693L327,691L332,684L333,678L339,681L342,680L342,677L347,680L353,682L363,684Z"
}, {
  "id": "626888",
  "n": "Nagoa",
  "t": "salcete",
  "src": "LGD",
  "lp": [372.9, 697.2],
  "d": "M406,678L406,680L403,685L398,685L398,688L393,693L390,695L386,695L384,697L383,700L383,702L381,705L380,709L376,715L364,722L360,721L358,714L355,712L355,708L357,705L356,700L361,699L361,697L363,697L362,694L364,688L362,688L363,684L365,685L366,682L370,688L374,686L375,687L377,687L379,676L378,673L389,679L406,678Z"
}, {
  "id": "626887",
  "n": "Cortalim",
  "t": "mormugao",
  "town": true,
  "src": "LGD",
  "lp": [365.6, 654],
  "d": "M378,673L379,676L377,687L375,687L374,686L371,688L369,687L367,682L364,685L359,683L353,682L347,680L342,677L346,673L349,669L355,667L356,663L354,657L353,655L348,653L348,639L350,637L351,633L351,629L350,624L351,619L365,633L366,635L373,636L376,635L378,640L378,647L381,653L381,656L379,658L380,665L381,668L378,673Z"
}, {
  "id": "626876",
  "n": "Quelossim",
  "t": "mormugao",
  "src": "LGD",
  "lp": [399.1, 643.5],
  "d": "M366,618L381,623L406,626L410,627L413,629L415,631L422,648L426,671L414,672L411,674L406,678L400,678L393,679L388,678L384,675L378,673L381,668L380,665L379,658L381,656L381,653L378,647L378,640L377,635L373,636L366,635L365,633L351,619L350,615L366,618Z"
}, {
  "id": "626886",
  "n": "Sancoale",
  "t": "mormugao",
  "town": true,
  "src": "LGD",
  "lp": [315.2, 647.6],
  "d": "M336,616L350,615L351,619L350,624L351,630L350,636L348,639L348,653L353,655L354,657L356,663L355,667L349,669L346,673L342,677L342,680L338,681L327,675L326,676L317,675L314,677L315,680L313,681L310,680L307,681L306,679L298,681L293,679L290,680L285,681L285,677L286,676L283,673L283,671L279,670L279,666L274,661L269,660L266,658L273,658L277,657L276,655L275,653L273,651L273,649L279,648L286,647L285,639L277,639L277,632L280,632L284,630L286,630L284,627L281,624L281,622L284,619L286,619L287,620L287,629L290,629L294,632L300,633L304,631L311,631L315,628L314,625L315,619L314,620L314,621L310,620L313,620L312,617L316,619L318,621L321,618L325,618L327,618L326,613L336,616Z"
}, {
  "id": "626878",
  "n": "Pale",
  "t": "mormugao",
  "src": "LGD",
  "lp": [316.6, 687.1],
  "d": "M333,678L332,684L328,691L324,693L322,696L316,698L311,699L307,691L298,681L306,679L307,681L310,680L315,680L314,677L317,675L324,675L327,675L333,678Z"
}, {
  "id": "626879",
  "n": "Issorcim",
  "t": "mormugao",
  "src": "LGD",
  "lp": [273, 674.6],
  "d": "M285,681L283,681L283,684L282,686L270,687L267,688L267,690L264,689L263,686L264,685L263,684L263,677L260,671L260,667L263,661L266,660L266,658L269,660L274,661L279,666L279,670L283,671L283,673L286,676L285,677L285,681Z"
}, {
  "id": "626880",
  "n": "Chicolna",
  "t": "mormugao",
  "src": "LGD",
  "lp": [256.6, 679.9],
  "d": "M260,667L260,671L263,677L263,684L264,685L263,686L263,687L267,690L267,692L266,694L264,695L262,695L251,696L244,692L243,690L248,684L249,684L251,681L251,679L253,678L254,666L260,667Z"
}, {
  "id": "626885",
  "n": "Chicalim",
  "t": "mormugao",
  "town": true,
  "src": "LGD",
  "lp": [244.3, 653.7],
  "d": "M258,632L255,640L256,647L248,659L250,659L251,664L254,666L253,678L251,679L251,681L249,684L248,684L243,690L240,685L235,679L233,681L230,681L222,678L230,671L231,661L237,655L237,653L241,647L235,635L233,635L233,631L230,627L229,623L230,622L231,621L235,624L237,623L240,617L243,617L245,616L249,617L254,620L255,622L257,631L258,632Z"
}, {
  "id": "626874",
  "n": "Dabolim",
  "t": "mormugao",
  "src": "LGD",
  "lp": [270.7, 643.6],
  "d": "M277,632L277,639L285,639L286,647L279,648L273,649L273,651L275,653L275,655L277,657L273,658L266,658L266,660L263,661L260,667L255,667L251,664L250,663L250,659L248,659L256,647L256,641L258,632L263,632L265,631L269,631L267,625L265,624L267,624L270,631L277,632Z"
}, {
  "id": "626734",
  "n": "Goa-Velha",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [328.4, 583.4],
  "d": "M337,563L341,570L342,579L340,581L339,581L340,583L330,593L333,598L336,603L339,604L341,604L344,605L345,608L349,609L349,615L336,616L326,613L325,607L324,605L322,592L323,589L319,585L318,584L312,582L312,584L318,585L322,588L322,590L316,590L306,586L307,582L305,576L303,575L295,575L292,579L290,580L287,578L285,575L286,570L291,564L293,563L296,563L299,561L301,556L299,551L302,552L302,554L305,556L309,564L313,562L315,560L321,561L323,560L327,562L329,562L330,561L333,563L337,563Z"
}, {
  "id": "626724",
  "n": "Siridao",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [282, 571.1],
  "d": "M296,563L291,563L286,569L285,573L285,577L288,579L290,580L292,579L295,575L303,575L305,576L307,582L306,586L300,586L298,583L294,584L291,584L290,587L287,589L285,589L281,588L282,585L282,582L279,577L278,577L279,575L278,567L274,565L272,565L271,566L272,563L271,561L268,560L268,559L272,558L279,556L289,555L289,557L295,561L296,563Z"
}, {
  "id": "626723",
  "n": "Curca",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [295, 543],
  "d": "M304,523L305,524L304,528L308,534L311,533L311,535L310,538L302,541L301,546L299,551L301,557L299,561L296,563L295,561L289,557L289,555L285,555L288,545L289,534L288,532L292,533L293,528L300,521L302,522L304,523Z"
}, {
  "id": "626733",
  "n": "Bambolim",
  "t": "tiswadi",
  "town": true,
  "src": "LGD",
  "lp": [273, 543.1],
  "d": "M288,533L288,535L288,545L285,555L277,556L272,558L268,559L266,555L263,552L260,552L258,551L253,553L253,557L252,559L247,549L246,543L248,545L253,543L257,544L259,543L261,540L266,539L266,535L282,528L285,528L288,533Z"
}, {
  "id": "626718",
  "n": "Carambolim",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [227, 575.7],
  "d": "M197,548L200,548L204,546L207,545L209,547L210,550L212,551L214,551L216,549L218,548L218,549L219,548L221,549L222,549L226,550L228,550L230,550L233,549L235,551L237,551L240,554L242,553L251,559L253,557L253,553L258,551L260,552L263,552L268,558L268,560L271,561L272,563L271,566L272,565L274,565L278,567L279,575L279,577L282,582L282,585L281,588L285,589L287,589L290,587L291,584L298,583L300,586L307,586L316,590L322,590L322,588L318,585L312,584L312,582L318,584L319,585L323,589L322,592L324,605L325,607L326,613L300,605L285,604L281,603L269,596L261,592L246,588L231,586L201,584L180,578L165,572L169,538L170,536L174,537L176,540L179,541L184,547L189,549L188,550L191,553L192,554L193,554L192,551L194,548L197,548Z"
}, {
  "id": "626732",
  "n": "Calapor",
  "t": "tiswadi",
  "town": true,
  "src": "LGD",
  "lp": [246.5, 523.9],
  "d": "M266,514L261,517L261,520L262,521L264,527L268,527L269,529L272,529L273,531L275,531L266,535L266,539L261,540L259,543L254,544L248,545L247,543L247,549L251,558L249,558L242,553L240,554L237,551L236,551L237,546L236,533L229,531L231,521L229,519L231,519L232,516L231,515L233,513L230,514L229,511L229,510L227,508L227,507L228,505L230,505L233,503L235,503L234,500L237,499L236,496L241,496L242,494L243,493L248,492L251,497L255,499L254,503L258,503L261,510L261,513L265,512L266,514Z"
}, {
  "id": "n11",
  "n": "Mersiwadi",
  "t": "tiswadi",
  "src": "SOI",
  "lp": [265.9, 487.2],
  "d": "M270,490L267,492L262,486L262,484L265,482L268,483L270,486L268,488L270,490Z"
}, {
  "id": "626731",
  "n": "Murda",
  "t": "tiswadi",
  "town": true,
  "src": "LGD",
  "lp": [288.5, 499.8],
  "d": "M270,472L271,474L277,475L280,479L287,482L292,486L296,486L298,490L296,495L303,498L304,501L309,503L308,508L304,515L303,520L304,523L302,522L300,521L295,526L284,518L282,519L277,513L276,510L273,511L271,512L268,512L267,513L266,514L265,512L261,513L261,510L258,503L254,503L255,499L251,497L247,493L243,493L242,491L242,489L241,487L247,485L246,483L248,482L249,480L250,476L268,472L270,472ZM263,483L261,484L262,486L267,492L270,490L268,488L270,486L268,483L263,483ZM272,498L270,498L272,501L271,503L273,506L275,506L275,501L272,498Z"
}, {
  "id": "n12",
  "n": "Mersi",
  "t": "tiswadi",
  "src": "SOI",
  "lp": [273.1, 502.3],
  "d": "M272,498L275,501L275,506L273,506L271,503L272,501L270,498L272,498Z"
}, {
  "id": "n13",
  "n": "Raybandar",
  "t": "tiswadi",
  "src": "SOI",
  "lp": [290.9, 471.3],
  "d": "M318,472L317,477L314,481L307,480L300,478L292,477L288,476L286,476L282,476L279,475L278,476L271,474L270,472L271,468L271,464L285,461L296,468L300,468L305,471L318,472Z"
}, {
  "id": "626730",
  "n": "Chimbel",
  "t": "tiswadi",
  "town": true,
  "src": "LGD",
  "lp": [309.3, 489.1],
  "d": "M288,476L292,477L299,478L307,480L314,481L316,482L322,487L321,489L324,495L321,496L321,499L317,502L312,503L309,503L304,501L303,498L296,495L298,490L297,486L292,486L287,482L280,479L278,476L278,475L281,475L282,476L288,476Z"
}, {
  "id": "n14",
  "n": "Kujra Velem Bhat",
  "t": "tiswadi",
  "src": "SOI",
  "lp": [277, 523.5],
  "d": "M295,526L292,530L291,531L288,532L289,535L287,531L284,528L273,531L272,529L269,529L268,527L264,527L262,521L261,520L261,517L267,514L268,512L271,512L273,511L276,510L277,513L282,519L284,518L295,526Z"
}, {
  "id": "626716",
  "n": "Talaulim",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [318.5, 526.4],
  "d": "M342,502L342,507L340,508L340,510L340,513L336,515L334,517L333,523L334,525L329,528L328,527L323,529L322,529L316,533L315,537L317,538L319,535L320,535L324,537L325,540L328,540L330,545L330,550L338,548L342,557L337,563L333,563L330,561L329,562L327,562L323,560L321,561L315,560L313,562L309,564L305,556L302,554L302,552L299,551L301,546L302,541L310,538L311,535L311,533L308,534L304,528L305,524L303,520L304,514L308,508L309,503L316,502L321,499L321,496L324,495L322,490L327,492L333,489L337,500L339,502L342,502Z"
}, {
  "id": "626717",
  "n": "Goalim-Moula",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [344.8, 520.1],
  "d": "M353,505L355,505L355,510L356,514L356,530L350,529L349,533L344,532L341,534L337,531L331,538L329,537L325,537L320,535L319,535L317,538L315,537L316,533L322,529L323,529L328,527L329,528L334,526L333,523L334,517L336,515L340,513L340,510L340,508L342,507L342,502L345,502L348,505L350,504L353,505Z"
}, {
  "id": "n15",
  "n": "Panvelim",
  "t": "tiswadi",
  "src": "SOI",
  "lp": [323.8, 481.4],
  "d": "M330,471L329,475L333,480L332,484L333,488L331,490L327,492L322,490L321,489L322,487L316,482L314,481L317,477L318,472L330,471Z"
}, {
  "id": "626715",
  "n": "Bainguinim",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [342, 486.8],
  "d": "M355,505L353,505L350,504L348,505L345,502L339,502L337,500L333,489L332,484L333,480L329,475L330,471L342,468L350,479L351,481L352,480L354,481L354,484L350,489L355,485L356,491L355,497L355,505Z"
}, {
  "id": "626714",
  "n": "Ella",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [364.2, 473.7],
  "d": "M400,451L405,452L406,453L404,461L394,466L385,470L381,477L380,479L384,481L378,483L373,482L371,487L369,486L369,489L368,491L365,495L366,497L360,499L358,503L355,505L355,497L356,491L355,485L350,489L354,484L354,481L352,480L351,481L350,479L342,468L355,465L359,463L370,452L372,447L379,438L389,442L391,445L400,451Z"
}, {
  "id": "626719",
  "n": "Azossim",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [373.7, 534],
  "d": "M374,525L374,522L377,523L382,528L385,532L388,535L392,535L392,541L391,544L388,546L388,548L383,551L382,550L379,550L377,549L374,545L367,543L362,538L362,535L360,533L358,532L356,530L356,521L362,519L365,519L374,525Z"
}, {
  "id": "n16",
  "n": "Karmali",
  "t": "tiswadi",
  "src": "SOI",
  "lp": [404.8, 529.1],
  "d": "M384,482L387,484L387,486L388,485L389,487L391,491L390,494L390,499L393,501L395,500L399,501L405,506L409,506L411,510L413,511L416,511L418,516L424,521L426,526L426,531L425,534L421,536L416,537L413,538L409,545L407,556L410,565L409,571L399,575L394,576L393,570L394,565L392,562L388,561L387,554L383,551L388,548L388,546L391,544L392,541L392,535L388,535L385,532L382,528L377,523L374,522L374,525L368,520L364,519L356,521L356,514L355,510L355,505L358,503L359,499L366,497L365,495L368,491L369,489L369,486L371,487L373,482L378,483L384,482Z"
}, {
  "id": "626720",
  "n": "Mandur",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [367, 550],
  "d": "M382,550L387,554L388,561L385,561L385,563L382,563L380,559L377,560L365,560L364,558L360,557L359,555L357,556L357,554L355,554L356,548L359,541L362,538L367,543L374,545L377,549L379,550L382,550Z"
}, {
  "id": "626721",
  "n": "Gancim",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [343.5, 543.5],
  "d": "M356,530L358,533L362,535L362,538L359,541L356,548L355,554L352,557L342,557L338,548L330,550L330,546L328,541L325,540L325,537L331,537L337,531L341,534L344,532L349,533L350,529L356,530Z"
}, {
  "id": "626725",
  "n": "Neura-O-Pequeno",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [345, 566.9],
  "d": "M352,557L352,560L348,580L342,579L341,570L337,564L342,557L352,557Z"
}, {
  "id": "626735",
  "n": "Mercurim",
  "t": "tiswadi",
  "town": true,
  "src": "LGD",
  "lp": [345.2, 595.9],
  "d": "M348,580L348,586L351,588L353,588L355,592L358,593L359,599L362,601L357,606L349,609L345,608L344,605L342,604L339,604L336,603L330,592L338,586L340,583L339,581L340,581L344,579L348,580Z"
}, {
  "id": "626726",
  "n": "Neura-O-Grande",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [364.1, 584.9],
  "d": "M388,561L392,562L394,565L393,570L394,576L389,577L384,580L380,584L379,588L380,595L371,607L366,618L349,615L349,609L357,606L362,601L359,599L358,593L355,592L353,588L351,588L348,586L348,584L352,560L352,557L355,554L357,556L359,555L361,556L364,558L365,560L377,560L379,559L381,563L385,563L385,561L388,561Z"
}, {
  "id": "626867",
  "n": "Marcaim",
  "t": "ponda",
  "town": true,
  "src": "LGD",
  "lp": [404.1, 601.1],
  "d": "M434,583L431,590L431,593L430,597L433,598L434,604L438,606L437,608L429,613L422,612L421,614L423,617L419,625L414,629L410,627L406,626L381,623L366,618L371,607L380,595L379,588L380,584L384,580L389,577L399,575L404,573L411,581L419,579L423,581L430,581L432,583L434,583Z"
}, {
  "id": "626868",
  "n": "Priol",
  "t": "ponda",
  "town": true,
  "src": "LGD",
  "lp": [495.3, 578.7],
  "d": "M471,548L473,553L476,556L481,556L485,558L485,562L487,564L491,564L496,561L499,561L502,562L504,568L510,570L515,573L523,574L526,573L529,581L520,586L515,592L510,591L507,593L505,592L503,593L501,596L497,598L494,602L490,608L485,607L472,610L464,597L464,592L465,589L464,586L464,583L464,581L461,576L460,572L458,572L455,573L454,571L448,572L442,571L438,572L435,569L432,559L433,554L437,546L439,552L449,555L456,553L457,552L459,551L468,550L471,548Z"
}, {
  "id": "626854",
  "n": "Velinga",
  "t": "ponda",
  "src": "LGD",
  "lp": [448.9, 584.4],
  "d": "M464,597L461,593L444,592L442,593L441,595L439,596L431,597L431,590L439,576L438,572L442,571L448,572L454,571L455,573L458,572L460,572L461,576L464,581L463,583L464,586L465,589L464,592L464,597Z"
}, {
  "id": "626869",
  "n": "Bandora",
  "t": "ponda",
  "town": true,
  "src": "LGD",
  "lp": [461.8, 615.2],
  "d": "M541,601L528,613L524,613L520,610L520,608L516,607L514,605L512,608L509,606L508,609L506,608L504,608L502,608L501,617L496,621L494,626L493,626L492,628L490,628L488,625L485,625L481,628L479,631L475,631L472,632L470,636L468,636L465,640L463,641L451,642L444,641L438,637L435,633L433,632L430,634L430,636L426,645L421,648L416,634L414,629L419,625L423,618L421,614L422,612L429,613L437,608L438,606L434,604L433,598L431,597L440,596L442,592L461,593L472,610L485,607L490,608L494,602L497,598L501,596L503,593L505,592L507,593L510,591L515,592L517,591L519,588L527,582L527,587L531,589L534,593L534,597L536,599L541,601Z"
}, {
  "id": "626853",
  "n": "Candepar",
  "t": "ponda",
  "src": "LGD",
  "lp": [551.4, 592.9],
  "d": "M542,552L543,557L544,560L545,561L547,559L549,559L554,565L562,569L563,570L564,573L561,577L562,579L563,580L568,576L571,577L572,579L571,585L568,586L570,592L566,597L564,600L566,603L569,604L568,609L569,612L572,612L574,613L575,621L566,631L561,633L560,635L554,631L553,627L550,625L549,620L545,610L546,607L545,605L542,602L535,598L534,593L531,589L527,587L527,582L529,581L522,565L522,559L531,558L534,555L542,552Z"
}, {
  "id": "626850",
  "n": "Querim",
  "t": "ponda",
  "src": "LGD",
  "lp": [491.5, 531.3],
  "d": "M481,507L487,512L490,513L493,516L502,521L507,528L510,528L511,531L514,532L517,535L523,545L523,558L522,563L523,567L526,573L523,574L515,573L510,570L504,568L502,562L499,561L496,561L491,564L487,564L485,562L485,558L481,556L476,556L472,552L471,548L476,542L474,538L470,535L469,534L472,528L476,526L479,520L475,516L467,511L463,506L462,499L465,489L469,490L472,493L474,496L474,497L475,499L474,504L477,506L481,507Z"
}, {
  "id": "626846",
  "n": "Savoi-Verem",
  "t": "ponda",
  "src": "LGD",
  "lp": [503.3, 503.6],
  "d": "M493,474L499,477L496,481L496,483L503,493L506,496L508,495L510,494L513,494L512,492L514,486L514,484L516,480L522,486L524,490L525,500L525,503L526,505L529,507L537,508L538,509L538,511L536,512L531,515L530,516L531,519L531,522L533,525L532,529L526,532L518,534L517,535L514,532L511,531L510,528L507,528L502,521L493,516L490,513L487,512L481,507L482,505L480,497L485,487L482,481L483,478L490,471L493,474Z"
}, {
  "id": "626851",
  "n": "Vagurbem",
  "t": "ponda",
  "src": "LGD",
  "lp": [530.5, 537.5],
  "d": "M542,526L543,529L543,540L546,544L550,546L553,551L552,554L550,555L543,551L534,555L531,558L526,558L523,558L523,545L517,535L518,534L526,532L533,528L533,525L531,522L531,519L534,522L542,526Z"
}, {
  "id": "626760",
  "n": "Cotombi",
  "t": "bicholim",
  "src": "LGD",
  "lp": [541.5, 507.3],
  "d": "M542,526L533,521L530,516L531,515L537,512L538,509L537,508L528,507L526,506L525,504L525,500L524,494L527,493L532,488L534,489L535,488L541,493L543,495L544,500L550,506L553,513L553,521L550,523L547,523L542,526Z"
}, {
  "id": "626761",
  "n": "Surla",
  "t": "bicholim",
  "src": "LGD",
  "lp": [560, 498.2],
  "d": "M525,434L527,437L532,437L536,438L545,438L555,435L557,438L561,448L569,456L568,471L565,475L562,477L564,481L567,483L577,493L577,497L576,500L567,506L564,510L564,512L559,516L557,521L558,529L556,534L554,536L555,539L557,547L560,550L559,553L561,556L560,559L554,553L550,546L546,544L543,540L543,529L542,526L547,523L549,523L553,521L553,515L552,510L548,503L544,500L543,495L541,493L535,488L534,489L532,488L527,493L524,494L523,487L521,484L516,480L511,478L511,476L513,472L524,457L522,455L523,453L523,448L521,444L521,441L521,439L521,437L525,434Z"
}, {
  "id": "626845",
  "n": "Volvoi",
  "t": "ponda",
  "src": "LGD",
  "lp": [505.8, 487],
  "d": "M499,477L516,480L514,484L514,486L512,492L513,494L511,494L508,495L506,496L499,488L495,482L499,477Z"
}, {
  "id": "626844",
  "n": "Betqui",
  "t": "ponda",
  "src": "LGD",
  "lp": [471.7, 474.5],
  "d": "M463,441L474,446L485,454L487,460L490,471L483,478L482,481L485,487L480,497L482,505L481,507L475,505L475,500L474,497L474,496L470,491L468,489L465,489L463,488L457,484L458,466L460,464L464,464L462,460L461,456L460,455L461,452L461,448L463,446L461,444L463,441Z"
}, {
  "id": "626847",
  "n": "Adcolna",
  "t": "ponda",
  "src": "LGD",
  "lp": [443.1, 492.9],
  "d": "M457,484L463,488L465,489L462,499L463,506L455,508L448,508L438,505L433,502L430,497L428,497L425,499L423,498L423,489L421,481L429,485L432,483L435,484L440,484L442,486L451,487L456,487L457,484Z"
}, {
  "id": "626849",
  "n": "Cuncoliem",
  "t": "ponda",
  "src": "LGD",
  "lp": [459.9, 532.5],
  "d": "M471,548L468,550L459,551L457,552L456,553L449,555L439,552L437,546L443,540L448,538L451,535L449,532L449,524L451,520L456,515L463,513L466,510L475,516L479,520L476,526L472,528L469,534L470,535L474,538L476,542L471,548Z"
}, {
  "id": "626855",
  "n": "Cundaim",
  "t": "ponda",
  "src": "LGD",
  "lp": [428.7, 539.1],
  "d": "M463,506L466,510L463,513L456,515L451,520L449,524L449,532L451,535L448,538L443,540L437,546L433,554L433,561L435,569L439,574L439,576L436,581L434,583L432,583L430,581L423,581L419,579L413,581L410,581L404,573L409,570L410,565L407,556L408,547L410,542L413,538L423,535L426,532L426,531L426,526L425,523L419,517L417,513L416,510L417,504L423,498L425,499L428,497L430,497L433,502L440,506L448,508L455,508L463,506Z"
}, {
  "id": "626729",
  "n": "Corlim",
  "t": "tiswadi",
  "town": true,
  "src": "LGD",
  "lp": [405.3, 486.3],
  "d": "M421,477L423,489L422,498L417,504L416,511L414,511L411,510L408,506L405,506L401,502L395,500L393,501L390,499L390,494L391,491L390,489L389,487L388,485L387,486L387,484L384,481L380,481L381,477L385,470L394,466L404,461L409,469L417,473L421,477Z"
}, {
  "id": "626728",
  "n": "Cumbarjua",
  "t": "tiswadi",
  "town": true,
  "src": "LGD",
  "lp": [414.3, 459.1],
  "d": "M421,477L417,473L411,470L408,468L404,461L406,456L406,453L405,452L401,451L400,450L400,448L402,447L411,442L414,448L414,452L421,459L427,460L429,462L433,470L433,472L429,472L421,477Z"
}, {
  "id": "626843",
  "n": "Tivrem",
  "t": "ponda",
  "src": "LGD",
  "lp": [439.4, 461],
  "d": "M458,466L456,487L449,487L445,486L442,486L440,484L435,484L432,483L429,485L421,481L421,477L429,472L433,472L433,470L429,462L427,460L421,459L414,452L414,449L414,447L406,438L406,437L408,436L412,436L417,434L424,440L427,446L430,446L435,455L440,457L454,462L458,466Z"
}, {
  "id": "626865",
  "n": "Candola",
  "t": "ponda",
  "town": true,
  "src": "LGD",
  "lp": [438.4, 438.5],
  "d": "M437,416L441,423L446,435L451,437L463,441L461,444L463,446L461,448L461,452L460,455L461,456L462,460L464,464L460,464L458,466L454,462L440,457L435,455L430,446L427,446L424,440L417,434L420,432L423,426L426,420L427,416L433,412L437,416Z"
}, {
  "id": "626727",
  "n": "Jua",
  "t": "tiswadi",
  "town": true,
  "src": "LGD",
  "lp": [404, 423.5],
  "d": "M433,412L426,417L426,420L423,426L420,432L412,436L408,436L406,437L406,438L411,442L401,448L400,449L400,451L391,445L389,442L379,438L383,435L387,433L389,430L387,426L382,421L382,419L391,414L400,408L410,399L416,397L418,398L424,403L433,412Z"
}, {
  "id": "626756",
  "n": "Piligao",
  "t": "bicholim",
  "src": "LGD",
  "lp": [426.5, 390.6],
  "d": "M431,366L440,372L441,373L444,375L447,381L449,382L448,384L446,387L450,392L449,397L444,399L441,402L439,407L439,411L437,416L433,412L423,401L416,397L411,398L409,395L405,393L404,389L405,385L402,380L402,375L404,369L411,367L415,370L416,370L431,366Z"
}, {
  "id": "626758",
  "n": "Amone",
  "t": "bicholim",
  "src": "LGD",
  "lp": [462.7, 419.7],
  "d": "M478,413L479,415L480,416L484,416L487,419L485,421L485,425L483,425L482,430L470,444L458,440L446,435L441,423L437,416L439,411L439,407L441,402L444,399L449,397L449,402L451,406L453,408L455,408L459,402L461,401L467,404L471,411L476,413L478,413Z"
}, {
  "id": "924826",
  "n": "Virdi",
  "t": "bicholim",
  "src": "LGD",
  "lp": [467.6, 397.1],
  "d": "M483,385L490,390L490,395L482,399L486,403L486,406L485,408L481,410L478,413L476,413L471,411L467,405L463,402L460,402L454,408L451,406L449,402L449,400L450,394L452,392L457,393L462,391L464,394L467,396L477,394L478,393L478,381L481,381L483,385Z"
}, {
  "id": "626759",
  "n": "Navelim",
  "t": "bicholim",
  "src": "LGD",
  "lp": [501.5, 450.4],
  "d": "M525,434L521,437L521,439L521,441L521,444L523,448L523,453L522,455L524,457L513,472L511,476L511,478L499,477L493,475L490,471L487,460L485,454L474,446L470,444L483,430L483,425L485,425L485,421L487,419L493,422L493,426L494,427L497,425L498,421L511,421L513,423L517,425L520,425L522,428L526,430L525,434Z"
}, {
  "id": "917385",
  "n": "Arvalem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [545.4, 380.7],
  "d": "M568,363L574,370L572,377L564,387L561,389L557,394L556,396L556,400L551,407L548,406L545,402L544,402L541,400L540,400L539,397L537,398L530,394L531,397L530,398L525,394L522,393L520,391L517,390L520,384L524,373L527,372L530,369L534,371L540,371L546,367L552,364L556,361L568,363Z"
}, {
  "id": "803245",
  "n": "Sanquelim",
  "t": "bicholim",
  "src": "SOI",
  "lp": [503.9, 386.3],
  "d": "M524,373L520,384L517,390L520,391L523,395L520,396L516,400L514,404L512,404L508,402L507,399L505,398L503,396L498,393L494,394L492,393L491,393L490,390L488,388L490,381L492,375L493,374L496,376L500,378L499,374L502,373L503,372L502,369L507,368L512,371L516,370L520,373L523,373L524,373Z"
}, {
  "id": "626757",
  "n": "Cudnem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [514.3, 415.6],
  "d": "M522,393L525,394L530,398L531,397L530,394L537,398L539,397L540,400L541,400L544,402L545,402L548,406L550,406L550,409L552,412L550,412L552,413L550,415L550,418L547,426L550,432L555,435L553,436L550,436L546,438L536,438L532,437L527,437L525,434L526,431L522,428L520,425L517,425L514,423L510,420L498,421L496,426L494,427L493,426L493,422L491,421L490,420L484,416L481,416L479,415L478,413L479,411L485,408L486,406L486,403L482,399L490,395L490,393L492,393L494,394L498,393L503,396L505,398L507,399L508,402L513,404L514,404L516,400L520,396L523,395L522,393Z"
}, {
  "id": "626765",
  "n": "Podocem",
  "t": "sattari",
  "src": "LGD",
  "lp": [500.7, 348.4],
  "d": "M502,369L499,367L496,368L494,367L487,360L486,351L487,345L484,342L487,343L492,339L496,334L500,332L503,338L510,344L514,346L519,355L519,357L516,362L514,363L509,363L503,367L502,369Z"
}, {
  "id": "626766",
  "n": "Poriem",
  "t": "sattari",
  "src": "LGD",
  "lp": [526.4, 336.6],
  "d": "M531,303L532,306L533,308L550,323L550,324L548,326L547,332L550,335L554,344L555,349L559,359L552,364L543,368L540,371L534,371L530,369L526,373L520,373L516,370L512,371L507,368L502,369L503,367L509,363L514,363L516,362L519,357L519,355L514,346L510,344L503,338L500,332L505,330L511,331L515,330L516,325L521,317L522,313L523,308L521,307L527,302L528,301L531,303Z"
}, {
  "id": "626750",
  "n": "Curchirem",
  "t": "sattari",
  "src": "LGD",
  "lp": [492.1, 320.4],
  "d": "M495,299L504,300L521,307L523,308L521,317L518,322L515,326L515,330L514,331L511,331L504,330L496,334L492,339L487,343L476,341L475,344L472,330L469,328L465,319L467,318L466,314L467,313L476,313L476,309L478,305L477,302L476,297L480,299L495,299Z"
}, {
  "id": "626763",
  "n": "Carapur",
  "t": "bicholim",
  "town": true,
  "src": "LGD",
  "lp": [470.5, 368.5],
  "d": "M484,342L487,345L486,351L487,360L494,367L496,368L499,367L502,369L503,373L499,374L500,377L496,376L495,374L493,374L490,381L488,388L483,385L481,381L478,381L478,393L476,394L467,396L464,394L462,391L458,392L454,392L450,392L446,387L448,384L449,382L447,381L444,375L441,373L440,372L439,371L442,364L447,360L453,362L462,355L464,352L471,348L474,344L476,341L484,342Z"
}, {
  "id": "626751",
  "n": "Sarvona",
  "t": "bicholim",
  "src": "LGD",
  "lp": [451.2, 345.4],
  "d": "M465,319L469,328L472,330L474,344L469,349L464,352L462,355L454,361L447,360L443,362L440,367L439,371L431,366L432,357L429,355L430,347L426,339L426,336L427,335L426,332L432,329L433,330L434,333L437,334L439,331L438,327L441,326L446,325L448,321L450,323L454,321L455,318L457,320L460,322L463,319L465,319Z"
}, {
  "id": "803244",
  "n": "Bicholim",
  "t": "bicholim",
  "src": "SOI",
  "lp": [409.6, 332.7],
  "d": "M445,325L441,326L438,327L439,331L437,334L434,333L433,330L432,329L426,332L427,335L426,336L426,339L430,347L429,355L430,358L431,366L418,370L415,370L411,367L410,363L410,359L412,354L411,352L409,349L403,345L399,342L395,342L395,339L393,336L394,326L393,324L387,316L379,311L381,306L387,303L389,301L389,300L394,298L395,296L398,299L399,312L408,316L416,324L429,322L442,318L445,325Z"
}, {
  "id": "924814",
  "n": "Bordem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [417.7, 307.6],
  "d": "M406,290L406,292L408,295L417,301L433,305L440,310L444,311L447,313L447,316L449,319L449,321L445,325L442,318L429,322L416,324L408,316L401,314L399,312L398,299L395,296L403,288L406,290Z"
}, {
  "id": "626685",
  "n": "Calvim",
  "t": "bardez",
  "src": "LGD",
  "lp": [331.2, 370.2],
  "d": "M343,369L347,372L344,377L342,376L338,371L336,371L334,375L336,379L336,381L334,386L331,386L325,382L328,378L327,376L324,374L320,373L317,368L317,360L321,358L322,359L325,359L326,361L327,362L329,360L332,360L334,356L340,356L341,358L340,360L342,368L343,369Z"
}, {
  "id": "626753",
  "n": "Vainguinim",
  "t": "bicholim",
  "src": "LGD",
  "lp": [353.7, 369.3],
  "d": "M347,376L345,375L347,372L345,370L347,368L354,364L357,363L362,368L361,372L361,374L347,376Z"
}, {
  "id": "626754",
  "n": "Aturli",
  "t": "bicholim",
  "src": "LGD",
  "lp": [371.2, 379.7],
  "d": "M381,376L377,385L368,384L368,386L361,386L359,383L367,376L374,375L381,376Z"
}, {
  "id": "626752",
  "n": "Maem",
  "t": "bicholim",
  "src": "LGD",
  "lp": [362.5, 347.1],
  "d": "M387,329L395,339L395,342L399,342L403,345L409,349L411,352L412,354L410,360L411,367L404,369L403,372L399,376L394,376L391,371L381,376L374,375L367,376L359,383L354,386L348,386L344,383L347,380L347,376L361,374L361,372L362,368L357,364L355,364L347,368L345,370L343,369L342,368L340,360L341,358L340,356L334,356L332,360L330,361L327,362L326,361L325,359L321,359L321,356L319,352L319,346L321,343L321,340L322,336L324,334L329,332L331,328L333,323L333,319L331,318L329,318L325,315L326,311L325,310L329,310L340,316L352,321L355,317L355,306L367,313L374,316L382,327L387,329Z"
}, {
  "id": "626755",
  "n": "Naroa",
  "t": "bicholim",
  "src": "LGD",
  "lp": [381.6, 394.8],
  "d": "M403,372L402,379L405,385L404,389L405,392L409,394L411,398L400,408L391,414L383,418L380,418L375,413L370,411L366,405L356,399L354,395L350,392L348,390L348,386L354,386L359,382L361,386L368,386L368,384L377,385L381,376L391,371L394,376L398,376L399,375L403,372Z"
}, {
  "id": "626711",
  "n": "Malar",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [367.9, 428.1],
  "d": "M382,418L382,421L387,426L389,430L388,432L387,433L383,435L376,442L372,447L370,452L369,454L364,454L361,453L359,457L358,455L355,454L355,452L353,451L353,448L354,445L354,443L353,438L349,433L348,430L348,427L350,426L348,423L349,416L348,414L363,402L366,405L370,411L375,413L379,417L382,418Z"
}, {
  "id": "626710",
  "n": "Goltim",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [345.6, 441.1],
  "d": "M369,454L359,463L351,466L348,466L342,468L340,465L336,463L337,457L341,454L337,439L341,437L342,434L342,432L340,431L340,425L342,420L340,418L344,416L348,414L348,423L350,426L348,427L348,430L349,433L353,438L354,443L354,445L353,448L353,451L355,452L355,454L358,455L359,457L361,453L364,454L369,454Z"
}, {
  "id": "626708",
  "n": "Capao",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [342.9, 412.4],
  "d": "M357,399L363,402L344,416L336,420L337,416L336,409L338,406L343,403L350,403L354,400L357,399Z"
}, {
  "id": "626707",
  "n": "Caraim",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [318.5, 418.3],
  "d": "M345,375L347,376L347,379L347,381L344,383L348,385L349,391L354,395L355,398L357,399L354,400L350,403L342,404L337,408L336,410L337,416L336,420L328,426L324,430L319,439L318,442L304,455L296,461L292,462L285,461L272,463L264,465L259,468L254,469L257,465L255,459L255,455L264,441L269,438L282,436L290,432L297,430L301,427L302,424L302,420L300,417L293,411L291,406L292,399L294,393L294,390L291,382L292,378L293,376L298,374L303,373L308,371L314,369L317,366L317,368L320,373L324,374L327,376L328,378L325,382L332,386L334,386L336,381L336,379L334,375L335,372L338,371L343,377L345,375Z"
}, {
  "id": "626709",
  "n": "Navelim",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [325.5, 448],
  "d": "M342,468L330,471L308,471L305,471L300,468L296,468L285,461L292,462L296,461L304,455L318,442L319,439L324,430L328,426L340,418L342,420L340,425L340,431L342,432L342,434L341,437L337,439L341,454L337,457L336,462L336,463L340,465L342,468Z"
}, {
  "id": "626701",
  "n": "Penha-De-Franca",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [243.8, 451.6],
  "d": "M264,441L255,455L255,459L257,465L254,469L252,471L243,473L233,470L230,470L229,464L231,457L229,448L229,441L229,434L227,428L226,427L234,428L242,432L244,431L248,432L250,434L252,433L255,437L258,439L261,439L264,441Z"
}, {
  "id": "626702",
  "n": "Salvador-Do-Mundo",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [265.8, 413.6],
  "d": "M294,389L294,393L292,398L291,403L292,409L295,413L301,418L303,422L301,427L297,430L290,432L282,436L269,438L264,441L261,439L258,439L255,437L252,433L250,434L248,432L245,431L242,432L234,428L226,427L221,423L235,414L238,411L252,404L250,402L250,400L256,398L262,394L271,393L272,396L278,399L281,396L279,393L280,390L282,388L285,387L289,388L294,389Z"
}, {
  "id": "626681",
  "n": "Ucassaim",
  "t": "bardez",
  "src": "LGD",
  "lp": [246.2, 345.5],
  "d": "M262,329L264,334L259,346L259,353L251,364L241,359L237,356L233,352L230,350L234,345L234,341L234,339L236,336L238,337L240,333L238,329L240,327L245,331L245,333L242,337L243,339L245,339L252,335L255,329L259,328L262,329Z"
}, {
  "id": "626687",
  "n": "Pomburpa",
  "t": "bardez",
  "src": "LGD",
  "lp": [280.7, 374.9],
  "d": "M273,355L279,356L276,359L283,367L287,368L295,366L298,371L299,374L294,375L292,378L291,382L294,389L290,389L285,387L282,388L280,390L279,393L281,396L278,399L272,396L271,393L270,391L271,390L269,385L267,385L266,383L268,377L266,375L260,375L259,371L260,367L258,365L254,366L251,364L257,356L263,351L269,352L273,355Z"
}, {
  "id": "626686",
  "n": "Olaulim",
  "t": "bardez",
  "src": "LGD",
  "lp": [292.2, 364],
  "d": "M306,372L303,373L299,374L298,371L295,366L287,368L283,367L276,359L279,356L282,354L286,354L288,356L297,357L298,359L297,360L302,362L306,366L305,367L306,372Z"
}, {
  "id": "626704",
  "n": "Aldona",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [292.3, 331.8],
  "d": "M313,295L312,302L313,312L312,317L310,321L305,322L304,324L305,329L302,338L303,342L308,346L310,350L309,355L310,358L311,359L317,360L318,362L315,368L308,371L306,372L305,367L306,366L302,362L297,361L298,359L297,357L288,356L285,354L281,354L279,356L273,355L275,353L279,347L281,340L283,337L283,334L279,329L279,328L280,326L276,323L277,321L281,316L286,319L289,318L290,316L292,310L290,306L291,303L302,295L311,294L313,295Z"
}, {
  "id": "626683",
  "n": "Corjuem",
  "t": "bardez",
  "src": "LGD",
  "lp": [317.8, 327.3],
  "d": "M319,295L320,299L317,301L319,305L322,306L324,308L326,311L325,315L329,318L331,318L333,320L332,326L330,331L327,333L324,334L322,336L321,340L321,343L319,346L319,352L321,356L321,358L317,360L316,359L311,359L310,358L309,355L310,350L308,346L303,342L302,338L305,329L304,324L305,322L310,321L312,317L313,312L312,302L313,296L316,295L319,295Z"
}, {
  "id": "626692",
  "n": "Moira",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [256.4, 321.2],
  "d": "M248,306L254,311L259,313L270,315L281,316L276,323L280,326L279,328L279,329L277,327L273,327L269,324L262,329L259,328L255,329L251,336L248,337L246,339L243,339L242,337L245,333L245,331L240,327L238,328L234,325L236,320L234,313L238,306L248,306Z"
}, {
  "id": "626682",
  "n": "Nachinola",
  "t": "bardez",
  "src": "LGD",
  "lp": [270.2, 342.8],
  "d": "M277,327L283,334L283,337L281,340L279,347L275,353L273,355L269,352L264,351L258,355L259,347L264,334L262,329L269,324L273,327L277,327Z"
}, {
  "id": "803242",
  "n": "Mapusa",
  "t": "bardez",
  "src": "SOI",
  "lp": [212.9, 315.1],
  "d": "M226,294L229,295L232,298L235,300L241,303L242,306L238,306L234,312L234,315L236,320L234,325L228,330L227,332L223,335L216,336L215,340L211,341L211,344L209,349L206,349L206,350L202,349L201,346L198,345L191,347L193,342L192,332L185,331L184,326L186,320L189,316L191,316L192,298L193,294L202,295L204,286L208,280L214,284L217,287L222,294L223,295L226,294Z"
}, {
  "id": "626679",
  "n": "Paliem",
  "t": "bardez",
  "src": "LGD",
  "lp": [224.7, 360.2],
  "d": "M241,359L225,367L223,367L220,368L219,371L215,372L213,362L211,362L211,359L213,358L215,357L218,357L222,353L227,352L230,350L233,352L237,356L241,359Z"
}, {
  "id": "626693",
  "n": "Guirim",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [203, 352.4],
  "d": "M239,328L238,329L240,333L238,337L236,336L234,339L234,341L234,344L234,346L232,347L232,349L227,352L222,353L218,357L215,357L211,359L211,362L213,362L215,372L214,378L212,379L207,380L198,379L196,378L193,379L190,381L188,379L183,381L182,379L182,371L184,365L184,361L183,358L180,357L181,354L181,348L183,343L185,340L185,335L185,331L192,332L193,342L191,347L198,345L201,346L202,348L205,350L206,349L209,349L211,344L211,341L215,340L216,336L223,335L227,332L228,330L234,325L239,328Z"
}, {
  "id": "626675",
  "n": "Parra",
  "t": "bardez",
  "src": "LGD",
  "lp": [165.7, 359.2],
  "d": "M180,356L183,358L184,361L184,365L182,371L182,379L177,380L171,380L171,378L168,378L162,376L155,378L152,378L149,381L147,381L145,373L150,367L150,364L147,357L148,348L145,345L148,340L157,344L164,349L177,357L180,356Z"
}, {
  "id": "626676",
  "n": "Verla",
  "t": "bardez",
  "src": "LGD",
  "lp": [167.7, 341.5],
  "d": "M184,327L185,331L185,335L185,340L183,343L181,348L181,354L178,357L164,349L157,344L148,340L149,339L148,336L155,332L159,328L161,328L162,327L168,326L177,328L184,327Z"
}, {
  "id": "626672",
  "n": "Assagao",
  "t": "bardez",
  "src": "LGD",
  "lp": [157.9, 314.6],
  "d": "M142,294L141,296L152,304L156,305L161,306L166,305L169,304L170,303L173,302L184,302L188,303L191,305L191,316L189,316L186,320L184,327L177,328L168,326L162,327L161,328L159,328L155,332L148,336L149,339L148,340L144,334L141,332L138,332L138,330L135,327L124,314L115,311L112,309L106,309L100,305L96,297L110,295L120,292L122,293L124,292L125,289L127,288L135,290L142,294Z"
}, {
  "id": "626694",
  "n": "Anjuna",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [118.2, 341.9],
  "d": "M103,307L106,309L112,309L115,311L124,314L135,327L138,330L138,332L141,332L144,334L148,340L145,345L140,344L130,346L128,348L127,354L125,357L112,364L111,367L111,375L105,379L103,379L98,374L97,368L98,366L97,364L94,356L93,349L91,348L88,337L85,336L84,333L87,328L86,325L84,323L85,321L83,320L87,315L85,309L83,307L84,305L85,304L94,304L94,306L98,307L101,308L103,307Z"
}, {
  "id": "626673",
  "n": "Arpora",
  "t": "bardez",
  "src": "LGD",
  "lp": [135.5, 365.4],
  "d": "M145,345L148,348L147,357L150,364L150,367L145,373L147,381L145,382L144,380L141,380L140,385L138,385L139,383L134,384L127,383L127,380L124,375L124,371L122,371L121,363L120,360L125,357L127,354L128,348L130,346L140,344L145,345Z"
}, {
  "id": "626695",
  "n": "Calangute",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [139.2, 406.3],
  "d": "M140,385L142,388L142,389L147,389L149,391L154,393L156,392L155,394L157,395L156,396L157,398L159,398L159,400L158,411L157,412L157,414L158,419L162,423L162,425L165,431L164,435L165,435L168,432L170,432L171,437L169,442L166,441L163,442L160,450L158,452L155,451L153,440L151,434L149,434L140,429L132,429L126,430L120,410L119,403L115,393L113,385L110,378L111,376L111,365L113,363L120,360L121,363L122,371L124,371L124,375L127,379L127,383L134,384L139,383L138,385L140,385Z"
}, {
  "id": "n17",
  "n": "Kandoli",
  "t": "bardez",
  "src": "SOI",
  "lp": [144.8, 462.5],
  "d": "M158,452L152,473L145,474L144,475L144,477L150,478L148,480L149,481L155,480L154,483L159,482L160,485L156,484L153,486L150,491L148,490L148,489L141,488L139,485L138,484L136,485L134,480L135,479L137,479L138,475L126,430L132,429L140,429L149,434L151,434L153,440L155,451L158,452Z"
}, {
  "id": "626698",
  "n": "Nerul",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [192.7, 461.7],
  "d": "M166,441L174,443L174,445L172,448L172,451L174,457L176,459L180,460L185,455L188,454L191,452L197,453L198,456L200,457L203,452L205,453L207,451L210,450L215,446L218,442L223,441L226,442L229,441L230,444L230,447L231,457L229,464L230,470L229,469L224,468L219,464L217,463L214,463L208,468L205,477L202,479L203,482L198,481L194,483L190,482L182,477L178,477L175,475L170,475L164,480L155,476L154,476L152,474L152,471L154,468L158,452L160,450L163,442L166,441Z"
}, {
  "id": "626689",
  "n": "Marra",
  "t": "bardez",
  "src": "LGD",
  "lp": [180.7, 440.4],
  "d": "M203,452L200,457L198,456L197,454L192,451L185,455L180,460L175,458L172,451L172,448L174,445L174,443L169,442L171,437L170,432L171,429L175,424L177,424L180,421L182,423L186,423L187,428L186,434L186,435L191,439L200,451L203,452Z"
}, {
  "id": "626696",
  "n": "Saligao",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [174.2, 407.3],
  "d": "M183,381L183,386L185,399L187,404L193,411L185,416L177,424L175,424L171,429L170,432L168,432L165,435L164,435L165,431L162,425L162,423L158,420L158,418L158,412L158,411L159,400L159,398L157,398L156,396L157,395L155,394L156,393L155,390L158,389L169,387L170,380L177,380L182,379L183,381Z"
}, {
  "id": "626674",
  "n": "Nagoa",
  "t": "bardez",
  "src": "LGD",
  "lp": [154.7, 383.3],
  "d": "M171,380L169,387L156,389L154,393L149,391L147,389L142,389L142,388L140,385L141,380L144,380L145,382L149,381L152,378L155,378L163,376L168,378L171,378L171,380Z"
}, {
  "id": "626688",
  "n": "Sangolda",
  "t": "bardez",
  "src": "LGD",
  "lp": [195.9, 396.6],
  "d": "M198,379L200,385L202,388L203,391L205,392L205,394L206,395L208,398L208,402L211,403L215,407L213,413L205,411L194,411L187,404L184,395L183,382L185,380L187,379L190,381L193,379L196,378L198,379Z"
}, {
  "id": "626703",
  "n": "Socorro",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [236.8, 391.4],
  "d": "M241,359L254,366L258,365L260,367L259,371L260,375L266,375L267,377L266,383L267,385L269,385L271,389L270,391L271,393L262,394L256,398L250,400L250,402L252,404L238,411L235,414L221,423L213,413L214,412L216,408L211,403L208,402L208,398L206,395L205,394L205,392L203,391L202,388L200,385L198,379L207,380L212,379L215,378L215,372L219,371L220,368L223,367L225,367L241,359Z"
}, {
  "id": "626700",
  "n": "Pilerne",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [207.2, 431],
  "d": "M213,413L220,422L227,428L229,434L229,441L220,441L217,442L215,446L212,448L204,453L200,451L191,439L186,435L186,434L187,428L186,424L182,423L180,421L187,415L193,411L205,411L213,413Z"
}, {
  "id": "626697",
  "n": "Candolim",
  "t": "bardez",
  "town": true,
  "src": "LGD",
  "lp": [175.8, 488.4],
  "d": "M230,470L224,470L215,466L212,469L212,474L207,485L187,496L168,508L159,512L150,491L153,486L156,486L159,485L160,483L154,483L156,481L149,481L148,480L150,479L144,477L144,475L145,474L152,473L154,476L155,476L164,480L170,475L175,475L178,477L182,477L189,482L194,483L198,481L202,482L202,479L205,477L208,468L214,463L217,463L219,464L224,468L229,469L230,470Z"
}, {
  "id": "803243",
  "n": "Panaji",
  "t": "tiswadi",
  "src": "SOI",
  "lp": [185.4, 509.7],
  "d": "M270,472L268,472L250,476L250,480L248,482L246,483L247,485L241,487L242,489L242,491L243,493L242,494L242,497L236,496L237,499L234,500L235,503L233,503L230,504L228,505L227,507L225,507L220,501L219,500L218,496L216,496L215,499L215,502L214,504L212,504L207,506L207,512L210,513L209,516L211,516L211,517L211,521L212,522L212,523L210,523L207,522L204,521L203,524L201,528L198,530L202,530L202,532L196,534L196,539L197,548L194,548L192,551L193,552L193,554L188,552L189,550L184,547L179,541L176,540L174,537L170,536L169,538L168,536L168,534L168,532L171,531L159,512L168,508L187,496L207,485L212,474L212,469L215,466L216,466L224,470L233,470L243,473L252,471L254,469L261,467L264,465L271,464L271,468L270,472Z"
}, {
  "id": "n18",
  "n": "Talgaon",
  "t": "tiswadi",
  "src": "SOI",
  "lp": [229, 515.4],
  "d": "M229,511L230,514L233,513L231,515L232,516L232,518L230,519L226,517L227,513L227,511L229,511Z"
}, {
  "id": "645598",
  "n": "Taleigao",
  "t": "tiswadi",
  "src": "LGD",
  "lp": [216.4, 523.5],
  "d": "M218,499L220,501L225,507L227,507L227,508L229,510L229,511L227,511L227,513L226,517L231,520L229,531L235,532L236,533L237,535L236,543L237,546L236,551L233,549L230,550L228,550L226,549L222,549L221,550L218,548L217,549L214,551L212,551L210,550L209,547L207,545L204,546L200,548L197,548L196,536L196,534L202,532L202,530L198,530L201,528L202,523L204,521L207,522L210,523L212,523L212,522L211,521L211,517L211,516L209,516L210,513L207,512L207,506L212,505L214,504L215,502L214,500L216,496L218,496L218,499Z"
}, {
  "id": "803248",
  "n": "Mormugao",
  "t": "mormugao",
  "src": "SOI",
  "lp": [204.5, 639.1],
  "d": "M230,627L233,631L233,635L235,635L241,647L237,653L237,655L231,661L230,671L222,678L220,677L219,675L212,675L210,672L207,670L205,669L201,670L198,667L199,664L201,664L201,660L203,659L201,660L201,663L199,663L199,656L197,648L196,643L193,641L189,642L188,642L184,641L180,641L179,643L174,642L172,640L171,638L172,636L173,635L174,632L171,632L168,628L166,621L163,620L161,616L161,614L163,611L165,610L171,612L175,600L175,603L178,603L175,603L173,610L179,610L183,613L186,620L192,623L194,625L196,629L195,631L196,634L205,632L212,627L213,626L213,621L212,619L211,617L215,615L219,617L223,619L223,621L222,627L224,628L230,627Z"
}, {
  "id": "n19",
  "n": "Gonval",
  "t": "canacona",
  "src": "SOI",
  "lp": [398.8, 1111.1],
  "d": "M397,1076L399,1081L404,1088L411,1094L418,1110L422,1114L428,1122L421,1146L416,1146L411,1144L402,1145L400,1144L394,1139L388,1138L386,1135L386,1130L381,1129L378,1126L373,1125L365,1131L365,1129L363,1127L360,1128L358,1128L363,1127L365,1122L369,1120L372,1120L373,1118L375,1117L376,1112L380,1110L378,1102L378,1100L377,1096L373,1096L373,1092L366,1093L373,1091L374,1090L379,1090L382,1086L390,1083L393,1086L396,1077Z"
}, {
  "id": "626952",
  "n": "Naqueri",
  "t": "quepem",
  "src": "LGD",
  "lp": [432.6, 1091.8],
  "d": "M461,1106L448,1111L428,1122L422,1114L418,1110L411,1094L405,1089L397,1077L397,1076L400,1075L401,1076L401,1070L400,1065L401,1063L410,1062L412,1064L414,1065L416,1067L417,1063L420,1061L422,1061L427,1063L436,1060L441,1060L443,1061L445,1063L446,1067L452,1065L455,1063L457,1063L457,1068L453,1069L453,1071L453,1077L459,1085L456,1090L456,1095L457,1099L461,1106Z"
}, {
  "id": "626951",
  "n": "Quitol",
  "t": "quepem",
  "src": "LGD",
  "lp": [482.6, 1073.3],
  "d": "M501,1047L506,1050L505,1055L507,1059L505,1063L507,1066L510,1069L513,1075L517,1076L519,1076L522,1077L527,1077L529,1078L530,1076L532,1079L533,1084L537,1092L537,1094L530,1098L526,1098L521,1099L519,1101L515,1103L504,1105L497,1105L492,1107L488,1105L484,1107L480,1107L478,1109L476,1107L471,1108L467,1106L461,1106L457,1099L456,1091L459,1085L453,1077L453,1071L453,1069L457,1068L457,1063L455,1063L452,1065L446,1067L445,1063L443,1061L441,1060L436,1060L427,1063L422,1061L420,1061L417,1063L416,1067L414,1065L412,1064L410,1062L401,1063L400,1058L396,1057L396,1055L393,1053L394,1051L398,1052L403,1049L407,1043L406,1040L408,1040L409,1038L414,1039L424,1047L431,1044L432,1041L434,1041L435,1038L438,1038L441,1040L443,1039L445,1039L446,1037L450,1034L453,1034L461,1040L464,1048L469,1055L467,1060L467,1064L469,1067L477,1070L489,1061L491,1062L495,1061L494,1059L496,1057L497,1053L499,1053L499,1048L501,1047Z"
}, {
  "id": "626950",
  "n": "Fatorpa",
  "t": "quepem",
  "src": "LGD",
  "lp": [480.4, 1040.7],
  "d": "M492,1013L492,1016L495,1018L493,1020L498,1026L497,1027L499,1032L501,1032L502,1035L504,1036L501,1039L498,1042L501,1046L501,1047L499,1048L499,1053L497,1053L496,1057L494,1059L495,1061L491,1062L489,1061L478,1070L475,1070L469,1067L467,1064L467,1060L469,1056L464,1048L461,1040L453,1034L453,1032L454,1032L460,1030L461,1026L475,1018L491,1015L492,1013Z"
}, {
  "id": "626921",
  "n": "Velim",
  "t": "salcete",
  "src": "LGD",
  "lp": [443, 1021.3],
  "d": "M470,1022L461,1026L460,1030L454,1032L453,1031L453,1034L450,1034L446,1037L445,1039L443,1039L441,1040L438,1038L435,1038L434,1041L432,1041L431,1044L424,1046L421,1042L418,1034L418,1022L420,1013L417,1003L418,1000L420,999L425,999L429,998L433,998L438,997L443,998L450,997L455,998L456,1001L455,1003L456,1004L462,1007L467,1014L467,1021L470,1022Z"
}, {
  "id": "626920",
  "n": "Cavelossim",
  "t": "salcete",
  "src": "LGD",
  "lp": [416.3, 990.8],
  "d": "M404,951L404,952L407,956L409,962L413,965L421,966L425,969L427,970L431,966L434,969L436,973L435,976L432,981L430,987L428,990L432,991L442,992L438,997L433,998L429,998L425,999L421,999L418,1000L417,1002L417,1005L419,1009L420,1013L418,1022L418,1032L419,1039L414,1034L413,1032L401,982L397,969L397,966L396,964L391,945L401,943L401,945L403,946L402,949L404,951Z"
}, {
  "id": "626917",
  "n": "Carmona",
  "t": "salcete",
  "src": "LGD",
  "lp": [419.9, 946.8],
  "d": "M447,944L448,944L449,946L446,952L443,954L437,953L435,955L432,957L430,961L430,964L431,966L428,969L426,970L421,966L413,965L410,962L407,956L404,952L405,949L404,929L416,928L429,925L431,926L435,927L437,929L435,936L429,942L430,944L437,948L447,944Z"
}, {
  "id": "626933",
  "n": "Chinchinim",
  "t": "salcete",
  "town": true,
  "src": "LGD",
  "lp": [466.5, 945.2],
  "d": "M457,914L458,918L468,925L476,932L484,945L487,953L487,964L482,966L482,968L481,966L477,966L475,968L472,967L469,969L469,965L468,963L465,963L464,966L458,966L457,964L459,960L458,959L456,959L452,966L445,973L435,976L435,971L431,966L430,964L431,959L436,954L443,954L446,952L449,946L448,944L447,944L452,944L449,940L454,941L454,935L451,933L450,934L450,933L449,937L446,935L445,932L442,931L444,928L449,928L451,927L451,924L452,920L448,919L446,915L457,914Z"
}, {
  "id": "626919",
  "n": "Assolna",
  "t": "salcete",
  "src": "LGD",
  "lp": [460.2, 989.1],
  "d": "M487,964L488,979L492,988L493,994L492,1008L492,1013L491,1015L477,1018L470,1022L467,1021L467,1014L462,1007L456,1006L455,1003L456,1001L455,998L443,998L438,997L442,992L432,991L428,990L430,987L432,981L435,976L445,973L452,966L455,959L457,959L459,960L457,964L459,966L464,966L465,964L466,963L469,964L468,968L472,967L475,968L477,966L481,966L482,968L482,966L487,964Z"
}, {
  "id": "803250",
  "n": "Cuncolim",
  "t": "salcete",
  "src": "SOI",
  "lp": [518.1, 977.4],
  "d": "M505,944L510,949L514,950L515,952L516,953L516,956L519,957L522,957L523,959L526,958L527,957L527,959L529,960L532,958L541,957L543,957L543,963L544,965L543,969L547,976L552,982L549,985L538,986L525,990L527,1000L517,1002L518,1005L514,1010L510,1011L510,1014L504,1022L499,1021L499,1019L492,1015L493,994L492,988L488,979L486,952L484,945L481,940L486,938L488,936L490,936L490,933L492,933L495,934L495,937L494,939L492,940L491,943L493,943L494,942L500,943L500,945L502,945L504,946L505,944Z"
}, {
  "id": "n20",
  "n": "Talewada",
  "t": "salcete",
  "src": "SOI",
  "lp": [534.9, 939.5],
  "d": "M538,921L546,927L560,926L562,931L563,935L561,936L561,939L560,942L563,943L563,945L561,945L558,948L556,953L553,955L532,958L529,960L527,959L528,958L526,958L523,959L522,957L519,957L516,956L516,953L515,952L514,950L510,949L506,945L510,935L512,926L520,922L528,919L534,920L538,921Z"
}, {
  "id": "626947",
  "n": "Ambaulim",
  "t": "quepem",
  "src": "LGD",
  "lp": [564.4, 949.6],
  "d": "M574,920L570,931L573,932L573,935L572,937L570,941L570,943L569,945L572,951L575,953L578,960L579,960L579,965L585,973L585,976L578,981L576,981L575,979L569,977L562,980L559,980L558,982L556,981L552,982L547,976L543,969L544,965L543,963L543,957L553,955L556,953L558,948L561,945L563,945L563,943L561,943L561,940L561,936L563,935L560,926L560,923L557,920L558,918L562,920L568,922L574,920Z"
}, {
  "id": "626955",
  "n": "Bendordem",
  "t": "quepem",
  "src": "LGD",
  "lp": [558.4, 1053],
  "d": "M573,1045L574,1047L578,1048L581,1053L587,1058L589,1058L577,1068L569,1065L566,1060L564,1062L558,1063L548,1067L542,1067L540,1065L539,1059L534,1057L534,1055L536,1054L534,1053L533,1053L531,1051L529,1050L528,1049L529,1046L523,1046L525,1040L531,1041L534,1039L541,1039L544,1041L553,1042L566,1046L573,1045Z"
}, {
  "id": "626949",
  "n": "Bali",
  "t": "quepem",
  "src": "LGD",
  "lp": [511.4, 1043.4],
  "d": "M573,1045L566,1046L553,1042L544,1041L541,1039L534,1039L531,1041L525,1040L522,1045L529,1046L528,1049L529,1050L531,1051L533,1053L534,1053L536,1054L534,1055L534,1057L539,1059L540,1065L542,1067L548,1067L558,1063L564,1062L566,1060L569,1065L577,1068L576,1071L578,1073L579,1079L583,1086L582,1089L580,1098L577,1101L573,1100L570,1103L567,1105L559,1105L556,1103L540,1096L537,1094L537,1092L533,1084L532,1079L530,1076L529,1078L527,1077L522,1077L519,1076L517,1076L513,1075L510,1069L507,1066L505,1063L507,1059L505,1055L506,1050L503,1048L501,1047L501,1045L498,1042L501,1039L504,1036L502,1035L501,1032L499,1032L497,1027L498,1026L493,1020L495,1018L496,1017L499,1019L499,1021L504,1022L510,1014L510,1011L514,1010L518,1005L517,1002L527,1000L525,990L538,986L549,985L546,994L543,997L545,1001L544,1006L544,1008L546,1018L549,1022L555,1024L561,1031L571,1039L573,1045Z"
}, {
  "id": "626961",
  "n": "Barcem",
  "t": "quepem",
  "src": "LGD",
  "lp": [550.3, 1159.6],
  "d": "M585,1132L586,1137L588,1139L590,1137L596,1139L594,1140L592,1142L592,1146L594,1149L591,1151L592,1154L596,1156L594,1158L595,1160L579,1180L571,1186L569,1187L562,1183L552,1181L546,1179L539,1181L531,1179L526,1180L519,1178L513,1178L510,1169L505,1159L507,1157L511,1155L516,1148L517,1145L520,1148L522,1147L523,1148L524,1146L525,1147L527,1147L529,1148L526,1143L528,1142L531,1142L532,1137L537,1134L543,1135L546,1134L552,1134L555,1134L565,1135L570,1135L575,1136L576,1133L578,1134L585,1132Z"
}, {
  "id": "626960",
  "n": "Quedem",
  "t": "quepem",
  "src": "LGD",
  "lp": [515.2, 1123],
  "d": "M530,1098L531,1100L533,1101L533,1108L536,1113L537,1116L538,1118L536,1119L536,1122L535,1124L537,1128L535,1130L534,1136L532,1137L531,1142L528,1142L526,1143L529,1148L527,1147L525,1147L524,1146L523,1148L522,1147L520,1148L517,1145L516,1148L511,1147L509,1143L504,1140L502,1140L498,1133L497,1129L495,1128L494,1124L495,1120L495,1114L496,1109L499,1105L515,1103L519,1101L521,1099L526,1098L530,1098Z"
}, {
  "id": "627022",
  "n": "Cola",
  "t": "canacona",
  "src": "LGD",
  "lp": [465.7, 1144.8],
  "d": "M499,1105L497,1108L495,1113L495,1120L494,1124L495,1128L497,1129L498,1133L502,1140L504,1140L509,1143L511,1147L516,1148L511,1155L507,1157L506,1159L501,1157L500,1159L498,1160L497,1162L493,1160L489,1163L487,1164L486,1161L479,1160L475,1164L472,1173L467,1174L465,1176L460,1174L460,1178L455,1180L452,1183L448,1179L448,1174L445,1167L443,1164L440,1163L441,1161L441,1158L439,1157L435,1158L434,1157L433,1155L429,1154L425,1151L421,1151L422,1148L421,1146L429,1122L448,1111L461,1106L467,1106L471,1108L476,1107L478,1109L480,1107L484,1107L488,1105L492,1107L499,1105Z"
}, {
  "id": "627023",
  "n": "Agonda",
  "t": "canacona",
  "src": "LGD",
  "lp": [494.6, 1194.9],
  "d": "M506,1160L510,1169L513,1178L517,1178L513,1184L514,1187L514,1189L514,1191L518,1193L519,1197L518,1200L522,1205L519,1207L516,1207L514,1208L513,1211L510,1215L511,1217L506,1218L503,1220L500,1234L497,1236L495,1236L493,1231L491,1232L489,1232L486,1228L484,1229L484,1231L482,1233L479,1233L476,1231L474,1230L474,1225L473,1221L469,1221L470,1220L472,1219L469,1216L473,1216L475,1214L476,1210L467,1186L461,1175L463,1176L466,1176L467,1175L472,1173L475,1164L480,1160L486,1161L487,1164L489,1163L493,1160L497,1162L498,1160L500,1159L500,1158L506,1160Z"
}, {
  "id": "627029",
  "n": "Angediva",
  "t": "canacona",
  "src": "LGD",
  "lp": [558.2, 1248.4],
  "d": "M548,1225L553,1227L555,1229L556,1226L558,1227L561,1226L565,1228L565,1226L568,1223L570,1227L570,1229L571,1230L572,1234L571,1235L578,1234L580,1237L584,1239L586,1242L590,1244L589,1246L588,1247L587,1251L589,1253L589,1257L588,1264L585,1266L583,1269L579,1271L578,1273L579,1276L577,1281L572,1285L566,1283L562,1279L560,1278L554,1279L551,1283L552,1286L550,1287L549,1286L548,1280L545,1272L547,1272L548,1271L551,1271L552,1267L550,1269L550,1271L548,1270L547,1271L544,1272L544,1269L540,1262L536,1262L532,1265L535,1261L535,1258L532,1257L529,1259L529,1258L527,1257L530,1257L532,1256L531,1254L532,1253L530,1250L523,1244L516,1242L518,1238L518,1236L520,1236L520,1237L522,1237L523,1235L522,1233L519,1232L518,1234L517,1234L516,1238L514,1239L513,1242L513,1243L511,1245L509,1242L507,1241L502,1238L500,1234L501,1230L501,1226L503,1223L503,1221L506,1218L511,1217L511,1214L514,1215L512,1217L514,1216L515,1219L516,1216L517,1217L525,1217L525,1215L527,1214L532,1217L533,1216L533,1213L539,1208L545,1210L546,1212L545,1215L546,1218L545,1221L547,1223L548,1225Z"
}, {
  "id": "803254",
  "n": "Canacona",
  "t": "canacona",
  "src": "SOI",
  "lp": [600.4, 1222.9],
  "d": "M579,1180L584,1179L586,1180L594,1180L597,1177L600,1176L606,1177L612,1180L618,1179L631,1186L634,1192L636,1194L640,1196L639,1198L637,1209L637,1211L641,1215L632,1221L633,1224L627,1239L631,1240L639,1240L634,1242L633,1246L628,1248L628,1249L634,1250L633,1254L634,1256L631,1257L633,1263L633,1264L627,1265L624,1269L623,1269L621,1264L619,1262L615,1263L611,1259L607,1261L605,1261L602,1263L600,1262L598,1257L596,1257L594,1262L593,1263L588,1265L589,1257L589,1253L587,1251L589,1244L586,1242L584,1239L580,1237L578,1234L571,1235L572,1234L571,1230L570,1229L570,1227L568,1223L565,1226L565,1228L561,1226L558,1227L556,1226L555,1229L553,1227L549,1225L548,1223L545,1221L546,1218L545,1215L546,1212L545,1209L539,1208L538,1209L534,1213L534,1215L532,1216L527,1214L525,1215L525,1217L517,1217L516,1216L516,1219L515,1216L512,1217L514,1215L511,1214L513,1211L513,1208L516,1207L519,1207L522,1205L518,1200L519,1197L518,1193L514,1191L514,1189L514,1187L513,1184L517,1178L519,1178L526,1180L531,1179L539,1181L546,1179L552,1181L562,1183L570,1187L579,1180Z"
}, {
  "id": "627025",
  "n": "Gaodongrem",
  "t": "canacona",
  "src": "LGD",
  "lp": [698.9, 1227.3],
  "d": "M703,1155L706,1157L707,1158L717,1155L728,1158L733,1156L736,1157L741,1162L745,1165L748,1167L749,1170L744,1177L739,1178L735,1184L737,1186L742,1185L742,1189L743,1191L749,1191L755,1193L758,1197L762,1198L765,1195L768,1196L777,1195L783,1195L776,1209L772,1212L771,1215L764,1222L766,1225L766,1230L767,1234L764,1235L762,1239L758,1239L757,1241L756,1243L754,1245L753,1247L751,1247L748,1249L751,1250L754,1253L754,1256L753,1259L755,1260L756,1262L759,1263L755,1265L756,1269L758,1270L761,1269L763,1271L763,1275L759,1276L761,1282L760,1285L760,1291L759,1293L756,1292L756,1290L755,1288L749,1288L747,1289L747,1295L744,1295L741,1292L736,1292L733,1294L733,1298L732,1299L727,1297L723,1297L724,1295L728,1292L727,1288L720,1285L719,1283L721,1282L720,1280L715,1279L714,1271L713,1270L712,1270L711,1272L705,1270L702,1276L697,1275L695,1272L697,1269L698,1266L696,1264L693,1263L695,1258L693,1256L691,1257L688,1266L685,1266L684,1263L682,1263L677,1268L675,1271L671,1269L670,1269L670,1276L665,1276L663,1273L662,1277L660,1277L659,1272L655,1272L654,1270L655,1264L654,1263L650,1261L644,1256L642,1255L641,1252L638,1252L634,1256L633,1254L634,1250L628,1249L628,1248L633,1246L634,1242L639,1240L631,1240L627,1239L633,1224L632,1221L641,1215L637,1210L639,1198L640,1196L639,1195L650,1174L660,1166L680,1160L684,1157L687,1157L690,1156L696,1154L703,1155Z"
}, {
  "id": "626966",
  "n": "Corla",
  "t": "quepem",
  "src": "LGD",
  "lp": [677.8, 1143.1],
  "d": "M703,1128L698,1137L699,1139L701,1140L702,1144L706,1148L703,1155L696,1154L690,1156L687,1157L684,1157L680,1160L662,1166L660,1162L661,1160L661,1158L651,1152L650,1150L655,1142L658,1137L659,1133L664,1127L666,1127L669,1126L671,1128L678,1128L681,1127L685,1128L689,1128L694,1124L699,1123L701,1124L701,1129L703,1128Z"
}, {
  "id": "626967",
  "n": "Cazur",
  "t": "quepem",
  "src": "LGD",
  "lp": [725.5, 1138.4],
  "d": "M751,1126L755,1128L756,1132L755,1136L750,1143L738,1153L736,1157L733,1156L728,1158L717,1155L707,1158L706,1157L703,1155L706,1148L702,1144L701,1140L699,1139L698,1137L703,1127L705,1131L713,1130L715,1129L721,1129L726,1128L729,1124L733,1123L737,1117L739,1118L740,1119L742,1119L746,1124L746,1122L751,1126Z"
}, {
  "id": "626964",
  "n": "Pirla",
  "t": "quepem",
  "src": "LGD",
  "lp": [675.6, 1095.9],
  "d": "M705,1081L705,1084L704,1090L706,1093L707,1099L707,1102L710,1109L709,1117L704,1122L703,1128L701,1129L701,1124L699,1123L694,1124L689,1128L685,1128L681,1127L678,1128L671,1128L669,1126L666,1127L661,1126L656,1127L640,1123L645,1114L644,1104L642,1099L647,1092L650,1093L652,1091L653,1087L655,1086L657,1080L667,1078L673,1080L678,1079L684,1072L682,1070L685,1066L688,1071L694,1073L694,1076L698,1080L700,1081L703,1080L705,1081Z"
}, {
  "id": "626963",
  "n": "Quisconda",
  "t": "quepem",
  "src": "LGD",
  "lp": [640.1, 1133.8],
  "d": "M636,1122L654,1127L661,1126L664,1127L659,1133L658,1137L655,1142L650,1150L651,1152L622,1150L618,1146L618,1144L620,1142L620,1136L622,1135L621,1129L624,1120L625,1114L629,1115L636,1122Z"
}, {
  "id": "n21",
  "n": "Vaul",
  "t": "quepem",
  "src": "SOI",
  "lp": [630, 1172.1],
  "d": "M651,1152L661,1158L661,1160L660,1162L662,1166L660,1166L650,1174L639,1195L636,1194L634,1192L631,1186L628,1184L618,1179L612,1180L606,1177L609,1170L613,1168L619,1168L618,1164L619,1160L622,1154L622,1150L651,1152Z"
}, {
  "id": "626962",
  "n": "Goculdem",
  "t": "quepem",
  "src": "LGD",
  "lp": [606.6, 1140.9],
  "d": "M625,1114L624,1120L621,1129L622,1135L620,1136L620,1142L618,1144L618,1146L622,1150L622,1154L619,1160L618,1164L619,1168L613,1168L609,1170L606,1177L600,1176L597,1177L594,1180L586,1180L584,1179L579,1180L595,1160L594,1158L596,1156L592,1154L591,1151L594,1149L592,1146L592,1142L594,1140L596,1139L590,1137L589,1138L586,1137L585,1134L585,1132L587,1129L586,1125L586,1123L590,1115L588,1111L594,1107L597,1107L609,1101L619,1109L621,1112L625,1114Z"
}, {
  "id": "626959",
  "n": "Padi",
  "t": "quepem",
  "src": "LGD",
  "lp": [562.1, 1109.3],
  "d": "M609,1101L597,1107L594,1107L588,1111L590,1115L586,1122L586,1125L587,1129L585,1132L578,1134L576,1133L575,1136L570,1135L565,1135L546,1134L544,1135L537,1134L534,1136L535,1130L537,1128L535,1124L536,1122L536,1119L538,1118L537,1116L536,1113L533,1108L533,1101L531,1100L529,1098L537,1094L540,1096L556,1103L559,1105L565,1105L570,1103L573,1100L576,1101L579,1099L583,1086L592,1086L598,1084L608,1095L609,1098L609,1101Z"
}, {
  "id": "626957",
  "n": "Maina",
  "t": "quepem",
  "src": "LGD",
  "lp": [622, 1085.1],
  "d": "M647,1092L642,1099L644,1104L645,1114L640,1123L637,1122L633,1120L629,1115L625,1114L621,1112L619,1109L609,1101L609,1098L608,1095L598,1084L592,1086L583,1086L579,1079L578,1073L576,1071L577,1068L589,1058L589,1060L590,1064L596,1067L598,1067L599,1065L607,1064L610,1052L613,1051L616,1052L617,1048L619,1047L621,1049L626,1047L637,1049L637,1054L639,1056L639,1058L642,1060L641,1064L643,1065L641,1067L641,1071L644,1077L645,1081L644,1081L646,1084L645,1091L647,1092Z"
}, {
  "id": "627014",
  "n": "Rivona",
  "t": "sanguem",
  "src": "LGD",
  "lp": [644.8, 1026.8],
  "d": "M652,961L651,964L655,972L658,975L662,977L664,983L670,988L672,992L677,996L679,996L682,993L685,993L686,995L683,1002L681,1003L679,1003L678,1005L677,1006L677,1013L667,1019L671,1021L672,1025L678,1026L679,1034L681,1037L685,1037L687,1038L687,1042L691,1043L691,1046L689,1053L691,1053L692,1055L690,1059L686,1059L685,1066L681,1069L683,1071L678,1079L673,1080L667,1078L657,1080L655,1086L653,1087L652,1091L650,1093L647,1092L645,1091L646,1084L644,1081L645,1081L644,1076L641,1071L641,1067L643,1065L641,1064L642,1060L639,1058L639,1056L637,1054L637,1049L626,1047L621,1049L620,1048L615,1042L614,1041L613,1038L612,1037L611,1029L612,1028L609,1018L607,1015L601,1014L598,1015L587,1007L593,997L590,983L595,980L598,982L601,981L604,979L608,978L610,974L615,975L619,973L623,973L622,970L626,968L629,964L631,963L636,962L638,964L642,965L645,963L652,961Z"
}, {
  "id": "626948",
  "n": "Adnem",
  "t": "quepem",
  "src": "LGD",
  "lp": [578.8, 1020],
  "d": "M590,983L593,997L587,1007L598,1015L601,1014L606,1015L609,1018L612,1028L611,1029L612,1037L613,1038L614,1041L619,1047L617,1048L616,1052L613,1051L610,1052L607,1064L599,1065L597,1067L590,1064L589,1060L589,1058L587,1058L581,1053L578,1048L574,1047L572,1040L561,1031L555,1024L549,1022L546,1018L544,1008L544,1006L545,1001L543,997L545,995L549,985L552,982L556,981L558,982L559,980L562,980L569,977L575,979L576,981L578,981L585,976L587,983L590,983Z"
}, {
  "id": "n22",
  "n": "Diyanv",
  "t": "quepem",
  "src": "SOI",
  "lp": [589.6, 955.6],
  "d": "M603,938L604,940L607,943L608,945L607,947L602,946L600,948L601,951L603,954L604,958L608,956L613,959L616,960L616,955L619,954L621,957L627,958L630,960L632,960L636,958L637,960L636,962L629,964L626,968L622,970L623,973L619,973L615,975L610,974L608,978L604,979L601,981L598,982L595,980L587,983L585,973L579,965L579,960L578,960L575,953L572,951L570,945L569,943L571,941L572,938L573,935L575,935L576,936L582,933L584,931L588,929L590,929L596,936L599,937L599,939L603,938Z"
}, {
  "id": "626946",
  "n": "Molcornem",
  "t": "quepem",
  "src": "LGD",
  "lp": [682.6, 971.3],
  "d": "M690,944L691,952L704,962L712,963L713,966L711,968L705,979L707,984L706,989L708,991L709,995L689,990L685,993L682,993L679,996L676,995L672,992L670,988L664,983L662,977L658,975L651,964L652,961L660,957L664,953L661,944L663,945L665,944L668,947L674,945L680,948L688,946L690,944Z"
}, {
  "id": "626943",
  "n": "Zanodem",
  "t": "quepem",
  "src": "LGD",
  "lp": [707, 944.7],
  "d": "M728,949L712,963L704,962L691,952L691,943L692,935L695,930L700,929L702,930L709,934L716,940L721,942L725,947L728,949Z"
}, {
  "id": "626945",
  "n": "Molcopona",
  "t": "quepem",
  "src": "LGD",
  "lp": [716.9, 981.5],
  "d": "M730,990L727,991L724,994L715,998L709,995L708,991L706,989L707,984L705,979L712,967L717,973L723,976L724,979L727,979L730,990Z"
}, {
  "id": "627013",
  "n": "Colomb",
  "t": "sanguem",
  "src": "LGD",
  "lp": [704.7, 1035.3],
  "d": "M709,995L715,998L725,993L727,996L727,1006L729,1013L726,1020L728,1026L727,1032L730,1034L729,1039L726,1045L726,1052L721,1056L725,1059L726,1061L726,1062L724,1064L725,1069L719,1074L706,1081L703,1080L700,1081L698,1080L694,1076L694,1073L689,1072L687,1071L685,1067L685,1063L686,1058L690,1059L692,1056L692,1054L689,1053L691,1046L691,1043L687,1042L687,1038L685,1037L681,1037L679,1034L678,1026L672,1025L671,1021L667,1019L677,1013L677,1006L678,1005L679,1003L681,1003L684,1002L686,995L685,993L688,990L709,995Z"
}, {
  "id": "627015",
  "n": "Kurpem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [753.2, 1060.1],
  "d": "M778,1045L778,1050L781,1052L778,1055L776,1059L778,1060L782,1058L779,1062L788,1066L787,1068L784,1068L783,1070L787,1072L789,1076L791,1078L791,1080L788,1081L780,1080L774,1086L763,1091L761,1091L755,1084L754,1081L749,1081L749,1076L746,1072L742,1073L741,1070L731,1067L730,1069L728,1067L727,1069L725,1069L724,1064L725,1062L726,1061L725,1059L721,1056L726,1052L726,1045L729,1039L730,1034L727,1032L728,1029L732,1028L735,1031L737,1037L743,1040L756,1041L771,1049L773,1049L777,1047L778,1045Z"
}, {
  "id": "627011",
  "n": "Porteem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [809.1, 1054.2],
  "d": "M797,1026L799,1028L803,1029L806,1034L809,1040L825,1037L831,1042L832,1040L835,1039L839,1042L840,1053L838,1060L834,1072L837,1075L833,1079L828,1081L822,1081L817,1081L813,1081L809,1084L806,1083L804,1084L801,1083L799,1080L797,1082L793,1080L789,1076L787,1072L784,1070L784,1069L788,1068L787,1066L779,1062L782,1059L778,1060L776,1059L778,1055L781,1052L778,1050L778,1044L776,1043L772,1043L778,1040L780,1038L780,1037L778,1034L779,1028L777,1030L777,1027L780,1025L784,1028L785,1024L787,1023L790,1024L793,1027L797,1026Z"
}, {
  "id": "626944",
  "n": "Undorna",
  "t": "quepem",
  "src": "LGD",
  "lp": [735.5, 971.1],
  "d": "M732,952L735,959L744,960L750,959L754,966L756,966L756,969L754,975L753,982L751,985L741,988L730,990L727,979L724,979L723,976L717,973L713,967L712,963L728,949L732,952Z"
}, {
  "id": "627001",
  "n": "Xelpem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [749.1, 940.2],
  "d": "M762,928L761,930L762,933L759,937L760,942L753,947L755,951L755,952L753,954L753,957L755,958L753,963L752,964L750,959L744,960L735,959L731,950L734,945L737,945L738,941L739,940L736,938L737,921L748,918L749,919L748,922L748,923L754,925L757,923L759,927L762,928Z"
}, {
  "id": "627002",
  "n": "Salauli",
  "t": "sanguem",
  "src": "LGD",
  "lp": [778.5, 951.4],
  "d": "M797,926L803,932L805,936L809,938L811,943L811,945L802,946L801,956L800,961L795,961L787,960L786,962L786,965L787,966L787,968L786,972L785,973L783,974L781,978L780,976L777,978L774,978L772,980L770,977L767,976L767,972L765,970L756,969L756,966L754,966L752,964L754,962L755,958L753,957L753,954L755,952L755,951L753,947L760,942L759,937L762,933L761,930L763,927L769,929L773,925L774,923L776,922L782,925L785,925L787,926L790,925L792,926L795,925L797,926Z"
}, {
  "id": "627012",
  "n": "Curdem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [770.8, 997.1],
  "d": "M820,1007L813,1015L810,1017L807,1021L801,1023L797,1026L793,1027L790,1024L787,1023L785,1025L784,1028L780,1025L777,1027L776,1030L779,1028L778,1034L780,1038L778,1040L771,1041L772,1043L777,1043L778,1045L777,1047L771,1049L756,1041L744,1040L741,1039L737,1037L735,1031L732,1028L728,1029L727,1023L726,1020L729,1013L727,1006L727,996L725,993L728,990L742,988L751,984L753,982L754,975L756,969L765,970L767,972L767,976L770,977L772,980L774,978L777,978L780,976L781,978L783,974L786,972L787,969L786,967L786,965L787,961L788,960L790,961L800,961L801,956L802,946L811,945L814,949L817,956L812,974L815,978L814,986L810,992L812,993L816,999L819,1000L820,1001L820,1007Z"
}, {
  "id": "627006",
  "n": "Bati",
  "t": "sanguem",
  "src": "LGD",
  "lp": [878.3, 962],
  "d": "M948,917L952,920L951,923L953,925L953,927L954,930L957,932L958,935L960,935L958,942L959,948L961,953L964,960L949,953L939,964L930,972L923,975L914,976L891,973L885,974L878,976L869,984L858,983L854,985L853,989L851,990L850,989L842,990L843,992L840,993L838,997L841,1001L843,1002L835,1005L834,1007L826,1006L824,1008L820,1007L820,1001L819,1000L816,999L812,993L810,992L814,986L815,978L812,974L817,956L814,949L811,945L811,942L809,939L805,936L803,932L798,927L805,928L811,927L817,929L822,924L828,922L831,923L832,927L837,928L838,931L841,932L841,935L839,936L841,938L843,939L846,939L848,943L851,945L855,945L857,944L859,945L860,949L864,950L868,947L872,947L875,942L882,944L887,941L894,952L895,953L902,951L905,949L909,944L916,932L928,935L932,934L937,930L946,929L948,923L947,918Z"
}, {
  "id": "627008",
  "n": "Viliena",
  "t": "sanguem",
  "src": "LGD",
  "lp": [855.4, 999.1],
  "d": "M871,982L869,995L871,995L871,1002L868,1002L868,1005L871,1006L871,1010L869,1010L863,1014L860,1015L858,1014L849,1015L849,1011L846,1008L846,1004L841,1001L838,997L840,993L843,992L843,990L850,989L851,990L853,989L854,985L858,983L867,984L871,982Z"
}, {
  "id": "627009",
  "n": "Dongor",
  "t": "sanguem",
  "src": "LGD",
  "lp": [863.5, 1029],
  "d": "M871,1010L873,1017L875,1020L877,1019L881,1018L885,1015L886,1015L895,1038L894,1042L886,1044L882,1047L878,1053L869,1050L866,1049L863,1044L858,1042L855,1041L847,1043L842,1041L839,1042L835,1039L835,1035L836,1032L835,1026L837,1022L841,1022L848,1017L849,1015L858,1014L860,1015L863,1014L869,1010L871,1010Z"
}, {
  "id": "627010",
  "n": "Naiquinim",
  "t": "sanguem",
  "src": "LGD",
  "lp": [823.5, 1021.5],
  "d": "M849,1015L848,1017L841,1022L838,1023L836,1023L835,1027L836,1032L835,1035L835,1039L832,1040L831,1042L825,1037L809,1040L806,1034L803,1029L799,1028L797,1026L801,1023L807,1021L810,1017L813,1015L820,1007L824,1008L826,1006L834,1007L835,1005L843,1002L846,1004L846,1008L849,1011L849,1015Z"
}, {
  "id": "627017",
  "n": "Sigonem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [878.7, 1065.9],
  "d": "M907,1046L912,1046L922,1043L921,1051L922,1080L919,1082L919,1092L909,1094L906,1097L905,1100L879,1102L870,1097L867,1098L865,1098L859,1095L857,1092L855,1085L852,1080L848,1081L844,1078L842,1073L840,1072L837,1075L834,1072L838,1060L840,1053L839,1042L842,1041L847,1043L855,1041L858,1042L863,1044L866,1049L869,1050L878,1053L882,1047L886,1044L894,1042L895,1038L907,1046Z"
}, {
  "id": "627018",
  "n": "Neturlim",
  "t": "sanguem",
  "src": "LGD",
  "lp": [837.2, 1126.4],
  "d": "M843,1076L848,1081L852,1080L855,1085L857,1092L859,1095L865,1098L867,1098L870,1097L879,1102L905,1100L903,1106L905,1107L904,1108L902,1112L891,1120L893,1137L895,1145L884,1154L880,1159L871,1166L869,1166L868,1165L865,1166L863,1167L862,1171L836,1183L828,1186L821,1192L813,1166L798,1152L794,1151L792,1150L792,1147L791,1144L786,1138L782,1134L777,1133L791,1118L797,1116L803,1108L805,1100L810,1095L809,1093L810,1091L806,1088L809,1084L811,1082L813,1081L817,1081L821,1082L831,1080L839,1072L842,1073L843,1076Z"
}, {
  "id": "627016",
  "n": "Vichundrem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [780.8, 1104.4],
  "d": "M809,1084L806,1087L810,1091L809,1094L810,1095L805,1100L803,1108L797,1116L791,1118L777,1133L772,1134L766,1132L756,1131L755,1127L753,1127L751,1126L752,1123L750,1119L753,1120L756,1118L759,1094L761,1091L763,1091L774,1086L779,1080L780,1079L788,1081L791,1080L791,1078L797,1082L799,1080L801,1083L804,1084L806,1083L809,1084Z"
}, {
  "id": "626965",
  "n": "Sulcorna",
  "t": "quepem",
  "src": "LGD",
  "lp": [732.5, 1100.4],
  "d": "M761,1091L759,1094L756,1118L753,1120L750,1119L752,1123L751,1126L747,1122L746,1124L742,1119L740,1119L739,1118L737,1117L733,1123L729,1124L726,1128L721,1129L715,1129L713,1130L705,1131L703,1127L703,1125L706,1119L709,1117L710,1109L707,1102L707,1099L706,1093L704,1090L705,1084L705,1081L707,1081L716,1075L719,1074L723,1070L727,1069L728,1067L730,1069L731,1067L735,1068L741,1070L742,1073L746,1072L749,1076L749,1081L754,1081L755,1084L761,1091Z"
}, {
  "id": "626968",
  "n": "Mangal",
  "t": "quepem",
  "src": "LGD",
  "lp": [763.1, 1163.7],
  "d": "M777,1133L782,1134L786,1138L791,1144L792,1149L791,1151L779,1152L776,1153L777,1154L779,1154L778,1158L782,1160L783,1162L781,1168L781,1171L777,1174L774,1178L774,1184L772,1186L772,1190L771,1192L767,1196L765,1195L762,1198L758,1197L755,1193L749,1191L743,1191L742,1189L742,1185L737,1186L735,1184L739,1178L744,1177L749,1170L748,1167L745,1165L743,1162L736,1157L737,1154L751,1142L755,1136L756,1131L766,1132L772,1134L777,1133Z"
}, {
  "id": "627019",
  "n": "Nundem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [796.7, 1172.3],
  "d": "M821,1192L818,1190L806,1193L777,1195L767,1196L771,1192L772,1190L772,1186L774,1184L774,1178L777,1174L781,1171L781,1168L783,1162L782,1160L778,1158L779,1154L777,1154L776,1153L779,1152L791,1151L792,1150L794,1151L798,1152L813,1166L821,1192Z"
}, {
  "id": "627020",
  "n": "Verlem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [884.3, 1184.5],
  "d": "M914,1121L916,1151L920,1156L929,1158L930,1163L929,1168L930,1175L934,1181L937,1182L939,1195L935,1198L927,1202L919,1210L920,1223L903,1237L898,1245L894,1249L894,1253L896,1256L887,1259L883,1259L874,1263L869,1258L858,1256L848,1245L846,1239L842,1223L841,1215L841,1208L837,1204L823,1195L821,1192L828,1186L836,1183L862,1171L863,1167L865,1166L868,1165L869,1166L871,1166L880,1159L884,1154L895,1145L893,1137L891,1120L902,1112L905,1109L905,1107L907,1109L914,1121Z"
}, {
  "id": "627028",
  "n": "Cotigao",
  "t": "canacona",
  "src": "LGD",
  "lp": [818.4, 1293.7],
  "d": "M818,1190L823,1195L840,1205L841,1208L841,1215L842,1223L844,1233L847,1243L858,1256L869,1258L874,1262L872,1269L872,1271L877,1276L881,1278L891,1293L886,1297L883,1307L877,1306L874,1317L875,1321L873,1324L869,1323L868,1324L865,1319L862,1320L860,1317L856,1316L853,1312L849,1312L846,1315L843,1316L841,1325L841,1333L838,1337L835,1339L833,1337L830,1340L823,1341L820,1345L814,1342L811,1348L812,1354L807,1357L800,1372L796,1376L793,1375L781,1365L785,1359L785,1354L783,1350L780,1346L771,1342L768,1340L766,1340L765,1337L762,1337L760,1332L762,1327L755,1325L751,1326L750,1327L748,1326L746,1326L743,1325L738,1325L734,1329L731,1329L732,1331L730,1333L731,1335L729,1336L730,1339L728,1342L725,1344L725,1348L724,1349L726,1350L724,1353L727,1356L728,1362L729,1363L730,1369L732,1372L736,1375L738,1378L738,1380L741,1388L742,1391L736,1398L723,1391L723,1390L711,1387L708,1383L702,1380L695,1382L687,1377L678,1377L673,1371L673,1369L669,1362L670,1361L670,1359L668,1358L666,1361L664,1361L662,1360L662,1357L660,1356L657,1352L655,1352L651,1353L648,1352L641,1346L641,1342L639,1340L639,1337L639,1332L644,1327L646,1327L648,1328L649,1330L652,1324L649,1324L650,1318L653,1315L658,1317L658,1314L661,1311L660,1309L663,1307L663,1305L662,1301L664,1303L666,1303L669,1304L672,1303L674,1301L674,1305L675,1308L681,1303L693,1296L699,1296L702,1298L706,1296L709,1298L712,1297L715,1298L717,1298L723,1297L727,1297L731,1299L733,1298L733,1294L736,1292L741,1292L744,1295L747,1295L747,1289L755,1288L756,1290L756,1292L759,1293L760,1291L760,1285L761,1282L759,1276L763,1275L763,1271L761,1269L758,1270L756,1269L755,1265L758,1264L756,1262L755,1260L753,1259L754,1256L754,1253L751,1250L748,1249L751,1247L753,1247L754,1245L756,1243L757,1241L758,1239L762,1239L764,1235L767,1234L766,1230L766,1225L765,1223L765,1221L770,1216L772,1212L776,1209L783,1195L806,1193L818,1190Z"
}, {
  "id": "627026",
  "n": "Poinguinim",
  "t": "canacona",
  "src": "LGD",
  "lp": [639.7, 1290.7],
  "d": "M723,1297L718,1299L715,1298L712,1297L709,1298L706,1296L702,1298L699,1296L693,1296L681,1303L675,1308L674,1305L675,1302L672,1303L669,1304L666,1303L664,1303L662,1301L662,1305L663,1307L660,1309L661,1311L658,1314L658,1317L653,1315L650,1318L649,1324L652,1324L650,1330L648,1328L644,1325L645,1322L643,1322L640,1324L639,1322L637,1321L635,1322L632,1319L625,1317L620,1313L616,1312L613,1313L610,1312L609,1313L607,1312L608,1311L601,1311L591,1305L589,1305L583,1308L582,1309L581,1311L567,1321L566,1324L569,1326L565,1329L566,1327L558,1305L555,1304L556,1302L552,1290L544,1288L545,1287L547,1286L551,1287L551,1284L552,1282L556,1278L562,1279L566,1283L572,1285L577,1281L579,1276L578,1273L579,1271L583,1269L587,1265L593,1263L594,1262L596,1257L598,1257L600,1262L602,1263L604,1261L607,1261L611,1259L615,1263L619,1262L621,1264L623,1269L624,1269L627,1265L633,1264L633,1263L631,1257L633,1257L638,1252L640,1251L641,1252L641,1254L644,1256L650,1261L655,1263L654,1270L655,1272L659,1272L659,1277L661,1277L663,1273L665,1276L670,1276L670,1269L671,1269L675,1271L677,1268L682,1263L684,1263L685,1266L688,1266L691,1257L693,1256L695,1258L693,1263L696,1264L698,1266L697,1269L695,1272L697,1275L702,1276L705,1270L710,1272L712,1270L713,1270L714,1271L715,1279L720,1280L721,1282L719,1283L720,1285L727,1288L728,1292L724,1295L723,1297Z"
}, {
  "id": "627027",
  "n": "Loliem",
  "t": "canacona",
  "src": "LGD",
  "lp": [612.1, 1360.8],
  "d": "M621,1418L620,1419L619,1417L621,1418ZM601,1311L608,1311L607,1312L609,1313L610,1312L613,1313L616,1312L622,1314L625,1317L632,1319L635,1322L637,1321L639,1322L640,1324L643,1322L645,1322L644,1325L646,1327L643,1327L638,1333L639,1337L639,1340L641,1342L641,1346L648,1352L651,1353L655,1352L657,1352L660,1356L662,1357L662,1360L664,1361L666,1361L668,1358L670,1359L670,1361L669,1362L673,1369L673,1371L678,1378L673,1386L674,1389L672,1390L664,1388L662,1390L661,1389L656,1390L654,1395L653,1395L649,1397L644,1392L633,1400L627,1411L624,1411L619,1416L617,1415L618,1413L616,1411L618,1410L617,1408L613,1403L604,1403L598,1407L597,1406L596,1404L594,1404L592,1408L591,1406L588,1404L582,1402L580,1399L578,1398L576,1396L573,1396L565,1394L563,1395L557,1392L555,1384L555,1382L556,1381L560,1380L559,1377L559,1375L558,1372L559,1371L561,1371L562,1369L560,1367L562,1365L561,1363L559,1353L557,1351L559,1349L559,1347L556,1344L559,1342L558,1341L561,1341L563,1340L562,1334L565,1332L565,1329L569,1326L566,1324L567,1322L581,1311L582,1309L586,1306L589,1305L591,1305L601,1311Z"
}, {
  "id": "627007",
  "n": "Cumbari",
  "t": "sanguem",
  "src": "LGD",
  "lp": [912.6, 998.4],
  "d": "M964,960L969,964L971,967L971,971L966,976L966,980L962,984L952,1002L938,1022L932,1025L927,1025L922,1025L921,1031L920,1031L920,1035L922,1043L912,1046L907,1046L895,1038L886,1015L885,1015L881,1018L877,1019L875,1020L873,1018L871,1010L871,1006L868,1005L868,1002L871,1002L871,995L869,995L871,983L878,976L885,974L889,973L914,976L923,975L930,972L939,964L949,953L964,960Z"
}, {
  "id": "627005",
  "n": "Potrem",
  "t": "sanguem",
  "src": "LGD",
  "lp": [903.3, 917],
  "d": "M916,888L925,894L932,892L940,901L947,907L944,913L948,920L948,923L946,929L937,930L932,934L928,935L916,932L909,944L905,949L902,951L895,953L894,952L890,945L888,944L887,941L882,944L875,942L872,947L868,947L864,950L860,949L859,945L858,944L855,945L853,945L848,943L846,939L848,934L852,929L855,922L857,920L858,918L862,917L865,912L867,911L871,902L874,900L879,893L881,886L884,883L886,881L916,888Z"
}, {
  "id": "626990",
  "n": "Boma",
  "t": "sanguem",
  "src": "LGD",
  "lp": [901.6, 792.5],
  "d": "M917,780L917,785L917,792L922,794L923,796L936,806L935,812L926,813L917,819L909,814L902,818L898,813L893,811L890,806L891,806L886,799L884,794L884,791L888,785L891,783L897,781L902,782L905,781L907,775L911,768L913,770L913,773L917,776L917,780Z"
}, {
  "id": "626989",
  "n": "Sonauli",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [945.3, 766.8],
  "d": "M961,730L966,734L972,734L971,742L982,772L1000,796L991,808L985,813L976,812L975,814L957,814L939,805L936,805L923,796L922,794L917,792L917,786L918,780L917,777L913,773L913,770L909,764L908,763L906,763L906,757L904,752L908,743L909,741L908,738L910,737L915,736L917,733L919,729L922,728L925,731L930,730L939,731L941,729L945,730L947,729L952,731L953,725L957,729L961,730Z"
}, {
  "id": "626976",
  "n": "Caranzol",
  "t": "dharbandora",
  "src": "LGD",
  "lp": [931.1, 695.9],
  "d": "M943,659L958,671L980,681L969,689L969,694L978,719L971,733L972,734L966,734L960,729L956,729L953,725L952,731L947,729L945,730L941,729L939,731L930,730L925,731L922,728L919,729L917,733L915,736L909,738L904,725L905,721L904,716L901,714L898,713L890,716L889,712L891,707L891,705L892,703L894,700L892,698L893,693L891,691L892,687L889,682L889,679L887,678L885,673L889,677L890,677L898,673L907,666L918,659L920,660L925,658L943,659Z"
}];
Object.assign(__ds_scope, { GOA_SIZE, DISTRICT_SHAPES, TALUKA_SHAPES, VILLAGES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/goaGeo.js", error: String((e && e.message) || e) }); }

// components/data/places.js
try { (() => {
// Khoim place names. Source: assets/names_districts_talukas.csv and the Goem draft of 30 Sept 2026.
// status: "agree" | "differ" | "pending" (pending = official name only; no reliable Konkani name yet)
// house: key into the --house-* colour tokens. reviewed: false until a Konkani speaker signs off the say-it guide.
// Villages are generated from goaGeo.js with status "pending" and their taluka's house.
const PLACES = [{
  "id": "goa",
  "level": "state",
  "parent": null,
  "lgd": "30",
  "official": "Goa",
  "deva": "गोंय",
  "romi": "Goem",
  "say": "goy",
  "sayNote": "the o is nasal",
  "status": "agree",
  "house": "neel",
  "marathi": "गोवा",
  "sources": "District sites (header), Wikidata",
  "reviewed": false
}, {
  "id": "north-goa",
  "level": "district",
  "parent": "goa",
  "lgd": "551",
  "official": "North Goa",
  "deva": "उत्तर गोंय",
  "romi": "Ut'tor Goem",
  "say": "UT-tor goy",
  "sayNote": null,
  "status": "agree",
  "house": "green",
  "hq": "Panaji",
  "sources": "North Goa and South Goa Konkani sites, Wikidata",
  "reviewed": false
}, {
  "id": "south-goa",
  "level": "district",
  "parent": "goa",
  "lgd": "552",
  "official": "South Goa",
  "deva": "दक्षिण गोंय",
  "romi": "Dokxinn Goem",
  "say": "DOK-shin goy",
  "sayNote": null,
  "status": "differ",
  "house": "neel",
  "alsoWritten": ["दक्षीण गोंय"],
  "hq": "Margao",
  "sources": "Wikidata, Kushavati Konkani site; South Goa header writes दक्षीण",
  "reviewed": false
}, {
  "id": "kushavati",
  "level": "district",
  "parent": "goa",
  "lgd": "793",
  "official": "Kushavati",
  "deva": "कुशावती",
  "romi": null,
  "say": "ku-SHAA-vo-tee",
  "sayNote": null,
  "status": "agree",
  "house": "oxide",
  "hq": "Quepem",
  "facts": ["Goa's third district, notified 31 December 2025"],
  "sources": "kushavati.goa.gov.in header (Konkani and Marathi)",
  "reviewed": false
}, {
  "id": "pernem",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5609",
  "official": "Pernem",
  "deva": "पेडणें",
  "romi": null,
  "say": "PED-nen",
  "sayNote": "retroflex d and n, nasal ending",
  "status": "agree",
  "house": "haldi",
  "hq": "Pernem",
  "facts": ["Terekhol fort sits at its northern tip"],
  "sources": "North Goa Konkani history page, Konkani Vishwakosh, Wikidata",
  "reviewed": false
}, {
  "id": "bardez",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5610",
  "official": "Bardez",
  "deva": "बार्देस",
  "romi": "Bardes",
  "say": "BAAR-des",
  "sayNote": null,
  "status": "differ",
  "house": "kokum",
  "sourceNote": "No government Konkani source yet.",
  "hq": "Mapusa",
  "facts": ["The Mandovi separates it from Tiswadi"],
  "sources": "Konkani Vishwakosh, Konkani Wikipedia (no government Konkani page found)",
  "reviewed": false
}, {
  "id": "tiswadi",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5611",
  "official": "Tiswadi",
  "deva": "तिसवाडी",
  "romi": "Tisvaddi",
  "say": "TIS-vaa-dee",
  "sayNote": "retroflex d",
  "status": "differ",
  "house": "rose",
  "sourceNote": "No government Konkani source yet.",
  "hq": "Panaji",
  "facts": ["An island between the Mandovi and the Zuari"],
  "sources": "Konkani Vishwakosh, Konkani Wikipedia (no government Konkani page found)",
  "reviewed": false
}, {
  "id": "bicholim",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5612",
  "official": "Bicholim",
  "deva": "दिवचल",
  "romi": "Divchol",
  "say": "DIV-chol",
  "sayNote": null,
  "status": "agree",
  "house": "green",
  "marathi": "बिचोळी",
  "hq": "Bicholim",
  "facts": ["Came under Portuguese rule only in the 18th century"],
  "sources": "North Goa Konkani site (2 pages), Konkani Vishwakosh, Wikidata",
  "reviewed": false
}, {
  "id": "sattari",
  "level": "taluka",
  "parent": "north-goa",
  "lgd": "5613",
  "official": "Sattari",
  "deva": "सत्तरी",
  "romi": "Sattari",
  "say": "SUT-tuh-ree",
  "sayNote": null,
  "status": "agree",
  "house": "oxide",
  "officialNote": "LGD spells it Satari",
  "hq": "Valpoi",
  "facts": ["The Mandovi is called Mhadei here"],
  "sources": "North Goa Konkani site, Konkani Vishwakosh, Konkani Wikipedia",
  "reviewed": false
}, {
  "id": "ponda",
  "level": "taluka",
  "parent": "south-goa",
  "lgd": "5614",
  "official": "Ponda",
  "deva": "फोंडें",
  "romi": "Fonddem",
  "say": "PHON-den",
  "sayNote": "retroflex d, nasal ending",
  "status": "agree",
  "house": "lilac",
  "marathi": "फोंडा",
  "hq": "Ponda",
  "facts": ["Known in older records as Antruz"],
  "sources": "South Goa Konkani constituency list, Konkani Vishwakosh, Wikidata",
  "reviewed": false
}, {
  "id": "mormugao",
  "level": "taluka",
  "parent": "south-goa",
  "lgd": "5615",
  "official": "Mormugao",
  "deva": "मुरगांव",
  "romi": "Murganv",
  "say": "MOOR-gaanv",
  "sayNote": "nasal aa",
  "status": "agree",
  "house": "sky",
  "hq": "Vasco da Gama",
  "facts": ["Separated from Salcete in the 17th century"],
  "sources": "South Goa Konkani site, Konkani Vishwakosh, Wikidata",
  "reviewed": false
}, {
  "id": "salcete",
  "level": "taluka",
  "parent": "south-goa",
  "lgd": "5616",
  "official": "Salcete",
  "deva": "साश्टी",
  "romi": "Saxtti",
  "say": "SAASH-tee",
  "sayNote": "retroflex t",
  "status": "differ",
  "house": "neel",
  "alsoWritten": ["सासष्टी", "साष्टी"],
  "hq": "Margao",
  "facts": ["Margao is also the South Goa district headquarters"],
  "sources": "Konkani Vishwakosh, Konkani Wikipedia; variants सासष्टी, साष्टी",
  "reviewed": false
}, {
  "id": "quepem",
  "level": "taluka",
  "parent": "kushavati",
  "lgd": "5617",
  "official": "Quepem",
  "deva": "केपें",
  "romi": "Kepem",
  "say": "KAY-pen",
  "sayNote": "nasal ending",
  "status": "differ",
  "house": "haldi",
  "alsoWritten": ["केंपें", "केपे"],
  "hq": "Quepem",
  "facts": ["Headquarters of Kushavati district"],
  "sources": "Konkani Vishwakosh, Konkani Wikipedia; government pages write केंपें and केपे",
  "reviewed": false
}, {
  "id": "sanguem",
  "level": "taluka",
  "parent": "kushavati",
  "lgd": "5618",
  "official": "Sanguem",
  "deva": "सांगें",
  "romi": "Sangem",
  "say": "SAAN-gen",
  "sayNote": "nasal aa and nasal ending",
  "status": "agree",
  "house": "green",
  "hq": "Sanguem",
  "facts": ["Dudhsagar falls lie in this taluka"],
  "sources": "South Goa Konkani site (2 pages), Konkani Vishwakosh, Wikidata",
  "reviewed": false
}, {
  "id": "canacona",
  "level": "taluka",
  "parent": "kushavati",
  "lgd": "5619",
  "official": "Canacona",
  "deva": "काणकोण",
  "romi": "Kannkonn",
  "say": "KAAN-kon",
  "sayNote": "both n sounds are retroflex",
  "status": "agree",
  "house": "rose",
  "hq": "Chaudi",
  "facts": ["Cotigao wildlife sanctuary is here"],
  "sources": "South Goa and Kushavati Konkani sites, Konkani Vishwakosh, Wikidata",
  "reviewed": false
}, {
  "id": "dharbandora",
  "level": "taluka",
  "parent": "kushavati",
  "lgd": "5931",
  "official": "Dharbandora",
  "deva": null,
  "romi": null,
  "say": null,
  "sayNote": null,
  "status": "pending",
  "house": "mustard",
  "pendingNote": "Sources disagree on the Konkani spelling. We are waiting for the Directorate of Official Language to confirm it.",
  "hq": "Dharbandora",
  "facts": ["Formed mostly from Sanguem, with two villages from Ponda"],
  "sources": "Conflicting: धारबांदोडें (Wikidata gom), धारबांदोडा (Kushavati site). Awaiting Directorate of Official Language",
  "reviewed": false
}];
const HOUSE_OF = {
  "pernem": "haldi",
  "bardez": "kokum",
  "tiswadi": "rose",
  "bicholim": "green",
  "sattari": "oxide",
  "ponda": "lilac",
  "mormugao": "sky",
  "salcete": "neel",
  "quepem": "haldi",
  "sanguem": "green",
  "canacona": "rose",
  "dharbandora": "mustard",
  "north-goa": "green",
  "south-goa": "neel",
  "kushavati": "oxide",
  "goa": "neel"
};
Object.assign(__ds_scope, { PLACES, HOUSE_OF });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/places.js", error: String((e && e.message) || e) }); }

// components/data/khoim.js
try { (() => {
/* Khoim site identity. खंय confirmed by the team, 30 Sept 2026. */
const SITE = {
  romi: 'Khoim',
  deva: 'खंय',
  meaning: 'Where'
};
const byId = {};
__ds_scope.PLACES.forEach(p => {
  byId[p.id] = p;
});
const villagePlaces = __ds_scope.VILLAGES.map(v => ({
  id: 'v' + v.id,
  level: 'village',
  parent: v.t,
  lgd: /^n/.test(v.id) ? null : v.id.split('-')[0],
  official: v.n,
  deva: null,
  romi: null,
  say: null,
  status: 'pending',
  house: __ds_scope.HOUSE_OF[v.t],
  town: !!v.town,
  boundarySource: v.src,
  lp: v.lp
}));
villagePlaces.forEach(p => {
  byId[p.id] = p;
});
function getPlace(id) {
  return byId[id] || null;
}
function childrenOf(id) {
  if (!id || id === 'goa') return __ds_scope.PLACES.filter(p => p.level === 'district');
  const p = byId[id];
  if (!p) return [];
  if (p.level === 'district') return __ds_scope.PLACES.filter(x => x.parent === id && x.level === 'taluka');
  if (p.level === 'taluka') return villagePlaces.filter(v => v.parent === id).sort((a, b) => a.official.localeCompare(b.official));
  return [];
}
function trailOf(id) {
  const out = [];
  let p = byId[id];
  while (p) {
    out.unshift(p);
    p = p.parent ? byId[p.parent] : null;
  }
  if (!out.length || out[0].id !== 'goa') out.unshift(byId.goa);
  return out;
}
function levelLabel(p) {
  return p ? {
    state: 'State',
    district: 'District',
    taluka: 'Taluka',
    village: 'Village'
  }[p.level] : '';
}
function whereLabel(p) {
  if (!p) return '';
  const par = p.parent && p.parent !== 'goa' ? byId[p.parent] : null;
  return levelLabel(p) + (par ? ' in ' + par.official : '');
}
function nameIn(p, script) {
  if (!p) return {
    text: '',
    kind: 'official',
    fallback: false
  };
  if (script === 'deva') return p.deva ? {
    text: p.deva,
    kind: 'deva',
    fallback: false
  } : {
    text: p.official,
    kind: 'official',
    fallback: true
  };
  if (script === 'romi') return p.romi ? {
    text: p.romi,
    kind: 'romi',
    fallback: false
  } : {
    text: p.official,
    kind: 'official',
    fallback: true
  };
  return {
    text: p.official,
    kind: 'official',
    fallback: false
  };
}
/* one sentence for screen readers: "Canacona. Konkani काणकोण, Romi Kannkonn. Taluka in Kushavati. Sources agree." */
function spokenName(p) {
  if (!p) return '';
  const bits = [p.official + '.'];
  if (p.deva) bits.push('Konkani ' + p.deva + (p.romi ? ', Romi ' + p.romi : '') + '.');
  bits.push(whereLabel(p) + '.');
  bits.push(STATUS_TEXT[p.status] + '.');
  return bits.join(' ');
}
const STATUS_TEXT = {
  agree: 'Sources agree',
  differ: 'Sources differ',
  pending: 'Official name only'
};
function houseOf(p) {
  const k = p ? p.house || __ds_scope.HOUSE_OF[p.parent] || 'neel' : 'neel';
  return {
    key: k,
    bg: `var(--house-${k})`,
    on: `var(--house-${k}-on)`,
    dim: `var(--map-${k}-dim)`
  };
}
function shapeOf(id) {
  return __ds_scope.TALUKA_SHAPES[id] || __ds_scope.DISTRICT_SHAPES[id] || null;
}
function sayParts(say) {
  return say ? say.split(/-|\s+/).filter(Boolean).map(s => ({
    text: s,
    stressed: s === s.toUpperCase() && /[A-Z]/.test(s)
  })) : [];
}
const fold = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[’']/g, '').toLowerCase();
function searchPlaces(q, limit = 20) {
  const f = fold(q.trim());
  if (!f) return [];
  const res = [];
  for (const p of __ds_scope.PLACES.concat(villagePlaces)) {
    const fields = [['deva', p.deva], ['romi', p.romi], ['official', p.official], ['alsoWritten', p.alsoWritten && p.alsoWritten.join(' ')], ['marathi', p.marathi]];
    let hit = null,
      rank = 9;
    for (const [k, v] of fields) {
      if (!v) continue;
      const i = fold(v).indexOf(f);
      if (i >= 0) {
        const r = (i === 0 ? 0 : 1) + (p.level === 'village' ? 2 : 0);
        if (r < rank) {
          rank = r;
          hit = k;
        }
      }
    }
    if (hit) res.push({
      place: p,
      field: hit,
      rank
    });
  }
  return res.sort((a, b) => a.rank - b.rank || a.place.official.localeCompare(b.place.official)).slice(0, limit);
}
/* Layers planned for Khoim. status: live | next | planned */
const LAYERS = [{
  id: 'names',
  label: 'Names',
  icon: 'languages',
  status: 'live',
  note: 'Districts and talukas now. Village names in Konkani next.'
}, {
  id: 'voices',
  label: 'Voices',
  icon: 'mic',
  status: 'next',
  note: 'People from each taluka saying the names of the places near them.'
}, {
  id: 'crops',
  label: 'Crops',
  icon: 'wheat',
  status: 'planned',
  note: 'Khazan paddy, cashew, coconut and areca, on the villages that grow them.'
}, {
  id: 'food',
  label: 'Food',
  icon: 'soup',
  status: 'planned',
  note: 'Dishes tied to one village or feast, under their Konkani names.'
}, {
  id: 'music',
  label: 'Music',
  icon: 'music',
  status: 'planned',
  note: 'Where mando, dulpod, deknni and fugdi are sung and danced.'
}, {
  id: 'landmarks',
  label: 'Landmarks',
  icon: 'landmark',
  status: 'planned',
  note: 'Temples, churches, mosques and springs, by the names people nearby call them.'
}];
const KhoimData = {
  SITE,
  PLACES: __ds_scope.PLACES,
  VILLAGES: villagePlaces,
  LAYERS,
  STATUS_TEXT,
  getPlace,
  childrenOf,
  trailOf,
  levelLabel,
  whereLabel,
  nameIn,
  spokenName,
  houseOf,
  shapeOf,
  sayParts,
  searchPlaces
};
Object.assign(__ds_scope, { SITE, getPlace, childrenOf, trailOf, levelLabel, whereLabel, nameIn, spokenName, STATUS_TEXT, houseOf, shapeOf, sayParts, searchPlaces, LAYERS, KhoimData });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/khoim.js", error: String((e && e.message) || e) }); }

// components/core/Wordmark.jsx
try { (() => {
function Wordmark({
  size = 22,
  color = 'var(--text)',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    "aria-label": __ds_scope.SITE.romi,
    style: {
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: '.3em',
      color,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    lang: "gom",
    "aria-hidden": "true",
    style: {
      font: `var(--weight-strong) ${size}px/1.5 var(--font-deva)`
    }
  }, __ds_scope.SITE.deva), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      font: `var(--weight-strong) ${size}px/1.3 var(--font-latin)`
    }
  }, __ds_scope.SITE.romi));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/layers/LayerSwitch.jsx
try { (() => {
/* The layers Khoim will grow into. Only live layers can be switched on; the rest say when they are coming. */
function LayerSwitch({
  value = 'names',
  onChange,
  layers = __ds_scope.LAYERS,
  style
}) {
  return /*#__PURE__*/React.createElement("ul", {
    role: "list",
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 8,
      ...style
    }
  }, layers.map(l => {
    const live = l.status === 'live',
      on = value === l.id;
    return /*#__PURE__*/React.createElement("li", {
      key: l.id
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      "aria-pressed": live ? on : undefined,
      "aria-disabled": !live || undefined,
      onClick: () => live && onChange && onChange(l.id),
      style: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '44px minmax(0,1fr) auto',
        gap: 12,
        alignItems: 'center',
        textAlign: 'left',
        padding: '10px 14px 10px 10px',
        borderRadius: 'var(--radius-l)',
        cursor: live ? 'pointer' : 'default',
        border: '2px ' + (live ? 'solid ' : 'dashed ') + (on ? 'var(--text)' : 'var(--line)'),
        background: on ? 'var(--surface-invert)' : 'var(--surface-raised)',
        color: on ? 'var(--text-invert)' : 'var(--text)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-m)',
        display: 'grid',
        placeItems: 'center',
        background: on ? 'var(--surface-raised)' : 'var(--surface-sunk)',
        color: 'var(--text)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: l.icon,
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'grid',
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-strong) 17px/1.3 var(--font-latin)'
      }
    }, l.label), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-regular) 15px/1.45 var(--font-latin)'
      }
    }, l.note)), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-strong) 14px/1 var(--font-latin)'
      }
    }, live ? on ? 'On' : 'Off' : l.status === 'next' ? 'Next' : 'Planned')));
  }));
}
Object.assign(__ds_scope, { LayerSwitch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layers/LayerSwitch.jsx", error: String((e && e.message) || e) }); }

// components/layers/VoiceClip.jsx
try { (() => {
/* A recording of a local person saying the name, credited by name and village. Empty state invites a recording. */
function VoiceClip({
  recordings,
  placeName,
  ink = 'var(--text)',
  paper = 'var(--surface-raised)',
  onRecord,
  style
}) {
  const [playing, setPlaying] = React.useState(null);
  const audio = React.useRef(null);
  const play = (r, i) => {
    if (playing === i) {
      audio.current && audio.current.pause();
      setPlaying(null);
      return;
    }
    if (r.src) {
      if (audio.current) audio.current.pause();
      audio.current = new Audio(r.src);
      audio.current.onended = () => setPlaying(null);
      audio.current.play();
    }
    setPlaying(i);
  };
  if (!recordings || !recordings.length) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 6,
        color: ink,
        ...style
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-m)',
        border: '2px dashed ' + ink,
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "mic",
      size: 20
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-regular) 16px/1.45 var(--font-latin)'
      }
    }, "No recordings yet.", onRecord ? ' ' : '', onRecord && /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onRecord,
      style: {
        border: 0,
        background: 'transparent',
        padding: '6px 0',
        color: ink,
        font: 'inherit',
        fontWeight: 600,
        textDecoration: 'underline',
        textUnderlineOffset: 4,
        cursor: 'pointer'
      }
    }, 'Record ' + (placeName || 'this name'))));
  }
  return /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '6px 0 0',
      padding: 0,
      display: 'grid',
      gap: 8,
      color: ink,
      ...style
    }
  }, recordings.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => play(r, i),
    "aria-pressed": playing === i,
    "aria-label": (playing === i ? 'Pause ' : 'Play ') + r.speaker + ', ' + r.village,
    style: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '48px minmax(0,1fr) auto',
      gap: 12,
      alignItems: 'center',
      border: '2px solid ' + ink,
      borderRadius: 'var(--radius-l)',
      background: 'transparent',
      color: ink,
      padding: 6,
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-m)',
      background: ink,
      color: paper,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: playing === i ? 'pause' : 'play',
    size: 20
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-strong) 17px/1.3 var(--font-latin)'
    }
  }, r.speaker), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) 15px/1.4 var(--font-latin)'
    }
  }, r.village)), r.duration && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) 15px/1 var(--font-latin)',
      paddingRight: 10
    }
  }, r.duration)))));
}
Object.assign(__ds_scope, { VoiceClip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layers/VoiceClip.jsx", error: String((e && e.message) || e) }); }

// components/map/GoaMap.jsx
try { (() => {
const TIDS = Object.keys(__ds_scope.TALUKA_SHAPES);
const DIDS = Object.keys(__ds_scope.DISTRICT_SHAPES);
const GOA = [20, 30, 985, 1400];
const NUDGE = {
  mormugao: [-10, 4]
};
function boxFor(focus) {
  const s = focus && (__ds_scope.TALUKA_SHAPES[focus] || __ds_scope.DISTRICT_SHAPES[focus]);
  if (!s) return GOA;
  const [x0, y0, x1, y1] = s.b,
    pad = Math.max(x1 - x0, y1 - y0) * 0.06;
  return [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
}
function useSize(ref) {
  const [z, set] = React.useState({
    w: 0,
    h: 0
  });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const u = () => set({
      w: el.clientWidth,
      h: el.clientHeight
    });
    u();
    const ro = new ResizeObserver(u);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return z;
}
const hk = id => __ds_scope.houseOf(__ds_scope.getPlace(id)).key;
function GoaMap({
  focus = null,
  selected = null,
  hot = null,
  script = 'deva',
  onSelect,
  onHot,
  insetTop = 0,
  insetBottom = 0,
  insetLeft = 0,
  insetRight = 0,
  paintIn = false,
  style
}) {
  const reduce = __ds_scope.useReducedMotion();
  const ref = React.useRef(null),
    stage = React.useRef(null),
    prev = React.useRef(null),
    drag = React.useRef(null);
  const {
    w,
    h
  } = useSize(ref);
  const [painted, setPainted] = React.useState(() => new Set(paintIn && !reduce ? [] : TIDS));
  const [scrub, setScrub] = React.useState(null);
  React.useEffect(() => {
    if (!paintIn || reduce) {
      setPainted(new Set(TIDS));
      return;
    }
    const order = TIDS.slice().sort((a, b) => __ds_scope.TALUKA_SHAPES[a].lp[1] - __ds_scope.TALUKA_SHAPES[b].lp[1]);
    const t = order.map((id, i) => setTimeout(() => setPainted(p => new Set([...p, id])), 200 + i * 60));
    return () => t.forEach(clearTimeout);
  }, [paintIn, reduce]);
  const box = boxFor(focus),
    bw = box[2] - box[0],
    bh = box[3] - box[1];
  const aw = Math.max(1, w - insetLeft - insetRight - 24),
    ah = Math.max(1, h - insetTop - insetBottom);
  const s = w && h ? Math.min(aw / bw, ah / bh) : 0;
  const ox = insetLeft + 12 + (aw - bw * s) / 2 - box[0] * s,
    oy = insetTop + (ah - bh * s) / 2 - box[1] * s;
  const P = ([x, y]) => [x * s + ox, y * s + oy];

  /* one composited transform from the old view to the new one */
  React.useLayoutEffect(() => {
    const el = stage.current,
      pv = prev.current;
    if (el && pv && pv.s && s && !reduce && (pv.focus !== focus || Math.abs(pv.oy - oy) > 1 || Math.abs(pv.s - s) > 0.001)) {
      const k = pv.s / s;
      el.style.transition = 'none';
      el.style.transform = `translate(${pv.ox - ox * k}px,${pv.oy - oy * k}px) scale(${k})`;
      el.getBoundingClientRect();
      el.style.transition = `transform ${pv.focus !== focus ? 'var(--dur-zoom)' : 'var(--dur-sheet)'} var(--ease-out)`;
      el.style.transform = 'none';
    }
    prev.current = {
      focus,
      s,
      ox,
      oy
    };
  }, [focus, s, ox, oy, reduce]);
  const fp = focus ? __ds_scope.getPlace(focus) : null;
  const level = fp ? fp.level : 'state';
  const dOf = id => __ds_scope.TALUKA_SHAPES[id].district;
  const active = hot || selected;
  const lit = id => {
    if (level === 'state') return !active || dOf(id) === active;
    if (level === 'district') return dOf(id) === focus && (!active || active === id);
    return id === focus;
  };
  const unitAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const u = el && el.closest && el.closest('[data-unit]');
    return u ? u.getAttribute('data-unit') : null;
  };
  const down = e => {
    if (e.button > 0 || e.target.closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      moved: false,
      u: unitAt(e.clientX, e.clientY)
    };
  };
  const move = e => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 8) return;
    d.moved = true;
    d.u = unitAt(e.clientX, e.clientY);
    const r = ref.current.getBoundingClientRect();
    setScrub({
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      u: d.u
    });
    onHot && onHot(d.u);
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setScrub(null);
    onHot && onHot(null);
    if (d.u && onSelect) onSelect(d.u, d.moved);
  };
  const units = level === 'state' ? DIDS.map(id => [id, __ds_scope.DISTRICT_SHAPES[id].d]) : level === 'district' ? TIDS.filter(id => dOf(id) === focus).map(id => [id, __ds_scope.TALUKA_SHAPES[id].d]) : __ds_scope.VILLAGES.filter(v => v.t === focus).map(v => ['v' + v.id, v.d]);
  const labelIds = level === 'state' ? TIDS : level === 'district' ? TIDS.filter(id => dOf(id) === focus) : [];
  const inv = s ? 1 / s : 1;
  const selV = level === 'taluka' && active && active[0] === 'v' ? __ds_scope.getPlace(active) : null;
  const scrubP = scrub && scrub.u ? __ds_scope.getPlace(scrub.u) : null;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    role: "group",
    "aria-label": "Map of Goa",
    onPointerDown: down,
    onPointerMove: move,
    onPointerUp: up,
    onPointerCancel: up,
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      touchAction: 'none',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: stage,
    style: {
      position: 'absolute',
      inset: 0,
      transformOrigin: '0 0'
    }
  }, s > 0 && /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("defs", null, TIDS.map(id => {
    const b = __ds_scope.TALUKA_SHAPES[id].b;
    return /*#__PURE__*/React.createElement("clipPath", {
      key: id,
      id: 'khoim-paint-' + id,
      clipPathUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("rect", {
      x: b[0] - 4,
      y: b[1] - 4,
      width: b[2] - b[0] + 8,
      height: b[3] - b[1] + 8,
      style: {
        transformBox: 'fill-box',
        transformOrigin: '0% 50%',
        transform: painted.has(id) ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform var(--dur-paint) var(--ease-out)'
      }
    }));
  })), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${ox},${oy}) scale(${s})`
  }, TIDS.map(id => /*#__PURE__*/React.createElement("path", {
    key: 'e' + id,
    d: __ds_scope.TALUKA_SHAPES[id].d,
    fill: "var(--map-empty)",
    stroke: "var(--map-edge)",
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke"
  })), TIDS.map(id => {
    const k = hk(id);
    return /*#__PURE__*/React.createElement("path", {
      key: id,
      d: __ds_scope.TALUKA_SHAPES[id].d,
      clipPath: `url(#khoim-paint-${id})`,
      fill: lit(id) ? `var(--house-${k})` : `var(--map-${k}-dim)`,
      stroke: "var(--trim)",
      strokeWidth: level === 'state' ? 2.5 : 3,
      strokeLinejoin: "round",
      vectorEffect: "non-scaling-stroke",
      style: {
        transition: 'fill var(--dur-base) var(--ease-out)'
      }
    });
  }), level === 'taluka' && __ds_scope.VILLAGES.filter(v => v.t === focus).map(v => /*#__PURE__*/React.createElement("path", {
    key: 'vp' + v.id,
    d: v.d,
    fill: "none",
    stroke: "var(--trim)",
    strokeOpacity: 0.45,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke"
  })), level === 'taluka' && __ds_scope.VILLAGES.filter(v => v.t === focus).map(v => {
    const on = 'v' + v.id === active;
    return /*#__PURE__*/React.createElement("circle", {
      key: 'vd' + v.id,
      cx: v.lp[0],
      cy: v.lp[1],
      r: (on ? 9 : v.town ? 5 : 4) * inv,
      fill: "var(--trim)",
      stroke: on ? `var(--house-${hk(focus)}-on)` : 'none',
      strokeWidth: 3 * inv
    });
  }), units.map(([id, d]) => /*#__PURE__*/React.createElement("path", {
    key: 'h' + id,
    "data-unit": id,
    d: d,
    fill: "transparent",
    style: {
      cursor: 'pointer'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, s > 0 && labelIds.map(id => {
    const p = __ds_scope.getPlace(id),
      n = __ds_scope.nameIn(p, script),
      k = hk(id),
      on = lit(id),
      nd = NUDGE[id] || [0, 0];
    const [x, y] = P([__ds_scope.TALUKA_SHAPES[id].lp[0] + nd[0], __ds_scope.TALUKA_SHAPES[id].lp[1] + nd[1]]);
    const big = level === 'district',
      size = big ? active === id ? 24 : 20 : active && dOf(id) === active ? 15 : 14;
    const target = level === 'state' ? dOf(id) : id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      type: "button",
      lang: n.kind === 'deva' ? 'gom' : undefined,
      "aria-label": level === 'state' ? __ds_scope.spokenName(__ds_scope.getPlace(target)) + ' Includes ' + p.official + '.' : __ds_scope.spokenName(p),
      "aria-pressed": selected === target,
      onClick: () => onSelect && onSelect(target, false),
      style: {
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'auto',
        border: 0,
        background: 'transparent',
        padding: '6px 8px',
        borderRadius: 'var(--radius-s)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        visibility: painted.has(id) ? 'visible' : 'hidden',
        color: on ? `var(--house-${k}-on)` : 'var(--text)',
        font: `var(--weight-strong) ${n.fallback ? size - 2 : size}px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`,
        transition: 'color var(--dur-base) var(--ease-out)'
      }
    }, n.text);
  }), selV && (() => {
    const [x, y] = P(selV.lp);
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: x,
        top: y - 20,
        transform: 'translate(-50%,-100%)',
        background: 'var(--surface-raised)',
        color: 'var(--text)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-m)',
        font: 'var(--weight-strong) 15px/1.4 var(--font-latin)',
        whiteSpace: 'nowrap',
        boxShadow: 'var(--shadow-2)'
      }
    }, selV.official);
  })())), scrubP && /*#__PURE__*/React.createElement(Loupe, {
    p: scrubP,
    x: scrub.x,
    y: scrub.y,
    w: w,
    script: script
  }));
}
function Loupe({
  p,
  x,
  y,
  w,
  script
}) {
  const hs = __ds_scope.houseOf(p),
    n = __ds_scope.nameIn(p, script === 'official' ? 'deva' : script);
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: Math.max(12, Math.min(w - 232, x - 110)),
      top: Math.max(8, y - 150),
      width: 220,
      pointerEvents: 'none',
      background: hs.bg,
      color: hs.on,
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--trim-inset)',
      boxShadow: 'var(--shadow-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: 'var(--trim-width) solid currentColor',
      borderRadius: 'var(--radius-l)',
      padding: '6px 12px 8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    lang: n.kind === 'deva' ? 'gom' : undefined,
    style: {
      font: `var(--weight-strong) ${n.kind === 'deva' ? 32 : 26}px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`
    }
  }, n.text), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-regular) 15px/1.35 var(--font-latin)'
    }
  }, p.romi && n.kind === 'deva' ? p.romi + ' · ' : '', p.official)));
}
Object.assign(__ds_scope, { GoaMap });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/map/GoaMap.jsx", error: String((e && e.message) || e) }); }

// components/place/PendingName.jsx
try { (() => {
/* A name we do not have yet, drawn as an oyster-shell (carepa) window: panes of light, no glass. */
function PendingName({
  label = 'Konkani name not recorded yet',
  ink = 'currentColor',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "note",
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-l)',
      padding: 6,
      border: '2px solid ' + ink,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(8,1fr)',
      gap: 3
    }
  }, Array.from({
    length: 16
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      aspectRatio: '1',
      borderRadius: 3,
      background: 'rgba(255,255,255,.5)',
      animation: `khoim-shell 4.2s ${i % 8 * 0.14 + Math.floor(i / 8) * 0.35}s ease-in-out infinite`
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--surface-raised)',
      color: 'var(--text)',
      padding: '4px 12px',
      borderRadius: 'var(--radius-s)',
      font: 'var(--weight-strong) 15px/1.4 var(--font-latin)'
    }
  }, label)));
}
Object.assign(__ds_scope, { PendingName });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/place/PendingName.jsx", error: String((e && e.message) || e) }); }

// components/place/PlaceStrip.jsx
try { (() => {
/* Sideways list of the places inside the current level. Swiping or focusing moves the highlight on the map. */
function PlaceStrip({
  parent,
  script = 'deva',
  active,
  onFocusPlace,
  onPick,
  style
}) {
  const fp = __ds_scope.getPlace(parent || 'goa');
  const items = __ds_scope.childrenOf(parent);
  const village = fp && fp.level === 'taluka';
  const ref = React.useRef(null);
  const moved = React.useRef(false);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    if (!moved.current) return;
    const i = Math.round(el.scrollLeft / 152);
    const it = items[Math.max(0, Math.min(items.length - 1, i))];
    if (it && it.id !== active && onFocusPlace) onFocusPlace(it.id);
  };
  const heading = __ds_scope.nameIn(fp, script);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      flexWrap: 'wrap',
      gap: '0 10px',
      padding: '0 var(--gutter)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    lang: heading.kind === 'deva' ? 'gom' : undefined,
    style: {
      font: `var(--weight-strong) ${heading.kind === 'deva' ? 30 : 26}px/1.5 ${heading.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`
    }
  }, heading.text), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) 16px/1.4 var(--font-latin)',
      whiteSpace: 'nowrap'
    }
  }, items.length, " ", village ? 'villages' : fp.level === 'state' ? 'districts' : 'talukas')), /*#__PURE__*/React.createElement("ul", {
    ref: ref,
    onScroll: onScroll,
    onPointerDown: () => {
      moved.current = true;
    },
    onWheel: () => {
      moved.current = true;
    },
    onTouchStart: () => {
      moved.current = true;
    },
    "aria-label": 'Places in ' + fp.official,
    style: {
      listStyle: 'none',
      margin: 0,
      display: 'flex',
      gap: 10,
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      scrollPaddingInline: 'var(--gutter)',
      padding: '4px var(--gutter) 8px',
      scrollbarWidth: 'none',
      touchAction: 'pan-x'
    }
  }, items.map(it => {
    const hs = __ds_scope.houseOf(it),
      on = it.id === active,
      n = __ds_scope.nameIn(it, script);
    const bg = village ? 'var(--surface-raised)' : hs.bg,
      ink = village ? 'var(--text)' : hs.on;
    return /*#__PURE__*/React.createElement("li", {
      key: it.id,
      style: {
        flex: '0 0 142px',
        scrollSnapAlign: 'start'
      }
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => onPick && onPick(it.id),
      onFocus: () => onFocusPlace && onFocusPlace(it.id),
      "aria-current": on || undefined,
      style: {
        width: '100%',
        height: 100,
        borderRadius: 'var(--radius-l)',
        border: village ? '2px solid ' + (on ? 'var(--text)' : 'var(--line)') : 0,
        background: bg,
        color: ink,
        padding: village ? '8px 12px' : 5,
        cursor: 'pointer',
        textAlign: 'left',
        transform: on ? 'translateY(-4px)' : 'none',
        transition: 'transform var(--dur-fast) var(--ease-out), border-color var(--dur-fast)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'grid',
        alignContent: 'space-between',
        height: '100%',
        borderRadius: 'var(--radius-m)',
        border: village ? 0 : 'var(--trim-width) solid currentColor',
        padding: village ? 0 : '6px 10px'
      }
    }, village ? /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-strong) 18px/1.25 var(--font-latin)'
      }
    }, it.official) : /*#__PURE__*/React.createElement("span", {
      lang: n.kind === 'deva' ? 'gom' : undefined,
      style: {
        font: `var(--weight-strong) ${n.kind === 'deva' ? 24 : 18}px/1.5 ${n.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`
      }
    }, n.text), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-regular) 14px/1.3 var(--font-latin)'
      }
    }, village ? 'Official name only' : n.kind === 'official' ? it.romi || '' : it.official))));
  })));
}
Object.assign(__ds_scope, { PlaceStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/place/PlaceStrip.jsx", error: String((e && e.message) || e) }); }

// components/place/SayIt.jsx
try { (() => {
/* The say-it guide as beats. Tap to step through the syllables at a steady beat, like a ghumot. */
function SayIt({
  say,
  note,
  reviewed = false,
  ink = 'currentColor',
  paper = 'var(--surface-raised)',
  style
}) {
  const reduce = __ds_scope.useReducedMotion();
  const parts = __ds_scope.sayParts(say);
  const [beat, setBeat] = React.useState(-1);
  const t = React.useRef([]);
  React.useEffect(() => () => t.current.forEach(clearTimeout), []);
  const play = () => {
    t.current.forEach(clearTimeout);
    t.current = parts.map((_, i) => setTimeout(() => setBeat(i), i * 420));
    t.current.push(setTimeout(() => setBeat(-1), parts.length * 420 + 200));
  };
  if (!say) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: play,
    "aria-label": 'Say it: ' + say + '. Show the beat',
    style: {
      border: 0,
      background: 'transparent',
      padding: 0,
      color: ink,
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      borderRadius: 'var(--radius-m)'
    }
  }, parts.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    "aria-hidden": "true",
    style: {
      padding: '6px 14px',
      borderRadius: 'var(--radius-m)',
      border: '2px solid ' + ink,
      font: `${p.stressed ? 'var(--weight-heavy)' : 'var(--weight-regular)'} ${p.stressed ? 30 : 24}px/1.25 var(--font-latin)`,
      background: beat === i ? ink : 'transparent',
      color: beat === i ? paper : ink,
      transform: beat === i && !reduce ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out), background-color var(--dur-press) linear, color var(--dur-press) linear'
    }
  }, p.text))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: ink,
      font: 'var(--weight-regular) 16px/1.5 var(--font-latin)'
    }
  }, 'Rough guide' + (note ? ', ' + note : '') + '. ' + (reviewed ? 'Checked by a speaker.' : 'Not yet checked by a speaker.')));
}
Object.assign(__ds_scope, { SayIt });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/place/SayIt.jsx", error: String((e && e.message) || e) }); }

// components/place/PlaceCard.jsx
try { (() => {
const Rule = () => /*#__PURE__*/React.createElement("hr", {
  "aria-hidden": "true",
  style: {
    border: 0,
    borderTop: '1px solid currentColor',
    opacity: .35,
    margin: 0
  }
});
function Row({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6,
      padding: '16px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-strong) 14px/1.3 var(--font-latin)'
    }
  }, label), children);
}
function PlaceCard({
  place,
  expanded = false,
  onExpand,
  onClose,
  onGoInside,
  onSuggest,
  recordings,
  headingLevel = 2,
  style
}) {
  const p = typeof place === 'string' ? __ds_scope.getPlace(place) : place;
  const [showSrc, setShowSrc] = React.useState(false);
  if (!p) return null;
  const hs = __ds_scope.houseOf(p),
    ink = hs.on,
    paper = hs.bg;
  const H = 'h' + headingLevel;
  const kids = p.level !== 'village' ? __ds_scope.childrenOf(p.id).length : 0;
  const inside = p.level !== 'village' && onGoInside;
  const body = {
    font: 'var(--weight-regular) var(--size-body)/1.5 var(--font-latin)',
    margin: 0
  };
  return /*#__PURE__*/React.createElement("article", {
    "aria-label": p.official,
    style: {
      color: ink,
      display: 'grid',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: 'var(--trim-width) solid currentColor',
      borderRadius: 'var(--radius-xl)',
      padding: '14px 16px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-strong) 15px/1.3 var(--font-latin)'
    }
  }, __ds_scope.whereLabel(p)), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    tone: "soft",
    ink: ink,
    size: 44,
    onClick: onClose
  })), /*#__PURE__*/React.createElement(H, {
    style: {
      margin: 0
    }
  }, p.deva ? /*#__PURE__*/React.createElement("span", {
    lang: "gom",
    style: {
      display: 'block',
      font: `var(--weight-strong) ${expanded ? 'var(--size-name-hero)' : 'var(--size-name-xl)'}/1.5 var(--font-deva)`,
      marginTop: 4,
      transition: 'font-size var(--dur-sheet) var(--ease-standard)'
    }
  }, p.deva) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: `var(--weight-strong) ${expanded ? 64 : 48}px/1.25 var(--font-latin)`,
      margin: '8px 0 10px'
    }
  }, p.official)), p.deva && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '2px 14px'
    }
  }, p.romi ? /*#__PURE__*/React.createElement("span", {
    lang: "gom-Latn",
    style: {
      font: `var(--weight-strong) ${expanded ? 'var(--size-name-l)' : 'var(--size-name-m)'}/1.3 var(--font-latin)`
    }
  }, p.romi) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) 17px/1.4 var(--font-latin)'
    }
  }, "Romi not recorded yet"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) 18px/1.3 var(--font-latin)'
    }
  }, p.official)), !p.deva && /*#__PURE__*/React.createElement(__ds_scope.PendingName, {
    ink: ink,
    label: p.pendingNote ? 'Spelling not settled yet' : 'Konkani name not recorded yet'
  })), !expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: inside ? '1fr 1fr' : '1fr',
      gap: 10,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    ink: ink,
    onClick: onExpand
  }, p.say ? 'How to say it' : 'All names'), inside && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    ink: ink,
    paper: paper,
    iconAfter: "arrow-right",
    onClick: () => onGoInside(p.id)
  }, "Go inside")), expanded && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      animation: 'khoim-rise var(--dur-base) var(--ease-out) both'
    }
  }, p.say ? /*#__PURE__*/React.createElement(Row, {
    label: "Say it"
  }, /*#__PURE__*/React.createElement(__ds_scope.SayIt, {
    say: p.say,
    note: p.sayNote,
    reviewed: p.reviewed,
    ink: ink,
    paper: paper
  }), /*#__PURE__*/React.createElement(__ds_scope.VoiceClip, {
    recordings: recordings,
    ink: ink,
    paper: paper,
    placeName: p.official
  })) : /*#__PURE__*/React.createElement(Row, {
    label: "Konkani name"
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, p.pendingNote || `Know what ${p.official} is called in Konkani? Tell us how your family says it.`), onSuggest && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    ink: ink,
    paper: paper,
    icon: "mail",
    onClick: onSuggest
  }, "Tell us"))), /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(Row, {
    label: "Sources"
  }, /*#__PURE__*/React.createElement(__ds_scope.SourceStatus, {
    status: p.status,
    color: ink
  }), p.sourceNote && /*#__PURE__*/React.createElement("p", {
    style: body
  }, p.sourceNote), p.sources && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-expanded": showSrc,
    onClick: () => setShowSrc(!showSrc),
    style: {
      justifySelf: 'start',
      border: 0,
      background: 'transparent',
      color: ink,
      padding: '8px 0',
      font: 'var(--weight-strong) 16px/1.5 var(--font-latin)',
      textDecoration: 'underline',
      textUnderlineOffset: 4,
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, showSrc ? 'Hide sources' : 'Where this comes from'), showSrc && /*#__PURE__*/React.createElement("p", {
    style: body
  }, p.sources)), p.alsoWritten && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(Row, {
    label: "Also written"
  }, /*#__PURE__*/React.createElement("span", {
    lang: "gom",
    style: {
      font: 'var(--weight-regular) 22px/1.6 var(--font-deva)'
    }
  }, p.alsoWritten.join(', ')))), p.marathi && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(Row, {
    label: "In Marathi"
  }, /*#__PURE__*/React.createElement("span", {
    lang: "mr",
    style: {
      font: 'var(--weight-regular) 22px/1.6 var(--font-deva)'
    }
  }, p.marathi))), p.officialNote && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(Row, {
    label: "Official spelling"
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, p.official, ". ", p.officialNote, "."))), p.hq && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(Row, {
    label: "Headquarters"
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, p.hq))), p.facts && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Rule, null), p.facts.map(f => /*#__PURE__*/React.createElement(Row, {
    key: f,
    label: "Worth knowing"
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, f, ".")))), p.level === 'village' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Rule, null), /*#__PURE__*/React.createElement(Row, {
    label: "Boundary"
  }, /*#__PURE__*/React.createElement("p", {
    style: body
  }, p.boundarySource === 'SOI' ? 'Survey of India' : 'Local Government Directory', p.lgd ? ', LGD code ' + p.lgd : '', p.town ? '. Census town' : '', "."))), inside && /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    full: true,
    ink: ink,
    paper: paper,
    iconAfter: "arrow-right",
    onClick: () => onGoInside(p.id)
  }, `Go inside, ${kids} ${p.level === 'taluka' ? 'villages' : 'talukas'}`))));
}
Object.assign(__ds_scope, { PlaceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/place/PlaceCard.jsx", error: String((e && e.message) || e) }); }

// components/place/Sheet.jsx
try { (() => {
/* Bottom sheet with two snap points. Drag the handle (or anywhere when collapsed), tap the handle, or use Escape. */
function Sheet({
  snap = 'peek',
  onSnap,
  peek = 280,
  top = 56,
  height = 844,
  bg = 'var(--surface-raised)',
  ink = 'var(--text)',
  label,
  children,
  style
}) {
  const reduce = __ds_scope.useReducedMotion();
  const box = React.useRef(null),
    d = React.useRef(null);
  const [dy, setDy] = React.useState(0);
  const H = height - top,
    base = snap === 'full' ? 0 : H - peek;
  const start = e => {
    const sc = box.current.querySelector('[data-sheet-scroll]');
    if (snap === 'full' && sc && sc.scrollTop > 0 && !e.target.closest('[data-sheet-handle]')) return;
    if (e.target.closest('button,a,input') && !e.target.closest('[data-sheet-handle]')) return;
    d.current = {
      y: e.clientY,
      t: performance.now()
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = e => {
    if (d.current) setDy(Math.max(-base, e.clientY - d.current.y));
  };
  const end = e => {
    if (!d.current) return;
    const m = e.clientY - d.current.y,
      v = m / Math.max(1, performance.now() - d.current.t);
    d.current = null;
    setDy(0);
    if (Math.abs(m) < 6) return;
    if (snap !== 'full' && (m < -48 || v < -0.4)) onSnap('full');else if (snap === 'full' && (m > 72 || v > 0.5)) onSnap('peek');else if (snap !== 'full' && (m > 64 || v > 0.5)) onSnap('closed');
  };
  return /*#__PURE__*/React.createElement("section", {
    ref: box,
    role: "dialog",
    "aria-modal": "false",
    "aria-label": label,
    onKeyDown: e => {
      if (e.key === 'Escape') onSnap('closed');
    },
    onPointerDown: start,
    onPointerMove: move,
    onPointerUp: end,
    onPointerCancel: end,
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top,
      height: H,
      zIndex: 'var(--z-sheet)',
      transform: `translateY(${base + dy}px)`,
      transition: dy ? 'none' : reduce ? 'none' : 'transform var(--dur-sheet) var(--ease-standard)',
      background: bg,
      color: ink,
      borderRadius: 'var(--radius-sheet) var(--radius-sheet) 0 0',
      boxShadow: 'var(--shadow-sheet)',
      display: 'grid',
      gridTemplateRows: 'auto minmax(0,1fr)',
      touchAction: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "data-sheet-handle": "1",
    "aria-expanded": snap === 'full',
    "aria-label": snap === 'full' ? 'Show less' : 'Show more',
    onClick: () => onSnap(snap === 'full' ? 'peek' : 'full'),
    style: {
      height: 28,
      border: 0,
      background: 'transparent',
      color: 'inherit',
      display: 'grid',
      placeItems: 'center',
      cursor: 'grab',
      borderRadius: 'var(--radius-sheet) var(--radius-sheet) 0 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 40,
      height: 5,
      borderRadius: 3,
      background: 'currentColor'
    }
  })), /*#__PURE__*/React.createElement("div", {
    "data-sheet-scroll": "1",
    style: {
      overflowY: snap === 'full' ? 'auto' : 'hidden',
      touchAction: snap === 'full' ? 'pan-y' : 'none',
      overscrollBehavior: 'contain'
    }
  }, children));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/place/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/search/SearchField.jsx
try { (() => {
function SearchField({
  value = '',
  onChange,
  onCancel,
  autoFocus = false,
  placeholder = 'Canacona, काणकोण, Kannkonn',
  label = 'Search any name, in any script',
  inputRef,
  style
}) {
  const id = React.useId ? React.useId() : 'khoim-q';
  return /*#__PURE__*/React.createElement("div", {
    role: "search",
    style: {
      display: 'grid',
      gridTemplateColumns: onCancel ? 'minmax(0,1fr) auto' : '1fr',
      gap: 8,
      alignItems: 'center',
      ...style
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    "data-khoim-field": "1",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 56,
      borderRadius: 'var(--radius-l)',
      background: 'var(--surface-raised)',
      padding: '0 16px',
      boxShadow: 'var(--shadow-1)',
      color: 'var(--text)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 20
  }), /*#__PURE__*/React.createElement("input", {
    id: id,
    ref: inputRef,
    type: "search",
    enterKeyHint: "search",
    autoComplete: "off",
    autoCapitalize: "off",
    spellCheck: false,
    value: value,
    autoFocus: autoFocus,
    placeholder: placeholder,
    onChange: e => onChange && onChange(e.target.value),
    style: {
      flex: 1,
      minWidth: 0,
      height: '100%',
      border: 0,
      outline: 'none',
      background: 'transparent',
      color: 'var(--text)',
      font: 'var(--weight-regular) 19px/1.5 var(--font-deva)'
    }
  })), onCancel && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCancel,
    style: {
      height: 56,
      border: 0,
      background: 'transparent',
      color: 'var(--text)',
      font: 'var(--weight-strong) 17px/1 var(--font-latin)',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-m)'
    }
  }, "Cancel"));
}
Object.assign(__ds_scope, { SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/search/SearchField.jsx", error: String((e && e.message) || e) }); }

// components/search/SearchResults.jsx
try { (() => {
function mark(text, q) {
  const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const f = fold(text),
    i = f.indexOf(fold(q.trim()));
  if (i < 0 || f.length !== text.length) return text;
  const n = q.trim().length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, text.slice(0, i), /*#__PURE__*/React.createElement("mark", {
    style: {
      background: 'var(--mark)',
      color: 'inherit',
      borderRadius: 4,
      padding: '0 1px'
    }
  }, text.slice(i, i + n)), text.slice(i + n));
}
function SearchResults({
  query = '',
  onPick,
  limit = 16,
  style
}) {
  const reduce = __ds_scope.useReducedMotion();
  const res = __ds_scope.searchPlaces(query, limit);
  const note = {
    margin: '8px 4px',
    font: 'var(--weight-regular) 17px/1.5 var(--font-latin)',
    color: 'var(--text)'
  };
  if (!query.trim()) return /*#__PURE__*/React.createElement("p", {
    style: {
      ...note,
      ...style
    }
  }, "Type a name the way you know it. Official spelling, \u0926\u0947\u0935\u0928\u093E\u0917\u0930\u0940 or Romi all work.");
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, /*#__PURE__*/React.createElement("p", {
    role: "status",
    "aria-live": "polite",
    style: {
      ...note,
      fontSize: 15,
      margin: '4px 4px 10px'
    }
  }, res.length ? `${res.length} ${res.length === 1 ? 'place' : 'places'}` : `Nothing for "${query}" yet. Try the official spelling.`), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'grid',
      gap: 8
    }
  }, res.map(({
    place: p,
    field
  }, i) => /*#__PURE__*/React.createElement("li", {
    key: p.id,
    style: {
      animation: reduce ? 'none' : `khoim-rise var(--dur-base) var(--ease-out) ${Math.min(i, 8) * 30}ms both`
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onPick && onPick(p.id),
    style: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '10px minmax(0,1fr)',
      gap: 14,
      alignItems: 'stretch',
      textAlign: 'left',
      border: 0,
      borderRadius: 'var(--radius-l)',
      background: 'var(--surface-raised)',
      padding: '12px 14px 12px 12px',
      cursor: 'pointer',
      color: 'var(--text)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      borderRadius: 5,
      background: __ds_scope.houseOf(p).bg
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 2
    }
  }, p.deva ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '0 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    lang: "gom",
    style: {
      font: 'var(--weight-strong) 28px/1.5 var(--font-deva)'
    }
  }, field === 'deva' ? mark(p.deva, query) : p.deva), p.romi && /*#__PURE__*/React.createElement("span", {
    lang: "gom-Latn",
    style: {
      font: 'var(--weight-strong) 21px/1.3 var(--font-latin)'
    }
  }, field === 'romi' ? mark(p.romi, query) : p.romi)) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-strong) 21px/1.4 var(--font-latin)'
    }
  }, mark(p.official, query)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-regular) 15px/1.4 var(--font-latin)'
    }
  }, p.deva ? /*#__PURE__*/React.createElement(React.Fragment, null, field === 'official' ? mark(p.official, query) : p.official, " \xB7 ") : 'Official name only · ', __ds_scope.whereLabel(p))))))));
}
Object.assign(__ds_scope, { SearchResults });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/search/SearchResults.jsx", error: String((e && e.message) || e) }); }

// ui_kits/khoim/More.jsx
try { (() => {
/* About, help and layers: the "More" screen. Copy from the current draft site, verbatim where it existed. */
function KhoimMore({
  open,
  onClose,
  theme,
  onTheme,
  layer,
  onLayer,
  desktop
}) {
  const {
    LayerSwitch,
    Credit,
    DraftBanner,
    Wordmark,
    IconButton,
    Button
  } = KN;
  const h2 = {
    margin: '0 0 8px',
    font: 'var(--weight-strong) 24px/1.25 var(--font-latin)'
  };
  const p = {
    margin: '0 0 12px',
    font: 'var(--weight-regular) var(--size-body)/1.55 var(--font-latin)',
    maxWidth: '60ch',
    textWrap: 'pretty'
  };
  const sec = {
    padding: '24px 0',
    borderTop: '1px solid var(--line)'
  };
  const roles = [['Konkani reviewers', 'Look over the Konkani names for your taluka in Devanagari or Romi. Fix what\'s wrong and tell us how your family says it. A phone is enough.'], ['Voice recorders', 'Record yourself saying the names of your village and the places around it. A phone in a quiet room works. Older voices especially welcome. Credit is optional.'], ['Archivists, musicians', 'Send old maps, gazetteers or parish registers showing how a place name was spelt over time. If you sing mando or dulpod, tell us where songs belong.'], ['Developers, designers', 'The data is open. We need the map to work offline and on slow networks, and Devanagari and Romi to read well on older budget Android phones.']];
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "About Khoim",
    "aria-hidden": !open,
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 'var(--z-search)',
      background: 'var(--surface)',
      color: 'var(--text)',
      display: 'grid',
      gridTemplateRows: 'auto minmax(0,1fr)',
      transform: open ? 'none' : 'translateY(104%)',
      visibility: open ? 'visible' : 'hidden',
      transition: 'transform var(--dur-sheet) var(--ease-standard), visibility 0s linear ' + (open ? '0s' : 'var(--dur-sheet)')
    }
  }, /*#__PURE__*/React.createElement(DraftBanner, {
    onTellUs: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      padding: desktop ? '24px 48px 48px' : '16px var(--gutter) 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: theme === 'dark' ? 'sun' : 'moon',
    label: theme === 'dark' ? 'Use light colours' : 'Use dark colours',
    onClick: onTheme
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      ...p,
      marginTop: 4,
      fontSize: 'var(--size-lead)'
    }
  }, "Khoim means \"where\" in Konkani. Every taluka in Goa, with its Konkani name and how to say it."), /*#__PURE__*/React.createElement("section", {
    style: sec,
    "aria-labelledby": "k-layers"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "k-layers",
    style: h2
  }, "Layers"), /*#__PURE__*/React.createElement("p", {
    style: p
  }, "Names are live. The rest are coming, one at a time, each credited to the people who give them."), /*#__PURE__*/React.createElement(LayerSwitch, {
    value: layer,
    onChange: onLayer
  })), /*#__PURE__*/React.createElement("section", {
    style: sec,
    "aria-labelledby": "k-why"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "k-why",
    style: h2
  }, "Why Khoim"), /*#__PURE__*/React.createElement("p", {
    style: p
  }, "Most places in Goa have an official spelling and a Konkani name, and the two often don't match. Canacona is ", /*#__PURE__*/React.createElement("span", {
    lang: "gom",
    style: {
      fontFamily: 'var(--font-deva)'
    }
  }, "\u0915\u093E\u0923\u0915\u094B\u0923"), ", written Kannkonn in Romi. Many official spellings come from Portuguese-era records and are what you see on boards, maps and bills."), /*#__PURE__*/React.createElement("p", {
    style: p
  }, "If you grew up here you know both. A Goan kid growing up in Pune or Toronto often doesn't, and neither does someone who moved here last year.")), /*#__PURE__*/React.createElement("section", {
    style: sec,
    "aria-labelledby": "k-src"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "k-src",
    style: h2
  }, "Where the names come from"), /*#__PURE__*/React.createElement("p", {
    style: p
  }, "District, taluka and village names and boundaries come from the Local Government Directory (LGD) of the Government of India, spelt exactly as the government spells them."), /*#__PURE__*/React.createElement("p", {
    style: p
  }, "The Konkani names for districts and talukas come from the district websites of Goa and published Konkani sources. For Bardez, Tiswadi, Salcete, Quepem and South Goa those sources differ, and each of those cards says so. Dharbandora shows only its official name until the Directorate of Official Language confirms the Konkani."), /*#__PURE__*/React.createElement("p", {
    style: p
  }, "The pronunciation guides are our own rough respellings. No Konkani speaker has checked them yet.")), /*#__PURE__*/React.createElement("section", {
    style: sec,
    "aria-labelledby": "k-scripts"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "k-scripts",
    style: h2
  }, "A note on scripts"), /*#__PURE__*/React.createElement("p", {
    style: p
  }, "Konkani is written in Devanagari, the official script under the Goa, Daman and Diu Official Language Act, 1987, and in Romi, the Roman script used in church, in tiatr and in many homes. Khoim shows Devanagari and Romi side by side and doesn't pick between them.")), /*#__PURE__*/React.createElement("section", {
    style: sec,
    "aria-labelledby": "k-help"
  }, /*#__PURE__*/React.createElement("h2", {
    id: "k-help",
    style: h2
  }, "Help us"), /*#__PURE__*/React.createElement("p", {
    style: p
  }, "Write to us at ", /*#__PURE__*/React.createElement("strong", null, "hello@khoim.in"), ". Everyone who contributes is credited by name, if they want to be."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: desktop ? '1fr 1fr' : '1fr',
      gap: 10,
      margin: '8px 0 16px'
    }
  }, roles.map(([t, d]) => /*#__PURE__*/React.createElement("article", {
    key: t,
    style: {
      background: 'var(--surface-raised)',
      borderRadius: 'var(--radius-l)',
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 4px',
      font: 'var(--weight-strong) 18px/1.3 var(--font-latin)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      ...p,
      margin: 0,
      fontSize: 16
    }
  }, d)))), /*#__PURE__*/React.createElement(Button, {
    icon: "mail",
    onClick: () => {}
  }, "Write to us")), /*#__PURE__*/React.createElement("section", {
    style: sec
  }, /*#__PURE__*/React.createElement(Credit, {
    full: true
  })))));
}
Object.assign(window, {
  KhoimMore
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/khoim/More.jsx", error: String((e && e.message) || e) }); }

// ui_kits/khoim/Screens.jsx
try { (() => {
/* Khoim phone (390 x 844) and desktop (1280 x 800) layouts. */
function KhoimSearchScreen({
  k,
  top = 54
}) {
  const {
    SearchField,
    SearchResults
  } = KN;
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (k.search && ref.current) setTimeout(() => ref.current.focus({
      preventScroll: true
    }), 320);
  }, [k.search]);
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Search",
    "aria-hidden": !k.search,
    onKeyDown: e => e.key === 'Escape' && k.closeSearch(),
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 'var(--z-search)',
      background: 'var(--surface)',
      display: 'grid',
      gridTemplateRows: 'auto minmax(0,1fr)',
      transform: k.search ? 'none' : 'translateY(104%)',
      visibility: k.search ? 'visible' : 'hidden',
      transition: 'transform var(--dur-sheet) var(--ease-standard), visibility 0s linear ' + (k.search ? '0s' : 'var(--dur-sheet)')
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `${top}px 16px 12px`
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    inputRef: ref,
    value: k.query,
    onChange: k.setQuery,
    onCancel: k.closeSearch
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      padding: '4px 16px 40px'
    }
  }, k.search && /*#__PURE__*/React.createElement(SearchResults, {
    query: k.query,
    onPick: k.openPlace
  })));
}
function KhoimPhone({
  preset = 1,
  theme,
  onTheme
}) {
  const {
    GoaMap,
    ScriptToggle,
    IconButton,
    Wordmark,
    Sheet,
    PlaceCard,
    PlaceStrip,
    Icon,
    KhoimData: GD
  } = KN;
  const k = useKhoim(preset);
  const P0 = KHOIM_PRESETS[preset] || {};
  const [paintKey, setPaintKey] = React.useState(0);
  React.useEffect(() => setPaintKey(n => n + 1), [preset]);
  const sp = k.selected ? GD.getPlace(k.selected) : null,
    fp = k.focus ? GD.getPlace(k.focus) : null;
  const first = !k.focus && !k.selected;
  const hs = sp ? GD.houseOf(sp) : null;
  const sheet = sp ? 'place' : fp ? 'strip' : null;
  const peek = sheet === 'place' ? sp.deva ? 296 : 336 : sheet === 'strip' ? 200 : 0;
  const nm = fp ? GD.nameIn(fp, k.script) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surface)',
      color: 'var(--text)',
      overflow: 'hidden',
      fontFamily: 'var(--font-latin)'
    }
  }, /*#__PURE__*/React.createElement(GoaMap, {
    key: 'p' + paintKey,
    focus: k.focus,
    selected: k.selected,
    hot: k.hot,
    script: k.script,
    onSelect: k.pick,
    onHot: k.setHot,
    insetTop: first ? 176 : 72,
    insetBottom: sheet ? peek + 8 : 108,
    paintIn: !!P0.intro
  }), /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '14px 16px 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 10,
      zIndex: 'var(--z-chrome)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      minWidth: 0
    }
  }, k.focus || k.selected ? /*#__PURE__*/React.createElement(IconButton, {
    icon: "arrow-left",
    label: fp && fp.parent && fp.parent !== 'goa' ? 'Back to ' + GD.getPlace(fp.parent).official : 'Back to Goa',
    onClick: k.back
  }) : /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: k.openMore,
    "aria-label": "About Khoim",
    style: {
      border: 0,
      background: 'transparent',
      padding: '4px 6px',
      borderRadius: 'var(--radius-m)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 22
  })), nm && /*#__PURE__*/React.createElement("span", {
    lang: nm.kind === 'deva' ? 'gom' : undefined,
    style: {
      font: `var(--weight-strong) 18px/1.5 ${nm.kind === 'deva' ? 'var(--font-deva)' : 'var(--font-latin)'}`,
      whiteSpace: 'nowrap',
      background: 'var(--surface)',
      padding: '0 6px',
      borderRadius: 'var(--radius-s)'
    }
  }, nm.text)), /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: 'auto'
    }
  }, /*#__PURE__*/React.createElement(ScriptToggle, {
    value: k.script,
    onChange: k.setScript,
    width: 206
  }))), /*#__PURE__*/React.createElement("h1", {
    "aria-hidden": !first,
    style: {
      position: 'absolute',
      top: 76,
      left: 20,
      right: 36,
      margin: 0,
      font: 'var(--weight-strong) var(--size-title)/var(--lh-title) var(--font-latin)',
      letterSpacing: 'var(--track-title)',
      textWrap: 'pretty',
      pointerEvents: 'none',
      opacity: first ? 1 : 0,
      visibility: first ? 'visible' : 'hidden',
      transform: first ? 'none' : 'translateY(-10px)',
      transition: 'opacity var(--dur-base) var(--ease-out), transform var(--dur-sheet) var(--ease-out), visibility 0s linear ' + (first ? '0s' : 'var(--dur-base)')
    }
  }, "Every taluka in Goa, with its Konkani name and how to say it."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 20,
      zIndex: 5,
      display: 'grid',
      gap: 10,
      opacity: sheet ? 0 : 1,
      visibility: sheet ? 'hidden' : 'visible',
      transform: sheet ? 'translateY(20px)' : 'none',
      transition: 'opacity var(--dur-fast), transform var(--dur-sheet) var(--ease-standard), visibility 0s linear ' + (sheet ? 'var(--dur-fast)' : '0s')
    }
  }, first && /*#__PURE__*/React.createElement("p", {
    style: {
      justifySelf: 'start',
      margin: 0,
      font: 'var(--weight-strong) 15px/1.2 var(--font-latin)',
      background: 'var(--surface-invert)',
      color: 'var(--text-invert)',
      padding: '10px 12px',
      borderRadius: 'var(--radius-m)'
    }
  }, "Tap a district, or press and drag along Goa"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: k.openSearch,
    style: {
      height: 58,
      borderRadius: 'var(--radius-l)',
      border: 0,
      background: 'var(--surface-raised)',
      boxShadow: 'var(--shadow-2)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 18px',
      font: 'var(--weight-regular) 18px/1 var(--font-latin)',
      color: 'var(--text)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20
  }), "Search any name, any script")), sheet === 'place' && /*#__PURE__*/React.createElement(Sheet, {
    key: 's' + k.selected,
    label: sp.official,
    snap: k.snap,
    onSnap: k.setSnap,
    peek: peek,
    bg: hs.bg,
    ink: hs.on
  }, /*#__PURE__*/React.createElement(PlaceCard, {
    place: sp,
    expanded: k.snap === 'full',
    onExpand: () => k.setSnap('full'),
    onClose: () => k.setSnap('closed'),
    onGoInside: k.goInside,
    onSuggest: k.openMore,
    style: {
      padding: '0 16px 28px'
    }
  })), sheet === 'strip' && /*#__PURE__*/React.createElement(Sheet, {
    key: 't' + k.focus,
    label: 'Places in ' + fp.official,
    snap: "peek",
    onSnap: s => s === 'closed' && k.back(),
    peek: peek
  }, /*#__PURE__*/React.createElement(PlaceStrip, {
    parent: k.focus,
    script: k.script,
    active: k.hot,
    onFocusPlace: k.setHot,
    onPick: k.select
  })), /*#__PURE__*/React.createElement(KhoimSearchScreen, {
    k: k
  }), /*#__PURE__*/React.createElement(KhoimMore, {
    open: k.more,
    onClose: k.closeMore,
    theme: theme,
    onTheme: onTheme,
    layer: k.layer,
    onLayer: k.setLayer
  }), /*#__PURE__*/React.createElement(Announcer, {
    text: k.announce
  }));
}
function KhoimDesktop({
  preset = 1,
  theme,
  onTheme
}) {
  const {
    GoaMap,
    ScriptToggle,
    IconButton,
    Wordmark,
    PlaceCard,
    PlaceStrip,
    SearchField,
    SearchResults,
    DraftBanner,
    Credit,
    KhoimData: GD
  } = KN;
  const k = useKhoim(preset);
  const P0 = KHOIM_PRESETS[preset] || {};
  const sp = k.selected ? GD.getPlace(k.selected) : null,
    fp = k.focus ? GD.getPlace(k.focus) : null;
  const hs = sp ? GD.houseOf(sp) : null;
  const trail = GD.trailOf(k.focus || 'goa');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--surface)',
      color: 'var(--text)',
      display: 'grid',
      gridTemplateRows: 'auto minmax(0,1fr)',
      fontFamily: 'var(--font-latin)'
    }
  }, /*#__PURE__*/React.createElement(DraftBanner, {
    onTellUs: k.openMore
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 460px',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("main", {
    style: {
      position: 'relative',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(GoaMap, {
    focus: k.focus,
    selected: k.selected,
    hot: k.hot,
    script: k.script,
    onSelect: k.pick,
    onHot: k.setHot,
    insetTop: 96,
    insetBottom: fp ? 170 : 24,
    insetLeft: fp ? 0 : 360,
    paintIn: !!P0.intro
  }), /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'absolute',
      top: 20,
      left: 28,
      right: 28,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => k.goTo(null),
    "aria-label": "Khoim, all of Goa",
    style: {
      border: 0,
      background: 'transparent',
      padding: 4,
      borderRadius: 'var(--radius-m)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 26
  })), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Where you are",
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }
  }, trail.length > 1 && trail.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: t.id
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "/"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-current": i === trail.length - 1 ? 'page' : undefined,
    onClick: () => k.goTo(t.id === 'goa' ? null : t.id),
    style: {
      border: 0,
      background: 'transparent',
      color: 'var(--text)',
      padding: '8px 6px',
      borderRadius: 'var(--radius-s)',
      font: 'var(--weight-strong) 16px/1.4 var(--font-latin)',
      textDecoration: i < trail.length - 1 ? 'underline' : 'none',
      textUnderlineOffset: 4,
      cursor: 'pointer'
    }
  }, t.official))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(ScriptToggle, {
    value: k.script,
    onChange: k.setScript
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "layers",
    label: "Layers and about",
    onClick: k.openMore
  }))), !fp && !sp && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 32,
      top: 120,
      width: 330,
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      font: 'var(--weight-strong) 40px/1.1 var(--font-latin)',
      letterSpacing: 'var(--track-title)',
      textWrap: 'pretty'
    }
  }, "Every taluka in Goa, with its Konkani name and how to say it."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--weight-regular) var(--size-lead)/1.5 var(--font-latin)'
    }
  }, "Click a district, or press and drag along Goa. Click again to go inside.")), fp && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 16
    }
  }, /*#__PURE__*/React.createElement(PlaceStrip, {
    parent: k.focus,
    script: k.script,
    active: k.hot || k.selected,
    onFocusPlace: k.setHot,
    onPick: k.select
  }))), /*#__PURE__*/React.createElement("aside", {
    "aria-label": "Names",
    style: {
      borderLeft: '1px solid var(--line)',
      background: 'var(--surface-sunk)',
      display: 'grid',
      gridTemplateRows: 'auto minmax(0,1fr) auto',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 12px'
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    value: k.query,
    onChange: k.setQuery,
    onCancel: k.query ? () => k.setQuery('') : undefined
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      padding: '4px 24px 20px'
    }
  }, k.query ? /*#__PURE__*/React.createElement(SearchResults, {
    query: k.query,
    onPick: id => {
      k.setQuery('');
      k.openPlace(id);
    }
  }) : sp ? /*#__PURE__*/React.createElement("div", {
    key: sp.id,
    style: {
      background: hs.bg,
      color: hs.on,
      borderRadius: 'var(--radius-sheet)',
      padding: 'var(--trim-inset)',
      animation: 'khoim-rise var(--dur-base) var(--ease-out) both'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 10px 16px'
    }
  }, /*#__PURE__*/React.createElement(PlaceCard, {
    place: sp,
    expanded: true,
    onClose: () => k.setSnap('closed'),
    onGoInside: k.goInside,
    onSuggest: k.openMore,
    headingLevel: 2
  }))) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 4px',
      font: 'var(--weight-regular) var(--size-body)/1.55 var(--font-latin)'
    }
  }, "Pick a place on the map to see all its names. Search works in any script: try \u0938\u093E\u0936\u094D\u091F\u0940, Saxtti or Salcete.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 24px 18px',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement(Credit, null)))), /*#__PURE__*/React.createElement(KhoimMore, {
    open: k.more,
    onClose: k.closeMore,
    theme: theme,
    onTheme: onTheme,
    layer: k.layer,
    onLayer: k.setLayer,
    desktop: true
  }), /*#__PURE__*/React.createElement(Announcer, {
    text: k.announce
  }));
}
Object.assign(window, {
  KhoimPhone,
  KhoimDesktop
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/khoim/Screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/khoim/state.jsx
try { (() => {
/* Khoim app state. Shared by the phone and desktop layouts. */
const KN = window.GoemDesignSystem_26c22a;
const KHOIM_PRESETS = {
  1: {
    label: 'Goa, nothing selected',
    intro: true
  },
  2: {
    label: 'District tapped once',
    selected: 'south-goa'
  },
  3: {
    label: 'Inside a taluka',
    focus: 'salcete'
  },
  4: {
    label: 'Canacona, full names',
    focus: 'kushavati',
    selected: 'canacona',
    snap: 'full'
  },
  '4b': {
    label: 'Raia, official name only',
    focus: 'salcete',
    selected: 'v626925',
    snap: 'full'
  },
  5: {
    label: 'Search, mixed scripts',
    search: true,
    query: 'sa'
  },
  6: {
    label: 'Layers and about',
    more: true
  }
};
function useKhoim(preset) {
  const GD = KN.KhoimData;
  const init = KHOIM_PRESETS[preset] || {};
  const [s, set] = React.useState(() => ({
    focus: init.focus || null,
    selected: init.selected || null,
    snap: init.snap || 'peek',
    search: !!init.search,
    query: init.query || '',
    more: !!init.more,
    hot: null,
    layer: 'names'
  }));
  const [script, setScriptRaw] = React.useState(() => {
    try {
      return localStorage.getItem('khoim-script') || 'deva';
    } catch (e) {
      return 'deva';
    }
  });
  const [announce, setAnnounce] = React.useState('');
  React.useEffect(() => {
    const p = KHOIM_PRESETS[preset] || {};
    set({
      focus: p.focus || null,
      selected: p.selected || null,
      snap: p.snap || 'peek',
      search: !!p.search,
      query: p.query || '',
      more: !!p.more,
      hot: null,
      layer: 'names'
    });
  }, [preset]);
  const up = o => set(v => ({
    ...v,
    ...o
  }));
  const say = id => {
    const p = GD.getPlace(id);
    if (p) setAnnounce(GD.spokenName(p));
  };
  const api = {
    ...s,
    script,
    setScript: v => {
      setScriptRaw(v);
      try {
        localStorage.setItem('khoim-script', v);
      } catch (e) {}
    },
    setHot: hot => up({
      hot
    }),
    setQuery: query => up({
      query
    }),
    setLayer: layer => up({
      layer
    }),
    openSearch: () => up({
      search: true
    }),
    closeSearch: () => up({
      search: false
    }),
    openMore: () => up({
      more: true
    }),
    closeMore: () => up({
      more: false
    }),
    select: id => {
      up({
        selected: id,
        snap: 'peek'
      });
      say(id);
    },
    goInside: id => {
      up({
        focus: id,
        selected: null,
        snap: 'peek',
        hot: null
      });
      const p = GD.getPlace(id);
      setAnnounce('Inside ' + p.official + '. ' + GD.childrenOf(id).length + (p.level === 'taluka' ? ' villages.' : ' talukas.'));
    },
    pick: (id, scrubbed) => {
      if (scrubbed || id !== s.selected) return api.select(id);
      const p = GD.getPlace(id);
      if (p.level !== 'village') api.goInside(id);else up({
        snap: 'full'
      });
    },
    setSnap: snap => snap === 'closed' ? up({
      selected: null,
      snap: 'peek'
    }) : up({
      snap
    }),
    back: () => {
      if (s.selected) return up({
        selected: null,
        snap: 'peek'
      });
      const p = GD.getPlace(s.focus);
      api.goTo(p && p.parent && p.parent !== 'goa' ? p.parent : null);
    },
    goTo: id => {
      up({
        focus: id,
        selected: null,
        snap: 'peek',
        hot: null
      });
      setAnnounce(id ? 'Inside ' + GD.getPlace(id).official : 'All of Goa');
    },
    openPlace: id => {
      const p = GD.getPlace(id);
      if (!p || p.level === 'state') return up({
        search: false,
        focus: null,
        selected: null
      });
      up({
        search: false,
        focus: p.level === 'district' ? null : p.parent,
        selected: id,
        snap: 'full'
      });
      say(id);
    },
    announce
  };
  return api;
}
function Announcer({
  text
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    "aria-live": "polite",
    style: {
      position: 'absolute',
      width: 1,
      height: 1,
      overflow: 'hidden',
      clip: 'rect(0 0 0 0)'
    }
  }, text);
}
Object.assign(window, {
  KHOIM_PRESETS,
  useKhoim,
  Announcer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/khoim/state.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Credit = __ds_scope.Credit;

__ds_ns.DraftBanner = __ds_scope.DraftBanner;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ScriptToggle = __ds_scope.ScriptToggle;

__ds_ns.SourceStatus = __ds_scope.SourceStatus;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.ICON_PATHS = __ds_scope.ICON_PATHS;

__ds_ns.GOA_SIZE = __ds_scope.GOA_SIZE;

__ds_ns.DISTRICT_SHAPES = __ds_scope.DISTRICT_SHAPES;

__ds_ns.TALUKA_SHAPES = __ds_scope.TALUKA_SHAPES;

__ds_ns.VILLAGES = __ds_scope.VILLAGES;

__ds_ns.SITE = __ds_scope.SITE;

__ds_ns.STATUS_TEXT = __ds_scope.STATUS_TEXT;

__ds_ns.LAYERS = __ds_scope.LAYERS;

__ds_ns.KhoimData = __ds_scope.KhoimData;

__ds_ns.PLACES = __ds_scope.PLACES;

__ds_ns.HOUSE_OF = __ds_scope.HOUSE_OF;

__ds_ns.LayerSwitch = __ds_scope.LayerSwitch;

__ds_ns.VoiceClip = __ds_scope.VoiceClip;

__ds_ns.GoaMap = __ds_scope.GoaMap;

__ds_ns.PendingName = __ds_scope.PendingName;

__ds_ns.PlaceCard = __ds_scope.PlaceCard;

__ds_ns.PlaceStrip = __ds_scope.PlaceStrip;

__ds_ns.SayIt = __ds_scope.SayIt;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.SearchResults = __ds_scope.SearchResults;

})();
