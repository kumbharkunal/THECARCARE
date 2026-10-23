"use client";

import { useState } from "react";
import { ArrowUpRight, MapPin } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";

const query = encodeURIComponent(`The Car Care, ${site.contact.address.street}, ${site.contact.address.locality} ${site.contact.address.postalCode}`);
export const MAPS_OPEN = `https://www.google.com/maps/search/?api=1&query=${query}`;
const MAPS_EMBED = `https://www.google.com/maps?q=${query}&output=embed`;

/** A drawn map card; the Google Maps embed loads only when asked for. */
export function MapFacade() {
  const [loaded, setLoaded] = useState(false);
  const { map } = site.visit;
  return (
    <div className="map">
      <div className="map-frame">
        {loaded ? (
          <iframe
            src={MAPS_EMBED}
            title={map.iframeTitle}
            className="map-iframe"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button type="button" className="map-facade" onClick={() => setLoaded(true)}>
            <svg viewBox="0 0 600 400" className="map-art" aria-hidden preserveAspectRatio="xMidYMid slice">
              <path d="M-20 300 C120 280 210 220 330 230 C430 238 520 200 620 150" className="map-road map-road-main" />
              <path d="M90 -20 C110 90 150 170 140 260 C132 330 150 380 170 420" className="map-road" />
              <path d="M300 -20 C290 70 320 150 330 230 C338 300 330 360 350 420" className="map-road" />
              <path d="M-20 120 C100 140 200 120 300 110 C400 100 500 70 620 60" className="map-road" />
              <path d="M450 -20 C440 80 470 160 500 240 C520 300 520 360 540 420" className="map-road map-road-thin" />
              <path d="M-20 360 C160 350 260 330 420 350 C500 360 560 350 620 340" className="map-road map-road-thin" />
              <circle cx="330" cy="230" r="38" className="map-ring" />
            </svg>
            <span className="map-pin" aria-hidden>
              <MapPin size={34} weight="fill" />
            </span>
            <span className="map-card">
              <span className="heading map-title">{map.title}</span>
              <span className="map-address">{map.area}</span>
              <span className="map-load">{map.load}</span>
            </span>
          </button>
        )}
      </div>
      <a href={MAPS_OPEN} target="_blank" rel="noopener noreferrer" className="link mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold">
        {map.open}
        <ArrowUpRight size={16} weight="bold" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
