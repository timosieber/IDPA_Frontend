import { Clock, LogOut, Mail, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

export default function WaitlistPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-indigo-500/30">
      {/* Hintergrund-Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              IDPA ChatBot
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-300">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-dark-900/50 border border-dark-800 rounded-2xl p-8 md:p-12 text-center"
          >
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 flex items-center justify-center">
              <Clock className="w-10 h-10 text-indigo-400" />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Vielen Dank für Ihre Anmeldung!
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-dark-300 mb-8 max-w-lg mx-auto">
              Sie befinden sich aktuell auf der Warteliste. Wir werden Sie benachrichtigen,
              sobald Ihr Zugang freigeschaltet wird.
            </p>

            {/* Status Card */}
            <div className="bg-dark-800/50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-400 font-medium">Warteliste</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-dark-200">Konto erfolgreich erstellt</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-dark-200">Warten auf Freischaltung</span>
                </div>
                <div className="flex items-center gap-3 text-left opacity-50">
                  <div className="w-5 h-5 rounded-full border-2 border-dark-600 flex-shrink-0" />
                  <span className="text-dark-400">Dashboard-Zugang</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 text-left bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
              <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-dark-200">
                  Sie erhalten eine E-Mail an <span className="text-white font-medium">{user?.email}</span>,
                  sobald Ihr Konto freigeschaltet wurde.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full border-t border-white/5 bg-dark-950/90 backdrop-blur-xl py-4">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-dark-400">
            Bei Fragen kontaktieren Sie uns unter{' '}
            <a href="mailto:support@example.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              support@example.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
