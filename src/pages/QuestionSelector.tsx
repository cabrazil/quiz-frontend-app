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
import { CategorySelect } from '../components/CategorySelect';

const API_URL = 'http://localhost:3000';

export const QuestionSelector = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const navigate = useNavigate();

  const QUESTIONS_PER_PAGE = 10;

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

  const fetchQuestions = async () => {
    if (selectedCategory === 'all' && selectedDifficulty === 'all') {
      setError('Selecione pelo menos uma categoria ou dificuldade');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all' && selectedCategory) {
        params.append('categoryId', selectedCategory);
        console.log('Categoria selecionada:', selectedCategory);
      }
      if (selectedDifficulty !== 'all' && selectedDifficulty) {
        params.append('difficulty', selectedDifficulty);
        console.log('Dificuldade selecionada:', selectedDifficulty);
      }
      params.append('page', currentPage.toString());
      params.append('limit', QUESTIONS_PER_PAGE.toString());

      console.log('Parâmetros da requisição:', params.toString());

      const response = await fetch(`${API_URL}/api/questions?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar questões');
      }
      const data = await response.json();
      console.log('Resposta da API:', data);
      setQuestions(data.questions);
      setTotalQuestions(data.total);
      setTotalPages(Math.ceil(data.total / QUESTIONS_PER_PAGE));
    } catch (error) {
      setError('Erro ao carregar questões');
      console.error(error);
    } finally {
      setLoading(false);
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
    setError(null);
    
    try {
      console.log('Enviando questões selecionadas:', Array.from(selectedQuestions));
      
      // Cria as pastas para cada questão selecionada
      const questionIds = Array.from(selectedQuestions);
      
      // Chama o endpoint para criar as pastas
      const foldersResponse = await fetch(`${API_URL}/api/questions/create-folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionIds
        }),
      });
      
      if (!foldersResponse.ok) {
        console.error('Erro ao criar pastas para as questões:', await foldersResponse.text());
        // Continua mesmo com erro na criação das pastas
      } else {
        const foldersData = await foldersResponse.json();
        console.log('Pastas criadas com sucesso:', foldersData);
        
        // Atualiza o campo scrImage para cada questão selecionada
        await updateQuestionImages(questionIds);
      }
      
      const response = await fetch(`${API_URL}/api/questions/selected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionIds
        }),
      });

      console.log('Resposta do servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro detalhado do servidor:', errorData);
        
        if (errorData.usedQuestionIds) {
          // Remove as questões já usadas da seleção
          const newSelectedQuestions = new Set(selectedQuestions);
          errorData.usedQuestionIds.forEach((id: number) => newSelectedQuestions.delete(id));
          setSelectedQuestions(newSelectedQuestions);
          
          throw new Error(`Algumas questões já foram usadas recentemente e foram removidas da seleção. Por favor, selecione outras questões.`);
        }
        
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

  // Função para atualizar o campo scrImage de cada questão selecionada
  const updateQuestionImages = async (questionIds: number[]) => {
    console.log('Atualizando imagens das questões:', questionIds);
    
    for (const questionId of questionIds) {
      try {
        const imagePath = `/src/assets/questions/${questionId}/image.jpg`;
        console.log(`Atualizando imagem da questão ${questionId} para: ${imagePath}`);
        
        const response = await fetch(`${API_URL}/api/questions/${questionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scrImage: imagePath
          }),
        });
        
        if (!response.ok) {
          console.error(`Erro ao atualizar imagem da questão ${questionId}:`, await response.text());
        } else {
          console.log(`Imagem da questão ${questionId} atualizada com sucesso`);
        }
      } catch (error) {
        console.error(`Erro ao atualizar imagem da questão ${questionId}:`, error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (currentPage > 0) {
      fetchQuestions();
    }
  }, [currentPage]);

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
            <CategorySelect
              categories={categories}
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              className="w-full md:w-[200px]"
            />

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as dificuldades</SelectItem>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => {
                setCurrentPage(1);
                fetchQuestions();
              }}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                'Buscar'
              )}
            </Button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <p className="text-lg font-medium">
                Questões selecionadas: {selectedQuestions.size}
              </p>
              <Badge variant="secondary">
                {totalQuestions} questões encontradas
              </Badge>
            </div>
            <div className="space-x-2">
              <Button
                onClick={async () => {
                  setLoading(true);
                  try {
                    console.log('Iniciando limpeza da seleção...');
                    
                    // Limpa a seleção no backend
                    const response = await fetch(`${API_URL}/api/questions/selected`, {
                      method: 'DELETE',
                    });

                    if (!response.ok) {
                      throw new Error('Erro ao limpar questões selecionadas');
                    }

                    console.log('Seleção limpa no backend');

                    // Limpa a seleção local
                    setSelectedQuestions(new Set());
                    setError(null);
                    
                    // Limpa os filtros
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setCurrentPage(1);
                    
                    // Limpa as questões da tela
                    setQuestions([]);
                    setTotalQuestions(0);
                    setTotalPages(1);
                    
                    console.log('Estado limpo:', {
                      selectedQuestions: Array.from(selectedQuestions),
                      selectedCategory,
                      selectedDifficulty,
                      currentPage,
                      totalQuestions,
                      totalPages
                    });
                  } catch (error) {
                    setError('Erro ao limpar questões selecionadas');
                    console.error('Erro ao limpar seleção:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
                variant="outline"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Limpando...
                  </>
                ) : (
                  'Limpar Seleção'
                )}
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
            {questions.map((question) => (
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
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="text-base">{question.text}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 