import { Question, Difficulty } from '../types/question';
import { QUIZ_CONSTANTS } from '../constants/quiz';
import axios from 'axios';

export class QuestionService {
  private static instance: QuestionService;
  private readonly API_URL = 'http://localhost:3000';

  private constructor() {}

  public static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  public async fetchQuestions(category?: string, difficulty?: Difficulty): Promise<Question[]> {
    try {
      const response = await axios.get(`${this.API_URL}/api/questions`, {
        params: {
          category,
          difficulty,
          limit: QUIZ_CONSTANTS.TOTAL_QUESTIONS
        }
      });

      return response.data.map((question: any) => ({
        id: question.id,
        text: question.text,
        category: question.category,
        difficulty: question.difficulty,
        correctAnswer: question.correctAnswer,
        options: question.options,
        explanation: question.explanation,
        createdAt: new Date(question.createdAt),
        updatedAt: new Date(question.updatedAt),
      }));
    } catch (error) {
      console.error('Erro ao buscar questões:', error);
      return this.getMockQuestions();
    }
  }

  public async createQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
    try {
      const response = await axios.post(`${this.API_URL}/api/questions`, question);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar questão:', error);
      throw error;
    }
  }

  public async updateQuestion(id: string, question: Partial<Question>): Promise<Question> {
    try {
      const response = await axios.put(`${this.API_URL}/api/questions/${id}`, question);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar questão:', error);
      throw error;
    }
  }

  public async deleteQuestion(id: string): Promise<void> {
    try {
      await axios.delete(`${this.API_URL}/api/questions/${id}`);
    } catch (error) {
      console.error('Erro ao deletar questão:', error);
      throw error;
    }
  }

  public async getQuestionById(id: string): Promise<Question> {
    try {
      const response = await axios.get(`${this.API_URL}/api/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar questão:', error);
      throw error;
    }
  }

  public async generateExplanation(id: string): Promise<Question> {
    try {
      const response = await axios.post(`${this.API_URL}/api/questions/${id}/generate-explanation`);
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar explicação:', error);
      throw error;
    }
  }

  public getRandomQuestions(questions: Question[], count: number = QUIZ_CONSTANTS.TOTAL_QUESTIONS): Question[] {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private getMockQuestions(): Question[] {
    return [
      {
        id: "1",
        text: "Qual é a capital do Brasil?",
        category: "Geografia",
        categoryId: 1,
        difficulty: "Fácil",
        correctAnswer: "Brasília",
        options: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
        explanation: "Brasília é a capital do Brasil desde 1960...",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        text: "Qual é o maior planeta do Sistema Solar?",
        category: "Ciências",
        categoryId: 2,
        difficulty: "Médio",
        correctAnswer: "Júpiter",
        options: ["Saturno", "Júpiter", "Marte", "Terra"],
        explanation: "Júpiter é o maior planeta do Sistema Solar...",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        text: "Quem pintou a Mona Lisa?",
        category: "Arte",
        categoryId: 3,
        difficulty: "Difícil",
        correctAnswer: "Leonardo da Vinci",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        explanation: "A Mona Lisa foi pintada por Leonardo da Vinci...",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
} 