"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type PanInfo,
} from "framer-motion";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { SocialLinks, WhatsAppButton } from "@/components/ui/Social";
import { useMotion } from "@/components/shell/Providers";
import { uiStore } from "@/lib/ui-store";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { loadAnimate, readyAnimate } from "@/lib/animate";

const SPRING = { type: "spring", stiffness: 420, damping: 38, mass: 0.9 } as const;
const BAR = 56;
const SECTIONS = ["top", "services", "sun-film", "ppf", "ceramic", "why", "process", "faq", "visit"];

function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

/** Hides on scroll down after 120px, returns on scroll up; solid once past the hero. */
function useScrollChrome() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0);
    if (y < 120) setHidden(false);
    else if (delta > 6) setHidden(true);
    else if (delta < -6) setHidden(false);
    setSolid(y > window.innerHeight * 0.8);
  });
  return { hidden, setHidden, solid };
}

function Brand({ href, onClick }: { href: string; onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a href={href} onClick={onClick} aria-label={site.a11y.home} className="brand flex min-h-11 items-center gap-2 rounded-full pr-1">
      <Image src="/brand/logo-mark.png" alt="" width={30} height={30} className="h-[30px] w-[30px]" />
      <span className="display text-[19px] leading-none tracking-[0.01em] text-care-blue" aria-hidden>
        {site.wordmark}
      </span>
    </a>
  );
}

export function Nav() {
  // "/#section" works from any page; on the homepage the click is caught and scrolled smoothly.
  const to = (hash: string) => `/${hash}`;
  const onHome = () => window.location.pathname === "/";
  const active = useActiveSection();
  const { hidden, setHidden, solid } = useScrollChrome();
  const { reduced, scrollToHash, setScrollLocked } = useMotion();

  // ---------------------------------------------------------------- mobile sheet
  const [open, setOpen] = useState(false);
  const [sheetShown, setSheetShown] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(true);
  const inset = useMotionValue(0);
  const clipPath = useMotionTemplate`inset(0px 0px ${inset}px 0px round 28px)`;

  const openMenu = useCallback(() => {
    setSheetShown(true);
    setOpen(true);
  }, []);
  const close = useCallback(
    (restore = true) => {
      restoreFocus.current = restore;
      setOpen(false);
      if (reduced) setSheetShown(false);
    },
    [reduced],
  );
  const closeAndRestore = useCallback(() => close(true), [close]);

  useFocusTrap(dialogRef, open, closeAndRestore);

  // The sheet starts clipped to the bar's shape and grows with a spring; closing reverses it.
  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!sheetShown || !sheet) return;
    const collapsed = Math.max(0, sheet.offsetHeight - BAR);
    if (reduced) {
      inset.set(0);
      return;
    }
    const animate = readyAnimate();
    if (!animate) {
      // Tapped before the spring has loaded: show or hide the sheet at once.
      inset.set(open ? 0 : collapsed);
      if (!open) Promise.resolve().then(() => setSheetShown(false));
      return;
    }
    if (open) {
      inset.set(collapsed);
      const controls = animate(inset, 0, SPRING);
      return () => controls.stop();
    }
    const controls = animate(inset, collapsed, { ...SPRING, stiffness: 520 });
    controls.then(() => setSheetShown(false));
    return () => controls.stop();
  }, [open, sheetShown, reduced, inset]);

  // Side effects of the open state: scroll lock, inert page, shared store, focus.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    uiStore.setMenuOpen(open);
    setScrollLocked(open);
    for (const id of ["main", "site-footer"]) document.getElementById(id)?.toggleAttribute("inert", open);
    if (open) {
      const first = dialogRef.current?.querySelector<HTMLElement>(".mnav-links a");
      requestAnimationFrame(() => first?.focus({ preventScroll: true }));
    } else if (restoreFocus.current) {
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [open, setScrollLocked]);

  // Close the sheet if the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && close(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [close]);

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    close(false);
    window.setTimeout(() => scrollToHash(href), reduced ? 0 : 280);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -70 || info.velocity.y < -450) close(true);
  };

  return (
    <>
      {/* Desktop: floating glass pill */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden lg:block">
        <nav
          aria-label="Primary"
          data-hidden={hidden}
          data-solid={solid}
          onFocusCapture={() => setHidden(false)}
          className="nav-desktop glass pointer-events-auto mx-auto mt-4 flex h-[60px] w-[min(820px,calc(100%-48px))] items-center gap-2 rounded-full pl-3.5 pr-1.5"
        >
          <Brand href={to("#top")} />
          <ul className="mx-auto flex items-center">
            {site.nav.links.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={to(link.href)}
                    className="nav-link relative flex h-10 items-center rounded-full px-3.5 text-small font-medium"
                    aria-current={isActive ? "true" : undefined}
                  >
                    {isActive ? (
                      <m.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-mist" transition={SPRING} />
                    ) : null}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <WhatsAppButton message={site.messages.general} size="md" className="nav-cta">
            {site.nav.cta}
          </WhatsAppButton>
        </nav>
      </header>

      {/* Mobile: pill bar that opens into a sheet */}
      <div className="lg:hidden">
        <AnimatePresence>
          {open ? (
            <m.div
              key="scrim"
              className="mnav-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              onClick={() => close(true)}
              aria-hidden
            />
          ) : null}
        </AnimatePresence>

        <div
          ref={dialogRef}
          className="mnav"
          data-open={open}
          role={open ? "dialog" : undefined}
          aria-modal={open ? true : undefined}
          aria-label={open ? site.a11y.menu : undefined}
        >
          <m.div
            ref={sheetRef}
            id="site-menu"
            className="mnav-sheet"
            style={{ clipPath }}
            hidden={!sheetShown}
            drag={open ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.55, bottom: 0.04 }}
            dragMomentum={false}
            onDragEnd={onDragEnd}
          >
            <nav aria-label="Mobile">
              <ul className="mnav-links">
                {site.nav.links.map((link, index) => {
                  const isActive = active === link.href.slice(1);
                  return (
                    <m.li
                      key={link.href}
                      initial={reduced ? false : { opacity: 0, transform: "translateY(16px)" }}
                      animate={open ? { opacity: 1, transform: "translateY(0px)" } : { opacity: 0, transform: "translateY(8px)" }}
                      transition={open ? { duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: 0.08 + index * 0.05 } : { duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <a
                        href={to(link.href)}
                        onClick={(event) => (onHome() ? goTo(event, link.href) : close(false))}
                        aria-current={isActive ? "true" : undefined}
                        className="mnav-link heading"
                      >
                        {link.label}
                      </a>
                    </m.li>
                  );
                })}
              </ul>
            </nav>
            <div className="mnav-actions">
              <div className="grid grid-cols-2 gap-2.5">
                <WhatsAppButton message={site.messages.general} className="w-full">
                  {site.nav.whatsapp}
                </WhatsAppButton>
                <a href={site.contact.phones[0].href} className="btn btn-lg btn-secondary w-full">
                  <Phone size={20} weight="regular" aria-hidden />
                  {site.nav.call}
                </a>
              </div>
              <div className="mt-4 flex items-center">
                <SocialLinks size={26} />
              </div>
            </div>
            <span className="mnav-grabber" aria-hidden />
          </m.div>

          <div className="mnav-bar glass" data-hidden={hidden && !open}>
            <Brand
              href={to("#top")}
              onClick={(event) => {
                if (open && onHome()) goTo(event, "#top");
              }}
            />
            <button
              ref={buttonRef}
              type="button"
              className="mnav-button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? site.a11y.closeMenu : site.a11y.openMenu}
              onPointerDown={() => void loadAnimate()}
              onClick={() => (open ? close(true) : openMenu())}
            >
              <span className="mnav-icon" aria-hidden>
                <m.span
                  initial={false}
                  animate={{ transform: open ? "translateY(0px) rotate(45deg)" : "translateY(-4px) rotate(0deg)" }}
                  transition={SPRING}
                />
                <m.span
                  initial={false}
                  animate={{ transform: open ? "translateY(0px) rotate(-45deg)" : "translateY(4px) rotate(0deg)" }}
                  transition={SPRING}
                />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
