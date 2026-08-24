/// <reference types="vite/client" />
import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
    tsconfigPaths(),
  ],
  ssr: {
    external: ['playwright', 'playwright-core'],
  },
  build: {
    rollupOptions: {
      external: ['playwright', 'playwright-core'],
    },
  },
});
