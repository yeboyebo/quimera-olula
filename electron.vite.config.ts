import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
    main: {
        build: { lib: { entry: resolve(__dirname, 'electron', 'main.ts') } },
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        build: { lib: { entry: resolve(__dirname, 'electron', 'preload.ts') } },
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        root: '.',
        build: { rollupOptions: { input: resolve(__dirname, 'index.html') } },
        plugins: [react()]
    }
})