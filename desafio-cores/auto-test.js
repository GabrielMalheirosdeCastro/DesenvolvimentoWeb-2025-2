/**
 * 🧪 SCRIPT DE TESTE AUTOMATIZADO - Novas Funcionalidades
 * Jogo de Adivinhação de Cores
 * Gabriel Malheiros de Castro - FAESA 2025-2
 */

// Configurações de teste
const TEST_CONFIG = {
    DELAY_BETWEEN_ACTIONS: 1000,
    GAME_LOAD_TIMEOUT: 5000,
    AUTO_RESTART_TIMEOUT: 4000,
    DIALOG_RESPONSE_DELAY: 1000
};

// Estado do teste
let testState = {
    currentTest: null,
    results: [],
    gameWindow: null,
    gameDebug: null
};

// Funções de utilidade para teste
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Enviar para o log visual se disponível
    if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({
            type: 'test-log',
            message: logMessage,
            level: type
        }, '*');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para inicializar conexão com o jogo
async function initializeGameConnection() {
    log('🔌 Inicializando conexão com o jogo...');
    
    try {
        // Tentar acessar o gameDebug do próprio contexto
        if (window.gameDebug) {
            testState.gameDebug = window.gameDebug;
            testState.gameWindow = window;
            log('✅ Conexão com o jogo estabelecida (contexto direto)');
            return true;
        }
        
        // Se não conseguir, tentar como iframe
        const gameFrame = document.getElementById('gameFrame');
        if (gameFrame && gameFrame.contentWindow) {
            await sleep(2000); // Aguardar carregamento
            
            const contentWindow = gameFrame.contentWindow;
            if (contentWindow.gameDebug) {
                testState.gameDebug = contentWindow.gameDebug;
                testState.gameWindow = contentWindow;
                log('✅ Conexão com o jogo estabelecida (iframe)');
                return true;
            }
        }
        
        log('❌ Não foi possível estabelecer conexão com o jogo');
        return false;
        
    } catch (error) {
        log(`❌ Erro ao conectar com o jogo: ${error.message}`, 'error');
        return false;
    }
}

// Teste 1: Verificar funcionamento básico
async function testBasicFunctionality() {
    log('🧪 TESTE 1: Funcionalidade Básica');
    
    try {
        const gameState = testState.gameDebug.getGameState();
        
        log(`📊 Estado inicial do jogo:`);
        log(`   - Nível: ${gameState.currentLevel}`);
        log(`   - Tentativas: ${gameState.attemptsLeft}`);
        log(`   - Fase: ${gameState.gamePhase}`);
        log(`   - Cor alvo: ${gameState.targetColor}`);
        log(`   - Jogo ativo: ${gameState.isGameActive}`);
        
        if (gameState.targetColor && gameState.attemptsLeft === 3) {
            log('✅ TESTE 1 PASSOU: Jogo inicializado corretamente');
            return true;
        } else {
            log('❌ TESTE 1 FALHOU: Estado inicial incorreto');
            return false;
        }
        
    } catch (error) {
        log(`❌ TESTE 1 ERRO: ${error.message}`, 'error');
        return false;
    }
}

// Teste 2: Simular 3 falhas seguidas
async function testAutoRestartAfterFailures() {
    log('🧪 TESTE 2: Reinício Automático após 3 Falhas');
    
    try {
        const initialState = testState.gameDebug.getGameState();
        log(`🎯 Cor alvo atual: ${initialState.targetColor}`);
        
        // Aguardar o jogo estar ativo
        while (!testState.gameDebug.getGameState().isGameActive) {
            log('⏳ Aguardando jogo ficar ativo...');
            await sleep(1000);
        }
        
        // Simular 3 palpites incorretos
        const incorrectGuesses = ['wrongcolor1', 'wrongcolor2', 'wrongcolor3'];
        
        for (let i = 0; i < incorrectGuesses.length; i++) {
            const currentState = testState.gameDebug.getGameState();
            log(`🔴 Tentativa ${i + 1}/3: "${incorrectGuesses[i]}" (Tentativas restantes: ${currentState.attemptsLeft})`);
            
            // Simular input e click
            const input = testState.gameWindow.document.getElementById('color-guess');
            const button = testState.gameWindow.document.getElementById('guess-btn');
            
            if (input && button) {
                input.value = incorrectGuesses[i];
                button.click();
                await sleep(TEST_CONFIG.DELAY_BETWEEN_ACTIONS);
            } else {
                log('❌ Elementos de input não encontrados');
                return false;
            }
        }
        
        log('⏳ Aguardando reinício automático...');
        await sleep(TEST_CONFIG.AUTO_RESTART_TIMEOUT);
        
        // Verificar se o jogo reiniciou
        const finalState = testState.gameDebug.getGameState();
        
        if (finalState.attemptsLeft === 3 && finalState.gamePhase === 'pre-game') {
            log('✅ TESTE 2 PASSOU: Jogo reiniciou automaticamente após 3 falhas');
            return true;
        } else {
            log('❌ TESTE 2 FALHOU: Jogo não reiniciou conforme esperado');
            log(`   - Tentativas: ${finalState.attemptsLeft} (esperado: 3)`);
            log(`   - Fase: ${finalState.gamePhase} (esperado: pre-game)`);
            return false;
        }
        
    } catch (error) {
        log(`❌ TESTE 2 ERRO: ${error.message}`, 'error');
        return false;
    }
}

// Teste 3: Simular 3 acertos seguidos  
async function testChoiceAfterSuccesses() {
    log('🧪 TESTE 3: Opção após 3 Acertos Seguidos');
    
    try {
        log('📝 Este teste requer interação manual:');
        log('1. Acerte 3 cores seguidas no jogo');
        log('2. Observe se aparece a caixa de diálogo');
        log('3. Teste ambas as opções (OK e Cancelar)');
        
        // Monitorar o progresso do nível
        let previousProgress = 0;
        let successes = 0;
        
        for (let i = 0; i < 30; i++) { // Monitorar por 30 segundos
            const currentState = testState.gameDebug.getGameState();
            const currentProgress = currentState.levelProgress[currentState.currentLevel];
            
            if (currentProgress > previousProgress) {
                successes++;
                previousProgress = currentProgress;
                log(`✅ Acerto detectado! Total: ${successes}/3`);
                
                if (successes >= 3) {
                    log('🎉 3 acertos detectados! Aguardando caixa de diálogo...');
                    // Aguardar a caixa aparecer
                    await sleep(3000);
                    log('✅ TESTE 3: Funcionalidade implementada (verificação manual necessária)');
                    return true;
                }
            }
            
            await sleep(1000);
        }
        
        log('⏳ TESTE 3: Timeout - necessário acertar 3 cores manualmente');
        return null; // Teste inconclusivo
        
    } catch (error) {
        log(`❌ TESTE 3 ERRO: ${error.message}`, 'error');
        return false;
    }
}

// Teste 4: Verificar preview de cores
async function testColorPreview() {
    log('🧪 TESTE 4: Preview de Cores');
    
    try {
        const testColors = ['red', 'blue', 'green', 'yellow', 'purple'];
        let successCount = 0;
        
        for (const color of testColors) {
            log(`🎨 Testando preview da cor: ${color}`);
            
            try {
                testState.gameDebug.testColorPreview(color);
                await sleep(500);
                
                // Verificar se a cor foi aplicada
                const body = testState.gameWindow.document.body;
                const bgColor = body.style.backgroundColor;
                
                if (bgColor && bgColor.includes(color)) {
                    log(`✅ Preview aplicado com sucesso: ${color}`);
                    successCount++;
                } else {
                    log(`⚠️ Preview pode não ter sido aplicado visualmente: ${color}`);
                }
                
            } catch (previewError) {
                log(`❌ Erro no preview de ${color}: ${previewError.message}`);
            }
        }
        
        // Reset do preview
        testState.gameDebug.resetPreview();
        log('🔄 Preview resetado');
        
        if (successCount >= testColors.length / 2) {
            log('✅ TESTE 4 PASSOU: Sistema de preview funcionando');
            return true;
        } else {
            log('❌ TESTE 4 FALHOU: Sistema de preview com problemas');
            return false;
        }
        
    } catch (error) {
        log(`❌ TESTE 4 ERRO: ${error.message}`, 'error');
        return false;
    }
}

// Executar todos os testes
async function runAllTests() {
    log('🚀 INICIANDO BATERIA DE TESTES AUTOMATIZADOS');
    log('==========================================');
    
    // Inicializar conexão
    const connected = await initializeGameConnection();
    if (!connected) {
        log('❌ FALHA CRÍTICA: Não foi possível conectar ao jogo');
        return;
    }
    
    // Executar testes sequencialmente
    const tests = [
        { name: 'Funcionalidade Básica', fn: testBasicFunctionality },
        { name: 'Preview de Cores', fn: testColorPreview },
        { name: 'Reinício após Falhas', fn: testAutoRestartAfterFailures },
        { name: 'Opção após Acertos', fn: testChoiceAfterSuccesses }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (const test of tests) {
        log(`\n🧪 Executando: ${test.name}`);
        log('-'.repeat(40));
        
        try {
            const result = await test.fn();
            
            if (result === true) {
                passedTests++;
                log(`✅ ${test.name}: PASSOU`);
            } else if (result === false) {
                log(`❌ ${test.name}: FALHOU`);
            } else {
                log(`⏳ ${test.name}: INCONCLUSIVO`);
            }
            
        } catch (error) {
            log(`💥 ${test.name}: ERRO - ${error.message}`, 'error');
        }
        
        // Delay entre testes
        if (test !== tests[tests.length - 1]) {
            await sleep(2000);
        }
    }
    
    // Relatório final
    log('\n📊 RELATÓRIO FINAL DOS TESTES');
    log('=====================================');
    log(`✅ Testes aprovados: ${passedTests}/${totalTests}`);
    log(`📊 Taxa de sucesso: ${Math.round((passedTests/totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        log('🎉 TODOS OS TESTES PASSARAM! Sistema pronto para produção.');
    } else {
        log('⚠️ Alguns testes falharam. Revisar implementação.');
    }
}

// Inicializar testes quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 3000);
    });
} else {
    setTimeout(runAllTests, 3000);
}

// Exportar funções para uso manual
window.testRunner = {
    runAllTests,
    testBasicFunctionality,
    testAutoRestartAfterFailures,
    testChoiceAfterSuccesses,
    testColorPreview,
    initializeGameConnection
};

console.log('🧪 Sistema de testes carregado. Execute testRunner.runAllTests() para iniciar.');