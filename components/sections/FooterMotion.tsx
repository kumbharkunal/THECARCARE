"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

/** The outlined name fills with care-blue as it rises into view. */
export function FooterMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  const { plugins, reduced } = useMotion();

  useGSAP(
    () => {
      if (!plugins || reduced) return;
      const footer = anchor.current?.closest("footer");
      const name = footer?.querySelector<HTMLElement>(".footer-name");
      const fill = footer?.querySelector<HTMLElement>(".footer-name-fill");
      if (!name || !fill) return;
      gsap.fromTo(
        fill,
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          // ends exactly at the bottom of the page, so the fill always completes
          scrollTrigger: { trigger: name, start: "top 92%", endTrigger: footer, end: "bottom bottom", scrub: 0.8 },
        },
      );
    },
    { dependencies: [plugins, reduced], revertOnUpdate: true },
  );

  return <span ref={anchor} hidden />;
}
