"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

/**
 * Section reveals from data attributes, armed once the scroll plugins have loaded:
 *   data-reveal="lines"  headings rise line by line inside masks (SplitText)
 *   data-reveal="rise"   text and groups rise 24px with opacity
 *   data-reveal="image"  pictures open from a clip-path inset with a little inner parallax
 * Only elements still below the fold are hidden first, so nothing on screen ever waits for script.
 */
export function RevealRuntime() {
  const { plugins, reduced } = useMotion();

  useGSAP(
    () => {
      if (!plugins || reduced) return;
      const { SplitText } = plugins;
      const fold = window.innerHeight * 0.92;
      const below = (el: Element) => el.getBoundingClientRect().top > fold;
      const trigger = (el: Element) => ({ trigger: el, start: "top 88%", once: true });

      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (!below(el)) return;
        const kind = el.dataset.reveal;

        if (kind === "lines") {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              return gsap.from(self.lines, {
                yPercent: 105,
                duration: 1,
                stagger: 0.08,
                ease: "squeegee",
                scrollTrigger: trigger(el),
              });
            },
          });
        } else if (kind === "rise") {
          gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: "squeegee", scrollTrigger: trigger(el) });
        } else if (kind === "image") {
          const media = el.querySelector("img");
          gsap.from(el, {
            clipPath: "inset(12% 0% 12% 0% round 6px)",
            duration: 1.2,
            ease: "squeegee",
            scrollTrigger: trigger(el),
          });
          if (media) {
            gsap.fromTo(
              media,
              { scale: 1.12, yPercent: -4 },
              { yPercent: 4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } },
            );
          }
        }
      });
    },
    { dependencies: [plugins, reduced], revertOnUpdate: true },
  );

  return null;
}
