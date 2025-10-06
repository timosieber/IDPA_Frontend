import { Globe, Plus, Trash2, RefreshCw, FileText, Link2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface KnowledgeSource {
  id: string
  type: 'url' | 'text' | 'file'
  content: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  createdAt: Date
  lastUpdated: Date
  pageCount?: number
  errorMessage?: string
}

export default function ChatbotTraining() {
  const [url, setUrl] = useState('')
  const [manualText, setManualText] = useState('')
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'file'>('url')
  const [sources, setSources] = useState<KnowledgeSource[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleScrapeWebsite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setIsLoading(true)
    
    const newSource: KnowledgeSource = {
      id: Date.now().toString(),
      type: 'url',
      content: url,
      status: 'processing',
      createdAt: new Date(),
      lastUpdated: new Date()
    }

    setSources([newSource, ...sources])
    setUrl('')

    // TODO: API call to scrape website
    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.id === newSource.id 
          ? { ...s, status: 'completed', pageCount: 15 }
          : s
      ))
      setIsLoading(false)
    }, 2000)
  }

  const handleAddManualText = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualText) return

    setIsLoading(true)
    
    const newSource: KnowledgeSource = {
      id: Date.now().toString(),
      type: 'text',
      content: manualText,
      status: 'completed',
      createdAt: new Date(),
      lastUpdated: new Date()
    }

    setSources([newSource, ...sources])
    setManualText('')
    setIsLoading(false)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    
    const newSource: KnowledgeSource = {
      id: Date.now().toString(),
      type: 'file',
      content: file.name,
      status: 'processing',
      createdAt: new Date(),
      lastUpdated: new Date()
    }

    setSources([newSource, ...sources])

    // TODO: API call to upload file
    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.id === newSource.id 
          ? { ...s, status: 'completed' }
          : s
      ))
      setIsLoading(false)
    }, 2000)
  }

  const handleDelete = (id: string) => {
    setSources(sources.filter(s => s.id !== id))
  }

  const handleRescrape = (id: string) => {
    setSources(sources.map(s => 
      s.id === id 
        ? { ...s, status: 'processing', lastUpdated: new Date() }
        : s
    ))

    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.id === id 
          ? { ...s, status: 'completed', lastUpdated: new Date() }
          : s
      ))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Chatbot Training</h1>
          <p className="mt-2 text-gray-600">
            Fügen Sie Wissensquellen hinzu, damit Ihr Chatbot intelligent antworten kann
          </p>
        </div>

        {/* Add Knowledge Sources */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Neue Wissensquelle hinzufügen</h2>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('url')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'url' 
                  ? 'text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website scrapen
              </div>
              {activeTab === 'url' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'text' 
                  ? 'text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Text hinzufügen
              </div>
              {activeTab === 'text' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'file' 
                  ? 'text-indigo-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Datei hochladen
              </div>
              {activeTab === 'file' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          </div>

          {/* URL Scraping Tab */}
          {activeTab === 'url' && (
            <form onSubmit={handleScrapeWebsite} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <div className="flex gap-3">
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Scraping...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Website scrapen
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Der Chatbot wird automatisch alle Seiten dieser Website crawlen und die Inhalte lernen.
                </p>
              </div>
            </form>
          )}

          {/* Manual Text Tab */}
          {activeTab === 'text' && (
            <form onSubmit={handleAddManualText} className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                  Wissen / FAQ / Informationen
                </label>
                <textarea
                  id="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  rows={8}
                  placeholder="Fügen Sie hier Ihr Wissen ein (z.B. FAQ, Produktbeschreibungen, Unternehmensinfos)..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Fügen Sie manuell Informationen hinzu, die der Chatbot kennen soll.
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Wissen hinzufügen
              </button>
            </form>
          )}

          {/* File Upload Tab */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Datei hochladen
                </label>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Unterstützte Formate: PDF, DOC, DOCX, TXT (Max. 10MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Knowledge Sources List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Wissensquellen ({sources.length})
          </h2>

          {sources.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Noch keine Wissensquellen hinzugefügt</p>
              <p className="text-sm text-gray-500">
                Fügen Sie eine Website, Text oder Datei hinzu, um zu starten
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sources.map((source) => (
                <div key={source.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {source.type === 'url' && <Link2 className="h-5 w-5 text-indigo-600" />}
                        {source.type === 'text' && <FileText className="h-5 w-5 text-green-600" />}
                        {source.type === 'file' && <FileText className="h-5 w-5 text-purple-600" />}
                        
                        <span className="font-medium text-gray-900 truncate">
                          {source.content}
                        </span>

                        {/* Status Badge */}
                        {source.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                            <CheckCircle2 className="h-3 w-3" />
                            Fertig
                          </span>
                        )}
                        {source.status === 'processing' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Verarbeitet...
                          </span>
                        )}
                        {source.status === 'error' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs">
                            <AlertCircle className="h-3 w-3" />
                            Fehler
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Hinzugefügt: {source.createdAt.toLocaleDateString('de-DE')}</span>
                        {source.pageCount && (
                          <span>{source.pageCount} Seiten gescrapt</span>
                        )}
                        <span>Zuletzt aktualisiert: {source.lastUpdated.toLocaleString('de-DE')}</span>
                      </div>

                      {source.errorMessage && (
                        <p className="mt-2 text-sm text-red-600">{source.errorMessage}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {source.type === 'url' && (
                        <button
                          onClick={() => handleRescrape(source.id)}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Neu scrapen"
                        >
                          <RefreshCw className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(source.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Löschen"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
