# @math-curve-loaders/react

Mathematical curve loading animations as reusable React components.

A collection of **21 beautifully crafted SVG curve loaders** — each one a mathematical curve animated in real time with trailing particles, pulsing detail, and smooth rotation. Drop them into your app as a loading spinner or decorative element.

## Installation

```bash
npm install @math-curve-loaders/react
# or
yarn add @math-curve-loaders/react
# or
pnpm add @math-curve-loaders/react
```

**Requirements:** React 18+.

## Quick Start

```tsx
import { OriginalThinking } from '@math-curve-loaders/react';

function App() {
  return <OriginalThinking style={{ width: 200, height: 200 }} />;
}
```

The animation is `currentColor`-driven, so it inherits your text color:

```tsx
<div className="text-indigo-400">
  <OriginalThinking style={{ width: 160, height: 160 }} />
</div>
```

## Available Curves

| Component | Curve Type |
|---|---|
| `OriginalThinking` | Custom Rose Trail (7-petal) |
| `ThinkingFive` | Custom Rose Trail (5-petal) |
| `ThinkingNine` | Custom Rose Trail (9-petal) |
| `RoseOrbit` | r = cos(kθ) |
| `RoseCurve` | r = a·cos(kθ) |
| `RoseTwo` | r = a·cos(2θ) |
| `RoseThree` | r = a·cos(3θ) |
| `RoseFour` | r = a·cos(4θ) |
| `LissajousDrift` | x = sin(at), y = sin(bt) |
| `LemniscateBloom` | Bernoulli Lemniscate |
| `HypotrochoidLoop` | Inner Spirograph |
| `ThreePetalSpiral` | Hypotrochoid (R=3) |
| `FourPetalSpiral` | Hypotrochoid (R=4) |
| `FivePetalSpiral` | Hypotrochoid (R=5) |
| `SixPetalSpiral` | Hypotrochoid (R=6) |
| `ButterflyPhase` | Butterfly Curve |
| `CardioidGlow` | Cardioid |
| `CardioidHeart` | r = a(1 + cos θ) |
| `HeartWave` | f(x) Heart Wave |
| `SpiralSearch` | Archimedean Spiral |
| `FourierFlow` | Fourier Curve |

## Props

Every curve component accepts:

```tsx
interface CurveComponentProps {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}
```

### Config Overrides

Fine-tune the animation by passing partial curve config:

```tsx
<OriginalThinking
  config={{
    particleCount: 120,
    trailSpan: 0.5,
    strokeWidth: 3,
    durationMs: 3000,
    petalCount: 6,
    curveScale: 4,
  }}
  style={{ width: 100, height: 100 }}
/>
```

Key parameters:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `particleCount` | `number` | curve-specific | Number of trailing dots |
| `trailSpan` | `number` | ~0.3 | Trail length (0–1) |
| `strokeWidth` | `number` | ~4.5 | SVG stroke width |
| `durationMs` | `number` | ~5000 | Animation cycle length (ms) |
| `rotate` | `boolean` | curve-specific | Whether the curve rotates |
| `rotationDurationMs` | `number` | ~28000 | Full rotation cycle (ms) |
| `pulseDurationMs` | `number` | ~4500 | Detail pulse interval (ms) |

Curve-specific parameters (e.g. `petalCount`, `roseK`, `butterflyTurns`) follow each curve's mathematical formula.

### Using curves programmatically

The `curves` array is exported so you can pick, randomize, or animate between them:

```tsx
import { curves, type CurveConfig } from '@math-curve-loaders/react';

const randomCurve = curves[Math.floor(Math.random() * curves.length)];

// Pass it to any curve component via the `config` override prop
<OriginalThinking
  config={randomCurve}
  style={{ width: 200, height: 200 }}
/>
```

Each `CurveConfig` object contains everything the animation needs (`particleCount`, `trailSpan`, `durationMs`, curve-specific parameters, and the `point()` formula).

### Re-exported types

```tsx
import type { CurveConfig } from '@math-curve-loaders/react';

const myCurve: Omit<CurveConfig, 'point' | 'formula'> = {
  name: 'My Curve',
  tag: 'Custom',
  description: '...',
  particleCount: 64,
  trailSpan: 0.35,
  durationMs: 5000,
  rotationDurationMs: 30000,
  pulseDurationMs: 4000,
  strokeWidth: 4.5,
  rotate: true,
};
```

## All exported members

```tsx
// 21 individual curve components
export {
  OriginalThinking, ThinkingFive, ThinkingNine,
  RoseOrbit, RoseCurve, RoseTwo, RoseThree, RoseFour,
  LissajousDrift, LemniscateBloom, HypotrochoidLoop,
  ThreePetalSpiral, FourPetalSpiral, FivePetalSpiral, SixPetalSpiral,
  ButterflyPhase, CardioidGlow, CardioidHeart, HeartWave,
  SpiralSearch, FourierFlow,
}

// Configuration type and curves registry
export type { CurveConfig }
export { curves }
```

## License

MIT
