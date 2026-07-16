import { createRoot } from "react-dom/client";
import { HeartWave } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <HeartWave
    style={{ width: 160, height: 160, color: "#e11d48" }}
  />
);
