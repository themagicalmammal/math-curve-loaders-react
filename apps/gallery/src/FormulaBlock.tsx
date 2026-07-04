import { memo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { curves } from "@math-curve-loaders/react";

interface FormulaBlockProps {
  curveName: string;
  onClose: () => void;
}

function toLaTeX(line: string): string {
  let tex = line;

  // Fix sin^N → \sin^{N} before function name replacement
  tex = tex.replace(/\bsin\^(\d+)/g, (m) => "\\sin^{${m.replace(/\bsin\^/, '')}}");
  tex = tex.replace(/\bcos\^(\d+)/g, (m) => "\\cos^{${m.replace(/\bcos\^/, '')}}");
  tex = tex.replace(/\btan\^(\d+)/g, (m) => "\\tan^{${m.replace(/\btan\^/, '')}}");

  // Unicode → LaTeX
  tex = tex.replace(/π/g, "\\pi\\,");  // \pi with thin space to avoid \pix
  tex = tex.replace(/θ/g, "\\theta");
  tex = tex.replace(/²/g, "^{2}");
  tex = tex.replace(/³/g, "^{3}");
  tex = tex.replace(/·/g, "\\cdot ");
  tex = tex.replace(/∞/g, "\\infty");
  tex = tex.replace(/×/g, "\\times ");
  tex = tex.replace(/÷/g, "\\div ");

  // √( → \sqrt{  (strip the outer parens that delimit sqrt content)
  tex = tex.replace(/√\(/g, "\\sqrt{");

  // Function names
  tex = tex.replace(/\b(sin|cos|tan|exp|log)\b/g, (match) => {
    const map: Record<string, string> = {
      sin: "\\sin", cos: "\\cos", tan: "\\tan",
      exp: "\\exp", log: "\\log",
    };
    return map[match];
  });

  // Clean up
  tex = tex.replace(/\s*\*\s*/g, " \\cdot ");
  tex = tex.replace(/  +/g, " ");

  // Fix sqrt closing: \sqrt{content})  →  \sqrt{content}
  // Only match when there's a single unclosed ) right after \sqrt{...}
  tex = tex.replace(/(\\sqrt\{[^{}]*\})\)/g, "$1");

  return tex.trim();
}

export const FormulaBlock = memo(function FormulaBlock({ curveName, onClose }: FormulaBlockProps) {
  const cfg = curves.find((c) => c.name === curveName);

  return (
    <div className="formula-panel">
      <div className="formula-panel-inner">
        <div className="formula-panel-header">
          <h2>{cfg?.tag || curveName}</h2>
          <button onClick={onClose} className="formula-close">×</button>
        </div>
        {cfg ? (
          <FormulaLines formula={cfg.formula(cfg)} />
        ) : (
          <p style={{ color: "#ef4444", fontFamily: "monospace, sans-serif" }}>
            ❌ Curve not found: {curveName}
          </p>
        )}
      </div>
    </div>
  );
});

function FormulaLines({ formula }: { formula: string }) {
  const lines = formula.split("\n");

  return (
    <pre className="formula-block">
      {lines.map((line, i) => {
        const tex = toLaTeX(line);
        return (
          <span key={i} className="formula-line">
            {line.trim() ? (
              <span
                className="formula-katex"
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(tex, {
                    throwOnError: false,
                    displayMode: false,
                    color: "#e8dcc8",
                  }),
                }}
              />
            ) : null}
          </span>
        );
      })}
    </pre>
  );
}
