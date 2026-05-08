"use client";

import { useState } from "react";
import Globe from "@/components/Globe";
import CountryDetail from "@/components/CountryDetail";
import CountryTable from "@/components/CountryTable";
import TrendsChart from "@/components/TrendsChart";
import NewsFeed from "@/components/NewsFeed";
import Sources from "@/components/Sources";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Legend from "@/components/Legend";
import { COUNTRIES } from "@/lib/data/countries";
import type { CountryCase } from "@/lib/types";

export default function HomePage() {
  const [selected, setSelected] = useState<CountryCase | null>(null);

  return (
    <>
      <Header />
      <Hero />

      <main className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14 space-y-12">
        {/* Globe */}
        <section id="globe" className="scroll-mt-20">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fca5a5]">
                Interactive
              </div>
              <h2 className="font-syne text-2xl md:text-3xl font-bold text-[#f0f4ff]">
                Global outbreak map
              </h2>
            </div>
            <a
              href="/globe"
              className="hidden sm:inline text-xs font-semibold text-[#fca5a5] hover:text-[#f0f4ff] transition"
            >
              Open fullscreen ↗
            </a>
          </div>

          <div className="relative rounded-xl border border-white/[0.07] bg-[#0e1628]/60 overflow-hidden">
            <Globe
              countries={COUNTRIES}
              onCountryClick={setSelected}
              selectedIso={selected?.iso ?? null}
            />
            <CountryDetail
              country={selected}
              onClose={() => setSelected(null)}
            />
            <div className="absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)]">
              <Legend />
            </div>
          </div>
        </section>

        {/* Trends */}
        <section id="trends" className="scroll-mt-20">
          <TrendsChart />
        </section>

        {/* Country table */}
        <section id="countries" className="scroll-mt-20">
          <div className="mb-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fbbf24]">
              Country breakdown
            </div>
            <h2 className="font-syne text-2xl md:text-3xl font-bold text-[#f0f4ff]">
              Cases by country
            </h2>
          </div>
          <CountryTable
            countries={COUNTRIES}
            onSelect={(c) => {
              setSelected(c);
              document
                .getElementById("globe")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            selectedIso={selected?.iso ?? null}
          />
        </section>

        {/* Two-up: news + sources */}
        <section
          id="news"
          className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <NewsFeed />
          <div id="sources" className="scroll-mt-20">
            <Sources />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
