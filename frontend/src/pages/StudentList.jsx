
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import Layout from "../components/Layout"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Modal from "../components/ui/Modal"
import { Card, CardContent, CardHeader } from "../components/ui/Card"
import { studentsAPI } from "../lib/api"

export default function StudentList() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, studentId: null })
  const studentsPerPage = 10
  const navigate = useNavigate()

  useEffect(() => {
    loadStudents()
  }, [currentPage, searchTerm])


  const loadStudents = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: studentsPerPage,
      }
      
      if (searchTerm.trim()) {
        params.search = searchTerm.trim()
      }

      console.log("Loading students with params:", params)
      const response = await studentsAPI.getAll(params)
      
      // Handle different response formats
      let studentsData = []
      let totalPages = 1
      let totalRecords = 0
      
      if (Array.isArray(response)) {
        // Direct array response
        studentsData = response
        totalRecords = response.length
        totalPages = Math.ceil(response.length / studentsPerPage)
      } else if (response && typeof response === 'object') {
        // Object response with pagination
        studentsData = response.data || response.students || response.results || []
        totalPages = response.totalPages || response.pages || 1
        totalRecords = response.total || response.count || studentsData.length
      }
      
      console.log("API Response:", { studentsData, totalPages, totalRecords })
      
      setStudents(studentsData)
      setTotalPages(totalPages)
      setTotalRecords(totalRecords)
    } catch (error) {
      toast.error(error.message || "Failed to load students")
      console.error("Error loading students:", error)
      setStudents([])
      setTotalPages(1)
      setTotalRecords(0)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await studentsAPI.delete(id)
      toast.success("Student deleted successfully")
      setDeleteModal({ isOpen: false, studentId: null })
      loadStudents() // Reload the list
    } catch (error) {
      toast.error(error.message || "Failed to delete student")
      console.error("Error deleting student:", error)
    }
  }


  // Format student name for display
  const getStudentName = (student) => {
    return student.fullName || student.name || "N/A"
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-1">Manage student records and information</p>
          </div>
          <Link to="/students/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>

        <Card>

          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, email, or course..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setCurrentPage(1)
                      loadStudents()
                    }
                  }}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => {
                  setCurrentPage(1)
                  loadStudents()
                }}
                disabled={loading}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setCurrentPage(1)
                    setTimeout(() => loadStudents(), 100)
                  }}
                  className="gap-2"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
                <p className="mt-4 text-muted-foreground">Loading students...</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phone</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Course</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-sm font-medium text-foreground">{getStudentName(student)}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{student.email}</td>

                          <td className="py-3 px-4 text-sm text-muted-foreground">{student.phoneNumber || student.phone}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{student.course}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                student.status === "Active"
                                  ? "bg-accent/10 text-accent"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {student.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/students/edit/${student.id}`)}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteModal({ isOpen: true, studentId: student.id })}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * studentsPerPage) + 1} to {Math.min(currentPage * studentsPerPage, totalRecords)} of{" "}
                      {totalRecords} students
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, studentId: null })}
        title="Delete Student"
      >
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete this student? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, studentId: null })}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => handleDelete(deleteModal.studentId)}>
            Delete
          </Button>
        </div>
      </Modal>
    </Layout>
  )
}
