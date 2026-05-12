import Counters from "./Counters";
import UpdateCountdown from "./UpdateCountdown";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.07]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-10 md:pt-16 pb-8 md:pb-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#ef4444]/30 bg-[#ef4444]/10">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#ef4444] hanta-pulse"
              aria-hidden
            />
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#fca5a5]">
              Live · WHO multi-country cluster
            </span>
          </span>
          <UpdateCountdown variant="compact" />
        </div>
        <h1 className="font-syne text-4xl md:text-6xl font-bold tracking-tight text-[#f0f4ff] max-w-3xl">
          Global hantavirus
          <span className="text-[#fca5a5]"> surveillance.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-[#8ea4c8] leading-relaxed">
          Confirmed cases, deaths, and case-fatality rate from every reporting
          country — compiled daily from WHO, CDC, ECDC, PAHO, and national
          ministries of health. Click any hot-spot for the full country
          breakdown.
        </p>
        <div className="mt-8">
          <Counters />
        </div>
      </div>
    </section>
  );
}
