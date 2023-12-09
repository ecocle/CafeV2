import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import copy from "rollup-plugin-copy";
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon.png",
                "icons/android-chrome-192x192.png"
            ],
            manifest: {
                name: "My Cafe",
                short_name: "Cafe",
                description: "The webapp to order from Hualang School's cafe: MY Cafe",
                theme_color: "#a78bfa",
                icons: [
                    {
                        src: "favicon-16x16.png",
                        sizes: "16x16",
                        type: "image/png"
                    },
                    {
                        src: "favicon-32x32.png",
                        sizes: "32x32",
                        type: "image/png"
                    },
                    {
                        src: "apple-touch-icon.png",
                        sizes: "180x180",
                        type: "image/png"
                    },
                    {
                        src: "android-chrome-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "android-chrome-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    }
                ]
            }
        }),
        // @ts-ignore
        copy({
            targets: [
                { src: "robots.txt", dest: "dist" }
            ],
            hook: "writeBundle"
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    build: {
        rollupOptions: {
            output: {
                assetFileNames: "[name][extname]"
            }
        },
        write: true,
        outDir: "dist",
        emptyOutDir: true
    }
});
