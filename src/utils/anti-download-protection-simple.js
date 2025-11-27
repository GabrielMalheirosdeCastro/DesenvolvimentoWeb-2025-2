/**
 * 🚫 SISTEMA DE PROTEÇÃO ANTI-DOWNLOAD - VERSÃO SIMPLIFICADA
 * Proteção específica contra downloads e extração de conteúdo do portfólio
 * Versão sem problemas de binding
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 * Versão: 2.1.0 - Simplificada e Estável
 */

class AntiDownloadProtection {
    constructor() {
        this.protectedContent = new Set();
        this.downloadAttempts = new Map();
        this.maxDownloadAttempts = 3;
        this.isActive = false;
        this.init();
    }

    init() {
        if (this.isActive) return;

        try {
            this.protectImages();
            this.blockRightClick();
            this.blockDragAndDrop();
            this.interceptDownloads();
            this.protectTextContent();
            this.blockPrintAndSave();
            this.blockCopyPaste();

            this.isActive = true;
            console.log('🛡️ Proteção Anti-Download ativada!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar proteção anti-download:', error);
            this.activateFailsafe();
        }
    }

    protectImages() {
        const processImages = () => {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                img.setAttribute('draggable', 'false');
                img.style.webkitUserDrag = 'none';
                img.style.webkitUserSelect = 'none';
                img.style.mozUserSelect = 'none';
                img.style.userSelect = 'none';

                img.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.logDownloadAttempt('image_context_menu', img.src);
                    this.showProtectionWarning('Context menu bloqueado em imagens');
                    return false;
                });

                img.addEventListener('dragstart', (e) => {
                    e.preventDefault();
                    this.logDownloadAttempt('image_drag_start', img.src);
                    return false;
                });
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processImages);
        } else {
            processImages();
        }

        const observer = new MutationObserver(() => {
            processImages();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    blockRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.logDownloadAttempt('right_click', e.target.tagName);
            this.showProtectionWarning('Right-click desabilitado para proteger o conteúdo');
            return false;
        }, true);

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.logDownloadAttempt('ctrl_s', 'save_page');
                throw new ReferenceError('Page saving is disabled in protected mode');
            }

            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.logDownloadAttempt('ctrl_shift_s', 'save_as');
                throw new ReferenceError('Page saving is disabled in protected mode');
            }

            if (e.key === 'F11') {
                e.preventDefault();
                this.logDownloadAttempt('f11', 'fullscreen');
                return false;
            }
        });
    }

    blockDragAndDrop() {
        const preventDrag = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.logDownloadAttempt('drag_attempt', e.target.tagName);
            throw new ReferenceError('Drag and drop is disabled for content protection');
        };

        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(eventType => {
            document.addEventListener(eventType, preventDrag, true);
        });

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

    interceptDownloads() {
        // Interceptar criação de elementos de download
        const originalCreateElement = document.createElement;
        const self = this;
        
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName.toLowerCase() === 'a') {
                const originalSetAttribute = element.setAttribute;
                
                element.setAttribute = function(name, value) {
                    if (name.toLowerCase() === 'download') {
                        self.logDownloadAttempt('js_download_attribute', value);
                        throw new ReferenceError('Download attribute is not allowed in protected mode');
                    }
                    
                    if (name.toLowerCase() === 'href' && value.startsWith('blob:')) {
                        self.logDownloadAttempt('js_blob_href', value);
                        throw new ReferenceError('Blob URLs are restricted for download protection');
                    }
                    
                    return originalSetAttribute.call(this, name, value);
                };

                element.addEventListener('click', (e) => {
                    if (element.hasAttribute('download') || 
                        element.href.startsWith('blob:') ||
                        element.href.startsWith('data:')) {
                        
                        e.preventDefault();
                        e.stopPropagation();
                        self.logDownloadAttempt('click_download_link', element.href);
                        throw new ReferenceError('Download links are disabled for protection');
                    }
                });
            }
            
            return element;
        };

        // Interceptar URL.createObjectURL
        const originalCreateObjectURL = URL.createObjectURL;
        
        URL.createObjectURL = function(object) {
            self.logDownloadAttempt('create_object_url', object.type);
            throw new ReferenceError('Object URL creation blocked for download protection');
        };

        // Interceptar Blob constructor
        const OriginalBlob = window.Blob;
        
        window.Blob = function(...args) {
            const blob = new OriginalBlob(...args);
            
            if (blob.size > 1024 * 1024) { // 1MB
                self.logDownloadAttempt('large_blob_creation', blob.size);
                throw new RangeError('Blob size exceeds security limit');
            }
            
            return blob;
        };
    }

    protectTextContent() {
        document.addEventListener('selectstart', (e) => {
            if (!this.isAllowedTextSelection(e.target)) {
                e.preventDefault();
                this.logDownloadAttempt('text_selection', e.target.tagName);
                return false;
            }
        });

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

    blockPrintAndSave() {
        const originalPrint = window.print;
        const self = this;
        
        window.print = function() {
            self.logDownloadAttempt('window_print', 'page');
            throw new ReferenceError('Printing is disabled for content protection');
        };

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                e.stopPropagation();
                this.logDownloadAttempt('ctrl_p', 'print');
                throw new ReferenceError('Print shortcut is disabled for content protection');
            }
        });

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

    blockCopyPaste() {
        document.addEventListener('copy', (e) => {
            setTimeout(() => {
                navigator.clipboard.writeText('').catch(() => {});
            }, 100);
        });

        const blockKeys = ['c', 'v', 'x', 'a'];
        
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

    isAllowedTextSelection(element) {
        const allowedTags = ['input', 'textarea'];
        const allowedClasses = ['selectable', 'editable'];
        
        return allowedTags.includes(element.tagName.toLowerCase()) ||
               allowedClasses.some(cls => element.classList.contains(cls));
    }

    isAllowedCopy(element) {
        return this.isAllowedTextSelection(element);
    }

    isAllowedKeyboardShortcut(element, key) {
        if (element.tagName.toLowerCase() === 'input' || 
            element.tagName.toLowerCase() === 'textarea') {
            return !element.classList.contains('protected');
        }
        return false;
    }

    logDownloadAttempt(type, details) {
        const attempt = {
            type,
            details,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer
        };

        const currentCount = this.downloadAttempts.get(type) || 0;
        this.downloadAttempts.set(type, currentCount + 1);

        console.warn('🚫 TENTATIVA DE DOWNLOAD BLOQUEADA:', attempt);

        if (currentCount >= this.maxDownloadAttempts) {
            this.activateSevereMode();
        }

        this.saveDownloadLog(attempt);
    }

    activateSevereMode() {
        console.error('🆘 MODO SEVERO ATIVADO - Muitas tentativas de download');

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

        document.addEventListener('click', (e) => e.preventDefault(), true);
        document.addEventListener('keydown', (e) => e.preventDefault(), true);
    }

    showProtectionWarning(message) {
        if (document.querySelector('.security-toast')) return;

        const toast = document.createElement('div');
        toast.className = 'security-toast';
        toast.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                font-family: 'Arial', sans-serif;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
                z-index: 999998;
                max-width: 300px;
                animation: slideInRight 0.3s ease-out;
            ">
                🛡️ ${message}
            </div>
            <style>
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            </style>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            const toastDiv = toast.querySelector('div');
            toastDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    saveDownloadLog(attempt) {
        try {
            const logs = JSON.parse(localStorage.getItem('download_protection_log') || '[]');
            logs.push(attempt);
            
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('download_protection_log', JSON.stringify(logs));
        } catch (e) {
            // Falha silenciosa
        }
    }

    activateFailsafe() {
        document.addEventListener('contextmenu', (e) => e.preventDefault(), true);
        document.addEventListener('dragstart', (e) => e.preventDefault(), true);
        document.addEventListener('selectstart', (e) => e.preventDefault(), true);
        
        console.log('🚨 Failsafe de proteção anti-download ativado');
    }

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
    Object.freeze(window.antiDownloadProtection);
    console.log('🚫 Sistema de Proteção Anti-Download inicializado!');
}

export default AntiDownloadProtection;