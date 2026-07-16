import { createRoot } from "react-dom/client";
import { FourPetalSpiral } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <FourPetalSpiral
    style={{ width: 160, height: 160, color: "#10b981" }}
  />
);
