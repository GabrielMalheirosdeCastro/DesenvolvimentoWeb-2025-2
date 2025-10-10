import React, { useState, useEffect } from 'react';
import { ExternalLink, Globe, Monitor, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from './utils';

interface LocalhostLinkProps {
  className?: string;
  variant?: 'button' | 'inline' | 'badge';
  showStatus?: boolean;
  autoDetect?: boolean;
}

export const Localhost3000Link: React.FC<LocalhostLinkProps> = ({
  className,
  variant = 'button',
  showStatus = true,
  autoDetect = true
}) => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [environment, setEnvironment] = useState<'local' | 'github' | 'production'>('production');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // 🔍 Detecção automática de ambiente
    const detectEnvironment = () => {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const port = window.location.port;

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // 🏠 DESENVOLVIMENTO LOCAL
        setEnvironment('local');
        setCurrentUrl('http://localhost:3000');
        console.log('🏠 Ambiente: Desenvolvimento Local');
      } else if (hostname.includes('github.io')) {
        // 🌐 GITHUB PAGES
        setEnvironment('github');
        setCurrentUrl('https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2');
        console.log('🌐 Ambiente: GitHub Pages');
      } else {
        // 🌍 PRODUÇÃO/OUTROS
        setEnvironment('production');
        setCurrentUrl('https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2');
        console.log('🌍 Ambiente: Produção');
      }
    };

    // 🔍 Testar se localhost:3000 está rodando (apenas se estivermos em localhost)
    const testLocalhost = async () => {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          try {
            await fetch('http://localhost:3000', { 
              method: 'HEAD',
              mode: 'no-cors',
              signal: controller.signal
            });
            setIsOnline(true);
            console.log('✅ Localhost:3000 está online');
          } catch (error) {
            setIsOnline(false);
            console.log('❌ Localhost:3000 está offline');
          } finally {
            clearTimeout(timeoutId);
          }
        } catch (error) {
          setIsOnline(false);
          console.log('❌ Localhost:3000 está offline');
        }
      } else {
        setIsOnline(true); // GitHub Pages sempre online
      }
    };

    detectEnvironment();
    if (autoDetect) {
      testLocalhost();
    }
  }, [autoDetect]);

  const handleClick = () => {
    // 🚀 Abrir link baseado no ambiente atual
    if (environment === 'local' && !isOnline) {
      alert('❌ Servidor local não está rodando!\n\n✅ Execute: npm run dev\n⏰ Aguarde o servidor iniciar\n🔗 Depois clique novamente');
      return;
    }

    window.open(currentUrl, '_blank', 'noopener,noreferrer');
    console.log(`🔗 Abrindo: ${currentUrl}`);
  };

  const getStatusIcon = () => {
    if (environment === 'local') {
      return isOnline ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return <Globe className="w-4 h-4 text-blue-500" />;
  };

  const getStatusText = () => {
    switch (environment) {
      case 'local':
        return isOnline ? 'Local Online' : 'Local Offline - Execute npm run dev';
      case 'github':
        return 'GitHub Pages Online';
      case 'production':
        return 'Site Online';
      default:
        return 'Status Desconhecido';
    }
  };

  const getDisplayUrl = () => {
    switch (environment) {
      case 'local':
        return 'localhost:3000';
      case 'github':
        return 'GitHub Pages';
      case 'production':
        return 'Site Público';
      default:
        return currentUrl;
    }
  };

  if (variant === 'inline') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors",
          className
        )}
      >
        <ExternalLink className="w-4 h-4" />
        {getDisplayUrl()}
        {showStatus && getStatusIcon()}
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors",
          !isOnline && environment === 'local' && "bg-red-100 text-red-800 hover:bg-red-200",
          className
        )}
      >
        {showStatus && getStatusIcon()}
        {getDisplayUrl()}
      </button>
    );
  }

  // Variant 'button' (padrão)
  return (
    <button
      onClick={handleClick}
      disabled={environment === 'local' && !isOnline}
      className={cn(
        "flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        environment === 'local' && isOnline && "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        environment === 'local' && !isOnline && "bg-gray-400 text-gray-700 cursor-not-allowed",
        environment === 'github' && "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        environment === 'production' && "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
        className
      )}
    >
      {showStatus && getStatusIcon()}
      <span>
        {environment === 'local' && isOnline && '🏠 Abrir Desenvolvimento Local'}
        {environment === 'local' && !isOnline && '❌ Servidor Local Offline'}
        {environment === 'github' && '🌐 Abrir Site no GitHub Pages'}
        {environment === 'production' && '🌍 Abrir Site Público'}
      </span>
      <ExternalLink className="w-4 h-4" />
    </button>
  );
};

// Componente para link universal
export const UniversalPortfolioLink: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ className, size = 'lg' }) => {
  const [url, setUrl] = useState<string>('');
  const [environment, setEnvironment] = useState<string>('');

  useEffect(() => {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      setUrl('http://localhost:3000');
      setEnvironment('🏠 Desenvolvimento');
    } else {
      setUrl('https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2');
      setEnvironment('🌐 Site Público');
    }
  }, []);

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-6 text-xl'
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105",
        "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
        "hover:from-blue-700 hover:via-blue-800 hover:to-blue-900",
        "shadow-lg hover:shadow-xl border-2 border-blue-300",
        "focus:outline-none focus:ring-4 focus:ring-blue-300",
        sizeClasses[size],
        className
      )}
    >
      <Globe className="w-6 h-6" />
      <div className="text-center">
        <div>Acessar Portfólio</div>
        <div className="text-xs opacity-90">{environment}</div>
      </div>
      <ExternalLink className="w-5 h-5" />
    </a>
  );
};

export default Localhost3000Link;