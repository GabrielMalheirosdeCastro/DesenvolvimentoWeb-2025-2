import React from 'react';
import { useImageSelection, SelectableImage } from '../../hooks/useImageSelection';

interface SpaceGalleryProps {
  images: SelectableImage[];
  allowMultipleSelection?: boolean;
  onSelectionChange?: (selectedIds: string[], selectedImages: SelectableImage[]) => void;
  className?: string;
}

export function SpaceGallery({ 
  images, 
  allowMultipleSelection = true,
  onSelectionChange,
  className = ""
}: SpaceGalleryProps) {
  const {
    selectedImages,
    toggleImage,
    clearSelection,
    isSelected,
    selectedCount,
    hasSelection
  } = useImageSelection(allowMultipleSelection);

  // Calcular dados das imagens selecionadas
  const selectedImageData = React.useMemo(() => {
    return images.filter(img => selectedImages.includes(img.id));
  }, [images, selectedImages]);

  // Notificar mudanças na seleção
  React.useEffect(() => {
    onSelectionChange?.(selectedImages, selectedImageData);
  }, [selectedImages, selectedImageData, onSelectionChange]);

  const handleImageClick = (imageId: string) => {
    toggleImage(imageId);
  };

  const handleSelectAll = () => {
    if (allowMultipleSelection) {
      if (selectedCount === images.length) {
        clearSelection();
      } else {
        images.forEach(image => {
          if (!isSelected(image.id)) {
            toggleImage(image.id);
          }
        });
      }
    }
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Controles de seleção */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-white border border-indigo-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          {allowMultipleSelection && (
            <button
              onClick={handleSelectAll}
              className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors border border-indigo-200"
            >
              {selectedCount === images.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
            </button>
          )}
          
          {hasSelection && (
            <button
              onClick={clearSelection}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              Limpar Seleção
            </button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {hasSelection ? (
            <span className="font-medium text-indigo-700">
              {selectedCount} de {images.length} {selectedCount === 1 ? 'nave selecionada' : 'naves selecionadas'}
            </span>
          ) : (
            <span>
              {images.length} {images.length === 1 ? 'nave disponível' : 'naves disponíveis'}
            </span>
          )}
        </div>
      </div>

      {/* Grid da galeria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className={`
              relative cursor-pointer transition-all duration-300 rounded-lg overflow-hidden
              bg-white shadow-md hover:shadow-lg border-2
              ${isSelected(image.id) 
                ? 'border-indigo-500 ring-2 ring-indigo-200' 
                : 'border-gray-200 hover:border-indigo-300'
              }
            `}
            onClick={() => handleImageClick(image.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleImageClick(image.id);
              }
            }}
            aria-pressed={isSelected(image.id)}
            aria-label={`${image.alt}${isSelected(image.id) ? ' - Selecionada' : ''}`}
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

              {/* Indicador de seleção */}
              {isSelected(image.id) && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
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
    </div>
  );
}

export default SpaceGallery;
