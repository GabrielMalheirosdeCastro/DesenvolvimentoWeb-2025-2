import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import './styles/figma-gallery-fixes.css'
import './styles/figma-visual-fixes.css'
import './index.css'

// 🚀 Importar utilitários de debug para desenvolvimento
if (import.meta.env.DEV) {
  import('./utils/spaceship-debug');
  import('./utils/spaceship-tests');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
