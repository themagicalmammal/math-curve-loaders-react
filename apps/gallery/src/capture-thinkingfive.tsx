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
    baseRadius: 8,
    curveScale: 3.5,
    description:
      "Replacing the sevenfold term with a fivefold term reduces the inner loops, giving the curve a cleaner five-petal rhythm.",
    detailAmplitude: 4,
    durationMs: 4600,
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + (${c.baseRadius.toFixed(1)} cos t - ${c.detailAmplitude.toFixed(1)}s cos ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${c.baseRadius.toFixed(1)} sin t - ${c.detailAmplitude.toFixed(1)}s sin ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
    name: "Thinking Five",
    particleCount: 62,
    petalCount: 5,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x =
        config.baseRadius * Math.cos(t) -
        config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y =
        config.baseRadius * Math.sin(t) -
        config.detailAmplitude * detailScale * Math.sin(petals * t);
      return { x: 50 + x * config.curveScale, y: 50 + y * config.curveScale };
    },
    pulseDurationMs: 4200,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 5.5,
    tag: "Custom Rose Trail",
    trailSpan: 0.38,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
