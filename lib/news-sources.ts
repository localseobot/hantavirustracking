/**
 * RSS / Atom feeds we ingest for the live news section.
 *
 * Each URL in this list has been live-probed (200 + RSS/Atom content-type).
 * Each source is fetched in parallel, parsed, then filtered with the
 * shared `HANTA_KEYWORDS` regex so generic feeds (newsroom, threat
 * reports, Google News) only surface hantavirus-relevant posts.
 *
 * Notes on what's NOT here:
 *  - WHO Disease Outbreak News:  the historical feeds at
 *    www.who.int/feeds/entity/csr/don/* return 404 — WHO deprecated
 *    that endpoint. The general WHO News feed (used below) catches
 *    DON-class items in practice.
 *  - CDC Health Alert Network (HAN):  no public RSS exposed; alerts
 *    require email subscription. Captured indirectly via the CDC
 *    Newsroom feed and Google News.
 *  - CDC Travel Health Notices:  no public RSS; the HTML page exists
 *    but the older notices.xml URL is gone. Same indirect coverage.
 *  - ProMED-mail:  the legacy /promed-post-feed/ URL returns 404 in
 *    2026; ProMED's RSS appears to be subscriber-gated now. Add a
 *    paid feed key here if you have one.
 */

export interface NewsSource {
  id: string;
  org: string;
  /** Public RSS / Atom URL — must be live-probed before adding. */
  url: string;
  /** Set true for narrow feeds that are already topical (skip keyword filtering). */
  topical?: boolean;
  /** Tags to attach to every item from this source. */
  defaultTags?: string[];
  /**
   * Source tier:
   *   - "official"  WHO / CDC / ECDC / PAHO / Africa CDC — primary authority
   *   - "media"     news aggregators
   * Drives the "GOV" badge and the section split in the UI.
   */
  tier: "official" | "media";
}

export const NEWS_SOURCES: NewsSource[] = [
  // ── Official: WHO ─────────────────────────────────────────────────────────
  {
    id: "who-news",
    org: "WHO News",
    url: "https://www.who.int/rss-feeds/news-english.xml",
    defaultTags: ["who"],
    tier: "official",
  },

  // ── Official: U.S. CDC ────────────────────────────────────────────────────
  // CDC Newsroom — the CDC Tools v2 RSS endpoint. Carries press releases,
  // outbreak statements, and director briefings. The active hantavirus
  // cluster's "Statement on the M/V Hondius Cruise Ship" lives here.
  {
    id: "cdc-newsroom",
    org: "U.S. CDC Newsroom",
    url: "https://tools.cdc.gov/api/v2/resources/media/132608.rss",
    defaultTags: ["cdc"],
    tier: "official",
  },

  // ── Official: ECDC ────────────────────────────────────────────────────────
  // Only the news feed is wired in — the ECDC Threat Report / RRA / Epi
  // sub-feeds are titled by week/disease, so a hantavirus keyword filter
  // misses them while a permissive filter floods the feed with unrelated
  // bulletins. ECDC's own news feed picks up press releases announcing
  // each new RRA or CDTR, which is enough.
  {
    id: "ecdc-news",
    org: "ECDC News",
    url: "https://www.ecdc.europa.eu/en/taxonomy/term/1307/feed",
    defaultTags: ["ecdc"],
    tier: "official",
  },

  // ── Official: regional ────────────────────────────────────────────────────
  // Africa CDC's WordPress feed (https://africacdc.org/feed/) returns
  // only the channel header with no <item> entries as of May 2026 — kept
  // out of rotation until they republish actual posts.
  {
    id: "paho-news",
    org: "PAHO",
    url: "https://www.paho.org/en/rss.xml",
    defaultTags: ["paho"],
    tier: "official",
  },

  // ── Media ─────────────────────────────────────────────────────────────────
  {
    id: "google-news",
    org: "Google News",
    url: "https://news.google.com/rss/search?q=hantavirus&hl=en-US&gl=US&ceid=US:en",
    topical: true,
    defaultTags: ["news"],
    tier: "media",
  },
  {
    id: "google-news-cruise",
    org: "Google News",
    url: "https://news.google.com/rss/search?q=hantavirus+cruise+%22MV+Hondius%22&hl=en-US&gl=US&ceid=US:en",
    topical: true,
    defaultTags: ["cruise", "news"],
    tier: "media",
  },
];

/**
 * Keyword regex for broad feeds. Includes:
 *  - Generic hantavirus terms + strain names + clinical syndrome codes.
 *  - Outbreak-specific identifiers (MV Hondius) so authority statements
 *    that name the ship without spelling "hantavirus" aren't dropped.
 *    Add a new outbreak's identifier here when a fresh cluster emerges.
 */
export const HANTA_KEYWORDS =
  /\bhanta(?:virus)?\b|\bhantaan\b|\bandes virus\b|\bsin nombre\b|\bpuumala\b|\bseoul virus\b|\bdobrava\b|\bHFRS\b|\bHCPS\b|\bHPS\b|\bMV Hondius\b|\bM\/V Hondius\b|\bHondius\b/i;

/** Items mentioning these get pinned to the top of the feed. */
export const CLUSTER_KEYWORDS =
  /\bcruise\b|\bMV Hondius\b|\bM\/V Hondius\b|\bHondius\b|\bSt\.? Helena\b|\bexpedition\b|\bship\b|\bpassenger/i;

/** Per-source request timeout. */
export const FETCH_TIMEOUT_MS = 6000;
