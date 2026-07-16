import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { Highlight, themes } from "prism-react-renderer";
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

/* ─── Curve list (for grid cards) ─── */

const CURVE_CARDS = CURVE_CONFIGS.map((c) => ({
  name: c.name,
  tag: c.tag,
  description: c.description,
  Component: c.component,
  color: c.color,
}));

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
  const [showDesc, setShowDesc] = useState(true);
  const percentage = ((value - ctrl.min) / (ctrl.max - ctrl.min)) * 100;
  return (
    <div
      className="param-card"
      style={{ "--card-color": curveColor } as React.CSSProperties}
    >
      <div className="param-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="param-card-label">{ctrl.label}</span>
          {ctrl.description && (
            <button
              className="param-info-btn"
              onClick={() => setShowDesc(!showDesc)}
              aria-label="Show description"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          )}
        </div>
        <div className="param-card-value">
          <button
            className="param-card-btn"
            onClick={() =>
              onChange(ctrl.key, Math.max(ctrl.min, value - ctrl.step))
            }
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
            onClick={() =>
              onChange(ctrl.key, Math.min(ctrl.max, value + ctrl.step))
            }
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
      {ctrl.description && showDesc && (
        <div className="param-card-desc">{ctrl.description}</div>
      )}
    </div>
  );
}

/* ─── Curve Modal ─── */

export interface CurveModalProps {
  curveConfig: CurvePlaygroundConfig;
  onClose: () => void;
  onNavigate?: (config: CurvePlaygroundConfig) => void;
  currentIndex: number;
  totalCurves: number;
}

export function CurveModal({ curveConfig, onClose, onNavigate, currentIndex, totalCurves }: CurveModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [theme, _setTheme] = useState<"dark" | "light">(() => {
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
  const [showSource, setShowSource] = useState(false);
  const [isSourceCopied, setIsSourceCopied] = useState(false);
  const [showImport, setShowImport] = useState(true);
  const [isImportCopied, setIsImportCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFormula, setShowFormula] = useState(true);
  const [showParams, setShowParams] = useState(true);

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

  // Close on Escape; navigate on arrow keys
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (onNavigate) {
        if (e.key === "ArrowLeft" && currentIndex > 0) {
          onNavigate(CURVE_CONFIGS[currentIndex - 1]);
        }
        if (e.key === "ArrowRight" && currentIndex < totalCurves - 1) {
          onNavigate(CURVE_CONFIGS[currentIndex + 1]);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNavigate, currentIndex, totalCurves]);

  const handleValueChange = useCallback(
    (key: string, value: number) => {
      setValues((prev) => {
        const ctrl = curveConfig.controls.find((c) => c.key === key);
        if (!ctrl) return { ...prev, [key]: value };
        const clamped = Math.min(ctrl.max, Math.max(ctrl.min, value));
        return { ...prev, [key]: clamped };
      });
    },
    [curveConfig.controls],
  );

  const _handleReset = useCallback(() => {
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

  const handleSourceCopy = useCallback(async () => {
    await navigator.clipboard.writeText(curveConfig.source ?? "");
    setIsSourceCopied(true);
    setTimeout(() => setIsSourceCopied(false), 2000);
  }, [curveConfig.source]);

  const handleImportCopy = useCallback(async () => {
    await navigator.clipboard.writeText(curveConfig.importLabel);
    setIsImportCopied(true);
    setTimeout(() => setIsImportCopied(false), 2000);
  }, [curveConfig.importLabel]);

  const curveColor = curveConfig.color;

  return (
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="modal"
        style={{ "--card-color": curveColor } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
        layoutId={`modal-${curveConfig.name}`}
        transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
      >
        {/* ─── Modal Body: Two-Column Layout ─── */}
        <div className="modal-body">
          {/* Left column: Header → Preview → Description → Code */}
          <div className="modal-left">
            {/* ─── Header ─── */}
            <div className="modal-header">
              {onNavigate && currentIndex > 0 && (
                <button
                  className="modal-nav-btn"
                  onClick={() => onNavigate(CURVE_CONFIGS[currentIndex - 1])}
                  aria-label="Previous curve"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <div className="modal-header-title">
                <h2 className="modal-title">{curveConfig.name}</h2>
                <span className="modal-tag">{curveConfig.tag}</span>
              </div>
              <div className="modal-header-actions">
                {onNavigate && currentIndex < totalCurves - 1 && (
                  <button
                    className="modal-nav-btn"
                    onClick={() => onNavigate(CURVE_CONFIGS[currentIndex + 1])}
                    aria-label="Next curve"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
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
            </div>

            {/* ─── Description ─── */}
            <p className="modal-body-description">{curveConfig.description}</p>

            {/* ─── Preview ─── */}
            <div className="modal-preview-wrap">
              <motion.div
                className="modal-preview"
                layoutId={`preview-${curveConfig.name}`}
                transition={{ type: "spring", stiffness: 250, damping: 25, duration: 0.35 }}
                style={{
                  opacity: showPreview ? 1 : 0,
                  transform: showPreview ? "scale(1)" : "scale(0.92)",
                }}
              >
                <curveConfig.component
                  config={values}
                  style={{ width: 200, height: 200, color: curveConfig.color }}
                />
              </motion.div>
            </div>

            {/* ─── Import Statement ─── */}
            <div className="modal-section mobile-hidden" style={{ marginBottom: 16 }}>
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
            <div className="modal-section mobile-hidden">
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

            {/* ─── Source Code ─── */}
            {curveConfig.source && (
              <div className="modal-section mobile-hidden">
                <div className="modal-code-header">
                  <span className="modal-section-label">Source</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {showSource && (
                      <button
                        className="modal-code-btn"
                        onClick={() => setShowSource(false)}
                      >
                        Hide
                      </button>
                    )}
                    <button
                      className="modal-code-btn"
                      onClick={handleSourceCopy}
                      data-copied={isSourceCopied}
                    >
                      {isSourceCopied ? "✓ Copied" : "Copy"}
                    </button>
                    {!showSource && (
                      <button
                        className="modal-code-btn"
                        onClick={() => setShowSource(true)}
                      >
                        Show
                      </button>
                    )}
                  </div>
                </div>
                {showSource && <CodeBlock code={curveConfig.source} theme={theme} />}
              </div>
            )}
          </div>

          {/* Right column: Formula + Parameters */}
          <div className="modal-right">
            <div className="modal-section mobile-hidden">
              <div className="modal-code-header">
                <span className="modal-section-label">Formula</span>
                <button
                  className="modal-code-btn"
                  onClick={() => setShowFormula(!showFormula)}
                >
                  {showFormula ? "Hide" : "Show"}
                </button>
              </div>
              {showFormula && (
                <div className="modal-formula-wrap">
                  <MathFormula formula={dynamicFormula} />
                </div>
              )}
            </div>
            <div className="modal-controls">
              <div className="param-section-group">
                <div className="modal-controls-header">
                  <h3>Parameters</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className="modal-code-btn"
                      onClick={() => setShowParams(!showParams)}
                    >
                      {showParams ? "Hide" : "Show"}
                    </button>
                    <button
                      className="modal-reset"
                    onClick={() => {
                      const defaults = Object.fromEntries(
                        curveConfig.controls
                          .filter((c) => c.section === 'formula')
                          .map((c) => [c.key, curveConfig.defaults[c.key]]),
                      );
                      setValues((prev) => ({ ...prev, ...defaults }));
                    }}
                  >
                    Reset
                    </button>
                  </div>
                </div>
                {showParams && (
                  <div className="params-grid params-grid-2">
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
                )}
                {showParams && (
                <div className="param-section-group" style={{ marginTop: 16 }}>
                  <div className="modal-controls-header">
                    <h3>Animation</h3>
                    <button
                      className="modal-reset"
                      onClick={() => {
                        const defaults = Object.fromEntries(
                          curveConfig.controls
                            .filter((c) => c.section === 'visual')
                            .map((c) => [c.key, curveConfig.defaults[c.key]]),
                        );
                        setValues((prev) => ({ ...prev, ...defaults }));
                      }}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="params-grid params-grid-2">
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
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <div className="gallery-grid">
        {CURVE_CARDS.map((curve, idx) => {
          const playgroundConfig = CURVE_CONFIGS.find(
            (c) => c.name === curve.name,
          );
          if (!playgroundConfig) return null;
          return (
            <motion.button
              key={curve.name}
              className="curve-card"
              style={
                {
                  "--card-color": curve.color,
                } as React.CSSProperties
              }
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: idx * 0.04, duration: 0.4, ease: "easeOut" }}
              onClick={() => onCurveSelect(playgroundConfig)}
              onMouseEnter={() => setHoveredName(curve.name)}
              onMouseLeave={() => setHoveredName(null)}
            >
              <div className="curve-card-preview"
                style={{ "--card-color": curve.color } as React.CSSProperties}
              >
                <motion.div
                  className="curve-card-loader"
                  layoutId={`preview-${curve.name}`}
                  transition={{ type: "spring", stiffness: 250, damping: 25, duration: 0.35 }}
                  style={{
                    width: "64%",
                    height: "64%",
                    color: hoveredName === curve.name ? curve.color : "var(--card-fg)",
                  }}
                >
                  <curve.Component
                    className="curve-card-loader"
                    style={{ width: "100%", height: "100%" }}
                  />
                </motion.div>
              </div>
              <div className="curve-card-info">
                <span className="curve-card-name">{curve.name}</span>
                <span className="curve-card-tag">{curve.tag}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
