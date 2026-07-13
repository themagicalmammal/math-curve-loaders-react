import CurveLoader from '../components/CurveLoader';
import { curves, mergeConfig } from '../data/curves';
import type { CurveConfig } from '../data/curves';

const config = curves[8];

export interface LissajousDriftProps {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function LissajousDrift({
  config: overrideConfig,
  className,
  style,
}: LissajousDriftProps) {
  const merged = mergeConfig(config, overrideConfig);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#888', marginBottom: 4, whiteSpace: 'pre-wrap' }}>
        {`import { LissajousDrift } from '@math-curve-loaders/react';`}
        {'\n'}
        {merged.formula(merged)}
      </div>
      <CurveLoader
        config={merged}
        className={className}
        style={style}
      />
    </div>
  );
}

/** Default configuration for this curve. */
LissajousDrift.config = config;
