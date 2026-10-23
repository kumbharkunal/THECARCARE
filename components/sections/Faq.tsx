import { site } from "@/content/site";
import { WhatsAppButton } from "@/components/ui/Social";
import { FaqAccordion } from "@/components/sections/FaqAccordion";

export function Faq() {
  const { faq } = site;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <section id="faq" className="faq section-y" aria-labelledby="faq-title">
      <div className="container-x faq-grid">
        <div className="faq-head">
          <h2 id="faq-title" className="heading text-head" data-reveal="lines">
            {faq.title}
          </h2>
          <p className="mt-5 max-w-[30ch] text-lead" data-reveal="rise">
            {faq.intro}
          </p>
          <WhatsAppButton message={site.messages.general} variant="secondary" size="md" className="mt-7">
            Ask on WhatsApp
          </WhatsAppButton>
        </div>
        <FaqAccordion items={faq.items.map((item) => ({ q: item.q, a: item.a }))} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </section>
  );
}
