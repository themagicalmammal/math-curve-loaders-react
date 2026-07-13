import { useState, useCallback, useEffect } from 'react';
import Gallery, { CurveModal } from './Gallery';
import type { CurvePlaygroundConfig } from './CurvesConfig';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document !== 'undefined') {
      const stored = document.documentElement.getAttribute('data-theme');
      if (stored === 'light') return 'light';
    }
    return 'dark';
  });

  const [selectedCurve, setSelectedCurve] = useState<CurvePlaygroundConfig | null>(null);

  // Apply theme globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleCurveSelect = useCallback((curve: CurvePlaygroundConfig) => {
    setSelectedCurve(curve);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCurve(null);
  }, []);

  return (
    <>
      {selectedCurve && (
        <CurveModal
          curveConfig={selectedCurve}
          onClose={handleCloseModal}
        />
      )}
      <Gallery
        onCurveSelect={handleCurveSelect}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </>
  );
}
