import { useEffect, useState } from 'react';
import { SoundManager } from '../utils/sound';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionTransitionProps {
  currentQuestion: number;
  totalQuestions: number;
  onTransitionEnd: () => void;
  quizName: string;
}

export const QuestionTransition = ({ 
  currentQuestion, 
  totalQuestions, 
  onTransitionEnd,
  quizName 
}: QuestionTransitionProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldPlaySound, setShouldPlaySound] = useState(true);
  const nextQuestion = currentQuestion + 1;
  const soundManager = SoundManager.getInstance();

  useEffect(() => {
    if (shouldPlaySound) {
      soundManager.playTransition().catch(error => {
        console.error('Erro ao tocar som de transição:', error);
      });
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setShouldPlaySound(false);
      setTimeout(onTransitionEnd, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
      setShouldPlaySound(false);
    };
  }, [onTransitionEnd, soundManager, shouldPlaySound]);

  const getTransitionColor = () => {
    const colorIndex = (nextQuestion - 1) % 3;
    switch (colorIndex) {
      case 0:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 1:
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 2:
        return 'from-green-400 via-green-500 to-green-600';
      default:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const titleVariants = {
    hidden: { 
      y: -50,
      opacity: 0,
      scale: 0.5
    },
    visible: { 
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  const numberVariants = {
    hidden: { 
      scale: 0,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.3
      }
    }
  };

  const particleVariants = {
    hidden: { 
      scale: 0,
      opacity: 0
    },
    visible: (i: number) => ({
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      y: [0, -100],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut"
      }
    })
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute inset-0 bg-card rounded-xl shadow-lg overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="relative w-full h-full">
            {/* Gradiente animado de fundo com efeito de brilho */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r ${getTransitionColor()}`}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* Conteúdo central com animação */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              <motion.div 
                className="text-center"
                variants={containerVariants}
              >
                <motion.h2 
                  className="text-6xl font-bold text-white mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  variants={titleVariants}
                >
                  {quizName}
                </motion.h2>
                <motion.span 
                  className="text-[12rem] font-bold text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  variants={numberVariants}
                >
                  {nextQuestion}
                </motion.span>
              </motion.div>
            </div>

            {/* Partículas animadas */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                variants={particleVariants}
                custom={i}
                initial="hidden"
                animate="visible"
              />
            ))}

            {/* Círculos pulsantes */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/10 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 