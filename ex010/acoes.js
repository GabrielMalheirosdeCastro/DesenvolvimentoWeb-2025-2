/**
 * 🚀 EXERCÍCIO EX010 - MÚLTIPLAS AÇÕES EM JAVASCRIPT
 * 
 * Arquivo: acoes.js
 * Descrição: Implementação otimizada das funções de ação com boas práticas
 * Autor: Gabriel Malheiros de Castro
 * Curso: Desenvolvimento Web - FAESA 2025-2
 */

// ========================================
// 🎯 CONFIGURAÇÕES E CONSTANTES
// ========================================

const CONFIG = {
    ELEMENTO_SAIDA: 'saida',
    DELAY_ANIMACAO: 300,
    MENSAGENS_ERRO: {
        ELEMENTO_NAO_ENCONTRADO: '❌ Erro: Elemento de saída não encontrado!',
        FUNCAO_INVALIDA: '❌ Erro: Função inválida chamada!'
    }
};

// ========================================
// 🔧 FUNÇÕES UTILITÁRIAS (DRY - Don't Repeat Yourself)
// ========================================

/**
 * Função otimizada para atualizar o conteúdo da seção de saída
 * Evita repetição de código entre as funções acao1-4
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} emoji - Emoji para acompanhar a mensagem
 * @param {string} cor - Cor de destaque (opcional)
 */
function atualizarSaida(mensagem, emoji = '🎯', cor = '#22c55e') {
    try {
        const elementoSaida = document.getElementById(CONFIG.ELEMENTO_SAIDA);
        
        if (!elementoSaida) {
            console.error(CONFIG.MENSAGENS_ERRO.ELEMENTO_NAO_ENCONTRADO);
            return false;
        }

        // Adicionar efeito de transição suave
        elementoSaida.style.opacity = '0.5';
        
        setTimeout(() => {
            const timestamp = new Date().toLocaleTimeString('pt-BR');
            
            elementoSaida.innerHTML = `
                <div style="border-left: 4px solid ${cor}; padding-left: 15px;">
                    <p style="font-size: 16px; margin-bottom: 5px;">
                        ${emoji} ${mensagem}
                    </p>
                    <small style="opacity: 0.7; font-size: 12px;">
                        ⏰ Executado às ${timestamp}
                    </small>
                </div>
            `;
            
            elementoSaida.style.opacity = '1';
            
            // Adicionar efeito visual temporário
            elementoSaida.classList.add('pulse');
            setTimeout(() => {
                elementoSaida.classList.remove('pulse');
            }, 1000);
            
        }, CONFIG.DELAY_ANIMACAO);

        return true;

    } catch (erro) {
        console.error('❌ Erro ao atualizar saída:', erro);
        return false;
    }
}

/**
 * Função para logging estruturado e debugging
 * @param {string} funcao - Nome da função executada
 * @param {Object} dados - Dados adicionais para log
 */
function logarExecucao(funcao, dados = {}) {
    console.group(`🎯 Execução: ${funcao}`);
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('📊 Dados:', dados);
    console.log('🌐 User Agent:', navigator.userAgent.substring(0, 50) + '...');
    console.groupEnd();
}

/**
 * Função para validar estado da aplicação antes de executar ações
 * @returns {boolean} - True se tudo estiver OK
 */
function validarEstado() {
    return document.getElementById(CONFIG.ELEMENTO_SAIDA) !== null;
}

// ========================================
// 🎯 FUNÇÕES PRINCIPAIS (OTIMIZADAS)
// ========================================

/**
 * Ação 1: Mensagem de boas-vindas interativa
 */
function acao1() {
    try {
        if (!validarEstado()) {
            console.error('❌ Estado da aplicação inválido');
            return;
        }

        logarExecucao('acao1', { tipo: 'boas-vindas' });

        const nome = prompt('👋 Olá! Qual é o seu nome?', '') || 'Visitante';
        const mensagem = nome === 'Visitante' 
            ? 'Bem-vindo(a), visitante anônimo!' 
            : `Bem-vindo(a), ${nome}! Obrigado por testar nossa aplicação.`;

        atualizarSaida(
            `${mensagem}<br><small>🎉 Esta é a primeira ação do nosso exercício!</small>`,
            '👋',
            '#3b82f6'
        );

        // Log adicional para debugging
        console.log('✅ Ação 1 executada com sucesso', { nomeUsuario: nome });

    } catch (erro) {
        console.error('❌ Erro na ação1:', erro);
        atualizarSaida('Erro ao executar ação 1. Tente novamente.', '❌', '#ef4444');
    }
}

/**
 * Ação 2: Calculadora interativa simples
 */
function acao2() {
    try {
        if (!validarEstado()) {
            console.error('❌ Estado da aplicação inválido');
            return;
        }

        logarExecucao('acao2', { tipo: 'calculadora' });

        const num1 = parseFloat(prompt('🔢 Digite o primeiro número:', '0')) || 0;
        const num2 = parseFloat(prompt('🔢 Digite o segundo número:', '0')) || 0;
        
        const operacoes = {
            soma: num1 + num2,
            subtracao: num1 - num2,
            multiplicacao: num1 * num2,
            divisao: num2 !== 0 ? (num1 / num2).toFixed(2) : 'Impossível (divisão por zero)'
        };

        const resultado = `
            <strong>🧮 Calculadora Rápida:</strong><br>
            📊 ${num1} + ${num2} = ${operacoes.soma}<br>
            📊 ${num1} - ${num2} = ${operacoes.subtracao}<br>
            📊 ${num1} × ${num2} = ${operacoes.multiplicacao}<br>
            📊 ${num1} ÷ ${num2} = ${operacoes.divisao}
        `;

        atualizarSaida(resultado, '🧮', '#8b5cf6');

        console.log('✅ Ação 2 executada com sucesso', { 
            entrada: { num1, num2 }, 
            resultados: operacoes 
        });

    } catch (erro) {
        console.error('❌ Erro na ação2:', erro);
        atualizarSaida('Erro ao executar ação 2. Verifique os números digitados.', '❌', '#ef4444');
    }
}

/**
 * Ação 3: Informações do sistema e navegador
 */
function acao3() {
    try {
        if (!validarEstado()) {
            console.error('❌ Estado da aplicação inválido');
            return;
        }

        logarExecucao('acao3', { tipo: 'info-sistema' });

        const infoSistema = {
            navegador: navigator.userAgent.split(' ')[0],
            idioma: navigator.language,
            plataforma: navigator.platform,
            cookiesHabilitados: navigator.cookieEnabled ? 'Sim' : 'Não',
            larguraJanela: window.innerWidth,
            alturaJanela: window.innerHeight,
            dataHora: new Date().toLocaleString('pt-BR')
        };

        const resultado = `
            <strong>💻 Informações do Sistema:</strong><br>
            🌐 Navegador: ${infoSistema.navegador}<br>
            🗣️ Idioma: ${infoSistema.idioma}<br>
            🖥️ Plataforma: ${infoSistema.plataforma}<br>
            🍪 Cookies: ${infoSistema.cookiesHabilitados}<br>
            📐 Resolução: ${infoSistema.larguraJanela} × ${infoSistema.alturaJanela}px<br>
            📅 Data/Hora: ${infoSistema.dataHora}
        `;

        atualizarSaida(resultado, '💻', '#f59e0b');

        console.log('✅ Ação 3 executada com sucesso', infoSistema);

    } catch (erro) {
        console.error('❌ Erro na ação3:', erro);
        atualizarSaida('Erro ao obter informações do sistema.', '❌', '#ef4444');
    }
}

/**
 * Ação 4: Teste de conhecimento interativo
 */
function acao4() {
    try {
        if (!validarEstado()) {
            console.error('❌ Estado da aplicação inválido');
            return;
        }

        logarExecucao('acao4', { tipo: 'quiz' });

        // Quiz JavaScript simples
        const perguntas = [
            {
                pergunta: "Qual é a linguagem de programação usada neste exercício?",
                opcoes: ["Python", "JavaScript", "Java", "C++"],
                resposta: 1
            },
            {
                pergunta: "Qual método é usado para exibir uma mensagem de alerta?",
                opcoes: ["console.log()", "alert()", "prompt()", "confirm()"],
                resposta: 1
            }
        ];

        let pontuacao = 0;
        let resultadoDetalhado = '<strong>🧠 Quiz JavaScript:</strong><br>';

        perguntas.forEach((item, index) => {
            const respostaUsuario = prompt(
                `❓ Pergunta ${index + 1}:\n${item.pergunta}\n\n` +
                item.opcoes.map((opcao, i) => `${i + 1}. ${opcao}`).join('\n') +
                '\n\nDigite o número da resposta:'
            );

            const numeroResposta = parseInt(respostaUsuario) - 1;
            const acertou = numeroResposta === item.resposta;
            
            if (acertou) {
                pontuacao++;
                resultadoDetalhado += `✅ Pergunta ${index + 1}: Correto!<br>`;
            } else {
                resultadoDetalhado += `❌ Pergunta ${index + 1}: Incorreto. Resposta: ${item.opcoes[item.resposta]}<br>`;
            }
        });

        const porcentagem = (pontuacao / perguntas.length * 100).toFixed(0);
        let emoji = '🤔';
        if (porcentagem >= 80) emoji = '🏆';
        else if (porcentagem >= 60) emoji = '👏';
        
        resultadoDetalhado += `<br><strong>${emoji} Pontuação Final: ${pontuacao}/${perguntas.length} (${porcentagem}%)</strong>`;

        atualizarSaida(resultadoDetalhado, '🧠', '#06b6d4');

        console.log('✅ Ação 4 executada com sucesso', { 
            pontuacao, 
            porcentagem: porcentagem + '%' 
        });

    } catch (erro) {
        console.error('❌ Erro na ação4:', erro);
        atualizarSaida('Erro ao executar o quiz. Tente novamente.', '❌', '#ef4444');
    }
}

// ========================================
// 🌟 INICIALIZAÇÃO E CONFIGURAÇÃO
// ========================================

/**
 * Função de inicialização executada quando o DOM estiver carregado
 */
function inicializar() {
    console.log('🚀 Aplicação ex010 inicializada com sucesso!');
    console.log('📚 Funções disponíveis: acao1(), acao2(), acao3(), acao4()');
    
    // Validar se todos os elementos necessários estão presentes
    if (!document.getElementById(CONFIG.ELEMENTO_SAIDA)) {
        console.error('❌ ERRO CRÍTICO: Elemento de saída não encontrado!');
        return;
    }

    // Log de estatísticas de performance
    console.log('⚡ Performance:', {
        timeToLoad: performance.now().toFixed(2) + 'ms',
        memoria: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 'N/A'
    });

    // Adicionar listeners para melhor experiência do usuário
    adicionarEventListeners();
}

/**
 * Adiciona event listeners para melhorar a experiência do usuário
 */
function adicionarEventListeners() {
    // Listener para tecla Enter nos botões
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const botaoAtivo = document.activeElement;
            if (botaoAtivo && botaoAtivo.onclick) {
                botaoAtivo.click();
            }
        }
    });

    // Listener para teclas de atalho (1, 2, 3, 4)
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case '1':
                event.preventDefault();
                acao1();
                break;
            case '2':
                event.preventDefault();
                acao2();
                break;
            case '3':
                event.preventDefault();
                acao3();
                break;
            case '4':
                event.preventDefault();
                acao4();
                break;
        }
    });

    console.log('⌨️ Atalhos de teclado configurados: 1, 2, 3, 4 para as ações');
}

// ========================================
// 🎯 EXECUÇÃO AUTOMÁTICA
// ========================================

// Aguardar o DOM estar completamente carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    // DOM já carregado
    inicializar();
}

// ========================================
// 🛡️ TRATAMENTO GLOBAL DE ERROS
// ========================================

window.addEventListener('error', function(event) {
    console.error('❌ Erro global capturado:', {
        mensagem: event.message,
        arquivo: event.filename,
        linha: event.lineno,
        coluna: event.colno,
        erro: event.error
    });
    
    // Não quebrar a aplicação, apenas logar
    event.preventDefault();
});

// ========================================
// 🎮 EASTER EGGS E FUNCIONALIDADES EXTRAS
// ========================================

/**
 * Easter egg: Konami Code
 */
let konamiSequence = [];
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(event) {
    konamiSequence.push(event.code);
    
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    if (JSON.stringify(konamiSequence) === JSON.stringify(konamiCode)) {
        console.log('🎊 KONAMI CODE ATIVADO!');
        atualizarSaida(
            '🎊 <strong>KONAMI CODE DESCOBERTO!</strong><br>' +
            '🏆 Você é um verdadeiro desenvolvedor!<br>' +
            '<small>Efeito especial ativado por 3 segundos...</small>',
            '🎮',
            '#ff6b6b'
        );
        
        // Adicionar efeito visual especial
        document.body.style.animation = 'rainbow 3s linear';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 3000);
    }
});

// ========================================
// 📊 EXPORTAÇÕES PARA DEBUGGING
// ========================================

// Disponibilizar funções no escopo global para debugging
window.DEBUG_ex010 = {
    atualizarSaida,
    logarExecucao,
    validarEstado,
    CONFIG
};

console.log('🔧 Modo debug disponível: window.DEBUG_ex010');