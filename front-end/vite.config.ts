import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/asasense': {
        target: 'http://0.0.0.0:8001',
        changeOrigin: true,
      },
    },
  },
})
