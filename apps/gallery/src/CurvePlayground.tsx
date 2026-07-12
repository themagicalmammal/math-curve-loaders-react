import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Highlight, themes } from 'prism-react-renderer';
import { CURVE_CONFIGS, type CurvePlaygroundConfig, generateCode, formatNum } from './CurvesConfig';

const { vsDark } = themes;
const { github: githubTheme } = themes;

/* ─── Types ─── */

interface Props {
  curveConfig: CurvePlaygroundConfig;
  onBack: () => void;
  onCurveChange: (name: string) => void;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  color: string;
  description?: string;
}

/* ─── Helpers ─── */

function formatFormulaValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '').replace(/(\.\d)0$/, '$1');
}

function substituteFormula(formula: string, values: Record<string, number>, defaults: Record<string, number>): string {
  return formula.replace(/\\text\{(\w+)\}/g, (_match: string, variableName: string) => {
    const value = values[variableName];
    if (value !== undefined && Math.abs(value - (defaults[variableName] ?? 0)) > 1e-6) {
      return formatFormulaValue(value);
    }
    return _match;
  });
}

/* ─── Slider ─── */

function Slider({ label, value, min, max, step, onChange, color, description }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbPosition, setThumbPosition] = useState(percentage);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setThumbPosition(percentage);
  }, [percentage]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleInput(event);
    const onMove = (pointerEvent: PointerEvent) => handleInput(pointerEvent as unknown as React.PointerEvent<HTMLDivElement>);
    const onUp = () => {
      setIsDragging(false);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [min, max, step, onChange]);

  const handleInput = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(stepped);
    setThumbPosition(ratio * 100);
  }, [min, max, step, onChange]);

  const showThumb = isDragging || isHovered;
  const showGlow = isDragging || isHovered;

  return (
    <div className="slider-row">
      <div className="slider-header">
        {description ? (
          <>
            <div
              className="slider-label-wrapper"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="slider-label">
                <span className="slider-label--desc">{label}<span className="slider-label--hint">i</span></span>
              </span>
            </div>
            <div className="slider-tooltip">{description}</div>
          </>
        ) : (
          <>
            <span className="slider-label">{label}</span>
            <span className="slider-value">{formatNum(value)}</span>
          </>
        )}
      </div>
      <div
        ref={trackRef}
        className="slider-track-wrapper"
        style={{ '--slider-color': color } as React.CSSProperties}
        onPointerDown={handlePointerDown}
      >
        <div className="slider-fill" style={{ width: `${thumbPosition}%` }} />
        <input
          type="range" min={min} max={max} step={step}
          value={value} onChange={(event) => onChange(Number(event.target.value))}
          aria-label={label}
        />
        {showThumb && (
          <div
            className="slider-thumb"
            data-dragging={isDragging}
            style={{
              left: `${thumbPosition}%`,
              '--slider-color': color,
            } as React.CSSProperties}
          />
        )}
        {showGlow && (
          <div
            className="slider-glow"
            style={{
              left: `${thumbPosition}%`,
              '--slider-color': color,
            } as React.CSSProperties}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Code Block ─── */

interface CodeBlockProps {
  code: string;
  theme: 'dark' | 'light';
}

function CodeBlock({ code, theme }: CodeBlockProps) {
  const prismTheme = theme === 'dark' ? vsDark : githubTheme;

  return (
    <div className="code-block" style={{ borderRadius: '0 0 8px 8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', borderTop: 'none' }}>
      <Highlight theme={prismTheme} code={code} language="tsx">
        {({ className: prismClassName, style: prismStyle, tokens, getLineProps, getTokenProps }) => (
          <pre className={`prism-code ${prismClassName}`} style={{ ...prismStyle, padding: 14, fontSize: 12, lineHeight: 1.6, overflowX: 'auto', fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace", tabSize: 2, background: 'transparent', margin: 0 }}>
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
    </div>
  );
}

/* ─── Formula Renderer ─── */

interface MathFormulaProps {
  formula: string;
  values: Record<string, number>;
  defaults: Record<string, number>;
}

function MathFormula({ formula, values, defaults }: MathFormulaProps) {
  const rendered = substituteFormula(formula, values, defaults);
  return (
    <div
      className="math-formula"
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(rendered, {
          displayMode: true,
          throwOnError: false,
          trust: true,
        }),
      }}
    />
  );
}

/* ─── Playground ─── */

export default function CurvePlayground({ curveConfig, onBack, onCurveChange }: Props) {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document !== 'undefined') {
      const storedTheme = document.documentElement.getAttribute('data-theme');
      if (storedTheme === 'light') {
        return 'light';
      }
    }
    return 'dark';
  });

  const [values, setValues] = useState<Record<string, number>>(() => {
    return { ...curveConfig.defaults };
  });

  const [showCode, setShowCode] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const config = useMemo(() => ({ ...values }), [values]);

  const handleValueChange = useCallback((key: string, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setValues({ ...curveConfig.defaults });
  }, [curveConfig]);

  const code = useMemo(() => generateCode(curveConfig, values), [curveConfig, values]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }, [code]);

  const handleCurveSelect = useCallback((curveName: string) => {
    onCurveChange(curveName);
  }, [onCurveChange]);

  /* Apply theme to document */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="playground" data-theme={theme}>
      {/* ─── Theme Toggle ─── */}
      <button
        className="theme-toggle"
        onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* ─── Curve Selector Sidebar ─── */}
      <nav className="sidebar">
        <div className="sidebar-header">Curves</div>
        {CURVE_CONFIGS.map((curve) => (
          <button
            key={curve.name}
            className={`curve-btn ${curve.name === curveConfig.name ? 'active' : ''}`}
            style={{ '--active-color': curve.color } as React.CSSProperties}
            onClick={() => handleCurveSelect(curve.name)}
          >
            <span className="curve-dot" style={{ background: curve.color }} />
            <span className="curve-name">{curve.name}</span>
          </button>
        ))}
      </nav>

      {/* ─── Main Content ─── */}
      <div className="main">
        <div className="main-inner">
          {/* Header */}
          <div className="header">
            <h1 className="title">{curveConfig.name}</h1>
            <span className="tag">{curveConfig.tag}</span>
          </div>

          {/* Curve Info */}
          <div className="curve-info">{curveConfig.description}</div>

          {/* Preview */}
          <div className="preview-wrap">
            <curveConfig.component
              config={config}
              style={{ width: 200, height: 200, color: curveConfig.color }}
            />
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="controls-header">
              <h2>Parameters</h2>
              <button className="reset-btn" onClick={handleReset}>Reset Defaults</button>
            </div>
            <div className="controls-grid">
              {curveConfig.controls.map((control) => (
                <Slider
                  key={control.key}
                  label={control.label}
                  value={values[control.key] ?? curveConfig.defaults[control.key]}
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  onChange={(value) => handleValueChange(control.key, value)}
                  color={curveConfig.color}
                  description={control.description}
                />
              ))}
            </div>
          </div>

          {/* Formula */}
          <div className="code-section">
            <div className="code-block" style={{ borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div className="code-header">
                <span className="code-label">Formula</span>
              </div>
              <div style={{ padding: '16px 14px', background: 'var(--code-bg)', maxWidth: '100%' }}>
                <MathFormula formula={curveConfig.formula} values={values} defaults={curveConfig.defaults} />
              </div>
            </div>
          </div>

          {/* Code */}
          {showCode ? (
            <div className="code-section">
              <div className="code-header" style={{ background: 'var(--code-bg)', borderRadius: '8px 8px 0 0' }}>
                <span className="code-label">JSX</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="copy-btn" onClick={() => setShowCode(false)}>Hide</button>
                  <button className="copy-btn" onClick={handleCopy} data-copied={isCopied}>
                    {isCopied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <CodeBlock code={code} theme={theme} />
            </div>
          ) : (
            <div style={{ textAlign: 'right' }}>
              <button className="copy-btn" onClick={() => setShowCode(true)} style={{ marginBottom: 12, background: 'var(--copy-bg)', color: 'var(--copy-fg)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 8 }}>Show</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
