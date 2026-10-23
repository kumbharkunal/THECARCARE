"use client";

import dynamic from "next/dynamic";
import { useMotion } from "@/components/shell/Providers";

// Vercel Analytics and Speed Insights load with the motion islands, once the page is idle, so
// they stay out of first-load JS. Both read buffered performance entries: nothing measured
// before they arrive is lost.
const Analytics = dynamic(() => import("@vercel/analytics/next").then((m) => m.Analytics), { ssr: false });
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights), { ssr: false });

export function InsightsIsland() {
  return useMotion().idle ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null;
}
