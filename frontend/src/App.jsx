import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"

import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import StudentList from "./pages/StudentList"
import StudentForm from "./pages/StudentForm"
import Reports from "./pages/Reports"

// ---------- Private Route ----------

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}


// ---------- Public Route ----------
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

// ---------- App ----------
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected */}
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

            {/* Default */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>

        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
