"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

/** Draws a service's layer on a car: rays, outlines, the gloss run, interior lines. */
function drawZone(svg: SVGSVGElement, zone: string) {
  const tl = gsap.timeline({ defaults: { ease: "squeegee" } });
  if (zone === "sun-film") {
    // Dashed rays travel in from the sky and stop at the film (DrawSVG would erase the dashes).
    tl.fromTo(svg.querySelectorAll(".z-uv-ray"), { x: -46, y: -75, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.9, stagger: 0.08 });
    tl.fromTo(svg.querySelectorAll(".z-uv-stop"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, stagger: 0.08 }, "-=0.45");
  } else if (zone === "ppf") {
    tl.fromTo(svg.querySelectorAll(".z-ppf path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, stagger: 0.12 });
  } else if (zone === "ceramic") {
    const line = svg.querySelector(".z-gloss-line");
    if (line) {
      tl.fromTo(line, { drawSVG: "0% 8%", opacity: 1 }, { drawSVG: "92% 100%", duration: 1.5, ease: "power1.inOut" });
      tl.to(line, { drawSVG: "0% 100%", opacity: 0.55, duration: 0.7 });
    }
  } else if (zone === "detailing") {
    tl.fromTo(svg.querySelectorAll(".z-interior path, .z-interior ellipse"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, stagger: 0.07 });
  }
  return tl;
}

export function ServicesMotion() {
  const anchor = useRef<HTMLSpanElement>(null);
  const { plugins, reduced } = useMotion();

  useGSAP(
    () => {
      if (!plugins) return;
      const section = anchor.current?.closest("section");
      if (!section) return;
      const { ScrollTrigger } = plugins;
      const blocks = Array.from(section.querySelectorAll<HTMLElement>(".service"));
      const car = section.querySelector<SVGSVGElement>("#services-car");
      const name = section.querySelector<HTMLElement>("[data-caption-name]");
      const count = section.querySelector<HTMLElement>("[data-caption-count]");
      const mm = gsap.matchMedia();

      // Desktop: one sticky car; each block lights its zone as it reaches the middle.
      mm.add("(min-width: 1024px)", () => {
        let current = "";
        let running: gsap.core.Timeline | null = null;
        const activate = (block: HTMLElement) => {
          const zone = block.dataset.service ?? "";
          if (!car || zone === current) return;
          current = zone;
          car.dataset.zone = zone;
          car.setAttribute("aria-label", block.dataset.label ?? "");
          blocks.forEach((b) => (b.dataset.active = b === block ? "true" : "false"));
          if (name) name.textContent = block.querySelector(".service-name")?.textContent ?? "";
          if (count) count.textContent = `${block.dataset.index} of ${blocks.length}`;
          running?.kill();
          if (!reduced) running = drawZone(car, zone);
        };
        blocks.forEach((block) =>
          ScrollTrigger.create({
            trigger: block,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && activate(block),
          }),
        );
        return () => running?.kill();
      });

      // Phone: each block has its own lit car; draw its layer once as it arrives.
      mm.add("(max-width: 1023px)", () => {
        if (reduced) return;
        blocks.forEach((block) => {
          const svg = block.querySelector<SVGSVGElement>(".service-car");
          if (!svg) return;
          ScrollTrigger.create({
            trigger: svg,
            start: "top 80%",
            once: true,
            onEnter: () => drawZone(svg, block.dataset.service ?? ""),
          });
        });
      });

      return () => mm.revert();
    },
    { dependencies: [plugins, reduced], revertOnUpdate: true },
  );

  return <span ref={anchor} hidden />;
}
