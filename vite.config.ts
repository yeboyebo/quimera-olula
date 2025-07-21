/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: "./",
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
  test: {
    globals: true,
    environment: 'jsdom',
  }
});
