import { createRoot } from "react-dom/client";
import { SpiralSearch } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <SpiralSearch
    style={{ width: 160, height: 160, color: "#6d28d8" }}
  />
);
