import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite 6 — compatible with Node.js 20, 22, 24, 25+
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'esnext',
  },
})
