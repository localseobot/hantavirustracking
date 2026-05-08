"use client";

import { useEffect, useState } from "react";
import {
  diffParts,
  formatCountdown,
  getNextUpdate,
} from "@/lib/update-schedule";

interface Props {
  /** "compact" = chip; "card" = full panel with label; "inline" = single-line. */
  variant?: "compact" | "card" | "inline";
  /** Hide seconds — saves layout shift on small chips. */
  hideSeconds?: boolean;
  className?: string;
}

export default function UpdateCountdown({
  variant = "card",
  hideSeconds = false,
  className,
}: Props) {
  const [now, setNow] = useState<Date | null>(null);

  // Render the current time only on the client so SSR doesn't bake a stale
  // countdown that hydrates into a different value (avoids the React
  // hydration warning + lets the server send a placeholder).
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = getNextUpdate(now ?? new Date(0));
  const parts = now ? diffParts(target, now) : null;
  const display = parts ? formatCountdown(parts, !hideSeconds) : "—";
  const targetIso = now
    ? target.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "loading…";

  if (variant === "compact") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 text-[#fbbf24] font-mono text-[10px] uppercase tracking-[0.14em] ${
          className ?? ""
        }`}
        title={`Next data refresh: ${targetIso}`}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse"
          aria-hidden
        />
        Next refresh{" "}
        <span
          suppressHydrationWarning
          className="tabular-nums text-[#fde68a] normal-case tracking-normal"
        >
          {display}
        </span>
      </span>
    );
  }

  if (variant === "inline") {
    return (
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
          className ?? ""
        }`}
        suppressHydrationWarning
      >
        Next refresh in <span className="text-[#fde68a]">{display}</span>
      </span>
    );
  }

  return (
    <div
      className={`rounded-xl border border-[#fbbf24]/25 bg-[#fbbf24]/5 p-5 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full bg-[#fbbf24] animate-pulse"
          aria-hidden
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fbbf24] font-mono">
          Next data refresh
        </span>
      </div>
      <div
        className="mt-2 font-syne text-3xl md:text-4xl font-bold tracking-tight text-[#fde68a] tabular-nums"
        suppressHydrationWarning
      >
        {display}
      </div>
      <div className="mt-1 text-xs text-[#a39064]" suppressHydrationWarning>
        Scheduled {targetIso}
      </div>
    </div>
  );
}
