
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Moon, Sun, LogOut, Users, LayoutDashboard, GraduationCap } from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import Button from "./ui/Button"

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme()
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground">NIMS University</span>
                  <span className="text-xs text-muted-foreground">Student Management</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                <Link to="/dashboard">
                  <Button variant={isActive("/dashboard") ? "default" : "ghost"} size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/students">
                  <Button
                    variant={isActive("/students") || location.pathname.startsWith("/students") ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Students
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-muted-foreground mr-2">{user?.email}</span>

              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
