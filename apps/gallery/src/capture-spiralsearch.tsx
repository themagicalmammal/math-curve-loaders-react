import CurveLoader from "../../../packages/math-curve-loaders-react/src/components/CurveLoader";
import { createRoot } from "react-dom/client";
import type { CurveConfig } from "../../../packages/math-curve-loaders-react/src/data/curves";

function mergeConfig(
  base: CurveConfig,
  overrides?: Partial<CurveConfig>,
): CurveConfig {
  return { ...base, ...overrides } as CurveConfig;
}

// Inline curve configuration to avoid shared chunk with other capture pages
const curveConfig: CurveConfig = {
    description:
      "A fast-growing angle combined with a cosine-modulated radius creates a spiral that opens out and closes cleanly back into itself.",
    durationMs: 7800,
    formula(c: CurveConfig) {
      return [
        `θ(t) = ${c.searchTurns.toFixed(1)}t`,
        `r(t) = ${c.searchBaseRadius.toFixed(1)} + (1 - cos t)(${c.searchRadiusAmp.toFixed(1)} + ${c.searchPulse.toFixed(1)}s)`,
        `x(t) = 50 + cos θ · r(t) · ${c.searchScale.toFixed(2)}`,
        `y(t) = 50 + sin θ · r(t) · ${c.searchScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Spiral Search",
    particleCount: 86,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const angle = t * config.searchTurns;
      const radius =
        config.searchBaseRadius +
        (1 - Math.cos(t)) *
          (config.searchRadiusAmp + detailScale * config.searchPulse);
      return {
        x: 50 + Math.cos(angle) * radius * config.searchScale,
        y: 50 + Math.sin(angle) * radius * config.searchScale,
      };
    },
    pulseDurationMs: 6800,
    rotate: false,
    rotationDurationMs: 44000,
    searchBaseRadius: 10,
    searchPulse: 2.8,
    searchRadiusAmp: 7.0,
    searchScale: 1.1,
    searchTurns: 5,
    strokeWidth: 4.3,
    tag: "Archimedean Spiral",
    trailSpan: 0.28,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
