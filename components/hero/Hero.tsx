import { getImageProps } from "next/image";
import { FilmStrip, HouseLine, ShieldCheck, Sun } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { getImage } from "@/lib/images";
import { ChevronRoof } from "@/components/art/Chevrons";
import { WhatsAppButton } from "@/components/ui/Social";
import { HeroEnhancer } from "@/components/hero/HeroEnhancer";

const FACT_ICONS = { film: FilmStrip, shield: ShieldCheck, house: HouseLine, sun: Sun } as const;

// Roof geometry in each image's own coordinates. The wide image is a 1600x900 viewBox
// (car spans 29 to 96% across, 24 to 86% down); the tall one 900x1200 (3 to 96%, 37 to 75%).
const WIDE_ROOF = { cx: 1000, apexY: 72, halfWidth: 581, legEnd: 500, stroke: 11 };
const TALL_ROOF = { cx: 452, apexY: 214, halfWidth: 408, legEnd: 548, stroke: 10 };

function HeroPicture() {
  const wide = getImage("hero-car-wide");
  const tall = getImage("hero-car-tall");
  if (!wide && !tall) return null;
  const common = { alt: site.hero.imageAlt, quality: 75, loading: "eager" as const, fetchPriority: "high" as const };
  const desktop = wide
    ? getImageProps({ ...common, src: wide.src, width: wide.width, height: wide.height, sizes: "(min-width: 1024px) 116vw, 100vw" }).props
    : null;
  const mobile = tall
    ? getImageProps({ ...common, src: tall.src, width: tall.width, height: tall.height, sizes: "(min-width: 1024px) 116vw, calc(100vw - 32px)" }).props
    : null;
  const fallback = mobile ?? desktop!;
  return (
    <picture>
      {desktop ? <source media="(min-width: 1024px)" srcSet={desktop.srcSet} sizes={desktop.sizes} /> : null}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from the art-directed next/image props */}
      <img {...fallback} className="hero-img" />
    </picture>
  );
}

export function Hero() {
  const { hero } = site;
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-copy container-x">
        <div className="hero-text">
          <h1 id="hero-title" className="hero-title">
            <span className="h1-lead">
              <span className="mask">
                <span className="rise" style={{ "--i": 0 } as React.CSSProperties}>
                  {hero.lead}
                </span>
              </span>
            </span>
            <span className="h1-main display">
              {hero.title.map((line, index) => (
                <span className="mask" key={line}>
                  <span className="rise" style={{ "--i": index + 1 } as React.CSSProperties}>
                    {line}
                  </span>
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-sub fade-up" style={{ "--d": "0.42s" } as React.CSSProperties}>
            {hero.sub}
          </p>
          <div className="hero-ctas fade-up" style={{ "--d": "0.52s" } as React.CSSProperties}>
            <WhatsAppButton message={site.messages.general}>{hero.primary}</WhatsAppButton>
            <a href="#services" className="btn btn-lg btn-secondary">
              {hero.secondary}
            </a>
          </div>
        </div>
        <ul className="hero-facts fade-up" style={{ "--d": "0.64s" } as React.CSSProperties}>
          {hero.facts.map((fact) => {
            const Icon = FACT_ICONS[fact.icon];
            return (
              <li key={fact.text}>
                <Icon size={22} weight="light" aria-hidden className="shrink-0 text-care-blue" />
                <span>{fact.text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hero-media" data-hero-media>
        <div className="hero-frame">
          <div className="hero-scale">
            <HeroPicture />
            <svg className="hero-roof hero-roof-wide" viewBox="0 0 1600 900" aria-hidden>
              <ChevronRoof id="roof-wide" {...WIDE_ROOF} />
            </svg>
            <svg className="hero-roof hero-roof-tall" viewBox="0 0 900 1200" aria-hidden>
              <ChevronRoof id="roof-tall" {...TALL_ROOF} />
            </svg>
            <div className="hero-sweep" aria-hidden />
            <div className="hero-lamp" aria-hidden />
          </div>
        </div>
      </div>
      <HeroEnhancer />
    </section>
  );
}
