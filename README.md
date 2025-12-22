# ChatBot Studio

A modern React application for creating AI chatbots. Der Fokus liegt auf einer hochwertigen Frontend-Demo mit Appwrite-gestützter Authentifizierung (Google & E-Mail) und interaktiven Mock-Datenflüssen.

## Features

- 🤖 Modern chatbot creation platform
- 🎨 Clean, responsive UI with Tailwind CSS
- ⚡ Built with React + TypeScript + Vite
- 📱 Mobile-friendly design
- 🧭 Mehrseitige Demo (Landing, Dashboard, Training)
- 🔐 Appwrite Auth (Google OAuth + E-Mail/Passwort)
- 🧪 Interaktive Mock-Workflows

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM 7
- **Auth**: Appwrite Account API

## Development

1. Install dependencies:
```bash
npm install
```

2. Kopiere `.env.example` zu `.env` und passe ggf. Projekt-ID oder Endpoint an (Defaults zeigen auf das bereitgestellte Projekt `6914520c000ee1da7505`).

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # UI building blocks (LoginModal, ProtectedRoute, ...)
├── contexts/            # AuthContext mit Appwrite-Integration
├── lib/                 # Appwrite-Client
├── pages/               # Landing, Dashboard, Training
├── assets/              # Static images & icons
├── App.tsx              # Route definitions
└── main.tsx             # Application entrypoint

```

## Appwrite Setup

Standard-Environment Variablen (siehe `.env.example`):

```
VITE_APPWRITE_PROJECT_ID=6914520c000ee1da7505
VITE_APPWRITE_API_ENDPOINT=https://fra.cloud.appwrite.io/v1
```

Falls Sie ein eigenes Appwrite-Projekt verwenden möchten:

1. Projekt in der Appwrite Console anlegen und Auth-Provider „Google“ aktivieren.
2. Redirect URLs konfigurieren (`https://<domain>/dashboard` sowie `http://localhost:5173/dashboard`).
3. Projekt-ID und Endpoint in `.env` hinterlegen.
4. Optional: weitere OAuth-Provider oder E-Mail-Vorlagen konfigurieren.

👉 Eine detaillierte Schritt-für-Schritt-Anleitung finden Sie in `APPWRITE_SETUP.md`.

## Deployment

### Railway
Dieses Frontend enthält einen eingebauten Express-Proxy, damit das Backend intern (Railway internal) erreichbar bleibt und das Frontend die API unter `/api/*` bereitstellt.

1. Verbinde das GitHub-Repo mit Railway
2. Setze Environment Variablen im Frontend-Service:
   - `VITE_APPWRITE_PROJECT_ID`
   - `VITE_APPWRITE_API_ENDPOINT`
   - `INTERNAL_BACKEND_URL` (z. B. `http://idpa-backend.railway.internal:8080` — Port muss dem `PORT` vom Backend-Service entsprechen; oft `8080` auf Railway)
3. Start Command des Frontends: `npm start` (läuft `server/serve.mjs`)
4. Das Frontend servt `dist/` und proxyt `/api/*` an `INTERNAL_BACKEND_URL`
