"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";

/** The ticker's drift: reacts to scroll speed, pauses on hover, offscreen or on request. */
export function TickerMotion({ root, paused }: { root: RefObject<HTMLElement | null>; paused: boolean }) {
  const { plugins, reduced } = useMotion();
  const tween = useRef<gsap.core.Tween | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
    if (!tween.current) return;
    if (paused) tween.current.pause();
    else tween.current.play();
  }, [paused]);

  useGSAP(
    () => {
      const el = root.current;
      const track = el?.querySelector<HTMLElement>(".ticker-track");
      if (reduced || !el || !track) return;
      el.setAttribute("data-moving", "true");
      const loop = gsap.to(track, { xPercent: -50, duration: 42, ease: "none", repeat: -1, paused: pausedRef.current });
      tween.current = loop;

      let inView = true;
      let hovering = false;
      const sync = () => (inView && !hovering && !pausedRef.current ? loop.play() : loop.pause());
      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      });
      io.observe(el);
      const enter = () => {
        hovering = true;
        sync();
      };
      const leave = () => {
        hovering = false;
        sync();
      };
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);

      // Scroll speed nudges the drift, then it settles back.
      const st = plugins?.ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (loop.paused()) return;
          const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 500, 5);
          gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => void gsap.to(loop, { timeScale: 1, duration: 1.2 }) });
        },
      });

      return () => {
        io.disconnect();
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
        st?.kill();
        tween.current = null;
        el.removeAttribute("data-moving");
      };
    },
    { dependencies: [reduced, plugins], revertOnUpdate: true, scope: root },
  );

  return null;
}
