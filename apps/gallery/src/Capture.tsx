import { OriginalThinking, ThinkingFive, ThinkingNine, RoseOrbit, RoseCurve, RoseTwo, RoseThree, RoseFour, LissajousDrift, LemniscateBloom, HypotrochoidLoop, ThreePetalSpiral, FourPetalSpiral, FivePetalSpiral, SixPetalSpiral, ButterflyPhase, CardioidGlow, CardioidHeart, HeartWave, SpiralSearch, FourierFlow } from "@math-curve-loaders/react";

const curves = [
  { name: "Original Thinking", Component: OriginalThinking, color: "#6366f1" },
  { name: "Thinking Five", Component: ThinkingFive, color: "#8b5cf6" },
  { name: "Thinking Nine", Component: ThinkingNine, color: "#a855f7" },
  { name: "Rose Orbit", Component: RoseOrbit, color: "#d946ef" },
  { name: "Rose Curve", Component: RoseCurve, color: "#ec4899" },
  { name: "Rose Two", Component: RoseTwo, color: "#f43f5e" },
  { name: "Rose Three", Component: RoseThree, color: "#ef4444" },
  { name: "Rose Four", Component: RoseFour, color: "#f97316" },
  { name: "Lissajous Drift", Component: LissajousDrift, color: "#f59e0b" },
  { name: "Lemniscate Bloom", Component: LemniscateBloom, color: "#eab308" },
  { name: "Hypotrochoid Loop", Component: HypotrochoidLoop, color: "#84cc16" },
  { name: "Three-Petal Spiral", Component: ThreePetalSpiral, color: "#22c55e" },
  { name: "Four-Petal Spiral", Component: FourPetalSpiral, color: "#10b981" },
  { name: "Five-Petal Spiral", Component: FivePetalSpiral, color: "#14b8a6" },
  { name: "Six-Petal Spiral", Component: SixPetalSpiral, color: "#06b6d4" },
  { name: "Butterfly Phase", Component: ButterflyPhase, color: "#0ea5e9" },
  { name: "Cardioid Glow", Component: CardioidGlow, color: "#3b82f6" },
  { name: "Cardioid Heart", Component: CardioidHeart, color: "#7c3aed" },
  { name: "Heart Wave", Component: HeartWave, color: "#e11d48" },
  { name: "Spiral Search", Component: SpiralSearch, color: "#6d28d8" },
  { name: "Fourier Flow", Component: FourierFlow, color: "#4f46e5" },
];

export default function Capture() {
  return (
    <div className="c-page">
      {curves.map((curve) => (
        <div className="c-slot" key={curve.name}>
          <curve.Component
            style={{ width: 160, height: 160, color: curve.color }}
          />
        </div>
      ))}
    </div>
  );
}
