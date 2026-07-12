import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Highlight, themes } from 'prism-react-renderer';
import { CURVE_CONFIGS, type CurvePlaygroundConfig, generateCode } from './CurvesConfig';

const { vsDark } = themes;
const { github: githubTheme } = themes;

/* ─── Types ─── */

interface Props {
  curveConfig: CurvePlaygroundConfig;
  onBack: () => void;
}

/* ─── Helpers ─── */

function toPascal(name: string): string {
  return name.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s/g, '');
}

function formatNum(v: number): string {
  if (Number.isInteger(v)) return String(v);
  if (Math.abs(v) < 10) return Number(v.toFixed(2)).toString();
  return Number(v.toFixed(1)).toString();
}

function buildConfig(_curve: CurvePlaygroundConfig, values: Record<string, number>): Record<string, number> {
  return { ...values };
}

function formatFormulaValue(val: number): string {
  return Number.isInteger(val) ? val.toString() : val.toFixed(1).replace(/\.0$/, '').replace(/(\.\d)0$/, '$1');
}

function substituteFormula(formula: string, values: Record<string, number>, defaults: Record<string, number>): string {
  let tex = formula;
  tex = tex.replace(/\\text\{(\w+)\}/g, (_match: string, varName: string) => {
    const val = values[varName];
    if (val !== undefined && Math.abs(val - (defaults[varName] ?? 0)) > 1e-6) {
      return formatFormulaValue(val);
    }
    return _match;
  });
  return tex;
}

/* ─── Slider ─── */

function Slider({ label, value, min, max, step, onChange, color, description }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; color: string; description?: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbPos, setThumbPos] = useState(percentage);
  const [active, setActive] = useState(false);
  const [nameHovered, setNameHovered] = useState(false);

  useEffect(() => {
    setThumbPos(percentage);
  }, [percentage]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setActive(true);
    handleInput(e);
    const onMove = (ev: PointerEvent) => handleInput(ev as unknown as React.PointerEvent<HTMLDivElement>);
    const onUp = () => { setActive(false); document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [min, max, step, onChange]);

  const handleInput = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(stepped);
    setThumbPos(ratio * 100);
  }, [min, max, step, onChange]);

  const showThumb = active || nameHovered;
  const showGlow = active || nameHovered;

  return (
    <div className="slider-row">
      <div className="slider-header">
        {description ? (
          <>
            <div
              className="slider-label-wrapper"
              onMouseEnter={() => setNameHovered(true)}
              onMouseLeave={() => setNameHovered(false)}
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
        <div className="slider-fill" style={{ width: `${thumbPos}%` }} />
        <input
          type="range" min={min} max={max} step={step}
          value={value} onChange={e => onChange(Number(e.target.value))}
          aria-label={label}
        />
        {showThumb && (
          <div
            className="slider-thumb"
            data-dragging={active}
            style={{
              left: `${thumbPos}%`,
              '--slider-color': color,
            } as React.CSSProperties}
          />
        )}
        {showGlow && (
          <div
            className="slider-glow"
            style={{
              left: `${thumbPos}%`,
              '--slider-color': color,
            } as React.CSSProperties}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Code Block ─── */

function CodeBlock({ code, theme }: { code: string; theme: 'dark' | 'light' }) {
  const prismTheme = theme === 'dark' ? vsDark : githubTheme;

  return (
    <div className="code-block" style={{ borderRadius: '0 0 8px 8px', overflow: 'hidden', border: '1px solid var(--border-subtle)', borderTop: 'none' }}>
      <Highlight theme={prismTheme} code={code} language="tsx">
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`prism-code ${className}`} style={{ ...style, padding: 14, fontSize: 12, lineHeight: 1.6, overflowX: 'auto', fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', Consolas, monospace", tabSize: 2, background: 'transparent', margin: 0 }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} style={{ paddingLeft: i === 0 ? 0 : 2 }}>
                {line.map((token, j) => (
                  <span key={j} {...getTokenProps({ token })} />
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

function MathFormula({ formula, values, defaults }: { formula: string; values: Record<string, number>; defaults: Record<string, number> }) {
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

export default function CurvePlayground({ curveConfig, onBack }: Props) {
  const [selected, setSelected] = useState(curveConfig.name);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document !== 'undefined') {
      const val = document.documentElement.getAttribute('data-theme');
      if (val === 'light') return 'light';
    }
    return 'dark';
  });

  const [values, setValues] = useState<Record<string, number>>(() => {
    return { ...curveConfig.defaults };
  });

  const [showCode, setShowCode] = useState(true);
  const [copied, setCopied] = useState(false);

  const curve = CURVE_CONFIGS.find((c) => c.name === selected) ?? curveConfig;
  const config = buildConfig(curve, values);

  const handleValue = useCallback((key: string, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const handleReset = useCallback(() => {
    setValues({ ...curve.defaults });
  }, [curve]);

  const code = useMemo(() => generateCode(curve, values), [curve, values]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleCurveSelect = useCallback((name: string) => {
    setSelected(name);
    const c = CURVE_CONFIGS.find((x) => x.name === name);
    if (c) setValues({ ...c.defaults });
  }, []);

  /* Apply theme to document */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="playground" data-theme={theme}>
      {/* ─── Theme Toggle ─── */}
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
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
        {CURVE_CONFIGS.map((c) => (
          <button
            key={c.name}
            className={`curve-btn ${c.name === selected ? 'active' : ''}`}
            style={{ '--active-color': c.color } as React.CSSProperties}
            onClick={() => handleCurveSelect(c.name)}
          >
            <span className="curve-dot" style={{ background: c.color }} />
            <span className="curve-name">{c.name}</span>
          </button>
        ))}
      </nav>

      {/* ─── Main Content ─── */}
      <div className="main">
        <div className="main-inner">
          {/* Header */}
          <div className="header">
            <h1 className="title">{curve.name}</h1>
            <span className="tag">{curve.tag}</span>
          </div>

          {/* Curve Info */}
          <div className="curve-info">{curve.description}</div>

          {/* Preview */}
          <div className="preview-wrap">
            <curve.component
              config={config}
              style={{ width: 200, height: 200, color: curve.color }}
            />
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="controls-header">
              <h2>Parameters</h2>
              <button className="reset-btn" onClick={handleReset}>Reset Defaults</button>
            </div>
            <div className="controls-grid">
              {curve.controls.map((ctrl) => (
                <Slider
                  key={ctrl.key}
                  label={ctrl.label}
                  value={values[ctrl.key] ?? curve.defaults[ctrl.key]}
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  onChange={(v) => handleValue(ctrl.key, v)}
                  color={curve.color}
                  description={ctrl.description}
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
                <MathFormula formula={curve.formula} values={values} defaults={curve.defaults} />
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
                  <button className="copy-btn" onClick={handleCopy} data-copied={copied}>
                    {copied ? '✓ Copied' : 'Copy'}
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
