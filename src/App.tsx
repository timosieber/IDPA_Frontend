import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ChatbotTraining from './pages/ChatbotTraining'
import Widget from './pages/Widget'
import Datenschutz from './pages/Datenschutz'
import Nutzungsbedingungen from './pages/Nutzungsbedingungen'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/datenschutz" element={<Datenschutz />} />
      <Route path="/nutzungsbedingungen" element={<Nutzungsbedingungen />} />
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
      <Route path="/widget" element={<Widget />} />
    </Routes>
  )
}

export default App
