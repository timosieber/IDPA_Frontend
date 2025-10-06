import { useAuth } from '../contexts/AuthContext'
import { Bot, LogOut, Plus, MessageSquare, BarChart, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ChatBot Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {user?.user_metadata?.avatar_url && (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt={user.user_metadata.full_name || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {user?.user_metadata?.full_name || user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Willkommen zurück, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Verwalten Sie Ihre Chatbots und überwachen Sie deren Performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktive Chatbots</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <MessageSquare className="h-12 w-12 text-indigo-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nachrichten heute</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <BarChart className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wissensquellen</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <GraduationCap className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/training')}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            <GraduationCap className="h-10 w-10 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Chatbot trainieren</h3>
            <p className="text-indigo-100 text-sm">Website scrapen & Wissen hinzufügen</p>
          </button>
          <button className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all">
            <Plus className="h-10 w-10 text-indigo-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Neuer Chatbot</h3>
            <p className="text-gray-600 text-sm">Chatbot erstellen und konfigurieren</p>
          </button>
          <button className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all">
            <BarChart className="h-10 w-10 text-green-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Analytics</h3>
            <p className="text-gray-600 text-sm">Performance & Statistiken anzeigen</p>
          </button>
        </div>

        {/* Chatbots Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Ihre Chatbots</h2>
              <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="h-5 w-5" />
                Neuer Chatbot
              </button>
            </div>
          </div>
          
          {/* Empty State */}
          <div className="p-12 text-center">
            <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Noch keine Chatbots
            </h3>
            <p className="text-gray-600 mb-6">
              Erstellen Sie Ihren ersten Chatbot, um loszulegen
            </p>
            <div className="flex gap-4 justify-center">
              <button className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="h-5 w-5" />
                Ersten Chatbot erstellen
              </button>
              <button 
                onClick={() => navigate('/training')}
                className="inline-flex items-center gap-2 bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Training starten
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
