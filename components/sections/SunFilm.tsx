import { site } from "@/content/site";
import { Img } from "@/components/ui/Img";
import { WhatsAppButton } from "@/components/ui/Social";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { ShadeGuide } from "@/components/sections/ShadeGuide";
import { StackMotion } from "@/components/sections/StackMotion";
import type { ImageSlot } from "@/lib/images";

export function SunFilm() {
  const { sunFilm } = site;
  const { offer } = sunFilm;
  return (
    <section id="sun-film" className="sunfilm section-y" aria-labelledby="sunfilm-title">
      <div className="container-x">
        <div className="grid-12 gap-y-8">
          <h2 id="sunfilm-title" className="heading col-span-12 text-head lg:col-span-8" data-reveal="lines">
            {sunFilm.title}
          </h2>
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="max-w-[34ch] text-lead" data-reveal="rise">
              {sunFilm.intro}
            </p>
            {offer.active ? (
              <div className="offer" data-reveal="rise">
                <p className="offer-text heading">{offer.text}</p>
                <p className="mt-2 text-small text-ink-soft">{offer.detail}</p>
                <WhatsAppButton message={site.messages.offer} size="md" className="mt-5">
                  {offer.cta}
                </WhatsAppButton>
              </div>
            ) : null}
          </div>
        </div>

        <ol className="benefits" data-benefits>
          {sunFilm.benefits.map((benefit, index) => {
            const isGlare = index === sunFilm.benefits.length - 1;
            return (
              <li key={benefit.title} className="benefit" style={{ "--i": index } as React.CSSProperties}>
                <div className="benefit-card">
                  <div className="benefit-media">
                    {isGlare ? (
                      <CompareSlider
                        slot={benefit.image as ImageSlot}
                        alt={benefit.alt}
                        sizes="(min-width: 1024px) 38vw, 100vw"
                        mode="glare"
                        label={sunFilm.compare.label}
                        beforeLabel={sunFilm.compare.before}
                        afterLabel={sunFilm.compare.after}
                        caption={sunFilm.compare.caption}
                        focus={{ x: 22, y: 35 }}
                      />
                    ) : (
                      <Img
                        slot={benefit.image as ImageSlot}
                        alt={benefit.alt}
                        sizes="(min-width: 1024px) 38vw, 100vw"
                        className="benefit-img"
                      />
                    )}
                  </div>
                  <div className="benefit-copy">
                    <span className="benefit-n font-mono" aria-hidden>
                      {benefit.n}
                    </span>
                    <h3 className="heading benefit-title">{benefit.title}</h3>
                    <p className="benefit-line">{benefit.line}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <ShadeGuide />
      </div>
      <StackMotion />
    </section>
  );
}
