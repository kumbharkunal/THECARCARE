import { Check } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { Img } from "@/components/ui/Img";
import { WhatsAppButton } from "@/components/ui/Social";
import { ScratchHeal } from "@/components/sections/ScratchHeal";

export function Ppf() {
  const { ppf } = site;
  return (
    <section id="ppf" className="ppf section-y" aria-labelledby="ppf-title">
      <div className="container-x">
        <div className="ppf-demo">
          <div className="ppf-copy">
            <h2 id="ppf-title" className="heading text-head" data-reveal="lines">
              {ppf.title}
            </h2>
            <p className="mt-6 max-w-[38ch] text-lead" data-reveal="rise">
              {ppf.intro}
            </p>
          </div>
          <div className="ppf-canvas">
            <ScratchHeal />
          </div>
        </div>

        <div className="ppf-product">
          <figure className="ppf-photo" data-reveal="image">
            <Img slot="ppf-fitting" alt={ppf.imageAlt} sizes="(min-width: 1024px) 30vw, 100vw" className="ppf-photo-img" />
          </figure>
          <div className="ppf-facts">
            <h3 className="heading ppf-subtitle" data-reveal="lines">
              {ppf.productTitle}
            </h3>
            <ul className="ppf-props" data-reveal="rise">
              {ppf.properties.map((property) => (
                <li key={property}>
                  <Check size={18} weight="bold" aria-hidden className="shrink-0 text-shield-green-ink" />
                  {property}
                </li>
              ))}
            </ul>
            <h3 className="subheading mt-10 text-lead">{ppf.coverageTitle}</h3>
            <p className="mt-3 max-w-[44ch]">{ppf.coverage}</p>
            <WhatsAppButton message={ppf.message} className="mt-8">
              {ppf.cta}
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
