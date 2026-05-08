"use client";

import { caseFatalityRate, type CountryCase } from "@/lib/types";
import { source } from "@/lib/data/sources";

interface Props {
  country: CountryCase | null;
  onClose: () => void;
  /** Where to anchor the panel inside its `relative` parent. */
  position?: "top-right" | "bottom-right";
}

export default function CountryDetail({
  country,
  onClose,
  position = "top-right",
}: Props) {
  if (!country) return null;
  const cfr = caseFatalityRate(country.cases, country.deaths);
  const anchor =
    position === "bottom-right"
      ? "bottom-4 right-4"
      : "top-20 right-4 md:top-4";

  return (
    <div
      className={`absolute ${anchor} z-20 w-80 max-w-[90vw] rounded-xl border border-[#ef4444]/30 bg-[#0e1628]/95 backdrop-blur p-5 shadow-2xl`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#fca5a5]">
            {country.region} · {country.reportingYear}
          </div>
          <h3 className="font-syne text-xl font-bold text-[#f0f4ff] mt-0.5">
            {country.name}
          </h3>
          <span className="text-[10px] font-mono text-[#4a6080]">
            {country.iso}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#4a6080] hover:text-[#f0f4ff] transition"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-md bg-white/[0.03] p-2.5">
          <div className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#8ea4c8]">
            Cases
          </div>
          <div className="font-syne text-lg font-bold text-[#f0f4ff] tabular-nums mt-0.5">
            {country.cases.toLocaleString()}
          </div>
        </div>
        <div className="rounded-md bg-white/[0.03] p-2.5">
          <div className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#8ea4c8]">
            Deaths
          </div>
          <div className="font-syne text-lg font-bold text-[#fca5a5] tabular-nums mt-0.5">
            {country.deaths.toLocaleString()}
          </div>
        </div>
        <div className="rounded-md bg-white/[0.03] p-2.5">
          <div className="text-[9px] font-mono uppercase tracking-[0.12em] text-[#8ea4c8]">
            CFR
          </div>
          <div className="font-syne text-lg font-bold text-[#fbbf24] tabular-nums mt-0.5">
            {cfr.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8ea4c8] mb-1.5">
          Circulating strains
        </div>
        <div className="flex flex-wrap gap-1.5">
          {country.strains.map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 rounded-full text-[11px] bg-[#ef4444]/10 text-[#fca5a5] border border-[#ef4444]/20"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {country.notes && (
        <p className="mt-4 text-xs text-[#8ea4c8] leading-relaxed">
          {country.notes}
        </p>
      )}

      <div className="mt-4">
        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8ea4c8] mb-1.5">
          Sources
        </div>
        <ul className="space-y-1">
          {country.sourceIds.map((id) => {
            const s = source(id);
            if (!s) return null;
            return (
              <li key={id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#c4b5fd] hover:text-[#f0f4ff] underline-offset-2 hover:underline"
                >
                  {s.org} — {s.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 text-[10px] font-mono text-[#4a6080] border-t border-white/[0.05] pt-3">
        Last updated {country.lastUpdated}
      </div>
    </div>
  );
}
