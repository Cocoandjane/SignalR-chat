import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://127.0.0.1:5154",
      "/r": {
        target: "http://127.0.0.1:5154",
        ws: true,
      },
    },
  },
  plugins: [react()],
});
