/**
 * 🧪 TESTE AUTOMATIZADO: Verificação do Nome da Cor após 3 Tentativas
 * Testa especificamente se o nome da cor aparece após esgotar as tentativas
 */

console.log('🧪 INICIANDO TESTE: Nome da cor após 3 tentativas falhadas');

class TestShowColorName {
    constructor() {
        this.testsPassed = 0;
        this.totalTests = 0;
        this.isTestRunning = false;
        this.testResults = [];
    }

    async runAllTests() {
        if (this.isTestRunning) {
            console.log('⚠️ Teste já está em execução');
            return;
        }

        console.log('🚀 Iniciando bateria de testes...');
        this.isTestRunning = true;
        this.testsPassed = 0;
        this.totalTests = 0;
        this.testResults = [];

        try {
            // Aguardar jogo carregar
            await this.waitForGameLoad();
            
            // Teste 1: Verificar se mostra nome da cor após 3 tentativas falhadas
            await this.testColorNameAfterThreeFailures();
            
            // Teste 2: Verificar se não mostra nome da cor em tentativas intermediárias
            await this.testNoColorNameDuringGame();
            
            // Teste 3: Verificar se o jogo reinicia automaticamente
            await this.testAutoRestart();
            
            this.showFinalResults();
            
        } catch (error) {
            console.error('❌ Erro durante os testes:', error);
            this.addTestResult('Erro geral', false, error.message);
            this.showFinalResults();
        } finally {
            this.isTestRunning = false;
        }
    }

    async waitForGameLoad() {
        console.log('⏳ Aguardando carregamento do jogo...');
        
        let attempts = 0;
        const maxAttempts = 20;
        
        while (attempts < maxAttempts) {
            if (window.gameDebug && window.gameDebug.getGameState) {
                const state = window.gameDebug.getGameState();
                if (state && state.targetColor) {
                    console.log('✅ Jogo carregado com sucesso');
                    return;
                }
            }
            
            await this.wait(500);
            attempts++;
        }
        
        throw new Error('Jogo não carregou dentro do tempo limite');
    }

    async testColorNameAfterThreeFailures() {
        console.log('\n🧪 TESTE 1: Nome da cor após 3 tentativas falhadas');
        this.totalTests++;
        
        try {
            // Aguardar jogo estar ativo
            await this.waitForCondition(() => {
                const state = window.gameDebug.getGameState();
                return state.isGameActive && state.gamePhase === 'playing';
            }, 10000);
            
            const gameState = window.gameDebug.getGameState();
            const targetColor = gameState.targetColor;
            console.log(`🎯 Cor alvo detectada: ${targetColor}`);
            
            const inputElement = document.getElementById('color-guess');
            const guessBtn = document.getElementById('guess-btn');
            const feedbackElement = document.getElementById('feedback-message');
            
            if (!inputElement || !guessBtn || !feedbackElement) {
                throw new Error('Elementos DOM necessários não encontrados');
            }
            
            // Fazer 3 tentativas incorretas
            const wrongGuesses = ['wrongcolor1', 'wrongcolor2', 'wrongcolor3'];
            
            for (let i = 0; i < 3; i++) {
                console.log(`🔢 Tentativa ${i + 1}/3: ${wrongGuesses[i]}`);
                
                inputElement.value = wrongGuesses[i];
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Aguardar um momento para estabilizar
                await this.wait(300);
                
                guessBtn.click();
                
                // Aguardar processamento da tentativa
                await this.wait(1000);
                
                const currentState = window.gameDebug.getGameState();
                console.log(`📊 Tentativas restantes: ${currentState.attemptsLeft}`);
            }
            
            // Aguardar mensagem de fim de jogo aparecer
            await this.wait(1000);
            
            // Verificar se a mensagem contém o nome da cor
            const feedbackText = feedbackElement.textContent;
            console.log(`📝 Mensagem de feedback: "${feedbackText}"`);
            
            const containsColorName = feedbackText.includes(targetColor);
            const containsGameOverText = feedbackText.includes('💀 Fim de jogo!');
            
            if (containsColorName && containsGameOverText) {
                console.log('✅ SUCESSO: Nome da cor aparece na mensagem de fim de jogo');
                this.addTestResult('Nome da cor após 3 tentativas', true, `Nome "${targetColor}" encontrado na mensagem`);
                this.testsPassed++;
            } else {
                console.log('❌ FALHA: Nome da cor NÃO aparece na mensagem de fim de jogo');
                this.addTestResult('Nome da cor após 3 tentativas', false, `Esperado "${targetColor}" na mensagem: "${feedbackText}"`);
            }
            
        } catch (error) {
            console.error('❌ Erro no teste 1:', error);
            this.addTestResult('Nome da cor após 3 tentativas', false, error.message);
        }
    }

    async testNoColorNameDuringGame() {
        console.log('\n🧪 TESTE 2: Nome da cor NÃO aparece durante tentativas intermediárias');
        this.totalTests++;
        
        try {
            // Aguardar o jogo reiniciar automaticamente
            console.log('⏳ Aguardando reinício automático do jogo...');
            await this.waitForCondition(() => {
                const state = window.gameDebug.getGameState();
                return state.isGameActive && state.gamePhase === 'playing' && state.attemptsLeft === 3;
            }, 15000);
            
            const gameState = window.gameDebug.getGameState();
            const targetColor = gameState.targetColor;
            console.log(`🎯 Nova cor alvo: ${targetColor}`);
            
            const inputElement = document.getElementById('color-guess');
            const guessBtn = document.getElementById('guess-btn');
            const feedbackElement = document.getElementById('feedback-message');
            
            // Fazer 1 tentativa incorreta (não a última)
            console.log('🔢 Fazendo 1 tentativa incorreta...');
            inputElement.value = 'wrongcolor';
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(300);
            
            guessBtn.click();
            await this.wait(1000);
            
            // Verificar se a mensagem NÃO contém o nome da cor
            const feedbackText = feedbackElement.textContent;
            console.log(`📝 Mensagem após 1 tentativa: "${feedbackText}"`);
            
            const containsColorName = feedbackText.includes(targetColor);
            
            if (!containsColorName) {
                console.log('✅ SUCESSO: Nome da cor NÃO aparece durante tentativas intermediárias');
                this.addTestResult('Não mostrar nome durante jogo', true, 'Nome da cor não revelado prematuramente');
                this.testsPassed++;
            } else {
                console.log('❌ FALHA: Nome da cor aparece prematuramente durante o jogo');
                this.addTestResult('Não mostrar nome durante jogo', false, `Nome "${targetColor}" apareceu prematuramente: "${feedbackText}"`);
            }
            
        } catch (error) {
            console.error('❌ Erro no teste 2:', error);
            this.addTestResult('Não mostrar nome durante jogo', false, error.message);
        }
    }

    async testAutoRestart() {
        console.log('\n🧪 TESTE 3: Jogo reinicia automaticamente após mostrar nome da cor');
        this.totalTests++;
        
        try {
            // Primeiro, vamos para fim de jogo novamente
            const inputElement = document.getElementById('color-guess');
            const guessBtn = document.getElementById('guess-btn');
            
            // Completar as tentativas restantes
            const currentState = window.gameDebug.getGameState();
            const remainingAttempts = currentState.attemptsLeft;
            console.log(`🔢 Tentativas restantes: ${remainingAttempts}`);
            
            for (let i = 0; i < remainingAttempts; i++) {
                console.log(`🔢 Tentativa final ${i + 1}/${remainingAttempts}`);
                inputElement.value = `wrongfinal${i}`;
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                await this.wait(300);
                
                guessBtn.click();
                await this.wait(1000);
            }
            
            // Aguardar reinício automático
            console.log('⏳ Aguardando reinício automático...');
            
            const restartStartTime = Date.now();
            let restarted = false;
            
            // Aguardar até 10 segundos pelo reinício
            while (Date.now() - restartStartTime < 10000) {
                await this.wait(500);
                const state = window.gameDebug.getGameState();
                
                if (state.isGameActive && state.gamePhase === 'playing' && state.attemptsLeft === 3) {
                    restarted = true;
                    break;
                }
            }
            
            if (restarted) {
                console.log('✅ SUCESSO: Jogo reiniciou automaticamente');
                this.addTestResult('Reinício automático', true, 'Jogo reiniciou corretamente após fim de jogo');
                this.testsPassed++;
            } else {
                console.log('❌ FALHA: Jogo NÃO reiniciou automaticamente');
                this.addTestResult('Reinício automático', false, 'Jogo não reiniciou dentro do tempo esperado');
            }
            
        } catch (error) {
            console.error('❌ Erro no teste 3:', error);
            this.addTestResult('Reinício automático', false, error.message);
        }
    }

    addTestResult(testName, passed, details) {
        this.testResults.push({ testName, passed, details });
    }

    showFinalResults() {
        console.log('\n📊 ===== RESULTADOS FINAIS DOS TESTES =====');
        console.log(`🎯 Testes Realizados: ${this.totalTests}`);
        console.log(`✅ Testes Aprovados: ${this.testsPassed}`);
        console.log(`❌ Testes Falhados: ${this.totalTests - this.testsPassed}`);
        console.log(`📈 Taxa de Sucesso: ${this.totalTests > 0 ? Math.round((this.testsPassed / this.totalTests) * 100) : 0}%`);
        
        console.log('\n📋 Detalhes dos Testes:');
        this.testResults.forEach((result, index) => {
            const icon = result.passed ? '✅' : '❌';
            console.log(`${icon} ${index + 1}. ${result.testName}`);
            console.log(`   ${result.details}\n`);
        });
        
        if (this.testsPassed === this.totalTests) {
            console.log('🎉 TODOS OS TESTES PASSARAM! A funcionalidade está funcionando corretamente.');
        } else {
            console.log('⚠️ Alguns testes falharam. Verifique os detalhes acima.');
        }
        
        // Mostrar informações na tela também
        this.showResultsOnScreen();
    }

    showResultsOnScreen() {
        // Criar div de resultados se não existir
        let resultsDiv = document.getElementById('test-results');
        if (!resultsDiv) {
            resultsDiv = document.createElement('div');
            resultsDiv.id = 'test-results';
            resultsDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                max-width: 400px;
                z-index: 1000;
                font-family: monospace;
                font-size: 12px;
            `;
            document.body.appendChild(resultsDiv);
        }
        
        const resultHtml = `
            <h3>🧪 Resultados dos Testes</h3>
            <p><strong>Aprovados:</strong> ${this.testsPassed}/${this.totalTests}</p>
            <p><strong>Taxa:</strong> ${this.totalTests > 0 ? Math.round((this.testsPassed / this.totalTests) * 100) : 0}%</p>
            <hr>
            ${this.testResults.map((result, index) => 
                `<div style="margin-bottom: 10px;">
                    <strong>${result.passed ? '✅' : '❌'} ${result.testName}</strong><br>
                    <small style="color: #ccc;">${result.details}</small>
                </div>`
            ).join('')}
            <button onclick="testShowColorName.runAllTests()" style="margin-top: 10px; padding: 5px 10px;">🔄 Repetir Testes</button>
        `;
        
        resultsDiv.innerHTML = resultHtml;
    }

    async waitForCondition(condition, timeoutMs = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            if (condition()) {
                return true;
            }
            await this.wait(100);
        }
        throw new Error(`Timeout: Condição não foi atendida em ${timeoutMs}ms`);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Instancia global para os testes
window.testShowColorName = new TestShowColorName();

// Auto-executar testes em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', function() {
        // Aguardar 3 segundos para tudo carregar, então iniciar testes
        setTimeout(() => {
            console.log('🚀 Iniciando testes automaticamente em 2 segundos...');
            setTimeout(() => {
                window.testShowColorName.runAllTests();
            }, 2000);
        }, 3000);
    });
}

console.log('✅ Sistema de testes carregado. Use testShowColorName.runAllTests() para executar.');