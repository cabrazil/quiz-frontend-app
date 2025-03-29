import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { QUIZ_CONSTANTS } from '../constants/quiz'

interface LocationState {
  score: number
}

const Results = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { score } = (location.state as LocationState) || { score: 0 }

  const getMessage = (score: number) => {
    const { SCORE_MESSAGES } = QUIZ_CONSTANTS
    
    if (score >= SCORE_MESSAGES.EXCELLENT.min) return SCORE_MESSAGES.EXCELLENT.message
    if (score >= SCORE_MESSAGES.GOOD.min) return SCORE_MESSAGES.GOOD.message
    if (score >= SCORE_MESSAGES.FAIR.min) return SCORE_MESSAGES.FAIR.message
    return SCORE_MESSAGES.POOR.message
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Resultado Final
        </h2>
        
        <div className="mb-8">
          <div className="text-6xl font-bold text-primary mb-4">
            {score}/{QUIZ_CONSTANTS.TOTAL_QUESTIONS}
          </div>
          <p className="text-xl text-gray-600">
            {getMessage(score)}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/quiz')}
          >
            Tentar Novamente
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={() => navigate('/')}
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default Results 