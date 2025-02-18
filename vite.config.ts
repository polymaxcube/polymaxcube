import { defineConfig } from 'vite';
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    // publicDir: "static",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"), // Map @/ to the src/ directory
        },
    },
    build: {
        // sourcemap: false, // Disable source maps
    },
    plugins: [tsconfigPaths()],
});
