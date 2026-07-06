import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { type Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { SITE } from './src/content/site.ts';

// Substitutes %SITE_*% placeholders in index.html with content/site.ts values,
// so a fork only edits site.ts never index.html for title/description/OG.
function siteHtmlVars(): Plugin {
  return {
    name: 'site-html-vars',
    transformIndexHtml(html) {
      return html
        .replaceAll('%SITE_TITLE%', SITE.defaultTitle)
        .replaceAll('%SITE_DESCRIPTION%', SITE.defaultDescription)
        .replaceAll('%SITE_OG_IMAGE%', `${SITE.url}${SITE.ogImage}`)
        .replaceAll('%SITE_OG_IMAGE_ALT%', SITE.ogImageAlt)
        .replaceAll('%SITE_URL%', SITE.url);
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    // tsconfigPaths derives aliases from tsconfig.json's "paths" so there is
    // one source of truth instead of a second, hand-maintained alias map here.
    plugins: [tsconfigPaths(), react(), tailwindcss(), siteHtmlVars()],
    test: {
      globals: true,
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      minify: 'esbuild' as const,
      cssCodeSplit: true,
      reportCompressedSize: false, // Faster builds
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-animation': ['framer-motion'],
            'vendor-ui': ['lucide-react', '@radix-ui/react-dialog'],
          }
        }
      }
    },
  };
});