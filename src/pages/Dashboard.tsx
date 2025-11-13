import { Bot, LogOut, Plus, MessageSquare, BarChart, GraduationCap, Copy, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useMemo, useState } from 'react'
import { createChatbot, deleteChatbot, listChatbots, type Chatbot } from '../lib/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('Mein erster Chatbot')
  const [domains, setDomains] = useState('localhost')
  const [creating, setCreating] = useState(false)
  const [createdBot, setCreatedBot] = useState<Chatbot | null>(null)

  const embedBase = useMemo(() => window.location.origin, [])
  const snippet = useMemo(() => {
    if (!createdBot) return ''
    const cfg = `window.ChatBotConfig = {\n  chatbotId: "${createdBot.id}",\n  baseUrl: "${embedBase}"\n}`
    const src = `${embedBase}/embed.js`
    return `<script>\n${cfg}\n</script>\n<script defer src="${src}"></script>`
  }, [createdBot, embedBase])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listChatbots()
      setChatbots(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)
    try {
      const bot = await createChatbot({
        name,
        allowedDomains: domains.split(',').map((d) => d.trim()).filter(Boolean),
        status: 'ACTIVE',
      })
      setCreatedBot(bot)
      setName('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setCreating(false)
    }
  }

  const onDelete = async (id: string) => {
    setError(null)
    try {
      await deleteChatbot(id)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ChatBot Studio</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">{user?.name || user?.email || 'User'}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm font-medium">Abmelden</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Willkommen zurück, {user?.name || 'Creator'}!</h1>
          <p className="mt-2 text-gray-600">
            Verwalten Sie Ihre Chatbots und überwachen Sie deren Performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktive Chatbots</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <MessageSquare className="h-12 w-12 text-indigo-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nachrichten heute</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <BarChart className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wissensquellen</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <GraduationCap className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/training')}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            <GraduationCap className="h-10 w-10 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Chatbot trainieren</h3>
            <p className="text-indigo-100 text-sm">Website scrapen & Wissen hinzufügen</p>
          </button>
          <button className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all">
            <Plus className="h-10 w-10 text-indigo-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Neuer Chatbot</h3>
            <p className="text-gray-600 text-sm">Chatbot erstellen und konfigurieren</p>
          </button>
          <button className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all">
            <BarChart className="h-10 w-10 text-green-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Analytics</h3>
            <p className="text-gray-600 text-sm">Performance & Statistiken anzeigen</p>
          </button>
        </div>

        {/* Chatbots Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Ihre Chatbots</h2>
              <div className="text-sm text-gray-500">{loading ? 'Lade…' : `${chatbots.length} Bots`}</div>
            </div>
          </div>
          {/* Create Form + List */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={onCreate} className="col-span-1 bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-900 mb-3">Neuen Chatbot erstellen</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Mein Bot" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Erlaubte Domains (Kommagetrennt)</label>
                  <input value={domains} onChange={(e) => setDomains(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="example.com, shop.example.com" />
                  <p className="text-xs text-gray-500 mt-1">Für lokale Tests: localhost</p>
                </div>
                <button disabled={creating} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                  <Plus className="h-4 w-4" />
                  {creating ? 'Erstelle…' : 'Erstellen'}
                </button>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
              {createdBot && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Embed-Snippet</h4>
                  <div className="relative">
                    <pre className="text-xs bg-white border rounded-lg p-3 overflow-auto" style={{ maxHeight: 200 }}><code>{snippet}</code></pre>
                    <button type="button" onClick={() => navigator.clipboard.writeText(snippet)} className="absolute top-2 right-2 inline-flex items-center gap-1 text-xs bg-gray-800 text-white px-2 py-1 rounded">
                      <Copy className="h-3 w-3" /> Kopieren
                    </button>
                  </div>
                </div>
              )}
            </form>
            <div className="col-span-1 lg:col-span-2">
              {chatbots.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border rounded-lg">
                  <Bot className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600">Noch keine Chatbots. Erstellen Sie links Ihren ersten Bot.</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {chatbots.map((b) => (
                    <li key={b.id} className="py-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{b.name}</div>
                        <div className="text-sm text-gray-500">{b.allowedDomains.join(', ')}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setCreatedBot(b) }} className="text-indigo-600 hover:underline text-sm">Snippet</button>
                        <button onClick={() => onDelete(b.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" /> Löschen
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
