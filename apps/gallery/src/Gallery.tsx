import { useState } from 'react';
import GalleryIntro from './GalleryIntro';
import CurvePlayground from './CurvePlayground';
import { type CurvePlaygroundConfig } from './CurvesConfig';

export default function Gallery() {
  const [view, setView] = useState<'intro' | 'playground'>('intro');
  const [selectedCurve, setSelectedCurve] = useState<CurvePlaygroundConfig | null>(null);

  const handleSelect = (config: CurvePlaygroundConfig) => {
    setSelectedCurve(config);
    setView('playground');
  };

  const handleBack = () => {
    setView('intro');
    setSelectedCurve(null);
  };

  if (view === 'playground' && selectedCurve) {
    return <CurvePlayground curveConfig={selectedCurve} onBack={handleBack} />;
  }

  return <GalleryIntro onSelect={handleSelect} />;
}
