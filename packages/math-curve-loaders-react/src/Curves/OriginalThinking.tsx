import CurveLoader from "../components/CurveLoader";
import { curves, mergeConfig } from "../data/curves";

import type { CurveConfig } from "../data/curves";

const config = curves[0];

export interface OriginalThinkingProps {
  /** Additional CSS class name */
  className?: string;
  /** Override specific curve parameters */
  config?: Partial<
    Omit<CurveConfig, "description" | "formula" | "name" | "point" | "tag">
  >;
  /** Inline styles (width, height, etc.) */
  style?: React.CSSProperties;
}

export default function OriginalThinking({
  className,
  config: overrideConfig,
  style,
}: OriginalThinkingProps) {
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
OriginalThinking.config = config;
