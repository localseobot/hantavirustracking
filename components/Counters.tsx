"use client";

import { useEffect, useState } from "react";
import { totals } from "@/lib/data/countries";

interface StatProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

function Stat({ label, value, sub, accent = "#ef4444" }: StatProps) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0e1628]/80 p-5 backdrop-blur">
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ea4c8] font-mono"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="mt-2 font-syne text-3xl md:text-4xl font-bold tracking-tight text-[#f0f4ff] tabular-nums">
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-[#4a6080]">{sub}</div>}
    </div>
  );
}

export default function Counters() {
  const t = totals();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <Stat
        label="Total reported cases"
        value={t.cases.toLocaleString()}
        sub="Compiled from latest ministry/agency bulletins"
      />
      <Stat
        label="Total deaths"
        value={t.deaths.toLocaleString()}
        sub="Confirmed fatalities"
        accent="#f87171"
      />
      <Stat
        label="Countries reporting"
        value={t.countriesWithCases.toLocaleString()}
        sub="With ≥1 confirmed case in tracked period"
        accent="#fbbf24"
      />
      <Stat
        label="Case fatality rate"
        value={`${t.cfr.toFixed(2)}%`}
        sub={`Snapshot ${now.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}`}
        accent="#fb923c"
      />
    </div>
  );
}
