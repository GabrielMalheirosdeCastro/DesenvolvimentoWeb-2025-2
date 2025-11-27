/**
 * 🛡️ INICIALIZADOR DE SEGURANÇA UNIVERSAL
 * Sistema que inicia proteção avançada em todas as páginas do portfólio
 * Carregado automaticamente para proteger contra downloads ilegais
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 * Versão: 2.0.0 - Proteção Universal
 */

(function() {
    'use strict';
    
    // 🚀 Configuração de segurança
    const SECURITY_CONFIG = {
        domain: 'desenvolvimento-web-2025-2.vercel.app',
        maxViolations: 5,
        debugMode: false
    };

    // 📊 Estado de segurança
    let securityViolations = 0;
    let securityActive = false;
    let protectionLevel = 'maximum';

    /**
     * 🛡️ Inicializar proteção básica imediata
     */
    function initImmediateProtection() {
        // Bloquear right-click imediatamente
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            logViolation('immediate_right_click');
            showSecurityToast('Right-click desabilitado para proteger o conteúdo');
            return false;
        }, true);

        // Bloquear drag imediatamente
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            logViolation('immediate_drag');
            return false;
        }, true);

        // Bloquear seleção imediatamente
        document.addEventListener('selectstart', function(e) {
            if (!isAllowedElement(e.target)) {
                e.preventDefault();
                logViolation('immediate_select');
                return false;
            }
        }, true);

        // Bloquear teclas de atalho imediatamente
        document.addEventListener('keydown', function(e) {
            // F12 - DevTools
            if (e.key === 'F12') {
                e.preventDefault();
                logViolation('immediate_f12');
                showSecurityToast('DevTools bloqueadas para proteção');
                return false;
            }

            // Ctrl+S - Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                logViolation('immediate_save');
                showSecurityToast('Salvamento de página bloqueado');
                return false;
            }

            // Ctrl+U - View Source
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                logViolation('immediate_view_source');
                showSecurityToast('Visualização de código bloqueada');
                return false;
            }

            // Ctrl+Shift+I - DevTools
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                logViolation('immediate_devtools');
                showSecurityToast('DevTools bloqueadas para proteção');
                return false;
            }

            // Ctrl+P - Print
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                logViolation('immediate_print');
                showSecurityToast('Impressão bloqueada para proteção');
                return false;
            }
        }, true);

        console.log('🛡️ Proteção imediata ativada');
    }

    /**
     * ⚠️ Implementar ReferenceError customizado
     */
    function setupReferenceErrorTraps() {
        // Lista de objetos/funções a serem protegidos
        const protectedGlobals = [
            'eval', 'Function', 'XMLHttpRequest', 'fetch',
            'setTimeout', 'setInterval', 'requestAnimationFrame'
        ];

        protectedGlobals.forEach(function(globalName) {
            if (window[globalName]) {
                const original = window[globalName];
                
                window[globalName] = new Proxy(original, {
                    apply: function(target, thisArg, argumentsList) {
                        if (isSuspiciousCall(globalName, argumentsList)) {
                            logViolation('reference_error_' + globalName);
                            
                            const error = new ReferenceError(
                                globalName + ' is not defined in secure context'
                            );
                            error.name = 'SecurityReferenceError';
                            throw error;
                        }
                        
                        return target.apply(thisArg, argumentsList);
                    },
                    
                    get: function(target, property) {
                        if (property === 'toString') {
                            return function() { return 'function() { [native code] }'; };
                        }
                        return target[property];
                    }
                });
            }
        });
    }

    /**
     * 📊 Implementar RangeError customizado
     */
    function setupRangeErrorTraps() {
        // Limites de segurança
        const limits = {
            arraySize: 10000,
            stringLength: 100000,
            recursionDepth: 100
        };

        let recursionCount = 0;

        // Interceptar Array constructor
        const OriginalArray = window.Array;
        window.Array = new Proxy(OriginalArray, {
            construct: function(target, args) {
                if (args[0] && typeof args[0] === 'number' && args[0] > limits.arraySize) {
                    logViolation('range_error_array_size');
                    
                    const error = new RangeError(
                        'Array size ' + args[0] + ' exceeds security limit of ' + limits.arraySize
                    );
                    error.name = 'SecurityRangeError';
                    throw error;
                }
                return new target(...args);
            }
        });

        // Monitor recursion depth
        const originalCall = Function.prototype.call;
        Function.prototype.call = function(...args) {
            recursionCount++;
            
            if (recursionCount > limits.recursionDepth) {
                logViolation('range_error_recursion');
                
                const error = new RangeError(
                    'Maximum call stack size exceeded: ' + recursionCount
                );
                error.name = 'SecurityRangeError';
                throw error;
            }
            
            try {
                return originalCall.apply(this, args);
            } finally {
                recursionCount--;
            }
        };
    }

    /**
     * 🚫 Proteger contra downloads
     */
    function protectAgainstDownloads() {
        // Interceptar criação de elementos <a> com download
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName.toLowerCase() === 'a') {
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name === 'download') {
                        logViolation('download_attribute');
                        throw new ReferenceError('Download functionality is disabled');
                    }
                    return originalSetAttribute.call(this, name, value);
                };
                
                // Monitorar clicks
                element.addEventListener('click', function(e) {
                    if (element.hasAttribute('download') || 
                        element.href.startsWith('blob:') ||
                        element.href.startsWith('data:')) {
                        
                        e.preventDefault();
                        e.stopPropagation();
                        logViolation('download_click');
                        showSecurityToast('Download bloqueado para proteção');
                        return false;
                    }
                });
            }
            
            return element;
        };

        // Proteger URL.createObjectURL
        if (window.URL && window.URL.createObjectURL) {
            const originalCreateObjectURL = window.URL.createObjectURL;
            window.URL.createObjectURL = function(object) {
                logViolation('create_object_url');
                throw new ReferenceError('Object URL creation is disabled for protection');
            };
        }

        // Proteger Blob constructor
        const OriginalBlob = window.Blob;
        window.Blob = function(...args) {
            const blob = new OriginalBlob(...args);
            
            // Verificar se é tentativa suspeita
            if (blob.size > 1024 * 1024) { // 1MB
                logViolation('large_blob_creation');
                throw new RangeError('Blob size exceeds security limit');
            }
            
            return blob;
        };
    }

    /**
     * 🕵️ Detectar DevTools
     */
    function detectDevTools() {
        let devtools = { open: false };
        const threshold = 160;

        setInterval(function() {
            if (window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold) {
                
                if (!devtools.open) {
                    devtools.open = true;
                    logViolation('devtools_detected');
                    triggerSecurityBreach('DevTools detectadas');
                }
            } else {
                devtools.open = false;
            }
        }, 500);

        // Detectar debugger
        setInterval(function() {
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > 100) {
                logViolation('debugger_detected');
                triggerSecurityBreach('Debugger detectado');
            }
        }, 3000);
    }

    /**
     * 🎯 Verificar se chamada é suspeita
     */
    function isSuspiciousCall(functionName, args) {
        const suspiciousPatterns = [
            /eval\(/,
            /Function\(/,
            /document\.write/,
            /innerHTML.*<script/i,
            /src\s*=.*javascript:/i
        ];

        const argsString = args.join(' ');
        return suspiciousPatterns.some(function(pattern) {
            return pattern.test(argsString);
        });
    }

    /**
     * ✅ Verificar se elemento permite interação
     */
    function isAllowedElement(element) {
        const allowedTags = ['input', 'textarea'];
        const allowedClasses = ['selectable', 'copyable'];
        
        return allowedTags.includes(element.tagName.toLowerCase()) ||
               allowedClasses.some(function(cls) {
                   return element.classList.contains(cls);
               });
    }

    /**
     * 📝 Log de violação
     */
    function logViolation(type) {
        securityViolations++;
        
        const violation = {
            type: type,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100)
        };

        if (SECURITY_CONFIG.debugMode) {
            console.warn('🚨 Violação de segurança:', violation);
        }

        // Salvar em localStorage
        try {
            const violations = JSON.parse(localStorage.getItem('security_violations') || '[]');
            violations.push(violation);
            
            if (violations.length > 100) {
                violations.splice(0, violations.length - 100);
            }
            
            localStorage.setItem('security_violations', JSON.stringify(violations));
        } catch (e) {
            // Falha silenciosa
        }

        // Verificar se deve ativar modo severo
        if (securityViolations >= SECURITY_CONFIG.maxViolations) {
            activateSevereMode();
        }
    }

    /**
     * 🚨 Disparar violação de segurança
     */
    function triggerSecurityBreach(message) {
        logViolation('security_breach');
        showSecurityToast('⚠️ ' + message);
        
        // Adicionar delay artificial
        const start = performance.now();
        while (performance.now() - start < 1000) {
            // Busy wait de 1 segundo
        }
    }

    /**
     * 🆘 Ativar modo severo
     */
    function activateSevereMode() {
        console.error('🆘 MODO SEVERO DE SEGURANÇA ATIVADO');

        // Criar overlay de bloqueio
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-family: 'Arial', sans-serif;
                text-align: center;
                z-index: 999999;
                animation: fadeIn 0.5s ease-out;
            ">
                <h1 style="font-size: 3rem; margin-bottom: 20px;">🛡️</h1>
                <h2 style="font-size: 2rem; margin-bottom: 10px;">ACESSO BLOQUEADO</h2>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">Múltiplas violações de segurança detectadas</p>
                <p style="font-size: 1rem; margin-bottom: 20px;">Este portfólio é protegido contra downloads e acessos não autorizados</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">© Gabriel Malheiros de Castro - FAESA 2025-2</p>
                <button onclick="window.location.reload()" style="
                    margin-top: 30px;
                    padding: 15px 30px;
                    background: white;
                    color: #e74c3c;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                    Recarregar Página
                </button>
            </div>
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            </style>
        `;

        document.body.appendChild(overlay);

        // Desabilitar todas as interações
        document.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, true);
        
        document.addEventListener('keydown', function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, true);
    }

    /**
     * 📢 Mostrar toast de segurança
     */
    function showSecurityToast(message) {
        // Evitar spam de toasts
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

        // Remover após 3 segundos
        setTimeout(function() {
            const toastDiv = toast.querySelector('div');
            toastDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(function() {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    /**
     * 🔒 Proteger imagens específicas
     */
    function protectImages() {
        // Aguardar carregamento do DOM
        function processImages() {
            const images = document.querySelectorAll('img');
            
            images.forEach(function(img) {
                // Remover atributos de drag
                img.setAttribute('draggable', 'false');
                img.style.webkitUserDrag = 'none';
                img.style.webkitUserSelect = 'none';
                img.style.mozUserSelect = 'none';
                img.style.userSelect = 'none';

                // Bloquear context menu
                img.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    logViolation('image_context_menu');
                    showSecurityToast('Context menu bloqueado em imagens');
                    return false;
                });

                // Bloquear drag start
                img.addEventListener('dragstart', function(e) {
                    e.preventDefault();
                    logViolation('image_drag_start');
                    return false;
                });
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processImages);
        } else {
            processImages();
        }

        // Observer para novas imagens
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'IMG') {
                            processImages();
                        } else if (node.querySelectorAll) {
                            const newImages = node.querySelectorAll('img');
                            if (newImages.length > 0) {
                                processImages();
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * 🚀 Inicialização principal
     */
    function initSecuritySystem() {
        try {
            // 1. Proteção imediata
            initImmediateProtection();
            
            // 2. Configurar armadilhas de erro
            setupReferenceErrorTraps();
            setupRangeErrorTraps();
            
            // 3. Proteger downloads
            protectAgainstDownloads();
            
            // 4. Detectar DevTools
            detectDevTools();
            
            // 5. Proteger imagens
            protectImages();

            securityActive = true;
            console.log('🛡️ Sistema de segurança universal inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro na inicialização de segurança:', error);
            // Fallback para proteção básica
            initImmediateProtection();
        }
    }

    // 🚀 AUTO-INICIALIZAÇÃO
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecuritySystem);
    } else {
        initSecuritySystem();
    }

    // Expor interface limitada para debugging
    window.portfolioSecurity = {
        getViolations: function() {
            return securityViolations;
        },
        isActive: function() {
            return securityActive;
        },
        getLevel: function() {
            return protectionLevel;
        }
    };

})();