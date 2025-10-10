import React from 'react';
import { SelectableImage } from '../../hooks/useImageSelection';
import ImageFullscreenViewer from '../ui/image-fullscreen-viewer';

interface SpaceGalleryProps {
  images: SelectableImage[];
  className?: string;
}

export function SpaceGallery({ 
  images, 
  className = ""
}: SpaceGalleryProps) {
  // Estados para visualizador em tela inteira
  const [fullscreenImage, setFullscreenImage] = React.useState<string | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);

  const handleImageClick = (imageId: string) => {
    // Sempre abrir em tela inteira para visualização direta das imagens do Figma
    // Seleção múltipla removida para simplificar experiência do usuário
    setFullscreenImage(imageId);
    setIsFullscreenOpen(true);
  };

  const handleFullscreenClose = () => {
    setIsFullscreenOpen(false);
    setFullscreenImage(null);
  };

  const handleFullscreenImageChange = (imageId: string) => {
    setFullscreenImage(imageId);
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Info da galeria simplificada */}
      <div className="flex items-center justify-center p-4 bg-white border border-indigo-200 rounded-lg shadow-sm">
        <div className="text-center">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-indigo-700">
              {images.length} {images.length === 1 ? 'imagem do Figma' : 'imagens do Figma'}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            💡 Clique em qualquer imagem para visualização em tela inteira
          </div>
        </div>
      </div>

      {/* Grid da galeria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="
              relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden
              bg-white shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-indigo-300
            "
            onClick={() => handleImageClick(image.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleImageClick(image.id);
              }
            }}
            aria-label={image.alt}
          >
            {/* Container da imagem */}
            <div className="relative aspect-video bg-gradient-to-br from-indigo-900 to-purple-900">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                draggable={false}
                loading="lazy"
              />

              {/* Badge da categoria */}
              {image.category && (
                <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                  {image.category === 'Combate' && '⚔️'} 
                  {image.category === 'Caças Estelares' && '🚀'}
                  {image.category === 'Frotas Militares' && '🛸'}
                  {image.category === 'Comunicações' && '📡'}
                  {' '}{image.category}
                </div>
              )}

              {/* Overlay hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300" />
            </div>

            {/* Informações */}
            <div className="p-4">
              <h3 className="font-medium text-gray-800 mb-1">{image.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visualizador em tela inteira */}
      <ImageFullscreenViewer
        images={images}
        currentImageId={fullscreenImage}
        isOpen={isFullscreenOpen}
        onClose={handleFullscreenClose}
        onImageChange={handleFullscreenImageChange}
      />
    </div>
  );
}

export default SpaceGallery;
