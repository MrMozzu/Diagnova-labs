import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [
    {
      name: 'inline-css-plugin',
      apply: 'build',
      enforce: 'post',
      generateBundle(_options, bundle) {
        let cssContent = '';
        for (const [key, asset] of Object.entries(bundle)) {
          if (key.endsWith('.css') && asset.type === 'asset' && typeof asset.source === 'string') {
            cssContent += asset.source;
            delete bundle[key];
          }
        }
        for (const [key, chunk] of Object.entries(bundle)) {
          if (key === 'index.html' && chunk.type === 'asset' && typeof chunk.source === 'string') {
            let html = chunk.source;
            html = html.replace(/<link[^>]*rel=["'](stylesheet|preload)["'][^>]*href=["'][^"']*\.css["'][^>]*>/g, '');
            html = html.replace(/<noscript><link[^>]*href=["'][^"']*\.css["'][^>]*><\/noscript>/g, '');
            chunk.source = html.replace('</head>', `<style>${cssContent}</style></head>`);
          }
        }
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 700,
    modulePreload: {
      resolveDependencies: (_filename, deps) => {
        return deps.filter(dep => !dep.includes('pdf') && !dep.includes('jspdf') && !dep.includes('html2canvas') && !dep.includes('confetti') && !dep.includes('purify') && !dep.includes('canvg') && !dep.includes('drawers'));
      }
    }
  }
});
