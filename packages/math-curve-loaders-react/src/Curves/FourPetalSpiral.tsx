import CurveLoader from "../components/CurveLoader";
import { curves, mergeConfig } from "../data/curves";

import type { CurveConfig } from "../data/curves";

const config = curves[12];

export interface FourPetalSpiralProps {
  /** Additional CSS class name */
  className?: string;
  /** Override specific curve parameters */
  config?: Partial<
    Omit<CurveConfig, "description" | "formula" | "name" | "point" | "tag">
  >;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function FourPetalSpiral({
  className,
  config: overrideConfig,
  style,
}: FourPetalSpiralProps) {
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
FourPetalSpiral.config = config;
