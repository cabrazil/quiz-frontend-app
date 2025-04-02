export type Difficulty = 'Fácil' | 'Médio' | 'Difícil';

export interface Category {
  id: number;
  name: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  categoryId: number;
  difficulty: Difficulty;
  explanation?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  scrImage?: string;
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