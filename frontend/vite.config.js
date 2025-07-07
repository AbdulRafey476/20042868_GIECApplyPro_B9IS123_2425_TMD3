import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://54.221.64.156',
        // target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});