import CurveLoader from '../components/CurveLoader';
import { curves, mergeConfig } from '../data/curves';
import type { CurveConfig } from '../data/curves';

const config = curves[14];

export interface SixPetalSpiralProps {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function SixPetalSpiral({
  config: overrideConfig,
  className,
  style,
}: SixPetalSpiralProps) {
  const merged = mergeConfig(config, overrideConfig);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <CurveLoader
        config={merged}
        className={className}
        style={style}
      />
    </div>
  );
}

/** Default configuration for this curve. */
SixPetalSpiral.config = config;
