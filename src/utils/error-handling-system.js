/**
 * 🛡️ Sistema Robusto de Tratamento de Erros
 * Sistema de error handling, recovery e analytics para aplicações web
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 */

class ErrorHandlingSystem {
    constructor() {
        this.errorQueue = [];
        this.recoveryAttempts = new Map();
        this.maxRecoveryAttempts = 3;
        this.isOnline = navigator.onLine;
        this.init();
    }

    /**
     * 🚀 Inicializar sistema de error handling
     */
    init() {
        // Capturar erros JavaScript globais
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: Date.now()
            });
        });

        // Capturar promessas rejeitadas
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || 'Promise rejection',
                reason: event.reason,
                timestamp: Date.now()
            });
        });

        // Monitorar status de conectividade
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));

        // Monitorar recursos que falharam ao carregar
        document.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.handleResourceError(event);
            }
        }, true);

        console.log('🛡️ Sistema de Error Handling inicializado');
    }

    /**
     * ❌ Tratar erro genérico
     */
    handleError(errorData) {
        try {
            // Adicionar informações contextuais
            const enrichedError = {
                ...errorData,
                id: this.generateErrorId(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: Date.now(),
                sessionId: this.getSessionId(),
                isOnline: this.isOnline
            };

            // Adicionar à fila de erros
            this.errorQueue.push(enrichedError);

            // Log detalhado para debug
            console.error('🚨 Erro capturado:', enrichedError);

            // Tentar recuperação automática
            this.attemptAutoRecovery(enrichedError);

            // Salvar para análise posterior
            this.saveErrorLocally(enrichedError);

            // Mostrar notificação user-friendly se necessário
            if (this.shouldShowUserNotification(enrichedError)) {
                this.showUserErrorNotification(enrichedError);
            }

        } catch (metaError) {
            console.error('❌ Erro no sistema de error handling:', metaError);
            this.fallbackErrorHandling(errorData);
        }
    }

    /**
     * 📡 Tratar erro de recurso (imagens, scripts, etc.)
     */
    handleResourceError(event) {
        const element = event.target;
        const errorData = {
            type: 'resource',
            resourceType: element.tagName.toLowerCase(),
            src: element.src || element.href,
            message: `Failed to load ${element.tagName.toLowerCase()}`,
            timestamp: Date.now()
        };

        // Tentativas específicas de recuperação por tipo de recurso
        switch (element.tagName.toLowerCase()) {
            case 'img':
                this.handleImageError(element, errorData);
                break;
            case 'script':
                this.handleScriptError(element, errorData);
                break;
            case 'link':
                this.handleStylesheetError(element, errorData);
                break;
            default:
                this.handleError(errorData);
        }
    }

    /**
     * 🖼️ Tratar erro de imagem com fallback inteligente
     */
    async handleImageError(imgElement, errorData) {
        const recoveryKey = `img_${imgElement.src}`;
        const attempts = this.getRecoveryAttempts(recoveryKey);

        if (attempts >= this.maxRecoveryAttempts) {
            this.setImageFallback(imgElement);
            this.handleError({ ...errorData, note: 'Max recovery attempts reached' });
            return;
        }

        // Tentar diferentes estratégias de recuperação
        const recoveryStrategies = [
            () => this.retryWithDelay(imgElement, 1000),
            () => this.tryAlternativeImageFormat(imgElement),
            () => this.tryImageCompression(imgElement),
            () => this.setImageFallback(imgElement)
        ];

        try {
            await recoveryStrategies[attempts]();
            this.incrementRecoveryAttempts(recoveryKey);
        } catch (recoveryError) {
            this.handleError({
                ...errorData,
                recoveryError: recoveryError.message,
                attempts: attempts + 1
            });
        }
    }

    /**
     * ⏱️ Retry com delay progressivo
     */
    async retryWithDelay(element, delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const originalSrc = element.src;
                element.src = '';
                element.onload = resolve;
                element.onerror = reject;
                element.src = originalSrc + `?retry=${Date.now()}`;
            }, delay);
        });
    }

    /**
     * 🔄 Tentar formato alternativo de imagem
     */
    async tryAlternativeImageFormat(imgElement) {
        const originalSrc = imgElement.src;
        const alternatives = [
            originalSrc.replace(/\.(jpg|jpeg)$/i, '.webp'),
            originalSrc.replace(/\.(jpg|jpeg)$/i, '.png'),
            originalSrc.replace(/\.webp$/i, '.jpg'),
            originalSrc.replace(/\.png$/i, '.jpg')
        ];

        for (const altSrc of alternatives) {
            if (altSrc !== originalSrc) {
                try {
                    await this.testImageUrl(altSrc);
                    imgElement.src = altSrc;
                    return;
                } catch {
                    continue;
                }
            }
        }

        throw new Error('No alternative format available');
    }

    /**
     * 🧪 Testar se URL de imagem é válida
     */
    testImageUrl(url) {
        return new Promise((resolve, reject) => {
            const testImg = new Image();
            testImg.onload = resolve;
            testImg.onerror = reject;
            testImg.src = url;
        });
    }

    /**
     * 🎨 Definir fallback de imagem
     */
    setImageFallback(imgElement) {
        // SVG placeholder gerado dinamicamente
        const fallbackSvg = `data:image/svg+xml;base64,${btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dy=".3em">
                    🖼️ Imagem não disponível
                </text>
                <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle" dy=".3em">
                    Conteúdo em modo offline
                </text>
            </svg>
        `)}`;

        imgElement.src = fallbackSvg;
        imgElement.style.filter = 'grayscale(1) opacity(0.7)';
        imgElement.title = 'Imagem não pôde ser carregada';
    }

    /**
     * 📜 Tratar erro de script
     */
    handleScriptError(scriptElement, errorData) {
        // Tentar recarregar script com cache-busting
        const newScript = document.createElement('script');
        newScript.src = scriptElement.src + `?fallback=${Date.now()}`;
        newScript.onerror = () => {
            this.handleError({ ...errorData, note: 'Script fallback failed' });
            this.enableGracefulDegradation();
        };
        
        document.head.appendChild(newScript);
    }

    /**
     * 🎨 Tratar erro de CSS
     */
    handleStylesheetError(linkElement, errorData) {
        // Aplicar estilos de fallback inline
        this.applyFallbackStyles();
        this.handleError({ ...errorData, note: 'CSS fallback applied' });
    }

    /**
     * 🎭 Aplicar estilos de fallback
     */
    applyFallbackStyles() {
        if (document.querySelector('#fallback-styles')) return;

        const fallbackCSS = `
            <style id="fallback-styles">
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
                button { 
                    background: #3b82f6; color: white; border: none; 
                    padding: 10px 20px; border-radius: 5px; cursor: pointer; 
                }
                button:hover { background: #2563eb; }
                .error-message { 
                    background: #fee2e2; color: #dc2626; 
                    padding: 15px; border-radius: 5px; margin: 10px 0; 
                }
                .success-message { 
                    background: #d1fae5; color: #059669; 
                    padding: 15px; border-radius: 5px; margin: 10px 0; 
                }
                img { max-width: 100%; height: auto; }
                @media (max-width: 768px) {
                    .container { padding: 10px; }
                    button { width: 100%; margin: 5px 0; }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', fallbackCSS);
    }

    /**
     * 🔄 Tentar recuperação automática
     */
    async attemptAutoRecovery(errorData) {
        const recoveryStrategies = {
            'network': this.recoverFromNetworkError,
            'javascript': this.recoverFromJSError,
            'promise': this.recoverFromPromiseError,
            'resource': this.recoverFromResourceError
        };

        const strategy = recoveryStrategies[errorData.type];
        if (strategy) {
            try {
                await strategy.call(this, errorData);
                console.log(`✅ Recuperação automática bem-sucedida para: ${errorData.type}`);
            } catch (recoveryError) {
                console.warn(`⚠️ Falha na recuperação automática: ${recoveryError.message}`);
            }
        }
    }

    /**
     * 🌐 Recuperar de erro de rede
     */
    async recoverFromNetworkError(errorData) {
        // Implementar retry com backoff exponencial
        const maxRetries = 3;
        let retryCount = 0;
        let delay = 1000;

        while (retryCount < maxRetries) {
            await this.wait(delay);
            
            try {
                // Testar conectividade
                await fetch('/', { method: 'HEAD', cache: 'no-cache' });
                this.showRecoveryNotification('Conexão restaurada!');
                return;
            } catch {
                retryCount++;
                delay *= 2; // Backoff exponencial
            }
        }

        // Ativar modo offline se todas as tentativas falharam
        this.enableOfflineMode();
    }

    /**
     * 📱 Ativar modo offline
     */
    enableOfflineMode() {
        document.body.classList.add('offline-mode');
        
        // Mostrar notificação de modo offline
        this.showPersistentNotification('📱 Modo offline ativado. Algumas funcionalidades podem estar limitadas.', 'warning');
        
        // Desabilitar funcionalidades online
        const onlineElements = document.querySelectorAll('[data-requires-online]');
        onlineElements.forEach(el => {
            el.disabled = true;
            el.title = 'Requer conexão com internet';
        });
    }

    /**
     * 🔧 Ativar degradação graciosa
     */
    enableGracefulDegradation() {
        // Simplificar interface para funcionar sem JS avançado
        document.body.classList.add('graceful-degradation');
        
        // Converter elementos interativos para versões simples
        this.convertToBasicElements();
    }

    /**
     * 📊 Monitorar status online/offline
     */
    handleOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        
        if (isOnline) {
            this.recoverFromOfflineMode();
            this.syncOfflineData();
        } else {
            this.enableOfflineMode();
        }
    }

    /**
     * ☁️ Recuperar do modo offline
     */
    recoverFromOfflineMode() {
        document.body.classList.remove('offline-mode');
        
        // Reabilitar funcionalidades online
        const onlineElements = document.querySelectorAll('[data-requires-online]');
        onlineElements.forEach(el => {
            el.disabled = false;
            el.title = '';
        });

        this.showRecoveryNotification('🌐 Conexão restaurada! Todas as funcionalidades disponíveis.');
        this.hidePersistentNotifications();
    }

    /**
     * 🗂️ Sincronizar dados offline
     */
    async syncOfflineData() {
        try {
            const offlineData = JSON.parse(localStorage.getItem('offlineErrorQueue') || '[]');
            
            if (offlineData.length > 0) {
                console.log(`📤 Sincronizando ${offlineData.length} erros offline...`);
                
                // Aqui você poderia enviar para um servidor se tivesse
                // Por enquanto, apenas limpar os dados offline
                localStorage.removeItem('offlineErrorQueue');
                
                this.showRecoveryNotification(`✅ ${offlineData.length} itens sincronizados com sucesso.`);
            }
        } catch (error) {
            console.warn('⚠️ Erro na sincronização:', error);
        }
    }

    /**
     * 💾 Salvar erro localmente
     */
    saveErrorLocally(errorData) {
        try {
            const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
            errorLog.push(errorData);
            
            // Manter apenas últimos 50 erros
            if (errorLog.length > 50) {
                errorLog.splice(0, errorLog.length - 50);
            }
            
            localStorage.setItem('errorLog', JSON.stringify(errorLog));
            
            // Se offline, adicionar à fila de sincronização
            if (!this.isOnline) {
                const offlineQueue = JSON.parse(localStorage.getItem('offlineErrorQueue') || '[]');
                offlineQueue.push(errorData);
                localStorage.setItem('offlineErrorQueue', JSON.stringify(offlineQueue));
            }
        } catch (storageError) {
            console.warn('⚠️ Erro ao salvar no localStorage:', storageError);
            this.useSessionStorage(errorData);
        }
    }

    /**
     * 🔄 Usar sessionStorage como fallback
     */
    useSessionStorage(errorData) {
        try {
            const sessionErrors = JSON.parse(sessionStorage.getItem('sessionErrors') || '[]');
            sessionErrors.push(errorData);
            sessionStorage.setItem('sessionErrors', JSON.stringify(sessionErrors));
        } catch {
            // Se nem sessionStorage funcionar, só fazer log no console
            console.error('💾 Erro crítico de armazenamento:', errorData);
        }
    }

    /**
     * 🚨 Mostrar notificação de erro para usuário
     */
    showUserErrorNotification(errorData) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="error-notification-content">
                <div class="error-icon">⚠️</div>
                <div class="error-message">
                    <strong>Ops! Algo deu errado</strong>
                    <p>Estamos trabalhando para resolver este problema.</p>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="dismiss-btn">
                        Dispensar
                    </button>
                </div>
            </div>
        `;
        
        this.styleErrorNotification(notification);
        document.body.appendChild(notification);
        
        // Auto-remover após 10 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * 🎨 Estilizar notificação de erro
     */
    styleErrorNotification(notification) {
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 15px;
            max-width: 400px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInFromRight 0.3s ease;
        `;
        
        // Adicionar estilos se não existem
        if (!document.querySelector('#error-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'error-notification-styles';
            style.textContent = `
                .error-notification-content {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }
                .error-icon {
                    font-size: 24px;
                    flex-shrink: 0;
                }
                .error-message {
                    flex: 1;
                    color: #991b1b;
                }
                .error-message strong {
                    display: block;
                    margin-bottom: 5px;
                }
                .error-message p {
                    margin: 0 0 10px 0;
                    font-size: 14px;
                }
                .dismiss-btn {
                    background: #dc2626;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                }
                .dismiss-btn:hover {
                    background: #b91c1c;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * ✅ Mostrar notificação de recuperação
     */
    showRecoveryNotification(message) {
        this.showTemporaryNotification(message, 'success');
    }

    /**
     * 📢 Mostrar notificação temporária
     */
    showTemporaryNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `temp-notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#d1fae5',
            error: '#fee2e2', 
            warning: '#fef3c7',
            info: '#dbeafe'
        };
        
        const textColors = {
            success: '#065f46',
            error: '#991b1b',
            warning: '#92400e', 
            info: '#1e40af'
        };
        
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: ${colors[type]};
            color: ${textColors[type]};
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            animation: slideInFromLeft 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutToLeft 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * 🔢 Utilitários
     */
    generateErrorId() {
        return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('sessionId', sessionId);
        }
        return sessionId;
    }

    getRecoveryAttempts(key) {
        return this.recoveryAttempts.get(key) || 0;
    }

    incrementRecoveryAttempts(key) {
        this.recoveryAttempts.set(key, this.getRecoveryAttempts(key) + 1);
    }

    shouldShowUserNotification(errorData) {
        // Mostrar apenas para erros críticos que afetam a experiência do usuário
        return ['resource', 'network', 'critical'].includes(errorData.type);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 📊 Obter relatório de erros
     */
    getErrorReport() {
        const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
        const sessionErrors = JSON.parse(sessionStorage.getItem('sessionErrors') || '[]');
        
        return {
            totalErrors: this.errorQueue.length,
            recentErrors: errorLog,
            sessionErrors: sessionErrors,
            recoveryAttempts: Object.fromEntries(this.recoveryAttempts),
            systemHealth: this.assessSystemHealth()
        };
    }

    /**
     * 🏥 Avaliar saúde do sistema
     */
    assessSystemHealth() {
        const recentErrors = this.errorQueue.filter(
            error => Date.now() - error.timestamp < 300000 // Últimos 5 minutos
        );

        const health = {
            status: 'healthy',
            score: 100,
            issues: []
        };

        if (recentErrors.length > 10) {
            health.status = 'critical';
            health.score -= 50;
            health.issues.push('High error rate detected');
        } else if (recentErrors.length > 5) {
            health.status = 'warning';
            health.score -= 25;
            health.issues.push('Elevated error rate');
        }

        if (!this.isOnline) {
            health.score -= 20;
            health.issues.push('Offline mode active');
        }

        return health;
    }
}

// 🚀 Inicializar sistema globalmente
window.ErrorHandling = new ErrorHandlingSystem();

// 🔧 Funções utilitárias globais
window.safeExecute = function(fn, fallback = () => {}) {
    try {
        return fn();
    } catch (error) {
        window.ErrorHandling.handleError({
            type: 'safe_execute',
            message: error.message,
            stack: error.stack,
            functionName: fn.name
        });
        return fallback();
    }
};

window.safeAsyncExecute = async function(fn, fallback = async () => {}) {
    try {
        return await fn();
    } catch (error) {
        window.ErrorHandling.handleError({
            type: 'safe_async_execute',
            message: error.message,
            stack: error.stack,
            functionName: fn.name
        });
        return await fallback();
    }
};

console.log('🛡️ Sistema de Error Handling Global carregado');