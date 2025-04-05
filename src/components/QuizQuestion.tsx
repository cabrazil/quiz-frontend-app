import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Question } from '../types/question';
import { SoundManager } from '../utils/sound';
import { getQuestionImagePath, imageConfig } from '../config/images';
import { QuestionTransition } from './QuestionTransition';

interface QuizQuestionProps {
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

export const QuizQuestion = ({ 
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
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const soundManager = SoundManager.getInstance();
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted());

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowTransition(false);
  }, [question]);

  useEffect(() => {
    if ((isAnswered && selectedAnswer === question.correctAnswer) || 
        (timeLeft === 0 && !isAnswered)) {
      soundManager.playSuccess().catch(error => {
        console.error('Erro ao tocar som de sucesso:', error);
      });
      if (currentQuestion < totalQuestions) {
        setShowTransition(true);
      }
    }
  }, [isAnswered, selectedAnswer, question.correctAnswer, timeLeft, currentQuestion, totalQuestions]);

  useEffect(() => {
    let interval: number;

    if (isTimerActive && timeLeft > 0) {
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
          onTimeUp();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeLeft, isTimerActive, onTimeUp, onTick]);

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
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Coluna da Esquerda - Questão e Alternativas */}
          <div className="lg:col-span-7 p-3 md:p-6 space-y-3 md:space-y-4">
            {/* Timer e Contador */}
            <div className="flex justify-between items-center gap-3">
              <div className="inline-block px-3 py-1.5 bg-primary/10 rounded-lg">
                <h2 className="text-xl md:text-2xl font-bold text-primary">
                  {currentQuestion}/{totalQuestions}
                </h2>
              </div>
              <div className="flex-1 relative">
                <div className="h-4 md:h-5 bg-background rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ${getTimerColor()}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className={`absolute -top-5 right-0 text-sm font-bold ${getTimerTextColor()}`}>
                  {timeLeft}s
                </span>
              </div>
              <Button
                onClick={handleToggleSound}
                variant="ghost"
                size="sm"
                className="w-8 h-8 rounded-full"
              >
                {isMuted ? '🔇' : '🔊'}
              </Button>
            </div>

            {/* Categoria e Dificuldade */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <span className="text-xl font-bold text-primary">🎯 {question.category}</span>
              </div>
            </div>

            {/* Questão */}
            <div className="text-lg md:text-xl font-bold text-foreground bg-background/50 rounded-lg p-4 min-h-[100px] flex items-center">
              {question.text}
            </div>

            {/* Opções */}
            <div className="space-y-2 md:space-y-3">
              {question.options.map((option, index) => {
                const isCorrect = option === question.correctAnswer;
                const isSelected = selectedAnswer === option;
                const showResult = isAnswered && (isCorrect || isSelected);
                const showCorrectAnswer = timeLeft === 0 && isCorrect;
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                return (
                  <div
                    key={index}
                    className={`
                      relative w-full py-2 px-3 rounded-full cursor-pointer transition-all duration-300 bg-white shadow-md
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
                      ${(isAnswered || timeLeft === 0) ? 'pointer-events-none opacity-80' : ''}
                    `}
                    onClick={() => !isAnswered && handleAnswer(option)}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`
                        w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg font-bold text-white
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
                      <span className="flex-1 text-left line-clamp-2 text-base md:text-lg font-medium text-gray-800">
                        {option}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <div className="text-center mt-3">
                <p className={`text-base font-medium ${selectedAnswer === question.correctAnswer ? 'text-success' : 'text-error'}`}>
                  {selectedAnswer === question.correctAnswer ? '🎉 Parabéns!' : '😢 Que pena!'}
                </p>
                {(selectedAnswer !== question.correctAnswer || timeLeft === 0) && (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {timeLeft === 0 ? '⏰ Tempo esgotado! A resposta correta era:' : 'A resposta correta era:'} {question.correctAnswer}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Coluna da Direita - Imagem */}
          <div className="lg:col-span-5 bg-background/50 p-4 flex flex-col">
            <div className="p-2 text-center flex items-center justify-center gap-4 mb-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"></div>
              </div>
              <h3 className="text-3xl font-bold text-primary">Cuca Legal</h3>
            </div>
            <div className="flex-1 flex items-center justify-center p-2">
              {question.scrImage ? (
                <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-card border-4 border-primary/30 shadow-md">
                  <img 
                    src={question.scrImage.startsWith('/') ? question.scrImage : getQuestionImagePath(Number(question.id))} 
                    alt="Imagem da questão" 
                    className="absolute inset-0 w-full h-full object-cover bg-background"
                    style={{ objectPosition: 'left center' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.error('Erro ao carregar imagem:', target.src);
                      target.src = imageConfig.defaultImage;
                    }}
                    onLoad={() => {
                      console.log('Imagem carregada com sucesso:', question.scrImage);
                    }}
                  />
                </div>
              ) : (
                <div className="text-muted-foreground text-center p-6 border-4 border-primary/30 rounded-lg">
                  <p className="text-base">Imagem não disponível</p>
                  <p className="text-sm mt-1">Esta questão não possui uma imagem associada</p>
                </div>
              )}
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