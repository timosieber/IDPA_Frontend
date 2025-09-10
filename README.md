# ChatBot Studio

A modern React application for creating AI chatbots with Google OAuth authentication.

## Features

- 🤖 Modern chatbot creation platform
- 🎨 Clean, responsive UI with Tailwind CSS
- ⚡ Built with React + TypeScript + Vite
- 🔐 Google OAuth authentication (coming soon)
- 📱 Mobile-friendly design

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment

### Railway
This project is configured for deployment on Railway:

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the build configuration
3. The app will be deployed with the production build

### Environment Variables
Add these environment variables in Railway dashboard:
- `VITE_GOOGLE_CLIENT_ID` (for Google OAuth)

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```
