import CurveLoader from '../components/CurveLoader';
import { curves } from '../data/curves';
import type { CurveConfig } from '../data/curves';

const config = curves[10];

export interface HypotrochoidLoopProps {
  /** Override specific curve parameters */
  config?: Partial<Omit<CurveConfig, 'name' | 'tag' | 'description' | 'point' | 'formula'>>;
  /** Additional CSS class name */
  className?: string;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function HypotrochoidLoop({
  config: overrideConfig,
  className,
  style,
}: HypotrochoidLoopProps) {
  return (
    <CurveLoader
      config={{ ...config, ...overrideConfig } as CurveConfig}
      className={className}
      style={style}
    />
  );
}

/** Default configuration for this curve. */
HypotrochoidLoop.config = config;
