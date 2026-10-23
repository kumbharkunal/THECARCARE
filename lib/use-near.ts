"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once the section (or footer) holding `anchor` comes within a screen of the viewport, and
 * from then on. Scroll-driven motion arms here rather than at load: until a visitor heads that
 * way, nothing measures a section the browser has skipped (content-visibility: auto).
 */
export function useNear(anchor: RefObject<Element | null>, margin = "100%") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const section = anchor.current?.closest("section, footer");
    if (!section || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: `${margin} 0px ${margin} 0px` },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [anchor, margin, near]);
  return near;
}
