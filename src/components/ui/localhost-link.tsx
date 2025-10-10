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
  const [environment, setEnvironment] = useState<'local' | 'custom-domain' | 'github' | 'production'>('production');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // 🔍 Detecção automática de ambiente - desenvolvimento vs produção
    const detectEnvironment = () => {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const port = window.location.port;

      // 🚀 PRIORIDADE 1: Vercel Deploy Real
      if (hostname === 'desenvolvimento-web-2025-2.vercel.app' || hostname.includes('desenvolvimento-web-2025-2') || hostname.includes('vercel.app')) {
        setEnvironment('custom-domain');
        setCurrentUrl(`${protocol}//${hostname}`);
        console.log('🚀 Ambiente: Vercel Deploy - ONLINE');
        
      // 🏠 PRIORIDADE 2: Desenvolvimento local
      } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
        setEnvironment('local');
        setCurrentUrl('http://localhost:3000');
        console.log('🏠 Ambiente: Desenvolvimento Local');
        
      // 📁 PRIORIDADE 3: GitHub Pages (backup)
      } else if (hostname.includes('github.io')) {
        setEnvironment('github');
        setCurrentUrl('https://gabrielmalheirosdeciastro.github.io/DesenvolvimentoWeb-2025-2');
        console.log('📁 Ambiente: GitHub Pages - BACKUP');
        
      // 🌍 FALLBACK: Vercel por padrão
      } else {
        setEnvironment('production');
        setCurrentUrl('https://desenvolvimento-web-2025-2.vercel.app');
        console.log('🌍 Fallback: Vercel Deploy Real');
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
            console.log('✅ Localhost:3000 está online e funcional');
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
        setIsOnline(true); // Domínios personalizados sempre online
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
      alert('❌ Servidor local não está rodando!\n\n✅ Execute: npm run dev\n⏰ Aguarde o servidor iniciar\n🔗 Depois clique novamente\n\n💡 Em produção, use os links do Vercel ou GitHub Pages');
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
        return isOnline ? 'Local Online (desenvolvimento)' : 'Local Offline - Execute npm run dev';
      case 'custom-domain':
        return 'Vercel Online';
      case 'github':
        return 'GitHub Pages Online (backup)';
      case 'production':
        return 'Vercel Online';
      default:
        return 'Status Desconhecido';
    }
  };

  const getDisplayUrl = () => {
    switch (environment) {
      case 'local':
        return 'localhost:3000 (desenvolvimento)';
      case 'custom-domain':
        return 'Vercel App';
      case 'github':
        return 'GitHub Pages (backup)';
      case 'production':
        return 'Vercel App';
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
        environment === 'custom-domain' && "bg-black hover:bg-gray-800 text-white focus:ring-gray-500",
        environment === 'github' && "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        environment === 'production' && "bg-black hover:bg-gray-800 text-white focus:ring-gray-500",
        className
      )}
    >
      {showStatus && getStatusIcon()}
      <span>
        {environment === 'local' && isOnline && '🏠 Desenvolvimento Local'}
        {environment === 'local' && !isOnline && '❌ Servidor Local Offline'}
        {environment === 'custom-domain' && '🚀 Acessar no Vercel'}
        {environment === 'github' && '📁 GitHub Pages (backup)'}
        {environment === 'production' && '🚀 Acessar no Vercel'}
      </span>
      <ExternalLink className="w-4 h-4" />
    </button>
  );
};

// Componente para link universal com domínio personalizado
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
      setEnvironment('🏠 Desenvolvimento Local');
    } else if (hostname === 'desenvolvimento-web-2025-2.vercel.app' || hostname.includes('desenvolvimento-web-2025-2') || hostname.includes('vercel.app')) {
      setUrl(`https://${hostname}`);
      setEnvironment('🚀 Vercel Deploy');
    } else {
      setUrl('https://desenvolvimento-web-2025-2.vercel.app');
      setEnvironment('🚀 Vercel Deploy');
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
        "bg-gradient-to-r from-black via-gray-800 to-gray-900",
        "hover:from-gray-800 hover:via-gray-700 hover:to-gray-600",
        "shadow-lg hover:shadow-xl border-2 border-gray-600",
        "focus:outline-none focus:ring-4 focus:ring-gray-300",
        sizeClasses[size],
        className
      )}
      data-provider="vercel"
      data-url="desenvolvimento-web-2025-2.vercel.app"
    >
      <Globe className="w-6 h-6" />
      <div className="text-center">
        <div>🚀 desenvolvimento-web-2025-2.vercel.app</div>
        <div className="text-xs opacity-90">{environment}</div>
      </div>
      <ExternalLink className="w-5 h-5" />
    </a>
  );
};

export default Localhost3000Link;