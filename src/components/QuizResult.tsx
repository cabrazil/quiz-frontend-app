import { QuizResultProps } from '../types/quiz';
import { Button } from './ui/Button';

export const QuizResult = ({ score, totalQuestions, onRestart }: QuizResultProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const getMessage = () => {
    if (percentage >= 90) return "Excelente! Você é um gênio! 🧠";
    if (percentage >= 70) return "Muito bem! Você se saiu ótimo! 👏";
    if (percentage >= 50) return "Bom trabalho! Continue praticando! 💪";
    return "Não desanime! Pratique mais e tente novamente! 🎯";
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-xl shadow-lg">
      <div className="text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl font-bold text-primary">{percentage}%</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Resultado do Quiz</h2>
          <p className="text-lg text-muted-foreground">
            Você acertou {score} de {totalQuestions} questões
          </p>
          <p className="text-lg font-medium text-primary">
            {getMessage()}
          </p>
        </div>

        <Button 
          onClick={onRestart}
          className="w-full py-6 text-lg font-medium"
        >
          Tentar Novamente
        </Button>
      </div>
    </div>
  );
}; 