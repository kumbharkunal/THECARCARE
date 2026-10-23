import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { waLink } from "@/lib/wa";
import { Img } from "@/components/ui/Img";
import { SocialMark } from "@/components/ui/Social";

/** Tiles lift 2px on hover while a hairline traces round them (why.css). */
export function Why() {
  const { why } = site;
  return (
    <section id="why" className="why section-y" aria-labelledby="why-title">
      <div className="container-x">
        <h2 id="why-title" className="heading text-head" data-reveal="lines">
          {why.title}
        </h2>
        <div className="bento">
          <article className="tile tile-doorstep">
            <Img slot="doorstep-fitting" alt={why.doorstep.alt} sizes="(min-width: 1024px) 56vw, 100vw" className="tile-photo" fill />
            <div className="tile-doorstep-copy">
              <h3 className="heading tile-title-lg">{why.doorstep.title}</h3>
              <p className="mt-2 text-lead">{why.doorstep.body}</p>
            </div>
          </article>
          <article className="tile tile-brand">
            <h3 className="heading tile-title">{why.brand.title}</h3>
            <p className="mt-3">{why.brand.body}</p>
          </article>
          <article className="tile tile-warranty">
            <p className="tile-years font-mono tabular" aria-hidden>
              <span>{why.warranty.years[0]}</span>
              <span className="tile-years-and">{why.warranty.joiner}</span>
              <span>{why.warranty.years[1]}</span>
            </p>
            <h3 className="heading tile-title">
              <span className="sr-only">{why.warranty.years.join(` ${why.warranty.joiner} `)} </span>
              {why.warranty.title}
            </h3>
            <p className="mt-2 text-small text-ink-soft">{why.warranty.body}</p>
          </article>
          <article className="tile tile-craft">
            <h3 className="heading tile-title">{why.craft.title}</h3>
            <p className="mt-3">{why.craft.body}</p>
          </article>
          <a
            className="tile tile-whatsapp"
            href={waLink(site.messages.general)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <SocialMark network="whatsapp" size={44} />
            <span className="heading tile-title">{why.whatsapp.title}</span>{" "}
            <span className="tile-cta">
              {why.whatsapp.cta}
              <ArrowUpRight size={18} weight="bold" aria-hidden />
            </span>
            <span className="sr-only"> {site.a11y.newTab}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
