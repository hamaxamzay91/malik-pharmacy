import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

// Mock user for testing (بەبێ Backend)
const MOCK_USERS = [
  { id: 1, name: 'Admin', email: 'admin@malik.com', role: 'admin', avatar: null },
  { id: 2, name: 'هاما', email: 'hama@malik.com', role: 'customer', avatar: null },
]

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check saved session
    const saved = localStorage.getItem('mp_user')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    // Try real API first
    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        const data = await res.json()
        const { token, user } = data.data
        localStorage.setItem('mp_token', token)
        localStorage.setItem('mp_user', JSON.stringify(user))
        setUser(user)
        return user
      }
    } catch {
      // API not available, use mock
    }

    // Mock login fallback
    const found = MOCK_USERS.find(u => u.email === email)
    if (found && password === 'password') {
      localStorage.setItem('mp_user', JSON.stringify(found))
      setUser(found)
      return found
    }

    throw new Error('Invalid credentials')
  }, [])

  const register = useCallback(async (data) => {
    const newUser = { id: Date.now(), name: data.name, email: data.email, role: 'customer' }
    localStorage.setItem('mp_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mp_token')
    localStorage.removeItem('mp_user')
    setUser(null)
    toast.success('دەرچووی ✓')
  }, [])

  const updateUser = useCallback((data) => {
    setUser(prev => {
      const updated = { ...prev, ...data }
      localStorage.setItem('mp_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
