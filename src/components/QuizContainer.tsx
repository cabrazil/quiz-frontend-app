interface QuizContainerProps {
  children: React.ReactNode;
}

export const QuizContainer = ({ children }: QuizContainerProps) => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>
  );
}; 