"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

/** Desktop: as each benefit card slides over the last, the one beneath settles back a little. */
export function StackMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  const { plugins, reduced } = useMotion();

  useGSAP(
    () => {
      if (!plugins || reduced) return;
      const section = anchor.current?.closest("section");
      if (!section) return;
      const cards = Array.from(section.querySelectorAll<HTMLElement>(".benefit"));
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        cards.slice(0, -1).forEach((card, index) => {
          const next = cards[index + 1];
          const inner = card.querySelector(".benefit-card");
          if (!inner) return;
          gsap.to(inner, {
            scale: 0.94,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: 0.6 },
          });
        });
      });
      return () => mm.revert();
    },
    { dependencies: [plugins, reduced], revertOnUpdate: true },
  );

  return <span ref={anchor} hidden />;
}
