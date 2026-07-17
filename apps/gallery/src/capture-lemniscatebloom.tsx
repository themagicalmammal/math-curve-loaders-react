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
      "The 1 + sin²t denominator pinches the center while preserving two lobes, so the curve naturally reads as a breathing infinity sign.",
    durationMs: 5600,
    formula(c: CurveConfig) {
      return [
        `a = ${c.lemniscateA.toFixed(1)} + ${c.lemniscateBoost.toFixed(1)}s`,
        "x(t) = 50 + a cos t / (1 + sin² t)",
        "y(t) = 50 + a sin t cos t / (1 + sin² t)",
      ].join("\n");
    },
    lemniscateA: 24,
    lemniscateBoost: 9,
    name: "Lemniscate Bloom",
    particleCount: 70,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const scale = config.lemniscateA + detailScale * config.lemniscateBoost;
      const denom = 1 + Math.sin(t) ** 2;
      return {
        x: 50 + (scale * Math.cos(t)) / denom,
        y: 50 + (scale * Math.sin(t) * Math.cos(t)) / denom,
      };
    },
    pulseDurationMs: 5000,
    rotate: false,
    rotationDurationMs: 34000,
    strokeWidth: 4.8,
    tag: "Bernoulli Lemniscate",
    trailSpan: 0.4,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
