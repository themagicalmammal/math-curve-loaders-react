import { useState, useCallback } from "react";
import CurveLoader from "../components/CurveLoader";
import ModalViewer from "../components/ModalViewer";
import { curves, type CurveConfig } from "../data/curves";

export default function Gallery() {
  const [activeConfig, setActiveConfig] = useState<CurveConfig | null>(null);
  const [phaseOffset] = useState(() => Math.random());

  const openConfig = useCallback((cfg: CurveConfig) => {
    setActiveConfig(cfg);
  }, []);

  const closeConfig = useCallback(() => {
    setActiveConfig(null);
  }, []);

  return (
    <>
      <header className="hero">
        <div className="hero-bar">
          <a
            className="repo-link"
            href="https://github.com/Paidax01/math-curve-loaders"
            target="_blank"
            rel="noreferrer"
          >
            <svg className="repo-link-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.36 6.84 9.71.5.1.68-.22.68-.5 0-.24-.01-1.03-.01-1.87-2.78.62-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.35 1.13 2.92.86.09-.67.35-1.13.63-1.39-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.05A9.33 9.33 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .28.18.61.69.5A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
            </svg>
            GitHub
          </a>
        </div>
        <p className="eyebrow">Mathematical Curve Motion</p>
        <h1>A Gallery of Mathematical Loading Animations</h1>
      </header>

      <section className="gallery" aria-label="Mathematical curve animation gallery">
        {curves.map((config) => (
          <article
            key={config.name}
            className="curve-card"
            tabIndex={0}
            role="button"
            aria-label={`Open enlarged preview and code for ${config.name}`}
            onClick={() => openConfig(config)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openConfig(config);
              }
            }}
          >
            <div className="curve-frame">
              <CurveLoader
                config={config}
                className="curve-svg"
                key={config.name}
              />
            </div>
            <div className="curve-meta">
              <h2 className="curve-title">{config.name}</h2>
              <span className="curve-tag">{config.tag}</span>
            </div>
            <p className="curve-desc">{config.description}</p>
          </article>
        ))}
      </section>

      {activeConfig && <ModalViewer config={activeConfig} onClose={closeConfig} />}
    </>
  );
}
