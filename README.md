# ChatBot Studio

A modern React application for creating AI chatbots with Google OAuth authentication via Supabase.

## Features

- 🤖 Modern chatbot creation platform
- 🎨 Clean, responsive UI with Tailwind CSS
- ⚡ Built with React + TypeScript + Vite
- 🔐 Google OAuth authentication via Supabase
- 📱 Mobile-friendly design
- 🛡️ Protected routes with authentication
- 👤 User dashboard

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Backend**: Supabase (Authentication & Database)

## Development

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Supabase Setup

### 1. Google OAuth Configuration

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://hghvpzonubmaenykwtku.supabase.co/auth/v1/callback`
     - `http://localhost:5173/dashboard` (for local development)
   - Copy Client ID and Client Secret to Supabase

### 2. Authentication Settings

In Supabase Dashboard > Authentication > URL Configuration:
- Site URL: `http://localhost:5173` (development) or your production URL
- Redirect URLs: Add `http://localhost:5173/dashboard` and your production dashboard URL

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx    # Route protection wrapper
├── contexts/
│   └── AuthContext.tsx        # Authentication context & hooks
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── pages/
│   ├── LandingPage.tsx       # Public landing page
│   └── Dashboard.tsx         # Protected dashboard
├── App.tsx                   # Main app with routing
└── main.tsx                  # Entry point with providers
```

## Authentication Flow

1. User clicks "Sign In" on landing page
2. Redirected to Google OAuth
3. After successful authentication, redirected to `/dashboard`
4. Protected routes check authentication status
5. Unauthenticated users are redirected to landing page

## Deployment

### Railway
This project is configured for deployment on Railway:

1. Connect your GitHub repository to Railway
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Railway will automatically detect the build configuration
4. Update Supabase redirect URLs with your production domain

### Environment Variables
Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```
