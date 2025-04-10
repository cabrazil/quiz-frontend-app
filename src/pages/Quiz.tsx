import { useState, useEffect } from 'react';
import { Question, Difficulty } from '../types/question';
import { QuestionCard } from '../components/ui/QuestionCard';
import { QuizResult } from '../components/QuizResult';
import { QuizContainer } from '../components/QuizContainer';
import { Timer } from '../components/Timer';
import { QuizConfig } from '../components/QuizConfig';
import { Button } from '../components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { QuizQuestion } from '../components/QuizQuestion';
import { QuizQuestionAlt } from '../components/QuizQuestionAlt';
import { useLocation, useNavigate } from 'react-router-dom';

interface QuizConfig {
  totalQuestions: number;
  difficulty: Difficulty;
  categoryId?: number;
  useSelectedQuestions: boolean;
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
  const [quizName] = useState("Cuca Legal");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [useAltLayout, setUseAltLayout] = useState(false);

  useEffect(() => {
    if (isTestMode && selectedQuestion) {
      console.log('Iniciando modo de teste com questão:', selectedQuestion);
      setQuestions([selectedQuestion]);
      setCurrentQuestionIndex(0);
      setTimeLeft(10);
      setIsTimerActive(true);
      setConfig({
        totalQuestions: 1,
        difficulty: selectedQuestion.difficulty as Difficulty,
        categoryId: selectedQuestion.categoryId,
        useSelectedQuestions: false
      });
    }
  }, [isTestMode, selectedQuestion]);

  const fetchQuestions = async (config: QuizConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      if (config.useSelectedQuestions) {
        // Buscar questões selecionadas
        const response = await fetch('http://localhost:3000/api/quiz/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('Erro ao iniciar o quiz com questões selecionadas');
        }
        
        const data = await response.json();
        console.log('Dados da sessão do quiz:', data);
        
        if (!data || !data.questions || data.questions.length === 0) {
          throw new Error('Nenhuma questão selecionada encontrada. Por favor, selecione algumas questões primeiro.');
        }

        // Salva o ID da sessão do quiz
        setSessionId(data.sessionId);

        // Garante que as questões estejam no formato correto
        const formattedQuestions = data.questions.map((q: any) => ({
          id: q.id.toString(),
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          category: q.category,
          categoryId: q.categoryId,
          difficulty: q.difficulty,
          createdAt: q.createdAt,
          updatedAt: q.updatedAt,
          scrImage: q.scrImage
        }));

        setQuestions(formattedQuestions);
        return;
      }

      // Constrói a URL manualmente para evitar codificação de caracteres especiais
      const baseUrl = '/api/questions';
      const queryParams = [];
      
      // Adiciona o parâmetro limit
      queryParams.push(`limit=${config.totalQuestions * 2}`);
      
      // Adiciona os parâmetros apenas se existirem
      if (config.difficulty) {
        queryParams.push(`difficulty=${config.difficulty}`);
      }
      if (config.categoryId) {
        queryParams.push(`categoryId=${config.categoryId}`);
      }
      
      // Junta os parâmetros com &
      const queryString = queryParams.join('&');
      const url = `${baseUrl}?${queryString}`;
      
      console.log('URL da requisição:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar as questões');
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);

      if (!data || !data.questions || data.questions.length === 0) {
        throw new Error('Nenhuma questão encontrada para os critérios selecionados');
      }

      // Garante que as questões estejam no formato correto
      const formattedQuestions = data.questions.map((q: any) => ({
        id: q.id.toString(),
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        category: q.category,
        categoryId: q.categoryId,
        difficulty: q.difficulty,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
        scrImage: q.scrImage
      }));

      // Limita o número de questões ao solicitado
      const limitedQuestions = formattedQuestions.slice(0, config.totalQuestions);
      setQuestions(limitedQuestions);
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
      setError(error instanceof Error ? error.message : 'Erro ao carregar questões');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = (quizConfig: QuizConfig) => {
    setConfig(quizConfig);
    fetchQuestions(quizConfig);
  };

  const handleAnswer = (selectedAnswer: string) => {
    // Desativa o timer imediatamente
    setIsTimerActive(false);
    
    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedAnswer && selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    // Aguarda 3 segundos antes de avançar para a próxima questão
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(10);
        setIsTimerActive(true);
      } else {
        // Finaliza o quiz e notifica o backend
        finishQuiz();
        setShowResult(true);
      }
    }, 3000);
  };

  const handleTimeUp = () => {
    // Desativa o timer imediatamente
    setIsTimerActive(false);
    
    // Não processa a resposta imediatamente, apenas marca que o tempo acabou
    // O componente QuizQuestion vai mostrar a resposta correta
    
    // Aguarda 3 segundos antes de avançar para a próxima questão
    setTimeout(() => {
      // Processa a resposta vazia (tempo esgotado)
      handleAnswer('');
    }, 3000);
  };

  // Função para finalizar o quiz e notificar o backend
  const finishQuiz = async () => {
    // Se não estiver usando questões selecionadas ou não tiver um ID de sessão, não precisa notificar o backend
    if (!config?.useSelectedQuestions || !sessionId) {
      return;
    }

    try {
      console.log('Finalizando quiz com sessão:', sessionId, 'e pontuação:', score);
      
      const response = await fetch(`http://localhost:3000/api/quiz/${sessionId}/finish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score
        }),
      });
      
      if (!response.ok) {
        console.error('Erro ao finalizar quiz:', await response.text());
      } else {
        const data = await response.json();
        console.log('Quiz finalizado com sucesso:', data);
      }
    } catch (error) {
      console.error('Erro ao finalizar quiz:', error);
    }
  };

  const handleRestart = () => {
    if (isTestMode) {
      navigate('/test');
    } else {
      setConfig(null);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setTimeLeft(10);
      setIsTimerActive(true);
      setQuestions([]);
      setUsedQuestionIds(new Set());
      setSessionId(null);
      navigate('/');
    }
  };

  const toggleLayout = () => {
    setUseAltLayout(!useAltLayout);
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
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Voltar para Início
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
            onClick={() => navigate('/')}
            className="mt-4"
          >
            Voltar para Início
          </Button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={toggleLayout}
          className="flex items-center gap-2"
        >
          {useAltLayout ? 'Layout Original' : 'Novo Layout'}
        </Button>
      </div>
      
      {useAltLayout ? (
        <QuizQuestionAlt
          question={currentQuestion}
          onAnswer={handleAnswer}
          timeLeft={timeLeft}
          totalTime={10}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onTimeUp={handleTimeUp}
          isTimerActive={isTimerActive}
          onTick={setTimeLeft}
          quizName={quizName}
        />
      ) : (
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          timeLeft={timeLeft}
          totalTime={10}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onTimeUp={handleTimeUp}
          isTimerActive={isTimerActive}
          onTick={setTimeLeft}
          quizName={quizName}
        />
      )}
    </div>
  );
};

export default Quiz; 