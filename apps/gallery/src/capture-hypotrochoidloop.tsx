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
      "The rolling-circle terms create nested turns and offsets, so the path feels like a compact spirograph traced by a machine.",
    durationMs: 7600,
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + ((R-r) cos t + d cos((R-r)t/r)) · ${c.spiroScale.toFixed(2)}`,
        `y(t) = 50 + ((R-r) sin t - d sin((R-r)t/r)) · ${c.spiroScale.toFixed(2)}`,
        `R = ${c.spiroR.toFixed(1)}, r = ${c.spiror.toFixed(1)} + ${c.spirorBoost.toFixed(2)}s, d = ${c.spirod.toFixed(1)} + ${c.spirodBoost.toFixed(1)}s`,
      ].join("\n");
    },
    name: "Hypotrochoid Loop",
    particleCount: 82,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const r = config.spiror + detailScale * config.spirorBoost;
      const d = config.spirod + detailScale * config.spirodBoost;
      const x =
        (config.spiroR - r) * Math.cos(t) +
        d * Math.cos(((config.spiroR - r) / r) * t);
      const y =
        (config.spiroR - r) * Math.sin(t) -
        d * Math.sin(((config.spiroR - r) / r) * t);
      return { x: 50 + x * config.spiroScale, y: 50 + y * config.spiroScale };
    },
    pulseDurationMs: 6200,
    rotate: false,
    rotationDurationMs: 42000,
    spirod: 5.5,
    spirodBoost: 1.5,
    spiroR: 8.5,
    spiror: 2.3,
    spirorBoost: 0.55,
    spiroScale: 2.85,
    strokeWidth: 4.6,
    tag: "Inner Spirograph",
    trailSpan: 0.46,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
