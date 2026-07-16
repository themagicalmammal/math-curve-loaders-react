import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Gallery, { CurveModal } from './Gallery';
import type { CurvePlaygroundConfig } from './CurvesConfig';
import { CURVE_CONFIGS } from './CurvesConfig';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document !== 'undefined') {
      const stored = document.documentElement.getAttribute('data-theme');
      if (stored === 'light') return 'light';
    }
    return 'dark';
  });

  const [selectedCurve, setSelectedCurve] = useState<CurvePlaygroundConfig | null>(null);
  const [selectedCurveIndex, setSelectedCurveIndex] = useState<number>(0);

  // Apply theme globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleCurveSelect = useCallback((curve: CurvePlaygroundConfig) => {
    const idx = CURVE_CONFIGS.findIndex((c) => c.name === curve.name);
    setSelectedCurve(curve);
    setSelectedCurveIndex(idx >= 0 ? idx : 0);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCurve(null);
  }, []);

  const handleNavigate = useCallback((curve: CurvePlaygroundConfig) => {
    const idx = CURVE_CONFIGS.findIndex((c) => c.name === curve.name);
    setSelectedCurve(curve);
    setSelectedCurveIndex(idx >= 0 ? idx : 0);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {selectedCurve && (
          <CurveModal
            curveConfig={selectedCurve}
            onClose={handleCloseModal}
            onNavigate={handleNavigate}
            currentIndex={selectedCurveIndex}
            totalCurves={CURVE_CONFIGS.length}
          />
        )}
      </AnimatePresence>
      <Gallery
        onCurveSelect={handleCurveSelect}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </>
  );
}
