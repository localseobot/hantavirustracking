import { NEWS } from "@/lib/data/news";

function timeAgo(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const days = Math.round(
    (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default function NewsFeed() {
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
        <span className="text-[11px] text-[#4a6080] font-mono">
          {NEWS.length} items
        </span>
      </div>
      <ul className="space-y-3">
        {NEWS.map((n) => (
          <li
            key={n.id}
            className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-4 hover:border-[#ef4444]/30 transition"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#fbbf24]">
                {n.source}
              </span>
              <span className="text-[10px] font-mono text-[#4a6080]">
                {timeAgo(n.publishedAt)} · {n.publishedAt}
              </span>
            </div>
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block font-syne text-base font-semibold text-[#f0f4ff] hover:text-[#fca5a5] transition"
            >
              {n.title}
            </a>
            <p className="mt-1.5 text-sm text-[#8ea4c8] leading-relaxed">
              {n.summary}
            </p>
            {n.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {n.tags.map((t) => (
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
        ))}
      </ul>
    </div>
  );
}
