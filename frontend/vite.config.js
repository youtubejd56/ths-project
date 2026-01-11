import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'My Django React App',
        short_name: 'MyApp',
        description: 'A PWA built with Vite + React + Django backend',
        theme_color: '#000000',
        icons: [
          {
            src: './src/assets/mobile.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: './src/assets/Desktop.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
