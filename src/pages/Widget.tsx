import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { createSession, sendMessage, sendVoiceMessage, synthesizeSpeech, type ChatSource } from '../lib/api'
import { useVoiceRecorder } from '../hooks/useVoiceRecorder'
import { useAudioPlayer } from '../hooks/useAudioPlayer'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
}

type AvatarType = 'robot' | 'human' | 'pencil'

const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)

const STORAGE_KEY = 'idpa_widget_messages_v1'
const TERMS_ACCEPTED_KEY = 'idpa_widget_terms_accepted_v1'
const MAX_HISTORY_MESSAGES = 12

type TextToken =
  | { type: 'text'; value: string }
  | { type: 'link'; label: string; href: string }

const splitTrailingPunctuation = (href: string): { href: string; trailing: string } => {
  // Common punctuation that often follows URLs in natural language.
  const match = href.match(/^(.*?)([)\].,;:!?]+)$/)
  if (!match) return { href, trailing: '' }
  const core = match[1] ?? href
  const trailing = match[2] ?? ''
  // Don't strip if it would remove the whole URL
  if (!core.startsWith('http')) return { href, trailing: '' }
  return { href: core, trailing }
}

const tokenizeLinks = (input: string): TextToken[] => {
  const tokens: TextToken[] = []
  let cursor = 0

  const markdownLink = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  let match: RegExpExecArray | null
  while ((match = markdownLink.exec(input)) !== null) {
    const start = match.index
    const full = match[0]
    const label = match[1] ?? ''
    const rawHref = match[2] ?? ''
    const { href, trailing } = splitTrailingPunctuation(rawHref)

    if (start > cursor) {
      tokens.push({ type: 'text', value: input.slice(cursor, start) })
    }
    tokens.push({ type: 'link', label, href })
    if (trailing) tokens.push({ type: 'text', value: trailing })
    cursor = start + full.length
  }

  const remaining = input.slice(cursor)
  if (!remaining) return tokens

  // Linkify bare URLs in the remaining text
  const urlRegex = /(https?:\/\/[^\s)]+)(?!\w)/g
  let last = 0
  while ((match = urlRegex.exec(remaining)) !== null) {
    const start = match.index
    const rawHref = match[1] ?? ''
    const { href, trailing } = splitTrailingPunctuation(rawHref)
    if (start > last) tokens.push({ type: 'text', value: remaining.slice(last, start) })
    tokens.push({ type: 'link', label: href, href })
    if (trailing) tokens.push({ type: 'text', value: trailing })
    last = start + rawHref.length
  }
  if (last < remaining.length) tokens.push({ type: 'text', value: remaining.slice(last) })

  return tokens
}

const renderContentWithLinks = (content: string, primaryColor: string) => {
  const tokens = tokenizeLinks(content)
  return tokens.map((t, idx) => {
    if (t.type === 'text') return <span key={idx}>{t.value}</span>
    return (
      <a
        key={idx}
        href={t.href}
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2 hover:opacity-90"
        style={{ color: primaryColor }}
      >
        {t.label}
      </a>
    )
  })
}

// Voice mode icons
const MicrophoneIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10v1a7 7 0 01-14 0v-1M12 19v3M8 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const KeyboardIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const PlayIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
  </svg>
)

const PauseIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
  </svg>
)

const StopIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/>
  </svg>
)

const AvatarIcon = ({ type, color }: { type: AvatarType; color: string }) => {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }
  if (type === 'human') {
    return (
      <svg {...common}>
        <path d="M20 21a8 8 0 10-16 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M12 13a4 4 0 100-8 4 4 0 000 8z" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'pencil') {
    return (
      <svg {...common}>
        <path d="M12 20h9" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M12 8V4H8" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M4 13a8 8 0 0116 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 14h.01M15 14h.01" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
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
  return { title, url, score: source.score ?? 0 }
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
  const primaryColorParam = q.get('primaryColor') || ''
  const headerTitleParam = q.get('title') || ''
  const greetingParam = q.get('greeting') || ''
  const avatarParam = q.get('avatar') || ''

  const [botName, setBotName] = useState<string>('')
  const [botTheme, setBotTheme] = useState<Record<string, unknown> | null>(null)

  const themePrimary = typeof botTheme?.primaryColor === 'string' ? (botTheme.primaryColor as string) : ''
  const primaryColor = isValidHexColor(primaryColorParam) ? primaryColorParam : isValidHexColor(themePrimary) ? themePrimary : '#4F46E5'
  const headerTitle = headerTitleParam.trim() || botName || 'Chat'
  const greeting = greetingParam.trim()
  const themeAvatar = typeof botTheme?.avatarType === 'string' ? (botTheme.avatarType as string) : ''
  const avatarType: AvatarType = (avatarParam || themeAvatar) === 'human' ? 'human' : (avatarParam || themeAvatar) === 'pencil' ? 'pencil' : 'robot'

  const [sessionId, setSessionId] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [openSourcesFor, setOpenSourcesFor] = useState<number | null>(null)

  // Voice conversation mode state
  const [voiceMode, setVoiceMode] = useState(false)
  const [autoPlayResponse] = useState(true) // Always true for conversation mode
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null)
  const [autoSendTriggered, setAutoSendTriggered] = useState(false)
  const [continueListening, setContinueListening] = useState(false)
  const recorder = useVoiceRecorder(() => setAutoSendTriggered(true))
  const player = useAudioPlayer(() => {
    // When audio playback ends in voice mode, automatically start listening again
    if (voiceMode && autoPlayResponse) {
      setContinueListening(true)
    }
  })

  const [termsAccepted, setTermsAccepted] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(TERMS_ACCEPTED_KEY) === 'true'
    } catch {
      return false
    }
  })
  const isPreparing = !ready && !error

  const handleAcceptTerms = () => {
    setTermsAccepted(true)
    try {
      sessionStorage.setItem(TERMS_ACCEPTED_KEY, 'true')
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return
      const restored = parsed
        .slice(-MAX_HISTORY_MESSAGES)
        .map((m: unknown) => {
          const maybe = m as { role?: unknown; content?: unknown }
          const role = maybe?.role
          const content = maybe?.content
          if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
          return { role, content } as ChatMessage
        })
        .filter((m): m is ChatMessage => Boolean(m))
      if (restored.length) setMessages(restored)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      const minimal = messages.map((m) => ({ role: m.role, content: m.content }))
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(minimal.slice(-MAX_HISTORY_MESSAGES)))
    } catch {
      // ignore
    }
  }, [messages])

  useEffect(() => {
    let mounted = true
    let retryTimer: number | null = null

    const bootstrap = async () => {
      try {
        if (!chatbotId) throw new Error('Missing chatbotId')
        const s = await createSession(chatbotId)
        if (!mounted) return
        setSessionId(s.sessionId)
        setToken(s.token)
        setBotName(s.chatbot?.name ?? '')
        setBotTheme((s.chatbot?.theme as Record<string, unknown> | null | undefined) ?? null)
        setReady(true)
        setError(null)
        if (greeting) {
          setMessages((prev) => (prev.length === 0 ? [{ role: 'assistant', content: greeting }] : prev))
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Fehler beim Initialisieren'
        // If the bot is still provisioning, keep the UI in "preparing" state and retry.
        if (String(msg).includes('(503)')) {
          if (!mounted) return
          setError(null)
          setReady(false)
          retryTimer = window.setTimeout(() => {
            void bootstrap()
          }, 2500)
          return
        }
        setError(msg)
      }
    }

    void bootstrap()
    return () => {
      mounted = false
      if (retryTimer) window.clearTimeout(retryTimer)
    }
  }, [chatbotId, greeting])

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !sessionId || !token) return
    const msg = input.trim()
    setInput('')
    const history = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content }))
    setMessages((m) => [...m, { role: 'user', content: msg }])
    setSending(true)
    try {
      const res = await sendMessage({ sessionId, token, message: msg, history })
      setMessages((m) => [...m, { role: 'assistant', content: res.answer, sources: res.sources }])
      setOpenSourcesFor(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Senden')
    } finally {
      setSending(false)
    }
  }

  // Voice message handler
  const onVoiceSend = async () => {
    if (!sessionId || !token) return

    const audioBlob = await recorder.stopRecording()
    if (!audioBlob || audioBlob.size < 1000) {
      // Too short, likely noise
      return
    }

    setSending(true)
    setError(null)
    try {
      const res = await sendVoiceMessage({
        sessionId,
        token,
        audioBlob,
        synthesize: autoPlayResponse,
      })

      // Add user message (transcribed)
      setMessages((m) => [...m, { role: 'user', content: res.transcription.text }])

      // Build answer from RAG response
      const answer = res.rag.unknown
        ? res.rag.reason || 'Das kann ich leider nicht beantworten.'
        : res.rag.claims.map((c) => c.text).join('\n\n')

      // Add assistant message
      const sources: ChatSource[] = res.rag.sources.map((s) => ({
        content: '',
        metadata: {
          chunk_id: s.chunk_id,
          title: s.title,
          sourceUrl: s.canonical_url || s.original_url || s.uri || '',
        },
        score: 1,
      }))
      setMessages((m) => [...m, { role: 'assistant', content: answer, sources }])

      // Play audio response if available
      if (res.audio && res.audioContentType && autoPlayResponse) {
        await player.play(res.audio, res.audioContentType)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sprachnachricht fehlgeschlagen')
    } finally {
      setSending(false)
    }
  }

  // Auto-send when silence is detected
  useEffect(() => {
    if (autoSendTriggered && recorder.state === 'recording') {
      setAutoSendTriggered(false)
      onVoiceSend()
    }
  }, [autoSendTriggered, recorder.state])

  // Single unified effect for voice mode auto-recording
  // This handles: initial activation, continue after AI response, and restart after any idle
  useEffect(() => {
    // Only proceed if voice mode is active and system is ready
    if (!voiceMode || !ready || !autoPlayResponse) return

    // Don't start if already recording, sending, or playing audio
    if (recorder.state !== 'idle' || sending || player.state !== 'idle') return

    // Handle continueListening flag (set when AI finishes speaking)
    if (continueListening) {
      setContinueListening(false)
    }

    // Start recording with a small delay to ensure clean state
    const timer = setTimeout(() => {
      // Double-check conditions before starting
      if (voiceMode && recorder.state === 'idle' && !sending && player.state === 'idle') {
        recorder.startRecording().catch((err) => {
          console.error('Failed to start recording:', err)
        })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [voiceMode, ready, autoPlayResponse, recorder.state, sending, player.state, continueListening])

  // Play a specific message as audio
  const playMessage = async (messageIndex: number, content: string) => {
    if (player.state === 'playing' && playingMessageIndex === messageIndex) {
      player.pause()
      return
    }
    if (player.state === 'paused' && playingMessageIndex === messageIndex) {
      player.resume()
      return
    }

    setPlayingMessageIndex(messageIndex)
    try {
      const blob = await synthesizeSpeech({ sessionId, token, text: content })
      await player.playBlob(blob)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Vorlesen fehlgeschlagen')
    }
  }

  // Reset playing message when audio stops
  useEffect(() => {
    if (player.state === 'idle' && playingMessageIndex !== null) {
      setPlayingMessageIndex(null)
    }
  }, [player.state, playingMessageIndex])

  // Removed duplicate auto-start effects - unified in single effect above

  // Terms acceptance overlay
  if (!termsAccepted) {
    return (
      <div
        className="h-screen w-screen bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900"
        style={{ '--primary': primaryColor } as CSSProperties}
      >
        <div className="h-full flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-50 ring-1 ring-indigo-100 flex items-center justify-center">
                <AvatarIcon type={avatarType} color={primaryColor} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{headerTitle}</h2>
                <p className="text-sm text-gray-500">Support-Chat</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Nutzungsbedingungen</h3>
              <div className="text-sm text-gray-600 space-y-2 bg-gray-50 rounded-lg p-3 border border-gray-100 max-h-48 overflow-auto">
                <p>Willkommen! Bevor Sie diesen Chat nutzen, beachten Sie bitte:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Dieser Chatbot wird von einer KI betrieben und kann Fehler machen.</li>
                  <li>Die Antworten dienen nur zur Information und ersetzen keine professionelle Beratung.</li>
                  <li>Ihre Nachrichten werden zur Verarbeitung an unsere Server übermittelt.</li>
                  <li>Bitte geben Sie keine sensiblen persönlichen Daten ein.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleAcceptTerms}
              className="w-full rounded-xl text-white px-4 py-3 text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              Akzeptieren und Chat starten
            </button>

            <p className="mt-3 text-xs text-gray-400 text-center">
              Mit dem Klick auf "Akzeptieren" stimmen Sie den Nutzungsbedingungen zu.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-screen w-screen bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900"
      style={{ '--primary': primaryColor } as CSSProperties}
    >
      <div className="h-full flex flex-col">
        <header className="px-4 py-3 border-b bg-white/70 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-white ring-1 ring-gray-200 shadow-sm flex items-center justify-center">
                <AvatarIcon type={avatarType} color={primaryColor} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{headerTitle}</div>
                <div className="text-[11px] text-gray-500 truncate max-w-[240px]">Support-Chat</div>
              </div>
            </div>
            <div
              className={`h-2.5 w-2.5 rounded-full ${ready ? 'bg-green-500' : error ? 'bg-red-500' : 'animate-pulse'}`}
              style={!ready && !error ? { backgroundColor: primaryColor } : undefined}
            />
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
              <div className={`flex gap-2 items-end ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="h-7 w-7 rounded-full bg-white ring-1 ring-gray-200 shadow-sm flex items-center justify-center">
                    <AvatarIcon type={avatarType} color={primaryColor} />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 shadow-sm ring-1 ${
                    m.role === 'user'
                      ? 'text-white ring-indigo-600/20'
                      : 'bg-white text-gray-900 ring-gray-200'
                  }`}
                  style={m.role === 'user' ? { backgroundColor: primaryColor } : undefined}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {renderContentWithLinks(m.content, m.role === 'user' ? '#FFFFFF' : primaryColor)}
                  </div>

                  {/* Voice playback button for assistant messages */}
                  {m.role === 'assistant' && voiceMode && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => playMessage(i, m.content)}
                        disabled={player.state === 'loading'}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                      >
                        {player.state === 'playing' && playingMessageIndex === i ? (
                          <>
                            <PauseIcon /> Pause
                          </>
                        ) : player.state === 'paused' && playingMessageIndex === i ? (
                          <>
                            <PlayIcon /> Fortsetzen
                          </>
                        ) : player.state === 'loading' && playingMessageIndex === i ? (
                          <>
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                            Lädt...
                          </>
                        ) : (
                          <>
                            <PlayIcon /> Vorlesen
                          </>
                        )}
                      </button>
                      {player.state !== 'idle' && playingMessageIndex === i && (
                        <button
                          type="button"
                          onClick={() => player.stop()}
                          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                        >
                          <StopIcon /> Stop
                        </button>
                      )}
                    </div>
                  )}

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
                                  className="block rounded-lg px-2 py-1.5 text-xs hover:bg-indigo-50"
                                  title={s.url}
                                  style={{
                                    color: primaryColor,
                                    backgroundColor: 'transparent',
                                  }}
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
            </div>
          ))}

          {sending && (
            <div className="max-w-[86%] mr-auto">
              <div className="flex gap-2 items-end">
                <div className="h-7 w-7 rounded-full bg-white ring-1 ring-gray-200 shadow-sm flex items-center justify-center">
                  <AvatarIcon type={avatarType} color={primaryColor} />
                </div>
                <div className="rounded-2xl px-3 py-2 bg-white text-gray-900 ring-1 ring-gray-200 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.1s]" />
                    <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        <form onSubmit={onSend} className="p-3 border-t bg-white/70 backdrop-blur">
          {/* Voice mode toggle */}
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => {
                if (voiceMode) {
                  // Exiting voice mode - stop recording if active
                  if (recorder.state === 'recording') {
                    recorder.cancelRecording()
                  }
                  player.stop()
                }
                setVoiceMode(!voiceMode)
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                voiceMode ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title={voiceMode ? 'Textmodus' : 'Sprachkonversation'}
            >
              {voiceMode ? <KeyboardIcon /> : <MicrophoneIcon />}
            </button>
            {voiceMode && (
              <span className="text-xs text-indigo-600 font-medium">
                Sprachkonversation aktiv
              </span>
            )}
            {recorder.error && (
              <span className="text-xs text-red-500">{recorder.error}</span>
            )}
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            {voiceMode ? (
              /* Voice conversation mode */
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl overflow-hidden relative border border-indigo-100">
                  {/* Audio level indicator */}
                  {recorder.state === 'recording' && (
                    <div
                      className="absolute inset-y-0 left-0 bg-indigo-400/30 transition-all duration-75"
                      style={{ width: `${recorder.audioLevel * 100}%` }}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center text-sm">
                    {sending ? (
                      <span className="flex items-center gap-2 text-indigo-600">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        Verarbeite...
                      </span>
                    ) : player.state === 'playing' ? (
                      <span className="flex items-center gap-2 text-purple-600">
                        <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                        KI spricht...
                      </span>
                    ) : recorder.state === 'recording' ? (
                      <span className="flex items-center gap-2 text-indigo-600">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        Ich höre zu...
                      </span>
                    ) : recorder.state === 'processing' ? (
                      <span className="flex items-center gap-2 text-indigo-600">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        Verarbeite...
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={recorder.startRecording}
                        disabled={!ready}
                        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                      >
                        <MicrophoneIcon />
                        Tippen um zu sprechen
                      </button>
                    )}
                  </div>
                </div>
                {/* Stop conversation button */}
                {(recorder.state === 'recording' || player.state === 'playing') && (
                  <button
                    type="button"
                    onClick={() => {
                      recorder.cancelRecording()
                      player.stop()
                      setVoiceMode(false) // Exit voice mode and return to text input
                    }}
                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 hover:bg-red-100"
                  >
                    Stopp
                  </button>
                )}
              </div>
            ) : (
              /* Text input (existing) */
              <>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={ready ? 'Nachricht eingeben…' : 'Wird vorbereitet…'}
                  disabled={!ready || sending}
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />
                <button
                  disabled={!ready || sending}
                  className="rounded-xl text-white px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-60"
                  style={{
                    backgroundColor: primaryColor,
                    opacity: !ready || sending ? 0.6 : 1,
                  }}
                >
                  {ready ? (sending ? 'Sende…' : 'Senden') : 'Bereite vor…'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
