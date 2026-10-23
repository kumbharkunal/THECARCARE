import Image from "next/image";
import { getImage, SLOT_RATIO, type ImageSlot } from "@/lib/images";
import { ChevronMark } from "@/components/art/Chevrons";

type Props = {
  slot: ImageSlot;
  alt: string;
  sizes: string;
  className?: string;
  /** Fill the positioned parent instead of using intrinsic dimensions. */
  fill?: boolean;
  quality?: 75 | 82;
  eager?: boolean;
};

/** next/image from the generated manifest; a branded placeholder when the image is missing. */
export function Img({ slot, alt, sizes, className, fill = false, quality = 75, eager = false }: Props) {
  const img = getImage(slot);
  if (!img) return <Placeholder slot={slot} className={className} />;
  const common = {
    src: img.src,
    sizes,
    quality,
    className,
    placeholder: "blur" as const,
    blurDataURL: img.blurDataURL,
    ...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {}),
  };
  return fill ? (
    <Image {...common} alt={alt} fill />
  ) : (
    <Image {...common} alt={alt} width={img.width} height={img.height} />
  );
}

export function Placeholder({ slot, className }: { slot: ImageSlot; className?: string }) {
  return (
    <div
      className={`relative grid place-items-center overflow-hidden bg-mist ${className ?? ""}`}
      style={{ aspectRatio: SLOT_RATIO[slot] }}
      role="presentation"
    >
      <svg viewBox="0 0 400 160" className="absolute inset-x-[12%] bottom-[18%] h-auto w-[76%] opacity-25" aria-hidden>
        <path
          d="M30 128 C34 108 46 98 70 94 L120 86 C150 60 190 46 236 46 C280 46 318 62 346 90 L372 96 C384 100 388 112 386 128 Z"
          fill="none"
          stroke="var(--color-care-blue)"
          strokeWidth="2"
        />
        <circle cx="104" cy="128" r="22" fill="none" stroke="var(--color-care-blue)" strokeWidth="2" />
        <circle cx="314" cy="128" r="22" fill="none" stroke="var(--color-care-blue)" strokeWidth="2" />
      </svg>
      <ChevronMark className="relative h-auto w-16 opacity-80" />
      {process.env.NODE_ENV === "development" ? (
        <span className="absolute bottom-2 left-2 rounded-full bg-paper px-2 py-0.5 font-mono text-[11px] text-ink-soft">
          raw-images/{slot}.png ({SLOT_RATIO[slot].replace(/ /g, "")})
        </span>
      ) : null}
    </div>
  );
}
