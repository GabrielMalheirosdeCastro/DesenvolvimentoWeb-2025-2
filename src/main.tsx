import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import './styles/figma-gallery-fixes.css'
import './styles/figma-visual-fixes.css'
import './index.css'

// 🛡️ Importar sistemas de segurança avançados
import './utils/advanced-security-system.js'
import './utils/anti-download-protection-simple.js'
import './utils/security-monitor.js'
import './utils/security-performance-enhancer.js'
import './utils/error-handling-system.js'

// �🚀 Importar utilitários de debug para desenvolvimento
if (import.meta.env.DEV) {
  import('./utils/spaceship-debug');
  import('./utils/spaceship-tests');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
