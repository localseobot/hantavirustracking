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
