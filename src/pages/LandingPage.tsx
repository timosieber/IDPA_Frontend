import { useState } from 'react'
import { Bot, MessageSquare, ArrowRight, Users, Sparkles, Globe, BarChart3, Menu, X, Settings, Brain, Rocket, ShieldCheck } from 'lucide-react'
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
      
      {/* Hintergrund-Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-blob animation-delay-2000" />
      </div>

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ChatBot Studio</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Vorteile</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Technologie</a>
            <a href="#use-cases" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Use Cases</a>
            
            <div className="h-4 w-[1px] bg-white/10" />
            
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/training')}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-all"
                >
                  Training
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
              >
                Login
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
              <a href="#features" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Vorteile</a>
              <a href="#how-it-works" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Technologie</a>
              <div className="pt-4 border-t border-white/5">
                {user ? (
                  <button onClick={() => navigate('/dashboard')} className="w-full py-2 bg-indigo-600 rounded-lg text-sm font-medium">Dashboard</button>
                ) : (
                  <button onClick={() => setIsLoginModalOpen(true)} className="w-full py-2 bg-indigo-600 rounded-lg text-sm font-medium">Login</button>
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
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8">
              <Sparkles className="h-3 w-3" />
              <span>Autonome Intelligenz für Ihr Business</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              Ihr bester Mitarbeiter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-shimmer">
                24/7 wach. Skalierbar.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Verwandeln Sie passiven Website-Traffic in aktive Kunden. 
              Unsere KI lernt Ihr gesamtes Unternehmenswissen in Sekunden und antwortet so präzise wie Ihr bester Experte.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-white text-dark-950 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
              >
                Jetzt transformieren
                <ArrowRight className="h-5 w-5" />
              </button>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 glass-button rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                Mehr erfahren
              </a>
            </motion.div>

            {/* Vertrauen */}
            <motion.div variants={itemVariants} className="mt-24 pt-8 border-t border-white/5">
              <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest">Die Zukunft des Kundenservice</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Platzhalter Logos für High-End Anmutung */}
                <div className="h-8 w-32 bg-white/10 rounded animate-pulse" />
                <div className="h-8 w-24 bg-white/10 rounded animate-pulse delay-75" />
                <div className="h-8 w-36 bg-white/10 rounded animate-pulse delay-150" />
                <div className="h-8 w-28 bg-white/10 rounded animate-pulse delay-200" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features (Bento Style) - Deep Value Research */}
        <section id="features" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Warum Unternehmen wechseln</h2>
            <p className="text-gray-400 max-w-xl">
              Klassische Chatbots sind dumme Entscheidungsbäume. ChatBot Studio ist ein Gehirn, das Ihre Marke versteht.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Context */}
            <div className="md:col-span-2 glass-panel p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12">
                <Brain className="h-48 w-48 text-indigo-500" />
              </div>
              <div className="relative z-10">
                <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 ring-1 ring-indigo-500/40">
                  <MessageSquare className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Versteht Kontext, nicht nur Keywords</h3>
                <p className="text-gray-400 max-w-md">
                  Ihre Kunden drücken sich menschlich aus. Unsere KI versteht Ironie, Umgangssprache und komplexe Zusammenhänge. 
                  Das Ergebnis: Gespräche, die sich echt anfühlen und Probleme lösen, statt Frust zu erzeugen.
                </p>
              </div>
            </div>

            {/* Feature 2: Speed */}
            <div className="glass-panel p-8 rounded-2xl group hover:border-green-500/30 transition-colors">
              <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 ring-1 ring-green-500/40">
                <Rocket className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Zero Downtime</h3>
              <p className="text-gray-400">
                Keine Warteschlangen. Keine Öffnungszeiten. Jede Anfrage wird in Millisekunden beantwortet. Skalieren Sie Ihren Support unendlich, ohne Personalaufbau.
              </p>
            </div>

            {/* Feature 3: Data Ingestion */}
            <div className="glass-panel p-8 rounded-2xl group hover:border-purple-500/30 transition-colors">
              <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 ring-1 ring-purple-500/40">
                <Globe className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Liest Ihre Website</h3>
              <p className="text-gray-400">
                Vergessen Sie manuelles Training. Geben Sie uns eine URL. Wir scrapen, strukturieren und lernen Ihr gesamtes Unternehmenswissen in wenigen Minuten.
              </p>
            </div>

            {/* Feature 4: Analytics */}
            <div className="md:col-span-2 glass-panel p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="h-12 w-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 ring-1 ring-orange-500/40">
                    <BarChart3 className="h-6 w-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Daten statt Vermutungen</h3>
                  <p className="text-gray-400">
                    Worüber beschweren sich Kunden wirklich? Welche Produkte fehlen?
                    Unsere KI kategorisiert jede Konversation und liefert Ihnen strategische Insights, die Sie sonst nie sehen würden.
                  </p>
                </div>
                {/* Visual Placeholder for Chart */}
                <div className="w-full md:w-64 h-32 bg-dark-900/50 rounded-lg border border-white/10 flex items-end justify-between p-4 gap-2 backdrop-blur-md">
                  {[35, 60, 45, 80, 55, 90].map((h, i) => (
                    <div key={i} className="w-full bg-gradient-to-t from-orange-500/20 to-orange-500/60 rounded-t" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ablauf Sektion */}
        <section id="how-it-works" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">In 4 Schritten zur Intelligenz</h2>
            <p className="text-gray-400">Keine IT-Abteilung notwendig.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                { icon: Users, title: 'Account erstellen', desc: 'Starten Sie kostenlos und ohne Risiko.' },
                { icon: Settings, title: 'Persona definieren', desc: 'Legen Sie Tonfall und Branding fest.' },
                { icon: Brain, title: 'Wissen saugen', desc: 'Wir lernen automatisch von Ihrer URL.' },
                { icon: Rocket, title: 'Live gehen', desc: 'Eine Zeile Code. Sofortiger Impact.' }
              ].map((step, i) => (
                <div key={i} className="bg-dark-900 border border-white/10 p-6 rounded-xl text-center hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-black/50">
                  <div className="w-14 h-14 mx-auto bg-dark-800 rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-[0_0_20px_rgba(79,70,229,0.15)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                    <step.icon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Security Sektion (Neu) */}
        <section className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
           <div className="glass-panel rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1">
               <h2 className="text-3xl font-bold mb-4">Sicherheit auf Enterprise-Niveau</h2>
               <p className="text-gray-400 mb-6 leading-relaxed">
                 Ihre Daten gehören Ihnen. Wir nutzen modernste Verschlüsselung und hosten konform zur DSGVO in Europa. 
                 Verlassen Sie sich auf eine Infrastruktur, die mit Ihrem Erfolg mitwächst.
               </p>
               <div className="flex flex-wrap gap-4">
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <ShieldCheck className="h-5 w-5 text-green-400" /> DSGVO Konform
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <ShieldCheck className="h-5 w-5 text-green-400" /> SSL Verschlüsselung
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-300">
                   <ShieldCheck className="h-5 w-5 text-green-400" /> 99.9% Uptime
                 </div>
               </div>
             </div>
             <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full" />
                <ShieldCheck className="h-40 w-40 text-white relative z-10 opacity-80" strokeWidth={1} />
             </div>
           </div>
        </section>

        {/* CTA Sektion - Hard Closing */}
        <section className="px-6 lg:px-8 mb-16">
          <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            
            <div className="relative z-10 p-12 md:p-24 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Hören Sie auf, Kunden zu ignorieren.</h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Jeder unbeantwortete Besucher ist ein verlorener Umsatz. 
                Starten Sie heute und lassen Sie Ihre Website für sich arbeiten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold text-lg hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Jetzt kostenlos starten
                </button>
              </div>
              <p className="mt-8 text-sm text-indigo-200 opacity-80">Keine Kreditkarte erforderlich • Jederzeit kündbar</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-950 pt-16 pb-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-lg">ChatBot Studio</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Die Plattform für autonome Kundenkommunikation. Bauen Sie die Zukunft Ihres Supports heute.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm text-white">Produkt</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Funktionen</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrationen</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Enterprise</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm text-white">Ressourcen</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Dokumentation</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">API Referenz</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-sm text-white">Rechtliches</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">AGB</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© 2025 ChatBot Studio. Entwickelt in der Schweiz.</p>
          <div className="flex gap-4">
             {/* Socials placeholder */}
             <div className="w-5 h-5 bg-gray-800 rounded-full opacity-50" />
             <div className="w-5 h-5 bg-gray-800 rounded-full opacity-50" />
          </div>
        </div>
      </footer>
    </div>
  )
}
