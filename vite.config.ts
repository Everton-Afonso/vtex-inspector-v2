import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./src/manifest.json";

export default defineConfig({
    plugins: [react(), tailwindcss(), crx({ manifest })],

    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },

    build: {
        outDir: "dist",

        rollupOptions: {
            input: {
                popup: resolve(__dirname, "index.html"),
            }
        }
    }
});