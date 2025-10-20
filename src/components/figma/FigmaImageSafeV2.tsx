import React, { useRef } from 'react';
import { cn } from '../ui/utils';
import { useFigmaImage } from '../../hooks/useFigmaImage';

interface FigmaImageSafeProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** URL da imagem do Figma */
  src: string;
  /** Texto alternativo obrigatório */
  alt: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Forçar recarregamento em caso de erro */
  enableRetry?: boolean;
  /** Número máximo de tentativas */
  maxRetries?: number;
  /** Placeholder durante carregamento */
  loadingPlaceholder?: React.ReactNode;
  /** Placeholder em caso de erro */
  errorPlaceholder?: React.ReactNode;
  /** Callback quando imagem carrega com sucesso */
  onLoad?: () => void;
  /** Callback quando há erro de carregamento */
  onError?: () => void;
}

/**
 * Componente seguro e otimizado para imagens do Figma
 * ✅ Resolve problemas visuais automáticamente
 * ✅ Sistema de retry inteligente
 * ✅ Placeholders informativos
 * ✅ Performance otimizada
 */
export function FigmaImageSafe({
  src,
  alt,
  className,
  enableRetry = true,
  maxRetries = 3,
  loadingPlaceholder,
  errorPlaceholder,
  onLoad,
  onError,
  ...props
}: FigmaImageSafeProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Hook personalizado para gerenciar estado da imagem
  const {
    currentSrc,
    isLoading,
    isError,
    isRetrying,
    handleLoad: onImageLoad,
    handleError: onImageError,
    forceRetry,
    stats
  } = useFigmaImage({
    src,
    enableRetry,
    maxRetries,
    onLoad,
    onError
  });

  // Placeholder de carregamento com animação
  const defaultLoadingPlaceholder = (
    <div className="figma-loading-placeholder flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg min-h-[200px]">
      <div className="text-center p-6">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-indigo-700 font-medium">🖼️ Carregando imagem do Figma...</p>
        {stats.totalAttempts > 1 && (
          <p className="text-xs text-indigo-500 mt-1">
            Tentativa {stats.totalAttempts}/{maxRetries}
            {isRetrying && ' (tentando novamente...)'}
          </p>
        )}
      </div>
    </div>
  );

  // Placeholder de erro com opção de retry
  const defaultErrorPlaceholder = (
    <div className="figma-error-placeholder flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg min-h-[200px]">
      <div className="text-center p-6">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-sm text-red-700 font-medium">❌ Erro ao carregar imagem</p>
        <p className="text-xs text-red-500 mt-1">{alt}</p>
        <p className="text-xs text-red-400 mt-1">
          {stats.totalAttempts} tentativa{stats.totalAttempts > 1 ? 's' : ''} realizada{stats.totalAttempts > 1 ? 's' : ''}
        </p>
        {enableRetry && stats.totalAttempts < maxRetries && (
          <button
            onClick={forceRetry}
            disabled={isRetrying}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetrying ? '🔄 Tentando...' : '🔄 Tentar novamente'}
          </button>
        )}
        {stats.hasExceededRetries && (
          <p className="text-xs text-red-400 mt-2">🚫 Máximo de tentativas atingido</p>
        )}
      </div>
    </div>
  );

  // Renderização condicional baseada no estado
  if (isLoading) {
    return (
      <div className={cn("figma-image-container w-full h-full", className)}>
        {loadingPlaceholder || defaultLoadingPlaceholder}
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn("figma-image-container w-full h-full", className)}>
        {errorPlaceholder || defaultErrorPlaceholder}
      </div>
    );
  }

  // Imagem carregada com sucesso
  return (
    <div className={cn("figma-image-container relative", className)}>
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        className={cn(
          // Classes base para otimização visual
          "figma-image-safe w-full h-full object-cover",
          // Transições suaves
          "transition-opacity duration-300 ease-in-out",
          // Renderização otimizada
          "image-rendering-auto"
        )}
        onLoad={onImageLoad}
        onError={onImageError}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        draggable={false}
        style={{
          imageRendering: 'auto',
          ...props.style
        }}
        {...props}
      />
      
      {/* Indicador de sucesso (opcional, para debug) */}
      {stats.totalAttempts > 1 && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full opacity-75">
          ✅ {stats.totalAttempts}ª tentativa
        </div>
      )}
    </div>
  );
}

export default FigmaImageSafe;