"use client";

// Motion's imperative animate() brings its whole animation engine, which nothing needs before
// someone opens the menu or drags a slider. It loads once the page is idle (Providers) or on
// the first press of the menu button, whichever comes first.
type Animate = typeof import("framer-motion").animate;

let animateFn: Animate | null = null;
let pending: Promise<Animate> | null = null;

export function loadAnimate(): Promise<Animate> {
  pending ??= import("@/lib/motion-animate").then((mod) => (animateFn = mod.animate));
  return pending;
}

/** Motion's animate() once loaded; null before that, when callers jump to the end value. */
export function readyAnimate(): Animate | null {
  return animateFn;
}
