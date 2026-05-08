export type Region =
  | "North America"
  | "South America"
  | "Europe"
  | "Asia"
  | "Africa"
  | "Oceania";

export type SeverityBand = "none" | "low" | "moderate" | "high" | "severe";

export interface CountryCase {
  /** ISO 3166-1 alpha-3 */
  iso: string;
  name: string;
  region: Region;
  /** Most recent reporting year reflected in the case/death numbers below. */
  reportingYear: number;
  /** Confirmed cases for the reporting year (or cumulative where noted). */
  cases: number;
  /** Deaths attributed to hantavirus in the reporting year. */
  deaths: number;
  /** Lat/lng of the country's geographic centroid (for globe markers). */
  lat: number;
  lng: number;
  /** Predominant hantavirus strain(s) circulating. */
  strains: string[];
  /** Notes that show up in the country detail panel. */
  notes?: string;
  /** ISO date (YYYY-MM-DD) of the most recent surveillance update. */
  lastUpdated: string;
  /** Source IDs this row was compiled from — see `lib/data/sources.ts`. */
  sourceIds: string[];
}

export interface TimelinePoint {
  year: number;
  americas: number;
  asia: number;
  europe: number;
  africa: number;
  oceania: number;
}

export interface NewsItem {
  id: string;
  publishedAt: string; // ISO date
  source: string;
  title: string;
  url: string;
  summary: string;
  tags: string[];
  /** True when this item matches active-cluster keywords (cruise / MV Hondius / etc). */
  cluster?: boolean;
  /** Where this item came from in our pipeline ("seed" = hand-curated, "live" = RSS). */
  origin?: "seed" | "live";
}

export interface Source {
  id: string;
  org: string;
  title: string;
  url: string;
  /** Last time the dataset / page was checked, ISO date. */
  lastChecked: string;
}

export function caseFatalityRate(cases: number, deaths: number): number {
  if (cases <= 0) return 0;
  return (deaths / cases) * 100;
}

export function severityFromCases(cases: number): SeverityBand {
  if (cases <= 0) return "none";
  if (cases <= 10) return "low";
  if (cases <= 50) return "moderate";
  if (cases <= 500) return "high";
  return "severe";
}

export const SEVERITY_COLOR: Record<SeverityBand, string> = {
  none: "#1e293b",
  low: "#22c55e",
  moderate: "#eab308",
  high: "#f97316",
  severe: "#ef4444",
};

export const SEVERITY_LABEL: Record<SeverityBand, string> = {
  none: "No reported cases",
  low: "1–10 cases",
  moderate: "11–50 cases",
  high: "51–500 cases",
  severe: "500+ cases",
};
