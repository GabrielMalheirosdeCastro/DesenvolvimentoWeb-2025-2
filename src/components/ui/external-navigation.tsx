import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Globe, Home } from 'lucide-react';
import { cn } from './utils';

interface ExternalNavigationProps {
  className?: string;
  onFigmaAccess?: () => void;
}

export const ExternalNavigation: React.FC<ExternalNavigationProps> = ({
  className,
  onFigmaAccess
}) => {
  const [previousSite, setPreviousSite] = useState<string>('');

  useEffect(() => {
    // Verificar se pode voltar na história do navegador
    
    // Tentar obter o referrer para mostrar de onde veio
    if (document.referrer && document.referrer !== window.location.href) {
      try {
        const referrerUrl = new URL(document.referrer);
        setPreviousSite(referrerUrl.hostname);
      } catch (error) {
        console.log('Não foi possível detectar site anterior');
      }
    }
  }, []);

  const handleGoBack = () => {
    try {
      // Verificar se pode voltar com segurança
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback: ir para Google se não houver histórico
        window.location.href = 'https://www.google.com';
      }
    } catch (error) {
      // Fallback seguro
      window.location.href = 'https://www.google.com';
    }
  };

  const handleGoHome = () => {
    // Ir para página principal do portfólio
    window.location.href = window.location.origin;
  };

  return (
    <>
      {/* Seta Esquerda - Voltar ao site anterior */}
      <div 
        className={cn(
          "fixed left-4 top-1/2 transform -translate-y-1/2 z-50",
          "bg-white/90 backdrop-blur-sm rounded-full shadow-lg",
          "border-2 border-blue-500/20 hover:border-blue-500/40",
          "transition-all duration-300 cursor-pointer group",
          "hover:scale-110 hover:shadow-xl",
          className
        )}
        onClick={handleGoBack}
        title={previousSite ? `Voltar para ${previousSite}` : 'Voltar ao site anterior'}
      >
        <div className="p-3 flex items-center gap-2">
          <ArrowLeft 
            size={24} 
            className="text-blue-600 group-hover:text-blue-700 transition-colors" 
          />
          <span className="hidden lg:block text-sm font-medium text-blue-600 group-hover:text-blue-700">
            {previousSite ? `← ${previousSite}` : 'Voltar'}
          </span>
        </div>
      </div>

      {/* Seta Direita - Acesso à Galeria Figma */}
      <div 
        className={cn(
          "fixed right-4 top-1/2 transform -translate-y-1/2 z-50",
          "bg-gradient-to-r from-purple-500 to-blue-600 rounded-full shadow-lg",
          "hover:from-purple-600 hover:to-blue-700",
          "transition-all duration-300 cursor-pointer group",
          "hover:scale-110 hover:shadow-xl",
          "animate-pulse hover:animate-none",
          className
        )}
        onClick={onFigmaAccess}
        title="Acessar Galeria Figma - Exploração Espacial"
      >
        <div className="p-4 flex items-center gap-2">
          <span className="hidden lg:block text-sm font-bold text-white">
            Galeria Figma
          </span>
          <ChevronRight 
            size={28} 
            className="text-white group-hover:translate-x-1 transition-transform" 
          />
        </div>
      </div>

      {/* Indicador Central - Home */}
      <div 
        className={cn(
          "fixed top-4 right-1/2 transform translate-x-1/2 z-50",
          "bg-white/90 backdrop-blur-sm rounded-full shadow-lg",
          "border-2 border-green-500/20 hover:border-green-500/40",
          "transition-all duration-300 cursor-pointer group",
          "hover:scale-105"
        )}
        onClick={handleGoHome}
        title="Voltar à página principal"
      >
        <div className="px-4 py-2 flex items-center gap-2">
          <Home 
            size={20} 
            className="text-green-600 group-hover:text-green-700 transition-colors" 
          />
          <span className="text-sm font-medium text-green-600 group-hover:text-green-700">
            Início
          </span>
        </div>
      </div>

      {/* Informação de Navegação Segura */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-xs opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Globe size={14} />
            <span>Navegação Segura: Use as setas para voltar com segurança</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExternalNavigation;