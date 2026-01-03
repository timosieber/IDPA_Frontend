import { useState } from 'react'
import { Bot, ArrowRight, Globe, BarChart3, Menu, X, Settings, Brain, Rocket, ShieldCheck, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { LoginModal } from '../components/LoginModal'

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      setIsLoginModalOpen(true)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-indigo-500/30">
      
      {/* Hintergrund-Gradients - Dezent gehalten */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">ChatBot Studio</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Nutzen</a>
            <a href="#process" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Funktionsweise</a>
            <a href="#security" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sicherheit</a>
            
            <div className="h-4 w-[1px] bg-white/10" />
            
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
              >
                Zum Dashboard
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 bg-white text-dark-950 hover:bg-gray-100 rounded-md text-sm font-medium transition-all"
              >
                Anmelden
              </button>
            )}
          </nav>

          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menü */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-dark-950 px-6 py-4 space-y-4"
            >
              <a href="#benefits" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Nutzen</a>
              <a href="#process" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Funktionsweise</a>
              <div className="pt-4 border-t border-white/5">
                {user ? (
                  <button onClick={() => navigate('/dashboard')} className="w-full py-2 bg-indigo-600 rounded-lg text-sm font-medium">Dashboard</button>
                ) : (
                  <button onClick={() => setIsLoginModalOpen(true)} className="w-full py-2 bg-indigo-600 rounded-lg text-sm font-medium">Anmelden</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      <main className="relative pt-32 pb-16">
        {/* Hero Sektion */}
        <section className="px-6 lg:px-8 mb-32">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>System betriebsbereit</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Automatisierter Kundendienst.<br />
              <span className="text-gray-400">Ohne IT-Projekt.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Erstellen Sie einen KI-Assistenten auf Basis Ihrer Website-Inhalte.
              Beantwortet Standardanfragen sofort, rund um die Uhr und in konsistenter Qualität.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-6 py-3 bg-white text-dark-950 rounded-md font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                Jetzt starten
                <ArrowRight className="h-4 w-4" />
              </button>
              <a 
                href="#process"
                className="w-full sm:w-auto px-6 py-3 border border-white/10 hover:bg-white/5 rounded-md font-medium text-gray-300 transition-all text-center"
              >
                Funktionsweise
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-gray-600" /> Keine Kreditkarte nötig</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-gray-600" /> DSGVO-konform</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-gray-600" /> In 5 Min. live</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Ablauf Sektion (3 Schritte) */}
        <section id="process" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="border-t border-white/10 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="text-4xl font-bold text-white/10">01</div>
                <h3 className="text-lg font-semibold text-white">Quelle definieren</h3>
                <p className="text-gray-400 leading-relaxed">
                  Geben Sie Ihre Unternehmens-Website an. Unser System analysiert und indexiert relevante Texte vollautomatisch.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-white/10">02</div>
                <h3 className="text-lg font-semibold text-white">Prüfen & Anpassen</h3>
                <p className="text-gray-400 leading-relaxed">
                  Testen Sie die Antworten in der Vorschau. Passen Sie bei Bedarf den Tonfall oder spezifische Anweisungen an.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold text-white/10">03</div>
                <h3 className="text-lg font-semibold text-white">Integrieren</h3>
                <p className="text-gray-400 leading-relaxed">
                  Fügen Sie das generierte JavaScript-Snippet in Ihre Website ein. Der Assistent ist sofort für Ihre Besucher verfügbar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Nutzen Sektion */}
        <section id="benefits" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Wirtschaftlicher Nutzen</h2>
            <p className="text-gray-400">
              Der Einsatz von KI im Kundenservice ist keine Spielerei, sondern ein Hebel für Effizienz und Kundenzufriedenheit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Nutzen 1 */}
            <div className="glass-panel p-8 rounded-xl border border-white/5 bg-white/5">
              <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6 border border-indigo-500/20">
                <BarChart3 className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Entlastung des Teams</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Bis zu 80% der Anfragen sind wiederkehrend (Öffnungszeiten, Preise, Status). 
                Diese werden abgefangen, bevor sie Ihr Personal erreichen.
              </p>
            </div>

            {/* Nutzen 2 */}
            <div className="glass-panel p-8 rounded-xl border border-white/5 bg-white/5">
              <div className="h-10 w-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 border border-green-500/20">
                <Clock className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Verfügbarkeit</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Kunden erwarten sofortige Antworten, auch am Wochenende. 
                Sichern Sie Erreichbarkeit, ohne Schichtmodelle einführen zu müssen.
              </p>
            </div>

            {/* Nutzen 3 */}
            <div className="glass-panel p-8 rounded-xl border border-white/5 bg-white/5">
              <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 border border-purple-500/20">
                <Globe className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Konsistenz</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Der Assistent antwortet immer basierend auf den aktuellen Informationen Ihrer Website. 
                Keine veralteten Aussagen, keine Tagesform.
              </p>
            </div>
          </div>
        </section>

        {/* Vertrauen & Reife */}
        <section id="security" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
           <div className="glass-panel rounded-xl p-8 md:p-12 border border-white/10 bg-white/5">
             <div className="max-w-3xl">
               <h2 className="text-2xl font-bold mb-4">Kontrolle und Sicherheit</h2>
               <p className="text-gray-400 mb-8 leading-relaxed">
                 Wir verstehen die Anforderungen an moderne Unternehmenssoftware. 
                 Das System ist darauf ausgelegt, nur Informationen aus Ihren Quellen zu verwenden. 
                 Sie behalten die Hoheit über die Antworten.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 text-sm text-gray-300">
                   <ShieldCheck className="h-5 w-5 text-gray-500" /> 
                   <span>Hosting in modernen Rechenzentren</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-300">
                   <Settings className="h-5 w-5 text-gray-500" /> 
                   <span>Detaillierte Einsicht in alle Konversationen</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-300">
                   <Brain className="h-5 w-5 text-gray-500" /> 
                   <span>Transparente KI-Kennzeichnung</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm text-gray-300">
                   <Rocket className="h-5 w-5 text-gray-500" /> 
                   <span>Monatlich kündbar, keine Bindung</span>
                 </div>
               </div>
             </div>
           </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-dark-950 pt-16 pb-8 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-semibold text-gray-400">ChatBot Studio</span>
            </div>
            
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
              <a href="#" className="hover:text-white transition-colors">Impressum</a>
              <a href="#" className="hover:text-white transition-colors">Kontakt</a>
            </div>
            
            <div className="text-xs text-gray-600">
              © 2025 ChatBot Studio. Software für den Mittelstand.
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

function Clock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}