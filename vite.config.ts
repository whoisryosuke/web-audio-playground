import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [wasm(), react()],
});
