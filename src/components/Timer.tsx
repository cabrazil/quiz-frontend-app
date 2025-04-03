import React, { useState, useEffect } from 'react';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ isRunning, onTimeUpdate }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = window.setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        window.clearInterval(interval);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-lg font-semibold">
      {formatTime(time)}
    </div>
  );
};

export default Timer; 