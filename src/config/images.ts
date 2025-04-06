/**
 * Configuração para gerenciamento de imagens do quiz
 */

const API_URL = 'http://localhost:3000';

// Configuração de imagens
export const imageConfig = {
  defaultImage: '/questions/default/image_1.jpg',
  basePath: '/questions',
  imageFormat: 'jpg',
  imagePrefix: 'image_',
  apiUrl: API_URL,
  getFullImageUrl: (path: string) => {
    if (!path) return `${API_URL}/questions/default/image_1.jpg`;
    return path.startsWith('/') ? `${API_URL}${path}` : `${API_URL}/${path}`;
  }
};

// Função para gerar o caminho da imagem de uma questão
export const getQuestionImagePath = (questionId: number): string => {
  return `${imageConfig.basePath}/${questionId}/${imageConfig.imagePrefix}1.${imageConfig.imageFormat}`;
};

// Função para validar se uma imagem existe
export const validateImagePath = (path: string): boolean => {
  return path.startsWith(imageConfig.basePath);
}; 