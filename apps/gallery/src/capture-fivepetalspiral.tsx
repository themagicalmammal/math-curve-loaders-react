import { createRoot } from "react-dom/client";
import { FivePetalSpiral } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <FivePetalSpiral
    style={{ width: 160, height: 160, color: "#14b8a6" }}
  />
);
