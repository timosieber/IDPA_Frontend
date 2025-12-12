import { account } from './appwrite'

// In Development, call the backend directly via VITE_BACKEND_URL (e.g. http://localhost:4000)
// In Production (Railway), use same-origin relative /api path (served by the proxy server)
const isDev = import.meta.env.DEV
const BACKEND_URL = isDev ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000') : ''

let cachedJwt: string | null = null
let jwtExpiration = 0
let activeTokenRequest: Promise<string> | null = null

async function getValidToken(): Promise<string> {
  const now = Date.now()
  if (cachedJwt && now < jwtExpiration) {
    return cachedJwt
  }

  if (activeTokenRequest) {
    return activeTokenRequest
  }

  activeTokenRequest = (async () => {
    try {
      const { jwt } = await account.createJWT()
      cachedJwt = jwt
      jwtExpiration = Date.now() + 10 * 60 * 1000
      return jwt
    } finally {
      activeTokenRequest = null
    }
  })()

  return activeTokenRequest
}

export interface Chatbot {
  id: string
  userId: string
  name: string
  description?: string | null
  systemPrompt?: string | null
  logoUrl?: string | null
  allowedDomains: string[]
  theme?: Record<string, unknown> | null
  model?: string | null
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

async function authHeaders() {
  const jwt = await getValidToken()
  return {
    Authorization: `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  }
}

export async function listChatbots(): Promise<Chatbot[]> {
  const res = await fetch(`${BACKEND_URL}/api/chatbots`, {
    headers: await authHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Fehler beim Laden der Chatbots (${res.status})`)
  return res.json()
}

export async function createChatbot(input: { name: string; description?: string; systemPrompt?: string; logoUrl?: string; allowedDomains: string[]; model?: string; status?: Chatbot['status'] }): Promise<Chatbot> {
  const res = await fetch(`${BACKEND_URL}/api/chatbots`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(input),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Fehler beim Erstellen des Chatbots (${res.status})`)
  return res.json()
}

export async function updateChatbot(id: string, input: Partial<{ name: string; description?: string; systemPrompt?: string; logoUrl?: string; theme?: Record<string, unknown>; model?: string; status?: Chatbot['status'] }>): Promise<Chatbot> {
  const res = await fetch(`${BACKEND_URL}/api/chatbots/${id}`, {
    method: 'PATCH',
    headers: await authHeaders(),
    body: JSON.stringify(input),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Fehler beim Aktualisieren des Chatbots (${res.status})`)
  return res.json()
}

export async function deleteChatbot(id: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/chatbots/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Fehler beim Löschen des Chatbots (${res.status})`)
}

export async function createSession(chatbotId: string): Promise<{ sessionId: string; token: string; expiresAt: string }> {
  const res = await fetch(`${BACKEND_URL}/api/chat/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatbotId }),
  })
  if (!res.ok) throw new Error(`Fehler beim Erstellen der Session (${res.status})`)
  return res.json()
}

export type ChatSource = {
  content: string
  metadata: Record<string, unknown>
  score: number
}

export type SendMessageResponse = {
  sessionId: string | null
  answer: string
  context?: unknown
  sources?: ChatSource[]
}

export async function sendMessage(params: { sessionId: string; token: string; message: string }): Promise<SendMessageResponse> {
  const res = await fetch(`${BACKEND_URL}/api/chat/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${params.token}` },
    body: JSON.stringify({ sessionId: params.sessionId, message: params.message }),
  })
  if (!res.ok) throw new Error(`Fehler beim Senden der Nachricht (${res.status})`)
  return res.json()
}

// Knowledge Sources API
export interface KnowledgeSource {
  id: string
  chatbotId: string
  type: 'URL' | 'TEXT' | 'FILE'
  label: string
  uri?: string | null
  status: 'PENDING' | 'READY' | 'FAILED'
  metadata?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export interface ScrapeResponse {
  sources: Array<{
    id: string
    label: string
    chunks: number
  }>
  pagesScanned: number
}

export async function scrapeWebsite(input: {
  chatbotId: string
  startUrls: string[]
  maxDepth?: number
  maxPages?: number
}): Promise<ScrapeResponse> {
  const res = await fetch(`${BACKEND_URL}/api/knowledge/sources/scrape`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(input),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Fehler beim Scrapen der Website (${res.status})`)
  return res.json()
}

export async function listKnowledgeSources(chatbotId: string): Promise<KnowledgeSource[]> {
  const res = await fetch(`${BACKEND_URL}/api/knowledge/sources?chatbotId=${chatbotId}`, {
    headers: await authHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Fehler beim Laden der Wissensquellen (${res.status})`)
  return res.json()
}

export async function deleteKnowledgeSource(id: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/knowledge/sources/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Fehler beim Löschen der Wissensquelle (${res.status})`)
}

export type ProvisioningEvent =
  | { type: 'snapshot'; chatbotId: string; chatbotStatus: Chatbot['status'] | null; pendingSources: number; failedSources: number; updatedAt: string | null }
  | { type: 'started'; chatbotId: string }
  | { type: 'completed'; chatbotId: string; status: 'ACTIVE' }
  | { type: 'failed'; chatbotId: string; status: Chatbot['status'] | string; error?: string }

export async function streamProvisioningEvents(params: {
  chatbotId: string
  onEvent: (event: ProvisioningEvent) => void
  signal?: AbortSignal
}): Promise<void> {
  const url = `${BACKEND_URL}/api/knowledge/provisioning/stream?chatbotId=${encodeURIComponent(params.chatbotId)}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...(await authHeaders()),
      Accept: 'text/event-stream',
    },
    credentials: 'include',
    signal: params.signal,
  })

  if (!res.ok || !res.body) {
    throw new Error(`Provisioning-Stream konnte nicht gestartet werden (${res.status})`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')

  let buffer = ''
  let eventName: string | null = null
  let dataLines: string[] = []

  const flush = () => {
    if (!dataLines.length) return
    if (eventName !== 'provisioning') {
      eventName = null
      dataLines = []
      return
    }
    const payload = dataLines.join('\n')
    eventName = null
    dataLines = []
    try {
      const parsed = JSON.parse(payload) as ProvisioningEvent
      params.onEvent(parsed)
    } catch {
      // ignore invalid payloads
    }
  }

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // Parse SSE frames: events separated by a blank line
    while (true) {
      const idx = buffer.indexOf('\n\n')
      if (idx === -1) break
      const rawEvent = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 2)

      const lines = rawEvent.split('\n').map((l) => l.replace(/\r$/, ''))
      for (const line of lines) {
        if (!line || line.startsWith(':')) continue
        if (line.startsWith('event:')) {
          eventName = line.slice('event:'.length).trim()
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice('data:'.length).trimStart())
        }
      }
      flush()
    }
  }
}
