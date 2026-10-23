import { site } from "@/content/site";
import { Hero } from "@/components/hero/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Services } from "@/components/sections/Services";
import { SunFilm } from "@/components/sections/SunFilm";
import { Ppf } from "@/components/sections/Ppf";
import { Ceramic } from "@/components/sections/Ceramic";
import { Why } from "@/components/sections/Why";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { Visit } from "@/components/sections/Visit";
import { Footer } from "@/components/sections/Footer";
import { RevealIsland } from "@/components/shell/islands";

// Confirmed facts only. Opening hours are added once the client confirms them.
const business = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: site.name,
  url: site.url,
  logo: `${site.url}/brand/logo-mark.png`,
  image: `${site.url}/opengraph-image`,
  telephone: site.contact.phones.map((phone) => phone.href.replace("tel:", "")),
  email: site.contact.email,
  description: site.meta.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.address.street,
    addressLocality: site.contact.address.locality,
    addressRegion: site.contact.address.region,
    postalCode: site.contact.address.postalCode,
    addressCountry: site.contact.address.country,
  },
  areaServed: { "@type": "City", name: "Pune" },
  sameAs: [site.contact.instagram.href, site.contact.facebook.href],
};

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Ticker />
        <Services />
        <SunFilm />
        <Ppf />
        <Ceramic />
        <Why />
        <Process />
        <Faq />
        <Visit />
      </main>
      <Footer />
      <RevealIsland />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
