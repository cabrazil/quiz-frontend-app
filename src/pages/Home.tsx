import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { QUIZ_CONSTANTS } from '../constants/quiz'

export const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-xl mx-auto bg-card p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="bg-primary/10 p-3 rounded-lg flex items-center justify-center gap-4 mb-6">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-primary rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"></div>
            </div>
            <h1 className="text-4xl font-bold text-primary">Cuca Boa</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Escolha o modo que deseja jogar
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/config')}
            className="w-full py-6 text-xl font-bold gradient-primary hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎮 Quiz Normal
          </Button>

          <Button
            onClick={() => navigate('/select-questions')}
            className="w-full py-6 text-xl font-bold gradient-primary hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎯 Selecionar Questões
          </Button>

          <Button
            onClick={() => navigate('/test')}
            variant="outline"
            className="w-full py-6 text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🎯 Modo de Teste
          </Button>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">ℹ️ Sobre os modos:</h2>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Quiz Normal:</strong> Jogue com várias questões aleatórias baseadas nas suas configurações.</p>
              <p><strong>Selecionar Questões:</strong> Escolha quais questões serão exibidas no quiz.</p>
              <p><strong>Modo de Teste:</strong> Selecione uma questão específica para testar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 