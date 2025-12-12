import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadMe = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
    } catch {
      setUser(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }
    loadMe()
  }, [])

  const login = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const register = async ({ username, email, password, role }) => {
    const { data } = await api.post('/auth/register', { username, email, password, role })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      refresh: loadMe,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
