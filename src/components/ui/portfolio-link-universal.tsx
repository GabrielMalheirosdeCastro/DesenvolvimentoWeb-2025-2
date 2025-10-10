import React, { useEffect, useState, useCallback } from 'react';
import { ExternalLink, Globe, Cloud, Github, Zap, AlertCircle, CheckCircle, Monitor, Smartphone, Tablet } from 'lucide-react';
import { cn } from './utils';

interface UniversalPortfolioConfig {
  url: string;
  title: string;
  author: string;
  description: string;
  status: 'online' | 'offline' | 'maintenance' | 'development';
  environment: 'development' | 'github-pages' | 'vercel' | 'netlify' | 'production';
  provider: string;
  isValid: boolean;
  lastChecked: string;
}

interface PortfolioLinkUniversalProps {
  className?: string;
  variant?: 'button' | 'card' | 'inline' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  showProvider?: boolean;
  showEnvironment?: boolean;
  autoDetect?: boolean;
  fallbackUrl?: string;
  customText?: string;
  onNavigate?: (screen: string) => void; // Nova prop para callback
}

export const PortfolioLinkUniversal: React.FC<PortfolioLinkUniversalProps> = ({
  className,
  variant = 'button',
  size = 'lg',
  showStatus = true,
  showProvider = true,
  showEnvironment = false,
  autoDetect = true,
  fallbackUrl = 'https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2',
  customText,
  onNavigate // Nova prop
}) => {
  const [config, setConfig] = useState<UniversalPortfolioConfig>({
    url: '',
    title: 'Interface Gráfica Pessoal',
    author: 'Gabriel Malheiros',
    description: 'Site Pessoal - FAESA 2025-2',
    status: 'development',
    environment: 'development',
    provider: 'Detectando...',
    isValid: false,
    lastChecked: new Date().toISOString()
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // 🔍 Detectar ambiente e configurar URL automaticamente
  const detectEnvironmentAndUrl = useCallback((): UniversalPortfolioConfig => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    let detectedConfig: Partial<UniversalPortfolioConfig> = {
      lastChecked: new Date().toISOString()
    };

    console.log(`🔍 Detectando ambiente em: ${hostname}`);

    // 🏠 Desenvolvimento Local
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      detectedConfig = {
        url: `${protocol}//${hostname}:${port || '3000'}`,
        status: 'online',
        environment: 'development',
        provider: 'Desenvolvimento Local',
        isValid: true,
        title: 'Interface Gráfica Pessoal (Local)',
        description: 'Executando localmente via Vite'
      };
      document.documentElement.setAttribute('data-environment', 'development');
      console.log('🏠 Ambiente: Desenvolvimento Local detectado');
      
    // 🌐 GitHub Pages
    } else if (hostname.includes('github.io') || hostname.includes('githubpages.io')) {
      const githubUrl = hostname.includes('gabrielmalheirosdeciastro.github.io') 
        ? `${protocol}//${hostname}/DesenvolvimentoWeb-2025-2`
        : `${protocol}//${hostname}`;
      
      detectedConfig = {
        url: githubUrl,
        status: 'online',
        environment: 'github-pages',
        provider: 'GitHub Pages',
        isValid: true,
        title: 'Interface Gráfica Pessoal (GitHub)',
        description: 'Hospedado no GitHub Pages'
      };
      document.documentElement.setAttribute('data-environment', 'github-pages');
      console.log('🌐 Ambiente: GitHub Pages detectado');
      
    // 🚀 Vercel
    } else if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) {
      detectedConfig = {
        url: `${protocol}//${hostname}`,
        status: 'online',
        environment: 'vercel',
        provider: 'Vercel',
        isValid: true,
        title: 'Interface Gráfica Pessoal (Vercel)',
        description: 'Hospedado na Vercel'
      };
      document.documentElement.setAttribute('data-environment', 'vercel');
      console.log('🚀 Ambiente: Vercel detectado');
      
    // 📡 Netlify
    } else if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) {
      detectedConfig = {
        url: `${protocol}//${hostname}`,
        status: 'online',
        environment: 'netlify',
        provider: 'Netlify',
        isValid: true,
        title: 'Interface Gráfica Pessoal (Netlify)',
        description: 'Hospedado na Netlify'
      };
      document.documentElement.setAttribute('data-environment', 'netlify');
      console.log('📡 Ambiente: Netlify detectado');
      
    // 🌍 Produção ou Desconhecido
    } else {
      detectedConfig = {
        url: fallbackUrl,
        status: 'online',
        environment: 'production',
        provider: 'GitHub Pages (Fallback)',
        isValid: true,
        title: 'Interface Gráfica Pessoal',
        description: 'Site Pessoal - FAESA 2025-2'
      };
      document.documentElement.setAttribute('data-environment', 'production');
      console.log('🌍 Ambiente: Produção (usando fallback)');
    }

    // Aplicar configurações CSS
    if (detectedConfig.url) {
      document.documentElement.style.setProperty('--current-url', `"${detectedConfig.url}"`);
      document.documentElement.style.setProperty('--current-environment', `"${detectedConfig.environment}"`);
    }

    return {
      url: detectedConfig.url || fallbackUrl,
      title: detectedConfig.title || 'Interface Gráfica Pessoal',
      author: 'Gabriel Malheiros de Castro',
      description: detectedConfig.description || 'Site Pessoal - FAESA 2025-2',
      status: detectedConfig.status || 'online',
      environment: detectedConfig.environment || 'production',
      provider: detectedConfig.provider || 'Unknown',
      isValid: detectedConfig.isValid || false,
      lastChecked: detectedConfig.lastChecked || new Date().toISOString()
    };
  }, [fallbackUrl]);

  // 🔄 Detectar viewport
  const detectViewport = useCallback(() => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, []);

  // 🔄 Atualizar configurações
  useEffect(() => {
    if (autoDetect) {
      const newConfig = detectEnvironmentAndUrl();
      setConfig(newConfig);
      setViewport(detectViewport());
      
      console.log('📋 Configuração detectada:', newConfig);
    }

    // Monitorar mudanças de viewport
    const handleResize = () => setViewport(detectViewport());
    window.addEventListener('resize', handleResize);

    // Monitorar status online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoDetect, detectEnvironmentAndUrl, detectViewport]);

  // 🎯 Abrir link do portfólio
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    console.log('🔗 Click no botão do portfólio');
    console.log('Config:', { isValid: config.isValid, status: config.status, url: config.url });
    console.log('Online:', isOnline);
    
    const hostname = window.location.hostname;
    console.log('Hostname atual:', hostname);
    
    // 🎯 Se estamos no localhost ou no próprio site, vai para a galeria Figma
    if (hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname.includes('gabrielmalheirosdeciastro.github.io') ||
        hostname.includes('github.io')) {
      
      console.log('🎨 Redirecionando para Galeria Figma (localhost detectado)');
      
      // Usar callback se disponível
      if (onNavigate) {
        console.log('🔄 Usando callback onNavigate');
        onNavigate('figma');
        return;
      }
      
      // Fallback: Atualizar URL sem recarregar a página
      const newUrl = `${window.location.origin}${window.location.pathname}?screen=figma`;
      window.history.pushState({ screen: 'figma' }, '', newUrl);
      
      // Disparar evento personalizado para que o componente pai atualize
      const event = new CustomEvent('portfolio-navigate', { 
        detail: { screen: 'figma' } 
      });
      console.log('Disparando evento personalizado:', event);
      window.dispatchEvent(event);
      
      return;
    }

    // Verificar se é válido e online apenas para links externos
    if (!config.isValid || !isOnline) {
      console.warn('⚠️ Link inválido ou offline para link externo');
      
      // Se não é localhost mas é link inválido, tentar usar fallback
      console.log('� Tentando usar fallback URL');
      const finalUrl = fallbackUrl.includes('?') 
        ? `${fallbackUrl}&screen=figma`
        : `${fallbackUrl}?screen=figma`;
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 🌐 Caso contrário, abre em nova aba
    try {
      console.log(`🔗 Abrindo em nova aba: ${config.url}`);
      const finalUrl = config.url.includes('?') 
        ? `${config.url}&screen=figma`
        : `${config.url}?screen=figma`;
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('❌ Erro ao abrir link:', error);
      // Fallback: tentar novamente com método nativo
      window.location.href = config.url || fallbackUrl;
    }
  }, [config.url, config.isValid, isOnline, fallbackUrl, onNavigate]);

  // 🎨 Obter ícone do status
  const getStatusIcon = () => {
    if (!isOnline) return <AlertCircle size={20} className="text-red-500" />;
    
    switch (config.status) {
      case 'online': return <CheckCircle size={20} className="text-green-500" />;
      case 'development': return <Zap size={20} className="text-yellow-500" />;
      case 'maintenance': return <AlertCircle size={20} className="text-orange-500" />;
      case 'offline': return <AlertCircle size={20} className="text-red-500" />;
      default: return <Globe size={20} className="text-gray-500" />;
    }
  };

  // 🎨 Obter ícone do provedor
  const getProviderIcon = () => {
    switch (config.environment) {
      case 'github-pages': return <Github size={16} />;
      case 'vercel': return <Zap size={16} />;
      case 'netlify': return <Cloud size={16} />;
      case 'development': return <Monitor size={16} />;
      default: return <Globe size={16} />;
    }
  };

  // 🎨 Obter ícone do viewport
  const getViewportIcon = () => {
    switch (viewport) {
      case 'mobile': return <Smartphone size={14} />;
      case 'tablet': return <Tablet size={14} />;
      default: return <Monitor size={14} />;
    }
  };

  // 🎨 Obter texto do botão
  const getButtonText = () => {
    if (customText) return customText;
    
    switch (config.environment) {
      case 'development': return '🏠 Acessar Site Local';
      case 'github-pages': return '🌐 Acessar Site Público';
      case 'vercel': return '🚀 Acessar no Vercel';
      case 'netlify': return '📡 Acessar no Netlify';
      default: return '🌍 Acessar Portfólio';
    }
  };

  // 🎨 Obter classes CSS baseadas no variant
  const getVariantClasses = () => {
    const baseClasses = "portfolio-link-super-visible portfolio-link-universal";
    
    const sizeClasses = {
      sm: "text-sm",
      md: "text-base", 
      lg: "text-lg",
      xl: "text-xl"
    };

    const variantClasses = {
      button: "super-visible-container",
      card: "bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-900 hover:bg-blue-50 shadow-md hover:shadow-lg",
      inline: "text-blue-600 hover:text-blue-800 underline underline-offset-4 hover:underline-offset-2",
      badge: "bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200 text-xs font-medium"
    };

    return cn(
      baseClasses,
      sizeClasses[size],
      variantClasses[variant],
      !config.isValid && "opacity-50 cursor-not-allowed",
      !isOnline && "opacity-60 cursor-not-allowed emergency-visible",
      className
    );
  };

  // 🖼️ Renderizar conteúdo do link
  const renderContent = () => (
    <>
      <div className="flex items-center gap-2">
        {showStatus && getStatusIcon()}
        <span className="font-semibold">{getButtonText()}</span>
        <ExternalLink size={variant === 'badge' ? 14 : 18} />
      </div>
      
      {(showProvider || showEnvironment) && variant !== 'inline' && (
        <div className="flex items-center gap-3 text-xs opacity-75">
          {showProvider && (
            <div className="flex items-center gap-1">
              {getProviderIcon()}
              <span>{config.provider}</span>
            </div>
          )}
          
          {showEnvironment && (
            <div className="flex items-center gap-1">
              {getViewportIcon()}
              <span className="capitalize">{viewport}</span>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div 
      className={getVariantClasses()}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Acessar ${config.title} - ${config.description}`}
      data-environment={config.environment}
      data-status={config.status}
      data-valid={config.isValid}
      data-online={isOnline}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {variant === 'card' ? (
        <div className="w-full">
          <div className="text-center space-y-2">
            {renderContent()}
          </div>
          <div className="mt-3 text-xs text-gray-600 break-all">
            <span className="font-mono">{config.url}</span>
          </div>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default PortfolioLinkUniversal;