# test-curve-loader

A playground / test app for **@math-curve-loaders/react** — a collection of mathematically-driven loading animations built as reusable React components.

## Setup

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

## Installation

```bash
npm install @math-curve-loaders/react
```

## Importing curves

Each curve is a standalone React component. Import what you need:

```tsx
import {
  OriginalThinking,
  RoseCurve,
  ButterflyPhase,
  CardioidGlow,
  HeartWave,
  SpiralSearch,
  FourierFlow,
  // ... all other curves
} from '@math-curve-loaders/react';
```

Each component accepts `CurveConfig` props for customization:

```tsx
<OriginalThinking
  style={{ width: 120, height: 120, color: '#6366f1' }}
  baseRadius={7}
  detailAmplitude={3}
  petalCount={7}
  particleCount={64}
  trailSpan={0.38}
  durationMs={4600}
  pulseDurationMs={4200}
  rotationDurationMs={28000}
  strokeWidth={5.5}
/>
```

### Available curves

| Component | Tag | Description |
|-----------|-----|-------------|
| `OriginalThinking` | Custom Rose Trail | Base circle carved by a sevenfold cosine term |
| `ThinkingFive` | Custom Rose Trail | Fivefold term, cleaner petal rhythm |
| `ThinkingNine` | Custom Rose Trail | Ninefold term, denser inner turns |
| `RoseOrbit` | r = cos(kθ) | Radius expands/contracts with cos(7t) |
| `RoseCurve` | r = a cos(kθ) | Five evenly spaced lobes with breathing modulation |
| `RoseTwo` | r = a cos(kθ) | Rose curve variant |
| `RoseThree` | r = a cos(kθ) | Rose curve variant |
| `RoseFour` | r = a cos(kθ) | Rose curve variant |
| `LissajousDrift` | Lissajous curve | Drifting Lissajous pattern |
| `LemniscateBloom` | Lemniscate | Blooming lemniscate of Bernoulli |
| `HypotrochoidLoop` | Hypotrochoid | Spirograph-style looping |
| `ThreePetalSpiral` | 3-petal | Three-petal spiral |
| `FourPetalSpiral` | 4-petal | Four-petal spiral |
| `FivePetalSpiral` | 5-petal | Five-petal spiral |
| `SixPetalSpiral` | 6-petal | Six-petal spiral |
| `ButterflyPhase` | Butterfly curve | Butterfly curve with phase modulation |
| `CardioidGlow` | r = a(1 − cos t) | Glowing cardioid |
| `CardioidHeart` | r = a(1 + cos t) | Heart-shaped cardioid |
| `HeartWave` | Heart wave | Heart wave parametric curve |
| `SpiralSearch` | Spiral search | Expanding spiral search pattern |
| `FourierFlow` | Fourier series | Fourier series approximation |

### Minimal usage

```tsx
import { OriginalThinking } from '@math-curve-loaders/react';

function App() {
  return (
    <div className="loading-container">
      <OriginalThinking style={{ width: 80, height: 80, color: '#6366f1' }} />
    </div>
  );
}
```

All components use Tailwind-compatible sizing via `style`. Default values produce a clean, animated curve loop.
