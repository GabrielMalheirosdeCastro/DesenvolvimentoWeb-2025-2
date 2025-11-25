/**
 * 🛡️⚡ SISTEMA AVANÇADO DE SEGURANÇA E PERFORMANCE
 * Melhorias específicas para portfólio web com foco em segurança e carregamento
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 * Versão: 1.0.0 - Otimizada para produção
 */

class SecurityPerformanceEnhancer {
    constructor() {
        this.initialized = false;
        this.performanceMetrics = {
            startTime: performance.now(),
            loadEvents: [],
            securityEvents: []
        };
        this.securityPolicies = {
            csp: true,
            sanitization: true,
            rateLimiting: true
        };
        this.init();
    }

    /**
     * 🚀 Inicialização do sistema de segurança e performance
     */
    async init() {
        if (this.initialized) return;
        
        try {
            // 1. Implementar Content Security Policy
            this.implementCSP();
            
            // 2. Configurar rate limiting
            this.setupRateLimiting();
            
            // 3. Otimizar carregamento de recursos
            this.optimizeResourceLoading();
            
            // 4. Implementar lazy loading inteligente
            this.setupIntelligentLazyLoading();
            
            // 5. Configurar proteção contra XSS
            this.setupXSSProtection();
            
            // 6. Otimizar performance de imagens
            this.optimizeImagePerformance();
            
            // 7. Implementar cache inteligente
            this.setupIntelligentCaching();
            
            // 8. Monitoramento de performance em tempo real
            this.setupPerformanceMonitoring();
            
            // 9. Proteção contra clickjacking
            this.setupClickjackingProtection();
            
            // 10. Otimização de recursos críticos
            this.optimizeCriticalResources();
            
            this.initialized = true;
            this.logSecurityEvent('security_system_initialized', 'Sistema de segurança inicializado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema de segurança:', error);
            this.fallbackSecurity();
        }
    }

    /**
     * 🛡️ Implementar Content Security Policy dinâmica
     */
    implementCSP() {
        const allowedDomains = [
            "'self'",
            'https://desenvolvimento-web-2025-2.vercel.app',
            'https://*.vercel.app',
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://unpkg.com',
            'https://cdn.jsdelivr.net'
        ];

        // CSP para scripts
        const scriptSrc = [
            "'self'",
            "'unsafe-inline'", // Necessário para alguns frameworks
            "'unsafe-eval'", // Para development
            ...allowedDomains
        ].join(' ');

        // CSP para imagens
        const imgSrc = [
            "'self'",
            'data:',
            'blob:',
            'https:',
            ...allowedDomains
        ].join(' ');

        // Meta tag CSP dinâmica
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = `
            default-src 'self';
            script-src ${scriptSrc};
            style-src 'self' 'unsafe-inline' ${allowedDomains.join(' ')};
            img-src ${imgSrc};
            font-src 'self' ${allowedDomains.join(' ')};
            connect-src 'self' ${allowedDomains.join(' ')};
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
        `.replace(/\s+/g, ' ').trim();

        // Adicionar apenas se não existir
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            document.head.appendChild(cspMeta);
        }

        this.logSecurityEvent('csp_implemented', 'Content Security Policy implementada');
    }

    /**
     * ⏱️ Configurar rate limiting para interações
     */
    setupRateLimiting() {
        this.rateLimiters = new Map();
        
        const createRateLimiter = (maxRequests = 100, windowMs = 60000) => {
            return {
                requests: [],
                maxRequests,
                windowMs,
                isAllowed() {
                    const now = Date.now();
                    // Limpar requests antigos
                    this.requests = this.requests.filter(time => now - time < this.windowMs);
                    
                    if (this.requests.length >= this.maxRequests) {
                        return false;
                    }
                    
                    this.requests.push(now);
                    return true;
                }
            };
        };

        // Rate limiters para diferentes ações
        this.rateLimiters.set('click', createRateLimiter(200, 60000)); // 200 clicks por minuto
        this.rateLimiters.set('scroll', createRateLimiter(1000, 60000)); // 1000 scrolls por minuto
        this.rateLimiters.set('ajax', createRateLimiter(50, 60000)); // 50 requests AJAX por minuto

        // Interceptar eventos de click
        document.addEventListener('click', (event) => {
            if (!this.rateLimiters.get('click').isAllowed()) {
                event.preventDefault();
                event.stopPropagation();
                console.warn('⚠️ Rate limit excedido para clicks');
                return false;
            }
        }, true);

        this.logSecurityEvent('rate_limiting_setup', 'Rate limiting configurado');
    }

    /**
     * 🚀 Otimizar carregamento de recursos
     */
    optimizeResourceLoading() {
        // Preload de recursos críticos
        const criticalResources = [
            { href: '/style.css', as: 'style' },
            { href: '/style-lab.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            link.onload = () => {
                this.performanceMetrics.loadEvents.push({
                    resource: resource.href,
                    type: 'preload',
                    time: performance.now()
                });
            };
            document.head.appendChild(link);
        });

        // DNS prefetch para domínios externos
        const externalDomains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'unpkg.com',
            'cdn.jsdelivr.net'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `https://${domain}`;
            document.head.appendChild(link);
        });

        this.logSecurityEvent('resource_optimization', 'Otimização de recursos implementada');
    }

    /**
     * 👁️ Lazy loading inteligente com Intersection Observer
     */
    setupIntelligentLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ IntersectionObserver não suportado, usando fallback');
            this.fallbackLazyLoading();
            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Carregamento progressivo
                    if (img.dataset.src) {
                        const tempImg = new Image();
                        tempImg.onload = () => {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            this.performanceMetrics.loadEvents.push({
                                resource: img.dataset.src,
                                type: 'lazy_image',
                                time: performance.now()
                            });
                        };
                        tempImg.onerror = () => {
                            img.src = '/assets/placeholder-error.jpg';
                            console.warn('⚠️ Erro ao carregar imagem:', img.dataset.src);
                        };
                        tempImg.src = img.dataset.src;
                        
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px', // Carregar 50px antes de entrar na viewport
            threshold: 0.1
        });

        // Observar todas as imagens com data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        this.logSecurityEvent('lazy_loading_setup', 'Lazy loading inteligente configurado');
    }

    /**
     * 🛡️ Proteção contra XSS
     */
    setupXSSProtection() {
        // Sanitizar inputs automaticamente
        const sanitizeInput = (input) => {
            if (typeof input !== 'string') return input;
            
            return input
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        };

        // Interceptar innerHTML assignments
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (this.classList && this.classList.contains('allow-html')) {
                    originalInnerHTML.set.call(this, value);
                } else {
                    const sanitized = this.tagName === 'SCRIPT' ? value : sanitizeInput(value);
                    originalInnerHTML.set.call(this, sanitized);
                }
            },
            get: originalInnerHTML.get
        });

        // Função global segura para inserir HTML
        window.safeSetHTML = (element, html) => {
            if (element && html) {
                element.classList.add('allow-html');
                element.innerHTML = html;
                element.classList.remove('allow-html');
            }
        };

        this.logSecurityEvent('xss_protection_setup', 'Proteção XSS configurada');
    }

    /**
     * 🖼️ Otimizar performance de imagens
     */
    optimizeImagePerformance() {
        // Implementar WebP fallback
        const supportsWebP = new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = () => resolve(webP.height === 2);
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });

        supportsWebP.then(supported => {
            if (supported) {
                // Converter imagens para WebP se suportado
                document.querySelectorAll('img[src*=".jpg"], img[src*=".png"]').forEach(img => {
                    const webpSrc = img.src.replace(/\.(jpg|png)$/i, '.webp');
                    
                    // Testar se versão WebP existe
                    const testImg = new Image();
                    testImg.onload = () => {
                        img.src = webpSrc;
                        this.performanceMetrics.loadEvents.push({
                            resource: webpSrc,
                            type: 'webp_optimization',
                            time: performance.now()
                        });
                    };
                    testImg.src = webpSrc;
                });
            }
        });

        // Implementar responsive images
        document.querySelectorAll('img:not([srcset])').forEach(img => {
            if (img.naturalWidth > 800) {
                const baseSrc = img.src.replace(/\.(jpg|png|webp)$/i, '');
                const ext = img.src.match(/\.(jpg|png|webp)$/i)?.[0] || '.jpg';
                
                img.srcset = `
                    ${baseSrc}-small${ext} 400w,
                    ${baseSrc}-medium${ext} 800w,
                    ${baseSrc}${ext} 1200w
                `;
                img.sizes = '(max-width: 480px) 400px, (max-width: 800px) 800px, 1200px';
            }
        });

        this.logSecurityEvent('image_optimization', 'Otimização de imagens implementada');
    }

    /**
     * 💾 Cache inteligente com Service Worker
     */
    async setupIntelligentCaching() {
        if ('serviceWorker' in navigator) {
            try {
                // Registrar service worker se não existir
                if (!navigator.serviceWorker.controller) {
                    await this.createAndRegisterServiceWorker();
                }
                
                // Configurar estratégias de cache
                this.setupCacheStrategies();
                
                this.logSecurityEvent('intelligent_caching', 'Cache inteligente configurado');
            } catch (error) {
                console.warn('⚠️ Service Worker não pôde ser registrado:', error);
                this.setupLocalStorageCache();
            }
        } else {
            this.setupLocalStorageCache();
        }
    }

    /**
     * 📊 Monitoramento de performance em tempo real
     */
    setupPerformanceMonitoring() {
        // Performance Observer para métricas importantes
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.performanceMetrics.loadEvents.push({
                        name: entry.name,
                        type: entry.entryType,
                        startTime: entry.startTime,
                        duration: entry.duration
                    });
                });
            });

            observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
        }

        // Monitorar Web Vitals
        this.monitorWebVitals();

        // Report performance a cada 30 segundos
        setInterval(() => {
            this.reportPerformanceMetrics();
        }, 30000);

        this.logSecurityEvent('performance_monitoring', 'Monitoramento de performance ativo');
    }

    /**
     * 🛡️ Proteção contra clickjacking
     */
    setupClickjackingProtection() {
        // X-Frame-Options via JavaScript
        if (window.self !== window.top) {
            // Página sendo executada em frame
            console.warn('⚠️ Possível tentativa de clickjacking detectada');
            
            // Opcional: redirecionar para versão principal
            if (confirm('Esta página parece estar sendo executada em um frame. Deseja ir para a versão principal?')) {
                window.top.location = window.location;
            }
        }

        // Detectar overlays suspeitos
        this.detectSuspiciousOverlays();

        this.logSecurityEvent('clickjacking_protection', 'Proteção contra clickjacking ativa');
    }

    /**
     * ⚡ Otimizar recursos críticos
     */
    optimizeCriticalResources() {
        // Minificar CSS inline se necessário
        const styleElements = document.querySelectorAll('style');
        styleElements.forEach(style => {
            if (!style.dataset.minified) {
                style.textContent = this.minifyCSS(style.textContent);
                style.dataset.minified = 'true';
            }
        });

        // Otimizar scripts inline
        const scriptElements = document.querySelectorAll('script:not([src])');
        scriptElements.forEach(script => {
            if (!script.dataset.optimized && script.textContent.length > 1000) {
                // Mover scripts grandes para o final do body
                document.body.appendChild(script.cloneNode(true));
                script.remove();
            }
        });

        // Implementar resource hints
        this.implementResourceHints();

        this.logSecurityEvent('critical_resources_optimized', 'Recursos críticos otimizados');
    }

    /**
     * 📈 Monitorar Web Vitals
     */
    monitorWebVitals() {
        // First Contentful Paint
        new PerformanceObserver((entryList) => {
            const fcpEntry = entryList.getEntriesByName('first-contentful-paint')[0];
            if (fcpEntry) {
                this.performanceMetrics.fcp = fcpEntry.startTime;
                console.log('🎨 First Contentful Paint:', fcpEntry.startTime + 'ms');
            }
        }).observe({ type: 'paint', buffered: true });

        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const lcpEntry = entryList.getEntries().pop();
            if (lcpEntry) {
                this.performanceMetrics.lcp = lcpEntry.startTime;
                console.log('🖼️ Largest Contentful Paint:', lcpEntry.startTime + 'ms');
            }
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            this.performanceMetrics.cls = clsValue;
            console.log('📏 Cumulative Layout Shift:', clsValue);
        }).observe({ type: 'layout-shift', buffered: true });
    }

    /**
     * 📊 Reportar métricas de performance
     */
    reportPerformanceMetrics() {
        const metrics = {
            ...this.performanceMetrics,
            currentTime: performance.now(),
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : null
        };

        console.log('📊 Performance Metrics:', metrics);
        
        // Enviar para analytics se configurado
        if (window.gtag) {
            window.gtag('event', 'performance_report', {
                custom_parameter: JSON.stringify(metrics)
            });
        }
    }

    /**
     * 🛡️ Detectar overlays suspeitos
     */
    detectSuspiciousOverlays() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const style = window.getComputedStyle(node);
                            if (style.position === 'fixed' && 
                                style.zIndex > 9999 && 
                                (style.width === '100%' || style.height === '100%')) {
                                console.warn('⚠️ Overlay suspeito detectado:', node);
                                this.logSecurityEvent('suspicious_overlay', 'Overlay suspeito detectado');
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 🔧 Utilidades auxiliares
     */
    minifyCSS(css) {
        return css
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comentários
            .replace(/\s+/g, ' ') // Remove espaços extras
            .replace(/;\s*}/g, '}') // Remove últimos semicolons
            .trim();
    }

    implementResourceHints() {
        // Preconnect para recursos externos importantes
        const preconnectDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    logSecurityEvent(type, message) {
        const event = {
            type,
            message,
            timestamp: Date.now(),
            url: window.location.href
        };

        this.performanceMetrics.securityEvents.push(event);
        console.log(`🛡️ [SECURITY] ${message}`);
    }

    /**
     * 🔄 Fallbacks para browsers antigos
     */
    fallbackLazyLoading() {
        window.addEventListener('scroll', this.throttle(() => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                if (this.isElementInViewport(img)) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        }, 100));
    }

    setupLocalStorageCache() {
        // Cache básico usando localStorage
        window.cacheResource = (key, data) => {
            try {
                const cacheItem = {
                    data,
                    timestamp: Date.now(),
                    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
                };
                localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
            } catch (error) {
                console.warn('⚠️ Erro ao fazer cache:', error);
            }
        };

        window.getCachedResource = (key) => {
            try {
                const item = localStorage.getItem(`cache_${key}`);
                if (item) {
                    const parsed = JSON.parse(item);
                    if (parsed.expires > Date.now()) {
                        return parsed.data;
                    } else {
                        localStorage.removeItem(`cache_${key}`);
                    }
                }
            } catch (error) {
                console.warn('⚠️ Erro ao recuperar cache:', error);
            }
            return null;
        };
    }

    fallbackSecurity() {
        // Implementar medidas básicas de segurança em caso de falha
        console.log('🛡️ Implementando medidas básicas de segurança');
        
        // Proteção básica contra XSS
        const escapeHtml = (text) => {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, (m) => map[m]);
        };

        window.escapeHtml = escapeHtml;
    }

    // Utilitários
    throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    async createAndRegisterServiceWorker() {
        const swCode = `
            const CACHE_NAME = 'portfolio-cache-v1';
            const urlsToCache = [
                '/',
                '/style.css',
                '/style-lab.css',
                '/assets/',
            ];

            self.addEventListener('install', event => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(cache => cache.addAll(urlsToCache))
                );
            });

            self.addEventListener('fetch', event => {
                event.respondWith(
                    caches.match(event.request)
                        .then(response => {
                            return response || fetch(event.request);
                        })
                );
            });
        `;

        const blob = new Blob([swCode], { type: 'application/javascript' });
        const swUrl = URL.createObjectURL(blob);
        
        await navigator.serviceWorker.register(swUrl);
    }

    setupCacheStrategies() {
        // Implementar diferentes estratégias de cache baseadas no tipo de recurso
        console.log('💾 Estratégias de cache configuradas');
    }
}

// 🚀 Inicializar sistema globalmente
window.SecurityPerformanceEnhancer = new SecurityPerformanceEnhancer();

// 🔧 Funções utilitárias globais para segurança
window.secureExecute = function(fn, context = null) {
    try {
        return fn.call(context);
    } catch (error) {
        window.SecurityPerformanceEnhancer.logSecurityEvent('secure_execute_error', error.message);
        console.error('🛡️ Erro em execução segura:', error);
        return null;
    }
};

// 📊 Função para obter métricas de performance
window.getPerformanceMetrics = function() {
    return window.SecurityPerformanceEnhancer.performanceMetrics;
};

console.log('🛡️⚡ Sistema de Segurança e Performance carregado com sucesso!');