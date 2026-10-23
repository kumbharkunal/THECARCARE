import { Hero } from "@/components/hero/Hero";
import { Services } from "@/components/sections/Services";
import { SunFilm } from "@/components/sections/SunFilm";
import { Ppf } from "@/components/sections/Ppf";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <Services />
      <SunFilm />
      <Ppf />
      {["ceramic", "why", "process", "faq", "visit"].map((id) => (
        <section key={id} id={id} className="container-x section-y">
          <h2 className="heading text-head">{id}</h2>
          <div className="h-[80vh]" />
        </section>
      ))}
      <footer id="site-footer" className="container-x section-y">
        footer
      </footer>
    </main>
  );
}
