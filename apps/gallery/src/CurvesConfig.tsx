import {
  ButterflyPhase,
  CardioidGlow,
  CardioidHeart,
  FivePetalSpiral,
  FourierFlow,
  FourPetalSpiral,
  HeartWave,
  HypotrochoidLoop,
  LemniscateBloom,
  LissajousDrift,
  OriginalThinking,
  RoseCurve,
  RoseFour,
  RoseOrbit,
  RoseThree,
  RoseTwo,
  SixPetalSpiral,
  SpiralSearch,
  ThinkingFive,
  ThinkingNine,
  ThreePetalSpiral,
} from "@math-curve-loaders/react";

import curvesData from "./data/curves.json" with { type: "json" };

import type { CurveConfig } from "@math-curve-loaders/react";

/* ─── Types ─── */

export interface ControlDef {
  description: string;
  key: string;
  label: string;
  max: number;
  min: number;
  section?: "formula" | "visual";
  step: number;
}

export interface CurvePlaygroundConfig {
  color: string;
  component: React.FC<{
    config?: Partial<CurveConfig>;
    className?: string;
    style?: React.CSSProperties;
  }>;
  controls: ControlDef[];
  defaults: Record<string, number>;
  description: string;
  formula: string;
  importLabel: string;
  name: string;
  source?: string;
  tag: string;
}

/* ─── Data from JSON ─── */

const colorMap = Object.fromEntries(
  curvesData.curves.map((c, i) => [c.name, curvesData.colors[i]]),
);

export const GLOBAL_CONTROLS: ControlDef[] = curvesData.globalControls.map(
  (c) => ({
    description: c.description,
    key: c.key,
    label: c.label,
    max: c.max,
    min: c.min,
    section: c.section,
    step: c.step,
  }),
);

/* ─── Component map ─── */

const componentMap: Record<string, React.FC<unknown>> = {
  ButterflyPhase,
  CardioidGlow,
  CardioidHeart,
  FivePetalSpiral,
  FourierFlow,
  FourPetalSpiral,
  HeartWave,
  HypotrochoidLoop,
  LemniscateBloom,
  LissajousDrift,
  OriginalThinking,
  RoseCurve,
  RoseFour,
  RoseOrbit,
  RoseThree,
  RoseTwo,
  SixPetalSpiral,
  SpiralSearch,
  ThinkingFive,
  ThinkingNine,
  ThreePetalSpiral,
};

/* ─── Curve config array ─── */

export const CURVE_CONFIGS: CurvePlaygroundConfig[] = curvesData.curves.map(
  (entry, index) => ({
    color: colorMap[entry.name]!,
    component: componentMap[entry.component],
    controls: [
      ...entry.controls.filter((c) => c.section === "formula"),
      ...GLOBAL_CONTROLS,
    ],
    defaults: { ...entry.defaults },
    description: entry.description,
    formula: entry.formula,
    importLabel: entry.importLabel,
    name: entry.name,
    source: makeComponentSource(entry.name, index),
    tag: entry.tag,
  }),
);

/* ─── Helpers ─── */

function makeComponentSource(
  componentName: string,
  curveIndex: number,
): string {
  return `import CurveLoader from '../components/CurveLoader';
import { curves, mergeConfig } from '../data/curves';
import type { CurveConfig } from '../data/curves';

const config = curves[${curveIndex}];

export interface ${componentName}Props {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function ${componentName}({
  config: overrideConfig,
  className,
  style,
}: ${componentName}Props) {
  const merged = mergeConfig(config, overrideConfig);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <CurveLoader
        config={merged}
        className={className}
        style={style}
      />
    </div>
  );
}

/** Default configuration for this curve. */
${componentName}.config = config;
`;
}

export function toPascal(name: string): string {
  return name.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s/g, "");
}

export function formatNum(v: number): string {
  if (Number.isInteger(v)) return String(v);
  if (Math.abs(v) < 10) return Number(v.toFixed(2)).toString();
  return Number(v.toFixed(1)).toString();
}

export function generateCode(
  curve: CurvePlaygroundConfig,
  values: Record<string, number>,
): string {
  const name = toPascal(curve.name);
  const keys = Object.keys(values);
  const configStr = `  config={\n${keys
    .map((key) => `    ${key}: ${formatNum(values[key])},`)
    .join("\n")}\n  }`;
  return `<${name}\n  ${configStr}\n  style={{ width: 120, height: 120, color: '${curve.color}' }}\n/>`;
}
