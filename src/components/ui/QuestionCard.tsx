import { useState, useEffect } from 'react';
import { Button } from './button';
import { motion } from 'framer-motion';
import { Question } from '../../types/question';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  currentIndex: number;
  totalQuestions: number;
  isTimeUp?: boolean;
}

export const QuestionCard = ({ 
  question, 
  onAnswer, 
  currentIndex, 
  totalQuestions,
  isTimeUp = false 
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentIndex]);

  useEffect(() => {
    if (isTimeUp && !isAnswered) {
      setIsAnswered(true);
      setSelectedAnswer(question.correctAnswer);
      onAnswer(question.correctAnswer);
    }
  }, [isTimeUp, isAnswered, question.correctAnswer, onAnswer]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    onAnswer(answer);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card rounded-xl shadow-lg p-6"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {question.text}
          </h3>
          <p className="text-sm text-muted-foreground">
            Questão {currentIndex + 1} de {totalQuestions}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={
                isAnswered
                  ? option === question.correctAnswer
                    ? 'default'
                    : option === selectedAnswer
                    ? 'ghost'
                    : 'outline'
                  : 'outline'
              }
              onClick={() => handleAnswer(option)}
              disabled={isAnswered}
              className={`w-full ${
                isAnswered
                  ? option === question.correctAnswer
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : option === selectedAnswer
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : ''
                  : ''
              }`}
            >
              {option}
            </Button>
          ))}
        </div>

        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg ${
              selectedAnswer === question.correctAnswer
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <p className="font-medium">
              {selectedAnswer === question.correctAnswer
                ? '✓ Resposta correta!'
                : isTimeUp
                ? '⏰ Tempo esgotado! A resposta correta é:'
                : '✗ Resposta incorreta. A resposta correta é:'}{' '}
              {selectedAnswer !== question.correctAnswer && question.correctAnswer}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}; 