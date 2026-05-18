import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Target Pro — نظام المستهدفات البنكية",
        short_name: "Target Pro",
        description: "تتبع مستهدفاتك البنكية باحترافية",
        theme_color: "#060d1a",
        background_color: "#060d1a",
        display: "standalone",
        orientation: "portrait",
        lang: "ar",
        dir: "rtl",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
});
