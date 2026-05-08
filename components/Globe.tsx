"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  SEVERITY_COLOR,
  severityFromCases,
  type CountryCase,
} from "@/lib/types";

const GlobeGL = dynamic(() => import("react-globe.gl"), { ssr: false });

interface GlobeProps {
  countries: CountryCase[];
  onCountryClick?: (country: CountryCase) => void;
  selectedIso?: string | null;
  /** When true the globe fills its parent; otherwise it sizes to a fixed height. */
  fill?: boolean;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function compactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toString();
}

export default function Globe({
  countries,
  onCountryClick,
  selectedIso,
  fill = false,
}: GlobeProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.35;
      globeRef.current.controls().enableZoom = true;
      globeRef.current.pointOfView({ lat: 15, lng: 0, altitude: 2.4 }, 1500);
    }
  }, [dimensions.width, dimensions.height]);

  // Focus on a selected country.
  useEffect(() => {
    if (!selectedIso || !globeRef.current) return;
    const target = countries.find((c) => c.iso === selectedIso);
    if (!target) return;
    globeRef.current.controls().autoRotate = false;
    globeRef.current.pointOfView(
      { lat: target.lat, lng: target.lng, altitude: 1.6 },
      1200
    );
  }, [selectedIso, countries]);

  // Memoize so we don't re-bind the html-elements layer every render.
  const markers = useMemo(() => countries.filter((c) => c.cases > 0), [
    countries,
  ]);

  return (
    <div
      ref={containerRef}
      className={fill ? "w-full h-full" : "w-full h-[560px] md:h-[640px]"}
    >
      {dimensions.width > 0 && (
        <GlobeGL
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="#ef4444"
          atmosphereAltitude={0.22}
          htmlElementsData={markers}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          htmlLat={(d: any) => d.lat}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          htmlLng={(d: any) => d.lng}
          htmlAltitude={0.01}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          htmlElement={(d: any) => {
            const c = d as CountryCase;
            const sev = severityFromCases(c.cases);
            const color = SEVERITY_COLOR[sev];
            const isSelected = selectedIso === c.iso;
            // Logarithmic radius — keeps Finland's 1280 cases from drowning everything.
            const ringSize = 14 + Math.log10(c.cases + 1) * 4;
            const el = document.createElement("div");
            el.style.cursor = "pointer";
            el.style.transform = "translate(-50%, -50%)";
            el.innerHTML = `
              <div style="
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                pointer-events: auto;
              ">
                <div style="
                  position: absolute;
                  width: ${ringSize * 2.6}px;
                  height: ${ringSize * 2.6}px;
                  border-radius: 50%;
                  background: ${color}22;
                  border: 1px solid ${color}66;
                  ${isSelected ? `box-shadow: 0 0 16px ${color}cc;` : ""}
                "></div>
                <div style="
                  position: relative;
                  width: ${ringSize}px;
                  height: ${ringSize}px;
                  border-radius: 50%;
                  background: ${color};
                  border: 2px solid #0e1628;
                  box-shadow: 0 0 8px ${color}aa;
                "></div>
                <div style="
                  position: absolute;
                  bottom: -22px;
                  white-space: nowrap;
                  background: rgba(8, 13, 26, 0.85);
                  border: 1px solid ${color}44;
                  border-radius: 4px;
                  padding: 1px 6px;
                  font-family: 'JetBrains Mono', ui-monospace, monospace;
                  font-size: 10px;
                  color: #f0f4ff;
                  font-weight: 600;
                  letter-spacing: -0.2px;
                ">${escapeHtml(c.iso)} · ${compactNumber(c.cases)}</div>
              </div>
            `;
            el.addEventListener("click", (ev) => {
              ev.stopPropagation();
              if (globeRef.current) {
                globeRef.current.controls().autoRotate = false;
              }
              onCountryClick?.(c);
            });
            el.onmouseenter = () => {
              if (globeRef.current) {
                globeRef.current.controls().autoRotate = false;
              }
            };
            return el;
          }}
        />
      )}
    </div>
  );
}
