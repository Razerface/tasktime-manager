import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PREDEFINED_USERS = {
  'admin@admin.com': { password: 'admin', isPremium: true },
  'user1@user.com': { password: 'user', isPremium: false }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    if (email === "Admin" && password === "Admin187") {
      setIsAdmin(true)
      return
    }

    // Check predefined users first
    if (PREDEFINED_USERS[email]) {
      if (PREDEFINED_USERS[email].password === password) {
        setUser({ 
          email, 
          id: email,
          // Add other required User properties
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: { isPremium: PREDEFINED_USERS[email].isPremium },
          created_at: new Date().toISOString()
        } as User)
        return
      }
      throw new Error('Invalid credentials')
    }

    // If not a predefined user, try Supabase auth
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp,
      signInWithGoogle, 
      signOut, 
      isAdmin, 
      setIsAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}