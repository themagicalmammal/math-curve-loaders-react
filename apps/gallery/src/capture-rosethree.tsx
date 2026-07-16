import { createRoot } from "react-dom/client";
import { RoseThree } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <RoseThree
    style={{ width: 160, height: 160, color: "#ef4444" }}
  />
);
