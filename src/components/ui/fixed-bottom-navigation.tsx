import React from 'react';
import { Home, Github, Rocket, Settings, Zap } from 'lucide-react';
import { cn } from './utils';

interface FixedBottomNavigationProps {
  currentScreen: 'main' | 'gallery' | 'spaceships' | 'figma' | 'settings';
  onNavigate: (screen: 'main' | 'gallery' | 'spaceships' | 'figma' | 'settings') => void;
  enableThemeSelector?: boolean;
  className?: string;
}

export const FixedBottomNavigation: React.FC<FixedBottomNavigationProps> = ({
  currentScreen,
  onNavigate,
  enableThemeSelector = true,
  className
}) => {
  const navigationItems = [
    {
      id: 'main' as const,
      icon: Home,
      label: 'Início',
      description: 'Tela Principal'
    },
    {
      id: 'gallery' as const,
      icon: Github,
      label: 'Projetos',
      description: 'Portfólio'
    },
    {
      id: 'spaceships' as const,
      icon: Rocket,
      label: 'Naves',
      description: 'Galeria Espacial'
    },
    {
      id: 'figma' as const,
      icon: Zap,
      label: 'Figma',
      description: 'Assets Figma'
    },
    ...(enableThemeSelector ? [{
      id: 'settings' as const,
      icon: Settings,
      label: 'Config',
      description: 'Configurações'
    }] : [])
  ];

  return (
    <div 
      className={cn(
        // Posicionamento fixo na parte inferior
        "fixed bottom-0 left-0 right-0 z-50",
        // Container com backdrop blur para efeito glassmorphism
        "bg-white/95 backdrop-blur-lg border-t border-gray-200/50",
        // Sombra sutil para destacar da página
        "shadow-2xl shadow-black/10",
        // Transições suaves
        "transition-all duration-300",
        className
      )}
    >
      {/* Container principal com padding responsivo reduzido */}
      <div className="max-w-screen-lg mx-auto px-4 py-3">
        {/* Grid responsivo dos botões com espaçamento reduzido */}
        <div className="flex justify-center items-center gap-3 md:gap-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  // Layout base com espaçamento reduzido
                  "flex flex-col items-center gap-1",
                  "px-3 py-2 md:px-4 md:py-3 rounded-lg",
                  "transition-all duration-200 font-medium",
                  "min-w-[70px] md:min-w-[85px]",
                  // Estados ativo/inativo
                  isActive
                    ? "bg-brand-primary text-white shadow-lg scale-105"
                    : "bg-transparent text-brand-primary hover:bg-brand-primary/10",
                  // Efeitos hover
                  "hover:scale-105 hover:shadow-md",
                  // Acessibilidade
                  "focus:outline-none focus:ring-2 focus:ring-brand-primary/50",
                  // Responsividade
                  "text-sm md:text-base"
                )}
                title={`${item.label} - ${item.description}`}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-transform duration-200",
                    isActive && "drop-shadow-sm"
                  )} 
                />
                {/* Label mais compacto */}
                <span className="font-medium leading-tight text-center text-xs md:text-sm">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gradiente sutil para melhor integração visual */}
      <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default FixedBottomNavigation;