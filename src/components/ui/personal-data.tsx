import React from 'react';
import { User, MapPin, GraduationCap, Briefcase, Mail, Github, Code, Calendar, Heart } from 'lucide-react';
import { cn } from './utils';

interface PersonalDataProps {
  className?: string;
}

export const PersonalData: React.FC<PersonalDataProps> = ({ className }) => {
  const personalInfo = {
    name: "Gabriel Malheiros de Castro",
    title: "Desenvolvedor Frontend & Estudante",
    location: "Vitória, Espírito Santo, Brasil",
    institution: "FAESA - Faculdades Integradas Espírito-Santenses",
    course: "Desenvolvimento Web Moderno",
    email: "gabriel.m.castro@hotmail.com",
    github: "https://github.com/GabrielMalheirosdeCastro",
    age: "22 anos",
    experience: "2+ anos em desenvolvimento web",
    availableForWork: true
  };

  const skills = [
    { name: "React", level: 85, color: "bg-blue-500" },
    { name: "TypeScript", level: 80, color: "bg-blue-600" },
    { name: "Tailwind CSS", level: 90, color: "bg-cyan-500" },
    { name: "HTML/CSS", level: 95, color: "bg-orange-500" },
    { name: "JavaScript", level: 88, color: "bg-yellow-500" },
    { name: "Figma to Code", level: 75, color: "bg-purple-500" }
  ];

  const interests = [
    "🚀 Tecnologias Espaciais",
    "🎮 Desenvolvimento de Jogos",
    "🎨 Design de Interface",
    "📡 Comunicação Digital",
    "🛸 Ficção Científica",
    "🌌 Astronomia"
  ];

  const achievements = [
    {
      title: "Conversão Figma para Código",
      description: "Implementação completa de design Figma em React com fidelidade pixel-perfect",
      date: "2025",
      icon: <Code size={16} />
    },
    {
      title: "Sistema de Interface Universal",
      description: "Criação de sistema responsivo e acessível para múltiplas plataformas",
      date: "2025",
      icon: <Briefcase size={16} />
    },
    {
      title: "Projeto Galeria Espacial",
      description: "Desenvolvimento de galeria interativa com seleção múltipla e navegação",
      date: "2025",
      icon: <GraduationCap size={16} />
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Cabeçalho com informações principais */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{personalInfo.name}</h2>
            <p className="text-indigo-100 text-lg mb-2">{personalInfo.title}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-indigo-100">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                {personalInfo.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {personalInfo.age}
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap size={14} />
                {personalInfo.institution}
              </div>
            </div>
          </div>

          {personalInfo.availableForWork && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ✨ Disponível para trabalho
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Habilidades técnicas */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Code size={20} />
            Habilidades Técnicas
          </h3>
          
          <div className="space-y-3">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{skill.name}</span>
                  <span className="text-gray-500">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={cn("h-2 rounded-full transition-all duration-300", skill.color)}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contato e links */}
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <Mail size={20} />
            Contato & Links
          </h3>
          
          <div className="space-y-3">
            <a 
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail size={18} className="text-gray-600" />
              <span className="text-gray-700">{personalInfo.email}</span>
            </a>
            
            <a 
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Github size={18} className="text-gray-600" />
              <span className="text-gray-700">GitHub Profile</span>
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <strong>Experiência:</strong> {personalInfo.experience}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <strong>Curso:</strong> {personalInfo.course}
            </div>
          </div>
        </div>
      </div>

      {/* Interesses */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Heart size={20} />
          Interesses & Paixões
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {interests.map((interest, index) => (
            <div 
              key={index}
              className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-3 text-center text-sm font-medium text-gray-700"
            >
              {interest}
            </div>
          ))}
        </div>
      </div>

      {/* Conquistas recentes */}
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <GraduationCap size={20} />
          Conquistas Recentes
        </h3>
        
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="flex gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                {achievement.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-800">{achievement.title}</h4>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {achievement.date}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missão pessoal */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-3">🚀 Missão Pessoal</h3>
        <p className="text-purple-100 leading-relaxed">
          "Transformar designs criativos em experiências digitais incríveis, combinando tecnologia moderna 
          com design intuitivo para criar interfaces que conectam pessoas e ideias. Sempre em busca de 
          aprender novas tecnologias e contribuir para projetos que fazem a diferença."
        </p>
      </div>
    </div>
  );
};

export default PersonalData;