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
            Disclaimer
          </div>
          <p className="text-xs text-[#8ea4c8] leading-relaxed">
            For informational use only. Not medical advice. If you suspect
            hantavirus exposure, contact your local public-health authority or
            an emergency department immediately.
          </p>
        </div>
      </div>
      <div className="border-t border-white/[0.05] py-4">
        <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#4a6080]">
          <span>© 2026 hantavirustracking.org</span>
          <span>
            Data refreshed manually from cited sources · No live API
          </span>
        </div>
      </div>
    </footer>
  );
}
