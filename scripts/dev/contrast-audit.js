/* Khoim contrast and touch-size check. A testing aid, not part of the site.

   It walks through every screen of the app (Goa, districts, cards, strips, search, About) and checks
   - every visible piece of text against WCAG AAA contrast (7:1, or 4.5:1 for large text), and
   - every button and link against the 44px target size.

   How to run:
     1. npm run build, then copy this file into dist/ as __audit.js, then npm run preview.
     2. Open the site at phone size (390 wide) and at desktop size (1280 wide), in light and in dark.
     3. In the browser console:  (await import('/__audit.js')).tour().then(console.log)
   An empty "problems" and "small" list for every screen means it passes. */
const parse = c => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (m) { const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return [p[0], p[1], p[2], p[3] ?? 1]; } return null; };
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
const colourOf = (el, expr) => { const probe = document.createElement('span'); probe.style.color = expr; el.appendChild(probe); const c = getComputedStyle(probe).color; probe.remove(); return parse(c); };
const visible = el => { const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false; if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false; for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) < 0.05) return false; if (e.classList && e.classList.contains('k-visually-hidden')) return false; } return true; };
const bgOf = el => {
  const lab = el.closest('.k-map__label'); if (lab) return { c: colourOf(lab, 'var(--halo)'), how: 'label outline' };
  for (let e = el; e; e = e.parentElement) {
    const s = getComputedStyle(e); const c = parse(s.backgroundColor);
    if (s.backgroundImage !== 'none') return { c: null, how: 'image' };
    if (c && c[3] > 0.99) return { c, how: e.className && typeof e.className === 'string' ? e.className.split(' ')[0] : e.tagName, el: e };
    if (c && c[3] > 0) return { c: null, how: 'see-through ' + s.backgroundColor };
  }
  return { c: parse(getComputedStyle(document.documentElement).backgroundColor), how: 'html' };
};
export function contrast(root = document.body) {
  const out = [], seen = new Set(); let checked = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || !visible(el)) continue;
    { const r0 = el.getBoundingClientRect(); const top = document.elementFromPoint((r0.left + r0.right) / 2, (r0.top + r0.bottom) / 2); const cover = top && top.closest('.k-more.is-open, .k-search-screen.is-open'); if (cover && !cover.contains(el)) continue; }
    if (el.matches('.k-script-toggle__option[aria-checked="true"]')) { const s0 = getComputedStyle(el), th = getComputedStyle(el.parentElement.querySelector('.k-script-toggle__thumb')); const r = ratio(parse(s0.color), parse(th.backgroundColor)); checked++; if (r < 7) out.push('selected script option ' + r.toFixed(2)); continue; }
    const s = getComputedStyle(el); const fg = parse(s.color); const bg = bgOf(el); checked++;
    const size = parseFloat(s.fontSize), bold = Number(s.fontWeight) >= 700; const large = size >= 24 || (size >= 18.66 && bold); const need = large ? 4.5 : 7;
    // text that has no background of its own and sits over a map shape
    let onMap = false; if (!el.closest('.k-map__label') && bg.el && (bg.el.classList.contains('k-app') || bg.el.tagName === 'BODY' || bg.el.tagName === 'HTML')) { const r = el.getBoundingClientRect(); const pts = [[r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2], [(r.left + r.right) / 2, (r.top + r.bottom) / 2]]; onMap = pts.some(([x, y]) => document.elementsFromPoint(x, y).some(e => e.classList && (e.classList.contains('k-map__taluka') || e.classList.contains('k-map__hit')))); }
    const text = n.textContent.trim().slice(0, 28); const cls = (typeof el.className === 'string' && el.className.split(' ')[0]) || el.tagName;
    let problem = null;
    if (!fg || !bg.c) problem = 'cannot work out (' + bg.how + ')';
    else { const r = ratio(fg, bg.c); if (r < need) problem = r.toFixed(2) + ':1, needs ' + need; }
    if (onMap) problem = (problem ? problem + '; ' : '') + 'sits on the map with no background';
    if (problem) { const key = cls + '|' + problem; if (!seen.has(key)) { seen.add(key); out.push(cls + ' "' + text + '" ' + size + 'px: ' + problem); } }
  }
  return { checked, problems: out };
}
export function targets(root = document.body) {
  const out = [];
  for (const el of root.querySelectorAll('button, a[href], input, [role=radio]')) {
    if (!visible(el)) continue; const r = el.getBoundingClientRect();
    // the touch area may be extended by ::after
    const a = getComputedStyle(el, '::after'); let h = r.height, w = r.width; if (a.content !== 'none' && a.position === 'absolute') { h += -(parseFloat(a.top) || 0) - (parseFloat(a.bottom) || 0); w += -(parseFloat(a.left) || 0) - (parseFloat(a.right) || 0); }
    const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline';
    if ((h < 43.5 || w < 43.5) && !inline) out.push(((typeof el.className === 'string' && el.className.split(' ')[0]) || el.tagName) + ' "' + (el.textContent.trim() || el.getAttribute('aria-label') || '').slice(0, 24) + '" ' + Math.round(w) + 'x' + Math.round(h));
  }
  return [...new Set(out)];
}

const wait = ms => new Promise(r => setTimeout(r, ms));
const q = s => document.querySelector(s);
const byText = (sel, t) => [...document.querySelectorAll(sel)].find(e => e.textContent.trim().startsWith(t));
const label = t => [...document.querySelectorAll('.k-map__label')].find(b => b.textContent.includes(t));
export async function tour() {
  const still = document.createElement('style'); still.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; document.head.appendChild(still);
  const res = {}; const app = () => q('.k-app');
  const run = async (name, scroller) => {
    const problems = new Set(), small = new Set(); let checked = 0;
    const once = () => { const c = contrast(app()); checked += c.checked; c.problems.forEach(p => problems.add(p)); targets(app()).forEach(t => small.add(t)); };
    once();
    const sc = scroller && q(scroller);
    if (sc) { for (let y = 300; y < sc.scrollHeight; y += 300) { sc.scrollTop = y; await wait(120); once(); } sc.scrollTop = 0; }
    res[name] = { checked, problems: [...problems], small: [...small] };
  };
  const desktop = !!q('.k-app--desktop');
  const script = async t => { byText('.k-script-toggle__option', t).click(); await wait(250); };
  await run('1 Goa');
  await script('Official'); await run('1 Goa, official'); await script('Romi'); await run('1 Goa, Romi'); await script('देवनागरी');
  label('उत्तर').click(); await wait(1300); await run('2 North Goa opened');
  await script('Official'); await run('2 North Goa, official'); await script('देवनागरी');
  byText('.k-crumbs__link', 'Goa').click(); await wait(1000);
  label('कुशावती').click(); await wait(1300); await run('2 Kushavati opened');
  if (!desktop) { byText('.k-app button', 'How to say it').click(); await wait(700); }
  await run('3 Kushavati full card', desktop ? '.k-desktop__panel-body' : '.k-sheet__scroll');
  if (!desktop) { q('.k-sheet .k-icon-button').click(); await wait(700); await run('3 Kushavati strip'); }
  label('Dharbandora').click(); await wait(1800); if (!desktop) { byText('.k-app button', 'All names').click(); await wait(700); }
  await run('4 Dharbandora full card', desktop ? '.k-desktop__panel-body' : '.k-sheet__scroll');
  byText('.k-crumbs__link', 'Goa').click(); await wait(1000);
  label('दक्षिण').click(); await wait(1300); label('साश्टी').click(); await wait(2200); await run('5 Salcete opened');
  if (!desktop) { byText('.k-app button', 'How to say it').click(); await wait(700); }
  await run('5 Salcete full card', desktop ? '.k-desktop__panel-body' : '.k-sheet__scroll');
  q(desktop ? '.k-desktop-card .k-icon-button' : '.k-sheet .k-icon-button').click(); await wait(800); await run('6 Salcete strip of villages');
  byText('.k-strip__card', 'Raia').click(); await wait(800); await run('7 Raia peek');
  if (!desktop) { byText('.k-app button', 'All names').click(); await wait(700); }
  await run('7 Raia full card', desktop ? '.k-desktop__panel-body' : '.k-sheet__scroll');
  // search
  if (!desktop) { q('.k-phone-header__row--where .k-icon-button').click(); await wait(900); }
  const input = q(desktop ? '.k-desktop__panel input' : '.k-search-screen input');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'sa'); input.dispatchEvent(new Event('input', { bubbles: true })); await wait(1200);
  await run('8 search results', desktop ? '.k-desktop__panel-body' : '.k-search-screen__results');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'zzz'); input.dispatchEvent(new Event('input', { bubbles: true })); await wait(600); await run('8 search, nothing found');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ''); input.dispatchEvent(new Event('input', { bubbles: true })); await wait(400);
  if (!desktop) { await run('8 search, empty'); q('.k-search-field__cancel').click(); await wait(900); }
  // About
  if (desktop) q('[aria-label="Layers and about"]').click(); else { byText('.k-crumbs__link', 'Goa').click(); await wait(1000); q('.k-phone-bottom .k-icon-button').click(); }
  await wait(1000); await run('9 About', '.k-more__scroll');
  return res;
}
