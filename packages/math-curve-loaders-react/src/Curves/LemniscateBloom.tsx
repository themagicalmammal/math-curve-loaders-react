import CurveLoader from '../components/CurveLoader';
import { curves } from '../data/curves';
import type { CurveConfig } from '../data/curves';

const config = curves[9];

export interface LemniscateBloomProps {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function LemniscateBloom({
  config: overrideConfig,
  className,
  style,
}: LemniscateBloomProps) {
  return (
    <CurveLoader
      config={{ ...config, ...overrideConfig } as CurveConfig}
      className={className}
      style={style}
    />
  );
}

/** Default configuration for this curve. */
LemniscateBloom.config = config;
