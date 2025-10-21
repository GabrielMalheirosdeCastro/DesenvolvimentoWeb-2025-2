import { SelectableImage } from '../hooks/useImageSelection';

// Importações diretas dos assets
import spaceImage1 from '../assets/dd18ec3bf35c35cc0e58cd61147ab94926272d3c.png';
import spaceImage2 from '../assets/681ee2140d8a3dfb23dc398515d8e9539fb56338.png';
import spaceImage3 from '../assets/55baa85e8789d73e4e943d1a375f594add7941b3.png';
import spaceImage4 from '../assets/df4077de47a65010f0db03b4bde4b1720336789e.png';

// Dados da frota espacial usando as imagens existentes do projeto
export const spaceFleetImages: SelectableImage[] = [
  {
    id: 'space-battle-epic',
    src: spaceImage1,
    alt: 'Naves espaciais em combate épico',
    title: 'Batalha Espacial Épica',
    description: 'Uma cena intensa de combate entre naves espaciais avançadas, mostrando explosões e manobras táticas no vácuo do espaço.',
    category: 'Combate'
  },
  {
    id: 'x-wing-starfighter',
    src: spaceImage2,
    alt: 'T-85 X-Wing de Star Wars',
    title: 'X-Wing Starfighter',
    description: 'O icônico caça estelar T-85 X-Wing da Aliança Rebelde, conhecido por sua versatilidade e poder de fogo.',
    category: 'Caças Estelares'
  },
  {
    id: 'star-fox-fleet',
    src: spaceImage3,
    alt: 'Star Fox Corneria Army naves e bases',
    title: 'Frota de Corneria',
    description: 'Naves e bases militares da Corneria Army do universo Star Fox, incluindo Arwings e estruturas defensivas.',
    category: 'Frotas Militares'
  },
  {
    id: 'morse-communications',
    src: spaceImage4,
    alt: 'Tabela de Código Morse para comunicações espaciais',
    title: 'Comunicações Espaciais',
    description: 'Sistema de comunicação morse utilizado para transmissões de longa distância entre naves espaciais.',
    category: 'Comunicações'
  }
];

// Funções utilitárias
export const getImagesByCategory = (category: string): SelectableImage[] => {
  return spaceFleetImages.filter(image => image.category === category);
};

export const getImageById = (id: string): SelectableImage | undefined => {
  return spaceFleetImages.find(image => image.id === id);
};

export const categories = [...new Set(spaceFleetImages.map(image => image.category))];

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'Combate': '⚔️',
    'Caças Estelares': '🚀',
    'Frotas Militares': '🛸',
    'Comunicações': '📡'
  };
  return icons[category] || '🌌';
};
