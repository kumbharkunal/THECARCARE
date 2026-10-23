# Progress

Resume point for the build. Updated after every phase.

## Done
- **Phase 1, setup.** The kit files are moved: the brief and image prompts are in `docs/`, which is git-ignored. Git is initialised with `origin`. Next.js 16.4.2 is scaffolded, with every planned dependency installed. I read the Next 16 docs: image `qualities` is required, Cache Components are on, and the build output no longer shows First Load JS.
- **Phase 2, assets.**
  - `scripts/optimize-images.mjs` covers the 11 slots: it writes WebP, a manifest with blur placeholders, the client's logos with an exact white matte, and the icons (png, apple, ico).
  - `scripts/export-social.mjs` exports the official theSVG marks, with their ids prefixed.
- **Phase 3, design system.** `DESIGN.md` is written, along with the tokens in `app/globals.css` and all copy plus the CONFIRM list in `content/site.ts`.
- **Phase 4, shell.**
  - Glass pill nav, with a mobile sheet you can drag or flick to close, a focus trap, and inert content behind it.
  - Floating WhatsApp button.
  - Lenis on the GSAP ticker; plugins load after first paint.
  - The menu stress test passes.
- **Phase 5, hero and ticker.**
  - CSS load sequence: masks, chevron draw, sweep.
  - Pointer lamp on desktop.
  - Art-directed picture: the 3:4 card on phones, the wide photo in a 4:3 card on tablets, and the 16:9 stage on desktop.
  - Ticker with a pause control.
  - Checked at 360 to 1920 wide.
- **Phase 6, services.** One hand-drawn car with four zone layers, sticky on desktop, plus a car per block on phones.
- **Phase 7, sun film, PPF and ceramic.**
  - Stacked benefit cards with the glare compare.
  - Road-legal shade guide.
  - Offer card.
  - Scratch-and-heal canvas.
  - Ceramic compare.
- **Phase 8, remaining sections.**
  - Why bento with a traced hover hairline.
  - Process line.
  - FAQ accordion.
  - Visit: display rows, a drawn map that loads only on click, and the WhatsApp enquiry builder.
  - Footer with the edge-to-edge wordmark fill.
  - Section reveals.
  - Section screenshots at 360, 390, 768, 1024 and 1440 are reviewed and fixed.

## Next
- Phase 9: motion pass (reduced motion, JS off).
- Phase 10: 404, OG image, manifest, robots, sitemap.
- Phase 11: QA scripts and audits.
- Phase 12: deploy, jury, README.

## Blockers
- None.
