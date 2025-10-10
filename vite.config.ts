import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 🌐 Aliases universais - independentes do Figma
      'assets': path.resolve(__dirname, './src/assets'),
      'components': path.resolve(__dirname, './src/components'),
      'styles': path.resolve(__dirname, './src/styles'),
      'utils': path.resolve(__dirname, './src/utils'),
      
      // ✅ Assets locais - sem dependência do Figma
      'local:image/space-1': path.resolve(__dirname, './src/assets/space-1.jpg'),
      'local:image/space-2': path.resolve(__dirname, './src/assets/space-2.jpg'),
      'local:image/space-3': path.resolve(__dirname, './src/assets/space-3.jpg'),
      'local:image/profile': path.resolve(__dirname, './src/assets/profile.jpg'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // ✅ Padrão universal
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        },
        // 🎯 Assets com hash para cache universal
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          let extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0', // ✅ Aceita conexões de qualquer IP
    cors: true
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  },
  // 🌐 Base path universal - funciona em qualquer ambiente
  base: './',
  // 🔧 Configurações para compatibilidade Windows + Google
  define: {
    __PORTFOLIO_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __IS_PRODUCTION__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },
  // ⚡ Otimizações para Windows
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
    exclude: []
  }
});