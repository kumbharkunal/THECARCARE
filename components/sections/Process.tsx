import { site } from "@/content/site";
import { ChevronMark } from "@/components/art/Chevrons";
import { ProcessMotion } from "@/components/sections/ProcessMotion";

export function Process() {
  const { process } = site;
  return (
    <section id="process" className="process section-y" aria-labelledby="process-title">
      <div className="container-x">
        <h2 id="process-title" className="heading text-head process-title" data-reveal="lines">
          {process.title}
        </h2>
        <div className="process-track">
          <svg className="process-line" aria-hidden preserveAspectRatio="none" viewBox="0 0 2 100">
            <line className="process-line-base" x1="1" y1="0" x2="1" y2="100" vectorEffect="non-scaling-stroke" />
            <line className="process-line-draw" x1="1" y1="0" x2="1" y2="100" vectorEffect="non-scaling-stroke" />
          </svg>
          <ol className="process-steps">
            {process.steps.map((step, index) => (
              <li key={step.title} className="process-step" data-side={index % 2 === 0 ? "left" : "right"}>
                <span className="process-marker" aria-hidden>
                  <ChevronMark className="process-chev" />
                </span>
                <div className="process-copy">
                  <h3 className="heading process-step-title">{step.title}</h3>
                  <p className="mt-3 max-w-[38ch]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <ProcessMotion />
    </section>
  );
}
