import { useEffect, useMemo, useState } from 'react'
import { createSession, sendMessage } from '../lib/api'

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
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

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
      setMessages((m) => [...m, { role: 'assistant', content: res.answer }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Senden')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-white text-gray-900">
      <div className="h-full flex flex-col">
        <header className="px-4 py-2 border-b">
          <div className="text-sm font-medium">ChatBot Widget</div>
          <div className="text-xs text-gray-500">{chatbotId ? `Bot: ${chatbotId}` : 'Kein Bot'}</div>
        </header>
        <main className="flex-1 p-3 overflow-auto space-y-2">
          {!ready && !error && <div className="text-sm text-gray-500">Initialisiere…</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[80%] p-2 rounded-lg ${m.role === 'user' ? 'ml-auto bg-indigo-600 text-white' : 'mr-auto bg-gray-100'}`}>
              {m.content}
            </div>
          ))}
        </main>
        <form onSubmit={onSend} className="p-3 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={ready ? 'Nachricht eingeben…' : 'Warten…'}
            disabled={!ready || sending}
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button disabled={!ready || sending} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            Senden
          </button>
        </form>
      </div>
    </div>
  )
}

