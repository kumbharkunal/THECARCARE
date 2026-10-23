"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { TickerIsland } from "@/components/shell/islands";
import { ChevronMark } from "@/components/art/Chevrons";

/** Brand and product names drifting by (TickerMotion); a pause button stops it on request. */
export function Ticker() {
  const { ticker } = site;
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

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
      <TickerIsland root={root} paused={paused} />
    </section>
  );
}
