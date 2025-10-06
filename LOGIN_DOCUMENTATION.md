# Login System - Dokumentation

## Übersicht

Das ChatBot Studio verwendet ein flexibles Authentifizierungssystem mit mehreren Anmeldeoptionen.

## Anmeldemethoden

### 1. Google OAuth
- Schnelle Anmeldung mit Google-Konto
- Keine Passwortverwaltung erforderlich
- Automatische Profildaten (Name, Avatar)

### 2. E-Mail & Passwort
- Klassische Anmeldung mit E-Mail und Passwort
- Registrierung neuer Benutzer möglich
- Mindestanforderung: 6 Zeichen Passwort

## Benutzerfluss

### Neue Benutzer (Registrierung)
1. Klick auf "Anmelden" Button
2. Login-Modal öffnet sich
3. Wählen zwischen:
   - "Mit Google registrieren" - Sofortige OAuth-Weiterleitung
   - E-Mail-Formular ausfüllen und "Konto erstellen"
4. Toggle zu "Noch kein Konto? Registrieren"

### Bestehende Benutzer (Login)
1. Klick auf "Anmelden" Button
2. Login-Modal öffnet sich
3. Wählen zwischen:
   - "Mit Google anmelden" - OAuth-Weiterleitung
   - E-Mail & Passwort eingeben und "Anmelden"

### Nach erfolgreicher Anmeldung
- Automatische Weiterleitung zum Dashboard
- Session wird gespeichert (bleibt angemeldet)
- User-Daten werden im AuthContext gespeichert

## Komponenten

### LoginModal (`src/components/LoginModal.tsx`)
- Modal-Dialog für Authentifizierung
- Umschaltung zwischen Sign In / Sign Up
- Google OAuth Button
- E-Mail/Passwort Formular
- Error-Handling und Loading-States

### AuthContext (`src/contexts/AuthContext.tsx`)
Bereitgestellte Funktionen:
- `signInWithGoogle()` - Google OAuth Login
- `signInWithEmail(email, password)` - E-Mail Login
- `signUpWithEmail(email, password)` - E-Mail Registrierung
- `signOut()` - Logout
- `user` - Aktueller Benutzer
- `session` - Aktuelle Session
- `loading` - Loading State

### ProtectedRoute (`src/components/ProtectedRoute.tsx`)
- Schützt Routen vor unautorisierten Zugriffen
- Zeigt Loading-Spinner während Auth-Check
- Leitet zu Landing Page um, wenn nicht angemeldet

## Supabase Konfiguration

### E-Mail Authentication aktivieren
1. Supabase Dashboard öffnen
2. Authentication → Providers
3. "Email" Provider ist standardmäßig aktiviert
4. Optional: E-Mail-Bestätigung konfigurieren

### Google OAuth konfigurieren
Siehe `SUPABASE_SETUP.md` für detaillierte Anleitung

## Sicherheit

### Passwort-Anforderungen
- Minimum 6 Zeichen
- Wird von Supabase sicher gehasht
- Niemals im Klartext gespeichert

### Session-Management
- JWT-basierte Sessions
- Automatische Token-Erneuerung
- Sichere Cookie-Speicherung

### OAuth Security
- OAuth 2.0 Standard
- Redirect URI Validation
- State Parameter gegen CSRF

## Fehlerbehandlung

### Häufige Fehler

**"Invalid login credentials"**
- Falsche E-Mail oder Passwort
- Lösung: Credentials prüfen oder Passwort zurücksetzen

**"Email not confirmed"**
- E-Mail-Bestätigung erforderlich
- Lösung: Bestätigungs-E-Mail prüfen

**"User already registered"**
- E-Mail bereits in Verwendung
- Lösung: Mit bestehendem Konto anmelden

**OAuth Fehler**
- Siehe `SUPABASE_SETUP.md` Troubleshooting

## Testing

### Lokal testen
```bash
npm run dev
```

1. Öffne http://localhost:5173
2. Klicke "Anmelden"
3. Wähle Anmeldemethode
4. Nach Login: Weiterleitung zu /dashboard

### E-Mail Test-Account erstellen
1. Modal öffnen
2. "Noch kein Konto? Registrieren"
3. test@example.com eingeben
4. Passwort (mind. 6 Zeichen)
5. "Konto erstellen"

## Anpassungen

### Modal-Styling ändern
Datei: `src/components/LoginModal.tsx`
- Tailwind CSS Klassen anpassen
- Farben in Buttons ändern
- Layout anpassen

### Zusätzliche OAuth Provider
1. In `AuthContext.tsx` neue Funktion hinzufügen:
```typescript
const signInWithProvider = async (provider: 'github' | 'facebook') => {
  return await supabase.auth.signInWithOAuth({ provider })
}
```

2. In `LoginModal.tsx` Button hinzufügen

3. In Supabase Provider aktivieren

### Passwort-Reset implementieren
```typescript
const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email)
}
```

## Best Practices

1. **Niemals** Passwörter im Code speichern
2. **Immer** HTTPS in Production verwenden
3. **Validieren** Sie Eingaben client-side und server-side
4. **Informieren** Sie Benutzer bei Fehlern klar
5. **Testen** Sie alle Auth-Flows gründlich

## Weitere Ressourcen

- [Supabase Auth Dokumentation](https://supabase.com/docs/guides/auth)
- [OAuth 2.0 Spezifikation](https://oauth.net/2/)
- [React Context API](https://react.dev/reference/react/useContext)
