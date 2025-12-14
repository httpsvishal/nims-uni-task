
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import StudentList from "./pages/StudentList"
import StudentForm from "./pages/StudentForm"
import Reports from "./pages/Reports"

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  console.log("PrivateRoute - isAuthenticated:", isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/students"
              element={
                <PrivateRoute>
                  <StudentList />
                </PrivateRoute>
              }
            />
            <Route
              path="/students/new"
              element={
                <PrivateRoute>
                  <StudentForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/students/edit/:id"
              element={
                <PrivateRoute>
                  <StudentForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
