/**
 * 🛡️ SISTEMA DE SEGURANÇA E PERFORMANCE
 * Melhorias de segurança e performance para o portfólio
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 */

class SecurityPerformanceEnhancer {
    constructor() {
        this.securityFeatures = {
            antiTampering: true,
            contentProtection: true,
            performanceMonitoring: true,
            errorHandling: true
        };
        
        this.performanceMetrics = {
            loadStartTime: Date.now(),
            firstPaint: null,
            firstContentfulPaint: null,
            largestContentfulPaint: null
        };

        this.init();
    }

    /**
     * 🚀 Inicialização do sistema
     */
    init() {
        console.log('🛡️ Inicializando Sistema de Segurança e Performance...');
        
        // Configurar monitoramento de performance
        this.setupPerformanceMonitoring();
        
        // Implementar proteções básicas
        this.implementBasicProtections();
        
        // Configurar tratamento de erros
        this.setupErrorHandling();
        
        // Otimizar console para produção
        this.optimizeConsole();
        
        // Configurar CSP básico
        this.setupContentSecurityPolicy();
        
        console.log('✅ Sistema de Segurança e Performance inicializado');
    }

    /**
     * 📊 Configurar monitoramento de performance
     */
    setupPerformanceMonitoring() {
        // Performance Observer para Core Web Vitals
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint (LCP)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
                console.log('📊 LCP:', lastEntry.startTime + 'ms');
            });

            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('⚠️ LCP observer não suportado');
            }

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('📊 FID:', entry.processingStart - entry.startTime + 'ms');
                });
            });

            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('⚠️ FID observer não suportado');
            }

            // Cumulative Layout Shift (CLS)
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                const entries = list.getEntries();
                
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });

                if (clsValue > 0) {
                    console.log('📊 CLS:', clsValue);
                }
            });

            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('⚠️ CLS observer não suportado');
            }
        }

        // Navigation timing
        window.addEventListener('load', () => {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const loadComplete = timing.loadEventEnd - timing.navigationStart;
                const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                
                console.log('📊 Performance Metrics:');
                console.log('  - DOM Ready:', domReady + 'ms');
                console.log('  - Load Complete:', loadComplete + 'ms');
                console.log('  - First Byte:', timing.responseStart - timing.requestStart + 'ms');
            }
        });
    }

    /**
     * 🛡️ Implementar proteções básicas
     */
    implementBasicProtections() {
        // Proteção contra console tampering (básica)
        this.protectConsole();
        
        // Proteção contra inspect element (detecção básica)
        this.detectDevTools();
        
        // Proteção contra cópia de texto (opcional)
        this.setupContentProtection();
        
        // Proteção contra iframes maliciosos
        this.preventClickjacking();
    }

    /**
     * 🖥️ Proteger console
     */
    protectConsole() {
        // Salvaguardar console original
        const originalConsole = { ...window.console };
        
        // Detectar ambiente de produção
        const isProduction = !import.meta.env.DEV;
        
        if (isProduction) {
            // Em produção, limitar console
            Object.keys(window.console).forEach(method => {
                if (typeof window.console[method] === 'function' && method !== 'error') {
                    window.console[method] = () => {};
                }
            });
        }

        // Manter referência ao console original
        window._originalConsole = originalConsole;
    }

    /**
     * 🔍 Detectar DevTools
     */
    detectDevTools() {
        let devtools = { open: false, orientation: null };
        
        const threshold = 160;
        
        const detectDevTools = () => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.warn('🔍 DevTools detectado - Modo desenvolvimento');
                }
            } else {
                devtools.open = false;
            }
        };

        // Verificar periodicamente apenas em produção
        if (!import.meta.env.DEV) {
            setInterval(detectDevTools, 1000);
        }
    }

    /**
     * 📄 Configurar proteção de conteúdo
     */
    setupContentProtection() {
        // Desabilitar menu de contexto apenas em produção
        if (!import.meta.env.DEV) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });

            // Desabilitar algumas teclas de atalho
            document.addEventListener('keydown', (e) => {
                // F12, Ctrl+Shift+I, Ctrl+U, etc.
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    return false;
                }
            });
        }

        // Proteção contra seleção excessiva
        document.addEventListener('selectstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        // Proteção contra drag and drop de imagens
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
    }

    /**
     * 🖼️ Prevenir clickjacking
     */
    preventClickjacking() {
        // Verificar se está sendo executado em iframe
        if (window.self !== window.top) {
            console.warn('⚠️ Página carregada em iframe detectado');
            
            // Em produção, prevenir iframe loading
            if (!import.meta.env.DEV) {
                document.body.style.display = 'none';
                throw new Error('Frame loading not allowed');
            }
        }
    }

    /**
     * 🚨 Configurar tratamento de erros
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('🚨 JavaScript Error:', {
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error
            });

            // Em produção, enviar apenas erros críticos
            if (!import.meta.env.DEV && event.error) {
                this.logCriticalError(event.error);
            }
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled Promise Rejection:', event.reason);
            
            if (!import.meta.env.DEV) {
                this.logCriticalError(event.reason);
            }
            
            // Prevenir que o erro apareça no console do usuário
            event.preventDefault();
        });

        // Resource loading errors
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                console.warn('📁 Resource loading error:', event.target.src || event.target.href);
            }
        }, true);
    }

    /**
     * 📝 Log de erro crítico
     */
    logCriticalError(error) {
        const errorData = {
            message: error.message || 'Unknown error',
            stack: error.stack || 'No stack trace',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        console.error('🚨 Critical Error Logged:', errorData);
    }

    /**
     * 🖥️ Otimizar console para produção
     */
    optimizeConsole() {
        if (!import.meta.env.DEV) {
            // Substituir console.log por uma versão otimizada
            const originalLog = console.log;
            console.log = (...args) => {
                // Em produção, apenas logar erros importantes
                if (args.some(arg => String(arg).includes('🚨') || String(arg).includes('❌'))) {
                    originalLog.apply(console, args);
                }
            };
        }
    }

    /**
     * 🔒 Configurar Content Security Policy básico
     */
    setupContentSecurityPolicy() {
        // Adicionar meta tag CSP básica se não existir
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            const metaCSP = document.createElement('meta');
            metaCSP.httpEquiv = 'Content-Security-Policy';
            metaCSP.content = `
                default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
                script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net;
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                font-src 'self' https://fonts.gstatic.com;
                img-src 'self' data: blob: https:;
                connect-src 'self' https:;
            `.replace(/\s+/g, ' ').trim();
            
            document.head.appendChild(metaCSP);
        }
    }

    /**
     * 📊 Obter métricas de performance
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            currentTime: Date.now(),
            totalLoadTime: Date.now() - this.performanceMetrics.loadStartTime
        };
    }

    /**
     * 🔧 Obter status do sistema
     */
    getSystemStatus() {
        return {
            securityFeatures: this.securityFeatures,
            performanceMetrics: this.getPerformanceMetrics(),
            isDevelopment: import.meta.env.DEV,
            timestamp: new Date().toISOString()
        };
    }
}

// 🚀 Inicializar sistema
window.SecurityPerformanceEnhancer = new SecurityPerformanceEnhancer();

console.log('🛡️ Sistema de Segurança e Performance carregado com sucesso!');