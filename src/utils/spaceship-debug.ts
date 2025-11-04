// 🚀 DEBUG: Utilitário para debug detalhado da galeria de naves espaciais
export const SpaceshipGalleryDebugger = {
  logImageLoadAttempt: (imageSrc: string) => {
    console.log(`🔄 [SPACESHIP DEBUG] Tentando carregar imagem: ${imageSrc}`);
  },
  
  logImageLoadSuccess: (imageSrc: string, loadTime: number) => {
    console.log(`✅ [SPACESHIP DEBUG] Imagem carregada com sucesso: ${imageSrc} (${loadTime}ms)`);
  },
  
  logImageLoadError: (imageSrc: string, error: string) => {
    console.error(`❌ [SPACESHIP DEBUG] Erro ao carregar imagem: ${imageSrc}`, error);
  },
  
  logComponentMount: () => {
    console.log(`🚀 [SPACESHIP DEBUG] SpaceshipGallery montado em ${new Date().toISOString()}`);
  },
  
  logComponentUnmount: () => {
    console.log(`🛸 [SPACESHIP DEBUG] SpaceshipGallery desmontado em ${new Date().toISOString()}`);
  },
  
  logGalleryStats: (totalImages: number, loadedImages: number, errorImages: number) => {
    console.log(`📊 [SPACESHIP DEBUG] Status da galeria:`, {
      total: totalImages,
      carregadas: loadedImages,
      erros: errorImages,
      progresso: `${Math.round((loadedImages / totalImages) * 100)}%`
    });
  },
  
  logNavigationClick: (imageId: string, navigationType: string) => {
    console.log(`🔍 [SPACESHIP DEBUG] Navegação: ${navigationType} - Imagem: ${imageId}`);
  },
  
  logFullscreenAction: (action: string, imageId: string) => {
    console.log(`🖼️ [SPACESHIP DEBUG] Fullscreen ${action}: ${imageId}`);
  },
  
  validateImagePaths: () => {
    const expectedImages = [
      '/assets/naves-espaciais/Star wars Venator upgraded.jpg',
      '/assets/naves-espaciais/Star wars venator.jpg',
      '/assets/naves-espaciais/starwars acclamator 2.jpg',
      '/assets/naves-espaciais/unsc frigate.jpg'
    ];
    
    console.log(`📁 [SPACESHIP DEBUG] Validando caminhos das imagens:`, expectedImages);
    
    return expectedImages.map(path => ({
      path,
      exists: document.querySelector(`img[src="${path}"]`) !== null
    }));
  },
  
  measurePerformance: (label: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`⚡ [SPACESHIP DEBUG] Performance ${label}: ${(end - start).toFixed(2)}ms`);
  },
  
  logGalleryHealth: (health: 'healthy' | 'warning' | 'error', details: any) => {
    const emoji = health === 'healthy' ? '💚' : health === 'warning' ? '⚠️' : '💥';
    console.log(`${emoji} [SPACESHIP DEBUG] Health Status: ${health}`, details);
  }
};

// 🔬 Função para debug global da galeria
export const debugSpaceshipGallery = () => {
  console.group('🚀 SPACESHIP GALLERY DEBUG REPORT');
  
  // Verificar se o componente está montado
  const galleryElement = document.querySelector('[data-component="spaceship-gallery"]');
  console.log('📍 Galeria montada:', !!galleryElement);
  
  // Verificar imagens carregadas
  const images = document.querySelectorAll('img[src*="naves-espaciais"]');
  console.log(`🖼️ Imagens encontradas: ${images.length}`);
  
  images.forEach((img, index) => {
    const imgElement = img as HTMLImageElement;
    console.log(`📸 Imagem ${index + 1}:`, {
      src: imgElement.src,
      complete: imgElement.complete,
      naturalWidth: imgElement.naturalWidth,
      naturalHeight: imgElement.naturalHeight,
      width: imgElement.width,
      height: imgElement.height
    });
  });
  
  // Verificar debug logs
  console.log('📝 Debug logs ativos:', window.localStorage.getItem('spaceship-debug') === 'true');
  
  console.groupEnd();
};

// 🎯 Ativar debug global
if (typeof window !== 'undefined') {
  (window as any).debugSpaceshipGallery = debugSpaceshipGallery;
  (window as any).SpaceshipGalleryDebugger = SpaceshipGalleryDebugger;
}