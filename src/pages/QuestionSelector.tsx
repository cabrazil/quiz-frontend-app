import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const API_URL = 'http://localhost:3000';

export const QuestionSelector = () => {
  const [questionId, setQuestionId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    if (!questionId.trim()) {
      setError('Por favor, informe o ID da questão');
      return;
    }

    const numericId = parseInt(questionId);
    if (isNaN(numericId)) {
      setError('Por favor, informe um ID válido (número)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/questions/${numericId}`);
      if (!response.ok) {
        throw new Error(
          response.status === 404 
            ? 'Questão não encontrada' 
            : 'Erro ao buscar questão'
        );
      }
      const question = await response.json();
      
      navigate('/quiz', { 
        state: { 
          selectedQuestion: question,
          isTestMode: true
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar questão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-xl mx-auto bg-card p-6 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Modo de Teste</h1>
          <p className="text-muted-foreground mt-2">
            Selecione uma questão específica para testar
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="questionId" className="block text-sm font-medium text-foreground mb-2">
              ID da Questão
            </label>
            <input
              id="questionId"
              type="text"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite o ID da questão"
            />
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md text-error">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleStartQuiz}
              disabled={loading}
              className="w-full py-6 text-xl font-bold gradient-primary"
            >
              {loading ? 'Carregando...' : '🎯 Iniciar Teste'}
            </Button>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Voltar para o Quiz Normal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 