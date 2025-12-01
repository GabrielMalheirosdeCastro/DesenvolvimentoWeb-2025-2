/**
 * 🎮 JOGO DE ADIVINHAÇÃO DE CORES - VERSÃO SIMPLIFICADA
 * Projeto Prático C3 - Gabriel Malheiros de Castro
 * FAESA 2025-2
 * 
 * Versão ultra-simplificada para funcionar garantidamente
 */

console.log('🎮 Carregando versão simplificada...');

// Cores simples
const CORES = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'white'];

// Estado global simples
let corAlvo = '';
let tentativasRestantes = 3;
let jogoAtivo = false;
let pontos = 0;

// Função para sortear nova cor
function sortearCor() {
    corAlvo = CORES[Math.floor(Math.random() * CORES.length)];
    console.log('🎯 Nova cor sorteada:', corAlvo);
    return corAlvo;
}

// Função para iniciar jogo
function iniciarJogo() {
    console.log('🚀 Iniciando jogo simplificado...');
    
    tentativasRestantes = 3;
    jogoAtivo = true;
    sortearCor();
    
    // Atualizar interface
    const tentativasEl = document.getElementById('attempts-count');
    const feedbackEl = document.getElementById('feedback-message');
    const inputEl = document.getElementById('color-guess');
    const btnEl = document.getElementById('guess-btn');
    
    if (tentativasEl) tentativasEl.textContent = tentativasRestantes;
    if (feedbackEl) feedbackEl.textContent = 'Boa sorte! Uma nova cor foi sorteada...';
    if (inputEl) {
        inputEl.value = '';
        inputEl.disabled = false;
    }
    if (btnEl) btnEl.style.display = 'inline-flex';
    
    console.log('✅ Jogo iniciado! Cor:', corAlvo);
}

// Função para processar palpite
function processarPalpite() {
    console.log('🎯 Processando palpite...');
    
    if (!jogoAtivo) {
        console.log('❌ Jogo não está ativo');
        return;
    }
    
    const inputEl = document.getElementById('color-guess');
    const feedbackEl = document.getElementById('feedback-message');
    
    if (!inputEl || !feedbackEl) {
        console.error('❌ Elementos não encontrados');
        return;
    }
    
    const palpite = inputEl.value.trim().toLowerCase();
    
    if (!palpite) {
        feedbackEl.textContent = 'Digite uma cor!';
        return;
    }
    
    tentativasRestantes--;
    
    if (palpite === corAlvo.toLowerCase()) {
        // Acertou!
        jogoAtivo = false;
        pontos += 10;
        
        feedbackEl.textContent = `🎉 Parabéns! Você acertou! A cor era "${corAlvo}". +10 pontos!`;
        document.body.style.backgroundColor = corAlvo;
        
        // Mostrar botão reiniciar
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) restartBtn.style.display = 'inline-flex';
        
        const btnEl = document.getElementById('guess-btn');
        if (btnEl) btnEl.style.display = 'none';
        
        inputEl.disabled = true;
        
        console.log('🎉 Jogador acertou!');
        
    } else if (tentativasRestantes > 0) {
        // Ainda tem tentativas
        feedbackEl.textContent = `❌ Errou! "${palpite}" não é a cor. Tentativas restantes: ${tentativasRestantes}`;
        inputEl.value = '';
        
    } else {
        // Game over
        jogoAtivo = false;
        feedbackEl.textContent = `💀 Fim de jogo! A cor era "${corAlvo}". Tente novamente!`;
        
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) restartBtn.style.display = 'inline-flex';
        
        const btnEl = document.getElementById('guess-btn');
        if (btnEl) btnEl.style.display = 'none';
        
        inputEl.disabled = true;
        
        console.log('💀 Game over');
    }
    
    // Atualizar contador de tentativas
    const tentativasEl = document.getElementById('attempts-count');
    if (tentativasEl) tentativasEl.textContent = tentativasRestantes;
    
    // Atualizar pontos
    const pontosEl = document.getElementById('score-count');
    if (pontosEl) pontosEl.textContent = pontos;
}

// Inicialização quando página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM carregado, configurando jogo simplificado...');
    
    // Esperar um pouco para garantir que tudo carregou
    setTimeout(() => {
        try {
            // Configurar eventos
            const btnAdivinhar = document.getElementById('guess-btn');
            const btnReiniciar = document.getElementById('restart-btn');
            const inputCor = document.getElementById('color-guess');
            
            if (btnAdivinhar) {
                btnAdivinhar.addEventListener('click', processarPalpite);
                console.log('✅ Botão adivinhar configurado');
            } else {
                console.error('❌ Botão adivinhar não encontrado');
            }
            
            if (btnReiniciar) {
                btnReiniciar.addEventListener('click', function() {
                    console.log('🔄 Reiniciando jogo...');
                    document.body.style.backgroundColor = '';
                    btnReiniciar.style.display = 'none';
                    iniciarJogo();
                });
                console.log('✅ Botão reiniciar configurado');
            }
            
            if (inputCor) {
                inputCor.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && jogoAtivo) {
                        processarPalpite();
                    }
                });
                console.log('✅ Enter no input configurado');
            }
            
            // Iniciar primeiro jogo
            iniciarJogo();
            
            console.log('✅ Jogo simplificado configurado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao configurar jogo simplificado:', error);
        }
    }, 500);
});

// Função de debug global
window.debugJogo = function() {
    console.log('🧪 DEBUG JOGO SIMPLIFICADO:', {
        corAlvo: corAlvo,
        tentativasRestantes: tentativasRestantes,
        jogoAtivo: jogoAtivo,
        pontos: pontos
    });
    return { corAlvo, tentativasRestantes, jogoAtivo, pontos };
};

console.log('✅ Script simplificado carregado!');