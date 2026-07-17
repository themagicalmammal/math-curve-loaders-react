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
    curveScale: 3.3,
    description:
      "The radius expands and contracts with cos(7t), so the orbit breathes into repeated petals while staying anchored to a circle.",
    detailAmplitude: 3.5,
    durationMs: 5200,
    formula(c: CurveConfig) {
      return [
        `r(t) = ${c.orbitRadius.toFixed(1)} - ${c.detailAmplitude.toFixed(1)}s cos(${Math.round(c.petalCount)}t)`,
        `x(t) = 50 + cos t · r(t) · ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + sin t · r(t) · ${c.curveScale.toFixed(1)}`,
      ].join("\n");
    },
    name: "Rose Orbit",
    orbitRadius: 8,
    particleCount: 72,
    petalCount: 7,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const k = Math.round(config.petalCount);
      const r =
        config.orbitRadius -
        config.detailAmplitude * detailScale * Math.cos(k * t);
      return {
        x: 50 + Math.cos(t) * r * config.curveScale,
        y: 50 + Math.sin(t) * r * config.curveScale,
      };
    },
    pulseDurationMs: 4600,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 5.2,
    tag: "r = cos(kθ)",
    trailSpan: 0.42,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
