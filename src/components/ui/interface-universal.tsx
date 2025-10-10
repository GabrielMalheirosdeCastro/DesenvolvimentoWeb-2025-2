import React, { useState, useEffect, useCallback } from 'react';
import { 
  ExternalLink, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tablet,
  Settings,
  Palette,
  Link,
  CheckCircle,
  AlertCircle,
  Wrench,
  Github,
  Home
} from 'lucide-react';
import { cn } from './utils';
import { PortfolioLink } from './portfolio-link';

interface UniversalConfig {
  url: string;
  title: string;
  author: string;
  institution: string;
  status: 'online' | 'offline' | 'maintenance';
  theme: 'modern' | 'classic' | 'minimal' | 'colorful';
}

interface InterfaceUniversalProps {
  className?: string;
  showMultipleScreens?: boolean;
  enableThemeSelector?: boolean;
}

export const InterfaceUniversal: React.FC<InterfaceUniversalProps> = ({
  className,
  showMultipleScreens = true,
  enableThemeSelector = true
}) => {
  const [config, setConfig] = useState<UniversalConfig>({
    url: 'https://meu-portfolio-universal.com',
    title: 'Interface Gráfica Pessoal - Sistema Universal',
    author: 'Gabriel Malheiros',
    institution: 'FAESA',
    status: 'online',
    theme: 'modern'
  });

  const [currentScreen, setCurrentScreen] = useState<'main' | 'gallery' | 'settings'>('main');
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // 🔄 Extrair configuração do CSS
  const extractCSSConfig = useCallback((): UniversalConfig => {
    const style = getComputedStyle(document.documentElement);
    
    return {
      url: style.getPropertyValue('--portfolio-url').replace(/"/g, '').trim() || 
           'https://desenvolvimento-web-2025-2.vercel.app',
      title: style.getPropertyValue('--portfolio-title').replace(/"/g, '').trim() || 
             'Interface Gráfica Universal',
      author: style.getPropertyValue('--portfolio-author').replace(/"/g, '').trim() || 
              'Gabriel Malheiros',
      institution: style.getPropertyValue('--portfolio-institution').replace(/"/g, '').trim() || 
                   'FAESA',
      status: (style.getPropertyValue('--portfolio-status').replace(/"/g, '').trim() || 
               'online') as UniversalConfig['status'],
      theme: (style.getPropertyValue('--portfolio-theme').replace(/"/g, '').trim() || 
              'modern') as UniversalConfig['theme']
    };
  }, []);

  // 🔄 Detectar viewport
  const detectViewport = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, []);

  // 🔄 Atualizar configurações
  useEffect(() => {
    const updateConfig = () => {
      setConfig(extractCSSConfig());
      setViewport(detectViewport());
    };

    updateConfig();

    const observer = new MutationObserver(updateConfig);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'data-theme']
    });

    window.addEventListener('resize', updateConfig);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateConfig);
    };
  }, [extractCSSConfig, detectViewport]);

  // 🎨 Alterar tema
  const changeTheme = useCallback((newTheme: UniversalConfig['theme']) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.setProperty('--portfolio-theme', `"${newTheme}"`);
    setConfig(prev => ({ ...prev, theme: newTheme }));
  }, []);

  // 🎯 Abrir link do portfólio
  const openPortfolio = useCallback(() => {
    if (config.status === 'online') {
      try {
        const url = new URL(config.url);
        window.open(url.toString(), '_blank', 'noopener,noreferrer');
      } catch {
        alert('URL do portfólio inválida. Configure uma URL válida no CSS.');
      }
    }
  }, [config.url, config.status]);

  // 🎨 Obter ícone do status
  const getStatusIcon = () => {
    switch (config.status) {
      case 'online': return <CheckCircle size={20} />;
      case 'offline': return <AlertCircle size={20} />;
      case 'maintenance': return <Wrench size={20} />;
      default: return <Globe size={20} />;
    }
  };

  // 🎨 Obter texto do status
  const getStatusText = () => {
    switch (config.status) {
      case 'online': return 'Online e Funcionando';
      case 'offline': return 'Temporariamente Offline';
      case 'maintenance': return 'Em Manutenção';
      default: return 'Status Desconhecido';
    }
  };

  // 🎨 Obter ícone do viewport
  const getViewportIcon = () => {
    switch (viewport) {
      case 'mobile': return <Smartphone size={16} />;
      case 'tablet': return <Tablet size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  // 🖥️ Renderizar tela principal
  const renderMainScreen = () => (
    <div className="interface-main">
      <div className="layout-container">
        <div className="interface-header">
          <h1 className="interface-title">
            {config.title}
          </h1>
          <p className="interface-subtitle">
            Desenvolvido por {config.author} • {config.institution}
          </p>
          <p className="interface-description">
            Sistema de portfólio universal independente de plataforma. 
            Funciona em qualquer ambiente Windows + Google Chrome/Edge.
            Configure facilmente via CSS sem dependência de Figma, Vercel ou Netlify.
          </p>
        </div>

        {/* Link Principal do Portfólio usando o componente PortfolioLink */}
        <div className="layout-center">
          <div className="relative">
            <PortfolioLink 
              variant="button" 
              size="lg"
              className="portfolio-link-universal"
            />
          </div>
        </div>

        {/* Informações do Viewport */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-lg border">
            {getViewportIcon()}
            <span className="text-sm font-medium">
              {viewport} • {window.innerWidth}×{window.innerHeight}px
            </span>
          </div>
        </div>

        {/* Navegação entre telas */}
        {showMultipleScreens && (
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentScreen('main')}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
                currentScreen === 'main' 
                  ? "bg-brand-primary text-white" 
                  : "bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white"
              )}
            >
              <Home size={20} />
              Tela Principal
            </button>
            <button
              onClick={() => setCurrentScreen('gallery')}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
                currentScreen === 'gallery' 
                  ? "bg-brand-primary text-white" 
                  : "bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white"
              )}
            >
              <Github size={20} />
              Projetos
            </button>
            {enableThemeSelector && (
              <button
                onClick={() => setCurrentScreen('settings')}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
                  currentScreen === 'settings' 
                    ? "bg-brand-primary text-white" 
                    : "bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white"
                )}
              >
                <Settings size={20} />
                Configurações
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 🖼️ Renderizar tela de galeria
  const renderGalleryScreen = () => (
    <div className="interface-main">
      <div className="layout-container">
        <div className="interface-header">
          <h1 className="interface-title">
            Projetos e Demonstrações
          </h1>
          <p className="interface-subtitle">
            Portfólio de projetos acadêmicos e profissionais
          </p>
        </div>

        <div className="interface-gallery">
          {{
            {
              title: "Interface Gráfica Principal",
              description: "Portfólio principal com design responsivo e sistema de temas dinâmico",
              url: config.url,
              status: config.status,
              tech: ["React", "TypeScript", "CSS3"]
            },
            {
              title: "Sistema de Componentes",
              description: "Biblioteca de componentes reutilizáveis baseada em shadcn/ui",
              url: `${config.url}/components`,
              status: "online",
              tech: ["React", "Radix UI", "Tailwind"]
            },
            {
              title: "Estudos CSS Avançado",
              description: "Demonstrações de animações, grid layouts e propriedades modernas",
              url: `${config.url}/css-studies`,
              status: "online",
              tech: ["CSS3", "Animations", "Grid"]
            },
            {
              title: "Projeto FAESA",
              description: "Trabalho acadêmico demonstrando conversão de Figma para código",
              url: `${config.url}/faesa-project`,
              status: "maintenance",
              tech: ["Figma", "React", "Vite"]
            }
          ].map((project, index) => (
            <div key={index} className="interface-card">
              <h3 className="interface-card-title">
                {project.title}
              </h3>
              <p className="interface-card-description">
                {project.description}
              </p>
              
              {/* Tags de tecnologia */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-md font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <PortfolioLink 
                variant="inline"
                className={cn(
                  project.status !== 'online' && "opacity-50 pointer-events-none"
                )}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentScreen('main')}
            className="px-8 py-4 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary transition-all flex items-center gap-2 mx-auto"
          >
            <Home size={20} />
            Voltar à Tela Principal
          </button>
        </div>
      </div>
    </div>
  );

  // ⚙️ Renderizar tela de configurações
  const renderSettingsScreen = () => (
    <div className="interface-main">
      <div className="layout-container">
        <div className="interface-header">
          <h1 className="interface-title">
            Configurações do Sistema
          </h1>
          <p className="interface-subtitle">
            Personalize a interface e configure o link do portfólio
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Configuração do Link */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Link size={20} />
              Link do Portfólio
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL Atual:</label>
                <code className="block bg-gray-100 p-3 rounded-md font-mono text-sm break-all">
                  {config.url}
                </code>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900 mb-2">Como alterar o link:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Abra o arquivo <code>src/styles/globals.css</code></li>
                  <li>2. Encontre a linha <code>--portfolio-url:</code></li>
                  <li>3. Substitua pela sua URL real</li>
                  <li>4. Salve o arquivo - mudança é instantânea!</li>
                </ol>
              </div>
              
              <PortfolioLink variant="card" showDebugInfo={true} />
            </div>
          </div>

          {/* Seletor de Tema */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Palette size={20} />
              Tema da Interface
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {{
                { id: 'modern', name: 'Moderno', color: '#2563eb', desc: 'Azul vibrante' },
                { id: 'classic', name: 'Clássico', color: '#1e3a8a', desc: 'Azul tradicional' },
                { id: 'minimal', name: 'Minimalista', color: '#374151', desc: 'Cinza elegante' },
                { id: 'colorful', name: 'Colorido', color: '#7c3aed', desc: 'Roxo criativo' }
              }.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id as UniversalConfig['theme'])}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all text-center hover:scale-105",
                    config.theme === theme.id
                      ? "border-brand-primary bg-brand-primary/10"
                      : "border-gray-200 hover:border-brand-primary/50"
                  )}
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 shadow-md"
                    style={{ backgroundColor: theme.color }}
                  />
                  <div className="font-medium text-sm">{theme.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{theme.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Sistema */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Informações do Sistema
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Configuração:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex">
                    <span className="w-20 text-gray-500">URL:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">{config.url}</code>
                  </div>
                  <div className="flex">
                    <span className="w-20 text-gray-500">Status:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{config.status}</code>
                  </div>
                  <div className="flex">
                    <span className="w-20 text-gray-500">Tema:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{config.theme}</code>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Ambiente:</h4>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex">
                    <span className="w-20 text-gray-500">Viewport:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{viewport}</code>
                  </div>
                  <div className="flex">
                    <span className="w-20 text-gray-500">Resolução:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {window.innerWidth}×{window.innerHeight}
                    </code>
                  </div>
                  <div className="flex">
                    <span className="w-20 text-gray-500">Navegador:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                       navigator.userAgent.includes('Edge') ? 'Edge' : 'Outro'}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setCurrentScreen('main')}
              className="px-8 py-4 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-secondary transition-all flex items-center gap-2 mx-auto"
            >
              <Home size={20} />
              Aplicar e Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 🎯 Renderizar tela atual
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'gallery': return renderGalleryScreen();
      case 'settings': return renderSettingsScreen();
      default: return renderMainScreen();
    }
  };

  return (
    <div className={cn("interface-universal w-full", className)} data-theme={config.theme}>
      {renderCurrentScreen()}
    </div>
  );
};

export default InterfaceUniversal;
