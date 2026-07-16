import { createRoot } from "react-dom/client";
import { RoseCurve } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <RoseCurve
    style={{ width: 160, height: 160, color: "#ec4899" }}
  />
);
