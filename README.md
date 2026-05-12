# Hantavirus.Tracking

Global hantavirus surveillance dashboard for **hantavirustracking.org**.
Interactive 3D globe of confirmed cases, deaths, and case-fatality rate by
country, compiled from WHO, CDC, ECDC, PAHO, ProMED, and national
ministries of health.

Built with Next.js 16 (App Router), React 19, Tailwind v4,
[`react-globe.gl`](https://github.com/vasturiano/react-globe.gl), and
Recharts.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (verifies types + ssg)
```

## Project layout

```
app/
  page.tsx              Landing page — hero, globe, table, trends, news, sources
  globe/page.tsx        Standalone fullscreen globe at /globe
  globals.css           Dark theme tokens + body haze
components/
  Globe.tsx             react-globe.gl with html-element markers (cases/iso badges)
  CountryDetail.tsx     Detail panel rendered on marker click / table row click
  Counters.tsx          Top-of-page totals (cases / deaths / countries / CFR)
  CountryTable.tsx      Sortable + filterable country list
  TrendsChart.tsx       10-year stacked-area regional trend (Recharts)
  NewsFeed.tsx          Recent surveillance reports
  Sources.tsx           Sources & methodology block
  Hero.tsx, Header.tsx, Footer.tsx, Legend.tsx
lib/
  types.ts              CountryCase, severity bands, helpers
  data/
    countries.ts        Country-level case rows (the main editable data)
    timeline.ts         Annual region totals for the trend chart
    news.ts             Surveillance-report cards
    sources.ts          Cited authorities + last-checked dates
```

## Updating the data

All data is hand-curated TypeScript — no live API yet. To refresh:

1. Pull the latest figures from the relevant ministry / WHO / ECDC / PAHO
   bulletin (see `lib/data/sources.ts`).
2. Edit the corresponding row in **`lib/data/countries.ts`**, bumping
   `cases`, `deaths`, `lastUpdated`, and `sourceIds` as needed.
3. If you want to add a new country, copy an existing row and supply
   `iso`, `lat`, `lng`, `region`, `strains`, `notes`.
4. Update `lib/data/timeline.ts` once a year for the trend chart.
5. Add a `lib/data/news.ts` entry whenever a major bulletin or RRA drops.

The public countdown in the hero/header is wired to **daily 12:00 UTC**
via `lib/update-schedule.ts` — change the constant in that file if you
want a different cadence. The live `/api/news` RSS ingest is independent
and revalidates every 5 minutes regardless.

## Automated daily data check

A GitHub Action runs every day at **11:30 UTC** (30 minutes before the
public countdown target) and posts a draft pull request with a digest of
the last 24 hours of outbreak signal:

- `.github/workflows/daily-data-check.yml` — the cron schedule + the
  `peter-evans/create-pull-request@v7` step that opens / updates the PR.
- `scripts/data-check.mjs` — the script. Hits the production
  `/api/news` endpoint, filters items to the last 24 h, splits them by
  cluster status and source tier, runs case-count regexes over titles
  and summaries, and writes the result to `DATA_CHECK.md`.

**The script deliberately does not auto-edit `lib/data/countries.ts`.**
Numeric mentions extracted from RSS headlines are surfaced for review,
not auto-applied — wrong numbers in a public-health dashboard are worse
than no update. The PR's job is to put the right links and the right
numbers in front of you so the manual edit takes 60 seconds.

### One-time repo setup

The action needs permission to open pull requests. In the GitHub repo
settings:

1. **Settings → Actions → General → Workflow permissions**
   - Set "Read and write permissions"
   - Tick **"Allow GitHub Actions to create and approve pull requests"**
2. (Optional) **Settings → Branches → main → Protect**
   - Require a PR review before merging if you want a second pair of eyes.

### Running it locally

```bash
node scripts/data-check.mjs        # writes DATA_CHECK.md vs prod /api/news
NEWS_API_URL=http://localhost:3000/api/news node scripts/data-check.mjs
HOURS_WINDOW=48 node scripts/data-check.mjs    # widen the window
```

### Daily flow once it's running

1. Action fires at 11:30 UTC.
2. PR `bot/daily-data-check` opens or updates with the regenerated
   `DATA_CHECK.md`.
3. You skim the "Official advisories" + "Numeric mentions" sections
   (usually <60 s).
4. If a country's case count or notes should change, edit
   `lib/data/countries.ts` directly on the PR branch and bump that row's
   `lastUpdated` to today.
5. Merge → Vercel auto-deploys → public counters refresh.
6. If nothing needs to change, close the PR. The action will regenerate
   it tomorrow.

`npm run build` verifies typing; if a row is malformed it will fail fast.

## Adding a live data source later

The site is static today — every page is prerendered. To add live data:

- Add an API route under `app/api/...` that fetches the WHO/ECDC/PAHO feed
  and returns the same `CountryCase[]` shape.
- In `app/page.tsx` and `app/globe/GlobeView.tsx`, swap the static
  `import { COUNTRIES } from "@/lib/data/countries"` for a `useEffect`
  fetch (mirror the `wherewework` `globe-content.tsx` pattern: keep the
  static array as the fallback, then `setCountries(await res.json())`).

## Disclaimer

Informational dashboard only. Not affiliated with WHO or any national
health authority. Not medical advice.
