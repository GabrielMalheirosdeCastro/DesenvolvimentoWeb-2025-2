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
  
  console.log(`🖼️ UltraSimpleImage renderizando:`, src);

  return (
    <img
      src={src}
      alt={alt}
      className={cn("w-full h-full object-cover", className)}
      onLoad={() => {
        console.log(`✅ UltraSimpleImage carregada:`, src);
        onLoad?.();
      }}
      onError={() => {
        console.error(`❌ UltraSimpleImage erro:`, src);
        onError?.();
      }}
      loading="eager"
      decoding="sync"
      style={{
        display: 'block',
        visibility: 'visible',
        opacity: 1
      }}
      {...props}
    />
  );
}

export default UltraSimpleImage;