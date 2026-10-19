# Khoim accessibility (target: WCAG 2.2 AAA)

## Contrast (1.4.6, AAA 7:1)
| Pair | Ratio |
|---|---|
| text #16120C on surface #F6F5F1 | 17.1 |
| text-2 #4A453E on surface | 8.7 |
| dark text #F3F0E8 on #15130F | 16.3 |
| dark text-2 #C9C3B8 on #15130F | 10.6 |
| Haldi #E8B23A / soot | 9.65 |
| Kokum #8C2E4A / white | 8.06 |
| Rose #E2869D / soot | 7.22 |
| Portuguese green #206150 / white | 7.27 |
| Red oxide #913D28 / white | 7.24 |
| Lilac #A79AD2 / soot | 7.28 |
| Sky #50AEC5 / soot | 7.28 |
| Neel #294C9C / white | 8.05 |
| Mustard #DF9036 / soot | 7.27 |
| Every light map tint / soot | 10.6 to 14.6 |
| Every dark map tint / #F3F0E8 | 7.2 to 12.9 |
| Search mark #F4D98A / soot | 13.4 |

Rules: text is never set at reduced opacity. Hierarchy comes from size and weight. Dividers on house sheets are the only reduced-opacity elements, and they carry no meaning.

## Other criteria
- **1.4.1 Use of colour:** source status uses full, half and empty marks plus words. Map selection also changes label size and the sheet names the place.
- **1.4.8 Visual presentation:** body 17px, line height 1.5, lines under 60ch on About, no justified text.
- **1.4.11 Non-text contrast:** controls use 2px ink borders or solid fills; focus ring is 5px ink.
- **2.1 Keyboard:** map labels are buttons; village dots have an equivalent in PlaceStrip; ScriptToggle is a radio group with arrow keys; sheets and search close with Escape; sheet handle is a button with aria-expanded.
- **2.3.3 Animation from interactions:** all motion is behind tokens that zero under prefers-reduced-motion. The paint-in and shell shimmer do not run.
- **2.4.7 / 2.4.13 Focus appearance:** two-ring focus (2px surface, 3px ink) on every control, never removed.
- **2.5.5 Target size (AAA 44px):** all controls 44px or larger (default 48px, buttons 56px). Map shapes are large; dots are backed by the strip.
- **3.1.2 Language of parts:** `lang="gom"` on Devanagari Konkani, `lang="gom-Latn"` on Romi, `lang="mr"` on Marathi forms.
- **4.1.3 Status messages:** selection and level changes are announced in a polite live region using `KhoimData.spokenName()`. Search result counts are live.
- **Dragging (2.5.7):** scrubbing is optional; tapping does everything dragging does.

## Phase 3: the type map
- The map's SVG is aria-hidden: its names are pictures of names. Every place is reached as text through search (and its list of every district and taluka), the breadcrumb, a taluka's "See all as a list", the "Next to" buttons and the plain links on every page.
- Zoom has single-pointer alternatives (2.5.1, 2.5.7): the + and - buttons, 48px, named "Zoom in" and "Zoom out". Dragging is never the only way to anything.
- Village names on the map read at 4.5:1 or more on their own tint, light and dark (`--map-ink-*` on `--map-tint-*`; haldi, rose and mustard deepened in light mode). Faint names (no reviewed form in the chosen script) are deliberately lower; the same name is always available as text.
- Every piece of text over the map sits on the page colour: the phone header's pills, the desktop panel, the view line, the legend, the OpenStreetMap credit (a 44px target).
- Legends never rely on colour alone: each swatch has its words and count.
- Switching view never moves the map or the focus. Reduced motion: the map jumps to a place instead of gliding.
- `scripts/dev/contrast-audit.js` (outside `design/`) walks the phase 3 screens; it skips the map's own SVG names, checked above.

## Phase 4
- No two names on the map overlap at any zoom; the less important one is hidden. `scripts/dev/map-audit.js` (outside `design/`) checks overlaps, chrome over land at the all-Goa view, and whether all of Goa is in view.
- River names now meet AAA: `--map-water-text` light #1F4E60 (8.3:1 on the page colour), dark #8EC3D6 (9.7:1).
- "Show" is a radio group named "Show" on desktop and a labelled native select on phones, both 44px.
- Map symbols are buttons (44px touch area around a 26px tile) that show their name on tap; they are left out of the tab order because the village sheet lists the same things as text. The legend of symbols uses the page colour and `--text`.
- `scripts/dev/contrast-audit.js` now walks each Show choice, the three scripts, Sirigao's sheet and the symbols' legend: no problems on 24 screens, phone and desktop, light and dark (19 Oct 2026).

## To test in build
- TalkBack on a low-end Android with Chrome, VoiceOver on iOS Safari; check Devanagari is read with a Marathi/Hindi voice when no Konkani voice exists.
- 200% text zoom: the sheet scrolls; nothing is clipped.
