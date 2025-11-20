import { Bot, LogOut, Plus, MessageSquare, BarChart, GraduationCap, Copy, Trash2, Globe, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useMemo, useState } from 'react'
import { createChatbot, deleteChatbot, listChatbots, scrapeWebsite, listKnowledgeSources, type Chatbot, type KnowledgeSource } from '../lib/api'

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
  const [success, setSuccess] = useState<string | null>(null)

  // Create Chatbot Flow
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [step, setStep] = useState<'details' | 'scraping' | 'done'>('details')
  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [creating, setCreating] = useState(false)
  const [scraping, setScraping] = useState(false)
  const [newChatbot, setNewChatbot] = useState<Chatbot | null>(null)
  const [scrapeResult, setScrapeResult] = useState<{ sources: number; pages: number } | null>(null)

  // Selected Chatbot Details
  const [selectedBot, setSelectedBot] = useState<Chatbot | null>(null)
  const [botSources, setBotSources] = useState<KnowledgeSource[]>([])
  const [loadingSources, setLoadingSources] = useState(false)

  const embedBase = useMemo(() => window.location.origin, [])
  const snippet = useMemo(() => {
    if (!selectedBot) return ''
    const cfg = `window.ChatBotConfig = {\n  chatbotId: "${selectedBot.id}",\n  baseUrl: "${embedBase}"\n}`
    const src = `${embedBase}/embed.js`
    return `<script>\n${cfg}\n</script>\n<script defer src="${src}"></script>`
  }, [selectedBot, embedBase])

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

  const loadBotSources = async (chatbotId: string) => {
    setLoadingSources(true)
    try {
      const sources = await listKnowledgeSources(chatbotId)
      setBotSources(sources)
    } catch (e) {
      console.error('Fehler beim Laden der Quellen:', e)
    } finally {
      setLoadingSources(false)
    }
  }

  useEffect(() => {
    if (selectedBot) {
      loadBotSources(selectedBot.id)
    }
  }, [selectedBot])

  const handleCreateClick = () => {
    setShowCreateModal(true)
    setStep('details')
    setName('')
    setWebsiteUrl('')
    setNewChatbot(null)
    setScrapeResult(null)
    setError(null)
    setSuccess(null)
  }

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)
    try {
      const bot = await createChatbot({
        name,
        allowedDomains: [], // Keine Einschränkung, alle Domains erlaubt
        status: 'ACTIVE',
      })
      setNewChatbot(bot)
      setStep('scraping')
      setSuccess(`Chatbot "${bot.name}" erfolgreich erstellt!`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    } finally {
      setCreating(false)
    }
  }

  const handleScrapeWebsite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChatbot) return
    setScraping(true)
    setError(null)
    try {
      const result = await scrapeWebsite({
        chatbotId: newChatbot.id,
        startUrls: [websiteUrl],
        maxDepth: 2,
        maxPages: 50,
      })
      setScrapeResult({ sources: result.sources.length, pages: result.pagesScanned })
      setStep('done')
      setSuccess(`${result.pagesScanned} Seiten gescraped, ${result.sources.length} Wissensquellen erstellt!`)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scraping fehlgeschlagen')
    } finally {
      setScraping(false)
    }
  }

  const handleSkipScraping = () => {
    setStep('done')
    load()
  }

  const handleFinish = () => {
    setShowCreateModal(false)
    setSelectedBot(newChatbot)
    setNewChatbot(null)
  }

  const onDelete = async (id: string) => {
    if (!confirm('Chatbot wirklich löschen?')) return
    setError(null)
    try {
      await deleteChatbot(id)
      if (selectedBot?.id === id) setSelectedBot(null)
      await load()
      setSuccess('Chatbot gelöscht')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler')
    }
  }

  const activeBots = chatbots.filter(b => b.status === 'ACTIVE').length
  const totalSources = chatbots.reduce((sum, _) => sum + 0, 0) // TODO: real count

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

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">×</button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">×</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aktive Chatbots</p>
                <p className="text-3xl font-bold text-gray-900">{activeBots}</p>
              </div>
              <MessageSquare className="h-12 w-12 text-indigo-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gesamt Chatbots</p>
                <p className="text-3xl font-bold text-gray-900">{chatbots.length}</p>
              </div>
              <Bot className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wissensquellen</p>
                <p className="text-3xl font-bold text-gray-900">{totalSources}</p>
              </div>
              <GraduationCap className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={handleCreateClick}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            <Plus className="h-10 w-10 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Neuer Chatbot</h3>
            <p className="text-indigo-100 text-sm">Chatbot erstellen & Website scrapen</p>
          </button>
          <button
            onClick={() => navigate('/training')}
            className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all"
          >
            <GraduationCap className="h-10 w-10 text-indigo-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Training</h3>
            <p className="text-gray-600 text-sm">Wissen hinzufügen & verwalten</p>
          </button>
          <button className="bg-white border-2 border-gray-200 p-6 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all">
            <BarChart className="h-10 w-10 text-green-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Analytics</h3>
            <p className="text-gray-600 text-sm">Performance & Statistiken</p>
          </button>
        </div>

        {/* Chatbots Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chatbot List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Ihre Chatbots</h2>
                <div className="text-sm text-gray-500">{loading ? 'Lade…' : `${chatbots.length} Bots`}</div>
              </div>
            </div>
            <div className="p-6">
              {chatbots.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Noch keine Chatbots vorhanden</p>
                  <button
                    onClick={handleCreateClick}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Ersten Chatbot erstellen
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {chatbots.map((bot) => (
                    <li
                      key={bot.id}
                      className={`py-4 px-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedBot?.id === bot.id ? 'bg-indigo-50 border-2 border-indigo-200' : ''
                      }`}
                      onClick={() => setSelectedBot(bot)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="font-medium text-gray-900">{bot.name}</div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              bot.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              bot.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {bot.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <Globe className="inline h-3 w-3 mr-1" />
                            {bot.allowedDomains.length > 0 ? bot.allowedDomains.join(', ') : 'Keine Domains'}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(bot.id) }}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Details Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Details</h2>
            </div>
            <div className="p-6">
              {!selectedBot ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>Wählen Sie einen Chatbot aus</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{selectedBot.name}</h3>
                    <p className="text-sm text-gray-600">ID: {selectedBot.id}</p>
                    <p className="text-sm text-gray-600 mt-1">Erstellt: {new Date(selectedBot.createdAt).toLocaleDateString('de-DE')}</p>
                  </div>

                  {/* Knowledge Sources */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Wissensquellen</h4>
                    {loadingSources ? (
                      <p className="text-sm text-gray-500">Lade...</p>
                    ) : botSources.length === 0 ? (
                      <p className="text-sm text-gray-500">Keine Quellen vorhanden</p>
                    ) : (
                      <ul className="space-y-2">
                        {botSources.map((source) => (
                          <li key={source.id} className="text-sm flex items-center gap-2">
                            {source.status === 'READY' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {source.status === 'PENDING' && <Clock className="h-4 w-4 text-yellow-600" />}
                            {source.status === 'FAILED' && <XCircle className="h-4 w-4 text-red-600" />}
                            <span className="truncate">{source.label}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Embed Snippet */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Embed-Code</h4>
                    <div className="relative">
                      <pre className="text-xs bg-gray-900 text-gray-100 rounded-lg p-3 overflow-auto max-h-48">
                        <code>{snippet}</code>
                      </pre>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(snippet)
                          setSuccess('Code kopiert!')
                        }}
                        className="absolute top-2 right-2 inline-flex items-center gap-1 text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                      >
                        <Copy className="h-3 w-3" /> Kopieren
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {step === 'details' && 'Chatbot erstellen'}
                {step === 'scraping' && 'Website scrapen'}
                {step === 'done' && 'Fertig!'}
              </h2>
            </div>
            <div className="p-6">
              {/* Step 1: Details */}
              {step === 'details' && (
                <form onSubmit={handleStepOne} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chatbot Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="z.B. Kundenservice Bot"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {creating ? 'Erstelle...' : 'Weiter'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Scraping */}
              {step === 'scraping' && (
                <form onSubmit={handleScrapeWebsite} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Geben Sie die Unternehmenswebsite ein, um automatisch Inhalte zu scrapen und den Chatbot zu trainieren.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://www.beispiel.com"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Bis zu 50 Seiten werden gescraped</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSkipScraping}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Überspringen
                    </button>
                    <button
                      type="submit"
                      disabled={scraping}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {scraping ? 'Scrape läuft...' : 'Website scrapen'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Done */}
              {step === 'done' && (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chatbot erstellt!</h3>
                    {scrapeResult && (
                      <p className="text-sm text-gray-600">
                        {scrapeResult.pages} Seiten gescraped, {scrapeResult.sources} Wissensquellen erstellt
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleFinish}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Fertig
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
