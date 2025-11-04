import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, Star, Zap, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import ImageFullscreenViewer from '../ui/image-fullscreen-viewer';
import { SpaceshipGalleryDebugger } from '../../utils/spaceship-debug';

// 🚀 DEBUG: Interface para debug detalhado
interface DebugInfo {
  componentId: string;
  timestamp: string;
  action: string;
  details: any;
}

// 🛸 Interface para imagens de naves espaciais
interface SpaceshipImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  category: 'Star Wars' | 'Halo' | 'Sci-Fi';
  franchise: string;
  specifications?: {
    length?: string;
    crew?: string;
    armament?: string;
    role?: string;
  };
  loadStatus: 'loading' | 'loaded' | 'error';
}

interface SpaceshipGalleryProps {
  className?: string;
  enableDebug?: boolean;
  onImageLoad?: (imageId: string) => void;
  onImageError?: (imageId: string, error: string) => void;
}

export const SpaceshipGallery: React.FC<SpaceshipGalleryProps> = ({
  className = "",
  enableDebug = true,
  onImageLoad,
  onImageError
}) => {
  // 🔍 Estados para debugging
  const [debugLogs, setDebugLogs] = useState<DebugInfo[]>([]);
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  const [componentHealth, setComponentHealth] = useState<'healthy' | 'warning' | 'error'>('healthy');

  // 🖼️ Estados da galeria
  const [images, setImages] = useState<SpaceshipImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 🚀 Função de debug centralizada
  const addDebugLog = useCallback((action: string, details: any) => {
    if (!enableDebug) return;
    
    const logEntry: DebugInfo = {
      componentId: 'SpaceshipGallery',
      timestamp: new Date().toISOString(),
      action,
      details
    };
    
    setDebugLogs(prev => [...prev.slice(-50), logEntry]); // Manter apenas os últimos 50 logs
    console.log('🚀 SpaceshipGallery Debug:', logEntry);
  }, [enableDebug]);

  // 🛸 Dados das naves espaciais
  const initializeImages = useCallback(() => {
    addDebugLog('INIT_IMAGES', { message: 'Inicializando dados das naves espaciais' });
    
    const spaceshipData: SpaceshipImage[] = [
      {
        id: 'venator-upgraded',
        src: '/assets/naves-espaciais/Star wars Venator upgraded.jpg',
        alt: 'Star Wars Venator Class Star Destroyer Upgraded',
        title: 'Venator Classe Star Destroyer (Melhorado)',
        description: 'Uma versão aprimorada do icônico Venator-class Star Destroyer da República Galáctica, com sistemas de armas e defesas melhorados.',
        category: 'Star Wars',
        franchise: 'Star Wars: Clone Wars',
        specifications: {
          length: '1,137 metros',
          crew: '7,400 soldados clone',
          armament: 'Turbolasers duplos pesados, canhões laser',
          role: 'Destruidor estelar / Porta-caças'
        },
        loadStatus: 'loading'
      },
      {
        id: 'venator-standard',
        src: '/assets/naves-espaciais/Star wars venator.jpg',
        alt: 'Star Wars Venator Class Star Destroyer',
        title: 'Venator Classe Star Destroyer',
        description: 'O backbone da frota da República durante as Guerras Clone, projetado para transportar e lançar caças estelares em combate.',
        category: 'Star Wars',
        franchise: 'Star Wars: Clone Wars',
        specifications: {
          length: '1,137 metros',
          crew: '7,400 soldados clone',
          armament: 'Turbolasers, canhões de íons',
          role: 'Porta-caças / Comando de frota'
        },
        loadStatus: 'loading'
      },
      {
        id: 'acclamator-assault',
        src: '/assets/naves-espaciais/starwars acclamator 2.jpg',
        alt: 'Star Wars Acclamator Class Assault Ship',
        title: 'Acclamator Classe Assault Ship',
        description: 'Nave de assalto e transporte de tropas da República, projetada para operações planetárias e desembarques em massa.',
        category: 'Star Wars',
        franchise: 'Star Wars: Clone Wars',
        specifications: {
          length: '752 metros',
          crew: '700 soldados clone + 16,000 tropas',
          armament: 'Turbolasers quádruplos, canhões laser',
          role: 'Transporte de assalto'
        },
        loadStatus: 'loading'
      },
      {
        id: 'unsc-frigate',
        src: '/assets/naves-espaciais/unsc frigate.jpg',
        alt: 'UNSC Frigate from Halo',
        title: 'UNSC Frigate',
        description: 'Nave de guerra da Força Espacial das Nações Unidas (UNSC) do universo Halo, essencial na guerra contra o Covenant.',
        category: 'Halo',
        franchise: 'Halo Universe',
        specifications: {
          length: '478 metros',
          crew: '250-300 tripulantes',
          armament: 'MAC Gun, mísseis Archer, CIWS',
          role: 'Escolta / Patrulha espacial'
        },
        loadStatus: 'loading'
      }
    ];

    setImages(spaceshipData);
    addDebugLog('IMAGES_INITIALIZED', { count: spaceshipData.length, images: spaceshipData.map(img => img.title) });
  }, [addDebugLog]);

  // 🔄 Função para atualizar status de carregamento
  const updateImageLoadStatus = useCallback((imageId: string, status: SpaceshipImage['loadStatus'], error?: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, loadStatus: status } : img
    ));

    const action = status === 'loaded' ? 'IMAGE_LOADED' : status === 'error' ? 'IMAGE_ERROR' : 'IMAGE_LOADING';
    addDebugLog(action, { imageId, status, error });

    // Atualizar progresso de carregamento
    setImages(currentImages => {
      const loadedCount = currentImages.filter(img => img.loadStatus === 'loaded').length;
      const totalCount = currentImages.length;
      const progress = Math.round((loadedCount / totalCount) * 100);
      setLoadingProgress(progress);
      
      addDebugLog('LOADING_PROGRESS', { loaded: loadedCount, total: totalCount, progress });
      
      return currentImages;
    });

    // Callbacks externos
    if (status === 'loaded' && onImageLoad) {
      onImageLoad(imageId);
    } else if (status === 'error' && onImageError) {
      onImageError(imageId, error || 'Erro desconhecido');
    }
  }, [addDebugLog, onImageLoad, onImageError]);

  // 🖼️ Manipulador de clique na imagem
  const handleImageClick = useCallback((imageId: string) => {
    addDebugLog('IMAGE_CLICKED', { imageId });
    setSelectedImage(imageId);
    setIsFullscreenOpen(true);
  }, [addDebugLog]);

  // 🔒 Fechar visualizador fullscreen
  const handleFullscreenClose = useCallback(() => {
    addDebugLog('FULLSCREEN_CLOSED', { previousImage: selectedImage });
    setIsFullscreenOpen(false);
    setSelectedImage(null);
  }, [addDebugLog, selectedImage]);

  // 🔄 Mudança de imagem no fullscreen
  const handleFullscreenImageChange = useCallback((imageId: string) => {
    addDebugLog('FULLSCREEN_IMAGE_CHANGED', { from: selectedImage, to: imageId });
    setSelectedImage(imageId);
  }, [addDebugLog, selectedImage]);

  // ⚡ Efeito de inicialização
  useEffect(() => {
    addDebugLog('COMPONENT_MOUNTED', { timestamp: new Date().toISOString() });
    SpaceshipGalleryDebugger.logComponentMount();
    initializeImages();
    
    return () => {
      addDebugLog('COMPONENT_UNMOUNTED', { timestamp: new Date().toISOString() });
      SpaceshipGalleryDebugger.logComponentUnmount();
    };
  }, [addDebugLog, initializeImages]);

  // 🎯 Efeito para monitorar saúde do componente
  useEffect(() => {
    const errorImages = images.filter(img => img.loadStatus === 'error').length;
    const loadedImages = images.filter(img => img.loadStatus === 'loaded').length;
    const totalImages = images.length;

    if (errorImages > totalImages / 2) {
      setComponentHealth('error');
      SpaceshipGalleryDebugger.logGalleryHealth('error', { errorImages, totalImages });
    } else if (errorImages > 0) {
      setComponentHealth('warning');
      SpaceshipGalleryDebugger.logGalleryHealth('warning', { errorImages, loadedImages, totalImages });
    } else if (loadedImages === totalImages && totalImages > 0) {
      setComponentHealth('healthy');
      SpaceshipGalleryDebugger.logGalleryHealth('healthy', { loadedImages, totalImages });
    }
    
    // Log das estatísticas sempre que houver mudança
    SpaceshipGalleryDebugger.logGalleryStats(totalImages, loadedImages, errorImages);
  }, [images]);

  // 🎨 Componente de cartão da nave
  const SpaceshipCard: React.FC<{ image: SpaceshipImage }> = ({ image }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

    // Log de tentativa de carregamento
    useEffect(() => {
      SpaceshipGalleryDebugger.logImageLoadAttempt(image.src);
    }, [image.src]);

    const handleImageLoad = () => {
      const loadTime = performance.now();
      setIsImageLoaded(true);
      setImageError(null);
      updateImageLoadStatus(image.id, 'loaded');
      SpaceshipGalleryDebugger.logImageLoadSuccess(image.src, loadTime);
    };

    const handleImageError = () => {
      const errorMsg = `Falha ao carregar: ${image.src}`;
      setImageError(errorMsg);
      updateImageLoadStatus(image.id, 'error', errorMsg);
      SpaceshipGalleryDebugger.logImageLoadError(image.src, errorMsg);
    };

    return (
      <div 
        className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-gray-200 hover:border-blue-400"
        onClick={() => handleImageClick(image.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleImageClick(image.id);
          }
        }}
        aria-label={`Ver detalhes de ${image.title}`}
      >
        {/* Status indicator */}
        <div className="absolute top-3 right-3 z-10">
          {image.loadStatus === 'loading' && (
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin bg-white"></div>
          )}
          {image.loadStatus === 'loaded' && (
            <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
          )}
          {image.loadStatus === 'error' && (
            <AlertCircle className="w-6 h-6 text-red-500 bg-white rounded-full" />
          )}
        </div>

        {/* Badge da categoria */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
            image.category === 'Star Wars' 
              ? 'bg-yellow-500 text-black' 
              : image.category === 'Halo'
              ? 'bg-blue-600 text-white'
              : 'bg-purple-600 text-white'
          }`}>
            {image.category === 'Star Wars' && <Star className="w-3 h-3 mr-1" />}
            {image.category === 'Halo' && <Shield className="w-3 h-3 mr-1" />}
            {image.category === 'Sci-Fi' && <Zap className="w-3 h-3 mr-1" />}
            {image.category}
          </span>
        </div>

        {/* Container da imagem */}
        <div className="relative aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-black">
          {!imageError ? (
            <img
              src={image.src}
              alt={image.alt}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-105`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
                <p className="text-sm">Erro ao carregar imagem</p>
              </div>
            </div>
          )}

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Informações da nave */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {image.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {image.description}
          </p>
          
          {/* Especificações */}
          {image.specifications && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Comprimento:</span>
                <span className="font-medium">{image.specifications.length}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Tripulação:</span>
                <span className="font-medium">{image.specifications.crew}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Função:</span>
                <span className="font-medium">{image.specifications.role}</span>
              </div>
            </div>
          )}

          {/* Franchise */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              {image.franchise}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`w-full space-y-6 ${className}`}
      data-component="spaceship-gallery"
      data-health={componentHealth}
    >
      {/* Debug Panel */}
      {enableDebug && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Spaceship Gallery Debug</h3>
              <div className={`w-3 h-3 rounded-full ${
                componentHealth === 'healthy' ? 'bg-green-500' : 
                componentHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
            <button
              onClick={() => setIsDebugVisible(!isDebugVisible)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isDebugVisible ? 'Ocultar Logs' : 'Mostrar Logs'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Imagens:</span>
              <span className="ml-2 font-bold">{images.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Carregadas:</span>
              <span className="ml-2 font-bold text-green-600">
                {images.filter(img => img.loadStatus === 'loaded').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Erros:</span>
              <span className="ml-2 font-bold text-red-600">
                {images.filter(img => img.loadStatus === 'error').length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Progresso:</span>
              <span className="ml-2 font-bold">{loadingProgress}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>

          {/* Debug logs */}
          {isDebugVisible && (
            <div className="mt-4 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded border text-xs font-mono">
              {debugLogs.slice(-10).map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">{log.timestamp.split('T')[1].split('.')[0]}</span>
                  <span className="ml-2 font-bold text-blue-600">{log.action}</span>
                  <span className="ml-2 text-gray-700">{JSON.stringify(log.details)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Header da galeria */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <Rocket className="w-8 h-8 mr-3 text-blue-600" />
          Galeria de Naves Espaciais
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Uma coleção épica de naves espaciais dos universos Star Wars e Halo. 
          Clique em qualquer nave para visualizar em tela cheia com especificações detalhadas.
        </p>
      </div>

      {/* Grid das naves */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <SpaceshipCard key={image.id} image={image} />
        ))}
      </div>

      {/* Loading indicator global */}
      {loadingProgress < 100 && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Carregando naves... {loadingProgress}%</span>
          </div>
        </div>
      )}

      {/* Fullscreen viewer */}
      <ImageFullscreenViewer
        images={images.map(img => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          title: img.title,
          description: img.description,
          category: img.category
        }))}
        currentImageId={selectedImage}
        isOpen={isFullscreenOpen}
        onClose={handleFullscreenClose}
        onImageChange={handleFullscreenImageChange}
      />
    </div>
  );
};

export default SpaceshipGallery;