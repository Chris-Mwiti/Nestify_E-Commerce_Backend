import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import commonjs from "@rollup/plugin-commonjs"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite(),commonjs()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  optimizeDeps:{
    include: ["api-contract/**/*"]
  }
})
