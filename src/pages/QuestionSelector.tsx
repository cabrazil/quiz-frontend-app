import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Question } from '../types/question';

const API_URL = 'http://localhost:3000';

export const QuestionSelector = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/questions`);
      if (!response.ok) {
        throw new Error('Erro ao carregar questões');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      setError('Erro ao carregar questões');
      console.error(error);
    }
  };

  const handleQuestionToggle = (questionId: number) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (selectedQuestions.size === 0) {
      setError('Selecione pelo menos uma questão');
      return;
    }

    setLoading(true);
    try {
      console.log('Enviando questões selecionadas:', Array.from(selectedQuestions));
      const response = await fetch(`${API_URL}/api/questions/selected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionIds: Array.from(selectedQuestions)
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar questões selecionadas');
      }

      const data = await response.json();
      console.log('Resposta do servidor:', data);

      // Força o redirecionamento usando window.location
      window.location.href = '/config';
    } catch (error) {
      setError('Erro ao salvar questões selecionadas');
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/questions/selected`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao limpar questões selecionadas');
      }

      setSelectedQuestions(new Set());
      navigate('/');
    } catch (error) {
      setError('Erro ao limpar questões selecionadas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-card p-6 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Selecionar Questões</h1>
          <p className="text-muted-foreground mt-2">
            Escolha as questões que serão exibidas no quiz
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-md text-error mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">
              Questões selecionadas: {selectedQuestions.size}
            </p>
            <div className="space-x-2">
              <Button
                onClick={handleClear}
                variant="outline"
                disabled={loading}
              >
                Limpar Seleção
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || selectedQuestions.size === 0}
              >
                {loading ? 'Salvando...' : 'Salvar Seleção'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {questions.map((question) => (
            <div
              key={question.id}
              className={`
                p-4 rounded-lg border transition-all duration-200
                ${selectedQuestions.has(Number(question.id))
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedQuestions.has(Number(question.id))}
                  onChange={() => handleQuestionToggle(Number(question.id))}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">
                      {question.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • {question.difficulty}
                    </span>
                  </div>
                  <p className="text-base">{question.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 