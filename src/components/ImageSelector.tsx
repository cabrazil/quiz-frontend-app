import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, X, Check } from 'lucide-react';
import axios from 'axios';

interface ImageOption {
  id: string;
  url: string;
  source: string;
  description: string;
  width: number;
  height: number;
}

interface ImageSelectorProps {
  questionId: number;
  onImageSelected: (imagePath: string) => void;
  onClose: () => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  questionId,
  onImageSelected,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageOptions, setImageOptions] = useState<ImageOption[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageOption | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const fetchImageOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Busca as opções de imagem para a questão
        const response = await axios.get(`http://localhost:3000/api/questions/${questionId}/images`);
        setImageOptions(response.data.images || []);
        
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(response.data.images[0]);
        }
      } catch (err) {
        console.error('Error fetching image options:', err);
        setError('Não foi possível carregar as opções de imagem. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchImageOptions();
  }, [questionId]);

  const handleImageSelect = (image: ImageOption) => {
    setSelectedImage(image);
  };

  const handleSave = () => {
    if (selectedImage) {
      onImageSelected(selectedImage.url);
    }
  };

  const filteredImages = imageOptions.filter(image => {
    if (activeTab === 'all') return true;
    return image.source === activeTab;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="flex-none">
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Selecionar Imagem</CardTitle>
              <CardDescription>
                Escolha a imagem mais relevante para a questão
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando opções de imagem...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          ) : imageOptions.length === 0 ? (
            <div className="text-center p-4">
              <p className="mb-4">Nenhuma opção de imagem encontrada.</p>
              <Button onClick={onClose}>
                Fechar
              </Button>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="flex-none grid w-full grid-cols-4">
                  <TabsTrigger value="all">Todas</TabsTrigger>
                  <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                  <TabsTrigger value="pexels">Pexels</TabsTrigger>
                  <TabsTrigger value="pixabay">Pixabay</TabsTrigger>
                </TabsList>
                
                <div className="flex-1 overflow-hidden mt-4">
                  <TabsContent value={activeTab} className="h-full m-0">
                    <div className="h-full overflow-y-auto pr-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredImages.map((image) => (
                          <div
                            key={image.id}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
                              selectedImage?.id === image.id ? 'border-primary' : 'border-transparent'
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={image.description}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => handleImageSelect(image)}
                              >
                                {selectedImage?.id === image.id ? (
                                  <>
                                    <Check className="h-4 w-4" />
                                    Selecionada
                                  </>
                                ) : (
                                  'Selecionar'
                                )}
                              </Button>
                              <p className="text-white text-xs text-center px-2">
                                {image.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
              
              {selectedImage && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Imagem selecionada:</h3>
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.description}
                      className="w-32 h-18 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">{selectedImage.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fonte: {selectedImage.source}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex-none flex justify-between border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedImage}
          >
            Salvar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageSelector; 