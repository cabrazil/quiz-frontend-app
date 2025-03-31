import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Question } from '../types/question';
import { SoundManager } from '../utils/sound';

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
  onTick
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const soundManager = SoundManager.getInstance();
  const [isMuted, setIsMuted] = useState(soundManager.isSoundMuted());

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [question]);

  useEffect(() => {
    if ((isAnswered && selectedAnswer === question.correctAnswer) || 
        (timeLeft === 0 && !isAnswered)) {
      soundManager.playSuccess();
    }
  }, [isAnswered, selectedAnswer, question.correctAnswer, timeLeft]);

  useEffect(() => {
    let interval: number;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        const newTime = timeLeft - 1;
        onTick(newTime);
        soundManager.playTick(newTime);
        
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

  const handleToggleSound = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 bg-card rounded-xl shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
        {/* Coluna da Esquerda - Questão e Alternativas */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          {/* Timer e Contador */}
          <div className="flex justify-between items-center gap-4">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
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
              <span className={`absolute -top-6 right-0 text-sm font-bold ${getTimerTextColor()}`}>
                {timeLeft}s
              </span>
            </div>
            <Button
              onClick={handleToggleSound}
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full"
            >
              {isMuted ? '🔇' : '🔊'}
            </Button>
          </div>

          {/* Categoria e Dificuldade */}
          <div className="flex items-center gap-4 text-lg font-medium">
            <span className="text-primary">🎯 {question.category}</span>
            <span className="text-secondary">⭐ {question.difficulty}</span>
          </div>

          {/* Questão */}
          <div className="text-xl md:text-2xl font-bold text-foreground bg-background/50 rounded-lg p-6 min-h-[120px] flex items-center">
            {question.text}
          </div>

          {/* Opções */}
          <div className="space-y-3 md:space-y-4">
            {question.options.map((option, index) => {
              const isCorrect = option === question.correctAnswer;
              const isSelected = selectedAnswer === option;
              const showResult = isAnswered && (isCorrect || isSelected);
              const showCorrectAnswer = timeLeft === 0 && isCorrect;
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered || timeLeft === 0}
                  className={`
                    w-full py-3 md:py-4 text-base md:text-lg font-medium transition-all duration-300 flex items-center gap-3 md:gap-4
                    ${!isAnswered && timeLeft > 0 ? 'hover-glow' : ''}
                    ${showResult ? (isCorrect ? 'bg-success' : 'bg-error') : ''}
                    ${showCorrectAnswer ? 'border border-success bg-success/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
                    ${isSelected && !isCorrect ? 'bg-error' : ''}
                    ${!isAnswered && !isSelected && !showCorrectAnswer ? 'bg-card hover:bg-primary/20' : ''}
                  `}
                >
                  <div className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-base md:text-lg font-bold transition-all duration-300
                    ${!isAnswered && timeLeft > 0 ? 'bg-primary text-white' : ''}
                    ${showResult ? (isCorrect ? 'bg-success text-white' : 'bg-error text-white') : ''}
                    ${showCorrectAnswer ? 'bg-success text-white' : ''}
                    ${isSelected && !isCorrect ? 'bg-error text-white' : ''}
                  `}>
                    {optionLetter}
                  </div>
                  <span className="flex-1 text-left line-clamp-2">{option}</span>
                </Button>
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
                <p className="text-muted-foreground mt-2">
                  {timeLeft === 0 ? '⏰ Tempo esgotado! A resposta correta era:' : 'A resposta correta era:'} {question.correctAnswer}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Coluna da Direita - Imagem */}
        <div className="lg:col-span-5 space-y-2">
          <div className="bg-primary/10 p-3 text-center rounded-lg flex items-center justify-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"></div>
            </div>
            <h3 className="text-2xl font-bold text-primary">Cuca Boa</h3>
          </div>
          <div className="bg-background rounded-xl overflow-hidden border border-primary/20">
            <div className="w-full aspect-square flex items-center justify-center">
              {question.imageUrl ? (
                <img 
                  src={question.imageUrl} 
                  alt="Imagem da questão" 
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-muted-foreground text-center p-8">
                  <p className="text-lg">Imagem não disponível</p>
                  <p className="text-sm mt-2">Esta questão não possui uma imagem associada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};