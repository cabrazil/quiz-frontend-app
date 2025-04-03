export type Difficulty = 'FÁCIL' | 'MÉDIO' | 'DIFÍCIL' | 'all';

export interface Category {
  id: number;
  name: string;
}

export interface Question {
  id: number;
  text: string;
  categoryId: number;
  category?: string;
  difficulty: Difficulty;
  correctAnswer: string;
  options: string[];
  explanation?: string;
  source?: string;
  scrImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  questions: Question[];
  showFeedback: boolean;
  isCorrect: boolean;
  completed: boolean;
}

export interface QuizConfig {
  totalQuestions: number;
  difficulty: Difficulty;
  categoryId?: number;
} 