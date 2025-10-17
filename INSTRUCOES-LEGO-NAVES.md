# 📋 Instruções para Adicionar Imagens das Mini Naves LEGO

## 🎯 Objetivo
Adicionar com segurança as 3 imagens das mini naves LEGO fornecidas pelo usuário no projeto React.

## 📂 Estrutura Criada
- **Componente**: `src/components/ui/lego-naves.tsx` 
- **Pasta Assets**: `src/assets/lego-naves/`
- **Integração**: Adicionado na tela "Galeria Figma" do projeto

## 🔧 Próximos Passos para Finalizar

### 1. Salvar as Imagens
Salve as 3 imagens das mini naves LEGO na pasta:
```
src/assets/lego-naves/
```

Nomes sugeridos (seguros para web):
- `mini-nave-1.jpg` ou `mini-nave-1.png`
- `mini-nave-2.jpg` ou `mini-nave-2.png` 
- `mini-nave-3.jpg` ou `mini-nave-3.png`

### 2. Atualizar o Componente
No arquivo `src/components/ui/lego-naves.tsx`, substitua os placeholders pelas importações reais:

```typescript
// Adicionar no topo do arquivo:
import minaNave1 from '../../assets/lego-naves/mini-nave-1.jpg';
import minaNave2 from '../../assets/lego-naves/mini-nave-2.jpg';
import minaNave3 from '../../assets/lego-naves/mini-nave-3.jpg';

// No array legoNaves, adicionar a propriedade src:
const legoNaves = [
  {
    id: 1,
    src: minaNave1,
    name: "Mini Nave Espacial 1",
    // ... resto das propriedades
  },
  // ... outros objetos
];
```

### 3. Substituir o Placeholder
No JSX, substitua o div placeholder por:

```jsx
<img 
  src={nave.src}
  alt={nave.alt}
  className="w-full h-full object-cover"
  loading="lazy"
/>
```

## ✅ Benefícios da Implementação

### 🔒 Segurança
- ✅ Componente isolado e reutilizável
- ✅ Validação de propriedades TypeScript
- ✅ Alt text adequado para acessibilidade
- ✅ Loading lazy para performance

### 🎨 Design
- ✅ Grid responsivo (1 coluna mobile, 3 colunas desktop)
- ✅ Cards com hover effects
- ✅ Botão de expandir detalhes
- ✅ Seção explicativa sobre a evolução das construções
- ✅ Design consistente com o tema do projeto

### 📱 UX/UI
- ✅ Texto explicativo: "Essas mini naves de LEGO foram o começo de eu criar as naves grandes de LEGO"
- ✅ Interação: clique para ver mais detalhes
- ✅ Informações técnicas sobre cada nave
- ✅ Seção educativa sobre a evolução criativa

### 🚀 Performance
- ✅ Lazy loading das imagens
- ✅ Otimização automática via Vite
- ✅ Componente leve e bem estruturado

## 📍 Localização no Site
A seção aparece na **"Galeria Figma"** (acessível via navegação inferior), entre:
1. Galeria de Assets do Figma (imagens espaciais)
2. **→ Mini Naves LEGO** ← (nova seção)
3. Sobre o Desenvolvedor
4. Desafio Interativo (código morse)

## 🔄 Como Acessar
1. Abrir o projeto: `npm run dev`
2. Navegar para "Galeria Figma" (ícone na navegação inferior)
3. Scrollar para baixo até encontrar a seção "🚀 Mini Naves LEGO"

## 📝 Observações Técnicas
- **Framework**: React + TypeScript
- **Estilização**: Tailwind CSS
- **Estado**: useState para interações
- **Acessibilidade**: ARIA labels e alt text
- **Responsividade**: Mobile-first design