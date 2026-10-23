import { WA_PHONE } from "@/content/site";

/** wa.me link with a prefilled, URL-encoded message to the primary WhatsApp number. */
export function waLink(message: string): string {
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(message)}`;
}
