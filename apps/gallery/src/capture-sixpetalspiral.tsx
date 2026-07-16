import { createRoot } from "react-dom/client";
import { SixPetalSpiral } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <SixPetalSpiral
    style={{ width: 160, height: 160, color: "#06b6d4" }}
  />
);
