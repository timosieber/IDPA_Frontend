import { useEffect, useMemo, useState } from 'react'
import { createSession, sendMessage, type ChatSource } from '../lib/api'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
}

const extractSourceRef = (source: ChatSource): { title: string; url: string; score: number } | null => {
  const meta = source.metadata || {}
  const titleRaw =
    (meta.title as string | undefined) ||
    (meta.label as string | undefined) ||
    (meta.filename as string | undefined) ||
    (meta.sourceUrl as string | undefined) ||
    'Quelle'
  const urlRaw =
    (meta.sourceUrl as string | undefined) ||
    (meta.uri as string | undefined) ||
    (meta.filename as string | undefined) ||
    ''

  const title = String(titleRaw).trim()
  const url = String(urlRaw).trim()
  if (!url || url === 'N/A') return null
  return { title, url, score: source.score }
}

const uniqueSources = (sources: ChatSource[] | undefined) => {
  const refs = (sources ?? []).map(extractSourceRef).filter((x): x is NonNullable<typeof x> => Boolean(x))
  const seen = new Set<string>()
  const out: Array<{ title: string; url: string; score: number }> = []
  for (const r of refs) {
    const key = `${r.title}::${r.url}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(r)
  }
  return out
}

function useQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), [])
}

export default function Widget() {
  const q = useQuery()
  const chatbotId = q.get('chatbotId') || ''

  const [sessionId, setSessionId] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [openSourcesFor, setOpenSourcesFor] = useState<number | null>(null)
  const isPreparing = !ready && !error

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        if (!chatbotId) throw new Error('Missing chatbotId')
        const s = await createSession(chatbotId)
        if (!mounted) return
        setSessionId(s.sessionId)
        setToken(s.token)
        setReady(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Fehler beim Initialisieren')
      }
    })()
    return () => {
      mounted = false
    }
  }, [chatbotId])

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !sessionId || !token) return
    const msg = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: msg }])
    setSending(true)
    try {
      const res = await sendMessage({ sessionId, token, message: msg })
      setMessages((m) => [...m, { role: 'assistant', content: res.answer, sources: res.sources }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Senden')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900">
      <div className="h-full flex flex-col">
        <header className="px-4 py-3 border-b bg-white/70 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Chat</div>
              <div className="text-[11px] text-gray-500 truncate max-w-[240px]">{chatbotId ? `Bot: ${chatbotId}` : 'Kein Bot'}</div>
            </div>
            <div className={`h-2.5 w-2.5 rounded-full ${ready ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-indigo-500 animate-pulse'}`} />
          </div>
        </header>
        <main className="flex-1 p-3 overflow-auto space-y-3">
          {isPreparing && (
            <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg border border-indigo-100">
              <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div>
                <div className="text-sm font-medium">Chatbot wird vorbereitet</div>
                <div className="text-xs text-indigo-600">Scraper lädt Inhalte – gleich geht es los.</div>
              </div>
            </div>
          )}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[86%] ${m.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
              <div
                className={`rounded-2xl px-3 py-2 shadow-sm ring-1 ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white ring-indigo-600/20'
                    : 'bg-white text-gray-900 ring-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</div>

                {m.role === 'assistant' && uniqueSources(m.sources).length > 0 && (
                  <div className="mt-2 flex justify-end">
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={() => setOpenSourcesFor((prev) => (prev === i ? null : i))}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        Quellen
                        <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] text-gray-600 ring-1 ring-gray-200">
                          {uniqueSources(m.sources).length}
                        </span>
                      </button>

                      <div
                        className={`absolute bottom-full right-0 z-20 mb-2 w-[260px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg ${
                          openSourcesFor === i ? 'block' : 'hidden group-hover:block group-focus-within:block'
                        }`}
                      >
                        <div className="px-1 pb-1 text-[11px] font-semibold text-gray-700">Quellen</div>
                        <ul className="max-h-40 overflow-auto">
                          {uniqueSources(m.sources).map((s) => (
                            <li key={`${s.title}::${s.url}`} className="px-1 py-1">
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-lg px-2 py-1.5 text-xs text-indigo-700 hover:bg-indigo-50"
                                title={s.url}
                              >
                                <div className="font-medium text-gray-900 truncate">{s.title}</div>
                                <div className="text-[11px] text-gray-500 truncate">{s.url}</div>
                              </a>
                            </li>
                          ))}
                        </ul>
                        <div className="px-1 pt-1 text-[10px] text-gray-400">Hover oder klicken zum Schließen.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </main>
        <form onSubmit={onSend} className="p-3 border-t bg-white/70 backdrop-blur flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={ready ? 'Nachricht eingeben…' : 'Wird vorbereitet…'}
            disabled={!ready || sending}
            className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          <button
            disabled={!ready || sending}
            className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {ready ? (sending ? 'Sende…' : 'Senden') : 'Bereite vor…'}
          </button>
        </form>
      </div>
    </div>
  )
}
