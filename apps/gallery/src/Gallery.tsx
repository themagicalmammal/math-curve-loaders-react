import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import {
  OriginalThinking,
  ThinkingFive,
  ThinkingNine,
  RoseOrbit,
  RoseCurve,
  RoseTwo,
  RoseThree,
  RoseFour,
  LissajousDrift,
  LemniscateBloom,
  HypotrochoidLoop,
  ThreePetalSpiral,
  FourPetalSpiral,
  FivePetalSpiral,
  SixPetalSpiral,
  ButterflyPhase,
  CardioidGlow,
  CardioidHeart,
  HeartWave,
  SpiralSearch,
  FourierFlow,
} from "@math-curve-loaders/react";
import type { CurveConfig } from "@math-curve-loaders/react";
import {
  CURVE_CONFIGS,
  type CurvePlaygroundConfig,
  type ControlDef,
  generateCode,
  formatNum,
} from "./CurvesConfig";

const { vsDark } = themes;
const { github: githubTheme } = themes;

/* ─── Types ─── */

export interface CurveCardDef {
  name: string;
  tag: string;
  description: string;
  Component: React.FC<{
    config?: Partial<CurveConfig>;
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
}

/* ─── Curve list (for grid cards) ─── */

const CURVES: CurveCardDef[] = [
  {
    name: "Original Thinking",
    tag: "Custom Rose Trail",
    description:
      "A base circle carved by a sevenfold cosine term blooms into a rotating seven-petal ring.",
    Component: OriginalThinking,
    color: "#6366f1",
  },
  {
    name: "Thinking Five",
    tag: "Custom Rose Trail",
    description:
      "Replacing the sevenfold term with fivefold gives a cleaner five-petal rhythm.",
    Component: ThinkingFive,
    color: "#8b5cf6",
  },
  {
    name: "Thinking Nine",
    tag: "Custom Rose Trail",
    description:
      "A ninefold term packs more inner turns into the same orbit, denser and finely braided.",
    Component: ThinkingNine,
    color: "#a855f7",
  },
  {
    name: "Rose Orbit",
    tag: "r = cos(kθ)",
    description:
      "The radius expands and contracts with cos(7t), orbiting in repeated petals.",
    Component: RoseOrbit,
    color: "#d946ef",
  },
  {
    name: "Rose Curve",
    tag: "r = a cos(kθ)",
    description: "Five evenly spaced lobes breathing with a living pulse.",
    Component: RoseCurve,
    color: "#ec4899",
  },
  {
    name: "Rose Two",
    tag: "r = a cos(2θ)",
    description: "Broad opposing petals with a breathing pulse.",
    Component: RoseTwo,
    color: "#f43f5e",
  },
  {
    name: "Rose Three",
    tag: "r = a cos(3θ)",
    description: "Three rotating petals with organic breathing modulation.",
    Component: RoseThree,
    color: "#ef4444",
  },
  {
    name: "Rose Four",
    tag: "r = a cos(4θ)",
    description: "A balanced cross-like rose with a gentle pulse.",
    Component: RoseFour,
    color: "#f97316",
  },
  {
    name: "Lissajous Drift",
    tag: "x = sin(at), y = sin(bt)",
    description: "Different sine frequencies weave crossing patterns.",
    Component: LissajousDrift,
    color: "#f59e0b",
  },
  {
    name: "Lemniscate Bloom",
    tag: "Bernoulli Lemniscate",
    description: "A blooming infinity symbol with a pinched center.",
    Component: LemniscateBloom,
    color: "#eab308",
  },
  {
    name: "Hypotrochoid Loop",
    tag: "Inner Spirograph",
    description: "Nested turns and offsets like a compact spirograph.",
    Component: HypotrochoidLoop,
    color: "#84cc16",
  },
  {
    name: "Three-Petal Spiral",
    tag: "R = 3, r = 1, d = 3",
    description: "Three large looping petals breathing together.",
    Component: ThreePetalSpiral,
    color: "#22c55e",
  },
  {
    name: "Four-Petal Spiral",
    tag: "R = 4, r = 1, d = 3",
    description: "Four-lobe spirograph pattern with breathing life.",
    Component: FourPetalSpiral,
    color: "#10b981",
  },
  {
    name: "Five-Petal Spiral",
    tag: "R = 5, r = 1, d = 3",
    description: "Five-fold spirograph spiral with living pulse.",
    Component: FivePetalSpiral,
    color: "#14b8a6",
  },
  {
    name: "Six-Petal Spiral",
    tag: "R = 6, r = 1, d = 3",
    description: "Six-fold spirograph spiral — dense and symmetrical.",
    Component: SixPetalSpiral,
    color: "#06b6d4",
  },
  {
    name: "Butterfly Phase",
    tag: "Butterfly Curve",
    description: "Exponential and cosine terms create fluttering wings.",
    Component: ButterflyPhase,
    color: "#0ea5e9",
  },
  {
    name: "Cardioid Glow",
    tag: "Cardioid",
    description: "A heart-shaped cardioid with breathing glow.",
    Component: CardioidGlow,
    color: "#3b82f6",
  },
  {
    name: "Cardioid Heart",
    tag: "r = a(1+cosθ)",
    description: "The classic cardioid heart with gentle pulse.",
    Component: CardioidHeart,
    color: "#7c3aed",
  },
  {
    name: "Heart Wave",
    tag: "f(x) Heart Wave",
    description: "A wavy heart-shaped curve with organic motion.",
    Component: HeartWave,
    color: "#e11d48",
  },
  {
    name: "Spiral Search",
    tag: "Archimedean Spiral",
    description: "An expanding spiral with breathing turns.",
    Component: SpiralSearch,
    color: "#6d28d8",
  },
  {
    name: "Fourier Flow",
    tag: "Fourier Curve",
    description: "Sine and cosine harmonics creating a flowing shape.",
    Component: FourierFlow,
    color: "#4f46e5",
  },
];

/* ─── Code Block ─── */

function CodeBlock({ code, theme }: { code: string; theme: "dark" | "light" }) {
  const prismTheme = theme === "dark" ? vsDark : githubTheme;

  return (
    <Highlight theme={prismTheme} code={code} language="tsx">
      {({
        className: prismClassName,
        style: prismStyle,
        tokens,
        getLineProps,
        getTokenProps,
      }) => (
        <pre
          className={`prism-code ${prismClassName}`}
          style={{
            ...prismStyle,
            padding: "14px 16px",
            fontSize: 12,
            lineHeight: 1.6,
            overflowX: "auto",
            fontFamily:
              "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace",
            tabSize: 2,
            background: "transparent",
            margin: 0,
          }}
        >
          {tokens.map((line, lineIndex) => (
            <div
              key={lineIndex}
              {...getLineProps({ line })}
              style={{ paddingLeft: lineIndex === 0 ? 0 : 2 }}
            >
              {line.map((token, tokenIndex) => (
                <span key={tokenIndex} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}

/* ─── Math Formula — plain text ─── */

function MathFormula({ formula }: { formula: string }) {
  return <div className="math-formula">{formula}</div>;
}

/* ─── Param Control Card ─── */

interface ParamControlProps {
  ctrl: ControlDef;
  value: number;
  curveColor: string;
  onChange: (key: string, value: number) => void;
}

function ParamControl({
  ctrl,
  value,
  curveColor,
  onChange,
}: ParamControlProps) {
  const percentage = ((value - ctrl.min) / (ctrl.max - ctrl.min)) * 100;
  return (
    <div
      className="param-card"
      style={{ "--card-color": curveColor } as React.CSSProperties}
    >
      <div className="param-card-header">
        <span className="param-card-label">{ctrl.label}</span>
        <div className="param-card-value">
          <button
            className="param-card-btn"
            onClick={() => onChange(ctrl.key, value - ctrl.step)}
          >
            −
          </button>
          <span
            className="param-card-value-num"
            style={{ "--card-color": curveColor }}
          >
            {formatNum(value)}
          </span>
          <button
            className="param-card-btn"
            onClick={() => onChange(ctrl.key, value + ctrl.step)}
          >
            +
          </button>
        </div>
      </div>
      <div className="param-card-slider">
        <div className="param-card-track">
          <div
            className="param-card-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={ctrl.min}
          max={ctrl.max}
          step={ctrl.step}
          value={value}
          onChange={(e) => onChange(ctrl.key, Number(e.target.value))}
          aria-label={ctrl.label}
        />
      </div>
      {ctrl.description && (
        <div className="param-card-desc" title={ctrl.description}>
          {ctrl.description}
        </div>
      )}
    </div>
  );
}

/* ─── Curve Modal ─── */

export interface CurveModalProps {
  curveConfig: CurvePlaygroundConfig;
  onClose: () => void;
}

export function CurveModal({ curveConfig, onClose }: CurveModalProps) {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof document !== "undefined") {
      const stored = document.documentElement.getAttribute("data-theme");
      if (stored === "light") return "light";
    }
    return "dark";
  });

  const [values, setValues] = useState<Record<string, number>>(() => ({
    ...curveConfig.defaults,
  }));
  const [showCode, setShowCode] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [showImport, setShowImport] = useState(true);
  const [isImportCopied, setIsImportCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Trigger preview entrance animation on mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowPreview(true);
      });
    });
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleValueChange = useCallback((key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setValues({ ...curveConfig.defaults });
  }, [curveConfig]);

  const code = useMemo(
    () => generateCode(curveConfig, values),
    [curveConfig, values],
  );

  // Dynamic formula: merges base config with current values so parameters show in the formula
  const baseConfig = curveConfig.component.config as Record<string, unknown>;
  const dynamicFormula = useMemo(() => {
    try {
      const merged = { ...baseConfig, ...values };
      const formulaFn = (baseConfig.formula as (c: CurveConfig) => string) ?? curveConfig.formula;
      return typeof formulaFn === "function" ? formulaFn(merged as CurveConfig) : curveConfig.formula;
    } catch {
      return curveConfig.formula;
    }
  }, [baseConfig, values, curveConfig.formula]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [code]);

  const handleImportCopy = useCallback(async () => {
    await navigator.clipboard.writeText(curveConfig.importLabel);
    setIsImportCopied(true);
    setTimeout(() => setIsImportCopied(false), 2000);
  }, [curveConfig.importLabel]);

  const curveColor = curveConfig.color;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        style={{ "--card-color": curveColor } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Modal Body: Two-Column Layout ─── */}
        <div className="modal-body">
          {/* Left column: Header → Preview → Description → Code */}
          <div className="modal-left">
            {/* ─── Header ─── */}
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{curveConfig.name}</h2>
                <span className="modal-tag">{curveConfig.tag}</span>
              </div>
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* ─── Description ─── */}
            <p className="modal-body-description">{curveConfig.description}</p>

            {/* ─── Preview ─── */}
            <div className="modal-preview-wrap">
              <div
                className="modal-preview"
                style={{
                  opacity: showPreview ? 1 : 0,
                  transform: showPreview ? "scale(1)" : "scale(0.92)",
                }}
              >
                <curveConfig.component
                  config={values}
                  style={{ width: 200, height: 200, color: curveConfig.color }}
                />
              </div>
            </div>

            {/* ─── Import Statement ─── */}
            <div className="modal-section" style={{ marginBottom: 16 }}>
              <div className="modal-code-header">
                <span className="modal-section-label">Import</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {showImport && (
                    <button
                      className="modal-code-btn"
                      onClick={() => setShowImport(false)}
                    >
                      Hide
                    </button>
                  )}
                  <button
                    className="modal-code-btn"
                    onClick={handleImportCopy}
                    data-copied={isImportCopied}
                  >
                    {isImportCopied ? "✓ Copied" : "Copy"}
                  </button>
                  {!showImport && (
                    <button
                      className="modal-code-btn"
                      onClick={() => setShowImport(true)}
                    >
                      Show
                    </button>
                  )}
                </div>
              </div>
              {showImport && (
                <Highlight
                  theme={vsDark}
                  code={curveConfig.importLabel}
                  language="tsx"
                >
                  {({
                    className: prismClassName,
                    style: prismStyle,
                    tokens,
                    getLineProps,
                    getTokenProps,
                  }) => (
                    <pre
                      className={`prism-code ${prismClassName}`}
                      style={{ ...prismStyle, padding: "14px 16px", fontSize: 12, lineHeight: 1.6, overflowX: "auto", fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace", tabSize: 2, background: "transparent", margin: 0 }}
                    >
                      {tokens.map((line, lineIndex) => (
                        <div key={lineIndex} {...getLineProps({ line })} style={{ paddingLeft: lineIndex === 0 ? 0 : 2 }}>
                          {line.map((token, tokenIndex) => (
                            <span key={tokenIndex} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
              )}
            </div>

            {/* ─── Code ─── */}
            <div className="modal-section">
              <div className="modal-code-header">
                <span className="modal-section-label">Component</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {showCode && (
                    <button
                      className="modal-code-btn"
                      onClick={() => setShowCode(false)}
                    >
                      Hide
                    </button>
                  )}
                  <button
                    className="modal-code-btn"
                    onClick={handleCopy}
                    data-copied={isCopied}
                  >
                    {isCopied ? "✓ Copied" : "Copy"}
                  </button>
                  {!showCode && (
                    <button
                      className="modal-code-btn"
                      onClick={() => setShowCode(true)}
                    >
                      Show
                    </button>
                  )}
                </div>
              </div>
              {showCode && <CodeBlock code={code} theme={theme} />}
            </div>
          </div>

          {/* Right column: Formula + Parameters */}
          <div className="modal-right">
            <div className="modal-section">
              <div className="modal-section-label">Formula</div>
              <div className="modal-formula-wrap">
                <MathFormula formula={dynamicFormula} />
              </div>
            </div>
            <div className="modal-controls">
              <div className="modal-controls-header">
                <h3>Parameters</h3>
                <button className="modal-reset" onClick={handleReset}>
                  Reset
                </button>
              </div>
              <div className="params-grid">
                {curveConfig.controls
                  .filter((ctrl) => ctrl.section === 'formula')
                  .map((ctrl) => {
                    const val =
                      values[ctrl.key] ?? curveConfig.defaults[ctrl.key];
                    return (
                      <ParamControl
                        key={ctrl.key}
                        ctrl={ctrl}
                        value={val}
                        curveColor={curveColor}
                        onChange={handleValueChange}
                      />
                    );
                  })}
              </div>
              {curveConfig.controls.some((c) => c.section === 'formula') &&
               curveConfig.controls.some((c) => c.section === 'visual') && (
                <>
                  <div className="param-divider" />
                  <div className="param-section-label">Animation & Appearance</div>
                </>
              )}
              {curveConfig.controls
                .filter((ctrl) => ctrl.section === 'visual')
                .map((ctrl) => {
                  const val =
                    values[ctrl.key] ?? curveConfig.defaults[ctrl.key];
                  return (
                    <ParamControl
                      key={ctrl.key}
                      ctrl={ctrl}
                      value={val}
                      curveColor={curveColor}
                      onChange={handleValueChange}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery Grid ─── */

interface GalleryProps {
  onCurveSelect: (curve: CurvePlaygroundConfig) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export default function Gallery({
  onCurveSelect,
  theme,
  onToggleTheme,
}: GalleryProps) {
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  return (
    <>
      <header className="gallery-header">
        <div className="gallery-title-group">
          <h1 className="gallery-title">Math Curve Loaders</h1>
          <p className="gallery-subtitle">
            A Gallery of Mathematical Loading Animations
          </p>
        </div>
        <div className="header-divider" />
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
          <a
            className="github-link"
            href="https://github.com/themagicalmammal/math-curve-loaders-react"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              viewBox="0 0 16 16"
              width="16"
              height="16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub
          </a>
        </div>
      </header>

      <div className="gallery-grid">
        {CURVES.map((curve, idx) => {
          const playgroundConfig = CURVE_CONFIGS.find(
            (c) => c.name === curve.name,
          );
          if (!playgroundConfig) return null;
          return (
            <button
              key={curve.name}
              className="curve-card"
              style={
                {
                  "--card-color": curve.color,
                  "--delay": `${idx * 40}ms`,
                } as React.CSSProperties
              }
              onClick={() => onCurveSelect(playgroundConfig)}
              onMouseEnter={() => setHoveredName(curve.name)}
              onMouseLeave={() => setHoveredName(null)}
            >
              <div className="curve-card-preview">
                <curve.Component
                  className="curve-card-loader"
                  style={{
                    width: "64%",
                    height: "64%",
                    color: hoveredName === curve.name ? curve.color : "#e0e0e0",
                  }}
                />
              </div>
              <div className="curve-card-info">
                <span className="curve-card-name">{curve.name}</span>
                <span className="curve-card-tag">{curve.tag}</span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
