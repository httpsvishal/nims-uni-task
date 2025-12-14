
import axios from "axios"
import { mockStudentsAPI, mockAuthAPI } from "./mockData"


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'

// Only use mock data when explicitly enabled
if (USE_MOCK_DATA) {
  console.log("Using mock data mode")
} else if (!API_BASE_URL) {
  console.warn("VITE_API_BASE_URL environment variable is not set. API calls will return empty data.")
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token") || localStorage.getItem("auth_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = "Network error. Please check your connection and try again."
      return Promise.reject(error)
    }

    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response.status === 401) {
      localStorage.removeItem("jwt_token")
      localStorage.removeItem("auth_token")
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("user_data")
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    // Extract error message from response
    const errorMessage = error.response?.data?.message || error.message || "An error occurred"
    error.message = errorMessage
    return Promise.reject(error)
  }
)



export const authAPI = {
  login: async (email, password) => {
    if (USE_MOCK_DATA) {
      return await mockAuthAPI.login(email, password)
    }
    
    if (!API_BASE_URL) {
      // Return empty response when no backend is configured
      throw new Error("Backend API not configured. Please set VITE_API_BASE_URL environment variable.")
    }
    
    const response = await api.post("/auth/login", { email, password })
    const { token, access_token, user } = response.data
    
    // Store token (handle both token and access_token)
    const authToken = token || access_token
    if (authToken) {
      localStorage.setItem("jwt_token", authToken)
      localStorage.setItem("auth_token", authToken) // Also store as auth_token for compatibility
      localStorage.setItem("isAuthenticated", "true")
      if (user) {
        localStorage.setItem("user_data", JSON.stringify(user))
      }
    }
    
    return response.data
  },
  logout: () => {
    if (USE_MOCK_DATA) {
      mockAuthAPI.logout()
    } else {
      localStorage.removeItem("jwt_token")
      localStorage.removeItem("auth_token")
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("user_data")
    }
  },
}




export const studentsAPI = {
  getAll: async (params = {}) => {
    if (USE_MOCK_DATA) {
      return await mockStudentsAPI.getAll(params)
    }
    
    if (!API_BASE_URL) {
      // Return empty response when no backend is configured
      return {
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    }
    
    // Use exact API pattern: /students?page=1&limit=5&search=Computer
    const queryParams = new URLSearchParams()
    
    // Add pagination params
    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    
    // Add search param
    if (params.search) queryParams.append('search', params.search)
    
    const url = `/students?${queryParams.toString()}`
    const response = await api.get(url)
    return response.data
  },
  getById: async (id) => {
    if (USE_MOCK_DATA) {
      return await mockStudentsAPI.getById(id)
    }
    
    if (!API_BASE_URL) {
      throw new Error("Backend API not configured. Please set VITE_API_BASE_URL environment variable.")
    }
    
    const response = await api.get(`/students/${id}`)
    return response.data.student || response.data
  },
  create: async (data) => {
    if (USE_MOCK_DATA) {
      return await mockStudentsAPI.create(data)
    }
    
    if (!API_BASE_URL) {
      throw new Error("Backend API not configured. Please set VITE_API_BASE_URL environment variable.")
    }
    
    const response = await api.post("/students", data)
    return response.data
  },
  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      return await mockStudentsAPI.update(id, data)
    }
    
    if (!API_BASE_URL) {
      throw new Error("Backend API not configured. Please set VITE_API_BASE_URL environment variable.")
    }
    
    const response = await api.put(`/students/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    if (USE_MOCK_DATA) {
      return await mockStudentsAPI.delete(id)
    }
    
    if (!API_BASE_URL) {
      throw new Error("Backend API not configured. Please set VITE_API_BASE_URL environment variable.")
    }
    
    const response = await api.delete(`/students/${id}`)
    return response.data
  },
}

export default api
