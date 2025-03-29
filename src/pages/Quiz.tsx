import { useState, useEffect } from 'react';
import { Question } from '../types/quiz';
import { QuestionCard } from '../components/ui/QuestionCard';
import { QuizResult } from '../components/QuizResult';
import { QuizContainer } from '../components/QuizContainer';
import { Timer } from '../components/Timer';
import { QuizConfig } from '../components/QuizConfig';
import { Button } from '../components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';

interface QuizConfig {
  totalQuestions: number;
  difficulty: string;
  categoryId?: number;
}

const Quiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());

  const fetchQuestions = async (config: QuizConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      // Converter a dificuldade para o formato do banco de dados
      const difficultyMap: Record<string, string> = {
        'easy': 'easy',
        'medium': 'medium',
        'hard': 'hard'
      };

      const queryParams = new URLSearchParams({
        limit: (config.totalQuestions * 2).toString(), // Busca o dobro de questões para ter mais opções
        difficulty: difficultyMap[config.difficulty] || config.difficulty,
        ...(config.categoryId && { categoryId: config.categoryId.toString() })
      });

      const url = `/api/questions?${queryParams}`;
      console.log('URL da requisição:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar as questões');
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);

      if (!data || data.length === 0) {
        throw new Error('Nenhuma questão encontrada para os critérios selecionados');
      }

      // Filtra as questões que ainda não foram utilizadas
      const availableQuestions = data.filter((q: Question) => !usedQuestionIds.has(q.id));
      
      // Se não houver questões suficientes, limpa o cache de questões utilizadas
      if (availableQuestions.length < config.totalQuestions) {
        setUsedQuestionIds(new Set());
        const newAvailableQuestions = data.filter((q: Question) => !usedQuestionIds.has(q.id));
        if (newAvailableQuestions.length < config.totalQuestions) {
          throw new Error('Não há questões suficientes disponíveis. Por favor, tente novamente.');
        }
        setQuestions(newAvailableQuestions.slice(0, config.totalQuestions));
      } else {
        setQuestions(availableQuestions.slice(0, config.totalQuestions));
      }

      // Adiciona as IDs das questões selecionadas ao conjunto de questões utilizadas
      const newUsedQuestionIds = new Set(usedQuestionIds);
      questions.forEach(q => newUsedQuestionIds.add(q.id));
      setUsedQuestionIds(newUsedQuestionIds);

    } catch (err) {
      console.error('Erro ao carregar questões:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar as questões');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = (quizConfig: QuizConfig) => {
    setConfig(quizConfig);
    fetchQuestions(quizConfig);
  };

  const handleAnswer = (selectedAnswer: string) => {
    setIsTimerActive(false);
    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedAnswer && selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10);
        setIsTimerActive(true);
      }, 3000);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 3000);
    }
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    handleAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10);
        setIsTimerActive(true);
      }, 3000);
    } else {
      setTimeout(() => {
        setShowResult(true);
      }, 3000);
    }
  };

  const handleRestart = () => {
    setConfig(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(10);
    setIsTimerActive(true);
    setQuestions([]);
    setUsedQuestionIds(new Set()); // Limpa o cache de questões utilizadas
  };

  if (!config) {
    return <QuizConfig onStart={handleStart} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-center"
        >
          <p className="text-xl font-semibold mb-2">Erro</p>
          <p>{error}</p>
          <Button
            onClick={() => setConfig(null)}
            className="mt-4"
          >
            Voltar para Configuração
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    return (
      <QuizResult
        score={score}
        totalQuestions={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xl font-semibold mb-2">Nenhuma questão encontrada</p>
          <p className="text-muted-foreground mb-4">
            Não foram encontradas questões para os critérios selecionados.
          </p>
          <Button
            onClick={() => setConfig(null)}
            className="mt-4"
          >
            Voltar para Configuração
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <QuizContainer>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg">
            <h2 className="text-xl font-semibold text-primary">
              {currentQuestionIndex + 1}/{questions.length}
            </h2>
          </div>
          <div className={`inline-block px-4 py-2 rounded-lg mt-2 ${
            config.difficulty === 'easy' 
              ? 'bg-green-100 text-green-700' 
              : config.difficulty === 'medium' 
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
          }`}>
            <p className="text-xl font-medium">
              {config.difficulty === 'easy' ? 'Fácil' : config.difficulty === 'medium' ? 'Médio' : 'Difícil'}
            </p>
          </div>
        </div>
        <Timer 
          timeLeft={timeLeft} 
          onTimeUp={handleTimeUp}
          isActive={isTimerActive}
          onTick={(newTime) => setTimeLeft(newTime)}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {questions[currentQuestionIndex] && (
          <QuestionCard
            key={currentQuestionIndex}
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            currentIndex={currentQuestionIndex}
            totalQuestions={questions.length}
            isTimeUp={!isTimerActive && timeLeft === 0}
          />
        )}
      </AnimatePresence>
    </QuizContainer>
  );
};

export default Quiz; 