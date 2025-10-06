import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ChatbotTraining from './pages/ChatbotTraining'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/training" 
        element={
          <ProtectedRoute>
            <ChatbotTraining />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}

export default App
