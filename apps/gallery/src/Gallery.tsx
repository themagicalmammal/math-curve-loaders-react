import { useState } from "react";
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
} from '@math-curve-loaders/react';
import { FormulaBlock } from './FormulaBlock';

const CURVES: { name: string; Component: React.FC<{ className?: string; style?: React.CSSProperties }> }[] = [
  { name: 'Original Thinking', Component: OriginalThinking },
  { name: 'Thinking Five', Component: ThinkingFive },
  { name: 'Thinking Nine', Component: ThinkingNine },
  { name: 'Rose Orbit', Component: RoseOrbit },
  { name: 'Rose Curve', Component: RoseCurve },
  { name: 'Rose Two', Component: RoseTwo },
  { name: 'Rose Three', Component: RoseThree },
  { name: 'Rose Four', Component: RoseFour },
  { name: 'Lissajous Drift', Component: LissajousDrift },
  { name: 'Lemniscate Bloom', Component: LemniscateBloom },
  { name: 'Hypotrochoid Loop', Component: HypotrochoidLoop },
  { name: 'Three-Petal Spiral', Component: ThreePetalSpiral },
  { name: 'Four-Petal Spiral', Component: FourPetalSpiral },
  { name: 'Five-Petal Spiral', Component: FivePetalSpiral },
  { name: 'Six-Petal Spiral', Component: SixPetalSpiral },
  { name: 'Butterfly Phase', Component: ButterflyPhase },
  { name: 'Cardioid Glow', Component: CardioidGlow },
  { name: 'Cardioid Heart', Component: CardioidHeart },
  { name: 'Heart Wave', Component: HeartWave },
  { name: 'Spiral Search', Component: SpiralSearch },
  { name: 'Fourier Flow', Component: FourierFlow },
];

export default function Gallery() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <h1>Math Curve Loaders</h1>
      <p className="subtitle">21 animated loading components · click a curve to see its formula</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.5rem',
        padding: '1rem 2rem 3rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {CURVES.map(({ name, Component }) => (
          <button
            key={name}
            onClick={() => setSelected(selected === name ? null : name)}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: selected === name ? '#1a1a2e' : '#111',
              borderRadius: '12px',
              border: `1px solid ${selected === name ? '#6366f1' : '#1a1a1a'}`,
              transition: 'border-color 0.2s, background 0.2s',
              cursor: 'pointer',
              padding: 0,
              flexBasis: 'clamp(120px, 25vw, 200px)',
            }}
          >
            <Component
              className="curve-card-loader"
              style={{
                width: '60%',
                height: '60%',
                color: '#e0e0e0',
                maxWidth: '120px',
                maxHeight: '120px',
              }}
            />
          </button>
        ))}
      </div>

      {selected && (
        <FormulaBlock
          curveName={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
