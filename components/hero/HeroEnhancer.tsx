"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

const LOAD_SEQUENCE_MS = 1900;

/**
 * Hero behaviour on top of the CSS load sequence:
 * - phone: the roof and sweep play once the card is 60% in view;
 * - desktop (fine pointer): the light band becomes an inspection lamp that follows the
 *   pointer slowly and drifts on its own when idle; the car eases from 1.04 to 1 on scroll.
 */
export function HeroEnhancer() {
  const anchor = useRef<HTMLSpanElement>(null);
  const { plugins, reduced, mounted } = useMotion();

  // Phone: play the roof and sweep when the card is mostly visible.
  useEffect(() => {
    const media = anchor.current?.closest("section")?.querySelector<HTMLElement>("[data-hero-media]");
    if (!media || window.matchMedia("(min-width: 1024px)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          media.dataset.play = "true";
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(media);
    return () => io.disconnect();
  }, []);

  // Desktop: inspection lamp.
  useGSAP(
    () => {
      if (!mounted || reduced) return;
      const section = anchor.current?.closest("section");
      const frame = section?.querySelector<HTMLElement>(".hero-frame");
      const lamp = section?.querySelector<HTMLElement>(".hero-lamp");
      if (!section || !frame || !lamp) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (hover: hover) and (pointer: fine)", () => {
        let lastMove = 0;
        let inView = true;
        let drifting = true;
        const width = () => frame.offsetWidth;
        const lampWidth = () => lamp.offsetWidth;
        // Rest position: over the bonnet and windscreen.
        let base = width() * 0.45;
        gsap.set(lamp, { x: base, opacity: 0 });
        const xTo = gsap.quickTo(lamp, "x", { duration: 1.6, ease: "power3.out" });

        const intro = gsap.to(lamp, { opacity: 1, duration: 0.8, delay: LOAD_SEQUENCE_MS / 1000, ease: "power2.out" });

        const onMove = (event: PointerEvent) => {
          const rect = frame.getBoundingClientRect();
          base = gsap.utils.clamp(-lampWidth() * 0.3, width() - lampWidth() * 0.7, event.clientX - rect.left - lampWidth() / 2);
          lastMove = performance.now();
          drifting = false;
          xTo(base);
        };
        const tick = () => {
          if (!inView) return;
          if (!drifting && performance.now() - lastMove > 2200) drifting = true;
          if (drifting) {
            const t = performance.now() / 1000;
            xTo(base + Math.sin(t * 0.32) * width() * 0.09);
          }
        };
        const io = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
        });
        io.observe(section);
        section.addEventListener("pointermove", onMove, { passive: true });
        gsap.ticker.add(tick);
        return () => {
          intro.kill();
          io.disconnect();
          section.removeEventListener("pointermove", onMove);
          gsap.ticker.remove(tick);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [mounted, reduced], revertOnUpdate: true },
  );

  // Desktop: the car settles from 1.04 to 1 and drifts a little as the hero scrolls away.
  useGSAP(
    () => {
      if (!plugins || reduced) return;
      const section = anchor.current?.closest("section");
      const layer = section?.querySelector<HTMLElement>(".hero-scale");
      if (!section || !layer) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          layer,
          { scale: 1.04, yPercent: 0 },
          {
            scale: 1,
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { dependencies: [plugins, reduced], revertOnUpdate: true },
  );

  return <span ref={anchor} hidden />;
}
