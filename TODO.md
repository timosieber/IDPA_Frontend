# Projekt-Roadmap / TODOs

Dieser Plan beschreibt detailliert, was für die End-to-End-Lösung zu bauen ist: Backend (Quelle der Wahrheit), Dashboard-Frontend (Verwaltung), Widget/Embed (Kundenintegration), Infrastruktur/DevOps, Sicherheit und Qualitätssicherung.

## Ziele (High-Level)
- [x] Chatbot-Objekte erstellen, verwalten und hosten (Backend als Source of Truth)
- [x] Benutzer-Auth via Appwrite (Admin/Dashboard), anonyme Widget-Nutzung via Sessions
- [ ] Einbettbarer Chatbot (Loader `embed.js` + Widget-Iframe) inkl. Domain-Allowlist und Session-Token
- [ ] Trainings-/Wissensquellen verwalten (Mock → später echte Pipeline)
- [ ] Monitoring/Analytics (Nutzungsmetriken, Fehler, Ratenbegrenzung)

## Architektur-Leitlinien
- [x] Klare Trennung: Auth/Benutzerverwaltung (Appwrite) vs. Fachlogik/Chatbots (Backend)
- [x] Backend verwaltet IDs, Datenmodell, Sicherheits- und Ratenlimits
- [x] Widget (Iframe) kommuniziert nur über öffentliche, minimal berechtigte Endpunkte
- [x] Konfiguration über Env-Variablen, Secrets nie ins Frontend bundeln
- [ ] Versionierte, statische Auslieferung von `embed.js` via CDN

---

## Backend (API & Services)

### 1) Datenmodell
- [x] `users` (optional, wenn Appwrite User gespiegelt werden müssen: `id`, `email`, `createdAt`)
- [x] `chatbots` (`id`, `userId`, `name`, `description`, `allowedDomains[]`, `theme`, `model`, `status`, `createdAt`, `updatedAt`)
- [x] `sessions` (`id`, `chatbotId`, `origin`, `ip`, `expiresAt`, `createdAt`)
- [x] `messages` (`id`, `sessionId`, `role` [user|assistant|system], `content`, `createdAt`)
- [ ] (optional) `analytics_events` (`id`, `chatbotId`, `event`, `meta`, `createdAt`)
- [x] (optional) Wissensbasis-Tabellen: `knowledge_sources`, `scraped_content`, `embeddings`

Akzeptanzkriterien:
- [x] Eindeutige Indizes (z. B. `chatbots.id`, `sessions.id`)
- [x] Foreign Keys (z. B. `sessions.chatbotId → chatbots.id`)

### 2) Authentifizierung & Autorisierung
- [x] Admin-Endpunkte schützen (Appwrite JWT/Session verifizieren → Besitzerrechte auf `chatbots.userId` prüfen)
- [x] Öffentliche Widget-Endpunkte: Nur erforderliche Daten; Schutz über Domain-Allowlist + ephemere Tokens

### 3) Endpunkte (erste Iteration)
- [x] `POST /api/chatbots` (auth): Chatbot anlegen
  - Input: `{ name, description?, allowedDomains, theme?, model? }`
  - Output: `{ id, ... }`
- [x] `GET /api/chatbots` (auth): Liste der eigenen Chatbots
- [x] `GET /api/chatbots/:id` (auth): Details (nur Owner)
- [x] `PATCH /api/chatbots/:id` (auth): Update (Name, Domain-Liste, Theme, Model)
- [x] `DELETE /api/chatbots/:id` (auth)
- [x] `POST /api/chat/sessions` (public): Session für Widget erzeugen
  - Prüft `Origin`/`Referer` gegen `allowedDomains`
  - Liefert `{ sessionId, token (kurzlebig) }`
- [x] `POST /api/chat/messages` (public): Nutzerfrage → Antwort
  - Input: `{ sessionId, message }` + Header `Authorization: Bearer <token>`
  - Output: gestreamte Antwort (SSE) oder Chunked JSON

Akzeptanzkriterien:
- [x] 403, wenn Domain nicht erlaubt ist
- [x] 401, wenn Token ungültig/abgelaufen ist
- [x] Rate Limit (z. B. pro `sessionId`/IP)

### 4) Chat-Logik
- [x] Einfache Echo-/Mock-Antworten (MVP), danach LLM-Integration (OpenAI) mit Streaming
- [x] (optional) Retrieval über Embeddings/Vector-DB
- [x] Konsistente Protokollierung der Konversation (`messages`)

### 5) Training/Wissensbasis (später)
- [x] Endpunkte für Quellen: `POST /api/knowledge/sources`, `GET /api/knowledge/sources`, `DELETE /...`
- [x] Scraping-Worker (Queue), Persistenz, Embeddings-Generierung
- [x] Relevanzsuche (pgvector/Vector-Store)

### 6) Qualitätssicherung
- [ ] Unit-Tests: Services (Tokening, Domain-Checks, Rate Limits, Parser)
- [ ] API-Tests: Authz, CORS, Fehlerfälle
- [ ] Load-Test (Basis) für `messages`

---

## Frontend (Dashboard)

### 1) Auth & Routing
- [ ] Appwrite Login (E-Mail/Passwort, Google OAuth) – bereits integriert
- [ ] Protected Routes für `/dashboard`, `/training`
- [ ] Session-Handling (Account.get, signOut)

### 2) Chatbots-Verwaltung
- [ ] Liste + Detailseite je Chatbot
- [ ] Create-/Edit-Form (Name, Allowed Domains, Theme, Model)
- [ ] „Embed-Code anzeigen“ (Snippet-Dialog)
- [ ] Delete mit Bestätigung

### 3) Training (UI)
- [ ] Quellen hinzufügen (URL/Text/Datei) – zunächst Mock
- [ ] Statusliste der Quellen; Rescrape/Aktualisieren
- [ ] Fehler-/Erfolgszustände

### 4) API-Client (Frontend)
- [ ] Typed Client für Backend-Endpunkte (fetch/Axios)
- [ ] Fehler- und Loading-Handling, Toasts
- [ ] Auth Header (Appwrite Session/JWT) für Admin-Endpunkte

### 5) UX/Qualität
- [ ] Responsives Layout, Tastatursteuerung, a11y
- [ ] i18n (optional), Dark Mode (optional)

Akzeptanzkriterien:
- [ ] Nach dem Erstellen wird `chatbotId` angezeigt und Snippet kann kopiert werden
- [ ] Allowed Domains UI verhindert leere/ungültige Hostnames

---

## Widget / Embed

### 1) Loader-Script (`embed.js`)
- [ ] Liest `window.ChatBotConfig` oder `data-*`-Attribute (mind. `chatbotId`)
- [ ] Injektion eines Launchers + Iframe (position fixed, z-index hoch)
- [ ] Versioniert ausliefern: `https://cdn.example.com/embed.js?v=1`
- [ ] Fehlerbehandlung (fehlende `chatbotId`, Blockaden)

### 2) Iframe-Widget (Micro-Frontend)
- [ ] Seite `https://widgets.example.com/chat?chatbotId=...`
- [ ] Startet mit `POST /api/chat/sessions` → erhält `{ sessionId, token }`
- [ ] Senden von Nachrichten via `POST /api/chat/messages` (SSE-Stream anzeigen)
- [ ] Theming (Farbe, Eckenradius) via Query-Params oder Runtime-API (`postMessage`)
- [ ] A11y: Fokusfallen, ARIA-Rollen, Screenreader-Texte

### 3) Kommunikation & Sicherheit
- [ ] `postMessage`-Kanal für Open/Close, Theme-Wechsel (optional)
- [ ] `sandbox`/`allow`-Attribute fürs Iframe minimal halten
- [ ] CORS nur für erlaubte Origins

### 4) Snippet-Generator (im Dashboard)
- [ ] Anzeige des Codes zum Einbetten (copy-to-clipboard)
- [ ] Hinweise zu CSP (falls Kunden CSP nutzen)

Akzeptanzkriterien:
- [ ] Kunden-Seite kann mit 2 Snippet-Zeilen den Chatbot einbinden
- [ ] Domain-Allowlist erzwingt 403 bei nicht erlaubten Hosts

---

## Sicherheit, Compliance, Stabilität
- [x] CORS: nur erlaubte Domains, preflight getestet
- [x] Rate Limiting/DoS-Schutz auf `sessions` und `messages`
- [x] Token-TTL kurz (z. B. 1h), Refresh-Flow optional
- [x] Input-Validierung (Hostnamen, URLs, Größenlimits)
- [x] Logging: strukturierte Logs (Korrelation über `sessionId`)
- [ ] Privacy: personenbezogene Daten minimieren/anonymisieren

---

## Infrastruktur & Deployment
- [x] Env-Variablen definieren (Backend: Keys, DB, OpenAI, JWT_SECRET, CORS_ORIGINS)
- [ ] Statische Auslieferung `embed.js`/Widget via CDN (Cache, Immutable-Assets)
- [x] Backend als Container (Docker) + Orchestrierung (Railway/Vercel functions/Render/Fly.io/CloudRun)
- [ ] CI/CD: Lint, Test, Build, Deploy; Tagging/Versionierung
- [ ] Monitoring/Alerting: Uptime, Fehlerquoten, Latenzen, Rate-Limits

---

## Meilensteine (inkrementell)
1. [x] MVP Backend: `POST /chatbots`, `POST /chat/sessions`, `POST /chat/messages` (Mock)
2. [ ] Dashboard: Chatbot CRUD + Snippet-Dialog
3. [ ] `embed.js` + Iframe-Widget (lokal testbar)
4. [x] Domain-Allowlist + Token-Absicherung (E2E)
5. [ ] LLM-Streaming (OpenAI) in `/chat/messages`
6. [ ] Basic Analytics (Zählung Sessions/Anfragen), Rate Limit
7. [ ] Trainings-UI (Mock) → später Scraping/Embeddings

---

## Definition of Done (DoD)
- [ ] Build & Tests in CI grün
- [x] Dokumentierte Endpunkte (OpenAPI/README)
- [ ] Snippet funktioniert auf externer Demo-Seite (Allowlist greift)
- [ ] Fehlerpfade (401/403/429/5xx) eindeutig und getestet
- [ ] Logging/Monitoring aktiv
