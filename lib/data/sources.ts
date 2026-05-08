import type { Source } from "../types";

export const SOURCES: Source[] = [
  {
    id: "who-factsheet",
    org: "World Health Organization",
    title: "Hantavirus — Fact sheet",
    url: "https://www.who.int/news-room/fact-sheets/detail/hantavirus",
    lastChecked: "2026-05-08",
  },
  {
    id: "who-cruise-2026",
    org: "World Health Organization",
    title: "Multi-country hantavirus cluster associated with cruise ship travel",
    url: "https://www.who.int/emergencies/disease-outbreak-news",
    lastChecked: "2026-05-08",
  },
  {
    id: "cdc-hps",
    org: "U.S. CDC",
    title: "Hantavirus Pulmonary Syndrome — Reported Cases",
    url: "https://www.cdc.gov/hantavirus/data-research/index.html",
    lastChecked: "2026-05-08",
  },
  {
    id: "ecdc-hanta",
    org: "ECDC",
    title: "Hantavirus infection — Surveillance and disease data",
    url: "https://www.ecdc.europa.eu/en/hantavirus-infection",
    lastChecked: "2026-05-08",
  },
  {
    id: "ecdc-cruise-2026",
    org: "ECDC",
    title: "Hantavirus-associated cluster of illness on a cruise ship — Rapid Risk Assessment",
    url: "https://www.ecdc.europa.eu/en/publications-data/hantavirus-associated-cluster-illness-cruise-ship-ecdc-assessment-and",
    lastChecked: "2026-05-08",
  },
  {
    id: "paho",
    org: "PAHO",
    title: "Hantavirus surveillance — Region of the Americas",
    url: "https://www.paho.org/en/topics/hantavirus",
    lastChecked: "2026-05-08",
  },
  {
    id: "africa-cdc-2026",
    org: "Africa CDC",
    title: "Statement on Multi-Country Hantavirus Cluster Associated with Cruise Ship Travel",
    url: "https://africacdc.org/news-item/statement-on-multi-country-hantavirus-cluster-associated-with-cruise-ship-travel/",
    lastChecked: "2026-05-08",
  },
  {
    id: "promed",
    org: "ProMED",
    title: "ProMED-mail — Hantavirus reports",
    url: "https://promedmail.org/",
    lastChecked: "2026-05-08",
  },
  {
    id: "nicd",
    org: "NICD South Africa",
    title: "National Institute for Communicable Diseases — surveillance bulletins",
    url: "https://www.nicd.ac.za/",
    lastChecked: "2026-05-08",
  },
  {
    id: "argentina-msal",
    org: "Argentina Ministerio de Salud",
    title: "Boletín Integrado de Vigilancia — Hantavirus",
    url: "https://www.argentina.gob.ar/salud",
    lastChecked: "2026-05-08",
  },
  {
    id: "chile-minsal",
    org: "Chile MINSAL",
    title: "Vigilancia de hantavirus",
    url: "https://www.minsal.cl/",
    lastChecked: "2026-05-08",
  },
];

export function source(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}
