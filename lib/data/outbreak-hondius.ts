/**
 * MV Hondius cruise-ship hantavirus cluster — May 2026
 *
 * Curated timeline of the outbreak as it has unfolded in WHO / CDC / ECDC /
 * PAHO / Africa CDC bulletins and verified media reporting. Each event
 * carries the primary source link. Update from the daily review PR.
 */

export interface TimelineEvent {
  date: string; // ISO YYYY-MM-DD
  /** Compact label shown in the timeline rail. */
  label: string;
  /** Full description, 1–3 sentences. */
  description: string;
  /** Source citation: org name + URL */
  source: { org: string; url: string };
  /** Optional severity escalation marker. */
  severity?: "info" | "alert" | "critical";
}

export interface OutbreakCountry {
  iso: string;
  name: string;
  cases: number;
  deaths: number;
  status: "confirmed" | "suspected" | "monitoring";
  notes?: string;
}

export const HONDIUS_TIMELINE: TimelineEvent[] = [
  {
    date: "2026-04-18",
    label: "Voyage departs",
    description:
      "MV Hondius, an expedition cruise ship operated for polar tourism, departs Ushuaia, Argentina on a circuit through the Falkland Islands, South Georgia, and Saint Helena.",
    source: {
      org: "Oceanwide Expeditions itinerary",
      url: "https://oceanwide-expeditions.com/",
    },
    severity: "info",
  },
  {
    date: "2026-05-01",
    label: "Index fatality",
    description:
      "A passenger disembarking the MV Hondius at Jamestown, Saint Helena, dies of acute respiratory failure. Subsequent testing identifies Andes-like hantavirus as the likely cause.",
    source: {
      org: "Africa CDC",
      url: "https://africacdc.org/news-item/statement-on-multi-country-hantavirus-cluster-associated-with-cruise-ship-travel/",
    },
    severity: "critical",
  },
  {
    date: "2026-05-06",
    label: "Africa CDC statement",
    description:
      "Africa CDC issues a public statement on the multi-country cluster, coordinating with Saint Helena and South African public-health authorities on contact tracing of onward-traveling passengers.",
    source: {
      org: "Africa CDC",
      url: "https://africacdc.org/news-item/statement-on-multi-country-hantavirus-cluster-associated-with-cruise-ship-travel/",
    },
    severity: "alert",
  },
  {
    date: "2026-05-07",
    label: "WHO confirms cluster",
    description:
      "WHO confirms five hantavirus cases in the multi-country cluster linked to the MV Hondius and warns more cases may emerge given an incubation window of up to six weeks. ECDC publishes a Rapid Risk Assessment the same day.",
    source: {
      org: "World Health Organization",
      url: "https://www.who.int/emergencies/disease-outbreak-news",
    },
    severity: "alert",
  },
  {
    date: "2026-05-07",
    label: "CDC issues statement",
    description:
      "The U.S. CDC publishes a public statement on the situation, confirming the agency is monitoring U.S. travelers who were aboard the vessel.",
    source: {
      org: "U.S. CDC Newsroom",
      url: "https://tools.cdc.gov/api/v2/resources/media/132608.rss",
    },
    severity: "alert",
  },
  {
    date: "2026-05-08",
    label: "Multi-state US monitoring",
    description:
      "Five U.S. states begin actively monitoring passengers who travelled home. The U.K. identifies a new suspected case as the ship prepares to dock in Tenerife.",
    source: {
      org: "U.S. CDC / state health departments",
      url: "https://www.cdc.gov/hantavirus/",
    },
    severity: "alert",
  },
  {
    date: "2026-05-10",
    label: "Ship arrives at Tenerife",
    description:
      "MV Hondius arrives at the port of Granadilla, Tenerife, Canary Islands. Passengers and crew begin a controlled disembarkation under Spanish public-health supervision; symptomatic patients are medically evacuated to their countries of origin.",
    source: {
      org: "ECDC",
      url: "https://www.ecdc.europa.eu/en/news-events/andes-hantavirus-outbreak-ecdc-continues-working-frontline-support-eu-member-states",
    },
    severity: "alert",
  },
  {
    date: "2026-05-11",
    label: "ECDC response activated",
    description:
      "ECDC announces it continues working on the frontline to support EU Member States in the Andes hantavirus outbreak response, including clinical guidance and laboratory confirmation pathways.",
    source: {
      org: "ECDC News",
      url: "https://www.ecdc.europa.eu/en/news-events/andes-hantavirus-outbreak-ecdc-continues-working-frontline-support-eu-member-states",
    },
    severity: "info",
  },
  {
    date: "2026-05-11",
    label: "PAHO Q&A briefing",
    description:
      "PAHO holds a public question-and-answer session on hantavirus following the cruise-ship outbreak, addressing transmission and clinical presentation for the regional response.",
    source: {
      org: "PAHO",
      url: "https://www.paho.org/es/noticias/11-5-2026-ops-realizo-sesion-preguntas-respuestas-sobre-hantavirus-tras-brote-crucero",
    },
    severity: "info",
  },
  {
    date: "2026-05-12",
    label: "Cases rise to 11",
    description:
      "Confirmed cases linked to the cluster rise to 11 as a Spanish passenger falls ill following disembarkation. 18 U.S. travelers exposed aboard the vessel are transported to a federal quarantine facility in Nebraska; two further travelers are admitted to care in Atlanta; three Utah residents and additional cases in Boston are identified.",
    source: {
      org: "Multiple — see live news feed",
      url: "https://hantavirustracking.org/#news",
    },
    severity: "critical",
  },
];

/**
 * Country-level breakdown of cases linked to the cluster. These are
 * separate from the global country dataset because they specifically
 * count passengers from this single voyage rather than autochthonous
 * cases.
 */
export const HONDIUS_COUNTRIES: OutbreakCountry[] = [
  {
    iso: "SHN",
    name: "Saint Helena",
    cases: 1,
    deaths: 1,
    status: "confirmed",
    notes: "Index fatality of the cluster.",
  },
  {
    iso: "ESP",
    name: "Spain",
    cases: 3,
    deaths: 0,
    status: "confirmed",
    notes:
      "Spanish passenger falls ill following ship arrival at Tenerife; additional cases identified during disembarkation.",
  },
  {
    iso: "GBR",
    name: "United Kingdom",
    cases: 3,
    deaths: 0,
    status: "suspected",
    notes:
      "British passengers identified by U.K. Health Security Agency contact tracing.",
  },
  {
    iso: "USA",
    name: "United States",
    cases: 4,
    deaths: 0,
    status: "monitoring",
    notes:
      "Five states monitoring returning passengers; federal quarantine activated at Nebraska facility for 18 exposed travellers.",
  },
  {
    iso: "ZAF",
    name: "South Africa",
    cases: 0,
    deaths: 0,
    status: "monitoring",
    notes: "Onward contact tracing in coordination with NICD.",
  },
];

export const HONDIUS_FACTS = {
  vessel: "MV Hondius",
  vesselType: "Polar expedition cruise ship",
  departurePort: "Ushuaia, Argentina",
  departureDate: "2026-04-18",
  arrivalPort: "Granadilla, Tenerife, Canary Islands",
  arrivalDate: "2026-05-10",
  passengersAboard: "≈170 passengers and crew",
  suspectedStrain: "Andes-like hantavirus",
  incubationPeriod: "1 – 6 weeks (typical 2 – 4 weeks)",
};
