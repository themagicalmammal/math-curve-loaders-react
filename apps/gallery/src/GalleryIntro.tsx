import { CURVE_CONFIGS, type CurvePlaygroundConfig } from './CurvesConfig';

interface GalleryIntroProps {
  onSelect: (config: CurvePlaygroundConfig) => void;
}

export default function GalleryIntro({ onSelect }: GalleryIntroProps) {
  return (
    <>
      <h1>Math Curve Loaders</h1>
      <p className="subtitle">21 animated loading components · click a curve to explore</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.5rem',
        padding: '1rem 2rem 3rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {CURVE_CONFIGS.map((cfg) => (
          <button
            key={cfg.name}
            onClick={() => onSelect(cfg)}
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#111',
              borderRadius: '12px',
              border: `1px solid #1a1a1a`,
              transition: 'border-color 0.2s, background 0.2s',
              cursor: 'pointer',
              padding: 0,
              flexBasis: 'clamp(120px, 25vw, 200px)',
            }}
          >
            <cfg.component
              style={{
                width: '60%',
                height: '60%',
                color: cfg.color,
                maxWidth: '120px',
                maxHeight: '120px',
              }}
            />
          </button>
        ))}
      </div>
    </>
  );
}
