"use client";

import { useMemo, useState } from "react";
import {
  SEVERITY_COLOR,
  caseFatalityRate,
  severityFromCases,
  type CountryCase,
  type Region,
} from "@/lib/types";

type SortKey = "name" | "region" | "cases" | "deaths" | "cfr" | "lastUpdated";
type SortDir = "asc" | "desc";

interface Props {
  countries: CountryCase[];
  onSelect?: (country: CountryCase) => void;
  selectedIso?: string | null;
}

const REGIONS: (Region | "All")[] = [
  "All",
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
];

export default function CountryTable({
  countries,
  onSelect,
  selectedIso,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("cases");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [region, setRegion] = useState<Region | "All">("All");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const filtered = countries
      .filter((c) => (region === "All" ? true : c.region === region))
      .filter((c) =>
        query.trim() === ""
          ? true
          : c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.iso.toLowerCase().includes(query.toLowerCase())
      );

    const sorted = [...filtered].sort((a, b) => {
      let va: number | string;
      let vb: number | string;
      switch (sortKey) {
        case "name":
          va = a.name;
          vb = b.name;
          break;
        case "region":
          va = a.region;
          vb = b.region;
          break;
        case "cases":
          va = a.cases;
          vb = b.cases;
          break;
        case "deaths":
          va = a.deaths;
          vb = b.deaths;
          break;
        case "cfr":
          va = caseFatalityRate(a.cases, a.deaths);
          vb = caseFatalityRate(b.cases, b.deaths);
          break;
        case "lastUpdated":
          va = a.lastUpdated;
          vb = b.lastUpdated;
          break;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [countries, sortKey, sortDir, region, query]);

  function setSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "region" ? "asc" : "desc");
    }
  }

  function header(key: SortKey, label: string, align: "left" | "right" = "left") {
    const active = sortKey === key;
    return (
      <th
        className={`px-3 py-2 text-[10px] font-mono uppercase tracking-[0.14em] cursor-pointer select-none ${
          align === "right" ? "text-right" : "text-left"
        } ${active ? "text-[#fca5a5]" : "text-[#4a6080] hover:text-[#8ea4c8]"}`}
        onClick={() => setSort(key)}
      >
        {label}
        {active && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
      </th>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0e1628]/60 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 border-b border-white/[0.07]">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country…"
            className="w-full md:max-w-xs rounded-md border border-white/[0.07] bg-white/[0.04] px-3 py-2 text-sm text-[#f0f4ff] placeholder:text-[#4a6080] focus:outline-none focus:ring-2 focus:ring-[#ef4444]/50 focus:border-[#ef4444]/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                region === r
                  ? "bg-[#ef4444]/20 text-[#fca5a5] border border-[#ef4444]/30"
                  : "bg-white/[0.04] text-[#8ea4c8] border border-white/[0.07] hover:text-[#f0f4ff]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black/20">
            <tr>
              {header("name", "Country")}
              {header("region", "Region")}
              {header("cases", "Cases", "right")}
              {header("deaths", "Deaths", "right")}
              {header("cfr", "CFR", "right")}
              <th className="px-3 py-2 text-left text-[10px] font-mono uppercase tracking-[0.14em] text-[#4a6080]">
                Strain(s)
              </th>
              {header("lastUpdated", "Last update", "right")}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const cfr = caseFatalityRate(c.cases, c.deaths);
              const sev = severityFromCases(c.cases);
              const isSelected = selectedIso === c.iso;
              return (
                <tr
                  key={c.iso}
                  onClick={() => onSelect?.(c)}
                  className={`border-t border-white/[0.04] transition cursor-pointer ${
                    isSelected
                      ? "bg-[#ef4444]/10"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full"
                        style={{ background: SEVERITY_COLOR[sev] }}
                      />
                      <span className="font-semibold text-[#f0f4ff]">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-[#4a6080] font-mono">
                        {c.iso}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-[#8ea4c8]">{c.region}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-[#f0f4ff] font-semibold">
                    {c.cases.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-[#fca5a5]">
                    {c.deaths.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-[#fbbf24]">
                    {cfr.toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-[11px] text-[#8ea4c8]">
                    {c.strains.slice(0, 2).join(", ")}
                    {c.strains.length > 2 && (
                      <span className="text-[#4a6080]">
                        {" "}+{c.strains.length - 2}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right text-[11px] text-[#4a6080] font-mono">
                    {c.lastUpdated}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-sm text-[#4a6080]"
                >
                  No countries match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
