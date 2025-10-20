import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '../ui/utils';

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
 * Componente seguro para imagens do Figma
 * Resolve problemas visuais comuns e garante carregamento confiável
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
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Força recarregamento da imagem
  const forceReload = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setImageState('loading');
      // Adiciona timestamp para forçar recarregamento
      setCurrentSrc(`${src}?t=${Date.now()}`);
    }
  }, [src, retryCount, maxRetries]);

  // Manipulador de carregamento bem-sucedido
  const handleLoad = useCallback(() => {
    setImageState('loaded');
    setRetryCount(0); // Reset contador
    onLoad?.();
  }, [onLoad]);

  // Manipulador de erro
  const handleError = useCallback(() => {
    setImageState('error');
    onError?.();
    
    // Tentar novamente automaticamente se habilitado
    if (enableRetry && retryCount < maxRetries) {
      setTimeout(() => {
        forceReload();
      }, 1000 * (retryCount + 1)); // Delay progressivo
    }
  }, [enableRetry, retryCount, maxRetries, forceReload, onError]);

  // Reset quando src muda
  useEffect(() => {
    setImageState('loading');
    setRetryCount(0);
    setCurrentSrc(src);
  }, [src]);

  // Placeholder de carregamento padrão
  const defaultLoadingPlaceholder = (
    <div className="flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
      <div className="text-center p-6">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-indigo-700 font-medium">Carregando imagem do Figma...</p>
        {retryCount > 0 && (
          <p className="text-xs text-indigo-500 mt-1">Tentativa {retryCount}/{maxRetries}</p>
        )}
      </div>
    </div>
  );

  // Placeholder de erro padrão
  const defaultErrorPlaceholder = (
    <div className="flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg">
      <div className="text-center p-6">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-sm text-red-700 font-medium">Erro ao carregar imagem</p>
        <p className="text-xs text-red-500 mt-1">{alt}</p>
        {enableRetry && retryCount < maxRetries && (
          <button
            onClick={forceReload}
            className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        )}
        {retryCount >= maxRetries && (
          <p className="text-xs text-red-400 mt-2">Máximo de tentativas atingido</p>
        )}
      </div>
    </div>
  );

  // Renderização condicional baseada no estado
  if (imageState === 'loading') {
    return (
      <div className={cn("w-full h-full min-h-[200px]", className)}>
        {loadingPlaceholder || defaultLoadingPlaceholder}
      </div>
    );
  }

  if (imageState === 'error') {
    return (
      <div className={cn("w-full h-full min-h-[200px]", className)}>
        {errorPlaceholder || defaultErrorPlaceholder}
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={cn(
        // Classes base para imagens do Figma
        "w-full h-full object-cover transition-opacity duration-300",
        // Anti-aliasing e otimizações visuais
        "image-rendering-auto backdrop-blur-0",
        // Suavização para diferentes densidades de tela
        "will-change-auto",
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      style={{
        // Força modo de renderização otimizado
        imageRendering: 'auto',
        ...props.style
      }}
      {...props}
    />
  );
}

export default FigmaImageSafe;