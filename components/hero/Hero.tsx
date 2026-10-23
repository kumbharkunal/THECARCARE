import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { FilmStrip, HouseLine, ShieldCheck, Sun } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { getImage } from "@/lib/images";
import { ChevronRoof } from "@/components/art/Chevrons";
import { WhatsAppButton } from "@/components/ui/Social";
import { HeroIsland } from "@/components/shell/islands";

const FACT_ICONS = { film: FilmStrip, shield: ShieldCheck, house: HouseLine, sun: Sun } as const;

// Roof geometry in the wide image's own coordinates: a 1600x900 viewBox, the car spanning
// 29 to 96% across and 24 to 86% down. Below 1024px the same picture sits in a 4:3 card cropped
// from the left (hero.css), so the car is centred and the roof crops with it.
const WIDE_ROOF = { cx: 1000, apexY: 72, halfWidth: 581, legEnd: 500, stroke: 11 };

const PLAY_IF_IN_VIEW =
  "(function(){var m=document.querySelector('[data-hero-media]');if(!m||innerWidth>=1024)return;var r=m.getBoundingClientRect();if(r.top+r.height*.6<=innerHeight)m.setAttribute('data-play','true')})()";

function HeroPicture() {
  const wide = getImage("hero-car-wide");
  if (!wide) return null;
  const { props } = getImageProps({
    alt: site.hero.imageAlt,
    src: wide.src,
    width: wide.width,
    height: wide.height,
    // Desktop: the frame is at most about 82% of the window wide (hero.css --fit).
    sizes: "(min-width: 1024px) 82vw, 92vw",
    quality: 75,
    loading: "eager",
    fetchPriority: "high",
  });
  // The hero photo is the LCP element: start it from <head>.
  preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: "high" });
  // eslint-disable-next-line @next/next/no-img-element -- optimised srcset comes from getImageProps; preloaded above
  return <img {...props} alt={site.hero.imageAlt} className="hero-img" />;
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
          <p className="hero-sub fade-up" style={{ "--d": "0.3s" } as React.CSSProperties}>
            {hero.sub}
          </p>
          <div className="hero-ctas fade-up" style={{ "--d": "0.38s" } as React.CSSProperties}>
            <WhatsAppButton message={site.messages.general}>{hero.primary}</WhatsAppButton>
            <a href="#services" className="btn btn-lg btn-secondary">
              {hero.secondary}
            </a>
          </div>
        </div>
        <ul className="hero-facts fade-up" style={{ "--d": "0.46s" } as React.CSSProperties}>
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

      <div className="hero-media" data-hero-media suppressHydrationWarning>
        <div className="hero-frame">
          <div className="hero-scale">
            <HeroPicture />
            <svg className="hero-roof hero-roof-wide" viewBox="0 0 1600 900" preserveAspectRatio="xMaxYMid slice" aria-hidden>
              <ChevronRoof id="roof-wide" {...WIDE_ROOF} />
            </svg>
            <div className="hero-sweep" aria-hidden />
            <div className="hero-lamp" aria-hidden />
          </div>
        </div>
      </div>
      {/* Phones: when the card is already in view as the page first paints, its roof and sweep
          start then, not when the motion islands arrive (HeroEnhancer covers the rest). */}
      <script dangerouslySetInnerHTML={{ __html: PLAY_IF_IN_VIEW }} />
      <HeroIsland />
    </section>
  );
}
