import { Bot, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Nutzungsbedingungen() {
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
          <h1 className="text-4xl font-bold mb-8">Nutzungsbedingungen</h1>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Geltungsbereich</h2>
              <p className="text-gray-400 leading-relaxed">
                Diese Nutzungsbedingungen gelten für die Nutzung der Dienste von ChatBot Studio.
                Mit der Registrierung und Nutzung unserer Dienste akzeptieren Sie diese Bedingungen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Leistungsbeschreibung</h2>
              <p className="text-gray-400 leading-relaxed">
                ChatBot Studio bietet einen automatisierten Chatbot-Dienst für Unternehmen an.
                Der Dienst umfasst:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li>Einrichtung und Konfiguration des Chatbots</li>
                <li>Hosting und Betrieb des Dienstes</li>
                <li>Technischer Support</li>
                <li>Integration auf der Kundenwebsite</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Vertragsschluss und Preise</h2>
              <p className="text-gray-400 leading-relaxed">
                Der Vertrag kommt mit der Registrierung und Bestätigung durch ChatBot Studio zustande.
                Die aktuellen Preise sind auf der Website ersichtlich. Alle Preise verstehen sich
                inklusive der gesetzlichen Mehrwertsteuer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Zahlungsbedingungen</h2>
              <p className="text-gray-400 leading-relaxed">
                Die einmalige Einrichtungsgebühr ist bei Vertragsabschluss fällig. Das monatliche
                Abonnement wird jeweils zu Beginn des Abrechnungszeitraums in Rechnung gestellt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Kündigung</h2>
              <p className="text-gray-400 leading-relaxed">
                Das Abonnement kann jederzeit zum Ende des laufenden Abrechnungsmonats gekündigt
                werden. Die Kündigung kann per E-Mail erfolgen. Bereits bezahlte Gebühren werden
                nicht erstattet.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Pflichten des Nutzers</h2>
              <p className="text-gray-400 leading-relaxed">
                Der Nutzer verpflichtet sich:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li>Den Dienst nicht für rechtswidrige Zwecke zu nutzen</li>
                <li>Keine irreführenden oder falschen Informationen zu verbreiten</li>
                <li>Die Zugangsdaten vertraulich zu behandeln</li>
                <li>Keine automatisierten Massenanfragen zu generieren</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Haftung</h2>
              <p className="text-gray-400 leading-relaxed">
                ChatBot Studio haftet nicht für die inhaltliche Richtigkeit der vom Chatbot
                generierten Antworten. Der Nutzer ist für die Überprüfung und Freigabe der
                Inhalte selbst verantwortlich. Die Haftung für leichte Fahrlässigkeit ist
                ausgeschlossen, soweit gesetzlich zulässig.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Verfügbarkeit</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir bemühen uns um eine hohe Verfügbarkeit des Dienstes, können jedoch keine
                ununterbrochene Verfügbarkeit garantieren. Wartungsarbeiten werden nach
                Möglichkeit angekündigt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Änderungen</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir behalten uns vor, diese Nutzungsbedingungen zu ändern. Wesentliche
                Änderungen werden den Nutzern mitgeteilt. Die weitere Nutzung nach
                Inkrafttreten der Änderungen gilt als Zustimmung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Anwendbares Recht</h2>
              <p className="text-gray-400 leading-relaxed">
                Es gilt Schweizer Recht. Gerichtsstand ist der Sitz von ChatBot Studio.
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
