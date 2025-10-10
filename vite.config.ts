import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 🌐 Aliases universais - independentes de qualquer plataforma
      'components': path.resolve(__dirname, './src/components'),
      'styles': path.resolve(__dirname, './src/styles'),
      'utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    // Otimizações para Vercel
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react']
        },
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    // Limite de chunk warning aumentado
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    cors: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173
  },
  // 🌐 Configuração para GitHub Pages
  base: process.env.NODE_ENV === 'production' 
    ? '/DesenvolvimentoWeb-2025-2/' 
    : '/',
  // 🚀 Configuração otimizada para Vercel
  base: '/',
  // 🔧 Otimizações específicas para Windows + Google
  define: {
    __PORTFOLIO_VERSION__: JSON.stringify('1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __ENVIRONMENT__: JSON.stringify('universal-windows-google'),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'clsx', 'tailwind-merge'],
    exclude: []
  }
});