import CurveLoader from '../components/CurveLoader';
import { curves, mergeConfig } from '../data/curves';
import type { CurveConfig } from '../data/curves';

const config = curves[18];

export interface HeartWaveProps {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function HeartWave({
  config: overrideConfig,
  className,
  style,
}: HeartWaveProps) {
  return (
    <CurveLoader
      config={mergeConfig(config, overrideConfig)}
      className={className}
      style={style}
    />
  );
}

/** Default configuration for this curve. */
HeartWave.config = config;
