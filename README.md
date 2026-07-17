# Math Curve Loaders React

<div align="center">

[![npm version](https://img.shields.io/npm/v/@math-curve-loaders/react.svg)](https://www.npmjs.com/package/@math-curve-loaders/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![React 18+](https://img.shields.io/badge/React-18%20%7C%2019-%61?style?flat&logo=react)](https://react.dev/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@math-curve-loaders/react?label=zip)](https://bundlephobia.com/package/@math-curve-loaders/react)
[![Downloads](https://img.shields.io/npm/dw/@math-curve-loaders/react.svg)](https://www.npmjs.com/package/@math-curve-loaders/react)

Beautiful mathematical curve loading animations as lightweight React components. Zero CSS overhead. Fully typed. CSS `currentColor`-driven.

[**Live Gallery**](https://math-curve-loaders.vercel.app) &middot; [**Report a Bug**](https://github.com/themagicalmammal/math-curve-loaders-react/issues) &middot; [**Request a Feature**](https://github.com/themagicalmammal/math-curve-loaders-react/issues)

</div>

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

## 21 Mathematical Curves

Each component is a self-contained SVG animation. No CSS, no dependencies beyond React.

| Curve | Math | Curve | Math |
|-------|------|-------|------|
| **OriginalThinking** | Custom Rose Trail | **RoseOrbit** | `r = cos(7t)` |
| **ThinkingFive** | Custom Rose Trail | **RoseCurve** | `r = a cos(kθ)` |
| **ThinkingNine** | Custom Rose Trail | **RoseTwo** | `r = a cos(2θ)` |
| **RoseCurve** | `r = a cos(kθ)` | **RoseThree** | `r = a cos(3θ)` |
| **RoseTwo** | `r = a cos(2θ)` | **RoseFour** | `r = a cos(4θ)` |
| **RoseThree** | `r = a cos(3θ)` | **LissajousDrift** | `x=sin(at), y=sin(bt)` |
| **RoseFour** | `r = a cos(4θ)` | **LemniscateBloom** | Bernoulli Lemniscate |
| **LissajousDrift** | `x=sin(at), y=sin(bt)` | **HypotrochoidLoop** | Inner Spirograph |
| **LemniscateBloom** | Bernoulli Lemniscate | **Three/Four/Five/SixPetalSpiral** | Spirograph (R, r, d) |
| **HypotrochoidLoop** | Inner Spirograph | **ButterflyPhase** | Butterfly Curve |
| **ThreePetalSpiral** | R=3, r=1, d=3 | **CardioidGlow / CardioidHeart** | Cardioid |
| **FourPetalSpiral** | R=4, r=1, d=3 | **HeartWave** | f(x) Heart Wave |
| **FivePetalSpiral** | R=5, r=1, d=3 | **SpiralSearch** | Archimedean Spiral |
| **SixPetalSpiral** | R=6, r=1, d=3 | **FourierFlow** | Fourier Series |

> Full list with animated previews: [**View all 21 curves**](https://math-curve-loaders.vercel.app)

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Partial<CurveConfig>` | — | Override any curve parameter (see below) |
| `className` | `string` | — | Additional CSS class |
| `style` | `React.CSSProperties` | — | Inline styles (`width`, `height`, `color`, etc.) |

### Custom Parameters

Pass a `config` object to tweak animation behavior:

```tsx
<OriginalThinking
  config={{
    particleCount: 100,   // More particles on the trail
    trailSpan: 0.5,       // Longer trail length
    strokeWidth: 3,       // Thinner stroke
    durationMs: 6000,     // Slower animation cycle
  }}
  style={{ width: 80, height: 80, color: '#ef4444' }}
/>
```

### Available Parameters

| Parameter | Type | Default Range | Description |
|-----------|------|---------------|-------------|
| `particleCount` | `number` | 24--140 | Number of particles on the trail |
| `trailSpan` | `number` | 0.12--0.68 | Trail length |
| `durationMs` | `number` | 2400--12000 | Animation cycle duration |
| `pulseDurationMs` | `number` | 1800--10000 | Breathing/pulse animation speed |
| `rotationDurationMs` | `number` | 6000--60000 | Full rotation speed |
| `strokeWidth` | `number` | 2.5--7.5 | Curve stroke thickness |

Each curve may define additional parameters. Access defaults via the static `.config` property:

```tsx
const cfg = OriginalThinking.config;
console.log(cfg.name);      // "Original Thinking"
console.log(cfg.tag);       // "Custom Rose Trail"
console.log(cfg.formula()); // "x(t) = 50 + ..."
```

## CSS Strategy

Components render pure SVG with **zero bundled CSS**. You control everything.

### Color via `currentColor`

```css
.my-loader {
  color: #6366f1; /* SVG stroke and particles inherit this */
}
```

### Sizing

```tsx
<OriginalThinking style={{ width: 200, height: 200 }} />
```

### Dark Mode

The SVG is transparent by default. Wrap in a dark container:

```tsx
<div style={{ background: '#0f172a', padding: 24, borderRadius: 12 }}>
  <RoseCurve style={{ width: 120, height: 120 }} />
</div>
```

## TypeScript

Fully typed out of the box:

```tsx
import { OriginalThinking, type CurveConfig } from '@math-curve-loaders/react';

const config: Partial<CurveConfig> = {
  particleCount: 120,
  trailSpan: 0.5,
  durationMs: 6000,
};

<OriginalThinking config={config} />
```

## Framework Compatibility

| Framework | Status |
|-----------|--------|
| React 18+ | Native |
| Next.js | Works (static export compatible) |
| Vite / Remix | Works out of the box |

## Source

Original vanilla JS animations by [Paidax01/math-curve-loaders](https://github.com/Paidax01/math-curve-loaders) -- a gallery of 21 mathematical curve loading animations.
