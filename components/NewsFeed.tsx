"use client";

import { useEffect, useState } from "react";
import { NEWS } from "@/lib/data/news";
import type { NewsItem } from "@/lib/types";

function timeAgo(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return days === 1 ? "1 day ago" : `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

interface NewsResponse {
  items: NewsItem[];
  counts: {
    live: number;
    seed: number;
    shown: number;
    cluster: number;
    official?: number;
  };
  fetchedAt: string;
}

export default function NewsFeed() {
  const [items, setItems] = useState<NewsItem[]>(NEWS);
  const [counts, setCounts] = useState<NewsResponse["counts"] | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as NewsResponse;
        if (cancelled) return;
        if (data.items?.length) {
          setItems(data.items);
          setCounts(data.counts);
          setFetchedAt(data.fetchedAt);
        }
        setError(null);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    // Re-pull every 5 min on the client too.
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const cluster = items.filter((i) => i.cluster);
  const official = items.filter((i) => !i.cluster && i.tier === "official");
  const media = items.filter((i) => !i.cluster && i.tier !== "official");

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0e1628]/60 p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#34d399]">
            Live updates
          </div>
          <h3 className="font-syne text-xl font-bold text-[#f0f4ff] mt-0.5">
            Recent surveillance reports
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-[#4a6080]">
            {loading
              ? "loading…"
              : `${items.length} items${
                  counts ? ` · ${counts.live} live` : ""
                }`}
          </div>
          {fetchedAt && (
            <div
              className="text-[10px] font-mono text-[#4a6080] mt-0.5"
              suppressHydrationWarning
              title={new Date(fetchedAt).toLocaleString()}
            >
              fetched {timeAgo(fetchedAt)}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-md border border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[11px] text-[#fbbf24] font-mono">
          Live feed offline — showing seeded items. ({error})
        </div>
      )}

      {cluster.length > 0 && (
        <Section
          dotClass="bg-[#ef4444] hanta-pulse"
          labelClass="text-[#fca5a5]"
          label={`Active multi-country cluster · ${cluster.length} ${
            cluster.length === 1 ? "alert" : "alerts"
          }`}
        >
          {cluster.map((n) => (
            <NewsCard key={n.id} item={n} highlight />
          ))}
        </Section>
      )}

      {official.length > 0 && (
        <Section
          dotClass="bg-[#a78bfa]"
          labelClass="text-[#c4b5fd]"
          label={`Official advisories · ${official.length}`}
        >
          {official.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </Section>
      )}

      {media.length > 0 && (
        <Section
          dotClass="bg-[#34d399]"
          labelClass="text-[#6ee7b7]"
          label={`News media · ${media.length}`}
        >
          {media.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  label,
  dotClass,
  labelClass,
  children,
}: {
  label: string;
  dotClass: string;
  labelClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`} />
        <span
          className={`text-[10px] font-mono uppercase tracking-[0.16em] ${labelClass}`}
        >
          {label}
        </span>
      </div>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function NewsCard({ item, highlight }: { item: NewsItem; highlight?: boolean }) {
  const isLive = item.origin === "live";
  const isOfficial = item.tier === "official";
  return (
    <li
      className={`rounded-lg p-4 transition ${
        highlight
          ? "border border-[#ef4444]/40 bg-[#ef4444]/[0.06] hover:border-[#ef4444]/60"
          : isOfficial
            ? "border border-[#a78bfa]/25 bg-white/[0.02] hover:border-[#a78bfa]/45"
            : "border border-white/[0.05] bg-white/[0.02] hover:border-[#34d399]/30"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-mono uppercase tracking-[0.14em] ${
              highlight
                ? "text-[#fca5a5]"
                : isOfficial
                  ? "text-[#c4b5fd]"
                  : "text-[#fbbf24]"
            }`}
          >
            {item.source}
          </span>
          {isOfficial && (
            <span
              className="text-[9px] font-mono uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-full bg-[#a78bfa]/15 text-[#c4b5fd] border border-[#a78bfa]/30"
              title="Issued by a public-health authority (WHO / CDC / ECDC / PAHO / Africa CDC / ProMED)"
            >
              GOV
            </span>
          )}
          {isLive && (
            <span
              className="text-[9px] font-mono uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-full bg-[#34d399]/15 text-[#6ee7b7] border border-[#34d399]/30"
              title="Pulled from a live RSS feed within the last 5 minutes"
            >
              LIVE
            </span>
          )}
        </div>
        <span
          className="text-[10px] font-mono text-[#4a6080]"
          suppressHydrationWarning
          title={new Date(item.publishedAt).toLocaleString()}
        >
          {timeAgo(item.publishedAt)}
        </span>
      </div>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-1 block font-syne text-base font-semibold transition ${
          highlight
            ? "text-[#fecaca] hover:text-[#fee2e2]"
            : "text-[#f0f4ff] hover:text-[#fca5a5]"
        }`}
      >
        {item.title}
      </a>
      {item.summary && (
        <p className="mt-1.5 text-sm text-[#8ea4c8] leading-relaxed">
          {item.summary}
        </p>
      )}
      {item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] text-[#8ea4c8] border border-white/[0.05]"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
