import { useState, useCallback } from 'react';
import { Question, QuizState } from '../types/question';
import { QUIZ_CONSTANTS } from '../constants/quiz';
import { QuestionService } from '../services/questionService';

export const useQuiz = () => {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    questions: [],
    showFeedback: false,
    isCorrect: false,
    completed: false,
  });

  const questionService = QuestionService.getInstance();

  const startQuiz = useCallback(async (category?: string, difficulty?: string) => {
    try {
      const questions = await questionService.fetchQuestions(category, difficulty as any);
      const randomQuestions = questionService.getRandomQuestions(questions);
      
      setState(prev => ({
        ...prev,
        questions: randomQuestions,
        currentQuestion: 0,
        score: 0,
        showFeedback: false,
        isCorrect: false,
        completed: false,
      }));
    } catch (error) {
      console.error('Erro ao iniciar o quiz:', error);
      throw error;
    }
  }, []);

  const answerQuestion = useCallback((answer: string) => {
    const { currentQuestion, questions } = state;
    const question = questions[currentQuestion];
    
    if (!question) return;

    const isCorrect = answer === question.correctAnswer;
    const points = QUIZ_CONSTANTS.DIFFICULTY_POINTS[question.difficulty];
    
    setState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + points : prev.score,
      showFeedback: true,
      isCorrect,
    }));

    setTimeout(() => {
      setState(prev => {
        const nextQuestion = prev.currentQuestion + 1;
        const completed = nextQuestion >= questions.length;

        return {
          ...prev,
          currentQuestion: nextQuestion,
          showFeedback: false,
          completed,
        };
      });
    }, QUIZ_CONSTANTS.FEEDBACK_DELAY);
  }, [state]);

  const resetQuiz = useCallback(() => {
    setState({
      currentQuestion: 0,
      score: 0,
      questions: [],
      showFeedback: false,
      isCorrect: false,
      completed: false,
    });
  }, []);

  return {
    ...state,
    startQuiz,
    answerQuestion,
    resetQuiz,
    currentQuestionData: state.questions[state.currentQuestion],
  };
}; 