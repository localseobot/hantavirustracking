/**
 * Data refresh cadence for the dashboard.
 *
 * The dataset in `lib/data/countries.ts` is hand-curated from WHO / ECDC /
 * PAHO / national-MoH bulletins. The intent is to land a refresh every
 * Monday at 12:00 UTC (which lines up with ECDC's weekly TESSy publication
 * window). Public-facing countdown reads off this constant so the page
 * never lies about its own staleness.
 */

export const UPDATE_DAY_OF_WEEK = 1; // Monday (Sun = 0)
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
 * Returns the timestamp of the next scheduled data refresh, expressed as a
 * Date in UTC. If today is Monday and we are before 12:00 UTC, it returns
 * today at 12:00 UTC. Otherwise it returns the next Monday at 12:00 UTC.
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

  // Days to add to get to the next UPDATE_DAY_OF_WEEK at >= UPDATE_HOUR_UTC.
  const todayDow = target.getUTCDay();
  let delta = (UPDATE_DAY_OF_WEEK - todayDow + 7) % 7;
  if (delta === 0 && now.getTime() >= target.getTime()) {
    delta = 7;
  }
  target.setUTCDate(target.getUTCDate() + delta);
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
