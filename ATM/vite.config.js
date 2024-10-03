import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const API_TARGET = process.env.API_TARGET;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: API_TARGET || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});

