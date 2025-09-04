import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    cssCodeSplit: true, // Split CSS into separate files
    rollupOptions: {
      output: {
        manualChunks: {
          // Group related components for better caching
          'admin': [
            './src/layouts/admin/AdminLayout',
            './src/pages/admin/Dashboard',
            './src/pages/admin/ManageUsers',
            './src/pages/admin/ManageServices'
          ],
          'worker': [
            './src/pages/worker/dashboard',
            './src/pages/worker/register'
          ]
        }
      }
    }
  }
})
