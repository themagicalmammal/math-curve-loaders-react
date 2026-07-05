import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { CurveConfig } from '@math-curve-loaders/react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import {
  OriginalThinking, ThinkingFive, ThinkingNine, RoseOrbit,
  RoseCurve, RoseTwo, RoseThree, RoseFour, LissajousDrift,
  LemniscateBloom, HypotrochoidLoop, ThreePetalSpiral,
  FourPetalSpiral, FivePetalSpiral, SixPetalSpiral,
  ButterflyPhase, CardioidGlow, CardioidHeart, HeartWave,
  SpiralSearch, FourierFlow,
} from '@math-curve-loaders/react';
import { Highlight, themes } from 'prism-react-renderer';
const { vsDark } = themes;
const { github: githubTheme } = themes;

/* ─── Control definitions matching the original repo (main.js) ─── */

interface ControlDef {
  key: string;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
}

interface CurveDef {
  name: string;
  tag: string;
  description: string;
  component: React.FC<{ config?: Partial<CurveConfig>; className?: string; style?: React.CSSProperties }>;
  controls: ControlDef[];
  defaults: Record<string, number>;
  color: string;
  formula: string;
}

/* Global parameters — exact ranges from the original CONTROL_DEFS */
const GLOBAL_CONTROLS: ControlDef[] = [
  { key: 'particleCount', label: 'Particles', description: 'Number of particles in the animated trail — more creates a denser, fuller trail.', min: 24, max: 140, step: 1 },
  { key: 'trailSpan', label: 'Trail', description: 'How long the particle trail appears — longer trails create smoother, more continuous paths.', min: 0.12, max: 0.68, step: 0.01 },
  { key: 'durationMs', label: 'Loop', description: 'Duration of one full animation loop cycle — controls the overall animation speed.', min: 2400, max: 12000, step: 100 },
  { key: 'pulseDurationMs', label: 'Pulse', description: 'Speed of the breathing/pulse modulation — how fast the shape expands and contracts.', min: 1800, max: 10000, step: 100 },
  { key: 'rotationDurationMs', label: 'Rotate Duration', description: 'Speed of the full rotation — how long a complete rotation takes.', min: 6000, max: 60000, step: 500 },
  { key: 'strokeWidth', label: 'Stroke', description: 'Thickness of the curve stroke — controls line thickness.', min: 2.5, max: 7.5, step: 0.1 },
];

/* Per-curve definitions — exact defaults from original main.js */
const CURVES: CurveDef[] = [
  {
    name: 'Original Thinking', tag: 'Custom Rose Trail', description: 'The base circle is carved by a sevenfold cosine term, so the trail blooms into a rotating seven-petal ring.',
    component: OriginalThinking, color: '#6366f1',
    defaults: {
      baseRadius: 7, detailAmplitude: 3, petalCount: 7, curveScale: 3.9,
      particleCount: 64, trailSpan: 0.38, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 5.5,
    },
    formula: `x(t) = 50 + \\left(7.0 \\cos t - 3.0 s \\cos 7t\\right) \\times 3.9 \\
y(t) = 50 + \\left(7.0 \\sin t - 3.0 s \\sin 7t\\right) \\times 3.9 \\
s = \\varepsilon(t)`,
    controls: [
      { key: 'baseRadius', label: 'Base radius', description: 'Radius of the base circle that the curve orbits around.', min: 4, max: 10, step: 0.1 },
      { key: 'detailAmplitude', label: 'Detail', description: 'Amplitude of the inner cosine term that carves the petal details.', min: 1, max: 5, step: 0.1 },
      { key: 'petalCount', label: 'Petals', description: 'Number of petals or lobes in the rose curve — higher values create denser patterns.', min: 3, max: 12, step: 1 },
      { key: 'curveScale', label: 'Scale', description: 'Overall scaling factor for the curve — larger values stretch the curve wider.', min: 2.5, max: 5.5, step: 0.1 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Thinking Five', tag: 'Custom Rose Trail', description: 'Replacing the sevenfold term with a fivefold term reduces the inner loops, giving the curve a cleaner five-petal rhythm.',
    component: ThinkingFive, color: '#8b5cf6',
    defaults: {
      baseRadius: 7, detailAmplitude: 3, petalCount: 5, curveScale: 3.9,
      particleCount: 62, trailSpan: 0.38, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 5.5,
    },
    formula: `x(t) = 50 + \\left(7.0 \\cos t - 3.0 s \\cos 5t\\right) \\times 3.9 \\
y(t) = 50 + \\left(7.0 \\sin t - 3.0 s \\sin 5t\\right) \\times 3.9 \\
s = \\varepsilon(t)`,
    controls: [
      { key: 'baseRadius', label: 'Base radius', description: 'Radius of the base circle that the curve orbits around.', min: 4, max: 10, step: 0.1 },
      { key: 'detailAmplitude', label: 'Detail', description: 'Amplitude of the inner cosine term that carves the petal details.', min: 1, max: 5, step: 0.1 },
      { key: 'petalCount', label: 'Petals', description: 'Number of petals or lobes in the rose curve — higher values create denser patterns.', min: 3, max: 12, step: 1 },
      { key: 'curveScale', label: 'Scale', description: 'Overall scaling factor for the curve — larger values stretch the curve wider.', min: 2.5, max: 5.5, step: 0.1 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Thinking Nine', tag: 'Custom Rose Trail', description: 'A ninefold term packs more inner turns into the same orbit, so the floral ring feels denser and more finely braided.',
    component: ThinkingNine, color: '#a855f7',
    defaults: {
      baseRadius: 7, detailAmplitude: 3, petalCount: 9, curveScale: 3.9,
      particleCount: 68, trailSpan: 0.39, durationMs: 4700,
      pulseDurationMs: 4200, rotationDurationMs: 30000, strokeWidth: 5.5,
    },
    formula: `x(t) = 50 + \\left(7.0 \\cos t - 3.0 s \\cos 9t\\right) \\times 3.9 \\
y(t) = 50 + \\left(7.0 \\sin t - 3.0 s \\sin 9t\\right) \\times 3.9 \\
s = \\varepsilon(t)`,
    controls: [
      { key: 'baseRadius', label: 'Base radius', description: 'Radius of the base circle that the curve orbits around.', min: 4, max: 10, step: 0.1 },
      { key: 'detailAmplitude', label: 'Detail', description: 'Amplitude of the inner cosine term that carves the petal details.', min: 1, max: 5, step: 0.1 },
      { key: 'petalCount', label: 'Petals', description: 'Number of petals or lobes in the rose curve — higher values create denser patterns.', min: 3, max: 12, step: 1 },
      { key: 'curveScale', label: 'Scale', description: 'Overall scaling factor for the curve — larger values stretch the curve wider.', min: 2.5, max: 5.5, step: 0.1 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Orbit', tag: 'r = cos(kθ)', description: 'The radius expands and contracts with cos(7t), so the orbit breathes as it spins.',
    component: RoseOrbit, color: '#d946ef',
    defaults: {
      orbitRadius: 7, detailAmplitude: 2.7, petalCount: 7, curveScale: 3.9,
      particleCount: 72, trailSpan: 0.42, durationMs: 5200,
      pulseDurationMs: 4600, rotationDurationMs: 28000, strokeWidth: 5.2,
    },
    formula: `\\begin{aligned}
  r(t) &= \\text{orbitRadius} + \\text{detailAmplitude} \\times \\cos(\\text{petalCount} \\times t) \\\\
  x(t) &= r(t) \\times \\cos t \\times \\text{curveScale} + 50 \\\\
  y(t) &= r(t) \\times \\sin t \\times \\text{curveScale} + 50
\\end{aligned}`,
    controls: [
      { key: 'orbitRadius', label: 'Base radius', description: 'Base radius of the orbiting rose curve.', min: 4, max: 10, step: 0.1 },
      { key: 'detailAmplitude', label: 'Detail', description: 'Amplitude of the modulating cosine that creates the petal shape.', min: 1, max: 5, step: 0.1 },
      { key: 'petalCount', label: 'k', description: 'The k parameter in cos(kθ) — controls the number of lobes.', min: 3, max: 12, step: 1 },
      { key: 'curveScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2.5, max: 5.5, step: 0.1 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Curve', tag: 'r = a cos(kθ)', description: 'Using r = a cos(5t) creates five evenly spaced lobes, the breathing modulation gives them a living pulse.',
    component: RoseCurve, color: '#ec4899',
    defaults: {
      roseA: 9.2, roseABoost: 0.6, roseBreathBase: 0.72, roseBreathBoost: 0.28, roseK: 5, roseScale: 3.25,
      particleCount: 78, trailSpan: 0.32, durationMs: 5400,
      pulseDurationMs: 4600, rotationDurationMs: 28000, strokeWidth: 4.5,
    },
    formula: `\\begin{aligned}
  r(t) &= \\left(\\text{roseA} + \\text{roseABoost} \\times \\sin t\\right) \\times \\cos(\\text{roseK} \\times t) \\times \\left(\\text{roseBreathBase} + \\text{roseBreathBoost} \\times \\sin(\\text{pulseTime})\\right) \\\\
  x(t) &= r(t) \\times \\cos t \\times \\text{roseScale} + 50 \\\\
  y(t) &= r(t) \\times \\sin t \\times \\text{roseScale} + 50
\\end{aligned}`,
    controls: [
      { key: 'roseA', label: 'a', description: 'The "a" parameter in r = a cos(kθ) — sets the base size of the rose.', min: 5, max: 14, step: 0.1 },
      { key: 'roseABoost', label: 'a boost', description: 'Sinusoidal modulation on "a" — adds organic variation to the radius.', min: 0, max: 2, step: 0.05 },
      { key: 'roseBreathBase', label: 'Base pulse', description: 'Base breathing value — the minimum scale of the pulse animation.', min: 0.3, max: 1.2, step: 0.01 },
      { key: 'roseBreathBoost', label: 'Pulse boost', description: 'Amplitude of the breathing pulse — how much the shape expands and contracts.', min: 0, max: 0.8, step: 0.01 },
      { key: 'roseK', label: 'k', description: 'The "k" parameter in r = a cos(kθ) — controls the number of lobes.', min: 2, max: 10, step: 1 },
      { key: 'roseScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2, max: 5, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Two', tag: 'r = a cos(2θ)', description: 'With k = 2, the cosine radius forms broad opposing petals, the breathing adds life.',
    component: RoseTwo, color: '#f43f5e',
    defaults: {
      roseA: 9.2, roseABoost: 0.6, roseBreathBase: 0.72, roseBreathBoost: 0.28, roseScale: 3.25,
      particleCount: 74, trailSpan: 0.3, durationMs: 5200,
      pulseDurationMs: 4300, rotationDurationMs: 28000, strokeWidth: 4.6,
    },
    formula: `\\begin{aligned}
  r(t) &= \\left(\\text{roseA} + \\text{roseABoost} \\times \\sin t\\right) \\times \\cos(2 \\times t) \\times \\left(\\text{roseBreathBase} + \\text{roseBreathBoost} \\times \\sin(\\text{pulseTime})\\right) \\\\
  x(t) &= r(t) \\times \\cos t \\times \\text{roseScale} + 50 \\\\
  y(t) &= r(t) \\times \\sin t \\times \\text{roseScale} + 50
\\end{aligned}`,
    controls: [
      { key: 'roseA', label: 'a', description: 'The "a" parameter in r = a cos(kθ) — sets the base size of the rose.', min: 5, max: 14, step: 0.1 },
      { key: 'roseABoost', label: 'a boost', description: 'Sinusoidal modulation on "a" — adds organic variation to the radius.', min: 0, max: 2, step: 0.05 },
      { key: 'roseBreathBase', label: 'Base pulse', description: 'Base breathing value — the minimum scale of the pulse animation.', min: 0.3, max: 1.2, step: 0.01 },
      { key: 'roseBreathBoost', label: 'Pulse boost', description: 'Amplitude of the breathing pulse — how much the shape expands and contracts.', min: 0, max: 0.8, step: 0.01 },
      { key: 'roseScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2, max: 5, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Three', tag: 'r = a cos(3θ)', description: 'With k = 3, the curve resolves into three rotating petals, the breathing modulation gives a living pulse.',
    component: RoseThree, color: '#ef4444',
    defaults: {
      roseA: 9.2, roseABoost: 0.6, roseBreathBase: 0.72, roseBreathBoost: 0.28, roseScale: 3.25,
      particleCount: 76, trailSpan: 0.31, durationMs: 5300,
      pulseDurationMs: 4400, rotationDurationMs: 28000, strokeWidth: 4.6,
    },
    formula: `\\begin{aligned}
  r(t) &= \\left(\\text{roseA} + \\text{roseABoost} \\times \\sin t\\right) \\times \\cos(3 \\times t) \\times \\left(\\text{roseBreathBase} + \\text{roseBreathBoost} \\times \\sin(\\text{pulseTime})\\right) \\\\
  x(t) &= r(t) \\times \\cos t \\times \\text{roseScale} + 50 \\\\
  y(t) &= r(t) \\times \\sin t \\times \\text{roseScale} + 50
\\end{aligned}`,
    controls: [
      { key: 'roseA', label: 'a', description: 'The "a" parameter in r = a cos(kθ) — sets the base size of the rose.', min: 5, max: 14, step: 0.1 },
      { key: 'roseABoost', label: 'a boost', description: 'Sinusoidal modulation on "a" — adds organic variation to the radius.', min: 0, max: 2, step: 0.05 },
      { key: 'roseBreathBase', label: 'Base pulse', description: 'Base breathing value — the minimum scale of the pulse animation.', min: 0.3, max: 1.2, step: 0.01 },
      { key: 'roseBreathBoost', label: 'Pulse boost', description: 'Amplitude of the breathing pulse — how much the shape expands and contracts.', min: 0, max: 0.8, step: 0.01 },
      { key: 'roseScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2, max: 5, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Rose Four', tag: 'r = a cos(4θ)', description: 'With k = 4, the petals settle into a balanced cross-like rose, the breathing gives it life.',
    component: RoseFour, color: '#f97316',
    defaults: {
      roseA: 9.2, roseABoost: 0.6, roseBreathBase: 0.72, roseBreathBoost: 0.28, roseScale: 3.25,
      particleCount: 78, trailSpan: 0.32, durationMs: 5400,
      pulseDurationMs: 4500, rotationDurationMs: 28000, strokeWidth: 4.6,
    },
    formula: `\\begin{aligned}
  r(t) &= \\left(\\text{roseA} + \\text{roseABoost} \\times \\sin t\\right) \\times \\cos(4 \\times t) \\times \\left(\\text{roseBreathBase} + \\text{roseBreathBoost} \\times \\sin(\\text{pulseTime})\\right) \\\\
  x(t) &= r(t) \\times \\cos t \\times \\text{roseScale} + 50 \\\\
  y(t) &= r(t) \\times \\sin t \\times \\text{roseScale} + 50
\\end{aligned}`,
    controls: [
      { key: 'roseA', label: 'a', description: 'The "a" parameter in r = a cos(kθ) — sets the base size of the rose.', min: 5, max: 14, step: 0.1 },
      { key: 'roseABoost', label: 'a boost', description: 'Sinusoidal modulation on "a" — adds organic variation to the radius.', min: 0, max: 2, step: 0.05 },
      { key: 'roseBreathBase', label: 'Base pulse', description: 'Base breathing value — the minimum scale of the pulse animation.', min: 0.3, max: 1.2, step: 0.01 },
      { key: 'roseBreathBoost', label: 'Pulse boost', description: 'Amplitude of the breathing pulse — how much the shape expands and contracts.', min: 0, max: 0.8, step: 0.01 },
      { key: 'roseScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 2, max: 5, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Lissajous Drift', tag: 'x = sin(at), y = sin(bt)', description: 'Different sine frequencies on x and y make the path cross itself, creating drift patterns.',
    component: LissajousDrift, color: '#f59e0b',
    defaults: {
      lissajousAmp: 24, lissajousAmpBoost: 6, lissajousAX: 3, lissajousBY: 4, lissajousPhase: 1.57, lissajousYScale: 0.92,
      particleCount: 68, trailSpan: 0.34, durationMs: 6000,
      pulseDurationMs: 5400, rotationDurationMs: 36000, strokeWidth: 4.7,
    },
    formula: `\\begin{aligned}
  x(t) &= \\left(\\text{lissajousAmp} + \\text{lissajousAmpBoost} \\times \\sin(\\text{pulseTime})\\right) \\times \\sin(\\text{lissajousAX} \\times t + \\text{lissajousPhase}) + 50 \\\\
  y(t) &= x(t) \\times \\frac{\\text{lissajousYScale}}{\\text{lissajousYScale}} \\times \\sin(\\text{lissajousBY} \\times t) + 50
\\end{aligned}`,
    controls: [
      { key: 'lissajousAmp', label: 'Amplitude', description: 'Base amplitude of the Lissajous curve — controls the overall size.', min: 8, max: 36, step: 0.5 },
      { key: 'lissajousAmpBoost', label: 'Amp pulse', description: 'Pulsing modulation on the amplitude — adds a breathing effect.', min: 0, max: 12, step: 0.1 },
      { key: 'lissajousAX', label: 'a', description: 'Frequency parameter "a" for the x-axis sine wave.', min: 1, max: 8, step: 1 },
      { key: 'lissajousBY', label: 'b', description: 'Frequency parameter "b" for the y-axis sine wave.', min: 1, max: 8, step: 1 },
      { key: 'lissajousYScale', label: 'Y scale', description: 'Vertical scaling factor — stretches or compresses the y-axis.', min: 0.4, max: 1.4, step: 0.01 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Lemniscate Bloom', tag: 'Bernoulli Lemniscate', description: 'The 1 + sin²t denominator pinches the center while preserving the figure-eight shape, creating a blooming infinity symbol.',
    component: LemniscateBloom, color: '#eab308',
    defaults: {
      lemniscateA: 20, lemniscateBoost: 7,
      particleCount: 70, trailSpan: 0.4, durationMs: 5600,
      pulseDurationMs: 5000, rotationDurationMs: 34000, strokeWidth: 4.8,
    },
    formula: `\\begin{aligned}
  r(t) &= \\frac{\\text{lemniscateA} \\times \\cos t}{1 + \\sin^{2} t} + \\text{lemniscateBoost} \\times \\sin(\\text{pulseTime}) \\\\
  x(t) &= r(t) \\times \\cos t + 50 \\\\
  y(t) &= r(t) \\times \\sin t + 50
\\end{aligned}`,
    controls: [
      { key: 'lemniscateA', label: 'a', description: 'The "a" parameter of the Bernoulli lemniscate — sets the size of the figure-eight.', min: 8, max: 30, step: 0.5 },
      { key: 'lemniscateBoost', label: 'Pulse', description: 'Sinusoidal pulse added to the radius — creates the blooming animation.', min: 0, max: 12, step: 0.1 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Hypotrochoid Loop', tag: 'Inner Spirograph', description: 'The rolling-circle terms create nested turns and offsets, so the trail draws spirograph-style loops.',
    component: HypotrochoidLoop, color: '#84cc16',
    defaults: {
      spiroR: 8.2, spiror: 2.7, spirorBoost: 0.45, spirod: 4.8, spirodBoost: 1.2, spiroScale: 3.05,
      particleCount: 82, trailSpan: 0.46, durationMs: 7600,
      pulseDurationMs: 6200, rotationDurationMs: 42000, strokeWidth: 4.6,
    },
    formula: `\\begin{aligned}
  x(t) &= (spiroR - spiror) \\times \\cos t + spirod \\times \\cos\\!\\left(\\frac{spiroR - spiror}{spiror} \\, t\\right) \\\\
  y(t) &= (spiroR - spiror) \\times \\sin t - spirod \\times \\sin\\!\\left(\\frac{spiroR - spiror}{spiror} \\, t\\right) \\\\
  x' &= (x + spirodBoost \\times \\sin(\\text{pulseTime})) \\times \\text{spiroScale} + 50 \\\\
  y' &= (y + spirodBoost \\times \\sin(\\text{pulseTime})) \\times \\text{spiroScale} + 50
\\end{aligned}`,
    controls: [
      { key: 'spiroR', label: 'R', description: 'Radius of the fixed outer circle in the rolling-circle spirograph.', min: 4, max: 12, step: 0.1 },
      { key: 'spiror', label: 'r', description: 'Radius of the rolling inner circle — together with R determines the pattern.', min: 1, max: 5, step: 0.1 },
      { key: 'spirod', label: 'd', description: 'Distance of the drawing point from the center of the rolling circle.', min: 1, max: 8, step: 0.1 },
      { key: 'spiroScale', label: 'Scale', description: 'Overall scaling factor for the spirograph.', min: 1.5, max: 4.5, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Three-Petal Spiral', tag: 'R = 3, r = 1, d = 3', description: 'This rolling-circle setup resolves into three large looping petals, the breathing adds a gentle pulse.',
    component: ThreePetalSpiral, color: '#22c55e',
    defaults: {
      spiralR: 3, spiralr: 1, spirald: 3, spiralScale: 2.2, spiralBreath: 0.45,
      particleCount: 82, trailSpan: 0.34, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 4.4,
    },
    formula: `\\begin{aligned}
  x(t) &= (spiralR - spiralr) \\times \\cos t + spirald \\times \\cos\\!\\left(\\frac{spiralR - spiralr}{spiralr} \\, t\\right) \\\\
  y(t) &= (spiralR - spiralr) \\times \\sin t - spirald \\times \\sin\\!\\left(\\frac{spiralR - spiralr}{spiralr} \\, t\\right) \\times \\left(1 + spiralBreath \\times \\sin(\\text{pulseTime})\\right) \\\\
  x' &= x \\times spiralScale + 50 \\\\
  y' &= y \\times spiralScale + 50
\\end{aligned}`,
    controls: [
      { key: 'spiralR', label: 'R', description: 'Radius of the fixed outer circle.', min: 2, max: 8, step: 1 },
      { key: 'spiralr', label: 'r', description: 'Radius of the rolling inner circle.', min: 1, max: 3, step: 0.1 },
      { key: 'spirald', label: 'd', description: 'Distance of the drawing point from the rolling circle center.', min: 1, max: 5, step: 0.1 },
      { key: 'spiralScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 1.2, max: 3.5, step: 0.05 },
      { key: 'spiralBreath', label: 'Pulse', description: 'Breathing modulation amplitude on the y-axis — adds a living pulse.', min: 0, max: 1, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Four-Petal Spiral', tag: 'R = 4, r = 1, d = 3', description: 'Four-lobe spirograph pattern from R=4, r=1, d=3 — the breathing adds life to each petal.',
    component: FourPetalSpiral, color: '#10b981',
    defaults: {
      spiralR: 4, spiralr: 1, spirald: 3, spiralScale: 2.2, spiralBreath: 0.45,
      particleCount: 84, trailSpan: 0.34, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 4.4,
    },
    formula: `\\begin{aligned}
  x(t) &= (spiralR - spiralr) \\times \\cos t + spirald \\times \\cos\\!\\left(\\frac{spiralR - spiralr}{spiralr} \\, t\\right) \\\\
  y(t) &= (spiralR - spiralr) \\times \\sin t - spirald \\times \\sin\\!\\left(\\frac{spiralR - spiralr}{spiralr} \\, t\\right) \\times \\left(1 + spiralBreath \\times \\sin(\\text{pulseTime})\\right) \\\\
  x' &= x \\times spiralScale + 50 \\\\
  y' &= y \\times spiralScale + 50
\\end{aligned}`,
    controls: [
      { key: 'spiralR', label: 'R', description: 'Radius of the fixed outer circle.', min: 2, max: 8, step: 1 },
      { key: 'spiralr', label: 'r', description: 'Radius of the rolling inner circle.', min: 1, max: 3, step: 0.1 },
      { key: 'spirald', label: 'd', description: 'Distance of the drawing point from the rolling circle center.', min: 1, max: 5, step: 0.1 },
      { key: 'spiralScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 1.2, max: 3.5, step: 0.05 },
      { key: 'spiralBreath', label: 'Pulse', description: 'Breathing modulation amplitude on the y-axis — adds a living pulse.', min: 0, max: 1, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Five-Petal Spiral', tag: 'R = 5, r = 1, d = 3', description: 'Five-fold spirograph spiral — the breathing modulation gives each petal a living pulse.',
    component: FivePetalSpiral, color: '#14b8a6',
    defaults: {
      spiralR: 5, spiralr: 1, spirald: 3, spiralScale: 2.2, spiralBreath: 0.45,
      particleCount: 85, trailSpan: 0.34, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 4.4,
    },
    formula: `\\begin{aligned}
  x(t) &= (spiralR - spiralr) \\times \\cos t + spirald \\times \\cos\\!\\left(\\frac{spiralR - spiralr}{spiralr} \\, t\\right) \\\\
  y(t) &= (spiralR - spiralr) \\times \\sin t - spirald \\times \\sin\\!\\left(\\frac{spiralR - spiralr}{spiralr} \\, t\\right) \\times \\left(1 + spiralBreath \\times \\sin(\\text{pulseTime})\\right) \\\\
  x' &= x \\times spiralScale + 50 \\\\
  y' &= y \\times spiralScale + 50
\\end{aligned}`,
    controls: [
      { key: 'spiralR', label: 'R', description: 'Radius of the fixed outer circle.', min: 2, max: 8, step: 1 },
      { key: 'spiralr', label: 'r', description: 'Radius of the rolling inner circle.', min: 1, max: 3, step: 0.1 },
      { key: 'spirald', label: 'd', description: 'Distance of the drawing point from the rolling circle center.', min: 1, max: 5, step: 0.1 },
      { key: 'spiralScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 1.2, max: 3.5, step: 0.05 },
      { key: 'spiralBreath', label: 'Pulse', description: 'Breathing modulation amplitude on the y-axis — adds a living pulse.', min: 0, max: 1, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Six-Petal Spiral', tag: 'R = 6, r = 1, d = 3', description: 'Six-fold spirograph spiral — dense, symmetrical, with breathing modulation.',
    component: SixPetalSpiral, color: '#06b6d4',
    defaults: {
      spiralR: 6, spiralr: 1, spirald: 3, spiralScale: 2.2, spiralBreath: 0.45,
      particleCount: 86, trailSpan: 0.34, durationMs: 4600,
      pulseDurationMs: 4200, rotationDurationMs: 28000, strokeWidth: 4.4,
    },
    formula: `\\begin{aligned}
  x(t) &= (spiralR - spiralr) \\times \\cos t + spirald \\times \\cos\\!\\left(\\frac{spiralR - spiralr}{spiralr} \\, t\\right) \\\\
  y(t) &= (spiralR - spiralr) \\times \\sin t - spirald \\times \\sin\\!\\left(\\frac{spiralR - spiralr}{spiralr} \\, t\\right) \\times \\left(1 + spiralBreath \\times \\sin(\\text{pulseTime})\\right) \\\\
  x' &= x \\times spiralScale + 50 \\\\
  y' &= y \\times spiralScale + 50
\\end{aligned}`,
    controls: [
      { key: 'spiralR', label: 'R', description: 'Radius of the fixed outer circle.', min: 2, max: 8, step: 1 },
      { key: 'spiralr', label: 'r', description: 'Radius of the rolling inner circle.', min: 1, max: 3, step: 0.1 },
      { key: 'spirald', label: 'd', description: 'Distance of the drawing point from the rolling circle center.', min: 1, max: 5, step: 0.1 },
      { key: 'spiralScale', label: 'Scale', description: 'Overall scaling factor for the curve.', min: 1.2, max: 3.5, step: 0.05 },
      { key: 'spiralBreath', label: 'Pulse', description: 'Breathing modulation amplitude on the y-axis — adds a living pulse.', min: 0, max: 1, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Butterfly Phase', tag: 'Butterfly Curve', description: 'A rich butterfly curve with exponential decay creating delicate wings — phase animation adds depth.',
    component: ButterflyPhase, color: '#0ea5e9',
    defaults: {
      butterflyTurns: 12, butterflyScale: 4.6, butterflyPulse: 0.45, butterflyCosWeight: 2, butterflyPower: 5,
      particleCount: 88, trailSpan: 0.32, durationMs: 9000,
      pulseDurationMs: 7000, rotationDurationMs: 50000, strokeWidth: 4.4,
    },
    formula: `r(t) = e^cos(t) - 2cos(4×turns×t) + sin³t + butterflyCosWeight × cos(6×butterflyPower×t)
x(t) = r(t) × cos t × butterflyScale + 50
y(t) = r(t) × sin t × butterflyScale + 50
pulse = 1 + butterflyPulse × sin(pulseTime)`,
    controls: [
      { key: 'butterflyTurns', label: 'Turns', description: 'Number of turns in the butterfly wing pattern — higher values add more detail.', min: 6, max: 18, step: 0.5 },
      { key: 'butterflyScale', label: 'Scale', description: 'Overall scaling factor for the butterfly curve.', min: 2.5, max: 7, step: 0.05 },
      { key: 'butterflyPulse', label: 'Pulse', description: 'Breathing modulation amplitude — how much the butterfly expands and contracts.', min: 0, max: 1.2, step: 0.01 },
      { key: 'butterflyCosWeight', label: 'Cos weight', description: 'Weight of the secondary cosine term — controls wing complexity.', min: 0.5, max: 4, step: 0.05 },
      { key: 'butterflyPower', label: 'Power', description: 'Power of the inner cosine modulation — affects wing pattern density.', min: 2, max: 8, step: 1 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Cardioid Glow', tag: 'Cardioid', description: 'A heart-shaped cardioid curve with breathing glow — the pulse modulation gives it life.',
    component: CardioidGlow, color: '#3b82f6',
    defaults: {
      cardioidA: 8.4, cardioidPulse: 0.8, cardioidScale: 2.15,
      particleCount: 72, trailSpan: 0.36, durationMs: 6200,
      pulseDurationMs: 5200, rotationDurationMs: 36000, strokeWidth: 4.9,
    },
    formula: `r(t) = cardioidA × (1 - cos(t)) × (1 + cardioidPulse × sin(pulseTime))
x(t) = r(t) × cos t × cardioidScale + 50
y(t) = r(t) × sin t × cardioidScale + 50`,
    controls: [
      { key: 'cardioidA', label: 'a', description: 'The "a" parameter in the cardioid equation — sets the base size.', min: 4, max: 14, step: 0.1 },
      { key: 'cardioidPulse', label: 'Pulse', description: 'Amplitude of the breathing pulse — how much the cardioid expands and contracts.', min: 0, max: 2, step: 0.05 },
      { key: 'cardioidScale', label: 'Scale', description: 'Overall scaling factor for the cardioid.', min: 1, max: 3.5, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Cardioid Heart', tag: 'r = a(1+cosθ)', description: 'The classic cardioid heart shape — the breathing adds a gentle pulse.',
    component: CardioidHeart, color: '#7c3aed',
    defaults: {
      cardioidA: 8.8, cardioidPulse: 0.8, cardioidScale: 2.15,
      particleCount: 74, trailSpan: 0.36, durationMs: 6200,
      pulseDurationMs: 5200, rotationDurationMs: 36000, strokeWidth: 4.9,
    },
    formula: `r(t) = cardioidA × (1 + cos(t)) × (1 + cardioidPulse × sin(pulseTime))
x(t) = r(t) × cos t × cardioidScale + 50
y(t) = r(t) × sin t × cardioidScale + 50`,
    controls: [
      { key: 'cardioidA', label: 'a', description: 'The "a" parameter in r = a(1+cosθ) — sets the size of the heart.', min: 4, max: 14, step: 0.1 },
      { key: 'cardioidPulse', label: 'Pulse', description: 'Amplitude of the breathing pulse — how much the heart expands and contracts.', min: 0, max: 2, step: 0.05 },
      { key: 'cardioidScale', label: 'Scale', description: 'Overall scaling factor for the cardioid.', min: 1, max: 3.5, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Heart Wave', tag: 'f(x) Heart Wave', description: 'A wavy heart-shaped curve drawn by a parametric function — the wave amplitude adds organic motion.',
    component: HeartWave, color: '#e11d48',
    defaults: {
      heartWaveB: 6.4, heartWaveRoot: 3.3, heartWaveAmp: 0.9, heartWaveScaleX: 23.2, heartWaveScaleY: 24.5,
      particleCount: 104, trailSpan: 0.18, durationMs: 8400,
      pulseDurationMs: 5600, rotationDurationMs: 22000, strokeWidth: 3.9,
    },
    formula: `x(t) = heartWaveB × sin(t) × √(|cos(t)|) / (sin(t) + 1.4) × heartWaveScaleX + 50
y(t) = (heartWaveB × cos(t) - heartWaveB × sin(t) - 2 × cos(t) - √(|cos(t)|)) × heartWaveAmp × heartWaveScaleY + 50`,
    controls: [
      { key: 'heartWaveB', label: 'b', description: 'The "b" parameter — scales the heart wave amplitude.', min: 2, max: 12, step: 0.1 },
      { key: 'heartWaveRoot', label: 'Root span', description: 'Span of the square root term — controls the heart tip sharpness.', min: 2.2, max: 4.2, step: 0.05 },
      { key: 'heartWaveAmp', label: 'Wave amp', description: 'Amplitude of the wave modulation — adds organic wavy motion.', min: 0.3, max: 1.6, step: 0.05 },
      { key: 'heartWaveScaleX', label: 'X scale', description: 'Horizontal scaling factor.', min: 14, max: 30, step: 0.1 },
      { key: 'heartWaveScaleY', label: 'Y scale', description: 'Vertical scaling factor.', min: 14, max: 34, step: 0.1 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Spiral Search', tag: 'Archimedean Spiral', description: 'An expanding Archimedean spiral that sweeps outward — the pulse adds breathing motion to the turns.',
    component: SpiralSearch, color: '#6d28d8',
    defaults: {
      searchTurns: 4, searchBaseRadius: 8, searchRadiusAmp: 8.5, searchPulse: 2.4, searchScale: 1,
      particleCount: 86, trailSpan: 0.28, durationMs: 7800,
      pulseDurationMs: 6800, rotationDurationMs: 44000, strokeWidth: 4.3,
    },
    formula: `r(t) = searchBaseRadius + searchRadiusAmp × t / (2π × searchTurns) + searchPulse × sin(pulseTime)
x(t) = r(t) × cos(t) × searchScale + 50
y(t) = r(t) × sin(t) × searchScale + 50`,
    controls: [
      { key: 'searchTurns', label: 'Turns', description: 'Number of spiral turns — more turns create a denser spiral.', min: 2, max: 8, step: 0.1 },
      { key: 'searchBaseRadius', label: 'Base radius', description: 'Inner starting radius of the spiral.', min: 2, max: 16, step: 0.1 },
      { key: 'searchRadiusAmp', label: 'Radius amp', description: 'Rate at which the radius expands per turn.', min: 2, max: 16, step: 0.1 },
      { key: 'searchPulse', label: 'Pulse', description: 'Breathing modulation on the radius — adds a living pulse to the spiral.', min: 0, max: 6, step: 0.1 },
      { key: 'searchScale', label: 'Scale', description: 'Overall scaling factor for the spiral.', min: 0.5, max: 1.8, step: 0.05 },
      ...GLOBAL_CONTROLS,
    ],
  },
  {
    name: 'Fourier Flow', tag: 'Fourier Curve', description: 'A sum of sine and cosine terms creating a complex flowing shape — the mix pulse modulates the phase.',
    component: FourierFlow, color: '#4f46e5',
    defaults: {
      fourierX1: 17, fourierX3: 7.5, fourierX5: 3.2, fourierY1: 15, fourierY2: 8.2, fourierY4: 4.2, fourierMixBase: 1, fourierMixPulse: 0.16,
      particleCount: 92, trailSpan: 0.31, durationMs: 8400,
      pulseDurationMs: 6800, rotationDurationMs: 44000, strokeWidth: 4.2,
    },
    formula: `x(t) = fourierX1 × cos(t) + fourierX3 × cos(3t) + fourierX5 × sin(5t) + 50
y(t) = fourierY1 × sin(t) + fourierY2 × sin(2t) + fourierY4 × cos(4t) + 50
mix = fourierMixBase + fourierMixPulse × sin(pulseTime)`,
    controls: [
      { key: 'fourierX1', label: 'x cos1', description: 'Coefficient of cos(t) in the x equation — primary horizontal harmonic.', min: 4, max: 24, step: 0.1 },
      { key: 'fourierX3', label: 'x cos3', description: 'Coefficient of cos(3t) in the x equation — third harmonic.', min: 0, max: 14, step: 0.1 },
      { key: 'fourierX5', label: 'x sin5', description: 'Coefficient of sin(5t) in the x equation — fifth harmonic.', min: 0, max: 10, step: 0.1 },
      { key: 'fourierY1', label: 'y sin1', description: 'Coefficient of sin(t) in the y equation — primary vertical harmonic.', min: 4, max: 24, step: 0.1 },
      { key: 'fourierY2', label: 'y sin2', description: 'Coefficient of sin(2t) in the y equation — second harmonic.', min: 0, max: 14, step: 0.1 },
      { key: 'fourierY4', label: 'y cos4', description: 'Coefficient of cos(4t) in the y equation — fourth harmonic.', min: 0, max: 10, step: 0.1 },
      { key: 'fourierMixPulse', label: 'Mix pulse', description: 'Phase modulation pulse — adds organic variation to the shape.', min: 0, max: 0.8, step: 0.01 },
      ...GLOBAL_CONTROLS,
    ],
  },
];

/* ─── Helpers ─── */

function toPascal(name: string): string {
  return name.replace(/\b\w/g, c => c.toUpperCase()).replace(/\s/g, '');
}

function formatNum(v: number): string {
  if (Number.isInteger(v)) return String(v);
  if (Math.abs(v) < 10) return Number(v.toFixed(2)).toString();
  return Number(v.toFixed(1)).toString();
}

function buildConfig(_curve: CurveDef, values: Record<string, number>): Record<string, number> {
  return { ...values };
}

function generateCode(curve: CurveDef, values: Record<string, number>): string {
  const name = toPascal(curve.name);
  const config = buildConfig(curve, values);
  const keys = Object.keys(config);
  const configStr = '  config={\n' +
    keys.map(k => `    ${k}: ${formatNum(config[k] as number)},`).join('\n') +
    '\n  }';
  return `<${name}\n  ${configStr}\n  style={{ width: 120, height: 120, color: '${curve.color}' }}\n/>`;
}

/* ─── Slider ─── */

function Slider({ label, value, min, max, step, onChange, color, description }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; color: string; description?: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbPos, setThumbPos] = useState(percentage);
  const [active, setActive] = useState(false);
  const [nameHovered, setNameHovered] = useState(false);

  /* Sync thumb position with value on mount/reset */
  useEffect(() => {
    setThumbPos(percentage);
  }, [percentage]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setActive(true);
    handleInput(e);
    const onMove = (ev: PointerEvent) => handleInput(ev as unknown as React.PointerEvent<HTMLDivElement>);
    const onUp = () => { setActive(false); document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [min, max, step, onChange]);

  const handleInput = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(stepped);
    setThumbPos(ratio * 100);
  }, [min, max, step, onChange]);

  const showThumb = active || nameHovered;
  const showGlow = active || nameHovered;

  return (
    <div className="slider-row">
      <div className="slider-header">
        {description ? (
          <>
            <div
              className="slider-label-wrapper"
              onMouseEnter={() => setNameHovered(true)}
              onMouseLeave={() => setNameHovered(false)}
            >
              <span className="slider-label">
                <span className="slider-label--desc">{label}<span className="slider-label--hint">i</span></span>
              </span>
            </div>
            <div className="slider-tooltip">{description}</div>
          </>
        ) : (
          <>
            <span className="slider-label">{label}</span>
            <span className="slider-value">{formatNum(value)}</span>
          </>
        )}
      </div>
      <div
        ref={trackRef}
        className="slider-track-wrapper"
        style={{ '--slider-color': color } as React.CSSProperties}
        onPointerDown={handlePointerDown}
      >
        <div className="slider-fill" style={{ width: `${thumbPos}%` }} />
        <input
          type="range" min={min} max={max} step={step}
          value={value} onChange={e => onChange(Number(e.target.value))}
          aria-label={label}
        />
        {/* Visible thumb */}
        {showThumb && (
          <div
            className="slider-thumb"
            data-dragging={active}
            style={{
              left: `${thumbPos}%`,
              '--slider-color': color,
            } as React.CSSProperties}
          />
        )}
        {/* Glow halo */}
        {showGlow && (
          <div
            className="slider-glow"
            style={{
              left: `${thumbPos}%`,
              '--slider-color': color,
            } as React.CSSProperties}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Code Block (Prism Syntax Highlighting) ─── */

function CodeBlock({ code, theme }: { code: string; theme: 'dark' | 'light' }) {
  const prismTheme = theme === 'dark' ? vsDark : githubTheme;

  return (
    <div className="code-block" style={{ borderRadius: '0 0 8px 8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', borderTop: 'none' }}>
      <Highlight theme={prismTheme} code={code} language="tsx">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`prism-code ${className}`} style={{ ...style, padding: 14, fontSize: 12, lineHeight: 1.6, overflowX: 'auto', fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace", tabSize: 2, background: 'transparent', margin: 0 }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} style={{ paddingLeft: i === 0 ? 0 : 2 }}>
                {line.map((token, j) => (
                  <span key={j} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

/* ─── Formula Renderer (KaTeX) ─── */

function formatFormulaValue(val: number): string {
  return Number.isInteger(val) ? val.toString() : val.toFixed(1).replace(/\.0$/, '').replace(/(\.\d)0$/, '$1');
}

function substituteFormula(formula: string, values: Record<string, number>, defaults: Record<string, number>): string {
  let tex = formula;
  // Replace \text{variableName} with the actual numeric value when it differs from the default
  tex = tex.replace(/\\text\{(\w+)\}/g, (_match: string, varName: string) => {
    const val = values[varName];
    if (val !== undefined && Math.abs(val - (defaults[varName] ?? 0)) > 1e-6) {
      return formatFormulaValue(val);
    }
    return _match; // keep variable name when value is at default
  });
  return tex;
}

function MathFormula({ formula, values, defaults }: { formula: string; values: Record<string, number>; defaults: Record<string, number> }) {
  const rendered = substituteFormula(formula, values, defaults);
  return (
    <div
      className="math-formula"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(rendered, {
          displayMode: true,
          throwOnError: false,
          trust: true,
        }),
      }}
    />
  );
}

export default function Playground() {
  const [selected, setSelected] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document !== 'undefined') {
      const val = document.documentElement.getAttribute('data-theme');
      if (val === 'light') return 'light';
    }
    return 'dark';
  });

  const [values, setValues] = useState<Record<string, number>>(() => {
    return { ...CURVES[0].defaults };
  });

  const [showCode, setShowCode] = useState(true);
  const [copied, setCopied] = useState(false);

  const curve = CURVES[selected];
  const config = buildConfig(curve, values);

  const handleValue = useCallback((key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const handleReset = useCallback(() => {
    setValues({ ...curve.defaults });
  }, [curve]);

  const code = useMemo(() => generateCode(curve, values), [curve, values]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  /* Apply theme to document */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="playground" data-theme={theme}>
      {/* ─── Theme Toggle ─── */}
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* ─── Curve Selector Sidebar ─── */}
      <nav className="sidebar">
        <div className="sidebar-header">Curves</div>
        {CURVES.map((c, i) => (
          <button
            key={c.name}
            className={`curve-btn ${i === selected ? 'active' : ''}`}
            style={{ '--active-color': c.color } as React.CSSProperties}
            onClick={() => { setSelected(i); setValues({ ...c.defaults }); }}
          >
            <span className="curve-dot" style={{ background: c.color }} />
            <span className="curve-name">{c.name}</span>
          </button>
        ))}
      </nav>

      {/* ─── Main Content ─── */}
      <div className="main">
        <div className="main-inner">
          {/* Header */}
          <div className="header">
            <h1 className="title">{curve.name}</h1>
            <span className="tag">{curve.tag}</span>
          </div>

          {/* Curve Info */}
          <div className="curve-info">{curve.description}</div>

          {/* Preview */}
          <div className="preview-wrap">
            <curve.component
              config={config}
              style={{ width: 200, height: 200, color: curve.color }}
            />
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="controls-header">
              <h2>Parameters</h2>
              <button className="reset-btn" onClick={handleReset}>Reset Defaults</button>
            </div>
            <div className="controls-grid">
              {curve.controls.map(ctrl => (
                <Slider
                  key={ctrl.key}
                  label={ctrl.label}
                  value={values[ctrl.key] ?? curve.defaults[ctrl.key]}
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  onChange={v => handleValue(ctrl.key, v)}
                  color={curve.color}
                  description={ctrl.description}
                />
              ))}
            </div>
          </div>

          {/* Formula */}
          <div className="code-section">
            <div className="code-block" style={{ borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="code-header">
                <span className="code-label">Formula</span>
              </div>
              <div style={{ padding: '16px 14px', background: 'var(--code-bg)', maxWidth: '100%' }}>
                <MathFormula formula={curve.formula} values={values} defaults={curve.defaults} />
              </div>
            </div>
          </div>

          {/* Code */}
          {showCode ? (
            <div className="code-section">
              <div className="code-header" style={{ background: 'var(--code-bg)', borderRadius: '8px 8px 0 0' }}>
                <span className="code-label">JSX</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="copy-btn" onClick={() => setShowCode(false)}>Hide</button>
                  <button className="copy-btn" onClick={handleCopy} data-copied={copied}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <CodeBlock code={code} theme={theme} />
            </div>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <button className="copy-btn" onClick={() => setShowCode(true)} style={{ marginBottom: 12, background: 'var(--copy-bg)', color: 'var(--copy-fg)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 8 }}>Show</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
