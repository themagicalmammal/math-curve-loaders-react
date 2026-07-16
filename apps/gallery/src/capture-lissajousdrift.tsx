import { createRoot } from "react-dom/client";
import { LissajousDrift } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <LissajousDrift
    style={{ width: 160, height: 160, color: "#f59e0b" }}
  />
);
