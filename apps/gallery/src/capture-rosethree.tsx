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
      "With k = 3, the curve resolves into three rotating petals, the inner breathing keeps the motion from feeling mathematically rigid.",
    durationMs: 5300,
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(3t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Rose Three",
    particleCount: 76,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r =
        a *
        (config.roseBreathBase + detailScale * config.roseBreathBoost) *
        Math.cos(3 * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
    pulseDurationMs: 4400,
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseScale: 3.0,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 4.6,
    tag: "r = a cos(3θ)",
    trailSpan: 0.31,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
