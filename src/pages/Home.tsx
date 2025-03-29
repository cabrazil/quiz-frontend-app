import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { QUIZ_CONSTANTS } from '../constants/quiz'

const Home = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <h2 className="text-4xl font-bold text-gray-900 mb-8">
        Bem-vindo ao Quiz de Conhecimentos Gerais!
      </h2>
      
      <div className="max-w-2xl mx-auto mb-12">
        <p className="text-xl text-gray-600 mb-6">
          Teste seus conhecimentos em diversas áreas e descubra o quanto você sabe!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {QUIZ_CONSTANTS.CATEGORIES.map((category) => (
            <Button
              key={category}
              variant="outline"
              onClick={() => navigate('/quiz', { state: { category } })}
            >
              {category}
            </Button>
          ))}
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/quiz')}
        >
          Começar Quiz
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Como funciona?
        </h3>
        <ul className="text-left space-y-2 text-gray-600">
          <li>• O quiz contém {QUIZ_CONSTANTS.TOTAL_QUESTIONS} questões aleatórias</li>
          <li>• Cada questão tem diferentes níveis de dificuldade</li>
          <li>• Você recebe pontos baseados na dificuldade da questão</li>
          <li>• Ao final, você verá sua pontuação e feedback</li>
          <li>• Você pode tentar novamente quantas vezes quiser</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default Home 