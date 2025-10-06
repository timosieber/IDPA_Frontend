import { useState } from 'react'
import { Bot, MessageSquare, Zap, Shield, CheckCircle, ArrowRight, Users, Sparkles, Code, Globe, BarChart3, Settings } from 'lucide-react'
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
          <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">So funktioniert's</a>
          <a href="#use-cases" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">Anwendungsfälle</a>
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
        {/* Hero Section */}
        <section className="relative px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600">KI-gestützte Chatbot-Plattform</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              Erstellen Sie intelligente
              <span className="block text-indigo-600">AI-Chatbots in Minuten</span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-gray-600 max-w-2xl mx-auto">
              Revolutionieren Sie Ihre Kundenkommunikation mit maßgeschneiderten KI-Chatbots. 
              Keine Programmierkenntnisse erforderlich – einfach konfigurieren, trainieren und deployen.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
              <button 
                onClick={handleGetStarted}
                className="bg-indigo-600 px-8 py-4 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2"
              >
                Kostenlos starten
                <ArrowRight className="h-5 w-5" />
              </button>
              <a 
                href="#how-it-works"
                className="px-8 py-4 text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors flex items-center gap-2"
              >
                Mehr erfahren
                <span aria-hidden="true">↓</span>
              </a>
            </div>
            
            {/* Stats */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">5 Min</div>
                <div className="mt-2 text-sm text-gray-600">Bis zum ersten Chatbot</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">24/7</div>
                <div className="mt-2 text-sm text-gray-600">Automatische Unterstützung</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">∞</div>
                <div className="mt-2 text-sm text-gray-600">Unbegrenzte Möglichkeiten</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">So funktioniert's</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                In 4 einfachen Schritten zum eigenen Chatbot
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Von der Anmeldung bis zum Deploy – wir begleiten Sie durch den gesamten Prozess
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Kostenlos registrieren</h3>
                    <p className="text-gray-600 mb-4">
                      Erstellen Sie Ihr Konto in wenigen Sekunden – per E-Mail oder mit Ihrem Google-Account. 
                      Keine Kreditkarte erforderlich, keine versteckten Kosten.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                        <CheckCircle className="h-4 w-4" />
                        In 30 Sekunden fertig
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Keine Zahlungsdaten nötig
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Chatbot erstellen & konfigurieren</h3>
                    <p className="text-gray-600 mb-4">
                      Nutzen Sie unseren intuitiven Editor, um Ihren Chatbot zu gestalten. Definieren Sie 
                      Persönlichkeit, Antworten und Verhalten – alles ohne eine Zeile Code zu schreiben.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                        <Settings className="h-4 w-4" />
                        Drag & Drop Interface
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                        <Code className="h-4 w-4" />
                        Keine Programmierkenntnisse
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">KI trainieren & optimieren</h3>
                    <p className="text-gray-600 mb-4">
                      Geben Sie einfach die URL Ihrer Website ein und unser System scrapt automatisch alle Inhalte. 
                      Alternativ können Sie auch manuell Dokumente hochladen (PDFs, FAQ, etc.). Die KI lernt 
                      automatisch aus allen Quellen und verbessert sich mit jeder Interaktion.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        <Globe className="h-4 w-4" />
                        Automatisches Website-Scraping
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        <Sparkles className="h-4 w-4" />
                        Intelligentes Lernen
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                        <BarChart3 className="h-4 w-4" />
                        Kontinuierliche Verbesserung
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Deployen & live gehen</h3>
                    <p className="text-gray-600 mb-4">
                      Integrieren Sie Ihren Chatbot mit einem einfachen Code-Snippet auf Ihrer Website, 
                      oder nutzen Sie unsere API für individuelle Lösungen. Fertig!
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm">
                        <Globe className="h-4 w-4" />
                        Überall einsetzbar
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm">
                        <Zap className="h-4 w-4" />
                        In Sekunden live
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Leistungsstarke Features</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Alles, was Sie für erfolgreiche Chatbots brauchen
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Professionelle Tools und Features, die Ihren Chatbot zum Erfolg führen
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col bg-gray-50 p-6 rounded-xl">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    Intelligente Konversationen
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Trainieren Sie Ihren Chatbot mit eigenen Daten und erstellen Sie natürliche, 
                      kontextbewusste Gespräche, die sich menschlich anfühlen. Unterstützt mehrere Sprachen 
                      und versteht komplexe Anfragen.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col bg-gray-50 p-6 rounded-xl">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    Blitzschnelles Setup
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Von der Anmeldung zum fertigen Chatbot in unter 5 Minuten. Keine technischen 
                      Vorkenntnisse nötig – unser intuitiver Drag-and-Drop-Editor macht es kinderleicht.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col bg-gray-50 p-6 rounded-xl">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    Enterprise-Sicherheit
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Ihre Daten sind mit modernster Verschlüsselung und Enterprise-Sicherheitsprotokollen 
                      geschützt. DSGVO-konform und auf europäischen Servern gehostet.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col bg-gray-50 p-6 rounded-xl">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    Detaillierte Analytics
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Verstehen Sie Ihre Nutzer besser mit umfangreichen Analysen. Sehen Sie, welche Fragen 
                      am häufigsten gestellt werden und optimieren Sie kontinuierlich.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col bg-gray-50 p-6 rounded-xl">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    Überall einsetzbar
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Integrieren Sie Ihren Chatbot auf jeder Website, in Apps oder über API. 
                      Responsive Design sorgt für perfekte Darstellung auf allen Geräten.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col bg-gray-50 p-6 rounded-xl">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    Team-Kollaboration
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Arbeiten Sie gemeinsam im Team an Ihren Chatbots. Rollen und Berechtigungen 
                      ermöglichen sichere Zusammenarbeit mit Kollegen.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">Anwendungsfälle</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Für jedes Unternehmen die richtige Lösung
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Kundensupport</h3>
                <p className="text-gray-600">
                  Beantworten Sie häufige Kundenfragen automatisch 24/7. Reduzieren Sie Support-Tickets 
                  und entlasten Sie Ihr Team, während Kunden sofortige Hilfe erhalten.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lead-Generierung</h3>
                <p className="text-gray-600">
                  Qualifizieren Sie Leads automatisch und sammeln Sie wichtige Informationen. 
                  Steigern Sie Ihre Conversion-Rate durch personalisierte Gespräche.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">E-Commerce</h3>
                <p className="text-gray-600">
                  Helfen Sie Kunden, die richtigen Produkte zu finden. Produktempfehlungen, 
                  Bestellstatus-Tracking und mehr – alles automatisiert.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Interne Prozesse</h3>
                <p className="text-gray-600">
                  Automatisieren Sie interne Anfragen wie IT-Support, HR-Fragen oder 
                  Urlaubsanträge. Steigern Sie die Effizienz Ihrer Teams.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mehrsprachiger Support</h3>
                <p className="text-gray-600">
                  Bedienen Sie Kunden weltweit in ihrer Muttersprache. Automatische 
                  Übersetzung und kulturell angepasste Antworten.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalisierung</h3>
                <p className="text-gray-600">
                  Erstellen Sie individuelle Kundenerlebnisse basierend auf Verhalten, 
                  Präferenzen und vergangenen Interaktionen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials / Social Proof */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Vertrauen Sie auf bewährte Technologie
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                Unternehmen weltweit vertrauen auf ChatBot Studio
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
              <div className="text-4xl font-bold text-gray-400">99.9%</div>
              <div className="text-4xl font-bold text-gray-400">Uptime</div>
              <div className="text-4xl font-bold text-gray-400">DSGVO</div>
              <div className="text-4xl font-bold text-gray-400">24/7</div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Die Einrichtung war unglaublich einfach. Innerhalb von 10 Minuten hatte ich 
                  meinen ersten Chatbot live auf unserer Website!"
                </p>
                <p className="text-sm font-semibold text-gray-900">- Marketing Manager, Tech Startup</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Unser Kundensupport wurde um 40% entlastet. Die KI versteht die Anfragen 
                  erstaunlich gut und liefert präzise Antworten."
                </p>
                <p className="text-sm font-semibold text-gray-900">- Support Lead, E-Commerce</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Endlich eine Lösung, die wirklich keine Programmierkenntnisse erfordert. 
                  Unser gesamtes Team kann jetzt Chatbots erstellen."
                </p>
                <p className="text-sm font-semibold text-gray-900">- Operations Director, SaaS</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Bereit, Ihre Kundenkommunikation zu revolutionieren?
              </h2>
              <p className="mt-6 text-xl leading-8 text-indigo-100">
                Schließen Sie sich tausenden von Unternehmen an, die bereits auf ChatBot Studio 
                vertrauen, um außergewöhnliche Kundenerlebnisse zu schaffen.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 flex-wrap gap-y-4">
                <button 
                  onClick={handleGetStarted}
                  className="bg-white px-8 py-4 text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-xl flex items-center gap-2"
                >
                  Kostenlos starten
                  <ArrowRight className="h-5 w-5" />
                </button>
                <a 
                  href="#how-it-works"
                  className="px-8 py-4 text-lg font-semibold text-white hover:text-indigo-100 transition-colors"
                >
                  Mehr erfahren
                </a>
              </div>
              <p className="mt-6 text-sm text-indigo-200">
                Keine Kreditkarte erforderlich • Jederzeit kündbar • DSGVO-konform
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <Bot className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold text-white">ChatBot Studio</span>
              </div>
              <p className="text-gray-400 text-sm">
                Die moderne Plattform für intelligente KI-Chatbots. 
                Einfach, leistungsstark, DSGVO-konform.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">Produkt</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">So funktioniert's</a></li>
                <li><a href="#use-cases" className="text-gray-400 hover:text-white transition-colors">Anwendungsfälle</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Preise</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Unternehmen</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Über uns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Karriere</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kontakt</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Rechtliches</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Datenschutz</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Impressum</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AGB</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">DSGVO</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2025 ChatBot Studio. Alle Rechte vorbehalten.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
