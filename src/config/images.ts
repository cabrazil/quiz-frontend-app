/**
 * Configuração para gerenciamento de imagens do quiz
 */

const API_URL = 'http://localhost:3000';

// Configuração de imagens
export const imageConfig = {
  defaultImage: '/questions/default/image_1.jpg',
  basePath: '/questions',
  imageFormats: ['jpg', 'png'],
  imagePrefix: 'image_',
  apiUrl: API_URL,
  getFullImageUrl: (path: string) => {
    if (!path) return `${API_URL}/questions/default/image_1.jpg`;
    return path.startsWith('/') ? `${API_URL}${path}` : `${API_URL}/${path}`;
  }
};

// Função para gerar o caminho da imagem de uma questão
export const getQuestionImagePath = (questionId: number, format: string = 'jpg'): string => {
  return `${imageConfig.basePath}/${questionId}/${imageConfig.imagePrefix}1.${format}`;
};

// Função para validar se uma imagem existe
export const validateImagePath = (path: string): boolean => {
  return path.startsWith(imageConfig.basePath);
}; 