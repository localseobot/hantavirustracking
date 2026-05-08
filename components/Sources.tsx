import { SOURCES } from "@/lib/data/sources";

export default function Sources() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0e1628]/60 p-5">
      <div className="mb-4">
        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#a78bfa]">
          Data provenance
        </div>
        <h3 className="font-syne text-xl font-bold text-[#f0f4ff] mt-0.5">
          Sources & methodology
        </h3>
      </div>

      <p className="text-sm leading-relaxed text-[#8ea4c8] mb-4">
        Country-level case and fatality figures are compiled from official
        public-health authorities and peer-reviewed surveillance bulletins.
        Where an authority publishes only a range, the midpoint is used and
        flagged in the country detail. WHO baseline estimates put the global
        annual hantavirus burden at{" "}
        <span className="text-[#fca5a5] font-semibold">
          10,000 – 100,000 cases
        </span>{" "}
        — most in East Asia and northern Europe — with case fatality of{" "}
        <span className="text-[#fbbf24] font-semibold">&lt;1–15%</span> in
        Eurasia and{" "}
        <span className="text-[#f87171] font-semibold">up to 50%</span> for
        New-World hantaviruses in the Americas.
      </p>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {SOURCES.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-white/[0.05] bg-white/[0.02] p-3 hover:border-[#a78bfa]/30 transition"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#a78bfa]">
                {s.org}
              </span>
              <span className="text-[10px] font-mono text-[#4a6080]">
                checked {s.lastChecked}
              </span>
            </div>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm font-semibold text-[#f0f4ff] hover:text-[#c4b5fd] transition"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[11px] text-[#4a6080] leading-relaxed">
        This dashboard is informational and does not constitute medical advice.
        For clinical or operational use, consult the underlying ministry of
        health bulletins linked above.
      </p>
    </div>
  );
}
