"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { loadMotionPlugins, type MotionPlugins } from "@/lib/gsap";
import { useMotionRuntime } from "@/components/shell/Providers";

/**
 * Loaded once the page is idle: brings in GSAP and its plugins, hands them to every motion
 * island through context, and runs Lenis on the GSAP ticker (one clock) when motion is allowed.
 */
export default function MotionRuntime() {
  const { smooth, setPlugins, lenisRef } = useMotionRuntime();
  const [loaded, setLoaded] = useState<MotionPlugins | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMotionPlugins().then((plugins) => {
      if (cancelled) return;
      setLoaded(plugins);
      setPlugins(plugins);
      document.fonts?.ready.then(() => plugins.ScrollTrigger.refresh());
    });
    return () => {
      cancelled = true;
    };
  }, [setPlugins]);

  // Sections far down are drawn only as they near the screen (content-visibility), so the page
  // grows as you scroll: re-measure every armed trigger when it does.
  useEffect(() => {
    const main = document.getElementById("main");
    if (!loaded || !main) return;
    let timer = 0;
    let last = main.offsetHeight;
    const ro = new ResizeObserver(([entry]) => {
      const height = Math.round(entry.contentRect.height);
      if (height === last) return;
      last = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => loaded.ScrollTrigger.refresh(), 160);
    });
    ro.observe(main);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, [loaded]);

  useEffect(() => {
    if (!smooth || !loaded) return;
    const { gsap, ScrollTrigger } = loaded;
    const lenis = new Lenis({ autoRaf: false, lerp: 0.11, syncTouch: false, smoothWheel: true, stopInertiaOnNavigate: true });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    const off = lenis.on("scroll", ScrollTrigger.update);
    lenisRef.current = lenis;
    return () => {
      off();
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [smooth, loaded, lenisRef]);

  return null;
}
