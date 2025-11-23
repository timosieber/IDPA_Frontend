import { account } from './appwrite'

// In Development, call the backend directly via VITE_BACKEND_URL (e.g. http://localhost:4000)
// In Production (Railway), use same-origin relative /api path (served by the proxy server)
const isDev = import.meta.env.DEV
const BACKEND_URL = isDev ? (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000') : ''

let cachedJwt: string | null = null
let jwtExpiration = 0
let inflightJwt: Promise<string> | null = null

async function getJwt(): Promise<string> {
  const now = Date.now()
  if (cachedJwt && now < jwtExpiration) {
    return cachedJwt
  }
  if (inflightJwt) return inflightJwt
  inflightJwt = account
    .createJWT()
    .then(({ jwt }) => {
      cachedJwt = jwt
      jwtExpiration = Date.now() + 10 * 60 * 1000 // 10 Minuten Cache, unterhalb der Appwrite-Limit
      return jwt
    })
    .finally(() => {
      inflightJwt = null
    })
  return inflightJwt
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
  const jwt = await getJwt()
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

export async function sendMessage(params: { sessionId: string; token: string; message: string }): Promise<{ sessionId: string; answer: string; context?: unknown } > {
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
