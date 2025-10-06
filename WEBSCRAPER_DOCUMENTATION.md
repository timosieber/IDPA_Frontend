# Web Scraper & Chatbot Training System

## Übersicht

Das Chatbot Training System ermöglicht es Benutzern, ihre Chatbots mit Wissen zu füttern, indem sie:
1. **Websites scrapen** - Automatisches Crawlen und Extrahieren von Webseiteninhalten
2. **Manuelles Wissen hinzufügen** - Direkte Eingabe von FAQs, Produktinfos, etc.
3. **Dateien hochladen** - Upload von PDF, DOC, DOCX, TXT Dokumenten

## Features

### 1. Website Scraping
- **Automatisches Crawling**: Folgt allen Links auf der eingegebenen Domain
- **Intelligente Extraktion**: Extrahiert nur relevanten Content (ohne Header, Footer, Navigation)
- **Mehrsprachig**: Unterstützt Websites in allen Sprachen
- **Re-Scraping**: Wissensquellen können bei Bedarf neu gescrapt werden
- **Status-Tracking**: Live-Status für jede Scraping-Operation

#### Implementierung (Backend erforderlich)

```typescript
// API Endpoint: POST /api/scrape-website
interface ScrapeRequest {
  url: string
  userId: string
  chatbotId?: string
}

interface ScrapeResponse {
  sourceId: string
  status: 'processing' | 'completed' | 'error'
  pagesFound: number
  errorMessage?: string
}
```

**Empfohlene Libraries:**
- **Puppeteer** oder **Playwright** - Für JavaScript-heavy Websites
- **Cheerio** - Für schnelles HTML Parsing
- **Sitemap Parser** - Für effizientes Crawling

### 2. Manuelles Wissen
- **Direkte Texteingabe**: Für spezifisches Wissen, FAQs, Custom Content
- **Strukturierte Informationen**: Unterstützt Markdown-Formatierung
- **Sofortige Verfügbarkeit**: Keine Verarbeitungszeit erforderlich

### 3. Datei-Upload
- **Unterstützte Formate**:
  - PDF (Text-basiert und OCR)
  - DOC/DOCX (Microsoft Word)
  - TXT (Plain Text)
  - Zukünftig: Excel, PowerPoint, CSV

#### Implementierung (Backend erforderlich)

```typescript
// API Endpoint: POST /api/upload-document
interface UploadRequest {
  file: File
  userId: string
  chatbotId?: string
}

interface UploadResponse {
  sourceId: string
  status: 'processing' | 'completed' | 'error'
  extractedText: string
  pageCount?: number
}
```

**Empfohlene Libraries:**
- **pdf-parse** - PDF Text Extraction
- **mammoth** - DOC/DOCX Processing
- **tesseract.js** - OCR für Bilder in PDFs

## Datenbank Schema

### Knowledge Sources Tabelle

```sql
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  chatbot_id UUID REFERENCES chatbots(id),
  type VARCHAR(20) NOT NULL, -- 'url', 'text', 'file'
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'error'
  metadata JSONB, -- { pageCount, fileSize, mimeType, etc. }
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Performance
CREATE INDEX idx_knowledge_sources_user_id ON knowledge_sources(user_id);
CREATE INDEX idx_knowledge_sources_chatbot_id ON knowledge_sources(chatbot_id);
CREATE INDEX idx_knowledge_sources_status ON knowledge_sources(status);
```

### Scraped Content Tabelle

```sql
CREATE TABLE scraped_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  metadata JSONB, -- { headings, links, images, etc. }
  embedding VECTOR(1536), -- Für Vektor-Suche (OpenAI, Cohere, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index für Vektor-Suche (mit pgvector extension)
CREATE INDEX idx_scraped_content_embedding ON scraped_content 
  USING ivfflat (embedding vector_cosine_ops);
```

## Backend API Endpoints

### 1. Scrape Website

```typescript
POST /api/knowledge/scrape

Body:
{
  "url": "https://example.com",
  "chatbotId": "optional-uuid"
}

Response:
{
  "sourceId": "uuid",
  "status": "processing",
  "message": "Website scraping started"
}
```

### 2. Add Manual Text

```typescript
POST /api/knowledge/text

Body:
{
  "content": "Your knowledge content here...",
  "chatbotId": "optional-uuid"
}

Response:
{
  "sourceId": "uuid",
  "status": "completed"
}
```

### 3. Upload File

```typescript
POST /api/knowledge/upload
Content-Type: multipart/form-data

Body:
{
  "file": File,
  "chatbotId": "optional-uuid"
}

Response:
{
  "sourceId": "uuid",
  "status": "processing",
  "fileName": "document.pdf"
}
```

### 4. Get All Sources

```typescript
GET /api/knowledge/sources?chatbotId=optional-uuid

Response:
{
  "sources": [
    {
      "id": "uuid",
      "type": "url",
      "content": "https://example.com",
      "status": "completed",
      "pageCount": 15,
      "createdAt": "2025-10-06T10:00:00Z",
      "lastUpdated": "2025-10-06T10:05:00Z"
    }
  ]
}
```

### 5. Delete Source

```typescript
DELETE /api/knowledge/sources/:sourceId

Response:
{
  "message": "Source deleted successfully"
}
```

### 6. Re-scrape Website

```typescript
POST /api/knowledge/scrape/:sourceId/refresh

Response:
{
  "sourceId": "uuid",
  "status": "processing",
  "message": "Re-scraping started"
}
```

## Scraping Architektur

### Worker-basierte Verarbeitung

Empfohlene Architektur für robustes Scraping:

```
User Request → API → Job Queue (Bull/BullMQ) → Worker Processes → Database
```

**Vorteile:**
- Keine Timeouts bei langen Scraping-Jobs
- Horizontale Skalierung möglich
- Retry-Mechanismen bei Fehlern
- Status-Tracking in Echtzeit

### Beispiel Worker Implementation

```typescript
// worker.ts
import Queue from 'bull'
import puppeteer from 'puppeteer'
import { createClient } from '@supabase/supabase-js'

const scrapeQueue = new Queue('website-scraping', process.env.REDIS_URL)

scrapeQueue.process(async (job) => {
  const { sourceId, url, userId } = job.data
  
  // Update status to processing
  await supabase
    .from('knowledge_sources')
    .update({ status: 'processing', last_updated: new Date() })
    .eq('id', sourceId)

  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    
    // Crawl website
    const results = await crawlWebsite(page, url)
    
    // Save scraped content
    for (const result of results) {
      await supabase
        .from('scraped_content')
        .insert({
          source_id: sourceId,
          url: result.url,
          title: result.title,
          content: result.content,
          metadata: result.metadata
        })
    }
    
    // Generate embeddings for vector search
    await generateEmbeddings(sourceId)
    
    // Update status to completed
    await supabase
      .from('knowledge_sources')
      .update({ 
        status: 'completed', 
        metadata: { pageCount: results.length },
        last_updated: new Date() 
      })
      .eq('id', sourceId)
    
    await browser.close()
  } catch (error) {
    // Update status to error
    await supabase
      .from('knowledge_sources')
      .update({ 
        status: 'error', 
        error_message: error.message,
        last_updated: new Date() 
      })
      .eq('id', sourceId)
    
    throw error
  }
})
```

## Vector Embeddings für intelligente Antworten

Um dem Chatbot zu ermöglichen, relevante Informationen zu finden:

### 1. Embeddings generieren

```typescript
import { OpenAI } from 'openai'

async function generateEmbeddings(sourceId: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  
  // Hole alle Inhalte für diese Source
  const { data: contents } = await supabase
    .from('scraped_content')
    .select('id, content')
    .eq('source_id', sourceId)
  
  for (const content of contents) {
    // Generiere Embedding
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: content.content
    })
    
    const embedding = response.data[0].embedding
    
    // Speichere Embedding
    await supabase
      .from('scraped_content')
      .update({ embedding })
      .eq('id', content.id)
  }
}
```

### 2. Relevante Inhalte finden

```typescript
async function findRelevantContent(query: string, chatbotId: string, limit = 5) {
  // Generiere Embedding für die Frage
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query
  })
  
  // Suche ähnliche Inhalte
  const { data } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding.data[0].embedding,
    match_threshold: 0.7,
    match_count: limit,
    filter_chatbot_id: chatbotId
  })
  
  return data
}

// SQL Funktion in Supabase
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  filter_chatbot_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  url TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sc.id,
    sc.content,
    sc.url,
    1 - (sc.embedding <=> query_embedding) AS similarity
  FROM scraped_content sc
  JOIN knowledge_sources ks ON ks.id = sc.source_id
  WHERE ks.chatbot_id = filter_chatbot_id
    AND 1 - (sc.embedding <=> query_embedding) > match_threshold
  ORDER BY sc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

## Integration in Chatbot

### Chatbot Antwort-Flow

```
User Message → Find Relevant Content → Generate Response with Context → Send to User
```

```typescript
async function generateChatbotResponse(message: string, chatbotId: string) {
  // 1. Finde relevante Inhalte
  const relevantContent = await findRelevantContent(message, chatbotId)
  
  // 2. Baue Kontext für LLM
  const context = relevantContent
    .map(item => `[${item.url}]\n${item.content}`)
    .join('\n\n---\n\n')
  
  // 3. Generiere Antwort mit GPT
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `Du bist ein hilfreicher Chatbot. Beantworte die Frage basierend auf dem folgenden Kontext. Wenn die Antwort nicht im Kontext enthalten ist, sage das ehrlich.\n\nKontext:\n${context}`
      },
      {
        role: 'user',
        content: message
      }
    ]
  })
  
  return response.choices[0].message.content
}
```

## Next Steps

1. **Backend API erstellen** - Node.js/Express oder Python/FastAPI
2. **Scraping Worker Setup** - Mit Bull Queue und Redis
3. **Supabase Datenbank** - Tabellen und Functions erstellen
4. **Vector Database** - pgvector Extension in Supabase aktivieren
5. **OpenAI Integration** - Für Embeddings und Chat Completions
6. **Testing** - Verschiedene Website-Typen testen

## Kosten-Überlegungen

### OpenAI API Kosten
- **Embeddings**: ~$0.0001 per 1K tokens
- **GPT-4 Turbo**: ~$0.01 per 1K input tokens, ~$0.03 per 1K output tokens

### Alternative: Open Source
- **Ollama** - Lokale LLMs (kostenlos, aber langsamer)
- **Sentence Transformers** - Kostenlose Embeddings (sentence-transformers/all-MiniLM-L6-v2)

## Sicherheit

- **Rate Limiting** - Verhindere Missbrauch (max. X Scrapes pro Tag)
- **Domain Whitelisting** - Optional: Nur bestimmte Domains erlauben
- **robots.txt Respekt** - Überprüfe robots.txt vor dem Scraping
- **User-Agent** - Setze sinnvollen User-Agent Header
- **DSGVO Compliance** - Speichere nur notwendige Daten

## Support

Bei Fragen zur Implementierung oder Problemen:
- GitHub Issues: [Repository Link]
- Dokumentation: Dieses Dokument
- Supabase Docs: https://supabase.com/docs
