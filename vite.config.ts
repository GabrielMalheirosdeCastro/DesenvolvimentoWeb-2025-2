import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Aliases para os assets do Figma
      'figma:asset/dd18ec3bf35c35cc0e58cd61147ab94926272d3c.png': path.resolve(__dirname, './src/assets/dd18ec3bf35c35cc0e58cd61147ab94926272d3c.png'),
      'figma:asset/681ee2140d8a3dfb23dc398515d8e9539fb56338.png': path.resolve(__dirname, './src/assets/681ee2140d8a3dfb23dc398515d8e9539fb56338.png'),
      'figma:asset/55baa85e8789d73e4e943d1a375f594add7941b3.png': path.resolve(__dirname, './src/assets/55baa85e8789d73e4e943d1a375f594add7941b3.png'),
      'figma:asset/df4077de47a65010f0db03b4bde4b1720336789e.png': path.resolve(__dirname, './src/assets/df4077de47a65010f0db03b4bde4b1720336789e.png'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 3000,
    host: true
  }
});