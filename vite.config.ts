import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist/public",
    // ビューア（index.html）とエディタ（editor.html）を、別々のページとしてビルドする。
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        editor: resolve(import.meta.dirname, "editor.html"),
      },
    },
  },
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": "http://localhost:8484",
      "/data": "http://localhost:8484",
    },
  },
});
