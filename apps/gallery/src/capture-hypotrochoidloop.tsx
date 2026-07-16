import { createRoot } from "react-dom/client";
import { HypotrochoidLoop } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <HypotrochoidLoop
    style={{ width: 160, height: 160, color: "#84cc16" }}
  />
);
