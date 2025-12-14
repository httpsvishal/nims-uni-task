import { createContext, useContext, useState, useEffect, useCallback } from "react"

import { authAPI } from "../lib/api"

const AuthContext = createContext()

// Standardized localStorage keys
const STORAGE_KEYS = {
  TOKEN: "jwt_token",
  USER: "user_data", 
  AUTHENTICATED: "isAuthenticated"
}

// Utility function to clear all auth data
const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
  localStorage.removeItem(STORAGE_KEYS.AUTHENTICATED)
  localStorage.removeItem("access_token")
  localStorage.removeItem("auth_token")
}

// Utility function to validate JWT token
const validateToken = (token) => {
  try {
    if (!token) return false
    
    // Simple JWT format validation
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.log("Invalid token format")
      return false
    }
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      console.log("Token expired")
      return false
    }
    
    // Additional validation: check if token has required fields
    if (!payload.sub && !payload.email) {
      console.log("Token missing required fields")
      return false
    }
    
    console.log("Token is valid")
    return true
  } catch (error) {
    console.error("Token validation error:", error)
    return false
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || 
                   localStorage.getItem("access_token") || 
                   localStorage.getItem("auth_token")
      const userStr = localStorage.getItem(STORAGE_KEYS.USER)
      const isAuthStr = localStorage.getItem(STORAGE_KEYS.AUTHENTICATED)

      if (token && userStr && isAuthStr === "true") {
        // Validate token
        const isValidToken = validateToken(token)
        
        if (isValidToken) {
          const userData = JSON.parse(userStr)
          setUser(userData)
          setIsAuthenticated(true)
          console.log("Auth initialized: User authenticated")
        } else {
          // Token is invalid, clear all auth data
          console.log("Stored token is invalid, clearing auth data")
          clearAuthData()
          setUser(null)
          setIsAuthenticated(false)
        }
      } else {
        // No valid auth data found
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Error initializing auth:", error)
      // Clear invalid data
      clearAuthData()
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const login = async (email, password) => {
    try {
      console.log("Attempting login...")
      const response = await authAPI.login(email, password)
      
      // Ensure we have the token and user data
      if (!response.token && !response.access_token) {
        throw new Error("Authentication failed: No token received")
      }
      
      // Use consistent token storage
      const authToken = response.token || response.access_token
      
      // Store authentication data with standardized keys
      localStorage.setItem(STORAGE_KEYS.AUTHENTICATED, "true")
      localStorage.setItem(STORAGE_KEYS.TOKEN, authToken)
      
      // Handle user data consistently
      const userData = response.user || { email, name: "User" }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
      
      // Update state
      setUser(userData)
      setIsAuthenticated(true)
      
      console.log("Login successful:", { user: userData, hasToken: !!authToken })
      return { success: true, user: userData }
    } catch (error) {
      console.error("Login failed:", error)
      // Clear any existing auth data on failed login
      clearAuthData()
      setUser(null)
      setIsAuthenticated(false)
      return { success: false, error: error.message || "Login failed" }
    }
  }

  const logout = () => {
    try {
      console.log("Logging out...")
      
      // Clear authentication data
      clearAuthData()
      
      // Update state
      setUser(null)
      setIsAuthenticated(false)
      
      // Clear auth API state
      if (authAPI.logout) {
        authAPI.logout()
      }
      
      console.log("Logout successful")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  // Refresh auth state (useful for debugging or manual refresh)
  const refreshAuth = () => {
    initializeAuth()
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    refreshAuth
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
