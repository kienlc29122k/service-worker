import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // This ensures that service-worker.ts, once built, ends up in the root.
      input: {
        main: "index.html",
        serviceWorker: "src/services/service-worker.ts",
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === "serviceWorker"
            ? "service-worker.ts"
            : "assets/[name]-[hash].js";
        },
      },
    },
  },
});
