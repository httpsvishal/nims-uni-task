
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Layout from "../components/Layout"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Label from "../components/ui/Label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { studentsAPI } from "../lib/api"

export default function StudentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    course: "",
    enrollmentDate: "",
    status: "Active",
    address: "",
  })
  const [errors, setErrors] = useState({})


  useEffect(() => {
    if (isEdit && id) {
      loadStudent()
    }
  }, [id, isEdit])


  const loadStudent = async () => {
    setLoading(true)
    try {
      const data = await studentsAPI.getById(id)
      const student = data.student || data
      
      // Map the student data to DTO format
      setFormData({
        fullName: student.fullName || "",
        email: student.email || "",
        phoneNumber: student.phoneNumber || student.phone || "",
        course: student.course || "",
        enrollmentDate: student.enrollmentDate || student.dateOfBirth || "",
        status: student.status || "Active",
        address: student.address || "",
      })
    } catch (error) {
      toast.error(error.message || "Failed to load student")
      console.error("Error loading student:", error)
      navigate("/students")
    } finally {
      setLoading(false)
    }
  }


  const validateForm = () => {
    const newErrors = {}

    // fullName validation - required, string
    if (!formData.fullName || formData.fullName.trim().length === 0) {
      newErrors.fullName = "Full name is required"
    }

    // email validation - required, valid email
    if (!formData.email || formData.email.trim().length === 0) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    // phoneNumber validation - required, string, 10-15 characters
    if (!formData.phoneNumber || formData.phoneNumber.trim().length === 0) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (formData.phoneNumber.length < 10 || formData.phoneNumber.length > 15) {
      newErrors.phoneNumber = "Phone number must be between 10 and 15 characters"
    }

    // course validation - required, string
    if (!formData.course || formData.course.trim().length === 0) {
      newErrors.course = "Course is required"
    }

    // enrollmentDate validation - required, valid date
    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required"
    } else {
      const date = new Date(formData.enrollmentDate)
      if (isNaN(date.getTime())) {
        newErrors.enrollmentDate = "Valid enrollment date is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setLoading(true)

    try {
      if (isEdit) {
        await studentsAPI.update(id, formData)
        toast.success("Student updated successfully")
      } else {
        await studentsAPI.create(formData)
        toast.success("Student created successfully")
      }
      navigate("/students")
    } catch (error) {
      toast.error(error.message || (isEdit ? "Failed to update student" : "Failed to create student"))
      console.error("Error saving student:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate("/students")} className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{isEdit ? "Edit Student" : "Add New Student"}</h1>
          <p className="text-muted-foreground mt-1">
            {isEdit ? "Update student information" : "Enter student details below"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>Fill in all required fields marked with an asterisk (*)</CardDescription>
          </CardHeader>
          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="1234567890"
                  />
                  {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">
                    Course <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a course</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Law">Law</option>
                    <option value="Arts">Arts</option>
                  </select>
                  {errors.course && <p className="text-sm text-destructive">{errors.course}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollmentDate">
                    Enrollment Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="enrollmentDate"
                    name="enrollmentDate"
                    type="date"
                    value={formData.enrollmentDate}
                    onChange={handleChange}
                  />
                  {errors.enrollmentDate && <p className="text-sm text-destructive">{errors.enrollmentDate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address (optional)"
                  rows={3}
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate("/students")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update Student" : "Create Student"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
