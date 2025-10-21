import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../ui/utils';

interface SimpleFigmaImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Componente simplificado para imagens do Figma
 * Versão mais direta sem complexidade desnecessária
 */
export function SimpleFigmaImage({
  src,
  alt,
  className,
  onLoad,
  onError,
  ...props
}: SimpleFigmaImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setHasError(false);
    
    console.log(`🆕 SimpleFigmaImage iniciando carregamento:`, src);
  }, [src]);

  const handleLoad = () => {
    console.log(`✅ SimpleFigmaImage carregada:`, src);
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    console.error(`❌ SimpleFigmaImage erro:`, src);
    setHasError(true);
    setIsLoaded(false);
    onError?.();
  };

  // Renderizar sempre a imagem, mas com overlay de loading se necessário
  return (
    <div className={cn("relative", className)} style={{ width: '100%', height: '100%' }}>
      {/* Imagem principal */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={handleLoad}
        onError={handleError}
        style={{ 
          opacity: isLoaded ? 1 : 0.3,
          transition: 'opacity 0.3s ease',
          display: 'block'
        }}
        {...props}
      />
      
      {/* Loading overlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 bg-opacity-90">
          <div className="text-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-xs text-blue-700 font-medium">Carregando...</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <div className="text-center p-6">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-sm">✕</span>
            </div>
            <p className="text-sm text-red-700 font-medium">❌ Erro de carregamento</p>
            <p className="text-xs text-red-500 mt-1">{alt}</p>
          </div>
        </div>
      )}
    </div>
  );


}

export default SimpleFigmaImage;