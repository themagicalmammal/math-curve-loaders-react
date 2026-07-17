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
      "Using r = a cos(5t) creates five evenly spaced lobes, the breathing multiplier gently swells each petal in and out.",
    durationMs: 5400,
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(${Math.round(c.roseK)}t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Rose Curve",
    particleCount: 78,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const k = Math.round(config.roseK);
      const r =
        a *
        (config.roseBreathBase + detailScale * config.roseBreathBoost) *
        Math.cos(k * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
    pulseDurationMs: 4600,
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseK: 5,
    roseScale: 3.0,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 4.5,
    tag: "r = a cos(kθ)",
    trailSpan: 0.32,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
