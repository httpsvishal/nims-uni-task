
// API configuration and helper functions
// Backend API base URL - must be set in environment variables



const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001'

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL environment variable is not set. Please configure your backend URL.")
}

export const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt_token", token)
  }
}

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token")
  }
  return null
}

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token")
  }
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (!API_BASE_URL) {

    throw new Error("Backend API URL is not configured. Please set VITE_API_BASE_URL environment variable.")
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type")
    const isJson = contentType && contentType.includes("application/json")

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      
      if (isJson) {
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
        } catch {
          // If JSON parsing fails, use default message
        }
      } else {
        // Try to get text response
        try {
          const text = await response.text()
          if (text) errorMessage = text
        } catch {
          // Use default message
        }
      }

      // Handle specific status codes
      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        removeToken()
        if (typeof window !== "undefined") {
          localStorage.removeItem("isAuthenticated")
          window.location.href = "/login"
        }
      }

      const error = new Error(errorMessage)
      ;(error as any).status = response.status
      throw error
    }

    // Handle empty responses
    if (response.status === 204 || !isJson) {
      return null
    }

    return await response.json()
  } catch (error: any) {
    // Handle network errors
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Network error. Please check your connection and try again.")
    }
    // Re-throw other errors
    throw error
  }
}

export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    if (data.token) {
      setToken(data.token)
    }
    return data
  },

  logout: () => {
    removeToken()
  },
}

export const studentsAPI = {
  // Get all students with pagination and search
  getAll: async (
    params: {
      page?: number
      limit?: number
      search?: string
      status?: string
      sort?: string
      order?: "asc" | "desc"
    } = {},
  ) => {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append("page", params.page.toString())
    if (params.limit) queryParams.append("limit", params.limit.toString())
    if (params.search) queryParams.append("search", params.search)
    if (params.status) queryParams.append("status", params.status)
    if (params.sort) queryParams.append("sort", params.sort)
    if (params.order) queryParams.append("order", params.order)

    const query = queryParams.toString()
    return apiRequest(`/students${query ? `?${query}` : ""}`)
  },

  // Get student by ID
  getById: async (id: string) => {
    return apiRequest(`/students/${id}`)
  },

  // Create new student
  create: async (studentData: any) => {
    return apiRequest("/students", {
      method: "POST",
      body: JSON.stringify(studentData),
    })
  },

  // Update student
  update: async (id: string, studentData: any) => {
    return apiRequest(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(studentData),
    })
  },

  // Delete student
  delete: async (id: string) => {
    return apiRequest(`/students/${id}`, {
      method: "DELETE",
    })
  },
}
