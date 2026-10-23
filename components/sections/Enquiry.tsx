"use client";

import { useId, useRef, useState } from "react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { a11y, enquiry } from "@/content/site";
import { waLink } from "@/lib/wa";
import { SocialMark } from "@/components/ui/Social";

type Where = "studio" | "doorstep";
type Field = "car" | "services" | "area";

function compose(car: string, services: string[], where: Where, area: string, notes: string) {
  const lines = [
    "Hello The Car Care,",
    "I'd like a quote.",
    `Car: ${car.trim() || "..."}`,
    `Services: ${services.length ? services.join(", ") : "..."}`,
    `Where: ${where === "studio" ? "Studio" : `Doorstep, ${area.trim() || "..."}`}`,
  ];
  if (notes.trim()) lines.push(`Notes: ${notes.trim()}`);
  lines.push("(Sent from your website)");
  return lines.join("\n");
}

export function Enquiry() {
  const id = useId();
  const [car, setCar] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [where, setWhere] = useState<Where>("studio");
  const [area, setArea] = useState("");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState<Record<Field, boolean>>({ car: false, services: false, area: false });
  const [sent, setSent] = useState(false);
  const carRef = useRef<HTMLInputElement>(null);
  const servicesRef = useRef<HTMLButtonElement>(null);
  const areaRef = useRef<HTMLInputElement>(null);

  const errors: Record<Field, string> = {
    car: car.trim().length < 2 ? enquiry.car.error : "",
    services: services.length === 0 ? enquiry.services.error : "",
    area: where === "doorstep" && area.trim().length < 2 ? enquiry.area.error : "",
  };
  const show = (field: Field) => touched[field] && errors[field];
  const message = compose(car, services, where, area, notes);

  const toggleService = (name: string) => {
    setServices((prev) => (prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]));
    setTouched((t) => ({ ...t, services: true }));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setTouched({ car: true, services: true, area: true });
    if (errors.car) return carRef.current?.focus();
    if (errors.services) return servicesRef.current?.focus();
    if (errors.area) return areaRef.current?.focus();
    window.open(waLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <div className="enquiry">
      <h3 className="heading enquiry-title">{enquiry.title}</h3>
      <p className="mt-3 text-ink-soft">{enquiry.intro}</p>
      <form className="enquiry-form" noValidate onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor={`${id}-car`}>{enquiry.car.label}</label>
          <input
            ref={carRef}
            id={`${id}-car`}
            name="car"
            type="text"
            autoComplete="off"
            placeholder={enquiry.car.placeholder}
            value={car}
            onChange={(e) => setCar(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, car: true }))}
            aria-invalid={show("car") ? true : undefined}
            aria-describedby={show("car") ? `${id}-car-err` : undefined}
          />
          {show("car") ? (
            <p id={`${id}-car-err`} className="field-error" role="alert">
              {errors.car}
            </p>
          ) : null}
        </div>

        <fieldset className="field" aria-describedby={show("services") ? `${id}-svc-err` : undefined}>
          <legend>{enquiry.services.label}</legend>
          <div className="chips">
            {enquiry.services.options.map((option, index) => {
              const on = services.includes(option);
              return (
                <button
                  key={option}
                  ref={index === 0 ? servicesRef : undefined}
                  type="button"
                  className="chip"
                  aria-pressed={on}
                  onClick={() => toggleService(option)}
                >
                  {on ? <Check size={14} weight="bold" aria-hidden /> : null}
                  {option}
                </button>
              );
            })}
          </div>
          {show("services") ? (
            <p id={`${id}-svc-err`} className="field-error" role="alert">
              {errors.services}
            </p>
          ) : null}
        </fieldset>

        <fieldset className="field">
          <legend>{enquiry.where.label}</legend>
          <div className="segmented" role="radiogroup" aria-label={enquiry.where.label} data-where={where}>
            {/* One pill slides under the chosen option (CSS transform). A Motion layoutId here would
                measure the form when the motion features load, far below the fold. */}
            <span className="segment-pill" aria-hidden />
            {(["studio", "doorstep"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={where === value}
                tabIndex={where === value ? 0 : -1}
                className="segment"
                onClick={() => setWhere(value)}
                onKeyDown={(e) => {
                  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                    const next = where === "studio" ? "doorstep" : "studio";
                    setWhere(next);
                    (e.currentTarget.parentElement?.querySelector(`[data-value="${next}"]`) as HTMLElement | null)?.focus();
                  }
                }}
                data-value={value}
              >
                <span className="relative">{enquiry.where[value]}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {where === "doorstep" ? (
          <div className="field">
            <label htmlFor={`${id}-area`}>{enquiry.area.label}</label>
            <input
              ref={areaRef}
              id={`${id}-area`}
              name="area"
              type="text"
              autoComplete="address-level3"
              placeholder={enquiry.area.placeholder}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, area: true }))}
              aria-invalid={show("area") ? true : undefined}
              aria-describedby={show("area") ? `${id}-area-err` : undefined}
            />
            {show("area") ? (
              <p id={`${id}-area-err`} className="field-error" role="alert">
                {errors.area}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="field">
          <label htmlFor={`${id}-notes`}>{enquiry.notes.label}</label>
          <textarea
            id={`${id}-notes`}
            name="notes"
            rows={3}
            placeholder={enquiry.notes.placeholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="wa-preview" aria-live="off">
          <p className="wa-preview-label">{enquiry.preview}</p>
          <p className="wa-bubble">{message}</p>
        </div>

        <button type="submit" className="btn btn-lg btn-primary btn-has-disc mt-2 w-full sm:w-auto">
          <span className="btn-disc" aria-hidden>
            <SocialMark network="whatsapp" size={24} />
          </span>
          <span>{enquiry.submit}</span>
          <span className="sr-only"> {a11y.newTab}</span>
        </button>
        {/* Confirms the hand-off, with a plain link in case the browser held the new window back */}
        <p role="status" className="enquiry-status">
          {sent ? (
            <>
              {enquiry.sent}{" "}
              <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="link">
                {enquiry.retry}
                <span className="sr-only"> {a11y.newTab}</span>
              </a>
            </>
          ) : null}
        </p>
      </form>
    </div>
  );
}
