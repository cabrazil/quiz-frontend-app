import { useEffect, useState } from 'react';
import { SoundManager } from '../utils/sound';

interface QuestionTransitionProps {
  currentQuestion: number;
  totalQuestions: number;
  onTransitionEnd: () => void;
}

export const QuestionTransition = ({ 
  currentQuestion, 
  totalQuestions, 
  onTransitionEnd 
}: QuestionTransitionProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldPlaySound, setShouldPlaySound] = useState(true);
  const nextQuestion = currentQuestion + 1;
  const soundManager = SoundManager.getInstance();

  useEffect(() => {
    // Toca o som de transição apenas durante os 2 segundos da página
    if (shouldPlaySound) {
      soundManager.playTransition().catch(error => {
        console.error('Erro ao tocar som de transição:', error);
      });
    }

    // Após 2 segundos, esconde a transição e para o som
    const timer = setTimeout(() => {
      setIsVisible(false);
      setShouldPlaySound(false);
      setTimeout(onTransitionEnd, 500);
    }, 2000);

    return () => {
      clearTimeout(timer);
      setShouldPlaySound(false);
    };
  }, [onTransitionEnd, soundManager, shouldPlaySound]);

  // Determina a cor baseada no número da questão
  const getTransitionColor = () => {
    const colorIndex = (nextQuestion - 1) % 3;
    switch (colorIndex) {
      case 0:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 1:
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 2:
        return 'from-green-400 via-green-500 to-green-600';
      default:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
    }
  };

  return (
    <div className={`
      absolute inset-0 bg-card rounded-xl shadow-lg overflow-hidden transition-opacity duration-500
      ${isVisible ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className="relative w-full h-full">
        {/* Gradiente animado de fundo */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getTransitionColor()} animate-gradient-x`}></div>
        
        {/* Conteúdo central com animação */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center animate-scale-bounce">
            <span className="text-[12rem] font-bold text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {nextQuestion}
            </span>
          </div>
        </div>

        {/* Elementos decorativos animados */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-1 h-16 bg-white/20 animate-fall-slow"></div>
          <div className="absolute top-0 left-2/4 w-1 h-24 bg-white/20 animate-fall-medium"></div>
          <div className="absolute top-0 left-3/4 w-1 h-20 bg-white/20 animate-fall-fast"></div>
        </div>
      </div>
    </div>
  );
}; 