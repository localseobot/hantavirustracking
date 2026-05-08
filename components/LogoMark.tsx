interface LogoMarkProps {
  size?: number;
  className?: string;
  /** Soften / darken the mark — useful in dim contexts. */
  muted?: boolean;
}

/**
 * Hantavirus.Tracking glyph: a surveillance reticle (dashed outer ring +
 * compass ticks) wrapping a stylized hantavirus capsid (a hexagonal core
 * with six surface-glycoprotein nodes). The bottom-right tick is a solid
 * "active ping" — a subtle nod to the live-tracking concept without
 * resembling a generic outbreak-counter logo.
 */
export default function LogoMark({
  size = 28,
  className,
  muted = false,
}: LogoMarkProps) {
  const accent = muted ? "#fca5a5" : "#ef4444";
  const ring = muted ? "rgba(239,68,68,0.45)" : "rgba(239,68,68,0.7)";
  const node = muted ? "#fda4af" : "#fecaca";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer reticle ring — dashed */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke={ring}
        strokeWidth="1"
        strokeDasharray="2 2.5"
      />

      {/* Compass ticks at N / E / S */}
      <line x1="20" y1="0.5" x2="20" y2="3.5" stroke={ring} strokeWidth="1" />
      <line x1="36.5" y1="20" x2="39.5" y2="20" stroke={ring} strokeWidth="1" />
      <line x1="20" y1="36.5" x2="20" y2="39.5" stroke={ring} strokeWidth="1" />
      {/* "Active ping" — solid filled tick at W */}
      <rect x="0.5" y="19" width="3.5" height="2" fill={accent} />

      {/* Hexagonal capsid core */}
      <polygon
        points="20,7 30,12.5 30,23.5 20,29 10,23.5 10,12.5"
        stroke={accent}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="rgba(239,68,68,0.12)"
      />

      {/* Surface-glycoprotein nodes — six dots at the capsid vertices */}
      <circle cx="20" cy="7" r="1.6" fill={node} />
      <circle cx="30" cy="12.5" r="1.6" fill={node} />
      <circle cx="30" cy="23.5" r="1.6" fill={node} />
      <circle cx="20" cy="29" r="1.6" fill={node} />
      <circle cx="10" cy="23.5" r="1.6" fill={node} />
      <circle cx="10" cy="12.5" r="1.6" fill={node} />

      {/* Pulsing core */}
      <circle cx="20" cy="18" r="1.8" fill={accent}>
        <animate
          attributeName="opacity"
          values="1;0.35;1"
          dur="1.8s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="r"
          values="1.8;2.4;1.8"
          dur="1.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}

/**
 * Wordmark used alongside the glyph. Stylized as an all-caps mono token
 * with a colored separator slash — visually distinct from hantacounter's
 * sentence-case wordmark.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={`font-mono text-[11px] md:text-xs font-bold tracking-[0.18em] uppercase text-[#f0f4ff] ${
        className ?? ""
      }`}
    >
      HANTA
      <span className="text-[#fca5a5]">/</span>TRACKING
    </span>
  );
}
