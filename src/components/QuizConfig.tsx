import { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Category, QuizConfig as QuizConfigType } from '../types/question';

interface QuizConfigProps {
  onStart: (config: QuizConfigType) => void;
}

// Mapeamento de dificuldades em português para inglês
const DIFFICULTY_MAP: Record<string, string> = {
  'Fácil': 'easy',
  'Médio': 'medium',
  'Difícil': 'hard'
};

export const QuizConfig = ({ onStart }: QuizConfigProps) => {
  const difficulties = [
    { value: 'easy', label: 'Fácil' },
    { value: 'medium', label: 'Médio' },
    { value: 'hard', label: 'Difícil' }
  ];

  const questionCounts = [5, 10, 15, 20, 25, 30];

  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [selectedCount, setSelectedCount] = useState(10);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Erro ao carregar categorias');
        }
        const data = await response.json();
        console.log('Categorias carregadas:', data);
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
    console.log('Configuração selecionada:', {
      totalQuestions: selectedCount,
      difficulty: selectedDifficulty,
      categoryId: selectedCategory
    });
    onStart({
      totalQuestions: selectedCount,
      difficulty: selectedDifficulty,
      categoryId: selectedCategory || undefined
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Quiz App</h1>
          <p className="text-muted-foreground">Configure seu quiz antes de começar</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              <Button
                variant={selectedCategory === null ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                className="w-full"
              >
                Todas
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="w-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dificuldade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map((diff) => (
                <Button
                  key={diff.value}
                  variant={selectedDifficulty === diff.value ? 'primary' : 'outline'}
                  onClick={() => setSelectedDifficulty(diff.value)}
                  className="w-full"
                >
                  {diff.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantidade de Questões
            </label>
            <div className="grid grid-cols-3 gap-2">
              {questionCounts.map((count) => (
                <Button
                  key={count}
                  variant={selectedCount === count ? 'primary' : 'outline'}
                  onClick={() => setSelectedCount(count)}
                  className="w-full"
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStart}
            className="w-full py-6 text-lg font-medium"
          >
            Começar Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}; 