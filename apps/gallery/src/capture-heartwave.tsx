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
      "The x^(2/3) envelope supplies the heart outline, while sin(bπx) fills its interior with adjustable horizontal ripples.",
    durationMs: 8400,
    formula(c: CurveConfig) {
      return [
        `f(x) = |x|^(2/3) + ${c.heartWaveAmp.toFixed(2)}√(${c.heartWaveRoot.toFixed(2)} - x²) sin(${c.heartWaveB.toFixed(1)}πx)`,
        `screenX = 50 + x · ${c.heartWaveScaleX.toFixed(1)}`,
        `screenY = 18 + (1.75 - f(x))(${c.heartWaveScaleY.toFixed(1)} + 1.5s)`,
      ].join("\n");
    },
    heartWaveAmp: 0.7,
    heartWaveB: 8.0,
    heartWaveRoot: 3.6,
    heartWaveScaleX: 21.5,
    heartWaveScaleY: 22.8,
    name: "Heart Wave",
    particleCount: 104,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const xLimit = Math.sqrt(config.heartWaveRoot);
      const x = -xLimit + progress * xLimit * 2;
      const safeRoot = Math.max(0, config.heartWaveRoot - x * x);
      const wave =
        config.heartWaveAmp *
        Math.sqrt(safeRoot) *
        Math.sin(config.heartWaveB * Math.PI * x);
      const curve = Math.pow(Math.abs(x), 2 / 3);
      const y = curve + wave;
      const scaleY = config.heartWaveScaleY + detailScale * 1.5;
      return {
        x: 50 + x * config.heartWaveScaleX,
        y: 18 + (1.75 - y) * scaleY,
      };
    },
    pulseDurationMs: 5600,
    rotate: false,
    rotationDurationMs: 22000,
    strokeWidth: 3.9,
    tag: "f(x) Heart Wave",
    trailSpan: 0.18,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
