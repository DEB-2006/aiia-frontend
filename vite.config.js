import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://aiia-backend-t0xe.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
