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
                Verantwortlich für die Datenverarbeitung im Sinne des Schweizer Datenschutzgesetzes (DSG)
                und der Datenschutz-Grundverordnung (DSGVO) ist:
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                ChatBot Studio<br />
                Timo Sieber<br />
                Schweiz<br />
                E-Mail: <a href="mailto:timo.sieber@bbzsogr.ch" className="text-indigo-400 hover:text-indigo-300">timo.sieber@bbzsogr.ch</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Grundsätze der Datenverarbeitung</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir verarbeiten personenbezogene Daten im Einklang mit dem Schweizer Datenschutzgesetz (DSG,
                in Kraft seit 1. September 2023) und, soweit anwendbar, der EU-Datenschutz-Grundverordnung (DSGVO).
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Personenbezogene Daten werden nur erhoben, wenn dies für die Erbringung unserer Dienste
                erforderlich ist. Wir halten uns an die Grundsätze der Datensparsamkeit und Zweckbindung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Rechtsgrundlagen der Verarbeitung</h2>
              <p className="text-gray-400 leading-relaxed">
                Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf folgenden Rechtsgrundlagen:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
                <li><strong className="text-white">Einwilligung</strong> (Art. 6 Abs. 1 lit. a DSGVO / Art. 31 DSG): Wenn Sie uns Ihre ausdrückliche Zustimmung zur Verarbeitung erteilt haben.</li>
                <li><strong className="text-white">Vertragserfüllung</strong> (Art. 6 Abs. 1 lit. b DSGVO): Wenn die Verarbeitung zur Erfüllung eines Vertrages mit Ihnen erforderlich ist.</li>
                <li><strong className="text-white">Berechtigte Interessen</strong> (Art. 6 Abs. 1 lit. f DSGVO): Wenn wir ein berechtigtes Interesse an der Verarbeitung haben und Ihre Interessen nicht überwiegen.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Chatbot und KI-Verarbeitung</h2>
              <p className="text-gray-400 leading-relaxed">
                <strong className="text-white">Transparenzhinweis:</strong> Auf unserer Plattform und bei unseren Kunden
                kommen KI-gestützte Chatbots zum Einsatz. Bei der Nutzung eines Chatbots interagieren Sie mit
                einem automatisierten System.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Bei der Nutzung des Chatbot-Dienstes werden folgende Daten verarbeitet:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li>Ihre Eingaben und Nachrichten im Chat</li>
                <li>Metadaten (Zeitstempel, Session-Identifikation)</li>
                <li>Technische Zugriffsdaten (IP-Adresse, Browsertyp, Gerätetyp)</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">Zweck der Verarbeitung:</strong> Die Daten werden verarbeitet, um Ihre
                Anfragen zu beantworten und den Chatbot-Dienst bereitzustellen.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">Wichtig:</strong> Ihre Daten werden nicht zum Training von
                KI-Modellen verwendet. Der Chatbot trifft keine eigenständigen Entscheidungen mit rechtlicher
                Wirkung für Sie.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Kategorien verarbeiteter Daten</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir verarbeiten folgende Kategorien personenbezogener Daten:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li><strong className="text-white">Stammdaten:</strong> Name, E-Mail-Adresse (bei Registrierung)</li>
                <li><strong className="text-white">Nutzungsdaten:</strong> Chatverläufe, Interaktionen mit dem Dienst</li>
                <li><strong className="text-white">Technische Daten:</strong> IP-Adresse, Browsertyp, Betriebssystem, Zugriffszeiten</li>
                <li><strong className="text-white">Kommunikationsdaten:</strong> Anfragen per E-Mail oder Kontaktformular</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Speicherdauer</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir speichern Ihre personenbezogenen Daten nur so lange, wie dies für die jeweiligen
                Verarbeitungszwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li><strong className="text-white">Chatverläufe:</strong> 90 Tage, sofern nicht anders vereinbart</li>
                <li><strong className="text-white">Vertragsdaten:</strong> 10 Jahre (gesetzliche Aufbewahrungspflicht)</li>
                <li><strong className="text-white">Technische Logs:</strong> 30 Tage</li>
                <li><strong className="text-white">Kontoanfragen:</strong> Bis zur Erledigung, maximal 2 Jahre</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Datenspeicherung und Serverstandort</h2>
              <p className="text-gray-400 leading-relaxed">
                Die Verarbeitung und Speicherung Ihrer Daten erfolgt auf Servern in der Schweiz und/oder
                im Europäischen Wirtschaftsraum (EWR). Wir setzen technische und organisatorische
                Massnahmen ein, um Ihre Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Dazu gehören insbesondere:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li>SSL/TLS-Verschlüsselung der Datenübertragung</li>
                <li>Zugangskontrolle und Authentifizierung</li>
                <li>Regelmässige Sicherheitsüberprüfungen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">8. Datenübermittlung ins Ausland</h2>
              <p className="text-gray-400 leading-relaxed">
                Grundsätzlich werden Ihre Daten in der Schweiz oder im EWR verarbeitet. Sollte eine
                Übermittlung in Drittländer erforderlich sein (z.B. bei Nutzung von Cloud-Diensten),
                stellen wir durch geeignete Garantien ein angemessenes Datenschutzniveau sicher:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li>Angemessenheitsbeschluss des Bundesrates bzw. der EU-Kommission</li>
                <li>EU-Standardvertragsklauseln (SCC)</li>
                <li>Swiss-U.S. Data Privacy Framework (für zertifizierte US-Unternehmen)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">9. Weitergabe an Dritte</h2>
              <p className="text-gray-400 leading-relaxed">
                Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nur in folgenden Fällen:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                <li>Wenn dies zur Vertragserfüllung erforderlich ist</li>
                <li>Wenn Sie ausdrücklich eingewilligt haben</li>
                <li>Wenn wir gesetzlich dazu verpflichtet sind</li>
                <li>An Auftragsverarbeiter, die in unserem Auftrag Daten verarbeiten (z.B. Hosting-Anbieter)</li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                Mit allen Auftragsverarbeitern haben wir Verträge abgeschlossen, die den Anforderungen
                des DSG und der DSGVO entsprechen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">10. Cookies</h2>
              <p className="text-gray-400 leading-relaxed">
                Diese Website verwendet technisch notwendige Cookies, die für den Betrieb der
                Website und die Authentifizierung erforderlich sind. Es werden keine Tracking-Cookies
                oder Cookies zu Werbezwecken eingesetzt.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Sie können Cookies in Ihren Browsereinstellungen jederzeit löschen oder blockieren.
                Beachten Sie, dass dies die Funktionalität der Website einschränken kann.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">11. Ihre Rechte</h2>
              <p className="text-gray-400 leading-relaxed">
                Nach dem Schweizer Datenschutzgesetz (DSG) und der DSGVO stehen Ihnen folgende Rechte zu:
              </p>
              <ul className="list-disc list-inside text-gray-400 mt-4 space-y-3">
                <li>
                  <strong className="text-white">Auskunftsrecht (Art. 25 DSG):</strong> Sie können jederzeit
                  unentgeltlich Auskunft darüber verlangen, ob und welche personenbezogenen Daten wir über
                  Sie verarbeiten, den Bearbeitungszweck, die Aufbewahrungsdauer und die Herkunft der Daten.
                </li>
                <li>
                  <strong className="text-white">Recht auf Berichtigung (Art. 32 DSG):</strong> Sie können
                  die Berichtigung unrichtiger personenbezogener Daten verlangen.
                </li>
                <li>
                  <strong className="text-white">Recht auf Löschung:</strong> Sie können die Löschung Ihrer
                  Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
                </li>
                <li>
                  <strong className="text-white">Recht auf Einschränkung:</strong> Sie können die Einschränkung
                  der Verarbeitung Ihrer Daten verlangen.
                </li>
                <li>
                  <strong className="text-white">Recht auf Datenübertragbarkeit (Art. 28 DSG):</strong> Sie
                  können verlangen, dass wir Ihnen Ihre Daten in einem gängigen elektronischen Format
                  herausgeben.
                </li>
                <li>
                  <strong className="text-white">Widerrufsrecht:</strong> Eine erteilte Einwilligung können
                  Sie jederzeit mit Wirkung für die Zukunft widerrufen.
                </li>
              </ul>
              <p className="text-gray-400 leading-relaxed mt-4">
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter: <a href="mailto:timo.sieber@bbzsogr.ch" className="text-indigo-400 hover:text-indigo-300">timo.sieber@bbzsogr.ch</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">12. Beschwerderecht</h2>
              <p className="text-gray-400 leading-relaxed">
                Sie haben das Recht, sich bei der zuständigen Datenschutzbehörde zu beschweren:
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong className="text-white">Schweiz:</strong><br />
                Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)<br />
                Feldeggweg 1<br />
                3003 Bern<br />
                <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">www.edoeb.admin.ch</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">13. Automatisierte Entscheidungsfindung</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir setzen keine automatisierte Entscheidungsfindung oder Profiling ein, die rechtliche
                Wirkung für Sie entfaltet oder Sie in ähnlicher Weise erheblich beeinträchtigt.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Der Chatbot generiert automatisierte Antworten auf Basis Ihrer Eingaben, diese dienen
                jedoch ausschliesslich der Information und haben keine rechtliche Bindungswirkung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">14. Änderungen dieser Datenschutzerklärung</h2>
              <p className="text-gray-400 leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an
                geänderte rechtliche Anforderungen oder Änderungen unserer Dienste anzupassen.
                Die aktuelle Version ist stets auf dieser Seite abrufbar.
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
