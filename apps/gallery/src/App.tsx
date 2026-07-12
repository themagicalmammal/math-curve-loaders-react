import { CURVE_CONFIGS } from './CurvesConfig';
import CurvePlayground from './CurvePlayground';

export default function App() {
  return <CurvePlayground curveConfig={CURVE_CONFIGS[0]} onBack={() => {}} onCurveChange={() => {}} />;
}
