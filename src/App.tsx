import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import Quiz from './pages/Quiz';
import { QuizConfig } from './components/QuizConfig';
import { QuestionSelector } from './pages/QuestionSelector';
import { TestConfig } from './pages/TestConfig';
import { QuestionManagement } from './pages/QuestionManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/config" element={<Quiz />} />
        <Route path="/test" element={<TestConfig />} />
        <Route path="/select-questions" element={<QuestionSelector />} />
        <Route path="/question-management" element={<QuestionManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
