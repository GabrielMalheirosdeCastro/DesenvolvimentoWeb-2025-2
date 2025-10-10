import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Info } from 'lucide-react';
import { cn } from './utils';
import { SelectableImage } from '../../hooks/useImageSelection';

interface ImageFullscreenViewerProps {
  images: SelectableImage[];
  currentImageId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onImageChange?: (imageId: string) => void;
}

export const ImageFullscreenViewer: React.FC<ImageFullscreenViewerProps> = ({
  images,
  currentImageId,
  isOpen,
  onClose,
  onImageChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Encontrar índice da imagem atual
  useEffect(() => {
    if (currentImageId) {
      const index = images.findIndex(img => img.id === currentImageId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [currentImageId, images]);

  // Navegação por teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'i':
        case 'I':
          setShowInfo(!showInfo);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, showInfo]);

  // Prevenir scroll do body quando modal está aberto (REMOVIDO - permite scroll)
  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'unset';
  //   }

  //   return () => {
  //     document.body.style.overflow = 'unset';
  //   };
  // }, [isOpen]);

  const currentImage = images[currentIndex];

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setIsLoading(true);
    onImageChange?.(images[nextIndex].id);
  }, [currentIndex, images, onImageChange]);

  const goToPrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setIsLoading(true);
    onImageChange?.(images[prevIndex].id);
  }, [currentIndex, images, onImageChange]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleDownload = () => {
    if (currentImage && currentImage.title) {
      const link = document.createElement('a');
      link.href = currentImage.src;
      link.download = `${currentImage.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-md pointer-events-none">
      {/* Container principal que permite pointer events apenas nos controles */}
      <div className="relative w-full h-full pointer-events-auto">{/* Controles do topo */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{currentImage.title}</h2>
            <span className="text-sm opacity-75">
              {currentIndex + 1} de {images.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors pointer-events-auto"
              title="Informações (I)"
            >
              <Info size={20} />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 rounded-full hover:bg-white/20 transition-colors pointer-events-auto"
              title="Download"
            >
              <Download size={20} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors pointer-events-auto"
              title="Fechar (ESC)"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Navegação lateral esquerda */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        title="Anterior (←)"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Navegação lateral direita */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        title="Próxima (→)"
      >
        <ChevronRight size={24} />
      </button>

      {/* Container da imagem */}
      <div className="flex items-center justify-center w-full h-full p-8 pt-20 pb-16">
        <div className="relative max-w-full max-h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className={cn(
              "max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Navegação lateral esquerda */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors pointer-events-auto"
        title="Anterior (←)"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Navegação lateral direita */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors pointer-events-auto"
        title="Próxima (→)"
      >
        <ChevronRight size={24} />
      </button>

      {/* Container da imagem */}
      <div className="flex items-center justify-center w-full h-full p-8 pt-20 pb-16 pointer-events-auto">
        <div className="relative max-w-full max-h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className={cn(
              "max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Painel de informações */}
      {showInfo && (
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-gradient-to-t from-black/90 to-transparent text-white pointer-events-auto">
          <div className="max-w-2xl">
            <h3 className="text-xl font-semibold mb-2">{currentImage.title}</h3>
            <p className="text-sm opacity-90 mb-3">{currentImage.description}</p>
            
            {currentImage.category && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {currentImage.category === 'Combate' && '⚔️'} 
                  {currentImage.category === 'Caças Estelares' && '🚀'}
                  {currentImage.category === 'Frotas Militares' && '🛸'}
                  {currentImage.category === 'Comunicações' && '📡'}
                  {' '}{currentImage.category}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Indicadores de navegação */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 pointer-events-auto">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsLoading(true);
              onImageChange?.(images[index].id);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-white" : "bg-white/40"
            )}
          />
        ))}
      </div>

      {/* Overlay para fechar ao clicar fora - REMOVIDO para permitir scroll */}
      {/* <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      /> */}
    </div>
    </div>
  );
};

export default ImageFullscreenViewer;