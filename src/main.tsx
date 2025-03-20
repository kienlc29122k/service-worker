import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { registerServiceWorker } from "./serviceWorkerRegistration";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

registerServiceWorker();
