import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { COUNTRIES } from "@/lib/data/countries";
import { source } from "@/lib/data/sources";
import {
  SEVERITY_COLOR,
  SEVERITY_LABEL,
  caseFatalityRate,
  severityFromCases,
  type CountryCase,
} from "@/lib/types";

interface PageProps {
  params: Promise<{ iso: string }>;
}

function findCountry(iso: string): CountryCase | undefined {
  const upper = iso.toUpperCase();
  return COUNTRIES.find((c) => c.iso === upper);
}

export async function generateStaticParams() {
  return COUNTRIES.map((c) => ({ iso: c.iso.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { iso } = await params;
  const c = findCountry(iso);
  if (!c) return { title: "Country not found — Hantavirus.Tracking" };
  const cfr = caseFatalityRate(c.cases, c.deaths).toFixed(1);
  return {
    title: `Hantavirus in ${c.name} — cases, deaths, CFR · Hantavirus.Tracking`,
    description: `${c.name} hantavirus surveillance: ${c.cases.toLocaleString()} confirmed cases and ${c.deaths.toLocaleString()} deaths reported for ${c.reportingYear} (CFR ${cfr}%). Strains in circulation: ${c.strains.join(", ") || "none reported"}.`,
    alternates: {
      canonical: `https://hantavirustracking.org/c/${c.iso.toLowerCase()}`,
    },
    openGraph: {
      title: `Hantavirus in ${c.name}`,
      description: `${c.cases.toLocaleString()} cases · ${c.deaths.toLocaleString()} deaths · CFR ${cfr}%`,
      url: `https://hantavirustracking.org/c/${c.iso.toLowerCase()}`,
      type: "article",
    },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { iso } = await params;
  const c = findCountry(iso);
  if (!c) notFound();

  const cfr = caseFatalityRate(c.cases, c.deaths);
  const sev = severityFromCases(c.cases);
  const sevColor = SEVERITY_COLOR[sev];

  // Related countries (same region, excluding this one, ordered by cases).
  const related = COUNTRIES.filter(
    (x) => x.region === c.region && x.iso !== c.iso
  )
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 6);

  // JSON-LD structured data for richer Google results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: `Hantavirus disease in ${c.name}`,
    associatedAnatomy: { "@type": "AnatomicalSystem", name: "Respiratory and renal systems" },
    epidemiology: `${c.cases.toLocaleString()} reported cases and ${c.deaths.toLocaleString()} deaths in ${c.reportingYear} (CFR ${cfr.toFixed(1)}%).`,
    cause: c.strains.length > 0
      ? `Hantavirus strains circulating: ${c.strains.join(", ")}.`
      : "No autochthonous hantavirus strains documented.",
    code: { "@type": "MedicalCode", codingSystem: "ICD-10", codeValue: "A98.5" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <section className="border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 pt-10 md:pt-14 pb-8">
          <div className="text-[11px] font-mono text-[#4a6080] mb-3">
            <Link href="/" className="hover:text-[#f0f4ff]">Home</Link>
            <span className="mx-2 text-[#2a3a55]">/</span>
            <Link href="/#countries" className="hover:text-[#f0f4ff]">
              Countries
            </Link>
            <span className="mx-2 text-[#2a3a55]">/</span>
            <span className="text-[#8ea4c8]">{c.name}</span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: sevColor, boxShadow: `0 0 10px ${sevColor}77` }}
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fca5a5]">
              {c.region} · {c.iso} · reporting year {c.reportingYear}
            </span>
          </div>
          <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight text-[#f0f4ff]">
            Hantavirus in {c.name}
          </h1>
          <p className="mt-3 max-w-3xl text-[#8ea4c8] leading-relaxed">
            {c.cases > 0
              ? `${c.cases.toLocaleString()} confirmed hantavirus case${c.cases === 1 ? "" : "s"} and ${c.deaths.toLocaleString()} death${c.deaths === 1 ? "" : "s"} reported in ${c.reportingYear}, for a case-fatality rate of ${cfr.toFixed(1)}%.`
              : `No autochthonous hantavirus cases reported in ${c.reportingYear}.`}
            {" "}{c.notes}
          </p>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Stat label="Confirmed cases" value={c.cases.toLocaleString()} accent="#ef4444" />
            <Stat label="Deaths" value={c.deaths.toLocaleString()} accent="#f87171" />
            <Stat label="Case fatality rate" value={`${cfr.toFixed(1)}%`} accent="#fbbf24" />
            <Stat
              label="Severity band"
              value={SEVERITY_LABEL[sev]}
              accent={sevColor}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14 space-y-10">
        {c.strains.length > 0 && (
          <section>
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fca5a5] mb-2">
              Circulating strains
            </div>
            <div className="flex flex-wrap gap-2">
              {c.strains.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full text-sm bg-[#ef4444]/10 text-[#fca5a5] border border-[#ef4444]/30 font-mono"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-[#8ea4c8] max-w-3xl leading-relaxed">
              Each strain has distinct reservoir hosts, transmission dynamics,
              and clinical severity. See WHO and CDC primary sources below for
              specifics; clinical guidance must come from a licensed clinician,
              not this page.
            </p>
          </section>
        )}

        <section>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#a78bfa] mb-2">
            Cited sources
          </div>
          <h2 className="font-syne text-xl font-bold text-[#f0f4ff] mb-3">
            Where these numbers come from
          </h2>
          <ul className="space-y-2 max-w-3xl">
            {c.sourceIds.map((id) => {
              const s = source(id);
              if (!s) return null;
              return (
                <li key={id} className="rounded-lg border border-white/[0.07] bg-[#0e1628]/60 p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#c4b5fd]">
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
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-[#4a6080] max-w-3xl">
            Last updated <strong>{c.lastUpdated}</strong>. Reviewed daily by the
            automated{" "}
            <Link href="/about" className="text-[#a78bfa] hover:text-[#f0f4ff]">
              data-check workflow
            </Link>
            .
          </p>
        </section>

        {related.length > 0 && (
          <section>
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fbbf24] mb-2">
              In the same region
            </div>
            <h2 className="font-syne text-xl font-bold text-[#f0f4ff] mb-3">
              Other {c.region} countries
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {related.map((r) => {
                const rSev = severityFromCases(r.cases);
                return (
                  <Link
                    key={r.iso}
                    href={`/c/${r.iso.toLowerCase()}`}
                    className="rounded-lg border border-white/[0.07] bg-[#0e1628]/60 p-3 hover:border-[#ef4444]/30 transition group"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: SEVERITY_COLOR[rSev] }}
                      />
                      <span className="font-semibold text-[#f0f4ff] group-hover:text-[#fca5a5]">
                        {r.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#4a6080] ml-auto">
                        {r.iso}
                      </span>
                    </div>
                    <div className="mt-1.5 text-xs text-[#8ea4c8] tabular-nums">
                      {r.cases.toLocaleString()} cases · {r.deaths.toLocaleString()} deaths
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="rounded-xl border border-[#fbbf24]/25 bg-[#fbbf24]/5 p-5">
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fbbf24] mb-2">
            Clinical note
          </div>
          <p className="text-sm text-[#e8d9b3] leading-relaxed max-w-3xl">
            Hantavirus disease presents as either Hantavirus Pulmonary Syndrome
            (HCPS / HPS — Americas, often severe) or Hemorrhagic Fever with
            Renal Syndrome (HFRS — Eurasia). Early symptoms are flu-like and
            indistinguishable from many other viral illnesses. This page is
            informational only. If you have a possible exposure and are
            symptomatic, contact your local public-health authority or an
            emergency department.
          </p>
        </section>
      </main>

      <Footer />
    </>
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
    <div className="rounded-xl border border-white/[0.07] bg-[#0e1628]/80 p-4">
      <div
        className="text-[10px] font-mono uppercase tracking-[0.16em] font-semibold"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="mt-1.5 font-syne text-2xl font-bold tracking-tight text-[#f0f4ff] tabular-nums">
        {value}
      </div>
    </div>
  );
}
