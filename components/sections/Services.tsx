import { Check } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { CarElevation } from "@/components/art/CarElevation";
import { WhatsAppButton } from "@/components/ui/Social";
import { ServicesIsland } from "@/components/shell/islands";

export function Services() {
  const { services } = site;
  const first = services.items[0];
  return (
    <section id="services" className="services section-y" aria-labelledby="services-title">
      <div className="container-x">
        <div className="grid-12 items-end gap-y-6">
          <h2 id="services-title" className="heading col-span-12 text-head lg:col-span-7" data-reveal="lines">
            {services.title}
          </h2>
          <p className="col-span-12 max-w-[34ch] text-lead text-ink lg:col-span-4 lg:col-start-9" data-reveal="rise">
            {services.intro}
          </p>
        </div>

        <div className="services-stage" data-services>
          {/* data-zone follows the block in view (ServicesMotion); the index lights that layer */}
          <div className="services-car" data-zone={first.id}>
            <ol className="services-layers" aria-hidden>
              {services.items.map((service) => (
                <li key={service.id} data-layer={service.id}>
                  {service.layer}
                </li>
              ))}
            </ol>
            <CarElevation
              id="services-car"
              zone={first.id}
              label={`${services.carLabel}: ${first.zoneLabel}`}
              className="services-car-svg"
            />
            <p className="services-caption subheading" aria-hidden data-caption-name>
              {first.name}
            </p>
          </div>

          <ol className="services-list">
            {services.items.map((service, index) => (
              <li
                key={service.id}
                className="service"
                data-service={service.id}
                data-label={`${services.carLabel}: ${service.zoneLabel}`}
                data-active={index === 0 ? "true" : "false"}
              >
                <CarElevation
                  id={`car-${service.id}`}
                  zone={service.id}
                  label={`${services.carLabel}: ${service.zoneLabel}`}
                  className="service-car"
                />
                <h3 className="service-name subheading text-lead">{service.name}</h3>
                <p className="service-body">{service.body}</p>
                <ul className="service-facts">
                  {service.facts.map((fact) => (
                    <li key={fact}>
                      <Check size={16} weight="bold" aria-hidden className="shrink-0 text-shield-green-ink" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
                <WhatsAppButton message={service.message} variant="secondary" size="md" className="mt-7">
                  Ask on WhatsApp<span className="sr-only"> about {service.name.toLowerCase()}</span>
                </WhatsAppButton>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <ServicesIsland />
    </section>
  );
}
