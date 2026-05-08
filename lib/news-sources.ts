/**
 * RSS / Atom feeds we ingest for the live news section.
 *
 * Each source is fetched in parallel, parsed, then filtered with the
 * shared `HANTA_KEYWORDS` regex so generic feeds (Google News, ECDC,
 * Africa CDC) only surface hantavirus-relevant posts. Add a new source
 * by appending an entry below — the route handler will pick it up.
 */

export interface NewsSource {
  id: string;
  org: string;
  /** Public RSS / Atom URL */
  url: string;
  /** Set true for narrow feeds that are already topical (skip keyword filtering). */
  topical?: boolean;
  /** Tags to attach to every item from this source. */
  defaultTags?: string[];
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: "promed",
    org: "ProMED",
    url: "https://promedmail.org/promed-post-feed/",
    defaultTags: ["promed"],
  },
  {
    id: "who-don",
    org: "WHO Disease Outbreak News",
    url: "https://www.who.int/feeds/entity/csr/don/en/rss.xml",
    defaultTags: ["who"],
  },
  {
    id: "ecdc-news",
    org: "ECDC",
    url: "https://www.ecdc.europa.eu/en/news-events/feed/all-news/feed",
    defaultTags: ["ecdc"],
  },
  {
    id: "africa-cdc",
    org: "Africa CDC",
    url: "https://africacdc.org/feed/",
    defaultTags: ["africa-cdc"],
  },
  {
    id: "google-news",
    org: "Google News",
    url: "https://news.google.com/rss/search?q=hantavirus&hl=en-US&gl=US&ceid=US:en",
    topical: true,
    defaultTags: ["news"],
  },
  {
    id: "google-news-cruise",
    org: "Google News",
    url: "https://news.google.com/rss/search?q=hantavirus+cruise+%22MV+Hondius%22&hl=en-US&gl=US&ceid=US:en",
    topical: true,
    defaultTags: ["cruise", "news"],
  },
];

/** Keyword regex for broad feeds. Word-bounded to avoid "hanta-yoga" type misses. */
export const HANTA_KEYWORDS = /\bhanta(?:virus)?\b|\bhantaan\b|\bandes virus\b|\bsin nombre\b|\bpuumala\b|\bseoul virus\b|\bdobrava\b|\bHFRS\b|\bHCPS\b|\bHPS\b/i;

/** Items mentioning these get pinned to the top of the feed. */
export const CLUSTER_KEYWORDS =
  /\bcruise\b|\bMV Hondius\b|\bHondius\b|\bSt\.? Helena\b|\bexpedition\b|\bship\b|\bpassenger/i;

/** Per-source request timeout. */
export const FETCH_TIMEOUT_MS = 6000;
