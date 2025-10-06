# Supabase Google OAuth Setup Anleitung

## Schritt 1: Google Cloud Console Setup

1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes aus
3. Navigieren Sie zu "APIs & Services" > "Credentials"
4. Klicken Sie auf "Create Credentials" > "OAuth 2.0 Client ID"
5. Konfigurieren Sie den OAuth consent screen:
   - User Type: External
   - App name: ChatBot Studio
   - User support email: Ihre E-Mail
   - Developer contact: Ihre E-Mail

6. Erstellen Sie OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: ChatBot Studio
   - Authorized redirect URIs:
     ```
     https://hghvpzonubmaenykwtku.supabase.co/auth/v1/callback
     http://localhost:5173/dashboard
     ```

7. Kopieren Sie:
   - Client ID
   - Client Secret

## Schritt 2: Supabase Configuration

1. Öffnen Sie Ihr Supabase Dashboard: https://hghvpzonubmaenykwtku.supabase.co
2. Gehen Sie zu "Authentication" > "Providers"
3. Finden Sie "Google" und aktivieren Sie es
4. Fügen Sie ein:
   - Client ID (aus Google Cloud Console)
   - Client Secret (aus Google Cloud Console)
5. Klicken Sie auf "Save"

## Schritt 3: URL Configuration in Supabase

1. Gehen Sie zu "Authentication" > "URL Configuration"
2. Konfigurieren Sie:
   - **Site URL**: 
     - Development: `http://localhost:5173`
     - Production: Ihre Railway URL (z.B. `https://ihr-projekt.railway.app`)
   
   - **Redirect URLs** (fügen Sie beide hinzu):
     - `http://localhost:5173/dashboard`
     - `https://ihr-projekt.railway.app/dashboard`

## Schritt 4: Test der Authentication

1. Starten Sie die App lokal: `npm run dev`
2. Öffnen Sie http://localhost:5173
3. Klicken Sie auf "Sign In"
4. Sie sollten zum Google Login weitergeleitet werden
5. Nach erfolgreicher Anmeldung werden Sie zum Dashboard weitergeleitet

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Überprüfen Sie, ob die redirect URIs in Google Cloud Console genau mit der Supabase Callback URL übereinstimmen
- Format: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

### Error: "Invalid redirect URL"
- Stellen Sie sicher, dass alle URLs in Supabase > Authentication > URL Configuration hinzugefügt wurden
- URLs müssen exakt übereinstimmen (inkl. http/https, Ports, Pfade)

### Login funktioniert, aber keine Weiterleitung zum Dashboard
- Überprüfen Sie die Site URL in Supabase
- Überprüfen Sie, ob `/dashboard` in den Redirect URLs ist
- Prüfen Sie die Browser Console auf Fehler

## Production Deployment (Railway)

1. Deployen Sie Ihr Projekt auf Railway
2. Kopieren Sie die Railway URL (z.B. `https://chatbot-studio.railway.app`)
3. Fügen Sie in Google Cloud Console hinzu:
   - Authorized redirect URI: `https://hghvpzonubmaenykwtku.supabase.co/auth/v1/callback`
4. Aktualisieren Sie in Supabase > Authentication > URL Configuration:
   - Site URL: `https://chatbot-studio.railway.app`
   - Redirect URLs: `https://chatbot-studio.railway.app/dashboard`

## Environment Variables

Stellen Sie sicher, dass diese Variablen gesetzt sind:

**Lokal (.env):**
```
VITE_SUPABASE_URL=https://hghvpzonubmaenykwtku.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnaHZwem9udWJtYWVueWt3dGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NzQ1MjAsImV4cCI6MjA3NTM1MDUyMH0.ETRdFNbFbpEsgxbNeKkURSV8j_B_ugIki3ewbqG-D2Q
```

**Railway (Environment Variables):**
- Fügen Sie die gleichen Variablen im Railway Dashboard hinzu

## Sicherheitshinweise

⚠️ **WICHTIG:**
- Teilen Sie niemals Ihren `service_role` Secret Key
- Der `anon` public key ist sicher für das Frontend
- Committen Sie niemals die `.env` Datei (ist bereits in `.gitignore`)
- Rotieren Sie Ihre Keys, wenn sie versehentlich öffentlich wurden

## Support

Bei Problemen:
1. Überprüfen Sie die Supabase Logs unter "Logs" > "Auth Logs"
2. Prüfen Sie die Browser Developer Console
3. Supabase Dokumentation: https://supabase.com/docs/guides/auth
