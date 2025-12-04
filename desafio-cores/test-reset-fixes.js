/**
 * 🧪 TESTE ESPECÍFICO: Verificação dos problemas de reset/reinício
 * Este script testa especificamente os problemas identificados:
 * 1. Reinício automático após 3 tentativas falhadas
 * 2. Botão "Jogar Novamente" 
 * 3. Reset correto das variáveis (tentativas, pontuação, etc.)
 */

console.log('🧪 INICIANDO TESTE DE RESET/REINÍCIO...');

// Aguardar o jogo carregar completamente
setTimeout(() => {
    if (typeof window.gameDebug === 'undefined') {
        console.error('❌ gameDebug não disponível - verifique se o script principal carregou');
        return;
    }

    console.log('✅ Jogo carregado, iniciando testes...');
    
    // Função auxiliar para aguardar condição
    function waitFor(condition, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                if (condition()) {
                    resolve();
                } else if (Date.now() - start > timeout) {
                    reject(new Error('Timeout'));
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    // Função para simular palpite errado
    function makeWrongGuess() {
        const colorInput = document.getElementById('color-guess');
        const guessBtn = document.getElementById('guess-btn');
        
        if (!colorInput || !guessBtn) {
            console.error('❌ Elementos do jogo não encontrados');
            return false;
        }

        // Usar uma cor que definitivamente não existe
        colorInput.value = 'wrongcolor123';
        guessBtn.click();
        return true;
    }

    // Função para simular clique no botão restart
    function clickRestart() {
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn && restartBtn.style.display !== 'none') {
            restartBtn.click();
            return true;
        }
        return false;
    }

    // Função para obter estado atual do jogo
    function getGameState() {
        const state = window.gameDebug.getGameState();
        const attemptsElement = document.getElementById('attempts-count');
        return {
            attempts: state.attemptsLeft,
            attemptsUI: attemptsElement ? attemptsElement.textContent : 'N/A',
            score: state.score,
            isActive: state.isGameActive,
            phase: state.gamePhase,
            totalGames: state.totalGames,
            totalWins: state.totalWins
        };
    }

    // TESTE 1: Verificar estado inicial
    console.log('\n🔬 TESTE 1: Estado Inicial');
    let initialState = getGameState();
    console.log('Estado inicial:', initialState);

    // Aguardar o jogo ficar ativo
    waitFor(() => getGameState().isActive && getGameState().phase === 'playing')
        .then(() => {
            console.log('✅ Jogo está ativo e pronto');

            // TESTE 2: Simular 3 tentativas erradas
            console.log('\n🔬 TESTE 2: 3 Tentativas Erradas (Reinício Automático)');
            
            let attempts = 0;
            const testAutoRestart = () => {
                if (attempts < 3) {
                    console.log(`Tentativa ${attempts + 1}/3 - Estado antes:`, getGameState());
                    
                    if (makeWrongGuess()) {
                        attempts++;
                        
                        setTimeout(() => {
                            console.log(`Tentativa ${attempts}/3 - Estado depois:`, getGameState());
                            
                            if (attempts === 3) {
                                console.log('🔄 Todas as 3 tentativas feitas, aguardando reinício automático...');
                                
                                // Aguardar reinício automático (deve acontecer em ~3 segundos)
                                setTimeout(() => {
                                    const stateAfterAutoRestart = getGameState();
                                    console.log('Estado após reinício automático:', stateAfterAutoRestart);
                                    
                                    // Verificações críticas
                                    const checks = {
                                        attemptsReset: stateAfterAutoRestart.attempts === 3,
                                        attemptsUIReset: stateAfterAutoRestart.attemptsUI === '3',
                                        gameActive: stateAfterAutoRestart.isActive,
                                        phaseCorrect: stateAfterAutoRestart.phase === 'playing' || stateAfterAutoRestart.phase === 'pre-game'
                                    };

                                    console.log('\n📋 RESULTADOS TESTE 2 (Reinício Automático):');
                                    console.log('✅ Tentativas resetadas para 3:', checks.attemptsReset);
                                    console.log('✅ UI mostra 3 tentativas:', checks.attemptsUIReset);
                                    console.log('✅ Jogo está ativo novamente:', checks.gameActive);
                                    console.log('✅ Fase do jogo correta:', checks.phaseCorrect);

                                    if (Object.values(checks).every(v => v)) {
                                        console.log('🎉 TESTE 2 PASSOU: Reinício automático funciona!');
                                        
                                        // Prosseguir para TESTE 3
                                        setTimeout(testManualRestart, 2000);
                                    } else {
                                        console.error('❌ TESTE 2 FALHOU: Problemas no reinício automático');
                                        console.error('Falhas:', Object.entries(checks).filter(([k, v]) => !v));
                                    }
                                }, 4000); // Aguardar 4 segundos para garantir que o reinício aconteceu
                            } else {
                                testAutoRestart(); // Continuar próxima tentativa
                            }
                        }, 500);
                    }
                }
            };

            // TESTE 3: Botão "Jogar Novamente"
            const testManualRestart = () => {
                console.log('\n🔬 TESTE 3: Botão "Jogar Novamente"');
                
                // Aguardar jogo estar ativo novamente
                waitFor(() => {
                    const state = getGameState();
                    return state.isActive && state.phase === 'playing';
                }, 10000).then(() => {
                    console.log('Jogo ativo, fazendo 1 palpite errado para mostrar botão restart...');
                    
                    const stateBeforeGuess = getGameState();
                    console.log('Estado antes do palpite:', stateBeforeGuess);
                    
                    // Fazer 1 palpite errado para que o botão restart apareça (após acerto ou erro)
                    if (makeWrongGuess()) {
                        
                        setTimeout(() => {
                            const stateAfterGuess = getGameState();
                            console.log('Estado após 1 palpite errado:', stateAfterGuess);
                            
                            // Esperar um pouco e tentar acessar o botão restart
                            setTimeout(() => {
                                console.log('Procurando botão restart...');
                                
                                // Tentar conseguir acesso ao botão restart fazendo mais um erro ou acerto
                                // Primeiro vamos acertar para aparecer o botão
                                const colorInput = document.getElementById('color-guess');
                                const guessBtn = document.getElementById('guess-btn');
                                
                                if (colorInput && guessBtn) {
                                    // Obter cor alvo do debug e acertar de propósito
                                    const targetColor = window.gameDebug.getGameState().targetColor;
                                    console.log('🎯 Acertando de propósito com cor:', targetColor);
                                    
                                    colorInput.value = targetColor;
                                    guessBtn.click();
                                    
                                    // Aguardar botão restart aparecer
                                    setTimeout(() => {
                                        console.log('Tentando clicar no botão restart...');
                                        const stateBeforeRestart = getGameState();
                                        console.log('Estado antes do restart manual:', stateBeforeRestart);
                                        
                                        if (clickRestart()) {
                                            console.log('✅ Clique no restart executado');
                                            
                                            // Aguardar reset acontecer
                                            setTimeout(() => {
                                                const stateAfterRestart = getGameState();
                                                console.log('Estado após restart manual:', stateAfterRestart);
                                                
                                                // Verificações para restart manual
                                                const manualChecks = {
                                                    attemptsReset: stateAfterRestart.attempts === 3,
                                                    attemptsUIReset: stateAfterRestart.attemptsUI === '3',
                                                    gameStable: stateAfterRestart.isActive !== undefined
                                                };

                                                console.log('\n📋 RESULTADOS TESTE 3 (Restart Manual):');
                                                console.log('✅ Tentativas resetadas para 3:', manualChecks.attemptsReset);
                                                console.log('✅ UI mostra 3 tentativas:', manualChecks.attemptsUIReset);
                                                console.log('✅ Jogo em estado estável:', manualChecks.gameStable);

                                                if (Object.values(manualChecks).every(v => v)) {
                                                    console.log('🎉 TESTE 3 PASSOU: Restart manual funciona!');
                                                } else {
                                                    console.error('❌ TESTE 3 FALHOU: Problemas no restart manual');
                                                    console.error('Falhas:', Object.entries(manualChecks).filter(([k, v]) => !v));
                                                }

                                                // RESUMO FINAL
                                                console.log('\n🏁 RESUMO FINAL DOS TESTES:');
                                                console.log('=====================================');
                                                console.log('TESTE 1: Estado Inicial - ✅ (sempre passa)');
                                                console.log('TESTE 2: Reinício Automático -', Object.values(checks).every(v => v) ? '✅' : '❌');
                                                console.log('TESTE 3: Restart Manual -', Object.values(manualChecks).every(v => v) ? '✅' : '❌');
                                                console.log('=====================================');

                                            }, 2000);
                                        } else {
                                            console.log('⚠️ Botão restart não disponível ou não visível');
                                        }
                                    }, 1000);
                                }
                            }, 1000);
                        }, 1000);
                    }
                }).catch(err => {
                    console.error('❌ Timeout aguardando jogo ficar ativo para teste 3:', err);
                });
            };

            // Iniciar os testes
            testAutoRestart();

        }).catch(err => {
            console.error('❌ Timeout aguardando jogo ficar ativo:', err);
        });

}, 3000); // Aguardar 3 segundos para o jogo carregar