"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { waLink } from "@/lib/wa";
import { useMenuOpen } from "@/lib/ui-store";
import { SocialMark } from "@/components/ui/Social";

/** Floating WhatsApp button: appears after the hero, steps aside for the menu, #visit and the footer. */
export function WhatsAppFab() {
  const menuOpen = useMenuOpen();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const ends = ["visit", "site-footer"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    let pastHero = false;
    const endsInView = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        else if (entry.isIntersecting) endsInView.add(entry.target);
        else endsInView.delete(entry.target);
      }
      setShow(pastHero && endsInView.size === 0);
    });
    if (hero) io.observe(hero);
    ends.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const visible = show && !menuOpen;
  return (
    <a
      href={waLink(site.messages.fab)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={site.a11y.fab}
      className="fab"
      data-visible={visible}
      inert={!visible}
    >
      <span className="fab-ring glass">
        <SocialMark network="whatsapp" size={56} />
      </span>
    </a>
  );
}
