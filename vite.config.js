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
  define: {
    // Available globally in the app as __APP_VERSION__ — no import needed.
    // e.g.  <span>{__APP_VERSION__}</span>
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
