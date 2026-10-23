"use client";

import dynamic from "next/dynamic";
import type { RefObject } from "react";
import { useMotion } from "@/components/shell/Providers";

// Motion islands. Everything that animates with GSAP lives in these modules and loads only
// once the page is idle, so GSAP, its plugins and Lenis stay out of first-load JS. Until then
// the page is complete and readable: the hero runs on CSS, everything else is already in place.
const HeroEnhancer = dynamic(() => import("@/components/hero/HeroEnhancer").then((m) => m.HeroEnhancer), { ssr: false });
const TickerMotion = dynamic(() => import("@/components/sections/TickerMotion").then((m) => m.TickerMotion), { ssr: false });
const ServicesMotion = dynamic(() => import("@/components/sections/ServicesMotion").then((m) => m.ServicesMotion), { ssr: false });
const StackMotion = dynamic(() => import("@/components/sections/StackMotion").then((m) => m.StackMotion), { ssr: false });
const ProcessMotion = dynamic(() => import("@/components/sections/ProcessMotion").then((m) => m.ProcessMotion), { ssr: false });
const FooterMotion = dynamic(() => import("@/components/sections/FooterMotion").then((m) => m.FooterMotion), { ssr: false });
const RevealRuntime = dynamic(() => import("@/components/shell/RevealRuntime").then((m) => m.RevealRuntime), { ssr: false });

export function HeroIsland() {
  return useMotion().idle ? <HeroEnhancer /> : null;
}
export function TickerIsland(props: { root: RefObject<HTMLElement | null>; paused: boolean }) {
  return useMotion().idle ? <TickerMotion {...props} /> : null;
}
export function ServicesIsland() {
  return useMotion().idle ? <ServicesMotion /> : null;
}
export function StackIsland() {
  return useMotion().idle ? <StackMotion /> : null;
}
export function ProcessIsland() {
  return useMotion().idle ? <ProcessMotion /> : null;
}
export function FooterIsland() {
  return useMotion().idle ? <FooterMotion /> : null;
}
export function RevealIsland() {
  return useMotion().idle ? <RevealRuntime /> : null;
}
