import React, { useState, useEffect, useCallback } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Settings,
  Palette,
  Link,
  Github,
  Home,
  Rocket,
  Image
} from 'lucide-react';
import { cn } from './utils';
import PortfolioLinkUniversal from './portfolio-link-universal';
import SpaceGallery from '../gallery/SpaceGallery';
import { spaceFleetImages } from '../../data/spaceFleetData';
import PersonalData from './personal-data';
import MorseChallenge from './morse-challenge';
import { Localhost3000Link } from './localhost-link';
import ExternalNavigation from './external-navigation';

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
  initialScreen?: 'main' | 'gallery' | 'figma' | 'settings';
}

export const InterfaceUniversal: React.FC<InterfaceUniversalProps> = ({
  className,
  showMultipleScreens = true,
  enableThemeSelector = true,
  initialScreen
}) => {
  // 🔍 Detectar tela inicial baseada em parâmetros URL ou prop
  const getInitialScreen = (): 'main' | 'gallery' | 'figma' | 'settings' => {
    // Se foi passada uma tela inicial, usar ela
    if (initialScreen) return initialScreen;
    
    const urlParams = new URLSearchParams(window.location.search);
    const screenParam = urlParams.get('screen');
    const hashParam = window.location.hash.replace('#', '');
    
    // Verificar parâmetros da URL
    if (screenParam === 'figma' || hashParam === 'figma') return 'figma';
    if (screenParam === 'gallery' || hashParam === 'gallery') return 'gallery';
    if (screenParam === 'settings' || hashParam === 'settings') return 'settings';
    
    return 'main';
  };

  const [config, setConfig] = useState<UniversalConfig>({
    url: 'https://desenvolvimento-web-2025-2.vercel.app',
    title: 'Interface Gráfica Pessoal - Sistema Universal',
    author: 'Gabriel Malheiros',
    institution: 'FAESA',
    status: 'online',
    theme: 'modern'
  });

  const [currentScreen, setCurrentScreen] = useState<'main' | 'gallery' | 'figma' | 'settings'>(getInitialScreen());
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // 🔄 Extrair configuração do CSS com detecção automática
  const extractCSSConfig = useCallback((): UniversalConfig => {
    const style = getComputedStyle(document.documentElement);
    
    // 🌐 Detecção automática do ambiente MELHORADA para Vercel REAL
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    let autoUrl = '';
    let autoStatus: UniversalConfig['status'] = 'online';
    let environment = 'unknown';
    
    // Detectar ambiente automaticamente com URL REAL do Vercel
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      autoUrl = `${protocol}//${hostname}:${port || '3000'}`;
      autoStatus = 'online';
      environment = 'development';
      document.documentElement.setAttribute('data-environment', 'development');
      console.log('🏠 Ambiente detectado: Desenvolvimento Local');
    } else if (hostname === 'desenvolvimento-web-2025-2.vercel.app' || hostname.includes('desenvolvimento-web-2025-2') || hostname.includes('vercel.app')) {
      autoUrl = `${protocol}//${hostname}`;
      autoStatus = 'online';
      environment = 'vercel';
      document.documentElement.setAttribute('data-environment', 'vercel');
      document.documentElement.setAttribute('data-url', hostname);
      console.log('🚀 Ambiente detectado: Vercel Deploy REAL - desenvolvimento-web-2025-2.vercel.app');
    } else if (hostname.includes('github.io') || hostname.includes('githubpages.io')) {
      autoUrl = `${protocol}//${hostname}/DesenvolvimentoWeb-2025-2`;
      autoStatus = 'online';
      environment = 'github-pages';
      document.documentElement.setAttribute('data-environment', 'github-pages');
      console.log('🌐 Ambiente detectado: GitHub Pages');
    } else if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
      autoUrl = `${protocol}//${hostname}`;
      autoStatus = 'online';
      environment = 'netlify';
      document.documentElement.setAttribute('data-environment', 'netlify');
      console.log('📡 Ambiente detectado: Netlify');
    } else {
      // Fallback para URL REAL do Vercel
      autoUrl = 'https://desenvolvimento-web-2025-2.vercel.app';
      autoStatus = 'online';
      environment = 'production';
      document.documentElement.setAttribute('data-environment', 'production');
      console.log('🌍 Ambiente detectado: Produção (Fallback para Vercel REAL)');
    }
    
    // Aplicar configurações CSS específicas do ambiente
    document.documentElement.style.setProperty('--current-environment', `"${environment}"`);
    document.documentElement.style.setProperty('--current-url', `"${autoUrl}"`);
    document.documentElement.style.setProperty('--portfolio-url', `"${autoUrl}"`);
    
    console.log(`🔗 URL REAL configurada: ${autoUrl}`);
    
    return {
      url: autoUrl,
      title: style.getPropertyValue('--portfolio-title').replace(/"/g, '').trim() || 
             'Interface Gráfica Universal',
      author: style.getPropertyValue('--portfolio-author').replace(/"/g, '').trim() || 
              'Gabriel Malheiros',
      institution: style.getPropertyValue('--portfolio-institution').replace(/"/g, '').trim() || 
                   'FAESA',
      status: autoStatus,
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

    // Listener para navegação do portfólio
    const handlePortfolioNavigate = (event: CustomEvent) => {
      console.log('🎯 Evento portfolio-navigate recebido:', event.detail);
      const { screen } = event.detail;
      if (screen) {
        console.log(`🔄 Mudando para tela: ${screen}`);
        setCurrentScreen(screen);
      }
    };

    updateConfig();

    const observer = new MutationObserver(updateConfig);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'data-theme']
    });

    window.addEventListener('resize', updateConfig);
    window.addEventListener('portfolio-navigate', handlePortfolioNavigate as EventListener);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateConfig);
      window.removeEventListener('portfolio-navigate', handlePortfolioNavigate as EventListener);
    };
  }, [extractCSSConfig, detectViewport]);

  // 🎨 Alterar tema
  const changeTheme = useCallback((newTheme: UniversalConfig['theme']) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.setProperty('--portfolio-theme', `"${newTheme}"`);
    setConfig(prev => ({ ...prev, theme: newTheme }));
  }, []);

  // 🎯 Navegar entre telas com atualização de URL
  const navigateToScreen = useCallback((screen: 'main' | 'gallery' | 'figma' | 'settings') => {
    setCurrentScreen(screen);
    
    // Atualizar URL baseado na tela
    let newUrl = `${window.location.origin}${window.location.pathname}`;
    if (screen !== 'main') {
      newUrl += `?screen=${screen}`;
    }
    
    window.history.pushState({ screen }, '', newUrl);
  }, []);

  //  Obter ícone do viewport
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

        {/* Link Principal do Portfólio usando o componente PortfolioLinkUniversal NOVO */}
        <div className="layout-center">
          <div className="relative">
            <PortfolioLinkUniversal 
              variant="button" 
              size="xl"
              showStatus={true}
              showProvider={true}
              showEnvironment={true}
              autoDetect={true}
              className="portfolio-link-universal"
              onNavigate={(screen) => {
                console.log('🔄 Callback onNavigate chamado:', screen);
                navigateToScreen(screen as 'main' | 'gallery' | 'figma' | 'settings');
              }}
            />
          </div>
        </div>

        {/* Seção Destacada - Galeria Figma */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-purple-800 mb-3 flex items-center justify-center gap-3">
                <Rocket size={32} className="text-purple-600" />
                🌌 Galeria Figma Espacial
              </h2>
              <p className="text-lg text-purple-700 mb-4">
                Explore nossa coleção de assets convertidos do Figma em uma experiência interativa única
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl mb-2">🖼️</div>
                  <h3 className="font-semibold text-purple-800 mb-1">Assets do Figma</h3>
                  <p className="text-sm text-purple-600">Conversão direta de designs para código</p>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl mb-2">🎨</div>
                  <h3 className="font-semibold text-purple-800 mb-1">Galeria Interativa</h3>
                  <p className="text-sm text-purple-600">Navegação fluida e responsiva</p>
                </div>
                <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                  <div className="text-2xl mb-2">🚀</div>
                  <h3 className="font-semibold text-purple-800 mb-1">Tema Espacial</h3>
                  <p className="text-sm text-purple-600">Exploração visual imersiva</p>
                </div>
              </div>

              <button
                onClick={() => navigateToScreen('figma')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3 mx-auto"
              >
                <Rocket size={24} />
                🎯 Explorar Galeria Figma
                <Image size={24} />
              </button>
            </div>
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

        {/* Seção de Dados Pessoais */}
        <div className="max-w-6xl mx-auto mt-16">
          <PersonalData className="mb-12" />
        </div>

        {/* Seção do Desafio Morse */}
        <div className="max-w-4xl mx-auto mt-12">
          <MorseChallenge />
        </div>

        {/* Navegação entre telas */}
        {showMultipleScreens && (
          <div className="flex justify-center gap-4 mt-12 flex-wrap">
            <button
              onClick={() => navigateToScreen('main')}
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
              onClick={() => navigateToScreen('gallery')}
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
            <button
              onClick={() => navigateToScreen('figma')}
              className={cn(
                "px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2",
                currentScreen === 'figma' 
                  ? "bg-brand-primary text-white" 
                  : "bg-white text-brand-primary border border-brand-primary hover:bg-brand-primary hover:text-white"
              )}
            >
              <Rocket size={20} />
              Galeria Figma
            </button>
            {enableThemeSelector && (
              <button
                onClick={() => navigateToScreen('settings')}
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
          {[
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
                {project.tech.map((tech: string, techIndex: number) => (
                  <span 
                    key={techIndex}
                    className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded-md font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <PortfolioLinkUniversal 
                variant="inline"
                size="sm"
                showStatus={false}
                showProvider={false}
                customText="🔗 Ver Projeto"
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

  // 🎨 Renderizar tela da galeria do Figma
  const renderFigmaScreen = () => (
    <div className="interface-main">
      <div className="layout-container">
        <div className="interface-header">
          <h1 className="interface-title">
            Galeria de Assets do Figma
          </h1>
          <p className="interface-subtitle">
            Exploração interativa dos assets convertidos do Figma para código
          </p>
          <p className="interface-description">
            Esta galeria demonstra a conversão bem-sucedida de designs Figma para componentes React funcionais. 
            Cada asset foi otimizado e integrado ao sistema de interface universal.
          </p>
        </div>

        {/* Galeria de imagens do espaço */}
        <div className="max-w-7xl mx-auto mt-8">
          <SpaceGallery 
            images={spaceFleetImages}
            className="space-gallery-figma"
          />
        </div>

        {/* Informações técnicas sobre os assets */}
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-700">
              <Image size={20} />
              Assets do Figma
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Assets:</span>
                <span className="font-medium">{spaceFleetImages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Formato Original:</span>
                <span className="font-medium">PNG/SVG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Otimização:</span>
                <span className="font-medium text-green-600">✓ WebP Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sistema de Fallback:</span>
                <span className="font-medium text-green-600">✓ Ativo</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg border border-purple-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-purple-700">
              <Rocket size={20} />
              Funcionalidades
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Seleção múltipla de imagens</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Sistema de categorização</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Loading lazy automático</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Responsividade total</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Acessibilidade ARIA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de dados pessoais */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              👤 Sobre o Desenvolvedor
            </h2>
            <p className="text-lg text-gray-600">
              Conheça mais sobre quem criou este projeto
            </p>
          </div>
          
          <PersonalData className="mb-8" />
        </div>

        {/* Desafio de código morse */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              📡 Desafio Interativo
            </h2>
            <p className="text-lg text-gray-600">
              Teste seus conhecimentos em código morse!
            </p>
          </div>
          
          <MorseChallenge />
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigateToScreen('main')}
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
              
              <PortfolioLinkUniversal 
                variant="card" 
                size="lg"
                showStatus={true}
                showProvider={true}
                showEnvironment={true}
                autoDetect={true}
              />
            </div>
          </div>

          {/* Seletor de Tema */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Palette size={20} />
              Tema da Interface
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'modern', name: 'Moderno', color: '#2563eb', desc: 'Azul vibrante' },
                { id: 'classic', name: 'Clássico', color: '#1e3a8a', desc: 'Azul tradicional' },
                { id: 'minimal', name: 'Minimalista', color: '#374151', desc: 'Cinza elegante' },
                { id: 'colorful', name: 'Colorido', color: '#7c3aed', desc: 'Roxo criativo' }
              ].map((theme) => (
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

          {/* Como tornar o site público */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
              🌐 Como Tornar Seu Site Público
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📘 Opção 1: GitHub Pages (Recomendado)</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Faça push do seu código para GitHub</li>
                  <li>Vá em Settings → Pages no repositório</li>
                  <li>Selecione "Deploy from a branch"</li>
                  <li>Escolha "main" branch</li>
                  <li>Seu site estará em: <code className="bg-gray-100 px-1 rounded text-xs">usuario.github.io/repositorio</code></li>
                </ol>
                
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>✅ Vantagens:</strong> Gratuito, SSL automático, integração com Git
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">🚀 Opção 2: Vercel/Netlify</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Conecte seu repositório GitHub</li>
                  <li>Configure comando build: <code className="bg-gray-100 px-1 rounded text-xs">npm run build</code></li>
                  <li>Diretório public: <code className="bg-gray-100 px-1 rounded text-xs">build/</code></li>
                  <li>Deploy automático a cada push</li>
                </ol>
                
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>🚀 Vantagens:</strong> Deploy automático, preview branches, domínio personalizado
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">🔗 Para aparecer no Google:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                <li>Adicione <code className="bg-yellow-100 px-1 rounded text-xs">sitemap.xml</code> no diretório public</li>
                <li>Configure <code className="bg-yellow-100 px-1 rounded text-xs">meta tags</code> para SEO no index.html</li>
                <li>Registre no <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Search Console</a></li>
                <li>Compartilhe o link em redes sociais para indexação mais rápida</li>
              </ul>
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
      case 'figma': return renderFigmaScreen();
      case 'settings': return renderSettingsScreen();
      default: return renderMainScreen();
    }
  };

  return (
    <div className={cn("interface-universal w-full", className)} data-theme={config.theme}>
      {/* Navegação Externa com Setas */}
      <ExternalNavigation 
        onFigmaAccess={() => navigateToScreen('figma')}
      />
      
      {renderCurrentScreen()}
    </div>
  );
};

export default InterfaceUniversal;
