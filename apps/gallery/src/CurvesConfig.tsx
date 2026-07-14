import type { CurveConfig } from '@math-curve-loaders/react';
import {
  OriginalThinking, ThinkingFive, ThinkingNine, RoseOrbit,
  RoseCurve, RoseTwo, RoseThree, RoseFour, LissajousDrift,
  LemniscateBloom, HypotrochoidLoop, ThreePetalSpiral,
  FourPetalSpiral, FivePetalSpiral, SixPetalSpiral,
  ButterflyPhase, CardioidGlow, CardioidHeart, HeartWave,
  SpiralSearch, FourierFlow,
} from '@math-curve-loaders/react';

/* ─── Types ─── */

export interface ControlDef {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  section: 'formula' | 'visual';
}

export interface CurvePlaygroundConfig {
  name: string;
  tag: string;
  description: string;
  component: React.FC<{ config?: Partial<CurveConfig>; className?: string; style?: React.CSSProperties }>;
  color: string;
  controls: ControlDef[];
  defaults: Record<string, number>;
  importLabel: string;
  formula: string;
  source?: string;
}

/* ─── Global controls ─── */

export const GLOBAL_CONTROLS: ControlDef[] = [
  { key: 'particleCount', label: 'Particles', description: 'Number of particles in the animated trail — more creates a denser, fuller trail.', min: 24, max: 140, step: 1, section: 'visual' },
  { key: 'trailSpan', label: 'Trail', description: 'How long the particle trail appears — longer trails create smoother, more continuous paths.', min: 0.12, max: 0.68, step: 0.01, section: 'visual' },
  { key: 'durationMs', label: 'Loop', description: 'Duration of one full animation loop cycle — controls the overall animation speed.', min: 2400, max: 12000, step: 100, section: 'visual' },
  { key: 'pulseDurationMs', label: 'Pulse', description: 'Speed of the breathing/pulse modulation — how fast the shape expands and contracts.', min: 1800, max: 10000, step: 100, section: 'visual' },
  { key: 'rotationDurationMs', label: 'Rotate Duration', description: 'Speed of the full rotation — how long a complete rotation takes.', min: 6000, max: 60000, step: 500, section: 'visual' },
  { key: 'strokeWidth', label: 'Stroke', description: 'Thickness of the curve stroke — controls line thickness.', min: 2.5, max: 7.5, step: 0.1, section: 'visual' },
];

/* ─── Curve config array ─── */

export const CURVE_CONFIGS: CurvePlaygroundConfig[] = [
  {
    name: 'Original Thinking', tag: 'Custom Rose Trail',
    description: 'The base circle is carved by a sevenfold cosine term, so the trail blooms into a rotating seven-petal ring.',
    component: OriginalThinking, color: '#6366f1',
    importLabel: 'import { OriginalThinking } from "@math-curve-loaders/react";',
    defaults: {
      baseRadius: 8, detailAmplitude: 4, petalCount: 7, curveScale: 3.5,
      particleCount: 64, trailSpan: 0.38, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 5.5,
    },
    formula: `x(t) = 50 + (8.0 cos(t) - 4.0 s × cos(7t)) × 3.5
y(t) = 50 + (8.0 sin(t) - 4.0 s × sin(7t)) × 3.5
s = ε(t)`,
    source: makeComponentSource('OriginalThinking', 0),
    controls: [
      { key: 'baseRadius', label: 'Base radius', description: 'Radius of the base circle that the curve orbits around.', min: 4, max: 10, step: 0.1, section: 'formula' },
      { key: 'detailAmplitude', label: 'Detail', description: 'Amplitude of the inner cosine term that carves the petal details.', min: 1, max: 5, step: 0.1, section: 'formula' },
      { key: 'petalCount', label: 'Petals', description: 'Number of petals or lobes in the rose curve — higher values create denser patterns.', min: 3, max: 12, step: 1, section: 'formula' },
      { key: 'curveScale', label: 'Scale', description: 'Overall scaling factor for the curve — larger values stretch the curve wider.', min: 2.5, max: 5.5, step: 0.1, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Thinking Five', tag: 'Custom Rose Trail',
    description: 'Replacing the sevenfold term with a fivefold term reduces the inner loops, giving the curve a cleaner five-petal rhythm.',
    component: ThinkingFive, color: '#8b5cf6',
    importLabel: 'import { ThinkingFive } from "@math-curve-loaders/react";',
    defaults: {
      baseRadius: 8, detailAmplitude: 4, petalCount: 5, curveScale: 3.5,
      particleCount: 62, trailSpan: 0.38, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 5.5,
    },
    formula: `x(t) = 50 + (8.0 cos(t) - 4.0 s × cos(5t)) × 3.5
y(t) = 50 + (8.0 sin(t) - 4.0 s × sin(5t)) × 3.5
s = ε(t)`,
    source: makeComponentSource('ThinkingFive', 1),
    controls: [
      { key: 'baseRadius', label: 'Base radius', description: 'Radius of the base circle that the curve orbits around.', min: 4, max: 10, step: 0.1, section: 'formula' },
      { key: 'detailAmplitude', label: 'Detail', description: 'Amplitude of the inner cosine term that carves the petal details.', min: 1, max: 5, step: 0.1, section: 'formula' },
      { key: 'petalCount', label: 'Petals', description: 'Number of petals or lobes in the rose curve — higher values create denser patterns.', min: 3, max: 12, step: 1, section: 'formula' },
      { key: 'curveScale', label: 'Scale', description: 'Overall scaling factor for the curve — larger values stretch the curve wider.', min: 2.5, max: 5.5, step: 0.1, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Thinking Nine', tag: 'Custom Rose Trail',
    description: 'A ninefold term packs more inner turns into the same orbit, so the floral ring feels denser and more finely braided.',
    component: ThinkingNine, color: '#a855f7',
    importLabel: 'import { ThinkingNine } from "@math-curve-loaders/react";',
    defaults: {
      baseRadius: 8, detailAmplitude: 4, petalCount: 9, curveScale: 3.5,
      particleCount: 68, trailSpan: 0.39, durationMs: 4700,
      pulseDurationMs: 4200, rotationDurationMs: 30000, strokeWidth: 5.5,
    },
    formula: `x(t) = 50 + (8.0 cos(t) - 4.0 s × cos(9t)) × 3.5
y(t) = 50 + (8.0 sin(t) - 4.0 s × sin(9t)) × 3.5
s = ε(t)`,
    source: makeComponentSource('ThinkingNine', 2),
    controls: [
      { key: 'baseRadius', label: 'Base radius', description: 'Radius of the base circle that the curve orbits around.', min: 4, max: 10, step: 0.1, section: 'formula' },
      { key: 'detailAmplitude', label: 'Detail', description: 'Amplitude of the inner cosine term that carves the petal details.', min: 1, max: 5, step: 0.1, section: 'formula' },
      { key: 'petalCount', label: 'Petals', description: 'Number of petals or lobes in the rose curve — higher values create denser patterns.', min: 3, max: 12, step: 1, section: 'formula' },
      { key: 'curveScale', label: 'Scale', description: 'Overall scaling factor for the curve — larger values stretch the curve wider.', min: 2.5, max: 5.5, step: 0.1, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Orbit', tag: 'r = cos(kθ)',
    description: 'The radius expands and contracts with cos(7t), so the orbit breathes as it spins.',
    component: RoseOrbit, color: '#d946ef',
    importLabel: 'import { RoseOrbit } from "@math-curve-loaders/react";',
    defaults: {
      orbitRadius: 8, detailAmplitude: 3.5, petalCount: 7, curveScale: 3.3,
      particleCount: 72, trailSpan: 0.42, durationMs: 5200,
      pulseDurationMs: 4600, rotationDurationMs: 28000, strokeWidth: 5.2,
    },
    formula: `r(t) = 8.0 + 3.5 × cos(7 × t)
x(t) = r(t) × cos(t) × 3.3 + 50
y(t) = r(t) × sin(t) × 3.3 + 50`,
    source: makeComponentSource('RoseOrbit', 3),
    controls: [
      { key: 'orbitRadius', label: 'Base radius', description: 'Base radius of the orbiting rose curve.', min: 4, max: 10, step: 0.1 },
      { key: 'detailAmplitude', label: 'Detail', description: 'Amplitude of the modulating cosine that creates the petal shape.', min: 1, max: 5, step: 0.1 },
      { key: 'petalCount', label: 'k', description: 'The k parameter in cos(kθ) — controls the number of lobes.', min: 3, max: 12, step: 1 },
      { key: 'curveScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2.5, max: 5.5, step: 0.1 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Curve', tag: 'r = a cos(kθ)',
    description: 'Using r = a cos(5t) creates five evenly spaced lobes, the breathing modulation gives them a living pulse.',
    component: RoseCurve, color: '#ec4899',
    importLabel: 'import { RoseCurve } from "@math-curve-loaders/react";',
    defaults: {
      roseA: 10.5, roseABoost: 0.9, roseBreathBase: 0.68, roseBreathBoost: 0.42, roseK: 5, roseScale: 3.0,
      particleCount: 78, trailSpan: 0.32, durationMs: 5400,
      pulseDurationMs: 4600, rotationDurationMs: 28000, strokeWidth: 4.5,
    },
    formula: `r(t) = (roseA + roseABoost × sin(t)) × cos(roseK × t) × (roseBreathBase + roseBreathBoost × sin(pulseTime))
x(t) = r(t) × cos(t) × roseScale + 50
y(t) = r(t) × sin(t) × roseScale + 50`,
    source: makeComponentSource('RoseCurve', 4),
    controls: [
      { key: 'roseA', label: 'a', description: 'The "a" parameter in r = a cos(kθ) — sets the base size of the rose.', min: 5, max: 14, step: 0.1, section: 'formula' },
      { key: 'roseABoost', label: 'a boost', description: 'Sinusoidal modulation on "a" — adds organic variation to the radius.', min: 0, max: 2, step: 0.05, section: 'formula' },
      { key: 'roseBreathBase', label: 'Base pulse', description: 'Base breathing value — the minimum scale of the pulse animation.', min: 0.3, max: 1.2, step: 0.01, section: 'formula' },
      { key: 'roseBreathBoost', label: 'Pulse boost', description: 'Amplitude of the breathing pulse — how much the shape expands and contracts.', min: 0, max: 0.8, step: 0.01, section: 'formula' },
      { key: 'roseK', label: 'k', description: 'The "k" parameter in r = a cos(kθ) — controls the number of lobes.', min: 2, max: 10, step: 1, section: 'formula' },
      { key: 'roseScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2, max: 5, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Two', tag: 'r = a cos(2θ)',
    description: 'With k = 2, the cosine radius forms broad opposing petals, the breathing adds life.',
    component: RoseTwo, color: '#f43f5e',
    importLabel: 'import { RoseTwo } from "@math-curve-loaders/react";',
    defaults: {
      roseA: 10.5, roseABoost: 0.9, roseBreathBase: 0.68, roseBreathBoost: 0.42, roseScale: 3.0,
      particleCount: 74, trailSpan: 0.3, durationMs: 5200,
      pulseDurationMs: 4300, rotationDurationMs: 28000, strokeWidth: 4.6,
    },
    formula: `r(t) = (roseA + roseABoost × sin(t)) × cos(2 × t) × (roseBreathBase + roseBreathBoost × sin(pulseTime))
x(t) = r(t) × cos(t) × roseScale + 50
y(t) = r(t) × sin(t) × roseScale + 50`,
    source: makeComponentSource('RoseTwo', 5),
    controls: [
      { key: 'roseA', label: 'a', description: 'The "a" parameter in r = a cos(kθ) — sets the base size of the rose.', min: 5, max: 14, step: 0.1, section: 'formula' },
      { key: 'roseABoost', label: 'a boost', description: 'Sinusoidal modulation on "a" — adds organic variation to the radius.', min: 0, max: 2, step: 0.05, section: 'formula' },
      { key: 'roseBreathBase', label: 'Base pulse', description: 'Base breathing value — the minimum scale of the pulse animation.', min: 0.3, max: 1.2, step: 0.01, section: 'formula' },
      { key: 'roseBreathBoost', label: 'Pulse boost', description: 'Amplitude of the breathing pulse — how much the shape expands and contracts.', min: 0, max: 0.8, step: 0.01, section: 'formula' },
      { key: 'roseScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2, max: 5, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Three', tag: 'r = a cos(3θ)',
    description: 'With k = 3, the curve resolves into three rotating petals, the breathing modulation gives a living pulse.',
    component: RoseThree, color: '#ef4444',
    importLabel: 'import { RoseThree } from "@math-curve-loaders/react";',
    defaults: {
      roseA: 10.5, roseABoost: 0.9, roseBreathBase: 0.68, roseBreathBoost: 0.42, roseScale: 3.0,
      particleCount: 76, trailSpan: 0.31, durationMs: 5300,
      pulseDurationMs: 4400, rotationDurationMs: 28000, strokeWidth: 4.6,
    },
    formula: `r(t) = (roseA + roseABoost × sin(t)) × cos(3 × t) × (roseBreathBase + roseBreathBoost × sin(pulseTime))
x(t) = r(t) × cos(t) × roseScale + 50
y(t) = r(t) × sin(t) × roseScale + 50`,
    source: makeComponentSource('RoseThree', 6),
    controls: [
      { key: 'roseA', label: 'a', description: 'The "a" parameter in r = a cos(kθ) — sets the base size of the rose.', min: 5, max: 14, step: 0.1, section: 'formula' },
      { key: 'roseABoost', label: 'a boost', description: 'Sinusoidal modulation on "a" — adds organic variation to the radius.', min: 0, max: 2, step: 0.05, section: 'formula' },
      { key: 'roseBreathBase', label: 'Base pulse', description: 'Base breathing value — the minimum scale of the pulse animation.', min: 0.3, max: 1.2, step: 0.01, section: 'formula' },
      { key: 'roseBreathBoost', label: 'Pulse boost', description: 'Amplitude of the breathing pulse — how much the shape expands and contracts.', min: 0, max: 0.8, step: 0.01, section: 'formula' },
      { key: 'roseScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2, max: 5, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Four', tag: 'r = a cos(4θ)',
    description: 'With k = 4, the petals settle into a balanced cross-like rose, the breathing gives it life.',
    component: RoseFour, color: '#f97316',
    importLabel: 'import { RoseFour } from "@math-curve-loaders/react";',
    defaults: {
      roseA: 10.5, roseABoost: 0.9, roseBreathBase: 0.68, roseBreathBoost: 0.42, roseScale: 3.0,
      particleCount: 78, trailSpan: 0.32, durationMs: 5400,
      pulseDurationMs: 4500, rotationDurationMs: 28000, strokeWidth: 4.6,
    },
    formula: `r(t) = (roseA + roseABoost × sin(t)) × cos(4 × t) × (roseBreathBase + roseBreathBoost × sin(pulseTime))
x(t) = r(t) × cos(t) × roseScale + 50
y(t) = r(t) × sin(t) × roseScale + 50`,
    source: makeComponentSource('RoseFour', 7),
    controls: [
      { key: 'roseA', label: 'a', description: 'The "a" parameter in r = a cos(kθ) — sets the base size of the rose.', min: 5, max: 14, step: 0.1, section: 'formula' },
      { key: 'roseABoost', label: 'a boost', description: 'Sinusoidal modulation on "a" — adds organic variation to the radius.', min: 0, max: 2, step: 0.05, section: 'formula' },
      { key: 'roseBreathBase', label: 'Base pulse', description: 'Base breathing value — the minimum scale of the pulse animation.', min: 0.3, max: 1.2, step: 0.01, section: 'formula' },
      { key: 'roseBreathBoost', label: 'Pulse boost', description: 'Amplitude of the breathing pulse — how much the shape expands and contracts.', min: 0, max: 0.8, step: 0.01, section: 'formula' },
      { key: 'roseScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2, max: 5, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Lissajous Drift', tag: 'x = sin(at), y = sin(bt)',
    description: 'Different sine frequencies on x and y make the path cross itself, creating drift patterns.',
    component: LissajousDrift, color: '#f59e0b',
    importLabel: 'import { LissajousDrift } from "@math-curve-loaders/react";',
    defaults: {
      lissajousAmp: 28, lissajousAmpBoost: 8, lissajousAX: 3, lissajousBY: 4, lissajousPhase: 1.57, lissajousYScale: 0.85,
      particleCount: 68, trailSpan: 0.34, durationMs: 6000,
      pulseDurationMs: 5400, rotationDurationMs: 36000, strokeWidth: 4.7,
    },
    formula: `x(t) = (lissajousAmp + lissajousAmpBoost × sin(pulseTime)) × sin(lissajousAX × t + lissajousPhase) + 50
y(t) = x(t) × sin(lissajousBY × t) + 50`,
    source: makeComponentSource('LissajousDrift', 8),
    controls: [
      { key: 'lissajousAmp', label: 'Amplitude', description: 'Base amplitude of the Lissajous curve — controls the overall size.', min: 8, max: 36, step: 0.5, section: 'formula' },
      { key: 'lissajousAmpBoost', label: 'Amp pulse', description: 'Pulsing modulation on the amplitude — adds a breathing effect.', min: 0, max: 12, step: 0.1, section: 'formula' },
      { key: 'lissajousAX', label: 'a', description: 'Frequency parameter "a" for the x-axis sine wave.', min: 1, max: 8, step: 1, section: 'formula' },
      { key: 'lissajousBY', label: 'b', description: 'Frequency parameter "b" for the y-axis sine wave.', min: 1, max: 8, step: 1, section: 'formula' },
      { key: 'lissajousYScale', label: 'Y scale', description: 'Vertical scaling factor — stretches or compresses the y-axis.', min: 0.4, max: 1.4, step: 0.01, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Lemniscate Bloom', tag: 'Bernoulli Lemniscate',
    description: 'The 1 + sin²t denominator pinches the center while preserving the figure-eight shape, creating a blooming infinity symbol.',
    component: LemniscateBloom, color: '#eab308',
    importLabel: 'import { LemniscateBloom } from "@math-curve-loaders/react";',
    defaults: {
      lemniscateA: 24, lemniscateBoost: 9,
      particleCount: 70, trailSpan: 0.4, durationMs: 5600,
      pulseDurationMs: 5000, rotationDurationMs: 34000, strokeWidth: 4.8,
    },
    formula: `r(t) = lemniscateA × cos(t) / (1 + sin²(t)) + lemniscateBoost × sin(pulseTime)
x(t) = r(t) × cos(t) + 50
y(t) = r(t) × sin(t) + 50`,
    source: makeComponentSource('LemniscateBloom', 9),
    controls: [
      { key: 'lemniscateA', label: 'a', description: 'The "a" parameter of the Bernoulli lemniscate — sets the size of the figure-eight.', min: 8, max: 30, step: 0.5, section: 'formula' },
      { key: 'lemniscateBoost', label: 'Pulse', description: 'Sinusoidal pulse added to the radius — creates the blooming animation.', min: 0, max: 12, step: 0.1, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Hypotrochoid Loop', tag: 'Inner Spirograph',
    description: 'The rolling-circle terms create nested turns and offsets, so the trail draws spirograph-style loops.',
    component: HypotrochoidLoop, color: '#84cc16',
    importLabel: 'import { HypotrochoidLoop } from "@math-curve-loaders/react";',
    defaults: {
      spiroR: 8.5, spiror: 2.3, spirorBoost: 0.55, spirod: 5.5, spirodBoost: 1.5, spiroScale: 2.85,
      particleCount: 82, trailSpan: 0.46, durationMs: 7600,
      pulseDurationMs: 6200, rotationDurationMs: 42000, strokeWidth: 4.6,
    },
    formula: `x(t) = (spiroR - spiror) × cos(t) + spirod × cos((spiroR - spiror) / spiror × t)
y(t) = (spiroR - spiror) × sin(t) - spirod × sin((spiroR - spiror) / spiror × t)
x' = (x + spirodBoost × sin(pulseTime)) × spiroScale + 50
y' = (y + spirodBoost × sin(pulseTime)) × spiroScale + 50`,
    source: makeComponentSource('HypotrochoidLoop', 10),
    controls: [
      { key: 'spiroR', label: 'R', description: 'Radius of the fixed outer circle in the rolling-circle spirograph.', min: 4, max: 12, step: 0.1, section: 'formula' },
      { key: 'spiror', label: 'r', description: 'Radius of the rolling inner circle — together with R determines the pattern.', min: 1, max: 5, step: 0.1, section: 'formula' },
      { key: 'spirod', label: 'd', description: 'Distance of the drawing point from the center of the rolling circle.', min: 1, max: 8, step: 0.1, section: 'formula' },
      { key: 'spiroScale', label: 'Scale', description: 'Overall scaling factor for the spirograph.', min: 1.5, max: 4.5, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Three-Petal Spiral', tag: 'R = 3, r = 1, d = 3',
    description: 'This rolling-circle setup resolves into three large looping petals, the breathing adds a gentle pulse.',
    component: ThreePetalSpiral, color: '#22c55e',
    importLabel: 'import { ThreePetalSpiral } from "@math-curve-loaders/react";',
    defaults: {
      spiralR: 3, spiralr: 1, spirald: 3, spiralScale: 2.4, spiralBreath: 0.55,
      particleCount: 82, trailSpan: 0.34, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 4.4,
    },
    formula: `x(t) = (spiralR - spiralr) × cos(t) + spirald × cos((spiralR - spiralr) / spiralr × t)
y(t) = (spiralR - spiralr) × sin(t) - spirald × sin((spiralR - spiralr) / spiralr × t) × (1 + spiralBreath × sin(pulseTime))
x' = x × spiralScale + 50
y' = y × spiralScale + 50`,
    source: makeComponentSource('ThreePetalSpiral', 11),
    controls: [
      { key: 'spiralR', label: 'R', description: 'Radius of the fixed outer circle.', min: 2, max: 8, step: 1, section: 'formula' },
      { key: 'spiralr', label: 'r', description: 'Radius of the rolling inner circle.', min: 1, max: 3, step: 0.1, section: 'formula' },
      { key: 'spirald', label: 'd', description: 'Distance of the drawing point from the rolling circle center.', min: 1, max: 5, step: 0.1, section: 'formula' },
      { key: 'spiralScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 1.2, max: 3.5, step: 0.05, section: 'formula' },
      { key: 'spiralBreath', label: 'Pulse', description: 'Breathing modulation amplitude on the y-axis — adds a living pulse.', min: 0, max: 1, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Four-Petal Spiral', tag: 'R = 4, r = 1, d = 3',
    description: 'Four-lobe spirograph pattern from R=4, r=1, d=3 — the breathing adds life to each petal.',
    component: FourPetalSpiral, color: '#10b981',
    importLabel: 'import { FourPetalSpiral } from "@math-curve-loaders/react";',
    defaults: {
      spiralR: 4.5, spiralr: 1, spirald: 3, spiralScale: 2.4, spiralBreath: 0.55,
      particleCount: 84, trailSpan: 0.34, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 4.4,
    },
    formula: `x(t) = (spiralR - spiralr) × cos(t) + spirald × cos((spiralR - spiralr) / spiralr × t)
y(t) = (spiralR - spiralr) × sin(t) - spirald × sin((spiralR - spiralr) / spiralr × t) × (1 + spiralBreath × sin(pulseTime))
x' = x × spiralScale + 50
y' = y × spiralScale + 50`,
    source: makeComponentSource('FourPetalSpiral', 12),
    controls: [
      { key: 'spiralR', label: 'R', description: 'Radius of the fixed outer circle.', min: 2, max: 8, step: 1, section: 'formula' },
      { key: 'spiralr', label: 'r', description: 'Radius of the rolling inner circle.', min: 1, max: 3, step: 0.1, section: 'formula' },
      { key: 'spirald', label: 'd', description: 'Distance of the drawing point from the rolling circle center.', min: 1, max: 5, step: 0.1, section: 'formula' },
      { key: 'spiralScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 1.2, max: 3.5, step: 0.05, section: 'formula' },
      { key: 'spiralBreath', label: 'Pulse', description: 'Breathing modulation amplitude on the y-axis — adds a living pulse.', min: 0, max: 1, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Five-Petal Spiral', tag: 'R = 5, r = 1, d = 3',
    description: 'Five-fold spirograph spiral — the breathing modulation gives each petal a living pulse.',
    component: FivePetalSpiral, color: '#14b8a6',
    importLabel: 'import { FivePetalSpiral } from "@math-curve-loaders/react";',
    defaults: {
      spiralR: 5.5, spiralr: 1, spirald: 3, spiralScale: 2.4, spiralBreath: 0.55,
      particleCount: 85, trailSpan: 0.34, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 4.4,
    },
    formula: `x(t) = (spiralR - spiralr) × cos(t) + spirald × cos((spiralR - spiralr) / spiralr × t)
y(t) = (spiralR - spiralr) × sin(t) - spirald × sin((spiralR - spiralr) / spiralr × t) × (1 + spiralBreath × sin(pulseTime))
x' = x × spiralScale + 50
y' = y × spiralScale + 50`,
    source: makeComponentSource('FivePetalSpiral', 13),
    controls: [
      { key: 'spiralR', label: 'R', description: 'Radius of the fixed outer circle.', min: 2, max: 8, step: 1, section: 'formula' },
      { key: 'spiralr', label: 'r', description: 'Radius of the rolling inner circle.', min: 1, max: 3, step: 0.1, section: 'formula' },
      { key: 'spirald', label: 'd', description: 'Distance of the drawing point from the rolling circle center.', min: 1, max: 5, step: 0.1, section: 'formula' },
      { key: 'spiralScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 1.2, max: 3.5, step: 0.05, section: 'formula' },
      { key: 'spiralBreath', label: 'Pulse', description: 'Breathing modulation amplitude on the y-axis — adds a living pulse.', min: 0, max: 1, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Six-Petal Spiral', tag: 'R = 6, r = 1, d = 3',
    description: 'Six-fold spirograph spiral — dense, symmetrical, with breathing modulation.',
    component: SixPetalSpiral, color: '#06b6d4',
    importLabel: 'import { SixPetalSpiral } from "@math-curve-loaders/react";',
    defaults: {
      spiralR: 6.5, spiralr: 1, spirald: 3, spiralScale: 2.4, spiralBreath: 0.55,
      particleCount: 86, trailSpan: 0.34, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 4.4,
    },
    formula: `x(t) = (spiralR - spiralr) × cos(t) + spirald × cos((spiralR - spiralr) / spiralr × t)
y(t) = (spiralR - spiralr) × sin(t) - spirald × sin((spiralR - spiralr) / spiralr × t) × (1 + spiralBreath × sin(pulseTime))
x' = x × spiralScale + 50
y' = y × spiralScale + 50`,
    source: makeComponentSource('SixPetalSpiral', 14),
    controls: [
      { key: 'spiralR', label: 'R', description: 'Radius of the fixed outer circle.', min: 2, max: 8, step: 1, section: 'formula' },
      { key: 'spiralr', label: 'r', description: 'Radius of the rolling inner circle.', min: 1, max: 3, step: 0.1, section: 'formula' },
      { key: 'spirald', label: 'd', description: 'Distance of the drawing point from the rolling circle center.', min: 1, max: 5, step: 0.1, section: 'formula' },
      { key: 'spiralScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 1.2, max: 3.5, step: 0.05, section: 'formula' },
      { key: 'spiralBreath', label: 'Pulse', description: 'Breathing modulation amplitude on the y-axis — adds a living pulse.', min: 0, max: 1, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Butterfly Phase', tag: 'Butterfly Curve',
    description: 'A rich butterfly curve with exponential decay creating delicate wings — phase animation adds depth.',
    component: ButterflyPhase, color: '#0ea5e9',
    importLabel: 'import { ButterflyPhase } from "@math-curve-loaders/react";',
    defaults: {
      butterflyTurns: 14, butterflyScale: 4.2, butterflyPulse: 0.55, butterflyCosWeight: 2.5, butterflyPower: 4,
      particleCount: 88, trailSpan: 0.32, durationMs: 9000,
      pulseDurationMs: 7000, rotationDurationMs: 50000, strokeWidth: 4.4,
    },
    formula: `r(t) = e^cos(t) - 2cos(4×turns×t) + sin³t + butterflyCosWeight × cos(6×butterflyPower×t)
x(t) = r(t) × cos t × butterflyScale + 50
y(t) = r(t) × sin t × butterflyScale + 50
pulse = 1 + butterflyPulse × sin(pulseTime)`,
    source: makeComponentSource('ButterflyPhase', 15),
    controls: [
      { key: 'butterflyTurns', label: 'Turns', description: 'Number of turns in the butterfly wing pattern — higher values add more detail.', min: 6, max: 18, step: 0.5, section: 'formula' },
      { key: 'butterflyScale', label: 'Scale', description: 'Overall scaling factor for the butterfly curve.', min: 2.5, max: 7, step: 0.05, section: 'formula' },
      { key: 'butterflyPulse', label: 'Pulse', description: 'Breathing modulation amplitude — how much the butterfly expands and contracts.', min: 0, max: 1.2, step: 0.01, section: 'formula' },
      { key: 'butterflyCosWeight', label: 'Cos weight', description: 'Weight of the secondary cosine term — controls wing complexity.', min: 0.5, max: 4, step: 0.05, section: 'formula' },
      { key: 'butterflyPower', label: 'Power', description: 'Power of the inner cosine modulation — affects wing pattern density.', min: 2, max: 8, step: 1, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Cardioid Glow', tag: 'Cardioid',
    description: 'A heart-shaped cardioid curve with breathing glow — the pulse modulation gives it life.',
    component: CardioidGlow, color: '#3b82f6',
    importLabel: 'import { CardioidGlow } from "@math-curve-loaders/react";',
    defaults: {
      cardioidA: 9.2, cardioidPulse: 1.0, cardioidScale: 2.0,
      particleCount: 72, trailSpan: 0.36, durationMs: 6200,
      pulseDurationMs: 5200, rotationDurationMs: 36000, strokeWidth: 4.9,
    },
    formula: `r(t) = cardioidA × (1 - cos(t)) × (1 + cardioidPulse × sin(pulseTime))
x(t) = r(t) × cos t × cardioidScale + 50
y(t) = r(t) × sin t × cardioidScale + 50`,
    source: makeComponentSource('CardioidGlow', 16),
    controls: [
      { key: 'cardioidA', label: 'a', description: 'The "a" parameter in the cardioid equation — sets the base size.', min: 4, max: 14, step: 0.1, section: 'formula' },
      { key: 'cardioidPulse', label: 'Pulse', description: 'Amplitude of the breathing pulse — how much the cardioid expands and contracts.', min: 0, max: 2, step: 0.05, section: 'formula' },
      { key: 'cardioidScale', label: 'Scale', description: 'Overall scaling factor for the cardioid.', min: 1, max: 3.5, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Cardioid Heart', tag: 'r = a(1+cosθ)',
    description: 'The classic cardioid heart shape — the breathing adds a gentle pulse.',
    component: CardioidHeart, color: '#7c3aed',
    importLabel: 'import { CardioidHeart } from "@math-curve-loaders/react";',
    defaults: {
      cardioidA: 9.2, cardioidPulse: 1.0, cardioidScale: 2.0,
      particleCount: 74, trailSpan: 0.36, durationMs: 6200,
      pulseDurationMs: 5200, rotationDurationMs: 36000, strokeWidth: 4.9,
    },
    formula: `r(t) = cardioidA × (1 + cos(t)) × (1 + cardioidPulse × sin(pulseTime))
x(t) = r(t) × cos t × cardioidScale + 50
y(t) = r(t) × sin t × cardioidScale + 50`,
    source: makeComponentSource('CardioidHeart', 17),
    controls: [
      { key: 'cardioidA', label: 'a', description: 'The "a" parameter in r = a(1+cosθ) — sets the size of the heart.', min: 4, max: 14, step: 0.1 },
      { key: 'cardioidPulse', label: 'Pulse', description: 'Amplitude of the breathing pulse — how much the heart expands and contracts.', min: 0, max: 2, step: 0.05 },
      { key: 'cardioidScale', label: 'Scale', description: 'Overall scaling factor for the cardioid.', min: 1, max: 3.5, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Heart Wave', tag: 'f(x) Heart Wave',
    description: 'A wavy heart-shaped curve drawn by a parametric function — the wave amplitude adds organic motion.',
    component: HeartWave, color: '#e11d48',
    importLabel: 'import { HeartWave } from "@math-curve-loaders/react";',
    defaults: {
      heartWaveB: 8.0, heartWaveRoot: 3.6, heartWaveAmp: 0.7, heartWaveScaleX: 21.5, heartWaveScaleY: 22.8,
      particleCount: 104, trailSpan: 0.18, durationMs: 8400,
      pulseDurationMs: 5600, rotationDurationMs: 22000, strokeWidth: 3.9,
    },
    formula: `x(t) = heartWaveB × Sin(t) × √(|cos(t)|) / (Sin(t) + 1.4) × heartWaveScaleX + 50
y(t) = (heartWaveB × cos(t) - heartWaveB × sin(t) - 2 × cos(t) - √(|cos(t)|)) × heartWaveAmp × heartWaveScaleY + 50`,
    source: makeComponentSource('HeartWave', 18),
    controls: [
      { key: 'heartWaveB', label: 'b', description: 'The "b" parameter — scales the heart wave amplitude.', min: 2, max: 12, step: 0.1, section: 'formula' },
      { key: 'heartWaveRoot', label: 'Root span', description: 'Span of the square root term — controls the heart tip sharpness.', min: 2.2, max: 4.2, step: 0.05, section: 'formula' },
      { key: 'heartWaveAmp', label: 'Wave amp', description: 'Amplitude of the wave modulation — adds organic wavy motion.', min: 0.3, max: 1.6, step: 0.05, section: 'formula' },
      { key: 'heartWaveScaleX', label: 'X scale', description: 'Horizontal scaling factor.', min: 14, max: 30, step: 0.1, section: 'formula' },
      { key: 'heartWaveScaleY', label: 'Y scale', description: 'Vertical scaling factor.', min: 14, max: 34, step: 0.1, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Spiral Search', tag: 'Archimedean Spiral',
    description: 'An expanding Archimedean spiral that sweeps outward — the pulse adds breathing motion to the turns.',
    component: SpiralSearch, color: '#6d28d8',
    importLabel: 'import { SpiralSearch } from "@math-curve-loaders/react";',
    defaults: {
      searchTurns: 5, searchBaseRadius: 10, searchRadiusAmp: 7.0, searchPulse: 2.8, searchScale: 1.1,
      particleCount: 86, trailSpan: 0.28, durationMs: 7800,
      pulseDurationMs: 6800, rotationDurationMs: 44000, strokeWidth: 4.3,
    },
    formula: `r(t) = searchBaseRadius + searchRadiusAmp × t / (2π × searchTurns) + searchPulse × sin(pulseTime)
x(t) = r(t) × cos(t) × searchScale + 50
y(t) = r(t) × sin(t) × searchScale + 50`,
    source: makeComponentSource('SpiralSearch', 19),
    controls: [
      { key: 'searchTurns', label: 'Turns', description: 'Number of spiral turns — more turns create a denser spiral.', min: 2, max: 8, step: 0.1, section: 'formula' },
      { key: 'searchBaseRadius', label: 'Base radius', description: 'Inner starting radius of the spiral.', min: 2, max: 16, step: 0.1, section: 'formula' },
      { key: 'searchRadiusAmp', label: 'Radius amp', description: 'Rate at which the radius expands per turn.', min: 2, max: 16, step: 0.1, section: 'formula' },
      { key: 'searchPulse', label: 'Pulse', description: 'Breathing modulation on the radius — adds a living pulse to the spiral.', min: 0, max: 6, step: 0.1, section: 'formula' },
      { key: 'searchScale', label: 'Scale', description: 'Overall scaling factor for the spiral.', min: 0.5, max: 1.8, step: 0.05, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Fourier Flow', tag: 'Fourier Curve',
    description: 'A sum of sine and cosine terms creating a complex flowing shape — the mix pulse modulates the phase.',
    component: FourierFlow, color: '#4f46e5',
    importLabel: 'import { FourierFlow } from "@math-curve-loaders/react";',
    defaults: {
      fourierX1: 18, fourierX3: 6.5, fourierX5: 2.8, fourierY1: 16, fourierY2: 7.5, fourierY4: 3.8, fourierMixBase: 1.1, fourierMixPulse: 0.2,
      particleCount: 92, trailSpan: 0.31, durationMs: 8400,
      pulseDurationMs: 6800, rotationDurationMs: 44000, strokeWidth: 4.2,
    },
    formula: `x(t) = fourierX1 × cos(t) + fourierX3 × cos(3t) + fourierX5 × sin(5t) + 50
y(t) = fourierY1 × sin(t) + fourierY2 × sin(2t) + fourierY4 × cos(4t) + 50
mix = fourierMixBase + fourierMixPulse × sin(pulseTime)`,
    source: makeComponentSource('FourierFlow', 20),
    controls: [
      { key: 'fourierX1', label: 'x cos1', description: 'Coefficient of cos(t) in the x equation — primary horizontal harmonic.', min: 4, max: 24, step: 0.1, section: 'formula' },
      { key: 'fourierX3', label: 'x cos3', description: 'Coefficient of cos(3t) in the x equation — third harmonic.', min: 0, max: 14, step: 0.1, section: 'formula' },
      { key: 'fourierX5', label: 'x sin5', description: 'Coefficient of sin(5t) in the x equation — fifth harmonic.', min: 0, max: 10, step: 0.1, section: 'formula' },
      { key: 'fourierY1', label: 'y sin1', description: 'Coefficient of sin(t) in the y equation — primary vertical harmonic.', min: 4, max: 24, step: 0.1, section: 'formula' },
      { key: 'fourierY2', label: 'y sin2', description: 'Coefficient of sin(2t) in the y equation — second harmonic.', min: 0, max: 14, step: 0.1, section: 'formula' },
      { key: 'fourierY4', label: 'y cos4', description: 'Coefficient of cos(4t) in the y equation — fourth harmonic.', min: 0, max: 10, step: 0.1, section: 'formula' },
      { key: 'fourierMixPulse', label: 'Mix pulse', description: 'Phase modulation pulse — adds organic variation to the shape.', min: 0, max: 0.8, step: 0.01, section: 'formula' },
      ...GLOBAL_CONTROLS,
    ],
  },
];

/* ─── Helpers ─── */

function makeComponentSource(componentName: string, curveIndex: number): string {
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
  return name.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s/g, '');
}

export function formatNum(v: number): string {
  if (Number.isInteger(v)) return String(v);
  if (Math.abs(v) < 10) return Number(v.toFixed(2)).toString();
  return Number(v.toFixed(1)).toString();
}

export function generateCode(curve: CurvePlaygroundConfig, values: Record<string, number>): string {
  const name = toPascal(curve.name);
  const keys = Object.keys(values);
  const configStr = '  config={\n' +
    keys.map((key) => `    ${key}: ${formatNum(values[key])},`).join('\n') +
    '\n  }';
  return `<${name}\n  ${configStr}\n  style={{ width: 120, height: 120, color: '${curve.color}' }}\n/>`;
}
