# @math-curve-loaders/react

[Mathematical curve loading animations](https://github.com/Paidax01/math-curve-loaders) as reusable React components. Zero CSS overhead — color via CSS `currentColor`, sizing via `style` or `className`.

<div>
  <a href="https://www.npmjs.com/package/@math-curve-loaders/react">
    <img src="https://img.shields.io/npm/v/@math-curve-loaders/react.svg?style=flat-square&color=blue" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@math-curve-loaders/react">
    <img src="https://img.shields.io/npm/dm/@math-curve-loaders/react?style=flat-square&color=blue" alt="npm downloads" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/npm/l/@math-curve-loaders/react.svg?style=flat-square&color=blue" alt="MIT license" />
  </a>
  <a href="https://github.com/themagicalmammal/math-curve-loaders-react">
    <img src="https://img.shields.io/github/stars/themagicalmammal/math-curve-loaders-react?style=flat-square&color=blue" alt="GitHub stars" />
  </a>
</div>

> **Install via npm:** `npm install @math-curve-loaders/react`
> **View on [npm](https://www.npmjs.com/package/@math-curve-loaders/react)**

## Installation

```bash
npm install @math-curve-loaders/react
```

```bash
yarn add @math-curve-loaders/react
```

```bash
pnpm add @math-curve-loaders/react
```

```bash
bun add @math-curve-loaders/react
```

## Quick Start

```tsx
import { OriginalThinking, RoseCurve } from '@math-curve-loaders/react';

export function App() {
  return (
    <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
      <OriginalThinking style={{ width: 120, height: 120 }} />
      <RoseCurve
        style={{ width: 80, height: 80, color: '#6366f1' }}
      />
    </div>
  );
}
```

## Available Curves (21)

| Curve | Tag | Preview |
|-------|-----|---------|
| `OriginalThinking` | Custom Rose Trail | ![Original Thinking](./docs/gifs/originalthinking.gif) |
| `ThinkingFive` | Custom Rose Trail | ![Thinking Five](./docs/gifs/thinkingfive.gif) |
| `ThinkingNine` | Custom Rose Trail | ![Thinking Nine](./docs/gifs/thinkingnine.gif) |
| `RoseOrbit` | r = cos(kθ) | ![Rose Orbit](./docs/gifs/roseorbit.gif) |
| `RoseCurve` | r = a cos(kθ) | ![Rose Curve](./docs/gifs/rosecurve.gif) |
| `RoseTwo` | r = a cos(2θ) | ![Rose Two](./docs/gifs/rosetwo.gif) |
| `RoseThree` | r = a cos(3θ) | ![Rose Three](./docs/gifs/rosethree.gif) |
| `RoseFour` | r = a cos(4θ) | ![Rose Four](./docs/gifs/rosefour.gif) |
| `LissajousDrift` | x = sin(at), y = sin(bt) | ![Lissajous Drift](./docs/gifs/lissajousdrift.gif) |
| `LemniscateBloom` | Bernoulli Lemniscate | ![Lemniscate Bloom](./docs/gifs/lemniscatebloom.gif) |
| `HypotrochoidLoop` | Inner Spirograph | ![Hypotrochoid Loop](./docs/gifs/hypotrochoidloop.gif) |
| `ThreePetalSpiral` | R = 3, r = 1, d = 3 | ![Three-Petal Spiral](./docs/gifs/threepetalspiral.gif) |
| `FourPetalSpiral` | R = 4, r = 1, d = 3 | ![Four-Petal Spiral](./docs/gifs/fourpetalspiral.gif) |
| `FivePetalSpiral` | R = 5, r = 1, d = 3 | ![Five-Petal Spiral](./docs/gifs/fivepetalspiral.gif) |
| `SixPetalSpiral` | R = 6, r = 1, d = 3 | ![Six-Petal Spiral](./docs/gifs/sixpetalspiral.gif) |
| `ButterflyPhase` | Butterfly Curve | ![Butterfly Phase](./docs/gifs/butterflyphase.gif) |
| `CardioidGlow` | Cardioid | ![Cardioid Glow](./docs/gifs/cardioidglow.gif) |
| `CardioidHeart` | r = a(1+cosθ) | ![Cardioid Heart](./docs/gifs/cardioidheart.gif) |
| `HeartWave` | f(x) Heart Wave | ![Heart Wave](./docs/gifs/heartwave.gif) |
| `SpiralSearch` | Archimedean Spiral | ![Spiral Search](./docs/gifs/spiralsearch.gif) |
| `FourierFlow` | Fourier Curve | ![Fourier Flow](./docs/gifs/fourierflow.gif) |

## Props

Each curve component accepts:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Partial<CurveConfig>` | — | Override any curve parameter (see [Parameter Reference](#parameter-reference)) |
| `className` | `string` | — | Additional CSS class for styling |
| `style` | `React.CSSProperties` | — | Inline styles (`width`, `height`, `color`, etc.) |

### Overriding Parameters

Pass a `config` object to tweak any parameter:

```tsx
<OriginalThinking
  config={{
    particleCount: 100,   // More particles
    trailSpan: 0.5,       // Longer trails
    strokeWidth: 3,       // Thinner strokes
  }}
  style={{ width: 80, height: 80, color: '#ef4444' }}
/>
```

### Static `.config` Property

Access each curve's default configuration programmatically:

```tsx
// Read the default config
const cfg = OriginalThinking.config;
console.log(cfg.name);      // "Original Thinking"
console.log(cfg.tag);       // "Custom Rose Trail"
console.log(cfg.formula());
// "x(t) = 50 + (7.0 cos t - 3.0s cos 7t) * 3.9"
// "y(t) = 50 + (7.0 sin t - 3.0s sin 7t) * 3.9"
```

## Parameter Reference

These parameters are available on **all** curves via the `config` prop:

| Parameter | Type | Default Range | Description |
|-----------|------|---------------|-------------|
| `particleCount` | `number` | 24–140 | Number of animated particles on the trail |
| `trailSpan` | `number` | 0.12–0.68 | How long the particle trail appears |
| `durationMs` | `number` | 2400–12000 | Duration of one animation loop cycle |
| `pulseDurationMs` | `number` | 1800–10000 | Speed of the breathing/pulse animation |
| `rotationDurationMs` | `number` | 6000–60000 | Speed of full rotation (if enabled) |
| `strokeWidth` | `number` | 2.5–7.5 | Thickness of the curve stroke |

Each curve may have additional curve-specific parameters. Check the individual component's `.config` for the full list.

## CSS Strategy

Components render **pure SVG** with no bundled CSS. There is no styling overhead — you control everything.

### Color

Color is inherited via CSS `currentColor`:

```css
.my-loader {
  color: #6366f1; /* SVG stroke and particles inherit this */
}
```

### Sizing

Set width and height directly:

```tsx
<OriginalThinking style={{ width: 200, height: 200 }} />
```

Or via CSS:

```css
.my-loader {
  width: 100px;
  height: 100px;
  color: #ef4444;
}
```

```tsx
<OriginalThinking className="my-loader" />
```

### Background

The SVG is transparent by default. Add a background to the container:

```tsx
<div style={{ background: '#0f172a', padding: 24, borderRadius: 12 }}>
  <OriginalThinking style={{ width: 120, height: 120 }} />
</div>
```

## TypeScript

All components are fully typed. Import `CurveConfig` for type-safe overrides:

```tsx
import { OriginalThinking } from '@math-curve-loaders/react';
import type { CurveConfig } from '@math-curve-loaders/react';

const customConfig: Partial<CurveConfig> = {
  particleCount: 120,
  trailSpan: 0.5,
  durationMs: 6000,
};

<OriginalThinking config={customConfig} />
```

## Source

Original vanilla JS by [Paidax01/math-curve-loaders](https://github.com/Paidax01/math-curve-loaders) — a gallery of 21 mathematical curve loading animations.
