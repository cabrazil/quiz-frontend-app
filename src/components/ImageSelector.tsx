import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, X } from 'lucide-react';
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
    <Card className="w-full max-w-4xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Selecionar Imagem</CardTitle>
          <CardDescription>
            Escolha a imagem mais relevante para a questão
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent>
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
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
                <TabsTrigger value="pexels">Pexels</TabsTrigger>
                <TabsTrigger value="pixabay">Pixabay</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredImages.map((image) => (
                    <div
                      key={image.id}
                      className={`relative aspect-video cursor-pointer rounded-lg overflow-hidden border-2 ${
                        selectedImage?.id === image.id ? 'border-primary' : 'border-transparent'
                      }`}
                      onClick={() => handleImageSelect(image)}
                    >
                      <img
                        src={image.url}
                        alt={image.description}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Selecionar</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
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
      
      <CardFooter className="flex justify-between">
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
  );
};

export default ImageSelector; 