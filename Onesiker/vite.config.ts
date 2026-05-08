import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import type {Plugin} from 'vite';
import {defineConfig} from 'vitest/config';

// Removes macOS metadata that sneaks into dist/ (.DS_Store, ._* AppleDouble files,
// "Folder 2" duplicates created by Finder). Replaces the previous shell `find` chain.
function cleanMacArtifactsPlugin(): Plugin {
  return {
    name: 'clean-mac-artifacts',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (/ 2$/.test(entry.name)) {
              fs.rmSync(full, {recursive: true, force: true});
              continue;
            }
            walk(full);
          } else if (entry.name === '.DS_Store' || entry.name.startsWith('._')) {
            fs.rmSync(full, {force: true});
          }
        }
      };
      walk(distDir);
    },
  };
}

// One BUILD_ID per build, exposed via import.meta.env.VITE_BUILD_ID and used by
// useJsonData() as a cache-busting query string. Browsers can cache /data/*.json
// for the lifetime of the build instead of refetching every page load.
const BUILD_ID = Date.now().toString(36);

export default defineConfig({
  plugins: [react(), tailwindcss(), cleanMacArtifactsPlugin()],
  define: {
    'import.meta.env.VITE_BUILD_ID': JSON.stringify(BUILD_ID),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    // Playwright specs live in tests/e2e/ — they import @playwright/test which is
    // incompatible with Vitest's runner. Restrict discovery to the unit tests only.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
});
