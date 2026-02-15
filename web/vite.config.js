import { defineConfig } from 'vite';

// Dev: proxy /api to the local NestJS api (docker: http://localhost:4000).
// In production nginx terminates /api before it reaches the static bundle.
export default defineConfig({
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: process.env.API_TARGET || 'http://localhost:4000',
        changeOrigin: true,
