/**
 * Configuração para gerenciamento de imagens do quiz
 */

// Função para gerar o caminho da imagem de uma questão
export const getQuestionImagePath = (questionId: number): string => {
  return `/questions/${questionId}/image.jpg`;
};

// Função para validar se uma imagem existe
export const validateImagePath = (path: string): boolean => {
  // Aqui você pode adicionar validações adicionais se necessário
  return path.startsWith('/questions/');
};

// Configurações de imagem
export const imageConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  defaultImage: '/questions/default/image.jpg',
}; 