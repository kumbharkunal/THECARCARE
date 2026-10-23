"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

/**
 * Section reveals from data attributes, armed once the scroll plugins have loaded:
 *   data-reveal="lines"  headings rise line by line inside masks (SplitText)
 *   data-reveal="rise"   text and groups rise 24px with opacity
 *   data-reveal="image"  pictures open from a clip-path inset with a little inner parallax
 * Only elements still below the fold are hidden first, so nothing on screen ever waits for script.
 * One IntersectionObserver plays each reveal as it arrives; headings are split into lines only
 * then (one small measure per heading, not a burst at load) and restored when they finish.
 */
export function RevealRuntime() {
  const { plugins, reduced } = useMotion();

  useGSAP(
    (_, contextSafe) => {
      if (!plugins || reduced || !contextSafe) return;
      const { SplitText } = plugins;
      const fold = window.innerHeight * 0.92;
      // Read every position first, then write: one layout pass.
      const pending = [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
        (el) => el.getBoundingClientRect().top > fold,
      );
      if (!pending.length) return;

      for (const el of pending) {
        const kind = el.dataset.reveal;
        if (kind === "lines") gsap.set(el, { autoAlpha: 0 });
        else if (kind === "rise") gsap.set(el, { y: 24, autoAlpha: 0 });
        else if (kind === "image") gsap.set(el, { clipPath: "inset(12% 0% 12% 0% round 6px)" });
      }

      const play = contextSafe((el: HTMLElement) => {
        const kind = el.dataset.reveal;
        if (kind === "lines") {
          const split = SplitText.create(el, { type: "lines", mask: "lines" });
          gsap.set(el, { autoAlpha: 1 });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 1,
            stagger: 0.08,
            ease: "squeegee",
            onComplete: () => split.revert(),
          });
        } else if (kind === "rise") {
          gsap.to(el, { y: 0, autoAlpha: 1, duration: 0.9, ease: "squeegee", clearProps: "transform,opacity,visibility" });
        } else if (kind === "image") {
          gsap.to(el, { clipPath: "inset(0% 0% 0% 0% round 6px)", duration: 1.2, ease: "squeegee", clearProps: "clipPath" });
        }
      });

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            io.unobserve(entry.target);
            play(entry.target as HTMLElement);
          }
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      pending.forEach((el) => io.observe(el));

      // The two feature pictures keep a slow inner drift while they cross the screen.
      for (const el of pending) {
        const media = el.dataset.reveal === "image" ? el.querySelector("img") : null;
        if (!media) continue;
        gsap.fromTo(
          media,
          { scale: 1.12, yPercent: -4 },
          { yPercent: 4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } },
        );
      }

      return () => io.disconnect();
    },
    { dependencies: [plugins, reduced], revertOnUpdate: true },
  );

  return null;
}
