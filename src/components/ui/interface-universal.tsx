import React, { useState, useEffect, useCallback } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  Palette,
  Link,
  Home,
  Rocket,
  Image
} from 'lucide-react';
import { cn } from './utils';
import SpaceGallery from '../gallery/SpaceGallery';
import { spaceFleetImages } from '../../data/spaceFleetData';
import PersonalData from './personal-data';
import MorseChallenge from './morse-challenge';
import FixedBottomNavigation from './fixed-bottom-navigation';
import LaboratoriosLinks from './laboratorios-links';


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
  const [forceUpdate, setForceUpdate] = useState(0); // Para forçar re-render quando tema muda

  // 🎨 Função para calcular contraste inteligente
  const calculateContrastColor = (backgroundColor: string): string => {
    // Função para converter hex para RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    // Calcular luminosidade
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return '#ffffff';

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    
    // Se luminosidade for baixa (fundo escuro), usar texto branco
    // Se luminosidade for alta (fundo claro), usar texto escuro
    return luminance > 0.5 ? '#1f2937' : '#ffffff';
  };

  // 🎨 Hook para monitorar mudanças de tema
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      console.log('🎨 Tema alterado, forçando re-render...', event.detail);
      setForceUpdate(prev => prev + 1);
      
      // Forçar atualização do background do body
      const { config } = event.detail;
      document.body.style.background = `linear-gradient(135deg, ${config.bgPrimary} 0%, ${config.bgSecondary} 100%)`;
      document.body.style.color = config.textPrimary;
    };

    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange as EventListener);
    };
  }, []);

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

  // 🎨 Sistema Inteligente de Temas com Contraste Automático
  const changeTheme = useCallback((newTheme: UniversalConfig['theme']) => {
    console.log(`🎨 Aplicando tema: ${newTheme}`);
    
    // 1. Aplicar atributo de tema no HTML
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.style.setProperty('--portfolio-theme', `"${newTheme}"`);
    
    // 2. Definir configurações específicas de cada tema
    const themeConfigs = {
      modern: {
        brandPrimary: '#2563eb',
        brandSecondary: '#1d4ed8', 
        brandAccent: '#3b82f6',
        bgPrimary: '#ffffff',
        bgSecondary: '#f8fafc',
        bgTertiary: '#f1f5f9',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
        description: 'Azul vibrante com fundo branco'
      },
      classic: {
        brandPrimary: '#1e3a8a',
        brandSecondary: '#1e40af',
        brandAccent: '#3b82f6', 
        bgPrimary: '#f9fafb',
        bgSecondary: '#f3f4f6',
        bgTertiary: '#e5e7eb',
        textPrimary: '#111827',
        textSecondary: '#374151',
        textMuted: '#6b7280',
        description: 'Azul tradicional com fundo neutro'
      },
      minimal: {
        brandPrimary: '#60a5fa',
        brandSecondary: '#3b82f6',
        brandAccent: '#93c5fd',
        bgPrimary: '#1f2937', // 🎯 FUNDO MAIS ESCURO para melhor contraste
        bgSecondary: '#374151', 
        bgTertiary: '#4b5563',
        textPrimary: '#ffffff', // 🎯 TEXTO BRANCO para contraste perfeito
        textSecondary: '#f9fafb',
        textMuted: '#e5e7eb',
        description: 'Cinza elegante com alto contraste'
      },
      colorful: {
        brandPrimary: '#7c3aed',
        brandSecondary: '#8b5cf6',
        brandAccent: '#a78bfa',
        bgPrimary: '#faf5ff',
        bgSecondary: '#f3e8ff',
        bgTertiary: '#e9d5ff', 
        textPrimary: '#581c87',
        textSecondary: '#7c2d92',
        textMuted: '#a855f7',
        description: 'Roxo criativo com fundo vibrante'
      }
    };
    
    const themeConfig = themeConfigs[newTheme];
    
    // 3. Aplicar todas as variáveis CSS dinamicamente
    const root = document.documentElement;
    
    // Cores da marca
    root.style.setProperty('--brand-primary', themeConfig.brandPrimary);
    root.style.setProperty('--brand-secondary', themeConfig.brandSecondary);
    root.style.setProperty('--brand-accent', themeConfig.brandAccent);
    
    // Cores de fundo
    root.style.setProperty('--color-bg-primary', themeConfig.bgPrimary);
    root.style.setProperty('--color-bg-secondary', themeConfig.bgSecondary);
    root.style.setProperty('--color-bg-tertiary', themeConfig.bgTertiary);
    
    // Cores de texto
    root.style.setProperty('--color-text-primary', themeConfig.textPrimary);
    root.style.setProperty('--color-text-secondary', themeConfig.textSecondary);
    root.style.setProperty('--color-text-muted', themeConfig.textMuted);
    
    // 4. Forçar re-render de elementos que podem não atualizar automaticamente
    const forceUpdate = () => {
      // Atualizar body background
      document.body.style.background = `linear-gradient(135deg, ${themeConfig.bgPrimary} 0%, ${themeConfig.bgSecondary} 100%)`;
      document.body.style.color = themeConfig.textPrimary;
      
      // Atualizar todos os elementos com classes específicas
      const elementsToUpdate = [
        '.interface-main',
        '.bg-white',
        '.interface-card',
        '.card'
      ];
      
      elementsToUpdate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el: Element) => {
          const element = el as HTMLElement;
          if (selector === '.interface-main') {
            element.style.background = `linear-gradient(135deg, ${themeConfig.bgPrimary} 0%, ${themeConfig.bgSecondary} 100%)`;
            element.style.color = themeConfig.textPrimary;
          } else if (selector.includes('bg-white') || selector.includes('card')) {
            element.style.backgroundColor = themeConfig.bgPrimary;
            element.style.color = themeConfig.textPrimary;
            element.style.borderColor = themeConfig.bgTertiary;
          }
        });
      });
    };
    
    // Aplicar mudanças com um pequeno delay para garantir que o CSS tenha processado
    setTimeout(forceUpdate, 50);
    
    // 5. Atualizar estado do componente
    setConfig(prev => ({ 
      ...prev, 
      theme: newTheme 
    }));
    
    // 6. Log para debug
    console.log(`✅ Tema ${newTheme} aplicado com sucesso!`, {
      background: themeConfig.bgPrimary,
      text: themeConfig.textPrimary,
      brand: themeConfig.brandPrimary
    });
    
    // 7. Disparar evento customizado para outros componentes
    window.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme: newTheme, config: themeConfig } 
    }));
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

        {/* Acesso direto apenas via navegação externa - sem botões localhost */}

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

              {/* Botão "Explorar Galeria Figma" removido - acesso apenas via navegação inferior */}
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

        {/* Seção de Laboratórios Acadêmicos */}
        <div className="max-w-6xl mx-auto mt-16">
          <LaboratoriosLinks className="mb-12" />
        </div>

        {/* Seção do Desafio Morse */}
        <div className="max-w-4xl mx-auto mt-12">
          <MorseChallenge />
        </div>

        {/* Navegação entre telas - REMOVIDA - Agora usa navegação fixa inferior */}
        {/* {showMultipleScreens && (
          <div className="flex justify-center gap-4 mt-12 flex-wrap">
            ... botões removidos ...
          </div>
        )} */}
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
              
              {/* Link de projeto removido para simplificar interface */}
              <div className="text-sm text-gray-500 italic">
                Acesso via navegação principal
              </div>
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

        {/* Link discreto para galeria espacial */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <a 
            href="galeria-naves-espaciais.html" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌌 Ver Galeria de Naves Espaciais
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
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
              
              {/* Links externos removidos - acesso apenas via galeria Figma */}
              <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-purple-800 font-medium">🎯 Acesso Simplificado</p>
                <p className="text-sm text-purple-600 mt-1">
                  Use as setas de navegação para acessar a Galeria Figma
                </p>
              </div>
            </div>
          </div>

          {/* Seletor de Tema Inteligente */}
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Palette size={20} />
              Tema da Interface
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Escolha um tema que se adapta automaticamente com contraste inteligente
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { 
                  id: 'modern', 
                  name: 'Moderno', 
                  color: '#2563eb',
                  bgColor: '#ffffff',
                  textColor: '#0f172a',
                  contrastText: '#0f172a',
                  desc: 'Azul vibrante' 
                },
                { 
                  id: 'classic', 
                  name: 'Clássico', 
                  color: '#1e3a8a',
                  bgColor: '#f9fafb', 
                  textColor: '#111827',
                  contrastText: '#111827',
                  desc: 'Azul tradicional' 
                },
                { 
                  id: 'minimal', 
                  name: 'Minimalista', 
                  color: '#60a5fa',
                  bgColor: '#1f2937', // 🎯 Fundo escuro para melhor contraste
                  textColor: '#ffffff', // 🎯 Texto branco sempre
                  contrastText: '#ffffff', // FORÇAR BRANCO para contraste
                  desc: 'Cinza elegante' 
                },
                { 
                  id: 'colorful', 
                  name: 'Colorido', 
                  color: '#7c3aed',
                  bgColor: '#faf5ff',
                  textColor: '#581c87',
                  contrastText: '#581c87',
                  desc: 'Roxo criativo' 
                }
              ].map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id as UniversalConfig['theme'])}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all text-center hover:scale-105 hover:shadow-lg",
                    config.theme === theme.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  )}
                  style={{
                    backgroundColor: config.theme === theme.id ? theme.bgColor : '#ffffff',
                    // 🎯 Sistema de Contraste Inteligente Automático
                    color: config.theme === theme.id 
                      ? calculateContrastColor(theme.bgColor)
                      : '#374151'
                  }}
                >
                  {/* Círculo colorido com gradiente para mostrar o tema */}
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 shadow-lg border-2 border-white"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.color} 0%, ${theme.color}dd 100%)`,
                      boxShadow: `0 4px 12px ${theme.color}40`
                    }}
                  />
                  
                  {/* Preview mini do background */}
                  <div 
                    className="w-full h-3 rounded mb-2 border border-gray-200"
                    style={{ 
                      background: `linear-gradient(90deg, ${theme.bgColor} 0%, ${theme.color}20 100%)`
                    }}
                  />
                  
                  <div 
                    className="font-medium text-sm mb-1"
                    style={{ 
                      color: config.theme === theme.id 
                        ? calculateContrastColor(theme.bgColor)
                        : '#374151'
                    }}
                  >
                    {theme.name}
                  </div>
                  <div 
                    className="text-xs mt-1"
                    style={{ 
                      color: config.theme === theme.id 
                        ? calculateContrastColor(theme.bgColor) + '90'
                        : '#6b7280'
                    }}
                  >
                    {theme.desc}
                  </div>
                  
                  {/* Indicador de tema ativo */}
                  {config.theme === theme.id && (
                    <div className="mt-2 flex items-center justify-center">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span 
                        className="ml-1 text-xs font-medium" 
                        style={{ 
                          color: calculateContrastColor(theme.bgColor)
                        }}
                      >
                        Ativo
                      </span>
                    </div>
                  )}
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
    <div 
      className={cn("interface-universal w-full has-fixed-navigation", className)} 
      data-theme={config.theme}
      key={forceUpdate} // Força re-render quando tema muda
      style={{
        background: `linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%)`,
        color: 'var(--color-text-primary)',
        transition: 'all 0.3s ease',
        minHeight: '100vh'
      }}
    >
      {renderCurrentScreen()}

      {/* 📱 Navegação Fixa Inferior - SEMPRE VISÍVEL */}
      <FixedBottomNavigation
        currentScreen={currentScreen}
        onNavigate={navigateToScreen}
        enableThemeSelector={enableThemeSelector}
        className="fixed-bottom-navigation"
      />
    </div>
  );
};

export default InterfaceUniversal;
