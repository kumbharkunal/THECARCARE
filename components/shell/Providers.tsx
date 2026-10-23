"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import dynamic from "next/dynamic";
import { LazyMotion, MotionConfig } from "framer-motion";
import type Lenis from "lenis";
import type { MotionPlugins } from "@/lib/gsap";
import { loadAnimate } from "@/lib/animate";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);
const MotionRuntime = dynamic(() => import("@/components/shell/MotionRuntime"), { ssr: false });

type MotionState = {
  /** GSAP, ScrollTrigger and SplitText once loaded (after the page is idle); null before that. */
  plugins: MotionPlugins | null;
  /** prefers-reduced-motion: reduce. False until mounted. */
  reduced: boolean;
  mounted: boolean;
  /** True once the page has loaded and gone idle: the cue for motion islands to load. */
  idle: boolean;
  /** Smooth-scrolls to an in-page target (Lenis when running, native otherwise) and moves focus. */
  scrollToHash: (hash: string) => void;
  /** Pause or resume page scrolling (menu sheet). */
  setScrollLocked: (locked: boolean) => void;
};

const MotionContext = createContext<MotionState>({
  plugins: null,
  reduced: false,
  mounted: false,
  idle: false,
  scrollToHash: () => {},
  setScrollLocked: () => {},
});

export const useMotion = () => useContext(MotionContext);

// Wiring for MotionRuntime only: it reports the loaded plugins and owns the Lenis instance.
type RuntimeState = {
  smooth: boolean;
  setPlugins: (plugins: MotionPlugins) => void;
  lenisRef: RefObject<Lenis | null>;
};
const RuntimeContext = createContext<RuntimeState | null>(null);
export function useMotionRuntime() {
  const runtime = useContext(RuntimeContext);
  if (!runtime) throw new Error("useMotionRuntime outside Providers");
  return runtime;
}

function navOffset(): number {
  const value = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(value) ? value : 84;
}

export function Providers({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [env, setEnv] = useState({ mounted: false, reduced: false });
  const [idle, setIdle] = useState(false);
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

  // Motion loads after the load event, once the main thread is idle.
  useEffect(() => {
    let handle = 0;
    const hasIdle = "requestIdleCallback" in window;
    const ready = () => {
      const go = () => setIdle(true);
      handle = hasIdle ? window.requestIdleCallback(go, { timeout: 1200 }) : window.setTimeout(go, 200);
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });
    return () => {
      window.removeEventListener("load", ready);
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  const scrollToHash = useCallback(
    (hash: string) => {
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      const target = id === "top" ? document.body : document.getElementById(id);
      if (!target) return;
      // Draw every section at its real height before measuring where the target sits.
      document.documentElement.classList.add("cv-off");
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

  // Keyboard users get every section drawn at its real height from their first Tab, so focus never
  // lands on a section whose size is still a placeholder (content-visibility).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      document.documentElement.classList.add("cv-off");
      window.removeEventListener("keydown", onKey);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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

  // Motion's spring engine for the menu and sliders arrives with the islands.
  useEffect(() => {
    if (idle) void loadAnimate();
  }, [idle]);

  const value = useMemo<MotionState>(
    () => ({ plugins, reduced: env.reduced, mounted: env.mounted, idle, scrollToHash, setScrollLocked }),
    [plugins, env.reduced, env.mounted, idle, scrollToHash, setScrollLocked],
  );
  const runtime = useMemo<RuntimeState>(() => ({ smooth, setPlugins, lenisRef }), [smooth]);

  return (
    <MotionContext.Provider value={value}>
      <RuntimeContext.Provider value={runtime}>
        <MotionConfig reducedMotion="user">
          <LazyMotion features={loadFeatures} strict>
            {idle ? <MotionRuntime /> : null}
            {children}
          </LazyMotion>
        </MotionConfig>
      </RuntimeContext.Provider>
    </MotionContext.Provider>
  );
}
