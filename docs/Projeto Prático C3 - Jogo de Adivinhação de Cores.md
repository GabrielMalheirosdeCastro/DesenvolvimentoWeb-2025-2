# 🎮 Projeto Prático C3

## Jogo de Adivinhação de Cores com Javascript

Aplicando manipulação do DOM, eventos e lógica de programação

---

## 📝 Descrição do Projeto

Neste projeto, você desenvolverá um **jogo interativo de adivinhação de cores** utilizando HTML, CSS e Javascript. O objetivo é criar uma aplicação web onde o jogador deve adivinhar uma cor aleatória entre as cores nomeadas do HTML.

Este projeto consolidará seus conhecimentos em **manipulação do DOM**, **eventos em Javascript**, **estruturas condicionais** e **controle de fluxo de execução**.

---

## 🎯 Objetivos de Aprendizagem

- Aplicar manipulação do DOM para alterar conteúdo e estilos dinamicamente
- Implementar eventos de interação do usuário (clique em botões)
- Desenvolver lógica de controle de tentativas e validação
- Trabalhar com geração de valores aleatórios em Javascript
- Praticar estruturas condicionais (if/else) e operadores lógicos
- Implementar feedback visual para o usuário

---

## 🎲 Regras do Jogo

1. **Início do jogo:** Ao carregar a página, o sistema sorteia aleatoriamente uma cor entre as cores nomeadas do HTML (ex: red, blue, green, yellow, purple, orange, pink, etc.).

2. **Interface:** O jogador vê um campo de texto para digitar o nome da cor e um botão "Adivinhar".

3. **Tentativas:** O jogador tem **3 tentativas** para acertar a cor sorteada.

4. **Acerto:** Se o jogador acertar a cor:
   - A cor de fundo da página muda para a cor correspondente
   - Uma mensagem de parabéns é exibida
   - O jogo é finalizado

5. **Erro:** Se o jogador errar:
   - Uma mensagem de erro é exibida
   - O contador de tentativas é decrementado
   - O campo de texto é limpo para nova tentativa

6. **Fim de jogo:** Após 3 tentativas sem acerto, o jogo é finalizado e a cor correta é revelada.

7. **Reiniciar:** Um botão "Jogar Novamente" permite reiniciar o jogo com uma nova cor sorteada.

---

## ⚙️ Especificações Técnicas

### Estrutura HTML

A página deve conter, no mínimo:

- Um título principal (h1) com o nome do jogo
- Um parágrafo com instruções para o jogador
- Um elemento para exibir o número de tentativas restantes
- Um campo de texto (input type="text") para o jogador digitar a cor
- Um botão "Adivinhar" para submeter a resposta
- Uma área (div ou p) para exibir mensagens de feedback
- Um botão "Jogar Novamente" (inicialmente oculto)

### Estilização CSS

- Design responsivo e visualmente agradável
- Centralização do conteúdo na página
- Estilização dos botões com hover effects
- Cores harmoniosas e legíveis
- Transição suave ao mudar a cor de fundo (use CSS transition)

### Lógica Javascript

O código Javascript deve implementar:

- **Array de cores:** Criar um array com pelo menos 10 cores nomeadas do HTML (ex: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray', 'cyan'])
- **Sorteio aleatório:** Função para sortear uma cor aleatória do array usando `Math.random()` e `Math.floor()`
- **Controle de tentativas:** Variável para armazenar o número de tentativas restantes (inicialmente 3)
- **Validação de entrada:** Verificar se o campo não está vazio e converter para lowercase para comparação
- **Comparação:** Comparar a cor digitada com a cor sorteada
- **Manipulação do DOM:**
  - Atualizar contador de tentativas
  - Exibir mensagens de feedback
  - Alterar a cor de fundo do body
  - Desabilitar/habilitar botões conforme estado do jogo
- **Event listeners:** Adicionar eventos aos botões "Adivinhar" e "Jogar Novamente"
- **Função de reset:** Reiniciar o jogo com uma nova cor sorteada

---

## 💡 Fluxograma da Lógica

```
1. INÍCIO
2. Criar array de cores
3. Sortear cor aleatória
4. Definir tentativas = 3
5. AGUARDAR ação do jogador
6. SE botão "Adivinhar" clicado:
   a. Obter valor digitado
   b. Converter para lowercase
   c. SE valor vazio:
      - Exibir "Digite uma cor!"
   d. SENÃO:
      - SE valor == cor sorteada:
         * Mudar fundo para cor sorteada
         * Exibir "Parabéns! Você acertou!"
         * Desabilitar botão "Adivinhar"
         * Exibir botão "Jogar Novamente"
      - SENÃO:
         * Decrementar tentativas
         * SE tentativas > 0:
            - Exibir "Errou! Tentativas restantes: X"
            - Limpar campo de texto
         * SENÃO:
            - Exibir "Fim de jogo! A cor era: [cor]"
            - Desabilitar botão "Adivinhar"
            - Exibir botão "Jogar Novamente"
7. SE botão "Jogar Novamente" clicado:
   - Reiniciar jogo (ir para passo 2)
8. FIM
```

---

## 📦 Entregas Obrigatórias

1. **Código-fonte completo:**
   - Arquivo HTML (index.html)
   - Arquivo CSS (style.css ou styles.css)
   - Arquivo Javascript (script.js ou app.js)

2. **Repositório GitHub:**
   - Código versionado no GitHub
   - README.md com instruções de uso e descrição do projeto
   - Commits organizados e descritivos

3. **Demonstração funcional:**
   - Projeto publicado no GitHub Pages
   - Link funcional para acesso online

---

## 📊 Rubrica de Avaliação (Total: 10,0 pontos)

| Critério | Pontuação | Descrição |
|----------|-----------|-----------|
| **1. Estrutura HTML** | **1,5** | **1,5 pts:** HTML completo e semântico com todos os elementos necessários<br>**1,0 pts:** HTML funcional, mas com pequenos problemas de estrutura<br>**0,5 pts:** HTML básico, faltando elementos importantes<br>**0,0 pts:** HTML incompleto ou não funcional |
| **2. Estilização CSS** | **1,5** | **1,5 pts:** Design responsivo, visualmente atraente e profissional<br>**1,0 pts:** Estilização adequada, mas com melhorias visuais possíveis<br>**0,5 pts:** CSS básico, aparência simples<br>**0,0 pts:** Sem CSS ou estilização inadequada |
| **3. Sorteio Aleatório de Cores** | **1,0** | **1,0 pts:** Sorteio funcionando perfeitamente com array de cores<br>**0,5 pts:** Sorteio funcional, mas com implementação incorreta<br>**0,0 pts:** Sorteio não implementado ou não funcional |
| **4. Controle de Tentativas** | **1,5** | **1,5 pts:** Sistema de 3 tentativas funcionando perfeitamente<br>**1,0 pts:** Controle de tentativas funcional com pequenos bugs<br>**0,5 pts:** Controle de tentativas parcialmente implementado<br>**0,0 pts:** Controle de tentativas ausente |
| **5. Validação e Comparação** | **1,5** | **1,5 pts:** Validação de entrada e comparação correta (case-insensitive)<br>**1,0 pts:** Comparação funcional, mas sem validação adequada<br>**0,5 pts:** Comparação básica implementada<br>**0,0 pts:** Comparação não funcional |
| **6. Mudança de Cor de Fundo** | **1,0** | **1,0 pts:** Cor de fundo muda corretamente ao acertar<br>**0,5 pts:** Mudança funcional, mas com problemas visuais<br>**0,0 pts:** Mudança de cor não implementada |
| **7. Feedback Visual (Mensagens)** | **1,0** | **1,0 pts:** Mensagens claras e contextuais para acerto, erro e fim de jogo<br>**0,5 pts:** Mensagens básicas implementadas<br>**0,0 pts:** Sem feedback visual adequado |
| **8. Funcionalidade "Jogar Novamente"** | **1,0** | **1,0 pts:** Função de reset completa, reiniciando o jogo corretamente<br>**0,5 pts:** Reset funcional, mas com problemas menores<br>**0,0 pts:** Função não implementada ou não funcional |
| **9. Organização do Código** | **0,5** | **0,5 pts:** Código limpo, comentado e bem organizado<br>**0,25 pts:** Código funcional, mas desorganizado<br>**0,0 pts:** Código confuso e sem organização |
| **10. GitHub e Documentação** | **0,5** | **0,5 pts:** Projeto no GitHub com README completo e GitHub Pages ativo<br>**0,25 pts:** Projeto no GitHub, mas com documentação incompleta<br>**0,0 pts:** Sem repositório GitHub ou documentação |
| **TOTAL** | **10,0** | **Pontuação máxima do projeto** |

---

## 💡 Dicas para o Sucesso

- **Planeje antes de codificar:** Faça um esboço da interface e do fluxo do jogo
- **Teste incrementalmente:** Teste cada funcionalidade antes de passar para a próxima
- **Use o console do navegador:** `console.log()` é seu melhor amigo para debug
- **Valide os dados:** Sempre valide o que o usuário digita
- **Commits frequentes:** Faça commits no Git a cada funcionalidade implementada
- **README.md detalhado:** Documente como jogar e quais tecnologias foram usadas
- **Capriche no design:** Um jogo visualmente atraente impressiona!

---

## 📚 Recursos de Apoio

- **MDN - Math.random():** [https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
- **MDN - Array:** [https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array)
- **MDN - DOM Events:** [https://developer.mozilla.org/pt-BR/docs/Web/Events](https://developer.mozilla.org/pt-BR/docs/Web/Events)
- **Lista de Cores HTML:** [https://www.w3schools.com/colors/colors_names.asp](https://www.w3schools.com/colors/colors_names.asp)
- **GitHub Pages:** [https://pages.github.com/](https://pages.github.com/)

---

## 📅 Prazo de Entrega

**A definir pelo professor**

Submeta o link do repositório GitHub no AVA FAESA na área de Envio de Trabalhos

---

---

## 🚀 PLANO DE IMPLEMENTAÇÃO - DESAFIO DAS SUAS CORES

### 📁 Estrutura de Arquivos
```
/desafio-cores/
├── index.html          (página principal do jogo)
├── styles.css          (estilização específica)
├── script.js           (lógica do jogo)
└── README.md           (documentação do jogo)
```

### 🎨 Sistema de Cores por Nível

#### Nível Fácil (10 cores básicas)
`red, blue, green, yellow, purple, orange, pink, brown, gray, white`

#### Nível Médio (10 cores intermediárias) 
`navy, teal, coral, crimson, indigo, lime, olive, cyan, gold, silver`

#### Nível Difícil (10 cores complexas)
`darkslateblue, lightcoral, mediumseagreen, darkgoldenrod, lightsteelblue, palevioletred, mediumorchid, darkolivegreen, lightslategray, mediumturquoise`

### 🎯 Funcionalidades Extras

- **Sistema de Pontuação:** Fácil=10pts, Médio=25pts, Difícil=50pts
- **Histórico de Partidas:** LocalStorage para estatísticas
- **Progressão de Níveis:** Sucesso desbloqueia próximo nível
- **Feedback Inteligente:** Dicas por família de cores
- **Anti-Repetição:** Garante cores diferentes por sessão

### 🔗 Integração
- Botão "🎨 DESAFIO DAS SUAS CORES" na página principal
- Navegação independente sem afetar código existente

---

## Mensagem Final

**Prezados alunos,** este projeto é uma excelente oportunidade para aplicar todo o conhecimento de Javascript adquirido até aqui. Divirtam-se criando o jogo e não hesitem em ser criativos com o design e funcionalidades extras!

**Bom trabalho!**  
**Prof. Otávio Lube**