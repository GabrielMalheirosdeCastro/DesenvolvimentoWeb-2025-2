import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ command, mode }) => {
  // Configuração segura para diferentes ambientes
  const isProduction = mode === 'production';
  const isGithubPages = false; // Simplificado para evitar problemas de tipos
  
  return {
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': '/src',
        // 🌐 Aliases universais - independentes de qualquer plataforma
        'components': '/src/components',
        'styles': '/src/styles',
        'utils': '/src/utils',
      },
    },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: !isProduction, // Source maps apenas em desenvolvimento
    minify: isProduction ? 'terser' : false,
    // Copia arquivos estáticos para o build
    copyPublicDir: true,
    // Otimizações para Vercel - entradas validadas
    rollupOptions: {
      input: {
        main: './index.html',
        galeria: './galeria-lego-naves.html',
        lab: './lab-fundamentos-css.html',
        javascript: './javascript-fundamentals.html',
        matematica: './matematica-operadores.html',
        tipografia: './tipografia.html',
        posicionamento: './posicionamento.html',
        boxmodel: './boxmodel.html',
        flexbox: './flexbox.html',
        responsivo: './responsivo.html',
        'desafio-cores': './desafio-cores/index.html'
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
  // 🚀 Configuração de base path otimizada
  base: isGithubPages ? '/DesenvolvimentoWeb-2025-2/' : '/',
  // 🔧 Definições de constantes universais
  define: {
    __PORTFOLIO_VERSION__: JSON.stringify('1.0.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    __ENVIRONMENT__: JSON.stringify(isProduction ? 'production' : 'development'),
    __IS_DEV__: JSON.stringify(!isProduction),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'clsx', 'tailwind-merge'],
    exclude: []
  }
  };
});