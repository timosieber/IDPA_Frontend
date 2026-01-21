import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Models } from 'appwrite'
import { ID, OAuthProvider } from 'appwrite'
import { account } from '../lib/appwrite'
import { getUserInfo, type UserStatus } from '../lib/api'

type AppwriteUser = Models.User<Models.Preferences>

interface AuthContextType {
  user: AppwriteUser | null
  userStatus: UserStatus | null
  loading: boolean
  signInWithGoogle: () => Promise<AuthResult>
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>
  signUpWithEmail: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  refreshUserStatus: () => Promise<void>
}

type AuthResult = { error: string | null }

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppwriteUser | null>(null)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserStatus = async () => {
    try {
      const info = await getUserInfo()
      setUserStatus(info.status)
    } catch {
      setUserStatus(null)
    }
  }

  useEffect(() => {
    account
      .get()
      .then(async (currentUser) => {
        setUser(currentUser)
        await fetchUserStatus()
      })
      .catch(() => {
        setUser(null)
        setUserStatus(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      await account.createOAuth2Session(OAuthProvider.Google, `${window.location.origin}/dashboard`, window.location.origin)
      return { error: null }
    } catch (error) {
      return { error: getErrorMessage(error) }
    }
  }

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    try {
      await account.createEmailPasswordSession(email, password)
      const currentUser = await account.get()
      setUser(currentUser)
      await fetchUserStatus()
      return { error: null }
    } catch (error) {
      return { error: getErrorMessage(error) }
    }
  }

  const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    try {
      await account.create(ID.unique(), email, password, email.split('@')[0])
      await account.createEmailPasswordSession(email, password)
      const currentUser = await account.get()
      setUser(currentUser)
      await fetchUserStatus()
      return { error: null }
    } catch (error) {
      return { error: getErrorMessage(error) }
    }
  }

  const signOut = async () => {
    await account.deleteSession('current')
    setUser(null)
    setUserStatus(null)
  }

  const refreshUserStatus = async () => {
    await fetchUserStatus()
  }

  const value: AuthContextType = {
    user,
    userStatus,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    refreshUserStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }
  return 'Unbekannter Fehler'
}
