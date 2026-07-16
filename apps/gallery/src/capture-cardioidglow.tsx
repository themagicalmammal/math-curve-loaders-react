import { createRoot } from "react-dom/client";
import { CardioidGlow } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <CardioidGlow
    style={{ width: 160, height: 160, color: "#3b82f6" }}
  />
);
