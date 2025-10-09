import React, { useEffect, useState, useCallback } from 'react';
import { ExternalLink, Globe, Clock, AlertCircle } from 'lucide-react';
import { cn } from './utils';

interface PortfolioLinkProps {
  className?: string;
  showDebugInfo?: boolean;
  variant?: 'button' | 'badge' | 'inline';
}

interface PortfolioConfig {
  url: string;
  status: 'deployed' | 'pending' | 'local';
  platform: string;
  displayText: string;
}

export const PortfolioLink: React.FC<PortfolioLinkProps> = ({ 
  className,
  showDebugInfo = false,
  variant = 'button'
}) => {
  const [config, setConfig] = useState<PortfolioConfig>({
    url: '',
    status: 'pending',
    platform: '',
    displayText: ''
  });

  const [isValidUrl, setIsValidUrl] = useState(false);

  // 🔍 Função para extrair configurações do CSS
  const extractCSSConfig = useCallback((): PortfolioConfig => {
    const style = getComputedStyle(document.documentElement);
    
    const url = style.getPropertyValue('--portfolio-url').replace(/"/g, '').trim();
    const status = style.getPropertyValue('--portfolio-status').replace(/"/g, '').trim() as PortfolioConfig['status'];
    const platform = style.getPropertyValue('--portfolio-platform').replace(/"/g, '').trim();
    const displayText = style.getPropertyValue('--portfolio-display-text').replace(/"/g, '').trim();

    return {
      url: url || 'https://portfolio-gabriel-malheiros.vercel.app',
      status: status || 'pending',
      platform: platform || 'Vercel',
      displayText: displayText || '🌐 Acessar Portfólio Online'
    };
  }, []);

  // 🔍 Validar se URL é válida e não é placeholder
  const validateUrl = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url);
      // Verificar se não é URL placeholder
      const placeholders = [
        'seu-portfolio',
        'localhost',
        '127.0.0.1',
        'example.com'
      ];
      
      return !placeholders.some(placeholder => 
        urlObj.hostname.includes(placeholder)
      );
    } catch {
      return false;
    }
  }, []);

  // 🔄 Atualizar configurações quando CSS mudar
  useEffect(() => {
    const updateConfig = () => {
      const newConfig = extractCSSConfig();
      setConfig(newConfig);
      setIsValidUrl(validateUrl(newConfig.url));
    };

    updateConfig();

    // Observer para mudanças no CSS (desenvolvimento)
    const observer = new MutationObserver(updateConfig);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    return () => observer.disconnect();
  }, [extractCSSConfig, validateUrl]);

  // 🎯 Função para abrir link
  const handleClick = useCallback(() => {
    if (isValidUrl && config.status === 'deployed') {
      window.open(config.url, '_blank', 'noopener,noreferrer');
    }
  }, [config.url, config.status, isValidUrl]);

  // 🎨 Obter ícone baseado no status
  const getStatusIcon = () => {
    switch (config.status) {
      case 'deployed':
        return isValidUrl ? <ExternalLink size={16} /> : <AlertCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      default:
        return <Globe size={16} />;
    }
  };

  // 🎨 Obter texto baseado no status
  const getStatusText = () => {
    if (!isValidUrl) return '⚠️ URL Inválida';
    
    switch (config.status) {
      case 'deployed':
        return config.displayText;
      case 'pending':
        return `⏳ Deploy pendente (${config.platform})`;
      default:
        return '🔧 Configuração local';
    }
  };

  // 🎨 Renderizar baseado na variante
  const renderContent = () => {
    const isClickable = isValidUrl && config.status === 'deployed';
    const statusText = getStatusText();
    const statusIcon = getStatusIcon();

    if (variant === 'badge') {
      return (
        <span
          className={cn(
            "portfolio-status-indicator",
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
            isClickable && "cursor-pointer hover:scale-105 transition-transform",
            !isClickable && "opacity-60 cursor-not-allowed",
            className
          )}
          data-status={config.status}
          onClick={isClickable ? handleClick : undefined}
        >
          {statusIcon}
          {statusText}
        </span>
      );
    }

    if (variant === 'inline') {
      return (
        <a
          href={isClickable ? config.url : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-1 text-sm text-primary hover:underline",
            !isClickable && "text-muted-foreground no-underline cursor-not-allowed",
            className
          )}
          onClick={!isClickable ? (e) => e.preventDefault() : undefined}
        >
          {statusIcon}
          {statusText}
        </a>
      );
    }

    // variant === 'button' (default)
    return (
      <button
        onClick={handleClick}
        disabled={!isClickable}
        className={cn(
          "portfolio-status-indicator",
          "inline-flex items-center justify-center gap-2",
          "px-4 py-2 rounded-md font-medium transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          isClickable ? [
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 hover:scale-105",
            "active:scale-95"
          ] : [
            "bg-muted text-muted-foreground",
            "cursor-not-allowed"
          ],
          className
        )}
        data-status={config.status}
      >
        {statusIcon}
        {statusText}
      </button>
    );
  };

  return (
    <div className="portfolio-link-container" data-status={config.status}>
      {renderContent()}
      
      {showDebugInfo && (
        <div className="portfolio-url-debug mt-2 p-2 bg-muted rounded text-xs">
          <div><strong>URL:</strong> {config.url}</div>
          <div><strong>Status:</strong> {config.status}</div>
          <div><strong>Platform:</strong> {config.platform}</div>
          <div><strong>Valid:</strong> {isValidUrl ? '✅' : '❌'}</div>
        </div>
      )}
    </div>
  );
};

export default PortfolioLink;
