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
      "Several sine and cosine components interfere with one another, so the shape keeps mutating like a living waveform.",
    durationMs: 8400,
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + ${c.fourierX1.toFixed(1)} cos t + ${c.fourierX3.toFixed(1)} cos(3t + 0.6m) + ${c.fourierX5.toFixed(1)} sin(5t - 0.4)`,
        `y(t) = 50 + ${c.fourierY1.toFixed(1)} sin t + ${c.fourierY2.toFixed(1)} sin(2t + 0.25) - ${c.fourierY4.toFixed(1)} cos(4t - 0.5m)`,
        `m = ${c.fourierMixBase.toFixed(2)} + ${c.fourierMixPulse.toFixed(2)}s`,
      ].join("\n");
    },
    fourierMixBase: 1.1,
    fourierMixPulse: 0.2,
    fourierX1: 18,
    fourierX3: 6.5,
    fourierX5: 2.8,
    fourierY1: 16,
    fourierY2: 7.5,
    fourierY4: 3.8,
    name: "Fourier Flow",
    particleCount: 92,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const mix = config.fourierMixBase + detailScale * config.fourierMixPulse;
      const x =
        config.fourierX1 * Math.cos(t) +
        config.fourierX3 * Math.cos(3 * t + 0.6 * mix) +
        config.fourierX5 * Math.sin(5 * t - 0.4);
      const y =
        config.fourierY1 * Math.sin(t) +
        config.fourierY2 * Math.sin(2 * t + 0.25) -
        config.fourierY4 * Math.cos(4 * t - 0.5 * mix);
      return { x: 50 + x, y: 50 + y };
    },
    pulseDurationMs: 6800,
    rotate: false,
    rotationDurationMs: 44000,
    strokeWidth: 4.2,
    tag: "Fourier Curve",
    trailSpan: 0.31,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
