import { SEVERITY_COLOR, SEVERITY_LABEL, type SeverityBand } from "@/lib/types";

const ORDER: SeverityBand[] = ["low", "moderate", "high", "severe"];

export default function Legend() {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-[#0e1628]/80 backdrop-blur px-4 py-3">
      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8ea4c8] mb-2">
        Severity (cases in reporting period)
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {ORDER.map((s) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{
                background: SEVERITY_COLOR[s],
                boxShadow: `0 0 8px ${SEVERITY_COLOR[s]}55`,
              }}
            />
            <span className="text-[11px] text-[#f0f4ff]">
              {SEVERITY_LABEL[s]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
