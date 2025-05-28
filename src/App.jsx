import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { AuthProvider } from './contexts/AuthContext'
import { QuizProvider } from './contexts/QuizContext'
import Header from './components/Common/Header'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import QuizConfig from './components/Quiz/QuizConfig'
import QuizQuestion from './components/Quiz/QuizQuestion'
import QuizResult from './components/Quiz/QuizResult'
import ProtectedRoute from './components/Common/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <QuizProvider>
        <Router>
          <div className='quiz-container'>
            <Header />
            <Container className='py-4'>
              <Routes>
                {/* Public Route */}
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                {/* Protected Routes */}
                <Route path='/' element={<ProtectedRoute />}>
                  <Route index element={<QuizConfig />} />
                  <Route path='quiz' element={<QuizQuestion />} />
                  <Route path='result' element={<QuizResult />} />
                </Route>
              </Routes>
            </Container>
          </div>
        </Router>
      </QuizProvider>
    </AuthProvider>
  )
}

export default App
