// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',  // ← Esto es todo lo que necesitas
    port: 4321,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/uploads': 'http://localhost:1337'
      }
    }
  }
});