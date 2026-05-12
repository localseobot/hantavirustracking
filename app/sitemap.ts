import type { MetadataRoute } from "next";
import { COUNTRIES } from "@/lib/data/countries";

const BASE = "https://hantavirustracking.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE}/globe`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE}/outbreaks/mv-hondius`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${BASE}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const countryPages: MetadataRoute.Sitemap = COUNTRIES.map((c) => ({
    url: `${BASE}/c/${c.iso.toLowerCase()}`,
    lastModified: new Date(c.lastUpdated),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...countryPages];
}
