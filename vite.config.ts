import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ERP Web',
        short_name: 'ERP',
        description: 'Quimera Olula ERP developed by YEBOYEBO',
        theme_color: '#ffffff',
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: new RegExp("^http://localhost:8005/cache"),
            handler: "CacheFirst",
            method: "GET",
            options: {
              cacheName: "cache-erp",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 2, // <== 2 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      "quimera-boton": "https://cdn.jsdelivr.net/gh/yeboyebo/quimera-componentes@main/src/atomos/quimera-boton/quimera-boton.js",
      "quimera-input": "https://cdn.jsdelivr.net/gh/yeboyebo/quimera-componentes@main/src/atomos/quimera-input/quimera-input.js",
    },
  }
});
