import React, { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, Globe } from 'lucide-react';
import { cn } from './utils';
import { PortfolioLink } from './portfolio-link';

interface ViewportInfo {
  width: number;
  height: number;
  type: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
}

export const PortfolioResponsiveDemo: React.FC<{ className?: string }> = ({ 
  className 
}) => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: 0,
    height: 0,
    type: 'desktop',
    orientation: 'landscape'
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      let type: ViewportInfo['type'] = 'desktop';
      if (width < 768) type = 'mobile';
      else if (width < 1024) type = 'tablet';
      
      const orientation = width > height ? 'landscape' : 'portrait';
      
      setViewport({ width, height, type, orientation });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    
    // Animação de entrada
    setTimeout(() => setIsVisible(true), 100);
    
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const getViewportIcon = () => {
    switch (viewport.type) {
      case 'mobile': return <Smartphone size={16} />;
      case 'tablet': return <Tablet size={16} />;
      default: return <Monitor size={16} />;
    }
  };

  const getViewportInfo = () => {
    return `${viewport.width}×${viewport.height} (${viewport.type})`;
  };

  return (
    <div className={cn(
      "space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl",
      "border border-blue-200 shadow-lg",
      "transition-all duration-500",
      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="text-blue-600" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Portfólio Universal
            </h3>
            <p className="text-sm text-gray-600">
              Design Figma • Responsivo • Windows • Google Compatible
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-lg border border-blue-200">
          {getViewportIcon()}
          <span className="text-xs font-medium text-blue-700">
            {getViewportInfo()}
          </span>
        </div>
      </div>

      {/* Demonstração de Responsividade */}
      <div className="grid gap-4">
        {/* Mobile Preview */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={16} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">Mobile (&lt; 768px)</span>
            {viewport.type === 'mobile' && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                Ativo
              </span>
            )}
          </div>
          
          <div className="max-w-xs mx-auto">
            <PortfolioLink 
              variant="button" 
              size="sm"
              className="w-full justify-center"
            />
          </div>
        </div>

        {/* Tablet Preview */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Tablet size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Tablet (768px - 1024px)</span>
            {viewport.type === 'tablet' && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                Ativo
              </span>
            )}
          </div>
          
          <div className="max-w-md mx-auto">
            <PortfolioLink 
              variant="button" 
              size="md"
              className="w-full justify-center"
            />
          </div>
        </div>

        {/* Desktop Preview */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Monitor size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Desktop ({'>'} 1024px)</span>
            {viewport.type === 'desktop' && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                Ativo
              </span>
            )}
          </div>
          
          <div className="max-w-lg mx-auto">
            <PortfolioLink 
              variant="button" 
              size="lg"
              className="w-full justify-center"
            />
          </div>
        </div>
      </div>

      {/* Variantes do Componente */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Variantes Disponíveis
        </h4>
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-500 w-16">Button:</span>
            <PortfolioLink variant="button" size="sm" />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-500 w-16">Badge:</span>
            <PortfolioLink variant="badge" />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-gray-500 w-16">Inline:</span>
            <PortfolioLink variant="inline" />
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <PortfolioLink showDebugInfo={true} />
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          ✅ Compatível com Windows 11 • Chrome • Edge • Firefox • Safari
        </p>
        <p className="text-xs text-gray-400 mt-1">
          🎨 Design baseado no Figma • 📱 Mobile-first • ⚡ Performance otimizada
        </p>
      </div>
    </div>
  );
};

export default PortfolioResponsiveDemo;
