import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// The demo stays out of search until NEXT_PUBLIC_ALLOW_INDEXING=true (see layout.tsx for the meta tag).
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
