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
  return (
    <CurveLoader
      config={mergeConfig(config, overrideConfig)}
      className={className}
      style={style}
    />
  );
}

/** Default configuration for this curve. */
ButterflyPhase.config = config;
