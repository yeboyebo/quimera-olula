import ViteYaml from "@modyfi/vite-plugin-yaml";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const baseSrc = path.resolve(__dirname, "../../libs/styles");
const clientSrc = path.resolve(__dirname, "./styles");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteYaml()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${baseSrc}/_mixin" as *;
        @use "${clientSrc}/_clientMixin" as *;`,
      },
    },
  },
});
