# DESIGN.md: The Car Care

> Invisible armour, held in good hands. A bright studio where protection shows up as light.

This is the spec the code follows, written from the built site. Tokens live in `app/globals.css` (`@theme`), section styles in `app/styles/*.css`, copy in `content/site.ts`. When this file and the code disagree, fix one of them in the same commit.

## 0. Argument (one claim per section)

| Section | Claim | Proof on the page |
|---|---|---|
| Hero | They protect cars, not only clean them | Their own line, the logo's roof drawing itself over a car, a band of light passing over the paint |
| Ticker | They fit named, branded films | Garware Hi-Tech and GSWF product names |
| Services | Four layers, each on a different part of the car | One drawn car; a four-layer index lights each service's zone in turn |
| Sun film | Film does four things on every drive, legally | Four benefit cards, a glare comparison, a road-legal shade guide |
| PPF | The film heals light swirls | A paint panel you scratch and watch heal |
| Ceramic | Gloss and easier washing | Before and after on the same panel, a beading close-up |
| Why | They come to you, with real brands and warranties | Doorstep photo, warranty years, WhatsApp tile |
| Process | Booking is four plain steps | A line that draws through the steps |
| FAQ | Straight answers, including the law | Six questions, FAQPage data |
| Visit | Easy to reach, easy to brief | Phone, address and hours set large, a map, an enquiry builder that writes the WhatsApp message |

**Idea sentence:** on this page, the logo's shield roof and the detailer's inspection lamp become the light that passes over paint and glass and shows protection you cannot otherwise see.
**Live things:** the scratch-and-heal panel and the road-legal shade guide.
**Peak:** "the site where you scratch the paint and watch it heal."

## 1. Visual theme

- **Style:** bright automotive studio, photo-led, precise.
- **Keywords:** porcelain, studio light, invisible film, line drawing, squeegee, calm, exact.
- **Tone:** confident and warm, Indian English, short sentences. Not a garage price list, not a dark poster, not a tech product.
- **Feel:** standing in a clean white bay while a detailer runs an inspection lamp along your paint.
- **Light theme only.** Their Instagram posters are dark; the website is the bright side of the brand.

## 2. Colour

| Token | Hex | Role |
|---|---|---|
| `porcelain` | #F6F8FC | Page ground |
| `paper` | #FBFCFE | Cards, sheets, nav glass base, text on blue |
| `mist` | #EBF0FA | Alternate section field, secondary buttons |
| `ink` | #0E1A33 | Headings and running text |
| `ink-soft` | #4A5670 | Secondary text (7.1:1 on porcelain) |
| `rule` | #D9E0EE | Hairlines, idle progress bars, form borders |
| `care-blue` | #4066AF | Actions, links, focus, line drawings (5.3:1) |
| `care-blue-deep` | #2F4F8F | Hover and pressed |
| `shield-green` | #12964B | Chevrons, protected states, the process line; graphics only |
| `shield-green-ink` | #0E7A3D | Green as small text and check glyphs |
| `lavender` | #A4B0DA | Light sweep, UV rays, ceramic gloss and beading; never text |
| `sun-warm` | #E8A33D | Visible-light rays in the shade guide only |
| `danger` | #B42318 | Form errors |

- Components use tokens only. Translucent colours are `color-mix(in srgb, var(--color-x) N%, transparent)`.
- Grounds fill 80 to 90% of a screen; care-blue stays under 5%; green appears only where something is protected.
- Gradients live in four places: the logo's own inner chevron, the hero light sweep, neutral photo scrims, and edge-fade masks (ticker, hero photo).
- WhatsApp green and the Instagram and Facebook colours appear only inside their official theSVG marks.

## 3. Typography

One variable family, Archivo, subset to Latin and a few symbols (43 KB woff2, `wght` 400 to 800, `wdth` 62 to 100) and loaded with `next/font/local` (`display: swap`, Arial-adjusted fallback). Rebuild it with `npm run fonts`. Geist Mono (measured numbers) and Anek Devanagari (the Marathi line) sit far below the fold: they start on system faces and attach after the load event (`html.fonts-late`).

| Token | Size | Use | Setting |
|---|---|---|---|
| `text-display` | clamp(3rem, 1rem + 4.3vw, 6rem) | H1 main line, 404 title, warranty years | 800, wdth 64, lh 0.9 |
| `text-head` | clamp(2.25rem, 1.2rem + 3.6vw, 5rem) | Section titles (H2), desktop benefit titles | 780, wdth 66, lh 0.95 |
| `text-h3` | clamp(1.75rem, 1rem + 2.2vw, 3rem) | Card, step, shade and ticker titles | wdth 66, lh 1 |
| `text-sub` | clamp(1.5rem, 1rem + 1.3vw, 2.25rem) | Tile and offer titles | wdth 66, lh 1 |
| `text-lead` | clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem) | Intros, H1 lead line, FAQ questions | 400 to 650, lh 1.25 to 1.35 |
| `text-body` | clamp(1rem, 0.96rem + 0.2vw, 1.125rem) | Running text | 400, lh 1.6 |
| `text-small` | clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem) | Facts, captions, chips, labels | 450 to 600, lh 1.45 |

Plus three one-off display sizes: the benefit numerals (3.5rem on phones, up to 9rem on desktop), the footer name (19.2% of the footer's inner width, outlined) and the shade readout.

- The H1 is two lines of `text-display` under a `text-lead` lead line ("We don't just detail cars.").
- Headlines stay at two lines or fewer at every width (`text-wrap: balance`); body uses `text-wrap: pretty`.
- Body copy is full ink at 16px or more; measure 36 to 62ch.
- Sentence case. No eyebrows, no tracked capitals, no gradient or shadowed text.

## 4. Components

**Buttons** (pill, 48px; 52px for `btn-lg`)
- Primary: care-blue fill, paper text, 600. The WhatsApp mark sits on its own paper disc inside the pill.
- Secondary: mist fill, ink text. Paper: paper fill.
- Hover (fine pointer only): lift 1px, fill one step deeper; the disc nudges 2px right. Press: `scale(0.97)`, 140ms. Focus: 2px care-blue ring, 3px offset.

**Navigation**
- Desktop: a glass pill 16px from the top, up to 820px wide, 60px high (`paper` 65%, blur 18px, saturate 160%, 1px ink-8% border, float shadow). The current section has a mist pill that slides between links (Motion `layoutId`); hover shows a paler pill under the link. Hides on scroll down, lifted 56px past its own height so no shadow is left at the top.
- Phone: a glass bar 12px from the top that opens into a sheet (28px radius, up to 88svh, drag or flick to close, focus trapped, scroll locked). The scrim behind carries the only blur, so no blurred layer is ever transformed. A phone on its side gets three columns of links.
- Fallbacks: 94% paper without `backdrop-filter`, solid paper under `prefers-reduced-transparency`, an ink border under `prefers-contrast: more`.

**Floating WhatsApp button**: a 56px paper ring with the official mark, bottom right. It appears after the hero and steps aside for the open menu, for `#visit` and the footer, and while any WhatsApp button in the page is at least half on screen, so only one WhatsApp action shows at a time. The wrapper fades and is `inert` while hidden.

**Cards and tiles**: paper on porcelain or mist, 6px radius, no border, no resting shadow. Bento hover: lift 2px while a care-blue hairline traces round the tile (conic mask on a registered `--trace` angle, 450ms).

**Chips and segmented control**: 44px pills. Off: paper with a rule border; hover adds a mist tint and a blue border. On: care-blue fill, paper text; hover deepens it. The segmented control has one paper pill that slides between options.

**Sliders**
- Compare: a paper divider with an ink edge, and a 64x44 handle with two carets. Hover grows the handle 6% and parts the carets 2px each way; press `scale(0.96)`. Keyboard: arrows (shift for 10), Home, End, PageUp, PageDown.
- Shade guide: a 44x30 thumb on a 6px rail; hover `scale(1.08)`. Sideways drags move it; vertical swipes still scroll.

**FAQ**: rows split by hairlines; the plus sits in a 40px mist disc. Hover on a closed row fills the disc blue and turns the plus a quarter; open rows rotate it to a cross. Panels open on `grid-template-rows` (300ms).

**Ticker pause**: a 44px paper disc; hover fills it ink and grows it 6%. While the list moves, names fade in at the left edge and out before the button.

**Form fields**: labels above, 48px, paper fill, rule border, care-blue focus ring; errors in `danger` under the field, tied by `aria-describedby`.

## 5. Layout

- Container: max 1440px, sides `clamp(16px, 4vw, 48px)`. 12 columns, gap `clamp(12px, 1.6vw, 24px)`.
- Section padding: `clamp(3rem, 2rem + 4.6vw, 7rem)` top and bottom. Fields alternate porcelain, mist and paper instead of divider lines.
- Hairlines in five places: the hero fact row, FAQ rows, the bento hover trace, form fields, and the services layer index (3px progress bars).
- Radius: pills for controls, 6px for cards and images.

**Hero**
- Phone and tablet (under 1024): headline, sub and actions first; then the car in a 4:3 card cropped from the left so the car sits centred; then the four facts in a 2x2 grid. The copy wrapper is `display: contents` so the three parts can reorder.
- Desktop: the copy column is `clamp(360px, 33vw, 560px)` wide. The 16:9 photo frame stands to its right: it covers the hero when it can, but never so wide that a roof leg (at 26.2% and 98.8% of the frame) leaves the screen, so it ends up about 72 to 82% of the window wide. The photo's edges feather into porcelain with two intersecting mask gradients. The fact row is a 104px band along the foot.

**Services**: on desktop a sticky stage spans 7 columns, `min(60svh, 560px)` tall and centred under the nav: the layer index on top, the car in the middle, the lit service's name at the foot. The four blocks scroll in columns 9 to 12, each at least 74svh. On phones each block carries its own lit car.

**Sun film**: four benefit cards stack on desktop (sticky, each 14px lower than the last, the next sliding over the one before); the glare compare is the fourth card. The shade guide is a 7-column sticky drawing beside its controls.

## 6. Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | none | Everything at rest |
| Tone | one step of ground colour | Cards and section fields |
| Float | `0 10px 30px -12px` ink 18% and `0 2px 6px -2px` ink 8% | Nav pill, menu sheet, floating WhatsApp button only |

Controls on photographs (compare handle, caption chips) take a fine ink-18% edge instead of a shadow.

## 7. Motion

- **Verb:** a squeegee pass, a firm start and a long finish: `--ease-squeegee: cubic-bezier(0.22, 1, 0.36, 1)`.
- **Properties:** transform, opacity, clip-path, mask and SVG stroke only. The FAQ panel's `grid-template-rows` is the one layout transition.
- **Durations:** press 140ms; hover 180 to 220ms; small UI 200 to 320ms; reveals 0.9 to 1.2s; staggers 50 to 90ms; scrub 0.6 to 0.8. Exits are shorter than entrances (the menu links leave in 160ms). Springs (nav sheet, sliders): stiffness 420, damping 38, mass 0.9.

**Hero load sequence (CSS, never waits for script)**
- H1 lines rise in masks from 0.1s, 1s each, 90ms apart; the sub and actions fade up.
- Desktop: the green chevron draws at 0.35s (1.1s), the blue at 0.8s (1s), then a lavender-white band sweeps the car at 1.5s (0.95s), fading in and out so it never rests in view. The photo settles from 1.04 to 1 as the hero scrolls away.
- Phone: the same roof and sweep from first paint (0.3s, 0.55s, 1.2s), with no script.
- After 2.4s on desktop with a fine pointer, the band becomes an inspection lamp that follows the pointer slowly and drifts when idle.

**Architecture**
- First load ships React, Next and the page's own components only. GSAP (ScrollTrigger, SplitText, DrawSVG) and Lenis load as islands (`components/shell/islands.tsx`) once the page is loaded and idle, at the first scroll or touch, or after 3 s, whichever comes first. Section motion arms only when its section nears the screen (`lib/use-near.ts`).
- One clock: the GSAP ticker drives Lenis (wheel smoothing only; native touch), ScrollTrigger and both canvas loops.
- Motion (`framer-motion` 14, imported directly so it tree-shakes) handles UI state through `LazyMotion` with `domMax` loaded asynchronously; its `animate` loads on idle or on first press.
- Reveals run from one IntersectionObserver (`RevealRuntime`): headings rise by SplitText lines in masks (80ms apart), images open from a 12% clip-path inset and drift from -4% to 4% inside their frame while they cross the screen. Only elements wholly below the screen hide; a scroll check reveals anything the observer misses.
- No `content-visibility`: it delayed lazy images on phones until a section was almost on screen. Native lazy loading starts every picture well ahead of the scroll.

**Signature moments**
- Hero: the shield goes on and light passes over the paint.
- Services: four layers of care. Sun film: tinted glass and UV rays stopping at the film. PPF: green outlines drawing over the bonnet, bumper, mirrors and door edges. Ceramic: a gloss run along the body, reflections wiping the doors, water beading up on the bonnet, roof and boot. Detailing: seats and dashboard drawing in.
- The road-legal shade guide, scratch it and watch it heal, the ceramic before and after, the process line drawing green.

**Reduced motion** shows the finished page: no Lenis, no scrub, no parallax, no sweep, no lamp, no ticker drift (it wraps into lines). **Hover** motion only under `(hover: hover) and (pointer: fine)`.

## 8. Do and don't

**Do**
- Take every fact from `content/site.ts`; anything unconfirmed goes in `CONFIRM`.
- Keep the chevron motif to the hero, the process markers, the ticker separators, the 404 and the footer.
- Show protection as light: sweeps, tints, outlines that draw.
- Give every control hover, focus-visible and pressed states.
- Test at 360, 390, 768, 1024, 1440 and 1920.

**Don't**
- Invent stats, years, prices, counts, reviews or awards.
- Use em dashes or en dashes in UI copy.
- Put an eyebrow or pill label above a heading, or icons in tinted circles.
- Add resting shadows, or glass anywhere but the nav, the menu sheet and the floating button.
- Add scroll cues, preloaders or custom cursors.
- Animate width, height, top, left, filter or backdrop-filter.
- Use photos from the web: only the supplied images, the logo and drawings made in code.

## 9. Responsive

| Name | Width | Key changes |
|---|---|---|
| Phone | under 640 | One column. Hero copy first, then the 4:3 car card, then the facts. One lit car per service. Benefit cards as a list. Why tiles one per row. 404 actions full width. |
| Large phone, tablet | 640 to 1023 | Two-column bento and map card at 3:2; sticky stages stay off. |
| Desktop | 1024 and up | Glass pill nav with links. Sticky services stage, stacked benefit cards, sticky shade drawing, pointer lamp. |
| Wide | 1440 and up | Container caps at 1440; display sizes stop growing. |

- Touch targets 44px minimum, 8px apart. No horizontal scroll at any width.
- A phone on its side keeps the menu usable (three columns).

## 10. Accessibility

- Landmarks, one h1, ordered headings, a skip link first in the tab order.
- Focus: a 2px care-blue ring with a 3px offset, never removed; sticky UI never covers the focused control.
- Contrast AA everywhere; green and lavender never as small text.
- Every drag has a keyboard and button path (sliders; the canvas has Scratch it, Heal it and Reset).
- The ticker has a pause button (WCAG 2.2.2) and stops under reduced motion.
- `lang="en-IN"`; the Marathi line carries `lang="mr"`.
- Readable with JavaScript off: content is server-rendered; hidden pre-reveal states need `html.js` and no reduced-motion request.
