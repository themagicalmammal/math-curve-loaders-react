import { createRoot } from "react-dom/client";
import { RoseFour } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <RoseFour
    style={{ width: 160, height: 160, color: "#f97316" }}
  />
);
