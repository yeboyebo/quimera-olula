/// <reference types="vitest" />
/// <reference types="vite/client" />

import { mergeConfig } from "vite";
import config from "../../vite.config.ts";

export default mergeConfig(config, {
    resolve: {
        alias: {
            '#': '@olula/ctx',
            'use-db-state': new URL('./node_modules/use-db-state', import.meta.url).pathname,
        }
    }
});