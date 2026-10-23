import manifest from "@/content/images.generated.json";

export type ImageSlot =
  | "hero-car-wide"
  | "hero-car-tall"
  | "sunfilm-fitting"
  | "interior-sunlight"
  | "safety-glass"
  | "glare-drive"
  | "ppf-fitting"
  | "paint-surface"
  | "ceramic-gloss"
  | "ceramic-beading"
  | "doorstep-fitting";

export type ImageEntry = { src: string; width: number; height: number; blurDataURL: string };

/** Expected ratio per slot, used by placeholders when an image is missing. */
export const SLOT_RATIO: Record<ImageSlot, string> = {
  "hero-car-wide": "16 / 9",
  "hero-car-tall": "3 / 4",
  "sunfilm-fitting": "3 / 4",
  "interior-sunlight": "3 / 4",
  "safety-glass": "3 / 4",
  "glare-drive": "3 / 4",
  "ppf-fitting": "3 / 4",
  "paint-surface": "1 / 1",
  "ceramic-gloss": "3 / 2",
  "ceramic-beading": "1 / 1",
  "doorstep-fitting": "3 / 2",
};

export function getImage(slot: ImageSlot): ImageEntry | null {
  return (manifest as Partial<Record<ImageSlot, ImageEntry>>)[slot] ?? null;
}
