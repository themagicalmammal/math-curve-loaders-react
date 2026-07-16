import { createRoot } from "react-dom/client";
import { LemniscateBloom } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <LemniscateBloom
    style={{ width: 160, height: 160, color: "#eab308" }}
  />
);
