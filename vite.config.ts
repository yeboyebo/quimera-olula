import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "quimera-boton": "https://cdn.jsdelivr.net/gh/yeboyebo/quimera-componentes@main/src/atomos/quimera-boton/quimera-boton.min.js",
      "quimera-input": "https://cdn.jsdelivr.net/gh/yeboyebo/quimera-componentes@main/src/atomos/quimera-input/quimera-input.min.js",
    },
  }
});
