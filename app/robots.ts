import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow our redirect/API endpoints from crawl — no SEO value, costs upstream RSS quota.
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://hantavirustracking.org/sitemap.xml",
    host: "https://hantavirustracking.org",
  };
}
