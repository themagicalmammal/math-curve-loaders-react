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
    cardioidA: 9.2,
    cardioidPulse: 1.0,
    cardioidScale: 2.0,
    description:
      "Starting from r = a(1 + cos t) and rotating the coordinates turns the textbook cardioid into a more legible upright heart.",
    durationMs: 6200,
    formula(c: CurveConfig) {
      return [
        `a = ${c.cardioidA.toFixed(1)} + ${c.cardioidPulse.toFixed(2)}s`,
        "r(t) = a(1 + cos t)",
        "x'(t) = -sin t · r(t)",
        `y'(t) = -cos t · r(t), m = ${c.cardioidScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Cardioid Heart",
    particleCount: 74,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.cardioidA + detailScale * config.cardioidPulse;
      const r = a * (1 + Math.cos(t));
      const baseX = Math.cos(t) * r;
      const baseY = Math.sin(t) * r;
      return {
        x: 50 - baseY * config.cardioidScale,
        y: 50 - baseX * config.cardioidScale,
      };
    },
    pulseDurationMs: 5200,
    rotate: false,
    rotationDurationMs: 36000,
    strokeWidth: 4.9,
    tag: "r = a(1 + cosθ)",
    trailSpan: 0.36,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
