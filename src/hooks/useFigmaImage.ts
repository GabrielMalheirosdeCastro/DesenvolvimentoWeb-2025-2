import { useState, useCallback, useEffect } from 'react';

export interface FigmaImageState {
  /** Estado atual da imagem */
  status: 'loading' | 'loaded' | 'error';
  /** Número de tentativas realizadas */
  retryCount: number;
  /** Se a imagem está sendo recarregada */
  isRetrying: boolean;
  /** Timestamp da última tentativa */
  lastAttempt: number;
}

export interface UseFigmaImageOptions {
  /** URL da imagem */
  src: string;
  /** Habilitar tentativas automáticas */
  enableRetry?: boolean;
  /** Número máximo de tentativas */
  maxRetries?: number;
  /** Delay entre tentativas (ms) */
  retryDelay?: number;
  /** Callback quando carregamento é bem-sucedido */
  onLoad?: () => void;
  /** Callback quando há erro */
  onError?: (retryCount: number) => void;
  /** Callback quando tentativa é realizada */
  onRetry?: (retryCount: number) => void;
}

/**
 * Hook personalizado para gerenciar estado de imagens do Figma
 * Fornece funcionalidades robustas de retry e monitoramento
 */
export function useFigmaImage({
  src,
  enableRetry = true,
  maxRetries = 3,
  retryDelay = 1000,
  onLoad,
  onError,
  onRetry
}: UseFigmaImageOptions) {
  const [state, setState] = useState<FigmaImageState>({
    status: 'loading',
    retryCount: 0,
    isRetrying: false,
    lastAttempt: Date.now()
  });

  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset quando src muda
  useEffect(() => {
    setState({
      status: 'loading',
      retryCount: 0,
      isRetrying: false,
      lastAttempt: Date.now()
    });
    setCurrentSrc(src);
  }, [src]);

  // Função para forçar retry manual
  const forceRetry = useCallback(() => {
    if (state.retryCount >= maxRetries) {
      console.warn(`🚫 Máximo de tentativas (${maxRetries}) atingido para imagem:`, src);
      return false;
    }

    setState(prev => ({
      ...prev,
      status: 'loading',
      retryCount: prev.retryCount + 1,
      isRetrying: true,
      lastAttempt: Date.now()
    }));

    // Adiciona timestamp para forçar recarregamento
    setCurrentSrc(`${src}?retry=${Date.now()}`);
    
    onRetry?.(state.retryCount + 1);
    
    console.log(`🔄 Tentativa ${state.retryCount + 1}/${maxRetries} para imagem:`, src);
    
    return true;
  }, [src, state.retryCount, maxRetries, onRetry]);

  // Retry automático com delay
  const scheduleRetry = useCallback(() => {
    if (!enableRetry || state.retryCount >= maxRetries) {
      return;
    }

    const delay = retryDelay * (state.retryCount + 1); // Delay progressivo
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isRetrying: false
      }));
      forceRetry();
    }, delay);
  }, [enableRetry, state.retryCount, maxRetries, retryDelay, forceRetry]);

  // Manipulador de carregamento bem-sucedido
  const handleLoad = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'loaded',
      isRetrying: false
    }));
    
    onLoad?.();
    console.log(`✅ Imagem carregada com sucesso após ${state.retryCount} tentativas:`, src);
  }, [onLoad, src, state.retryCount]);

  // Manipulador de erro
  const handleError = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'error',
      isRetrying: enableRetry && prev.retryCount < maxRetries
    }));
    
    onError?.(state.retryCount);
    console.warn(`❌ Erro ao carregar imagem (tentativa ${state.retryCount + 1}/${maxRetries}):`, src);
    
    // Agendar retry automático se habilitado
    if (enableRetry && state.retryCount < maxRetries) {
      scheduleRetry();
    }
  }, [enableRetry, maxRetries, onError, scheduleRetry, src, state.retryCount]);

  // Reset completo (útil para componente pai)
  const reset = useCallback(() => {
    setState({
      status: 'loading',
      retryCount: 0,
      isRetrying: false,
      lastAttempt: Date.now()
    });
    setCurrentSrc(src);
  }, [src]);

  // Verificar se pode tentar novamente
  const canRetry = state.retryCount < maxRetries && !state.isRetrying;

  // Estatísticas úteis
  const stats = {
    totalAttempts: state.retryCount + 1,
    isFirstAttempt: state.retryCount === 0,
    hasExceededRetries: state.retryCount >= maxRetries,
    timeElapsed: Date.now() - state.lastAttempt
  };

  return {
    // Estado atual
    state,
    currentSrc,
    
    // Funções de controle
    handleLoad,
    handleError,
    forceRetry,
    reset,
    
    // Informações úteis
    canRetry,
    stats,
    
    // Estado derivado
    isLoading: state.status === 'loading',
    isLoaded: state.status === 'loaded',
    isError: state.status === 'error',
    isRetrying: state.isRetrying
  };
}

export default useFigmaImage;