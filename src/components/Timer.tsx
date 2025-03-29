import { useEffect } from 'react';

interface TimerProps {
  timeLeft: number;
  onTimeUp: () => void;
  isActive: boolean;
  onTick: (newTime: number) => void;
}

export const Timer = ({ timeLeft, onTimeUp, isActive, onTick }: TimerProps) => {
  const isWarning = timeLeft <= 5;
  const isDanger = timeLeft <= 3;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        const newTime = timeLeft - 1;
        onTick(newTime);
        
        if (newTime <= 0) {
          onTimeUp();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timeLeft, isActive, onTimeUp, onTick]);

  return (
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
        <div 
          className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000"
          style={{
            clipPath: `inset(${((10 - timeLeft) / 10) * 100}% 0 0 0)`,
            borderColor: isDanger ? '#ef4444' : isWarning ? '#eab308' : '#6366f1'
          }}
        />
        <span 
          className={`text-2xl font-bold ${isDanger ? 'text-red-500' : isWarning ? 'text-yellow-500' : 'text-primary'}`}
        >
          {timeLeft}s
        </span>
      </div>
      {isWarning && (
        <div 
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full animate-pulse"
          style={{
            backgroundColor: isDanger ? '#ef4444' : '#eab308'
          }}
        />
      )}
    </div>
  );
}; 