import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import WaitlistPage from '../pages/WaitlistPage'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, userStatus, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  // User is on waitlist - show waitlist page instead of dashboard
  if (userStatus === 'WAITLIST') {
    return <WaitlistPage />
  }

  return <>{children}</>
}
