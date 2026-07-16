import { createRoot } from "react-dom/client";
import { FourierFlow } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <FourierFlow
    style={{ width: 160, height: 160, color: "#4f46e5" }}
  />
);
