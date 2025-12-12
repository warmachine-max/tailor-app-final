import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000, // warning limit in kB
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.jpeg', '**/*.webp'], // optional
  // Configure inlining limit
  base: '/',
  define: {},
  resolve: {},
  esbuild: {},
  // The key part:
  build: {
    assetsInlineLimit: 5 * 1024 * 1024, // 5 MB
    outDir: 'build',
    chunkSizeWarningLimit: 1000,
  }
})
