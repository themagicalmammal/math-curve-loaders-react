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
      "Different sine frequencies on x and y make the path cross itself repeatedly, producing the woven feel of an oscilloscope trace.",
    durationMs: 6000,
    formula(c: CurveConfig) {
      return [
        `A = ${c.lissajousAmp.toFixed(1)} + ${c.lissajousAmpBoost.toFixed(1)}s`,
        `x(t) = 50 + sin(${Math.round(c.lissajousAX)}t + ${c.lissajousPhase.toFixed(2)}) · A`,
        `y(t) = 50 + sin(${Math.round(c.lissajousBY)}t) · ${c.lissajousYScale.toFixed(2)}A`,
      ].join("\n");
    },
    lissajousAmp: 28,
    lissajousAmpBoost: 8,
    lissajousAX: 3,
    lissajousBY: 4,
    lissajousPhase: 1.57,
    lissajousYScale: 0.85,
    name: "Lissajous Drift",
    particleCount: 68,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const amp = config.lissajousAmp + detailScale * config.lissajousAmpBoost;
      return {
        x:
          50 +
          Math.sin(Math.round(config.lissajousAX) * t + config.lissajousPhase) *
            amp,
        y:
          50 +
          Math.sin(Math.round(config.lissajousBY) * t) *
            (amp * config.lissajousYScale),
      };
    },
    pulseDurationMs: 5400,
    rotate: false,
    rotationDurationMs: 36000,
    strokeWidth: 4.7,
    tag: "x = sin(at), y = sin(bt)",
    trailSpan: 0.34,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
