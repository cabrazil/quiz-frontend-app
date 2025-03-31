import { useState, useEffect } from 'react';
import { Question } from '../types/quiz';
import { QuestionCard } from '../components/ui/QuestionCard';
import { QuizResult } from '../components/QuizResult';
import { QuizContainer } from '../components/QuizContainer';
import { Timer } from '../components/Timer';
import { QuizConfig } from '../components/QuizConfig';
import { Button } from '../components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { QuizQuestion } from '../components/QuizQuestion';
import { Difficulty } from '../types/question';
import { useLocation, useNavigate } from 'react-router-dom';

interface QuizConfig {
  totalQuestions: number;
  difficulty: Difficulty;
  categoryId?: number;
}

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedQuestion, isTestMode } = location.state || {};

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

  useEffect(() => {
    if (isTestMode && selectedQuestion) {
      setQuestions([selectedQuestion]);
      setCurrentQuestionIndex(0);
      setTimeLeft(10);
      setIsTimerActive(true);
      setConfig({
        totalQuestions: 1,
        difficulty: selectedQuestion.difficulty as Difficulty,
        categoryId: selectedQuestion.categoryId
      });
    }
  }, [isTestMode, selectedQuestion]);

  const fetchQuestions = async (config: QuizConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      // Converter a dificuldade para o formato do banco de dados
      const difficultyMap: Record<Difficulty, string> = {
        'Fácil': 'easy',
        'Médio': 'medium',
        'Difícil': 'hard'
      };

      const queryParams = new URLSearchParams({
        limit: (config.totalQuestions * 2).toString(), // Busca o dobro de questões para ter mais opções
        difficulty: difficultyMap[config.difficulty],
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
    if (isTestMode) {
      navigate('/');
    } else {
      setConfig(null);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setTimeLeft(10);
      setIsTimerActive(true);
      setQuestions([]);
      setUsedQuestionIds(new Set());
    }
  };

  if (!config && !isTestMode) {
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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            timeLeft={timeLeft}
            totalTime={10}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onTimeUp={handleTimeUp}
            isTimerActive={isTimerActive}
            onTick={(newTime) => setTimeLeft(newTime)}
          />
        </motion.div>
      </AnimatePresence>
    </QuizContainer>
  );
};

export default Quiz; 