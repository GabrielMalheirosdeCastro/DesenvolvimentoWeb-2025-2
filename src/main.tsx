import React from 'react';
import { createRoot } from 'react-dom/client';
import { SpaceGallery } from './components/gallery/SpaceGallery';
import { spaceFleetImages } from './data/spaceFleetData';
import { SelectableImage } from './hooks/useImageSelection';

// Importar ícones existentes
import { User, Heart, MessageCircle, TrendingDown, Code } from 'lucide-react';

// Componentes de card existentes
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

// Importar estilos
import './index.css';

function App() {
  const [selectedImageData, setSelectedImageData] = React.useState<SelectableImage[]>([]);

  const handleSelectionChange = (selectedIds: string[], selectedImages: SelectableImage[]) => {
    setSelectedImageData(selectedImages);
    console.log('Seleção atualizada:', { selectedIds, selectedImages });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabeçalho existente */}
        <div className="text-center mb-12">
          <h1 className="mb-4 text-indigo-800">Apresentação Pessoal</h1>
          <div className="w-24 h-1 bg-indigo-400 mx-auto rounded-full"></div>
        </div>

        {/* Card Sobre Mim */}
        <Card className="shadow-lg border-l-4 border-l-indigo-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-indigo-700">
              <User className="w-6 h-6" />
              Sobre Mim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-gray-700">
              Meu nome é Gabriel Malheiros de Castro, sou uma pessoa com autismo e tenho problema de desmotivação e ansiedade, mas procuro fazer meu melhor.
            </p>
          </CardContent>
        </Card>

        {/* NOVA SEÇÃO: Galeria Interativa */}
        <Card className="shadow-lg border-l-4 border-l-cyan-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-cyan-700">
              <Heart className="w-6 h-6" />
              Galeria Interativa - Minhas Naves Favoritas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-gray-700 mb-6">
              Explore minha coleção de naves espaciais! Clique nas imagens para selecioná-las e ver mais detalhes.
            </p>
            
            <SpaceGallery
              images={spaceFleetImages}
              allowMultipleSelection={true}
              onSelectionChange={handleSelectionChange}
              className="mb-6"
            />
            
            {/* Detalhes das seleções */}
            {selectedImageData.length > 0 && (
              <div className="mt-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-800 mb-4">
                  Detalhes das Naves Selecionadas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  interface SelectedImageCardProps {
                    image: SelectableImage;
                  }

                  const SelectedImageCard: React.FC<SelectedImageCardProps> = ({ image }) => (
                    <div key={image.id} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center text-white text-2xl">
                        {image.category === 'Combate' && '⚔️'}
                        {image.category === 'Caças Estelares' && '🚀'}
                        {image.category === 'Frotas Militares' && '🛸'}
                        {image.category === 'Comunicações' && '📡'}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{image.title}</h4>
                        <p className="text-sm text-gray-600">{image.description}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">
                          {image.category}
                        </span>
                      </div>
                    </div>
                  );

                  interface SelectedImageListProps {
                    selectedImageData: SelectableImage[];
                  }

                  const SelectedImageList: React.FC<SelectedImageListProps> = ({ selectedImageData }) => (
                    <>
                      {selectedImageData.map((image) => (
                        <SelectedImageCard key={image.id} image={image} />
                      ))}
                    </>
                  );

                  // Uso no JSX:
                  <SelectedImageList selectedImageData={selectedImageData} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Meus Interesses */}
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-700">
              <Heart className="w-6 h-6" />
              Meus Interesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-gray-700">
              Eu gosto de montar naves de lego de Star Wars e brincar um pouco mas também gosto de ver filmes e series de animação e de outras ficção cientifica.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <img
                src="/src/assets/681ee2140d8a3dfb23dc398515d8e9539fb56338.png"
                alt="T-65 X-Wing de Star Wars"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              <img
                src="/src/assets/55baa85e8789d73e4e943d1a375f594add7941b3.png"
                alt="Star Fox Corneria Army naves e bases"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card Uma Reflexão */}
        <Card className="shadow-lg border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-amber-700">
              <MessageCircle className="w-6 h-6" />
              Uma Reflexão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-gray-700">
              Eu conhecia alguém que se achava perfeito por causa dessa afirmação falsa: "Todo mundo tem defeitos e fraquezas"; E ele disse: "eu não tenho nenhum defeito ou fraqueza."
            </p>
          </CardContent>
        </Card>

        {/* Card Meus Sentimentos */}
        <Card className="shadow-lg border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-700">
              <TrendingDown className="w-6 h-6" />
              Meus Sentimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-gray-700">
              Eu sinto que meus esforços não são o bastante só por causa de quedas.
            </p>
            <div className="mt-4">
              <img
                src="/src/assets/dd18ec3bf35c35cc0e58cd61147ab94926272d3c.png"
                alt="Naves espaciais em combate"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Card Desafio de Código */}
        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-700">
              <Code className="w-6 h-6" />
              Desafio de Código
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="leading-relaxed text-gray-700">
              Se você se acha tão esperto, descubra como a frase: "Eu sou muito saudável." com o uso da imagem de código morse.
            </p>
            <div className="mt-4">
              <img
                src="/src/assets/df4077de47a65010f0db03b4bde4b1720336789e.png"
                alt="Tabela de Código Morse"
                className="w-full max-w-md mx-auto rounded-lg shadow-md"
              />
            </div>
          </CardContent>
        </Card>

        {/* Rodapé existente */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <span className="text-gray-600">Gabriel Malheiros de Castro</span>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
