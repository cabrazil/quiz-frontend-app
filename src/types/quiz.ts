import { Difficulty } from './question';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  category: string;
  categoryId: number;
  difficulty: Difficulty;
  imageUrl?: string;
}

export interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedAnswer: string) => void;
  currentIndex: number;
  totalQuestions: number;
}

export interface QuizResultProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
} 