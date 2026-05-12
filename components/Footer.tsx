import LogoMark, { Wordmark } from "./LogoMark";
import UpdateCountdown from "./UpdateCountdown";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#080d1a]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <LogoMark size={22} />
            <Wordmark />
          </div>
          <div className="mb-3">
            <UpdateCountdown variant="compact" />
          </div>
          <p className="text-[#8ea4c8] leading-relaxed text-xs">
            An independent dashboard aggregating publicly reported hantavirus
            surveillance data. Not affiliated with WHO or any national health
            authority.
          </p>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#4a6080] mb-2">
            Sources
          </div>
          <ul className="space-y-1 text-xs text-[#8ea4c8]">
            <li>
              <a
                className="hover:text-[#f0f4ff]"
                href="https://www.who.int/news-room/fact-sheets/detail/hantavirus"
                target="_blank"
                rel="noopener noreferrer"
              >
                WHO — Hantavirus fact sheet
              </a>
            </li>
            <li>
              <a
                className="hover:text-[#f0f4ff]"
                href="https://www.cdc.gov/hantavirus/data-research/index.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                U.S. CDC — HPS data
              </a>
            </li>
            <li>
              <a
                className="hover:text-[#f0f4ff]"
                href="https://www.ecdc.europa.eu/en/hantavirus-infection"
                target="_blank"
                rel="noopener noreferrer"
              >
                ECDC — Hantavirus surveillance
              </a>
            </li>
            <li>
              <a
                className="hover:text-[#f0f4ff]"
                href="https://promedmail.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ProMED-mail
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#4a6080] mb-2">
            Medical disclaimer
          </div>
          <p className="text-xs text-[#8ea4c8] leading-relaxed">
            For informational use only. Not medical advice. If you suspect
            hantavirus exposure, contact your local public-health authority or
            an emergency department immediately.
          </p>
        </div>
      </div>

      {/* Independence / non-affiliation notice — full-width strip so it can't
          be missed. Required disclosure: this site is privately operated and
          republishes only publicly accessible data. */}
      <div className="border-t border-white/[0.07] bg-[#fbbf24]/[0.04]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-5">
          <div className="flex items-start gap-3 border-l-2 border-[#fbbf24]/40 pl-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fbbf24] mb-1.5">
                Independence notice
              </div>
              <p className="text-xs md:text-sm text-[#e8d9b3] leading-relaxed max-w-4xl">
                <strong className="text-[#fde68a]">
                  hantavirustracking.org is not a government agency and is not
                  affiliated with, endorsed by, or sponsored by the U.S. CDC,
                  the World Health Organization, ECDC, PAHO, Africa CDC, or any
                  national, state, or local public-health authority.
                </strong>{" "}
                This site is an independent project that aggregates and
                republishes information from publicly accessible sources —
                RSS feeds, press releases, surveillance bulletins, fact sheets,
                and news media — for informational purposes only. All trademarks,
                logos, and agency names belong to their respective owners and are
                used solely to identify the source of each cited item. For
                authoritative guidance, always consult the cited primary source
                directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] py-4">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#4a6080]">
          <span>© 2026 hantavirustracking.org · independent project</span>
          <span>
            Live RSS aggregated from WHO · CDC · ECDC · PAHO · news media
          </span>
        </div>
      </div>
    </footer>
  );
}
