import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Category, Difficulty } from '../types/question';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CategorySelect } from './CategorySelect';

const API_URL = 'http://localhost:3000';

interface QuizConfigProps {
  onStart: (config: {
    totalQuestions: number;
    difficulty: Difficulty;
    categoryId?: number;
    useSelectedQuestions: boolean;
  }) => void;
}

export const QuizConfig = ({ onStart }: QuizConfigProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Fácil');
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [useSelectedQuestions, setUseSelectedQuestions] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error('Erro ao carregar categorias');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError('Erro ao carregar categorias');
      console.error(error);
    }
  };

  const handleStart = () => {
    if (useSelectedQuestions) {
      onStart({
        totalQuestions,
        difficulty: selectedDifficulty,
        useSelectedQuestions: true
      });
    } else {
      onStart({
        totalQuestions,
        difficulty: selectedDifficulty,
        categoryId: selectedCategory === 'all' ? undefined : parseInt(selectedCategory),
        useSelectedQuestions: false
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Configuração do Quiz</h1>
        
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Número de Questões</label>
            <input
              type="number"
              min="1"
              max="50"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Dificuldade</label>
            <Select
              value={selectedDifficulty}
              onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <CategorySelect
              categories={categories}
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              disabled={useSelectedQuestions}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useSelectedQuestions"
              checked={useSelectedQuestions}
              onChange={(e) => setUseSelectedQuestions(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="useSelectedQuestions" className="text-sm">
              Usar questões selecionadas
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Voltar
          </Button>
          <Button
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Começar Quiz'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 