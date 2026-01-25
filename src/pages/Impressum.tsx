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
              <h2 className="text-xl font-semibold text-white mb-4">Angaben gemäss Schweizer Recht</h2>
              <p className="text-gray-400 leading-relaxed">
                ChatBot Studio<br />
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
                Timo Sieber
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Haftungsausschluss</h2>
              <p className="text-gray-400 leading-relaxed">
                Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität,
                Zuverlässigkeit und Vollständigkeit der Informationen.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art,
                die aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten
                Informationen, durch Missbrauch der Verbindung oder durch technische Störungen
                entstanden sind, werden ausgeschlossen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Urheberrechte</h2>
              <p className="text-gray-400 leading-relaxed">
                Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen
                Dateien auf dieser Website gehören ausschliesslich ChatBot Studio oder den
                speziell genannten Rechteinhabern. Für die Reproduktion jeglicher Elemente
                ist die schriftliche Zustimmung des Urheberrechtsträgers im Voraus einzuholen.
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
