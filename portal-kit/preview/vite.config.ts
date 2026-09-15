import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Preview-only Vite config.
 *
 * Root is relative to the PROJECT ROOT — run from the project root:
 *   npx vite --config portal-kit/preview/vite.config.ts
 * The kit is then served standalone at :5175 without touching the host app
 * on :5173. The react and tailwind plugins resolve from the project's own
 * node_modules — no separate install, no new dependencies in package.json.
 */
export default defineConfig({
  root: 'portal-kit/preview',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175,
    strictPort: true,
  },
});
