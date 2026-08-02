import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        emptyOutDir: false,

        rollupOptions: {
            input: resolve(
                __dirname,
                "src/content/content-isolated.ts"
            ),

            output: {
                format: "iife",
                entryFileNames: "assets/content.js"
            }
        }
    }
});
