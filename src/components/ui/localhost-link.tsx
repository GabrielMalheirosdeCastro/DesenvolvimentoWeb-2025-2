import React from 'react';

interface LocalhostLinkProps {
  port?: number;
  children?: React.ReactNode;
  className?: string;
  showProtocol?: boolean;
  style?: 'button' | 'badge' | 'inline';
}

export const LocalhostLink: React.FC<LocalhostLinkProps> = ({
  port = 3000,
  children,
  className = '',
  showProtocol = true,
  style = 'button'
}) => {
  const url = `http://localhost:${port}`;
  
  // 🔍 Detectar se o servidor está rodando (opcional)
  const [isServerRunning, setIsServerRunning] = React.useState<boolean | null>(null);
  
  React.useEffect(() => {
    // Verificar se o servidor está rodando
    const checkServer = async () => {
      try {
        await fetch(url, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setIsServerRunning(true);
      } catch {
        setIsServerRunning(false);
      }
    };
    
    checkServer();
  }, [url]);

  const handleClick = (e: React.MouseEvent) => {
    // Garantir que o link funcione
    e.preventDefault();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getStyleClasses = () => {
    const baseClasses = 'localhost-link inline-flex items-center justify-center transition-all duration-300 cursor-pointer select-none';
    
    switch (style) {
      case 'button':
        return `${baseClasses} px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg border-2 border-green-700 hover:from-green-400 hover:to-green-500 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2`;
      
      case 'badge':
        return `${baseClasses} px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full border border-green-300 hover:bg-green-200 hover:scale-110`;
      
      case 'inline':
        return `${baseClasses} text-green-600 underline font-medium hover:text-green-800 hover:no-underline`;
      
      default:
        return baseClasses;
    }
  };

  const getStatusIcon = () => {
    if (isServerRunning === null) return '⏳';
    if (isServerRunning) return '🟢';
    return '🔴';
  };

  const getStatusText = () => {
    if (isServerRunning === null) return 'Verificando...';
    if (isServerRunning) return 'Servidor ativo';
    return 'Servidor offline';
  };

  return (
    <div className="localhost-link-container">
      <a
        href={url}
        onClick={handleClick}
        className={`${getStyleClasses()} ${className}`}
        title={`${getStatusText()} - Clique para abrir ${url}`}
        rel="noopener noreferrer"
        data-localhost-port={port}
        data-server-status={isServerRunning ? 'running' : 'stopped'}
      >
        {/* Status icon */}
        <span className="mr-2">{getStatusIcon()}</span>
        
        {/* URL content */}
        <span className="flex items-center">
          {showProtocol && (
            <span className="opacity-75 mr-1">http://</span>
          )}
          <span className="font-mono">
            {children || `localhost:${port}`}
          </span>
        </span>
        
        {/* External link icon */}
        <span className="ml-2 opacity-75">↗</span>
      </a>
      
      {/* Status text for button style */}
      {style === 'button' && (
        <div className="text-xs text-gray-500 mt-1 text-center">
          {getStatusText()}
        </div>
      )}
    </div>
  );
};

// Componente específico para porta 3000
export const Localhost3000Link: React.FC<Omit<LocalhostLinkProps, 'port'>> = (props) => {
  return <LocalhostLink port={3000} {...props} />;
};

// Hook para verificar status do servidor
export const useLocalhostStatus = (port: number = 3000) => {
  const [isRunning, setIsRunning] = React.useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = React.useState<Date | null>(null);
  
  const checkStatus = React.useCallback(async () => {
    try {
      await fetch(`http://localhost:${port}`, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      setIsRunning(true);
    } catch {
      setIsRunning(false);
    }
    setLastChecked(new Date());
  }, [port]);
  
  React.useEffect(() => {
    checkStatus();
    
    // Verificar a cada 30 segundos
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, [checkStatus]);
  
  return { isRunning, lastChecked, checkStatus };
};

export default LocalhostLink;