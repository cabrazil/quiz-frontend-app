import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import Quiz from './pages/Quiz';
import { QuizConfig } from './components/QuizConfig';
import { QuestionSelector } from './pages/QuestionSelector';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/config" element={<Quiz />} />
        <Route path="/test" element={<QuestionSelector />} />
      </Routes>
    </Router>
  );
}

export default App;
