import { XMLParser } from "fast-xml-parser";
import { NEWS } from "@/lib/data/news";
import type { NewsItem } from "@/lib/types";
import {
  CLUSTER_KEYWORDS,
  FETCH_TIMEOUT_MS,
  HANTA_KEYWORDS,
  NEWS_SOURCES,
  type NewsSource,
} from "@/lib/news-sources";

// Cache the route response for 5 minutes (Vercel ISR / Next route-segment cache).
// The inner fetches run only when this segment revalidates.
export const revalidate = 300;

interface RawItem {
  title?: string | { "#text"?: string };
  link?: string | { "@_href"?: string; "#text"?: string };
  guid?: string | { "#text"?: string };
  id?: string;
  description?: string;
  summary?: string;
  pubDate?: string;
  published?: string;
  "dc:date"?: string;
  updated?: string;
  category?: string | string[];
}

interface RawFeed {
  rss?: { channel?: { item?: RawItem | RawItem[] } };
  feed?: { entry?: RawItem | RawItem[] };
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
});

function asString(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v && "#text" in v) {
    return String((v as { "#text"?: unknown })["#text"] ?? "");
  }
  return String(v);
}

function asLink(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    // Atom often emits multiple <link>s; prefer rel=alternate.
    for (const x of v) {
      const r = asLink(x);
      if (r) return r;
    }
    return "";
  }
  if (typeof v === "object" && v) {
    const o = v as Record<string, unknown>;
    return asString(o["@_href"] ?? o["#text"] ?? "");
  }
  return "";
}

function stripHtml(s: string): string {
  return s
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function parseDate(s: string): string {
  if (!s) return new Date().toISOString();
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString();
  return new Date().toISOString();
}

function clipSummary(s: string, max = 280): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

async function fetchFeed(source: NewsSource): Promise<NewsItem[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(source.url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "hantavirustracking.org news ingest (https://hantavirustracking.org)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      },
      // Cache each upstream feed alongside our route segment.
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const doc = parser.parse(xml) as RawFeed;
    const rawItems: RawItem[] =
      (Array.isArray(doc?.rss?.channel?.item)
        ? (doc.rss!.channel!.item as RawItem[])
        : doc?.rss?.channel?.item
          ? [doc.rss.channel.item as RawItem]
          : Array.isArray(doc?.feed?.entry)
            ? (doc.feed!.entry as RawItem[])
            : doc?.feed?.entry
              ? [doc.feed.entry as RawItem]
              : []) ?? [];

    const items: NewsItem[] = [];
    for (const r of rawItems) {
      const title = stripHtml(asString(r.title));
      const link = asLink(r.link);
      const summaryRaw =
        asString(r.description) || asString(r.summary) || "";
      const summary = clipSummary(stripHtml(summaryRaw));
      const dateStr =
        asString(r.pubDate) ||
        asString(r.published) ||
        asString(r.updated) ||
        asString(r["dc:date"]);
      const haystack = `${title} ${summaryRaw}`;
      if (!source.topical && !HANTA_KEYWORDS.test(haystack)) continue;
      if (!title || !link) continue;
      const cluster = CLUSTER_KEYWORDS.test(haystack);
      const id =
        asString(r.guid) ||
        asString(r.id) ||
        `${source.id}-${link}`;
      const tags = [...(source.defaultTags ?? [])];
      if (cluster && !tags.includes("cruise")) tags.push("cruise");
      items.push({
        id: `${source.id}::${id}`,
        publishedAt: parseDate(dateStr),
        source: source.org,
        title,
        url: link,
        summary,
        tags,
        cluster,
        origin: "live",
      });
    }
    return items;
  } catch {
    // One bad source shouldn't kill the whole feed.
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function dedupe(items: NewsItem[]): NewsItem[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const out: NewsItem[] = [];
  // Items already sorted desc by date; keep the first occurrence (= newest).
  for (const item of items) {
    const url = item.url.split("?")[0].replace(/\/$/, "").toLowerCase();
    const titleKey = item.title.toLowerCase().slice(0, 80);
    if (seenUrls.has(url) || seenTitles.has(titleKey)) continue;
    seenUrls.add(url);
    seenTitles.add(titleKey);
    out.push(item);
  }
  return out;
}

export async function GET() {
  const live = (
    await Promise.all(NEWS_SOURCES.map((s) => fetchFeed(s)))
  ).flat();

  const seed: NewsItem[] = NEW_SEED();
  const merged = [...live, ...seed].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const unique = dedupe(merged);

  // Cluster items first, then chronological.
  const cluster = unique.filter((i) => i.cluster);
  const rest = unique.filter((i) => !i.cluster);
  const ordered = [...cluster, ...rest].slice(0, 30);

  return Response.json({
    items: ordered,
    counts: {
      live: live.length,
      seed: seed.length,
      shown: ordered.length,
      cluster: cluster.length,
    },
    sources: NEWS_SOURCES.map((s) => ({ id: s.id, org: s.org })),
    fetchedAt: new Date().toISOString(),
  });
}

function NEW_SEED(): NewsItem[] {
  return NEWS.map((n) => ({ ...n, origin: "seed", cluster: CLUSTER_KEYWORDS.test(`${n.title} ${n.summary}`) }));
}
