import { createRoot } from "react-dom/client";
import CapturePage from "./Capture";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<CapturePage />);
}
