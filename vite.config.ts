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
    // Copia arquivos estáticos para o build
    copyPublicDir: true,
    // Otimizações para Vercel
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        galeria: path.resolve(__dirname, 'galeria-lego-naves.html'),
        lab: path.resolve(__dirname, 'lab-fundamentos-css.html'),
        javascript: path.resolve(__dirname, 'javascript-fundamentals.html'),
        matematica: path.resolve(__dirname, 'matematica-operadores.html'),
        tipografia: path.resolve(__dirname, 'tipografia.html'),
        posicionamento: path.resolve(__dirname, 'posicionamento.html'),
        boxmodel: path.resolve(__dirname, 'boxmodel.html'),
        flexbox: path.resolve(__dirname, 'flexbox.html'),
        responsivo: path.resolve(__dirname, 'responsivo.html'),
        ex010: path.resolve(__dirname, 'ex010/index.html'),
        'desafio-cores': path.resolve(__dirname, 'desafio-cores/index.html')
      },
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
  // 🚀 Configuração de base path inteligente
  base: process.env.GITHUB_PAGES === 'true' ? '/DesenvolvimentoWeb-2025-2/' : '/',
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