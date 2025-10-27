import React from 'react';
import { cn } from '../ui/utils';

interface UltraSimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Componente ultraminimalista para imagens
 * Sem estados complexos, apenas carregamento direto
 */
export function UltraSimpleImage({
  src,
  alt,
  className,
  onLoad,
  onError,
  ...props
}: UltraSimpleImageProps & React.ImgHTMLAttributes<HTMLImageElement>) {
  
  console.log(`🖼️ UltraSimpleImage iniciando carregamento:`, { src, alt });

  return (
    <img
      src={src}
      alt={alt}
      className={cn("w-full h-full object-cover", className)}
      onLoad={() => {
        console.log(`✅ UltraSimpleImage carregada com sucesso:`, { src, alt });
        onLoad?.();
      }}
      onError={(e) => {
        console.error(`❌ UltraSimpleImage falha no carregamento:`, { src, alt, error: e });
        onError?.();
      }}
      loading="eager"
      decoding="sync"
      style={{
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        imageRendering: 'auto'
      }}
      {...props}
    />
  );
}

export default UltraSimpleImage;