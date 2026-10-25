import type { MetadataRoute } from "next";
import { locales } from "~/utils/navigation";
import { siteUrl } from "~/utils/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/*/admin",
        ...locales.map((locale) => `/${locale}/admin`),
      ],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
