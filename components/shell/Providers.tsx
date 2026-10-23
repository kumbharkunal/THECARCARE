"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, loadMotionPlugins, type MotionPlugins } from "@/lib/gsap";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

type MotionState = {
  /** ScrollTrigger and SplitText once loaded (after first paint); null before that. */
  plugins: MotionPlugins | null;
  /** prefers-reduced-motion: reduce. False until mounted. */
  reduced: boolean;
  mounted: boolean;
  /** Smooth-scrolls to an in-page target (Lenis when running, native otherwise) and moves focus. */
  scrollToHash: (hash: string) => void;
  /** Pause or resume page scrolling (menu sheet). */
  setScrollLocked: (locked: boolean) => void;
};

const MotionContext = createContext<MotionState>({
  plugins: null,
  reduced: false,
  mounted: false,
  scrollToHash: () => {},
  setScrollLocked: () => {},
});

export const useMotion = () => useContext(MotionContext);

function navOffset(): number {
  const value = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(value) ? value : 84;
}

export function Providers({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);
  const [env, setEnv] = useState({ mounted: false, reduced: false });
  const [plugins, setPlugins] = useState<MotionPlugins | null>(null);
  const smooth = env.mounted && !env.reduced;

  // Reduced-motion preference, live.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnv({ mounted: true, reduced: mq.matches });
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // ScrollTrigger, SplitText and DrawSVG load once the page is idle.
  useEffect(() => {
    let cancelled = false;
    const start = () =>
      loadMotionPlugins().then((loaded) => {
        if (cancelled) return;
        setPlugins(loaded);
        document.fonts?.ready.then(() => loaded.ScrollTrigger.refresh());
      });
    const idle = "requestIdleCallback" in window;
    const handle = idle ? window.requestIdleCallback(start, { timeout: 700 }) : window.setTimeout(start, 150);
    return () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  // One clock: the GSAP ticker drives Lenis.
  useEffect(() => {
    if (!smooth) return;
    const update = (time: number) => lenisRef.current?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [smooth]);

  // Keep ScrollTrigger in step with Lenis.
  useEffect(() => {
    if (!smooth || !lenis || !plugins) return;
    const off = lenis.on("scroll", plugins.ScrollTrigger.update);
    plugins.ScrollTrigger.refresh();
    return off;
  }, [smooth, lenis, plugins]);

  const scrollToHash = useCallback(
    (hash: string) => {
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      const target = id === "top" ? document.body : document.getElementById(id);
      if (!target) return;
      const lenis = lenisRef.current;
      const top = id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY - navOffset();
      if (lenis && smooth) lenis.scrollTo(top, { duration: 1.2 });
      else window.scrollTo({ top, behavior: env.reduced ? "auto" : "smooth" });
      history.replaceState(null, "", id === "top" ? window.location.pathname : `#${id}`);
      // Move focus for keyboard and screen-reader users without a second jump.
      const focusTarget = (id === "top" ? document.getElementById("main") : target) as HTMLElement | null;
      if (focusTarget) {
        if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    },
    [smooth, env.reduced],
  );

  // Delegated in-page anchor links: "#section", and "/#section" while on the homepage.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href^='#'], a[href^='/#']");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href.startsWith("/") && window.location.pathname !== "/") return;
      const hash = href.slice(href.indexOf("#"));
      if (hash.length < 2) return;
      const id = decodeURIComponent(hash.slice(1));
      if (id !== "top" && !document.getElementById(id)) return;
      event.preventDefault();
      scrollToHash(hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollToHash]);

  const setScrollLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (locked) lenis?.stop();
    else lenis?.start();
    document.documentElement.classList.toggle("scroll-locked", locked);
  }, []);

  const value = useMemo<MotionState>(
    () => ({ plugins, reduced: env.reduced, mounted: env.mounted, scrollToHash, setScrollLocked }),
    [plugins, env.reduced, env.mounted, scrollToHash, setScrollLocked],
  );

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadFeatures} strict>
          {smooth ? (
            <ReactLenis
              root
              options={{ autoRaf: false, lerp: 0.11, syncTouch: false, smoothWheel: true, stopInertiaOnNavigate: true }}
            />
          ) : null}
          {children}
        </LazyMotion>
      </MotionConfig>
    </MotionContext.Provider>
  );
}
