import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { recruitmentApiPlugin } from './src/server/vitePlugin.ts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    recruitmentApiPlugin(),
  ],
  server: {
    port: 5173,
    host: true,
  },
})
