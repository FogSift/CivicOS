/**
 * @fileId b7b5e087-9c1d-4c44-85ad-2cb1f0ddae5d
 * @module CivicOS/vite.config
 * @description Vite build configuration.
 *              __APP_VERSION__ is injected at build time from package.json.
 *              Use it anywhere in the app without an import.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5050,
    strictPort: true,
    proxy: {
      '/api': {
        target: process.env.FOGSIFT_API_ORIGIN || 'http://localhost:5051',
        changeOrigin: true,
        secure: false,
      },
      '/workflow-engine': {
        target: process.env.FOGSIFT_API_ORIGIN || 'http://localhost:5051',
        changeOrigin: true,
        secure: false,
      },
      // Sibling static assets the Workflow Engine's HTML references with
      // root-relative paths (theme-init.js, white-rabbit.js, favicon.png) --
      // without these, only /workflow-engine* itself falls into the rule
      // above (prefix match), and these 404 or fall through to CivicOS's
      // own SPA index.html.
      '/theme-init.js': {
        target: process.env.FOGSIFT_API_ORIGIN || 'http://localhost:5051',
        changeOrigin: true,
        secure: false,
      },
      '/white-rabbit.js': {
        target: process.env.FOGSIFT_API_ORIGIN || 'http://localhost:5051',
        changeOrigin: true,
        secure: false,
      },
      '/favicon.png': {
        target: process.env.FOGSIFT_API_ORIGIN || 'http://localhost:5051',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  define: {
    // Available globally in the app as __APP_VERSION__ — no import needed.
    // e.g.  <span>{__APP_VERSION__}</span>
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    cssMinify: 'esbuild',
  },
});
