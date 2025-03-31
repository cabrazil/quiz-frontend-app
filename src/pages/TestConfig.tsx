import { useState } from 'react';
import { Button } from '../components/ui/button';
import { QuizQuestion } from '../components/QuizQuestion';
import { Question } from '../types/question';

const API_URL = 'http://localhost:3000'; // Ajuste para a URL correta da sua API

export const TestConfig = () => {
  const [questionId, setQuestionId] = useState('');
  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchQuestion = async () => {
    if (!questionId.trim()) {
      setError('Por favor, informe o ID da questão');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/questions/${questionId}`);
      if (!response.ok) {
        throw new Error('Questão não encontrada');
      }
      const data = await response.json();
      setQuestion(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar questão');
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    // Apenas para teste, podemos registrar a resposta no console
    console.log('Resposta selecionada:', answer);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="max-w-xl mx-auto bg-card p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-foreground mb-6">Configuração de Teste</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="questionId" className="block text-sm font-medium text-foreground mb-2">
              ID da Questão
            </label>
            <div className="flex gap-3">
              <input
                id="questionId"
                type="text"
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Digite o ID da questão"
              />
              <Button
                onClick={handleFetchQuestion}
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md text-error">
              {error}
            </div>
          )}
        </div>
      </div>

      {question && (
        <div className="mt-8">
          <QuizQuestion
            question={question}
            onAnswer={handleAnswer}
            timeLeft={10}
            totalTime={10}
          />
        </div>
      )}
    </div>
  );
}; 