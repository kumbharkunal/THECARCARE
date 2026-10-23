import { site } from "@/content/site";
import { waLink } from "@/lib/wa";

const MARKS = {
  instagram: { src: "/social/instagram.svg", name: "Instagram" },
  facebook: { src: "/social/facebook.svg", name: "Facebook" },
  whatsapp: { src: "/social/whatsapp.svg", name: "WhatsApp" },
} as const;

export type SocialNetwork = keyof typeof MARKS;

/** Official full-colour theSVG mark, rendered as an image so internal SVG ids never clash. */
export function SocialMark({
  network,
  size = 24,
  className,
  decorative = true,
}: {
  network: SocialNetwork;
  size?: number;
  className?: string;
  decorative?: boolean;
}) {
  const mark = MARKS[network];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny official SVG marks, served as-is
    <img
      src={mark.src}
      width={size}
      height={size}
      alt={decorative ? "" : mark.name}
      className={`social-mark ${className ?? ""}`}
      loading="lazy"
      decoding="async"
    />
  );
}

/** Instagram and Facebook links with their official marks. */
export function SocialLinks({ className, size = 28 }: { className?: string; size?: number }) {
  const { instagram, facebook } = site.contact;
  return (
    <ul className={`flex items-center gap-2 ${className ?? ""}`}>
      <li>
        <a
          href={instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={`Instagram ${instagram.handle} (opens in a new tab)`}
        >
          <SocialMark network="instagram" size={size} />
        </a>
      </li>
      <li>
        <a
          href={facebook.href}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={`Facebook ${facebook.handle} (opens in a new tab)`}
        >
          <SocialMark network="facebook" size={size} />
        </a>
      </li>
    </ul>
  );
}

/** Pill button that opens WhatsApp with a prefilled message; the mark sits on a paper disc. */
export function WhatsAppButton({
  message,
  children,
  variant = "primary",
  size = "lg",
  className,
}: {
  message: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "paper";
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variant} btn-has-disc ${size === "lg" ? "btn-lg" : ""} ${className ?? ""}`}
    >
      <span className="btn-disc" aria-hidden>
        <SocialMark network="whatsapp" size={size === "lg" ? 24 : 22} />
      </span>
      <span>{children}</span>
      <span className="sr-only"> {site.a11y.newTab}</span>
    </a>
  );
}
