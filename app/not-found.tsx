import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { ChevronRoof } from "@/components/art/Chevrons";
import { WhatsAppButton } from "@/components/ui/Social";

export const metadata: Metadata = {
  title: `Page not found | ${site.name}`,
};

/** An empty bay under the logo's roof: nothing parked here. */
export default function NotFound() {
  const { notFound } = site;
  return (
    <main id="main" className="nf">
      <div className="container-x nf-inner">
        <svg className="nf-bay" viewBox="0 0 1000 420" aria-hidden>
          <ChevronRoof id="roof-404" cx={500} apexY={24} halfWidth={430} legEnd={400} stroke={9} />
          <line className="nf-floor" x1="40" x2="960" y1="404" y2="404" />
        </svg>
        <h1 className="display text-display nf-title">{notFound.title}</h1>
        <p className="mt-4 text-lead text-ink-soft">{notFound.body}</p>
        <div className="nf-actions">
          <Link href="/" className="btn btn-lg btn-primary">
            {notFound.cta}
          </Link>
          <WhatsAppButton message={site.messages.general} variant="secondary">
            {site.nav.cta}
          </WhatsAppButton>
        </div>
      </div>
    </main>
  );
}
