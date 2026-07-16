import { createRoot } from "react-dom/client";
import { ThreePetalSpiral } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <ThreePetalSpiral
    style={{ width: 160, height: 160, color: "#22c55e" }}
  />
);
