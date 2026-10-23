"use client";

import { useRef, useState } from "react";
import { m } from "framer-motion";
import { site, type GlassZone } from "@/content/site";
import { CarElevation } from "@/components/art/CarElevation";
import { WhatsAppButton } from "@/components/ui/Social";

const { shade } = site.sunFilm;
const SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 } as const;

// Where light meets each pane, in the car's 1200 x 460 coordinates.
const TARGET: Record<GlassZone, [number, number]> = {
  windscreen: [530, 190],
  front: [626, 184],
  rear: [846, 176],
  back: [996, 182],
};
const SUN: [number, number] = [118, 58];

const tintFor = (vlt: number) => ((100 - vlt) / 100) * 0.85;

function Rays({ zone, vlt }: { zone: GlassZone; vlt: number }) {
  const [tx, ty] = TARGET[zone];
  const dx = tx - SUN[0];
  const dy = ty - SUN[1];
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // perpendicular offsets fan the rays out a little
  const px = -uy;
  const py = ux;
  const visible = [-22, 0, 22].map((o) => {
    const ex = tx + px * o;
    const ey = ty + py * o;
    return {
      out: { x1: SUN[0] + ux * 34 + px * o * 0.3, y1: SUN[1] + uy * 34 + py * o * 0.3, x2: ex, y2: ey },
      inside: { x1: ex, y1: ey, x2: ex + ux * 86, y2: ey + uy * 86 },
    };
  });
  const uv = [-40, 40].map((o) => ({
    x1: SUN[0] + ux * 34 + px * o * 0.25,
    y1: SUN[1] + uy * 34 + py * o * 0.25,
    x2: tx + px * o,
    y2: ty + py * o,
  }));
  return (
    <g className="shade-rays">
      <g className="shade-sun">
        <circle cx={SUN[0]} cy={SUN[1]} r="17" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return (
            <line
              key={i}
              x1={SUN[0] + Math.cos(a) * 25}
              y1={SUN[1] + Math.sin(a) * 25}
              x2={SUN[0] + Math.cos(a) * 33}
              y2={SUN[1] + Math.sin(a) * 33}
            />
          );
        })}
      </g>
      {visible.map((ray, i) => (
        <g key={i} className="shade-visible">
          <line {...ray.out} />
          <line {...ray.inside} style={{ opacity: vlt / 100 }} />
        </g>
      ))}
      {uv.map((ray, i) => (
        <g key={i} className="shade-uv">
          <line {...ray} />
          <circle cx={ray.x2} cy={ray.y2} r="4" />
        </g>
      ))}
    </g>
  );
}

export function ShadeGuide() {
  const [zone, setZone] = useState<GlassZone>("windscreen");
  const [vlt, setVlt] = useState<Record<GlassZone, number>>({ windscreen: 90, front: 90, rear: 90, back: 90 });
  const [dragging, setDragging] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);

  const info = shade.zones.find((z) => z.id === zone)!;
  const min = info.min;
  const value = vlt[zone];
  const atLimit = value <= min;
  const pct = ((value - min) / (shade.max - min)) * 100;

  const setValue = (next: number) =>
    setVlt((prev) => ({ ...prev, [zone]: Math.round(Math.min(shade.max, Math.max(min, next))) }));

  const fromPointer = (clientX: number) => {
    const rect = track.current!.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setValue(min + ratio * (shade.max - min));
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowLeft: value - 1,
      ArrowDown: value - 1,
      ArrowRight: value + 1,
      ArrowUp: value + 1,
      PageDown: value - 5,
      PageUp: value + 5,
      Home: min,
      End: shade.max,
    };
    if (!(event.key in map)) return;
    event.preventDefault();
    setValue(map[event.key]);
  };

  const onChipKey = (event: React.KeyboardEvent, index: number) => {
    const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + shade.zones.length) % shade.zones.length;
    setZone(shade.zones[next].id);
    chips.current[next]?.focus();
  };

  const tint = Object.fromEntries((Object.keys(vlt) as GlassZone[]).map((k) => [k, tintFor(vlt[k])])) as Record<GlassZone, number>;
  const message = `Hi The Car Care, I'd like to know which sun control film suits my car. I'm looking at the ${info.label.toLowerCase()} at about ${value}% VLT.`;

  return (
    <div className="shade" id="shade-guide">
      <div className="shade-diagram">
        <CarElevation
          id="shade-car"
          label={`${shade.diagramLabel}: ${info.label} at ${value}% visible light`}
          glassTint={tint}
          activeGlass={zone}
          showRays={false}
          className="shade-car"
        >
          <Rays zone={zone} vlt={value} />
        </CarElevation>
      </div>

      <div className="shade-controls">
        <h3 className="heading shade-title">{shade.title}</h3>
        <p className="mt-4 max-w-[46ch]">{shade.intro}</p>

        <div role="radiogroup" aria-label={shade.zonesLabel} className="chips mt-7">
          {shade.zones.map((z, index) => (
            <button
              key={z.id}
              ref={(el) => {
                chips.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={zone === z.id}
              tabIndex={zone === z.id ? 0 : -1}
              className="chip"
              onClick={() => setZone(z.id)}
              onKeyDown={(event) => onChipKey(event, index)}
            >
              {z.label}
              <span className="chip-min tabular">{z.min}%</span>
            </button>
          ))}
        </div>

        <div className="shade-readout" aria-hidden>
          <span className="shade-vlt font-mono tabular">
            <span className="shade-vlt-label">VLT</span>
            {value}%
          </span>
          <span className="shade-legal-min">Legal minimum {min}%</span>
        </div>

        <div
          ref={track}
          className="shade-track"
          data-dragging={dragging}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            track.current?.setPointerCapture(event.pointerId);
            setDragging(true);
            fromPointer(event.clientX);
          }}
          onPointerMove={(event) => dragging && fromPointer(event.clientX)}
          onPointerUp={(event) => {
            setDragging(false);
            track.current?.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => setDragging(false)}
        >
          <span className="shade-rail" />
          <m.span
            className="shade-fill"
            initial={false}
            animate={{ transform: `scaleX(${pct / 100})` }}
            transition={dragging ? { duration: 0 } : SPRING}
          />
          <span className="shade-thumb-clip">
          <m.span
            className="shade-thumb-layer"
            initial={false}
            animate={{ transform: `translateX(${pct}%)` }}
            transition={dragging ? { duration: 0 } : SPRING}
          >
            <span
              role="slider"
              tabIndex={0}
              aria-label={shade.sliderLabel}
              aria-valuemin={min}
              aria-valuemax={shade.max}
              aria-valuenow={value}
              aria-valuetext={`VLT ${value} percent`}
              className="shade-thumb"
              onKeyDown={onKeyDown}
            />
          </m.span>
          </span>
        </div>
        <div className="shade-ends" aria-hidden>
          <span>{shade.darker}</span>
          <span>{shade.lighter}</span>
        </div>

        <p role="status" aria-live="polite" className="shade-limit" data-show={atLimit}>
          {atLimit ? shade.limit : ""}
        </p>

        <p className="shade-fine">{shade.vltExplainer}</p>
        <p className="shade-fine">
          {shade.legal} <span className="text-ink">{shade.disclaimer}</span>
        </p>
        <WhatsAppButton message={message} className="mt-7">
          {shade.cta}
        </WhatsAppButton>
      </div>
    </div>
  );
}
