import { useState } from 'react'
import { Bot, ArrowRight, BarChart3, Menu, X, Settings, ShieldCheck, Check, Clock, Users, Link2, Layout } from 'lucide-react'
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
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white selection:bg-indigo-500/30">
      
      {/* Hintergrund-Gradients */}
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
          
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#benefits" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Nutzen</a>
            <a href="#process" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Funktionsweise</a>
            <a href="#use-cases" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Einsatzbereiche</a>
            <a href="#security" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sicherheit & Kontrolle</a>
            <a href="#pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Preise</a>
            
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
                Zum Dashboard
              </button>
            )}
          </nav>

          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-white"
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
              className="lg:hidden border-t border-white/5 bg-dark-950 px-6 py-4 space-y-4"
            >
              <a href="#benefits" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Nutzen</a>
              <a href="#process" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Funktionsweise</a>
              <a href="#use-cases" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Einsatzbereiche</a>
              <a href="#pricing" className="block text-sm text-gray-400" onClick={() => setMobileMenuOpen(false)}>Preise</a>
              <div className="pt-4 border-t border-white/5">
                <button onClick={() => { setMobileMenuOpen(false); handleGetStarted(); }} className="w-full py-2 bg-white text-dark-950 rounded-lg text-sm font-medium italic">Zum Dashboard</button>
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
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Automatisierter Kundendienst, <br />
              <span className="text-gray-400 text-3xl md:text-5xl">der im Alltag entlastet.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl font-medium text-gray-300 mb-4">
              Ohne IT-Projekt. Ohne laufenden Mehraufwand.
            </motion.p>

            <motion.div variants={itemVariants} className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 space-y-4">
              <p>
                ChatBot Studio erstellt einen KI-Assistenten auf Basis Ihrer bestehenden Website-Inhalte. 
                Standardanfragen werden automatisch beantwortet, konsistent, nachvollziehbar und rund um die Uhr.
              </p>
              <p>
                Der Assistent arbeitet im Hintergrund, reduziert Unterbrechungen im Tagesgeschäft und sorgt dafür, 
                dass Informationen jederzeit korrekt verfügbar sind.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-white text-dark-950 rounded-md font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                Jetzt starten
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-4 glass-button rounded-md font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                Zum Dashboard
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Keine Kreditkarte nötig</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> DSGVO-konform</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> In wenigen Minuten einsatzbereit</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Warum ChatBot Studio */}
        <section className="px-6 lg:px-8 mb-32 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-white">Warum ChatBot Studio</h2>
          <div className="text-lg text-gray-400 space-y-6 leading-relaxed">
            <p>
              Digitale Erreichbarkeit ist heute eine Erwartung, kein Zusatznutzen mehr. 
              Gleichzeitig fehlen in vielen Unternehmen Zeit, Personal oder klare Prozesse, 
              um jede Anfrage manuell zu beantworten.
            </p>
            <p className="text-white font-medium">
              ChatBot Studio schliesst genau diese Lücke.
            </p>
            <p>
              Nicht durch zusätzliche Komplexität, sondern durch eine klare Automatisierung 
              eines wiederkehrenden Problems.
            </p>
          </div>
        </section>

        {/* Funktionsweise */}
        <section id="process" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Funktionsweise</h2>
            <p className="text-gray-400">In drei klaren Schritten zum produktiven Einsatz</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-white/10 tracking-tighter italic">01</div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Link2 className="h-5 w-5 text-indigo-400" /> Quelle definieren
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Sie geben Ihre Unternehmens-Website an. Das System analysiert und indexiert relevante Inhalte automatisch, 
                darunter Texte, Leistungsbeschreibungen und häufige Fragen. Es werden ausschliesslich Inhalte verwendet, 
                die öffentlich auf Ihrer Website verfügbar sind.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-white/10 tracking-tighter italic">02</div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-400" /> Prüfen und steuern
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Vor der Veröffentlichung testen Sie die Antworten in einer Vorschau. Sie legen fest, wie der Assistent formuliert, 
                welche Themen abgedeckt werden und wo bewusst keine Antwort erfolgen soll. So behalten Sie jederzeit die inhaltliche Kontrolle.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-white/10 tracking-tighter italic">03</div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layout className="h-5 w-5 text-indigo-400" /> Integrieren
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Ein einziges JavaScript-Snippet wird in Ihre Website eingefügt. Der Assistent ist sofort aktiv und steht Ihren 
                Besucherinnen und Besuchern zur Verfügung. Keine Systemintegration, kein Umbau Ihrer Website, kein laufender Pflegeaufwand.
              </p>
            </div>
          </div>
        </section>

        {/* Wirtschaftlicher Nutzen */}
        <section id="benefits" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Wirtschaftlicher Nutzen</h2>
            <p className="text-xl text-white font-medium mb-4">Automatisierung mit messbarem Effekt</p>
            <p className="text-gray-400">
              Der Einsatz von KI im Kundenkontakt ist kein Selbstzweck. 
              Der Nutzen entsteht dort, wo Zeit gebunden wird, ohne zusätzlichen Wert zu schaffen.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl">
              <div className="h-12 w-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/20">
                <Users className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Entlastung des Teams</h3>
              <p className="text-gray-400 leading-relaxed">
                Ein grosser Teil der Anfragen betrifft wiederkehrende Themen wie Öffnungszeiten, Leistungen, Preise oder Abläufe. 
                Diese Fragen werden automatisiert beantwortet, bevor sie Mitarbeitende erreichen. Das reduziert Unterbrechungen 
                und schafft Freiraum für wertschöpfende Aufgaben.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 border border-green-500/20">
                <Clock className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verfügbarkeit ohne Zusatzkosten</h3>
              <p className="text-gray-400 leading-relaxed">
                Kundinnen und Kunden erwarten sofortige Antworten, unabhängig von Bürozeiten. Der Assistent ist jederzeit verfügbar, 
                ohne Schichtmodelle oder Bereitschaftsdienste.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
              <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">Konsistente Informationen</h3>
              <p className="text-gray-400 leading-relaxed">
                Alle Antworten basieren auf Ihrer Website. Damit ist sichergestellt, dass Aussagen immer aktuell, einheitlich 
                und nachvollziehbar sind, unabhängig von Tagesform oder Auslastung.
              </p>
            </div>
          </div>
        </section>

        {/* Einsatzbereiche */}
        <section id="use-cases" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="glass-panel rounded-3xl p-8 md:p-12 border border-white/10">
            <h2 className="text-3xl font-bold mb-8 text-center">Typische Einsatzbereiche</h2>
            <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
              ChatBot Studio eignet sich besonders für Unternehmen, die viele ähnliche Anfragen erhalten, zum Beispiel:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                "Dienstleistungsunternehmen mit erklärungsbedürftigen Angeboten",
                "KMU mit begrenzten Support-Ressourcen",
                "Organisationen mit klar definierten Abläufen und Informationen",
                "Unternehmen, die Erreichbarkeit verbessern möchten, ohne Personal aufzubauen"
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-indigo-400" />
                  </div>
                  <span className="text-gray-300 font-medium">{text}</span>
                </div>
              ))}
            </div>
            <p className="text-center mt-12 text-sm text-gray-500 italic">
              Der Assistent ersetzt keine Mitarbeitenden, sondern übernimmt Vorarbeit und Standardfälle.
            </p>
          </div>
        </section>

        {/* Sicherheit & Kontrolle */}
        <section id="security" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Kontrolle und Sicherheit</h2>
              <h3 className="text-xl font-semibold mb-4 text-white">Kontrolle statt Blackbox</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                ChatBot Studio ist so konzipiert, dass Unternehmen jederzeit die Hoheit über Inhalte und Aussagen behalten. 
                Der Assistent nutzt ausschliesslich definierte Quellen, beantwortet keine Fragen ausserhalb dieser Inhalte 
                und gibt bei Unsicherheit keine Vermutungen aus.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" /> Transparenz im Betrieb: vollständige Einsicht in alle Konversationen
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" /> Überblick über häufige Fragen
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" /> Kontrolle darüber, welche Inhalte genutzt werden
                </div>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-2xl border border-white/5 bg-white/5 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-green-400" /> Datenschutz und KI-Transparenz</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Datenschutz ist integraler Bestandteil des Systems.</p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm text-gray-300"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Verarbeitung gemäss DSGVO</li>
                <li className="flex gap-3 text-sm text-gray-300"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Keine Nutzung von Kundendaten zum Training fremder Modelle</li>
                <li className="flex gap-3 text-sm text-gray-300"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Klare Zweckbindung der Daten</li>
                <li className="flex gap-3 text-sm text-gray-300"><Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> Transparente Kennzeichnung als KI-System</li>
              </ul>
              <p className="text-xs text-gray-500 italic">Besucherinnen und Besucher wissen jederzeit, dass sie mit einem automatisierten System kommunizieren.</p>
            </div>
          </div>
        </section>

        {/* Preisgestaltung */}
        <section id="pricing" className="px-6 lg:px-8 mb-32 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Preisgestaltung</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ein Produkt, klare Kosten. Alle Preise inkl. MwSt.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="glass-panel rounded-2xl p-10 border-2 border-indigo-500/50 bg-indigo-500/5">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">ChatBot Studio</h3>
                <p className="text-gray-400">Ihr automatisierter Kundendienst</p>
              </div>

              {/* Preise */}
              <div className="space-y-6 mb-8">
                <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Einmalige Einrichtung</p>
                      <p className="text-xs text-gray-500">Analyse, Konfiguration, Integration</p>
                    </div>
                    <p className="text-2xl font-bold text-white">CHF 537.93</p>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Monatliches Abonnement</p>
                      <p className="text-xs text-gray-500">Betrieb, Wartung, Support</p>
                    </div>
                    <p className="text-2xl font-bold text-white">CHF 105.43</p>
                  </div>
                </div>
              </div>

              {/* Leistungen */}
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Vollständige Einrichtung durch unser Team</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Automatische Beantwortung von Kundenanfragen</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Einfache Einbindung auf Ihrer Website</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Schweizer Datenschutz</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span>Monatlich kündbar</span>
                </li>
              </ul>

              <button
                onClick={handleGetStarted}
                className="w-full py-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 transition-all"
              >
                Jetzt starten
              </button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Keine versteckten Kosten. Keine Mindestlaufzeit.
            </p>
          </div>
        </section>

        {/* Einstieg */}
        <section className="px-6 lg:px-8 mb-16">
          <div className="max-w-5xl mx-auto text-center p-12 md:p-24 glass-panel rounded-3xl border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 pointer-events-none" />
            <h2 className="text-4xl font-bold mb-6 relative z-10">In wenigen Minuten startklar</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Nach der Registrierung führen wir Sie Schritt für Schritt durch den Aufbau Ihres Assistenten. 
              Der erste produktive Einsatz ist in der Regel innerhalb weniger Minuten möglich.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-4 bg-white text-dark-950 rounded-md font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Jetzt starten
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 glass-button rounded-md font-semibold text-white transition-all"
              >
                Zum Dashboard
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-950 py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-6 w-6 text-gray-400" />
              <span className="font-bold text-lg text-white tracking-tight">ChatBot Studio</span>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-6">
              Software für den Mittelstand
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Rechtliches</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-500 font-medium">
              <a href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</a>
              <a href="/impressum" className="hover:text-white transition-colors">Impressum</a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm">Kontakt</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-500 font-medium">
              <a href="mailto:timo.sieber@bbzsogr.ch" className="hover:text-white transition-colors">Kontakt aufnehmen</a>
              <span className="text-xs text-gray-600">© 2025 ChatBot Studio</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
