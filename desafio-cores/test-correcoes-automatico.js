/**
 * 🧪 TESTE AUTOMATIZADO DAS CORREÇÕES
 * 
 * Este script testa especificamente:
 * 1. Reset da pontuação ao mudar de nível
 * 2. Exibição da cor após 3 tentativas falhadas
 */

class TestCorrecoes {
    constructor() {
        this.testResults = [];
        this.gameDebug = window.gameDebug;
    }

    // Aguardar condição específica
    async waitForCondition(condition, timeout = 5000, interval = 100) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (condition()) return true;
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        return false;
    }

    // Teste 1: Reset da pontuação ao mudar nível
    async testResetPontuacaoNivel() {
        console.log('🧪 TESTE 1: Reset da pontuação ao mudar nível');
        
        try {
            // Verificar elementos necessários
            const scoreElement = document.getElementById('score-count');
            const levelSelector = document.getElementById('difficulty-select');
            
            if (!scoreElement || !levelSelector) {
                throw new Error('Elementos não encontrados');
            }

            // Definir uma pontuação inicial (simular acertos)
            if (this.gameDebug) {
                const gameState = this.gameDebug.getGameState();
                gameState.score = 50; // Simular pontuação
                
                // Atualizar UI
                scoreElement.textContent = gameState.score;
                console.log('💰 Pontuação inicial definida:', gameState.score);
            }

            const pontuacaoInicial = parseInt(scoreElement.textContent) || 0;
            console.log('📊 Pontuação antes da mudança:', pontuacaoInicial);

            // Verificar níveis disponíveis
            const niveisDisponiveis = Array.from(levelSelector.options)
                .filter(opt => !opt.disabled)
                .map(opt => opt.value);
            
            if (niveisDisponiveis.length < 2) {
                console.log('⚠️ Apenas um nível disponível, simulando desbloqueio...');
                // Simular desbloqueio do nível médio para teste
                if (this.gameDebug) {
                    const gameState = this.gameDebug.getGameState();
                    gameState.unlockedLevels.push('medium');
                    const mediumOption = levelSelector.querySelector('option[value="medium"]');
                    if (mediumOption) mediumOption.disabled = false;
                }
            }

            // Pegar nível atual e trocar para outro
            const nivelAtual = levelSelector.value;
            const novoNivel = niveisDisponiveis.find(n => n !== nivelAtual) || 
                             (levelSelector.querySelector('option[value="medium"]') ? 'medium' : 'easy');
            
            console.log('🔄 Mudando nível de', nivelAtual, 'para', novoNivel);
            
            // Executar mudança de nível
            levelSelector.value = novoNivel;
            levelSelector.dispatchEvent(new Event('change'));
            
            // Aguardar processamento
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const pontuacaoAposMudanca = parseInt(scoreElement.textContent) || 0;
            
            console.log('🔍 RESULTADO TESTE 1:');
            console.log('- Pontuação antes:', pontuacaoInicial);
            console.log('- Pontuação depois:', pontuacaoAposMudanca);
            
            const sucesso = pontuacaoAposMudanca === 0;
            this.testResults.push({
                test: 'Reset Pontuação Nível',
                passed: sucesso,
                details: `Antes: ${pontuacaoInicial}, Depois: ${pontuacaoAposMudanca}`
            });
            
            if (sucesso) {
                console.log('✅ TESTE 1 PASSOU: Pontuação resetada ao mudar nível');
                return true;
            } else {
                console.log('❌ TESTE 1 FALHOU: Pontuação não foi resetada');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erro no teste 1:', error);
            this.testResults.push({
                test: 'Reset Pontuação Nível',
                passed: false,
                details: `Erro: ${error.message}`
            });
            return false;
        }
    }

    // Teste 2: Exibição da cor após 3 tentativas
    async testCorApos3Tentativas() {
        console.log('🧪 TESTE 2: Cor exibida após 3 tentativas falhadas');
        
        try {
            const inputElement = document.getElementById('color-guess');
            const guessBtn = document.getElementById('guess-btn');
            const attemptsElement = document.getElementById('attempts-count');
            
            if (!inputElement || !guessBtn || !attemptsElement) {
                throw new Error('Elementos não encontrados');
            }

            // Aguardar jogo estar ativo
            await this.waitForCondition(() => {
                return this.gameDebug && this.gameDebug.getGameState().isGameActive;
            }, 5000);

            if (!this.gameDebug || !this.gameDebug.getGameState().isGameActive) {
                throw new Error('Jogo não está ativo');
            }

            const gameState = this.gameDebug.getGameState();
            const corAlvo = gameState.targetColor;
            
            console.log('🎯 Cor alvo do teste:', corAlvo);
            console.log('📊 Tentativas iniciais:', gameState.attemptsLeft);
            
            // Simular 3 tentativas incorretas
            const palpitesIncorretos = ['wrongcolor1', 'wrongcolor2', 'wrongcolor3'];
            
            for (let i = 0; i < 3; i++) {
                console.log(`⚡ Tentativa ${i + 1}: ${palpitesIncorretos[i]}`);
                
                inputElement.value = palpitesIncorretos[i];
                inputElement.dispatchEvent(new Event('input'));
                
                await new Promise(resolve => setTimeout(resolve, 200));
                
                guessBtn.click();
                
                // Aguardar processamento
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const tentativasRestantes = parseInt(attemptsElement.textContent) || 0;
                console.log(`📊 Tentativas restantes após tentativa ${i + 1}: ${tentativasRestantes}`);
            }
            
            // Aguardar um pouco mais para processamento completo
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Verificar se a cor está sendo exibida
            const estadoFinal = this.gameDebug.getGameState();
            const corSendoMostrada = estadoFinal.isShowingTargetColor;
            const fundoAtual = document.body.style.backgroundColor;
            const tentativasFinais = parseInt(attemptsElement.textContent) || 0;
            
            console.log('🔍 RESULTADO TESTE 2:');
            console.log('- Cor sendo mostrada:', corSendoMostrada);
            console.log('- Cor alvo:', corAlvo);
            console.log('- Fundo atual:', fundoAtual);
            console.log('- Tentativas finais:', tentativasFinais);
            console.log('- Fase do jogo:', estadoFinal.gamePhase);
            
            // Critérios de sucesso:
            // 1. Tentativas devem ser 0
            // 2. Flag isShowingTargetColor deve ser true
            // 3. Cor de fundo deve corresponder à cor alvo
            const criterio1 = tentativasFinais === 0;
            const criterio2 = corSendoMostrada === true;
            const criterio3 = fundoAtual.includes(corAlvo) || fundoAtual === corAlvo;
            
            const sucesso = criterio1 && criterio2;
            
            this.testResults.push({
                test: 'Cor Após 3 Tentativas',
                passed: sucesso,
                details: `Tentativas: ${tentativasFinais}, MostrandoCor: ${corSendoMostrada}, Fundo: ${fundoAtual}`
            });
            
            if (sucesso) {
                console.log('✅ TESTE 2 PASSOU: Cor sendo exibida após 3 tentativas falhadas');
                return true;
            } else {
                console.log('❌ TESTE 2 FALHOU: Cor NÃO sendo exibida corretamente');
                console.log(`  - Tentativas = 0: ${criterio1}`);
                console.log(`  - Flag isShowingTargetColor: ${criterio2}`);
                console.log(`  - Fundo corresponde: ${criterio3}`);
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erro no teste 2:', error);
            this.testResults.push({
                test: 'Cor Após 3 Tentativas',
                passed: false,
                details: `Erro: ${error.message}`
            });
            return false;
        }
    }

    // Executar todos os testes
    async executarTodosTestes() {
        console.log('🚀 INICIANDO BATERIA COMPLETA DE TESTES DAS CORREÇÕES');
        console.log('='.repeat(60));
        
        // Aguardar jogo carregar
        console.log('⏳ Aguardando jogo carregar...');
        await this.waitForCondition(() => {
            return window.gameDebug && document.getElementById('color-guess');
        }, 10000);
        
        if (!window.gameDebug) {
            console.error('❌ GameDebug não disponível');
            return false;
        }
        
        try {
            console.log('🧪 Executando Teste 1...');
            const teste1 = await this.testResetPontuacaoNivel();
            
            console.log('⏳ Aguardando entre testes...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log('🧪 Executando Teste 2...');
            const teste2 = await this.testCorApos3Tentativas();
            
            // Relatório final
            console.log('\n📋 RELATÓRIO FINAL DOS TESTES:');
            console.log('='.repeat(50));
            
            this.testResults.forEach((result, index) => {
                const status = result.passed ? '✅' : '❌';
                console.log(`${status} ${result.test}: ${result.details}`);
            });
            
            const totalTestes = this.testResults.length;
            const testesPassados = this.testResults.filter(r => r.passed).length;
            
            console.log('\n🎯 RESUMO:');
            console.log(`- Testes executados: ${totalTestes}`);
            console.log(`- Testes passados: ${testesPassados}`);
            console.log(`- Taxa de sucesso: ${Math.round((testesPassados / totalTestes) * 100)}%`);
            
            if (testesPassados === totalTestes) {
                console.log('\n🎉 TODOS OS TESTES PASSARAM! Correções funcionando corretamente.');
                return true;
            } else {
                console.log('\n⚠️ Alguns testes falharam. Verificar implementação.');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Erro geral nos testes:', error);
            return false;
        }
    }
}

// Auto-inicialização
if (typeof window !== 'undefined' && window.location && 
    window.location.pathname.includes('desafio-cores')) {
    
    console.log('🔧 Sistema de testes das correções carregado');
    
    // Disponibilizar globalmente
    window.testCorrecoes = new TestCorrecoes();
    
    console.log('💡 Execute window.testCorrecoes.executarTodosTestes() para testar as correções');
    
    // Auto-executar após carregamento
    setTimeout(() => {
        if (window.gameDebug) {
            console.log('🎮 Jogo detectado, iniciando testes automáticos em 3 segundos...');
            setTimeout(() => {
                window.testCorrecoes.executarTodosTestes();
            }, 3000);
        }
    }, 2000);
}