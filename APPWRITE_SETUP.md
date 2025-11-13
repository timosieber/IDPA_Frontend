# Appwrite Setup Guide

Diese Anleitung beschreibt Schritt für Schritt, wie Sie Appwrite so konfigurieren, dass die Authentifizierung im ChatBot-Studio funktioniert. Nutzen Sie wahlweise das bestehende Projekt (`6914520c000ee1da7505` am Endpoint `https://fra.cloud.appwrite.io/v1`) oder legen Sie ein eigenes an.

## 1. Neues Projekt in Appwrite anlegen (optional)

1. Öffnen Sie die [Appwrite Console](https://cloud.appwrite.io/)
2. Klicken Sie auf **New Project**
3. Vergeben Sie einen Namen (z. B. `ChatBot Studio`) und bestätigen Sie
4. Notieren Sie sich die `Project ID` (z. B. `6914520c000ee1da7505`)

> Wenn Sie das bereits vorbereitete Projekt verwenden möchten, können Sie diesen Abschnitt überspringen und direkt mit Schritt 2 fortfahren.

## 2. Web-App registrieren

1. Öffnen Sie Ihr Projekt in der Appwrite Console
2. Navigieren Sie zu **Settings → Platforms → Add Platform**
3. Wählen Sie **Web App**
4. Tragen Sie als Hostnamen (ohne Protokoll/Port) ein:
   - `localhost` (Port 5173 separat im Feld „Port“ eintragen)
   - Produktionsdomain, z. B. `chatbotstudio.example.com`
5. Speichern Sie die Plattform

## 3. Authentifizierungsanbieter konfigurieren

### E-Mail/Passwort aktivieren
1. Gehen Sie zu **Authentication → Providers → Email/Password**
2. Stellen Sie sicher, dass der Provider aktiviert ist

### Google OAuth aktivieren
1. In **Authentication → Providers → Google** den Schalter aktivieren
2. Client ID & Client Secret aus der [Google Cloud Console](https://console.cloud.google.com/) eintragen
3. Folgende Redirect URLs bei Google hinterlegen:
   - `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback`
   - `https://<Ihre-Domain>/dashboard`
   - `http://localhost:5173/dashboard`
4. In Appwrite unter „Allowed Redirect URLs“ dieselben URLs hinzufügen

## 4. Environment Variablen setzen

Im Projektverzeichnis:

```bash
cp .env.example .env
```

Passen Sie folgende Variablen an (falls Sie ein eigenes Projekt verwenden):

```
VITE_APPWRITE_PROJECT_ID=<Ihre Project ID>
VITE_APPWRITE_API_ENDPOINT=<Ihr Endpoint, z. B. https://fra.cloud.appwrite.io/v1>
```

## 5. Lokale Entwicklung testen

1. `npm install`
2. `npm run dev`
3. Browser öffnen: `http://localhost:5173`
4. Im Header auf „Anmelden“ klicken → Login Modal erscheint
5. Testen Sie E-Mail/Passwort oder Google Login
6. Nach erfolgreichem Login sollten Dashboard & Training ohne Redirects erreichbar sein

## 6. Produktion vorbereiten

1. Build erstellen: `npm run build`
2. Statisches Verzeichnis (`dist/`) auf Ihre Hosting-Plattform hochladen (z. B. Railway, Netlify, Vercel)
3. In Appwrite die Produktionsdomain zur Web-Plattform und zu den Redirect URLs hinzufügen
4. `.env` Variablen im Hosting-Provider setzen

## 7. Troubleshooting

| Problem | Ursache | Lösung |
| --- | --- | --- |
| OAuth liefert „invalid success url“ | Redirect URL fehlt in Appwrite oder Google | Redirect URL exakt übernehmen (inkl. https/http) |
| Login-Modal schließt sich nicht nach E-Mail Login | Session konnte nicht erzeugt werden | Appwrite Logs prüfen (Authentication → Logs) und Credentials kontrollieren |
| 401 / 403 Fehler beim SDK | Projekt-ID oder Endpoint falsch | `.env` überprüfen und Server neu starten |

## 8. Nächste Schritte

- Optional weitere Provider aktivieren (GitHub, Microsoft)
- E-Mail-Vorlagen in Appwrite anpassen (Authentication → Templates)
- Sicherheitsregeln für zukünftige Datenbanken definieren

Mit dieser Konfiguration verwendet das Frontend ausschließlich Appwrite für Authentifizierung, sodass Supabase komplett ersetzt ist.
