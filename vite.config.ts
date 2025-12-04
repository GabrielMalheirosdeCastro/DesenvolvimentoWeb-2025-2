import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ command, mode }) => {
  const isGithubPages = process.env.GITHUB_PAGES === 'true';
  
  return {
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // 🌐 Aliases universais - independentes de qualquer plataforma
        'components': fileURLToPath(new URL('./src/components', import.meta.url)),
        'styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        'utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
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
    // Otimizações para Vercel - apenas arquivos principais por segurança
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        galeria: fileURLToPath(new URL('./galeria-lego-naves.html', import.meta.url)),
        lab: fileURLToPath(new URL('./lab-fundamentos-css.html', import.meta.url)),
        javascript: fileURLToPath(new URL('./javascript-fundamentals.html', import.meta.url)),
        matematica: fileURLToPath(new URL('./matematica-operadores.html', import.meta.url)),
        tipografia: fileURLToPath(new URL('./tipografia.html', import.meta.url)),
        posicionamento: fileURLToPath(new URL('./posicionamento.html', import.meta.url)),
        boxmodel: fileURLToPath(new URL('./boxmodel.html', import.meta.url)),
        flexbox: fileURLToPath(new URL('./flexbox.html', import.meta.url)),
        responsivo: fileURLToPath(new URL('./responsivo.html', import.meta.url)),
        'desafio-cores': fileURLToPath(new URL('./desafio-cores/index.html', import.meta.url))
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
  base: isGithubPages ? '/DesenvolvimentoWeb-2025-2/' : '/',
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
  };
});