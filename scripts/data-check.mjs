#!/usr/bin/env node
/**
 * Daily data check
 *
 * Pulls the last ~24 h of items from the production /api/news endpoint
 * (which already aggregates WHO / CDC / ECDC / PAHO / Africa CDC RSS +
 * Google News with hantavirus + Hondius keyword filtering), then writes
 * `DATA_CHECK.md` as a daily review digest for the maintainer.
 *
 * What it does NOT do (deliberately, for safety):
 *   - Auto-edit `lib/data/countries.ts`. Case-count parsing from RSS
 *     summaries is fragile — wrong numbers in a public-health dashboard
 *     are worse than no update. The digest surfaces *mentions* of case
 *     numbers so the maintainer can review and edit the country file by
 *     hand on the PR branch.
 *
 * Exit codes:
 *   0  success — DATA_CHECK.md written (workflow will diff vs main and
 *      open / update the PR only if the content actually changed).
 *   1  fatal — failed to reach the news API or response was malformed.
 *      The workflow will mark the run as failed; nothing is committed.
 *
 * Invocation:
 *   node scripts/data-check.mjs
 *
 * Env vars:
 *   NEWS_API_URL   override of the news endpoint (default: production)
 *   HOURS_WINDOW   look-back window in hours (default: 24)
 */

import { writeFile } from "node:fs/promises";

const NEWS_API_URL =
  process.env.NEWS_API_URL || "https://hantavirustracking.org/api/news";
const HOURS_WINDOW = Number(process.env.HOURS_WINDOW || "24");
const OUTPUT_FILE = "DATA_CHECK.md";

const log = (...args) => console.log("[data-check]", ...args);

// Patterns aimed at headline phrasings used in real outbreak reporting.
// Each pattern captures one group containing the numeric value. Word
// boundaries (`\b`) plus a 1-5 digit cap keep this from matching dollar
// figures or years. We deliberately accept false positives over missed
// hits — the maintainer reviews every match in the PR before acting.
const NUMERIC_PATTERNS = [
  // "47 (confirmed/suspected/probable/new) cases" — number leads
  /\b(\d{1,5})\s+(?:confirmed\s+|suspected\s+|probable\s+)?(?:new\s+)?cases?\b/gi,
  // "cases rise/jump/climb/reach/hit to 11" — number trails
  /\bcases?\s+(?:rise|rose|jump|jumped|grow|grew|climb|climbed|increase|increased|reach|reached|surpass|surpassed|hit|now\s+stand|now\s+at|stand\s+at)\s+(?:to|at)\s+(\d{1,5})\b/gi,
  // "rises/climbs/reaches to 11 cases", "now 11 cases"
  /\b(?:rises|rose|jumps|jumped|grows|grew|climbs|climbed|increases|increased|reaches|reached|surpasses|surpassed|hits|hit|now)\s+(?:to\s+)?(\d{1,5})\s+(?:cases?|deaths?|fatal(?:ities|ity)|patients?)\b/gi,
  // "16 Americans exposed", "18 passengers quarantined", "5 crew members"
  /\b(\d{1,5})\s+(?:americans?|britons?|british|canadians?|brazilians?|argentin(?:es?|ians?)|chileans?|spaniards?|spanish|french|germans?|passengers?|travelers?|travellers?|crew\s+members?|exposed|positive|quarantin(?:ed|ing)|evacuat(?:ed|ing)|infected|hospitalized|hospitalised|repatriat(?:ed|ing))\b/gi,
  // "5 deaths", "fatal cases", "N hospitalised"
  /\b(\d{1,5})\s+(?:new\s+)?(?:confirmed\s+|reported\s+)?deaths?\b/gi,
  /\b(\d{1,5})\s+(?:confirmed\s+)?fatal(?:ities|ity)\b/gi,
  // "case fatality rate of 27.5%"
  /\bcase\s+fatality(?:\s+rate)?\s+(?:of\s+)?(\d{1,3}(?:\.\d+)?)\s*%/gi,
  // "11 confirmed", standalone after a verb of incidence
  /\b(?:confirmed|reported|recorded|documented)\s+(\d{1,5})\b/gi,
];

function extractMentions(text) {
  if (!text) return [];
  const hits = [];
  for (const pattern of NUMERIC_PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(text)) !== null) {
      // Capture ~80 chars of context around the match for review.
      const start = Math.max(0, m.index - 30);
      const end = Math.min(text.length, m.index + m[0].length + 50);
      const snippet = text
        .slice(start, end)
        .replace(/\s+/g, " ")
        .trim();
      hits.push({ value: m[0], snippet });
    }
  }
  return hits;
}

function pad(n, w = 2) {
  return String(n).padStart(w, "0");
}

function isoMinute(iso) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate()
  )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}Z`;
}

async function main() {
  const now = new Date();
  const cutoff = now.getTime() - HOURS_WINDOW * 3600 * 1000;
  const isoDate = now.toISOString().slice(0, 10);

  log(`fetching ${NEWS_API_URL} ...`);
  let data;
  try {
    const res = await fetch(NEWS_API_URL, {
      headers: {
        "User-Agent":
          "hantavirustracking.org daily data check (github actions)",
      },
    });
    if (!res.ok) {
      log(`HTTP ${res.status} — aborting`);
      process.exit(1);
    }
    data = await res.json();
  } catch (err) {
    log("fetch failed:", err?.message ?? err);
    process.exit(1);
  }

  if (!Array.isArray(data?.items)) {
    log("response did not contain items[]");
    process.exit(1);
  }

  const recent = data.items.filter((i) => {
    const t = new Date(i.publishedAt).getTime();
    return Number.isFinite(t) && t > cutoff;
  });

  const clusterOfficial = recent.filter(
    (i) => i.cluster && i.tier === "official"
  );
  const clusterMedia = recent.filter(
    (i) => i.cluster && i.tier !== "official"
  );
  const officialNonCluster = recent.filter(
    (i) => !i.cluster && i.tier === "official"
  );

  // Aggregate numeric mentions across recent cluster items.
  const numeric = [];
  for (const item of [...clusterOfficial, ...clusterMedia]) {
    const haystack = `${item.title || ""} ${item.summary || ""}`;
    const hits = extractMentions(haystack);
    for (const h of hits) {
      numeric.push({
        value: h.value,
        snippet: h.snippet,
        source: item.source,
        publishedAt: item.publishedAt,
        url: item.url,
      });
    }
  }
  // Dedupe identical (value, snippet) pairs.
  const seen = new Set();
  const numericDeduped = numeric.filter((n) => {
    const key = `${n.value}::${n.snippet}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const lines = [
    `# Daily data check — ${isoDate}`,
    "",
    `_Generated automatically. Reviewed against the production \`/api/news\`_`,
    `_endpoint at ${now.toISOString()}._`,
    "",
    "## Summary",
    "",
    `- Outbreak cluster items in last ${HOURS_WINDOW} h: **${
      clusterOfficial.length + clusterMedia.length
    }**`,
    `  - From official sources (WHO / CDC / ECDC / PAHO / Africa CDC): **${clusterOfficial.length}**`,
    `  - From news media: **${clusterMedia.length}**`,
    `- Non-cluster items from official sources in last ${HOURS_WINDOW} h: **${officialNonCluster.length}**`,
    `- Total live items currently aggregated: **${data?.counts?.live ?? "?"}**`,
    `- Distinct numeric mentions extracted from cluster items: **${numericDeduped.length}**`,
    "",
  ];

  if (clusterOfficial.length > 0) {
    lines.push(
      "## Official advisories about the active cluster",
      "",
      "Each of these is an authority-tier source (CDC, WHO, ECDC, PAHO,",
      "Africa CDC) that mentioned the active outbreak in the last",
      `${HOURS_WINDOW} hours. Check each for case-count changes.`,
      ""
    );
    for (const item of clusterOfficial) {
      lines.push(`### ${item.source} · ${isoMinute(item.publishedAt)}`);
      lines.push("");
      lines.push(`[${item.title}](${item.url})`);
      if (item.summary) {
        lines.push("");
        lines.push(`> ${item.summary.replace(/\n+/g, " ").slice(0, 320)}`);
      }
      lines.push("");
    }
  }

  if (numericDeduped.length > 0) {
    lines.push(
      "## Numeric mentions to review",
      "",
      "Phrases matching common case-count patterns in the last",
      `${HOURS_WINDOW} hours of cluster items. **These are raw text`,
      "matches, not validated figures** — verify against the source",
      "link before changing `lib/data/countries.ts`.",
      "",
      "| Mention | Context | Source | Published |",
      "| --- | --- | --- | --- |"
    );
    for (const n of numericDeduped.slice(0, 40)) {
      const snippetEsc = n.snippet
        .replace(/\|/g, "\\|")
        .replace(/\n/g, " ")
        .slice(0, 100);
      lines.push(
        `| \`${n.value}\` | ${snippetEsc} | [${n.source}](${n.url}) | ${isoMinute(
          n.publishedAt
        )} |`
      );
    }
    lines.push("");
  }

  if (clusterMedia.length > 0) {
    lines.push(
      `## Media coverage (top ${Math.min(clusterMedia.length, 15)})`,
      ""
    );
    for (const item of clusterMedia.slice(0, 15)) {
      lines.push(
        `- ${item.source} · ${isoMinute(item.publishedAt)} — [${item.title}](${
          item.url
        })`
      );
    }
    lines.push("");
  }

  if (officialNonCluster.length > 0) {
    lines.push("## Non-cluster surveillance items from official sources", "");
    for (const item of officialNonCluster) {
      lines.push(
        `- **${item.source}** · ${isoMinute(item.publishedAt)} — [${item.title}](${item.url})`
      );
    }
    lines.push("");
  }

  lines.push(
    "## Manual review checklist",
    "",
    "Before merging this PR, eyeball each authoritative source for any",
    "case-count or fatality changes you should mirror in",
    "`lib/data/countries.ts`. If a country row needs to change, edit the",
    "row on this branch and bump its `lastUpdated` to today.",
    "",
    "- [ ] [WHO Disease Outbreak News](https://www.who.int/emergencies/disease-outbreak-news)",
    "- [ ] [U.S. CDC hantavirus page](https://www.cdc.gov/hantavirus/)",
    "- [ ] [ECDC hantavirus surveillance](https://www.ecdc.europa.eu/en/hantavirus-infection)",
    "- [ ] [PAHO — Americas hantavirus topic](https://www.paho.org/en/topics/hantavirus)",
    "- [ ] [Argentina BIV (Boletín Integrado de Vigilancia)](https://bancos.salud.gob.ar/bancos/materiales-para-equipos-de-salud/soporte/boletines-epidemiologicos)",
    "- [ ] [Chile MINSAL Boletín Epidemiológico](https://epi.minsal.cl/)",
    "",
    "If nothing needs to change today, close this PR — the workflow will",
    "regenerate the digest tomorrow morning.",
    "",
    "---",
    "",
    "_Generated by `.github/workflows/daily-data-check.yml`. Source:_",
    "_`scripts/data-check.mjs`._"
  );

  const report = lines.join("\n") + "\n";
  await writeFile(OUTPUT_FILE, report);
  log(
    `wrote ${OUTPUT_FILE} (${report.length} bytes, ` +
      `${clusterOfficial.length} official cluster items, ` +
      `${clusterMedia.length} media cluster items, ` +
      `${numericDeduped.length} numeric mentions)`
  );
}

main().catch((err) => {
  console.error("[data-check] unexpected error:", err);
  process.exit(1);
});
