import { createRoot } from "react-dom/client";
import { CardioidHeart } from "@math-curve-loaders/react";

createRoot(document.getElementById("root")!).render(
  <CardioidHeart
    style={{ width: 160, height: 160, color: "#7c3aed" }}
  />
);
