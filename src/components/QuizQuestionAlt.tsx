import { useState, useEffect } from 'react';
import { Question } from '../types/question';
import { SoundManager } from '../utils/sound';
import { imageConfig } from '../config/images';
import { QuestionTransition } from './QuestionTransition';
import { Button } from './ui/button';

interface QuizQuestionAltProps {
  question: Question;
  onAnswer: (answer: string) => void;
  timeLeft: number;
  totalTime: number;
  currentQuestion: number;
  totalQuestions: number;
  onTimeUp: () => void;
  isTimerActive: boolean;
  onTick: (newTime: number) => void;
  quizName: string;
}

export const QuizQuestionAlt = ({ 
  question, 
  onAnswer, 
  timeLeft, 
  totalTime,
  currentQuestion,
  totalQuestions,
  onTimeUp,
  isTimerActive,
  onTick,
  quizName
}: QuizQuestionAltProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [initialPause, setInitialPause] = useState(true);
  const soundManager = SoundManager.getInstance();
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted());
  const [imagePosition, setImagePosition] = useState(question.imagePosition || 'center center');
  const [imageScale, setImageScale] = useState(question.imageScale || 1.0);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowTransition(false);
    setInitialPause(true);
  }, [question]);

  // Efeito para a pausa inicial de 5 segundos
  useEffect(() => {
    if (initialPause && isTimerActive) {
      const pauseTimer = setTimeout(() => {
        setInitialPause(false);
      }, 5000);

      return () => {
        clearTimeout(pauseTimer);
      };
    }
  }, [initialPause, isTimerActive]);

  useEffect(() => {
    if ((isAnswered && selectedAnswer === question.correctAnswer) || 
        (timeLeft === 0 && !isAnswered)) {
      soundManager.playSuccess().catch(error => {
        console.error('Erro ao tocar som de sucesso:', error);
      });
      
      // Não mostramos a transição imediatamente, apenas quando o componente Quiz.tsx chamar onAnswer
      // Isso garante que a resposta correta seja exibida por 3 segundos
    }
  }, [isAnswered, selectedAnswer, question.correctAnswer, timeLeft, currentQuestion, totalQuestions]);

  // Adicionamos um novo useEffect para controlar a transição
  useEffect(() => {
    // Quando o timer acaba ou o usuário responde, mostramos a transição após 3 segundos
    if ((isAnswered || timeLeft === 0) && currentQuestion < totalQuestions) {
      const timer = setTimeout(() => {
        setShowTransition(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnswered, timeLeft, currentQuestion, totalQuestions]);

  useEffect(() => {
    let interval: number;

    if (isTimerActive && timeLeft > 0 && !initialPause) {
      interval = setInterval(() => {
        const newTime = timeLeft - 1;
        onTick(newTime);
        
        // Toca o som a cada segundo quando o tempo for menor ou igual a 8 segundos
        if (newTime <= 8) {
          soundManager.playTick(newTime).catch(error => {
            console.error('Erro ao tocar som de tick:', error);
          });
        }
        
        if (newTime <= 0) {
          // Quando o timer chega a zero, chamamos onTimeUp
          onTimeUp();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeLeft, isTimerActive, onTimeUp, onTick, initialPause]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    onAnswer(answer);
  };

  const progress = (timeLeft / totalTime) * 100;
  const isWarning = timeLeft <= 5;
  const isDanger = timeLeft <= 3;

  const getTimerColor = () => {
    if (isDanger) return 'bg-[#FF0000]';
    if (isWarning) return 'bg-[#FFD700]';
    return 'bg-primary';
  };

  const getTimerTextColor = () => {
    if (isDanger) return 'text-[#FF0000]';
    if (isWarning) return 'text-[#FFD700]';
    return 'text-primary';
  };

  const handleToggleSound = async () => {
    try {
      const newMutedState = await soundManager.toggleMute();
      setIsMuted(newMutedState);
    } catch (error) {
      console.error('Erro ao alternar som:', error);
    }
  };

  const handleTransitionEnd = () => {
    setShowTransition(false);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden">
      <div className="bg-card rounded-xl shadow-lg overflow-hidden">
        {/* Cabeçalho com a Pergunta */}
        <div className="bg-primary/10 p-4 border-b border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-primary/20 px-2 py-1.5 rounded text-base">
              <span className="font-medium text-primary">{question.category}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleSound}
              className="text-primary hover:text-primary/80"
              aria-label={isMuted ? "Ativar som" : "Desativar som"}
            >
              {isMuted ? '🔇' : '🔊'}
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-foreground line-clamp-2">
            {question.text}
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[450px]">
          {/* Timer Vertical (Lado Esquerdo) */}
          <div className="col-span-1 flex flex-col items-center justify-start pt-4 p-2">
            <div className="h-full w-4 bg-background rounded-full overflow-hidden relative">
              {initialPause ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-primary/20"></div>
                </div>
              ) : (
                <div
                  className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ${getTimerColor()}`}
                  style={{ height: `${progress}%` }}
                />
              )}
            </div>
            <span className={`mt-2 text-xl font-bold ${getTimerTextColor()}`}>
              {initialPause ? '' : `${timeLeft}s`}
            </span>
          </div>

          {/* Conteúdo Principal (Centro) */}
          <div className="col-span-5 flex flex-col justify-center p-4 pl-2">
            {/* Opções */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isCorrect = option === question.correctAnswer;
                const isSelected = selectedAnswer === option;
                const showResult = isAnswered && (isCorrect || isSelected);
                const showCorrectAnswer = timeLeft === 0 && isCorrect;
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                
                // Limitar o tamanho do texto da resposta
                const truncatedOption = option.length > 50 ? option.substring(0, 50) + '...' : option;
                
                return (
                  <div
                    key={index}
                    className={`
                      relative w-full py-4 px-6 rounded-full cursor-pointer transition-all duration-300 bg-white shadow-md
                      ${showResult 
                        ? (isCorrect 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-4 border-success shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                            : 'bg-gradient-to-r from-red-500 to-red-600 text-white')
                        : showCorrectAnswer
                          ? 'border-4 border-success bg-gradient-to-r from-green-500/10 to-green-600/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                          : isSelected && !isCorrect
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            : 'hover:shadow-lg'
                      }
                      ${(isAnswered || timeLeft === 0 || initialPause) ? 'pointer-events-none opacity-80' : ''}
                    `}
                    onClick={() => !isAnswered && handleAnswer(option)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white
                        ${showResult && (isCorrect || isSelected)
                          ? (isCorrect 
                              ? 'bg-gradient-to-r from-green-500 to-green-600' 
                              : 'bg-gradient-to-r from-red-500 to-red-600')
                          : showCorrectAnswer
                            ? 'bg-gradient-to-r from-green-500 to-green-600'
                            : isSelected && !isCorrect
                              ? 'bg-gradient-to-r from-red-500 to-red-600'
                              : 'bg-[#7C3AED]'
                        }
                      `}>
                        {optionLetter}
                      </div>
                      <span className="flex-1 text-left line-clamp-2 text-xl font-medium text-gray-800">
                        {truncatedOption}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <div className="text-center mt-4">
                <p className={`text-lg font-medium ${selectedAnswer === question.correctAnswer ? 'text-success' : 'text-error'}`}>
                  {selectedAnswer === question.correctAnswer ? '🎉 Parabéns!' : '😢 Que pena!'}
                </p>
                {(selectedAnswer !== question.correctAnswer || timeLeft === 0) && (
                  <p className="text-muted-foreground mt-1 text-base">
                    {timeLeft === 0 ? '⏰ Tempo esgotado! A resposta correta era:' : 'A resposta correta era:'} {question.correctAnswer}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Imagem (Lado Direito) */}
          <div className="col-span-6 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-2 pr-6 pb-8">
              {question.scrImage ? (
                <div className="relative w-full h-full overflow-hidden rounded-lg border-4 border-white shadow-md">
                  <img
                    src={imageConfig.getFullImageUrl(question.scrImage)}
                    alt="Question"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: imagePosition,
                      transform: `scale(${imageScale})`,
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-lg border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">Sem imagem</p>
                </div>
              )}
            </div>
            
            {/* Número da Questão (Canto Inferior Direito) */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl">
                {currentQuestion}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showTransition && (
        <div className="absolute inset-0 z-50">
          <QuestionTransition
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            onTransitionEnd={handleTransitionEnd}
            quizName={quizName}
          />
        </div>
      )}
    </div>
  );
}; 