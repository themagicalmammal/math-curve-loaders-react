import { useRef, useState, useCallback } from "react";
import CurveLoader from "./CurveLoader";
import type { CurveConfig } from "../data/curves";

interface ModalViewerProps {
  config: CurveConfig;
  onClose: () => void;
}

const CONTROL_DEFS = [
  { key: "particleCount", label: "Particles", min: 24, max: 140, step: 1 },
  { key: "trailSpan", label: "Trail", min: 0.12, max: 0.68, step: 0.01 },
  { key: "durationMs", label: "Loop", min: 2400, max: 12000, step: 100 },
  { key: "pulseDurationMs", label: "Pulse", min: 1800, max: 10000, step: 100 },
  { key: "rotationDurationMs", label: "Rotate", min: 6000, max: 60000, step: 500 },
  { key: "strokeWidth", label: "Stroke", min: 2.5, max: 7.5, step: 0.1 },
];

function formatValue(key: string, value: number) {
  if (key.endsWith("Ms")) return `${(value / 1000).toFixed(1)}s`;
  if (key === "trailSpan" || key === "strokeWidth" || !Number.isInteger(value))
    return Number(value).toFixed(2);
  return String(Math.round(value));
}

function getCurveCode(config: CurveConfig): string {
  const scalarLines: string[] = [];
  const skip = new Set([
    "point", "formula", "rotate", "particleCount", "trailSpan", "durationMs",
    "rotationDurationMs", "pulseDurationMs", "strokeWidth", "description",
  ]);
  const ordered = ["name", "tag", "rotate", "particleCount", "trailSpan", "durationMs",
    "rotationDurationMs", "pulseDurationMs", "strokeWidth"];
  const allKeys = new Set([...ordered, ...Object.keys(config)]);
  for (const k of allKeys) {
    if (skip.has(k) || k === "point" || k === "formula") continue;
    const v = (config as Record<string, unknown>)[k];
    if (typeof v !== "function") {
      scalarLines.push(`  ${k}: ${JSON.stringify(v)},`);
    }
  }
  return [
    "const config = {",
    ...scalarLines,
    `  formula: (c) => ${JSON.stringify(config.formula(config))},`,
    `  point: (progress, s, c) => { /* curve point function */ }`,
    "};",
  ].join("\n");
}

export default function ModalViewer({ config, onClose }: ModalViewerProps) {
  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    CONTROL_DEFS.forEach((cd) => {
      defaults[cd.key] = (config as Record<string, number>)[cd.key] ?? cd.min;
    });
    return defaults;
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === modalRef.current) onClose();
    },
    [onClose]
  );

  const handleReset = useCallback(() => {
    const defaults: Record<string, number> = {};
    CONTROL_DEFS.forEach((cd) => {
      defaults[cd.key] = (config as Record<string, number>)[cd.key] ?? cd.min;
    });
    setSliderValues(defaults);
  }, [config]);

  const handleSliderChange = useCallback((key: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCopy = useCallback(() => {
    const code = [config.name, "", "Formula", config.formula(config), "", "Code", getCurveCode(config)].join("\n");
    navigator.clipboard.writeText(code).catch(() => {});
  }, [config]);

  const handleDownload = useCallback(() => {
    const slug = config.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const html = `<!doctype html>\n<html><head><meta charset="utf-8" />\n<title>${config.name}</title>\n<style>:root{color-scheme:dark}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#050505;color:#f5f5f5;font-family:Inter,system-ui,sans-serif}frame{width:min(72vmin,420px);aspect-ratio:1}</style>\n</head><body><frame /></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "curve"}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [config]);

  return (
    <div
      ref={modalRef}
      className="viewer-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewer-title"
    >
      <div className="viewer">
        {/* Left panel: preview + controls */}
        <div className="viewer-preview">
          <div className="viewer-stage">
            <CurveLoader
              config={config}
              className="viewer-svg"
              particleCount={sliderValues.particleCount}
              trailSpan={sliderValues.trailSpan}
              strokeWidth={sliderValues.strokeWidth}
            />
          </div>

          <div className="viewer-copy">
            <p className="viewer-tag">{config.tag}</p>
            <h2 id="viewer-title" className="viewer-title">{config.name}</h2>
            <p className="viewer-desc">{config.description}</p>

            <div className="viewer-controls-block">
              <div className="viewer-section-head">
                <p className="viewer-code-label">Controls</p>
                <button className="viewer-reset" onClick={handleReset}>Reset</button>
              </div>
              <div className="viewer-controls">
                {CONTROL_DEFS.map((cd) => (
                  <label key={cd.key} className="viewer-control">
                    <div className="viewer-control-head">
                      <span className="viewer-control-label">{cd.label}</span>
                      <span className="viewer-control-value">
                        {formatValue(cd.key, sliderValues[cd.key] ?? cd.min)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={cd.min}
                      max={cd.max}
                      step={cd.step}
                      value={sliderValues[cd.key] ?? cd.min}
                      onChange={(e) => handleSliderChange(cd.key, Number(e.target.value))}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel: code + formula */}
        <div className="viewer-code-panel">
          <div className="viewer-code-head">
            <p className="viewer-code-label">Code</p>
            <div className="viewer-actions">
              <button className="viewer-close" onClick={handleDownload}>Download HTML</button>
              <button className="viewer-close" onClick={handleCopy}>Copy</button>
              <button className="viewer-close" onClick={onClose}>Close</button>
            </div>
          </div>
          <pre className="viewer-code"><code>{getCurveCode(config)}</code></pre>

          <div className="viewer-formula-block">
            <p className="viewer-code-label">Formula</p>
            <pre className="viewer-formula">{config.formula(config)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
