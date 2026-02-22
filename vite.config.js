import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiTarget = env.VITE_API_URL || 'http://localhost:5000'

  return {
    root: 'client',
    plugins: [react()],
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-react'
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('recharts')) return 'vendor-ui'
            if (id.includes('axios') || id.includes('i18next')) return 'vendor-utils'
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: apiTarget,
          changeOrigin: true,
          ws: true,  // WebSocket proxy support
        },
      },
    },
    optimizeDeps: {
      include: ['socket.io-client']
    }
  }
})
