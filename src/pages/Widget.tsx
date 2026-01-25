import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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
        // Always show greeting message when chat opens
        const greetingMessage = greeting || 'Hallo! Wie kann ich dir helfen?'
        setMessages((prev) => (prev.length === 0 ? [{ role: 'assistant', content: greetingMessage }] : prev))
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
      // Re-focus the input field after response and reset height
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = 'auto'
          inputRef.current.focus()
        }
      }, 50)
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  // Removed duplicate auto-start effects - unified in single effect above

  // Terms acceptance overlay - redesigned for better first impression
  if (!termsAccepted) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-gradient-to-b from-indigo-50 via-white to-white text-gray-900 overflow-hidden"
        style={{ '--primary': primaryColor } as CSSProperties}
      >
        <div
          className="h-full flex flex-col"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingTop: 'env(safe-area-inset-top)' }}
        >
          {/* Preview header - shows what chat will look like */}
          <header className="px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200 shadow-sm flex items-center justify-center">
                  <AvatarIcon type={avatarType} color={primaryColor} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">{headerTitle}</h1>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Bereit zu helfen
                </p>
              </div>
            </div>
          </header>

          {/* Welcome content */}
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="max-w-sm w-full text-center">
              {/* Animated greeting bubble */}
              <div className="mb-8 inline-flex items-start gap-2 text-left">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200 shadow-sm flex items-center justify-center flex-shrink-0">
                  <AvatarIcon type={avatarType} color={primaryColor} />
                </div>
                <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                  <p className="text-sm text-gray-900">
                    {greeting || `Hallo! Ich bin ${headerTitle}. Wie kann ich Ihnen heute helfen?`}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Willkommen beim Support-Chat
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Ich beantworte Ihre Fragen sofort – rund um die Uhr.
              </p>

              {/* Collapsed terms - expandable */}
              <details className="mb-6 text-left bg-gray-50 rounded-xl border border-gray-100">
                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800 list-none px-4 py-3 flex items-center gap-2 select-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Hinweise zur Nutzung
                  <svg className="h-3 w-3 ml-auto transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-3 text-xs text-gray-600 space-y-1.5 border-t border-gray-100 pt-3">
                  <p className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    Dieser Chat wird von KI betrieben und kann Fehler machen.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    Antworten dienen zur Information, nicht als Beratung.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    Bitte keine sensiblen Daten eingeben.
                  </p>
                </div>
              </details>

              <button
                onClick={handleAcceptTerms}
                className="w-full rounded-xl text-white px-6 py-3.5 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: primaryColor, '--tw-ring-color': primaryColor } as CSSProperties}
              >
                Chat starten
              </button>

              <p className="mt-4 text-[11px] text-gray-400">
                Mit dem Start akzeptieren Sie unsere Nutzungsbedingungen
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 w-full h-full bg-white text-gray-900 overflow-hidden"
      style={{ '--primary': primaryColor } as CSSProperties}
    >
      <div
        className="h-full flex flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Minimal Header */}
        <header className="px-4 py-2.5 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}15` }}
              >
                <AvatarIcon type={avatarType} color={primaryColor} />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-medium text-gray-900 truncate">{headerTitle}</h1>
              </div>
            </div>
            {/* Minimal status indicator */}
            <div className="flex items-center gap-1.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  ready ? 'bg-green-500' : error ? 'bg-red-400' : 'bg-amber-400 animate-pulse'
                }`}
              />
              <span className="text-[11px] text-gray-400">
                {sending ? 'Schreibt...' : ready ? 'Online' : error ? 'Offline' : 'Verbindet...'}
              </span>
            </div>
          </div>
        </header>
        {/* Chat Messages Area */}
        <main
          className="flex-1 px-4 py-4 overflow-auto space-y-4 bg-gray-50/50"
          role="log"
          aria-label="Chat-Nachrichten"
          aria-live="polite"
          aria-relevant="additions"
        >
          {isPreparing && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Wird vorbereitet...</span>
              </div>
            </div>
          )}
          {error && <div className="text-sm text-red-500 text-center py-2">{error}</div>}
          {messages.map((m, i) => (
            <div key={i} className={`${m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
              <div className={`max-w-[85%] min-w-0 ${m.role === 'user' ? '' : 'flex gap-2'}`}>
                {m.role === 'assistant' && (
                  <div
                    className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <AvatarIcon type={avatarType} color={primaryColor} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div
                    className={`rounded-2xl px-4 py-2.5 min-w-0 overflow-hidden ${
                      m.role === 'user'
                        ? 'rounded-tr-sm text-white'
                        : 'rounded-tl-sm bg-white text-gray-800 shadow-sm'
                    }`}
                    style={m.role === 'user' ? { backgroundColor: primaryColor } : undefined}
                  >
                    <p className="whitespace-pre-wrap break-words text-[14px] leading-relaxed">
                      {renderContentWithLinks(m.content, m.role === 'user' ? '#FFFFFF' : primaryColor)}
                    </p>

                  {/* Voice playback button for assistant messages */}
                  {m.role === 'assistant' && voiceMode && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => playMessage(i, m.content)}
                        disabled={player.state === 'loading'}
                        className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={player.state === 'playing' && playingMessageIndex === i ? 'Pause' : 'Vorlesen'}
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
                          className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
                          aria-label="Stop"
                        >
                          <StopIcon /> Stop
                        </button>
                      )}
                    </div>
                  )}

                  {m.role === 'assistant' && uniqueSources(m.sources).length > 0 && (
                    <div className="mt-2">
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() => setOpenSourcesFor((prev) => (prev === i ? null : i))}
                          aria-expanded={openSourcesFor === i}
                          aria-controls={`sources-${i}`}
                          className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          {uniqueSources(m.sources).length} Quellen
                        </button>

                        {openSourcesFor === i && (
                          <div
                            id={`sources-${i}`}
                            role="menu"
                            className="absolute left-0 bottom-full z-20 mb-2 w-64 rounded-lg border border-gray-100 bg-white p-2 shadow-lg"
                          >
                            <ul className="max-h-40 overflow-auto space-y-1" role="none">
                              {uniqueSources(m.sources).map((s) => (
                                <li key={`${s.title}::${s.url}`} role="none">
                                  <a
                                    href={s.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    role="menuitem"
                                    className="block rounded-md px-2 py-1.5 text-[11px] hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                                  >
                                    <div className="font-medium text-gray-700 truncate">{s.title}</div>
                                    <div className="text-gray-400 truncate">{s.url}</div>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <AvatarIcon type={avatarType} color={primaryColor} />
                </div>
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white shadow-sm">
                  <div className="flex items-center gap-1" aria-label="Antwort wird geschrieben" role="status">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: primaryColor,
                          opacity: 0.5,
                          animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </main>
        {/* Input Area - Clean & Minimal */}
        <form
          onSubmit={onSend}
          className="px-4 py-3 bg-white border-t border-gray-100"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          <div className="flex items-center gap-2">
            {/* Voice toggle */}
            <button
              type="button"
              onClick={() => {
                if (voiceMode) {
                  if (recorder.state === 'recording') recorder.cancelRecording()
                  player.stop()
                }
                setVoiceMode(!voiceMode)
              }}
              className={`p-2 rounded-full transition-colors ${
                voiceMode
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              style={voiceMode ? { backgroundColor: primaryColor } : undefined}
              aria-label={voiceMode ? 'Zu Texteingabe wechseln' : 'Sprachkonversation starten'}
              aria-pressed={voiceMode}
            >
              {voiceMode ? <KeyboardIcon className="h-5 w-5" /> : <MicrophoneIcon className="h-5 w-5" />}
            </button>

            {voiceMode ? (
              /* Voice Mode - Minimal */
              <div className="flex-1 flex items-center">
                <div className="flex-1 h-11 bg-gray-50 rounded-full overflow-hidden relative">
                  {recorder.state === 'recording' && (
                    <div
                      className="absolute inset-y-0 left-0 transition-all duration-75"
                      style={{ width: `${recorder.audioLevel * 100}%`, backgroundColor: `${primaryColor}20` }}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                    {sending ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                        Verarbeite...
                      </span>
                    ) : player.state === 'playing' ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                        Spricht...
                      </span>
                    ) : recorder.state === 'recording' ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        Höre zu...
                      </span>
                    ) : recorder.state === 'processing' ? (
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                        Verarbeite...
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={recorder.startRecording}
                        disabled={!ready}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        Tippen zum Sprechen
                      </button>
                    )}
                  </div>
                </div>
                {(recorder.state === 'recording' || player.state === 'playing') && (
                  <button
                    type="button"
                    onClick={() => {
                      recorder.cancelRecording()
                      player.stop()
                      setVoiceMode(false)
                    }}
                    className="ml-2 p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Stopp"
                  >
                    <StopIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : (
              /* Text Mode - Minimal */
              <>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    // Auto-resize textarea
                    e.target.style.height = 'auto'
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
                  }}
                  onKeyDown={(e) => {
                    // Submit on Enter (without Shift)
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim() && ready && !sending) {
                        onSend(e as unknown as React.FormEvent)
                      }
                    }
                  }}
                  placeholder={ready ? 'Nachricht...' : 'Verbindet...'}
                  disabled={!ready || sending}
                  aria-label="Nachricht eingeben"
                  rows={1}
                  className="flex-1 min-h-[44px] max-h-[120px] rounded-2xl border-0 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:text-gray-400 resize-none overflow-y-auto"
                  style={{ '--tw-ring-color': `${primaryColor}40` } as CSSProperties}
                />
                <button
                  disabled={!ready || sending || !input.trim()}
                  className="p-2.5 rounded-full text-white transition-all disabled:opacity-40 self-end mb-0.5"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Senden"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          {recorder.error && (
            <p className="mt-2 text-xs text-red-500 text-center">{recorder.error}</p>
          )}
        </form>
      </div>
    </div>
  )
}
