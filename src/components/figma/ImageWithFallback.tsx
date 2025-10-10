import { useState, type ImgHTMLAttributes } from 'react'

// Base64 de imagem SVG segura para fallback
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  // Propriedades adicionais para segurança
  secure?: boolean;
  maxRetries?: number;
}

export function ImageWithFallback({ 
  secure = true, 
  maxRetries = 2, 
  ...props 
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Tentar recarregar a imagem
      setRetryCount(prev => prev + 1)
      // Força nova tentativa após pequeno delay
      setTimeout(() => {
        setDidError(false)
      }, 500)
    } else {
      setDidError(true)
      console.warn(`⚠️ Falha ao carregar imagem do Figma após ${maxRetries} tentativas:`, props.src)
    }
  }

  const handleLoad = () => {
    // Reset counter quando imagem carrega com sucesso
    setRetryCount(0)
    setDidError(false)
  }

  const { src, alt, style, className, ...rest } = props

  // Verificação adicional de segurança para URLs
  const isSafeUrl = (url: string | undefined): boolean => {
    if (!url) return false
    // Permite apenas URLs locais ou data URLs seguros
    return url.startsWith('/') || 
           url.startsWith('./') || 
           url.startsWith('../') ||
           url.startsWith('data:') ||
           url.startsWith('blob:') ||
           (secure && url.includes('assets/'))
  }

  // Se não passou na verificação de segurança, usar fallback
  if (secure && !isSafeUrl(src)) {
    console.warn('🔒 URL de imagem bloqueada por motivos de segurança:', src)
    return (
      <div
        className={`inline-block bg-red-50 border border-red-200 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
          <img src={ERROR_IMG_SRC} alt="Imagem bloqueada" />
          <p className="text-xs text-red-600 mt-2">🔒 Imagem bloqueada</p>
        </div>
      </div>
    )
  }

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
      title={`Erro ao carregar: ${alt} (${retryCount}/${maxRetries} tentativas)`}
    >
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <img src={ERROR_IMG_SRC} alt="Erro ao carregar imagem" {...rest} />
        <p className="text-xs text-gray-500 mt-2">Erro ao carregar</p>
        {retryCount > 0 && (
          <p className="text-xs text-gray-400">Tentativa {retryCount}/{maxRetries}</p>
        )}
      </div>
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style} 
      onError={handleError}
      onLoad={handleLoad}
      // Adicionar propriedades de segurança
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      {...rest} 
    />
  )
}
