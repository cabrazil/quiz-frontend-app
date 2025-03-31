import { Button } from './ui/button';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const QuizResult = ({ score, totalQuestions, onRestart }: QuizResultProps) => {
  const percentage = (score / totalQuestions) * 100;
  const getEmoji = () => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🎉';
    if (percentage >= 50) return '👍';
    return '😢';
  };

  const getMessage = () => {
    if (percentage >= 90) return 'Excelente! Você é um gênio!';
    if (percentage >= 70) return 'Muito bem! Você se saiu ótimo!';
    if (percentage >= 50) return 'Bom trabalho! Continue praticando!';
    return 'Não desanime! Pratique mais e tente novamente!';
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-card rounded-xl shadow-lg">
      <div className="space-y-8 text-center">
        <div className="text-6xl mb-4">{getEmoji()}</div>
        
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">{getMessage()}</h2>
          <p className="text-muted-foreground text-lg">
            Você acertou {score} de {totalQuestions} questões
          </p>
        </div>

        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-background"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="36"
              cx="96"
              cy="96"
            />
            <circle
              className="text-primary"
              strokeWidth="8"
              strokeDasharray={226}
              strokeDashoffset={226 - (226 * percentage) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="36"
              cx="96"
              cy="96"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-4xl font-bold text-foreground">{Math.round(percentage)}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={onRestart}
            className="w-full py-6 text-xl font-bold gradient-primary hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎮 Jogar Novamente
          </Button>
        </div>
      </div>
    </div>
  );
}; 