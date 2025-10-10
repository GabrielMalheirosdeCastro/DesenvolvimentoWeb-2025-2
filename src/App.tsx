import { useEffect, useState } from 'react';
import InterfaceUniversal from './components/ui/interface-universal';
import './styles/globals.css';
import './styles/super-visible-link.css';

function App() {
  const [initialScreen, setInitialScreen] = useState<'main' | 'gallery' | 'figma' | 'settings'>('main');

  useEffect(() => {
    // 🎯 Detectar se devemos ir direto para a galeria Figma
    const urlParams = new URLSearchParams(window.location.search);
    const screenParam = urlParams.get('screen');
    const hashParam = window.location.hash.replace('#', '');
    const hostname = window.location.hostname;
    
    // Se tem parâmetro específico, usar ele
    if (screenParam === 'figma' || hashParam === 'figma') {
      setInitialScreen('figma');
    } else if (screenParam === 'gallery' || hashParam === 'gallery') {
      setInitialScreen('gallery');
    } else if (screenParam === 'settings' || hashParam === 'settings') {
      setInitialScreen('settings');
    }
    // Se é GitHub Pages e não tem parâmetro específico, ir para Figma
    else if (hostname.includes('github.io') && !screenParam) {
      setInitialScreen('figma');
      // Atualizar URL para refletir a tela
      const newUrl = `${window.location.origin}${window.location.pathname}?screen=figma`;
      window.history.replaceState({ screen: 'figma' }, '', newUrl);
    }
  }, []);

  return (
    <div className="App min-h-screen">
      <InterfaceUniversal 
        showMultipleScreens={true}
        enableThemeSelector={true}
        className="w-full"
        initialScreen={initialScreen}
      />
    </div>
  );
}

export default App;