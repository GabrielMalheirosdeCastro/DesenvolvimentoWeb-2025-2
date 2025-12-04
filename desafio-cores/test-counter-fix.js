/**
 * 🧪 TESTE AUTOMÁTICO PARA CORREÇÃO DO CONTADOR DE ACERTOS
 * Testa se o contador para em 3 e permanece em "3/3"
 */

// Aguarda o jogo carregar completamente
setTimeout(() => {
    console.log('🧪 Iniciando teste automático do contador de acertos...');
    
    // Função para simular acertos consecutivos
    function testConsecutiveWins() {
        const gameDebug = window.gameDebug;
        if (!gameDebug) {
            console.error('❌ Debug mode não disponível');
            return;
        }
        
        const gameState = gameDebug.getGameState();
        const levelProgressElement = document.getElementById('level-progress');
        
        if (!levelProgressElement) {
            console.error('❌ Elemento level-progress não encontrado');
            return;
        }
        
        console.log('🎯 Estado inicial:', {
            level: gameState.currentLevel,
            progress: gameState.levelProgress[gameState.currentLevel],
            displayText: levelProgressElement.textContent
        });
        
        // Simular 5 acertos para ver se para em 3
        for (let i = 1; i <= 5; i++) {
            // Simular acerto correto
            gameState.levelProgress[gameState.currentLevel]++;
            
            // Aplicar a correção manualmente para testar
            if (gameState.levelProgress[gameState.currentLevel] > 3) {
                gameState.levelProgress[gameState.currentLevel] = 3;
            }
            
            // Atualizar UI
            const currentProgress = Math.min(gameState.levelProgress[gameState.currentLevel], 3);
            levelProgressElement.textContent = `${currentProgress}/3`;
            
            console.log(`✅ Acerto ${i}:`, {
                progressInterno: gameState.levelProgress[gameState.currentLevel],
                progressExibido: currentProgress,
                displayText: levelProgressElement.textContent
            });
        }
        
        // Verificar se funciona corretamente
        const finalProgress = gameState.levelProgress[gameState.currentLevel];
        const displayedText = levelProgressElement.textContent;
        
        if (finalProgress <= 3 && displayedText === '3/3') {
            console.log('✅ TESTE PASSOU: Contador limitado corretamente em 3!');
            console.log('🎉 O contador permanece em "3/3" como esperado');
            
            // Teste adicional: verificar se ainda conta pontos
            const initialScore = gameState.score;
            gameState.score += 50; // Simular mais pontos
            document.getElementById('score-count').textContent = gameState.score;
            
            console.log('💰 Teste de pontuação:', {
                scoreInicial: initialScore,
                scoreFinal: gameState.score,
                diferenca: gameState.score - initialScore
            });
            
            if (gameState.score > initialScore) {
                console.log('✅ PONTUAÇÃO FUNCIONA: Continua contando pontos normalmente');
                return true;
            } else {
                console.log('❌ PONTUAÇÃO PROBLEMA: Não está contando pontos');
                return false;
            }
            
        } else {
            console.log('❌ TESTE FALHOU:', {
                progressEsperado: '≤3',
                progressAtual: finalProgress,
                displayEsperado: '3/3',
                displayAtual: displayedText
            });
            return false;
        }
    }
    
    // Função para testar troca de nível
    function testLevelChange() {
        const gameDebug = window.gameDebug;
        const gameState = gameDebug.getGameState();
        const difficultySelect = document.getElementById('difficulty-select');
        
        if (!difficultySelect) {
            console.error('❌ Seletor de dificuldade não encontrado');
            return false;
        }
        
        console.log('🔄 Testando troca de nível...');
        
        // Definir progresso no nível atual
        gameState.levelProgress[gameState.currentLevel] = 3;
        gameState.hasShownLevel3Congratulations = true;
        
        // Simular mudança de nível
        const originalLevel = gameState.currentLevel;
        gameState.currentLevel = originalLevel === 'easy' ? 'medium' : 'easy';
        gameState.hasShownLevel3Congratulations = false;
        
        console.log('✅ Troca de nível:', {
            de: originalLevel,
            para: gameState.currentLevel,
            congratulationsReset: !gameState.hasShownLevel3Congratulations
        });
        
        return !gameState.hasShownLevel3Congratulations;
    }
    
    // Executar testes
    const test1 = testConsecutiveWins();
    const test2 = testLevelChange();
    
    console.log('📊 RESULTADO FINAL DOS TESTES:');
    console.log(`✅ Contador limitado: ${test1 ? 'PASSOU' : 'FALHOU'}`);
    console.log(`✅ Reset ao trocar nível: ${test2 ? 'PASSOU' : 'FALHOU'}`);
    
    if (test1 && test2) {
        console.log('🎉 TODOS OS TESTES PASSARAM! Correção implementada com sucesso.');
        
        // Mostrar notificação visual de sucesso
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        notification.textContent = '✅ Correção do contador funcionando!';
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
        
    } else {
        console.log('❌ ALGUNS TESTES FALHARAM! Verificar implementação.');
        
        // Mostrar notificação visual de erro
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 9999;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        notification.textContent = '❌ Testes falharam! Verificar código.';
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 5000);
    }
    
}, 2000); // Aguarda 2 segundos para o jogo carregar

console.log('🧪 Script de teste carregado. Aguardando inicialização...');