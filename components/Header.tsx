import Link from "next/link";
import LogoMark, { Wordmark } from "./LogoMark";
import UpdateCountdown from "./UpdateCountdown";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080d1a]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoMark size={26} />
          <Wordmark className="group-hover:text-white transition" />
        </Link>
        <nav className="flex items-center gap-1 md:gap-3 text-sm">
          <UpdateCountdown
            variant="compact"
            hideSeconds
            className="hidden md:inline-flex"
          />
          <a
            href="#globe"
            className="hidden lg:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
          >
            Globe
          </a>
          <a
            href="#trends"
            className="hidden lg:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
          >
            Trends
          </a>
          <a
            href="#countries"
            className="hidden lg:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
          >
            Countries
          </a>
          <a
            href="#sources"
            className="hidden lg:inline px-3 py-1.5 rounded-md text-[#8ea4c8] hover:text-[#f0f4ff] transition"
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
