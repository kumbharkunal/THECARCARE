"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { waLink } from "@/lib/wa";
import { useMenuOpen } from "@/lib/ui-store";
import { SocialMark } from "@/components/ui/Social";

/**
 * Floating WhatsApp button: appears after the hero, steps aside for the menu, #visit and the
 * footer, and while a WhatsApp button in the page is on screen, so only one shows at a time.
 */
export function WhatsAppFab() {
  const menuOpen = useMenuOpen();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const ends = ["visit", "site-footer"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const ctas = document.querySelectorAll<HTMLElement>("#main a[href^='https://wa.me/']");
    let pastHero = false;
    const endsInView = new Set<Element>();
    const ctasInView = new Set<Element>();
    const update = () => setShow(pastHero && endsInView.size === 0 && ctasInView.size === 0);
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        else if (entry.isIntersecting) endsInView.add(entry.target);
        else endsInView.delete(entry.target);
      }
      update();
    });
    const ctaIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) ctasInView.add(entry.target);
          else ctasInView.delete(entry.target);
        }
        update();
      },
      { threshold: 0.5 },
    );
    if (hero) io.observe(hero);
    ends.forEach((el) => io.observe(el));
    ctas.forEach((el) => ctaIo.observe(el));
    return () => {
      io.disconnect();
      ctaIo.disconnect();
    };
  }, []);

  const visible = show && !menuOpen;
  return (
    <div className="fab" data-visible={visible} inert={!visible}>
      <a
        href={waLink(site.messages.fab)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={site.a11y.fab}
        className="fab-link"
      >
        <span className="fab-ring">
          <SocialMark network="whatsapp" size={44} />
        </span>
      </a>
    </div>
  );
}
