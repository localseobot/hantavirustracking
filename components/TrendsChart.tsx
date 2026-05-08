"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TIMELINE } from "@/lib/data/timeline";

const COLORS = {
  asia: "#ef4444",
  europe: "#fbbf24",
  americas: "#60a5fa",
  africa: "#a78bfa",
  oceania: "#34d399",
};

export default function TrendsChart() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0e1628]/60 p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#fbbf24]">
            Annual cases by region
          </div>
          <h3 className="font-syne text-xl font-bold text-[#f0f4ff] mt-0.5">
            Ten-year hantavirus trend
          </h3>
        </div>
        <div className="text-[11px] text-[#4a6080] font-mono">
          Source: WHO · ECDC · PAHO
        </div>
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={TIMELINE}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              {Object.entries(COLORS).map(([k, v]) => (
                <linearGradient
                  key={k}
                  id={`grad-${k}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={v} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={v} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="#4a6080"
              tick={{ fill: "#8ea4c8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.07)" }}
            />
            <YAxis
              stroke="#4a6080"
              tick={{ fill: "#8ea4c8", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                background: "#0e1628",
                border: "1px solid rgba(239,68,68,0.35)",
                borderRadius: 8,
                color: "#f0f4ff",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSize: 12,
              }}
              labelStyle={{ color: "#fca5a5", fontWeight: 700 }}
              formatter={(v) =>
                typeof v === "number" ? v.toLocaleString() : String(v)
              }
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                color: "#8ea4c8",
                fontSize: 11,
                paddingTop: 8,
              }}
            />
            <Area
              type="monotone"
              dataKey="asia"
              name="Asia"
              stackId="1"
              stroke={COLORS.asia}
              fill="url(#grad-asia)"
            />
            <Area
              type="monotone"
              dataKey="europe"
              name="Europe"
              stackId="1"
              stroke={COLORS.europe}
              fill="url(#grad-europe)"
            />
            <Area
              type="monotone"
              dataKey="americas"
              name="Americas"
              stackId="1"
              stroke={COLORS.americas}
              fill="url(#grad-americas)"
            />
            <Area
              type="monotone"
              dataKey="africa"
              name="Africa"
              stackId="1"
              stroke={COLORS.africa}
              fill="url(#grad-africa)"
            />
            <Area
              type="monotone"
              dataKey="oceania"
              name="Oceania"
              stackId="1"
              stroke={COLORS.oceania}
              fill="url(#grad-oceania)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
