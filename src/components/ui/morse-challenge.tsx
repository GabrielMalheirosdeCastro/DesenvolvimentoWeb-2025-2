import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Volume2, VolumeX } from 'lucide-react';
import { cn } from './utils';

interface MorseChallengeProps {
  className?: string;
}

// Dicionário de código morse
const MORSE_CODE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', 
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': '/'
};

interface Challenge {
  id: string;
  text: string;
  morse: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

const CHALLENGES: Challenge[] = [
  { id: '1', text: 'SOS', morse: '... --- ...', difficulty: 'easy', category: 'Emergência' },
  { id: '2', text: 'HELLO', morse: '.... . .-.. .-.. ---', difficulty: 'easy', category: 'Saudações' },
  { id: '3', text: 'WORLD', morse: '.-- --- .-. .-.. -..', difficulty: 'easy', category: 'Básico' },
  { id: '4', text: 'GABRIEL', morse: '--. .- -... .-. .. . .-..', difficulty: 'medium', category: 'Nome' },
  { id: '5', text: 'FAESA', morse: '..-. .- . ... .-', difficulty: 'medium', category: 'Instituição' },
  { id: '6', text: 'REACT', morse: '.-. . .- -.-. -', difficulty: 'medium', category: 'Tecnologia' },
  { id: '7', text: 'TYPESCRIPT', morse: '- -.-- .--. . ... -.-. .-. .. .--. -', difficulty: 'hard', category: 'Tecnologia' },
  { id: '8', text: 'PORTFOLIO', morse: '.--. --- .-. - ..-. --- .-.. .. ---', difficulty: 'hard', category: 'Projeto' }
];

export const MorseChallenge: React.FC<MorseChallengeProps> = ({ className }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [userInput, setUserInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stats, setStats] = useState({ attempts: 0, correct: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Verificar resposta
  useEffect(() => {
    if (userInput.length > 0) {
      const normalizedInput = userInput.toUpperCase().trim();
      const isAnswerCorrect = normalizedInput === currentChallenge.text;
      setIsCorrect(isAnswerCorrect);
      
      if (isAnswerCorrect) {
        setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      }
    } else {
      setIsCorrect(null);
    }
  }, [userInput, currentChallenge.text]);

  // Reproduzir código morse
  const playMorse = useCallback(async () => {
    if (!soundEnabled) return;
    
    setIsPlaying(true);
    setCurrentPosition(0);
    
    const audioContext = new AudioContext();
    const morse = currentChallenge.morse;
    
    for (let i = 0; i < morse.length; i++) {
      setCurrentPosition(i);
      const char = morse[i];
      
      if (char === '.') {
        // Som curto (100ms)
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 600;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        await new Promise(resolve => setTimeout(resolve, 150));
      } else if (char === '-') {
        // Som longo (300ms)
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = 600;
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        await new Promise(resolve => setTimeout(resolve, 350));
      } else if (char === ' ') {
        // Pausa entre letras
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    setIsPlaying(false);
    setCurrentPosition(0);
  }, [currentChallenge.morse, soundEnabled]);

  const nextChallenge = () => {
    const currentIndex = CHALLENGES.findIndex(c => c.id === currentChallenge.id);
    const nextIndex = (currentIndex + 1) % CHALLENGES.length;
    setCurrentChallenge(CHALLENGES[nextIndex]);
    setUserInput('');
    setIsCorrect(null);
    setShowSolution(false);
    setStats(prev => ({ ...prev, attempts: prev.attempts + 1 }));
  };

  const resetChallenge = () => {
    setUserInput('');
    setIsCorrect(null);
    setShowSolution(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-lg border border-gray-200", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📡 Desafio de Código Morse
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              soundEnabled 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-400"
            )}
            title={soundEnabled ? "Som ativado" : "Som desativado"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          
          <div className="text-sm text-gray-600">
            Acertos: {stats.correct}/{stats.attempts + 1}
          </div>
        </div>
      </div>

      {/* Informações do desafio */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Categoria: {currentChallenge.category}
          </span>
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            getDifficultyColor(currentChallenge.difficulty)
          )}>
            {currentChallenge.difficulty === 'easy' && 'Fácil'}
            {currentChallenge.difficulty === 'medium' && 'Médio'}
            {currentChallenge.difficulty === 'hard' && 'Difícil'}
          </span>
        </div>
      </div>

      {/* Código morse */}
      <div className="mb-6 p-4 bg-black text-green-400 rounded-lg font-mono text-lg text-center">
        <div className="mb-2 text-sm text-green-300">Código Morse:</div>
        <div className="text-2xl tracking-wider">
          {currentChallenge.morse.split('').map((char, index) => (
            <span
              key={index}
              className={cn(
                "transition-colors duration-200",
                isPlaying && index === currentPosition 
                  ? "bg-green-400 text-black" 
                  : ""
              )}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Controles de áudio */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={playMorse}
          disabled={isPlaying || !soundEnabled}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
            soundEnabled
              ? "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Reproduzindo...' : 'Reproduzir Morse'}
        </button>
      </div>

      {/* Input da resposta */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Digite a tradução:
        </label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={cn(
            "w-full px-4 py-3 border rounded-lg font-mono text-lg uppercase tracking-wider",
            isCorrect === true && "border-green-500 bg-green-50",
            isCorrect === false && "border-red-500 bg-red-50",
            isCorrect === null && "border-gray-300"
          )}
          placeholder="Digite aqui..."
          maxLength={20}
        />
      </div>

      {/* Resultado */}
      {isCorrect !== null && (
        <div className={cn(
          "p-4 rounded-lg mb-4 flex items-center gap-2",
          isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-medium">
            {isCorrect ? 'Correto! Parabéns! 🎉' : 'Incorreto. Tente novamente!'}
          </span>
        </div>
      )}

      {/* Controles */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={resetChallenge}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Limpar
        </button>
        
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
        >
          {showSolution ? 'Ocultar' : 'Ver'} Solução
        </button>
        
        <button
          onClick={nextChallenge}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1"
        >
          Próximo Desafio
        </button>
      </div>

      {/* Solução */}
      {showSolution && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-1">Solução:</div>
          <div className="text-lg font-mono text-blue-900">{currentChallenge.text}</div>
        </div>
      )}

      {/* Tabela de referência morse */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          📖 Tabela de Referência Morse
        </summary>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {Object.entries(MORSE_CODE).slice(0, -1).map(([letter, morse]) => (
            <div key={letter} className="flex justify-between p-2 bg-gray-50 rounded">
              <span className="font-bold">{letter}</span>
              <span className="font-mono">{morse}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default MorseChallenge;