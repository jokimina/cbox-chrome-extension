import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "custom-dynamic-import",
      renderDynamicImport() {
        return {
          left: `
          {
            const dynamicImport = (path) => import(path);
            dynamicImport(
            `,
          right: ")}",
        };
      },
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        options: resolve(__dirname, 'options.html'),
        service_worker: resolve(__dirname, 'src/background.ts'),
        content_script: resolve(__dirname, 'src/content_script.ts'),
      },
      output: {
        chunkFileNames: 'chunk/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        entryFileNames: '[name].js',
        dir: 'dist',
      },
    },
  },
});
