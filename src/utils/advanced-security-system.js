/**
 * 🛡️⚡ SISTEMA AVANÇADO DE SEGURANÇA - VERSÃO APRIMORADA
 * Sistema completo de proteção contra downloads ilegais e acessos não autorizados
 * Inclui ReferenceError e RangeError para máxima segurança
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 * Versão: 2.0.0 - Segurança Aprimorada
 */

class AdvancedSecuritySystem {
    constructor() {
        this.initialized = false;
        this.securityLevel = 'maximum';
        this.protectedDomains = [
            'desenvolvimento-web-2025-2.vercel.app',
            'localhost:5173'
        ];
        this.suspiciousActivities = new Map();
        this.errorTriggers = new Set();
        this.init();
    }

    /**
     * 🚀 Inicialização completa do sistema de segurança
     */
    async init() {
        if (this.initialized) return;

        try {
            // 1. Validação de domínio e origem
            this.validateOriginDomain();
            
            // 2. Implementar proteção com ReferenceError
            this.setupReferenceErrorProtection();
            
            // 3. Implementar proteção com RangeError
            this.setupRangeErrorProtection();
            
            // 4. Proteger contra download de recursos
            this.protectResourceDownloads();
            
            // 5. Implementar anti-debugging avançado
            this.setupAdvancedAntiDebugging();
            
            // 6. Monitoramento comportamental
            this.setupBehavioralMonitoring();
            
            // 7. Proteção de console
            this.protectConsoleAccess();
            
            // 8. Obfuscação de código em tempo real
            this.setupRuntimeObfuscation();
            
            // 9. Proteção contra extensões maliciosas
            this.protectAgainstMaliciousExtensions();
            
            // 10. Sistema de honeypot
            this.setupHoneypotSystem();

            this.initialized = true;
            this.logSecurityEvent('advanced_security_initialized', 'Sistema de segurança avançado ativo');
            
        } catch (error) {
            console.error('❌ Falha crítica na inicialização de segurança:', error);
            this.activateEmergencyMode();
        }
    }

    /**
     * 🌐 Validar domínio e origem da aplicação
     */
    validateOriginDomain() {
        const currentDomain = window.location.hostname;
        const isValidDomain = this.protectedDomains.some(domain => {
            return currentDomain === domain || currentDomain.endsWith(domain);
        });

        if (!isValidDomain && !currentDomain.includes('localhost')) {
            this.triggerSecurityBreach('unauthorized_domain', currentDomain);
        }

        // Verificar se está sendo executado em iframe suspeito
        if (window.self !== window.top) {
            try {
                const parentOrigin = window.parent.location.origin;
                if (!this.protectedDomains.includes(parentOrigin)) {
                    this.triggerSecurityBreach('iframe_injection', parentOrigin);
                }
            } catch (e) {
                // Cross-origin iframe detectado
                this.triggerSecurityBreach('cross_origin_iframe', 'unknown');
            }
        }
    }

    /**
     * ⚠️ Implementar proteção com ReferenceError
     */
    setupReferenceErrorProtection() {
        // Armadilhas para variáveis comuns usadas por scripts maliciosos
        const protectedVariables = [
            'eval', 'Function', 'setTimeout', 'setInterval',
            'XMLHttpRequest', 'fetch', 'download', 'saveAs',
            'blob', 'createObjectURL', 'revokeObjectURL'
        ];

        // Criar proxies que disparam ReferenceError para acesso suspeito
        protectedVariables.forEach(varName => {
            if (window[varName]) {
                const originalFunction = window[varName];
                
                window[varName] = new Proxy(originalFunction, {
                    apply: (target, thisArg, argumentsList) => {
                        // Verificar se a chamada é suspeita
                        if (this.isSuspiciousCall(varName, argumentsList)) {
                            this.logSuspiciousActivity(varName, argumentsList);
                            
                            // Disparar ReferenceError personalizado
                            const error = new ReferenceError(
                                `Access denied: ${varName} is not defined in secure context`
                            );
                            error.name = 'SecurityReferenceError';
                            throw error;
                        }
                        
                        return target.apply(thisArg, argumentsList);
                    },
                    
                    get: (target, property) => {
                        if (property === 'toString') {
                            return () => 'function() { [native code] }';
                        }
                        return target[property];
                    }
                });
            }
        });

        // Proteger contra acesso direto a propriedades do DOM suspeitas
        this.protectDOMProperties();
    }

    /**
     * 📊 Implementar proteção com RangeError
     */
    setupRangeErrorProtection() {
        // Limites de segurança
        const securityLimits = {
            maxArraySize: 10000,
            maxStringLength: 100000,
            maxCallStack: 100,
            maxEventListeners: 50,
            maxTimeouts: 20
        };

        let currentCallStack = 0;
        let activeTimeouts = 0;
        let eventListenerCount = 0;

        // Interceptar Array constructor
        const OriginalArray = window.Array;
        window.Array = new Proxy(OriginalArray, {
            construct: (target, args) => {
                if (args[0] && args[0] > securityLimits.maxArraySize) {
                    const error = new RangeError(
                        `Array size ${args[0]} exceeds security limit of ${securityLimits.maxArraySize}`
                    );
                    error.name = 'SecurityRangeError';
                    this.triggerSecurityBreach('array_size_violation', args[0]);
                    throw error;
                }
                return new target(...args);
            }
        });

        // Interceptar String constructor
        const OriginalString = window.String;
        window.String = new Proxy(OriginalString, {
            construct: (target, args) => {
                if (args[0] && args[0].length > securityLimits.maxStringLength) {
                    const error = new RangeError(
                        `String length ${args[0].length} exceeds security limit`
                    );
                    error.name = 'SecurityRangeError';
                    this.triggerSecurityBreach('string_size_violation', args[0].length);
                    throw error;
                }
                return new target(...args);
            }
        });

        // Monitorar depth de call stack
        this.monitorCallStackDepth();
    }

    /**
     * 🚫 Proteger contra download de recursos
     */
    protectResourceDownloads() {
        // Interceptar criação de links de download
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName.toLowerCase() === 'a') {
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name === 'download' || (name === 'href' && value.startsWith('blob:'))) {
                        // Trigger security violation
                        const error = new ReferenceError(
                            'Download functionality is restricted in this secure context'
                        );
                        error.name = 'SecurityDownloadError';
                        throw error;
                    }
                    return originalSetAttribute.call(this, name, value);
                };
            }
            
            return element;
        };

        // Proteger Blob URLs
        const originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = function(object) {
            // Log tentativa de criação de blob
            console.warn('🚨 Tentativa de criação de Blob URL detectada');
            
            // Verificar se é para download suspeito
            if (object.type && (
                object.type.includes('application/') ||
                object.type.includes('text/') ||
                object.type.includes('image/')
            )) {
                const error = new ReferenceError(
                    'Blob URL creation blocked for security reasons'
                );
                error.name = 'SecurityBlobError';
                throw error;
            }
            
            return originalCreateObjectURL.call(this, object);
        };

        // Proteger Canvas toDataURL e toBlob
        this.protectCanvasExport();
    }

    /**
     * 🕵️ Anti-debugging avançado
     */
    setupAdvancedAntiDebugging() {
        // Detectar DevTools
        let devtools = {
            open: false,
            orientation: null
        };

        const threshold = 160;
        const checkDevTools = () => {
            if (window.outerHeight - window.innerHeight > threshold ||
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.triggerSecurityBreach('devtools_detected', 'DevTools abertas');
                }
            } else {
                devtools.open = false;
            }
        };

        // Verificar a cada 100ms
        setInterval(checkDevTools, 100);

        // Detectar debugging via performance
        const debuggerDetection = () => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > 100) { // Debugger pausou a execução
                this.triggerSecurityBreach('debugger_detected', 'Debugger ativo');
            }
        };

        // Executar detecção a cada 5 segundos
        setInterval(debuggerDetection, 5000);

        // Proteger contra Function constructor
        window.Function = new Proxy(Function, {
            construct: (target, args) => {
                this.triggerSecurityBreach('function_constructor', args);
                const error = new ReferenceError(
                    'Function constructor is disabled for security'
                );
                throw error;
            }
        });
    }

    /**
     * 👁️ Monitoramento comportamental
     */
    setupBehavioralMonitoring() {
        let rapidClicks = 0;
        let lastClickTime = 0;
        let suspiciousKeySequences = 0;

        // Monitorar cliques rápidos (possível bot)
        document.addEventListener('click', (event) => {
            const currentTime = Date.now();
            
            if (currentTime - lastClickTime < 50) { // Menos de 50ms entre cliques
                rapidClicks++;
                
                if (rapidClicks > 10) {
                    this.triggerSecurityBreach('rapid_clicking', 'Bot detectado');
                }
            } else {
                rapidClicks = 0;
            }
            
            lastClickTime = currentTime;
        });

        // Monitorar sequências de teclas suspeitas
        const suspiciousKeys = ['F12', 'F11', 'I', 'U', 'S'];
        let keySequence = [];

        document.addEventListener('keydown', (event) => {
            keySequence.push(event.key);
            
            if (keySequence.length > 5) {
                keySequence.shift();
            }

            // Detectar Ctrl+Shift+I (DevTools)
            if (event.ctrlKey && event.shiftKey && event.key === 'I') {
                event.preventDefault();
                this.triggerSecurityBreach('devtools_shortcut', 'Ctrl+Shift+I');
                return false;
            }

            // Detectar F12 (DevTools)
            if (event.key === 'F12') {
                event.preventDefault();
                this.triggerSecurityBreach('devtools_f12', 'F12 pressionado');
                return false;
            }

            // Detectar Ctrl+U (View Source)
            if (event.ctrlKey && event.key === 'u') {
                event.preventDefault();
                this.triggerSecurityBreach('view_source', 'Ctrl+U');
                return false;
            }
        });

        // Monitorar context menu
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.triggerSecurityBreach('right_click', 'Context menu bloqueado');
            return false;
        });
    }

    /**
     * 🛡️ Proteger acesso ao console
     */
    protectConsoleAccess() {
        // Sobrescrever métodos do console
        const consoleMethods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
        
        consoleMethods.forEach(method => {
            const original = console[method];
            console[method] = new Proxy(original, {
                apply: (target, thisArg, argumentsList) => {
                    // Detectar tentativas de injeção via console
                    const message = argumentsList.join(' ');
                    
                    if (message.includes('eval') || 
                        message.includes('Function') ||
                        message.includes('script') ||
                        message.includes('XMLHttpRequest')) {
                        
                        this.triggerSecurityBreach('console_injection', message);
                        return;
                    }
                    
                    return target.apply(thisArg, argumentsList);
                }
            });
        });

        // Detectar tentativas de redefinir console
        Object.defineProperty(window, 'console', {
            configurable: false,
            writable: false
        });
    }

    /**
     * 🎭 Obfuscação em tempo real
     */
    setupRuntimeObfuscation() {
        // Obfuscar nomes de variáveis importantes
        const obfuscatedNames = new Map();
        let counter = 0;

        const obfuscate = (name) => {
            if (!obfuscatedNames.has(name)) {
                obfuscatedNames.set(name, `_0x${counter.toString(16)}`);
                counter++;
            }
            return obfuscatedNames.get(name);
        };

        // Aplicar obfuscação a propriedades sensíveis
        this.obfuscateSensitiveProperties();
    }

    /**
     * 🕷️ Sistema Honeypot
     */
    setupHoneypotSystem() {
        // Criar elementos honeypot invisíveis
        const createHoneypot = (type, id) => {
            const element = document.createElement(type);
            element.id = id;
            element.style.cssText = 'position:absolute;left:-9999px;opacity:0;pointer-events:none;';
            element.setAttribute('tabindex', '-1');
            document.body.appendChild(element);
            return element;
        };

        // Input honeypot
        const honeypotInput = createHoneypot('input', 'hpt_email');
        honeypotInput.type = 'email';
        honeypotInput.name = 'email';

        // Link honeypot
        const honeypotLink = createHoneypot('a', 'hpt_download');
        honeypotLink.href = '#';
        honeypotLink.textContent = 'Download Source';

        // Monitorar interações com honeypots
        [honeypotInput, honeypotLink].forEach(element => {
            element.addEventListener('focus', () => {
                this.triggerSecurityBreach('honeypot_triggered', element.id);
            });

            element.addEventListener('click', (e) => {
                e.preventDefault();
                this.triggerSecurityBreach('honeypot_clicked', element.id);
            });
        });
    }

    /**
     * 🚨 Disparar violação de segurança
     */
    triggerSecurityBreach(type, details) {
        const breachData = {
            type,
            details,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer
        };

        console.error('🚨 VIOLAÇÃO DE SEGURANÇA DETECTADA:', breachData);

        // Incrementar contador de atividades suspeitas
        const currentCount = this.suspiciousActivities.get(type) || 0;
        this.suspiciousActivities.set(type, currentCount + 1);

        // Se muitas violações, ativar modo de emergência
        if (currentCount > 3) {
            this.activateEmergencyMode();
        }

        // Adicionar delay artificial para desencorajar ataques
        this.addSecurityDelay();
    }

    /**
     * 🆘 Ativar modo de emergência
     */
    activateEmergencyMode() {
        console.warn('🆘 MODO DE EMERGÊNCIA ATIVADO');

        // Redirecionar para página de bloqueio
        setTimeout(() => {
            document.body.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    font-family: Arial, sans-serif;
                    z-index: 999999;
                ">
                    <h1>🛡️ Acesso Bloqueado</h1>
                    <p>Atividade suspeita detectada</p>
                    <p>Este portfólio está protegido contra downloads e acessos não autorizados</p>
                    <p>Entre em contato: gabriel.malheiros@exemplo.com</p>
                </div>
            `;
        }, 1000);
    }

    /**
     * 🕐 Adicionar delay de segurança
     */
    addSecurityDelay() {
        const delay = Math.floor(Math.random() * 2000) + 500; // 500-2500ms
        
        const start = performance.now();
        while (performance.now() - start < delay) {
            // Busy wait (intencionalmente bloqueante)
        }
    }

    /**
     * 🔍 Verificar se chamada é suspeita
     */
    isSuspiciousCall(functionName, args) {
        const suspiciousPatterns = [
            /eval\(/,
            /Function\(/,
            /document\.write/,
            /innerHTML.*script/i,
            /src\s*=.*javascript:/i,
            /on\w+\s*=/i,
            /\.download/,
            /saveAs/,
            /blob:/,
            /data:/
        ];

        const argsString = args.join(' ').toLowerCase();
        
        return suspiciousPatterns.some(pattern => {
            if (typeof pattern === 'string') {
                return argsString.includes(pattern);
            }
            return pattern.test(argsString);
        });
    }

    /**
     * 📝 Log de atividade suspeita
     */
    logSuspiciousActivity(functionName, args) {
        const activity = {
            function: functionName,
            arguments: args,
            timestamp: Date.now(),
            stackTrace: new Error().stack
        };

        console.warn('🔍 Atividade suspeita detectada:', activity);
        
        // Salvar em localStorage para análise posterior
        try {
            const existing = JSON.parse(localStorage.getItem('security_log') || '[]');
            existing.push(activity);
            
            // Manter apenas os últimos 100 registros
            if (existing.length > 100) {
                existing.splice(0, existing.length - 100);
            }
            
            localStorage.setItem('security_log', JSON.stringify(existing));
        } catch (e) {
            // Falha silenciosa para não revelar sistema de log
        }
    }

    /**
     * 🏗️ Proteger propriedades do DOM
     */
    protectDOMProperties() {
        const sensitiveProperties = [
            'innerHTML', 'outerHTML', 'textContent',
            'src', 'href', 'action', 'formAction'
        ];

        sensitiveProperties.forEach(prop => {
            const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, prop) ||
                             Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop);
                             
            if (descriptor && descriptor.set) {
                const originalSetter = descriptor.set;
                
                Object.defineProperty(Element.prototype, prop, {
                    set: function(value) {
                        if (this.isSuspiciousValue && this.isSuspiciousValue(value)) {
                            const error = new ReferenceError(
                                `Suspicious ${prop} assignment blocked`
                            );
                            error.name = 'SecurityPropertyError';
                            throw error;
                        }
                        return originalSetter.call(this, value);
                    },
                    get: descriptor.get,
                    configurable: descriptor.configurable
                });
            }
        });
    }

    /**
     * 🎨 Proteger exportação do Canvas
     */
    protectCanvasExport() {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        const originalToBlob = HTMLCanvasElement.prototype.toBlob;

        HTMLCanvasElement.prototype.toDataURL = function(...args) {
            this.triggerSecurityBreach('canvas_export_attempt', 'toDataURL');
            const error = new ReferenceError(
                'Canvas export is restricted for content protection'
            );
            throw error;
        };

        HTMLCanvasElement.prototype.toBlob = function(...args) {
            this.triggerSecurityBreach('canvas_export_attempt', 'toBlob');
            const error = new ReferenceError(
                'Canvas export is restricted for content protection'
            );
            throw error;
        };
    }

    /**
     * 📊 Monitorar profundidade do call stack
     */
    monitorCallStackDepth() {
        let stackDepth = 0;
        const maxDepth = 100;

        const originalCall = Function.prototype.call;
        const originalApply = Function.prototype.apply;

        Function.prototype.call = function(...args) {
            stackDepth++;
            
            if (stackDepth > maxDepth) {
                const error = new RangeError(
                    `Maximum call stack size exceeded: ${stackDepth} > ${maxDepth}`
                );
                error.name = 'SecurityStackError';
                throw error;
            }
            
            try {
                return originalCall.apply(this, args);
            } finally {
                stackDepth--;
            }
        };

        Function.prototype.apply = function(thisArg, args) {
            stackDepth++;
            
            if (stackDepth > maxDepth) {
                const error = new RangeError(
                    `Maximum call stack size exceeded: ${stackDepth} > ${maxDepth}`
                );
                error.name = 'SecurityStackError';
                throw error;
            }
            
            try {
                return originalApply.call(this, thisArg, args);
            } finally {
                stackDepth--;
            }
        };
    }

    /**
     * 🎭 Obfuscar propriedades sensíveis
     */
    obfuscateSensitiveProperties() {
        // Lista de propriedades a serem obfuscadas
        const sensitiveGlobals = [
            'localStorage', 'sessionStorage', 'indexedDB',
            'fetch', 'XMLHttpRequest', 'WebSocket'
        ];

        sensitiveGlobals.forEach(prop => {
            if (window[prop]) {
                const original = window[prop];
                const obfuscatedName = `_${Math.random().toString(36).substr(2, 9)}`;
                
                // Mover para nome obfuscado
                window[obfuscatedName] = original;
                
                // Substituir original com proxy de detecção
                window[prop] = new Proxy({}, {
                    get: () => {
                        this.triggerSecurityBreach('sensitive_access', prop);
                        const error = new ReferenceError(
                            `${prop} is not accessible in secure mode`
                        );
                        throw error;
                    }
                });
            }
        });
    }

    /**
     * 🔐 Proteger contra extensões maliciosas
     */
    protectAgainstMaliciousExtensions() {
        // Detectar modificações suspeitas no DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Verificar se elemento adicionado é suspeito
                            if (this.isSuspiciousElement(node)) {
                                this.triggerSecurityBreach('malicious_injection', node.tagName);
                                node.remove();
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
     * 🕵️ Verificar se elemento é suspeito
     */
    isSuspiciousElement(element) {
        const suspiciousAttributes = ['onload', 'onerror', 'onclick'];
        const suspiciousTags = ['script', 'iframe', 'object', 'embed'];
        
        if (suspiciousTags.includes(element.tagName.toLowerCase())) {
            return true;
        }

        return suspiciousAttributes.some(attr => element.hasAttribute(attr));
    }

    /**
     * 📊 Log de evento de segurança
     */
    logSecurityEvent(type, message) {
        console.log(`🛡️ [SECURITY] ${type}: ${message}`);
    }
}

// 🚀 Inicializar sistema automaticamente
if (typeof window !== 'undefined') {
    window.advancedSecurity = new AdvancedSecuritySystem();
    
    // Proteger a instância contra modificação
    Object.freeze(window.advancedSecurity);
    
    console.log('🛡️ Sistema de Segurança Avançado inicializado com sucesso!');
}

export default AdvancedSecuritySystem;