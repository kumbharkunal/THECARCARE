"use client";

// GSAP core and useGSAP load with the page; ScrollTrigger, SplitText and DrawSVG load after
// first paint (they are only needed below the fold), keeping them out of the first-load JS.
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
// The brand easing (--ease-squeegee) as a named GSAP ease: cubic-bezier(0.22, 1, 0.36, 1).
gsap.registerEase("squeegee", (p: number) => cubicBezier(0.22, 1, 0.36, 1, p));
gsap.defaults({ ease: "squeegee", duration: 1 });

export type MotionPlugins = {
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  SplitText: typeof import("gsap/SplitText").SplitText;
};

let pluginsPromise: Promise<MotionPlugins> | null = null;

export function loadMotionPlugins(): Promise<MotionPlugins> {
  pluginsPromise ??= Promise.all([
    import("gsap/ScrollTrigger"),
    import("gsap/SplitText"),
    import("gsap/DrawSVGPlugin"),
  ]).then(([st, split, draw]) => {
    gsap.registerPlugin(st.ScrollTrigger, split.SplitText, draw.DrawSVGPlugin);
    st.ScrollTrigger.config({ ignoreMobileResize: true });
    return { ScrollTrigger: st.ScrollTrigger, SplitText: split.SplitText };
  });
  return pluginsPromise;
}

// Solves a CSS cubic-bezier for y at progress x (Newton steps, then bisection).
function cubicBezier(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  let t = x;
  for (let i = 0; i < 6; i++) {
    const err = sx(t) - x;
    const d = dx(t);
    if (Math.abs(err) < 1e-6) return sy(t);
    if (Math.abs(d) < 1e-6) break;
    t -= err / d;
  }
  let lo = 0, hi = 1;
  t = x;
  while (hi - lo > 1e-6) {
    if (sx(t) < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return sy(t);
}

export { gsap, useGSAP };
