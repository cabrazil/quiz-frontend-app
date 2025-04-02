import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:3000';

export const TestConfig = () => {
  const [questionId, setQuestionId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFetchQuestion = async () => {
    if (!questionId.trim()) {
      setError('Por favor, informe o ID da questão');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Buscando questão:', questionId);
      const response = await fetch(`${API_URL}/questions/${questionId}`);
      if (!response.ok) {
        throw new Error('Questão não encontrada');
      }
      const data = await response.json();
      console.log('Questão encontrada:', data);
      
      // Redireciona para a página Quiz com a questão selecionada
      navigate('/quiz', { 
        state: { 
          selectedQuestion: data,
          isTestMode: true
        }
      });
    } catch (err) {
      console.error('Erro ao buscar questão:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar questão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto p-8 bg-card rounded-xl shadow-lg"
      >
        <div className="text-center mb-8">
          <div className="bg-primary/10 p-3 rounded-lg flex items-center justify-center gap-4 mb-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"></div>
            </div>
            <h1 className="text-4xl font-bold text-primary">Cuca Boa</h1>
          </div>
          <p className="text-muted-foreground text-lg">Modo de Teste</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="questionId" className="block text-lg font-medium text-foreground mb-2">
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

        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="w-full mt-6 py-6 text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          Voltar para Início
        </Button>
      </motion.div>
    </div>
  );
}; 