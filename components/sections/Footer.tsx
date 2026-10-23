import Image from "next/image";
import { site } from "@/content/site";
import { waLink } from "@/lib/wa";
import { SocialLinks } from "@/components/ui/Social";
import { FooterMotion } from "@/components/sections/FooterMotion";

async function Year() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const { footer, contact } = site;
  return (
    <footer id="site-footer" className="footer">
      <div className="container-x footer-grid">
        <div className="footer-brand">
          <Image src="/brand/logo-lockup.png" alt={site.name} width={640} height={448} className="footer-lockup" sizes="200px" />
          <p className="footer-tagline mt-6 text-lead">{footer.tagline}</p>
        </div>
        <nav aria-label="Footer" className="footer-col footer-explore">
          <h2 className="footer-h">{footer.explore}</h2>
          <ul>
            {footer.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="footer-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-col footer-contact">
          <h2 className="footer-h">{footer.contact}</h2>
          <ul>
            {contact.phones.map((phone) => (
              <li key={phone.href}>
                <a href={phone.href} className="footer-link tabular">
                  {phone.label}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contact.email}`} className="footer-link">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={waLink(site.messages.general)} target="_blank" rel="noopener noreferrer" className="footer-link">
                WhatsApp<span className="sr-only"> {site.a11y.newTab}</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col footer-visit">
          <h2 className="footer-h">{footer.visit}</h2>
          <address className="not-italic">
            {contact.address.lines.map((line) => (
              <span key={line} className="block text-balance">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-3 text-small text-ink-soft">{contact.hoursNote}</p>
          <SocialLinks className="mt-5" size={30} />
        </div>
      </div>

      <div className="footer-name" aria-hidden>
        <span className="footer-name-outline display">{site.wordmark}</span>
        <span className="footer-name-fill display">{site.wordmark}</span>
      </div>

      <div className="container-x footer-legal">
        <p>
          © <Year /> {footer.rights}
        </p>
      </div>
      <FooterMotion />
    </footer>
  );
}
