// @ts-nocheck — curves.ts defines inline arrow functions that access
// optional numeric fields (safe at runtime since each curve defines
// exactly the fields its functions reference).
// The CurveConfig interface declares all possible optional fields.
// Inside point()/formula(), we access exactly the fields each curve sets.

export interface CurveConfig {
  name: string;
  tag: string;
  description: string;
  rotate: boolean;
  particleCount: number;
  trailSpan: number;
  durationMs: number;
  rotationDurationMs: number;
  pulseDurationMs: number;
  strokeWidth: number;
  baseRadius?: number;
  detailAmplitude?: number;
  petalCount?: number;
  curveScale?: number;
  orbitRadius?: number;
  roseA?: number;
  roseABoost?: number;
  roseBreathBase?: number;
  roseBreathBoost?: number;
  roseK?: number;
  roseScale?: number;
  lissajousAmp?: number;
  lissajousAmpBoost?: number;
  lissajousAX?: number;
  lissajousBY?: number;
  lissajousPhase?: number;
  lissajousYScale?: number;
  lemniscateA?: number;
  lemniscateBoost?: number;
  spiroR?: number;
  spiror?: number;
  spirorBoost?: number;
  spirod?: number;
  spirodBoost?: number;
  spiroScale?: number;
  spiralR?: number;
  spiralr?: number;
  spirald?: number;
  spiralScale?: number;
  spiralBreath?: number;
  butterflyTurns?: number;
  butterflyScale?: number;
  butterflyPulse?: number;
  butterflyCosWeight?: number;
  butterflyPower?: number;
  cardioidA?: number;
  cardioidPulse?: number;
  cardioidScale?: number;
  heartWaveB?: number;
  heartWaveRoot?: number;
  heartWaveAmp?: number;
  heartWaveScaleX?: number;
  heartWaveScaleY?: number;
  searchTurns?: number;
  searchBaseRadius?: number;
  searchRadiusAmp?: number;
  searchPulse?: number;
  searchScale?: number;
  fourierX1?: number;
  fourierX3?: number;
  fourierX5?: number;
  fourierY1?: number;
  fourierY2?: number;
  fourierY4?: number;
  fourierMixBase?: number;
  fourierMixPulse?: number;
  point(progress: number, detailScale: number, config: CurveConfig): { x: number; y: number };
  formula(config: CurveConfig): string;
}

/** Merge a base CurveConfig with optional overrides, producing a fully-typed CurveConfig. */
export function mergeConfig(
  base: CurveConfig,
  overrides?: Partial<CurveConfig>
): CurveConfig {
  return { ...base, ...overrides } as CurveConfig;
}

export const curves: CurveConfig[] = [
  // ─── 1. Original Thinking ───
  {
    name: "Original Thinking",
    tag: "Custom Rose Trail",
    description: "The base circle is carved by a sevenfold cosine term, so the trail blooms into a rotating seven-petal ring.",
    baseRadius: 8,
    detailAmplitude: 4,
    petalCount: 7,
    curveScale: 3.5,
    rotate: true,
    particleCount: 64,
    trailSpan: 0.38,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x = config.baseRadius * Math.cos(t) - config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y = config.baseRadius * Math.sin(t) - config.detailAmplitude * detailScale * Math.sin(petals * t);
      return { x: 50 + x * config.curveScale, y: 50 + y * config.curveScale };
    },
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + (${c.baseRadius.toFixed(1)} cos t - ${c.detailAmplitude.toFixed(1)}s cos ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${c.baseRadius.toFixed(1)} sin t - ${c.detailAmplitude.toFixed(1)}s sin ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
  },
  // ─── 2. Thinking Five ───
  {
    name: "Thinking Five",
    tag: "Custom Rose Trail",
    description: "Replacing the sevenfold term with a fivefold term reduces the inner loops, giving the curve a cleaner five-petal rhythm.",
    baseRadius: 8,
    detailAmplitude: 4,
    petalCount: 5,
    curveScale: 3.5,
    rotate: true,
    particleCount: 62,
    trailSpan: 0.38,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x = config.baseRadius * Math.cos(t) - config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y = config.baseRadius * Math.sin(t) - config.detailAmplitude * detailScale * Math.sin(petals * t);
      return { x: 50 + x * config.curveScale, y: 50 + y * config.curveScale };
    },
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + (${c.baseRadius.toFixed(1)} cos t - ${c.detailAmplitude.toFixed(1)}s cos ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${c.baseRadius.toFixed(1)} sin t - ${c.detailAmplitude.toFixed(1)}s sin ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
  },
  // ─── 3. Thinking Nine ───
  {
    name: "Thinking Nine",
    tag: "Custom Rose Trail",
    description: "A ninefold term packs more inner turns into the same orbit, so the floral ring feels denser and more finely braided.",
    baseRadius: 8,
    detailAmplitude: 4,
    petalCount: 9,
    curveScale: 3.5,
    rotate: true,
    particleCount: 68,
    trailSpan: 0.39,
    durationMs: 4700,
    rotationDurationMs: 30000,
    pulseDurationMs: 4200,
    strokeWidth: 5.5,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x = config.baseRadius * Math.cos(t) - config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y = config.baseRadius * Math.sin(t) - config.detailAmplitude * detailScale * Math.sin(petals * t);
      return { x: 50 + x * config.curveScale, y: 50 + y * config.curveScale };
    },
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + (${c.baseRadius.toFixed(1)} cos t - ${c.detailAmplitude.toFixed(1)}s cos ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${c.baseRadius.toFixed(1)} sin t - ${c.detailAmplitude.toFixed(1)}s sin ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
  },
  // ─── 4. Rose Orbit ───
  {
    name: "Rose Orbit",
    tag: "r = cos(kθ)",
    description: "The radius expands and contracts with cos(7t), so the orbit breathes into repeated petals while staying anchored to a circle.",
    orbitRadius: 8,
    detailAmplitude: 3.5,
    petalCount: 7,
    curveScale: 3.3,
    rotate: true,
    particleCount: 72,
    trailSpan: 0.42,
    durationMs: 5200,
    rotationDurationMs: 28000,
    pulseDurationMs: 4600,
    strokeWidth: 5.2,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const k = Math.round(config.petalCount);
      const r = config.orbitRadius - config.detailAmplitude * detailScale * Math.cos(k * t);
      return { x: 50 + Math.cos(t) * r * config.curveScale, y: 50 + Math.sin(t) * r * config.curveScale };
    },
    formula(c: CurveConfig) {
      return [
        `r(t) = ${c.orbitRadius.toFixed(1)} - ${c.detailAmplitude.toFixed(1)}s cos(${Math.round(c.petalCount)}t)`,
        `x(t) = 50 + cos t · r(t) · ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + sin t · r(t) · ${c.curveScale.toFixed(1)}`,
      ].join("\n");
    },
  },
  // ─── 5. Rose Curve ───
  {
    name: "Rose Curve",
    tag: "r = a cos(kθ)",
    description: "Using r = a cos(5t) creates five evenly spaced lobes, the breathing multiplier gently swells each petal in and out.",
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseK: 5,
    roseScale: 3.0,
    rotate: true,
    particleCount: 78,
    trailSpan: 0.32,
    durationMs: 5400,
    rotationDurationMs: 28000,
    pulseDurationMs: 4600,
    strokeWidth: 4.5,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const k = Math.round(config.roseK);
      const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(k * t);
      return { x: 50 + Math.cos(t) * r * config.roseScale, y: 50 + Math.sin(t) * r * config.roseScale };
    },
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(${Math.round(c.roseK)}t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
  },
  // ─── 6. Rose Two ───
  {
    name: "Rose Two",
    tag: "r = a cos(2θ)",
    description: "With k = 2, the cosine radius forms broad opposing petals, the breathing factor makes the center pulse like the original.",
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseScale: 3.0,
    rotate: true,
    particleCount: 74,
    trailSpan: 0.3,
    durationMs: 5200,
    rotationDurationMs: 28000,
    pulseDurationMs: 4300,
    strokeWidth: 4.6,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(2 * t);
      return { x: 50 + Math.cos(t) * r * config.roseScale, y: 50 + Math.sin(t) * r * config.roseScale };
    },
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(2t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
  },
  // ─── 7. Rose Three ───
  {
    name: "Rose Three",
    tag: "r = a cos(3θ)",
    description: "With k = 3, the curve resolves into three rotating petals, the inner breathing keeps the motion from feeling mathematically rigid.",
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseScale: 3.0,
    rotate: true,
    particleCount: 76,
    trailSpan: 0.31,
    durationMs: 5300,
    rotationDurationMs: 28000,
    pulseDurationMs: 4400,
    strokeWidth: 4.6,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(3 * t);
      return { x: 50 + Math.cos(t) * r * config.roseScale, y: 50 + Math.sin(t) * r * config.roseScale };
    },
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(3t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
  },
  // ─── 8. Rose Four ───
  {
    name: "Rose Four",
    tag: "r = a cos(4θ)",
    description: "With k = 4, the petals settle into a balanced cross-like rose, the breathing core adds the same soft pulse as the original loader.",
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseScale: 3.0,
    rotate: true,
    particleCount: 78,
    trailSpan: 0.32,
    durationMs: 5400,
    rotationDurationMs: 28000,
    pulseDurationMs: 4500,
    strokeWidth: 4.6,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(4 * t);
      return { x: 50 + Math.cos(t) * r * config.roseScale, y: 50 + Math.sin(t) * r * config.roseScale };
    },
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(4t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
  },
  // ─── 9. Lissajous Drift ───
  {
    name: "Lissajous Drift",
    tag: "x = sin(at), y = sin(bt)",
    description: "Different sine frequencies on x and y make the path cross itself repeatedly, producing the woven feel of an oscilloscope trace.",
    lissajousAmp: 28,
    lissajousAmpBoost: 8,
    lissajousAX: 3,
    lissajousBY: 4,
    lissajousPhase: 1.57,
    lissajousYScale: 0.85,
    rotate: false,
    particleCount: 68,
    trailSpan: 0.34,
    durationMs: 6000,
    rotationDurationMs: 36000,
    pulseDurationMs: 5400,
    strokeWidth: 4.7,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const amp = config.lissajousAmp + detailScale * config.lissajousAmpBoost;
      return {
        x: 50 + Math.sin(Math.round(config.lissajousAX) * t + config.lissajousPhase) * amp,
        y: 50 + Math.sin(Math.round(config.lissajousBY) * t) * (amp * config.lissajousYScale),
      };
    },
    formula(c: CurveConfig) {
      return [
        `A = ${c.lissajousAmp.toFixed(1)} + ${c.lissajousAmpBoost.toFixed(1)}s`,
        `x(t) = 50 + sin(${Math.round(c.lissajousAX)}t + ${c.lissajousPhase.toFixed(2)}) · A`,
        `y(t) = 50 + sin(${Math.round(c.lissajousBY)}t) · ${c.lissajousYScale.toFixed(2)}A`,
      ].join("\n");
    },
  },
  // ─── 10. Lemniscate Bloom ───
  {
    name: "Lemniscate Bloom",
    tag: "Bernoulli Lemniscate",
    description: "The 1 + sin²t denominator pinches the center while preserving two lobes, so the curve naturally reads as a breathing infinity sign.",
    lemniscateA: 24,
    lemniscateBoost: 9,
    rotate: false,
    particleCount: 70,
    trailSpan: 0.4,
    durationMs: 5600,
    rotationDurationMs: 34000,
    pulseDurationMs: 5000,
    strokeWidth: 4.8,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const scale = config.lemniscateA + detailScale * config.lemniscateBoost;
      const denom = 1 + Math.sin(t) ** 2;
      return {
        x: 50 + (scale * Math.cos(t)) / denom,
        y: 50 + (scale * Math.sin(t) * Math.cos(t)) / denom,
      };
    },
    formula(c: CurveConfig) {
      return [
        `a = ${c.lemniscateA.toFixed(1)} + ${c.lemniscateBoost.toFixed(1)}s`,
        "x(t) = 50 + a cos t / (1 + sin² t)",
        "y(t) = 50 + a sin t cos t / (1 + sin² t)",
      ].join("\n");
    },
  },
  // ─── 11. Hypotrochoid Loop ───
  {
    name: "Hypotrochoid Loop",
    tag: "Inner Spirograph",
    description: "The rolling-circle terms create nested turns and offsets, so the path feels like a compact spirograph traced by a machine.",
    spiroR: 8.5,
    spiror: 2.3,
    spirorBoost: 0.55,
    spirod: 5.5,
    spirodBoost: 1.5,
    spiroScale: 2.85,
    rotate: false,
    particleCount: 82,
    trailSpan: 0.46,
    durationMs: 7600,
    rotationDurationMs: 42000,
    pulseDurationMs: 6200,
    strokeWidth: 4.6,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const r = config.spiror + detailScale * config.spirorBoost;
      const d = config.spirod + detailScale * config.spirodBoost;
      const x = (config.spiroR - r) * Math.cos(t) + d * Math.cos(((config.spiroR - r) / r) * t);
      const y = (config.spiroR - r) * Math.sin(t) - d * Math.sin(((config.spiroR - r) / r) * t);
      return { x: 50 + x * config.spiroScale, y: 50 + y * config.spiroScale };
    },
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + ((R-r) cos t + d cos((R-r)t/r)) · ${c.spiroScale.toFixed(2)}`,
        `y(t) = 50 + ((R-r) sin t - d sin((R-r)t/r)) · ${c.spiroScale.toFixed(2)}`,
        `R = ${c.spiroR.toFixed(1)}, r = ${c.spiror.toFixed(1)} + ${c.spirorBoost.toFixed(2)}s, d = ${c.spirod.toFixed(1)} + ${c.spirodBoost.toFixed(1)}s`,
      ].join("\n");
    },
  },
  // ─── 12. Three-Petal Spiral ───
  {
    name: "Three-Petal Spiral",
    tag: "R = 3, r = 1, d = 3",
    description: "This rolling-circle setup resolves into three large looping petals, all breathing together like a compact spiral flower.",
    spiralR: 3,
    spiralr: 1,
    spirald: 3,
    spiralScale: 2.4,
    spiralBreath: 0.55,
    rotate: true,
    particleCount: 82,
    trailSpan: 0.34,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 4.4,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX = (config.spiralR - config.spiralr) * Math.cos(t) + d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY = (config.spiralR - config.spiralr) * Math.sin(t) - d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return { x: 50 + baseX * scale, y: 50 + baseY * scale };
    },
    formula(c: CurveConfig) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${c.spiralScale.toFixed(2)} + ${c.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${c.spiralR.toFixed(1)}, r = ${c.spiralr.toFixed(1)}, d = ${c.spirald.toFixed(1)}`,
      ].join("\n");
    },
  },
  // ─── 13. Four-Petal Spiral ───
  {
    name: "Four-Petal Spiral",
    tag: "R = 4, r = 1, d = 3",
    description: "With R = 4, the rolling-circle path settles into four looping petals, rotating and breathing as one ring.",
    spiralR: 4.5,
    spiralr: 1,
    spirald: 3,
    spiralScale: 2.2,
    spiralBreath: 0.45,
    rotate: true,
    particleCount: 84,
    trailSpan: 0.34,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 4.4,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX = (config.spiralR - config.spiralr) * Math.cos(t) + d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY = (config.spiralR - config.spiralr) * Math.sin(t) - d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return { x: 50 + baseX * scale, y: 50 + baseY * scale };
    },
    formula(c: CurveConfig) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${c.spiralScale.toFixed(2)} + ${c.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${c.spiralR.toFixed(1)}, r = ${c.spiralr.toFixed(1)}, d = ${c.spirald.toFixed(1)}`,
      ].join("\n");
    },
  },
  // ─── 14. Five-Petal Spiral ───
  {
    name: "Five-Petal Spiral",
    tag: "R = 5, r = 1, d = 3",
    description: "With R = 5, the loop count increases to five petals, giving the spiral flower a denser and more ornate rhythm.",
    spiralR: 5.5,
    spiralr: 1,
    spirald: 3,
    spiralScale: 2.2,
    spiralBreath: 0.45,
    rotate: true,
    particleCount: 85,
    trailSpan: 0.34,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 4.4,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX = (config.spiralR - config.spiralr) * Math.cos(t) + d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY = (config.spiralR - config.spiralr) * Math.sin(t) - d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return { x: 50 + baseX * scale, y: 50 + baseY * scale };
    },
    formula(c: CurveConfig) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${c.spiralScale.toFixed(2)} + ${c.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${c.spiralR.toFixed(1)}, r = ${c.spiralr.toFixed(1)}, d = ${c.spirald.toFixed(1)}`,
      ].join("\n");
    },
  },
  // ─── 15. Six-Petal Spiral ───
  {
    name: "Six-Petal Spiral",
    tag: "R = 6, r = 1, d = 3",
    description: "The rolling-circle path splits into six petals, and the whole ring breathes in one unified pulse like the original loader.",
    spiralR: 6.5,
    spiralr: 1,
    spirald: 3,
    spiralScale: 2.2,
    spiralBreath: 0.45,
    rotate: true,
    particleCount: 86,
    trailSpan: 0.34,
    durationMs: 4600,
    rotationDurationMs: 28000,
    pulseDurationMs: 4200,
    strokeWidth: 4.4,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const d = config.spirald + detailScale * 0.25;
      const baseX = (config.spiralR - config.spiralr) * Math.cos(t) + d * Math.cos(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const baseY = (config.spiralR - config.spiralr) * Math.sin(t) - d * Math.sin(((config.spiralR - config.spiralr) / config.spiralr) * t);
      const scale = config.spiralScale + detailScale * config.spiralBreath;
      return { x: 50 + baseX * scale, y: 50 + baseY * scale };
    },
    formula(c: CurveConfig) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${c.spiralScale.toFixed(2)} + ${c.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${c.spiralR.toFixed(1)}, r = ${c.spiralr.toFixed(1)}, d = ${c.spirald.toFixed(1)}`,
      ].join("\n");
    },
  },
  // ─── 16. Butterfly Phase ───
  {
    name: "Butterfly Phase",
    tag: "Butterfly Curve",
    description: "Exponential and high-frequency cosine terms stretch the wings unevenly, giving the path its unmistakably fluttering butterfly shape.",
    butterflyTurns: 14,
    butterflyScale: 4.2,
    butterflyPulse: 0.55,
    butterflyCosWeight: 2.5,
    butterflyPower: 4,
    rotate: false,
    particleCount: 88,
    trailSpan: 0.32,
    durationMs: 9000,
    rotationDurationMs: 50000,
    pulseDurationMs: 7000,
    strokeWidth: 4.4,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * config.butterflyTurns;
      const s =
        Math.exp(Math.cos(t)) -
        config.butterflyCosWeight * Math.cos(4 * t) -
        Math.sin(t / 12) ** Math.round(config.butterflyPower);
      const scale = config.butterflyScale + detailScale * config.butterflyPulse;
      return { x: 50 + Math.sin(t) * s * scale, y: 50 + Math.cos(t) * s * scale };
    },
    formula(c: CurveConfig) {
      return [
        `u = ${c.butterflyTurns.toFixed(1)}t`,
        `B(u) = e^{cos u} - ${c.butterflyCosWeight.toFixed(2)} cos 4u - sin^${Math.round(c.butterflyPower)}(u/12)`,
        `x(t) = 50 + sin u · B(u) · (${c.butterflyScale.toFixed(2)} + ${c.butterflyPulse.toFixed(2)}s)`,
        `y(t) = 50 + cos u · B(u) · (${c.butterflyScale.toFixed(2)} + ${c.butterflyPulse.toFixed(2)}s)`,
      ].join("\n");
    },
  },
  // ─── 17. Cardioid Glow ───
  {
    name: "Cardioid Glow",
    tag: "Cardioid",
    description: "Because r = a(1 - cos t) collapses to zero at one side and swells on the other, the curve reads like a soft pulsing heart wave.",
    cardioidA: 9.2,
    cardioidPulse: 1.0,
    cardioidScale: 2.0,
    rotate: false,
    particleCount: 72,
    trailSpan: 0.36,
    durationMs: 6200,
    rotationDurationMs: 36000,
    pulseDurationMs: 5200,
    strokeWidth: 4.9,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.cardioidA + detailScale * config.cardioidPulse;
      const r = a * (1 - Math.cos(t));
      return { x: 50 + Math.cos(t) * r * config.cardioidScale, y: 50 + Math.sin(t) * r * config.cardioidScale };
    },
    formula(c: CurveConfig) {
      return [
        `a = ${c.cardioidA.toFixed(1)} + ${c.cardioidPulse.toFixed(2)}s`,
        "r(t) = a(1 - cos t)",
        `x(t) = 50 + cos t · r(t) · ${c.cardioidScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.cardioidScale.toFixed(2)}`,
      ].join("\n");
    },
  },
  // ─── 18. Cardioid Heart ───
  {
    name: "Cardioid Heart",
    tag: "r = a(1 + cosθ)",
    description: "Starting from r = a(1 + cos t) and rotating the coordinates turns the textbook cardioid into a more legible upright heart.",
    cardioidA: 9.2,
    cardioidPulse: 1.0,
    cardioidScale: 2.0,
    rotate: false,
    particleCount: 74,
    trailSpan: 0.36,
    durationMs: 6200,
    rotationDurationMs: 36000,
    pulseDurationMs: 5200,
    strokeWidth: 4.9,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.cardioidA + detailScale * config.cardioidPulse;
      const r = a * (1 + Math.cos(t));
      const baseX = Math.cos(t) * r;
      const baseY = Math.sin(t) * r;
      return { x: 50 - baseY * config.cardioidScale, y: 50 - baseX * config.cardioidScale };
    },
    formula(c: CurveConfig) {
      return [
        `a = ${c.cardioidA.toFixed(1)} + ${c.cardioidPulse.toFixed(2)}s`,
        "r(t) = a(1 + cos t)",
        "x'(t) = -sin t · r(t)",
        `y'(t) = -cos t · r(t), m = ${c.cardioidScale.toFixed(2)}`,
      ].join("\n");
    },
  },
  // ─── 19. Heart Wave ───
  {
    name: "Heart Wave",
    tag: "f(x) Heart Wave",
    description: "The x^(2/3) envelope supplies the heart outline, while sin(bπx) fills its interior with adjustable horizontal ripples.",
    heartWaveB: 8.0,
    heartWaveRoot: 3.6,
    heartWaveAmp: 0.7,
    heartWaveScaleX: 21.5,
    heartWaveScaleY: 22.8,
    rotate: false,
    particleCount: 104,
    trailSpan: 0.18,
    durationMs: 8400,
    rotationDurationMs: 22000,
    pulseDurationMs: 5600,
    strokeWidth: 3.9,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const xLimit = Math.sqrt(config.heartWaveRoot);
      const x = -xLimit + progress * xLimit * 2;
      const safeRoot = Math.max(0, config.heartWaveRoot - x * x);
      const wave = config.heartWaveAmp * Math.sqrt(safeRoot) * Math.sin(config.heartWaveB * Math.PI * x);
      const curve = Math.pow(Math.abs(x), 2 / 3);
      const y = curve + wave;
      const scaleY = config.heartWaveScaleY + detailScale * 1.5;
      return { x: 50 + x * config.heartWaveScaleX, y: 18 + (1.75 - y) * scaleY };
    },
    formula(c: CurveConfig) {
      return [
        `f(x) = |x|^(2/3) + ${c.heartWaveAmp.toFixed(2)}√(${c.heartWaveRoot.toFixed(2)} - x²) sin(${c.heartWaveB.toFixed(1)}πx)`,
        `screenX = 50 + x · ${c.heartWaveScaleX.toFixed(1)}`,
        `screenY = 18 + (1.75 - f(x))(${c.heartWaveScaleY.toFixed(1)} + 1.5s)`,
      ].join("\n");
    },
  },
  // ─── 20. Spiral Search ───
  {
    name: "Spiral Search",
    tag: "Archimedean Spiral",
    description: "A fast-growing angle combined with a cosine-modulated radius creates a spiral that opens out and closes cleanly back into itself.",
    searchTurns: 5,
    searchBaseRadius: 10,
    searchRadiusAmp: 7.0,
    searchPulse: 2.8,
    searchScale: 1.1,
    rotate: false,
    particleCount: 86,
    trailSpan: 0.28,
    durationMs: 7800,
    rotationDurationMs: 44000,
    pulseDurationMs: 6800,
    strokeWidth: 4.3,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const angle = t * config.searchTurns;
      const radius = config.searchBaseRadius + (1 - Math.cos(t)) * (config.searchRadiusAmp + detailScale * config.searchPulse);
      return { x: 50 + Math.cos(angle) * radius * config.searchScale, y: 50 + Math.sin(angle) * radius * config.searchScale };
    },
    formula(c: CurveConfig) {
      return [
        `θ(t) = ${c.searchTurns.toFixed(1)}t`,
        `r(t) = ${c.searchBaseRadius.toFixed(1)} + (1 - cos t)(${c.searchRadiusAmp.toFixed(1)} + ${c.searchPulse.toFixed(1)}s)`,
        `x(t) = 50 + cos θ · r(t) · ${c.searchScale.toFixed(2)}`,
        `y(t) = 50 + sin θ · r(t) · ${c.searchScale.toFixed(2)}`,
      ].join("\n");
    },
  },
  // ─── 21. Fourier Flow ───
  {
    name: "Fourier Flow",
    tag: "Fourier Curve",
    description: "Several sine and cosine components interfere with one another, so the shape keeps mutating like a living waveform.",
    fourierX1: 18,
    fourierX3: 6.5,
    fourierX5: 2.8,
    fourierY1: 16,
    fourierY2: 7.5,
    fourierY4: 3.8,
    fourierMixBase: 1.1,
    fourierMixPulse: 0.2,
    rotate: false,
    particleCount: 92,
    trailSpan: 0.31,
    durationMs: 8400,
    rotationDurationMs: 44000,
    pulseDurationMs: 6800,
    strokeWidth: 4.2,
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
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + ${c.fourierX1.toFixed(1)} cos t + ${c.fourierX3.toFixed(1)} cos(3t + 0.6m) + ${c.fourierX5.toFixed(1)} sin(5t - 0.4)`,
        `y(t) = 50 + ${c.fourierY1.toFixed(1)} sin t + ${c.fourierY2.toFixed(1)} sin(2t + 0.25) - ${c.fourierY4.toFixed(1)} cos(4t - 0.5m)`,
        `m = ${c.fourierMixBase.toFixed(2)} + ${c.fourierMixPulse.toFixed(2)}s`,
      ].join("\n");
    },
  },
];
