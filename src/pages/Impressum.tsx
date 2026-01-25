import { Bot, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Impressum() {
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
          <h1 className="text-4xl font-bold mb-8">Impressum</h1>

          <div className="prose prose-invert prose-gray max-w-none space-y-8">

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Angaben gemäss Art. 3 UWG und Art. 19 DSG</h2>
              <p className="text-gray-400 leading-relaxed">
                <strong className="text-white">ChatBot Studio</strong><br />
                Timo Sieber<br />
                Schweiz
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Kontakt</h2>
              <p className="text-gray-400 leading-relaxed">
                E-Mail: <a href="mailto:timo.sieber@bbzsogr.ch" className="text-indigo-400 hover:text-indigo-300">timo.sieber@bbzsogr.ch</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Verantwortlich für den Inhalt</h2>
              <p className="text-gray-400 leading-relaxed">
                Timo Sieber<br />
                E-Mail: <a href="mailto:timo.sieber@bbzsogr.ch" className="text-indigo-400 hover:text-indigo-300">timo.sieber@bbzsogr.ch</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Vertretungsberechtigte Person</h2>
              <p className="text-gray-400 leading-relaxed">
                Timo Sieber (Inhaber)
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Art der angebotenen Dienstleistungen</h2>
              <p className="text-gray-400 leading-relaxed">
                ChatBot Studio bietet Software-as-a-Service (SaaS) Lösungen im Bereich automatisierter
                Kundenkommunikation mittels KI-gestützter Chatbots für Unternehmen an.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Haftungsausschluss</h2>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">Haftung für Inhalte</h3>
              <p className="text-gray-400 leading-relaxed">
                Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität,
                Zuverlässigkeit und Vollständigkeit der Informationen auf dieser Website.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art,
                die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten
                Informationen, durch Missbrauch der Verbindung oder durch technische Störungen
                entstanden sind, werden ausgeschlossen.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">Haftung für Links</h3>
              <p className="text-gray-400 leading-relaxed">
                Verweise und Links auf Websites Dritter liegen ausserhalb unseres Verantwortungsbereichs.
                Es wird jegliche Verantwortung für solche Websites abgelehnt. Der Zugriff und die Nutzung
                solcher Websites erfolgen auf eigene Gefahr des Nutzers.
              </p>

              <h3 className="text-lg font-medium text-white mt-6 mb-3">Haftung für Chatbot-Antworten</h3>
              <p className="text-gray-400 leading-relaxed">
                Die von unseren Chatbot-Systemen generierten Antworten dienen ausschliesslich zu
                Informationszwecken. Sie stellen keine rechtliche, medizinische oder sonstige
                professionelle Beratung dar. Für die Richtigkeit und Vollständigkeit der automatisch
                generierten Antworten übernehmen wir keine Gewähr. Im Zweifelsfall ist stets eine
                Fachperson zu konsultieren.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Urheberrechte</h2>
              <p className="text-gray-400 leading-relaxed">
                Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos, Software oder anderen
                Dateien auf dieser Website gehören ausschliesslich ChatBot Studio oder den speziell
                genannten Rechteinhabern.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung des
                Urheberrechtsträgers im Voraus einzuholen. Jede unerlaubte Nutzung kann zivil- und
                strafrechtliche Folgen haben.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Datenschutz</h2>
              <p className="text-gray-400 leading-relaxed">
                Informationen zur Verarbeitung personenbezogener Daten finden Sie in unserer{' '}
                <a href="/datenschutz" className="text-indigo-400 hover:text-indigo-300">Datenschutzerklärung</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Streitbeilegung</h2>
              <p className="text-gray-400 leading-relaxed">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Anwendbares Recht und Gerichtsstand</h2>
              <p className="text-gray-400 leading-relaxed">
                Für sämtliche Rechtsbeziehungen zwischen ChatBot Studio und den Nutzern gilt
                ausschliesslich schweizerisches Recht unter Ausschluss des Kollisionsrechts und
                des UN-Kaufrechts.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Ausschliesslicher Gerichtsstand ist der Sitz von ChatBot Studio in der Schweiz,
                soweit gesetzlich zulässig.
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
