// Mock data service for student management system
// This simulates a real backend API with pagination and search

const MOCK_DELAY = parseInt(import.meta.env.VITE_MOCK_API_DELAY) || 1000


// Sample student data - Empty for demonstration
const mockStudents = []

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))


// Search function
function searchStudents(students, searchTerm) {
  if (!searchTerm) return students
  
  const term = searchTerm.toLowerCase()
  return students.filter(student => {
    const fullName = (student.fullName || "").toLowerCase()
    const email = (student.email || "").toLowerCase()
    const course = (student.course || "").toLowerCase()
    const phoneNumber = (student.phoneNumber || "").toLowerCase()
    
    return fullName.includes(term) || 
           email.includes(term) || 
           course.includes(term) || 
           phoneNumber.includes(term)
  })
}

// Main mock API functions
export const mockStudentsAPI = {
  getAll: async (params = {}) => {
    await delay(MOCK_DELAY)
    
    const page = parseInt(params.page) || 1
    const limit = parseInt(params.limit) || 10
    const search = params.search || ""
    
    // Filter students based on search term
    let filteredStudents = searchStudents(mockStudents, search)
    
    // Calculate pagination
    const total = filteredStudents.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const data = filteredStudents.slice(startIndex, endIndex)
    
    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  },

  getById: async (id) => {
    await delay(MOCK_DELAY)
    
    const student = mockStudents.find(s => s.id === parseInt(id))
    if (!student) {
      throw new Error(`Student with id ${id} not found`)
    }
    
    return { student }
  },


  create: async (studentData) => {
    await delay(MOCK_DELAY)
    
    // Validate required fields based on DTO
    const { fullName, email, phoneNumber, course, enrollmentDate } = studentData
    
    if (!fullName || !email || !phoneNumber || !course || !enrollmentDate) {
      throw new Error("Missing required fields: fullName, email, phoneNumber, course, enrollmentDate")
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format")
    }
    
    // Phone number validation (10-15 characters)
    if (phoneNumber.length < 10 || phoneNumber.length > 15) {
      throw new Error("Phone number must be between 10 and 15 characters")
    }
    
    const newStudent = {
      id: Math.max(...mockStudents.map(s => s.id), 0) + 1,
      fullName,
      email,
      phoneNumber,
      course,
      enrollmentDate,
      status: studentData.status || "Active",
      address: studentData.address || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockStudents.push(newStudent)
    
    return {
      message: "Student created successfully",
      student: newStudent
    }
  },


  update: async (id, studentData) => {
    await delay(MOCK_DELAY)
    
    const index = mockStudents.findIndex(s => s.id === parseInt(id))
    if (index === -1) {
      throw new Error(`Student with id ${id} not found`)
    }
    
    // Validate required fields if provided
    if (studentData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(studentData.email)) {
        throw new Error("Invalid email format")
      }
    }
    
    if (studentData.phoneNumber && (studentData.phoneNumber.length < 10 || studentData.phoneNumber.length > 15)) {
      throw new Error("Phone number must be between 10 and 15 characters")
    }
    
    const updatedStudent = {
      ...mockStudents[index],
      ...studentData,
      updatedAt: new Date().toISOString()
    }
    
    mockStudents[index] = updatedStudent
    
    return {
      message: "Student updated successfully",
      student: updatedStudent
    }
  },

  delete: async (id) => {
    await delay(MOCK_DELAY)
    
    const index = mockStudents.findIndex(s => s.id === parseInt(id))
    if (index === -1) {
      throw new Error(`Student with id ${id} not found`)
    }
    
    mockStudents.splice(index, 1)
    
    return {
      message: "Student deleted successfully"
    }
  }
}

// Mock auth API
export const mockAuthAPI = {


  login: async (email, password) => {
    await delay(MOCK_DELAY)
    
    // Demo authentication - accept any credentials with min 6 char password
    if (email && password && password.length >= 6) {
      const userName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
      
      return {
        token: "mock-jwt-token-12345",
        access_token: "mock-jwt-token-12345",
        user: {
          id: 1,
          email: email,
          name: userName || "Admin User",
          role: "admin"
        }
      }
    }
    
    throw new Error("Invalid credentials. Password must be at least 6 characters.")
  },
  
  logout: () => {
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("auth_token")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user_data")
  }
}

export default {
  students: mockStudentsAPI,
  auth: mockAuthAPI
}
