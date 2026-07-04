import CurveLoader from '../components/CurveLoader';
import { curves } from '../data/curves';
import type { CurveConfig } from '../data/curves';

const config = curves[4];

export interface RoseCurveProps {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function RoseCurve({
  config: overrideConfig,
  className,
  style,
}: RoseCurveProps) {
  return (
    <CurveLoader
      config={{ ...config, ...overrideConfig } as CurveConfig}
      className={className}
      style={style}
    />
  );
}

/** Default configuration for this curve. */
RoseCurve.config = config;
