export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  categoryId: number;
  difficulty: string;
  explanation?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
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
  difficulty: string;
  categoryId?: number;
} 