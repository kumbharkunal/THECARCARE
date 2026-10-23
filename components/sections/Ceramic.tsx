import { site } from "@/content/site";
import { Img } from "@/components/ui/Img";
import { WhatsAppButton } from "@/components/ui/Social";
import { CompareSlider } from "@/components/ui/CompareSlider";

export function Ceramic() {
  const { ceramic } = site;
  return (
    <section id="ceramic" className="ceramic section-y" aria-labelledby="ceramic-title">
      <div className="container-x ceramic-grid">
        <div className="ceramic-copy">
          <h2 id="ceramic-title" className="heading text-head" data-reveal="lines">
            {ceramic.title}
          </h2>
          <p className="mt-6 max-w-[34ch] text-lead" data-reveal="rise">
            {ceramic.intro}
          </p>
          <dl className="ceramic-facts" data-reveal="rise">
            {ceramic.facts.map((fact) => (
              <div key={fact.title}>
                <dt className="subheading">{fact.title}</dt>
                <dd>{fact.body}</dd>
              </div>
            ))}
          </dl>
          <WhatsAppButton message={ceramic.message} className="mt-9">
            {ceramic.cta}
          </WhatsAppButton>
        </div>
        <div className="ceramic-media">
          <CompareSlider
            slot="ceramic-gloss"
            alt={ceramic.imageAlt}
            sizes="(min-width: 1024px) 58vw, 100vw"
            mode="ceramic"
            label={ceramic.compare.label}
            beforeLabel={ceramic.compare.before}
            afterLabel={ceramic.compare.after}
            caption={ceramic.compare.caption}
            focus={{ x: 60, y: 52 }}
          />
          <figure className="ceramic-beading" data-reveal="image">
            <Img slot="ceramic-beading" alt={ceramic.beadingAlt} sizes="(min-width: 1024px) 18vw, 40vw" className="ceramic-beading-img" />
          </figure>
        </div>
      </div>
    </section>
  );
}
