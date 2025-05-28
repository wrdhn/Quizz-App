import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.woff', '**/*.woff2'],
  server: {
    host: '0.0.0.0', // penting agar bisa diakses dari jaringan luar
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    cors: true,
    allowedHosts: ['a6a1-114-10-5-219.ngrok-free.app'], // ganti sesuai host ngrok kamu
  },
})
