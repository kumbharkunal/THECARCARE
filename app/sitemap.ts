import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// One page. Empty until indexing is switched on, so nothing advertises a noindex URL.
export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") return [];
  return [{ url: site.url, changeFrequency: "monthly", priority: 1 }];
}
