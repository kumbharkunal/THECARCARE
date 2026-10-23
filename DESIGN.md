# DESIGN.md: The Car Care

> Invisible armour, held in good hands. A bright studio where protection shows up as light.

This file is the spec the code follows. Tokens live in `app/globals.css` (`@theme`), copy lives in `content/site.ts`. When this file and the code disagree, fix one of them in the same commit.

## 0. Argument (one claim per section)

| Section | Claim | Proof on the page |
|---|---|---|
| Hero | They protect cars, not just clean them | Their own line, the logo's roof drawing itself over a car, a band of light passing over the paint |
| Ticker | They fit named, branded films | Garware and GSWF product names |
| Services | Four layers, each on a different part of the car | One drawn car whose zones light up per service |
| Sun film | Film does four things every drive, legally | Their four benefits, a glare comparison, a road-legal shade guide |
| PPF | The film heals light swirls | A paint panel you scratch and watch heal |
| Ceramic | Gloss and easier washing | Before and after on the same panel |
| Why | They come to you, with real brands and warranties | Doorstep photo, warranty years, WhatsApp |
| Process | Booking is four plain steps | A line that draws through the steps |
| FAQ | Straight answers, including the law | Six questions, FAQPage data |
| Visit | Easy to reach, easy to brief | Phone and address set large, map, an enquiry builder that writes the WhatsApp message |

**Idea sentence:** on this page, the logo's shield roof and the detailer's inspection lamp become the light that passes over paint and glass and shows protection you cannot otherwise see.
**Live things:** the scratch and heal panel, the road-legal shade guide.
**Peak:** "the site where you scratch the paint and watch it heal."

## 1. Visual Theme & Atmosphere

- **Style:** bright automotive studio, photo-led, precise.
- **Keywords:** porcelain, studio light, invisible film, line drawing, squeegee, calm, exact.
- **Tone:** confident and warm, Indian English, short sentences. NOT a garage price list, NOT a dark poster, NOT a tech product.
- **Feel:** standing in a clean white bay while a detailer runs an inspection lamp along your paint.
- **Interaction tier:** L3 (scroll-linked scenes, pointer lamp, a sticky stage), with every scene finished and readable under reduced motion and without JavaScript.
- **Dependencies:** GSAP (ScrollTrigger, SplitText, DrawSVG), Lenis, Motion (UI state only).
- **Light theme only.** No dark mode, no dark sections. Their Instagram posters are dark; the website is deliberately the bright side of the brand.

## 2. Color Palette & Roles

```css
:root {
  /* Grounds */
  --porcelain: #F6F8FC;   /* 246 248 252  page ground */
  --paper:     #FBFCFE;   /* 251 252 254  cards, sheets, nav glass base */
  --mist:      #EBF0FA;   /* 235 240 250  alternate section field */

  /* Ink */
  --ink:       #0E1A33;   /* 14 26 51     headings and running text */
  --ink-soft:  #4A5670;   /* 74 86 112    secondary text (7.1:1 on porcelain) */
  --rule:      #D9E0EE;   /* 217 224 238  hairlines (four named places only) */

  /* Brand, sampled from the client's original logo file */
  --care-blue:        #4066AF;  /* 64 102 175  actions, links, focus, line drawings (5.3:1) */
  --care-blue-deep:   #2F4F8F;  /* 47 79 143   hover and pressed */
  --shield-green:     #12964B;  /* 18 150 75   protected states, chevron, progress; large text and graphics only */
  --shield-green-ink: #0E7A3D;  /* 14 122 61   green as small text */
  --lavender:         #A4B0DA;  /* 164 176 218 light sweep tint, UV rays; never text */

  /* Scoped */
  --sun-warm: #E8A33D;    /* visible-light rays in the shade guide only; the one warm colour */
  --danger:   #B42318;    /* form errors (6.4:1 on paper) */
}
```

**Rules**
- Components use tokens only. No raw hex in components.
- Proportions: grounds 80 to 90% of any screen, ink for type, care-blue under 5% (the action and the line drawings), green only where something is protected.
- Never pure black or pure white surfaces. Text on care-blue buttons is `--paper`.
- Gradients exist in exactly three places: the logo's inner chevron (its own artwork), the light sweep over paint and glass, and neutral scrims. Nowhere else.
- WhatsApp green #25D366 appears only inside the official WhatsApp mark.

## 3. Typography Rules

Loaded with `next/font/google`, self-hosted, `display: swap`.

| Role | Font | Size | Weight / width | Line height | Tracking |
|---|---|---|---|---|---|
| H1 main | Archivo | clamp(3rem, 1rem + 5.6vw, 7rem) | 800, wdth 64 | 0.9 | -0.01em |
| H1 lead line | Archivo | clamp(1.375rem, 1rem + 1.2vw, 2rem) | 600, wdth 82 | 1.1 | 0 |
| H2 | Archivo | clamp(2.25rem, 1.2rem + 3.6vw, 5rem) | 780, wdth 66 | 0.95 | -0.01em |
| H3 / lead | Archivo | clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem) | 650, wdth 80 | 1.2 | 0 |
| Body | Archivo | clamp(1rem, 0.96rem + 0.2vw, 1.125rem) | 400 (550 emphasis), wdth 100 | 1.6 | 0 |
| Small | Archivo | clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem) | 450 | 1.45 | 0.005em |
| Numerals | Geist Mono | inherits the step it sits in | 500 | 1 | -0.02em at large sizes |
| Marathi line | Anek Devanagari | lead step | 600 | 1.4 | 0 |

- One family carries everything; the condensed heavy cut echoes the wordmark. Geist Mono only for measured numbers (VLT, percentages, warranty years) and the benefit numerals 1 to 4 from their own carousel.
- Headlines are two lines or fewer at every width; breaks are authored, not left to chance.
- Body copy is full ink at 16px or more; measure 45 to 70ch.
- Sentence case everywhere. No tiny tracked capitals, no eyebrows, no accent word styled differently.
- Text decoration: no gradient text, no text shadow, no outline stroke except the decorative footer name (aria-hidden).
- **Never use:** Inter, Roboto, Arial or system faces as the display voice.

## 4. Component Stylings

**Buttons (pill, min height 48px, 52px for primary actions)**
- Primary: `--care-blue` fill, `--paper` text, 600 weight. The WhatsApp mark sits on its own paper disc inside the pill (official colours untouched).
  hover (fine pointer): fill `--care-blue-deep`, disc nudges 2px right. active: `scale(0.97)` 140ms. focus-visible: 2px `--care-blue` ring, 3px offset. disabled: 45% opacity, no pointer.
- Secondary: `--mist` fill, `--ink` text. hover: fill one step darker (`color-mix` with ink 6%). Same press and focus.
- Text link: `--care-blue`, underline offset 0.18em, thickness 0.07em; hover: `--care-blue-deep`.

**Cards and tiles**: `--paper` on porcelain or mist, radius 6px, no border, no shadow at rest. Bento hover: lift 2px and a hairline outline draws round the tile (SVG stroke, 600ms).

**Navigation (floating glass pill)**
- Desktop: centred 16px from the top, max 820px, 60px high. `--paper` at 65%, `backdrop-filter: blur(18px) saturate(160%)`, 1px border of ink at 8%, an inner top highlight, one float shadow. After the hero: 82% opacity. Falls back to 94% paper without backdrop-filter, to solid paper under `prefers-reduced-transparency`, and gets a solid ink border under `prefers-contrast: more`.
- Active link: a soft mist pill slides behind it (shared layout).
- Mobile: pill 12px + safe area from the top, `calc(100% - 24px)` wide; the same element morphs into a sheet (28px radius, up to 88svh). While open, the scrim behind carries the only blur and the sheet is near-opaque paper, so no blurred layer is ever transformed.

**Chips and segmented control**: pill, 44px targets. Off: `--paper` with a hairline, ink text. On: `--care-blue` fill, paper text, check glyph. Segmented: a sliding paper pill inside a mist track.

**Sliders (compare, shade)**: track or divider line in paper with an ink hairline shadow; the handle is a 44px pill with two carets. Focus ring on the handle. Keyboard: arrows (shift for 10), Home, End, PageUp, PageDown.

**Form fields**: real labels above, 48px height, `--paper` fill, 1px `--rule` border (form fields are allowed lines), focus 2px care-blue ring. Errors: `--danger` text under the field, linked by `aria-describedby`.

## 5. Layout Principles

- Container: max 1440px, side padding `clamp(16px, 4vw, 48px)`. Large media may bleed to the edges.
- Grid: 12 columns, gap `clamp(12px, 1.6vw, 24px)`. Anchor lines: column 1 (most text) and column 8 (split-stage reading column).
- Section spacing: `clamp(4.5rem, 3rem + 6vw, 12.5rem)` top and bottom; space above a heading is at least twice the space below it.
- Section fields alternate by tone (porcelain, mist, paper) instead of divider lines.
- Hairlines appear in exactly four places: the hero fact row, FAQ rows, the bento hover outline, form fields.
- Radius: pill for interactive controls; 6px for images and cards.

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | none | Everything at rest |
| Tone | one step of ground colour | Cards and section fields |
| Float | `0 10px 30px -12px rgb(14 26 51 / .18), 0 2px 6px -2px rgb(14 26 51 / .08)` | Nav pill, menu sheet, WhatsApp button only |

## 7. Animation & Interaction

- **Motion verb:** a squeegee pass. A firm start and a long, smooth finish: `--ease-squeegee: cubic-bezier(0.22, 1, 0.36, 1)`.
- **Tools, one job each:** Lenis for wheel smoothing (native touch, off under reduced motion), driven by the GSAP ticker. GSAP for scroll and timelines (ScrollTrigger, SplitText, DrawSVG). Motion for UI state (nav, menu, chips, accordion icon, slider springs). CSS keyframes for the hero load sequence, so the first 2.4 seconds never wait for JavaScript.
- **One clock:** the GSAP ticker drives Lenis, ScrollTrigger and both canvas loops. No `window.addEventListener('scroll')`.
- **Properties:** transform, opacity, clip-path, mask position, SVG stroke. The FAQ panel's `grid-template-rows` (300ms) is the one layout transition.
- **Durations:** press 140ms, hover 180ms, UI 240 to 320ms, reveals 0.8 to 1.2s, staggers 60 to 80ms, scrub 0.6 to 1. Springs for the nav and menu: stiffness 420, damping 38, mass 0.9.
- **Load sequence (hero, CSS):** H1 lines rise in masks (0 to 1.0s); green chevron draws, then blue (0.4 to 1.6s); one lavender-white band sweeps the car (1.6 to 2.4s). Afterwards on desktop with a fine pointer, the band follows the pointer like an inspection lamp and drifts when idle.
- **Reveals:** headings by SplitText lines rising in masks; images by a clip-path inset with about 8% inner parallax; hairlines draw from the left. Armed only for elements below the fold, so nothing on screen waits for script.
- **Signature moments:** the shield goes on (hero), four layers of care (services), the road-legal shade guide, scratch it and watch it heal (PPF), the ceramic before and after.
- **Reduced motion:** the finished page. No Lenis, no scrub, no parallax, no sweep, no pointer lamp. Opacity changes stay.
- **Hover** motion only under `(hover: hover) and (pointer: fine)`.

## 8. Do's and Don'ts

**Do**
- Take every fact from `content/site.ts`; anything unconfirmed goes in `CONFIRM`.
- Keep the chevron motif to three places: hero, process markers, footer.
- Show protection as light: sweeps, tints, outlines that draw.
- Keep every headline to two lines; author the breaks.
- Give every control hover, focus-visible and active states.
- Test at 360, 390, 768, 1024, 1440 and 1920.
- Use the official theSVG marks for Instagram, Facebook and WhatsApp, rendered as images.

**Don't**
- ❌ Invent stats, years, prices, counts, reviews or awards.
- ❌ Use em dashes or en dashes in UI copy.
- ❌ Put an eyebrow or pill label above a heading.
- ❌ Build rows of three equal cards or put icons in tinted circles.
- ❌ Add shadows to resting elements or glass anywhere except the nav, menu sheet and WhatsApp button.
- ❌ Use gradients outside the three allowed places.
- ❌ Add scroll cues, preloaders or custom cursors.
- ❌ Animate width, height, top, left, filter or backdrop-filter.
- ❌ Offer repairs, servicing, accessories or dark, non-compliant tints.
- ❌ Use photos from the web; only the provided images, the logo and our own drawings.

## 9. Responsive Behavior

| Name | Width | Key changes |
|---|---|---|
| Phone | < 768 | Single column. Hero copy first, then a 3:4 hero card. Services show one lit car per block. Sun-film cards are a list. Canvas at 84% width. |
| Tablet | 768 to 1023 | Two-column splits where they fit; sticky stages stay off. |
| Desktop | 1024 and up | Glass pill nav with links. Sticky services car and stacked sun-film cards. Pointer lamp in the hero. |
| Wide | 1440 and up | Container caps at 1440; display sizes stop growing. |

- Touch targets 44px minimum, 8px apart.
- The hero H1, sub and primary action are in view without scrolling at 360x640 and 1366x768.
- No horizontal scroll at any width.

## 10. Accessibility

- Landmarks, one h1, ordered headings, a skip link first in the tab order.
- Focus: 2px care-blue ring with 3px offset, never removed. Sticky UI never hides the focused control (`scroll-padding-top`).
- Contrast: AA everywhere; green and lavender never as small text.
- Every drag has a keyboard path (sliders, the canvas has Scratch it / Heal it / Reset).
- The ticker has a visible pause button (WCAG 2.2.2) and stops under reduced motion.
- `lang="en-IN"`; the Marathi line carries `lang="mr"`.
- Readable with JavaScript off: content is server-rendered; hidden pre-reveal states need `html.js`.
