/**
 * 🕵️ SECURITY MONITOR - Monitoramento avançado de violações de segurança
 * Sistema de logging e alertas para tentativas de bypass de segurança
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 * Versão: 2.0.0 - Monitoramento Avançado
 */

class SecurityMonitor {
    constructor() {
        this.violations = new Map();
        this.alerts = [];
        this.config = {
            maxViolationsPerType: 3,
            alertThreshold: 10,
            banThreshold: 20,
            monitoringInterval: 5000
        };
        this.isMonitoring = false;
        this.init();
    }

    /**
     * 🚀 Inicializar monitoramento
     */
    init() {
        if (this.isMonitoring) return;

        try {
            // Carregar dados existentes
            this.loadExistingData();
            
            // Iniciar monitoramento contínuo
            this.startContinuousMonitoring();
            
            // Configurar interceptadores avançados
            this.setupAdvancedInterceptors();
            
            // Monitorar performance suspeita
            this.monitorPerformanceAnomalies();
            
            // Detectar tentativas de engenharia reversa
            this.detectReverseEngineering();

            this.isMonitoring = true;
            console.log('🕵️ Security Monitor inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Security Monitor:', error);
        }
    }

    /**
     * 📊 Carregar dados existentes
     */
    loadExistingData() {
        try {
            const stored = localStorage.getItem('security_monitor_data');
            if (stored) {
                const data = JSON.parse(stored);
                this.violations = new Map(data.violations || []);
                this.alerts = data.alerts || [];
            }
        } catch (e) {
            console.warn('⚠️ Não foi possível carregar dados de monitoramento');
        }
    }

    /**
     * 💾 Salvar dados de monitoramento
     */
    saveData() {
        try {
            const data = {
                violations: Array.from(this.violations.entries()),
                alerts: this.alerts,
                timestamp: Date.now()
            };
            
            localStorage.setItem('security_monitor_data', JSON.stringify(data));
        } catch (e) {
            // Falha silenciosa
        }
    }

    /**
     * 🔄 Iniciar monitoramento contínuo
     */
    startContinuousMonitoring() {
        setInterval(() => {
            this.checkSystemIntegrity();
            this.analyzeUserBehavior();
            this.detectAutomatedTools();
            this.monitorResourceUsage();
        }, this.config.monitoringInterval);
    }

    /**
     * 🕷️ Configurar interceptadores avançados
     */
    setupAdvancedInterceptors() {
        // Interceptar tentativas de modificação do DOM
        this.interceptDOMModifications();
        
        // Monitorar tentativas de injeção
        this.monitorInjectionAttempts();
        
        // Detectar tentativas de bypass
        this.detectBypassAttempts();
        
        // Monitorar network requests suspeitas
        this.monitorNetworkActivity();
    }

    /**
     * 🔧 Interceptar modificações do DOM
     */
    interceptDOMModifications() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            this.analyzeAddedElement(node);
                        }
                    });
                }
                
                if (mutation.type === 'attributes') {
                    this.analyzeAttributeChange(mutation);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true
        });
    }

    /**
     * 🔍 Analisar elemento adicionado
     */
    analyzeAddedElement(element) {
        const suspiciousElements = ['script', 'iframe', 'object', 'embed'];
        const suspiciousAttributes = ['onload', 'onerror', 'onclick'];
        
        if (suspiciousElements.includes(element.tagName.toLowerCase())) {
            this.recordViolation('suspicious_element_injection', {
                tagName: element.tagName,
                innerHTML: element.innerHTML.substring(0, 100),
                src: element.src || 'N/A'
            });
        }

        suspiciousAttributes.forEach(attr => {
            if (element.hasAttribute(attr)) {
                this.recordViolation('suspicious_attribute_injection', {
                    element: element.tagName,
                    attribute: attr,
                    value: element.getAttribute(attr).substring(0, 100)
                });
            }
        });
    }

    /**
     * 🔍 Analisar mudança de atributo
     */
    analyzeAttributeChange(mutation) {
        const dangerousAttributes = ['src', 'href', 'action', 'formaction'];
        const suspiciousValues = ['javascript:', 'data:', 'blob:', 'vbscript:'];
        
        if (dangerousAttributes.includes(mutation.attributeName)) {
            const newValue = mutation.target.getAttribute(mutation.attributeName);
            
            if (newValue && suspiciousValues.some(sv => newValue.startsWith(sv))) {
                this.recordViolation('dangerous_attribute_modification', {
                    element: mutation.target.tagName,
                    attribute: mutation.attributeName,
                    oldValue: mutation.oldValue,
                    newValue: newValue
                });
            }
        }
    }

    /**
     * 💉 Monitorar tentativas de injeção
     */
    monitorInjectionAttempts() {
        // Interceptar eval
        const originalEval = window.eval;
        window.eval = new Proxy(originalEval, {
            apply: (target, thisArg, argumentsList) => {
                this.recordViolation('eval_injection_attempt', {
                    code: argumentsList[0].substring(0, 200),
                    stack: new Error().stack
                });
                
                throw new ReferenceError('eval() calls are blocked for security');
            }
        });

        // Interceptar Function constructor
        const OriginalFunction = window.Function;
        window.Function = new Proxy(OriginalFunction, {
            construct: (target, argumentsList) => {
                this.recordViolation('function_constructor_attempt', {
                    arguments: argumentsList.map(arg => arg.substring(0, 100)),
                    stack: new Error().stack
                });
                
                throw new ReferenceError('Function constructor is disabled');
            }
        });
    }

    /**
     * 🚫 Detectar tentativas de bypass
     */
    detectBypassAttempts() {
        // Monitorar tentativas de redefinir objetos protegidos
        const protectedObjects = ['console', 'localStorage', 'document'];
        
        protectedObjects.forEach(objName => {
            if (window[objName]) {
                Object.defineProperty(window, objName, {
                    set: (value) => {
                        this.recordViolation('object_redefinition_attempt', {
                            object: objName,
                            newValue: typeof value,
                            stack: new Error().stack
                        });
                        
                        throw new ReferenceError(`${objName} cannot be redefined`);
                    },
                    configurable: false
                });
            }
        });

        // Detectar tentativas de criar iframes
        const originalCreateElement = document.createElement;
        document.createElement = new Proxy(originalCreateElement, {
            apply: (target, thisArg, argumentsList) => {
                const tagName = argumentsList[0].toLowerCase();
                
                if (['iframe', 'object', 'embed'].includes(tagName)) {
                    this.recordViolation('frame_creation_attempt', {
                        tagName: tagName,
                        stack: new Error().stack
                    });
                    
                    throw new ReferenceError(`${tagName} creation is blocked`);
                }
                
                return target.apply(thisArg, argumentsList);
            }
        });
    }

    /**
     * 🌐 Monitorar atividade de rede
     */
    monitorNetworkActivity() {
        // Interceptar fetch
        const originalFetch = window.fetch;
        window.fetch = new Proxy(originalFetch, {
            apply: (target, thisArg, argumentsList) => {
                const url = argumentsList[0].toString();
                
                // Verificar URLs suspeitas
                if (this.isSuspiciousURL(url)) {
                    this.recordViolation('suspicious_network_request', {
                        url: url,
                        method: argumentsList[1]?.method || 'GET'
                    });
                    
                    throw new ReferenceError('Network request blocked for security');
                }
                
                return target.apply(thisArg, argumentsList);
            }
        });

        // Interceptar XMLHttpRequest
        const OriginalXHR = window.XMLHttpRequest;
        window.XMLHttpRequest = function() {
            const xhr = new OriginalXHR();
            const originalOpen = xhr.open;
            
            xhr.open = function(method, url, ...args) {
                if (this.isSuspiciousURL(url)) {
                    this.recordViolation('suspicious_xhr_request', {
                        method: method,
                        url: url
                    });
                    
                    throw new ReferenceError('XHR request blocked for security');
                }
                
                return originalOpen.call(this, method, url, ...args);
            }.bind(this);
            
            return xhr;
        }.bind(this);
    }

    /**
     * 🔍 Verificar se URL é suspeita
     */
    isSuspiciousURL(url) {
        const suspiciousPatterns = [
            /pastebin\.com/i,
            /hastebin\.com/i,
            /github\.com.*raw/i,
            /githubusercontent\.com/i,
            /jsdelivr\.net/i,
            /unpkg\.com.*eval/i,
            /eval/i,
            /\.js.*eval/i
        ];

        return suspiciousPatterns.some(pattern => pattern.test(url));
    }

    /**
     * 📈 Monitorar anomalias de performance
     */
    monitorPerformanceAnomalies() {
        let lastCPUCheck = performance.now();
        let highCPUCount = 0;

        setInterval(() => {
            const now = performance.now();
            const deltaTime = now - lastCPUCheck;
            
            // Verificar se há usage excessivo de CPU (indicativo de mining ou ataques)
            if (deltaTime > 100) { // Mais de 100ms para operação simples
                highCPUCount++;
                
                if (highCPUCount > 5) {
                    this.recordViolation('performance_anomaly', {
                        type: 'high_cpu_usage',
                        deltaTime: deltaTime,
                        consecutiveOccurrences: highCPUCount
                    });
                }
            } else {
                highCPUCount = 0;
            }
            
            lastCPUCheck = now;
        }, 1000);
    }

    /**
     * 🔧 Detectar tentativas de engenharia reversa
     */
    detectReverseEngineering() {
        // Verificar se console está sendo usado excessivamente
        let consoleCallCount = 0;
        const originalConsoleLog = console.log;
        
        console.log = new Proxy(originalConsoleLog, {
            apply: (target, thisArg, argumentsList) => {
                consoleCallCount++;
                
                if (consoleCallCount > 50) { // Muitas chamadas de console
                    this.recordViolation('excessive_console_usage', {
                        callCount: consoleCallCount,
                        lastArguments: argumentsList.map(arg => 
                            typeof arg === 'string' ? arg.substring(0, 50) : typeof arg
                        )
                    });
                }
                
                return target.apply(thisArg, argumentsList);
            }
        });

        // Detectar tentativas de inspecionar propriedades
        const sensitiveObjects = [window, document, localStorage];
        
        sensitiveObjects.forEach(obj => {
            if (obj) {
                Object.keys(obj).forEach(key => {
                    if (typeof obj[key] === 'function') {
                        const original = obj[key];
                        
                        obj[key] = new Proxy(original, {
                            get: (target, property) => {
                                if (property === 'toString' || property === 'valueOf') {
                                    this.recordViolation('function_inspection_attempt', {
                                        object: obj.constructor.name,
                                        function: key,
                                        property: property
                                    });
                                }
                                
                                return target[property];
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * 🔍 Verificar integridade do sistema
     */
    checkSystemIntegrity() {
        // Verificar se objetos críticos foram modificados
        const criticalObjects = ['window', 'document', 'console', 'localStorage'];
        
        criticalObjects.forEach(objName => {
            const obj = window[objName];
            if (obj && obj.__modified) {
                this.recordViolation('system_integrity_violation', {
                    object: objName,
                    modification: 'object_marked_as_modified'
                });
            }
        });

        // Verificar se scripts foram injetados
        const scripts = document.querySelectorAll('script');
        const expectedScriptCount = document.body.dataset.expectedScripts || 0;
        
        if (scripts.length > expectedScriptCount) {
            this.recordViolation('script_injection_detected', {
                expected: expectedScriptCount,
                found: scripts.length,
                difference: scripts.length - expectedScriptCount
            });
        }
    }

    /**
     * 👤 Analisar comportamento do usuário
     */
    analyzeUserBehavior() {
        // Verificar se há atividade suspeita baseada em padrões
        const now = Date.now();
        const recentViolations = this.alerts.filter(alert => 
            now - alert.timestamp < 60000 // Últimos 60 segundos
        );

        if (recentViolations.length > 10) {
            this.recordViolation('suspicious_behavior_pattern', {
                recentViolationCount: recentViolations.length,
                timeWindow: '60_seconds'
            });
        }
    }

    /**
     * 🤖 Detectar ferramentas automatizadas
     */
    detectAutomatedTools() {
        // Verificar se há sinais de automação
        if (navigator.webdriver) {
            this.recordViolation('automated_tool_detected', {
                tool: 'webdriver',
                value: navigator.webdriver
            });
        }

        // Verificar phantomJS
        if (window.phantom || window._phantom || window.callPhantom) {
            this.recordViolation('automated_tool_detected', {
                tool: 'phantomjs',
                detected: true
            });
        }

        // Verificar selenium
        if (window.selenium || document.documentElement.getAttribute('selenium') || 
            document.documentElement.getAttribute('webdriver')) {
            this.recordViolation('automated_tool_detected', {
                tool: 'selenium',
                detected: true
            });
        }
    }

    /**
     * 📊 Monitorar uso de recursos
     */
    monitorResourceUsage() {
        // Verificar memory usage excessivo
        if (performance.memory) {
            const memUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
            
            if (memUsage > 100) { // Mais de 100MB
                this.recordViolation('excessive_memory_usage', {
                    memoryUsage: memUsage,
                    limit: 100
                });
            }
        }

        // Verificar muitas conexões abertas
        const connectionCount = navigator.connection?.downlink || 0;
        if (connectionCount > 10) {
            this.recordViolation('excessive_network_connections', {
                connectionCount: connectionCount,
                limit: 10
            });
        }
    }

    /**
     * 📝 Registrar violação
     */
    recordViolation(type, details) {
        const violation = {
            type: type,
            details: details,
            timestamp: Date.now(),
            userAgent: navigator.userAgent.substring(0, 100),
            url: window.location.href,
            referrer: document.referrer
        };

        // Atualizar contadores
        const currentCount = this.violations.get(type) || 0;
        this.violations.set(type, currentCount + 1);

        // Adicionar aos alertas
        this.alerts.push(violation);

        // Limitar tamanho dos alertas
        if (this.alerts.length > 1000) {
            this.alerts.splice(0, this.alerts.length - 1000);
        }

        // Log da violação
        console.warn('🚨 VIOLAÇÃO DETECTADA:', violation);

        // Verificar se deve escalar o alerta
        this.checkEscalation(type, currentCount + 1);

        // Salvar dados
        this.saveData();
    }

    /**
     * 🚨 Verificar escalação de alerta
     */
    checkEscalation(type, count) {
        if (count >= this.config.banThreshold) {
            this.triggerBan(type);
        } else if (count >= this.config.alertThreshold) {
            this.triggerAlert(type, count);
        }
    }

    /**
     * ⚠️ Disparar alerta
     */
    triggerAlert(type, count) {
        console.error(`⚠️ ALERTA DE SEGURANÇA: ${type} - ${count} ocorrências`);
        
        // Mostrar notificação visual
        this.showSecurityAlert(`Alerta: ${count} tentativas de ${type} detectadas`);
    }

    /**
     * 🚫 Disparar ban
     */
    triggerBan(type) {
        console.error(`🚫 BAN ATIVADO: Muitas violações do tipo ${type}`);
        
        // Ativar modo de emergência
        this.activateEmergencyMode();
    }

    /**
     * 🆘 Ativar modo de emergência
     */
    activateEmergencyMode() {
        // Criar overlay de bloqueio total
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(45deg, #8B0000, #DC143C);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                font-family: 'Arial', sans-serif;
                text-align: center;
                z-index: 2147483647;
                animation: emergencyPulse 2s infinite;
            ">
                <div style="font-size: 4rem; margin-bottom: 20px;">🚫</div>
                <h1 style="font-size: 2.5rem; margin: 20px 0;">ACESSO PERMANENTEMENTE BLOQUEADO</h1>
                <p style="font-size: 1.3rem; margin: 10px 0;">Múltiplas violações de segurança detectadas</p>
                <p style="font-size: 1rem; margin: 10px 0; opacity: 0.9;">
                    Tentativas de bypass, downloads ilegais ou engenharia reversa
                </p>
                <div style="margin: 30px 0; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <p style="font-size: 0.9rem; margin: 5px 0;">
                        <strong>IP:</strong> Registrado para investigação
                    </p>
                    <p style="font-size: 0.9rem; margin: 5px 0;">
                        <strong>Timestamp:</strong> ${new Date().toISOString()}
                    </p>
                    <p style="font-size: 0.9rem; margin: 5px 0;">
                        <strong>Violações:</strong> ${this.getTotalViolations()}
                    </p>
                </div>
                <p style="font-size: 0.8rem; margin-top: 20px; opacity: 0.7;">
                    © Gabriel Malheiros de Castro - FAESA 2025-2<br/>
                    Portfólio protegido por direitos autorais
                </p>
            </div>
            <style>
                @keyframes emergencyPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }
            </style>
        `;

        document.body.appendChild(overlay);

        // Desabilitar todas as funcionalidades
        document.addEventListener('click', e => e.stopPropagation(), true);
        document.addEventListener('keydown', e => e.stopPropagation(), true);
        document.addEventListener('contextmenu', e => e.stopPropagation(), true);
    }

    /**
     * 📢 Mostrar alerta de segurança
     */
    showSecurityAlert(message) {
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            box-shadow: 0 6px 25px rgba(0,0,0,0.3);
            z-index: 999999;
            animation: slideDown 0.3s ease-out;
        `;
        alert.textContent = `🚨 ${message}`;

        document.body.appendChild(alert);

        setTimeout(() => {
            alert.style.animation = 'slideUp 0.3s ease-in';
            setTimeout(() => alert.remove(), 300);
        }, 4000);
    }

    /**
     * 📊 Obter total de violações
     */
    getTotalViolations() {
        return Array.from(this.violations.values()).reduce((sum, count) => sum + count, 0);
    }

    /**
     * 📈 Obter estatísticas de monitoramento
     */
    getStats() {
        return {
            isMonitoring: this.isMonitoring,
            totalViolations: this.getTotalViolations(),
            violationsByType: Object.fromEntries(this.violations),
            recentAlerts: this.alerts.slice(-10),
            config: this.config
        };
    }
}

// 🚀 Auto-inicialização
if (typeof window !== 'undefined') {
    window.securityMonitor = new SecurityMonitor();
    
    // Proteger a instância
    Object.freeze(window.securityMonitor);
    
    console.log('🕵️ Security Monitor ativo e monitorando violações!');
}

export default SecurityMonitor;