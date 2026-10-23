"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, useMotionValueEvent } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { getImage, type ImageSlot } from "@/lib/images";
import { Placeholder } from "@/components/ui/Img";
import { loadAnimate, readyAnimate } from "@/lib/animate";

type Spring = { type: "spring"; stiffness: number; damping: number; mass: number };
const SPRING: Spring = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 };

// Fine concentric swirl marks around the main reflection (seeded, so server and client agree).
function swirlArcs(cx: number, cy: number, count = 46) {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: count }, () => {
    const r = 40 + rand() * 330;
    const start = rand() * Math.PI * 2;
    const sweep = 0.25 + rand() * 0.9;
    const x1 = cx + Math.cos(start) * r;
    const y1 = cy + Math.sin(start) * r * 0.62;
    const x2 = cx + Math.cos(start + sweep) * r;
    const y2 = cy + Math.sin(start + sweep) * r * 0.62;
    return { d: `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r.toFixed(1)} ${(r * 0.62).toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`, o: 0.25 + rand() * 0.45 };
  });
}

type Props = {
  slot: ImageSlot;
  alt: string;
  sizes: string;
  mode: "ceramic" | "glare";
  label: string;
  beforeLabel: string;
  afterLabel: string;
  caption?: string;
  /** Focus point for the swirl marks or the sun bloom, in % of the frame. */
  focus: { x: number; y: number };
  className?: string;
};

export function CompareSlider({ slot, alt, sizes, mode, label, beforeLabel, afterLabel, caption, focus, className }: Props) {
  const img = getImage(slot);
  const frame = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLButtonElement>(null);
  const pos = useMotionValue(50);
  const dragging = useRef(false);
  const played = useRef(false);

  // The handle is a full-width layer, so translateX(p%) is p% of the frame.
  const apply = useCallback((p: number) => {
    if (before.current) before.current.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
    if (handle.current) handle.current.style.transform = `translateX(${p}%)`;
    if (knob.current) {
      knob.current.setAttribute("aria-valuenow", String(Math.round(p)));
      knob.current.setAttribute("aria-valuetext", `${beforeLabel} ${Math.round(p)} percent, ${afterLabel} ${100 - Math.round(p)} percent`);
    }
  }, [beforeLabel, afterLabel]);

  useMotionValueEvent(pos, "change", apply);

  // On first view, ease from 15% to 50% once.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    pos.set(15);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current) return;
        played.current = true;
        io.disconnect();
        loadAnimate().then((animate) => {
          if (!dragging.current) animate(pos, 50, { duration: 1.4, ease: [0.22, 1, 0.36, 1] });
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pos]);

  // Motion's spring once it has loaded (with the motion islands); a direct jump before that.
  const springTo = (target: number, spring: Spring) => {
    const animate = readyAnimate();
    if (animate) animate(pos, target, spring);
    else pos.set(target);
  };

  const toPercent = (clientX: number) => {
    const rect = frame.current!.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    played.current = true;
    dragging.current = true;
    frame.current?.setPointerCapture(event.pointerId);
    springTo(toPercent(event.clientX), { ...SPRING, stiffness: 600 });
    knob.current?.focus({ preventScroll: true });
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    pos.stop();
    pos.set(toPercent(event.clientX));
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    frame.current?.releasePointerCapture(event.pointerId);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 10 : 5;
    const current = pos.get();
    const targets: Record<string, number> = {
      ArrowLeft: current - step,
      ArrowDown: current - step,
      ArrowRight: current + step,
      ArrowUp: current + step,
      PageDown: current - 10,
      PageUp: current + 10,
      Home: 0,
      End: 100,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    played.current = true;
    springTo(Math.min(100, Math.max(0, targets[event.key])), SPRING);
  };

  if (!img) return <Placeholder slot={slot} className={className} />;
  const arcs = mode === "ceramic" ? swirlArcs((focus.x / 100) * 1000, (focus.y / 100) * 1000 * (img.height / img.width)) : [];

  return (
    <figure className={`compare ${className ?? ""}`}>
      <div
        ref={frame}
        className="compare-frame"
        style={{ aspectRatio: `${img.width} / ${img.height}` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Image src={img.src} alt={alt} fill sizes={sizes} className="compare-img" placeholder="blur" blurDataURL={img.blurDataURL} />
        <div ref={before} className={`compare-before compare-before-${mode}`} style={{ clipPath: "inset(0 50% 0 0)" }} aria-hidden>
          <Image src={img.src} alt="" fill sizes={sizes} className="compare-img" />
          {mode === "ceramic" ? (
            <>
              <div className="compare-haze" />
              {/* 46 fixed arcs: written as markup so hydration skips them */}
              <svg
                className="compare-swirls"
                viewBox={`0 0 1000 ${Math.round(1000 * (img.height / img.width))}`}
                preserveAspectRatio="none"
                dangerouslySetInnerHTML={{ __html: arcs.map((arc) => `<path d="${arc.d}" opacity="${arc.o.toFixed(3)}"/>`).join("") }}
              />
            </>
          ) : (
            <div className="compare-bloom" style={{ "--sx": `${focus.x}%`, "--sy": `${focus.y}%` } as React.CSSProperties} />
          )}
        </div>
        <span className="compare-chip compare-chip-before" aria-hidden>
          {beforeLabel}
        </span>
        <span className="compare-chip compare-chip-after" aria-hidden>
          {afterLabel}
        </span>
        <div ref={handle} className="compare-handle" style={{ transform: "translateX(50%)" }}>
          <span className="compare-line" />
          <button
            ref={knob}
            type="button"
            role="slider"
            className="compare-knob"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={50}
            aria-valuetext={`${beforeLabel} 50 percent, ${afterLabel} 50 percent`}
            onKeyDown={onKeyDown}
          >
            <CaretLeft size={16} weight="bold" aria-hidden />
            <CaretRight size={16} weight="bold" aria-hidden />
          </button>
        </div>
      </div>
      {caption ? <figcaption className="compare-caption">{caption}</figcaption> : null}
    </figure>
  );
}
