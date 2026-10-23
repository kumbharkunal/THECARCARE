"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

/** The line draws with the scroll; each chevron marker fills green as the line reaches it. */
export function ProcessMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  const { plugins, reduced } = useMotion();

  useGSAP(
    () => {
      if (!plugins) return;
      const section = anchor.current?.closest("section");
      const track = section?.querySelector<HTMLElement>(".process-track");
      const line = section?.querySelector<SVGLineElement>(".process-line-draw");
      if (!section || !track || !line) return;
      const { ScrollTrigger } = plugins;
      const markers = Array.from(section.querySelectorAll<HTMLElement>(".process-step"));
      section.dataset.armed = "true";

      if (reduced) {
        markers.forEach((m) => (m.dataset.reached = "true"));
        gsap.set(line, { drawSVG: "100%" });
        return;
      }

      gsap.fromTo(
        line,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          ease: "none",
          scrollTrigger: { trigger: track, start: "top 62%", end: "bottom 62%", scrub: 0.6 },
        },
      );
      markers.forEach((step) => {
        const marker = step.querySelector(".process-marker");
        ScrollTrigger.create({
          trigger: marker ?? step,
          start: "center 62%",
          onEnter: () => (step.dataset.reached = "true"),
          onLeaveBack: () => (step.dataset.reached = "false"),
        });
      });
    },
    { dependencies: [plugins, reduced], revertOnUpdate: true },
  );

  return <span ref={anchor} hidden />;
}
