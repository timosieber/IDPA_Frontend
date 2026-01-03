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
    <div className="min-h-screen bg-dark-950 text-white font-sans py-10 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Wissensdatenbank</h1>
          <p className="mt-2 text-gray-400">
            Verwalten Sie die Datenquellen, die Ihr KI-Assistent zur Beantwortung von Anfragen nutzen darf.
          </p>
        </div>

        {/* Add Knowledge Sources */}
        <div className="glass-panel rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Quelle hinzufügen</h2>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-white/10">
            <button
              onClick={() => setActiveTab('url')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'url' 
                  ? 'text-indigo-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Website indexieren
              </div>
              {activeTab === 'url' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'text' 
                  ? 'text-indigo-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Text manuell
              </div>
              {activeTab === 'text' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`pb-3 px-4 font-medium transition-colors relative ${
                activeTab === 'file' 
                  ? 'text-indigo-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dokumente
              </div>
              {activeTab === 'file' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
              )}
            </button>
          </div>

          {/* URL Scraping Tab */}
          {activeTab === 'url' && (
            <form onSubmit={handleScrapeWebsite} className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <div className="flex gap-3">
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://ihre-firma.ch"
                    className="flex-1 bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg shadow-indigo-500/20"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Verarbeite...
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" />
                        Indexierung starten
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Wir analysieren die Struktur Ihrer Website und indexieren relevante Inhalte automatisch.
                </p>
              </div>
            </form>
          )}

          {/* Manual Text Tab */}
          {activeTab === 'text' && (
            <form onSubmit={handleAddManualText} className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-300 mb-2">
                  Wissen / FAQ / Interna
                </label>
                <textarea
                  id="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  rows={8}
                  placeholder="Kopieren Sie hier Texte hinein, die auf der Website fehlen (z.B. interne Richtlinien, spezielle FAQs)..."
                  className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Ergänzen Sie Informationen, die der Assistent priorisiert behandeln soll.
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 font-medium shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Zum Index hinzufügen
              </button>
            </form>
          )}

          {/* File Upload Tab */}
          {activeTab === 'file' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">
                  Dokument hochladen
                </label>
                <input
                  id="file"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt"
                  className="w-full bg-dark-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Unterstützte Formate: PDF, DOC, DOCX, TXT (Max. 10MB)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Knowledge Sources List */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">
            Aktive Quellen ({sources.length})
          </h2>

          {sources.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-300 mb-2">Noch keine Daten vorhanden</p>
              <p className="text-sm text-gray-500">
                Beginnen Sie mit dem Hinzufügen Ihrer Website oder Dokumente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sources.map((source) => (
                <div key={source.id} className="border border-white/10 bg-white/5 rounded-lg p-4 hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {source.type === 'url' && <Link2 className="h-5 w-5 text-indigo-400" />}
                        {source.type === 'text' && <FileText className="h-5 w-5 text-green-400" />}
                        {source.type === 'file' && <FileText className="h-5 w-5 text-purple-400" />}
                        
                        <span className="font-medium text-white truncate">
                          {source.content}
                        </span>

                        {/* Status Badge */}
                        {source.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Aktiv
                          </span>
                        )}
                        {source.status === 'processing' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full text-xs border border-blue-500/20">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Verarbeite...
                          </span>
                        )}
                        {source.status === 'error' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full text-xs border border-red-500/20">
                            <AlertCircle className="h-3 w-3" />
                            Fehler
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Erfasst: {source.createdAt.toLocaleDateString('de-DE')}</span>
                        {source.pageCount && (
                          <span>{source.pageCount} Seiten indexiert</span>
                        )}
                        <span>Aktualisiert: {source.lastUpdated.toLocaleString('de-DE')}</span>
                      </div>

                      {source.errorMessage && (
                        <p className="mt-2 text-sm text-red-400">{source.errorMessage}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {source.type === 'url' && (
                        <button
                          onClick={() => handleRescrape(source.id)}
                          className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors"
                          title="Neu indexieren"
                        >
                          <RefreshCw className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(source.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                        title="Entfernen"
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