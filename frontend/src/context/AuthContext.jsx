import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authService from '../services/authService.jsx'
import userService from '../services/userService.jsx'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — rehydrate user from stored JWT
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      userService.getMe()
        .then((userData) => setUser(userData))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (credentials) => {
    await authService.register(credentials)
    await authService.login({ email: credentials.email, password: credentials.password })
    const me = await userService.getMe()
    setUser(me)
    return me
  }, [])

  const login = useCallback(async (credentials) => {
    await authService.login(credentials)
    const me = await userService.getMe()
    setUser(me)
    return me
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const me = await userService.getMe()
    setUser(me)
    return me
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
