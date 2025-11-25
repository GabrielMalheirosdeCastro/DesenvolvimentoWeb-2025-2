/**
 * 🚀 SISTEMA DE OTIMIZAÇÃO DE CARREGAMENTO
 * Otimizador específico para melhorar velocidade e eficiência do portfólio
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 */

class LoadingOptimizer {
    constructor() {
        this.loadQueue = [];
        this.loadedResources = new Set();
        this.criticalResourcesLoaded = false;
        this.performanceObserver = null;
        this.init();
    }

    /**
     * 🚀 Inicialização do otimizador
     */
    init() {
        // Otimizar carregamento inicial
        this.optimizeInitialLoad();
        
        // Implementar carregamento inteligente baseado na conexão
        this.adaptToConnection();
        
        // Configurar intersect loading para elementos não críticos
        this.setupIntersectLoading();
        
        // Otimizar fontes
        this.optimizeFonts();
        
        // Configurar carregamento adaptivo de imagens
        this.setupAdaptiveImageLoading();
        
        console.log('🚀 Otimizador de Carregamento inicializado');
    }

    /**
     * ⚡ Otimizar carregamento inicial
     */
    optimizeInitialLoad() {
        // Priorizar recursos críticos acima da dobra
        const criticalImages = document.querySelectorAll('img[data-critical="true"]');
        const criticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-critical="true"]');
        
        // Carregar CSS crítico inline
        this.inlineCriticalCSS();
        
        // Preload de imagens críticas
        criticalImages.forEach(img => {
            this.preloadCriticalImage(img);
        });

        // Defer de scripts não críticos
        this.deferNonCriticalScripts();

        // Remover render-blocking resources
        this.removeRenderBlocking();
    }

    /**
     * 📡 Adaptar ao tipo de conexão
     */
    adaptToConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            console.log('🌐 Tipo de conexão detectado:', effectiveType);
            
            switch (effectiveType) {
                case 'slow-2g':
                case '2g':
                    this.enableDataSaverMode();
                    break;
                case '3g':
                    this.enableReducedQualityMode();
                    break;
                case '4g':
                default:
                    this.enableHighQualityMode();
                    break;
            }

            // Monitorar mudanças na conexão
            connection.addEventListener('change', () => {
                this.adaptToConnection();
            });
        } else {
            // Fallback para navegadores sem Network Information API
            this.detectConnectionSpeed();
        }
    }

    /**
     * 💾 Modo economia de dados
     */
    enableDataSaverMode() {
        console.log('💾 Modo economia de dados ativado');
        
        // Reduzir qualidade de imagens
        document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.dataset.optimized) {
                const optimizedSrc = this.getOptimizedImageUrl(img.src, 'low');
                img.src = optimizedSrc;
                img.dataset.optimized = 'low';
            }
        });

        // Desabilitar animações custosas
        this.disableExpensiveAnimations();
        
        // Carregar menos recursos secundários
        this.limitSecondaryResources();
    }

    /**
     * 🔄 Modo qualidade reduzida
     */
    enableReducedQualityMode() {
        console.log('🔄 Modo qualidade reduzida ativado');
        
        document.querySelectorAll('img').forEach(img => {
            if (img.src && !img.dataset.optimized) {
                const optimizedSrc = this.getOptimizedImageUrl(img.src, 'medium');
                img.src = optimizedSrc;
                img.dataset.optimized = 'medium';
            }
        });
    }

    /**
     * 🎯 Modo alta qualidade
     */
    enableHighQualityMode() {
        console.log('🎯 Modo alta qualidade ativado');
        
        // Preload de recursos adicionais
        this.preloadAdditionalResources();
        
        // Ativar todas as animações
        this.enableAllAnimations();
    }

    /**
     * 📸 URL otimizada para imagens
     */
    getOptimizedImageUrl(originalUrl, quality = 'medium') {
        // Simular diferentes qualidades de imagem
        const qualityParams = {
            low: '?w=400&q=30',
            medium: '?w=800&q=60',
            high: '?w=1200&q=90'
        };

        // Se a URL já tem parâmetros, concatenar
        const separator = originalUrl.includes('?') ? '&' : '';
        return originalUrl + separator + qualityParams[quality];
    }

    /**
     * 🎨 Carregar CSS crítico inline
     */
    inlineCriticalCSS() {
        const criticalStyles = `
            /* CSS crítico inline para First Paint mais rápido */
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 0;
                line-height: 1.6;
            }
            .loading-skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
            }
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            .critical-content {
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;

        const style = document.createElement('style');
        style.textContent = criticalStyles;
        document.head.insertBefore(style, document.head.firstChild);
    }

    /**
     * 🖼️ Preload de imagem crítica
     */
    preloadCriticalImage(img) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src || img.dataset.src;
        
        preloadLink.onload = () => {
            console.log('✅ Imagem crítica carregada:', preloadLink.href);
            this.loadedResources.add(preloadLink.href);
        };

        document.head.appendChild(preloadLink);
    }

    /**
     * 📜 Defer de scripts não críticos
     */
    deferNonCriticalScripts() {
        const nonCriticalScripts = document.querySelectorAll('script:not([data-critical="true"]):not([defer]):not([async])');
        
        nonCriticalScripts.forEach(script => {
            if (script.src && !script.hasAttribute('data-processed')) {
                script.defer = true;
                script.dataset.processed = 'true';
                console.log('⏳ Script não crítico deferido:', script.src);
            }
        });
    }

    /**
     * 🚫 Remover render-blocking
     */
    removeRenderBlocking() {
        // Identificar e otimizar CSS que bloqueia renderização
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical="true"])');
        
        stylesheets.forEach(link => {
            if (!link.hasAttribute('data-processed')) {
                // Carregar CSS de forma não bloqueante
                this.loadStylesheetAsync(link);
                link.dataset.processed = 'true';
            }
        });
    }

    /**
     * 🎨 Carregar CSS de forma assíncrona
     */
    loadStylesheetAsync(linkElement) {
        const href = linkElement.href;
        
        // Criar novo link com media="print" para evitar render blocking
        const asyncLink = document.createElement('link');
        asyncLink.rel = 'stylesheet';
        asyncLink.href = href;
        asyncLink.media = 'print';
        
        asyncLink.onload = () => {
            asyncLink.media = 'all';
            console.log('✅ CSS carregado assincronamente:', href);
        };

        // Substituir o link original
        linkElement.parentNode.insertBefore(asyncLink, linkElement.nextSibling);
        linkElement.remove();
    }

    /**
     * 👁️ Configurar carregamento por intersecção
     */
    setupIntersectLoading() {
        if (!('IntersectionObserver' in window)) {
            return;
        }

        const lazyLoader = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                    lazyLoader.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px' // Carregar 100px antes de entrar na viewport
        });

        // Observar elementos com lazy loading
        document.querySelectorAll('[data-lazy]').forEach(element => {
            lazyLoader.observe(element);
        });
    }

    /**
     * 📝 Carregar elemento específico
     */
    loadElement(element) {
        const elementType = element.tagName.toLowerCase();
        
        switch (elementType) {
            case 'img':
                this.loadLazyImage(element);
                break;
            case 'iframe':
                this.loadLazyIframe(element);
                break;
            case 'section':
            case 'div':
                this.loadLazySection(element);
                break;
        }
    }

    /**
     * 🖼️ Carregar imagem lazy
     */
    loadLazyImage(img) {
        if (img.dataset.src) {
            // Mostrar skeleton loader
            img.classList.add('loading-skeleton');
            
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = img.dataset.src;
                img.classList.remove('loading-skeleton');
                img.classList.add('loaded');
                console.log('🖼️ Imagem lazy carregada:', img.dataset.src);
            };
            
            tempImg.onerror = () => {
                img.classList.remove('loading-skeleton');
                img.classList.add('error');
                console.warn('❌ Erro ao carregar imagem:', img.dataset.src);
            };
            
            tempImg.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }

    /**
     * 🎬 Carregar iframe lazy
     */
    loadLazyIframe(iframe) {
        if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
            console.log('🎬 Iframe carregado:', iframe.src);
        }
    }

    /**
     * 📦 Carregar seção lazy
     */
    loadLazySection(section) {
        // Carregar conteúdo dinâmico da seção
        if (section.dataset.content) {
            section.innerHTML = section.dataset.content;
            section.removeAttribute('data-content');
            console.log('📦 Seção carregada:', section.id);
        }
    }

    /**
     * ✏️ Otimizar fontes
     */
    optimizeFonts() {
        // Font display swap para carregamento mais rápido
        const fontFaces = `
            @font-face {
                font-family: 'CustomFont';
                src: url('/fonts/custom.woff2') format('woff2'),
                     url('/fonts/custom.woff') format('woff');
                font-display: swap;
            }
        `;

        // Preload de fontes importantes
        const fontPreloads = [
            '/fonts/main.woff2',
            '/fonts/heading.woff2'
        ];

        fontPreloads.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'font';
            link.type = 'font/woff2';
            link.href = fontUrl;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Adicionar CSS de fontes
        const style = document.createElement('style');
        style.textContent = fontFaces;
        document.head.appendChild(style);
    }

    /**
     * 🔧 Configurar carregamento adaptivo
     */
    setupAdaptiveImageLoading() {
        // Detectar suporte para formatos modernos
        this.detectImageFormatSupport().then(supportedFormats => {
            console.log('🖼️ Formatos de imagem suportados:', supportedFormats);
            
            document.querySelectorAll('img[data-adaptive]').forEach(img => {
                const bestFormat = this.getBestImageFormat(img.dataset.adaptive, supportedFormats);
                if (bestFormat) {
                    img.src = bestFormat;
                }
            });
        });
    }

    /**
     * 🔍 Detectar suporte a formatos de imagem
     */
    async detectImageFormatSupport() {
        const formats = ['webp', 'avif', 'jpeg', 'png'];
        const support = {};

        for (const format of formats) {
            support[format] = await this.supportsImageFormat(format);
        }

        return support;
    }

    /**
     * ✅ Verificar suporte a formato específico
     */
    supportsImageFormat(format) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            
            const testImages = {
                webp: 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA',
                avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgS0AAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
                jpeg: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB8A',
                png: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
            };

            img.src = testImages[format] || testImages.jpeg;
        });
    }

    /**
     * 🎯 Obter melhor formato de imagem
     */
    getBestImageFormat(baseName, supportedFormats) {
        const formatPriority = ['avif', 'webp', 'jpeg', 'png'];
        
        for (const format of formatPriority) {
            if (supportedFormats[format]) {
                return `${baseName}.${format}`;
            }
        }
        
        return `${baseName}.jpg`; // Fallback
    }

    /**
     * ⚡ Detectar velocidade de conexão (fallback)
     */
    detectConnectionSpeed() {
        const startTime = Date.now();
        const testImage = new Image();
        
        testImage.onload = () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            if (duration < 500) {
                this.enableHighQualityMode();
            } else if (duration < 1000) {
                this.enableReducedQualityMode();
            } else {
                this.enableDataSaverMode();
            }
            
            console.log(`🌐 Velocidade de conexão estimada: ${duration}ms`);
        };

        // Imagem pequena para teste (1KB)
        testImage.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB8A';
    }

    /**
     * 🚫 Desabilitar animações custosas
     */
    disableExpensiveAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        style.id = 'reduced-motion';
        document.head.appendChild(style);
    }

    /**
     * ✨ Ativar todas as animações
     */
    enableAllAnimations() {
        const reducedMotionStyle = document.getElementById('reduced-motion');
        if (reducedMotionStyle) {
            reducedMotionStyle.remove();
        }
    }

    /**
     * 📦 Limitar recursos secundários
     */
    limitSecondaryResources() {
        // Remover recursos não essenciais
        document.querySelectorAll('[data-secondary="true"]').forEach(element => {
            element.style.display = 'none';
        });
    }

    /**
     * 🚀 Preload de recursos adicionais
     */
    preloadAdditionalResources() {
        const additionalResources = [
            { href: '/assets/secondary-images/', as: 'image' },
            { href: '/assets/optional-styles.css', as: 'style' }
        ];

        additionalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            document.head.appendChild(link);
        });
    }

    /**
     * 📊 Obter estatísticas de carregamento
     */
    getLoadingStats() {
        return {
            totalResources: this.loadQueue.length,
            loadedResources: this.loadedResources.size,
            criticalResourcesLoaded: this.criticalResourcesLoaded,
            loadingProgress: (this.loadedResources.size / this.loadQueue.length) * 100
        };
    }
}

// 🚀 Inicializar otimizador
window.LoadingOptimizer = new LoadingOptimizer();

console.log('🚀 Otimizador de Carregamento carregado com sucesso!');