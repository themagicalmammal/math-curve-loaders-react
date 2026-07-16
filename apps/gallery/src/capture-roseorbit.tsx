import { createRoot } from "react-dom/client";
import { RoseOrbit } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <RoseOrbit
    style={{ width: 160, height: 160, color: "#d946ef" }}
  />
);
