import { motion } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type ControlDef,
  CURVE_CONFIGS,
  type CurvePlaygroundConfig,
  formatNum,
  generateCode,
} from "./CurvesConfig";
import Navbar from "./Navbar";

import type { CurveConfig } from "@math-curve-loaders/react";

const { vsDark } = themes;
const { github: githubTheme } = themes;

/* ─── Curve list (for grid cards) ─── */

const CURVE_CARDS = CURVE_CONFIGS.map((c) => ({
  color: c.color,
  Component: c.component,
  description: c.description,
  name: c.name,
  tag: c.tag,
}));

/* ─── Code Block ─── */

function CodeBlock({ code, theme }: { code: string; theme: "dark" | "light" }) {
  const prismTheme = theme === "dark" ? vsDark : githubTheme;

  return (
    <Highlight code={code} language="tsx" theme={prismTheme}>
      {({
        className: prismClassName,
        getLineProps,
        getTokenProps,
        style: prismStyle,
        tokens,
      }) => (
        <pre
          className={`prism-code ${prismClassName}`}
          style={{
            ...prismStyle,
            background: "transparent",
            fontFamily:
              "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontSize: 12,
            lineHeight: 1.6,
            margin: 0,
            overflowX: "auto",
            padding: "14px 16px",
            tabSize: 2,
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
  curveColor: string;
  onChange: (key: string, value: number) => void;
  value: number;
}

function ParamControl({
  ctrl,
  curveColor,
  onChange,
  value,
}: ParamControlProps) {
  const [showDesc, setShowDesc] = useState(true);
  const percentage = ((value - ctrl.min) / (ctrl.max - ctrl.min)) * 100;
  return (
    <div
      className="param-card"
      style={{ "--card-color": curveColor } as React.CSSProperties}
    >
      <div className="param-card-header">
        <div style={{ alignItems: "center", display: "flex", gap: 6 }}>
          <span className="param-card-label">{ctrl.label}</span>
          {ctrl.description && (
            <button
              aria-label="Show description"
              className="param-info-btn"
              onClick={() => setShowDesc(!showDesc)}
            >
              <svg
                fill="none"
                height="10"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                width="10"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="16" y2="12" />
                <line x1="12" x2="12.01" y1="8" y2="8" />
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
          aria-label={ctrl.label}
          max={ctrl.max}
          min={ctrl.min}
          onChange={(e) => onChange(ctrl.key, Number(e.target.value))}
          step={ctrl.step}
          type="range"
          value={value}
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
  currentIndex: number;
  curveConfig: CurvePlaygroundConfig;
  onClose: () => void;
  onNavigate?: (config: CurvePlaygroundConfig) => void;
  totalCurves: number;
}

export function CurveModal({
  currentIndex,
  curveConfig,
  onClose,
  onNavigate,
  totalCurves,
}: CurveModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [theme] = useState<"dark" | "light">(() => {
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

  const code = useMemo(
    () => generateCode(curveConfig, values),
    [curveConfig, values],
  );

  // Dynamic formula: merges base config with current values so parameters show in the formula
  const baseConfig = curveConfig.component.config as Record<string, unknown>;
  const dynamicFormula = useMemo(() => {
    try {
      const merged = { ...baseConfig, ...values };
      const formulaFn =
        (baseConfig.formula as (c: CurveConfig) => string) ??
        curveConfig.formula;
      return typeof formulaFn === "function"
        ? formulaFn(merged as CurveConfig)
        : curveConfig.formula;
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
      animate={{ opacity: 1 }}
      className="modal-backdrop"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onClick={onClose}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="modal"
        layoutId={`modal-${curveConfig.name}`}
        onClick={(e) => e.stopPropagation()}
        style={{ "--card-color": curveColor } as React.CSSProperties}
        transition={{
          damping: 30,
          duration: 0.3,
          stiffness: 300,
          type: "spring",
        }}
      >
        {/* ─── Modal Body: Two-Column Layout ─── */}
        <div className="modal-body">
          {/* Left column: Header → Preview → Description → Code */}
          <div className="modal-left">
            {/* ─── Header ─── */}
            <div className="modal-header">
              {onNavigate && currentIndex > 0 && (
                <button
                  aria-label="Previous curve"
                  className="modal-nav-btn"
                  onClick={() => onNavigate(CURVE_CONFIGS[currentIndex - 1])}
                >
                  <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
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
                    aria-label="Next curve"
                    className="modal-nav-btn"
                    onClick={() => onNavigate(CURVE_CONFIGS[currentIndex + 1])}
                  >
                    <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                )}
                <button
                  aria-label="Close"
                  className="modal-close"
                  onClick={onClose}
                >
                  <svg fill="none" height="18" viewBox="0 0 24 24" width="18">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* ─── Description ─── */}
            <p className="modal-body-description">{curveConfig.description}</p>

            {/* ─── Preview ─── */}
            <motion.div
              className="modal-preview"
              layoutId={`preview-${curveConfig.name}`}
              style={{
                opacity: showPreview ? 1 : 0,
                transform: showPreview ? "scale(1)" : "scale(0.92)",
              }}
              transition={{
                damping: 25,
                duration: 0.35,
                stiffness: 250,
                type: "spring",
              }}
            >
              <div className="preview-inner">
                <curveConfig.component
                  config={values}
                  style={{ color: curveConfig.color, height: 200, width: 200 }}
                />
              </div>
            </motion.div>

            {/* ─── Import Statement ─── */}
            <div
              className="modal-section mobile-hidden"
              style={{ marginBottom: 16 }}
            >
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
                    data-copied={isImportCopied}
                    onClick={handleImportCopy}
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
                  code={curveConfig.importLabel}
                  language="tsx"
                  theme={vsDark}
                >
                  {({
                    className: prismClassName,
                    getLineProps,
                    getTokenProps,
                    style: prismStyle,
                    tokens,
                  }) => (
                    <pre
                      className={`prism-code ${prismClassName}`}
                      style={{
                        ...prismStyle,
                        background: "transparent",
                        fontFamily:
                          "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        fontSize: 12,
                        lineHeight: 1.6,
                        margin: 0,
                        overflowX: "auto",
                        padding: "14px 16px",
                        tabSize: 2,
                      }}
                    >
                      {tokens.map((line, lineIndex) => (
                        <div
                          key={lineIndex}
                          {...getLineProps({ line })}
                          style={{ paddingLeft: lineIndex === 0 ? 0 : 2 }}
                        >
                          {line.map((token, tokenIndex) => (
                            <span
                              key={tokenIndex}
                              {...getTokenProps({ token })}
                            />
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
                    data-copied={isCopied}
                    onClick={handleCopy}
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
                      data-copied={isSourceCopied}
                      onClick={handleSourceCopy}
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
                {showSource && (
                  <CodeBlock code={curveConfig.source} theme={theme} />
                )}
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
                  <div
                    style={{ alignItems: "center", display: "flex", gap: 8 }}
                  >
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
                            .filter((c) => c.section === "formula")
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
                      .filter((ctrl) => ctrl.section === "formula")
                      .map((ctrl) => {
                        const val =
                          values[ctrl.key] ?? curveConfig.defaults[ctrl.key];
                        return (
                          <ParamControl
                            ctrl={ctrl}
                            curveColor={curveColor}
                            key={ctrl.key}
                            onChange={handleValueChange}
                            value={val}
                          />
                        );
                      })}
                  </div>
                )}
                {showParams && (
                  <div
                    className="param-section-group"
                    style={{ marginTop: 16 }}
                  >
                    <div className="modal-controls-header">
                      <h3>Animation</h3>
                      <button
                        className="modal-reset"
                        onClick={() => {
                          const defaults = Object.fromEntries(
                            curveConfig.controls
                              .filter((c) => c.section === "visual")
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
                        .filter((ctrl) => ctrl.section === "visual")
                        .map((ctrl) => {
                          const val =
                            values[ctrl.key] ?? curveConfig.defaults[ctrl.key];
                          return (
                            <ParamControl
                              ctrl={ctrl}
                              curveColor={curveColor}
                              key={ctrl.key}
                              onChange={handleValueChange}
                              value={val}
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
  onToggleTheme: () => void;
  theme: "dark" | "light";
}

export default function Gallery({
  onCurveSelect,
  onToggleTheme,
  theme,
}: GalleryProps) {
  const [hoveredName, setHoveredName] = useState<null | string>(null);

  return (
    <>
      <Navbar onToggleTheme={onToggleTheme} theme={theme} />

      <div className="gallery-grid">
        {CURVE_CARDS.map((curve, idx) => {
          const playgroundConfig = CURVE_CONFIGS.find(
            (c) => c.name === curve.name,
          );
          if (!playgroundConfig) return null;
          return (
            <motion.button
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="curve-card"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              key={curve.name}
              onClick={() => onCurveSelect(playgroundConfig)}
              onMouseEnter={() => setHoveredName(curve.name)}
              onMouseLeave={() => setHoveredName(null)}
              style={
                {
                  "--card-color": curve.color,
                } as React.CSSProperties
              }
              transition={{ delay: idx * 0.04, duration: 0.4, ease: "easeOut" }}
            >
              <div
                className="curve-card-preview"
                style={{ "--card-color": curve.color } as React.CSSProperties}
              >
                <motion.div
                  className="curve-card-loader"
                  layoutId={`preview-${curve.name}`}
                  style={{
                    color:
                      hoveredName === curve.name
                        ? curve.color
                        : "var(--card-fg)",
                    height: "64%",
                    width: "64%",
                  }}
                  transition={{
                    damping: 25,
                    duration: 0.35,
                    stiffness: 250,
                    type: "spring",
                  }}
                >
                  <curve.Component
                    className="curve-card-loader"
                    style={{ height: "100%", width: "100%" }}
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
