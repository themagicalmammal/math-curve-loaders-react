import CurveLoader from "../components/CurveLoader";
import { curves, mergeConfig } from "../data/curves";

import type { CurveConfig } from "../data/curves";

const config = curves[7];

export interface RoseFourProps {
  /** Additional CSS class name */
  className?: string;
  /** Override specific curve parameters */
  config?: Partial<
    Omit<CurveConfig, "description" | "formula" | "name" | "point" | "tag">
  >;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function RoseFour({
  className,
  config: overrideConfig,
  style,
}: RoseFourProps) {
  const merged = mergeConfig(config, overrideConfig);
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <CurveLoader className={className} config={merged} style={style} />
    </div>
  );
}

/** Default configuration for this curve. */
RoseFour.config = config;
