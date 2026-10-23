"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/components/shell/Providers";
import { ChevronMark } from "@/components/art/Chevrons";

/** Brand and product names drifting by; reacts to scroll speed, pauses on hover, offscreen or on request. */
export function Ticker() {
  const { ticker } = site;
  const root = useRef<HTMLElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const { plugins, reduced, mounted } = useMotion();

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
      if (!mounted || reduced || !el || !track) return;
      el.dataset.moving = "true";
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
        delete el.dataset.moving;
      };
    },
    { dependencies: [mounted, reduced, plugins], revertOnUpdate: true, scope: root },
  );

  const group = (copy: number) => (
    <div className="ticker-group" key={copy}>
      {ticker.items.map((item) => (
        <span key={`${copy}-${item}`} className="ticker-cell">
          <span className="ticker-item heading">{item}</span>
          <ChevronMark className="ticker-chev" />
        </span>
      ))}
    </div>
  );

  return (
    <section ref={root} className="ticker" aria-label={ticker.label}>
      <ul className="sr-only">
        {ticker.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="ticker-viewport" aria-hidden>
        <div className="ticker-track">
          {group(0)}
          {group(1)}
        </div>
      </div>
      <button
        type="button"
        className="ticker-toggle"
        aria-pressed={paused}
        aria-label={paused ? ticker.play : ticker.pause}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play size={18} weight="fill" aria-hidden /> : <Pause size={18} weight="fill" aria-hidden />}
      </button>
    </section>
  );
}
