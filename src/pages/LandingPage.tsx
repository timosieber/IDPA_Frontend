import { useState } from 'react'
import { Bot, MessageSquare, Zap, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LoginModal } from '../components/LoginModal'

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      setIsLoginModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <header className="px-6 lg:px-8 h-20 flex items-center">
        <div className="flex items-center">
          <Bot className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">ChatBot Studio</span>
        </div>
        <nav className="ml-auto flex gap-x-8">
          <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">Pricing</a>
          {user ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Dashboard
            </button>
          ) : (
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Anmelden
            </button>
          )}
        </nav>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <main>
        <section className="relative px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Create AI Chatbots
              <span className="block text-indigo-600">In Minutes</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
              Build powerful, personalized chatbots for your business without any coding. 
              Train your AI, customize the experience, and deploy anywhere.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button 
                onClick={handleGetStarted}
                className="bg-indigo-600 px-6 py-3 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
              >
                Kostenlos starten
              </button>
              <button className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
                Watch Demo <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to build amazing chatbots
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Powerful features that make chatbot creation simple and effective
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <MessageSquare className="h-5 w-5 flex-none text-indigo-600" />
                    Smart Conversations
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Train your chatbot with your own data and create natural, context-aware conversations that feel human.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Zap className="h-5 w-5 flex-none text-indigo-600" />
                    Lightning Fast Setup
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Get your chatbot up and running in minutes with our intuitive drag-and-drop interface.</p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <Shield className="h-5 w-5 flex-none text-indigo-600" />
                    Enterprise Security
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">Your data is protected with enterprise-grade security and privacy controls.</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-indigo-600 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-6 text-lg leading-8 text-indigo-200">
                Join thousands of businesses already using our platform to create amazing chatbot experiences.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button 
                  onClick={handleGetStarted}
                  className="bg-white px-6 py-3 text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Jetzt loslegen
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-indigo-400" />
              <span className="ml-2 text-lg font-semibold text-white">ChatBot Studio</span>
            </div>
            <p className="text-sm text-gray-400">© 2024 ChatBot Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
