"use client";

import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

/**
 * Section reveals from data attributes, armed once the scroll plugins have loaded:
 *   data-reveal="lines"  headings rise line by line inside masks (SplitText)
 *   data-reveal="rise"   text and groups rise 24px with opacity
 *   data-reveal="image"  pictures open from a clip-path inset with a little inner parallax
 * One IntersectionObserver does the work: its first report on each element hides only what is
 * wholly below the screen (nothing on screen ever waits for script), and later reports play each
 * reveal as it arrives; a scroll check catches anything it misses. Headings split into lines only then and are
 * restored when they finish. Hidden means opacity only, so headings and text stay in the
 * accessibility tree, and focusing into a waiting element plays its reveal at once.
 */
export function RevealRuntime() {
  const { plugins, reduced } = useMotion();

  useGSAP(
    (_, contextSafe) => {
      if (!plugins || reduced || !contextSafe) return;
      const { SplitText } = plugins;
      const elements = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
      if (!elements.length) return;

      const hide = contextSafe((el: HTMLElement) => {
        const kind = el.dataset.reveal;
        if (kind === "lines") gsap.set(el, { opacity: 0 });
        else if (kind === "rise") gsap.set(el, { y: 24, opacity: 0 });
        else if (kind === "image") gsap.set(el, { clipPath: "inset(12% 0% 12% 0% round 6px)" });
      });

      const play = contextSafe((el: HTMLElement) => {
        const kind = el.dataset.reveal;
        if (kind === "lines") {
          const split = SplitText.create(el, { type: "lines", mask: "lines" });
          gsap.set(el, { opacity: 1 });
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 1,
            stagger: 0.08,
            ease: "squeegee",
            onComplete: () => split.revert(),
          });
        } else if (kind === "rise") {
          gsap.to(el, { y: 0, opacity: 1, duration: 0.9, ease: "squeegee", clearProps: "transform,opacity" });
        } else if (kind === "image") {
          gsap.to(el, { clipPath: "inset(0% 0% 0% 0% round 6px)", duration: 1.2, ease: "squeegee", clearProps: "clipPath" });
          // A slow inner drift while the picture crosses the screen.
          const media = el.querySelector("img");
          if (media) {
            gsap.fromTo(
              media,
              { scale: 1.12, yPercent: -4 },
              { yPercent: 4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } },
            );
          }
        }
      });

      const seen = new Set<Element>();
      const waiting = new Set<Element>();
      const reveal = (el: Element) => {
        if (!waiting.delete(el)) return;
        io.unobserve(el);
        play(el as HTMLElement);
      };
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            if (!seen.has(el)) {
              seen.add(el);
              // Anything that has reached the screen, even its last few pixels, or that is
              // scrolled past stays exactly as it is: only what is wholly below hides.
              if (entry.boundingClientRect.top < window.innerHeight) {
                io.unobserve(el);
                continue;
              }
              hide(el);
              waiting.add(el);
              continue;
            }
            if (entry.isIntersecting) reveal(el);
          }
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      elements.forEach((el) => io.observe(el));

      // Belt and braces for phones: if the observer ever misses a fast flick, the next scroll
      // frame reveals anything waiting that has already reached the screen.
      let frame = 0;
      const sweep = () => {
        frame = 0;
        const limit = window.innerHeight * 0.95;
        for (const el of waiting) if (el.getBoundingClientRect().top < limit) reveal(el);
        if (seen.size === elements.length && !waiting.size) window.removeEventListener("scroll", onScroll);
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(sweep);
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      const onFocus = (event: FocusEvent) => {
        const el = (event.target as Element | null)?.closest?.("[data-reveal]");
        if (el) reveal(el);
      };
      document.addEventListener("focusin", onFocus);

      return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(frame);
        document.removeEventListener("focusin", onFocus);
      };
    },
    { dependencies: [plugins, reduced], revertOnUpdate: true },
  );

  return null;
}
