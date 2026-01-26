'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { authApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  user_id: number
  username: string
  email: string
  subscription_level: string
  first_time_login: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (usernameOrEmail: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = Cookies.get('auth_token')
    const storedUser = Cookies.get('user')
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        Cookies.remove('auth_token')
        Cookies.remove('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const response = await authApi.login(usernameOrEmail, password)
      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data
        
        // Store token and user in cookies
        Cookies.set('auth_token', newToken, { expires: 7 }) // 7 days
        Cookies.set('user', JSON.stringify(userData), { expires: 7 })
        
        setToken(newToken)
        setUser(userData)
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      throw error
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await authApi.signup(username, email, password)
      if (!response.success) {
        throw new Error(response.message || 'Sign up failed')
      }
      // After signup, user needs to verify email before login
    } catch (error: any) {
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('auth_token')
    Cookies.remove('user')
    setToken(null)
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
