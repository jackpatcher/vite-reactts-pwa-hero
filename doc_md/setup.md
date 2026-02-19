npm create vite@latest my-pwa-app -- --template react-ts

cd my-pwa-app
npm install



npm install @heroui/react framer-motion lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

ติดตั้ง tailwindcss ให้ผมหน่อย
npx tailwindcss@3.4.17 init -p



ตั้งค่า src/main.tsx: ครอบแอปด้วย HeroUIProvider:

TypeScript
import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </React.StrictMode>
);


npm install -D vite-plugin-pwa

ตั้งค่า vite.config.ts:

TypeScript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'My HeroUI PWA',
        short_name: 'HeroPWA',
        description: 'Next gen PWA with HeroUI',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})