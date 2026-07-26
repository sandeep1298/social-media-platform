import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          animation: ['gsap'],
          query: ['@tanstack/react-query', 'axios'],
          react: ['react', 'react-dom', 'react-router'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});
