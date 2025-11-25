/**
 * 🛡️ JAVASCRIPT FUNDAMENTALS - VERSÃO SEGURA
 * Melhorias de segurança e performance para a página de fundamentos
 * Autor: Gabriel Malheiros de Castro - FAESA 2025-2
 */

// ========================================
// 🔒 CONFIGURAÇÕES DE SEGURANÇA
// ========================================

const SECURITY_CONFIG = {
    MAX_INPUT_LENGTH: 100,
    RATE_LIMIT: 20,
    RATE_WINDOW: 60000, // 1 minuto
    ALLOWED_TAGS: [], // Lista vazia = não permite tags HTML
    SANITIZE_INPUTS: true
};

// Estado global protegido
const secureState = {
    rateLimitCalls: [],
    sessionStartTime: Date.now(),
    interactionCount: 0,
    errors: []
};

// ========================================
// 🛡️ FUNÇÕES DE SEGURANÇA
// ========================================

/**
 * Sanitizar entrada de dados
 */
function secureInput(input, type = 'text') {
    if (!SECURITY_CONFIG.SANITIZE_INPUTS) return input;
    if (typeof input !== 'string') return String(input);
    
    switch (type) {
        case 'html':
            return input
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        
        case 'number':
            const num = parseFloat(input);
            return isNaN(num) ? 0 : num;
        
        case 'name':
            return input
                .replace(/[<>\"'&]/g, '')
                .trim()
                .substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH);
        
        case 'text':
        default:
            return input
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '')
                .substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH);
    }
}

/**
 * Verificar rate limiting
 */
function checkSecureRateLimit() {
    const now = Date.now();
    const windowStart = now - SECURITY_CONFIG.RATE_WINDOW;
    
    // Limpar chamadas antigas
    secureState.rateLimitCalls = secureState.rateLimitCalls.filter(time => time > windowStart);
    
    if (secureState.rateLimitCalls.length >= SECURITY_CONFIG.RATE_LIMIT) {
        return false;
    }
    
    secureState.rateLimitCalls.push(now);
    return true;
}

/**
 * Validar elemento de saída
 */
function validateOutputElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`❌ Elemento ${elementId} não encontrado`);
        return null;
    }
    return element;
}

/**
 * Atualizar saída de forma segura
 */
function secureUpdateOutput(content, elementId = 'resultado') {
    const element = validateOutputElement(elementId);
    if (!element) return false;
    
    const secureContent = secureInput(content, 'html');
    element.innerHTML = secureContent;
    
    // Log da ação
    console.log(`✅ Saída atualizada: ${elementId}`);
    return true;
}

/**
 * Tratar erros de forma segura
 */
function handleSecureError(error, context = 'unknown') {
    const errorInfo = {
        message: error.message,
        context,
        timestamp: Date.now(),
        userAgent: navigator.userAgent.substring(0, 100)
    };
    
    secureState.errors.push(errorInfo);
    console.error('🚨 Erro capturado:', errorInfo);
    
    secureUpdateOutput('❌ Ocorreu um erro. Tente novamente.');
}

// ========================================
// 🎯 FUNÇÕES MELHORADAS COM SEGURANÇA
// ========================================

/**
 * Alert seguro com rate limiting
 */
function secureAlert() {
    if (!checkSecureRateLimit()) {
        secureUpdateOutput('⚠️ Muitas chamadas! Aguarde um momento.');
        return;
    }
    
    try {
        const message = '🎉 Alert Seguro! Desenvolvido por Gabriel Malheiros - FAESA 2025-2';
        window.alert(message);
        secureUpdateOutput('✅ Alert executado com segurança!');
        secureState.interactionCount++;
    } catch (error) {
        handleSecureError(error, 'secureAlert');
    }
}

/**
 * Prompt seguro com validação completa
 */
function securePrompt() {
    if (!checkSecureRateLimit()) {
        secureUpdateOutput('⚠️ Muitas chamadas! Aguarde um momento.');
        return;
    }
    
    try {
        const nome = window.prompt('Qual é o seu nome?', '');
        
        if (nome === null) {
            secureUpdateOutput('❌ Operação cancelada pelo usuário.');
            return;
        }
        
        const nomeSeguro = secureInput(nome, 'name');
        
        if (!nomeSeguro || nomeSeguro.trim() === '') {
            secureUpdateOutput('❌ Nome vazio ou inválido.');
            return;
        }
        
        if (nomeSeguro.length < 2) {
            secureUpdateOutput('❌ Nome muito curto! Use pelo menos 2 caracteres.');
            return;
        }
        
        secureUpdateOutput(`👋 Olá, ${nomeSeguro}! Bem-vindo ao sistema seguro!`);
        
        // Segunda interação opcional
        setTimeout(() => {
            const idade = window.prompt(`${nomeSeguro}, qual sua idade? (opcional)`, '');
            if (idade !== null && idade.trim() !== '') {
                const idadeSegura = secureInput(idade, 'number');
                if (idadeSegura > 0 && idadeSegura <= 120) {
                    const status = idadeSegura >= 18 ? 'maior de idade' : 'menor de idade';
                    const currentOutput = document.getElementById('resultado').innerHTML;
                    secureUpdateOutput(`${currentOutput}<br>🎂 Idade: ${idadeSegura} anos (${status})`);
                }
            }
        }, 500);
        
        secureState.interactionCount++;
        
    } catch (error) {
        handleSecureError(error, 'securePrompt');
    }
}

/**
 * Console.log melhorado com informações estruturadas
 */
function secureConsoleLog() {
    if (!checkSecureRateLimit()) {
        secureUpdateOutput('⚠️ Muitas chamadas! Aguarde um momento.');
        return;
    }
    
    try {
        const logData = {
            message: '📊 Log Seguro - Sistema de Demonstração',
            timestamp: new Date().toISOString(),
            session: {
                startTime: new Date(secureState.sessionStartTime).toISOString(),
                interactions: secureState.interactionCount,
                errors: secureState.errors.length
            },
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                cookiesEnabled: navigator.cookieEnabled
            },
            security: {
                rateLimitCalls: secureState.rateLimitCalls.length,
                inputSanitization: SECURITY_CONFIG.SANITIZE_INPUTS
            }
        };
        
        console.group('🛡️ Demonstração Console.log Seguro');
        console.log('📈 Dados da Sessão:', logData);
        console.log('🔒 Configurações de Segurança:', SECURITY_CONFIG);
        console.log('⚡ Performance:', {
            loadTime: performance.now(),
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
            } : 'N/A'
        });
        console.groupEnd();
        
        secureUpdateOutput('📊 Log seguro enviado para Console! Abra DevTools (F12) para ver.');
        secureState.interactionCount++;
        
    } catch (error) {
        handleSecureError(error, 'secureConsoleLog');
    }
}

/**
 * Demonstração de document.write com proteções
 */
function secureDocumentWrite() {
    if (!checkSecureRateLimit()) {
        secureUpdateOutput('⚠️ Muitas chamadas! Aguarde um momento.');
        return;
    }
    
    try {
        const confirmed = window.confirm(
            '⚠️ AVISO EDUCATIVO: document.write() substitui todo o conteúdo da página.\n' +
            'Esta demonstração é apenas educativa e inclui proteções.\n' +
            'Em produção, use innerHTML, textContent ou DOM APIs.\n\n' +
            'Deseja continuar com a demonstração?'
        );
        
        if (!confirmed) {
            secureUpdateOutput('✅ Demonstração cancelada. Boa escolha para produção!');
            return;
        }
        
        // Criar página temporária mais segura
        const secureHTML = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Demonstração Segura - document.write()</title>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-align: center;
                        padding: 2rem;
                        margin: 0;
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background: rgba(255,255,255,0.1);
                        padding: 2rem;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                    }
                    .btn {
                        background: #4ade80;
                        color: white;
                        padding: 15px 30px;
                        border: none;
                        border-radius: 10px;
                        font-size: 16px;
                        cursor: pointer;
                        margin: 10px;
                        transition: all 0.3s ease;
                    }
                    .btn:hover { background: #22c55e; transform: translateY(-2px); }
                    .warning { 
                        background: rgba(255,193,7,0.2); 
                        padding: 1rem; 
                        border-radius: 10px; 
                        margin: 1rem 0;
                        border-left: 4px solid #ffc107;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🛡️ Demonstração Segura de document.write()</h1>
                    <p><strong>Página substituída com sucesso!</strong></p>
                    <p>📅 Gerada em: ${new Date().toLocaleString('pt-BR')}</p>
                    
                    <div class="warning">
                        <h3>⚠️ Importante:</h3>
                        <p>Esta demonstração foi criada de forma educativa. Em aplicações reais:</p>
                        <ul style="text-align: left; display: inline-block;">
                            <li>✅ Use <code>innerHTML</code> ou <code>textContent</code></li>
                            <li>✅ Utilize APIs modernas do DOM</li>
                            <li>✅ Prefira frameworks como React/Vue</li>
                            <li>❌ Evite <code>document.write()</code></li>
                        </ul>
                    </div>
                    
                    <button class="btn" onclick="history.back()">🔙 Voltar</button>
                    <button class="btn" onclick="location.reload()">🔄 Recarregar</button>
                    
                    <p style="font-size: 0.9em; margin-top: 2rem; opacity: 0.8;">
                        👨‍🎓 Gabriel Malheiros de Castro - FAESA 2025-2<br>
                        📚 Desenvolvimento Web - Demonstração Educativa
                    </p>
                </div>
            </body>
            </html>
        `;
        
        document.write(secureHTML);
        
    } catch (error) {
        handleSecureError(error, 'secureDocumentWrite');
    }
}

// ========================================
// 🎯 FUNÇÕES DE CONCEITOS FUNDAMENTAIS
// ========================================

/**
 * Demonstração segura de variáveis
 */
function demonstrarVariaveisSeguras() {
    try {
        let resultado = '<strong>🔢 Demonstração de Variáveis Seguras:</strong><br><br>';
        
        // Variáveis com validação
        const nome = 'Gabriel Malheiros';
        const idade = 25;
        const estudante = true;
        const nota = 9.5;
        
        resultado += `📝 Nome (string): ${secureInput(nome, 'text')}<br>`;
        resultado += `🎂 Idade (number): ${secureInput(idade.toString(), 'number')}<br>`;
        resultado += `👨‍🎓 É estudante (boolean): ${estudante ? 'Sim' : 'Não'}<br>`;
        resultado += `📊 Nota (float): ${nota.toFixed(1)}<br><br>`;
        
        resultado += '<strong>🔍 Verificações de Tipo:</strong><br>';
        resultado += `typeof nome: ${typeof nome}<br>`;
        resultado += `typeof idade: ${typeof idade}<br>`;
        resultado += `typeof estudante: ${typeof estudante}<br>`;
        resultado += `typeof nota: ${typeof nota}`;
        
        secureUpdateOutput(resultado, 'resultado-conceitos');
        
    } catch (error) {
        handleSecureError(error, 'demonstrarVariaveisSeguras');
    }
}

/**
 * Calculadora segura
 */
function calculadoraSegura() {
    try {
        const num1 = window.prompt('Digite o primeiro número:', '10');
        if (num1 === null) return;
        
        const num2 = window.prompt('Digite o segundo número:', '5');
        if (num2 === null) return;
        
        const n1 = secureInput(num1, 'number');
        const n2 = secureInput(num2, 'number');
        
        if (isNaN(n1) || isNaN(n2)) {
            secureUpdateOutput('❌ Por favor, digite apenas números válidos!', 'resultado-conceitos');
            return;
        }
        
        let resultado = '<strong>🧮 Calculadora Segura:</strong><br><br>';
        resultado += `Número 1: ${n1}<br>`;
        resultado += `Número 2: ${n2}<br><br>`;
        resultado += `➕ Soma: ${n1 + n2}<br>`;
        resultado += `➖ Subtração: ${n1 - n2}<br>`;
        resultado += `✖️ Multiplicação: ${n1 * n2}<br>`;
        resultado += `➗ Divisão: ${n2 !== 0 ? (n1 / n2).toFixed(2) : 'Impossível (divisão por zero)'}<br>`;
        resultado += `📊 Resto: ${n2 !== 0 ? n1 % n2 : 'Impossível (divisão por zero)'}`;
        
        secureUpdateOutput(resultado, 'resultado-conceitos');
        
    } catch (error) {
        handleSecureError(error, 'calculadoraSegura');
    }
}

/**
 * Teste de idade seguro
 */
function testeIdadeSeguro() {
    try {
        const idade = window.prompt('Quantos anos você tem?', '18');
        if (idade === null) return;
        
        const idadeNum = secureInput(idade, 'number');
        
        if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 120) {
            secureUpdateOutput('❌ Por favor, digite uma idade válida (0-120)!', 'resultado-conceitos');
            return;
        }
        
        let resultado = '<strong>🎯 Teste de Idade Seguro:</strong><br><br>';
        resultado += `Sua idade: ${idadeNum} anos<br><br>`;
        
        if (idadeNum < 13) {
            resultado += '👶 Classificação: Criança<br>';
            resultado += '🎮 Recomendação: Jogos educativos';
        } else if (idadeNum < 18) {
            resultado += '👦👧 Classificação: Adolescente<br>';
            resultado += '📚 Recomendação: Foque nos estudos!';
        } else if (idadeNum < 60) {
            resultado += '👨👩 Classificação: Adulto<br>';
            resultado += '💼 Recomendação: Desenvolva sua carreira!';
        } else {
            resultado += '👴👵 Classificação: Idoso<br>';
            resultado += '🌟 Recomendação: Aproveite a experiência!';
        }
        
        secureUpdateOutput(resultado, 'resultado-conceitos');
        
    } catch (error) {
        handleSecureError(error, 'testeIdadeSeguro');
    }
}

/**
 * Contador seguro
 */
function contadorSeguro() {
    try {
        let resultado = '<strong>🔄 Contador Seguro de 1 a 10:</strong><br><br>';
        
        // Loop controlado com limite de segurança
        const limite = 10;
        let soma = 0;
        let pares = [];
        
        for (let i = 1; i <= limite; i++) {
            if (i <= 5) {
                resultado += `• Contando: ${i}<br>`;
            } else if (i === 6) {
                resultado += `• ... (continuando até ${limite})<br>`;
            }
            
            soma += i;
            if (i % 2 === 0 && i <= 20) {
                pares.push(i);
            }
        }
        
        resultado += `<br><strong>📊 Resultados:</strong><br>`;
        resultado += `• Contagem completa: 1 até ${limite}<br>`;
        resultado += `• Soma total: ${soma}<br>`;
        resultado += `• Números pares encontrados: ${pares.join(', ')}<br>`;
        resultado += `• Total de iterações: ${limite}`;
        
        secureUpdateOutput(resultado, 'resultado-conceitos');
        
    } catch (error) {
        handleSecureError(error, 'contadorSeguro');
    }
}

// ========================================
// 🚀 INICIALIZAÇÃO E UTILITÁRIOS
// ========================================

/**
 * Instruções seguras para DevTools
 */
function instrucoesDev() {
    console.group('🛠️ Instruções para DevTools');
    console.log('1️⃣ Para abrir o DevTools:');
    console.log('   • Windows/Linux: Ctrl + Shift + I ou F12');
    console.log('   • Mac: Cmd + Option + I');
    console.log('   • Botão direito → Inspecionar elemento');
    console.log('');
    console.log('2️⃣ Abas importantes:');
    console.log('   • Console: Ver logs e executar JavaScript');
    console.log('   • Elements: Inspecionar HTML/CSS');
    console.log('   • Network: Monitorar requests');
    console.log('   • Application: LocalStorage, Cookies, etc.');
    console.log('');
    console.log('3️⃣ Dicas de segurança:');
    console.log('   • Nunca execute código desconhecido');
    console.log('   • Cuidado com informações sensíveis');
    console.log('   • Use para aprendizado e debug apenas');
    console.groupEnd();
    
    secureUpdateOutput('🛠️ Instruções enviadas para Console! Confira o DevTools.');
}

/**
 * Simular erro controlado para demonstração
 */
function simularErroControlado() {
    try {
        console.log('🧪 Simulando erro controlado para fins educativos...');
        
        // Simular diferentes tipos de erro
        const tipoErro = Math.floor(Math.random() * 3);
        
        switch (tipoErro) {
            case 0:
                throw new Error('Erro simulado: Variável não definida');
            case 1:
                throw new TypeError('Erro simulado: Tipo incorreto');
            case 2:
                throw new RangeError('Erro simulado: Valor fora do intervalo');
        }
        
    } catch (error) {
        console.log('✅ Erro capturado com sucesso!');
        console.log('📊 Detalhes do erro:', {
            name: error.name,
            message: error.message,
            stack: error.stack?.split('\n')[0]
        });
        
        secureUpdateOutput(
            `🐛 Erro simulado capturado: ${error.name}<br>` +
            `📝 Mensagem: ${secureInput(error.message)}<br>` +
            `✅ Sistema funcionando corretamente!`
        );
    }
}

/**
 * Obter estatísticas da sessão
 */
function obterEstatisticas() {
    return {
        sessionDuration: Date.now() - secureState.sessionStartTime,
        interactions: secureState.interactionCount,
        errors: secureState.errors.length,
        rateLimitCalls: secureState.rateLimitCalls.length,
        securityConfig: SECURITY_CONFIG
    };
}

// ========================================
// 🎯 INICIALIZAÇÃO DO SISTEMA
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛡️ Sistema JavaScript Seguro inicializado!');
    console.log('👨‍🎓 Autor: Gabriel Malheiros de Castro');
    console.log('🏫 Instituição: FAESA - 2025-2');
    console.log('📚 Disciplina: Desenvolvimento Web');
    console.log('');
    console.log('🔒 Configurações de segurança ativas:');
    console.log('   • Rate limiting ativo');
    console.log('   • Sanitização de inputs habilitada');
    console.log('   • Validação de dados implementada');
    console.log('   • Tratamento de erros ativo');
});

// Expor funções globais para uso na página
window.secureJSFunctions = {
    alert: secureAlert,
    prompt: securePrompt,
    consoleLog: secureConsoleLog,
    documentWrite: secureDocumentWrite,
    variaveis: demonstrarVariaveisSeguras,
    calculadora: calculadoraSegura,
    testeIdade: testeIdadeSeguro,
    contador: contadorSeguro,
    devTools: instrucoesDev,
    erroSimulado: simularErroControlado,
    stats: obterEstatisticas
};

console.log('✅ Funções seguras disponíveis em: window.secureJSFunctions');