interface QuizContainerProps {
  children: React.ReactNode;
}

export const QuizContainer = ({ children }: QuizContainerProps) => {
  return (
    <div className="min-h-screen bg-background py-8">
      {children}
    </div>
  );
}; 