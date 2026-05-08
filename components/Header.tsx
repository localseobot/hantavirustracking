import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080d1a]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full bg-[#ef4444] hanta-pulse"
            aria-hidden
          />
          <span className="font-syne text-base font-bold tracking-tight text-[#f0f4ff]">
            Hantavirus<span className="text-[#fca5a5]">.</span>Tracking
          </span>
          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-[0.16em] text-[#4a6080] ml-2">
            Global surveillance
          </span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-3 text-sm">
          <a
            href="#globe"
            className="hidden md:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
          >
            Globe
          </a>
          <a
            href="#trends"
            className="hidden md:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
          >
            Trends
          </a>
          <a
            href="#countries"
            className="hidden md:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
          >
            Countries
          </a>
          <a
            href="#news"
            className="hidden md:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
          >
            News
          </a>
          <a
            href="#sources"
            className="hidden md:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
          >
            Sources
          </a>
          <Link
            href="/globe"
            className="ml-1 md:ml-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#ef4444]/15 text-[#fca5a5] border border-[#ef4444]/30 hover:bg-[#ef4444]/25 transition"
          >
            Fullscreen Globe ↗
          </Link>
        </nav>
      </div>
    </header>
  );
}
