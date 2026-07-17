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
      "With R = 5, the loop count increases to five petals, giving the spiral flower a denser and more ornate rhythm.",
    durationMs: 4600,
    formula(c: CurveConfig) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${c.spiralScale.toFixed(2)} + ${c.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${c.spiralR.toFixed(1)}, r = ${c.spiralr.toFixed(1)}, d = ${c.spirald.toFixed(1)}`,
      ].join("\n");
    },
    name: "Five-Petal Spiral",
    particleCount: 85,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX =
        (config.spiralR - config.spiralr) * Math.cos(t) +
        d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY =
        (config.spiralR - config.spiralr) * Math.sin(t) -
        d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return { x: 50 + baseX * scale, y: 50 + baseY * scale };
    },
    pulseDurationMs: 4200,
    rotate: true,
    rotationDurationMs: 28000,
    spiralBreath: 0.45,
    spirald: 3,
    spiralR: 5,
    spiralr: 1,
    spiralScale: 2.2,
    strokeWidth: 4.4,
    tag: "R = 5, r = 1, d = 3",
    trailSpan: 0.34,
  };

const defaultConfig: CurveConfig = mergeConfig(curveConfig);

createRoot(document.getElementById("root")!).render(
  <CurveLoader config={defaultConfig} style={{ color: "#6366f1", height: 160, width: 160 }} />,
);
