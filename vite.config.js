import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "public",
      filename: "firebase-messaging-sw.js",
      workbox: {
        maximumFileSizeToCacheInBytes: 0,
        globPatterns: [],
      },
      registerType: "autoUpdate", // 새 버전 생기면 자동 업데이트
      includeAssets: [
        "favicons/favicon.ico",
        "favicons/apple-touch-icon.png",
        "favicons/favicon-96x96.png",
        "favicons/favicon.svg",
      ],
      manifest: {
        name: "FinForU",
        short_name: "FinForU",
        description: "Bridging the World to Korean Finance",
        theme_color: "#0093DD",
        background_color: "#0093DD",
        display: "standalone",
        icons: [
          {
            src: "favicons/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "favicons/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
