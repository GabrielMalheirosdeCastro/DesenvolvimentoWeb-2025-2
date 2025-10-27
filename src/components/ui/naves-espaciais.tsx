import React, { useState } from 'react';
import { cn } from '../ui/utils';

interface NavesEspaciaisProps {
  className?: string;
  enableHtmlImages?: boolean; // Suporte a imagens HTML
}

const NavesEspaciais: React.FC<NavesEspaciaisProps> = ({ className, enableHtmlImages = false }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Dados das naves espaciais Star Wars
  const navesEspaciais = [
    {
      id: 1,
      name: "Star Destroyer - Venator Class",
      description: "Nave capital da República com poder de fogo impressionante",
      alt: "Star Destroyer classe Venator com torre de comando elevada",
      specs: {
        comprimento: "1.137 metros",
        armamento: "52 turbolasers pesados",
        cacas: "420 starfighters",
        tripulacao: "7.400 clones"
      },
      htmlImageSrc: enableHtmlImages ? "./assets/naves-espaciais/star-destroyer-venator.jpg" : null
    },
    {
      id: 2,
      name: "Acclamator Class Assault Ship", 
      description: "Navio de assalto especializado em invasões planetárias",
      alt: "Acclamator Class com compartimentos para tropas e veículos",
      specs: {
        comprimento: "752 metros",
        tropas: "16.000 clones",
        veiculos: "AT-TEs, LAATs",
        missao: "Invasões planetárias"
      },
      htmlImageSrc: enableHtmlImages ? "./assets/naves-espaciais/acclamator-assault.jpg" : null
    },
    {
      id: 3,
      name: "Frota de Combate Militar",
      description: "Formação de batalha com múltiplas classes de naves",
      alt: "Frota militar em formação de linha de batalha espacial",
      specs: {
        naves: "Múltiplas classes",
        formacao: "Linha de batalha",
        tatica: "Superioridade espacial",
        comando: "Coordenado"
      },
      htmlImageSrc: enableHtmlImages ? "./assets/naves-espaciais/frota-combate.jpg" : null
    },
    {
      id: 4,
      name: "República Venator - Flagship",
      description: "Nave almirante com marcações republicanas distintivas",
      alt: "Venator flagship com livery da República e torre de comando",
      specs: {
        status: "Nave capital",
        torre: "Comando elevado",
        livery: "Marcas republicanas",
        role: "Flagship"
      },
      htmlImageSrc: enableHtmlImages ? "./assets/naves-espaciais/republica-flagship.jpg" : null
    }
  ];

  return (
    <div className={cn("naves-espaciais-section", className)}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🚀 Galeria de Naves Espaciais
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Coleção épica de naves espaciais do universo Star Wars com especificações técnicas detalhadas e design militar avançado
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          ⭐ Esta é a GALERIA ESPACIAL oficial do projeto
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {navesEspaciais.map((nave, index) => (
          <div key={nave.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 relative overflow-hidden">
              {nave.htmlImageSrc && enableHtmlImages ? (
                <img 
                  src={nave.htmlImageSrc}
                  alt={nave.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white">
                  {/* Placeholders visuais únicos para cada nave */}
                  {index === 0 && (
                    <div className="text-center">
                      <div className="text-4xl mb-2">⚔️</div>
                      <div className="text-sm font-medium">Star Destroyer</div>
                      <div className="text-xs opacity-75">Classe Venator</div>
                    </div>
                  )}
                  {index === 1 && (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🪖</div>
                      <div className="text-sm font-medium">Assault Ship</div>
                      <div className="text-xs opacity-75">Classe Acclamator</div>
                    </div>
                  )}
                  {index === 2 && (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🛡️</div>
                      <div className="text-sm font-medium">Frota Militar</div>
                      <div className="text-xs opacity-75">Formação de Combate</div>
                    </div>
                  )}
                  {index === 3 && (
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎯</div>
                      <div className="text-sm font-medium">Flagship</div>
                      <div className="text-xs opacity-75">República Venator</div>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs text-green-300 text-center font-medium">
                      🌌 GALERIA ESPACIAL - <a href="galeria-naves-espaciais.html" className="underline hover:text-green-100" target="_blank" rel="noopener noreferrer">Ver Versão HTML</a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {nave.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {nave.description}
              </p>
              
              {/* Especificações técnicas */}
              <div className="space-y-1 text-xs">
                {Object.entries(nave.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="text-gray-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedImage(selectedImage === nave.id ? null : nave.id)}
                className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                {selectedImage === nave.id ? '▼ Ocultar Detalhes' : '▶ Ver Detalhes'}
              </button>

              {selectedImage === nave.id && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                  <div>
                    <strong>Especificações Técnicas:</strong>
                  </div>
                  {Object.entries(nave.specs).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="w-20 text-gray-500 capitalize">{key}:</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-gray-600">
                      <strong>Status:</strong> Baseado no universo Star Wars
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Seção educativa sobre as naves */}
      <div className="mt-12 max-w-4xl mx-auto bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            🚀 Universo Star Wars - Era da República
          </h3>
          <p className="text-gray-600">
            Essas naves espaciais representam o poder militar da República Galáctica durante as Guerras Clônicas, 
            demonstrando engenharia avançada e design tático especializado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🔧</div>
            <h4 className="font-semibold text-gray-800">Engenharia</h4>
            <p className="text-sm text-gray-600 mt-1">Tecnologia avançada de propulsão e armamento</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">⚔️</div>
            <h4 className="font-semibold text-gray-800">Combate</h4>
            <p className="text-sm text-gray-600 mt-1">Estratégias militares e formações de batalha</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-3xl mb-2">🌌</div>
            <h4 className="font-semibold text-gray-800">Exploração</h4>
            <p className="text-sm text-gray-600 mt-1">Expansão e controle territorial galáctico</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="galeria-naves-espaciais.html" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            🖼️ Ver Galeria HTML Completa
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Para adicionar imagens reais, coloque os arquivos em: 
            <code className="bg-white px-2 py-1 rounded font-mono text-xs">src/assets/naves-espaciais/</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavesEspaciais;