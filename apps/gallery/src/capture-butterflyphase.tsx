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
    butterflyCosWeight: 2.5,
    butterflyPower: 4,
    butterflyPulse: 0.55,
    butterflyScale: 4.2,
    butterflyTurns: 14,
    description:
      "Exponential and high-frequency cosine terms stretch the wings unevenly, giving the path its unmistakably fluttering butterfly shape.",
    durationMs: 9000,
    formula(c: CurveConfig) {
      return [
        `u = ${c.butterflyTurns.toFixed(1)}t`,
        `B(u) = e^{cos u} - ${c.butterflyCosWeight.toFixed(2)} cos 4u - sin^${Math.round(c.butterflyPower)}(u/12)`,
        `x(t) = 50 + sin u · B(u) · (${c.butterflyScale.toFixed(2)} + ${c.butterflyPulse.toFixed(2)}s)`,
        `y(t) = 50 + cos u · B(u) · (${c.butterflyScale.toFixed(2)} + ${c.butterflyPulse.toFixed(2)}s)`,
      ].join("\n");
    },
    name: "Butterfly Phase",
    particleCount: 88,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * config.butterflyTurns;
      const s =
        Math.exp(Math.cos(t)) -
        config.butterflyCosWeight * Math.cos(4 * t) -
        Math.sin(t / 12) ** Math.round(config.butterflyPower);
      const scale = config.butterflyScale + detailScale * config.butterflyPulse;
      return {
        x: 50 + Math.sin(t) * s * scale,
        y: 50 + Math.cos(t) * s * scale,
      };
    },
    pulseDurationMs: 7000,
    rotate: false,
    rotationDurationMs: 50000,
    strokeWidth: 4.4,
    tag: "Butterfly Curve",
    trailSpan: 0.32,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
