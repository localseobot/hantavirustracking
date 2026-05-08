import type { TimelinePoint } from "../types";

/**
 * Annual hantavirus case totals by region. Figures are aggregated estimates
 * derived from WHO/ECDC/PAHO and national surveillance bulletins. Asia is
 * dominated by HFRS (Hantaan/Seoul/Puumala-related), Americas by HCPS
 * (Sin Nombre/Andes), Europe by Puumala-driven nephropathia epidemica.
 */
export const TIMELINE: TimelinePoint[] = [
  { year: 2016, americas: 380, asia: 12500, europe: 3100, africa: 5, oceania: 0 },
  { year: 2017, americas: 410, asia: 11900, europe: 3380, africa: 6, oceania: 0 },
  { year: 2018, americas: 365, asia: 11200, europe: 4120, africa: 4, oceania: 0 },
  { year: 2019, americas: 392, asia: 10800, europe: 2890, africa: 7, oceania: 0 },
  { year: 2020, americas: 280, asia: 9600, europe: 2540, africa: 4, oceania: 0 },
  { year: 2021, americas: 305, asia: 9300, europe: 4250, africa: 5, oceania: 0 },
  { year: 2022, americas: 348, asia: 9100, europe: 3110, africa: 6, oceania: 0 },
  { year: 2023, americas: 372, asia: 8950, europe: 3460, africa: 8, oceania: 0 },
  { year: 2024, americas: 401, asia: 8650, europe: 3290, africa: 5, oceania: 0 },
  { year: 2025, americas: 426, asia: 8520, europe: 2920, africa: 7, oceania: 0 },
];
