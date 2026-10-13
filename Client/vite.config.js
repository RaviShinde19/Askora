import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: {
      host: 'localhost',
      port: 5173, 
      protocol: 'ws'
    },
    watch: {
      usePolling: true
    }
  }
})