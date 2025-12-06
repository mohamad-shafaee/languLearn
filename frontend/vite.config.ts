import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss(),],
    server: {
    host: '0.0.0.0', // allow connections from outside the container
    port: 5173,        // optional, fix port to 5173
    strictPort: true,     //This ensures Vite will not jump to 5174
    open: false,
    proxy: {
      //All requests starting with /api, /login, /logout, /sanctum go to Laravel
      "/api": {
        target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
      },
      /*"/login": {
        target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
      },*/
      "/logout": {
        target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
      },
      "/sanctum": {
        target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
