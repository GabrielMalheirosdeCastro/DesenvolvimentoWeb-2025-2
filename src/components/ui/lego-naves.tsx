import React, { useState } from 'react';
import { cn } from '../ui/utils';

interface LegoNavesProps {
  className?: string;
}

const LegoNaves: React.FC<LegoNavesProps> = ({ className }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Dados das mini naves LEGO - usando placeholders seguros por enquanto
  const legoNaves = [
    {
      id: 1,
      name: "Mini Nave Espacial 1",
      description: "Primeira mini nave construída com peças LEGO",
      alt: "Mini nave espacial LEGO com detalhes em vermelho e cinza"
    },
    {
      id: 2,
      name: "Mini Nave Espacial 2", 
      description: "Segunda mini nave com design diferenciado",
      alt: "Mini nave espacial LEGO com estrutura complexa e múltiplas cores"
    },
    {
      id: 3,
      name: "Mini Nave Espacial 3",
      description: "Terceira mini nave do conjunto", 
      alt: "Mini nave espacial LEGO com configuração única de peças"
    }
  ];

  return (
    <div className={cn("lego-naves-section", className)}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🚀 Mini Naves LEGO
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Essas mini naves de LEGO foram o começo de eu criar as naves grandes de LEGO
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {legoNaves.map((nave, index) => (
          <div 
            key={nave.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
              {/* Placeholder com preview das imagens LEGO */}
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                {/* Simulação visual das naves LEGO baseada nas imagens fornecidas */}
                <div className="text-center p-4 relative">
                  {index === 0 && (
                    <div className="relative">
                      {/* Nave 1: Estrutura com detalhes vermelhos e cinza */}
                      <div className="text-6xl mb-2 filter drop-shadow-lg">�</div>
                      <div className="text-sm font-medium text-gray-700">Nave com Detalhes Vermelhos</div>
                      <div className="text-xs text-gray-500 mt-1">Estrutura básica com cockpit</div>
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                  
                  {index === 1 && (
                    <div className="relative">
                      {/* Nave 2: Estrutura mais complexa */}
                      <div className="text-6xl mb-2 filter drop-shadow-lg">🚁</div>
                      <div className="text-sm font-medium text-gray-700">Nave com Estrutura Complexa</div>
                      <div className="text-xs text-gray-500 mt-1">Múltiplas cores e detalhes</div>
                      <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="relative">
                      {/* Nave 3: Configuração única */}
                      <div className="text-6xl mb-2 filter drop-shadow-lg">✈️</div>
                      <div className="text-sm font-medium text-gray-700">Nave Configuração Única</div>
                      <div className="text-xs text-gray-500 mt-1">Design diferenciado</div>
                      <div className="absolute -top-2 center w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                  
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    📷 Preview - Clique para carregar imagem real
                  </div>
                </div>
              </div>
              
              {/* Botão para expandir */}
              <button 
                onClick={() => setSelectedImage(selectedImage === index ? null : index)}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                aria-label={`Ver detalhes da ${nave.name}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">
                {nave.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {nave.description}
              </p>
              
              {/* Informações técnicas */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  🧱 LEGO Original
                </span>
                <span className="flex items-center gap-1">
                  ⭐ Projeto Inicial
                </span>
              </div>
            </div>

            {/* Detalhes expandidos */}
            {selectedImage === index && (
              <div className="border-t bg-gray-50 p-4">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    <strong>Inspiração:</strong> Esta mini nave fez parte dos primeiros experimentos 
                    com construção de naves espaciais em LEGO.
                  </p>
                  <p>
                    <strong>Técnica:</strong> Construção livre usando peças básicas do LEGO, 
                    focando na criatividade e exploração de formas.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Texto explicativo adicional */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3 text-blue-800">
              🎯 A Evolução das Construções
            </h3>
            <p className="text-blue-700 leading-relaxed">
              Essas mini naves representam o ponto de partida da minha jornada na construção de 
              naves espaciais com LEGO. O que começou como experimentos simples evoluiu para 
              projetos maiores e mais complexos, demonstrando como a criatividade cresce através 
              da prática e experimentação contínua.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🏗️</div>
                <div className="text-sm font-medium text-blue-800">Experimentação</div>
                <div className="text-xs text-blue-600">Primeiras tentativas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🔧</div>
                <div className="text-sm font-medium text-blue-800">Aprendizado</div>
                <div className="text-xs text-blue-600">Técnicas básicas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-sm font-medium text-blue-800">Evolução</div>
                <div className="text-xs text-blue-600">Projetos maiores</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegoNaves;