import { Bot, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Datenschutz() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Hintergrund-Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-dark-950/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">ChatBot Studio</span>
          </a>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </button>
        </div>
      </header>

      <main className="relative py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Datenschutzerklärung</h1>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Verantwortliche Stelle</h2>
              <p className="text-gray-400 leading-relaxed">
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p className="text-gray-400 leading-relaxed mt-2">
                ChatBot Studio<br />
                Timo Sieber<br />
                E-Mail: timo.sieber@bbzsogr.ch
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Erhebung und Verarbeitung von Daten</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung
                unserer Dienste erforderlich ist. Die Verarbeitung erfolgt auf Grundlage der gesetzlichen
                Bestimmungen (DSGVO, DSG).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Nutzungsdaten</h2>
              <p className="text-gray-400 leading-relaxed">
                Bei der Nutzung unseres Chatbot-Dienstes werden folgende Daten verarbeitet:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li>Chatverläufe und Anfragen an den Chatbot</li>
                <li>Technische Zugriffsdaten (IP-Adresse, Browsertyp, Zugriffszeit)</li>
                <li>Nutzungsstatistiken in anonymisierter Form</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Datenspeicherung</h2>
              <p className="text-gray-400 leading-relaxed">
                Die Daten werden auf Servern in der Schweiz bzw. im europäischen Wirtschaftsraum gespeichert.
                Wir setzen technische und organisatorische Massnahmen ein, um Ihre Daten vor unbefugtem
                Zugriff zu schützen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Weitergabe von Daten</h2>
              <p className="text-gray-400 leading-relaxed">
                Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, wenn dies zur Vertragserfüllung
                erforderlich ist oder Sie ausdrücklich eingewilligt haben. Ihre Daten werden nicht
                zum Training von Sprachmodellen verwendet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Ihre Rechte</h2>
              <p className="text-gray-400 leading-relaxed">
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
                Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren Sie uns hierzu unter
                der oben genannten E-Mail-Adresse.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Cookies</h2>
              <p className="text-gray-400 leading-relaxed">
                Diese Website verwendet technisch notwendige Cookies, die für den Betrieb der
                Website erforderlich sind. Es werden keine Tracking-Cookies oder Cookies zu
                Werbezwecken eingesetzt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Änderungen</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie
                an geänderte rechtliche Anforderungen oder Änderungen unserer Dienste anzupassen.
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-12">
              Stand: Januar 2025
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-950 py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">© 2025 ChatBot Studio</p>
        </div>
      </footer>
    </div>
  )
}
