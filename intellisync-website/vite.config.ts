import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore - No type definitions available for this module
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Explicitly include process polyfill
      include: ['process'],
      // Configure globals
      globals: {
        process: true,
        Buffer: true,
        global: true,
      },
      // Exclude problematic modules
      exclude: ['fs'],
    }),
  ],

  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    proxy: process.env.VITE_API_BASE_URL ? undefined : {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});
