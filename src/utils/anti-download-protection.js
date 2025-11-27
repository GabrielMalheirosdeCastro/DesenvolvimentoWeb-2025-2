/**
 * 🚫 SISTEMA DE PROTEÇÃO ANTI-DOWNLOAD
 * Proteção específica contra downloads e extração de conteúdo do portfólio
 * Utiliza ReferenceError e RangeError para máxima proteção
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 * Versão: 2.0.0 - Anti-Download Específico
 */

class AntiDownloadProtection {
    constructor() {
        this.protectedContent = new Set();
        this.downloadAttempts = new Map();
        this.maxDownloadAttempts = 3;
        this.isActive = false;
        this.init();
    }

    /**
     * 🚀 Inicializar proteção anti-download
     */
    init() {
        if (this.isActive) return;

        try {
            // 1. Proteger recursos de imagem
            this.protectImageResources();
            
            // 2. Bloquear right-click save
            this.blockRightClickSave();
            
            // 3. Proteger contra drag & drop
            this.blockDragAndDrop();
            
            // 4. Interceptar tentativas de download via JavaScript
            this.interceptJavaScriptDownloads();
            
            // 5. Proteger conteúdo de texto
            this.protectTextContent();
            
            // 6. Bloquear print e save page
            this.blockPrintAndSave();
            
            // 7. Proteger contra copy/paste
            this.blockCopyPaste();
            
            // 8. Monitorar tentativas de acesso a recursos
            this.monitorResourceAccess();
            
            // 9. Implementar watermarking invisível
            this.implementInvisibleWatermarking();
            
            // 10. Proteger metadados
            this.protectMetadata();

            this.isActive = true;
            console.log('🛡️ Proteção Anti-Download ativada com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar proteção anti-download:', error);
            this.activateFailsafe();
        }
    }

    /**
     * 🖼️ Proteger recursos de imagem
     */
    protectImageResources() {
        // Interceptar carregamento de imagens
        const originalImage = window.Image;
        window.Image = class extends originalImage {
            constructor() {
                super();
                
                // Interceptar tentativas de conversão
                const originalToDataURL = this.toDataURL;
                if (originalToDataURL) {
                    this.toDataURL = function() {
                        throw new ReferenceError('Image export is not available in protected mode');
                    };
                }

                // Proteger contra blob URL creation
                Object.defineProperty(this, 'src', {
                    set: function(value) {
                        if (value.startsWith('blob:') || value.startsWith('data:')) {
                            if (!this.isAllowedBlobAccess()) {
                                throw new ReferenceError('Blob URL access denied for security');
                            }
                        }
                        Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set.call(this, value);
                    },
                    get: function() {
                        return Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').get.call(this);
                    }
                });
            }

            isAllowedBlobAccess() {
                // Verificar se acesso é legítimo (por exemplo, para componentes internos)
                const stack = new Error().stack;
                const allowedSources = [
                    'SpaceGallery',
                    'ImageWithFallback',
                    'FigmaImageSafe'
                ];
                
                return allowedSources.some(source => stack.includes(source));
            }
        };

        // Proteger imagens já carregadas
        this.protectExistingImages();
    }

    /**
     * 🖼️ Proteger imagens existentes
     */
    protectExistingImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Adicionar proteção contra drag
            img.addEventListener('dragstart', (e) => {
                e.preventDefault();
                this.logDownloadAttempt('image_drag', img.src);
                throw new ReferenceError('Image dragging is disabled for content protection');
            });

            // Proteger contra context menu
            img.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.logDownloadAttempt('image_context_menu', img.src);
                return false;
            });

            // Adicionar atributo de proteção
            img.setAttribute('draggable', 'false');
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
            img.style.mozUserSelect = 'none';
            img.style.msUserSelect = 'none';
        });
    }

    /**
     * 🖱️ Bloquear right-click save
     */
    blockRightClickSave() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.logDownloadAttempt('right_click', e.target.tagName);
            
            // Mostrar mensagem personalizada
            this.showProtectionWarning('Right-click desabilitado para proteger o conteúdo');
            return false;
        }, true);

        // Bloquear teclas de atalho para save
        document.addEventListener('keydown', (e) => {
            // Ctrl+S (Save)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.logDownloadAttempt('ctrl_s', 'save_page');
                throw new ReferenceError('Page saving is disabled in protected mode');
            }

            // Ctrl+Shift+S (Save As)
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.logDownloadAttempt('ctrl_shift_s', 'save_as');
                throw new ReferenceError('Page saving is disabled in protected mode');
            }

            // F11 (Fullscreen - pode ser usado para bypass)
            if (e.key === 'F11') {
                e.preventDefault();
                this.logDownloadAttempt('f11', 'fullscreen');
                return false;
            }
        });
    }

    /**
     * 🎯 Bloquear drag and drop
     */
    blockDragAndDrop() {
        const preventDrag = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.logDownloadAttempt('drag_attempt', e.target.tagName);
            throw new ReferenceError('Drag and drop is disabled for content protection');
        };

        // Eventos de drag
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(eventType => {
            document.addEventListener(eventType, preventDrag, true);
        });

        // Adicionar CSS para garantir
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-drag: none !important;
                -khtml-user-drag: none !important;
                -moz-user-drag: none !important;
                -o-user-drag: none !important;
                user-drag: none !important;
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
            }
            
            img, video, audio, canvas {
                pointer-events: none !important;
                -webkit-touch-callout: none !important;
                -webkit-user-select: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 📥 Interceptar downloads via JavaScript
     */
    interceptJavaScriptDownloads() {
        // Interceptar createElement para links de download
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName.toLowerCase() === 'a') {
                // Interceptar setAttribute para download
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name.toLowerCase() === 'download') {
                        window.antiDownloadProtection.logDownloadAttempt('js_download_attribute', value);
                        throw new ReferenceError('Download attribute is not allowed in protected mode');
                    }
                    
                    if (name.toLowerCase() === 'href' && value.startsWith('blob:')) {
                        window.antiDownloadProtection.logDownloadAttempt('js_blob_href', value);
                        throw new ReferenceError('Blob URLs are restricted for download protection');
                    }
                    
                    return originalSetAttribute.call(this, name, value);
                };

                // Interceptar click para downloads
                element.addEventListener('click', (e) => {
                    if (element.hasAttribute('download') || 
                        element.href.startsWith('blob:') ||
                        element.href.startsWith('data:')) {
                        
                        e.preventDefault();
                        e.stopPropagation();
                        window.antiDownloadProtection.logDownloadAttempt('click_download_link', element.href);
                        throw new ReferenceError('Download links are disabled for protection');
                    }
                });
            }
            
            return element;
        };

        // Interceptar URL.createObjectURL
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function(object) {
            // Verificar se é para download legítimo
            if (!window.antiDownloadProtection.isLegitimateURLCreation()) {
                window.antiDownloadProtection.logDownloadAttempt('create_object_url', object.type);
                throw new ReferenceError('Object URL creation blocked for download protection');
            }
            
            return originalCreateObjectURL.call(this, object);
        };

        // Interceptar Blob constructor
        const OriginalBlob = window.Blob;
        window.Blob = function(...args) {
            const blob = new OriginalBlob(...args);
            
            // Verificar se blob é para download
            if (window.antiDownloadProtection.isBlobForDownload(blob)) {
                window.antiDownloadProtection.logDownloadAttempt('blob_creation', blob.type);
                throw new ReferenceError('Blob creation blocked for download protection');
            }
            
            return blob;
        };
    }

    /**
     * 📝 Proteger conteúdo de texto
     */
    protectTextContent() {
        // Bloquear seleção de texto
        document.addEventListener('selectstart', (e) => {
            if (!this.isAllowedTextSelection(e.target)) {
                e.preventDefault();
                this.logDownloadAttempt('text_selection', e.target.tagName);
                return false;
            }
        });

        // Bloquear copy/paste
        document.addEventListener('copy', (e) => {
            if (!this.isAllowedCopy(e.target)) {
                e.preventDefault();
                e.clipboardData.setData('text/plain', '');
                this.logDownloadAttempt('text_copy', 'clipboard');
                throw new ReferenceError('Text copying is disabled for content protection');
            }
        });

        document.addEventListener('cut', (e) => {
            e.preventDefault();
            this.logDownloadAttempt('text_cut', 'clipboard');
            throw new ReferenceError('Text cutting is disabled for content protection');
        });
    }

    /**
     * 🖨️ Bloquear print e save page
     */
    blockPrintAndSave() {
        // Interceptar window.print
        const originalPrint = window.print;
        window.print = function() {
            this.logDownloadAttempt('window_print', 'page');
            throw new ReferenceError('Printing is disabled for content protection');
        }.bind(this);

        // Interceptar Ctrl+P
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                e.stopPropagation();
                this.logDownloadAttempt('ctrl_p', 'print');
                throw new ReferenceError('Print shortcut is disabled for content protection');
            }
        });

        // Bloquear media print CSS
        const printStyle = document.createElement('style');
        printStyle.setAttribute('media', 'print');
        printStyle.textContent = `
            * {
                display: none !important;
            }
            
            body::after {
                content: "Impressão não permitida - Conteúdo protegido";
                display: block !important;
                text-align: center;
                font-size: 24px;
                margin-top: 50px;
            }
        `;
        document.head.appendChild(printStyle);
    }

    /**
     * 📋 Bloquear copy/paste avançado
     */
    blockCopyPaste() {
        // Limpar clipboard ao tentar copiar
        document.addEventListener('copy', (e) => {
            setTimeout(() => {
                navigator.clipboard.writeText('').catch(() => {});
            }, 100);
        });

        // Interceptar keyboard shortcuts
        const blockKeys = ['c', 'v', 'x', 'a']; // copy, paste, cut, select all
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && blockKeys.includes(e.key.toLowerCase())) {
                if (!this.isAllowedKeyboardShortcut(e.target, e.key)) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.logDownloadAttempt(`ctrl_${e.key}`, e.target.tagName);
                    return false;
                }
            }
        });
    }

    /**
     * 👁️ Monitorar acesso a recursos
     */
    monitorResourceAccess() {
        // Interceptar fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(resource, options = {}) {
            if (this.isSuspiciousResourceRequest(resource, options)) {
                this.logDownloadAttempt('fetch_request', resource.toString());
                throw new ReferenceError('Resource access denied for protection');
            }
            
            return originalFetch.call(this, resource, options);
        }.bind(this);

        // Interceptar XMLHttpRequest
        const OriginalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new OriginalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function(method, url, ...args) {
                if (this.isSuspiciousXHRRequest(method, url)) {
                    this.logDownloadAttempt('xhr_request', url);
                    throw new ReferenceError('XHR request denied for protection');
                }
                
                return originalOpen.call(this, method, url, ...args);
            }.bind(this);
            
            return xhr;
        }.bind(this);
    }

    /**
     * 🔍 Implementar watermarking invisível
     */
    implementInvisibleWatermarking() {
        // Adicionar watermarks invisíveis em imagens via Canvas
        const canvases = document.querySelectorAll('canvas');
        
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const originalDrawImage = ctx.drawImage;
                ctx.drawImage = function(...args) {
                    // Desenhar imagem normalmente
                    const result = originalDrawImage.apply(this, args);
                    
                    // Adicionar watermark invisível
                    this.addInvisibleWatermark(this);
                    
                    return result;
                }.bind(this);
            }
        });
    }

    /**
     * 🏷️ Adicionar watermark invisível
     */
    addInvisibleWatermark(ctx) {
        const watermarkData = {
            owner: 'Gabriel Malheiros - FAESA 2025-2',
            timestamp: Date.now(),
            domain: window.location.hostname
        };

        // Codificar em pixels invisíveis
        const encoded = btoa(JSON.stringify(watermarkData));
        
        ctx.save();
        ctx.globalAlpha = 0.001; // Quase invisível
        ctx.fillStyle = '#ffffff';
        ctx.font = '1px Arial';
        ctx.fillText(encoded, 0, 1);
        ctx.restore();
    }

    /**
     * 🔒 Proteger metadados
     */
    protectMetadata() {
        // Remover/modificar metadados sensíveis
        const sensitiveSelectors = [
            'meta[name="author"]',
            'meta[name="description"]',
            'meta[property="og:image"]',
            'link[rel="canonical"]'
        ];

        sensitiveSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Obfuscar conteúdo
                if (element.content) {
                    element.content = this.obfuscateMetadata(element.content);
                }
                if (element.href) {
                    element.href = this.obfuscateMetadata(element.href);
                }
            });
        });
    }

    /**
     * 🎭 Obfuscar metadados
     */
    obfuscateMetadata(text) {
        // Substituir caracteres por unicode similares
        const obfuscationMap = {
            'a': 'а', 'e': 'е', 'o': 'о', 'p': 'р',
            'c': 'с', 'x': 'х', 'y': 'у', 'B': 'В',
            'A': 'А', 'E': 'Е', 'K': 'К', 'M': 'М',
            'H': 'Н', 'O': 'О', 'P': 'Р', 'C': 'С',
            'T': 'Т', 'X': 'Х', 'Y': 'У'
        };

        return text.split('').map(char => obfuscationMap[char] || char).join('');
    }

    /**
     * 🚨 Log tentativa de download
     */
    logDownloadAttempt(type, details) {
        const attempt = {
            type,
            details,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer
        };

        // Incrementar contador
        const currentCount = this.downloadAttempts.get(type) || 0;
        this.downloadAttempts.set(type, currentCount + 1);

        console.warn('🚫 TENTATIVA DE DOWNLOAD BLOQUEADA:', attempt);

        // Se muitas tentativas, ativar modo severo
        if (currentCount >= this.maxDownloadAttempts) {
            this.activateSevereMode();
        }

        // Salvar log local
        this.saveDownloadLog(attempt);
    }

    /**
     * 🆘 Ativar modo severo
     */
    activateSevereMode() {
        console.error('🆘 MODO SEVERO ATIVADO - Muitas tentativas de download');

        // Adicionar overlay de bloqueio
        const overlay = document.createElement('div');
        overlay.id = 'security-overlay';
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(255, 0, 0, 0.9);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-family: Arial, sans-serif;
                z-index: 999999;
                backdrop-filter: blur(10px);
            ">
                <h1>🚫 ACESSO BLOQUEADO</h1>
                <p>Múltiplas tentativas de download detectadas</p>
                <p>Este conteúdo é protegido por direitos autorais</p>
                <p>© Gabriel Malheiros de Castro - FAESA 2025-2</p>
                <button onclick="location.reload()" style="
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: white;
                    color: red;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">Recarregar Página</button>
            </div>
        `;

        document.body.appendChild(overlay);

        // Bloquear interações
        document.addEventListener('click', (e) => e.preventDefault(), true);
        document.addEventListener('keydown', (e) => e.preventDefault(), true);
    }

    /**
     * ✅ Verificar se criação de URL é legítima
     */
    isLegitimateURLCreation() {
        const stack = new Error().stack;
        const legitimateSources = [
            'SpaceGallery', 'ImageWithFallback', 'FigmaImageSafe',
            'SpaceshipGallery', 'UltraSimpleImage'
        ];
        
        return legitimateSources.some(source => stack.includes(source));
    }

    /**
     * 🔍 Verificar se blob é para download
     */
    isBlobForDownload(blob) {
        const suspiciousTypes = [
            'application/pdf',
            'application/zip',
            'image/',
            'text/html',
            'application/json'
        ];

        return suspiciousTypes.some(type => blob.type.startsWith(type));
    }

    /**
     * ✅ Verificar se seleção de texto é permitida
     */
    isAllowedTextSelection(element) {
        // Permitir seleção apenas em inputs e textareas específicos
        const allowedTags = ['input', 'textarea'];
        const allowedClasses = ['selectable', 'editable'];
        
        return allowedTags.includes(element.tagName.toLowerCase()) ||
               allowedClasses.some(cls => element.classList.contains(cls));
    }

    /**
     * ✅ Verificar se copy é permitido
     */
    isAllowedCopy(element) {
        // Mesmo critério da seleção
        return this.isAllowedTextSelection(element);
    }

    /**
     * ✅ Verificar se atalho de teclado é permitido
     */
    isAllowedKeyboardShortcut(element, key) {
        // Permitir em campos de input específicos
        if (element.tagName.toLowerCase() === 'input' || 
            element.tagName.toLowerCase() === 'textarea') {
            
            // Verificar se é campo protegido
            return !element.classList.contains('protected');
        }
        
        return false;
    }

    /**
     * 🔍 Verificar se request de recurso é suspeito
     */
    isSuspiciousResourceRequest(resource, options) {
        const url = resource.toString();
        const suspiciousPatterns = [
            /\.zip$/i,
            /\.pdf$/i,
            /download/i,
            /export/i,
            /backup/i
        ];

        return suspiciousPatterns.some(pattern => pattern.test(url));
    }

    /**
     * 🔍 Verificar se request XHR é suspeito
     */
    isSuspiciousXHRRequest(method, url) {
        return this.isSuspiciousResourceRequest(url, {});
    }

    /**
     * ⚠️ Mostrar aviso de proteção
     */
    showProtectionWarning(message) {
        // Criar toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 999998;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = `🛡️ ${message}`;

        // Adicionar animação CSS
        if (!document.getElementById('protection-styles')) {
            const style = document.createElement('style');
            style.id = 'protection-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);

        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * 💾 Salvar log de download
     */
    saveDownloadLog(attempt) {
        try {
            const logs = JSON.parse(localStorage.getItem('download_protection_log') || '[]');
            logs.push(attempt);
            
            // Manter apenas últimos 50 logs
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('download_protection_log', JSON.stringify(logs));
        } catch (e) {
            // Falha silenciosa
        }
    }

    /**
     * 🚨 Ativar failsafe
     */
    activateFailsafe() {
        // Modo de emergência básico
        document.addEventListener('contextmenu', (e) => e.preventDefault(), true);
        document.addEventListener('dragstart', (e) => e.preventDefault(), true);
        document.addEventListener('selectstart', (e) => e.preventDefault(), true);
        
        console.log('🚨 Failsafe de proteção anti-download ativado');
    }

    /**
     * 📊 Obter estatísticas de proteção
     */
    getProtectionStats() {
        return {
            isActive: this.isActive,
            protectedContentCount: this.protectedContent.size,
            downloadAttempts: Object.fromEntries(this.downloadAttempts),
            totalAttempts: Array.from(this.downloadAttempts.values()).reduce((a, b) => a + b, 0)
        };
    }
}

// 🚀 Auto-inicialização
if (typeof window !== 'undefined') {
    window.antiDownloadProtection = new AntiDownloadProtection();
    
    // Proteger a instância
    Object.freeze(window.antiDownloadProtection);
    
    console.log('🚫 Sistema de Proteção Anti-Download inicializado!');
}

export default AntiDownloadProtection;