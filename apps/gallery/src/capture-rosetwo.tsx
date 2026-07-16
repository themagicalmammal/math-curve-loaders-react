import { createRoot } from "react-dom/client";
import { RoseTwo } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <RoseTwo
    style={{ width: 160, height: 160, color: "#f43f5e" }}
  />
);
