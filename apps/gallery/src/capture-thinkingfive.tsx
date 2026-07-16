import { createRoot } from "react-dom/client";
import { ThinkingFive } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <ThinkingFive
    style={{ width: 160, height: 160, color: "#8b5cf6" }}
  />
);
