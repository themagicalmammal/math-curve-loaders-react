/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-nocheck — curves.ts defines inline arrow functions that access
// optional numeric fields (safe at runtime since each curve defines
// exactly the fields its functions reference).
// The CurveConfig interface declares all possible optional fields.
// Inside point()/formula(), we access exactly the fields each curve sets.

export interface CurveConfig {
  baseRadius?: number;
  butterflyCosWeight?: number;
  butterflyPower?: number;
  butterflyPulse?: number;
  butterflyScale?: number;
  butterflyTurns?: number;
  cardioidA?: number;
  cardioidPulse?: number;
  cardioidScale?: number;
  curveScale?: number;
  description: string;
  detailAmplitude?: number;
  durationMs: number;
  formula(config: CurveConfig): string;
  fourierMixBase?: number;
  fourierMixPulse?: number;
  fourierX1?: number;
  fourierX3?: number;
  fourierX5?: number;
  fourierY1?: number;
  fourierY2?: number;
  fourierY4?: number;
  heartWaveAmp?: number;
  heartWaveB?: number;
  heartWaveRoot?: number;
  heartWaveScaleX?: number;
  heartWaveScaleY?: number;
  lemniscateA?: number;
  lemniscateBoost?: number;
  lissajousAmp?: number;
  lissajousAmpBoost?: number;
  lissajousAX?: number;
  lissajousBY?: number;
  lissajousPhase?: number;
  lissajousYScale?: number;
  name: string;
  orbitRadius?: number;
  particleCount: number;
  petalCount?: number;
  point(
    progress: number,
    detailScale: number,
    config: CurveConfig,
  ): { x: number; y: number };
  pulseDurationMs: number;
  roseA?: number;
  roseABoost?: number;
  roseBreathBase?: number;
  roseBreathBoost?: number;
  roseK?: number;
  roseScale?: number;
  rotate: boolean;
  rotationDurationMs: number;
  searchBaseRadius?: number;
  searchPulse?: number;
  searchRadiusAmp?: number;
  searchScale?: number;
  searchTurns?: number;
  spiralBreath?: number;
  spirald?: number;
  spiralR?: number;
  spiralr?: number;
  spiralScale?: number;
  spirod?: number;
  spirodBoost?: number;
  spiroR?: number;
  spiror?: number;
  spirorBoost?: number;
  spiroScale?: number;
  strokeWidth: number;
  tag: string;
  trailSpan: number;
}

/** Merge a base CurveConfig with optional overrides, producing a fully-typed CurveConfig. */
export function mergeConfig(
  base: CurveConfig,
  overrides?: Partial<CurveConfig>,
): CurveConfig {
  return { ...base, ...overrides } as CurveConfig;
}

export const curves: CurveConfig[] = [
  // ─── 1. Original Thinking ───
  {
    baseRadius: 8,
    curveScale: 3.5,
    description:
      "The base circle is carved by a sevenfold cosine term, so the trail blooms into a rotating seven-petal ring.",
    detailAmplitude: 4,
    durationMs: 4600,
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + (${c.baseRadius.toFixed(1)} cos t - ${c.detailAmplitude.toFixed(1)}s cos ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${c.baseRadius.toFixed(1)} sin t - ${c.detailAmplitude.toFixed(1)}s sin ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
    name: "Original Thinking",
    particleCount: 64,
    petalCount: 7,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x =
        config.baseRadius * Math.cos(t) -
        config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y =
        config.baseRadius * Math.sin(t) -
        config.detailAmplitude * detailScale * Math.sin(petals * t);
      return { x: 50 + x * config.curveScale, y: 50 + y * config.curveScale };
    },
    pulseDurationMs: 4200,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 5.5,
    tag: "Custom Rose Trail",
    trailSpan: 0.38,
  },
  // ─── 2. Thinking Five ───
  {
    baseRadius: 8,
    curveScale: 3.5,
    description:
      "Replacing the sevenfold term with a fivefold term reduces the inner loops, giving the curve a cleaner five-petal rhythm.",
    detailAmplitude: 4,
    durationMs: 4600,
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + (${c.baseRadius.toFixed(1)} cos t - ${c.detailAmplitude.toFixed(1)}s cos ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${c.baseRadius.toFixed(1)} sin t - ${c.detailAmplitude.toFixed(1)}s sin ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
    name: "Thinking Five",
    particleCount: 62,
    petalCount: 5,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x =
        config.baseRadius * Math.cos(t) -
        config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y =
        config.baseRadius * Math.sin(t) -
        config.detailAmplitude * detailScale * Math.sin(petals * t);
      return { x: 50 + x * config.curveScale, y: 50 + y * config.curveScale };
    },
    pulseDurationMs: 4200,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 5.5,
    tag: "Custom Rose Trail",
    trailSpan: 0.38,
  },
  // ─── 3. Thinking Nine ───
  {
    baseRadius: 8,
    curveScale: 3.5,
    description:
      "A ninefold term packs more inner turns into the same orbit, so the floral ring feels denser and more finely braided.",
    detailAmplitude: 4,
    durationMs: 4700,
    formula(c: CurveConfig) {
      return [
        `x(t) = 50 + (${c.baseRadius.toFixed(1)} cos t - ${c.detailAmplitude.toFixed(1)}s cos ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + (${c.baseRadius.toFixed(1)} sin t - ${c.detailAmplitude.toFixed(1)}s sin ${Math.round(c.petalCount)}t) * ${c.curveScale.toFixed(1)}`,
        "s = detailScale(time)",
      ].join("\n");
    },
    name: "Thinking Nine",
    particleCount: 68,
    petalCount: 9,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const petals = Math.round(config.petalCount);
      const x =
        config.baseRadius * Math.cos(t) -
        config.detailAmplitude * detailScale * Math.cos(petals * t);
      const y =
        config.baseRadius * Math.sin(t) -
        config.detailAmplitude * detailScale * Math.sin(petals * t);
      return { x: 50 + x * config.curveScale, y: 50 + y * config.curveScale };
    },
    pulseDurationMs: 4200,
    rotate: true,
    rotationDurationMs: 30000,
    strokeWidth: 5.5,
    tag: "Custom Rose Trail",
    trailSpan: 0.39,
  },
  // ─── 4. Rose Orbit ───
  {
    curveScale: 3.3,
    description:
      "The radius expands and contracts with cos(7t), so the orbit breathes into repeated petals while staying anchored to a circle.",
    detailAmplitude: 3.5,
    durationMs: 5200,
    formula(c: CurveConfig) {
      return [
        `r(t) = ${c.orbitRadius.toFixed(1)} - ${c.detailAmplitude.toFixed(1)}s cos(${Math.round(c.petalCount)}t)`,
        `x(t) = 50 + cos t · r(t) · ${c.curveScale.toFixed(1)}`,
        `y(t) = 50 + sin t · r(t) · ${c.curveScale.toFixed(1)}`,
      ].join("\n");
    },
    name: "Rose Orbit",
    orbitRadius: 8,
    particleCount: 72,
    petalCount: 7,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const k = Math.round(config.petalCount);
      const r =
        config.orbitRadius -
        config.detailAmplitude * detailScale * Math.cos(k * t);
      return {
        x: 50 + Math.cos(t) * r * config.curveScale,
        y: 50 + Math.sin(t) * r * config.curveScale,
      };
    },
    pulseDurationMs: 4600,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 5.2,
    tag: "r = cos(kθ)",
    trailSpan: 0.42,
  },
  // ─── 5. Rose Curve ───
  {
    description:
      "Using r = a cos(5t) creates five evenly spaced lobes, the breathing multiplier gently swells each petal in and out.",
    durationMs: 5400,
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(${Math.round(c.roseK)}t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Rose Curve",
    particleCount: 78,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const k = Math.round(config.roseK);
      const r =
        a *
        (config.roseBreathBase + detailScale * config.roseBreathBoost) *
        Math.cos(k * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
    pulseDurationMs: 4600,
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseK: 5,
    roseScale: 3.0,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 4.5,
    tag: "r = a cos(kθ)",
    trailSpan: 0.32,
  },
  // ─── 6. Rose Two ───
  {
    description:
      "With k = 2, the cosine radius forms broad opposing petals, the breathing factor makes the center pulse like the original.",
    durationMs: 5200,
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(2t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Rose Two",
    particleCount: 74,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r =
        a *
        (config.roseBreathBase + detailScale * config.roseBreathBoost) *
        Math.cos(2 * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
    pulseDurationMs: 4300,
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseScale: 3.0,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 4.6,
    tag: "r = a cos(2θ)",
    trailSpan: 0.3,
  },
  // ─── 7. Rose Three ───
  {
    description:
      "With k = 3, the curve resolves into three rotating petals, the inner breathing keeps the motion from feeling mathematically rigid.",
    durationMs: 5300,
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(3t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Rose Three",
    particleCount: 76,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r =
        a *
        (config.roseBreathBase + detailScale * config.roseBreathBoost) *
        Math.cos(3 * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
    pulseDurationMs: 4400,
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseScale: 3.0,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 4.6,
    tag: "r = a cos(3θ)",
    trailSpan: 0.31,
  },
  // ─── 8. Rose Four ───
  {
    description:
      "With k = 4, the petals settle into a balanced cross-like rose, the breathing core adds the same soft pulse as the original loader.",
    durationMs: 5400,
    formula(c: CurveConfig) {
      return [
        `r(t) = (${c.roseA.toFixed(1)} + ${c.roseABoost.toFixed(2)}s)(${c.roseBreathBase.toFixed(2)} + ${c.roseBreathBoost.toFixed(2)}s) cos(4t)`,
        `x(t) = 50 + cos t · r(t) · ${c.roseScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.roseScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Rose Four",
    particleCount: 78,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.roseA + detailScale * config.roseABoost;
      const r =
        a *
        (config.roseBreathBase + detailScale * config.roseBreathBoost) *
        Math.cos(4 * t);
      return {
        x: 50 + Math.cos(t) * r * config.roseScale,
        y: 50 + Math.sin(t) * r * config.roseScale,
      };
    },
    pulseDurationMs: 4500,
    roseA: 10.5,
    roseABoost: 0.9,
    roseBreathBase: 0.68,
    roseBreathBoost: 0.42,
    roseScale: 3.0,
    rotate: true,
    rotationDurationMs: 28000,
    strokeWidth: 4.6,
    tag: "r = a cos(4θ)",
    trailSpan: 0.32,
  },
  // ─── 9. Lissajous Drift ───
  {
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
  },
  // ─── 10. Lemniscate Bloom ───
  {
    description:
      "The 1 + sin²t denominator pinches the center while preserving two lobes, so the curve naturally reads as a breathing infinity sign.",
    durationMs: 5600,
    formula(c: CurveConfig) {
      return [
        `a = ${c.lemniscateA.toFixed(1)} + ${c.lemniscateBoost.toFixed(1)}s`,
        "x(t) = 50 + a cos t / (1 + sin² t)",
        "y(t) = 50 + a sin t cos t / (1 + sin² t)",
      ].join("\n");
    },
    lemniscateA: 24,
    lemniscateBoost: 9,
    name: "Lemniscate Bloom",
    particleCount: 70,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const scale = config.lemniscateA + detailScale * config.lemniscateBoost;
      const denom = 1 + Math.sin(t) ** 2;
      return {
        x: 50 + (scale * Math.cos(t)) / denom,
        y: 50 + (scale * Math.sin(t) * Math.cos(t)) / denom,
      };
    },
    pulseDurationMs: 5000,
    rotate: false,
    rotationDurationMs: 34000,
    strokeWidth: 4.8,
    tag: "Bernoulli Lemniscate",
    trailSpan: 0.4,
  },
  // ─── 11. Hypotrochoid Loop ───
  {
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
  },
  // ─── 12. Three-Petal Spiral ───
  {
    description:
      "This rolling-circle setup resolves into three large looping petals, all breathing together like a compact spiral flower.",
    durationMs: 4600,
    formula(c: CurveConfig) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${c.spiralScale.toFixed(2)} + ${c.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${c.spiralR.toFixed(1)}, r = ${c.spiralr.toFixed(1)}, d = ${c.spirald.toFixed(1)}`,
      ].join("\n");
    },
    name: "Three-Petal Spiral",
    particleCount: 82,
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
    spiralBreath: 0.55,
    spirald: 3,
    spiralR: 3,
    spiralr: 1,
    spiralScale: 2.4,
    strokeWidth: 4.4,
    tag: "R = 3, r = 1, d = 3",
    trailSpan: 0.34,
  },
  // ─── 13. Four-Petal Spiral ───
  {
    description:
      "With R = 4, the rolling-circle path settles into four looping petals, rotating and breathing as one ring.",
    durationMs: 4600,
    formula(c: CurveConfig) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${c.spiralScale.toFixed(2)} + ${c.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${c.spiralR.toFixed(1)}, r = ${c.spiralr.toFixed(1)}, d = ${c.spirald.toFixed(1)}`,
      ].join("\n");
    },
    name: "Four-Petal Spiral",
    particleCount: 84,
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
    spiralR: 4,
    spiralr: 1,
    spiralScale: 2.2,
    strokeWidth: 4.4,
    tag: "R = 4, r = 1, d = 3",
    trailSpan: 0.34,
  },
  // ─── 14. Five-Petal Spiral ───
  {
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
  },
  // ─── 15. Six-Petal Spiral ───
  {
    description:
      "The rolling-circle path splits into six petals, and the whole ring breathes in one unified pulse like the original loader.",
    durationMs: 4600,
    formula(c: CurveConfig) {
      return [
        "u(t) = ((R-r) cos t + d cos((R-r)t/r), (R-r) sin t - d sin((R-r)t/r))",
        `m(t) = ${c.spiralScale.toFixed(2)} + ${c.spiralBreath.toFixed(2)}s`,
        "(x, y) = 50 + u(t) · m(t)",
        `R = ${c.spiralR.toFixed(1)}, r = ${c.spiralr.toFixed(1)}, d = ${c.spirald.toFixed(1)}`,
      ].join("\n");
    },
    name: "Six-Petal Spiral",
    particleCount: 86,
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
    spiralR: 6,
    spiralr: 1,
    spiralScale: 2.2,
    strokeWidth: 4.4,
    tag: "R = 6, r = 1, d = 3",
    trailSpan: 0.34,
  },
  // ─── 16. Butterfly Phase ───
  {
    butterflyCosWeight: 2.5,
    butterflyPower: 4,
    butterflyPulse: 0.55,
    butterflyScale: 4.2,
    butterflyTurns: 14,
    description:
      "Exponential and high-frequency cosine terms stretch the wings unevenly, giving the path its unmistakably fluttering butterfly shape.",
    durationMs: 9000,
    formula(c: CurveConfig) {
      return [
        `u = ${c.butterflyTurns.toFixed(1)}t`,
        `B(u) = e^{cos u} - ${c.butterflyCosWeight.toFixed(2)} cos 4u - sin^${Math.round(c.butterflyPower)}(u/12)`,
        `x(t) = 50 + sin u · B(u) · (${c.butterflyScale.toFixed(2)} + ${c.butterflyPulse.toFixed(2)}s)`,
        `y(t) = 50 + cos u · B(u) · (${c.butterflyScale.toFixed(2)} + ${c.butterflyPulse.toFixed(2)}s)`,
      ].join("\n");
    },
    name: "Butterfly Phase",
    particleCount: 88,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * config.butterflyTurns;
      const s =
        Math.exp(Math.cos(t)) -
        config.butterflyCosWeight * Math.cos(4 * t) -
        Math.sin(t / 12) ** Math.round(config.butterflyPower);
      const scale = config.butterflyScale + detailScale * config.butterflyPulse;
      return {
        x: 50 + Math.sin(t) * s * scale,
        y: 50 + Math.cos(t) * s * scale,
      };
    },
    pulseDurationMs: 7000,
    rotate: false,
    rotationDurationMs: 50000,
    strokeWidth: 4.4,
    tag: "Butterfly Curve",
    trailSpan: 0.32,
  },
  // ─── 17. Cardioid Glow ───
  {
    cardioidA: 9.2,
    cardioidPulse: 1.0,
    cardioidScale: 2.0,
    description:
      "Because r = a(1 - cos t) collapses to zero at one side and swells on the other, the curve reads like a soft pulsing heart wave.",
    durationMs: 6200,
    formula(c: CurveConfig) {
      return [
        `a = ${c.cardioidA.toFixed(1)} + ${c.cardioidPulse.toFixed(2)}s`,
        "r(t) = a(1 - cos t)",
        `x(t) = 50 + cos t · r(t) · ${c.cardioidScale.toFixed(2)}`,
        `y(t) = 50 + sin t · r(t) · ${c.cardioidScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Cardioid Glow",
    particleCount: 72,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.cardioidA + detailScale * config.cardioidPulse;
      const r = a * (1 - Math.cos(t));
      return {
        x: 50 + Math.cos(t) * r * config.cardioidScale,
        y: 50 + Math.sin(t) * r * config.cardioidScale,
      };
    },
    pulseDurationMs: 5200,
    rotate: false,
    rotationDurationMs: 36000,
    strokeWidth: 4.9,
    tag: "Cardioid",
    trailSpan: 0.36,
  },
  // ─── 18. Cardioid Heart ───
  {
    cardioidA: 9.2,
    cardioidPulse: 1.0,
    cardioidScale: 2.0,
    description:
      "Starting from r = a(1 + cos t) and rotating the coordinates turns the textbook cardioid into a more legible upright heart.",
    durationMs: 6200,
    formula(c: CurveConfig) {
      return [
        `a = ${c.cardioidA.toFixed(1)} + ${c.cardioidPulse.toFixed(2)}s`,
        "r(t) = a(1 + cos t)",
        "x'(t) = -sin t · r(t)",
        `y'(t) = -cos t · r(t), m = ${c.cardioidScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Cardioid Heart",
    particleCount: 74,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const a = config.cardioidA + detailScale * config.cardioidPulse;
      const r = a * (1 + Math.cos(t));
      const baseX = Math.cos(t) * r;
      const baseY = Math.sin(t) * r;
      return {
        x: 50 - baseY * config.cardioidScale,
        y: 50 - baseX * config.cardioidScale,
      };
    },
    pulseDurationMs: 5200,
    rotate: false,
    rotationDurationMs: 36000,
    strokeWidth: 4.9,
    tag: "r = a(1 + cosθ)",
    trailSpan: 0.36,
  },
  // ─── 19. Heart Wave ───
  {
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
  },
  // ─── 20. Spiral Search ───
  {
    description:
      "A fast-growing angle combined with a cosine-modulated radius creates a spiral that opens out and closes cleanly back into itself.",
    durationMs: 7800,
    formula(c: CurveConfig) {
      return [
        `θ(t) = ${c.searchTurns.toFixed(1)}t`,
        `r(t) = ${c.searchBaseRadius.toFixed(1)} + (1 - cos t)(${c.searchRadiusAmp.toFixed(1)} + ${c.searchPulse.toFixed(1)}s)`,
        `x(t) = 50 + cos θ · r(t) · ${c.searchScale.toFixed(2)}`,
        `y(t) = 50 + sin θ · r(t) · ${c.searchScale.toFixed(2)}`,
      ].join("\n");
    },
    name: "Spiral Search",
    particleCount: 86,
    point(progress: number, detailScale: number, config: CurveConfig) {
      const t = progress * Math.PI * 2;
      const angle = t * config.searchTurns;
      const radius =
        config.searchBaseRadius +
        (1 - Math.cos(t)) *
          (config.searchRadiusAmp + detailScale * config.searchPulse);
      return {
        x: 50 + Math.cos(angle) * radius * config.searchScale,
        y: 50 + Math.sin(angle) * radius * config.searchScale,
      };
    },
    pulseDurationMs: 6800,
    rotate: false,
    rotationDurationMs: 44000,
    searchBaseRadius: 10,
    searchPulse: 2.8,
    searchRadiusAmp: 7.0,
    searchScale: 1.1,
    searchTurns: 5,
    strokeWidth: 4.3,
    tag: "Archimedean Spiral",
    trailSpan: 0.28,
  },
  // ─── 21. Fourier Flow ───
  {
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
  },
];
