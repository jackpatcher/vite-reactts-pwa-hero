import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App";
import "./index.css";

// Normalize URL so hash-based routes live directly under root (e.g. /#/dashboard/...)
// This moves an existing hash from a subpath like `/some/base/#/route` -> `/#/route`.
// We use replaceState so navigation history isn't polluted.
(() => {
  try {
    const { pathname, hash, search } = window.location;
    if (hash && pathname !== "/") {
      // If there's already a hash (e.g. #/dashboard/...), move it to root
      const target = `/${hash}${search}`; // results in '/#/dashboard/...'
      window.history.replaceState(null, "", target);
    }
  } catch (e) {
    // ignore on environments without window/history
  }
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>
);