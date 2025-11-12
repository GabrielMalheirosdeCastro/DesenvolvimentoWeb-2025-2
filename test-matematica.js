// Arquivo para testar a lógica matemática da página
console.log('🧮 Testando respostas dos exercícios:');
console.log('Ex1: 8 * 3 + 2 / 2 =', 8 * 3 + 2 / 2, '(esperado: 25)');
console.log('Ex2: 1 + 3 ** 2 / 9 =', 1 + 3 ** 2 / 9, '(esperado: 2)');
console.log('Ex3: 1 + 3 ** 2 / 9 =', 1 + 3 ** 2 / 9, '(esperado: 2)');
console.log('Ex4: -3 + 4 * ( 10 % 4 ) =', -3 + 4 * ( 10 % 4 ), '(esperado: 5)');
console.log('Ex5: ( 8 - 2 * 3 ) % 1 * 2 =', ( 8 - 2 * 3 ) % 1 * 2, '(esperado: 0)');

console.log('\n💰 Testando exemplos práticos:');
let preco = 1850;
let porc = 20;
let valor = (preco * porc) / 100;
let novo = preco - valor;
console.log('Desconto 20% de R$1850: R$', novo);

let sal = 3480;
let porc2 = 13;
let valor2 = (sal * porc2) / 100;
let novo2 = sal + valor2;
console.log('Aumento 13% de R$3480: R$', novo2);

console.log('\n🎲 Testando funções Math:');
console.log('Math.PI =', Math.PI);
console.log('Math.abs(-200) =', Math.abs(-200));
console.log('Math.sqrt(81) =', Math.sqrt(81));
console.log('Math.cbrt(27) =', Math.cbrt(27));
console.log('Math.ceil(12.2) =', Math.ceil(12.2));
console.log('Math.floor(15.7) =', Math.floor(15.7));
console.log('Math.round(18.5) =', Math.round(18.5));
console.log('Math.trunc(22.9234) =', Math.trunc(22.9234));
console.log('Math.min(5, 9, 2, 6, 1, 4) =', Math.min(5, 9, 2, 6, 1, 4));
console.log('Math.max(5, 9, 2, 6, 1, 4) =', Math.max(5, 9, 2, 6, 1, 4));

console.log('\n✅ Todos os testes executados com sucesso!');