import { createRoot } from "react-dom/client";
import { ButterflyPhase } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <ButterflyPhase
    style={{ width: 160, height: 160, color: "#0ea5e9" }}
  />
);
