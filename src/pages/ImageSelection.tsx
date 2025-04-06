import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import ImageSelector from '../components/ImageSelector';
import { imageConfig } from '../config/images';

interface Question {
  id: number;
  text: string;
  scrImage: string | null;
}

const ImageSelection: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showImageSelector, setShowImageSelector] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Busca questões selecionadas
        const response = await axios.get('http://localhost:3000/api/questions/selected');
        setQuestions(response.data.questions || []);
        
        if (response.data.questions && response.data.questions.length > 0) {
          setSelectedQuestion(response.data.questions[0]);
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Não foi possível carregar as questões. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleOpenImageSelector = () => {
    if (selectedQuestion) {
      setShowImageSelector(true);
    }
  };

  const handleImageSelected = async (imagePath: string) => {
    if (!selectedQuestion) return;
    
    try {
      // Atualiza a questão com o caminho da imagem
      const response = await axios.put(`http://localhost:3000/api/questions/${selectedQuestion.id}`, {
        scrImage: imagePath
      });
      
      // Atualiza o estado local com a resposta do servidor
      const updatedQuestion = response.data;
      
      setQuestions(questions.map(q => 
        q.id === selectedQuestion.id ? { ...q, scrImage: updatedQuestion.scrImage } : q
      ));
      
      setSelectedQuestion({ ...selectedQuestion, scrImage: updatedQuestion.scrImage });
      setShowImageSelector(false);
    } catch (err) {
      console.error('Error updating question image:', err);
      setError('Não foi possível atualizar a imagem. Por favor, tente novamente.');
    }
  };

  const handleFinish = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Seleção de Imagens para Questões</CardTitle>
          <CardDescription>
            Selecione uma questão e escolha a imagem mais relevante para ela
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando questões...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center p-4">
              <p className="mb-4">Nenhuma questão selecionada encontrada.</p>
              <Button onClick={() => navigate('/')}>
                Voltar para a página inicial
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Questões:</h3>
                <div className="border rounded-lg divide-y max-h-[500px] overflow-y-auto">
                  {questions.map((question) => (
                    <div 
                      key={question.id}
                      className={`p-3 cursor-pointer hover:bg-muted ${
                        selectedQuestion?.id === question.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleQuestionSelect(question)}
                    >
                      <p className="text-sm line-clamp-2">{question.text}</p>
                      {question.scrImage && (
                        <div className="mt-2 flex items-center text-xs text-muted-foreground">
                          <span className="mr-2">✓</span> Imagem já selecionada
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Questão selecionada:</h3>
                {selectedQuestion ? (
                  <div className="border rounded-lg p-4">
                    <p className="mb-4">{selectedQuestion.text}</p>
                    
                    {selectedQuestion.scrImage ? (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Imagem atual:</p>
                        <img 
                          src={imageConfig.getFullImageUrl(selectedQuestion.scrImage)} 
                          alt="Imagem da questão" 
                          className="w-full h-40 object-cover rounded"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-4">
                        Nenhuma imagem selecionada para esta questão.
                      </p>
                    )}
                    
                    <Button onClick={handleOpenImageSelector}>
                      {selectedQuestion.scrImage ? 'Alterar imagem' : 'Selecionar imagem'}
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 text-center text-muted-foreground">
                    Selecione uma questão para ver os detalhes
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/')}>
            Voltar
          </Button>
          <Button onClick={handleFinish}>
            Concluir
          </Button>
        </CardFooter>
      </Card>
      
      {showImageSelector && selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl">
            <ImageSelector 
              questionId={selectedQuestion.id}
              onImageSelected={handleImageSelected}
              onClose={() => setShowImageSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSelection; 