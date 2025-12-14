import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { authAPI } from "../lib/api"

const AuthContext = createContext()

const STORAGE_KEYS = {
  TOKEN: "jwt_token",
  USER: "user_data",
}

// ---------- Utils ----------
const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
}

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    )
  } catch {
    return null
  }
}

const validateToken = (token) => {
  const payload = decodeJWT(token)
  if (!payload) return false

  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && payload.exp < now) return false

  return true
}

// ---------- Provider ----------
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const initializeAuth = useCallback(() => {
    try {
      setLoading(true)

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
      const userStr = localStorage.getItem(STORAGE_KEYS.USER)

      if (!token || !validateToken(token)) {
        clearAuthData()
        setIsAuthenticated(false)
        setUser(null)
        return
      }

      setIsAuthenticated(true)
      setUser(userStr ? JSON.parse(userStr) : null)
    } catch {
      clearAuthData()
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const login = async (email, password) => {
    const response = await authAPI.login(email, password)

    const token = response.token ?? response.access_token
    if (!token) throw new Error("No token received")

    localStorage.setItem(STORAGE_KEYS.TOKEN, token)

    const userData = response.user ?? { email }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))

    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = () => {
    clearAuthData()
    setUser(null)
    setIsAuthenticated(false)
    authAPI.logout?.()
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
