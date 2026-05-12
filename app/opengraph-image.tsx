import { ImageResponse } from "next/og";
import { totals } from "@/lib/data/countries";

export const runtime = "edge";
export const alt = "Hantavirus.Tracking — Global outbreak dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const t = totals();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#080d1a",
          backgroundImage:
            "radial-gradient(ellipse at 18% 0%, rgba(239,68,68,0.22), transparent 50%), radial-gradient(ellipse at 82% 100%, rgba(96,165,250,0.18), transparent 55%)",
          color: "#f0f4ff",
          padding: "64px 72px",
          position: "relative",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Top bar — live chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 18,
            color: "#fca5a5",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#ef4444",
              boxShadow: "0 0 16px rgba(239,68,68,0.7)",
            }}
          />
          Live · WHO multi-country cluster
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 32,
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.02,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Global hantavirus</span>
          <span style={{ color: "#fca5a5" }}>surveillance.</span>
        </div>

        {/* Subhead */}
        <div
          style={{
            marginTop: 22,
            fontSize: 26,
            lineHeight: 1.4,
            color: "#8ea4c8",
            maxWidth: 940,
          }}
        >
          Cases, deaths, and case-fatality rate by country — compiled daily
          from WHO, CDC, ECDC, PAHO, and national ministries of health.
        </div>

        {/* Stat strip */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            gap: 24,
            paddingTop: 32,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Stat label="Cases" value={t.cases.toLocaleString()} accent="#fca5a5" />
          <Stat label="Deaths" value={t.deaths.toLocaleString()} accent="#f87171" />
          <Stat
            label="Countries"
            value={t.countriesWithCases.toLocaleString()}
            accent="#fbbf24"
          />
          <Stat label="CFR" value={`${t.cfr.toFixed(2)}%`} accent="#fb923c" />
          <div style={{ flex: 1 }} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 22,
              fontWeight: 700,
              color: "#f0f4ff",
              letterSpacing: -0.5,
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                color: "#fca5a5",
                fontSize: 18,
                letterSpacing: 3,
              }}
            >
              HANTA/TRACKING
            </span>
          </div>
        </div>
      </div>
    ),
    size
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
    <div style={{ display: "flex", flexDirection: "column", minWidth: 150 }}>
      <span
        style={{
          fontSize: 14,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: accent,
          fontFamily: "monospace",
          fontWeight: 700,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: -1.5,
          color: "#f0f4ff",
        }}
      >
        {value}
      </span>
    </div>
  );
}
