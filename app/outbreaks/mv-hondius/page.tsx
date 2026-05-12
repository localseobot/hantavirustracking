import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  HONDIUS_TIMELINE,
  HONDIUS_COUNTRIES,
  HONDIUS_FACTS,
} from "@/lib/data/outbreak-hondius";

export const metadata: Metadata = {
  title:
    "MV Hondius hantavirus cluster — live outbreak tracker · Hantavirus.Tracking",
  description:
    "Day-by-day tracker of the 2026 MV Hondius cruise-ship hantavirus outbreak. Confirmed cases, deaths, country breakdown, and authoritative response from WHO, CDC, ECDC, PAHO, and Africa CDC.",
  alternates: {
    canonical: "https://hantavirustracking.org/outbreaks/mv-hondius",
  },
  openGraph: {
    title: "MV Hondius hantavirus cluster — live outbreak tracker",
    description:
      "Day-by-day tracker of the 2026 MV Hondius cruise-ship hantavirus outbreak.",
    url: "https://hantavirustracking.org/outbreaks/mv-hondius",
    type: "article",
  },
};

const totalCases = HONDIUS_COUNTRIES.reduce((s, c) => s + c.cases, 0);
const totalDeaths = HONDIUS_COUNTRIES.reduce((s, c) => s + c.deaths, 0);

const SEV_COLOR: Record<NonNullable<typeof HONDIUS_TIMELINE[number]["severity"]>, string> = {
  info: "#60a5fa",
  alert: "#fbbf24",
  critical: "#ef4444",
};

export default function HondiusPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "MV Hondius hantavirus cluster — live outbreak tracker",
    datePublished: HONDIUS_TIMELINE[0].date,
    dateModified: HONDIUS_TIMELINE[HONDIUS_TIMELINE.length - 1].date,
    author: { "@type": "Organization", name: "hantavirustracking.org" },
    publisher: {
      "@type": "Organization",
      name: "hantavirustracking.org",
      url: "https://hantavirustracking.org",
    },
    about: {
      "@type": "MedicalCondition",
      name: "Hantavirus disease",
      code: {
        "@type": "MedicalCode",
        codingSystem: "ICD-10",
        codeValue: "A98.5",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-5xl px-4 md:px-6 pt-10 md:pt-14 pb-8">
          <div className="text-[11px] font-mono text-[#4a6080] mb-3">
            <Link href="/" className="hover:text-[#f0f4ff]">
              Home
            </Link>
            <span className="mx-2 text-[#2a3a55]">/</span>
            <span className="text-[#8ea4c8]">Outbreaks · MV Hondius</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#ef4444]/40 bg-[#ef4444]/10">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-[#ef4444] hanta-pulse"
                aria-hidden
              />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#fca5a5]">
                Active multi-country cluster
              </span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#8ea4c8]">
              WHO · CDC · ECDC · PAHO · Africa CDC tracking
            </span>
          </div>

          <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight text-[#f0f4ff]">
            MV Hondius hantavirus cluster.
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-[#8ea4c8] leading-relaxed">
            A multi-country hantavirus outbreak linked to the polar-expedition
            cruise ship <strong>MV Hondius</strong>, with confirmed cases now
            tracked across at least four countries. This page is a
            chronological, source-linked record of the outbreak as
            authoritative bulletins have appeared.
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Stat label="Confirmed + suspected" value={totalCases.toString()} accent="#fca5a5" />
            <Stat label="Deaths" value={totalDeaths.toString()} accent="#f87171" />
            <Stat
              label="Countries affected"
              value={HONDIUS_COUNTRIES.filter((c) => c.cases > 0).length.toString()}
              accent="#fbbf24"
            />
            <Stat
              label="Strain (suspected)"
              value="Andes-like"
              accent="#a78bfa"
              small
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 md:px-6 py-10 md:py-14 space-y-12">
        {/* Outbreak facts */}
        <section className="rounded-xl border border-white/[0.07] bg-[#0e1628]/60 p-5 md:p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fbbf24] mb-3">
            Voyage facts
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <Fact term="Vessel" value={HONDIUS_FACTS.vessel} />
            <Fact term="Type" value={HONDIUS_FACTS.vesselType} />
            <Fact
              term="Departed"
              value={`${HONDIUS_FACTS.departurePort} · ${HONDIUS_FACTS.departureDate}`}
            />
            <Fact
              term="Arrived"
              value={`${HONDIUS_FACTS.arrivalPort} · ${HONDIUS_FACTS.arrivalDate}`}
            />
            <Fact term="Aboard" value={HONDIUS_FACTS.passengersAboard} />
            <Fact term="Suspected strain" value={HONDIUS_FACTS.suspectedStrain} />
            <Fact
              term="Incubation period"
              value={HONDIUS_FACTS.incubationPeriod}
            />
          </dl>
        </section>

        {/* Country breakdown */}
        <section>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fca5a5] mb-2">
            Cluster country breakdown
          </div>
          <h2 className="font-syne text-2xl font-bold text-[#f0f4ff] mb-4">
            Where cluster cases have been reported
          </h2>
          <p className="text-sm text-[#8ea4c8] mb-4 max-w-3xl">
            These counts are passengers and crew of this single voyage — they
            are tracked separately from the global hantavirus surveillance
            dataset on the homepage globe (which counts autochthonous cases
            per country, including pre-outbreak Spain / UK figures).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HONDIUS_COUNTRIES.map((c) => (
              <div
                key={c.iso}
                className="rounded-lg border border-white/[0.07] bg-[#0e1628]/60 p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <Link
                    href={`/c/${c.iso.toLowerCase()}`}
                    className="font-semibold text-[#f0f4ff] hover:text-[#fca5a5]"
                  >
                    {c.name}
                  </Link>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-full border ${
                      c.status === "confirmed"
                        ? "bg-[#ef4444]/15 text-[#fca5a5] border-[#ef4444]/30"
                        : c.status === "suspected"
                          ? "bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/30"
                          : "bg-[#60a5fa]/15 text-[#93c5fd] border-[#60a5fa]/30"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="mt-2 flex gap-4 text-sm tabular-nums">
                  <span className="text-[#f0f4ff]">
                    <span className="text-[#8ea4c8] text-[11px] font-mono mr-1 uppercase tracking-[0.12em]">
                      Cases
                    </span>
                    {c.cases}
                  </span>
                  <span className="text-[#fca5a5]">
                    <span className="text-[#8ea4c8] text-[11px] font-mono mr-1 uppercase tracking-[0.12em]">
                      Deaths
                    </span>
                    {c.deaths}
                  </span>
                </div>
                {c.notes && (
                  <p className="mt-2 text-[12.5px] text-[#8ea4c8] leading-relaxed">
                    {c.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fbbf24] mb-2">
            Day-by-day timeline
          </div>
          <h2 className="font-syne text-2xl font-bold text-[#f0f4ff] mb-4">
            The cluster, in chronological order
          </h2>

          <ol className="relative border-l-2 border-white/[0.08] ml-2 space-y-6 pl-6">
            {HONDIUS_TIMELINE.map((ev, i) => {
              const sevColor = ev.severity
                ? SEV_COLOR[ev.severity]
                : "#60a5fa";
              return (
                <li key={i} className="relative">
                  <span
                    className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-2 border-[#080d1a]"
                    style={{
                      background: sevColor,
                      boxShadow: `0 0 12px ${sevColor}88`,
                    }}
                  />
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span
                      className="text-[10px] font-mono uppercase tracking-[0.16em]"
                      style={{ color: sevColor }}
                    >
                      {ev.date}
                    </span>
                    <span className="font-syne text-lg font-bold text-[#f0f4ff]">
                      {ev.label}
                    </span>
                    {ev.severity && (
                      <span
                        className="text-[9px] font-mono uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: `${sevColor}22`,
                          color: sevColor,
                          border: `1px solid ${sevColor}55`,
                        }}
                      >
                        {ev.severity}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[#cfd8e8] leading-relaxed max-w-3xl">
                    {ev.description}
                  </p>
                  <a
                    href={ev.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-[11px] font-mono text-[#8ea4c8] hover:text-[#c4b5fd] underline-offset-2 hover:underline"
                  >
                    {ev.source.org} ↗
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Live news pointer */}
        <section className="rounded-xl border border-[#34d399]/20 bg-[#34d399]/5 p-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#34d399] mb-2">
            Live updates
          </div>
          <h3 className="font-syne text-lg font-bold text-[#f0f4ff]">
            New developments are aggregated in real time
          </h3>
          <p className="mt-2 text-sm text-[#cfd8e8] max-w-3xl leading-relaxed">
            For items posted in the last few hours, see the{" "}
            <Link
              href="/#news"
              className="text-[#6ee7b7] hover:text-white underline-offset-2 hover:underline"
            >
              live news section on the homepage
            </Link>{" "}
            — it re-pulls from WHO, CDC, ECDC, PAHO, Africa CDC, and news
            media every 5 minutes. Items matching cruise-cluster keywords are
            pinned at the top of that feed.
          </p>
        </section>

        {/* About hantavirus quick primer */}
        <section className="rounded-xl border border-white/[0.07] bg-[#0e1628]/60 p-5 md:p-6">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#a78bfa] mb-2">
            Quick primer
          </div>
          <h3 className="font-syne text-lg font-bold text-[#f0f4ff] mb-2">
            What is Andes hantavirus?
          </h3>
          <p className="text-sm text-[#cfd8e8] leading-relaxed max-w-3xl">
            Andes virus is a New-World hantavirus circulating primarily in
            southern Argentina and Chile, where it is hosted by the
            long-tailed colilargo rat (<em>Oligoryzomys longicaudatus</em>). It
            is the only hantavirus with documented person-to-person
            transmission, which is what makes a cruise-ship cluster
            epidemiologically distinct from typical Sin Nombre-virus
            exposures in the United States. Case fatality of Andes
            hantavirus disease is approximately 25–40%. Initial symptoms are
            flu-like; rapid progression to Hantavirus Pulmonary Syndrome
            (HCPS) typically begins 4–10 days after onset.
          </p>
          <p className="text-sm text-[#8ea4c8] leading-relaxed mt-3 max-w-3xl">
            This is informational only. Clinical guidance should come from a
            licensed clinician or your local public-health authority.
          </p>
        </section>

        <p className="text-[11px] font-mono text-[#4a6080]">
          This page is updated as new authoritative bulletins are published.
          See <Link className="hover:text-[#f0f4ff]" href="/about">methodology</Link> for
          how each event is verified before listing.
        </p>
      </main>

      <Footer />
    </>
  );
}

function Stat({
  label,
  value,
  accent,
  small,
}: {
  label: string;
  value: string;
  accent: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0e1628]/80 p-4">
      <div
        className="text-[10px] font-mono uppercase tracking-[0.16em] font-semibold"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div
        className={`mt-1.5 font-syne font-bold tracking-tight text-[#f0f4ff] tabular-nums ${
          small ? "text-base md:text-lg" : "text-2xl md:text-3xl"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Fact({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8ea4c8]">
        {term}
      </dt>
      <dd className="text-[#f0f4ff] mt-0.5">{value}</dd>
    </div>
  );
}
