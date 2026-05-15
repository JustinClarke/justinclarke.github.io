import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/', // Essential for justinclarke.github.io
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@/shared': path.resolve(__dirname, './src/shared'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/modals': path.resolve(__dirname, './src/components/modals'),
        '@/providers': path.resolve(__dirname, './src/providers'),
        '@/data': path.resolve(__dirname, './src/data'),
        '@/pages': path.resolve(__dirname, './src/pages'),
        '@/config': path.resolve(__dirname, './src/config'),
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      minify: 'esbuild',
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