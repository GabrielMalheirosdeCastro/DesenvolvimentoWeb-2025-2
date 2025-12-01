/**
 * 🎮 JOGO DE ADIVINHAÇÃO DE CORES - VERSÃO ULTRASSIMPLES
 * Testando com lógica básica para identificar o problema
 */

console.log('🚀 Iniciando versão ultrassimples do jogo...');

// Configuração básica
const CORES_FACEIS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'white'];

// Estado do jogo
let jogo = {
    corEscolhida: '',
    tentativasRestantes: 3,
    jogoAtivo: false
};

// Elementos DOM
let els = {};

// Função para escolher nova cor
function sortearNovaCor() {
    jogo.corEscolhida = CORES_FACEIS[Math.floor(Math.random() * CORES_FACEIS.length)];
    console.log('🎯 Nova cor sorteada:', jogo.corEscolhida);
}

// Função para iniciar jogo
function iniciarJogo() {
    console.log('🎮 Iniciando novo jogo...');
    
    sortearNovaCor();
    jogo.tentativasRestantes = 3;
    jogo.jogoAtivo = true;
    
    // Reset da interface
    document.body.style.backgroundColor = '';
    els.campoTexto.value = '';
    els.campoTexto.disabled = false;
    els.botaoAdivinhar.style.display = 'inline-flex';
    els.botaoReiniciar.style.display = 'none';
    
    // Atualizar UI
    atualizarInterface();
    mostrarMensagem('🎮 Novo jogo iniciado! Adivinhe a cor sorteada.', 'info');
    els.campoTexto.focus();
    
    console.log('✅ Jogo iniciado - Estado:', jogo);
}

// Função para atualizar interface
function atualizarInterface() {
    if (els.contadorTentativas) {
        els.contadorTentativas.textContent = jogo.tentativasRestantes;
        console.log('📊 Interface atualizada - Tentativas:', jogo.tentativasRestantes);
    }
}

// Função para mostrar mensagem
function mostrarMensagem(texto, tipo) {
    if (els.mensagem) {
        els.mensagem.textContent = texto;
        els.areaFeedback.className = `feedback-area ${tipo}`;
        console.log(`📢 Mensagem (${tipo}): ${texto}`);
    }
}

// Função principal - processar palpite
function processarPalpite() {
    console.log('🎯 processarPalpite() chamada');
    
    // Verificar se jogo está ativo
    if (!jogo.jogoAtivo) {
        console.log('⚠️ Jogo não está ativo!');
        mostrarMensagem('O jogo não está ativo. Clique em "Jogar Novamente".', 'error');
        return;
    }
    
    // Obter palpite
    const palpite = els.campoTexto.value.trim().toLowerCase();
    console.log('📝 Palpite obtido:', palpite);
    
    // Validar entrada
    if (!palpite) {
        console.log('❌ Campo vazio');
        mostrarMensagem('Digite uma cor!', 'error');
        return;
    }
    
    // PONTO CRÍTICO: Decrementar tentativas
    console.log('📊 ANTES de decrementar - Tentativas restantes:', jogo.tentativasRestantes);
    jogo.tentativasRestantes--;
    console.log('📊 DEPOIS de decrementar - Tentativas restantes:', jogo.tentativasRestantes);
    
    // Verificar se acertou
    const acertou = (palpite === jogo.corEscolhida.toLowerCase());
    console.log(`🎯 Comparação: "${palpite}" === "${jogo.corEscolhida.toLowerCase()}" = ${acertou}`);
    
    if (acertou) {
        console.log('🎉 ACERTOU!');
        
        // Vitória
        jogo.jogoAtivo = false;
        document.body.style.backgroundColor = jogo.corEscolhida;
        mostrarMensagem(`🎉 PARABÉNS! Você acertou! A cor era "${jogo.corEscolhida}".`, 'success');
        
        // Atualizar interface
        els.botaoAdivinhar.style.display = 'none';
        els.botaoReiniciar.style.display = 'inline-flex';
        els.campoTexto.disabled = true;
        
        console.log('✅ Vitória processada!');
        
    } else {
        console.log(`❌ ERROU! Tentativas restantes: ${jogo.tentativasRestantes}`);
        
        if (jogo.tentativasRestantes > 0) {
            console.log('✋ Ainda há tentativas - continuando...');
            
            mostrarMensagem(
                `❌ Errou! "${palpite}" não é a cor. Tentativas restantes: ${jogo.tentativasRestantes}`,
                'error'
            );
            
            // Limpar campo e focar
            els.campoTexto.value = '';
            els.campoTexto.focus();
            
            console.log('🔄 Campo limpo para nova tentativa');
            
        } else {
            console.log('💀 Sem mais tentativas - Game Over!');
            
            // Game Over
            jogo.jogoAtivo = false;
            mostrarMensagem(
                `💀 Fim de jogo! A cor era "${jogo.corEscolhida}". Tente novamente!`,
                'error'
            );
            
            // Atualizar interface
            els.botaoAdivinhar.style.display = 'none';
            els.botaoReiniciar.style.display = 'inline-flex';
            els.campoTexto.disabled = true;
            
            console.log('💀 Game Over processado!');
        }
    }
    
    // Atualizar contador de tentativas
    atualizarInterface();
    
    console.log('🏁 Fim do processamento do palpite - Estado final:', jogo);
}

// Função para revelar cor (debug)
function revelarCor() {
    console.log(`🔍 REVELAÇÃO: A cor sorteada é "${jogo.corEscolhida}"`);
    alert(`🔍 DEBUG: A cor sorteada é "${jogo.corEscolhida}"`);
}

// Inicialização quando página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏗️ Iniciando configuração da página...');
    
    // Capturar elementos DOM
    els = {
        campoTexto: document.getElementById('color-guess'),
        botaoAdivinhar: document.getElementById('guess-btn'),
        botaoReiniciar: document.getElementById('restart-btn'),
        contadorTentativas: document.getElementById('attempts-count'),
        areaFeedback: document.getElementById('feedback-area'),
        mensagem: document.getElementById('feedback-message')
    };
    
    // Verificar se elementos essenciais existem
    const elementosEssenciais = ['campoTexto', 'botaoAdivinhar', 'mensagem'];
    const elementosFaltando = elementosEssenciais.filter(nome => !els[nome]);
    
    if (elementosFaltando.length > 0) {
        console.error('❌ Elementos DOM faltando:', elementosFaltando);
        alert('❌ ERRO: Elementos DOM não encontrados: ' + elementosFaltando.join(', '));
        return;
    }
    
    console.log('✅ Todos os elementos DOM encontrados');
    
    // Configurar event listeners
    console.log('🔧 Configurando event listeners...');
    
    // Botão Adivinhar
    els.botaoAdivinhar.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ CLICK no botão Adivinhar!');
        processarPalpite();
    });
    
    // Botão Reiniciar
    if (els.botaoReiniciar) {
        els.botaoReiniciar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 CLICK no botão Reiniciar!');
            iniciarJogo();
        });
    }
    
    // Enter no campo de texto
    els.campoTexto.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('⌨️ ENTER pressionado!');
            if (jogo.jogoAtivo) {
                processarPalpite();
            }
        }
    });
    
    console.log('✅ Event listeners configurados');
    
    // Iniciar primeiro jogo
    iniciarJogo();
    
    console.log('🎮 Jogo ultrassimples inicializado com sucesso!');
    console.log('💡 Use revelarCor() no console para debug');
});

// Exportar função para debug
window.revelarCor = revelarCor;
window.jogoEstado = () => console.log('🎮 Estado atual:', jogo);