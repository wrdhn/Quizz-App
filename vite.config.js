import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.woff', '**/*.woff2'],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    cors: true,
    allowedHosts: ['37e9-36-72-216-77.ngrok-free.app'],
  },
})
