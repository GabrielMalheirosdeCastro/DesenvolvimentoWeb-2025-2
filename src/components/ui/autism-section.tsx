import React from 'react';
import { Heart, Star, Brain, Sparkles } from 'lucide-react';

interface AutismSectionProps {
  className?: string;
}

const AutismSection: React.FC<AutismSectionProps> = ({ className = '' }) => {
  return (
    <div className={`autism-section max-w-6xl mx-auto mt-16 ${className}`}>
      {/* Container principal com estilo de posicionamento e tipografia */}
      <div className="autism-container bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-gradient-to-r from-blue-200 to-purple-200 relative overflow-hidden">
        
        {/* Elementos decorativos com posicionamento absoluto */}
        <div className="absolute top-4 left-4 text-6xl opacity-10 transform rotate-12">
          <Brain />
        </div>
        <div className="absolute bottom-4 right-4 text-5xl opacity-10 transform -rotate-12">
          <Sparkles />
        </div>
        
        {/* Header da seção */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
            Sou um autista mas faço meu melhor
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Esta seção demonstra meu compromisso com a excelência no desenvolvimento web, 
            combinando técnicas de posicionamento CSS e tipografia avançada.
          </p>
        </div>

        {/* Grid de demonstrações */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Seção de Posicionamento */}
          <div className="positioning-demo bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="text-yellow-500" size={24} />
              Posicionamento CSS
            </h3>
            <p className="text-gray-600 mb-6">
              Demonstração de técnicas avançadas de posicionamento e layout
            </p>
            
            {/* Container para demonstração de posicionamento */}
            <div className="relative bg-gray-100 rounded-xl p-6 h-48 overflow-hidden">
              
              {/* Elemento com position: relative */}
              <div className="relative bg-blue-500 text-white p-3 rounded-lg w-32 mb-4 transform translate-x-4 translate-y-2">
                <span className="text-sm font-medium">Relative</span>
              </div>
              
              {/* Container para absolute */}
              <div className="relative bg-gray-200 rounded-lg h-24 mb-4">
                <div className="absolute top-2 left-2 bg-green-500 text-white p-2 rounded text-xs font-medium">
                  Absolute TL
                </div>
                <div className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded text-xs font-medium">
                  Absolute TR
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white p-2 rounded text-xs font-medium">
                  Centered
                </div>
              </div>
              
              {/* Elemento fixo simulado */}
              <div className="absolute bottom-4 right-4 bg-orange-500 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center">
                <Heart size={16} />
              </div>
            </div>
          </div>

          {/* Seção de Tipografia */}
          <div className="typography-demo bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="text-purple-500" size={24} />
              Tipografia Avançada
            </h3>
            <p className="text-gray-600 mb-6">
              Hierarquia tipográfica e diferentes estilos de texto
            </p>
            
            {/* Demonstração de tipografia */}
            <div className="space-y-4">
              <h4 className="text-3xl font-black text-gray-900 tracking-tight">
                Display Font
              </h4>
              <h5 className="text-xl font-bold text-gray-800 tracking-wide">
                Heading Bold
              </h5>
              <p className="text-base font-medium text-gray-700 leading-relaxed">
                Parágrafo com fonte medium e line-height otimizado para leitura confortável.
              </p>
              <p className="text-sm font-normal text-gray-600 italic">
                Texto em itálico com tamanho reduzido para informações secundárias.
              </p>
              <code className="inline-block bg-gray-800 text-green-400 px-3 py-1 rounded-md font-mono text-sm">
                font-family: 'Inter', sans-serif;
              </code>
            </div>
          </div>
        </div>

        {/* Seção de Z-index e empilhamento */}
        <div className="z-index-demo bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Z-index e Empilhamento
          </h3>
          <p className="text-gray-600 mb-6 text-center">
            Demonstração de camadas sobrepostas com diferentes valores de z-index
          </p>
          
          <div className="relative h-32 mx-auto max-w-md">
            <div className="absolute top-0 left-0 bg-red-400 w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold shadow-lg z-10">
              Z: 10
            </div>
            <div className="absolute top-4 left-8 bg-blue-400 w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold shadow-lg z-20">
              Z: 20
            </div>
            <div className="absolute top-8 left-16 bg-green-400 w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold shadow-lg z-30">
              Z: 30
            </div>
          </div>
        </div>

        {/* Mensagem motivacional */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
          <h4 className="text-2xl font-bold mb-3">
            Cada linha de código é um passo em direção à excelência
          </h4>
          <p className="text-lg opacity-90 leading-relaxed">
            O autismo me proporciona uma perspectiva única para resolver problemas complexos 
            e criar soluções inovadoras no desenvolvimento web.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutismSection;