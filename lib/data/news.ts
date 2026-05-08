import type { NewsItem } from "../types";

export const NEWS: NewsItem[] = [
  {
    id: "who-cruise-may-2026",
    publishedAt: "2026-05-07",
    source: "World Health Organization",
    title:
      "WHO confirms five hantavirus cases in multi-country cluster linked to cruise ship",
    url: "https://www.who.int/emergencies/disease-outbreak-news",
    summary:
      "WHO and partners are tracing passengers from a polar-expedition cruise after a confirmed cluster of Andes-virus-like hantavirus illness. The agency warns more infections may emerge given an incubation window of up to six weeks.",
    tags: ["cruise", "outbreak", "andes"],
  },
  {
    id: "ecdc-rra-may-2026",
    publishedAt: "2026-05-07",
    source: "ECDC",
    title:
      "Rapid Risk Assessment: hantavirus-associated cluster of illness on a cruise ship",
    url: "https://www.ecdc.europa.eu/en/publications-data/hantavirus-associated-cluster-illness-cruise-ship-ecdc-assessment-and",
    summary:
      "ECDC publishes recommendations for EU/EEA Member States on contact tracing, supportive care guidance, and laboratory confirmation pathways for the cruise-ship cluster.",
    tags: ["europe", "rra", "ecdc"],
  },
  {
    id: "africa-cdc-may-2026",
    publishedAt: "2026-05-06",
    source: "Africa CDC",
    title:
      "Statement on multi-country hantavirus cluster associated with cruise ship travel",
    url: "https://africacdc.org/news-item/statement-on-multi-country-hantavirus-cluster-associated-with-cruise-ship-travel/",
    summary:
      "Africa CDC coordinates with St. Helena and South African public-health authorities on the index fatality and onward contact tracing.",
    tags: ["africa", "outbreak"],
  },
  {
    id: "argentina-msal-2026",
    publishedAt: "2026-04-30",
    source: "Argentina Ministerio de Salud",
    title:
      "Boletín Integrado de Vigilancia: 28 muertes por hantavirus en 2025",
    url: "https://www.argentina.gob.ar/salud",
    summary:
      "Argentina's health ministry reports 28 hantavirus deaths in 2025, nearly double the prior 5-year average. Andes-virus circulation in Patagonia drives the bulk of severe cases.",
    tags: ["argentina", "andes"],
  },
  {
    id: "cdc-update-2026",
    publishedAt: "2026-04-22",
    source: "U.S. CDC",
    title: "CDC posts updated HPS surveillance summary",
    url: "https://www.cdc.gov/hantavirus/data-research/index.html",
    summary:
      "CDC's annual HPS data brief shows 47 confirmed cases in 2025 with 16 deaths, consistent with the post-2010 baseline.",
    tags: ["usa", "cdc"],
  },
];
