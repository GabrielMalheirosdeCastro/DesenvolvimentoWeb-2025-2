import React from 'react';
import { FileText, Palette, Code, ExternalLink } from 'lucide-react';
import { cn } from './utils';

interface LaboratoriosLinksProps {
  className?: string;
}

export const LaboratoriosLinks: React.FC<LaboratoriosLinksProps> = ({ className }) => {
  const laboratorios = [
    {
      numero: "1",
      titulo: "Fundamentos CSS",
      descricao: "Conceitos básicos, seletores e propriedades CSS essenciais",
      url: "/lab-fundamentos-css.html",
      icon: Code,
      cor: "from-blue-500 to-blue-600",
      corFundo: "bg-blue-50",
      corTexto: "text-blue-700"
    },
    {
      numero: "2", 
      titulo: "Tipografia e Cores",
      descricao: "Propriedades tipográficas avançadas e sistemas de cores profissionais",
      url: "/tipografia.html",
      icon: Palette,
      cor: "from-purple-500 to-purple-600", 
      corFundo: "bg-purple-50",
      corTexto: "text-purple-700",
      destaque: true
    },
    {
      numero: "3",
      titulo: "Layout e Responsividade",
      descricao: "Flexbox, Grid CSS e design responsivo moderno",
      url: "#",
      icon: FileText,
      cor: "from-green-500 to-green-600",
      corFundo: "bg-green-50", 
      corTexto: "text-green-700",
      emBreve: true
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Título da seção */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📚 Laboratórios Acadêmicos FAESA
        </h2>
        <p className="text-gray-600">
          Demonstrações práticas dos conceitos de Desenvolvimento Web
        </p>
      </div>

      {/* Mensagem especial destacada */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">🌟 Gabriel Malheiros de Castro</h3>
          <p className="text-indigo-100 font-medium text-lg mb-2">
            "Sou um autista buscando fazer meu melhor para todos e ser alguém de confiança"
          </p>
          <p className="text-indigo-200 text-sm">
            Estudante FAESA • Desenvolvimento Web 2025-2 • Foco em acessibilidade e inclusão
          </p>
        </div>
      </div>

      {/* Grid de laboratórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {laboratorios.map((lab) => {
          const Icon = lab.icon;
          const isDisabled = lab.emBreve;
          
          return (
            <div
              key={lab.numero}
              className={cn(
                "relative overflow-hidden rounded-xl shadow-lg border-2 transition-all duration-300",
                lab.destaque 
                  ? "border-purple-300 ring-2 ring-purple-200" 
                  : "border-gray-200",
                !isDisabled && "hover:shadow-xl hover:scale-105 cursor-pointer",
                isDisabled && "opacity-70 cursor-not-allowed"
              )}
            >
              {/* Badge de destaque */}
              {lab.destaque && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                    ⭐ NOVO
                  </span>
                </div>
              )}

              {/* Cabeçalho colorido */}
              <div className={cn("bg-gradient-to-r p-4 text-white", lab.cor)}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-medium opacity-90">Laboratório {lab.numero}</div>
                    <h3 className="font-bold text-lg">{lab.titulo}</h3>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className={cn("p-4", lab.corFundo)}>
                <p className={cn("text-sm mb-4 leading-relaxed", lab.corTexto)}>
                  {lab.descricao}
                </p>

                {/* Botão de ação */}
                {!isDisabled ? (
                  <a
                    href={lab.url}
                    target={lab.url.startsWith('http') ? '_blank' : '_self'}
                    rel={lab.url.startsWith('http') ? 'noopener noreferrer' : ''}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                      "bg-white border-2 shadow-sm hover:shadow-md",
                      lab.corTexto,
                      lab.numero === "2" ? "border-purple-300 hover:border-purple-400" : "border-gray-300 hover:border-gray-400"
                    )}
                  >
                    <ExternalLink size={16} />
                    Acessar Laboratório
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-500 border-2 border-gray-200">
                    <FileText size={16} />
                    Em breve
                  </div>
                )}
              </div>

              {/* Indicador visual especial para Lab 2 */}
              {lab.numero === "2" && (
                <div className="absolute inset-0 border-2 border-purple-400 rounded-xl pointer-events-none animate-pulse opacity-50" />
              )}
            </div>
          );
        })}
      </div>

      {/* Nota sobre acessibilidade */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            ♿
          </div>
          <div>
            <h4 className="font-semibold text-green-800 mb-1">Compromisso com a Acessibilidade</h4>
            <p className="text-green-700 text-sm">
              Todos os laboratórios são desenvolvidos seguindo princípios de acessibilidade web, 
              garantindo que pessoas com diferentes necessidades possam navegar e aprender com o conteúdo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoriosLinks;