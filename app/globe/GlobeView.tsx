"use client";

import { useState } from "react";
import Link from "next/link";
import Globe from "@/components/Globe";
import CountryDetail from "@/components/CountryDetail";
import Legend from "@/components/Legend";
import LogoMark, { Wordmark } from "@/components/LogoMark";
import UpdateCountdown from "@/components/UpdateCountdown";
import { COUNTRIES, totals } from "@/lib/data/countries";
import type { CountryCase } from "@/lib/types";

export default function GlobeView() {
  const [selected, setSelected] = useState<CountryCase | null>(null);
  const t = totals();

  return (
    <div className="fixed inset-0 bg-[#080d1a] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3 md:p-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/[0.07] bg-[#0e1628]/80 backdrop-blur hover:border-[#ef4444]/30 transition"
          >
            <LogoMark size={22} />
            <Wordmark />
            <span className="text-[10px] font-mono text-[#4a6080] hidden md:inline">
              ← back
            </span>
          </Link>
          <UpdateCountdown
            variant="compact"
            hideSeconds
            className="hidden lg:inline-flex"
          />
        </div>

        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg border border-white/[0.07] bg-[#0e1628]/80 backdrop-blur">
          <Stat label="Cases" value={t.cases.toLocaleString()} accent="#fca5a5" />
          <Sep />
          <Stat label="Deaths" value={t.deaths.toLocaleString()} accent="#f87171" />
          <Sep />
          <Stat
            label="CFR"
            value={`${t.cfr.toFixed(1)}%`}
            accent="#fbbf24"
          />
          <Sep />
          <Stat
            label="Countries"
            value={t.countriesWithCases.toLocaleString()}
            accent="#60a5fa"
          />
        </div>
      </div>

      {/* Globe */}
      <div className="flex-1 relative">
        <Globe
          countries={COUNTRIES}
          onCountryClick={setSelected}
          selectedIso={selected?.iso ?? null}
          fill
        />
        <CountryDetail
          country={selected}
          onClose={() => setSelected(null)}
          position="bottom-right"
        />
        <div className="absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)]">
          <Legend />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col">
      <span
        className="text-[9px] font-mono uppercase tracking-[0.14em]"
        style={{ color: accent }}
      >
        {label}
      </span>
      <span className="font-syne text-sm font-bold text-[#f0f4ff] tabular-nums leading-tight">
        {value}
      </span>
    </div>
  );
}

function Sep() {
  return <span className="w-px h-6 bg-white/[0.08]" />;
}
