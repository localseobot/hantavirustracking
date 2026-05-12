import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SOURCES } from "@/lib/data/sources";

export const metadata: Metadata = {
  title: "About & methodology — Hantavirus.Tracking",
  description:
    "How hantavirustracking.org compiles its data: source list, refresh cadence, daily review workflow, and editorial policy. An independent dashboard aggregating publicly accessible surveillance data.",
  alternates: { canonical: "https://hantavirustracking.org/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-3xl px-4 md:px-6 pt-10 md:pt-14 pb-8">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fca5a5] mb-2">
            About this dashboard
          </div>
          <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight text-[#f0f4ff]">
            How we compile the data.
          </h1>
          <p className="mt-4 text-lg text-[#8ea4c8] leading-relaxed">
            hantavirustracking.org is an independent dashboard that aggregates
            publicly accessible hantavirus surveillance data into a single
            interactive view. We are not a government agency and are not
            affiliated with any public-health authority. This page documents
            exactly where every number comes from and how it gets here.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 md:px-6 py-10 md:py-14 space-y-10 text-[#cfd8e8] leading-relaxed">
        <section>
          <h2 className="font-syne text-2xl font-bold text-[#f0f4ff] mb-3">
            Data sources
          </h2>
          <p className="text-[15px]">
            The country-level case and fatality figures on the homepage globe
            and country pages are compiled from the following primary
            authorities. Every figure is hand-reviewed against the original
            bulletin before publication.
          </p>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
            {SOURCES.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border border-white/[0.07] bg-[#0e1628]/60 p-3"
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
                  className="mt-1 block text-sm font-semibold text-[#f0f4ff] hover:text-[#c4b5fd]"
                >
                  {s.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-syne text-2xl font-bold text-[#f0f4ff] mb-3">
            Refresh cadence
          </h2>
          <p className="text-[15px]">
            The country dataset has a <strong>daily target refresh at 12:00
            UTC</strong>. A GitHub Action runs 30 minutes before that window,
            scans the last 24 hours of outbreak signal from WHO, CDC, ECDC,
            PAHO, Africa CDC, and major news media, and posts a review
            digest as a pull request. A maintainer reads the digest, updates
            any country numbers that moved, and merges — which triggers an
            automatic deploy. If nothing moved, the PR is closed and the
            site stands on yesterday's review.
          </p>
          <p className="mt-3 text-[15px]">
            The <Link href="/" className="text-[#fca5a5] hover:text-white">live
            news feed</Link> on the homepage is independent of the country
            refresh — it pulls fresh RSS items every 5 minutes from the
            same authorities.
          </p>
        </section>

        <section>
          <h2 className="font-syne text-2xl font-bold text-[#f0f4ff] mb-3">
            Methodology
          </h2>
          <ul className="space-y-3 text-[15px] list-disc pl-5">
            <li>
              <strong className="text-[#f0f4ff]">Reporting period.</strong>{" "}
              Each country row carries a <code>reportingYear</code> field
              indicating the most recent complete year reflected in the
              numbers. Where a 2026 bulletin has been published mid-year, we
              use the latest year-to-date totals and note this on the row.
            </li>
            <li>
              <strong className="text-[#f0f4ff]">Estimates vs.
              confirmed.</strong> Numbers are confirmed cases as reported by
              the primary authority. Where an authority publishes only a
              range, we use the midpoint and flag this in the country
              detail. WHO baseline estimates for the global annual burden
              are 10,000 – 100,000 cases.
            </li>
            <li>
              <strong className="text-[#f0f4ff]">Case-fatality rate.</strong>{" "}
              CFR is computed at row level as <code>deaths / cases × 100</code>.
              Aggregate totals on the hero are unweighted sums; the
              displayed CFR is the global aggregate, not a population-
              weighted average.
            </li>
            <li>
              <strong className="text-[#f0f4ff]">Strains.</strong> Strain
              attribution comes from the WHO Hantavirus Fact Sheet and ECDC
              annual epidemiological reports. Listed strains are those
              documented to circulate, not necessarily those implicated in
              the reporting-year cases.
            </li>
            <li>
              <strong className="text-[#f0f4ff]">News feed
              classification.</strong> RSS items are classified as
              "official" (WHO, CDC, ECDC, PAHO, Africa CDC) or "media"
              (Google News aggregator). Items mentioning the active
              cruise-ship cluster (MV Hondius / cruise / Saint Helena /
              expedition / passenger keywords) are pinned at the top of the
              feed.
            </li>
            <li>
              <strong className="text-[#f0f4ff]">Corrections.</strong> If you
              spot an error, open an issue or pull request on{" "}
              <a
                href="https://github.com/localseobot/hantavirustracking"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#a78bfa] hover:text-white"
              >
                the public repository
              </a>{" "}
              and include the source URL that contradicts our figure. All
              data files are plain TypeScript and trivially editable.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-syne text-2xl font-bold text-[#f0f4ff] mb-3">
            What this site is not
          </h2>
          <ul className="space-y-2 text-[15px] list-disc pl-5">
            <li>Not a government agency or public-health authority.</li>
            <li>Not affiliated with WHO, CDC, ECDC, PAHO, Africa CDC, or any other agency mentioned on the site.</li>
            <li>Not medical advice. If you have a possible hantavirus exposure, contact a clinician or emergency department directly.</li>
            <li>Not a clinical decision-support tool.</li>
            <li>Not a real-time API for case-count automation — fetch the primary sources for that.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-[#fbbf24]/25 bg-[#fbbf24]/5 p-5">
          <h2 className="font-syne text-lg font-bold text-[#fde68a] mb-2">
            License & reuse
          </h2>
          <p className="text-sm text-[#e8d9b3]">
            Original code in this site is released under the MIT license. Data
            attributions remain with their respective authorities — see the
            source list above. Citing this dashboard is encouraged; please
            include a link to the relevant primary source alongside.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
