import type { CurveConfig } from "@math-curve-loaders/react";
import {
  OriginalThinking,
  ThinkingFive,
  ThinkingNine,
  RoseOrbit,
  RoseCurve,
  RoseTwo,
  RoseThree,
  RoseFour,
  LissajousDrift,
  LemniscateBloom,
  HypotrochoidLoop,
  ThreePetalSpiral,
  FourPetalSpiral,
  FivePetalSpiral,
  SixPetalSpiral,
  ButterflyPhase,
  CardioidGlow,
  CardioidHeart,
  HeartWave,
  SpiralSearch,
  FourierFlow,
} from "@math-curve-loaders/react";
import curvesData from "./data/curves.json" with { type: "json" };

/* ─── Types ─── */

export interface ControlDef {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  section?: "formula" | "visual";
}

export interface CurvePlaygroundConfig {
  name: string;
  tag: string;
  description: string;
  component: React.FC<{
    config?: Partial<CurveConfig>;
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
  controls: ControlDef[];
  defaults: Record<string, number>;
  importLabel: string;
  formula: string;
  source?: string;
}

/* ─── Data from JSON ─── */

const colorMap = Object.fromEntries(
  curvesData.curves.map((c, i) => [c.name, curvesData.colors[i]])
);

export const GLOBAL_CONTROLS: ControlDef[] = curvesData.globalControls.map(
  (c) => ({
    key: c.key,
    label: c.label,
    description: c.description,
    min: c.min,
    max: c.max,
    step: c.step,
    section: c.section,
  })
);

/* ─── Component map ─── */

const componentMap: Record<string, React.FC<any>> = {
  OriginalThinking,
  ThinkingFive,
  ThinkingNine,
  RoseOrbit,
  RoseCurve,
  RoseTwo,
  RoseThree,
  RoseFour,
  LissajousDrift,
  LemniscateBloom,
  HypotrochoidLoop,
  ThreePetalSpiral,
  FourPetalSpiral,
  FivePetalSpiral,
  SixPetalSpiral,
  ButterflyPhase,
  CardioidGlow,
  CardioidHeart,
  HeartWave,
  SpiralSearch,
  FourierFlow,
};

/* ─── Curve config array ─── */

export const CURVE_CONFIGS: CurvePlaygroundConfig[] = curvesData.curves.map(
  (entry, index) => ({
    name: entry.name,
    tag: entry.tag,
    description: entry.description,
    component: componentMap[entry.component],
    color: colorMap[entry.name]!,
    defaults: { ...entry.defaults },
    controls: [
      ...entry.controls.filter((c) => c.section === "formula"),
      ...GLOBAL_CONTROLS,
    ],
    formula: entry.formula,
    importLabel: entry.importLabel,
    source: makeComponentSource(entry.name, index),
  })
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
  const configStr =
    "  config={\n" +
    keys.map((key) => `    ${key}: ${formatNum(values[key])},`).join("\n") +
    "\n  }";
  return `<${name}\n  ${configStr}\n  style={{ width: 120, height: 120, color: '${curve.color}' }}\n/>`;
}
