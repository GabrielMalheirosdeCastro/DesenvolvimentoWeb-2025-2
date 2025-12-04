/**
 * 🧪 TESTE COMPLETO DO SISTEMA DE TRADUÇÃO PT-BR
 * Arquivo para validar se todas as funcionalidades estão funcionando
 * após a implementação da tradução português-brasileiro
 */

// Aguardar carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 Iniciando testes do sistema de tradução PT-BR...');
    
    // Aguardar 3 segundos para garantir que o jogo carregou
    setTimeout(() => {
        executarTestesCompletos();
    }, 3000);
});

async function executarTestesCompletos() {
    console.log('🎮 === TESTE COMPLETO DO SISTEMA DE TRADUÇÃO === 🎮');
    
    const resultados = {
        total: 0,
        sucessos: 0,
        falhas: 0,
        detalhes: []
    };

    // 1. Teste de carregamento do sistema
    await testeCarregamentoSistema(resultados);
    
    // 2. Teste de tradução de cores
    await testeTraducaoCores(resultados);
    
    // 3. Teste de gameplay com cores portuguesas
    await testeGameplayPortugues(resultados);
    
    // 4. Teste de preview de cores
    await testePreviewCores(resultados);
    
    // 5. Teste de funcionalidades existentes
    await testeFuncionalidadesExistentes(resultados);
    
    // Relatório final
    gerarRelatorioFinal(resultados);
}

async function testeCarregamentoSistema(resultados) {
    console.log('📋 1. TESTE: Carregamento do Sistema');
    
    try {
        // Verificar se variáveis globais existem
        const checks = [
            { nome: 'COLOR_TRANSLATION', existe: typeof COLOR_TRANSLATION !== 'undefined' },
            { nome: 'COLOR_SETS', existe: typeof COLOR_SETS !== 'undefined' },
            { nome: 'gameState', existe: typeof gameState !== 'undefined' },
            { nome: 'translateColorToCss', existe: typeof translateColorToCss === 'function' }
        ];
        
        checks.forEach(check => {
            if (check.existe) {
                console.log(`✅ ${check.nome} carregado`);
                resultados.sucessos++;
            } else {
                console.log(`❌ ${check.nome} NÃO carregado`);
                resultados.falhas++;
            }
            resultados.total++;
            resultados.detalhes.push(`${check.existe ? '✅' : '❌'} ${check.nome}`);
        });
        
    } catch (error) {
        console.error('❌ Erro no teste de carregamento:', error);
        resultados.falhas++;
        resultados.total++;
        resultados.detalhes.push('❌ Erro de carregamento');
    }
}

async function testeTraducaoCores(resultados) {
    console.log('🎨 2. TESTE: Tradução de Cores');
    
    const coresTesteFacil = ['vermelho', 'azul', 'verde', 'amarelo', 'roxo'];
    const coresTesteMedio = ['marinho', 'azul-petróleo', 'coral', 'carmesim'];
    const coresTesteDificil = ['azul-ardósia-escuro', 'coral-claro'];
    
    const todasCores = [...coresTesteFacil, ...coresTesteMedio, ...coresTesteDificil];
    
    todasCores.forEach(cor => {
        try {
            const traducao = translateColorToCss(cor);
            const valida = isValidCSSColor(cor);
            
            if (valida && traducao !== cor) {
                console.log(`✅ ${cor} → ${traducao}`);
                resultados.sucessos++;
                resultados.detalhes.push(`✅ Tradução: ${cor} → ${traducao}`);
            } else {
                console.log(`❌ Falha na tradução: ${cor}`);
                resultados.falhas++;
                resultados.detalhes.push(`❌ Falha: ${cor}`);
            }
            resultados.total++;
            
        } catch (error) {
            console.error(`❌ Erro ao traduzir ${cor}:`, error);
            resultados.falhas++;
            resultados.total++;
            resultados.detalhes.push(`❌ Erro: ${cor}`);
        }
    });
}

async function testeGameplayPortugues(resultados) {
    console.log('🎮 3. TESTE: Gameplay com Português');
    
    try {
        // Simular início de jogo
        if (typeof startNewGame === 'function') {
            console.log('✅ Função startNewGame existe');
            resultados.sucessos++;
            resultados.detalhes.push('✅ startNewGame disponível');
        } else {
            console.log('❌ Função startNewGame NÃO existe');
            resultados.falhas++;
            resultados.detalhes.push('❌ startNewGame indisponível');
        }
        resultados.total++;
        
        // Verificar se cores estão em português
        if (typeof COLOR_SETS !== 'undefined') {
            const coresFacil = COLOR_SETS.easy || [];
            const temCoresPortugues = coresFacil.some(cor => 
                ['vermelho', 'azul', 'verde'].includes(cor)
            );
            
            if (temCoresPortugues) {
                console.log('✅ Cores estão em português nos arrays');
                resultados.sucessos++;
                resultados.detalhes.push('✅ Arrays com cores PT-BR');
            } else {
                console.log('❌ Cores NÃO estão em português');
                resultados.falhas++;
                resultados.detalhes.push('❌ Arrays sem PT-BR');
            }
            resultados.total++;
        }
        
    } catch (error) {
        console.error('❌ Erro no teste de gameplay:', error);
        resultados.falhas++;
        resultados.total++;
        resultados.detalhes.push('❌ Erro gameplay');
    }
}

async function testePreviewCores(resultados) {
    console.log('🖼️ 4. TESTE: Preview de Cores');
    
    try {
        // Testar função de preview
        if (typeof applyColorPreview === 'function') {
            console.log('✅ Função applyColorPreview existe');
            
            // Testar aplicação de preview com cor portuguesa
            const corTeste = 'vermelho';
            const input = document.getElementById('color-guess');
            
            if (input) {
                input.value = corTeste;
                
                // Simular preview
                setTimeout(() => {
                    const backgroundAtual = document.body.style.backgroundColor;
                    if (backgroundAtual && backgroundAtual.includes('red')) {
                        console.log('✅ Preview funcionando com português');
                        resultados.sucessos++;
                        resultados.detalhes.push('✅ Preview PT-BR ok');
                    } else {
                        console.log('❌ Preview NÃO funcionando');
                        resultados.falhas++;
                        resultados.detalhes.push('❌ Preview PT-BR falhou');
                    }
                    resultados.total++;
                    
                    // Limpar teste
                    input.value = '';
                    if (typeof resetBackgroundPreview === 'function') {
                        resetBackgroundPreview();
                    }
                }, 1000);
                
                resultados.sucessos++;
                resultados.detalhes.push('✅ applyColorPreview disponível');
            } else {
                resultados.falhas++;
                resultados.detalhes.push('❌ Input não encontrado');
            }
        } else {
            console.log('❌ Função applyColorPreview NÃO existe');
            resultados.falhas++;
            resultados.detalhes.push('❌ applyColorPreview indisponível');
        }
        resultados.total++;
        
    } catch (error) {
        console.error('❌ Erro no teste de preview:', error);
        resultados.falhas++;
        resultados.total++;
        resultados.detalhes.push('❌ Erro preview');
    }
}

async function testeFuncionalidadesExistentes(resultados) {
    console.log('⚙️ 5. TESTE: Funcionalidades Existentes');
    
    const funcionalidades = [
        'handleGuess',
        'showFeedback',
        'updateUI',
        'saveToStorage',
        'loadFromStorage',
        'generateNewColor'
    ];
    
    funcionalidades.forEach(funcName => {
        try {
            if (typeof window[funcName] === 'function') {
                console.log(`✅ ${funcName} existe`);
                resultados.sucessos++;
                resultados.detalhes.push(`✅ ${funcName} ok`);
            } else {
                console.log(`❌ ${funcName} NÃO existe`);
                resultados.falhas++;
                resultados.detalhes.push(`❌ ${funcName} ausente`);
            }
            resultados.total++;
        } catch (error) {
            console.error(`❌ Erro ao testar ${funcName}:`, error);
            resultados.falhas++;
            resultados.total++;
            resultados.detalhes.push(`❌ Erro ${funcName}`);
        }
    });
}

function gerarRelatorioFinal(resultados) {
    console.log('\n🏁 === RELATÓRIO FINAL DOS TESTES === 🏁');
    console.log(`📊 Total de testes: ${resultados.total}`);
    console.log(`✅ Sucessos: ${resultados.sucessos}`);
    console.log(`❌ Falhas: ${resultados.falhas}`);
    console.log(`📈 Taxa de sucesso: ${((resultados.sucessos / resultados.total) * 100).toFixed(1)}%`);
    
    console.log('\n📋 Detalhes:');
    resultados.detalhes.forEach((detalhe, index) => {
        console.log(`${index + 1}. ${detalhe}`);
    });
    
    // Criar relatório visual na tela
    criarRelatorioVisual(resultados);
    
    // Veredicto final
    const sucesso = (resultados.sucessos / resultados.total) >= 0.8;
    const emoji = sucesso ? '🎉' : '⚠️';
    const status = sucesso ? 'APROVADO' : 'REQUER ATENÇÃO';
    const cor = sucesso ? '#10b981' : '#f59e0b';
    
    console.log(`\n${emoji} VEREDICTO FINAL: ${status} ${emoji}`);
    
    // Alertar na tela se houver problemas
    if (!sucesso) {
        alert(`⚠️ ATENÇÃO: Foram detectados alguns problemas nos testes.\nVerifique o console para detalhes.\nTaxa de sucesso: ${((resultados.sucessos / resultados.total) * 100).toFixed(1)}%`);
    } else {
        console.log('🎉 PARABÉNS! Todos os testes principais passaram!');
    }
}

function criarRelatorioVisual(resultados) {
    // Criar elemento de relatório na tela
    const relatorio = document.createElement('div');
    relatorio.id = 'teste-relatorio';
    relatorio.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 300px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        border: 2px solid ${resultados.sucessos >= resultados.falhas ? '#10b981' : '#f59e0b'};
    `;
    
    const taxa = ((resultados.sucessos / resultados.total) * 100).toFixed(1);
    
    relatorio.innerHTML = `
        <h3>🧪 Relatório de Testes</h3>
        <p><strong>Total:</strong> ${resultados.total}</p>
        <p><strong>✅ Sucessos:</strong> ${resultados.sucessos}</p>
        <p><strong>❌ Falhas:</strong> ${resultados.falhas}</p>
        <p><strong>📈 Taxa:</strong> ${taxa}%</p>
        <p><strong>Status:</strong> ${taxa >= 80 ? '✅ APROVADO' : '⚠️ ATENÇÃO'}</p>
        <button onclick="document.getElementById('teste-relatorio').remove()" style="margin-top: 10px; padding: 5px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
    `;
    
    document.body.appendChild(relatorio);
    
    // Auto-remover após 30 segundos
    setTimeout(() => {
        if (document.getElementById('teste-relatorio')) {
            document.getElementById('teste-relatorio').remove();
        }
    }, 30000);
}

// Executar apenas se estamos em modo de desenvolvimento ou teste
if (window.location.hostname === 'localhost' || window.location.search.includes('test')) {
    console.log('🧪 Modo de teste ativado');
} else {
    // Em produção, executar apenas se explicitamente solicitado
    console.log('ℹ️ Para executar testes em produção, adicione ?test=1 à URL');
    if (window.location.search.includes('test=1')) {
        console.log('🧪 Executando testes em produção...');
    }
}