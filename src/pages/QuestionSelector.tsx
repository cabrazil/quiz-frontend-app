import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Question, Difficulty } from '../types/question';
import { Category } from '../types/category';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export const QuestionSelector = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchQuestions();
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

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all' && selectedCategory) params.append('categoryId', selectedCategory);
      if (selectedDifficulty !== 'all' && selectedDifficulty) params.append('difficulty', selectedDifficulty);

      const response = await fetch(`${API_URL}/api/questions?${params.toString()}`);
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

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, selectedDifficulty]);

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
    setError(null);
    
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

      console.log('Resposta do servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro detalhado do servidor:', errorData);
        throw new Error(errorData.error || 'Erro ao salvar questões selecionadas');
      }

      const data = await response.json();
      console.log('Dados salvos com sucesso:', data);

      navigate('/config');
    } catch (error) {
      console.error('Erro ao salvar questões:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar questões selecionadas');
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
      navigate('/config');
    } catch (error) {
      setError('Erro ao limpar questões selecionadas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question => {
    if (selectedCategory !== 'all' && question.categoryId !== Number(selectedCategory)) return false;
    if (selectedDifficulty !== 'all' && question.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Selecionar Questões</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as dificuldades</SelectItem>
                <SelectItem value="EASY">Fácil</SelectItem>
                <SelectItem value="MEDIUM">Médio</SelectItem>
                <SelectItem value="HARD">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium">
                Questões selecionadas: {selectedQuestions.size}
              </p>
              <Badge variant="secondary">
                {filteredQuestions.length} questões disponíveis
              </Badge>
            </div>
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
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Seleção'
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {filteredQuestions.map((question) => (
              <Card
                key={question.id}
                className={`transition-all duration-200 ${
                  selectedQuestions.has(Number(question.id))
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedQuestions.has(Number(question.id))}
                      onCheckedChange={() => handleQuestionToggle(Number(question.id))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {categories.find(c => c.id === question.categoryId)?.name}
                        </Badge>
                        <Badge variant="secondary">
                          {question.difficulty === 'FÁCIL' ? 'Fácil' :
                           question.difficulty === 'MÉDIO' ? 'Médio' : 'Difícil'}
                        </Badge>
                      </div>
                      <p className="text-base">{question.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 