import { useState, useEffect } from 'react';
import React from 'react';
import { Question, Difficulty } from '../types/question';
import { QuestionService } from '../services/questionService';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle, Plus, Edit, Trash, Save, X, Search, Wand2 } from 'lucide-react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  description: string;
}

export const QuestionManagement = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchId, setSearchId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const questionService = QuestionService.getInstance();

  // Buscar categorias do backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
        setError('Erro ao carregar categorias. Por favor, recarregue a página.');
      }
    };

    fetchCategories();
  }, []);

  // Função para inicializar uma nova questão
  const initializeNewQuestion = () => {
    setQuestion({
      id: '',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      category: '',
      categoryId: 0,
      difficulty: 'Fácil',
      explanation: '',
      createdAt: '',
      updatedAt: ''
    });
  };

  const handleSearch = async () => {
    if (!searchId) {
      setError('Por favor, insira um ID válido.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedQuestion = await questionService.getQuestionById(searchId);
      setQuestion(fetchedQuestion);
      setIsEditing(false);
    } catch (err) {
      setError('Questão não encontrada. Verifique o ID e tente novamente.');
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      if (!question?.text || !question.correctAnswer || !question.categoryId) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // Encontrar o nome da categoria pelo ID
      const category = categories.find(c => c.id === question.categoryId);
      
      const questionData = {
        text: question.text,
        options: question.options,
        correctAnswer: question.correctAnswer,
        categoryId: question.categoryId,
        category: category?.name || '',
        difficulty: question.difficulty,
        explanation: question.explanation,
        source: question.source,
        scrImage: question.scrImage
      };

      await questionService.createQuestion(questionData);
      setIsCreating(false);
      setQuestion(null);
      setSearchId('');
      setError(null);
      setSuccess('Questão criada com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao criar questão. Por favor, tente novamente.');
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      if (!question) return;

      const questionData = {
        text: question.text,
        options: question.options,
        correctAnswer: question.correctAnswer,
        categoryId: question.categoryId,
        difficulty: question.difficulty,
        explanation: question.explanation || '',
        source: question.source,
        scrImage: question.scrImage
      };

      await questionService.updateQuestion(question.id, questionData);
      setIsEditing(false);
      setError(null);
      setSuccess('Questão atualizada com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Erro ao atualizar questão. Por favor, tente novamente.');
    }
  };

  const handleDeleteQuestion = async () => {
    if (!question) return;
    
    try {
      await questionService.deleteQuestion(question.id);
      setQuestion(null);
      setSearchId('');
      setError(null);
    } catch (err) {
      setError('Erro ao deletar questão. Por favor, tente novamente.');
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!question) return;
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Questões</h1>
        <Button
          onClick={() => {
            setIsCreating(!isCreating);
            if (!isCreating) {
              initializeNewQuestion();
            } else {
              setQuestion(null);
            }
            setSearchId('');
            setError(null);
          }}
          className="flex items-center gap-2"
        >
          {isCreating ? <X size={16} /> : <Plus size={16} />}
          {isCreating ? 'Cancelar' : 'Nova Questão'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="mb-3 bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Sucesso</AlertTitle>
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {!isCreating && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <Input
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Digite o ID da questão"
                className="flex-1"
              />
              <Button onClick={handleSearch} className="flex items-center gap-2">
                <Search size={16} />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {(question || isCreating) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{isCreating ? 'Nova Questão' : 'Editar Questão'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Texto da Questão</label>
              <Textarea
                value={question?.text || ''}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(prev => ({ ...prev!, text: e.target.value }))}
                placeholder="Digite o texto da questão"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <Select
                value={question?.categoryId?.toString() || ''}
                onValueChange={(value) => {
                  const categoryId = parseInt(value);
                  const category = categories.find(c => c.id === categoryId);
                  setQuestion(prev => ({ 
                    ...prev!, 
                    categoryId: categoryId, 
                    category: category?.name || '' 
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dificuldade</label>
              <Select
                value={question?.difficulty || 'Fácil'}
                onValueChange={(value: Difficulty) => setQuestion(prev => ({ ...prev!, difficulty: value }))}
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
              <label className="block text-sm font-medium mb-1">Opções</label>
              <div className="grid grid-cols-2 gap-2">
                {(question?.options || ['', '', '', '']).map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Opção ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Resposta Correta</label>
              <Input
                value={question?.correctAnswer || ''}
                onChange={(e) => setQuestion(prev => ({ ...prev!, correctAnswer: e.target.value }))}
                placeholder="Digite a resposta correta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Explicação</label>
              <div className="space-y-2">
                <Textarea
                  value={question?.explanation || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestion(prev => ({ ...prev!, explanation: e.target.value }))}
                  placeholder="Digite a explicação da resposta"
                  className="min-h-[80px]"
                />
                {question && !isCreating && (
                  <Button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const updatedQuestion = await questionService.generateExplanation(question.id);
                        setQuestion(updatedQuestion);
                        setError(null);
                      } catch (err) {
                        setError('Erro ao gerar explicação. Por favor, tente novamente.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    {loading ? 'Gerando...' : 'Gerar Explicação'}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {isCreating ? (
                <Button onClick={handleCreateQuestion} className="flex items-center gap-2">
                  <Save size={16} />
                  Salvar
                </Button>
              ) : question ? (
                <>
                  <Button onClick={handleDeleteQuestion} variant="destructive" className="flex items-center gap-2">
                    <Trash size={16} />
                    Excluir
                  </Button>
                  <Button onClick={handleUpdateQuestion} className="flex items-center gap-2">
                    <Save size={16} />
                    Salvar
                  </Button>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionManagement; 