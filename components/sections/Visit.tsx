import { ArrowUpRight, EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { waLink } from "@/lib/wa";
import { SocialLinks, SocialMark } from "@/components/ui/Social";
import { MapFacade } from "@/components/sections/MapFacade";
import { MAPS_OPEN } from "@/lib/maps";
import { Enquiry } from "@/components/sections/Enquiry";

export function Visit() {
  const { visit, contact } = site;
  return (
    <section id="visit" className="visit section-y" aria-labelledby="visit-title">
      <div className="container-x">
        <h2 id="visit-title" className="heading text-head" data-reveal="lines">
          {visit.title}
        </h2>
        <p lang="mr" className="visit-marathi" data-reveal="rise">
          {visit.marathi}
        </p>

        <div className="visit-rows" data-reveal="rise">
          <a href={contact.phones[0].href} className="visit-row">
            <span className="visit-row-text heading tabular">{contact.phones[0].label}</span>
            <Phone size={28} weight="light" aria-hidden className="visit-row-icon" />
          </a>
          <a href={MAPS_OPEN} target="_blank" rel="noopener noreferrer" className="visit-row">
            <span className="visit-row-text heading">{contact.address.short}</span>
            <ArrowUpRight size={28} weight="light" aria-hidden className="visit-row-icon" />
            <span className="sr-only"> (opens Google Maps)</span>
          </a>
          <p className="visit-row">
            <span className="visit-row-text heading">{contact.hoursShort}</span>
          </p>
        </div>

        <div className="visit-grid">
          <div className="visit-left">
            <MapFacade />
            <div className="visit-details">
              <div>
                <h3 className="subheading text-lead">{visit.addressTitle}</h3>
                <address className="mt-3 not-italic">
                  {contact.address.lines.map((line) => (
                    <span key={line} className="block text-balance">
                      {line}
                    </span>
                  ))}
                </address>
                <p className="mt-3 text-small text-ink-soft">{contact.bookNote}</p>
              </div>
              <div>
                <h3 className="subheading text-lead">{visit.contactTitle}</h3>
                <ul className="mt-3 grid gap-2">
                  {contact.phones.map((phone) => (
                    <li key={phone.href}>
                      <a href={phone.href} className="contact-link">
                        <Phone size={18} weight="light" aria-hidden />
                        <span className="tabular">{phone.label}</span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={`mailto:${contact.email}`} className="contact-link">
                      <EnvelopeSimple size={18} weight="light" aria-hidden />
                      {contact.email}
                    </a>
                  </li>
                  <li>
                    <a href={waLink(site.messages.general)} target="_blank" rel="noopener noreferrer" className="contact-link">
                      <SocialMark network="whatsapp" size={18} />
                      WhatsApp
                      <span className="sr-only"> {site.a11y.newTab}</span>
                    </a>
                  </li>
                </ul>
                <h3 className="subheading mt-6 text-lead">{visit.socialTitle}</h3>
                <SocialLinks className="mt-3" size={32} />
              </div>
            </div>
          </div>
          <div className="visit-right">
            <Enquiry />
            <noscript>
              <a href={waLink(site.messages.general)} className="btn btn-lg btn-primary mt-4">
                {visit.enquiry.noScript}
              </a>
            </noscript>
          </div>
        </div>
      </div>
    </section>
  );
}
