import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Volume2, VolumeX, Trophy, Target, Clock, Zap, Star, BarChart3 } from 'lucide-react';
import { cn } from './utils';
import '../../styles/morse-challenge-animations.css';

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
  points: number;
  timeLimit?: number;
}

interface GameStats {
  attempts: number;
  correct: number;
  totalTime: number;
  streak: number;
  bestStreak: number;
  score: number;
  challengesCompleted: string[];
}

interface HintSystem {
  available: number;
  used: number;
  types: ('first-letter' | 'length' | 'category' | 'morse-hint')[];
}

const CHALLENGES: Challenge[] = [
  { id: '1', text: 'SOS', morse: '... --- ...', difficulty: 'easy', category: 'Emergência', points: 50, timeLimit: 30 },
  { id: '2', text: 'HELLO', morse: '.... . .-.. .-.. ---', difficulty: 'easy', category: 'Saudações', points: 100 },
  { id: '3', text: 'WORLD', morse: '.-- --- .-. .-.. -..', difficulty: 'easy', category: 'Básico', points: 100 },
  { id: '4', text: 'GABRIEL', morse: '--. .- -... .-. .. . .-..', difficulty: 'medium', category: 'Nome', points: 200, timeLimit: 60 },
  { id: '5', text: 'FAESA', morse: '..-. .- . ... .-', difficulty: 'medium', category: 'Instituição', points: 150 },
  { id: '6', text: 'REACT', morse: '.-. . .- -.-. -', difficulty: 'medium', category: 'Tecnologia', points: 180 },
  { id: '7', text: 'TYPESCRIPT', morse: '- -.-- .--. . ... -.-. .-. .. .--. -', difficulty: 'hard', category: 'Tecnologia', points: 400, timeLimit: 120 },
  { id: '8', text: 'PORTFOLIO', morse: '.--. --- .-. - ..-. --- .-.. .. ---', difficulty: 'hard', category: 'Projeto', points: 350, timeLimit: 100 }
];

export const MorseChallenge: React.FC<MorseChallengeProps> = ({ className }) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [userInput, setUserInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [showStats, setShowStats] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  
  // Estado de estatísticas aprimorado
  const [stats, setStats] = useState<GameStats>({
    attempts: 0,
    correct: 0,
    totalTime: 0,
    streak: 0,
    bestStreak: 0,
    score: 0,
    challengesCompleted: []
  });

  // Sistema de hints
  const [hints, setHints] = useState<HintSystem>({
    available: 3,
    used: 0,
    types: ['first-letter', 'length', 'category', 'morse-hint']
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sistema de persistência local
  const saveStats = useCallback((newStats: GameStats) => {
    try {
      localStorage.setItem('morseChallenge_stats', JSON.stringify(newStats));
    } catch (error) {
      console.warn('Não foi possível salvar estatísticas:', error);
    }
  }, []);

  const loadStats = useCallback(() => {
    try {
      const saved = localStorage.getItem('morseChallenge_stats');
      if (saved) {
        const parsedStats = JSON.parse(saved);
        setStats(parsedStats);
      }
    } catch (error) {
      console.warn('Não foi possível carregar estatísticas:', error);
    }
  }, []);

  // Carregar estatísticas ao montar o componente
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Sistema de timer aprimorado
  useEffect(() => {
    if (currentChallenge.timeLimit && timeLeft !== null && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setFeedback('⏰ Tempo esgotado! Tente novamente.');
      setIsCorrect(false);
      setTimeout(nextChallenge, 2000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, currentChallenge.timeLimit]);

  // Verificação de resposta aprimorada
  useEffect(() => {
    if (userInput.length === 0) {
      setIsCorrect(null);
      setFeedback('');
      return;
    }

    const normalizedInput = userInput.toUpperCase().trim();
    const normalizedAnswer = currentChallenge.text.toUpperCase().trim();
    
    // Verificação exata
    if (normalizedInput === normalizedAnswer) {
      handleCorrectAnswer();
      return;
    }

    // Verificação parcial para feedback em tempo real
    if (normalizedAnswer.startsWith(normalizedInput)) {
      setFeedback(`🎯 Você está no caminho certo! Continue digitando...`);
      setIsCorrect(null);
    } else {
      // Verificação de similaridade para feedback inteligente
      const similarity = calculateSimilarity(normalizedInput, normalizedAnswer);
      if (similarity > 0.7) {
        setFeedback(`🤔 Quase lá! Verifique a ortografia...`);
      } else if (similarity > 0.4) {
        setFeedback(`💡 Parece que você está pensando na resposta certa...`);
      } else {
        setFeedback(`❓ Dica: É uma palavra de ${normalizedAnswer.length} letras.`);
      }
      setIsCorrect(null);
    }
  }, [userInput, currentChallenge.text]);

  // Função para calcular similaridade entre strings
  const calculateSimilarity = useCallback((str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }, []);

  // Algoritmo de Levenshtein Distance
  const levenshteinDistance = useCallback((str1: string, str2: string): number => {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }, []);

  // Lidar com resposta correta
  const handleCorrectAnswer = useCallback(() => {
    const endTime = Date.now();
    const challengeTime = startTime ? (endTime - startTime) / 1000 : 0;
    const timeBonus = currentChallenge.timeLimit && timeLeft !== null 
      ? Math.floor((timeLeft / currentChallenge.timeLimit) * 100) 
      : 0;
    const totalPoints = currentChallenge.points + timeBonus;

    setIsCorrect(true);
    setFeedback(`🎉 Correto! +${totalPoints} pontos (${challengeTime.toFixed(1)}s)`);
    
    // Atualizar estatísticas
    const newStats: GameStats = {
      ...stats,
      attempts: stats.attempts + 1,
      correct: stats.correct + 1,
      totalTime: stats.totalTime + challengeTime,
      streak: stats.streak + 1,
      bestStreak: Math.max(stats.bestStreak, stats.streak + 1),
      score: stats.score + totalPoints,
      challengesCompleted: [...stats.challengesCompleted, currentChallenge.id]
    };
    
    setStats(newStats);
    saveStats(newStats);

    // Próximo desafio automático após delay
    setTimeout(() => {
      nextChallenge();
    }, 2000);
  }, [startTime, timeLeft, currentChallenge, stats, saveStats]);

  // Sistema de hints
  const provideHint = useCallback(() => {
    if (hints.used >= hints.available) {
      setFeedback('❌ Você já usou todas as dicas disponíveis!');
      return;
    }

    const availableHintTypes = hints.types.filter((_, index) => index < hints.available - hints.used);
    const hintType = availableHintTypes[Math.floor(Math.random() * availableHintTypes.length)];
    
    let hintText = '';
    
    switch (hintType) {
      case 'first-letter':
        hintText = `💡 A primeira letra é: "${currentChallenge.text[0]}"`;
        break;
      case 'length':
        hintText = `📏 A palavra tem ${currentChallenge.text.length} letras`;
        break;
      case 'category':
        hintText = `🏷️ Categoria: ${currentChallenge.category}`;
        break;
      case 'morse-hint':
        const firstMorseChar = currentChallenge.morse.split(' ')[0];
        hintText = `📡 A primeira letra em Morse é: "${firstMorseChar}"`;
        break;
    }
    
    setCurrentHint(hintText);
    setShowHint(true);
    setFeedback(hintText);
    
    setHints(prev => ({
      ...prev,
      used: prev.used + 1
    }));
  }, [hints, currentChallenge]);

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

  // Reproduzir código morse aprimorado
  const playMorse = useCallback(async () => {
    try {
      if (!soundEnabled) {
        setFeedback('🔇 Ative o som primeiro para reproduzir o código Morse!');
        return;
      }
      
      setIsPlaying(true);
      setCurrentPosition(0);
      setFeedback('🎵 Reproduzindo código Morse...');
      
      // Reutilizar ou criar novo AudioContext
      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioContext();
      }
      
      const audioContext = audioContextRef.current;
      
      // Garantir que o contexto esteja ativo
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      const morse = currentChallenge.morse;
      const dotDuration = 100; // ms
      const dashDuration = 300; // ms
      const letterPause = 200; // ms
      const wordPause = 600; // ms
      
      for (let i = 0; i < morse.length; i++) {
        if (!isPlaying) break; // Permitir parar a reprodução
        
        setCurrentPosition(i);
        const char = morse[i];
        
        if (char === '.') {
          await playTone(audioContext, 600, dotDuration);
          await delay(150);
        } else if (char === '-') {
          await playTone(audioContext, 600, dashDuration);
          await delay(350);
        } else if (char === ' ') {
          await delay(letterPause);
        } else if (char === '/') {
          await delay(wordPause);
        }
      }
      
      setFeedback('✅ Reprodução concluída!');
    } catch (error) {
      console.error('Erro na reprodução:', error);
      setFeedback('❌ Erro na reprodução. Tente novamente.');
    } finally {
      setIsPlaying(false);
      setCurrentPosition(0);
    }
  }, [currentChallenge.morse, soundEnabled, isPlaying]);

  // Função auxiliar para reproduzir tom
  const playTone = useCallback((audioContext: AudioContext, frequency: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Envelope para evitar cliques
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + duration / 1000 - 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
      
      setTimeout(resolve, duration);
    });
  }, []);

  // Função auxiliar para delay
  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Parar reprodução
  const stopMorse = useCallback(() => {
    setIsPlaying(false);
    setCurrentPosition(0);
    setFeedback('⏹️ Reprodução interrompida.');
  }, []);

  const nextChallenge = useCallback(() => {
    const currentIndex = CHALLENGES.findIndex(c => c.id === currentChallenge.id);
    const nextIndex = (currentIndex + 1) % CHALLENGES.length;
    const newChallenge = CHALLENGES[nextIndex];
    
    setCurrentChallenge(newChallenge);
    setUserInput('');
    setIsCorrect(null);
    setShowSolution(false);
    setShowHint(false);
    setCurrentHint('');
    setFeedback('');
    
    // Reiniciar timer se necessário
    if (newChallenge.timeLimit) {
      setTimeLeft(newChallenge.timeLimit);
      setStartTime(Date.now());
    } else {
      setTimeLeft(null);
      setStartTime(null);
    }
    
    // Reiniciar hints
    setHints(prev => ({ ...prev, used: 0 }));
    
    // Atualizar estatísticas
    setStats(prev => ({ 
      ...prev, 
      attempts: prev.attempts + 1,
      streak: isCorrect ? prev.streak : 0 // Reset streak se errou a anterior
    }));
  }, [currentChallenge.id, isCorrect]);

  const resetChallenge = useCallback(() => {
    setUserInput('');
    setIsCorrect(null);
    setShowSolution(false);
    setShowHint(false);
    setCurrentHint('');
    setFeedback('🔄 Desafio reiniciado. Boa sorte!');
    
    // Reiniciar timer
    if (currentChallenge.timeLimit) {
      setTimeLeft(currentChallenge.timeLimit);
      setStartTime(Date.now());
    }
    
    // Reiniciar hints
    setHints(prev => ({ ...prev, used: 0 }));
  }, [currentChallenge.timeLimit]);

  // Inicializar desafio
  useEffect(() => {
    if (currentChallenge.timeLimit) {
      setTimeLeft(currentChallenge.timeLimit);
      setStartTime(Date.now());
    }
  }, [currentChallenge]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Cleanup ao desmontar o componente
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={cn("bg-white rounded-lg p-6 shadow-lg border border-gray-200", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          📡 Desafio de Código Morse
          {stats.streak > 0 && (
            <span className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded-full flex items-center gap-1">
              <Zap size={14} />
              {stats.streak}x combo!
            </span>
          )}
        </h3>
        
        <div className="flex items-center gap-3">
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
          
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
            title="Ver estatísticas"
          >
            <BarChart3 size={18} />
          </button>
          
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Trophy size={14} className="text-yellow-500" />
              <span>{stats.score}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target size={14} className="text-green-500" />
              <span>{stats.correct}/{stats.attempts + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas expandidas */}
      {showStats && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Star className="text-yellow-500" size={18} />
            Suas Estatísticas
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.score}</div>
              <div className="text-gray-600">Pontos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{((stats.correct / (stats.attempts + 1)) * 100 || 0).toFixed(1)}%</div>
              <div className="text-gray-600">Precisão</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.bestStreak}</div>
              <div className="text-gray-600">Melhor Série</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{(stats.totalTime / 60).toFixed(1)}min</div>
              <div className="text-gray-600">Tempo Total</div>
            </div>
          </div>
        </div>
      )}

      {/* Informações do desafio */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              Categoria: {currentChallenge.category}
            </span>
            <span className="text-sm text-gray-500">
              #{currentChallenge.id} de {CHALLENGES.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {timeLeft !== null && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded text-sm font-medium",
                timeLeft > 10 ? "bg-green-100 text-green-600" :
                timeLeft > 5 ? "bg-yellow-100 text-yellow-600" :
                "bg-red-100 text-red-600"
              )}>
                <Clock size={14} />
                {timeLeft}s
              </div>
            )}
            
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              getDifficultyColor(currentChallenge.difficulty)
            )}>
              {currentChallenge.difficulty === 'easy' && 'Fácil'}
              {currentChallenge.difficulty === 'medium' && 'Médio'}  
              {currentChallenge.difficulty === 'hard' && 'Difícil'}
            </span>
            
            <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
              +{currentChallenge.points} pts
            </span>
          </div>
        </div>
      </div>

      {/* Feedback em tempo real */}
      {feedback && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">{feedback}</div>
        </div>
      )}

      {/* Código morse */}
      <div className="mb-6 p-4 bg-black text-green-400 rounded-lg font-mono text-lg text-center">
        <div className="mb-2 text-sm text-green-300">Código Morse:</div>
        <div className="text-2xl tracking-wider">
          {currentChallenge.morse.split('').map((char, index) => (
            <span
              key={index}
              className={cn(
                "transition-all duration-200",
                isPlaying && index === currentPosition 
                  ? "bg-green-400 text-black px-1 rounded animate-pulse shadow-lg" 
                  : ""
              )}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Controles de áudio aprimorados */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={playMorse}
          disabled={isPlaying || !soundEnabled}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
            soundEnabled && !isPlaying
              ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Reproduzindo...' : 'Reproduzir Morse'}
        </button>
        
        {isPlaying && (
          <button
            onClick={stopMorse}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <XCircle size={16} />
            Parar
          </button>
        )}
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
            "w-full px-4 py-3 border rounded-lg font-mono text-lg uppercase tracking-wider transition-all",
            isCorrect === true && "border-green-500 bg-green-50",
            isCorrect === false && "border-red-500 bg-red-50",
            isCorrect === null && "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          )}
          placeholder="Digite aqui..."
          maxLength={20}
          disabled={isCorrect === true}
        />
        
        {userInput.length > 0 && (
          <div className="mt-1 text-sm text-gray-500">
            Progresso: {userInput.length}/{currentChallenge.text.length} caracteres
          </div>
        )}
      </div>

      {/* Resultado */}
      {isCorrect !== null && (
        <div className={cn(
          "p-4 rounded-lg mb-4 flex items-center gap-2 animate-fadeIn",
          isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-medium">
            {isCorrect ? 'Correto! Parabéns! 🎉' : 'Incorreto. Continue tentando!'}
          </span>
        </div>
      )}

      {/* Sistema de hints */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Dicas disponíveis: {hints.available - hints.used}/{hints.available}
          </span>
          {hints.used < hints.available && (
            <button
              onClick={provideHint}
              className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
            >
              💡 Usar Dica
            </button>
          )}
        </div>
        
        {showHint && currentHint && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">{currentHint}</div>
          </div>
        )}
      </div>

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
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-slideDown">
          <div className="text-sm font-medium text-blue-800 mb-1">Solução:</div>
          <div className="text-lg font-mono text-blue-900">{currentChallenge.text}</div>
          <div className="text-xs text-blue-600 mt-1">
            Pontos perdidos por usar a solução: -{Math.floor(currentChallenge.points * 0.5)}
          </div>
        </div>
      )}

      {/* Tabela de referência morse */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
          📖 Tabela de Referência Morse
        </summary>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {Object.entries(MORSE_CODE).slice(0, -1).map(([letter, morse]) => (
            <div key={letter} className="flex justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
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