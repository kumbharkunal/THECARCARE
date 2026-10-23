"use client";

import { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

/** One answer open at a time; height eases with grid-template-rows (no measuring, no jank). */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- collapsed panels become inert only once JS runs
  useEffect(() => setMounted(true), []);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q} className="faq-item" data-open={isOpen}>
            <h3 className="faq-q-wrap">
              <button
                type="button"
                id={`faq-q-${index}`}
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={`faq-a-${index}`}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden>
                  <Plus size={18} weight="bold" />
                </span>
              </button>
            </h3>
            <div
              id={`faq-a-${index}`}
              role="region"
              aria-labelledby={`faq-q-${index}`}
              className="faq-panel"
              inert={mounted && !isOpen}
            >
              <div className="faq-panel-inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
