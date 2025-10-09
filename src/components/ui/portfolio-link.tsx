import React, { useEffect, useState, useCallback } from 'react';
import { ExternalLink, Globe, Cloud, Github, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from './utils';

interface PortfolioConfig {
  url: string;
  title: string;
  description: string;
  status: 'deployed' | 'staging' | 'development' | 'offline';
  provider: string;
  customDomain: string;
  showProvider: boolean;
  showStatus: boolean;
  buttonText: string;
  buttonStyle: 'primary' | 'secondary' | 'outline' | 'ghost';
}

interface PortfolioLinkProps {
  className?: string;
  variant?: 'button' | 'badge' | 'card' | 'inline';
  size?: 'sm' | 'md' | 'lg';
  showDebugInfo?: boolean;
}

export const PortfolioLink: React.FC<PortfolioLinkProps> = ({
  className,
  variant = 'button',
  size = 'md',
  showDebugInfo = false
}) => {
  const [config, setConfig] = useState<PortfolioConfig>({
    url: '',
    title: '',
    description: '',
    status: 'development',
    provider: 'auto-detect',
    customDomain: '',
    showProvider: true,
    showStatus: true,
    buttonText: '🌐 Acessar Portfólio',
    buttonStyle: 'primary'
  });

  const [detectedProvider, setDetectedProvider] = useState<string>('Unknown');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  // 🔍 Detectar provedor automaticamente pela URL
  const detectProvider = useCallback((url: string): string => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // Detecção universal de provedores
      if (hostname.includes('vercel.app') || hostname.includes('vercel.com')) return 'Vercel';
      if (hostname.includes('netlify.app') || hostname.includes('netlify.com')) return 'Netlify';
      if (hostname.includes('github.io')) return 'GitHub Pages';
      if (hostname.includes('firebase.app') || hostname.includes('web.app')) return 'Firebase';
      if (hostname.includes('surge.sh')) return 'Surge';
      if (hostname.includes('heroku.app') || hostname.includes('herokuapp.com')) return 'Heroku';
      if (hostname.includes('render.com')) return 'Render';
      if (hostname.includes('railway.app')) return 'Railway';
      if (hostname.includes('fly.io')) return 'Fly.io';
      if (hostname.includes('cyclic.app')) return 'Cyclic';
      if (hostname.includes('cloudflare.com') || hostname.includes('pages.dev')) return 'Cloudflare Pages';
      if (hostname.includes('amplify.app')) return 'AWS Amplify';
      if (hostname.includes('azurewebsites.net')) return 'Azure';
      if (hostname.includes('now.sh')) return 'Vercel (Legacy)';
      
      // Domínios personalizados
      if (!hostname.includes('.app') && !hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
        return 'Domínio Próprio';
      }

      return 'Provedor Personalizado';
    } catch {
      return 'URL Inválida';
    }
  }, []);

  // 🔍 Validar URL e detectar se está online
  const validateAndCheckUrl = useCallback(async (url: string): Promise<boolean> => {
    try {
      const urlObj = new URL(url);
      
      // Verificar se não é placeholder
      const placeholders = ['seu-portfolio', 'localhost', '127.0.0.1', 'example.com', 'placeholder'];
      const isPlaceholder = placeholders.some(placeholder => 
        urlObj.hostname.includes(placeholder)
      );

      if (isPlaceholder) return false;

      // Verificar se está online (usando fetch com modo no-cors para evitar CORS)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        await fetch(url, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return true;
      } catch {
        // Se falhar, ainda consideramos válido se tem formato correto
        return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
      }
    } catch {
      return false;
    }
  }, []);

  // 🔄 Extrair configuração do CSS
  const extractCSSConfig = useCallback((): Partial<PortfolioConfig> => {
    const style = getComputedStyle(document.documentElement);
    
    return {
      url: style.getPropertyValue('--portfolio-url').replace(/"/g, '').trim(),
      title: style.getPropertyValue('--portfolio-title').replace(/"/g, '').trim(),
      description: style.getPropertyValue('--portfolio-description').replace(/"/g, '').trim(),
      status: style.getPropertyValue('--portfolio-status').replace(/"/g, '').trim() as PortfolioConfig['status'],
      provider: style.getPropertyValue('--portfolio-provider').replace(/"/g, '').trim(),
      customDomain: style.getPropertyValue('--portfolio-domain-custom').replace(/"/g, '').trim(),
      showProvider: style.getPropertyValue('--portfolio-show-provider').replace(/"/g, '').trim() === 'true',
      showStatus: style.getPropertyValue('--portfolio-show-status').replace(/"/g, '').trim() === 'true',
      buttonText: style.getPropertyValue('--portfolio-button-text').replace(/"/g, '').trim(),
      buttonStyle: style.getPropertyValue('--portfolio-button-style').replace(/"/g, '').trim() as PortfolioConfig['buttonStyle']
    };
  }, []);

  // 🔄 Atualizar configuração
  useEffect(() => {
    const updateConfig = async () => {
      const cssConfig = extractCSSConfig();
      const url = cssConfig.url || 'https://desenvolvimento-web-2025-2.vercel.app';
      
      // Detectar provedor
      const provider = cssConfig.provider === 'auto-detect' 
        ? detectProvider(url) 
        : cssConfig.provider || 'auto-detect';
      
      // Validar URL
      const isValid = await validateAndCheckUrl(url);
      
      setConfig(prev => ({
        ...prev,
        ...cssConfig,
        url,
        provider: cssConfig.provider || 'auto-detect'
      }));
      
      setDetectedProvider(provider);
      setIsValidUrl(isValid);
      setIsOnline(isValid && cssConfig.status === 'deployed');
    };

    updateConfig();

    // Observer para mudanças no CSS
    const observer = new MutationObserver(updateConfig);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => observer.disconnect();
  }, [extractCSSConfig, detectProvider, validateAndCheckUrl]);

  // 🎯 Abrir link
  const handleClick = useCallback(() => {
    if (isValidUrl && config.status === 'deployed') {
      window.open(config.url, '_blank', 'noopener,noreferrer');
    }
  }, [config.url, config.status, isValidUrl]);

  // 🎨 Obter ícone do provedor
  const getProviderIcon = () => {
    switch (detectedProvider.toLowerCase()) {
      case 'vercel': return <Zap size={16} />;
      case 'netlify': return <Cloud size={16} />;
      case 'github pages': return <Github size={16} />;
      case 'firebase': return <Zap size={16} />;
      default: return <Globe size={16} />;
    }
  };

  // 🎨 Obter ícone do status
  const getStatusIcon = () => {
    switch (config.status) {
      case 'deployed': return isValidUrl ? <CheckCircle size={16} /> : <AlertCircle size={16} />;
      case 'staging': return <Cloud size={16} />;
      case 'development': return <Globe size={16} />;
      case 'offline': return <AlertCircle size={16} />;
      default: return <Globe size={16} />;
    }
  };

  // 🎨 Obter texto do status
  const getStatusText = () => {
    if (!isValidUrl) return '⚠️ URL inválida';
    
    switch (config.status) {
      case 'deployed': return config.buttonText;
      case 'staging': return `🔄 Staging (${detectedProvider})`;
      case 'development': return `🔧 Desenvolvimento`;
      case 'offline': return `📴 Offline`;
      default: return config.buttonText;
    }
  };

  // 🎨 Renderizar componente
  const isClickable = isValidUrl && config.status === 'deployed';
  const statusText = getStatusText();
  const statusIcon = getStatusIcon();

  const baseClasses = cn(
    "portfolio-status-indicator",
    `portfolio-button-${config.buttonStyle}`,
    {
      'text-sm px-3 py-2': size === 'sm',
      'text-base px-4 py-2': size === 'md',
      'text-lg px-6 py-3': size === 'lg',
    },
    !isClickable && "opacity-60 cursor-not-allowed",
    className
  );

  return (
    <div className="portfolio-link-universal space-y-2">
      {/* Componente Principal */}
      <div
        className={baseClasses}
        data-status={config.status}
        onClick={isClickable ? handleClick : undefined}
        role={isClickable ? "button" : "status"}
        tabIndex={isClickable ? 0 : -1}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {statusIcon}
        <span>{statusText}</span>
        
        {config.showProvider && detectedProvider !== 'URL Inválida' && (
          <span className="portfolio-provider-badge">
            {getProviderIcon()}
            {detectedProvider}
          </span>
        )}
        
        {isClickable && <ExternalLink size={14} className="ml-1" />}
      </div>

      {/* Informações de Debug */}
      {showDebugInfo && (
        <div className="text-xs bg-muted p-3 rounded border space-y-1">
          <div><strong>URL:</strong> <code>{config.url}</code></div>
          <div><strong>Provedor:</strong> {detectedProvider}</div>
          <div><strong>Status:</strong> {config.status}</div>
          <div><strong>Válida:</strong> {isValidUrl ? '✅' : '❌'}</div>
          <div><strong>Online:</strong> {isOnline ? '🟢' : '🔴'}</div>
          <div><strong>Clicável:</strong> {isClickable ? '✅' : '❌'}</div>
        </div>
      )}
    </div>
  );
};

export default PortfolioLink;
