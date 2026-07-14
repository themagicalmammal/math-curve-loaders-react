import CurveLoader from '../components/CurveLoader';
import { curves, mergeConfig } from '../data/curves';
import type { CurveConfig } from '../data/curves';

const config = curves[15];

export interface ButterflyPhaseProps {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function ButterflyPhase({
  config: overrideConfig,
  className,
  style,
}: ButterflyPhaseProps) {
  const merged = mergeConfig(config, overrideConfig);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#888', whiteSpace: 'pre-wrap' }}>
        {`import { ButterflyPhase } from '@math-curve-loaders/react';`}
      </div>
      <CurveLoader
        config={merged}
        className={className}
        style={style}
      />
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#888', whiteSpace: 'pre-wrap' }}>
        {merged.formula(merged)}
      </div>
    </div>
  );
}

/** Default configuration for this curve. */
ButterflyPhase.config = config;
