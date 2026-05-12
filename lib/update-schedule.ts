/**
 * Data refresh cadence for the dashboard.
 *
 * The dataset in `lib/data/countries.ts` is curated from WHO / ECDC /
 * PAHO / Africa CDC / national-MoH bulletins. During the active
 * outbreak we land a refresh every day at 12:00 UTC — early enough
 * to capture overnight bulletins from the Americas (PAHO, Argentina,
 * Chile) and aligned with the start of the European public-health
 * working day. The public-facing countdown reads off these constants
 * so the page never lies about its own staleness.
 */

export const UPDATE_HOUR_UTC = 12;

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  /** True when we're inside a 30-min window of (or after) the scheduled time. */
  imminent: boolean;
}

/**
 * Returns the timestamp of the next scheduled daily refresh, expressed as a
 * Date in UTC. If `now` is before today's UPDATE_HOUR_UTC the target is
 * today at that hour; otherwise it rolls to tomorrow at that hour.
 */
export function getNextUpdate(now: Date = new Date()): Date {
  const target = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      UPDATE_HOUR_UTC,
      0,
      0,
      0
    )
  );
  if (now.getTime() >= target.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  return target;
}

export function diffParts(target: Date, now: Date = new Date()): CountdownParts {
  const totalMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    days,
    hours,
    minutes,
    seconds,
    totalMs,
    imminent: totalMs <= 30 * 60 * 1000,
  };
}

export function formatCountdown(parts: CountdownParts, withSeconds = true): string {
  const { days, hours, minutes, seconds } = parts;
  if (days > 0) {
    return withSeconds
      ? `${days}d ${hours}h ${minutes}m ${seconds}s`
      : `${days}d ${hours}h ${minutes}m`;
  }
  return withSeconds
    ? `${hours}h ${minutes}m ${seconds}s`
    : `${hours}h ${minutes}m`;
}
