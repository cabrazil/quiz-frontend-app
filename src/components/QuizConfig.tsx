import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Category, Difficulty } from '../types/question';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

interface QuizConfigProps {
  onStart: (config: {
    totalQuestions: number;
    difficulty: Difficulty;
    categoryId?: number;
    useSelectedQuestions: boolean;
  }) => void;
}

const difficulties = [
  { value: 'Fácil' as Difficulty, label: 'Fácil', icon: '🌟' },
  { value: 'Médio' as Difficulty, label: 'Médio', icon: '⭐' },
  { value: 'Difícil' as Difficulty, label: 'Difícil', icon: '💫' }
];

export const QuizConfig = ({ onStart }: QuizConfigProps) => {
  const questionCounts = [5, 10, 15, 20, 25, 30];

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Médio');
  const [selectedCount, setSelectedCount] = useState(10);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [useSelectedQuestions, setUseSelectedQuestions] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) {
          throw new Error('Erro ao carregar categorias');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleStart = () => {
    onStart({
      totalQuestions: selectedCount,
      difficulty: selectedDifficulty,
      categoryId: selectedCategory || undefined,
      useSelectedQuestions
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-8 bg-card rounded-xl shadow-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-xl shadow-lg">
      <div className="space-y-8">
        <div className="text-center">
          <div className="bg-primary/10 p-3 rounded-lg flex items-center justify-center gap-4 mb-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"></div>
            </div>
            <h1 className="text-4xl font-bold text-primary">Cuca Boa</h1>
          </div>
          <p className="text-muted-foreground text-lg">Configure seu quiz antes de começar</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="useSelectedQuestions"
              checked={useSelectedQuestions}
              onChange={(e) => setUseSelectedQuestions(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="useSelectedQuestions" className="text-lg font-medium text-foreground">
              Usar questões selecionadas
            </label>
          </div>

          {!useSelectedQuestions && (
            <>
              <div>
                <label className="block text-lg font-medium text-foreground mb-4">
                  🎯 Categoria
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2">
                  <Button
                    variant={selectedCategory === null ? 'primary' : 'outline'}
                    onClick={() => setSelectedCategory(null)}
                    className="w-full hover-glow"
                  >
                    🎲 Todas
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'primary' : 'outline'}
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full hover-glow"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-foreground mb-4">
                  ⭐ Dificuldade
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {difficulties.map((diff) => (
                    <Button
                      key={diff.value}
                      variant={selectedDifficulty === diff.value ? 'primary' : 'outline'}
                      onClick={() => setSelectedDifficulty(diff.value)}
                      className="w-full hover-glow"
                    >
                      <span className="mr-2">{diff.icon}</span>
                      {diff.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-foreground mb-4">
                  📝 Quantidade de Questões
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {questionCounts.map((count) => (
                    <Button
                      key={count}
                      variant={selectedCount === count ? 'primary' : 'outline'}
                      onClick={() => setSelectedCount(count)}
                      className="w-full hover-glow"
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <Button
          onClick={handleStart}
          className="w-full py-6 text-xl font-bold gradient-primary hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          🚀 Começar Quiz
        </Button>

        <Button
          onClick={() => navigate('/test')}
          variant="outline"
          className="w-full py-6 text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          🎯 Modo de Teste
        </Button>
      </div>
    </div>
  );
}; 