/**
 * Generate 21 individual capture HTML + TSX files — one per curve.
 *
 * Each HTML file renders a single curve component on a dark background,
 * with no gallery UI. These are used for GIF capture.
 *
 * Run: node scripts/generate-captures.mjs
 * (Also runs automatically as part of `pnpm build:gallery`.)
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GALLERY_ROOT = join(__dirname, "..");
const SRC_DIR = join(GALLERY_ROOT, "src");
const DATA = JSON.parse(
  await import("fs").then((fs) =>
    fs.readFileSync(join(GALLERY_ROOT, "src/data/curves.json"), "utf-8"),
  ),
);

// Curve component names (must match imports in Capture.tsx / CurvesConfig.tsx)
const CURVES = [
  { name: "Original Thinking", file: "originalthinking", component: "OriginalThinking" },
  { name: "Thinking Five",     file: "thinkingfive",     component: "ThinkingFive" },
  { name: "Thinking Nine",     file: "thinkingnine",     component: "ThinkingNine" },
  { name: "Rose Orbit",        file: "roseorbit",        component: "RoseOrbit" },
  { name: "Rose Curve",        file: "rosecurve",        component: "RoseCurve" },
  { name: "Rose Two",          file: "rosetwo",          component: "RoseTwo" },
  { name: "Rose Three",        file: "rosethree",        component: "RoseThree" },
  { name: "Rose Four",         file: "rosefour",         component: "RoseFour" },
  { name: "Lissajous Drift",   file: "lissajousdrift",   component: "LissajousDrift" },
  { name: "Lemniscate Bloom",  file: "lemniscatebloom",  component: "LemniscateBloom" },
  { name: "Hypotrochoid Loop", file: "hypotrochoidloop", component: "HypotrochoidLoop" },
  { name: "Three-Petal Spiral", file: "threepetalspiral", component: "ThreePetalSpiral" },
  { name: "Four-Petal Spiral",  file: "fourpetalspiral",  component: "FourPetalSpiral" },
  { name: "Five-Petal Spiral",  file: "fivepetalspiral",  component: "FivePetalSpiral" },
  { name: "Six-Petal Spiral",   file: "sixpetalspiral",   component: "SixPetalSpiral" },
  { name: "Butterfly Phase",    file: "butterflyphase",   component: "ButterflyPhase" },
  { name: "Cardioid Glow",      file: "cardioidglow",     component: "CardioidGlow" },
  { name: "Cardioid Heart",     file: "cardioidheart",    component: "CardioidHeart" },
  { name: "Heart Wave",         file: "heartwave",        component: "HeartWave" },
  { name: "Spiral Search",      file: "spiralsearch",     component: "SpiralSearch" },
  { name: "Fourier Flow",       file: "fourierflow",      component: "FourierFlow" },
];

function generateHtml(file, component) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${component}</title>
  <style>
    html, body { margin: 0; padding: 0; width: 160px; height: 160px; background: #0f0f11; overflow: hidden; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/capture-${file}.tsx"></script>
</body>
</html>
`;
}

function generateTsx(component, color) {
  return `import { createRoot } from "react-dom/client";
import { ${component} } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <${component}
    style={{ width: 160, height: 160, color: "${color}" }}
  />
);
`;
}

// Generate all files
for (let i = 0; i < CURVES.length; i++) {
  const { name, file, component } = CURVES[i];
  const color = DATA.colors[i] || "#fff";
  const htmlPath = join(GALLERY_ROOT, `capture-${file}.html`);
  const tsxPath = join(SRC_DIR, `capture-${file}.tsx`);

  if (!existsSync(SRC_DIR)) {
    mkdirSync(SRC_DIR, { recursive: true });
  }

  writeFileSync(htmlPath, generateHtml(file, component));
  writeFileSync(tsxPath, generateTsx(component, color));
}

console.log(`Generated ${CURVES.length} capture HTML + TSX files.`);
