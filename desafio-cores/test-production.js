/**
 * 🧪 TESTE FINAL: Validação em Produção
 * Testa a funcionalidade no ambiente de produção
 */

console.log('🌐 TESTE EM PRODUÇÃO: Verificando funcionalidade do nome da cor');

class ProductionTest {
    constructor() {
        this.testCompleted = false;
        this.testResult = null;
    }

    async runProductionTest() {
        console.log('🚀 Iniciando teste em produção...');
        
        try {
            // Verificar se estamos em produção
            if (!window.location.hostname.includes('vercel.app')) {
                console.log('⚠️ Este teste é específico para produção (vercel.app)');
                return;
            }

            // Aguardar jogo carregar
            await this.waitForGameLoad();
            
            // Executar teste de 3 tentativas falhadas
            const result = await this.testThreeFailuresInProduction();
            
            this.showProductionTestResult(result);
            
        } catch (error) {
            console.error('❌ Erro no teste de produção:', error);
            this.showProductionTestResult({
                success: false,
                message: error.message,
                details: 'Erro durante execução do teste'
            });
        }
    }

    async waitForGameLoad() {
        console.log('⏳ Aguardando carregamento em produção...');
        
        let attempts = 0;
        const maxAttempts = 30; // Mais tempo em produção
        
        while (attempts < maxAttempts) {
            if (window.gameDebug && window.gameDebug.getGameState) {
                const state = window.gameDebug.getGameState();
                if (state && state.targetColor) {
                    console.log('✅ Jogo carregado em produção');
                    return;
                }
            }
            
            await this.wait(1000); // 1 segundo entre verificações
            attempts++;
        }
        
        throw new Error('Jogo não carregou em produção dentro do tempo limite');
    }

    async testThreeFailuresInProduction() {
        console.log('🧪 Testando 3 tentativas falhadas em produção...');
        
        // Aguardar jogo estar ativo
        await this.waitForCondition(() => {
            const state = window.gameDebug.getGameState();
            return state.isGameActive && state.gamePhase === 'playing';
        }, 15000);
        
        const gameState = window.gameDebug.getGameState();
        const targetColor = gameState.targetColor;
        console.log(`🎯 Cor alvo em produção: ${targetColor}`);
        
        const inputElement = document.getElementById('color-guess');
        const guessBtn = document.getElementById('guess-btn');
        const feedbackElement = document.getElementById('feedback-message');
        
        if (!inputElement || !guessBtn || !feedbackElement) {
            throw new Error('Elementos DOM não encontrados em produção');
        }
        
        // Fazer 3 tentativas incorretas
        const wrongGuesses = ['testfail1', 'testfail2', 'testfail3'];
        
        for (let i = 0; i < 3; i++) {
            console.log(`🔢 Produção - Tentativa ${i + 1}/3: ${wrongGuesses[i]}`);
            
            // Limpar input e inserir valor
            inputElement.value = '';
            await this.wait(200);
            inputElement.value = wrongGuesses[i];
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            await this.wait(500);
            
            // Clicar no botão
            guessBtn.click();
            
            // Aguardar processamento
            await this.wait(2000); // Mais tempo em produção
            
            const currentState = window.gameDebug.getGameState();
            console.log(`📊 Produção - Tentativas restantes: ${currentState.attemptsLeft}`);
        }
        
        // Aguardar mensagem de fim de jogo
        await this.wait(2000);
        
        // Verificar mensagem
        const feedbackText = feedbackElement.textContent || feedbackElement.innerText;
        console.log(`📝 Produção - Mensagem final: "${feedbackText}"`);
        
        const containsColorName = feedbackText.includes(targetColor);
        const containsGameOverText = feedbackText.includes('💀 Fim de jogo!') || feedbackText.includes('A cor era');
        
        if (containsColorName && containsGameOverText) {
            return {
                success: true,
                message: `SUCESSO: Nome da cor "${targetColor}" aparece corretamente`,
                details: feedbackText,
                targetColor: targetColor
            };
        } else {
            return {
                success: false,
                message: `FALHA: Nome da cor "${targetColor}" NÃO aparece`,
                details: feedbackText,
                targetColor: targetColor
            };
        }
    }

    showProductionTestResult(result) {
        this.testResult = result;
        this.testCompleted = true;
        
        // Log no console
        if (result.success) {
            console.log('🎉 TESTE EM PRODUÇÃO PASSOU!');
            console.log(`✅ ${result.message}`);
        } else {
            console.log('❌ TESTE EM PRODUÇÃO FALHOU!');
            console.log(`❌ ${result.message}`);
        }
        console.log(`📝 Detalhes: ${result.details}`);
        
        // Mostrar na tela
        this.showResultOnScreen(result);
        
        // Enviar para console global para fácil acesso
        window.productionTestResult = result;
    }

    showResultOnScreen(result) {
        // Criar overlay de resultado
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: ${result.success ? '#1f7a1f' : '#d32f2f'};
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            max-width: 600px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        `;
        
        content.innerHTML = `
            <h2 style="margin: 0 0 20px 0; font-size: 28px;">
                ${result.success ? '🎉' : '❌'} Teste em Produção
            </h2>
            <p style="font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">
                ${result.success ? 'PASSOU!' : 'FALHOU!'}
            </p>
            <p style="font-size: 16px; margin: 0 0 15px 0;">
                ${result.message}
            </p>
            <p style="font-size: 14px; margin: 0 0 25px 0; opacity: 0.9; font-style: italic;">
                "${result.details}"
            </p>
            <button onclick="this.parentElement.parentElement.remove()" 
                style="background: white; color: ${result.success ? '#1f7a1f' : '#d32f2f'}; 
                border: none; padding: 15px 30px; border-radius: 8px; 
                font-size: 16px; font-weight: bold; cursor: pointer;">
                Fechar
            </button>
        `;
        
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        // Remover automaticamente após 10 segundos
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 10000);
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

// Instância global
window.productionTest = new ProductionTest();

// Auto-executar em produção
if (window.location.hostname.includes('vercel.app')) {
    console.log('🌐 Ambiente de produção detectado - configurando teste automático');
    
    // Aguardar carregamento completo da página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                console.log('🚀 Executando teste automático em produção...');
                window.productionTest.runProductionTest();
            }, 5000); // 5 segundos para garantir que tudo carregou
        });
    } else {
        setTimeout(() => {
            console.log('🚀 Executando teste automático em produção...');
            window.productionTest.runProductionTest();
        }, 3000);
    }
}

console.log('✅ Teste de produção configurado. Use productionTest.runProductionTest() para executar manualmente.');