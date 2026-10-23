"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { getImage } from "@/lib/images";
import { gsap } from "@/lib/gsap";
import { Placeholder } from "@/components/ui/Img";

const { ppf } = site;
type Point = [number, number];
type Stroke = { points: Point[]; seed: number };

const IDLE_HEAL_MS = 1200;
const RELEASE_HEAL_MS = 450;
const MAX_DPR = 2;

// Small seeded noise so a stroke keeps the same irregular edge every redraw.
function noise(seed: number, i: number) {
  const x = Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453;
  return x - Math.floor(x) - 0.5;
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, w: number, h: number, dpr: number) {
  const pts = stroke.points;
  if (pts.length < 2) return;
  // A fine swirl scratch: a dark edge, a bright core that catches the light, and a faint twin.
  const passes = [
    { dx: 0, dy: 0, width: 2.2, color: "rgba(4, 10, 32, 0.34)" },
    { dx: 0.7, dy: -0.7, width: 1.2, color: "rgba(230, 236, 255, 0.86)" },
    { dx: -2.2, dy: 1.6, width: 0.8, color: "rgba(210, 220, 252, 0.46)" },
    { dx: 2.6, dy: 2.0, width: 0.6, color: "rgba(210, 220, 252, 0.3)" },
  ];
  for (const pass of passes) {
    ctx.beginPath();
    ctx.lineWidth = pass.width * dpr;
    ctx.strokeStyle = pass.color;
    for (let i = 0; i < pts.length; i++) {
      const jx = noise(stroke.seed, i) * 0.9 * dpr;
      const jy = noise(stroke.seed + 1, i) * 0.9 * dpr;
      const x = pts[i][0] * w + (pass.dx * dpr + jx);
      const y = pts[i][1] * h + (pass.dy * dpr + jy);
      if (i === 0) ctx.moveTo(x, y);
      else {
        const px = pts[i - 1][0] * w + pass.dx * dpr;
        const py = pts[i - 1][1] * h + pass.dy * dpr;
        ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2);
      }
    }
    ctx.stroke();
  }
}

/** Procedural swirls for keyboard users: fine arcs around one point, like wash marks. */
function swirls(): Stroke[] {
  const cx = 0.3 + Math.random() * 0.4;
  const cy = 0.3 + Math.random() * 0.4;
  return Array.from({ length: 8 }, (_, k) => {
    const r = 0.06 + Math.random() * 0.24;
    const start = Math.random() * Math.PI * 2;
    const sweep = 0.7 + Math.random() * 1.1;
    const points: Point[] = Array.from({ length: 28 }, (_, i) => {
      const a = start + (sweep * i) / 27;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.86];
    });
    return { points, seed: Math.random() * 1000 + k };
  });
}

export function ScratchHeal() {
  const img = getImage("paint-surface");
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const strokes = useRef<Stroke[]>([]);
  const drawing = useRef<Stroke | null>(null);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const heal = useRef({ active: false, x: -1, tween: null as gsap.core.Tween | null });
  const dirty = useRef(true);
  const idleTimer = useRef<number | undefined>(undefined);
  const [status, setStatus] = useState("");
  const [hint, setHint] = useState(true);

  const render = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const { w, h, dpr } = size.current;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const stroke of strokes.current) drawStroke(ctx, stroke, w, h, dpr);
    if (drawing.current) drawStroke(ctx, drawing.current, w, h, dpr);
    // Behind the passing band the top coat has healed: erase with a soft edge.
    if (heal.current.active && heal.current.x > 0) {
      const edge = w * 0.08;
      const grad = ctx.createLinearGradient(heal.current.x - edge, 0, heal.current.x, 0);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, Math.max(0, heal.current.x - edge), h);
      ctx.fillStyle = grad;
      ctx.fillRect(heal.current.x - edge, 0, edge, h);
      ctx.globalCompositeOperation = "source-over";
    }
  }, []);

  // One clock: redraw on the GSAP ticker only when something changed.
  useEffect(() => {
    const tick = () => {
      if (!dirty.current) return;
      dirty.current = false;
      render();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [render]);

  // DPR-aware canvas that follows its box.
  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ro = new ResizeObserver(([entry]) => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const { width, height } = entry.contentRect;
      size.current = { w: Math.round(width * dpr), h: Math.round(height * dpr), dpr };
      cv.width = size.current.w;
      cv.height = size.current.h;
      dirty.current = true;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const runHeal = useCallback(() => {
    window.clearTimeout(idleTimer.current);
    if (heal.current.active || strokes.current.length === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = canvas.current;
    if (!cv) return;
    if (reduced) {
      gsap.to(cv, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => {
          strokes.current = [];
          dirty.current = true;
          gsap.set(cv, { opacity: 1 });
          setStatus(ppf.healed);
        },
      });
      return;
    }
    const w = size.current.w;
    const bandEl = band.current;
    const state = { p: 0 };
    heal.current.active = true;
    heal.current.tween = gsap.to(state, {
      p: 1,
      duration: 1.15,
      ease: "power1.inOut",
      onStart: () => {
        if (bandEl) gsap.set(bandEl, { opacity: 1 });
      },
      onUpdate: () => {
        // The band is 40% wide and travels from -100% to 260% of its width: the erase edge
        // follows its centre, so a scratch disappears as the light passes over it.
        heal.current.x = Math.max(0, (-0.2 + 1.44 * state.p) * w);
        if (bandEl) gsap.set(bandEl, { xPercent: -100 + state.p * 360 });
        dirty.current = true;
      },
      onComplete: () => {
        strokes.current = [];
        heal.current = { active: false, x: -1, tween: null };
        if (bandEl) gsap.to(bandEl, { opacity: 0, duration: 0.3 });
        dirty.current = true;
        setStatus(ppf.healed);
      },
    });
  }, []);

  const scheduleHeal = (ms: number) => {
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(runHeal, ms);
  };

  const toPoint = (event: React.PointerEvent): Point => {
    const rect = canvas.current!.getBoundingClientRect();
    return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (heal.current.active) return;
    canvas.current?.setPointerCapture(event.pointerId);
    drawing.current = { points: [toPoint(event)], seed: Math.random() * 1000 };
    setHint(false);
    setStatus("");
    scheduleHeal(IDLE_HEAL_MS + 400);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const events = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    const rect = canvas.current!.getBoundingClientRect();
    for (const e of events) drawing.current.points.push([(e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height]);
    dirty.current = true;
    scheduleHeal(IDLE_HEAL_MS);
  };
  const endStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    canvas.current?.releasePointerCapture(event.pointerId);
    strokes.current.push(drawing.current);
    drawing.current = null;
    dirty.current = true;
    scheduleHeal(RELEASE_HEAL_MS);
  };

  const scratchIt = () => {
    if (heal.current.active) return;
    strokes.current.push(...swirls());
    setHint(false);
    setStatus("");
    dirty.current = true;
    scheduleHeal(1600);
  };
  const reset = () => {
    window.clearTimeout(idleTimer.current);
    heal.current.tween?.kill();
    heal.current = { active: false, x: -1, tween: null };
    strokes.current = [];
    drawing.current = null;
    if (band.current) gsap.set(band.current, { opacity: 0 });
    dirty.current = true;
    setStatus("");
  };

  useEffect(() => () => window.clearTimeout(idleTimer.current), []);

  return (
    <div className="scratch">
      <div ref={wrap} className="scratch-panel">
        {img ? (
          <Image
            src={img.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 84vw"
            className="scratch-paint"
            placeholder="blur"
            blurDataURL={img.blurDataURL}
          />
        ) : (
          <Placeholder slot="paint-surface" className="absolute inset-0" />
        )}
        <canvas
          ref={canvas}
          className="scratch-canvas"
          role="img"
          aria-label={ppf.canvasAria}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />
        <div ref={band} className="scratch-band" aria-hidden />
        <p className="scratch-label" data-hidden={!hint} aria-hidden>
          {ppf.canvasLabel}
        </p>
      </div>
      <div className="scratch-controls">
        <button type="button" className="btn btn-secondary" onClick={scratchIt}>
          {ppf.scratch}
        </button>
        <button type="button" className="btn btn-primary" onClick={runHeal}>
          {ppf.heal}
        </button>
        <button type="button" className="btn btn-paper" onClick={reset}>
          {ppf.reset}
        </button>
      </div>
      <p className="scratch-hint">
        <span className="pointer-coarse-only">{ppf.canvasHintTouch}</span>
        <span className="pointer-fine-only">{ppf.canvasHintPointer}</span>{" "}
        <span role="status" aria-live="polite" className="font-semibold text-shield-green-ink">
          {status}
        </span>
      </p>
    </div>
  );
}
