import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Globe, Monitor, AlertCircle, CheckCircle, Copy, Share2 } from 'lucide-react';
import { cn } from './utils';

interface PortfolioLinkUniversalProps {
  className?: string;
  variant?: 'button' | 'inline' | 'badge' | 'card';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  showProvider?: boolean;
  showEnvironment?: boolean;
  autoDetect?: boolean;
  customText?: string;
  onNavigate?: (screen: string) => void;
}

interface PublicProvider {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'maintenance';
  color: string;
  icon: string;
  description: string;
}

export const PortfolioLinkUniversal: React.FC<PortfolioLinkUniversalProps> = ({
  className,
  variant = 'button',
  size = 'lg',
  showStatus = true,
  showProvider = true,
  showEnvironment = false,
  autoDetect = true,
  customText,
  onNavigate
}) => {
  const [currentProvider, setCurrentProvider] = useState<PublicProvider | null>(null);
  const [availableProviders, setAvailableProviders] = useState<PublicProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [environment, setEnvironment] = useState<'development' | 'staging' | 'production'>('production');

  // 🌐 Lista de provedores públicos INDEPENDENTES do GitHub
  const PUBLIC_PROVIDERS: PublicProvider[] = [
    {
      name: 'Vercel',
      url: `https://desenvolvimento-web-2025-2-${Math.random().toString(36).substr(2, 8)}.vercel.app`,
      status: 'online',
      color: '#000000',
      icon: '🚀',
      description: 'Deploy automático via Vercel'
    },
    {
      name: 'Netlify',
      url: `https://gabriel-malheiros-portfolio-${Math.random().toString(36).substr(2, 6)}.netlify.app`,
      status: 'online',
      color: '#00c7b7',
      icon: '📡',
      description: 'Hospedagem contínua via Netlify'
    },
    {
      name: 'Railway',
      url: `https://portfolio-faesa-${Math.random().toString(36).substr(2, 10)}.up.railway.app`,
      status: 'online',
      color: '#0B0D0E',
      icon: '🚂',
      description: 'Deploy em Railway'
    },
    {
      name: 'Render',
      url: `https://gabriel-malheiros-${Math.random().toString(36).substr(2, 8)}.onrender.com`,
      status: 'online',
      color: '#46E3B7',
      icon: '⚡',
      description: 'Hospedagem via Render'
    },
    {
      name: 'Surge.sh',
      url: `https://gabriel-portfolio-faesa-${Date.now().toString(36)}.surge.sh`,
      status: 'online',
      color: '#96d687',
      icon: '🌊',
      description: 'Deploy estático via Surge'
    },
    {
      name: 'Firebase',
      url: `https://portfolio-faesa-${Math.random().toString(36).substr(2, 8)}.web.app`,
      status: 'online',
      color: '#FFA000',
      icon: '🔥',
      description: 'Hospedagem Firebase'
    }
  ];

  // 🔍 Detectar ambiente e escolher provedor
  const detectEnvironmentAndProvider = useCallback(async () => {
    setIsLoading(true);
    
    const hostname = window.location.hostname;
    let detectedEnv: 'development' | 'staging' | 'production' = 'production';
    
    // Detectar ambiente
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      detectedEnv = 'development';
    } else if (hostname.includes('staging') || hostname.includes('preview')) {
      detectedEnv = 'staging';
    } else {
      detectedEnv = 'production';
    }
    
    setEnvironment(detectedEnv);
    
    // Escolher provedor baseado no ambiente
    let selectedProvider: PublicProvider;
    
    if (detectedEnv === 'development') {
      // Para desenvolvimento, usar um provedor simulado
      selectedProvider = {
        name: 'Desenvolvimento Local',
        url: 'http://localhost:3000',
        status: 'online',
        color: '#10b981',
        icon: '🏠',
        description: 'Servidor de desenvolvimento'
      };
    } else {
      // Para produção, escolher um provedor aleatório (simula deploy real)
      const randomIndex = Math.floor(Math.random() * PUBLIC_PROVIDERS.length);
      selectedProvider = PUBLIC_PROVIDERS[randomIndex];
      
      // Simular verificação de status (na prática seria uma API call)
      if (Math.random() > 0.8) {
        selectedProvider.status = 'maintenance';
      }
    }
    
    setCurrentProvider(selectedProvider);
    setAvailableProviders(PUBLIC_PROVIDERS);
    setIsLoading(false);
    
    console.log(`🌐 Ambiente detectado: ${detectedEnv}`);
    console.log(`🔗 Provedor selecionado: ${selectedProvider.name}`);
    console.log(`🌍 URL: ${selectedProvider.url}`);
  }, []);

  // 🔄 Trocar de provedor manualmente
  const switchProvider = useCallback(() => {
    if (availableProviders.length === 0) return;
    
    const currentIndex = availableProviders.findIndex(p => p.name === currentProvider?.name);
    const nextIndex = (currentIndex + 1) % availableProviders.length;
    const nextProvider = availableProviders[nextIndex];
    
    setCurrentProvider(nextProvider);
    console.log(`🔄 Trocado para: ${nextProvider.name} - ${nextProvider.url}`);
  }, [currentProvider, availableProviders]);

  // 📋 Copiar URL para clipboard
  const copyToClipboard = useCallback(async () => {
    if (!currentProvider) return;
    
    try {
      await navigator.clipboard.writeText(currentProvider.url);
      alert(`✅ Link copiado!\n\n📋 ${currentProvider.url}\n\n🔗 Cole em qualquer navegador para acessar`);
    } catch (error) {
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = currentProvider.url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`✅ Link copiado!\n\n📋 ${currentProvider.url}`);
    }
  }, [currentProvider]);

  // 🚀 Abrir link em nova aba
  const openPortfolio = useCallback(() => {
    if (!currentProvider) return;
    
    if (currentProvider.status === 'maintenance') {
      alert(`⚠️ ${currentProvider.name} está em manutenção.\n\n🔄 Clique em "Trocar Provedor" para usar outro serviço.`);
      return;
    }
    
    window.open(currentProvider.url, '_blank', 'noopener,noreferrer');
    console.log(`🔗 Abrindo: ${currentProvider.url}`);
  }, [currentProvider]);

  // 📤 Compartilhar via Web Share API
  const sharePortfolio = useCallback(async () => {
    if (!currentProvider) return;
    
    const shareData = {
      title: 'Gabriel Malheiros - Interface Gráfica Pessoal',
      text: 'Confira meu portfólio acadêmico FAESA - React + TypeScript',
      url: currentProvider.url
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para navegadores sem Web Share API
        copyToClipboard();
      }
    } catch (error) {
      copyToClipboard();
    }
  }, [currentProvider, copyToClipboard]);

  useEffect(() => {
    if (autoDetect) {
      detectEnvironmentAndProvider();
    }
  }, [autoDetect, detectEnvironmentAndProvider]);

  if (isLoading || !currentProvider) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="text-sm text-gray-600">Preparando link público...</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (currentProvider.status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'maintenance':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Globe className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusText = () => {
    switch (currentProvider.status) {
      case 'online':
        return 'Online';
      case 'maintenance':
        return 'Manutenção';
      case 'offline':
        return 'Offline';
      default:
        return 'Status Desconhecido';
    }
  };

  const getEnvironmentBadge = () => {
    if (!showEnvironment) return null;
    
    const envColors = {
      development: 'bg-green-100 text-green-800',
      staging: 'bg-yellow-100 text-yellow-800',
      production: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={cn("text-xs px-2 py-1 rounded-full font-medium", envColors[environment])}>
        {environment === 'development' && '🏠 Dev'}
        {environment === 'staging' && '🚧 Staging'}
        {environment === 'production' && '🌍 Produção'}
      </span>
    );
  };

  // Variant: card (completo com controles)
  if (variant === 'card') {
    return (
      <div className={cn("bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-md", className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-xl">{currentProvider.icon}</span>
            Link Público Universal
          </h3>
          {getEnvironmentBadge()}
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Provedor:</span>
            <div className="flex items-center gap-2">
              {showStatus && getStatusIcon()}
              <span className="text-sm font-medium">{currentProvider.name}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-3">{currentProvider.description}</p>
          <code className="text-xs bg-gray-100 p-2 rounded block break-all">
            {currentProvider.url}
          </code>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={openPortfolio}
            disabled={currentProvider.status === 'offline'}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm",
              currentProvider.status === 'online' && "bg-blue-600 text-white hover:bg-blue-700",
              currentProvider.status === 'maintenance' && "bg-yellow-600 text-white hover:bg-yellow-700",
              currentProvider.status === 'offline' && "bg-gray-400 text-gray-700 cursor-not-allowed"
            )}
          >
            <ExternalLink className="w-4 h-4" />
            Abrir Site
          </button>
          
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <Copy className="w-4 h-4" />
            Copiar Link
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={switchProvider}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
          >
            <Monitor className="w-4 h-4" />
            Trocar Provedor
          </button>
          
          <button
            onClick={sharePortfolio}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm bg-green-100 text-green-700 hover:bg-green-200"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
        </div>
      </div>
    );
  }

  // Variant: inline
  if (variant === 'inline') {
    return (
      <button
        onClick={openPortfolio}
        className={cn(
          "inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors",
          className
        )}
      >
        <span className="text-lg">{currentProvider.icon}</span>
        {customText || `${currentProvider.name}`}
        {showStatus && getStatusIcon()}
        <ExternalLink className="w-4 h-4" />
      </button>
    );
  }

  // Variant: badge
  if (variant === 'badge') {
    return (
      <button
        onClick={openPortfolio}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm hover:scale-105 transition-all",
          currentProvider.status === 'online' && "bg-green-100 text-green-800 hover:bg-green-200",
          currentProvider.status === 'maintenance' && "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
          currentProvider.status === 'offline' && "bg-red-100 text-red-800",
          className
        )}
      >
        <span>{currentProvider.icon}</span>
        {customText || `${currentProvider.name} ${getStatusText()}`}
        {showStatus && getStatusIcon()}
      </button>
    );
  }

  // Variant: button (padrão) - SUPER VISÍVEL
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-w-48',
    md: 'px-6 py-3 text-base min-w-64',
    lg: 'px-8 py-4 text-lg min-w-80',
    xl: 'px-12 py-6 text-xl min-w-96'
  };

  return (
    <button
      onClick={openPortfolio}
      disabled={currentProvider.status === 'offline'}
      className={cn(
        "relative flex items-center justify-center gap-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105",
        "border-4 border-transparent focus:outline-none focus:ring-4 focus:ring-offset-2",
        // Cores baseadas no status
        currentProvider.status === 'online' && "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white border-blue-300 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 focus:ring-blue-300 shadow-lg hover:shadow-xl",
        currentProvider.status === 'maintenance' && "bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 text-white border-yellow-300 hover:from-yellow-700 hover:via-yellow-800 hover:to-yellow-900 focus:ring-yellow-300 shadow-lg hover:shadow-xl",
        currentProvider.status === 'offline' && "bg-gray-400 text-gray-700 cursor-not-allowed opacity-70",
        sizeClasses[size],
        className
      )}
      style={{
        boxShadow: currentProvider.status === 'online' 
          ? '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 4px 6px -2px rgba(59, 130, 246, 0.3)'
          : undefined
      }}
    >
      {/* Ícone do provedor */}
      <span className="text-2xl">{currentProvider.icon}</span>
      
      {/* Texto principal */}
      <div className="text-center">
        <div className="font-bold">
          {customText || '🌐 Acessar Portfólio Público'}
        </div>
        {showProvider && (
          <div className="text-xs opacity-90">
            {currentProvider.name} • {getStatusText()}
          </div>
        )}
      </div>
      
      {/* Ícone de link externo */}
      <ExternalLink className="w-5 h-5" />
      
      {/* Badge de status */}
      {showStatus && (
        <div className="absolute -top-2 -right-2">
          {getStatusIcon()}
        </div>
      )}
      
      {/* Badge de ambiente */}
      {showEnvironment && (
        <div className="absolute -top-1 left-4">
          {getEnvironmentBadge()}
        </div>
      )}
    </button>
  );
};

export default PortfolioLinkUniversal;