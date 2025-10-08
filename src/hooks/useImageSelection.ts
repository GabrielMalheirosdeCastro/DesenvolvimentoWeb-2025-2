import { useState, useCallback } from 'react';

export interface SelectableImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category?: string;
}

export function useImageSelection(allowMultiple: boolean = false) {
  // Corrigindo o tipo do useState
  const [selectedImages, setSelectedImages] = useState([]);

  const toggleImage = useCallback((imageId: string) => {
    setSelectedImages((prev: string[]): string[] => {
      if (allowMultiple) {
        return prev.includes(imageId) 
          ? prev.filter((id: string) => id !== imageId)
          : [...prev, imageId];
      } else {
        return prev.includes(imageId) ? [] : [imageId];
      }
    });
  }, [allowMultiple]);

  const clearSelection = useCallback(() => {
    setSelectedImages([]);
  }, []);

  const isSelected = useCallback((imageId: string) => {
    return selectedImages.includes(imageId);
  }, [selectedImages]);

  return {
    selectedImages,
    toggleImage,
    clearSelection,
    isSelected,
    selectedCount: selectedImages.length,
    hasSelection: selectedImages.length > 0
  };
}
